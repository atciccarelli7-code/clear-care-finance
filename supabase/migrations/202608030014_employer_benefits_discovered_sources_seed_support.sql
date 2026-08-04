create unique index if not exists employer_benefits_discovered_sources_url_uidx
  on public.employer_benefits_discovered_sources (source_url);

create or replace function public.reconcile_employer_benefits_discovered_sources()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.reconcile_employer_benefits_discovered_sources();
end;
$$;

comment on function public.reconcile_employer_benefits_discovered_sources() is
  'Service-role-only wrapper used by the versioned discovery-source seed script.';

revoke all on function public.reconcile_employer_benefits_discovered_sources() from public, anon, authenticated;
grant execute on function public.reconcile_employer_benefits_discovered_sources() to service_role;
