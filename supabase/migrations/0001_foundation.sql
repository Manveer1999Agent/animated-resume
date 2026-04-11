create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  account_type text not null default 'personal' check (account_type in ('personal', 'team')),
  bootstrap_creator_profile_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists accounts_unique_personal_bootstrap_idx
  on public.accounts (bootstrap_creator_profile_id)
  where account_type = 'personal' and bootstrap_creator_profile_id is not null;

create table if not exists public.account_memberships (
  account_id uuid not null references public.accounts (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (account_id, profile_id)
);

create or replace function public.handle_auth_user_bootstrap()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  personal_account_id uuid;
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  select a.id
  into personal_account_id
  from public.accounts a
  where a.bootstrap_creator_profile_id = new.id
    and a.account_type = 'personal'
  limit 1;

  if personal_account_id is null then
    insert into public.accounts (name, account_type, bootstrap_creator_profile_id)
    values (coalesce(split_part(new.email, '@', 1), 'user') || ' Personal', 'personal', new.id)
    returning id into personal_account_id;
  end if;

  insert into public.account_memberships (account_id, profile_id, role)
  values (personal_account_id, new.id, 'owner')
  on conflict (account_id, profile_id) do update
    set role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_auth_user_bootstrap();

alter table public.profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.account_memberships enable row level security;

drop policy if exists profiles_self_access on public.profiles;
create policy profiles_self_access
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists accounts_member_access on public.accounts;
create policy accounts_member_access
on public.accounts
for all
using (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = accounts.id
      and m.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = accounts.id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
);

drop policy if exists account_memberships_member_access on public.account_memberships;
create policy account_memberships_member_access
on public.account_memberships
for select
using (
  profile_id = auth.uid()
  or exists (
    select 1
    from public.account_memberships own
    where own.account_id = account_memberships.account_id
      and own.profile_id = auth.uid()
      and own.role = 'owner'
  )
);
