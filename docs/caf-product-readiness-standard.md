# CAF Product Readiness Standard

**Program:** CAF Product Readiness and Scale Program  
**Owner:** Community Acquired Finance  
**Initial effective date:** July 13, 2026  
**Parent issue:** #153

## Purpose

Community Acquired Finance is a healthcare financial-decision product, not a route-count or calculator-count project. A page is not ready merely because it renders, has a canonical URL, or passes a unit test. It is ready when the intended visitor can understand the problem, complete the relevant decision task, receive a useful and qualified action artifact, verify the controlling facts, and continue safely.

The standard product pattern is:

> Identify the decision → ask only what matters → explain the result → produce a practical action artifact → identify what must be verified → create a reason to return.

## Route roles

Every canonical route must have one primary role.

| Role | Definition | Required evidence |
|---|---|---|
| Flagship product | A complete high-value decision journey that can activate, help, and retain a visitor | End-to-end interaction, meaningful result, verification, continuity, analytics, tests, production ownership |
| Supporting tool | A focused calculation, checklist, or helper used inside a broader journey | Clear scope, canonical handoff into and out of the tool, safe result, tests |
| Educational guide | Explains a concept or process without pretending to complete the whole decision | Direct answer, source support, related action route, freshness ownership |
| Acquisition article | Targets a defined search intent and deliberately hands the visitor into a decision journey | Intent match, structured answer, internal CTA, source and date governance |
| Topic or directory page | Helps visitors discover authoritative routes without duplicating their work | Clear taxonomy, canonical destinations, no dead-end cards |
| Trust/legal page | Explains editorial, privacy, accessibility, disclosure, or terms boundaries | Accurate reflection of implementation, review ownership, ad-free protection |
| Organization/commercial page | Describes a bounded buyer-facing offer without overstating maturity | Real demonstrable product, explicit limitations, privacy boundary, no invented customers or ROI |
| Consolidate | Useful material exists but should be absorbed into a stronger canonical route | Migration plan, preserved links, no duplicated search intent |
| Redirect | A legacy or competing route should resolve permanently to one canonical destination | Permanent redirect, sitemap exclusion, no internal redirect hops |
| Retire from navigation | Content may remain accessible but should no longer compete for primary attention | Removal rationale and retained canonical behavior |
| Noindex | A route is necessary operationally but should not enter search results | Explicit reason, robots enforcement, no accidental sitemap inclusion |

## Readiness dimensions

Each journey is scored across 14 dimensions. Each dimension receives 0, 1, or 2 points.

- **0 — absent or materially unsafe:** the visitor cannot complete the intended job, the route is misleading, or a critical control is missing.
- **1 — usable but incomplete:** useful functionality exists, but the visitor can become stranded or the release lacks evidence.
- **2 — complete for current scope:** the journey meets the applicable requirements and has production evidence.

Maximum score: **28**.

### 1. Problem and promise

A ready journey:

- states the real user problem in plain language;
- identifies the intended audience;
- distinguishes education, calculation, screening, comparison, or verification;
- avoids promises it cannot support;
- gives a realistic completion-time estimate where applicable.

### 2. Activation

A ready journey:

- provides a visible start action;
- explains what the visitor should have available;
- uses the minimum required questions;
- supports `Not sure` or incomplete states;
- does not require the visitor to know technical terminology before starting.

### 3. Interaction and accessibility

A ready journey:

- is mobile-first;
- works by keyboard;
- uses native controls or correct accessible semantics;
- manages focus after state-changing actions;
- does not rely on color alone;
- avoids horizontal overflow;
- supports screen-reader comprehension and reduced-motion preferences where relevant.

### 4. Deterministic logic and assumptions

A ready journey:

- produces the same result from the same inputs;
- keeps rules reviewable in code;
- makes uncertainty visible;
- separates entered facts, assumptions, estimates, and controlling facts;
- does not create an opaque or generative recommendation layer.

### 5. Result usefulness

A ready journey ends with a practical artifact, such as:

- Decision Receipt;
- Benefits Receipt;
- comparison;
- prioritized action plan;
- checklist;
- call and deadline tracker;
- calculation with interpretation;
- state or agency routing plan.

The result must do more than restate answers.

### 6. Verification and professional boundaries

A ready journey:

- names the documents, agencies, plans, employers, providers, or professionals that control;
- links to current primary sources where policy-dependent;
- provides specific verification questions;
- never claims official eligibility, coverage, authorization, tax treatment, legal rights, billing liability, medical necessity, plan selection, or investment suitability when it cannot determine those facts;
- uses shared disclaimers without relying on disclaimers as a substitute for safe product behavior.

### 7. Continuity and return value

A ready flagship journey provides at least one appropriate continuation mechanism:

- safe My Plan action;
- bounded local resume state;
- local history;
- next-review reminder;
- related canonical journey;
- copy, print, or canonical sharing;
- explicit reset and deletion controls.

