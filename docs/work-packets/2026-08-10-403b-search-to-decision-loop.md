# 403(b) search-to-decision loop

## 1. Assignment charter

- **Plain-language request:** Reassess CAF from current production and operating evidence, then execute and release the highest-value work rather than defaulting to another infrastructure or product build.
- **Actual user outcome:** A nurse or hospital worker who arrives with a 403(b) question can move directly from the answer page into a paycheck contribution and employer-match decision without hunting through the article or a generic hub.
- **Affected audiences:** Nurses and other healthcare workers evaluating a hospital 403(b) contribution or match.
- **Business outcome:** Turn CAF's strongest qualified organic foothold into more measurable product usage and completed Decision Outcomes.
- **Success metrics:** Hero-to-tool action availability on 2/2 priority search entries; 403(b) tool views, starts, results, print/copy, and continuation with numerators and denominators; no route, claim, privacy, or search regression.
- **Constraints:** Preserve analytics consent and answer-free lifecycle evidence; no answer, financial amount, employer, plan, URL, or identifier collection; no causal claim from sparse data; no pricing or payment activation.
- **Non-goals:** A new product, article program, analytics rebuild, user account, Stripe change, 403(b) tax or contribution-limit content update, or broad site redesign.
- **Risk class:** Low and reversible; two existing article templates change, with no calculation or backend change.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Canonical production is live at main SHA `239c0dd741cf0a814f78e6e01200aff9a40c4e00`; both 403(b) articles and the calculator render | 2026-08-10 | Direct desktop browser inspection; organic user intent and satisfaction remain unknown |
| GitHub/main | Main contains 182 canonical routes, 71 articles, mature 403(b) calculation/Decision Outcome logic, and the released journey evidence system | 2026-08-10 | Implementation is not behavioral evidence |
| Relevant PRs/issues | PR #270 released journey evidence and PR #271 reconciled its closeout; older open PRs do not control current production | 2026-08-10 | Stale open-PR documentation is not production truth |
| Vercel/runtime | Production deployment `dpl_HgqH9Hk5McHVNDy8pC9UQcGaTFK4` is READY with 12 Node functions; no runtime errors in the inspected 24-hour window | 2026-08-10 | A clean log window does not prove UX quality |
| Supabase/data/auth | `journey_events` has 0 organic rows; `growth_events` has 12 older navigation/offer rows and no current 403(b) outcome sample | 2026-08-10 | Consented evidence can be sparse and nonrepresentative; zero rows do not prove zero use |
| Stripe/payments | Existing commercial boundary is untouched; no willingness-to-pay chain is available for this task | 2026-08-10 | No monetization conclusion |
| Search/analytics | GSC page table: hospital-match article 2 clicks/124 impressions/position 8.15; nurse-contribution article 1/23/6.04; calculator 0/8/11.38 | 2026-08-10 | Small, lagged, non-additive tables; query clicks are privacy suppressed |
| Product UX | The nurse article's first calculator link was roughly 2,926 CSS pixels below the initial desktop viewport; neither priority article exposed a tool action in its hero | 2026-08-10 | One representative production viewport; exact distance varies by device and rendering |
| Project research | *What Makes Websites Succeed and What Community Acquired Finance Should Become* favors task-completion systems, pathways, portable outcomes, and depth over disconnected content | 2026-08-10 revalidated | Strategy research, not direct user behavior |
| External primary sources | No unstable factual claim or calculation changes, so no external rule research is required for this bounded navigation release | 2026-08-10 | Future 403(b) rule or limit changes remain governed by existing content freshness controls |

## 3. Evidence classification

