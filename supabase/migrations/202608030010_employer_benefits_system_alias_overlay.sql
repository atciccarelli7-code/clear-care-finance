create extension if not exists pg_trgm with schema extensions;

create table if not exists public.employer_benefits_system_aliases (
  alias_key text primary key,
  alias_name text not null,
  ahrq_system_id text not null references public.employer_benefits_system_universe(ahrq_system_id) on delete cascade,
  employer_id uuid references public.employer_benefits_employers(id) on delete set null,
  provenance text not null default 'manual_review',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employer_benefits_system_alias_key_check check (alias_key ~ '^[a-z0-9]+$'),
  constraint employer_benefits_system_alias_name_check check (char_length(alias_name) between 2 and 240),
  constraint employer_benefits_system_alias_provenance_check check (provenance in ('manual_review','official_rebrand','merger_mapping','subsidiary_mapping'))
);

alter table public.employer_benefits_system_aliases enable row level security;
alter table public.employer_benefits_system_aliases force row level security;
revoke all on table public.employer_benefits_system_aliases from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.employer_benefits_system_aliases to service_role;
create index if not exists employer_benefits_system_aliases_system_idx
  on public.employer_benefits_system_aliases (ahrq_system_id);

insert into public.employer_benefits_system_aliases (
  alias_key,
  alias_name,
  ahrq_system_id,
  employer_id,
  provenance,
  notes
)
values
  (private.normalize_employer_name('Ascension'), 'Ascension', 'HSI00000055', null, 'official_rebrand', 'AHRQ 2023 canonical name is Ascension Health.'),
  (private.normalize_employer_name('Cedars-Sinai'), 'Cedars-Sinai', 'HSI00000190', null, 'manual_review', 'AHRQ canonical name is Cedars Sinai Health System.'),
  (private.normalize_employer_name('Froedtert Health'), 'Froedtert Health', 'HSI00000386', null, 'official_rebrand', 'AHRQ canonical name includes the Medical College of Wisconsin.'),
  (private.normalize_employer_name('Froedtert & MCW'), 'Froedtert & MCW', 'HSI00000386', null, 'official_rebrand', 'Current joint brand alias.'),
  (private.normalize_employer_name('Inova Health'), 'Inova Health', 'HSI00000513', null, 'manual_review', 'AHRQ canonical name is Inova Health System.'),
  (private.normalize_employer_name('Johns Hopkins Medicine (Intrastaff)'), 'Johns Hopkins Medicine (Intrastaff)', 'HSI00000531', null, 'subsidiary_mapping', 'Intrastaff source is workforce-specific and remains separately scoped.'),
  (private.normalize_employer_name('Johns Hopkins'), 'Johns Hopkins', 'HSI00000531', null, 'manual_review', 'Parent brand alias for Johns Hopkins Health System.'),
  (private.normalize_employer_name('Mayo Clinic'), 'Mayo Clinic', 'HSI00000631', null, 'manual_review', 'AHRQ canonical name is Mayo Clinic Health System.'),
  (private.normalize_employer_name('MUSC Health'), 'MUSC Health', 'HSI00000644', null, 'official_rebrand', 'AHRQ canonical name is Medical University of South Carolina Medical Center.'),
  (private.normalize_employer_name('Medical University of South Carolina'), 'Medical University of South Carolina', 'HSI00000644', null, 'manual_review', 'Parent organization alias.'),
  (private.normalize_employer_name('NewYork-Presbyterian (Columbia GME program)'), 'NewYork-Presbyterian (Columbia GME program)', 'HSI00000731', null, 'subsidiary_mapping', 'Program-specific source; not a system-wide workforce guide.'),
  (private.normalize_employer_name('NewYork-Presbyterian'), 'NewYork-Presbyterian', 'HSI00000731', null, 'manual_review', 'AHRQ canonical name is New York Presbyterian Healthcare System.'),
  (private.normalize_employer_name('Ochsner Health'), 'Ochsner Health', 'HSI00000780', null, 'official_rebrand', 'AHRQ canonical name is Ochsner Health System.'),
  (private.normalize_employer_name('St. Charles Health System'), 'St. Charles Health System', 'HSI00000912', null, 'manual_review', 'AHRQ spells Saint Charles in full.'),
  (private.normalize_employer_name('UF Health Jacksonville'), 'UF Health Jacksonville', 'HSI00001121', null, 'subsidiary_mapping', 'Regional source mapped to the UF Health system while preserving audience scope.'),
  (private.normalize_employer_name('University of Florida Health'), 'University of Florida Health', 'HSI00001121', null, 'manual_review', 'Parent organization alias for UF Health.'),
  (private.normalize_employer_name('UNC Health'), 'UNC Health', 'HSI00001123', (select id from public.employer_benefits_employers where slug='unc-health'), 'official_rebrand', 'AHRQ canonical name is UNC Health Care System.'),
  (private.normalize_employer_name('UNC Health Southeastern'), 'UNC Health Southeastern', 'HSI00001123', (select id from public.employer_benefits_employers where slug='unc-health'), 'subsidiary_mapping', 'Regional affiliate source; population scope must remain explicit.'),
  (private.normalize_employer_name('Vanderbilt University Medical Center'), 'Vanderbilt University Medical Center', 'HSI00001222', null, 'official_rebrand', 'AHRQ canonical name is Vanderbilt Health.'),
  (private.normalize_employer_name('VUMC'), 'VUMC', 'HSI00001222', null, 'manual_review', 'Common abbreviation.')
