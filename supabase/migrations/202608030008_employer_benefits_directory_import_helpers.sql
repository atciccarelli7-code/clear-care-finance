create or replace function private.normalize_employer_name(value text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select regexp_replace(lower(coalesce(value, '')), '[^a-z0-9]+', '', 'g');
$$;

create or replace function private.csv_line_to_array(line text)
returns text[]
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  result text[] := array[]::text[];
  field text := '';
  i integer := 1;
  ch text;
  in_quotes boolean := false;
begin
  while i <= char_length(line) loop
    ch := substr(line, i, 1);
    if ch = '"' then
      if in_quotes and i < char_length(line) and substr(line, i + 1, 1) = '"' then
        field := field || '"';
        i := i + 1;
      else
        in_quotes := not in_quotes;
      end if;
    elsif ch = ',' and not in_quotes then
      result := array_append(result, field);
      field := '';
    else
      field := field || ch;
    end if;
    i := i + 1;
  end loop;
  result := array_append(result, field);
  return result;
end;
$$;

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

  update public.employer_benefits_discovered_sources d
  set ahrq_system_id = u.ahrq_system_id,
      updated_at = now()
  from public.employer_benefits_system_universe u
  where d.ahrq_system_id is null
    and private.normalize_employer_name(d.system_name) = private.normalize_employer_name(u.system_name);

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

revoke all on function private.normalize_employer_name(text) from public;
revoke all on function private.csv_line_to_array(text) from public;
revoke all on function private.reconcile_employer_benefits_discovered_sources() from public, anon, authenticated;