| Claim or input | Classification | Source | Limitation |
|---|---|---|---|
| Healthcare-worker 403(b) is CAF's strongest current organic cluster | Supported inference | 147 impressions and 3 clicks across the two page rows, at average positions 8.15 and 6.04 | Small sample; not proof of a durable moat |
| Ready users face avoidable search-to-tool friction | Verified fact | Direct production DOM and browser inspection | The effect on abandonment is unknown |
| The calculator can produce a useful, measured result | Verified fact for capability | Released route, Decision Outcome, print/copy, journey event contract | Completion does not prove satisfaction or correctness for every plan |
| Hero access should increase qualified tool entry | Supported inference | Search intent, current scroll distance, existing product fit | Requires post-release behavioral evidence |
| Paid value should remain off | Conservative precaution | No completion, usefulness, persistence, or willingness-to-pay evidence | Does not reject future monetization |

## 4. Context and decision memory

- Relevant context: healthcare-worker differentiation; complete decision systems; trust and verification; free public safety value; product depth before surface expansion.
- Active decisions: CAF-D-003, D-005, D-010, D-014, D-015, D-016, and D-017.
- Potential conflict: D-017 set a 25-view threshold for behavioral conclusions, not a prohibition on independently justified low-risk product access work. This cycle draws no funnel conclusion from zero rows.
- Prior work reconciled: the 403(b) calculator, typed Decision Outcome, directional CTA contract, SEO pathways, and journey evidence are already released and reused.
- Founder confirmation required: none for a reversible, non-commercial internal navigation change.
- Registry gap: production and main outrank stale open-PR closeouts.

## 5. Inherited-decision challenge gate

| Inherited item | Status | Present impact | Red-team challenge and disposition | Revisit trigger |
|---|---|---:|---|---|
| 403(b) calculator and Decision Outcome | Confirmed capability | One complete product reused | Do not rebuild; current evidence identifies access friction, not calculation failure | Result-quality defect or user research |
| Priority directional-article allowlist | Merely implemented | 3 articles before this change | Expand by one only where current demand and product fit are direct | Article behavior or content-intent change |
| Consent-gated first-party lifecycle contract | Confirmed privacy boundary | 0 organic rows today | Preserve; sparse data cannot justify more collection | Privacy/security defect or adequate alternate reporting |
| $29 premium hypothesis | Provisional | No change | Reject activation because product completion and willingness to pay are unproven | Certified test commerce plus demand evidence |
| Passing tests equals readiness | Rejected | None | Require preview/browser/production evidence in addition to tests | Every release |

The prior analytics cycle was treated as completed and useful. Its lack of rows was not interpreted as lack of traffic, and absence from one registry was not treated as proof that work was absent.

## 6. Capability plan

| Need | Authoritative system/tool | Workflow | Fallback | Risk |
|---|---|---|---|---|
| Demand baseline | August 10 GSC export | Reproducible CSV/notebook reconciliation | Direct CSV totals | Read-only |
| Current behavior | Production browser | DOM, viewport, canonical, CTA, responsive and accessibility inspection | Exact-head Playwright CI | Read-only |
| Product evidence | Supabase | Aggregate journey counts only | No conclusion | Read-only |
| Implementation | Repository | Reuse typed CTA action/link and existing routes | Revert bounded commit | Low |
| Release | GitHub + Vercel | Exact-head checks, preview, merge, production smoke | Hold PR | Moderate write |

## 7. Independent role matrix

