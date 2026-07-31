# Community Acquired Finance Work Ledger

This ledger records the outcome and reusable learning from material assignments. It is not a backlog and should not become a transcript.

## Entry template

### `[WORK ID] — [Outcome]`

- **Date:**
- **Assignment:**
- **Starting evidence:**
- **Decision:**
- **Implementation:**
- **Validation:**
- **Release state:**
- **User and business impact expected:**
- **What was learned:**
- **Assumption invalidated:**
- **Reusable asset created:**
- **Process improvement implemented:**
- **Unresolved warning:**
- **Evidence or event that should trigger reassessment:**
- **Links:**

## Completed work

### CAF-W-001 — Multi-role agent operating system

- **Date:** 2026-07-30
- **Assignment:** Prevent founder prompt wording or a single current blocker from narrowing future website evaluations.
- **Starting evidence:** Prior reviews emphasized search quality and AdSense readiness while failing to elevate high-intent monetization architecture until an external critique exposed it.
- **Decision:** Require an orchestrator and independent specialist roles to inspect strategy, product, healthcare users, architecture, UX, engineering, evidence, growth, monetization, analytics, risk, publishing, release, and adversarial concerns.
- **Implementation:** Added `AGENTS.md`, one orchestrator skill, 18 specialist skills, a unified master prompt, and a role-quorum document.
- **Validation:** GitHub PR #229 was reviewed and merged; only governance and skill files changed.
- **Release state:** Merged to `main` in commit `4422189036657f43e6391ceebeeb7cc4ee07cb66`.
- **User and business impact expected:** Broader, more intentional site work with fewer single-lens blind spots.
- **What was learned:** Independent role review needs durable memory and automated enforcement or future agents may still rediscover context and omit required operating steps.
- **Assumption invalidated:** A sufficiently detailed one-time master prompt is enough to preserve quality across future sessions.
- **Reusable asset created:** Repository-native role system.
- **Process improvement implemented:** Role-status contract and anti-blindness opportunity scan.
- **Unresolved warning:** Documentation alone does not prove compliance.
- **Evidence or event that should trigger reassessment:** A future task omits a role, repeats prior discovery, or produces a material miss despite the quorum.
- **Links:** PR #229.

### CAF-W-002 — Compounding context and workflow controls

- **Date:** 2026-07-30
- **Assignment:** Implement every safe improvement available now that can make future Community Acquired Finance work faster, more informed, and less dependent on founder prompting or chat memory.
- **Starting evidence:** The role system could review assignments but lacked a persistent context file, decision ledger, evidence map, work history, capability-routing role, learning role, work-packet contract, and automated drift check.
- **Decision:** Add a repository-native compounding loop and enforce it through machine-readable role registration, pull-request controls, and build/test validation.
- **Implementation:** Added context-steward, capability-router, and process-improvement skills; project context; decision, evidence, and work ledgers; work-packet and compounding-loop templates; a 22-role registry; governance check; pull-request template; and orchestration rules requiring preflight and closeout.
- **Validation:** The new governance check ran inside the Vercel build and passed. Existing publication, content freshness, patient-guide contracts, AdSense governance, unit tests, production build, bundle budget, prerender, comprehensive route, search-readiness, and decision-journey checks passed on the pull-request branch before merge; the latest browser and CI runs remain the authoritative release evidence in PR #230.
- **Release state:** Delivered through PR #230 from `codex/caf-compounding-operating-system`; GitHub and Vercel are authoritative for the final merge SHA and deployment state.
- **User and business impact expected:** Less repeated explanation, faster current-state orientation, more reliable tool use, explicit evidence provenance, earlier detection of conflicts, and systematic conversion of every assignment into reusable assets or checks.
- **What was learned:** Compounding requires a closed loop—retrieve context, verify, route capabilities, decide, execute, validate, record, automate, and re-enter the next task with better priors. The rollout itself caught two defects before merge: an accidental package reconstruction omitted existing build dependencies, and the initial governance check assumed one exact completion-heading convention. Both were corrected, and the final package diff was reduced to the intended script additions only.
- **Assumption invalidated:** Versioned role instructions alone create sufficient project memory, and documentation-only changes are immune from implementation regression.
- **Reusable asset created:** Full compounding operating system with machine-readable role governance and reusable work packet.
- **Process improvement implemented:** AI governance now runs in both `npm test` and `npm run build`; pull requests require evidence, role, anti-blindness, validation, and compounding closeout.
- **Unresolved warning:** The system still depends on agents following repository instructions. CI can detect structural drift but cannot prove the quality of every future reasoning pass; failures or repeated founder explanation must trigger process-improvement review.
- **Evidence or event that should trigger reassessment:** Repeated founder context requests, stale or contradictory ledgers, governance check failures, material misses despite the role quorum, or process overhead that exceeds the failures it prevents.
- **Links:** PR #230.

