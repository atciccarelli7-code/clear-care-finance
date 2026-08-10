# First-party journey evidence and flagship funnel coverage

## 1. Assignment charter

- **Plain-language request:** Use current evidence and connected systems to execute the highest-value work that advances CAF as a trustworthy, revenue-capable healthcare-financial decision business.
- **Actual user outcome:** CAF can learn whether consented visitors merely land on a page or actually start, finish, copy, print, resume, restart, or continue from a guided decision—without collecting their answers.
- **Affected audiences:** Healthcare workers, patients/caregivers, Medicare users, and CAF operators.
- **Business outcome:** Replace opinion-led prioritization with a queryable product funnel across the flagship systems most connected to search traction and future paid workflow value.
- **Success metrics:** Valid view/start/result/action denominators; zero answer-level properties; five priority flagships covered; existing shared journey events mirrored; safe production endpoint; no route, SEO, commerce, or user-flow regression.
- **Constraints:** Analytics consent required; no PHI, financial amounts, answers, URLs, employer/plan/provider identifiers, IP capture, or public database access; consented sessions are not representative of all visitors.
- **Non-goals:** New content, a new tool, live pricing, Stripe writes, account expansion, attribution modeling, or causal claims.
- **Risk class:** Moderate because production analytics storage and privacy copy change.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Canonical routes for 403(b), total compensation, Benefits, Hospital Financial Assistance, and Medicare are live; production matched `aff8b6afb48a9435584fd16cc43c5ad0f70431cb` at assignment start | 2026-08-10 | Route presence and representative browser inspection; behavior evidence remains sparse |
| GitHub/main | `atciccarelli7-code/clear-care-finance` main at `aff8b6a`; mature products, consent helpers, analytics contracts, Supabase, Stripe, and work records exist | 2026-08-10 | Repository implementation is not production-use evidence |
| Relevant PRs/issues | Recent work packets show HFA and Medicare were already built and subsequently released to main despite stale in-progress closeout text | 2026-08-10 | Registry lag must not be treated as absent implementation |
| Vercel/runtime | Production deployment `dpl_FbJonDDqUJzSgJ7S38PVaZ7ngx2n` was READY at start | 2026-08-10 | Release candidate and post-merge evidence recorded in closeout |
| Supabase/data/auth | Active project `uzfcvtgnpkvuapgrkfcb`; `growth_events` contained 12 sparse navigation/offer records and no flagship completion evidence | 2026-08-10 | Consent and low traffic limit coverage; absence does not prove zero use |
| Stripe/payments | Existing safe premium boundary remains; no Stripe or price change is required for this intervention | 2026-08-10 | No willingness-to-pay conclusion |
| Search/analytics | August 10 Search Console export: daily coverage 2026-06-21 through 2026-08-08; 17 daily clicks/1,490 impressions; page table 18 clicks/1,992 impressions; 396 disclosed queries had 0 clicks/862 impressions because low-volume click queries are privacy suppressed | 2026-08-10 | GSC tables do not reconcile exactly and cannot show product completion |
| Project research | *What Makes Websites Succeed and What Community Acquired Finance Should Become* recommends pathways, printable outputs, completion tracking, and depth in bills, compensation, benefits, and Medicare | 2026-08-10 re-read | July 21 strategy research; route/product descriptions were partly stale |
| External primary sources | Current Supabase RLS and API-security guidance requires RLS, explicit grants, and server-only privileged keys | 2026-08-10 | Official guidance does not validate CAF's implementation without direct checks |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| Healthcare-worker decisions are the clearest search foothold | Supported inference | August 10 GSC page/query export | 2026-08-10 | Small sample, lag, suppressed click-query joins |
| Narrow patient-cost actions outperform broad explanations at some CAF URLs | Supported inference | Facility-fee, HFA-before-paying, and EOB/bill page rows | 2026-08-10 | Too small for causal or general ranking claim |
| CAF cannot currently query flagship completion from connected systems | Verified fact | Supabase rows, connected reporting access, repository analytics | 2026-08-10 | GA/Vercel may contain data unavailable to this operating surface |
| A first-party answer-free lifecycle layer is the best next intervention | Supported inference | Search traction + completed products + measurement gap + research | 2026-08-10 | Must earn value through future consented volume |
| Necessary-only visitors must produce no journey row | Conservative precaution | CAF privacy posture | 2026-08-10 | Reduces sample size by design |