| Role | Status | Material finding | Action/acceptance test |
|---|---|---|---|
| Orchestrator | PASS | Current production, main, data, search, and stale records were reconciled first | One bounded work packet and release chain |
| Context steward | PASS | Work compounds D-017 rather than replacing it | Add durable decision/evidence/work records |
| Capability router | PASS | Existing GitHub, Vercel, Supabase, GSC, and browser surfaces are sufficient | No new vendor or dependency |
| Executive strategy | PASS | Qualified usage is a stronger current bottleneck than product inventory | Improve one complete loop |
| Product management | PASS | Ready users need direct action, while readers keep the full article | 2/2 hero actions; article remains complete |
| Healthcare user research | PASS | Match and contribution questions map to the same practical paycheck decision | Use distinct intent-aligned labels and retain verification content |
| Information architecture | PASS | The tool is the primary action; match and tax treatment are subordinate | One dominant hero action and one hierarchical end state |
| UX and design system | PASS AFTER FIX | Exact preview showed the shared tracked wrapper dropped `Button asChild` classes | Forward anchor props/ref; assert button classes; recheck visual hierarchy |
| Content and evidence integrity | PASS | No claim, source, example, or calculation changes | Existing sources and freshness remain intact |
| Frontend engineering | PASS | Central route configuration avoids page-specific tracking code | Typed action config and focused tests |
| Systems architecture | PASS | No new state or service is needed | Route-to-route navigation only |
| Backend, data, and security | PASS | No backend, RLS, auth, or server boundary changes | Zero schema/API diff |
| Platform and DevOps | PASS | Exact-head CI passed and the merged SHA reached a READY production deployment | PR #272; production `dpl_AeFaeXVDGNF24w8FNAfJn65KPiKB` |
| SEO and discovery | PASS | Existing URLs, titles, canonicals, schema, and indexability stay stable | Search-readiness and canonical checks |
| Monetization and conversion | WARN | Work improves a prerequisite to paid value, not revenue itself | No price, checkout, or paid claim |
| Analytics and experimentation | PASS WITH LIMITATION | Existing CTA event plus tool lifecycle can measure aggregate continuation | Report every rate with numerator and denominator; no user-level joining |
| Accessibility, performance, and reliability | PASS | Desktop/mobile labels, hierarchy, axe checks, and horizontal containment passed | Browser certification #668 plus direct production smoke |
| Privacy, legal, and user protection | PASS | No new data or claims; existing consent behavior is preserved | Necessary-only visit emits no synthetic event |
| Publishing and governance | PASS | Two existing ad-eligible articles remain intact | Route and publication inventories unchanged |
| Quality and release | PASS | Full suite, exact-head automation, preview, merge, production smoke, and runtime checks passed | Main `8ffb942e997efa187d1863fcc56e745ccdbb88a2` |
| Adversarial red team | PASS | Biggest risk is optimizing clicks without proving result value | Keep tool lifecycle/result quality as the downstream guardrail |
| Process improvement | PASS | Search work now has an explicit post-click acceptance test | Reusable hero-action registry and regression test |

## 8. Executive accountability matrix

| Perspective | Status | Finding | Consequence / acceptance test |
|---|---|---|---|
| CEO / Strategy | PASS | Strengthens CAF's most differentiated acquisition wedge using existing product depth | No new product surface |
| COO | PASS | Low-maintenance, reversible use of released capabilities | One owner and rollback commit |
| CFO / CRO | WARN | Economic value is plausible but unproven | Do not claim or activate revenue |
| CPO | PASS | Reduces time-to-useful-action on a coherent task | Hero action reaches the right tool |
| CTO | PASS | Reuses typed actions and navigation; no new service | Type/build/contracts pass |
| Data and Analytics | PASS WITH LIMITATION | Zero rows forbid a funnel diagnosis, but not this independent UX correction | Minimum 25 viewed sessions before directional rate conclusions |
| Marketing and Discovery | PASS | The two article pages are the strongest current qualified search cluster | Preserve canonical and content intent |
| Editorial and Evidence | PASS | Action is an estimate and existing verification language remains | No claim or source diff |
| Healthcare User Context | PASS | Contribution and match questions converge on paycheck affordability and plan verification | No false employer-specific precision |
| Privacy / Legal / Protection | PASS | No collection expansion or commerce | Existing consent boundary remains |
| Accessibility / Reliability | PASS | Long mobile labels remain contained and axe checks passed | Browser certification #668 and production smoke |
| Quality / Release | PASS | Exact head passed automation and the merged SHA reached production | CI/browser/deployment checks |
| Adversarial Red Team | PASS | CTR could rise while result quality remains weak | Track start, result, portable output, and continuation together |
| Process Improvement | PASS | Work packet states the counterfactual and reversal evidence | Reassess on data, not ceremony |

