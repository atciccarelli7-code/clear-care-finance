# CAF Analytics Event Dictionary

**Initial effective date:** July 13, 2026  
**Program:** CAF Product Readiness and Scale Program  
**Parent issues:** #153, #157  
**Related evidence issue:** #152

## Status labels

- **Implemented:** event exists in production source code.
- **Tested:** automated tests enforce the event/property contract.
- **Observed:** an actual production payload or reporting count has been inspected.
- **Not yet measurable:** the code may exist, but the connected execution environment does not expose the required reporting or payload evidence.

No event should be represented as observed merely because the source code compiles or a test passes.

## Universal rules

All CAF events must:

- remain disabled until the visitor grants analytics consent;
- use lowercase fixed event names;
- use fixed categorical identifiers where a strict event helper exists;
- remove query strings and URL fragments;
- avoid answers, values, dates, local-storage contents, receipt text, and unrestricted user strings;
- never interrupt a user workflow when analytics fails.

Prohibited properties include:

- names, email, phone, address, employer, role, plan, carrier, provider, pharmacy, medication, diagnosis, procedure, disability, claim, member, account, tax, government, or medical-record identifiers;
- income, salary, wage, balances, premiums, deductibles, out-of-pocket values, contributions, overtime, bonuses, tax rates, exact ages, household data, state, ZIP code, or reminder dates;
- benefit states, checklist answers, decision answers, result text, Receipt contents, notes, comments, free text, query strings, fragments, or complete local-storage records.

## Growth Engine funnel

Source contract: `src/lib/growthAnalytics.ts`

| Funnel | Event | Trigger | Permitted properties | Status |
|---|---|---|---|---|
| Acquisition | `concierge_viewed` | Concierge entry is presented | `entry_surface` | Implemented and tested; not yet observed |
| Activation | `concierge_started` | First fixed Concierge choice | `entry_surface`, `problem_category` | Implemented and tested; not yet observed |
| Activation | `concierge_completed` | Deterministic recommendation is produced | `entry_surface`, `problem_category`, `destination_id`, `completion_band` | Implemented and tested; not yet observed |
| Value | `concierge_destination_opened` | Recommended canonical journey is opened | `entry_surface`, `destination_id` | Implemented and tested; not yet observed |
| Acquisition | `acquisition_tool_cta_selected` | Employer-benefit-change article opens the Detector | `entry_surface`, `destination_id` | Implemented and tested; not yet observed |
| Activation | `benefits_review_started` | Benefits Change Detector begins | `entry_surface`, `completion_band` | Implemented and tested; not yet observed |
| Activation | `benefits_review_completed` | Review reaches completed state | `entry_surface`, `completion_band` | Implemented and tested; not yet observed |
| Value | `benefits_receipt_viewed` | Benefits Change Receipt is shown | `entry_surface`, `receipt_action` | Implemented and tested; not yet observed |
| Value | `benefits_receipt_copied` | Copy action selected | `entry_surface`, `receipt_action` | Implemented and tested; not yet observed |
| Value | `benefits_receipt_printed` | Print/save action selected | `entry_surface`, `receipt_action` | Implemented and tested; not yet observed |
| Retention | `benefits_calendar_created` | Local calendar reminder is generated | `entry_surface`, `receipt_action` | Implemented and tested; date prohibited; not yet observed |
| Distribution | `benefits_canonical_link_shared` | Canonical public URL is shared | `entry_surface`, `receipt_action` | Implemented and tested; answers prohibited; not yet observed |
| Retention | `benefits_review_resumed` | Valid local review is resumed | `entry_surface`, `completion_band` | Implemented and tested; not yet observed |
| Retention | `benefits_review_reset` | Review is reset | `entry_surface`, `receipt_action` | Implemented and tested; not yet observed |
| Retention/privacy | `benefits_local_review_deleted` | Local review is deleted | `entry_surface`, `receipt_action` | Implemented and tested; not yet observed |
| Value | `benefits_related_journey_opened` | Approved related product is opened | `entry_surface`, `handoff_id` | Implemented and tested; not yet observed |
| Commercial | `organization_page_viewed` | Organization route is viewed | `entry_surface` | Implemented and tested; not yet observed |
| Commercial | `organization_pilot_details_viewed` | Pilot details are expanded | `entry_surface`, `cta_type` | Implemented and tested; not yet observed |
| Commercial | `organization_demo_opened` | Public demonstration is opened | `entry_surface`, `destination_id` | Implemented and tested; not yet observed |
| Commercial | `organization_contact_selected` | Contact CTA is selected | `entry_surface`, `cta_type` | Implemented and tested; buyer identity prohibited; not yet observed |

## Flagship decision-tool funnel

