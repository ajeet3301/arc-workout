-- ============================================================
-- Arc — database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  created_at timestamptz default now()
);

create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  icon text default 'ti-circle',
  frequency text default 'daily' check (frequency in ('daily', 'weekly', 'custom')),
  target_days int[],
  archived boolean default false,
  created_at timestamptz default now()
);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  completed_on date not null,
  created_at timestamptz default now(),
  unique (habit_id, completed_on)
);

create table if not exists coach_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- Auto-create a profile row whenever a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row level security — every table is scoped to its owner
-- ============================================================
alter table profiles enable row level security;
alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table coach_messages enable row level security;

create policy "Users manage their own profile" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their own habits" on habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own habit logs" on habit_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own coach messages" on coach_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- RPC: current streak for a given habit (consecutive days up to today)
-- ============================================================
create or replace function public.habit_streak(p_habit_id uuid)
returns int as $$
declare
  streak int := 0;
  check_date date := current_date;
begin
  loop
    if exists (
      select 1 from habit_logs
      where habit_id = p_habit_id and completed_on = check_date
    ) then
      streak := streak + 1;
      check_date := check_date - 1;
    else
      exit;
    end if;
  end loop;
  return streak;
end;
$$ language plpgsql stable;