## 9. Anti-blindness findings

- **Prompt emphasis:** qualified discovery, existing flagship use, measurable outcomes, and complete loops.
- **Prompt omission:** no current behavior proves that the search pages cause abandonment.
- **Strongest argument against the selected work:** the ranking/snippet, not the on-page transition, may be the limiting factor; only three historical clicks reached the two pages.
- **Weakest assumption:** a visible hero action will attract users who are ready to calculate rather than distract users who only need explanation.
- **Largest unused opportunity:** medical-bill intent may ultimately be larger, but the currently observed page sample is smaller and its flagships are newer.
- **Metric that could improve while the product worsens:** article-to-tool clicks can rise while start-to-result or result quality falls.
- **Evidence that would change the decision:** lower downstream start/result rates for article entrants, user confusion, search regression, or a larger qualified cluster with a more severe complete-loop defect.

## 10. Quantified before-and-after impact

| Measure | Before | After | Change | Consequence |
|---|---:|---:|---:|---|
| Affected routes | 0/182 | 2/182 | +2 (1.1% of routes) | Bounded change |
| Relevant 403(b) search-entry articles with hero tool action | 0/2 | 2/2 | +2 | Ready users can act above the fold |
| Priority directional articles | 3/71 | 4/71 | +1 | Nurse page receives one owned hierarchy |
| Affected articles with redundant mid-article calculator card | 2/2 | 0/2 | -2 | Less CTA repetition |
| Affected articles whose final primary action is the calculator | 1/2 | 2/2 | +1 | Search promise and end state align |
| Indexable routes | 182/182 | 182/182 | 0 | Search inventory preserved |
| Ad-eligible routes | 39 | 39 | 0 | Advertising inventory preserved |
| User-completable 403(b) journeys | 1/1 | 1/1 | 0 | Existing product reused |
| First-party-instrumented 403(b) journeys | 1/1 | 1/1 | 0 | Existing lifecycle evidence reused |
| Shared tracked-link primitives that forward button presentation props | 0/1 | 1/1 | +1 | Primary/secondary CTA styling now reaches the rendered anchor |
| Organic journey rows at decision time | 0 | 0 | 0 | No impact claim is available today |

- **Monetization impact:** Improves access to workflow utility that could later support paid saved-work value; no present revenue claim or change.
- **User-journey impact:** Search answer → direct tool entry → contribution/match estimate → Decision Outcome → copy/print/continuation.
- **SEO/discovery impact:** Same content, metadata, URLs, canonicals, schema, and sitemap; internal destination becomes clearer.
- **Maintenance impact:** Two fixed actions in one typed registry and one article-template branch.
- **Measurement impact:** Existing fixed CTA analytics and consented 403(b) lifecycle metrics apply; no sensitive properties or cross-user attribution.
- **Second-order effects:** A stronger tool handoff may reveal product friction that page-level search evidence could not.
- **Rollback path:** Revert the bounded route/action and ArticlePage commit; no data migration or cleanup.

## 11. Anomaly gate

- [x] Creates a possible technical-success/business-value mismatch: visible CTAs can pass every test without increasing useful completions.
- [ ] Changes more than 20% of a surface, reduces routes/inventory/functionality, contradicts a founder objective, depends on one registry, or creates an economically implausible result.

Mitigation: report article search evidence, CTA events, tool views, starts, results, portable outputs, and continuation separately. A release is technically proven only after production checks and business impact remains unknown until organic evidence exists.

## 12. Candidate work ranking

Scores are directional, 1–10; lower effort/risk is better.

