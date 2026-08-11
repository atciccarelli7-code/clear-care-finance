# Pre-Commerce Demand Validation System

**Work ID:** CAF-W-017  
**Date opened:** 2026-08-11  
**Status:** In progress

## 1. Assignment charter

- **Plain-language request:** Build and release the smallest trustworthy way to learn whether qualified CAF users show price-aware interest in genuinely additive premium Benefits value before any payment or infrastructure activation.
- **Actual user outcome:** A Benefits user can complete the free decision workflow, inspect a precise proposed $29 workspace, and intentionally record price-qualified stated intent without a card, checkout, charge, reservation, entitlement, or obligation.
- **Affected audiences:** Healthcare workers using the Benefits Decision System; founder/future operators reading aggregate evidence.
- **Business outcome:** Make the future Stripe/Vercel activation decision depend on numerator-and-denominator evidence instead of technical readiness or page interest.
- **Success metrics:** Qualified offer views, offer engagements, commitment starts, valid observed commitments, completion rates, lifecycle context, and clean observed/release-verification separation.
- **Constraints:** Keep safety information and the complete browser-local workflow free; analytics consent for anonymous events; minimum intentional email only for commitments; no answers, amounts, health/employer/plan data, URLs, free text, payments, entitlement, billing, or broad rollout.
- **Non-goals:** Medicare offer, multiple-price test, new paid product, Stripe activation, Vercel upgrade, premium-platform rebuild, SEO audit, route redesign, or revenue claim.
- **Risk class:** Moderate: public commercial language plus production evidence storage, with commerce remaining fail closed.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | READY Vercel production deployment `dpl_DhXTHUyFoWLNpbuVnpwVEhatj3pP` matches main `d3da388a` | 2026-08-11 | Exact deployment metadata; usage remains sparse |
| GitHub/main | Public Benefits route is free; Total Compensation alone owns the legacy $29 handoff; destination records a v1 offer view without presenting an offer | 2026-08-11 | Repository and production align |
| Supabase | One v1 `benefits_offer_viewed`, zero commitments, zero Benefits journey rows | 2026-08-11 | The single view has unknown provenance and cannot establish demand |
| Security | `growth_events`, `journey_events`, and `benefits_offer_commitments` are service-role-only with forced RLS and no browser policies | 2026-08-11 | Effective grants and constraints rechecked directly |
| Commerce | Premium/Stripe architecture remains private and fail closed | 2026-08-11 | Technical capability is not customer evidence |
| Product reality | Free workflow already includes eight stages, two-plan comparison, verification tasks, and a printable Decision Brief; dormant account workspace supports multiple saved comparisons and deeper option analysis | 2026-08-11 | External auth/persistence still require launch certification |
| Strategy research | CAF should monetize additive organization, persistence, and decision execution rather than public answers | 2026-08-11 | Supported direction, not willingness-to-pay evidence |

## 3. Evidence classification

| Claim | Classification | Source | Limitation |
|---|---|---|---|
| The current v1 denominator is invalid | Verified fact | Canonical route instrumentation and UI | Does not identify the one historical visitor |
| Benefits is the strongest current candidate | Supported inference | Completed free workflow, dormant workspace, existing $29 hypothesis | No paid-customer evidence |
| Keep $29 for one coherent v2 test | Conservative experiment choice | Existing fixed hypothesis; zero contrary evidence | Price is not validated |
| Medicare should not receive an offer now | Conservative precaution | No product-use/offer evidence and higher trust complexity | Revisit only with a concrete additive job and usage |
| Three genuine commitments alone prove demand | Rejected | Stated intent is weaker than payment | Requires denominator and signal-quality guardrails |

## 4. Context, inherited-decision challenge, and anti-blindness

Active decisions preserved: CAF-D-003, D-005, D-010, D-014, D-015, D-016. The inherited $29 v1 experiment was an unproven experiment, not a founder mandate. Its implementation passed technical checks but stopped testing a coherent proposition after the public product became free. The one historical view is preserved as unknown, not relabeled organic. Passing release tests cannot prove business correctness.

