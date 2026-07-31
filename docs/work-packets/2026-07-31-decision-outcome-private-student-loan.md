# Decision Outcome Layer — Private Student Loan Pilot Work Packet

## 1. Assignment charter

- **Plain-language request:** Implement, validate, release, and document a reusable Decision Outcome Layer and deploy its first complete private student-loan payoff/refinance experience.
- **Actual user outcome:** A borrower identifies loan type, validates the current plan, optionally models acceleration or a complete quote, and leaves with one transparent state, reason, caution, first action, short sequence, verification list, neutral resources, and portable output.
- **Affected audiences:** Confirmed private-loan borrowers; federal, mixed, and uncertain borrowers who require a safe boundary; healthcare workers with variable shift income.
- **Business outcome:** Establish reusable high-intent product architecture and a future commercial seam without inventing a relationship or weakening trust.
- **Success metrics:** Valid-result completion, recommendation arrival, quote-comparison completion, portable-output use, fixed My Plan saves, edit/restart use; zero financial-value telemetry; zero federal/mixed/uncertain commercial exposure; zero worse-quote classification errors.
- **Constraints:** Local-only financial inputs, no new backend/account/email capture, official primary sources, stable canonical, existing design system, fail-closed partner state.
- **Non-goals:** Partner activation, lender ranking, broad SEO/route/email/Stripe/Supabase refactors, unrelated audit findings.
- **Risk class:** High (consequential financial calculations and irreversible federal/private boundary).

## 2. Verified starting state

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| GitHub/main | `a27d2404c648c9f862e4cf571570dae9799ba415`; clean current `main` | 2026-07-31 | Repository code and history |
| Production | Live `/tools/private-student-loan-payoff-calculator` and `/student-loans` browser journeys | 2026-07-31 | Desktop production behavior; extension-only console error excluded |
| Vercel | Production `dpl_BQJkcfhZxAbc5uiSqqkjtSG4kXGk`, READY, same SHA; no grouped runtime errors found | 2026-07-31 | Current deployment/runtime, not demand |
| Open work | Draft PR #224 is unrelated Stripe/Supabase work; issue #152 records evidence-first growth sequencing | 2026-07-31 | Open GitHub work only |
| Analytics/search | No connected CAF analytics or Search Console reporting tool available | 2026-07-31 | Code contracts verifiable; live funnel/search performance unavailable |
| External sources | CFPB refinance, private-loan, rate/term, and early-payoff guidance; Federal Student Aid account/dashboard guidance | 2026-07-31 | General U.S. education; loan documents control individual terms |

### Journey before

The direct route showed six realistic defaults and recalculated immediately. It returned planned payment, minimum and accelerated payoff, interest savings, and a same-payment alternate-APR payoff. It did not ask loan type, model quote term/fees/rate type, identify a recommendation state, prioritize an action, show official resources, save a fixed My Plan action, copy/print a decision summary, or restart. A 12% quote against a 9% current loan produced a longer payoff labeled `$0 extra interest saved`.

## 3. Context, conflict, and anti-blindness

- Active decisions: CAF-D-003 through CAF-D-007.
- Prior work: CAF-W-003 recommended the Decision Outcome Layer; this assignment revalidated rather than assumed that conclusion.
- Conflict: Issue #152 favored evidence-first sequencing, while the current founder assignment explicitly authorizes this pilot. The release can establish product architecture but cannot claim demand, conversion, search, or revenue impact.
- Strongest argument against implementation: a large result layer could turn a calm calculator into quasi-advice and overwhelm a mobile user.
- Weakest assumption: users accurately know loan type, current payment/term, and complete quoted terms.
- Largest reusable opportunity: a static typed contract and renderer that another high-intent tool can adopt without copying student-loan JSX.
- Metric that could improve while trust worsens: portable or commercial clicks could rise while completion falls or unsuitable borrowers are nudged.
- Reassessment evidence: user-test confusion, lower valid-result completion, a calculation defect, official-source change, or a higher-value current funnel.

