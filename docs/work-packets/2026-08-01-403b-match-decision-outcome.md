# 403(b) Match Integrity and Decision Outcome Release Work Packet

## 1. Assignment charter

- **Plain-language request:** Correct every identified 403(b) calculator weakness, complete the work one release at a time, and require a full company and executive review before proceeding.
- **Actual user outcome:** A healthcare worker can enter the actual employer-contribution formula, receive a calculation only when the formula is safely supported, understand whether the stated match appears fully captured, and leave with a visible verification plan and portable decision summary.
- **Affected audiences:** Healthcare workers using 403(b) plans; workers with matching, partial-match, non-elective, tiered, discretionary, or unclear employer-contribution formulas.
- **Business outcome:** Correct a material trust defect, make the Decision Outcome Layer a real multi-product architecture, strengthen the healthcare-worker flagship pathway, and avoid premature commercial or infrastructure expansion.
- **Success metrics:** Zero generic-match overstatement; six deterministic outcome states; unknown/tiered formulas return no employer estimate; actual Letter/A4 outcomes remain complete; privacy-safe event contract; no route/indexability/commercial expansion.
- **Constraints:** Preserve canonical route and existing content inventory; no Supabase migration; no new account requirement; no affiliate placement; no Explore CAF restructuring; current plan and payroll records control.
- **Non-goals:** New 403(b) article, individual plan interpretation, contribution-limit advice, investment recommendation, employer verification, premium checkout, Stripe activation, or demand/revenue claims.
- **Risk class:** High — consequential retirement-benefit estimates and user action guidance.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Live `/tools/403b-paycheck-calculator` before and after release | 2026-08-01 | Public route and rendered behavior; does not establish user comprehension or demand |
| GitHub/main | Starting `e19253af2f786d359d72fb5c4f5db78b984ba5d2`; product merge `a35bb97548d7c76832e887d28c47e4827dff76c1` | 2026-08-01 | Code, history, tests, and release evidence |
| Relevant PRs/issues | PR #243; Linear AND-101; unrelated draft PR #224 preserved | 2026-08-01 | Scope and release status only |
| Vercel/runtime | Preview `dpl_6k7CAGKWwg8FUVXN3ACWMcdhy2SY`; production `dpl_7bpPcqMgSH2xc5cEQLkwoGjR7VWn`; no current error clusters or unresolved toolbar threads | 2026-08-01 | Deployment and inspected runtime window, not future health |
| Supabase/data/auth | Project `uzfcvtgnpkvuapgrkfcb` ACTIVE_HEALTHY; no migration, schema, row, policy, or function change | 2026-08-01 | Confirms non-change and current project posture |
| Stripe/payments | Existing private prelaunch work remains disabled and unrelated | 2026-08-01 | No payment work performed |
| Search/analytics/AdSense | 160 routes, 160 sitemap URLs, 39 ad-eligible articles; existing consented fixed decision-event contract | 2026-08-01 | Release-quality and inventory evidence, not behavioral outcome |
| Notion/Linear/Drive | Notion release master, AND-101, and dashboard experiment `RETIREMENT-403B-DECISION-2026-08` | 2026-08-01 | Operating records; GitHub remains executable authority |
| External primary sources | IRS written-plan guidance; U.S. Department of Labor retirement-plan/SPD guidance | 2026-08-01 | General U.S. plan-document and participant-information boundaries; individual plan documents control |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| Prior formula represented 100% matching up to X% | Verified fact | Current source code before PR #243 | 2026-08-01 | Does not identify how users previously interpreted it |
| A 50%-of-first-6% formula produces `$2,527` on `$84,240` eligible pay | Verified fact | Pure calculation tests and browser/PDF output | 2026-08-01 | Assumes all entered pay is eligible and formula is correctly transcribed |
| Unknown/tiered formulas should omit the employer estimate | Conservative precaution | Product/legal/privacy review and plan-specific uncertainty | 2026-08-01 | Some formulas could be modeled with more inputs, but unsupported complexity is intentionally excluded |
| The Decision Outcome Layer should be reused | Supported inference | Successful private-loan pilot plus second-product adoption | 2026-08-01 | Two products do not prove universal fit |
| The release will improve completion or retention | Unresolved uncertainty | No threshold behavioral evidence | 2026-08-01 | Must not be claimed before observation |
| No founder action is required | Verified fact | Release and provider-state review | 2026-08-01 | Future source or defect changes may create action |

