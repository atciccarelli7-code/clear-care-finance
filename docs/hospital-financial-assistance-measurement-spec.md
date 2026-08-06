# Hospital Financial Assistance measurement specification

Effective date: 2026-08-06

Tool ID: `hospital-financial-assistance-finder`

Canonical tool route: `/tools/financial-assistance-checklist`

## Conversion definitions

- **Start:** first valid step continuation after landing.
- **Completion:** source-backed result/action plan rendered after the review screen.
- **Useful result action:** print, download, official policy/application click, or supporting-resource click after completion.
- **Return session:** the fixed browser marker existed when the tool mounted; it does not identify a person and is not persisted server-side by this product.

## Event contract

| Event | Trigger | Allowed categorical parameters | Business question |
|---|---|---|---|
| `product_landing_view` | Product hub, state hub, policy page, or tool mounts | `event_category`, `tool_id`, fixed `surface_id` | Which discovery surface is reached? |
| `product_return_session` | Tool mounts after its fixed browser marker exists | `event_category`, `tool_id`, fixed `return_state` | Is browser-local repeat use occurring? |
| `tool_started` | First valid step advances | `event_category`, `tool_id`, fixed `step_id` | What share of landing sessions begin? |
| `tool_step_completed` | A valid step advances | `event_category`, `tool_id`, fixed `step_id`; hospital step may send fixed `policy_id` | Where does the guided flow lose users without exposing answers? |
| `tool_abandoned` | Mounted tool unmounts after start and before completion | `event_category`, `tool_id`, fixed `step_id` | At which question category does abandonment occur? |
| `tool_completed` | Result is built | `event_category`, `tool_id`, fixed `policy_id` or `not_listed`, fixed `outcome_id` | How often do starts produce an action plan, and which reviewed hospital records are used? |
| `result_printed` | Print/save-as-PDF selected | `event_category`, `tool_id`, fixed `outcome_id` | Is the plan retained for offline action? |
| `result_downloaded` | Plain-text plan download selected | `event_category`, `tool_id`, fixed `outcome_id`, fixed `format_id=text` | Is the decision brief retained? |
| `tool_result_action` | Copy, reset, or copy-blocked state occurs | `event_category`, `tool_id`, fixed `action_id` | Do users copy the plan or restart without transmitting plan content? |
| `official_source_clicked` | Official policy or evidence source opens | `event_category`, `tool_id`, fixed `policy_id`, fixed `action_id`, fixed `source_id` when present | Do users verify controlling sources? |
| `application_clicked` | Official application opens | `event_category`, `tool_id`, fixed `policy_id`, fixed `action_id` or `surface_id` | Do completed users proceed toward application? |
| `supporting_resource_clicked` | An approved internal bill resource opens | `event_category`, `tool_id`, fixed `destination_path` | Which adjacent task is needed? |
| `missing_information_flag_shown` | Result contains one or more missing-information items | `event_category`, `tool_id`, fixed `missing_state` | How often is the product unable to provide a complete screening? |

## Prohibited parameters

Never transmit household size, income band or amount, insurance status, bill stage, service date/month, patient/provider names, facility free text, bill balance, account or record number, diagnosis, Social Security number, uploaded content, result text, questions, document checklist, phone/address, URL query string, local-storage content, or any unrestricted user string. Do not use analytics to reconstruct a user's healthcare or financial situation.

The global analytics helper remains consent-aware, strips query strings/fragments, rejects sensitive key patterns, and fails without interrupting the tool. Source/policy identifiers are fixed public dataset identifiers, not user-entered provider text.

## Baseline and review indicators

Search baseline is limited to the settled exports described in `docs/audits/2026-08-06-hospital-financial-assistance-query-page-map.md`. Product funnel events are implemented and tested but not yet observed in a connected reporting destination.

| Window | Indicators; no ranking promise |
|---|---|
| 30 days | Intended routes indexed/eligible; branded vs non-branded queries; impressions/clicks/CTR/position by canonical family; starts/landing views; completions/starts; source/application clicks/completions; print/download actions/completions; error and broken-link reports |
| 60 days | Query-to-page overlap; positions 5–20; high-impression/weak-CTR pages; hospital/state selection distribution using fixed IDs; repeat-marker rate; device-level usability problems without sensitive dimensions |
| 90 days | Sustained non-branded discovery, returning use, useful-result-action rate, source maintenance burden, policy expansion candidates, pages to improve/consolidate/redirect, and whether a second state can meet the same source standard |

Below adequate volume, report counts and coverage limitations rather than rates or causal claims. Search Console lag, consent, browser/device clearing, privacy filtering, and blocked analytics mean metrics will not represent every visitor.

## Operating review

1. Export Search Console Queries and Pages for aligned 7-day, 28-day, and 3-month windows.
2. Run the repository measurement workflow described in `docs/caf-product-measurement-operations.md`.
3. Reconcile canonical route families with the query-to-page map before changing URLs.
4. Inspect allowed event keys in the connected analytics debugger/report before using counts.
5. Record the window, denominator, consent boundary, source, and unavailable fields.
6. Create one bounded improvement per review; do not expand the dataset from impressions alone.
