# Community Acquired Finance Platform Consolidation Release

Date: July 16, 2026

## Release objective

Make the site feel smaller and more decisive while preserving its 144-page pre-sprint search and trust foundation. The release establishes one orientation layer, three consumer journeys, focused supporting tools, and a separate organization due-diligence architecture.

## Git and production baseline

- Pre-sprint GitHub `main`: `1f7380a9fbd3ee9bab6031fc75a26403309c09e1`
- Pre-sprint public deployment: `dpl_9tLdBBREi6yZH8vR8xf8m2hXef5S`
- Pre-sprint production source: clean Vercel Git deployment of the same GitHub commit.
- Earlier dirty CLI deployment: `dpl_CQxpm5Ki7XJoTBTvmaVKpQr5anR2`; it had the same application commit but reported local deployment-link artifacts through `gitDirty=1`. The public domain no longer points to it.
- Explicit rollback branch: `rollback/pre-consolidation-2026-07-16`
- Rollback deployment: `dpl_9tLdBBREi6yZH8vR8xf8m2hXef5S`

Rollback method: promote the rollback deployment in Vercel for the fastest artifact rollback, or revert the consolidation merge on GitHub and allow the normal Git deployment to rebuild from committed source.

## Final product hierarchy

1. **Decision Concierge** — a short orientation layer that begins with four broad needs and reveals specific decisions progressively.
2. **Three primary consumer journeys**
   - Workplace benefits and job value → Benefits Command Center.
   - Healthcare costs and medical bills → pre-care preparation, prior authorization, bill review flow, and toolkit.
   - Medicare, Medicaid, and discharge → starting-point check, hub, discharge checklist, and official resources.
3. **Supporting education and tools** — canonical single-purpose tools, topics, articles, and guides remain available through their libraries and journey handoffs.
4. **Organization offering** — a separate executive overview and buyer due-diligence architecture.

## Homepage reduction

Before: thirteen simultaneous Concierge choices, four broad path cards, six topic cards, four article cards, six trust claims, a closing CTA block, newsletter, and an additional Command Center promotion.

After: concise hero, four-category progressive Concierge, three flagship journeys, four concise trust boundaries, three examples of general financial depth, one newsletter, and library links. The homepage no longer imports the full article/topic datasets or renders a second Command Center promotion.

## Benefits tool consolidation decisions

Canonical URLs are preserved; no redirects were added.

| Experience | Distinct job | Consolidation decision |
|---|---|---|
| Benefits Command Center | Integrated package, Receipt, comparison, and local continuity | Primary workplace-benefits destination |
| Healthcare Worker Benefits Blueprint | Goal-first action order before collecting plan values | Keep standalone; hand off to Command Center |
| Employer Benefits Action Plan | Short post-offer or annual-review checklist | Keep standalone; hand off to Command Center |
| Benefits Change Detector | Year-over-year change detection | Keep standalone; hand off to Command Center |
| Open Enrollment True Cost | Fast health-plan cost scenario | Keep standalone for strong single-purpose intent; hand off both directions |
| 403(b) Paycheck Calculator | One contribution-to-paycheck calculation | Keep standalone for search and speed; hand off both directions |
| Total Compensation Comparison | Fast two-job comparison | Keep standalone; use Command Center for full package detail |

The existing route-aware Command Center entry component provides focused-tool-to-integrated-workspace handoffs. The Command Center now links back to each detailed tool by its distinct job.

## Organization architecture

- `/for-organizations` — executive discovery, buyer fit, five categories, live-evaluation difference, concise implementation, limitations, planner, and due-diligence navigation.
- `/for-organizations/programs` — participant pathways and organization deliverables.
- `/for-organizations/implementation` — evaluation, focused program, phased partnership, owners, and five gates.
- `/for-organizations/measurement` — reach, aggregate engagement, usefulness, operations, outcome boundaries, and decisions supported.
- `/for-organizations/trust-procurement` — current capability, scoped review, services not offered, data and certification boundaries.
- `/for-organizations/faq` — buyer questions about data, HIPAA/BAA, certifications, customization, reporting, outcomes, pricing, and support.

All organization pages prohibit PHI, employee or member records, plan documents, names, identifiers, diagnoses, medications, claims, case details, and other sensitive information in the contact path.

## Performance intent

- Preserve route-level lazy loading.
- Keep organization-only code in organization route chunks.
- Remove homepage imports of `ALL_ARTICLES` and `TOPICS`, which previously pulled catalog data into the entry experience.
- Preserve prerendering, structured metadata, route checks, accessibility, and bundle budgets.
- Record lab LCP, CLS, long-task, JavaScript, total transfer, and request-count results from the existing production-style performance suite. These are lab guardrails, not field Core Web Vitals claims; INP requires field or supported interaction-observer evidence.

## Post-consolidation performance evidence

The production-style 390 x 844 mobile Chromium suite passed all six route groups. The homepage comparison uses the previously recorded controlling baseline in `docs/route-performance-governance.md`; it is directional lab evidence, not a field-Core-Web-Vitals claim.

| Homepage metric | Pre-sprint baseline | Post-consolidation | Change |
|---|---:|---:|---:|
| LCP | 540 ms | 404 ms | -136 ms |
| CLS | 0 | 0 | no change |
| Long-task proxy | 211 ms | 153 ms | -58 ms |
| JavaScript | 346,595 bytes | 209,001 bytes | -137,594 bytes |
| Total transfer | 364,101 bytes | 226,596 bytes | -137,505 bytes |
| Requests | 47 | 32 | -15 |

Post-consolidation route results:

| Route group | LCP | CLS | Long-task proxy | JavaScript | Total transfer | Requests |
|---|---:|---:|---:|---:|---:|---:|
| Entry hub | 404 ms | 0 | 153 ms | 209,001 B | 226,596 B | 32 |
| Flagship journey | 244 ms | 0 | 154 ms | 236,242 B | 253,837 B | 40 |
| Calculator/workspace | 456 ms | 0 | 206 ms | 214,688 B | 232,283 B | 34 |
| Article/topic | 556 ms | 0 | 385 ms | 524,020 B | 560,603 B | 34 |
| Medicare/cost hub | 516 ms | 0 | 229 ms | 177,563 B | 195,158 B | 22 |
| Trust/legal | 276 ms | 0 | 100 ms | 162,305 B | 179,900 B | 12 |

## Claims boundary

This release does not claim complete WCAG conformance, HIPAA compliance, BAA readiness, SOC 2 or HITRUST certification, guaranteed savings, ROI, improved retention or benefits elections, claims reduction, eligibility, coverage, legal compliance, or clinical outcomes.