### CAF-W-003 — Full site and code multi-role audit

- **Date:** 2026-07-31
- **Assignment:** Review the live site and latest code using the complete multi-role and compounding operating method.
- **Starting evidence:** Current GitHub `main`, current Vercel production deployment and runtime state, governing context and ledgers, core route and tool architecture, analytics and privacy contracts, the email API, and direct production inspection of representative flagship and high-intent journeys.
- **Decision:** The main constraint is uneven decision completion across the route portfolio, not baseline technical health. Prioritize a reusable Decision Outcome Layer before broad affiliate placement or additional route creation.
- **Implementation:** Added the dated audit report at `docs/audits/2026-07-31-site-code-multi-role-review.md`; no public application behavior was changed.
- **Validation:** Verified production deployment readiness and HTTP 200 behavior, no identified seven-day Vercel runtime error clusters, current release status, representative live routes, and current source code. The documentation branch remains subject to repository checks before merge.
- **Release state:** Documentation branch and pull request to be recorded at completion.
- **User and business impact expected:** Future implementation begins from a ranked cross-functional diagnosis instead of repeating broad audits or reacting to the narrowest current blocker.
- **What was learned:** The new role method materially distinguishes flagship systems that complete decisions from older calculators that are technically useful but end in internal content loops. It also exposed calculation-integrity, endpoint-abuse, route-registry, dormant-email, and measurement-evidence issues that no single SEO, monetization, or code lens would prioritize together.
- **Assumption invalidated:** Strong technical controls and a large tool inventory imply consistent product maturity or business readiness across every route.
- **Reusable asset created:** Dated, evidence-bounded site and code audit with role matrix, anti-blindness findings, and a single recommended next project.
- **Process improvement implemented:** Future full-site audits should compare at least one flagship decision system and one legacy high-intent calculator rather than treating the route portfolio as homogeneous.
- **Unresolved warning:** Search Console, AdSense-account, live funnel, email-delivery, Stripe, Supabase, and direct user-research outcomes were unavailable and must not be inferred from code quality.
- **Evidence or event that should trigger reassessment:** Current funnel evidence identifies a higher-value pilot than private student-loan payoff, or implementation of the Decision Outcome Layer materially changes route behavior.
- **Links:** `docs/audits/2026-07-31-site-code-multi-role-review.md`.

### CAF-W-004 — Decision Outcome Layer and private student-loan pilot

