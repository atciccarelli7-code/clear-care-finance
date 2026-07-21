# CAF Journey Integrity System — July 20, 2026

## Executive diagnosis

Community Acquired Finance had strong destination tools but an unreliable transition layer. The homepage Decision Concierge called its routing card a result, then offered a primary route and a competing secondary route. The visitor's original question disappeared after navigation. One patient/caregiver path routed to the broad `/patients-families` gateway rather than the canonical Hospital & Patient Guide. `/start-here` also presented the Financial Navigator and Financial Foundation Checkup as consecutive primary experiences, obscuring the page's main job.

The failure was therefore not a missing-content problem. It was a **promise, ownership, and continuity problem**:

1. Entry copy promised help but did not define the output.
2. Routing completion was visually similar to a terminal answer.
3. The destination did not know or display the question that initiated the visit.
4. Secondary resources competed with the experience responsible for the result.
5. Start Here combined a primary action-plan builder with a second assessment without an explicit boundary.

## Journey contract

A guided entry point must now establish:

- one fixed user goal;
- one canonical destination that owns the result;
- one plain-English description of the result expected at that destination;
- one privacy-safe handoff stored only in session storage;
- one visible continuity banner at the exact destination route;
- optional supporting resources only after the core destination is identified;
- no answers, dollar values, health information, document content, or query-string state.

The Decision Concierge is explicitly a three-step router, not an answer engine. Its contract is:

> Choose one question. Finish one complete experience.

## Baseline journey inventory

| Entry | Promised question | Baseline destination | Baseline classification | Decision |
|---|---|---|---|---|
| Homepage Concierge → workplace benefits | Review a complete benefits package | Benefits Command Center | Mostly complete; context-losing handoff | Preserve canonical tool; add expected output and continuity context |
| Homepage Concierge → health-plan comparison | Compare total plan cost | True Cost Calculator | Mostly complete; context-losing handoff | Preserve canonical tool; add expected output and continuity context |
| Homepage Concierge → benefit changes | Identify material annual changes | Benefits Change Detector | Mostly complete; competing optional route | Preserve canonical tool; demote Command Center to optional follow-up |
| Homepage Concierge → retirement contribution | Estimate contribution and match | 403(b) Paycheck Calculator | Mostly complete; broad secondary hub competed | Preserve calculator; label broader wealth sequence optional |
| Homepage Concierge → medical bill | Identify document and next action | Medical Bill Review Toolkit / Response System | Mostly complete; router result did not define terminal output | Preserve canonical system; promise document-specific route and next three actions |
| Homepage Concierge → patient/caregiver help | Help with a hospital or family problem | `/patients-families` | **Confusing / unnecessary hub handoff** | Route directly to `/patients-families/hospital-guide` |
| Homepage Concierge → Medicare/Medicaid | Identify possible program pathway | Eligibility Check | Mostly complete; context-losing handoff | Preserve screener and official agency handoff; keep original goal visible |
| Homepage Concierge → not sure | Build a broad starting plan | `/start-here` | Mostly complete; destination contained two primary experiences | Make Financial Navigator the primary job; gate Checkup as optional follow-up |
| `/start-here` | Build a prioritized plan | Navigator followed immediately by Checkup | Duplicative / excessively long | Preserve both products, but require explicit opt-in before the optional Checkup |
| Tool result → related resources | Continue learning | Articles, hubs, or another tool | Variable; potential nested journey | Existing result tools remain authoritative; related resources must remain optional |

## Information-architecture decisions

### Canonical journeys preserved

- Benefits Command Center
- Open Enrollment True Cost Calculator
- Benefits Change Detector
- 403(b) Paycheck Calculator
- Roth vs Traditional Decision Helper
- Medical Appointment Cost Preparation
- Medical Bill Review Toolkit / Medical Bill Response System
- Turning 65 Medicare Pathway
- Medicare and Medicaid Eligibility Check
- Debt vs Retirement Router
- Healthcare Worker Total Compensation Comparison
- Financial Navigator

### Canonical journey changed

Patient/caregiver help now routes directly to the Hospital & Patient Guide rather than the broad Patients & Families gateway.

### Routes preserved

No canonical URL, sitemap entry, redirect, indexed article, tool route, or Search Console target was removed.

### Routes redirected

No HTTP redirects were added. The change is an entry-point routing correction inside the Concierge.

### Nested-journey control

The Concierge now presents exactly one primary destination. Existing secondary links are shown under **Optional after the core result** and do not receive journey context.

### Start Here ownership

`/start-here` has one primary purpose: build and save a prioritized Financial Navigator action plan. The Financial Foundation Checkup remains available but does not render until the visitor explicitly opens the optional follow-up.

## Privacy and persistence

Journey context contains only fixed publisher-authored values:

- journey ID;
- entry surface;
- goal ID;
- publisher-authored goal label;
- exact canonical destination path;
- publisher-authored expected outcome.

Context is stored in `sessionStorage`, not local storage, analytics, URL parameters, metadata, or server storage. It expires with the browser tab and can be ended explicitly. The validator rejects query strings, fragments, malformed identifiers, HTML-like text, and unknown structures.

## Result ownership

The continuity banner does not claim to be the answer. It tells the visitor:

- the original question;
- that the visitor is still inside the same journey;
- the result the destination is responsible for delivering.

The destination tool or guide remains responsible for its direct answer, prioritized actions, limitations, and official verification handoff.

## Analytics posture

Existing fixed-ID, consent-gated events remain the controlling funnel:

- `concierge_viewed`
- `concierge_started`
- `concierge_category_selected`
- `concierge_completed`
- `concierge_destination_opened`
- destination-specific start, step, completion, result-action, and handoff events

No answer values or journey-context text are added to analytics. The 14-day review should compare Concierge completion with destination starts. The 28-day review should compare destination starts with terminal result/completion events and official-source or result-action events.

## Acceptance checks

Automated checks must prove:

- fixed choices only;
- the original goal remains visible before navigation;
- one primary destination owns the result;
- the patient/caregiver path bypasses the broad hub;
- journey context contains no answers or query strings;
- malformed storage fails closed;
- context is limited to the exact destination path;
- Start Here does not render the optional Checkup by default;
- existing route and destination validation remains green.

Browser review must cover the Concierge on mobile and desktop, destination continuity, Start Here primary flow, keyboard focus on the routing result, back controls, reset behavior, and absence of horizontal overflow or runtime errors.

## Known limitations

This sprint repairs the shared entry and route-handoff layer. It does not redesign every mature destination workflow. Existing destination-specific completion events and tests remain responsible for proving terminal results. Any destination that later fails its own completion funnel should be repaired in that canonical tool rather than by adding another upstream route or duplicate questionnaire.

## Measurement dates

- 14-day review: August 3, 2026
- 28-day review: August 17, 2026

Review the ratio of Concierge destination opens to destination starts and destination starts to result completions before adding new guided entry points.