## 4. Context and decision memory

- **Relevant project-context sections:** Complete decisions; healthcare-worker flagship first; reuse systems; user value before monetization; current plan documents control consequential assumptions.
- **Active decision IDs:** CAF-D-003 through CAF-D-008; CAF-D-012 added by this release.
- **Decisions potentially in conflict:** Prior calculators favored low-friction reactive arithmetic; the newer product standard requires explicit valid-result boundaries and action completion. User protection outranks preserving one-field simplicity.
- **Prior work-ledger entries:** CAF-W-003 audit; CAF-W-004 first Decision Outcome pilot; CAF-W-005 executive hardening; CAF-W-008 structured navigation.
- **Evidence records needing revalidation:** IRS/DOL plan-document guidance; product measurement after 25 consented starts or August 29, 2026.
- **Founder confirmation required:** None.
- **Prior completed work reconciled:** The private-loan layer was inspected and reused rather than rebuilt. Existing email and analytics paths were bounded rather than expanded.
- **Registry or record gaps:** Tool-registry and prerender metadata initially lagged the route implementation and were corrected before release.

## 5. Inherited-decision challenge gate

| Inherited item | Established when/why | Original evidence | Current status | Quantified present impact | Conflict or anomaly | Missing evidence | Red-team challenge | Revisit trigger |
|---|---|---|---|---|---|---|---|---|
| Generic `Employer match %` | Early calculator simplicity | Implementation only | Rejected | 1 ambiguous field across 1 consequential route | Could double a common partial-match estimate | No plan-formula verification | A passing calculation test could validate the wrong model | Any employer-formula feature request |
| Reactive results without submit boundary | Legacy calculator pattern | UX convention | Rejected for this route | 0 deterministic states before release | Defaults appeared authoritative before user verification | Completion/comprehension evidence | Could users treat defaults as their employer terms? | User research or completion evidence |
| Decision Outcome Layer | PR #232 | Private-loan release evidence | Confirmed as reusable, still experimental in scale | 1 product before; 2 after | Shared panel retained private-loan identity and print assumptions | Broader-product fit | Is the shared layer actually generic? | Third adoption difficulty |
| Optional email estimate | Existing retention path | Existing provider workflow | Preserved with warning | 1 optional path | New formula enum/raw values could leak into email | Delivery and downstream engagement | Does optional email obscure the complete local result or data flow? | Abuse/deliverability issue or Workstream 2 |
| Route/canonical inventory | Current publication system | Generated route/sitemap controls | Confirmed | 160/160 preserved | Hydrated copy initially diverged from prerender metadata | Current search outcome | Could a client-only fix leave stale search claims? | Next search snapshot or metadata drift |

- The generic match model predated the current executive operating system.
- Passing tests previously established implementation consistency, not formula generality or business correctness.
- Absence from one registry was not treated as absence of completed work; route, tool, SEO, freshness, print, and analytics sources were reconciled.

## 6. Capability plan

| Need | Authoritative system/tool | Skill or workflow | Fallback | Write or risk level |
|---|---|---|---|---|
| Code/history/PR | GitHub | Repository and PR connector; Actions | None | High write |
| Deployment/runtime | Vercel | Preview, production, logs, toolbar | Public route fetch | High release |
| Database non-change | Supabase | Project/schema/migration/advisor inspection | Repository migrations | Read-only |
| Product/research record | Notion | Release master | Repository work packet | Moderate write |
| Work tracking | Linear | AND-101 | PR issue thread | Moderate write |
| Measurement governance | Google Drive | Operating dashboard ranges | Repository experiment note | Moderate write |
| Official evidence | IRS and DOL | Primary-source verification | None for controlling claims | Read-only |
| PDF quality | GitHub artifact + PDF rendering | Actual Letter/A4 generation and visual inspection | Browser print assertions | High quality gate |

