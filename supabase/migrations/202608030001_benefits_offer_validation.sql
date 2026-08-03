begin;

alter table public.growth_events
  drop constraint if exists growth_events_event_name_check,
  drop constraint if exists growth_events_surface_check,
  drop constraint if exists growth_events_variant_check,
  drop constraint if exists growth_events_destination_check;

alter table public.growth_events
  add constraint growth_events_event_name_check
    check (
      event_name in (
        'insurance_hub_viewed',
        'insurance_hub_handoff_opened',
        'service_navigation_opened',
        'service_navigation_destination_selected',
        'benefits_offer_viewed',
        'benefits_offer_cta_opened'
      )
    ),
  add constraint growth_events_surface_check
    check (
      surface in (
        'insurance_hub',
        'desktop_header',
        'mobile_header',
        'benefits_decision_offer'
      )
    ),
  add constraint growth_events_variant_check
    check (
      variant in (
        'baseline_v1',
        'release_verification',
        'service_navigation_v1',
        'benefits_offer_29_v1'
      )
    ),
  add constraint growth_events_destination_check
    check (
      (
        event_name = 'insurance_hub_viewed'
        and surface = 'insurance_hub'
        and destination_id is null
        and variant in ('baseline_v1', 'release_verification')
      )
      or
      (
        event_name = 'insurance_hub_handoff_opened'
        and surface = 'insurance_hub'
        and destination_id in (
          'discharge_coverage',
          'discharge_printable',
          'prior_authorization',
          'plan_types',
          'sbc_guide',
          'commercial_comparison',
          'eob_guide',
          'cost_sharing_basics',
          'facility_fees',
          'medical_bill_review',
          'eob_bill_match',
          'out_of_pocket_max',
          'open_enrollment',
          'medicare_hub',
          'prescription_checklist',
          'spouse_coverage',
          'supplemental_policies',
          'hsa_fsa',
          'paycheck_impact'
        )
        and variant in ('baseline_v1', 'release_verification')
      )
      or
      (
        event_name = 'service_navigation_opened'
        and surface in ('desktop_header', 'mobile_header')
        and destination_id is null
        and variant = 'service_navigation_v1'
      )
      or
      (
        event_name = 'service_navigation_destination_selected'
        and surface in ('desktop_header', 'mobile_header')
        and destination_id in (
          'decision_concierge',
          'start_here',
          'all_tools',
          'articles',
          'benefits_command_center',
          'benefits_change_detector',
          'total_compensation',
          'paycheck_403b',
          'career_decision_center',
          'hospital_patient_guide',
          'medical_bill_review',
          'eob_bill_match',
          'prior_authorization',
          'benefits_insurance',
          'medicare_medicaid',
          'open_enrollment',
          'quick_guides',
          'topic_guides'
        )
        and variant = 'service_navigation_v1'
      )
      or
      (
        event_name = 'benefits_offer_viewed'
        and surface = 'benefits_decision_offer'
        and destination_id is null
        and variant = 'benefits_offer_29_v1'
      )
      or
      (
        event_name = 'benefits_offer_cta_opened'
        and surface = 'benefits_decision_offer'
        and destination_id = 'early_access_commitment_form'
        and variant = 'benefits_offer_29_v1'
      )
    );

create table if not exists public.benefits_offer_commitments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  product_id text not null default 'healthcare-worker-benefits-decision-system',
  offer_version text not null default 'benefits_offer_29_v1',
  price_cents integer not null default 2900,
  currency text not null default 'usd',
  source text not null,
  email text not null,
  email_hash text not null,
  email_consent boolean not null,
  price_commitment boolean not null,
  commitment_statement_version text not null default 'would_consider_29_v1',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  constraint benefits_offer_product_check
    check (product_id = 'healthcare-worker-benefits-decision-system'),
  constraint benefits_offer_version_check
    check (offer_version = 'benefits_offer_29_v1'),
  constraint benefits_offer_price_check
    check (price_cents = 2900 and currency = 'usd'),
  constraint benefits_offer_source_check
    check (source = 'total_compensation_comparison'),
  constraint benefits_offer_email_check
    check (
      email = lower(email)
      and char_length(email) between 5 and 320
      and position('@' in email) > 1
    ),
  constraint benefits_offer_email_hash_check
    check (email_hash ~ '^[0-9a-f]{64}$'),
  constraint benefits_offer_consent_check
    check (email_consent is true and price_commitment is true),
  constraint benefits_offer_statement_check
    check (commitment_statement_version = 'would_consider_29_v1'),
  constraint benefits_offer_status_check
    check (status in ('active', 'unsubscribed'))
);

comment on table public.benefits_offer_commitments is
  'Product-specific, consented early-access commitments for the bounded $29 Benefits Decision System validation. Stores only contact email, a one-way email hash, random session ID, fixed offer metadata, consent state, and timestamps. Never stores employer names, plan details, salary, benefit values, medical information, payment information, or free text.';

alter table public.benefits_offer_commitments enable row level security;
alter table public.benefits_offer_commitments force row level security;

revoke all on table public.benefits_offer_commitments from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.benefits_offer_commitments to service_role;

create unique index if not exists benefits_offer_commitments_email_unique
  on public.benefits_offer_commitments (product_id, email_hash);

create unique index if not exists benefits_offer_commitments_session_unique
  on public.benefits_offer_commitments (product_id, session_id);

create index if not exists benefits_offer_commitments_measurement_idx
  on public.benefits_offer_commitments (offer_version, status, created_at desc);

commit;
