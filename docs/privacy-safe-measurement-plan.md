# Privacy-Safe Measurement Plan

## Purpose

Measure whether visitors find useful answers, continue to the next relevant resource, and join the owned email audience without recording the financial, medical, insurance, eligibility, disability, household, or benefits information they enter.

## Consent rule

Custom behavioral events are sent only after the visitor selects **Allow analytics**. The canonical helper is `src/lib/analytics.ts`.

The helper sends the same sanitized event to Vercel Analytics and Google Analytics. Analytics failures must never interrupt a tool, article, form, or navigation action.

Google Analytics is configured with automatic pageviews disabled. The application emits consented pageviews deliberately. Before any event enters the Google data layer, the global telemetry boundary reduces `page_location`, `*_url`, and `*_path` strings to an origin and pathname. Query strings and fragments are removed even if a caller bypasses the canonical helper.

## Never collect in custom events

Do not send:

- email addresses or names;
- age, state, ZIP code, household size, income, wages, salary, or balances;
- medical conditions, diagnoses, disability status, pregnancy status, or care details;
- tool answers, result categories, eligibility pathways, denial reasons, or plan choices;
- premiums, deductibles, out-of-pocket maximums, HSA amounts, contribution rates, or debt amounts;
- free-text user input;
- URL query strings or fragments.

The analytics sanitizer removes property keys associated with these categories and strips query strings and fragments from URLs. The global `gtag` boundary repeats the URL cleanup as defense in depth.

## Core event taxonomy

| Event | Purpose | Safe properties |
|---|---|---|
| `homepage_navigation` | Visitor selects a fixed homepage path, topic, article, specialty hub, or CTA | `navigation_type`, `item_id`, `destination_path` |
| `tool_intent_click` | Visitor selects a problem from the tools directory | `tool_id`, `tool_label` |
| `tool_jump_select` | Visitor uses the tools jump menu | `tool_id`, `tool_label` |
| `tool_start` or legacy `calculator_start` | Visitor begins interacting with a tool | `tool_id`, `tool_label` |
| `tool_complete` | Visitor reaches a completed tool result | `tool_id`, `tool_label` |
| `tool_result_action` | Visitor copies, prints, restarts, or opens a next step | `tool_id`, `tool_label`, `action` |
| `tool_plan_action_added` | Visitor saves a fixed recommendation into My Plan | `recommendation_id`, `pathway_id`, `source_route`, `destination_path` |
| `next_step_click` | Visitor follows a related article, tool, or hub card | `link_text`, `link_url`, `source_path` |
| `official_source_click` | Visitor opens an official source | `source_name`, `link_url`, `source_path` |
| `newsletter_signup_submit` | Reader submits the newsletter form | `source` |
| `newsletter_signup_success` | Resend confirms durable audience capture | `source` |
| `newsletter_signup_error` | Signup validation or backend persistence fails | `source` |

### Fixed-action rule

A My Plan event may identify only an action from the existing recommendation registry. It must never include the answers that produced the action, entered dollar amounts, bill status, medical details, employer details, plan labels, or free text.

## Homepage positioning baseline

The broad-audience homepage was deployed on **July 11, 2026**. Use **July 12 through July 25, 2026** as the first complete 14-day measurement window.

### Fixed homepage navigation dimensions

The `homepage_navigation` event uses only predefined identifiers.

| `navigation_type` | Meaning |
|---|---|
| `hero_action` | One of the two hero actions |
| `starting_path` | One of the four primary visitor pathways |
| `featured_topic` | A topic card selected from the homepage |
| `featured_article` | A featured article selected from the homepage |
| `specialty_hub` | The contextual healthcare-worker specialty link |
| `section_browse` | Browse-all link for topics or articles |
| `closing_cta` | One of the final homepage actions |

The four starting-path `item_id` values are:

1. `retirement_financial_independence`
2. `medical_bill`
3. `medicare_medicaid`
4. `workplace_benefits_insurance`

Do not replace these identifiers during the baseline window. Changing them would fragment reporting.

### Primary reporting questions

1. Which starting path receives the most consented clicks?
2. What percentage of consented homepage views produce any `starting_path` event?
3. Do general-finance paths generate engagement without reducing healthcare-specific pathway use?
4. Which homepage paths are followed by destination-page engagement, `tool_intent_click`, `tool_start`, `next_step_click`, or newsletter signup events in the same session?
5. Do featured general-finance articles receive meaningful selection relative to healthcare-cost content?

### Calculation definitions

Use Google Analytics consented `page_view` events for the homepage denominator so the denominator and custom-event numerator follow the same consent rule.

- **Starting-path click-through rate:** sessions with at least one `homepage_navigation` event where `navigation_type = starting_path`, divided by consented sessions containing a homepage `page_view`.
- **Path share:** events for one starting-path `item_id`, divided by all `starting_path` events.
- **Downstream engagement rate:** sessions with a starting-path event followed by a destination-page view, `tool_intent_click`, `tool_start`, `next_step_click`, or `newsletter_signup_submit` during the same session.
- **Tool start-to-completion rate:** `tool_complete` events divided by `tool_start` events for the same `tool_id`. Do not compare unlike tools without noting their question count and complexity.

Use Vercel Analytics custom events as a cross-check for event volume and deployment health. Do not combine non-consented Vercel pageview totals with consent-gated custom events to calculate a conversion rate.

### Fourteen-day decision rules

The initial window is directional, not statistically conclusive. At the review point:

- keep the subject-based navigation unless there is a clear functional or usability failure;
- do not reverse the broad-audience positioning solely because healthcare paths remain the most popular;
- investigate a starting path if it receives no events despite meaningful homepage traffic;
- inspect destination clarity and internal links before changing homepage labels;
- preserve event identifiers and compare another 14-day window after any material homepage change.

## Interpretation rules

- A pageview is not a successful outcome by itself.
- A tool completion is useful only when paired with next-step or official-source behavior.
- Newsletter success means the contact was durably saved, not merely that the endpoint returned HTTP 200.
- Do not compare completion rates across tools without considering question count and complexity.
- Do not add more tracking fields simply because a dashboard supports them.
- Small early samples should be reported as counts and directional signals, not definitive conversion conclusions.
- Do not infer eligibility, health status, financial condition, or personal intent from a fixed tool event.

## Initial reporting questions

1. Which landing pages generate tool starts?
2. Which tools are started but not completed?
3. Which completed tools generate next-step clicks?
4. Which articles produce tool opens or newsletter signups?
5. Which official-source links are used most often?
6. Which newsletter placements produce durable audience contacts?
7. Which fixed My Plan actions are saved after a completed workflow?

## Release checks

Before merging analytics changes:

1. Run unit tests for consent gating and sensitive-property filtering.
2. Confirm events do not fire under **Necessary only**.
3. Confirm events fire after **Allow analytics**.
4. Confirm no event contains answer-level or numeric user inputs.
5. Confirm analytics failures do not interrupt navigation or form submission.
6. Confirm page locations, destination paths, and link URLs lose query strings and fragments at both the helper and global telemetry boundary.
7. Confirm My Plan analytics contain only fixed recommendation and route identifiers.
8. Check Vercel preview and production runtime errors.