## 7. Independent role matrix

| Role | Status | Material finding | Evidence | Action/acceptance test |
|---|---|---|---|---|
| Orchestrator | PASS | Scope remained bounded and sequential | PR/work packet | All gates before next workstream |
| Context steward | PASS | Audit was revalidated, not assumed | Starting code/production | Durable records updated |
| Capability router | PASS | All implicated systems were inspected | GitHub/Vercel/Supabase/Notion/Linear/Drive | No unsupported substitutions |
| Executive strategy | PASS | Correctness and reuse outrank more content | Project context and economics memo | No route expansion |
| Product management | PASS | Arithmetic became a completed decision | Six states and actions | User reaches deterministic result |
| Healthcare user research | PASS | Formula, eligible pay, overtime, true-up, vesting, and cash-flow realities represented | RN context and plan guidance | Verification list visible |
| Information architecture | PASS | Stable route and path preserved | 160 route/sitemap checks | No duplicate article/hub |
| UX and design system | PASS | Explicit formula disclosure prevents false simplicity | Browser/mobile/PDF review | Progressive, readable interaction |
| Content and evidence integrity | PASS | Plan records visibly control | IRS/DOL and UI limitation | Always-visible boundary |
| Frontend engineering | PASS | Form, focus, copy, print, edit, restart pass | Playwright/axe | No console/layout errors |
| Systems architecture | PASS | Shared outcome and print systems are product-neutral | Build contract and two products | No route-specific shared selectors |
| Backend, data, and security | PASS | No new persistence; email remains bounded | Supabase non-change and payload checks | No sensitive analytics |
| Platform and DevOps | PASS | Exact-head CI/preview/production healthy | Runs and deployments | READY/no runtime errors |
| SEO and discovery | PASS | Prerender and directory copy match product | SEO registry/prerender | Stable canonical/indexability |
| Monetization and conversion | PASS | No premature commercial path | Product contract | Complete free result |
| Analytics and experimentation | WARN | Safe event contract, no behavioral result | Drive experiment | Raw counts only below threshold |
| Accessibility, performance, reliability | PASS | Keyboard, focus, axe, mobile, performance, print passed | Browser certification | Actual journey and artifacts |
| Privacy, legal, user protection | PASS | Unknown formulas fail closed; data flows disclosed | UI/contract | No fabricated employer estimate |
| Publishing and governance | PASS | Freshness, source, registry, and correction paths complete | Build checks | Machine-enforced contract |
| Quality and release | PASS | Edge, malformed, zero-contribution, metadata, email, PDF cases pass | CI/artifacts | Latest-head only |
| Adversarial red team | PASS | Ten defects caught before production | PR history and release comment | No unresolved BLOCK |
| Process improvement | PASS | Second-product and generic-print rules automated | `decision-outcome:check` | Future drift fails build |

## 8. Executive accountability matrix

