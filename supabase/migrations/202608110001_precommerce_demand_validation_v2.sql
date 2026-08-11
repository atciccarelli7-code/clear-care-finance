begin;

alter table public.growth_events
  drop constraint if exists growth_events_event_name_check,
  drop constraint if exists growth_events_surface_check,
  drop constraint if exists growth_events_variant_check,
  drop constraint if exists growth_events_destination_check;

alter table public.growth_events
  add constraint growth_events_event_name_check check (event_name in (
    'insurance_hub_viewed',
    'insurance_hub_handoff_opened',
    'service_navigation_opened',
    'service_navigation_destination_selected',
    'benefits_offer_viewed',
    'benefits_offer_cta_opened',
    'precommerce_offer_viewed',
    'precommerce_offer_engaged',
    'precommerce_commitment_started'
  )),
  add constraint growth_events_surface_check check (surface in (
    'insurance_hub',
    'desktop_header',
    'mobile_header',
    'benefits_decision_offer',
    'benefits_decision_result'
  )),
  add constraint growth_events_variant_check check (variant in (
    'baseline_v1',
    'release_verification',
    'service_navigation_v1',
    'benefits_offer_29_v1',
    'benefits_workspace_29_v2',
    'benefits_workspace_29_v2_release_verification'
  )),
  add constraint growth_events_destination_check check (
    (
      event_name = 'insurance_hub_viewed'
      and surface = 'insurance_hub'
      and destination_id is null
      and variant in ('baseline_v1', 'release_verification')
    )
    or (
      event_name = 'insurance_hub_handoff_opened'
      and surface = 'insurance_hub'
      and destination_id in (
        'discharge_coverage', 'discharge_printable', 'prior_authorization', 'plan_types',
        'sbc_guide', 'commercial_comparison', 'eob_guide', 'cost_sharing_basics',
        'facility_fees', 'medical_bill_review', 'eob_bill_match', 'out_of_pocket_max',
        'open_enrollment', 'medicare_hub', 'prescription_checklist', 'spouse_coverage',
        'supplemental_policies', 'hsa_fsa', 'paycheck_impact'
      )
      and variant in ('baseline_v1', 'release_verification')
    )
    or (
      event_name = 'service_navigation_opened'
      and surface in ('desktop_header', 'mobile_header')
      and destination_id is null
      and variant = 'service_navigation_v1'
    )
    or (
      event_name = 'service_navigation_destination_selected'
      and surface in ('desktop_header', 'mobile_header')
      and destination_id in (
        'decision_concierge', 'start_here', 'all_tools', 'articles',
        'benefits_command_center', 'benefits_change_detector', 'total_compensation',
        'paycheck_403b', 'career_decision_center', 'hospital_patient_guide',
        'medical_bill_review', 'eob_bill_match', 'prior_authorization',
        'benefits_insurance', 'medicare_medicaid', 'open_enrollment',
        'quick_guides', 'topic_guides'
      )
      and variant = 'service_navigation_v1'
    )
    or (
      event_name = 'benefits_offer_viewed'
      and surface = 'benefits_decision_offer'
      and destination_id is null
      and variant = 'benefits_offer_29_v1'
    )
    or (
      event_name = 'benefits_offer_cta_opened'
      and surface = 'benefits_decision_offer'
      and destination_id = 'early_access_commitment_form'
      and variant = 'benefits_offer_29_v1'
    )
    or (
      event_name = 'precommerce_offer_viewed'
      and surface = 'benefits_decision_result'
      and destination_id is null
      and variant in ('benefits_workspace_29_v2', 'benefits_workspace_29_v2_release_verification')
    )
    or (
      event_name = 'precommerce_offer_engaged'
      and surface = 'benefits_decision_result'
      and destination_id = 'offer_details'
      and variant in ('benefits_workspace_29_v2', 'benefits_workspace_29_v2_release_verification')
    )
    or (
      event_name = 'precommerce_commitment_started'
      and surface = 'benefits_decision_result'
      and destination_id = 'commitment_form'
      and variant in ('benefits_workspace_29_v2', 'benefits_workspace_29_v2_release_verification')
    )
  );

alter table public.benefits_offer_commitments
  add column if not exists evidence_class text not null default 'observed',
  add column if not exists exclusion_reason text;

alter table public.benefits_offer_commitments
  drop constraint if exists benefits_offer_version_check,
  drop constraint if exists benefits_offer_source_check,
  drop constraint if exists benefits_offer_statement_check,
  drop constraint if exists benefits_offer_status_check,
  drop constraint if exists benefits_offer_evidence_class_check,
  drop constraint if exists benefits_offer_exclusion_check;

alter table public.benefits_offer_commitments
  add constraint benefits_offer_version_check check (
    offer_version in ('benefits_offer_29_v1', 'benefits_workspace_29_v2')
  ),
  add constraint benefits_offer_source_check check (
    (offer_version = 'benefits_offer_29_v1' and source = 'total_compensation_comparison')
    or (offer_version = 'benefits_workspace_29_v2' and source = 'benefits_decision_result')
  ),
  add constraint benefits_offer_statement_check check (
    (offer_version = 'benefits_offer_29_v1' and commitment_statement_version = 'would_consider_29_v1')
    or (offer_version = 'benefits_workspace_29_v2' and commitment_statement_version = 'would_consider_benefits_workspace_29_v2')
  ),
  add constraint benefits_offer_status_check check (status in ('active', 'unsubscribed', 'excluded')),
  add constraint benefits_offer_evidence_class_check check (evidence_class in ('observed', 'release_verification')),
  add constraint benefits_offer_exclusion_check check (
    (status = 'excluded' and exclusion_reason in ('founder', 'friend_family', 'synthetic', 'duplicate', 'other'))
    or (status <> 'excluded' and exclusion_reason is null)
  );

comment on table public.benefits_offer_commitments is
  'Minimal consented price-qualified stated-intent records. The legacy physical name is retained for compatibility. Stores email, one-way email hash, random session ID, fixed offer metadata, evidence class, exclusion state, consent, and timestamps. Never stores answers, employer or plan names, salary, benefit values, medical information, URLs, payment information, uploads, or free text.';

alter table public.benefits_offer_commitments enable row level security;
alter table public.benefits_offer_commitments force row level security;
revoke all on table public.benefits_offer_commitments from public, anon, authenticated, service_role;
grant select, insert, update, delete on table public.benefits_offer_commitments to service_role;

drop index if exists public.benefits_offer_commitments_measurement_idx;
create index benefits_offer_commitments_measurement_idx
  on public.benefits_offer_commitments (offer_version, evidence_class, status, created_at desc);

commit;
