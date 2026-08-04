begin;

alter table public.employer_benefits_discovered_sources
  add column if not exists use_scope text not null default 'link_only',
  add column if not exists rights_review_status text not null default 'not_reviewed',
  add column if not exists terms_url text,
  add column if not exists rights_reviewed_at timestamptz,
  add column if not exists rights_review_note text;

alter table public.employer_benefits_sources
  add column if not exists use_scope text not null default 'link_only',
  add column if not exists rights_review_status text not null default 'not_reviewed',
  add column if not exists terms_url text,
  add column if not exists rights_reviewed_at timestamptz,
  add column if not exists rights_review_note text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_discovered_use_scope_check') then
    alter table public.employer_benefits_discovered_sources
      add constraint employer_benefits_discovered_use_scope_check
      check (use_scope in ('link_only', 'metadata_and_facts', 'permissioned_copy', 'blocked'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_discovered_rights_review_check') then
    alter table public.employer_benefits_discovered_sources
      add constraint employer_benefits_discovered_rights_review_check
      check (rights_review_status in ('not_reviewed', 'linking_reviewed', 'fact_use_reviewed', 'permission_confirmed', 'blocked'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_discovered_terms_url_check') then
    alter table public.employer_benefits_discovered_sources
      add constraint employer_benefits_discovered_terms_url_check
      check (terms_url is null or (terms_url ~ '^https://[^[:space:]]+$' and char_length(terms_url) <= 2048));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_source_use_scope_check') then
    alter table public.employer_benefits_sources
      add constraint employer_benefits_source_use_scope_check
      check (use_scope in ('link_only', 'metadata_and_facts', 'permissioned_copy', 'blocked'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_source_rights_review_check') then
    alter table public.employer_benefits_sources
      add constraint employer_benefits_source_rights_review_check
      check (rights_review_status in ('not_reviewed', 'linking_reviewed', 'fact_use_reviewed', 'permission_confirmed', 'blocked'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'employer_benefits_source_terms_url_check') then
    alter table public.employer_benefits_sources
      add constraint employer_benefits_source_terms_url_check
      check (terms_url is null or (terms_url ~ '^https://[^[:space:]]+$' and char_length(terms_url) <= 2048));
  end if;
end $$;

comment on column public.employer_benefits_discovered_sources.use_scope is
  'Permitted CAF product use. link_only permits organization/source metadata and an outbound link, but not document hosting, reproduction, or automatic fact prefill.';
comment on column public.employer_benefits_discovered_sources.rights_review_status is
  'Separate review of source terms, copyright, trademark, and permitted use. Source verification alone does not establish reuse rights.';
comment on column public.employer_benefits_sources.use_scope is
  'Permitted CAF product use. Automatic facts require metadata_and_facts or permissioned_copy plus the applicable source and fact review gates.';
comment on column public.employer_benefits_sources.rights_review_status is
  'Separate review of source terms, copyright, trademark, and permitted use. Source verification alone does not establish reuse rights.';

create index if not exists employer_benefits_discovered_use_review_idx
  on public.employer_benefits_discovered_sources (use_scope, rights_review_status, verification_status, updated_at desc);
create index if not exists employer_benefits_sources_use_review_idx
  on public.employer_benefits_sources (use_scope, rights_review_status, review_status, updated_at desc);

commit;