| Candidate | User value | Business value | Strategic fit | Confidence | Effort | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---|
| 403(b) search → tool → result loop | 8 | 8 | 10 | 8 | 3 | 2 | Selected |
| Medical-bill search → assistance/EOB loop | 9 | 9 | 10 | 6 | 6 | 5 | Defer until new flagship entry evidence matures |
| Total-compensation discovery/activation | 8 | 8 | 10 | 6 | 5 | 3 | Smaller current search sample (1 click/10 impressions) |
| Improve flagship completion | 9 | 9 | 10 | 2 | 5 | 4 | No organic journey denominator yet |
| Activate $29 premium value | 6 | 9 | 7 | 2 | 8 | 9 | Reject without WTP and certified test chain |
| New standalone product | 7 | 6 | 6 | 4 | 10 | 7 | Reject; current surface needs qualified usage |
| Wait for analytics | 1 | 1 | 2 | 10 | 1 | 6 | Reject; passive and this correction is independently justified |

## 13. Integrated decision

- **Selected outcome:** Put intent-specific 403(b) calculator actions in the heroes of the hospital-match and nurse-contribution articles; give both articles the same direct end-state hierarchy; remove the duplicate mid-article tool promo.
- **Why it outranks alternatives:** It acts on the largest current qualified organic cluster, uses a complete differentiated product, produces visible user value, is measurable under existing contracts, and carries little maintenance, legal, or opportunity cost.
- **Complete journey:** Google query → existing article → hero action → 403(b) calculator → Decision Outcome → copy/print/related decision. Search, CTA, and lifecycle evidence remain aggregate and privacy-minimized.
- **Architecture:** Central fixed action registry → shared tracked action link → existing route and existing journey instrumentation.
- **Commercial/editorial treatment:** Free, educational, estimate-labeled, source-backed content remains unchanged.
- **Rollback:** One bounded revert.
- **Reversal evidence:** Search regression, lower qualified engagement, accessibility defect, direct user confusion, or downstream results showing the calculator is not the right next action.
- **Reassessment:** 2026-09-07 or 25 consented 403(b) tool views, whichever is later; immediately for a production, privacy, accessibility, or search defect.

## 14. Separate validation dispositions

### Technical validation

- **Status:** PASS locally, on the exact-head preview, and in production.
- **Implementation correctness:** Focused CTA/route tests and the full repository suite pass: 128 test files/723 tests.
- **Tests and typing:** Lint has zero errors and 15 existing Fast Refresh warnings. The authoritative build passes API TypeScript and all repository contracts. Broad composite `tsc -b` exposes unrelated pre-existing ES2020 `replaceAll`, stale domain-type, and component declaration errors; no reported error is in this change, and composite `tsc -b` is not a repository release command.
- **Security and privacy:** No backend or collection diff; a necessary-only production smoke retained 0 synthetic `journey_events` rows.
- **Accessibility and reliability:** Exact-head Browser certification #668 passed the complete suite, including the new two-route desktop/mobile CTA, axe, and overflow checks. Direct production smoke reconfirmed visible button treatment and zero horizontal overflow on both entries and the calculator.
- **Deployment and route behavior:** Preview `dpl_k3fcGB6vokQnVW5xqhYgnKjdG8AS` was READY at feature head `8e56f8b060b78db273b04070085c9da72cd566d5`; production `dpl_AeFaeXVDGNF24w8FNAfJn65KPiKB` was READY at merged main `8ffb942e997efa187d1863fcc56e745ccdbb88a2` with 12 Node functions and the canonical alias.
- **Observability:** No production runtime error was present in the post-smoke 30-minute window.
- **Rollback:** Bounded code revert; no data migration.

### Business validation