## 4. Integrated decision and architecture

1. `privateStudentLoanDecision.ts` owns parsing-independent validation, monthly amortization, current/accelerated plans, quote payment/term/fees, total cost, break-even, multiple-quote evaluation, and deterministic state selection.
2. `DecisionProductDefinition` declares decision identity, states, verification, cautions, resources, portable capability, My Plan, analytics, monetization, disclosure, freshness, and release constraints. `DecisionOutcomeView` carries typed display assumptions so portable results do not silently lose their inputs.
3. `DecisionOutcomePanel` renders the generic outcome, including a semantic assumptions region. The calculator is a thin form adapter.
4. `decisionOutcomeAnalytics.ts` accepts only enumerated events and `decision_id`, categorical action/resource/block IDs. It does not transmit chosen loan type, state, inputs, outputs, names, free text, query strings, or lender data.
5. My Plan reuses `wealth_student_loans` and stores no calculator values.
6. Commercial eligibility is evaluated after recommendation in a separate resolver. No environment configuration exists by default; incomplete, stale, undisclosed, non-HTTPS, federal/mixed/uncertain, or ineligible-state inputs return `null` and render no commercial UI.

## 5. Pre-implementation role quorum

| Role | Initial status | Blocking or warning finding |
|---|---|---|
| Orchestrator | BLOCK | Current journey failed calculation, protection, completion, and release requirements. |
| Context steward | WARN | Audit was a hypothesis; current main/production/open work had to be rediscovered and ledgers updated. |
| Capability router | PASS | GitHub, Vercel, repository, browser, and official web sources covered controlling evidence; live analytics/Search Console unavailable. |
| Executive strategy | WARN | Explicit assignment overrides prior sequencing, but no demand or economics claim is supportable. |
| Product management | BLOCK | Calculator ended at arithmetic without a completed decision. |
| Healthcare user research | BLOCK | Direct entrants bypassed the hub's separate loan-type selector. |
| Information architecture | WARN | Hub and decision registry used legacy tool-directory anchors. |
| UX and design system | BLOCK | Prefilled reactive output lacked hierarchy and a valid-result boundary. |
| Content and evidence integrity | BLOCK | APR-only refinance math hid costlier quotes and lacked provenance. |
| Frontend engineering | BLOCK | Math/UI were coupled; validation, focus, portable actions, and result state were missing. |
| Systems architecture | BLOCK | No typed decision-product contract or generic renderer existed. |
| Backend, data, and security | WARN | No backend needed; analytics needed a strict allowlist and My Plan had to stay fixed-only. |
| Platform and DevOps | WARN | Main/prod were healthy, but no branch-head CI/preview existed yet. |
| SEO and discovery | WARN | Canonical/indexing were healthy; methodology, source, freshness, and intent copy were shallow. |
| Monetization and conversion | WARN | Correctly fail-closed; no verified partner/economics existed. |
| Analytics and experimentation | BLOCK | No calculator outcome events and generic sanitizer gaps existed. |
| Accessibility, performance, reliability | BLOCK | Labels/helpers/errors/result announcements/mobile/print certification were incomplete. |
| Privacy, legal, user protection | BLOCK | Federal/mixed/uncertain users were not blocked from refinance framing. |
| Publishing and governance | BLOCK | No decision-source/freshness contract or commercial activation gate existed. |
| Quality and release | BLOCK | No focused calculation, recommendation, browser, print, or fail-closed tests existed. |
| Adversarial red team | BLOCK | Worse quote, federal loss, and deceptive lower-payment scenarios were reproducible. |
| Process improvement | WARN | A reusable schema required an automated build-time completeness check. |

## 6. Calculation assumptions

