begin;

create table if not exists public.employer_benefits_employers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  aliases text[] not null default '{}',
  regions text[] not null default '{}',
  status text not null default 'research',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_employer_slug_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 2 and 100),
  constraint employer_benefits_employer_name_check
    check (char_length(name) between 2 and 160),
  constraint employer_benefits_employer_status_check
    check (status in ('research', 'active', 'retired'))
);

create table if not exists public.employer_benefits_packages (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employer_benefits_employers(id) on delete cascade,
  plan_year integer not null,
  population_label text not null,
  status text not null default 'candidate',
  effective_start date,
  effective_end date,
  source_completeness_percent integer not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_package_year_check
    check (plan_year between 2024 and 2035),
  constraint employer_benefits_package_population_check
    check (char_length(population_label) between 2 and 200),
  constraint employer_benefits_package_status_check
    check (status in ('candidate', 'source_collection', 'review', 'published', 'retired')),
  constraint employer_benefits_package_completeness_check
    check (source_completeness_percent between 0 and 100),
  constraint employer_benefits_package_dates_check
    check (effective_end is null or effective_start is null or effective_end >= effective_start),
  unique (employer_id, plan_year, population_label)
);

create table if not exists public.employer_benefits_sources (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.employer_benefits_packages(id) on delete cascade,
  document_type text not null,
  title text not null,
  source_url text not null,
  official_domain text not null,
  review_status text not null default 'official_source_located',
  retrieved_at date not null,
  effective_start date,
  effective_end date,
  content_hash text,
  page_count integer,
  review_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_source_document_type_check
    check (document_type in (
      'benefits_guide',
      'medical_sbc',
      'employee_rate_sheet',
      'retirement_summary',
      'annual_change_notice',
      'formulary',
      'provider_network',
      'other'
    )),
  constraint employer_benefits_source_title_check
    check (char_length(title) between 2 and 240),
  constraint employer_benefits_source_url_check
    check (source_url ~ '^https://[^[:space:]]+$' and char_length(source_url) <= 2048),
  constraint employer_benefits_source_domain_check
    check (official_domain ~ '^[a-z0-9.-]+$' and char_length(official_domain) between 3 and 253),
  constraint employer_benefits_source_review_status_check
    check (review_status in (
      'official_source_located',
      'metadata_reviewed',
      'facts_extracted',
      'verified_for_guidance',
      'rejected',
      'superseded'
    )),
  constraint employer_benefits_source_hash_check
    check (content_hash is null or content_hash ~ '^[0-9a-f]{64}$'),
  constraint employer_benefits_source_page_count_check
    check (page_count is null or page_count between 1 and 5000),
  constraint employer_benefits_source_dates_check
    check (effective_end is null or effective_start is null or effective_end >= effective_start),
  unique (package_id, source_url)
);