## 4. Context and decision memory

- Relevant context: healthcare-worker compensation/benefits, patient costs, Medicare transitions, complete systems, trust before monetization.
- Active decisions: CAF-D-003, D-005, D-010, D-014, D-015, D-016.
- Potential conflict: D-010 intentionally bounded first-party evidence to `/insurance`; expansion is justified only because the same missing outcome evidence now blocks prioritization across released flagships.
- Prior work: CAF-W-007 through W-013; existing strict `trackJourneyEvent` calls are reused rather than replaced.
- Founder confirmation required: none for this reversible, non-commercial measurement change.
- Registry gap: stale HFA/Medicare release text was reconciled against current main and production.

## 5. Inherited-decision challenge gate

| Inherited item | Current status | Present impact | Challenge and disposition | Revisit trigger |
|---|---|---:|---|---|
| Third-party consented analytics | Confirmed but operationally incomplete | Many events, no connected flagship funnel | Preserve and mirror only strict journey events | Connected reporting becomes complete and queryable |
| Bounded first-party `growth_events` | Confirmed for navigation experiments | 12 rows; no completion fields | Preserve; use a separate lifecycle table so bounded experiment semantics do not drift | Schema cost, privacy concern, or consolidation plan |
| Browser-local answers | Confirmed | Protects trust and reduces backend risk | Keep all answers local; transmit lifecycle only | Genuine saved-work need with reviewed data model |
| Add more high-intent tools | Provisional | More surface area but no learning loop | Defer; complete the evidence system across products already built | Funnel evidence identifies a specific missing user outcome |
| Passing tests equals readiness | Rejected | Can hide hydration/runtime defects | Browser, endpoint, database, and production evidence remain separate gates | Every release |

## 6. Capability plan

| Need | Authoritative system/tool | Workflow | Fallback | Risk |
|---|---|---|---|---|
| Search baseline | August 10 GSC export | Reproducible notebook + direct CSV reconciliation | Manual CSV query | Read-only |
| Product/release truth | GitHub, production, Vercel | Exact SHA/deployment inspection | Local build | Read-only then release write |
| Evidence store | Supabase | Migration, grants/RLS inspection, rolled-back write matrix | Do not release endpoint | Moderate |
| UX/runtime | Browser certification | Desktop/mobile/consent journeys | CI Playwright | Read-only runtime |
| Governance | Repository records | Work packet + ledgers + event dictionary | PR record | Low |

## 7. Independent role matrix

| Role | Status | Material finding and acceptance test |
|---|---|---|
| Orchestrator / context / capability | PASS | Current production, main, GSC, research, and Supabase reconciled before scope selection |
| Executive strategy / product | PASS | Complete the learning loop around released flagships before expanding surface area |
| Healthcare user research | PASS | No workflow question, answer, health detail, employer, hospital, or plan is transmitted |
| Information architecture / UX | PASS | No visible journey structure or navigation changes; user actions remain uninterrupted on analytics failure |
| Content and evidence integrity | PASS | No financial, legal, insurance, tax, or medical claim changed |
| Frontend / systems architecture | PASS | One shared strict contract and helper; existing journey calls compound automatically |
| Backend, data, security | PASS pending production check | Same-origin endpoint, exact keys, service-only table, forced RLS, least privilege |
| Platform and DevOps | PASS pending release | Exact-head CI, preview, migration, production smoke, and logs required |
| SEO and discovery | PASS | No canonical, route, sitemap, structured-data, or indexability change |
| Monetization and conversion | WARN | System measures progression but cannot yet prove willingness to pay |
| Analytics and experimentation | PASS | Five new flagship funnels plus existing strict journeys become first-party queryable |
| Accessibility, performance, reliability | PASS pending browser | No UI control added; desktop/mobile/runtime certification still required |
| Privacy, legal, protection | PASS | Explicit analytics consent; public roles receive no table access; disclosure updated |
| Publishing / quality / release | PASS pending release | Documentation, full suite, browser, advisors, merge, and production evidence required |
| Adversarial red team | PASS | Endpoint rejects non-origin and non-allowlisted payloads; storage excludes all user values |
| Process improvement | PASS | Future feature prioritization can use result rates, not page impressions alone |

