create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  guests int not null default 1,
  attendance text not null check (attendance in ('yes','maybe','no')),
  message text
);
create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null check (char_length(name) between 2 and 40),
  message text not null check (char_length(message) between 3 and 160),
  approved boolean not null default false
);
alter table public.rsvps enable row level security;
alter table public.wishes enable row level security;
create policy "anyone can rsvp" on public.rsvps for insert to anon with check (true);
create policy "anyone can submit wish unapproved" on public.wishes for insert to anon with check (approved = false);
create policy "public reads approved wishes" on public.wishes for select to anon using (approved = true);
-- Moderate: Table Editor → wishes → set approved = true. View RSVPs in Table Editor (not publicly readable).
