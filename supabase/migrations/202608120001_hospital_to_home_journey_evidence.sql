begin;

alter table public.journey_events
  drop constraint if exists journey_events_event_name_check;

alter table public.journey_events
  add constraint journey_events_event_name_check
  check (
    event_name in (
      'journey_viewed',
      'journey_started',
      'journey_step_completed',
      'journey_back_selected',
      'journey_exited_unexpectedly',
      'journey_result_reached',
      'journey_result_saved',
      'journey_result_copied',
      'journey_result_printed',
      'journey_resume_clicked',
      'journey_restarted',
      'journey_handoff_opened'
    )
  );

alter table public.journey_events
  drop constraint if exists journey_events_journey_key_check;

alter table public.journey_events
  add constraint journey_events_journey_key_check
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
      'medicare_coverage_decision',
      'hospital_to_home'
    )
  );

comment on constraint journey_events_journey_key_check on public.journey_events is
  'Allowlisted anonymous journey identifiers. hospital_to_home stores lifecycle state only; user answers and brief content remain browser-local.';

comment on constraint journey_events_event_name_check on public.journey_events is
  'Allowlisted lifecycle events. journey_result_saved records the fixed save action only; it never includes task, answer, or brief content.';

commit;
