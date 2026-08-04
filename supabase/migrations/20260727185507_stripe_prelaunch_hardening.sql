begin;

-- Preserve the most recent authoritative Stripe event applied to each entitlement.
-- Webhooks can be retried or delivered out of order; these fields let the service
-- reject a stale transition without storing complete Stripe payloads.
alter table public.entitlements
  add column last_stripe_event_created_at bigint,
  add column last_stripe_event_id text;

alter table public.entitlements
  add constraint entitlements_stripe_event_ordering_pair_check
  check (
    (last_stripe_event_created_at is null and last_stripe_event_id is null)
    or
    (last_stripe_event_created_at is not null and last_stripe_event_created_at >= 0 and last_stripe_event_id is not null)
  );

create index entitlements_last_stripe_event_idx
  on public.entitlements (last_stripe_event_created_at, last_stripe_event_id)
  where last_stripe_event_created_at is not null;

comment on column public.entitlements.last_stripe_event_created_at is
  'Stripe event created timestamp for the most recent authoritative entitlement transition.';
comment on column public.entitlements.last_stripe_event_id is
  'Stripe event ID paired with last_stripe_event_created_at for deterministic tie handling.';

commit;
