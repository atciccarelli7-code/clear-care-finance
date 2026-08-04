begin;

create index if not exists employer_benefits_facts_source_idx
  on public.employer_benefits_facts (source_id)
  where source_id is not null;

commit;