create table if not exists public.employer_benefits_facts (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.employer_benefits_packages(id) on delete cascade,
  source_id uuid references public.employer_benefits_sources(id) on delete restrict,
  category text not null,
  fact_key text not null,
  value jsonb not null,
  unit text,
  source_page integer,
  confidence text not null default 'candidate',
  review_status text not null default 'candidate',
  reviewer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_fact_category_check
    check (category in (
      'eligibility',
      'medical',
      'pharmacy',
      'spending_account',
      'retirement',
      'disability',
      'life_insurance',
      'leave',
      'education',
      'voluntary_benefit',
      'deadline',
      'other'
    )),
  constraint employer_benefits_fact_key_check
    check (fact_key ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$' and char_length(fact_key) between 2 and 160),
  constraint employer_benefits_fact_value_check
    check (jsonb_typeof(value) in ('object', 'array', 'string', 'number', 'boolean')),
  constraint employer_benefits_fact_source_page_check
    check (source_page is null or source_page between 1 and 5000),
  constraint employer_benefits_fact_confidence_check
    check (confidence in ('candidate', 'low', 'medium', 'high')),
  constraint employer_benefits_fact_review_status_check
    check (review_status in ('candidate', 'reviewed', 'verified', 'rejected', 'superseded')),
  unique (package_id, fact_key)
);

create table if not exists public.employer_benefits_source_submissions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  submission_hash text not null,
  employer_name text not null,
  plan_year integer not null,
  employee_population text,
  source_url text,
  source_host text,
  status text not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_submission_hash_check
    check (submission_hash ~ '^[0-9a-f]{64}$'),
  constraint employer_benefits_submission_employer_check
    check (char_length(employer_name) between 2 and 160),
  constraint employer_benefits_submission_year_check
    check (plan_year between 2024 and 2035),
  constraint employer_benefits_submission_population_check
    check (employee_population is null or char_length(employee_population) between 2 and 160),
  constraint employer_benefits_submission_url_check
    check (source_url is null or (source_url ~ '^https://[^[:space:]]+$' and char_length(source_url) <= 2048)),
  constraint employer_benefits_submission_host_check
    check (source_host is null or (source_host ~ '^[a-z0-9.-]+$' and char_length(source_host) between 3 and 253)),
  constraint employer_benefits_submission_status_check
    check (status in ('pending', 'accepted', 'duplicate', 'rejected', 'converted')),
  constraint employer_benefits_submission_source_pair_check
    check ((source_url is null and source_host is null) or (source_url is not null and source_host is not null)),
  unique (session_id, submission_hash)
);

comment on table public.employer_benefits_employers is
  'Canonical employer entities used to organize employer-specific benefits research. No employee personal data.';
comment on table public.employer_benefits_packages is
  'Plan-year and employee-population-specific benefits packages. A package is not publishable until its source and review gates are complete.';
comment on table public.employer_benefits_sources is
  'Official employer, insurer, administrator, or government source documents with review provenance and optional content hashes.';
comment on table public.employer_benefits_facts is
  'Normalized employer-benefit facts tied to a plan package and, when available, a source page. Candidate facts must not drive guidance.';
comment on table public.employer_benefits_source_submissions is
  'Privacy-bounded public leads for an employer or official public source URL. Never stores credentials, member IDs, claims, medical information, account data, uploaded files, or free-form notes.';

alter table public.employer_benefits_employers enable row level security;
alter table public.employer_benefits_employers force row level security;
alter table public.employer_benefits_packages enable row level security;
alter table public.employer_benefits_packages force row level security;
alter table public.employer_benefits_sources enable row level security;
alter table public.employer_benefits_sources force row level security;
alter table public.employer_benefits_facts enable row level security;
alter table public.employer_benefits_facts force row level security;
alter table public.employer_benefits_source_submissions enable row level security;
alter table public.employer_benefits_source_submissions force row level security;

revoke all on table public.employer_benefits_employers from public, anon, authenticated, service_role;
revoke all on table public.employer_benefits_packages from public, anon, authenticated, service_role;
revoke all on table public.employer_benefits_sources from public, anon, authenticated, service_role;
revoke all on table public.employer_benefits_facts from public, anon, authenticated, service_role;
revoke all on table public.employer_benefits_source_submissions from public, anon, authenticated, service_role;

grant select, insert, update, delete on table public.employer_benefits_employers to service_role;
grant select, insert, update, delete on table public.employer_benefits_packages to service_role;
grant select, insert, update, delete on table public.employer_benefits_sources to service_role;
grant select, insert, update, delete on table public.employer_benefits_facts to service_role;
grant select, insert, update, delete on table public.employer_benefits_source_submissions to service_role;

create index if not exists employer_benefits_packages_lookup_idx
  on public.employer_benefits_packages (employer_id, plan_year desc, status);
create index if not exists employer_benefits_sources_review_idx
  on public.employer_benefits_sources (package_id, document_type, review_status);
create index if not exists employer_benefits_facts_review_idx
  on public.employer_benefits_facts (package_id, category, review_status);
create index if not exists employer_benefits_submissions_review_idx
  on public.employer_benefits_source_submissions (status, created_at desc);

