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
        'service_navigation_destination_selected'
      )
    ),
  add constraint growth_events_surface_check
    check (surface in ('insurance_hub', 'desktop_header', 'mobile_header')),
  add constraint growth_events_variant_check
    check (variant in ('baseline_v1', 'release_verification', 'service_navigation_v1')),
  add constraint growth_events_destination_check
    check (
      (
        event_name = 'insurance_hub_viewed'
        and surface = 'insurance_hub'
        and variant in ('baseline_v1', 'release_verification')
        and destination_id is null
      )
      or
      (
        event_name = 'insurance_hub_handoff_opened'
        and surface = 'insurance_hub'
        and variant in ('baseline_v1', 'release_verification')
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
      )
      or
      (
        event_name = 'service_navigation_opened'
        and surface in ('desktop_header', 'mobile_header')
        and variant = 'service_navigation_v1'
        and destination_id is null
      )
      or
      (
        event_name = 'service_navigation_destination_selected'
        and surface in ('desktop_header', 'mobile_header')
        and variant = 'service_navigation_v1'
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
      )
    );

comment on table public.growth_events is
  'Consent-gated, anonymous, fixed-dimension evidence for bounded CAF growth and navigation experiments. Never stores form answers, financial amounts, health details, contact information, URLs, query strings, referrers, IP addresses, or user-agent fingerprints.';

alter table public.growth_events enable row level security;
alter table public.growth_events force row level security;

revoke all on table public.growth_events from public, anon, authenticated, service_role;
grant select, insert, delete on table public.growth_events to service_role;

drop index if exists public.growth_events_session_signal_unique;
create unique index growth_events_session_signal_unique
  on public.growth_events (
    session_id,
    event_name,
    surface,
    coalesce(destination_id, ''),
    variant
  );

commit;