on conflict (alias_key) do update set
  alias_name = excluded.alias_name,
  ahrq_system_id = excluded.ahrq_system_id,
  employer_id = excluded.employer_id,
  provenance = excluded.provenance,
  notes = excluded.notes,
  updated_at = now();

create or replace function private.reconcile_employer_benefits_discovered_sources()
returns void
language plpgsql
set search_path = ''
as $$
begin
  update public.employer_benefits_system_universe u
  set employer_id = e.id
  from public.employer_benefits_employers e
  where u.employer_id is null
    and (
      private.normalize_employer_name(u.system_name) = private.normalize_employer_name(e.name)
      or exists (
        select 1
        from unnest(e.aliases) alias_name
        where private.normalize_employer_name(u.system_name) = private.normalize_employer_name(alias_name)
      )
    );

  update public.employer_benefits_system_universe u
  set employer_id = a.employer_id
  from public.employer_benefits_system_aliases a
  where a.ahrq_system_id = u.ahrq_system_id
    and a.employer_id is not null
    and u.employer_id is null;

  update public.employer_benefits_discovered_sources d
  set ahrq_system_id = u.ahrq_system_id,
      updated_at = now()
  from public.employer_benefits_system_universe u
  where d.ahrq_system_id is null
    and private.normalize_employer_name(d.system_name) = private.normalize_employer_name(u.system_name);

  update public.employer_benefits_discovered_sources d
  set ahrq_system_id = a.ahrq_system_id,
      employer_id = coalesce(d.employer_id, a.employer_id),
      updated_at = now()
  from public.employer_benefits_system_aliases a
  where d.ahrq_system_id is null
    and (
      private.normalize_employer_name(d.system_name) = a.alias_key
      or private.normalize_employer_name(d.parent_organization) = a.alias_key
    );

  update public.employer_benefits_discovered_sources d
  set ahrq_system_id = u.ahrq_system_id,
      updated_at = now()
  from public.employer_benefits_system_universe u
  where d.ahrq_system_id is null
    and d.parent_organization is not null
    and private.normalize_employer_name(d.parent_organization) = private.normalize_employer_name(u.system_name);

  update public.employer_benefits_discovered_sources d
  set employer_id = u.employer_id,
      updated_at = now()
  from public.employer_benefits_system_universe u
  where d.ahrq_system_id = u.ahrq_system_id
    and d.employer_id is null
    and u.employer_id is not null;

  update public.employer_benefits_discovered_sources d
  set employer_id = e.id,
      updated_at = now()
  from public.employer_benefits_employers e
  where d.employer_id is null
    and private.normalize_employer_name(d.system_name) = private.normalize_employer_name(e.name);
end;
$$;

select private.reconcile_employer_benefits_discovered_sources();
