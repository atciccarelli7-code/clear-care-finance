# CAF Shared Journey Analytics Contract

**Effective:** July 21, 2026  
**Source:** `src/lib/journeyAnalytics.ts`  
**Consent boundary:** `src/lib/analytics.ts`

## Purpose

Measure whether visitors enter, complete, resume, copy, print, restart, or hand off from a guided CAF journey without collecting the content of the decision.

The event stream is intentionally incapable of reconstructing a visitor’s medical, insurance, employment, tax, debt, retirement, benefits, or household situation.

## Shared events

| Event | Product meaning |
|---|---|
| `journey_viewed` | A governed guided entry is visible. |
| `journey_started` | The visitor makes the first deliberate fixed choice or form action. |
| `journey_step_completed` | A meaningful phase or step is completed. |
| `journey_back_selected` | The visitor deliberately moves to a prior phase. |
| `journey_exited_unexpectedly` | A future governed implementation may record an interrupted exit using only coarse context. |
| `journey_result_reached` | The canonical destination displays a recognizable result or action plan. |
| `journey_result_copied` | The visitor copies the result or action plan. |
| `journey_result_printed` | The visitor prints or saves the result as PDF. |
| `journey_resume_clicked` | A returning visitor opens previously saved non-sensitive progress. |
| `journey_restarted` | The visitor deliberately clears or restarts the journey. |
| `journey_handoff_opened` | An approved canonical next destination or official verification source is opened. |

## Allowed properties

| Property | Rule |
|---|---|
| `journey_key` | Required fixed publisher-authored identifier. Lowercase letters, numbers, underscore, or hyphen only. |
| `surface` | Required allowlisted surface: `home`, `tools`, `start_here`, `destination`, `hospital_guide`, `benefits`, `medicare`, or `medical_bill`. |
| `phase` | Optional allowlisted phase: `name_question`, `narrow_answer`, `build_action_plan`, `verify_officially`, `result`, or `handoff`. |
| `step_index` | Optional integer from 0 through 20. It identifies sequence only; it is not a completion percentage. |
| `variant` | Optional fixed publisher-authored category or destination ID. It may not be derived from unrestricted user text. |
| `session_journey_id` | Random session-scoped UUID or fallback ID stored only in `sessionStorage`. It is not a person, account, or durable cross-device identifier. |

Any unknown property causes the strict shared sanitizer to reject the event rather than forwarding an incomplete or unsafe payload.

## Prohibited payloads

Never transmit:

- names, email addresses, phone numbers, street addresses, exact location, state, or ZIP code;
- diagnoses, symptoms, conditions, medications, treatment, oxygen settings, procedures, provider or hospital identity;
- policy, member, claim, case, account, tax, government, or medical-record identifiers;
- employer, job title, offer, salary, wage, overtime, schedule, benefit selections, plan, carrier, or pharmacy;
- income, balances, premiums, deductibles, out-of-pocket amounts, contributions, tax rates, debt, assets, or exact age;
- selected answer content, result text, calculation results, generated plans, copied text, notes, comments, or free text;
- document contents, uploaded files, bills, EOBs, MSNs, notices, plan documents, discharge instructions, or medication lists;
- query strings, fragments, unrestricted URLs, local-storage records, or browser fingerprints.

## Consent and delivery

`trackSiteEvent` returns without sending when analytics consent is absent. The shared helper uses the same consent-gated Vercel Analytics and Google Analytics delivery path as the rest of CAF. Analytics failures are swallowed so measurement can never interrupt a user’s task.

## Current migration state

### Normalized to the shared contract

- Decision Concierge entry, category selection, completion-as-handoff, and destination open.
- Priority decision-tool journey start.
- Shared answer-first result reached, copied, printed, restarted, and approved handoff opened.

### Legacy events retained temporarily

Benefits Command Center, medical-bill, preventive-cost, organization, and other mature workflows retain strict existing product-specific helpers until they are migrated without breaking historical reporting or adding duplicate events.

During migration, a single interaction must not emit both a legacy terminal event and a shared terminal event for the same measurement purpose.

## Reporting definitions

### Entry rate

`journey_started / journey_viewed` by `journey_key` and `surface`.

### Result completion rate

`journey_result_reached / journey_started` by `journey_key`.

### Action-use rate

Unique sessions with `journey_result_copied` or `journey_result_printed` divided by unique sessions with `journey_result_reached`.

### Handoff rate

`journey_handoff_opened / journey_result_reached`, separated between canonical CAF continuation and official verification variants.

### Resume rate

`journey_resume_clicked` divided by eligible returning sessions where a privacy-safe saved state was visible. Eligibility must come from local product state, not a sensitive analytics property.

## Change control

A new event, property, surface, phase, journey key, or variant requires:

1. a defined product question;
2. strict allowlist implementation;
3. positive and negative unit tests;
4. privacy review;
5. documentation update;
6. verification that no duplicate event is emitted;
7. production payload inspection after analytics consent;
8. a prohibition on using the event for a business claim until the production payload is observed.

## Release acceptance

Before release:

- all shared analytics tests pass;
- unknown and sensitive properties are rejected;
- events do not fire before analytics consent;
- no answer content appears in direct payloads;
- journey keys and surfaces match production routes;
- no dead dashboard or documentation claims a migrated event is observed before it is actually inspected;
- the 14-day review checks entry and handoff behavior;
- the 28-day review checks result completion and action use.
