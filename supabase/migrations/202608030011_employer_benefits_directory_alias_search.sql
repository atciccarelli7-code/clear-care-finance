create or replace view public.employer_benefits_directory
with (security_invoker = true)
as
select
  u.ahrq_system_id as system_id,
  u.system_name,
  u.home_city,
  u.home_state,
  u.registry_vintage,
  u.total_physicians,
  u.hospital_count,
  u.acute_hospital_count,
  u.staffed_beds,
  u.multistate,
  e.slug as matched_employer_slug,
  coalesce(s.discovered_source_count, 0)::integer as discovered_source_count,
  coalesce(s.current_public_source_count, 0)::integer as current_public_source_count,
  s.best_plan_year,
  case
    when coalesce(s.has_verified_public_pdf, false) then 'verified_public_pdf'
    when coalesce(s.has_verified_public_webpage, false) then 'verified_public_webpage'
    when coalesce(s.has_private_employee_portal, false) then 'private_employee_portal'
    when coalesce(s.has_outdated_only, false) then 'outdated_only'
    else 'research_pending'
  end as coverage_status,
  trim(concat_ws(' ', u.system_name, a.search_terms)) as search_terms
from public.employer_benefits_system_universe u
left join lateral (
  select
    count(*)::integer as discovered_source_count,
    count(*) filter (
      where d.source_status in ('verified_public_pdf', 'verified_public_webpage')
        and coalesce(d.plan_year_end, d.plan_year_start, 0) >= 2026
    )::integer as current_public_source_count,
    max(coalesce(d.plan_year_end, d.plan_year_start)) as best_plan_year,
    bool_or(d.source_status = 'verified_public_pdf') as has_verified_public_pdf,
    bool_or(d.source_status = 'verified_public_webpage') as has_verified_public_webpage,
    bool_or(d.source_status = 'private_employee_portal') as has_private_employee_portal,
    bool_or(d.source_status = 'outdated_only') as has_outdated_only,
    min(d.employer_id::text)::uuid as employer_id
  from public.employer_benefits_discovered_sources d
  where d.ahrq_system_id = u.ahrq_system_id
) s on true
left join lateral (
  select string_agg(alias_name, ' ' order by alias_name) as search_terms
  from public.employer_benefits_system_aliases alias_record
  where alias_record.ahrq_system_id = u.ahrq_system_id
) a on true
left join public.employer_benefits_employers e
  on e.id = coalesce(u.employer_id, s.employer_id);

comment on view public.employer_benefits_directory is
  'Public-safe directory metadata and alias search terms. The application reads this only through a server endpoint; source URLs and unreviewed benefit facts are intentionally excluded.';

revoke all on table public.employer_benefits_directory from public, anon, authenticated, service_role;
grant select on table public.employer_benefits_directory to service_role;