Source contract: `src/lib/growthAnalytics.ts`

This shared funnel measures the Healthcare Worker Benefits Blueprint and Medicare and Medicaid Eligibility Check without creating an answer-level event stream.

| Funnel | Event | Trigger | Permitted properties | Status |
|---|---|---|---|---|
| Activation | `flagship_tool_started` | First valid question is completed | `tool_id` | Implemented and tested; not yet observed |
| Activation | `flagship_tool_step_completed` | A valid step advances | `tool_id`, `step_id` | Implemented and tested; answer prohibited; not yet observed |
| Activation | `flagship_tool_completed` | The result screen is reached | `tool_id` | Implemented and tested; not yet observed |
| Value | `flagship_tool_result_action` | Copy, print, review, or restart is selected | `tool_id`, `result_action` | Implemented and tested; result text prohibited; not yet observed |
| Value | `flagship_tool_handoff_opened` | An approved internal next step or official resource is opened | `tool_id`, `action_id` | Implemented and tested; URL and user values prohibited; not yet observed |

### Allowed tool IDs

- `benefits_blueprint`
- `medicare_medicaid_eligibility`

### Privacy boundary

The funnel may identify a fixed question category such as `emergency_fund`, `income`, or `disability`, but it must never include the answer. Exact or approximate age, income, state, household size, health status, disability status, pregnancy status, benefit choices, debt status, retirement contribution, employer, plan, result text, source URL, or copied summary are prohibited.

## Priority decision-journey funnel

Source contract: `src/lib/decisionJourneyAnalytics.ts`

Initial scope is deliberately limited to:

- `roth_traditional`
- `debt_retirement`
- `observation_status`

The state Medicaid router is excluded from this first contract to prevent accidental state transmission. The Medicare checklist remains outside until its completion state is explicit.

| Funnel | Event | Trigger | Required fixed properties | Status |
|---|---|---|---|---|
| Activation | `decision_journey_started` | First form change or form submission | `journey_id` | Implemented and tested in readiness batch; production observation pending |
| Activation | `decision_journey_completed` | Qualified result panel mounts | `journey_id` | Implemented and tested in readiness batch; production observation pending |
| Value | `decision_journey_result_action` | Copy, print, or reset is selected | `journey_id`, `result_action` | Implemented and tested in readiness batch; production observation pending |
| Value | `decision_journey_handoff_opened` | Approved canonical next journey is opened | `journey_id`, `handoff_id` | Implemented and tested in readiness batch; production observation pending |

### Allowed result actions

- `copy`
- `print`
- `reset`

### Allowed handoff IDs

- `roth_403b_calculator`
- `roth_benefits_command_center`
- `debt_financial_foundation`
- `debt_student_loans`
- `observation_discharge_center`
- `observation_medical_bill_toolkit`

No route, URL, title, answer, selected option, calculation, or result text is sent through the strict decision-journey event contract.

## Existing shared product events

These events predate the strict readiness-batch helper and remain governed by `src/lib/analytics.ts`, its sensitive-key rejection, query minimization, and consent boundary.

| Product area | Representative events | Current status |
|---|---|---|
| Homepage | `homepage_navigation` | Implemented and tested; reporting baseline not available here |
| My Plan | `tool_plan_action_added` and Navigator plan actions | Implemented and tested; production outcome not observed |
| Returning summary | `saved_progress_summary_viewed`, `saved_progress_summary_dismissed`, `saved_progress_item_opened` | Implemented and tested; production outcome not observed |
| Calculators/tools | `calculator_start` and tool-specific action events | Implemented unevenly across tools; reconciliation required |
| Benefits Command Center | activation, sample, tour, package, Receipt, and comparison actions | Implemented and tested; production funnel not observed |
| Medical-bill ecosystem | tool start, tracker, copy/export, and next-step actions | Implemented across several helpers; unified journey reporting not observed |
| Prior authorization | start, completion, copy, print, restart, related link | Implemented and tested; production funnel not observed |

## Production verification procedure

Issue #157 should record:

1. consent state used for the test;
2. route and exact interaction;
3. event name received by each configured analytics destination;
4. complete received property keys and values;
5. confirmation that prohibited fields are absent;
6. whether the event is visible in a report or debug stream;
7. test date and production commit;
8. any vendor-generated automatic fields outside CAF's direct event payload;
9. remediation issue when a payload differs from this dictionary.

## Change control

A new event or property requires:

- a defined funnel purpose;
- a fixed event and property contract;
- a privacy review;
- automated allowlist/rejection tests;
- documentation here;
- no user answer or value dependency;
- production observation before the event is used for a business claim.

Analytics must never be used to reconstruct a person's benefit, medical, insurance, employment, tax, debt, or retirement situation.
