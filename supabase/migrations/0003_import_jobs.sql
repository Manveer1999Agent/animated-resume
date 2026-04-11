create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.accounts (id) on delete cascade,
  portfolio_id uuid not null references public.portfolios (id) on delete cascade,
  draft_id uuid references public.portfolio_drafts (id) on delete set null,
  source_type text not null check (source_type in ('resume', 'linkedin-basic', 'manual')),
  status text not null check (status in ('queued', 'processing', 'succeeded', 'failed')),
  confidence_summary jsonb not null default '{}'::jsonb,
  section_states jsonb not null default '{}'::jsonb,
  section_warnings jsonb not null default '[]'::jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists import_jobs_account_created_idx
  on public.import_jobs (account_id, created_at desc);

alter table public.import_jobs enable row level security;

drop policy if exists import_jobs_member_access on public.import_jobs;
create policy import_jobs_member_access
on public.import_jobs
for all
using (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = import_jobs.account_id
      and m.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.account_memberships m
    where m.account_id = import_jobs.account_id
      and m.profile_id = auth.uid()
      and m.role = 'owner'
  )
);