| Inherited item | Status | Present impact | Challenge and disposition | Revisit trigger |
|---|---|---:|---|---|
| $29 one-time price | Experiment | 0 commitments / 1 unknown view | Preserve for v2; changing price would add an unsupported variable | Adequate denominator or qualitative rejection |
| Total Compensation placement | Merely implemented | 1 misleading offer handoff | Retire; it precedes the free value being priced and points to a free system | None unless a distinct post-result job exists |
| Canonical route offer-view logging | Incorrect implementation | Inflates denominator without offer exposure | Remove; record only when the post-result offer renders | Any denominator anomaly |
| Email plus two confirmations | Conservative experiment | Stronger signal, some friction | Preserve separate price and follow-up consent; name stated intent accurately | Evidence that email requirement masks otherwise strong engagement |
| Benefits commitment table | Reusable-enough physical store | Zero rows, strong service boundary | Extend minimally for v2 evidence class/exclusion; do not create a parallel platform | Second offer with a justified proposition |

- **Strongest argument against the build:** Traffic may remain too sparse for the system to justify its maintenance.
- **Weakest assumption:** The dormant deeper workspace is deliverable enough to describe before full launch certification.
- **Metric that could improve while the product worsens:** Engagement can rise through curiosity; only explicit price confirmation and denominator context count toward the decision.
- **Evidence that reverses the decision:** Offer misunderstanding, completion drop, security/privacy defect, 50 qualified views with no genuine commitment, or inability to certify the promised workspace.

## 5. Capability and independent role matrix

| Role | Status | Material finding / acceptance test |
|---|---|---|
| Orchestrator | PASS | Bounded to Benefits proposition, evidence, report, release |
| Context steward | PASS | Main, production, database, prior decisions, and research reconciled |
| Capability router | PASS | GitHub, Supabase, Vercel, browser, PDF, and local suite are authoritative |
| Executive strategy | PASS | Learn before buying commerce infrastructure |
| Product management | PASS | Free system stays complete; paid job is additive saved multi-decision execution |
| Healthcare user research | PASS | Offer follows a meaningful result and preserves official verification |
| Information architecture | PASS | One post-result offer, no sitewide CTA expansion |
| UX and design system | PENDING | Details and commitment are progressively disclosed and mobile-safe |
| Content and evidence integrity | PASS | No safety claim or free-core restriction changes |
| Frontend engineering | PENDING | Result placement, consent behavior, deduplication, and error states tested |
| Systems architecture | PASS | Fixed offer registry and fixed event contract are the reusable seam |
| Backend, data, and security | PENDING | Same-origin, exact payload, honeypot, service role, RLS, constraints, duplicates |
| Platform and DevOps | PENDING | Exact-head preview/production readiness and runtime evidence |
| SEO and discovery | PASS | No route, canonical, schema, sitemap, or indexability change |
| Monetization and conversion | PASS | $29 is a price hypothesis; intent is not purchase/revenue |
| Analytics and experimentation | PENDING | Rates require distinct qualified sessions and observed-only commitments |
| Accessibility, performance, reliability | PENDING | Keyboard, live status, desktop/mobile, print, axe, runtime |
| Privacy, legal, user protection | PASS | Anonymous events require analytics consent; commitment retains intentional minimum |
| Publishing and governance | PENDING | Work packet, dictionaries/ledgers, PR, release record |
| Quality and release | PENDING | Full suite, preview, production API/database cleanup |
| Adversarial red team | PASS | Synthetic/founder/friend traffic must be excludable and never called organic |
| Process improvement | PASS | One SQL report and trigger rule replace dashboard work |

## 6. Executive accountability matrix

| Perspective | Status | Finding and consequence |
|---|---|---|
| CEO / Strategy | PASS | Activation follows market evidence, not platform availability |
| COO | PASS | One operational query and explicit triggers minimize ongoing work |
| CFO | PASS | Spend is rational only after qualified views plus 3–5 genuine signals and deliverability |
| CRO | WARN | Stated intent cannot establish conversion or revenue |
| CPO | PASS | The paid job is persistence/deeper comparison, not the existing free brief |
| CTO | PASS | Reuse existing secure store; keep Stripe and entitlements unchanged |
| Data and Analytics | PENDING | Observed/test/unknown must remain separable with exact denominators |
| Marketing and Discovery | PASS | Offer is not placed on unqualified discovery surfaces |
| Editorial and Evidence | PASS | Exact free/paid boundary is public and reviewable |
| Healthcare User Context | PASS | Safety and official verification remain free |
| Privacy / Legal | PENDING | Disclosure and retention contract must match implementation |
| Accessibility / Reliability | PENDING | Progressive disclosure and form must pass browser verification |
| Quality / Release | PENDING | No production claim until exact deployment and cleanup |
| Red Team | PASS | Curiosity, consent suppression, duplicates, and synthetic contamination are explicit caveats |
| Process Improvement | PASS | Stop after one coherent offer and reusable contract |