- Interest accrues monthly at APR divided by 12; payment follows interest accrual.
- The current schedule uses entered principal, APR, and monthly payment; entered remaining term is a statement cross-check.
- Optional lump sum is applied immediately; optional additional payment is recurring.
- A quote payment is calculated from remaining principal, entered APR, and entered term; final payment may be smaller.
- Entered lender/origination fees are paid upfront and included in total repayment/cost difference, not financed.
- Break-even is the first month cumulative estimated interest savings equals entered upfront fees.
- Variable APR is held constant only for the estimate.
- No prepayment penalty, tax effect, approval, promotional/autopay change, credit effect, or lender-specific protection is modeled.
- Calculations retain cents; display and portable output round currency to whole dollars and duration to whole months.
- `Accelerate repayment` requires at least one modeled month and more than the $1 cost-comparison tolerance in interest savings; merely entering an extra payment is not a benefit.
- A quote whose calculated payment cannot safely amortize the balance fails into `Insufficient information`; finite-looking output is not accepted when floating-point underflow would hide a non-amortizing schedule.
- The current promissory note, payoff statement, and final lender disclosure control.

## 7. Release gates and evidence

Release-candidate status on code head `cfb23186c1736cd92521cc8b0810836d19c8a956`:

- [x] Full repository suite passes: 94 files / 529 unit and component tests, TypeScript, lint with zero errors, governance/content/route/SEO/AdSense/build/bundle/prerender checks.
- [x] Focused domain, schema, analytics, commercial, component, mobile, keyboard, axe, print, performance, and publication checks pass.
- [x] Exact-head CI `30641815512`, Browser certification `30641815266`, and Decision Journey `30641815288` pass.
- [x] Vercel preview `dpl_9bzL7KGPY1rCGW2udAbMi9hacvtS` is READY for the exact code head; route console and Vercel runtime-error checks are clean.
- [x] Direct and embedded routes were exercised at desktop and mobile widths; validation, focus, edit/restart, My Plan, neutral resources, and fail-closed commercial behavior were checked.
- [x] Browser artifact `8797849647` (`sha256:a949bd61185b0f837630d43c871aa88d53f3a349d854bbfef05e12dd7ba9eb17`) contains no-quote and complete-quote Letter/A4 PDFs. All 14 rendered pages were visually inspected; assumptions, recommendation, calculations, cautions, resources, and limitation are legible without privacy-banner duplication, clipping, or overlap.
- [x] Second anti-blindness review and all 22 final role statuses contain no BLOCK after the release-record sync below.
- [x] PR #232 has no review submission, unresolved inline thread, or actionable review comment.
- [ ] After merge, verify the `main` production deployment and live route, then append the merge SHA, deployment ID, smoke evidence, and rollback reference to PR #232.

### Final role quorum

