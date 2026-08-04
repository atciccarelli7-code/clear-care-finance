create or replace function public.search_employer_benefits_directory(
  search_query text,
  result_limit integer default 25
)
returns table (
  system_id text,
  system_name text,
  home_city text,
  home_state text,
  registry_vintage integer,
  hospital_count integer,
  staffed_beds numeric,
  matched_employer_slug text,
  discovered_source_count integer,
  current_public_source_count integer,
  best_plan_year integer,
  coverage_status text
)
language sql
stable
security definer
set search_path = ''
as $$
  with normalized as (
    select left(
      regexp_replace(
        trim(coalesce(search_query, '')),
        '[^a-zA-Z0-9 .&''()-]+',
        '',
        'g'
      ),
      80
    ) as value
  )
  select
    directory.system_id,
    directory.system_name,
    directory.home_city,
    directory.home_state,
    directory.registry_vintage,
    directory.hospital_count,
    directory.staffed_beds,
    directory.matched_employer_slug,
    directory.discovered_source_count,
    directory.current_public_source_count,
    directory.best_plan_year,
    directory.coverage_status
  from public.employer_benefits_directory directory
  cross join normalized
  where char_length(normalized.value) >= 2
    and directory.search_terms ilike ('%' || normalized.value || '%')
  order by
    directory.current_public_source_count desc,
    directory.hospital_count desc nulls last,
    directory.system_name asc
  limit least(greatest(coalesce(result_limit, 25), 1), 25);
$$;

comment on function public.search_employer_benefits_directory(text, integer) is
  'Service-role-only bounded search over public-safe employer directory fields. Source URLs, aliases, and benefit facts are not returned.';

revoke all on function public.search_employer_benefits_directory(text, integer) from public, anon, authenticated;
grant execute on function public.search_employer_benefits_directory(text, integer) to service_role;