## 7. Quantified impact and selected implementation

| Measure | Before | Proposed after | Change | Consequence |
|---|---:|---:|---:|---|
| Public routes with paid-demand CTA | 1 unrelated pre-value route | 1 qualified post-result surface | 0 net | Quality improves without CTA growth |
| Canonical Benefits offer-view correctness | 0/1 offer views tied to visible offer | 1/1 | +1 | Denominator becomes interpretable |
| Pre-commerce anonymous states | 2 vague v1 states | 3 decision-useful v2 states | +1 | View, engagement, start are distinct |
| Valid current commitments | 0 | 0 at release | 0 | No manufactured demand |
| Products under active price test | 0 coherent | 1 coherent | +1 | Benefits only; Medicare left alone |
| Payments / live entitlements / billing changes | 0 | 0 | 0 | Commerce boundary preserved |

**Selected loop:** qualified Benefits result → visible v2 $29 workspace offer → details opened → commitment flow opened → email + separate price confirmation + follow-up consent → server-validated stated-intent record.

**Proposition:** Free: complete browser-local eight-stage workflow, two-medical-plan comparison, unknowns, verification checklist, Decision Brief, print, official-source use. Proposed $29 one-time: account-based cross-device saving, multiple named decision workspaces, deeper two-option compensation/benefits/health-plan/retirement/schedule comparison, structured verification ledger, and consolidated advanced brief.

**Decision rule:** Consider—not automatically activate—real checkout after at least 25 observed qualified offer-view sessions, at least 3 genuine active non-founder/non-friend/non-test commitments (5 is stronger), at least a 10% commitment/view rate, credible upstream result use, and a certifiably deliverable workspace. At 50 qualified views with zero genuine commitments, do not activate; inspect proposition/value defects. All rates are `numerator / qualified offer views`; commitment completion is `valid commitments / commitment starts`.

## 8. Slices, release gates, and rollback

| Slice | Acceptance criteria | Owner lens |
|---|---|---|
| Retire v1 inconsistency | No pre-value $29 handoff; no route-level offer view | Product/IA |
| v2 contract and UI | Exact fixed offer; consent-gated deduped anonymous states; explicit commitment | Product/data/frontend |
| API and database | Exact server validation; honeypot; duplicates do not inflate; observed/test/excluded separable; service-only forced RLS | Backend/privacy |
| Operational report | No-data row, numerator/denominator rates, dates, lifecycle context, caveats | Analytics/operations |
| Validation and release | Full suite, browser/axe/mobile/desktop, preview, production API, cleanup, exact counts | Quality/platform |

Rollback is a code revert plus stopping v2 event/commitment acceptance; retain collected consented records until an explicit retention/deletion decision. No Stripe, Vercel billing, entitlement, route, SEO, or claim rollback is required.

### Technical validation

- **Status:** PENDING

### Business validation

- **Status:** WARN until genuine post-release evidence accumulates. The system can be correct while demand remains unknown.

### Anomaly gate

- [x] Technical success could be mistaken for business validation. Mitigation: release counts must remain zero/sparse and the closeout must distinguish organic, synthetic, and unknown.
- [x] Necessary-only consent suppresses anonymous denominators while an intentional commitment can still be recorded. Mitigation: report consented-session scope and never divide commitments by all traffic.
- [ ] No major site surface, indexable inventory, free functionality, or safety information is reduced.

### Stop condition

After a coherent Benefits loop, reusable fixed contract, operational report, production verification, and synthetic cleanup, stop. Do not add Medicare, another price, checkout, or another monetization build.
