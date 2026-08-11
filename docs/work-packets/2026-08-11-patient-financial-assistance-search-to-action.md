# Patient financial-assistance search-to-action loop

## 1. Assignment charter

- **Request:** Execute one budget-aware, complete-loop improvement without reopening finished analytics, 403(b), commerce, or broad-site work.
- **User outcome:** A patient or caregiver who lands on CAF before paying a hospital bill can immediately open the exact Hospital Financial Assistance Finder instead of hunting through the article or reaching an unrelated visit-cost calculator.
- **Business outcome:** Convert one qualified patient-cost search entry into measurable use of an existing differentiated flagship.
- **Success metrics:** 1/1 selected entry exposes the exact Finder in the hero and owned end state; destination begins the eight-step workflow; existing view/start/step/result/copy/print/handoff evidence remains intact; no claim, route, privacy, or search regression.
- **Non-goals:** New product, analytics key or schema, facility-fee/EOB changes, content program, monetization, account, email, Stripe, Supabase write, or site redesign.
- **Risk:** Low and reversible; one existing article's action hierarchy changes.

## 2. Current-state evidence

| Area | Direct evidence | Verified | Limitation |
|---|---|---|---|
| Production | Main `197e97f189c461ecd094002b8c12b617b36042ca`; deployment `dpl_Vf3noFua2Gx1AGCJ4pzcNvTd95wo` READY with 12 Node functions | 2026-08-11 | Technical state, not user-value evidence |
| Search | August 10 GSC page export: assistance article 0 clicks/13 impressions/position 4.92; facility-fee article 0/48/12.50; EOB checker 0/9/5.22 | 2026-08-11 re-read | Small, lagged, non-additive sample; query clicks privacy-suppressed |
| Product behavior | `public.journey_events` returned 0 rows | 2026-08-11 | Consented evidence is sparse and not representative |
| Entry UX | First article tool action was about 2,997 CSS pixels down and linked `/tools#insurance`, resolved to the visit-cost calculator | 2026-08-11 | One production desktop viewport; exact distance varies |
| Destination | `/tools/financial-assistance-checklist` is a released eight-step finder with policy search, range screening, verification, result, copy, print, and handoff states | 2026-08-11 | Capability does not prove usefulness or eligibility |
| Measurement | The Finder already emits consent-gated, answer-free `hospital_financial_assistance` lifecycle events | 2026-08-11 | Result reach does not prove satisfaction or correct official determination |
| Research | *What Makes Websites Succeed and What Community Acquired Finance Should Become* prioritizes search pages as workflow on-ramps and ranks bill response as a strategic flagship | 2026-08-11 re-read and visually inspected | Internal strategic research, not observed demand or causality |
| Open work | PRs #224, #244, and #250 do not control this route or current production | 2026-08-11 | Open-PR metadata only |

No unstable medical, insurance, tax, legal, or eligibility claim changes. Existing source-governed content is preserved.

## 3. Evidence classification

| Claim | Classification | Basis | Limitation |
|---|---|---|---|
| The current article-to-tool mapping is wrong for the stated user job | Verified fact | Article promises financial-assistance action; first tool maps to visit-cost estimation | Does not prove users clicked it |
| The Finder is the closest existing next action | Strongly supported inference | Exact product purpose, official-policy workflow, same audience and bill stage | Hospital eligibility remains official/plan-specific |
| A hero action should increase qualified Finder entry | Directional hypothesis | Position 4.92, current scroll distance, exact product fit | No organic evidence yet |
| Commerce should remain off | Conservative precaution | No usage, usefulness, or willingness-to-pay sample | Does not reject future paid organization value |

## 4. Inherited-decision challenge