- **Status:** WARN after release until organic evidence.
- **User usefulness:** Strongly supported by task continuity, not yet behaviorally proven.
- **Strategic alignment:** High; healthcare-worker workplace finance is CAF's clearest wedge.
- **Revenue and sustainability:** Directional prerequisite only.
- **Opportunity cost:** Low relative to a new flagship or commerce build.
- **Conversion and discovery:** Search entries and product action are joined at the experience level; aggregate behavior remains to be observed.
- **Operational burden:** Low.
- **Economic plausibility:** Credible but unproven.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner |
|---|---|---|---|---|
| Typed search-entry actions | `directionalCtaRoutes.ts` | Exactly two fixed 403(b) hero actions | Unit contract | Product/frontend |
| Article hierarchy | `ArticlePage.tsx` | Hero action, no duplicate related-tool block, direct final handoff | Unit/e2e/browser | UX/IA/frontend |
| Tracked-link composition | `DirectionalNextActions.tsx` | `Button asChild` classes and ref reach the anchor without changing event semantics | Component test + deployed visual | Frontend/accessibility |
| Regression coverage | route unit + Playwright spec | Both routes reach calculator, fit mobile, pass axe | Local + CI | Quality/accessibility |
| Governance | work packet + ledgers | Evidence, decision, limits, and reassessment recorded | Governance check | Context/process |
| Release | GitHub/Vercel/production | Exact SHA, READY, canonical smoke, clean logs | Connected systems | Platform/release |

## 16. Release gates

- [x] Current state, inherited decisions, impact, candidate, anomaly, and business-disposition gates complete.
- [x] No claim, calculation, source, privacy, schema, payment, or entitlement change.
- [x] Focused unit and CTA-governance tests pass.
- [x] Full tests, authoritative API TypeScript, lint, build, SEO/publication/privacy/governance checks pass.
- [x] Exact-head preview, CI #1058, Decision Journey #732, and Browser certification #668 pass.
- [x] Desktop/mobile action, navigation, canonical, axe, overflow, and necessary-only consent behavior pass.
- [x] PR #272 merged at `8ffb942e997efa187d1863fcc56e745ccdbb88a2`; production deployment, route smoke, and runtime-log checks pass.

## 17. Executive closeout

- **What changed:** Two evidence-backed article entries now expose direct tracked calculator actions and owned end states in production; the shared tracked-link component also preserves intended button styling for every existing consumer.
- **What did not change:** Products, calculations, claims, sources, routes, search metadata, journey schema, privacy, payments, ads, or entitlements.
- **Before/after:** 0/2 to 2/2 hero actions; 2/2 to 0/2 redundant mid-article calculator cards; 1/2 to 2/2 direct calculator end states.
- **Production and release status:** Released through PR #272 at main `8ffb942e997efa187d1863fcc56e745ccdbb88a2`; production deployment `dpl_AeFaeXVDGNF24w8FNAfJn65KPiKB` is READY.
- **Unresolved warning:** No organic 403(b) lifecycle sample and no satisfaction or willingness-to-pay evidence.
- **Business consequence:** If the hypothesis holds, more qualified healthcare workers will reach and complete CAF's differentiated decision product.
- **Owner-only action:** None.
- **Evidence still missing:** Organic CTA, view, start, result, portable-output, continuation, and user-quality evidence.
- **Single highest-value next action:** Do not preselect another build; determine whether qualified 403(b) tool views become starts and useful results at an adequate denominator.

## 18. Compounding closeout

- Project context: stable doctrine unchanged.
- Decision/evidence/work ledgers: final production release record captured in CAF-D-018, CAF-E-014/015, and CAF-W-015.
- Route-level governance: typed hero-action registry and exact-route regression added.
- Reusable asset: evidence-selected article-to-product hero action pattern.
- Automated prevention: both target articles must retain the calculator destination, direct end-state hierarchy, accessibility, and containment.
- Duplicate surface retired: two redundant mid-article calculator promos.
- Remaining process debt: no self-serve aggregate dashboard and no source-level attribution joining search entrants to results.
- Reassessment trigger: 2026-09-07, 25 consented 403(b) views, or any production/privacy/accessibility/search defect.
