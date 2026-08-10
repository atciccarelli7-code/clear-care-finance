begin;

create table if not exists public.journey_events (
  event_id uuid primary key,
  session_journey_id text not null,
  event_name text not null,
  journey_key text not null,
  surface text not null,
  phase text,
  step_index smallint,
  variant text,
  created_at timestamptz not null default now(),
  constraint journey_events_session_check
    check (session_journey_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  constraint journey_events_event_name_check
    check (
      event_name in (
        'journey_viewed',
        'journey_started',
        'journey_step_completed',
        'journey_back_selected',
        'journey_exited_unexpectedly',
        'journey_result_reached',
        'journey_result_copied',
        'journey_result_printed',
        'journey_resume_clicked',
        'journey_restarted',
        'journey_handoff_opened'
      )
    ),
  constraint journey_events_journey_key_check
    check (
      journey_key in (
        'decision_concierge',
        'healthcare_offer_verification',
        'roth_traditional',
        'debt_retirement',
        'observation_status',
        'medicare_plan_verification',
        'paycheck_403b',
        'total_compensation_comparison',
        'benefits_decision_system',
        'hospital_financial_assistance',
        'medicare_coverage_decision'
      )
    ),
  constraint journey_events_surface_check
    check (
      surface in (
        'home',
        'tools',
        'start_here',
        'destination',
        'hospital_guide',
        'benefits',
        'medicare',
        'medical_bill'
      )
    ),
  constraint journey_events_phase_check
    check (
      phase is null
      or phase in (
        'name_question',
        'narrow_answer',
        'build_action_plan',
        'verify_officially',
        'result',
        'handoff'
      )
    ),
  constraint journey_events_step_index_check
    check (step_index is null or step_index between 0 and 20),
  constraint journey_events_variant_check
    check (variant is null or variant = 'flagship_funnel_v1')
);

comment on table public.journey_events is
  'Consent-gated anonymous journey lifecycle evidence. Stores only a random event ID, a random browser-session journey ID, allowlisted event and surface names, fixed journey/phase/variant identifiers, a bounded step index, and a server timestamp. Never stores answers, calculations, outcome text, URLs, query strings, referrers, contact information, health details, financial amounts, employer or plan names, IP addresses, or device fingerprints.';

alter table public.journey_events enable row level security;
alter table public.journey_events force row level security;

revoke all on table public.journey_events from public, anon, authenticated, service_role;
grant select, insert, delete on table public.journey_events to service_role;

create unique index if not exists journey_events_session_signal_unique
  on public.journey_events (
    session_journey_id,
    event_name,
    journey_key,
    surface,
    coalesce(phase, ''),
    coalesce(step_index, -1),
    coalesce(variant, '')
  );

create index if not exists journey_events_funnel_read_idx
  on public.journey_events (journey_key, surface, created_at desc, event_name);

commit;