| Executive perspective | Registered role mapping | Status | Finding | Evidence | Consequence | Action/acceptance test |
|---|---|---|---|---|---|---|
| Chief Executive / Strategy | Executive strategy | PASS | High-trust correction strengthens core platform thesis | Project context; PR #243 | Better durable asset | No disconnected expansion |
| Chief Operating Officer | Orchestrator/platform/governance | PASS | All systems reconcile | Production and operating records | Workstream may close | Documentation PR merged |
| Chief Financial Officer | Strategy/monetization | PASS | Negligible infrastructure cost and lower future rework/liability | Zero provider expansion | Favorable cost/benefit | No paid infrastructure added |
| Chief Revenue Officer | Monetization/product | PASS | Protects a high-intent pathway before monetization | Complete independent result | Preserves future ethical seam | No commercial activation |
| Chief Product Officer | Product/UX | PASS | Calculator now completes the decision | Outcome journey | Higher product maturity | Deterministic states and actions |
| Chief Technology Officer | Architecture/frontend/backend | PASS | Pure domain and generic renderer reduce drift | Code/tests | Reusable system | Second product passes contract |
| Chief Data and Analytics Officer | Analytics | WARN | Measurement defined but sample absent | Drive experiment | No behavioral claim | 25 starts/28 days |
| Chief Marketing and Discovery Officer | SEO/discovery | PASS | Existing search path strengthened without cannibalization | Stable route and metadata | Better destination quality | No overlapping content |
| Editorial and Evidence Officer | Evidence/publishing | PASS | Official and plan-specific boundaries are clear | IRS/DOL; visible limitation | Trust protected | Freshness date enforced |
| Healthcare User and Clinical Context Officer | Healthcare research | PASS | Shift-pay and benefits realities represented | Verification checklist | Relevant to healthcare workers | No employer-specific claim |
| Privacy, Legal, User Protection Officer | Privacy/legal | PASS | Fail-closed formula and disclosed email flow | UI/contracts | Lower harm risk | Zero fabricated values |
| Accessibility and Reliability Officer | Accessibility/reliability | PASS | Actual browser and PDFs reviewed | Actions/artifacts | Usable across states | No overlap/clipping |
| Quality and Release Officer | Quality/release | PASS | Exact final head and production passed | Runs/deployment | Merge authorized | Latest-head evidence only |
| Adversarial Red Team | Red team | PASS | Green-suite blind spots were exposed | Ten corrected defects | Stronger release | Manual artifact inspection |
| Process Improvement Officer | Process | PASS | Regressions converted into build checks | Contract script | Future compounding | Third product must reuse rules |

## 9. Anti-blindness findings

- **Prompt emphasized:** Complete every identified task thoroughly with full executive review.
- **Prompt omitted:** The generic shared outcome panel and print CSS still contained first-product assumptions.
- **Strongest argument against the obvious solution:** Renaming the employer field alone would avoid scope but preserve unsupported formulas, reactive authority, and incomplete outcomes.
- **Weakest assumption:** That users can accurately transcribe plan terms and eligible compensation.
- **Largest unused opportunity:** Reuse the outcome contract across healthcare-worker benefits without building new routes.
- **Metric that could improve while product worsens:** More result or email actions could rise if users are overconfident in incorrect plan inputs.
- **Evidence that would change the decision:** User testing showing formula selection is too complex; a verified plan-formula taxonomy requiring additional safe modes; or recommendation discrepancies.

## 10. Quantified before-and-after impact

| Measure | Before | Proposed/after | Absolute change | Percentage change | Consequence |
|---|---:|---:|---:|---:|---|
| Affected routes | 1/160 | 1/160 | 0 | 0% | Focused replacement |
| Relevant site inventory | 1 calculator | 1 calculator | 0 | 0% | No added surface |
| Indexable routes | 160 | 160 | 0 | 0% | Search inventory stable |
| Ad-eligible routes | 39 | 39 | 0 | 0% | Monetization inventory stable |
| Commercially eligible journeys | 0 on route | 0 on route | 0 | 0% | No commercial pressure |
| User-completable 403(b) journeys | 0/1 | 1/1 | +1 | New capability | Decision completed |
| Instrumented 403(b) journeys | 0/1 | 1/1 | +1 | New capability | Privacy-safe observation |
| Explicit formula modes | 0 | 4 | +4 | New capability | Ambiguity removed |
| Deterministic states | 0 | 6 | +6 | New capability | Action guidance added |
| Production outcome products | 1 | 2 | +1 | +100% | Architecture proven reusable |

- **Monetization impact:** None immediate; future seam strengthened without activation.
- **User-journey impact:** One consequential route now completes a verifiable decision.
- **SEO/discovery impact:** Same route and inventory; destination quality and metadata improved.
- **Maintenance impact:** More domain/tests, less shared-component special casing.
- **Measurement impact:** New bounded product experiment; no values transmitted.
- **Second-order effects:** Shared print and renderer improvements protect private loans and future products.
- **Rollback path:** Revert merge `a35bb97548d7c76832e887d28c47e4827dff76c1`; no provider teardown.

## 11. Anomaly gate