- **Date:** 2026-07-31
- **Assignment:** Build, validate, release, and document a reusable Decision Outcome Layer and its first complete implementation on the Private Student Loan Payoff Calculator.
- **Starting evidence:** `main` and production matched `a27d2404c648c9f862e4cf571570dae9799ba415`; the live route used reactive six-field math, did not verify loan type, modeled refinance by APR alone, and clamped a worse quote to `$0 extra interest saved`; open draft PR #224 remained unrelated; no connected Search Console or CAF analytics reporting tool was available.
- **Decision:** Implement the smallest complete layered system: pure monthly amortization and quote comparison, deterministic recommendation states, a reusable typed product contract/panel, strict categorical analytics, fixed-only My Plan storage, official neutral resources, and a commercial resolver that fails closed without verified configuration.
- **Implementation:** Added the typed outcome schema and shared renderer; extracted private-loan calculation/recommendation logic; added loan-type gating, complete quote terms, fees, fixed/variable treatment, total-cost and break-even output, copy/print/restart/edit/My Plan, source freshness, neutral resources, and direct student-loan routing. No account, backend, email capture, lender, affiliate URL, or raw financial telemetry was added.
- **Validation:** On code head `cfb23186c1736cd92521cc8b0810836d19c8a956`, 94 files / 529 tests, TypeScript, lint with zero errors, the complete governance/content/route/SEO/AdSense/build/bundle/prerender suite, CI `30641815512`, Browser certification `30641815266`, and Decision Journey `30641815288` passed. Vercel preview `dpl_9bzL7KGPY1rCGW2udAbMi9hacvtS` was READY with no inspected app-console or route runtime error. Browser artifact `8797849647` supplied no-quote and complete-quote Letter/A4 outputs; all 14 rendered pages were visually inspected.
- **Release state:** Release candidate approved on PR #232 from `agent/decision-outcome-private-loan-pilot`; all 22 final roles have no BLOCK. GitHub PR #232 is the controlling record for the post-merge `main` SHA and production deployment verification that cannot exist in a pre-merge repository commit.
- **User and business impact expected:** Users receive a defensible next action rather than an isolated number; federal/mixed/uncertain borrowers are blocked from private refinance steering; the same contract can complete future high-intent tools; the commercial seam exists without asserting a partner or revenue outcome.
- **What was learned:** The July 31 audit direction was correct but understated several concrete integrity risks: a 12% quote against a 9% current APR was displayed as `$0 saved`; a mathematically underflowed extreme quote could look finite; merely entering an extra payment could overstate benefit; and a screen-complete result could still lose its assumptions in print. The existing fixed-action My Plan and consent-gated analytics foundations were reusable, while calculator-specific math was not.
- **Assumption invalidated:** A lower displayed refinance APR plus a same-payment payoff is a coherent proxy for a refinance quote; a page title saying “private” establishes loan type; an entered extra payment necessarily creates a benefit; or screen coverage alone proves a portable result is complete.
- **Reusable asset created:** `DecisionProductDefinition`, typed portable assumptions, `DecisionOutcomePanel`, strict outcome analytics, pure refinance comparison domain, multi-quote domain adapter, and fail-closed commercial resolver.
- **Process improvement implemented:** A build/test `decision-outcome:check` now enforces required schema, freshness, neutral-alternative, analytics allowlist, loan-type, disclosure, and recommendation/commercial separation controls. Actual no-quote and complete-quote Letter/A4 PDFs are generated in browser certification, and regressions cover portable assumptions, measurable acceleration, and payoff-safe extreme quotes.
- **Unresolved warning:** No direct demand, completion, search, conversion, affiliate economics, or user-satisfaction evidence is available; no partner may be activated without an external relationship and qualified review of the actual agreement and data flow.
- **Evidence or event that should trigger reassessment:** Sufficient live funnel and user-test evidence after release; official-source or lender-partner change; any recommendation-calculation discrepancy; federal/mixed/uncertain handoff exposure above zero; or difficulty applying the contract to a second tool.
- **Links:** `docs/work-packets/2026-07-31-decision-outcome-private-student-loan.md`; GitHub PR #232. The PR closeout comment records the final merge commit and production deployment.

## Maintenance rules

- Add entries only for material work that changes the product, operating system, evidence base, or strategic direction.
- Update an in-progress entry when validation and release finish; do not create a duplicate completion entry.
- Record failures and reversals, not only successes.
- Convert repeated warnings into an owner, test, skill update, or explicit accepted risk.
- Keep the ledger concise; detailed implementation remains in pull requests and linked documentation.
