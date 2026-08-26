-- CMS documents for the Smart Squad Travels admin panel.
-- For a first production deploy, prefer supabase/production.sql (CMS + enquiries + photos).

create table if not exists public.cms_documents (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.cms_documents enable row level security;

-- Reads and writes happen from the Next.js server with SUPABASE_SERVICE_ROLE_KEY.
-- Do not expose that key to the browser.