insert into public.employer_benefits_employers (slug, name, aliases, regions, status)
values
  ('novant-health', 'Novant Health', array['Novant', 'Novant Health Presbyterian Medical Center'], array['North Carolina'], 'research'),
  ('atrium-health', 'Atrium Health', array['Atrium', 'Advocate Health - Atrium Health'], array['North Carolina', 'South Carolina'], 'research'),
  ('unc-health', 'UNC Health', array['UNC Healthcare', 'UNC Hospitals'], array['North Carolina'], 'research'),
  ('ecu-health', 'ECU Health', array['Vidant Health', 'ECU Health Medical Center'], array['North Carolina'], 'research'),
  ('northwell-health', 'Northwell Health', array['Northwell'], array['New York'], 'research')
on conflict (slug) do update set
  name = excluded.name,
  aliases = excluded.aliases,
  regions = excluded.regions,
  updated_at = now();

insert into public.employer_benefits_packages (employer_id, plan_year, population_label, status, source_completeness_percent)
select id, 2026, 'General benefits-eligible employees', 'source_collection', 0
from public.employer_benefits_employers where slug = 'novant-health'
on conflict (employer_id, plan_year, population_label) do nothing;

insert into public.employer_benefits_packages (employer_id, plan_year, population_label, status, source_completeness_percent)
select id, 2026, 'General benefits-eligible teammates', 'source_collection', 0
from public.employer_benefits_employers where slug = 'atrium-health'
on conflict (employer_id, plan_year, population_label) do nothing;

insert into public.employer_benefits_packages (employer_id, plan_year, population_label, status, source_completeness_percent)
select id, 2026, 'Triangle and Non-Triangle employees', 'source_collection', 20
from public.employer_benefits_employers where slug = 'unc-health'
on conflict (employer_id, plan_year, population_label) do nothing;

insert into public.employer_benefits_packages (employer_id, plan_year, population_label, status, source_completeness_percent)
select id, 2026, 'Benefits-eligible team members', 'source_collection', 20
from public.employer_benefits_employers where slug = 'ecu-health'
on conflict (employer_id, plan_year, population_label) do nothing;

insert into public.employer_benefits_packages (employer_id, plan_year, population_label, status, source_completeness_percent)
select id, 2026, 'Non-union employees', 'source_collection', 20
from public.employer_benefits_employers where slug = 'northwell-health'
on conflict (employer_id, plan_year, population_label) do nothing;

insert into public.employer_benefits_sources (
  package_id, document_type, title, source_url, official_domain, review_status, retrieved_at
)
select
  p.id,
  'benefits_guide',
  '2026 UNC Health Benefit Summary — Triangle & Non-Triangle',
  'https://jobs.unchealthcare.org/system/production/assets/515332/original/2026_UNC_Health_Benefit_Summary_Triangle___Non-Triangle.pdf',
  'unchealthcare.org',
  'official_source_located',
  date '2026-08-03'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'unc-health' and p.plan_year = 2026
on conflict (package_id, source_url) do nothing;

insert into public.employer_benefits_sources (
  package_id, document_type, title, source_url, official_domain, review_status, retrieved_at
)
select
  p.id,
  'benefits_guide',
  '2026 ECU Health Benefits Guide',
  'https://totalrewards.ecuhealth.org/wp-content/uploads/2025/09/2026_ECU_Health_8.5x11_Benefits_Guide_Team_LR.pdf',
  'ecuhealth.org',
  'official_source_located',
  date '2026-08-03'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'ecu-health' and p.plan_year = 2026
on conflict (package_id, source_url) do nothing;

insert into public.employer_benefits_sources (
  package_id, document_type, title, source_url, official_domain, review_status, retrieved_at
)
select
  p.id,
  'benefits_guide',
  '2026 Northwell Health Non-Union Benefits Guide',
  'https://www.northwell.edu/sites/northwell.edu/files/2026-03/2026-non-union-benefits-guide-final.pdf',
  'northwell.edu',
  'official_source_located',
  date '2026-08-03'
from public.employer_benefits_packages p
join public.employer_benefits_employers e on e.id = p.employer_id
where e.slug = 'northwell-health' and p.plan_year = 2026
on conflict (package_id, source_url) do nothing;

commit;
