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
2. `DecisionProductDefinition` declares decision identity, states, verification, cautions, resources, portable capability, My Plan, analytics, monetization, disclosure, freshness, and release constraints.
3. `DecisionOutcomePanel` renders the generic outcome. The calculator is a thin form adapter.
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
- The current promissory note, payoff statement, and final lender disclosure control.

## 7. Release gates and evidence

Final status must be updated before merge:

- [ ] Full repository test/lint/type/build suite passes.
- [ ] Focused domain, schema, analytics, commercial, component, mobile, keyboard, axe, print, performance, and publication checks pass.
- [ ] Final-head CI and Vercel preview are healthy.
- [ ] Direct and embedded routes are inspected on desktop and mobile; console/network/focus/print are clean.
- [ ] Second anti-blindness review and all 22 final role statuses contain no BLOCK.
- [ ] No unresolved actionable review thread remains.
- [ ] Main merge and production deployment match; live route smoke passes.

## 8. Rollback and intentionally excluded work

- **Rollback:** Revert the focused merge commit; the stable route, prior renderer, and no-backend data model make rollback self-contained. No migration, account, external write, or partner teardown is required.
- **Excluded:** Partner activation/ranking, live referral tracking, email capture, account/cloud storage, broad route registry, 403(b), general SEO/content expansion, Stripe/Supabase PR #224, and claims about traffic, conversion, revenue, or satisfaction.

## 9. Compounding closeout

- Project context: reviewed and updated for the reusable architecture.
- Decision ledger: CAF-D-007 added as an experiment.
- Evidence ledger: CAF-E-003 added with official-source boundary and freshness trigger.
- Work ledger: CAF-W-004 added and must receive final release links.
- Reusable assets: typed schema, shared panel, pure domain, multi-quote adapter, strict analytics, fail-closed commercial resolver.
- Automated prevention: `decision-outcome:check` runs in build and test; focused regression and browser tests added.
- Remaining process debt: live task-completion and user-understanding evidence is unavailable.
- Trigger: sufficient post-release funnel/user evidence, source change, partner proposal, recommendation error, or second-tool adoption.
