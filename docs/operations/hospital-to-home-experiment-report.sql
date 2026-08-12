-- Hospital-to-Home Coverage & Cost Navigator evidence report
-- Product question: do qualified visitors start, reach the brief, and use a
-- high-intent result action after receiving personalized free value?
--
-- Scope is deliberately limited to consented anonymous sessions. It is not a
-- traffic, satisfaction, payment, or population-representativeness report.
-- Remove release-certification rows by their exact session_journey_id before
-- using this query for a business decision.

with scoped as (
  select session_journey_id, event_name, step_index, created_at
  from public.journey_events
  where journey_key = 'hospital_to_home'
    and surface = 'hospital_guide'
    and variant = 'flagship_funnel_v1'
    and created_at >= timestamptz '2026-08-12 00:00:00+00'
),
session_flags as (
  select
    session_journey_id,
    bool_or(event_name = 'journey_viewed') as viewed,
    bool_or(event_name = 'journey_started') as started,
    bool_or(event_name = 'journey_result_reached') as reached_result,
    bool_or(event_name in (
      'journey_result_saved',
      'journey_result_copied',
      'journey_result_printed',
      'journey_handoff_opened'
    )) as used_high_intent_action
  from scoped
  group by session_journey_id
),
totals as (
  select
    count(*) filter (where viewed) as viewed_sessions,
    count(*) filter (where started) as started_sessions,
    count(*) filter (where reached_result) as result_sessions,
    count(*) filter (where reached_result and used_high_intent_action) as high_intent_sessions
  from session_flags
)
select
  viewed_sessions,
  started_sessions,
  result_sessions,
  high_intent_sessions,
  round(100.0 * started_sessions / nullif(viewed_sessions, 0), 1) as start_per_view_pct,
  round(100.0 * result_sessions / nullif(started_sessions, 0), 1) as result_per_start_pct,
  round(100.0 * result_sessions / nullif(viewed_sessions, 0), 1) as result_per_view_pct,
  round(100.0 * high_intent_sessions / nullif(result_sessions, 0), 1) as high_intent_per_result_pct,
  case
    when viewed_sessions < 25 then 'NO DECISION — wait for at least 25 consented viewed sessions'
    when 100.0 * started_sessions / nullif(viewed_sessions, 0) >= 35
      and 100.0 * result_sessions / nullif(started_sessions, 0) >= 40
      and 100.0 * high_intent_sessions / nullif(result_sessions, 0) >= 20
      then 'GO — preserve the free product and evaluate the next bounded value test'
    when viewed_sessions >= 50
      and (
        100.0 * started_sessions / nullif(viewed_sessions, 0) < 10
        or 100.0 * result_sessions / nullif(viewed_sessions, 0) < 10
        or high_intent_sessions = 0
      )
      then 'STOP EXPANSION — do not add persistence, commerce, or surface area'
    else 'ITERATE — inspect the deepest reached step and direct feedback before changing scope'
  end as experiment_disposition
from totals;

-- Where consented sessions reached. This is the abandonment diagnostic; a
-- step number identifies sequence only and never exposes an answer.
with scoped as (
  select session_journey_id, event_name, step_index
  from public.journey_events
  where journey_key = 'hospital_to_home'
    and surface = 'hospital_guide'
    and variant = 'flagship_funnel_v1'
    and created_at >= timestamptz '2026-08-12 00:00:00+00'
)
select
  step_index,
  count(distinct session_journey_id) filter (where event_name = 'journey_step_completed') as sessions_completing_step,
  count(*) filter (where event_name = 'journey_back_selected') as back_events
from scoped
where step_index is not null
group by step_index
order by step_index;

-- Exact fixed lifecycle counts for operational verification.
select
  event_name,
  count(*) as event_rows,
  count(distinct session_journey_id) as unique_sessions,
  min(created_at) as first_seen_at,
  max(created_at) as last_seen_at
from public.journey_events
where journey_key = 'hospital_to_home'
  and surface = 'hospital_guide'
  and variant = 'flagship_funnel_v1'
  and created_at >= timestamptz '2026-08-12 00:00:00+00'
group by event_name
order by event_name;
