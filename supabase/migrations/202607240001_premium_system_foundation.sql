begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  product_key text primary key,
  name text not null,
  status text not null check (status in ('private_build', 'test', 'active', 'paused', 'retired')),
  access_type text not null check (access_type in ('one_time', 'subscription', 'administrative_test')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null references public.products(product_key) on delete restrict,
  status text not null check (status in ('active', 'processing', 'refunded', 'revoked', 'expired', 'test')),
  access_type text not null check (access_type in ('one_time', 'subscription', 'administrative_test')),
  purchased_at timestamptz,
  expires_at timestamptz,
  stripe_customer_id text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_key)
);

create unique index if not exists entitlements_checkout_session_unique
  on public.entitlements (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create unique index if not exists entitlements_payment_intent_unique
  on public.entitlements (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_key text not null references public.products(product_key) on delete restrict,
  title text not null check (char_length(title) between 1 and 120),
  status text not null default 'active' check (status in ('active', 'completed', 'archived')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  state jsonb not null default '{"version":1,"activeModuleKey":"define-decision","completedModuleKeys":[],"answers":{},"assumptions":[],"finalDecision":""}'::jsonb
    check (jsonb_typeof(state) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_user_product_updated
  on public.workspaces (user_id, product_key, updated_at desc);

create table if not exists public.stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  processed_at timestamptz,
  processing_status text not null check (processing_status in ('processing', 'processed', 'ignored', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

-- Protected module definitions are populated separately from an ignored, owner-controlled seed file.
-- No substantive premium definitions are stored in this migration or the public application bundle.
create table if not exists public.premium_modules (
  product_key text not null references public.products(product_key) on delete cascade,
  module_key text not null,
  status text not null check (status in ('private_build', 'test', 'active', 'retired')),
  definition jsonb not null check (jsonb_typeof(definition) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (product_key, module_key, status)
);

create table if not exists public.premium_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

insert into public.products (product_key, name, status, access_type)
values (
  'healthcare-worker-benefits-decision-system',
  'Healthcare Worker Benefits Decision System',
  'private_build',
  'one_time'
)
on conflict (product_key) do update
set name = excluded.name,
    updated_at = now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists entitlements_set_updated_at on public.entitlements;
create trigger entitlements_set_updated_at before update on public.entitlements
for each row execute function public.set_updated_at();

drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at before update on public.workspaces
for each row execute function public.set_updated_at();

drop trigger if exists premium_modules_set_updated_at on public.premium_modules;
create trigger premium_modules_set_updated_at before update on public.premium_modules
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (user_id) do update
  set email = excluded.email,
      updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_premium_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.premium_admins
    where user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.entitlements enable row level security;
alter table public.workspaces enable row level security;
alter table public.stripe_events enable row level security;
alter table public.premium_modules enable row level security;
alter table public.premium_admins enable row level security;

alter table public.profiles force row level security;
alter table public.products force row level security;
alter table public.entitlements force row level security;
alter table public.workspaces force row level security;
alter table public.stripe_events force row level security;
alter table public.premium_modules force row level security;
alter table public.premium_admins force row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (user_id = auth.uid() or public.is_premium_admin());

drop policy if exists "entitlements_select_own" on public.entitlements;
create policy "entitlements_select_own"
on public.entitlements for select
to authenticated
using (user_id = auth.uid() or public.is_premium_admin());

drop policy if exists "workspaces_select_own_entitled" on public.workspaces;
create policy "workspaces_select_own_entitled"
on public.workspaces for select
to authenticated
using (
  (user_id = auth.uid() and exists (
    select 1
    from public.entitlements e
    where e.user_id = auth.uid()
      and e.product_key = workspaces.product_key
      and e.status in ('active', 'test')
      and (e.expires_at is null or e.expires_at > now())
  ))
  or public.is_premium_admin()
);

drop policy if exists "workspaces_insert_own_entitled" on public.workspaces;
create policy "workspaces_insert_own_entitled"
on public.workspaces for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.entitlements e
    where e.user_id = auth.uid()
      and e.product_key = workspaces.product_key
      and e.status in ('active', 'test')
      and (e.expires_at is null or e.expires_at > now())
  )
);

drop policy if exists "workspaces_update_own_entitled" on public.workspaces;
create policy "workspaces_update_own_entitled"
on public.workspaces for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.entitlements e
    where e.user_id = auth.uid()
      and e.product_key = workspaces.product_key
      and e.status in ('active', 'test')
      and (e.expires_at is null or e.expires_at > now())
  )
)
with check (user_id = auth.uid());

drop policy if exists "workspaces_delete_own_entitled" on public.workspaces;
create policy "workspaces_delete_own_entitled"
on public.workspaces for delete
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.entitlements e
    where e.user_id = auth.uid()
      and e.product_key = workspaces.product_key
      and e.status in ('active', 'test')
      and (e.expires_at is null or e.expires_at > now())
  )
);

-- No authenticated or anonymous policies are created for products, premium_modules,
-- stripe_events, or premium_admins. Trusted server-side service-role logic owns writes
-- to entitlements and Stripe events and owns all protected-content reads.
revoke all on public.profiles from anon, authenticated;
revoke all on public.products from anon, authenticated;
revoke all on public.entitlements from anon, authenticated;
revoke all on public.workspaces from anon, authenticated;
revoke all on public.stripe_events from anon, authenticated;
revoke all on public.premium_modules from anon, authenticated;
revoke all on public.premium_admins from anon, authenticated;

grant select on public.profiles to authenticated;
grant select on public.entitlements to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant execute on function public.is_premium_admin() to authenticated;

commit;
