# CAF Phase 3 — Benefits Decision System Demand Validation

## 1. Assignment charter

- **Request:** Continue the approved phased transformation by releasing the bounded $29 early-access demand test without enabling checkout.
- **User outcome:** A healthcare worker can review the full proposed product boundary and explicitly signal serious willingness to consider a $29 one-time purchase.
- **Business outcome:** Replace generic product interest with a price-qualified behavioral signal before further product completion or commerce activation.
- **Non-goals:** Payment collection, account activation, entitlements, document upload, product completion, subscriptions, multiple paid offers, or a revenue forecast.
- **Risk class:** Moderate privacy, measurement, and reputation risk; payment risk remains blocked.

## 2. Current-state evidence

- Phase 1 established the free-core and single-paid-flagship architecture.
- Phase 2 reorganized the public site while preserving free tools, public routes, and disabled checkout.
- Linear AND-102 defines the approved $29 validation thresholds.
- The premium system has a fail-closed account, checkout, entitlement, and workspace foundation, but live commerce remains unauthorized.
- Employer benefits guides establish decision complexity and product requirements, not willingness to pay.

## 3. Evidence classification

| Input | Classification | Limitation |
|---|---|---|
| Founder-approved phase sequence | Founder confirmation | Does not establish market demand |
| Existing premium foundation | Direct current evidence | Does not authorize public access or payments |
| Employer benefits packets | Primary source for plan complexity | Does not prove product value or price acceptance |
| $29 price | Hypothesis | Requires qualified commitment behavior |
| One high-intent source route | Supported inference | Traffic may remain too low for a decision |
| Analytics-consented offer views | Direct but partial behavioral evidence | Not representative of all visitors or verified people |

## 4. Context and decision memory

- Preserve the platform mission for healthcare workers, patients, and caregivers.
- Keep one paid flagship only.
- Keep basic education, deadlines, official links, public calculators, and public-interest patient resources free.
- Paid value is coordination, persistence, source status, scenario comparison, verification, and a final decision brief.
- The initial funnel must not be confused with a purchase, reservation, or entitlement.

## 5. Inherited-decision challenge gate

- **One source route:** selected to prevent uncontrolled traffic mixing and improve denominator meaning.
- **Noindex offer:** selected because this is a bounded validation surface, not a mature search destination.
- **Email commitment:** stronger than a CTA click, weaker than payment; appropriate before commerce activation.
- **$29 one-time:** retained as the founder-approved test hypothesis, not presented as validated pricing.
- **No document upload:** retained because structured manual entry is sufficient for the first product and materially safer.

## 6. Capability plan

| Need | System |
|---|---|
| Implementation, tests, PR, release | GitHub |
| Experiment scope and decision gate | Linear AND-102 |
| Contact and fixed commitment storage | Supabase |
| Product-specific confirmation email | Resend integration |
| Preview and production deployment | Vercel |
| Durable strategy and measurement record | Notion, Drive, repository docs |
| Stripe status | Non-change verification only |

## 7. Independent role matrix

| Role | Status | Finding |
|---|---|---|
| Strategy | PASS | The test directly serves the single-flagship decision. |
| Product | PASS | Price, scope, outcome, exclusions, and free alternatives are visible before commitment. |
| Healthcare user context | PASS | The workflow reflects documented benefits complexity without requesting plan data. |
| Information architecture | PASS | One high-intent handoff avoids sitewide commercial pressure. |
| UX/accessibility | PASS pending exact-head certification | Two confirmations create deliberate rather than accidental interest. |
| Editorial/evidence | PASS | Claims distinguish proposed features from current availability. |
| Frontend | PASS pending exact-head certification | Offer code is isolated from ordinary route bundles. |
| Backend/data | PASS | Server validates exact offer metadata and stores a bounded record. |
| Security/privacy | PASS | Forced RLS, service-role-only access, no policies, no sensitive fields. |
| SEO | PASS | Controlled noindex prerender; no sitemap entry. |
| Monetization | PASS as experiment | Measures price-qualified intent without collecting money. |
| Analytics | WARN | Consent-gated denominator may be small or nonrepresentative. |
| Operations | WARN | Email delivery and unsubscribe require ongoing observation. |
| Quality/release | WARN until final runs | Merge blocked until exact-head checks and preview pass. |
| Red team | PASS | No checkout, cards, accounts, entitlements, uploads, or free text. |

## 8. Executive accountability matrix