| Item | Status | Present impact | Challenge and disposition | Trigger |
|---|---|---:|---|---|
| First-party journey system | Released privacy boundary | 0 organic rows | Use it; do not expand it to force a conclusion | 25 consented views, defect, or 2026-09-07 |
| 403(b) entry experiment | Active experiment | 2 article entries | Leave unchanged to accumulate evidence | Its existing trigger |
| Hospital-assistance Finder | Released capability | 1 complete workflow | Reuse; no evidence supports rebuilding it | Result-quality defect or user evidence |
| Article `relatedCalculator` | Merely implemented | 1 mismatched destination | Correct to the Finder and make the page own one action hierarchy | Search/user behavior or intent change |
| Priority-article allowlist | Merely implemented | 4 of 71 articles | Add exactly this evidence-backed route; do not expand broadly | Route evidence or duplication defect |
| $29 hypothesis | Provisional | No change | Do not activate | Usage, usefulness, saved-work value, WTP, and certified commerce |

Passing tests prove the action hierarchy functions; they cannot prove organic impact or user benefit.

## 5. Candidate decision

| Candidate | Evidence and value | Effort/risk | Decision |
|---|---|---|---|
| Financial-assistance article → Finder | Near-page-one entry, exact wrong-tool defect, mature measured destination | Low | **Selected** |
| Facility-fee article → EOB checker | More impressions and strong fit | Defer: lower position and EOB checker lacks the queryable flagship lifecycle contract |
| EOB checker search optimization | Tool is already a direct action at position 5.22 | Defer: no proven entry UX defect and no clicks yet |
| Product-completion redesign | Potentially valuable | Reject now: 0-row denominator |
| New patient-cost product | Adds surface area | Reject: existing products are sufficient |
| Paid activation | Revenue upside | Reject: no WTP evidence |

The strongest counterargument is that the facility-fee page has 48 impressions versus 13. The selected route still outranks it for this cycle because it combines stronger current position, a directly observed wrong destination, a mature flagship, and complete existing lifecycle measurement without adding analytics scope.

## 6. Independent role matrix

| Role | Status | Finding / acceptance test |
|---|---|---|
| Orchestrator | PASS | One bounded loop; stop after release |
| Context steward | PASS | Reconcile CAF-D-015/D-017/D-018 and record one new experiment |
| Capability router | PASS | Direct GSC CSV, production browser, Supabase aggregate, repository, GitHub, and Vercel are sufficient |
| Executive strategy | PASS | Deepens patient-cost flagship use instead of adding inventory |
| Product management | PASS | Exact job and destination align; hero and final primary action must match |
| Healthcare user research | PASS | A stressed patient should check assistance before paying or financing a large balance |
| Information architecture | PASS | One dominant Finder action; medical-bill flow and policy hub remain subordinate |
| UX and design system | PASS | Above-fold action plus one owned end state; no stacked global product panel |
| Content/evidence integrity | PASS | No claim or source change; official verification remains explicit |
| Frontend engineering | PASS | Reuse typed action registry and shared tracked link; no route-specific event code |
| Systems architecture | PASS | No new domain, service, state, or dependency |
| Backend/data/security | NOT IMPLICATED | No API, schema, auth, persistence, or privilege change |
| Platform/DevOps | PASS | Standard exact-head CI, preview, merge, and production smoke required |
| SEO/discovery | PASS | Preserve URL, copy, title, canonical, schema, indexability, and sitemap |
| Monetization/CRO | WARN | Improves a prerequisite to revenue, not revenue; no commerce |
| Analytics/experimentation | PASS WITH LIMITATION | Existing CTA plus Finder lifecycle applies; 0 rows forbids impact conclusions |
| Accessibility/performance | PASS PENDING PREVIEW | Button, mobile containment, keyboard, axe, and destination checks required |
| Privacy/legal/protection | PASS | No new data or advice claim; consent and answer-free event contract unchanged |
| Publishing/governance | PASS | Existing article and tool remain published with unchanged freshness/source status |
| Quality/release | PASS PENDING | Focused, full, browser, preview, and production gates required |
| Adversarial red team | PASS | CTA clicks could rise while results remain weak; evaluate full lifecycle, not clicks alone |
| Process improvement | PASS | Route-to-product mismatch becomes a regression-tested action mapping |

