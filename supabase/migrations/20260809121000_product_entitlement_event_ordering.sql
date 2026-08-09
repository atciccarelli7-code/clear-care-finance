-- Preserve product-specific Stripe mode and event ordering on entitlement
-- transitions. All columns are additive and nullable for safe rollout before
-- any external test or live commerce activation.

alter table public.entitlements
  add column if not exists stripe_livemode boolean,
  add column if not exists last_stripe_event_created_at bigint,
  add column if not exists last_stripe_event_id text;
