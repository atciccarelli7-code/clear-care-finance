# Privacy-Safe Measurement Plan

## Purpose

Measure whether visitors find useful answers, continue to the next relevant resource, and join the owned email audience without recording the financial, medical, insurance, eligibility, disability, household, or benefits information they enter.

## Consent rule

Custom behavioral events are sent only after the visitor selects **Allow analytics**. The canonical helper is `src/lib/analytics.ts`.

The helper sends the same sanitized event to Vercel Analytics and Google Analytics. Analytics failures must never interrupt a tool, article, form, or navigation action.

## Never collect in custom events

Do not send:

- email addresses or names;
- age, state, ZIP code, household size, income, wages, salary, or balances;
- medical conditions, diagnoses, disability status, pregnancy status, or care details;
- tool answers, result categories, eligibility pathways, denial reasons, or plan choices;
- premiums, deductibles, out-of-pocket maximums, HSA amounts, contribution rates, or debt amounts;
- free-text user input;
- URL query strings or fragments.

The analytics sanitizer removes property keys associated with these categories and strips query strings and fragments from URLs.

## Core event taxonomy

| Event | Purpose | Safe properties |
|---|---|---|
| `tool_intent_click` | Visitor selects a problem from the tools directory | `tool_id`, `tool_label` |
| `tool_jump_select` | Visitor uses the tools jump menu | `tool_id`, `tool_label` |
| `tool_start` or legacy `calculator_start` | Visitor begins interacting with a tool | `tool_id`, `tool_label` |
| `tool_complete` | Visitor reaches a completed tool result | `tool_id`, `tool_label` |
| `tool_result_action` | Visitor copies, prints, restarts, or opens a next step | `tool_id`, `tool_label`, `action` |
| `next_step_click` | Visitor follows a related article, tool, or hub card | `link_text`, `link_url`, `source_path` |
| `official_source_click` | Visitor opens an official source | `source_name`, `link_url`, `source_path` |
| `newsletter_signup_submit` | Reader submits the newsletter form | `source` |
| `newsletter_signup_success` | Resend confirms durable audience capture | `source` |
| `newsletter_signup_error` | Signup validation or backend persistence fails | `source` |

## Interpretation rules

- A pageview is not a successful outcome by itself.
- A tool completion is useful only when paired with next-step or official-source behavior.
- Newsletter success means the contact was durably saved, not merely that the endpoint returned HTTP 200.
- Do not compare completion rates across tools without considering question count and complexity.
- Do not add more tracking fields simply because a dashboard supports them.

## Initial reporting questions

1. Which landing pages generate tool starts?
2. Which tools are started but not completed?
3. Which completed tools generate next-step clicks?
4. Which articles produce tool opens or newsletter signups?
5. Which official-source links are used most often?
6. Which newsletter placements produce durable audience contacts?

## Release checks

Before merging analytics changes:

1. Run unit tests for consent gating and sensitive-property filtering.
2. Confirm events do not fire under **Necessary only**.
3. Confirm events fire after **Allow analytics**.
4. Confirm no event contains answer-level or numeric user inputs.
5. Confirm analytics failures do not interrupt navigation or form submission.
6. Check Vercel preview and production runtime errors.
