create extension if not exists http with schema extensions;

create table if not exists public.employer_benefits_system_universe (
  ahrq_system_id text primary key,
  system_name text not null,
  home_city text,
  home_state text,
  registry_source text not null default 'AHRQ Compendium of U.S. Health Systems',
  registry_vintage integer not null default 2023,
  source_url text not null default 'https://www.ahrq.gov/sites/default/files/wysiwyg/chsp/compendium/chsp-compendium-2023-rev.csv',
  total_physicians integer,
  hospital_count integer,
  acute_hospital_count integer,
  staffed_beds numeric,
  multistate boolean,
  ownership text,
  employer_id uuid references public.employer_benefits_employers(id) on delete set null,
  imported_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  constraint employer_benefits_system_universe_name_check check (char_length(system_name) between 2 and 240),
  constraint employer_benefits_system_universe_state_check check (home_state is null or char_length(home_state) between 2 and 40),
  constraint employer_benefits_system_universe_vintage_check check (registry_vintage between 2020 and 2035),
  constraint employer_benefits_system_universe_source_check check (source_url ~ '^https://[^[:space:]]+$'),
  constraint employer_benefits_system_universe_counts_check check (
    (total_physicians is null or total_physicians >= 0)
    and (hospital_count is null or hospital_count >= 0)
    and (acute_hospital_count is null or acute_hospital_count >= 0)
    and (staffed_beds is null or staffed_beds >= 0)
  )
);

create table if not exists public.employer_benefits_discovered_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  system_name text not null,
  parent_organization text,
  guide_title text not null,
  audience text not null,
  plan_year_label text not null,
  plan_year_start integer,
  plan_year_end integer,
  state_region text,
  source_url text not null,
  notes text,
  access_type text not null,
  document_type text not null,
  source_status text not null,
  verification_status text not null default 'unverified',
  ahrq_system_id text references public.employer_benefits_system_universe(ahrq_system_id) on delete set null,
  employer_id uuid references public.employer_benefits_employers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_discovered_source_key_check check (source_key ~ '^[0-9a-f]{64}$'),
  constraint employer_benefits_discovered_name_check check (char_length(system_name) between 2 and 240),
  constraint employer_benefits_discovered_title_check check (char_length(guide_title) between 2 and 300),
  constraint employer_benefits_discovered_url_check check (source_url ~ '^https?://[^[:space:]]+$' and char_length(source_url) <= 2048),
  constraint employer_benefits_discovered_year_check check (
    (plan_year_start is null or plan_year_start between 2000 and 2035)
    and (plan_year_end is null or plan_year_end between 2000 and 2035)
    and (plan_year_end is null or plan_year_start is null or plan_year_end >= plan_year_start)
  ),
  constraint employer_benefits_discovered_access_check check (access_type in ('public_pdf', 'public_webpage', 'private_portal', 'unknown')),
  constraint employer_benefits_discovered_type_check check (document_type in ('full_guide', 'enrollment_summary', 'spd', 'rate_sheet', 'supplemental', 'interactive', 'other')),
  constraint employer_benefits_discovered_status_check check (source_status in ('research_pending','verified_public_pdf','verified_public_webpage','private_employee_portal','outdated_only','no_public_source_found','needs_employee_upload')),
  constraint employer_benefits_discovered_verification_check check (verification_status in ('unverified','source_verified','extracted','reviewed','product_ready'))
);

comment on table public.employer_benefits_system_universe is
  'National health-system discovery universe sourced from the fixed 2023 AHRQ Compendium. Presence does not imply a current public benefits guide or product-ready facts.';
comment on table public.employer_benefits_discovered_sources is
  'Research-layer benefits sources. These records may be current, outdated, interactive, or private and must not drive guidance until converted into reviewed package sources and verified facts.';

alter table public.employer_benefits_system_universe enable row level security;
alter table public.employer_benefits_system_universe force row level security;
alter table public.employer_benefits_discovered_sources enable row level security;
alter table public.employer_benefits_discovered_sources force row level security;

revoke all on table public.employer_benefits_system_universe from public, anon, authenticated, service_role;
revoke all on table public.employer_benefits_discovered_sources from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.employer_benefits_system_universe to service_role;
grant select, insert, update, delete on table public.employer_benefits_discovered_sources to service_role;

create index if not exists employer_benefits_system_universe_name_idx
  on public.employer_benefits_system_universe (lower(system_name));
create index if not exists employer_benefits_system_universe_state_idx
  on public.employer_benefits_system_universe (home_state, system_name);
create index if not exists employer_benefits_discovered_system_idx
  on public.employer_benefits_discovered_sources (ahrq_system_id, source_status, plan_year_end desc);
create index if not exists employer_benefits_discovered_name_idx
  on public.employer_benefits_discovered_sources (lower(system_name));
create index if not exists employer_benefits_discovered_status_idx
  on public.employer_benefits_discovered_sources (source_status, verification_status, plan_year_end desc);
