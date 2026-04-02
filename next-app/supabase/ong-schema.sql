-- ONG Animals management schema
-- This schema extends the existing swipe_profiles table with ONG management capabilities.
-- The swipe_profiles table is already defined in schema.sql and is used as the animals table.
--
-- To apply: run this file against your Supabase project SQL editor after schema.sql.

-- Add ong_id column to link a profile to its managing ONG (optional, for multi-ONG support)
alter table if exists public.swipe_profiles
  add column if not exists ong_id uuid references auth.users(id) on delete set null;

-- ong_matches: tracks adoption interest from adopters
create table if not exists public.ong_matches (
  id uuid primary key default gen_random_uuid(),
  profile_id text not null references public.swipe_profiles(id) on delete cascade,
  adopter_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'aguardando' check (status in ('aguardando', 'aprovado', 'recusado')),
  created_at timestamptz not null default now()
);

create index if not exists ong_matches_profile_status_idx
  on public.ong_matches (profile_id, status);

alter table public.ong_matches enable row level security;

drop policy if exists "ONG can read their matches" on public.ong_matches;
create policy "ONG can read their matches"
  on public.ong_matches
  for select
  using (
    exists (
      select 1 from public.swipe_profiles sp
      where sp.id = profile_id and sp.ong_id = auth.uid()
    )
  );

drop policy if exists "ONG can update their matches" on public.ong_matches;
create policy "ONG can update their matches"
  on public.ong_matches
  for update
  using (
    exists (
      select 1 from public.swipe_profiles sp
      where sp.id = profile_id and sp.ong_id = auth.uid()
    )
  );

drop policy if exists "Adopters can insert matches" on public.ong_matches;
create policy "Adopters can insert matches"
  on public.ong_matches
  for insert
  with check (adopter_id = auth.uid());
