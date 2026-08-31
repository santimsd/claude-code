-- ============================================================
-- Community-platform: basisschema
-- profiles, channels, messages, events, photos + helpers/triggers
-- ============================================================

-- ---------- profiles (gekoppeld aan auth.users) ----------
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role         text not null default 'member' check (role in ('admin', 'member')),
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Ledenprofielen; role en is_active zijn alleen door admins te wijzigen (zie trigger).';

-- ---------- channels (nu 1 kanaal, later meer) ----------
create table public.channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- messages ----------
create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index messages_channel_created_idx on public.messages (channel_id, created_at desc);

-- ---------- events (alleen admins schrijven) ----------
create table public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 200),
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  location    text not null default '',
  description text not null default '',
  url         text,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create index events_starts_at_idx on public.events (starts_at);

-- ---------- photos (bestanden staan in privé storage-bucket) ----------
create table public.photos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null unique,
  caption      text not null default '' check (char_length(caption) <= 500),
  created_at   timestamptz not null default now()
);

create index photos_created_at_idx on public.photos (created_at desc);

-- ============================================================
-- Helperfuncties voor RLS
-- SECURITY DEFINER zodat policies op profiles zelf geen
-- recursieve RLS-evaluatie veroorzaken.
-- ============================================================

create or replace function public.is_active_member()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin' and is_active
  );
$$;

-- ============================================================
-- Triggers
-- ============================================================

-- Automatisch een profiel aanmaken bij een nieuwe auth-gebruiker (invite).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Niet-admins mogen role/is_active niet wijzigen (ook niet via hun
-- eigen update-policy). auth.uid() is null bij service-role/SQL-editor:
-- die mag alles.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.is_active is distinct from old.is_active)
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Alleen admins mogen rol of actief-status wijzigen';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- updated_at bijhouden op events.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ============================================================
-- Seed: één algemeen kanaal
-- ============================================================

insert into public.channels (name) values ('algemeen')
on conflict (name) do nothing;

-- ============================================================
-- Realtime: messages publiceren (RLS geldt ook voor realtime)
-- ============================================================

alter publication supabase_realtime add table public.messages;