Returning-user summaries must expose only safe categorical status, never sensitive answers or values.

### 8. Privacy and data minimization

A ready journey:

- requests only the information required for the decision;
- avoids names, employer/plan/provider identifiers, diagnoses, claim/member/account numbers, Social Security numbers, and unrestricted notes unless a future reviewed system explicitly requires them;
- uses versioned and defensively parsed local storage when persistence is needed;
- keeps answers and values out of URLs, query strings, metadata, structured data, analytics, logs, and errors;
- provides clear reset and deletion controls.

### 9. Measurement

A ready flagship journey has privacy-safe events for the applicable funnel:

- viewed;
- started;
- completed;
- result or Receipt generated;
- useful action taken;
- related journey opened;
- resumed, reset, or deleted where applicable.

Events must be consent-gated and use enumerated event names and fixed categorical properties. Implementation, automated testing, and actual production observation must be reported separately.

### 10. Sources, dates, and maintenance

A ready journey:

- uses primary official sources for changing policy claims;
- shows review date and effective year where relevant;
- is covered by freshness checks;
- has an identified owner and review trigger;
- explains when the user must verify current plan or state rules.

### 11. Search and discovery

A ready canonical route:

- is registered in the authoritative route and SEO systems;
- has a unique title, description, canonical, robots directives, H1, breadcrumb, and appropriate structured data;
- contains meaningful prerendered content;
- appears in the sitemap when indexable;
- has inbound internal links;
- does not compete with a duplicate route for the same search intent;
- has an acquisition page or Concierge entry when it is a flagship product.

### 12. Advertising and commercial independence

A ready sensitive journey:

- remains ad-free during input, output, Receipt, My Plan, and print;
- is not influenced by sponsor or affiliate compensation;
- does not rank plans, carriers, providers, employers, or products for commercial benefit;
- follows the route-aware ad allowlist and conflict policies.

### 13. Test and release evidence

A ready journey has applicable evidence for:

- deterministic rules;
- rendered behavior;
- malformed or incomplete state;
- privacy and analytics allowlists;
- accessibility semantics;
- copy, print, share, reminder, reset, or deletion actions;
- TypeScript, blocking lint, publication/trust/freshness checks, production build, bundle budget, prerender, sitemap, and search readiness;
- exact-head Vercel preview and production verification.

A 200 response or prerendered HTML alone is not interaction evidence.

### 14. Production ownership

A ready journey has:

- canonical owner and route;
- known rollback path;
- runtime-error review;
- source-review trigger;
- correction process;
- support/feedback route;
- a measurement decision gate before major expansion.

## Score interpretation

| Score | Classification | Required action |
|---:|---|---|
| 25–28 | Complete | Maintain, measure, and improve only from evidence unless a critical issue appears |
| 20–24 | Usable but incomplete | Address the highest-leverage missing continuity, analytics, sourcing, or interaction evidence |
| 14–19 | Weak | Do not feature as a flagship until the journey is completed or consolidated |
| 8–13 | Duplicative or risky | Consolidate, redirect, remove from navigation, or redesign within an authoritative journey |
| 0–7 | Unsupported by current strategy | Do not expand; retire or preserve only when legally/operationally necessary |

A route may be classified **risky** regardless of numeric score when it creates a material privacy, legal, accessibility, security, or unsupported-claim problem.

## Flagship release gate

A journey may be represented as a flagship product only when:

- it scores at least 25;
- no applicable dimension is scored 0;
- privacy, professional-boundary, accessibility, and ad-protection requirements pass;
- exact-head CI and Vercel preview pass;
- at least one real state-changing interaction is verified in a production build or exact deployment;
- production is verified after merge;
- analytics status is reported honestly as implemented, tested, observed, or unavailable.

## Scale stages

### First 1,000 meaningful monthly users

Required:

- no critical production defects;
- verified analytics and indexing;
- top journeys complete;
- correction and privacy support process;
- production smoke coverage;
- controlled beta feedback.

### 10,000 monthly users

Additional requirements:

- weekly operating review;
- repeatable distribution and newsletter operations;
- support triage and response ownership;
- stronger automated browser checks;
- first validated buyer or revenue experiments;
- documented third-party failure fallbacks.

### 100,000 monthly users

Additional requirements:

- formal observability and incident ownership;
- dedicated editorial and source-review cadence;
- security and privacy review of high-volume forms and vendors;
- commercial conflict controls;
- business-continuity and recovery procedures;
- infrastructure changes justified by measured load, not speculation.

## Governance

This document is the controlling product-readiness rubric for Issue #153. Existing route-specific specifications remain authoritative for calculation and decision logic. When standards conflict, privacy, legal/professional boundaries, accessibility, and production reliability take precedence over growth or monetization.