- [ ] Changes more than 20% of a major site surface.
- [ ] Materially reduces monetizable inventory.
- [ ] Materially reduces indexable inventory.
- [ ] Materially reduces usable functionality.
- [ ] Contradicts a confirmed founder objective.
- [x] Implies extensive prior work was never completed.
- [x] Depends on one incomplete registry or source.
- [ ] Produces an economically implausible outcome.
- [x] Creates a mismatch between technical success and business value.
- [x] Leaves a high-intent journey without a meaningful next action.
- [ ] Cannot be explained clearly from current evidence.

- **Justification:** Prior work was real but uneven: the calculator existed, yet its generic formula and endpoint architecture were incomplete. Registry gaps were reconciled rather than used to dismiss earlier work.
- **Independent reviewers:** CEO/Strategy, CPO, CTO, CFO, Red Team.
- **Mitigation:** Focused replacement, no new route, pure calculation tests, full outcome, actual PDFs, stable inventory.
- **Acceptance test:** Exact formula matrix, fail-closed unsupported state, visible controlling evidence, full release gates.

## 12. Candidate work ranking

| Candidate | User value | Business value | Strategic fit | Confidence | Effort | Reversibility | Maintenance | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correct 403(b) model + outcome | 10 | 8 | 10 | 9 | 7 | 9 | 8 | 8 | Selected |
| Harden shared email endpoint first | 8 | 7 | 8 | 9 | 7 | 9 | 9 | 7 | Next workstream |
| Advance premium payments | 6 | 9 | 8 | 5 | 10 | 6 | 5 | 10 | Deferred to external readiness |
| More 403(b) content | 4 | 4 | 5 | 6 | 4 | 9 | 4 | 3 | Rejected as overlap |
| Change Explore CAF | 3 | 4 | 4 | 2 | 5 | 8 | 5 | 5 | Rejected below threshold |

## 13. Integrated decision

- **Selected outcome:** Explicit supported employer formulas, fail-closed unsupported formulas, and full Decision Outcome adoption.
- **Why it outranks alternatives:** Corrects a verified financial error, protects trust, compounds architecture, strengthens an existing search pathway, and avoids new infrastructure.
- **Complete user journey:** Identify pay/contribution → select formula → validate → deterministic outcome → reason/action/cautions/verification/resources → copy/print/edit/restart → optional disclosed email.
- **Architecture/source of truth:** Pure domain owns math/state; typed product contract owns product requirements; generic panel owns presentation; current plan/payroll records control individualized truth.
- **Commercial/editorial treatment:** Noncommercial, source-backed, no new content route.
- **Instrumentation:** Fixed categorical events only; experiment threshold 25 consented starts or August 29.
- **Rollback:** Self-contained revert.
- **Evidence that would reverse decision:** Source change, calculation discrepancy, user confusion, or inability to safely model common formulas.
- **Reassessment:** August 29, 2026 or 25 consented starts, whichever provides a meaningful first review.

## 14. Separate validation dispositions

### Technical validation

- **Status:** PASS
- **Implementation correctness:** Supported formulas and state precedence tested.
- **Tests and typing:** Full CI, Decision Journey, Browser Certification passed on final head.
- **Security and privacy:** No schema change; prohibited analytics values; disclosed optional email.
- **Accessibility and reliability:** Keyboard, focus, axe, responsive, performance, degraded states, actual PDFs passed.
- **Deployment and route behavior:** Preview and production READY; canonical route 200.
- **Observability:** No current runtime errors or toolbar threads.
- **Rollback:** Revert one product merge.

### Business validation