## 8. Executive accountability matrix

| Perspective | Status | Finding | Consequence / acceptance |
|---|---|---|---|
| CEO / COO | PASS | Measurement integrity is the bottleneck after rapid product buildout | Release one coherent evidence layer, not another feature |
| CFO / CRO | WARN | No conversion or WTP baseline exists | Do not change $29 or activate commerce from search impressions |
| CPO / CTO | PASS | Shared strict instrumentation compounds across current products | One contract, one endpoint, one private table |
| Data / Marketing | PASS | GSC identifies qualified entry points but not downstream value | Join search decisions to aggregate journey outcomes operationally, never at user level |
| Editorial / Healthcare context | PASS | No claim logic or professional-authority boundary changes | Keep public safety and official verification free |
| Privacy / Accessibility / Quality | PASS pending release | Consent, least privilege, browser, and production runtime are hard gates | Block release on boundary failure |
| Red team / Process | PASS | Sparse consented evidence can still mislead | Require denominators and minimum sample sizes; do not claim causality |

## 9. Anti-blindness findings

- The prompt emphasized many possible builds; the live product already contained most of them.
- The largest omission was not another user-facing surface but observable completion.
- Strongest argument against this work: low consented traffic may make results slow and nonrepresentative.
- Weakest assumption: an event-defined “result reached” is a sufficient proxy for user value.
- Largest unused opportunity: use existing shared journey events as a single queryable evidence stream.
- A metric that could improve while the product worsens: start rate can rise if entry is easier while result quality declines; result/portable-action and guardrails must be reviewed together.
- Reversal evidence: privacy concern, endpoint abuse/cost, negligible consented volume, or direct research showing events misclassify success.

## 10. Quantified before-and-after impact

| Measure | Before | After | Change | Consequence |
|---|---:|---:|---:|---|
| Canonical routes | 182 | 182 | 0 | Search authority preserved |
| Ad-eligible routes | unchanged | unchanged | 0 | No advertising expansion |
| User-completable flagship journeys | 5 selected | 5 selected | 0 | No workflow disruption |
| Selected flagships with first-party view/start/result | 0/5 | 5/5 | +5 | Search entrants can be evaluated through result reach |
| Known fixed journeys eligible for first-party lifecycle evidence | 0 | at least 11 | +11 | Existing Concierge, offer, and readiness work compounds |
| Answer/value fields permitted | 0 | 0 | 0 | Privacy boundary preserved |

- **Monetization:** Measures precursors to portable and paid workflow value; does not activate or prove revenue.
- **SEO:** Enables qualified-traffic prioritization without changing pages.
- **Maintenance:** One migration/table and exact event contract; no external analytics dependency added.
- **Rollback:** Revert client mirror/API; archive or drop the isolated table only after evidence-retention review.

## 11. Anomaly gate

- [x] Creates a potential technical-success/business-value mismatch because events may remain sparse.
- [ ] Changes more than 20% of a visible site surface, reduces indexable/monetizable inventory, removes functionality, or contradicts a confirmed objective.

Mitigation: treat all rates as consented-session evidence, report numerator and denominator, require at least 25 viewed sessions per journey before directional product conclusions, and never infer satisfaction or causality from lifecycle rows alone.

## 12. Candidate work ranking

| Candidate | User value | Business value | Strategic fit | Confidence | Effort/risk | Decision |
|---|---:|---:|---:|---:|---:|---|
| Queryable flagship lifecycle evidence | 7 | 10 | 10 | 9 | 5 | Selected |
| Further HFA product expansion | 9 | 8 | 9 | 6 | 9 | Defer until completion evidence |
| Near-winner SEO copy/internal links | 7 | 7 | 9 | 7 | 4 | Next after evidence baseline |
| Medicare feature expansion | 8 | 7 | 9 | 5 | 9 | Preserve; wait for product evidence |
| Activate $29 commerce | 6 | 9 | 7 | 2 | 8 | Reject without WTP and certified test chain |
| Generic personal-finance content | 3 | 3 | 2 | 5 | 5 | Reject |

## 13. Integrated decision

