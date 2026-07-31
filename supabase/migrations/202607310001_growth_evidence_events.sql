begin;

create table if not exists public.growth_events (
  event_id uuid primary key,
  session_id uuid not null,
  event_name text not null,
  surface text not null,
  destination_id text,
  variant text not null,
  created_at timestamptz not null default now(),
  constraint growth_events_event_name_check
    check (event_name in ('insurance_hub_viewed', 'insurance_hub_handoff_opened')),
  constraint growth_events_surface_check
    check (surface = 'insurance_hub'),
  constraint growth_events_variant_check
    check (variant in ('baseline_v1', 'release_verification')),
  constraint growth_events_destination_check
    check (
      (event_name = 'insurance_hub_viewed' and destination_id is null)
      or
      (
        event_name = 'insurance_hub_handoff_opened'
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
    )
);

comment on table public.growth_events is
  'Consent-gated, anonymous, fixed-dimension evidence for bounded CAF growth experiments. Never stores form answers, financial amounts, health details, contact information, URLs, query strings, referrers, IP addresses, or user-agent fingerprints.';

alter table public.growth_events enable row level security;
alter table public.growth_events force row level security;

revoke all on table public.growth_events from public, anon, authenticated, service_role;
grant select, insert, delete on table public.growth_events to service_role;

create unique index if not exists growth_events_session_signal_unique
  on public.growth_events (
    session_id,
    event_name,
    coalesce(destination_id, ''),
    variant
  );

create index if not exists growth_events_experiment_read_idx
  on public.growth_events (variant, surface, created_at desc, event_name, destination_id);

commit;
