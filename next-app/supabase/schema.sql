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

-- ─── Chat: matches ────────────────────────────────────────────────────────────

create table if not exists public.chat_matches (
  id uuid primary key default gen_random_uuid(),
  profile_id text not null references public.swipe_profiles(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_matches_user_status_idx
  on public.chat_matches (user_id, status, created_at desc);

alter table public.chat_matches enable row level security;

drop policy if exists "Users can manage their own matches" on public.chat_matches;
create policy "Users can manage their own matches"
  on public.chat_matches
  for all
  using (auth.uid() = user_id);

-- ─── Chat: messages ───────────────────────────────────────────────────────────

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.chat_matches(id) on delete cascade,
  sender_id uuid not null,
  content text not null check (char_length(content) > 0),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_match_created_idx
  on public.chat_messages (match_id, created_at asc);

alter table public.chat_messages enable row level security;

drop policy if exists "Match participants can read messages" on public.chat_messages;
create policy "Match participants can read messages"
  on public.chat_messages
  for select
  using (
    exists (
      select 1 from public.chat_matches
      where chat_matches.id = chat_messages.match_id
        and chat_matches.user_id = auth.uid()
        and chat_matches.status = 'approved'
    )
  );

drop policy if exists "Match participants can send messages" on public.chat_messages;
create policy "Match participants can send messages"
  on public.chat_messages
  for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.chat_matches
      where chat_matches.id = chat_messages.match_id
        and chat_matches.status = 'approved'
        and chat_matches.user_id = auth.uid()
    )
  );

