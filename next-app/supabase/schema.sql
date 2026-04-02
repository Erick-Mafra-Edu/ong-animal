create table if not exists public.swipe_profiles (
  id text primary key,
  name text not null,
  age integer not null check (age >= 0),
  location text not null,
  image_url text not null,
  bio text not null,
  traits text[] not null default '{}',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.swipe_profiles
  add column if not exists id text,
  add column if not exists name text,
  add column if not exists age integer,
  add column if not exists location text,
  add column if not exists image_url text,
  add column if not exists bio text,
  add column if not exists traits text[] default '{}',
  add column if not exists is_active boolean default true,
  add column if not exists sort_order integer default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

create index if not exists swipe_profiles_active_sort_idx
  on public.swipe_profiles (is_active, sort_order, created_at desc);

alter table public.swipe_profiles enable row level security;

drop policy if exists "Public can read active swipe profiles" on public.swipe_profiles;
create policy "Public can read active swipe profiles"
  on public.swipe_profiles
  for select
  using (is_active = true);
