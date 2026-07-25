begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.is_premium_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.premium_admins
    where user_id = (select auth.uid())
  );
$$;

revoke execute on function private.is_premium_admin() from public, anon, authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (
  (select auth.uid()) is not null
  and (
    user_id = (select auth.uid())
    or (select private.is_premium_admin())
  )
);

drop policy if exists "entitlements_select_own" on public.entitlements;
create policy "entitlements_select_own"
on public.entitlements for select
to authenticated
using (
  (select auth.uid()) is not null
  and (
    user_id = (select auth.uid())
    or (select private.is_premium_admin())
  )
);

drop policy if exists "workspaces_select_own_entitled" on public.workspaces;
create policy "workspaces_select_own_entitled"
on public.workspaces for select
to authenticated
using (
  (
    (select auth.uid()) is not null
    and user_id = (select auth.uid())
    and exists (
      select 1
      from public.entitlements e
      where e.user_id = (select auth.uid())
        and e.product_key = workspaces.product_key
        and e.status in ('active', 'test')
        and (e.expires_at is null or e.expires_at > now())
    )
  )
  or (select private.is_premium_admin())
);

create policy "products_service_only_deny"
on public.products for all
to anon, authenticated
using (false)
with check (false);

create policy "stripe_events_service_only_deny"
on public.stripe_events for all
to anon, authenticated
using (false)
with check (false);

create policy "premium_modules_service_only_deny"
on public.premium_modules for all
to anon, authenticated
using (false)
with check (false);

create policy "premium_admins_service_only_deny"
on public.premium_admins for all
to anon, authenticated
using (false)
with check (false);

create index if not exists entitlements_product_key_idx
  on public.entitlements (product_key);

create index if not exists workspaces_product_key_idx
  on public.workspaces (product_key);

create index if not exists premium_admins_created_by_idx
  on public.premium_admins (created_by)
  where created_by is not null;

drop function if exists public.is_premium_admin();

commit;
