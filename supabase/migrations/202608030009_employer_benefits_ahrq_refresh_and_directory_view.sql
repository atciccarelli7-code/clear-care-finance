create or replace function private.refresh_ahrq_employer_benefits_universe()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  source_csv constant text := 'https://www.ahrq.gov/sites/default/files/wysiwyg/chsp/compendium/chsp-compendium-2023-rev.csv';
  response_status integer;
  response_content text;
  csv_line text;
  fields text[];
  imported_count integer := 0;
begin
  perform extensions.http_set_curlopt(
    'CURLOPT_USERAGENT',
    'Mozilla/5.0 (compatible; CommunityAcquiredFinance/1.0; +https://communityacquiredfinance.com)'
  );

  select status, content
    into response_status, response_content
  from extensions.http_get(source_csv);

  if response_status <> 200 or response_content is null then
    raise exception 'AHRQ health-system import failed with HTTP status %', response_status;
  end if;

  for csv_line in
    select trim(trailing E'\r' from line)
    from regexp_split_to_table(response_content, E'\n') with ordinality as parsed(line, line_number)
    where line_number > 1 and line <> ''
  loop
    fields := private.csv_line_to_array(csv_line);
    if array_length(fields, 1) <> 40 or nullif(fields[1], '') is null or nullif(fields[2], '') is null then
      continue;
    end if;

    insert into public.employer_benefits_system_universe (
      ahrq_system_id,
      system_name,
      home_city,
      home_state,
      registry_source,
      registry_vintage,
      source_url,
      total_physicians,
      hospital_count,
      acute_hospital_count,
      staffed_beds,
      multistate,
      ownership,
      imported_at,
      last_seen_at
    )
    values (
      fields[1],
      fields[2],
      nullif(fields[3], ''),
      nullif(fields[4], ''),
      'AHRQ Compendium of U.S. Health Systems',
      2023,
      source_csv,
      case when fields[9] ~ '^\d+$' then fields[9]::integer end,
      case when fields[15] ~ '^\d+$' then fields[15]::integer end,
      case when fields[16] ~ '^\d+$' then fields[16]::integer end,
      case when fields[22] ~ '^\d+(\.\d+)?$' then fields[22]::numeric end,
      case
        when lower(fields[21]) in ('1', 'true', 'yes') then true
        when lower(fields[21]) in ('0', 'false', 'no') then false
        else null
      end,
      nullif(fields[38], ''),
      now(),
      now()
    )
    on conflict (ahrq_system_id) do update set
      system_name = excluded.system_name,
      home_city = excluded.home_city,
      home_state = excluded.home_state,
      registry_source = excluded.registry_source,
      registry_vintage = excluded.registry_vintage,
      source_url = excluded.source_url,
      total_physicians = excluded.total_physicians,
      hospital_count = excluded.hospital_count,
      acute_hospital_count = excluded.acute_hospital_count,
      staffed_beds = excluded.staffed_beds,
      multistate = excluded.multistate,
      ownership = excluded.ownership,
      imported_at = now(),
      last_seen_at = now();

    imported_count := imported_count + 1;
  end loop;

  perform private.reconcile_employer_benefits_discovered_sources();
  return imported_count;
end;
$$;

revoke all on function private.refresh_ahrq_employer_benefits_universe() from public, anon, authenticated;
grant execute on function private.refresh_ahrq_employer_benefits_universe() to service_role;

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
  min(e.slug) as matched_employer_slug,
  count(d.id)::integer as discovered_source_count,
  count(d.id) filter (
    where d.source_status in ('verified_public_pdf', 'verified_public_webpage')
      and coalesce(d.plan_year_end, d.plan_year_start, 0) >= 2026
  )::integer as current_public_source_count,
  max(coalesce(d.plan_year_end, d.plan_year_start)) as best_plan_year,
  case
    when bool_or(d.source_status = 'verified_public_pdf') then 'verified_public_pdf'
    when bool_or(d.source_status = 'verified_public_webpage') then 'verified_public_webpage'
    when bool_or(d.source_status = 'private_employee_portal') then 'private_employee_portal'
    when bool_or(d.source_status = 'outdated_only') then 'outdated_only'
    else 'research_pending'
  end as coverage_status
from public.employer_benefits_system_universe u
left join public.employer_benefits_discovered_sources d
  on d.ahrq_system_id = u.ahrq_system_id
left join public.employer_benefits_employers e
  on e.id = coalesce(d.employer_id, u.employer_id)
group by
  u.ahrq_system_id,
  u.system_name,
  u.home_city,
  u.home_state,
  u.registry_vintage,
  u.total_physicians,
  u.hospital_count,
  u.acute_hospital_count,
  u.staffed_beds,
  u.multistate;

comment on view public.employer_benefits_directory is
  'Public-safe directory metadata. The application reads this only through a server endpoint; source URLs and unreviewed benefit facts are intentionally excluded.';

revoke all on table public.employer_benefits_directory from public, anon, authenticated, service_role;
grant select on table public.employer_benefits_directory to service_role;