| Perspective | Status | Consequence |
|---|---|---|
| CEO | PASS | Converts strategy into a measurable market question. |
| COO | PASS | Self-serve, bounded form limits manual support. |
| CFO | WARN | No revenue, CAC, margin, or LTV inference is permitted. |
| CRO | PASS | Commitment requires price exposure and explicit confirmation. |
| CPO | PASS | Test informs whether Phase 4 deserves further investment. |
| CTO | PASS | Reuses current stack and preserves fail-closed commerce. |
| Data | WARN | Report numerator and denominator; never call this purchase conversion. |
| Marketing | PASS | One contextual handoff protects the free experience. |
| Privacy/legal | PASS | Exact collection and non-collection boundaries are disclosed. |
| Quality | WARN until final release | Exact-head and production evidence remain mandatory. |

## 9. Anti-blindness findings

- The strongest argument against release is that email willingness may overstate actual purchase behavior.
- The weakest assumption is that visitors understand the proposed value well enough to answer the $29 question.
- A high CTA-open rate with no commitments would indicate curiosity, not demand.
- A low denominator cannot be treated as rejection.
- A passing commitment threshold justifies continued product work, not immediate live checkout.

## 10. Quantified impact

| Measure | Before | After release |
|---|---:|---:|
| Price-qualified offer pages | 0 | 1 controlled noindex route |
| High-intent offer source routes | 0 | 1 |
| Purchasable products | 0 | 0 |
| Checkout-enabled products | 0 | 0 |
| Public tools paywalled | 0 | 0 |
| Sensitive product-input fields | 0 | 0 |
| Commitment tables | 0 | 1 service-role-only table |
| New fixed anonymous events | 0 | 2 |

## 11. Anomaly gate

- The experiment introduces contact storage but no payment or benefits data.
- The offer route remains outside the sitemap and ad inventory.
- The total-compensation route receives one replacement endcap owner rather than another stacked CTA.
- The main bundle budget initially regressed and was corrected by route-specific dynamic loading.
- Any active checkout response, sitemap inclusion, public database privilege, or sensitive payload is a release blocker.

## 12. Candidate work ranking

1. Bounded $29 commitment test — selected.
2. Generic waitlist without price — rejected as weak evidence.
3. Stripe test checkout exposed publicly — rejected as premature and commercially confusing.
4. Complete the product before validation — deferred.
5. Promote the offer sitewide — rejected for the initial experiment.

## 13. Integrated decision

Release one noindex offer page from one high-intent route. Count only explicit price-qualified commitments. Keep free resources intact and commerce fail closed. Use the approved sample and stop/continue rules before materially expanding product work.

## 14. Validation dispositions

### Technical

- Unit and contract suite: pending final exact-head run.
- Database migration: applied and directly verified.
- RLS/grants/policies: verified service-role only, forced RLS, zero policies.
- Test insert: succeeded inside rollback transaction; zero retained test rows.
- Build/performance: main bundle regression corrected; final confirmation pending.
- Browser/accessibility: pending final exact-head run.
- Preview/runtime: pending final exact-head deployment.

### Business

- Offer clarity: PASS based on implementation review.
- Demand: unresolved until threshold.
- Price: unresolved until threshold and later payment behavior.
- Support burden: unresolved until Phase 4 usability evidence.
- Revenue readiness: BLOCKED by design.

## 15. Implementation slices

- Offer page and form
- Single high-intent contextual handoff
- Noindex SEO and deployment controls
- Fixed anonymous evidence events
- Service-role-only commitment endpoint and table
- Confirmation and unsubscribe handling
- Privacy addendum
- Unit, migration, smoke, browser, accessibility, and fail-closed checks

## 16. Release gates

- [x] Exact $29 price and proposed outcome visible.
- [x] Free-versus-paid boundary visible.
- [x] Two explicit confirmations required.
- [x] No checkout, cards, account, entitlement, or product access.
- [x] No sensitive benefit, medical, financial, employer, upload, or free-text fields.
- [x] Forced RLS and service-role-only grants verified.
- [x] Test database insert rolled back and production count returned to zero.
- [x] Offer excluded from sitemap and given noindex/noarchive controls.
- [ ] Final exact-head CI passes.
- [ ] Final browser certification passes.
- [ ] Exact-head preview is READY and inspected.
- [ ] No unresolved review thread.
- [ ] Production deployment and smoke checks pass.

## 17. Executive closeout

Phase 3 changes the ability to measure price-qualified demand, not the availability of a product for sale. After release, AND-102 remains In Progress while the 28-day window runs. Phase 4 should proceed only after the experiment produces a supported decision or the founder explicitly accepts the additional speculative investment.

## 18. Compounding closeout

- Reusable fixed-offer evidence contract created.
- Reusable service-role-only commitment pattern created.
- Privacy disclosure distinguishes anonymous evidence from intentional contact submission.
- Route-specific code loading prevents experiments from degrading the full site.
- Measurement plan prevents generic clicks from being misreported as demand.
- Reassessment occurs at the AND-102 thresholds or immediately after a safety defect.
