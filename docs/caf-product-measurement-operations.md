# CAF Product Measurement Operations

**Effective:** July 21, 2026  
**Status:** Measurement foundation  
**Related contract:** `docs/caf-shared-journey-analytics-contract.md`  
**Generator:** `scripts/product-measurement-report.mjs`

## Purpose

Convert privacy-safe journey analytics and Google Search Console exports into a repeatable operating report that answers whether visitors find, start, complete, use, and return to Community Acquired Finance decision systems.

This operating layer exists to prevent three failure modes:

1. building another feature before identifying the current constraint;
2. treating pageviews or impressions as product success;
3. making business or usefulness claims from malformed, duplicated, sensitive, or low-volume analytics.

## Data inputs

### Journey event CSV

Export the governed journey events with only these columns:

- `event_name`
- `journey_key`
- `surface`
- `phase`
- `step_index`
- `variant`
- `session_journey_id`
- `event_count`
- `date` or `event_date`
- `event_timestamp` when available

The report generator fails closed when the export contains a prohibited or non-contract column. It rejects malformed rows rather than silently coercing them into a metric.

### Search Console CSV

Export query-page rows with:

- `Query`
- `Page`
- `Clicks`
- `Impressions`
- `CTR`
- `Position`

The generator groups search queries into directional decision-intent categories: medical bills, insurance denials, compensation, overtime, workplace benefits, Medicare, retirement, and other.

## Generate a report

```bash
npm run measurement:report -- \
  --journey-csv ./private-exports/journey-events.csv \
  --search-console-csv ./private-exports/search-console.csv \
  --out-dir ./artifacts/product-measurement
```

Outputs:

- `caf-product-measurement-report.json`
- `caf-product-measurement-report.md`

Do not commit raw analytics exports. Store them outside the repository or in an access-controlled analytics workspace.

## Metrics

### Entry rate

`journey_started / journey_viewed` by journey and surface.

Use this to identify promise, hierarchy, or first-interaction friction. A low entry rate does not prove the page is poor; it may indicate low-intent acquisition or an informational visit.

### Result completion rate

`journey_result_reached / journey_started` by journey.

Use this to identify form length, confusing questions, technical defects, or an unclear result boundary.

### Action-use rate

Unique sessions with a copied or printed result divided by unique sessions that reached a result when session IDs are available. The report falls back to event occurrences when they are not.

Use this as evidence that a result was portable enough to support a real-world task. It does not prove that the user acted or achieved an outcome.

### Handoff rate

`journey_handoff_opened / journey_result_reached`.

Separate CAF continuation from official verification in the source export through fixed `variant` values. A high handoff rate is useful only when the primary answer appears first.

### Unexpected exit rate

`journey_exited_unexpectedly / journey_started`.

Treat this metric as experimental until production exit instrumentation is proven reliable. Browser closure and route changes are difficult to classify precisely.

### Resume and restart behavior

Review `journey_resume_clicked` and `journey_restarted` together. High restart with low resume can indicate stale state, unclear saved-state language, or a workflow that is not worth continuing.

## Integrity checks

The generator reports:

- rejected malformed rows;
- prohibited or unknown columns;
- exact duplicate candidates;
- repeated terminal-event candidates within the same session and journey;
- the measurement mode used for each rate: unique sessions or event occurrences.

Duplicate candidates require investigation. They are not automatically deleted because a user can legitimately repeat a copy, print, handoff, resume, or restart action.

## Decision thresholds

Do not set universal thresholds before traffic volume is adequate. Use the following as investigation triggers rather than pass/fail scores:

| Pattern | Investigate |
|---|---|
| Views increase while starts remain flat | Search intent, page promise, CTA hierarchy, first-step burden |
| Starts are healthy but results are weak | Question clarity, required inputs, technical errors, workflow length |
| Results are healthy but copy/print is weak | Result hierarchy, portability, action language, artifact quality |
| Copy/print is strong | Unified printable brief, cleaner export, return workflow |
| Restarts materially exceed resumes | Saved-state visibility, expiration, stale state, continuity language |
| Official-source handoffs occur before results | Premature exits or verification links competing with the task |
| Search impressions rise without qualified starts | Search snippet mismatch or weak explainer-to-tool handoff |
| Qualified traffic stays low | Distribution and authority, not another product feature |

## Review cadence

### Release-day certification

- Confirm every intended event fires once in a controlled journey.
- Inspect the production payload after analytics consent.
- Confirm no prohibited data is present.
- Confirm shared and legacy terminal events do not duplicate one interaction.
- Record the release commit and deployment.

### 14-day review

- Entry rate by journey and surface.
- Concierge-to-destination handoff.
- Unexpected exits.
- Route and journey-key mismatches.
- Duplicate-event candidates.
- Official verification timing.

### 28-day review

- Result completion.
- Copy and print use.
- Resume and restart behavior.
- Post-result handoffs.
- Remaining legacy result layouts.
- Evidence-backed product corrections.

### 8-week review

- Returning tool users.
- Repeat completion.
- Search landing page to journey-start quality.
- Whether a unified artifact, reminder utility, or deeper workflow is justified.

## Current external-data boundary

The repository now contains the reporting engine and contract checks, but it does not contain Search Console or analytics credentials. Search Console and GA4 data must be exported or accessed through an approved connector. The reporting engine must not be changed to embed credentials, accept unrestricted analytics dimensions, or store decision content.

## Product decision rule

Do not start another parallel decision tool solely because the roadmap lists it. The next implementation should address:

1. a confirmed instrumentation defect;
2. a high-confidence usability problem;
3. a demonstrated demand for a more portable result;
4. a qualified acquisition gap; or
5. a governing trust, privacy, accessibility, or search defect.
