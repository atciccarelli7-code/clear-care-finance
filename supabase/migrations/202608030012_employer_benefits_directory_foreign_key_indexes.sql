create index if not exists employer_benefits_system_universe_employer_idx
  on public.employer_benefits_system_universe (employer_id);

create index if not exists employer_benefits_discovered_sources_employer_idx
  on public.employer_benefits_discovered_sources (employer_id);

create index if not exists employer_benefits_system_aliases_employer_idx
  on public.employer_benefits_system_aliases (employer_id);
