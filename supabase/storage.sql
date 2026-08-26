-- Public image bucket for admin photo uploads (destinations, fleet, gallery, blog, hero).
-- Run this in the Supabase SQL editor together with cms.sql and enquiries.sql,
-- or run supabase/production.sql once.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-uploads',
  'cms-uploads',
  true,
  12582912,
  array['image/webp', 'image/jpeg', 'image/png']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read cms uploads" on storage.objects;
create policy "Public read cms uploads"
on storage.objects
for select
to public
using (bucket_id = 'cms-uploads');