| Registered role | Status | Final finding |
|---|---|---|
| Orchestrator | PASS | Scope, safeguards, release gates, and closeout remain integrated. |
| Context steward | PASS | Starting state, invalidated assumptions, decision/evidence/work records, and reassessment trigger are recorded. |
| Capability router | PASS | GitHub, Vercel, browser, repository, and official sources covered controlling evidence; unavailable live funnel/Search Console evidence remains explicit. |
| Executive strategy | WARN | The pilot is authorized and bounded, but no demand, economics, conversion, or satisfaction outcome is yet supportable. |
| Product management | PASS | The route now completes a bounded decision with all eight deterministic states and a prioritized action. |
| Healthcare user research | PASS | Loan-type uncertainty, current-document verification, healthcare shift-income volatility, and emergency-reserve tradeoffs are represented without assuming user knowledge. |
| Information architecture | PASS | Direct and student-loan-hub paths share one implementation and preserve the stable canonical route. |
| UX and design system | PASS | Progressive disclosure, edit/restart, focus, mobile, copy, My Plan, and print preserve the existing CAF system. |
| Content and evidence integrity | PASS | Current CFPB/Federal Student Aid boundaries, model assumptions, official guidance, and lender-document controls are distinguished. |
| Frontend engineering | PASS | Generic typed assumptions and outcome rendering pass desktop, mobile, keyboard, axe, and print checks. |
| Systems architecture | PASS | Pure domain, reusable schema/renderer, future-tool fixture, analytics, and commercial eligibility remain separated. |
| Backend, data, and security | PASS | No backend or sensitive persistence was added; fixed-only My Plan and categorical telemetry remain fail-closed. |
| Platform and DevOps | PASS | Exact-head CI, browser workflows, READY preview, artifact integrity, console, and runtime checks pass. |
| SEO and discovery | PASS | Canonical/indexing and accurate intent metadata remain stable; no unrelated registry or content expansion occurred. |
| Monetization and conversion | PASS | Independent and neutral paths are complete; partner configuration is absent and commercial UI fails closed. |
| Analytics and experimentation | PASS | Strict allowlists, sanitizer coverage, consent gating, and transition deduplication exclude all financial values and result state. |
| Accessibility, performance, and reliability | PASS | Focus/live semantics, named assumption region, keyboard/mobile/axe, route budgets, and Letter/A4 output pass. |
| Privacy, legal, and user protection | PASS | Federal/mixed/uncertain debt cannot receive refinance steering; local inputs are not transmitted or newly persisted. |
| Publishing and governance | PASS | Source freshness, publication constraints, decision-contract check, and synchronized release record are complete. |
| Quality and release | PASS | Ordinary, edge, malformed, worse-quote, zero-benefit, underflow, privacy, commercial, portable, browser, and publication regressions pass. |
| Adversarial red team | PASS | Previously reproducible federal-loss, deceptive lower-payment, zero-benefit, non-amortizing quote, and print-omission failures now fail safely or render correctly. |
| Process improvement | PASS | Typed portable assumptions and `decision-outcome:check` make the pilot's standard reusable and machine-checked. |

### Second anti-blindness findings

- The first final review invalidated a green-suite assumption: an extreme accepted quote could underflow into a finite payment and be misclassified. The domain now requires a payoff-safe quote and has a regression test.
- Full performance certification found both a hydration race and a mocked Vercel instrumentation request counted as application work. The journey now waits for hydration; only the mocked instrumentation path is excluded while LCP, CLS, long-task, byte, and real request budgets remain enforced.
- The first generated PDF omitted the recommendation header and repeated the privacy banner; later review found it also omitted user assumptions. Print CSS, the generic typed outcome, actual Letter/A4 generation, text extraction, and visual inspection now prevent those regressions.
- An entered extra payment was initially treated as sufficient for `Accelerate repayment`. The state now requires measurable modeled time and interest benefit, and a zero-benefit regression returns `Continue current plan`.
- The remaining warning is evidentiary rather than a code defect: successful release gates do not establish demand, comprehension, conversion, revenue, or satisfaction.

## 8. Rollback and intentionally excluded work

- **Rollback:** Revert the focused merge commit; the stable route, prior renderer, and no-backend data model make rollback self-contained. No migration, account, external write, or partner teardown is required.
- **Excluded:** Partner activation/ranking, live referral tracking, email capture, account/cloud storage, broad route registry, 403(b), general SEO/content expansion, Stripe/Supabase PR #224, and claims about traffic, conversion, revenue, or satisfaction.

## 9. Compounding closeout

- Project context: reviewed and updated for the reusable architecture.
- Decision ledger: CAF-D-007 added as an experiment.
- Evidence ledger: CAF-E-003 added with official-source boundary and freshness trigger.
- Work ledger: CAF-W-004 contains the release-candidate evidence and points to PR #232 for the post-merge SHA and production deployment closeout.
- Reusable assets: typed schema and portable assumptions, shared panel, pure domain, multi-quote adapter, strict analytics, fail-closed commercial resolver.
- Automated prevention: `decision-outcome:check` runs in build and test; focused zero-benefit, non-amortizing quote, portable assumption, browser, performance, and actual-PDF regressions were added.
- Remaining process debt: live task-completion and user-understanding evidence is unavailable.
- Trigger: sufficient post-release funnel/user evidence, source change, partner proposal, recommendation error, or second-tool adoption.