## 7. Executive accountability

| Perspective | Status | Decision consequence |
|---|---|---|
| Strategy / Product / Healthcare user | PASS | Exact high-stress job reaches the existing flagship |
| Operations / Technology | PASS | One reversible registry/template change, no new service |
| Finance / Revenue | WARN | Economically plausible prerequisite only; no revenue claim |
| Data / Analytics | PASS WITH LIMITATION | Preserve denominator discipline and existing privacy boundary |
| Discovery / Editorial | PASS | Stable search asset, correct next action, no claim change |
| Privacy / Accessibility / Quality | PASS PENDING RELEASE | Must pass consent, mobile, axe, exact-head, and production checks |
| Red team / Process | PASS | Leave facility/EOB and 403(b) experiments alone after this release |

## 8. Quantified before/after

| Measure | Before | After | Change |
|---|---:|---:|---:|
| Routes changed | 0/182 | 1/182 | +1 (0.55%) |
| Selected search entries with exact hero action | 0/1 | 1/1 | +1 |
| Selected entries with a mismatched calculator mapping | 1/1 | 0/1 | -1 |
| Priority directional articles | 4/71 | 5/71 | +1 |
| Selected entries with stacked global medical-bill endcap | 1/1 | 0/1 | -1; page owns one hierarchy |
| Existing user-completable Finder journeys | 1/1 | 1/1 | 0; reused |
| Existing first-party-instrumented Finder journeys | 1/1 | 1/1 | 0; reused |
| Indexable routes | 182/182 | 182/182 | 0 |
| Ad-eligible routes | 39 | 39 | 0 |
| Organic journey rows at decision time | 0 | 0 | 0 |

- **User journey:** Search entry → hero Finder action → eight-step screening → bounded result → copy/print/official verification/handoff.
- **Measurement:** Fixed CTA metadata plus existing `hospital_financial_assistance` lifecycle; no user answers, hospital, state, income, bill, URL, or identifier expansion.
- **Maintenance:** One route action and one action hierarchy in existing source files.
- **Rollback:** Revert the bounded commit; no database or cleanup.

## 9. Anomaly and red-team gate

- [x] Technical success could be mistaken for business success.
- [ ] More than 20% surface change, route/index/monetization reduction, founder conflict, broad architecture, or economically implausible outcome.

Mitigation: release evidence will prove only implementation. Organic entry, start, result, portable-output use, usefulness, satisfaction, causality, retention, and willingness to pay remain unknown.

## 10. Integrated implementation

1. Add the assistance article to the fixed priority-action registry with the exact Finder route.
2. Replace its wrong calculator metadata with the Finder.
3. Give the article one owned end state: Finder primary, bill-review flow and policy hub subordinate.
4. Add unit, route-owner, desktop/mobile, accessibility, overflow, and destination regressions.
5. Preserve every route, claim, calculation, source, consent rule, event key, and commercial boundary.

## 11. Validation and release gates

### Technical validation

- **Status:** PENDING exact-head and production evidence.
- Focused CTA/route tests: PASS at implementation checkpoint.
- Full repository test/build, lint, browser, preview, merge, production smoke, runtime scan: pending.

### Business validation

- **Status:** WARN until organic evidence.
- User-task fit is strongly supported; actual behavior and economic value are unknown.

## 12. Closeout

- **Release state:** Pending.
- **What remains unchanged:** Facility-fee/EOB loop, 403(b) experiment, Finder logic, claims, sources, privacy, analytics schema, auth, payments, prices, ads, email, and routes.
- **Stop condition:** After this loop is released and production-verified, stop.
- **Decision trigger:** New GSC export, 25 consented `hospital_financial_assistance` views, 2026-09-07, or an immediate production/privacy/accessibility/search defect.

