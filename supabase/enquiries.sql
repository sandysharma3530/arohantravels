-- Enquiry storage for the Smart Squad Travels admin inbox.
-- For a first production deploy, prefer supabase/production.sql (CMS + enquiries + photos).

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

-- Service role reads/writes from the Next.js API route.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY to the browser.
