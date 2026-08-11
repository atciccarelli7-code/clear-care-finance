-- CAF pre-commerce demand report
-- Run with service-role/operator access. Do not expose this query or its underlying tables to the browser.
-- "observed" means not explicitly marked as release verification; it does not prove organic provenance.

with offer_registry as (
  select * from (values
    ('healthcare-worker-benefits-decision-system', 'benefits_offer_29_v1', 2900, 'usd', 'unknown_legacy', 'benefits_offer_29_v1'),
    ('healthcare-worker-benefits-decision-system', 'benefits_workspace_29_v2', 2900, 'usd', 'observed', 'benefits_workspace_29_v2'),
    ('healthcare-worker-benefits-decision-system', 'benefits_workspace_29_v2', 2900, 'usd', 'release_verification', 'benefits_workspace_29_v2_release_verification')
  ) as t(product_key, offer_version, price_cents, currency, evidence_bucket, event_variant)
),
anonymous as (
  select
    variant,
    count(distinct session_id) filter (where event_name in ('benefits_offer_viewed', 'precommerce_offer_viewed')) as qualified_offer_views,
    count(distinct session_id) filter (where event_name in ('benefits_offer_cta_opened', 'precommerce_offer_engaged')) as offer_engagements,
    count(distinct session_id) filter (where event_name = 'precommerce_commitment_started') as commitment_starts,
    min(created_at) as first_anonymous_at,
    max(created_at) as last_anonymous_at
  from public.growth_events
  where variant in (
    'benefits_offer_29_v1',
    'benefits_workspace_29_v2',
    'benefits_workspace_29_v2_release_verification'
  )
  group by variant
),
commitments as (
  select
    offer_version,
    case when offer_version = 'benefits_offer_29_v1' then 'unknown_legacy' else evidence_class end as evidence_bucket,
    count(distinct email_hash) filter (where status = 'active' and price_commitment is true and email_consent is true) as valid_commitments,
    count(distinct email_hash) filter (where status = 'excluded') as excluded_commitments,
    count(distinct email_hash) filter (where status = 'unsubscribed') as unsubscribed_commitments,
    min(created_at) as first_commitment_at,
    max(created_at) as last_commitment_at
  from public.benefits_offer_commitments
  group by offer_version, case when offer_version = 'benefits_offer_29_v1' then 'unknown_legacy' else evidence_class end
),
benefits_lifecycle as (
  select
    count(distinct session_journey_id) filter (where event_name = 'journey_viewed') as product_views,
    count(distinct session_journey_id) filter (where event_name = 'journey_started') as product_starts,
    count(distinct session_journey_id) filter (where event_name = 'journey_result_reached') as product_results,
    min(created_at) as first_product_event_at,
    max(created_at) as last_product_event_at
  from public.journey_events
  where journey_key = 'benefits_decision_system'
    and variant = 'flagship_funnel_v1'
),
report as (
  select
    r.product_key,
    r.offer_version,
    r.price_cents,
    r.currency,
    r.evidence_bucket,
    coalesce(a.qualified_offer_views, 0) as qualified_offer_views,
    coalesce(a.offer_engagements, 0) as offer_engagements,
    coalesce(a.commitment_starts, 0) as commitment_starts,
    coalesce(c.valid_commitments, 0) as valid_price_qualified_commitments,
    coalesce(c.excluded_commitments, 0) as excluded_commitments,
    coalesce(c.unsubscribed_commitments, 0) as unsubscribed_commitments,
    l.product_views,
    l.product_starts,
    l.product_results,
    least(a.first_anonymous_at, c.first_commitment_at) as first_observed_at,
    greatest(a.last_anonymous_at, c.last_commitment_at) as last_observed_at
  from offer_registry r
  left join anonymous a on a.variant = r.event_variant
  left join commitments c on c.offer_version = r.offer_version and c.evidence_bucket = r.evidence_bucket
  cross join benefits_lifecycle l
)
select
  product_key,
  offer_version,
  price_cents,
  currency,
  evidence_bucket,
  case
    when qualified_offer_views + offer_engagements + commitment_starts + valid_price_qualified_commitments = 0 then 'No data'
    else 'Data present'
  end as evidence_status,
  qualified_offer_views,
  offer_engagements,
  commitment_starts,
  valid_price_qualified_commitments,
  excluded_commitments,
  unsubscribed_commitments,
  round(offer_engagements::numeric / nullif(qualified_offer_views, 0), 4) as offer_engagement_rate,
  round(commitment_starts::numeric / nullif(qualified_offer_views, 0), 4) as commitment_start_rate,
  round(valid_price_qualified_commitments::numeric / nullif(qualified_offer_views, 0), 4) as price_qualified_commitment_rate,
  round(valid_price_qualified_commitments::numeric / nullif(commitment_starts, 0), 4) as commitment_completion_rate,
  product_views,
  product_starts,
  product_results,
  round(product_results::numeric / nullif(product_starts, 0), 4) as product_result_rate,
  first_observed_at,
  last_observed_at,
  case evidence_bucket
    when 'observed' then 'Observed excludes marked release verification, but source provenance must still be reviewed before calling it organic.'
    when 'release_verification' then 'Synthetic certification only; never use for a commerce decision and clean it after release.'
    else 'Legacy v1 provenance is unknown and the offer-view denominator was not tied to a visible offer; exclude from v2 decisions.'
  end as caveat
from report
order by offer_version, evidence_bucket;