- **Status:** PASS with analytics WARN
- **User usefulness:** Replaces ambiguous arithmetic with a completed decision.
- **Strategic alignment:** Healthcare-worker flagship and reusable decision-system strategy.
- **Revenue and sustainability:** No immediate revenue claim; lowers rework and preserves future ethical monetization.
- **Opportunity cost:** Higher value than more content or payment infrastructure under current evidence.
- **Conversion and discovery:** Existing path strengthened; behavioral outcome unknown.
- **Operational burden:** Low incremental cost, annual source review, existing release system.
- **Economic plausibility:** Strong because it protects consequential compensation estimates at negligible provider cost.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner role |
|---|---|---|---|---|
| Pure formula/state model | `retirement403bDecision.ts` | Correct full/partial/non-elective/unknown behavior | Unit matrix | Frontend/evidence |
| Product contract | `retirement403bDecisionProduct.ts`, tools registry | Complete definition and noncommercial constraints | Build contract | Architecture/product |
| UI journey | Calculator/page/shared panel | Explicit formula, deterministic outcome, accessible actions | Playwright/axe/mobile | UX/frontend |
| Portable output | Print CSS/PDF tests | Letter/A4 complete and visually clean | Generated artifact review | Reliability/quality |
| Metadata/freshness | SEO registry/RouteFreshness | Prerender equals product; sources visible | Build/prerender | SEO/publishing |
| Email boundary | Calculator payload/disclosure | Human-readable bounded fields and explicit transmission notice | Contract/browser | Privacy/backend |
| Release/operations | GitHub/Vercel/Supabase/Notion/Linear/Drive | Exact evidence and reconciled records | Provider inspection | COO/governance |

## 16. Release gates

- [x] Intended user completes the target decision.
- [x] Inherited-decision challenge gate is complete.
- [x] Quantified-impact and anomaly gates are complete.
- [x] Technical validation has an explicit disposition.
- [x] Business validation has an explicit disposition.
- [x] Claims and calculations are verified.
- [x] Architecture and security boundaries are reviewed.
- [x] Analytics events are validated through the actual journey contract.
- [x] Accessibility, responsive behavior, performance, and degraded states pass.
- [x] SEO, canonical, sitemap, and indexability effects pass.
- [x] Publication ownership, freshness, and correction paths are correct.
- [x] Tests, lint, type checks, build, and repository-specific checks pass.
- [x] Latest PR head, preview, comments, and review threads are inspected.
- [x] Red-team blockers are resolved.
- [x] Production smoke validation passes.

## 17. Executive closeout

- **What changed:** Employer formulas, state engine, complete outcome, shared renderer/print architecture, metadata, privacy disclosure, and regressions.
- **What did not change:** Route count, sitemap, ad inventory, Supabase, Stripe, premium access, commercial paths, Explore CAF, or content inventory.
- **Before-and-after metrics:** 0→4 formula modes; 0→6 states; 1→2 outcome products; 160→160 routes; 39→39 ad-eligible pages.
- **Production status:** PR #243 merged at `a35bb97548d7c76832e887d28c47e4827dff76c1`; production `dpl_7bpPcqMgSH2xc5cEQLkwoGjR7VWn` READY.
- **Validation performed:** Full Actions, preview, production, runtime, Supabase non-change, actual Letter/A4 generation, 14-page visual inspection, cross-system reconciliation.
- **Unresolved warnings:** No demand, completion, comprehension, retention, or revenue evidence.
- **Business consequences:** Stronger trust and reusable product value; no near-term revenue claim.
- **Owner-only actions:** None.
- **Rollback:** Revert product merge.
- **Evidence still missing:** Threshold behavioral data and direct user testing.
- **Single highest-value next action:** Harden the shared email endpoint before additional email promotion or product expansion.

## 18. Compounding closeout

- **Project context updated:** Stable architecture already reflected; no mission change required.
- **Decision ledger updated:** CAF-D-012.
- **Evidence ledger updated:** CAF-E-007.
- **Work ledger updated:** CAF-W-009.
- **Route-level governance updated:** Freshness and prerender registry.
- **Skill or prompt improved:** Existing executive system applied; no separate skill change required.
- **Reusable component/template/query created:** Second product contract, generic renderer identity, generic Decision Outcome print contract.
- **Automated check/regression added:** Formula matrix, zero-contribution state, metadata, bounded email, generic print, exactly-one PDF test, visible controlling evidence, actual Letter/A4 scenarios.
- **Duplicate/stale artifact retired:** Generic match field, private-loan-only print selector, duplicate synthetic print heading.
- **One remaining process debt:** Behavioral and comprehension evidence remains sparse.
- **Trigger:** 25 consented starts, August 29, source change, user confusion, calculation discrepancy, or third-product adoption difficulty.
