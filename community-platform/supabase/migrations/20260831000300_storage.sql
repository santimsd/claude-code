-- ============================================================
-- Storage: privé bucket "photos" + policies
--
-- Bestanden worden geüpload onder pad: <user_id>/<bestandsnaam>
-- De bucket is NIET publiek; de app toont foto's via signed URLs
-- met korte geldigheid.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photos',
  'photos',
  false,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public             = false,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Alleen ingelogde, actieve leden lezen (nodig voor signed URLs
-- die server-side namens de gebruiker worden aangemaakt).
create policy "photos_storage_select_members"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'photos' and public.is_active_member());

-- Uploaden: alleen actieve leden, uitsluitend in hun eigen map
-- (eerste padsegment = eigen user id).
create policy "photos_storage_insert_own_folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and public.is_active_member()
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- Verwijderen: eigenaar (eigen map) of admin.
create policy "photos_storage_delete_own_or_admin"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and (
      ((storage.foldername(name))[1] = (select auth.uid())::text
        and public.is_active_member())
      or public.is_admin()
    )
  );

-- Bewust geen update-policy: bestanden worden nooit overschreven,
-- alleen toegevoegd of verwijderd.
