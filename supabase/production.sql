-- Run this once in the Supabase SQL editor before the first Vercel deploy.
-- It creates CMS documents, the enquiry inbox, and the public photo bucket.

-- CMS documents for /sstadmin (destinations, blog, site, fleet, etc.)
create table if not exists public.cms_documents (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cms_documents enable row level security;

-- Enquiry inbox for website form submissions
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  phone text not null,
  email text,
  travel_date date,
  return_date date,
  pickup_location text not null,
  destination text not null,
  passengers integer,
  preferred_vehicle text,
  trip_type text,
  message text,
  source_page text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  status text not null default 'new',
  notes text not null default '',
  archived boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.enquiries add column if not exists status text not null default 'new';
alter table public.enquiries add column if not exists notes text not null default '';
alter table public.enquiries add column if not exists archived boolean not null default false;
alter table public.enquiries add column if not exists updated_at timestamptz not null default now();

alter table public.enquiries enable row level security;

-- Public photo uploads from the admin panel
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
