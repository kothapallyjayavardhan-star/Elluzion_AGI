begin;
create table public.elluzion_website_inquiries (
  id uuid primary key,
  created_at timestamptz not null default now(),
  track text not null check (track in ('Offline retailer','Online / D2C brand','Investor')),
  full_name text not null check (char_length(btrim(full_name)) between 1 and 100),
  email text not null check (char_length(email) <= 180 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  business text not null check (char_length(btrim(business)) between 1 and 180),
  message text not null check (char_length(btrim(message)) between 1 and 1500),
  contact_requested boolean not null check (contact_requested = true),
  source text not null default 'elluzion-website',
  status text not null default 'new' check (status in ('new','contacted','closed'))
);
alter table public.elluzion_website_inquiries enable row level security;
revoke all on public.elluzion_website_inquiries from public, anon, authenticated;
grant insert (id, track, full_name, email, business, message, contact_requested)
  on public.elluzion_website_inquiries to anon;
create policy "Public may submit an inquiry only"
  on public.elluzion_website_inquiries for insert to anon
  with check (contact_requested = true and source = 'elluzion-website' and status = 'new');
-- No SELECT, UPDATE, or DELETE privileges/policies for visitors.
-- Review leads through the project's authorized Supabase dashboard.
create index elluzion_website_inquiries_created_at_idx on public.elluzion_website_inquiries (created_at desc);
comment on table public.elluzion_website_inquiries is 'Elluzion website contact requests; no public read access.';
commit;