- **Selected outcome:** A consent-gated, first-party, answer-free lifecycle mirror for strict journey events, with explicit coverage on five priority flagships.
- **Why it outranks alternatives:** It improves every subsequent product, SEO, and monetization decision while reusing completed systems and carrying no claim or calculation risk.
- **Architecture:** Client consent check → strict sanitizer → same-origin API → server-only Supabase table with forced RLS and exact constraints.
- **Instrumentation:** View, start, bounded step, result, copy, print, resume, restart, and official handoff where implemented.
- **Reassessment:** 2026-09-07 or 25 consented views per journey, whichever is later; immediately for a privacy/security/runtime defect.

## 14. Separate validation dispositions

### Technical validation

- **Status:** PASS locally and in the production database; deployment/runtime closeout pending.
- **Implementation correctness:** 127 test files / 721 tests pass. The first full run exposed one stale HFA analytics-test allowlist; the test was updated to recognize the new coarse journey keys, and the complete suite then passed.
- **Tests and typing:** Focused parser/client/migration/flagship tests, API TypeScript, lint with zero errors (15 existing Fast Refresh warnings), and the full repository suite pass.
- **Security and privacy:** Supabase accepted a valid service-role event inside a rolled-back transaction, rejected a non-allowlisted journey/variant, denied anonymous reads, retained forced RLS with no browser policies, and grants only SELECT/INSERT/DELETE to `service_role`.
- **Build/SEO:** Full production build, 182-route prerender, publication, premium, privacy boundary, sitemap, bundle, and search-readiness gates pass. Entry bundle is 496.87 KiB under the 500 KiB budget.
- **Advisors:** Security reports only the intentional informational `rls_enabled_no_policy` notice for this private table; performance reports its new read index as unused before production traffic. [Supabase lint reference](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- **Still required:** Exact-head preview desktop/mobile, consent-denied and consent-allowed endpoint behavior, merge, production route/API/log smoke.

### Business validation

- **Status:** WARN until adequate post-release evidence.
- **Finding:** The infrastructure is strategically sound, but rows do not themselves prove usefulness, conversion, causality, or willingness to pay.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Owner |
|---|---|---|---|
| Strict contract/client | `journeyEventContract`, `journeyAnalytics`, first-party client | Exact keys, fixed tokens, consent required, failure is non-blocking | Data/privacy |
| Server/store | API + Supabase migration | Same origin, service role only, forced RLS, duplicate idempotence | Backend/security |
| Flagship coverage | Five React workflows | View/start/result on all; portable actions and steps where meaningful | Product/frontend |
| Disclosure/governance | Privacy UI/policy, event dictionary, work records | Data shape and purpose accurately disclosed | Legal/publishing |
| Release | GitHub, Vercel, Supabase, browser | Exact head passes and production is observable | Quality/release |

## 16. Release gates

- [x] Inherited-decision, quantified-impact, anomaly, architecture, privacy, and business-disposition gates complete.
- [x] Claims/calculations/SEO routes unchanged.
- [x] Full tests, lint, type checks, and build.
- [x] Supabase migration, effective privileges, rolled-back valid/invalid write checks, and advisors.
- [ ] Exact-head CI.
- [ ] Preview desktop/mobile, consent states, API response, no runtime/hydration/accessibility regression.
- [ ] Merge, production deployment, route/API/log smoke.

## 17. Executive closeout

- **What changed:** A private aggregate learning loop across priority products.
- **What did not:** User answers, routes, products, calculations, claims, pricing, Stripe, entitlements, saved work, or ads.
- **Unresolved warning:** Post-release sample and user-value evidence do not yet exist.
- **Owner-only action:** None for release; future pricing still requires actual demand evidence and certified test commerce.
- **Single highest-value next action:** After the minimum sample, improve the highest-impression qualified entry whose start-to-result rate shows a remediable journey break.

## 18. Compounding closeout

- Project context/decision/evidence/work ledgers: updated in the release branch.
- Reusable asset: strict journey evidence schema, endpoint, client mirror, tests, and aggregate reporting contract.
- Automated regression: parser/privacy/migration/flagship-coverage tests.
- Process debt: no connected self-serve dashboard yet; aggregate SQL remains the operating interface.
- Reassessment trigger: 2026-09-07, 25 consented views per journey, or any privacy/security/runtime issue.
