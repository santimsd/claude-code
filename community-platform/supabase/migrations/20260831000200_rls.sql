-- ============================================================
-- Row Level Security: AAN op alle tabellen + policies
--
-- Uitgangspunten:
--  - Actieve leden lezen alles binnen de community.
--  - Iedereen bewerkt/verwijdert alleen eigen content.
--  - Admins mogen alles verwijderen.
--  - Alleen admins schrijven in events (en channels).
--  - Gedeactiveerde leden (is_active = false) vallen overal buiten:
--    is_active_member() en is_admin() geven dan false.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.messages enable row level security;
alter table public.events   enable row level security;
alter table public.photos   enable row level security;

-- ---------- profiles ----------
-- Leden zien alle profielen (voor namen bij berichten/foto's);
-- iedereen ziet altijd het eigen profiel (ook indien gedeactiveerd,
-- zodat de app dat kan tonen/afhandelen).
create policy "profiles_select_members"
  on public.profiles for select
  to authenticated
  using (public.is_active_member() or id = (select auth.uid()));

-- Eigen profiel bewerken (display_name); role/is_active zijn
-- beschermd door de trigger protect_profile_fields.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Admins bewerken elk profiel (rol wijzigen, deactiveren).
create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (true);

-- Geen insert-policy: profielen ontstaan via de SECURITY DEFINER-trigger
-- on_auth_user_created. Geen delete-policy: verwijderen loopt via
-- auth.users (cascade), alleen server-side/admin-API.

-- ---------- channels ----------
create policy "channels_select_members"
  on public.channels for select
  to authenticated
  using (public.is_active_member());

create policy "channels_insert_admin"
  on public.channels for insert
  to authenticated
  with check (public.is_admin());

create policy "channels_update_admin"
  on public.channels for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "channels_delete_admin"
  on public.channels for delete
  to authenticated
  using (public.is_admin());

-- ---------- messages ----------
create policy "messages_select_members"
  on public.messages for select
  to authenticated
  using (public.is_active_member());

create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  with check (user_id = (select auth.uid()) and public.is_active_member());

create policy "messages_update_own"
  on public.messages for update
  to authenticated
  using (user_id = (select auth.uid()) and public.is_active_member())
  with check (user_id = (select auth.uid()));

create policy "messages_delete_own_or_admin"
  on public.messages for delete
  to authenticated
  using (
    (user_id = (select auth.uid()) and public.is_active_member())
    or public.is_admin()
  );

-- ---------- events ----------
create policy "events_select_members"
  on public.events for select
  to authenticated
  using (public.is_active_member());

create policy "events_insert_admin"
  on public.events for insert
  to authenticated
  with check (public.is_admin());

create policy "events_update_admin"
  on public.events for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "events_delete_admin"
  on public.events for delete
  to authenticated
  using (public.is_admin());

-- ---------- photos ----------
create policy "photos_select_members"
  on public.photos for select
  to authenticated
  using (public.is_active_member());

create policy "photos_insert_own"
  on public.photos for insert
  to authenticated
  with check (user_id = (select auth.uid()) and public.is_active_member());

create policy "photos_update_own"
  on public.photos for update
  to authenticated
  using (user_id = (select auth.uid()) and public.is_active_member())
  with check (user_id = (select auth.uid()));

create policy "photos_delete_own_or_admin"
  on public.photos for delete
  to authenticated
  using (
    (user_id = (select auth.uid()) and public.is_active_member())
    or public.is_admin()
  );
