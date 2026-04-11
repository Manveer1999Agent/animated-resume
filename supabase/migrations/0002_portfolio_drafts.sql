create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  slug text not null default 'default',
  name text not null default 'Primary Portfolio',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, slug)
);

create table if not exists public.portfolio_drafts (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null unique references public.portfolios (id) on delete cascade,
  schema_version text not null default '1.0',
  draft_payload jsonb not null,
  source_type text not null check (source_type in ('resume', 'linkedin-basic', 'manual')),
  source_confidence numeric(5,4) not null default 0 check (source_confidence >= 0 and source_confidence <= 1),
  completion_score integer not null default 0 check (completion_score >= 0 and completion_score <= 100),
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_section_states (
  draft_id uuid not null references public.portfolio_drafts (id) on delete cascade,
  section_key text not null check (
    section_key in ('hero', 'about', 'experience', 'projects', 'education', 'skills', 'contact')
  ),
  confidence_score numeric(5,4) not null default 0 check (confidence_score >= 0 and confidence_score <= 1),
  field_confidence jsonb not null default '{}'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  verified boolean not null default false,
  last_verified_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (draft_id, section_key)
);

alter table public.portfolios enable row level security;
alter table public.portfolio_drafts enable row level security;
alter table public.portfolio_section_states enable row level security;

drop policy if exists portfolios_member_access on public.portfolios;
create policy portfolios_member_access
on public.portfolios
for all
using (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = portfolios.account_id
      and m.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = portfolios.account_id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
);

drop policy if exists portfolio_drafts_member_access on public.portfolio_drafts;
create policy portfolio_drafts_member_access
on public.portfolio_drafts
for all
using (
  exists (
    select 1
    from public.portfolios p
    join public.account_memberships m on m.account_id = p.account_id
    where p.id = portfolio_drafts.portfolio_id
      and m.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.portfolios p
    join public.account_memberships m on m.account_id = p.account_id
    where p.id = portfolio_drafts.portfolio_id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
);

drop policy if exists portfolio_section_states_member_access on public.portfolio_section_states;
create policy portfolio_section_states_member_access
on public.portfolio_section_states
for all
using (
  exists (
    select 1
    from public.portfolio_drafts d
    join public.portfolios p on p.id = d.portfolio_id
    join public.account_memberships m on m.account_id = p.account_id
    where d.id = portfolio_section_states.draft_id
      and m.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.portfolio_drafts d
    join public.portfolios p on p.id = d.portfolio_id
    join public.account_memberships m on m.account_id = p.account_id
    where d.id = portfolio_section_states.draft_id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
);
