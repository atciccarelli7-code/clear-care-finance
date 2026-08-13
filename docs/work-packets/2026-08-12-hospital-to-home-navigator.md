# Hospital-to-Home Coverage & Cost Navigator

**Work ID:** CAF-W-018
**Date opened:** 2026-08-12
**Status:** In progress — implementation complete; release evidence pending

## 1. Assignment charter

- **Plain-language request:** Audit current CAF, challenge the inherited strategy, select one bounded experiment, implement it completely, release it safely, and leave one evidence-triggered next decision.
- **Actual user outcome:** A patient, caregiver, or advocate facing discharge can answer 8–10 fixed questions and receive a personalized Discharge Coverage & Cost Brief that separates risks, unknowns, action sequence, action owner, cost exposure, and authoritative verification.
- **Affected audiences:** Patients, caregivers, advocates, and healthcare workers helping with a hospital-to-home transition; the founder as experiment operator.
- **Business outcome:** Learn whether urgent care-transition decision support earns completion and high-intent use before CAF invests in accounts, case persistence, document intake, human operations, or another price test.
- **Success metrics:** Consented unique view, start, result, browser-local save, copy, print, approved handoff, and step-reach sessions for `hospital_to_home` on `hospital_guide`.
- **Constraints:** One existing canonical route; free value first; no live payment; no new price test; no PHI or free text; no account requirement; no document upload; no national pricing or provider directory; authoritative sources; existing CAF architecture and strict evidence mirror.
- **Non-goals:** Clinical discharge planning, coverage determination, insurance brokerage, claim filing, appeal filing, facility ranking, DME commerce, general case-management platform, premium dashboard, human concierge, or new SEO page family.
- **Risk class:** Moderate. The output affects time-sensitive financial and coverage conversations but remains educational, low-sensitivity, and verification-first.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Canonical site and `/insurance/hospital-discharge-coverage` inspected at the current production deployment | 2026-08-12 | Production matched main before this branch; real user behavior remains sparse |
| GitHub/main | Main `f9119ccfc4a67ec18f6080da74f158b8c63a83ba`; clean clone; 182 indexable canonical routes | 2026-08-12 | Current source and generated route inventory |
| Product inventory | 72 articles, 36 tools, 19 financial-assistance routes, 11 patient routes, 10 insurance routes; at least 15 discharge-adjacent indexed routes | 2026-08-12 | Route counts describe surface area, not quality or demand |
| Existing discharge product | The canonical page combined a long source-backed guide, a shallow local checklist, and a generic one-owner command center | 2026-08-12 | Useful content existed, but action ownership and branch-specific risk logic were fragmented |
| Vercel/runtime | Production `dpl_J1c2G4Dh1xUR4vsyJ1baNGpW55HU` was READY on the main SHA with 12 Node functions | 2026-08-12 | Pre-change baseline; final deployment still pending |
| Supabase | Project `uzfcvtgnpkvuapgrkfcb` is ACTIVE_HEALTHY on Postgres 17.6.1; `journey_events` has forced RLS and service-role-only privileges | 2026-08-12 | Direct schema/policy inspection; no browser role can write the table |
| Analytics | `journey_events`: 0 rows; `growth_events`: 12 sparse navigation rows; Benefits v2 commitments: 0 | 2026-08-12 | No product or willingness-to-pay conclusion is possible |
| Search | Latest available repository export contained 13 clicks and 1,139 impressions across 105 rows | 2026-07-29 export, reviewed 2026-08-12 | Search Console connector was unavailable; no reliable current hospital-to-home query denominator |
| Benefits benchmark | A complete free Benefits Decision System now exposes one post-result hypothetical $29 workspace commitment test | 2026-08-12 | Zero qualified v2 views and zero commitments; preserve unchanged |
| Payments | Stripe/test and product-entitlement foundations exist but remain fail closed for live commerce | 2026-08-12 | Technical readiness is not demand evidence |
| External alternatives | GlobalCareNavigator offers a discharge-home checklist/directories/DME commerce; Wellthy provides employer-sponsored human care concierge; Medicare Care Compare supplies official provider comparison | 2026-08-12 | First-party product descriptions; no independent outcome evidence |
| Crowded adjacent markets | Dollar For offers free financial-assistance help; Goodbill markets bill review/negotiation; Jellyvision ALEX and Nayya serve mature employer-benefits decision support | 2026-08-12 | Company claims establish availability, not effectiveness |
| Primary coverage sources | Current Medicare inpatient/outpatient status, SNF, home-health, DME, appeals/fast appeals, and Care Compare pages were live | 2026-08-12 | Medicare Advantage, Medicaid, commercial, and provider-specific rules still require live verification |
| Supplied research | `What Makes Websites Succeed and What Community Acquired Finance Should Become.pdf` favored urgent tools, progressive disclosure, source trust, and free-value-first monetization | Reviewed 2026-08-12 | Older route and opportunity ranking predates current product releases and cannot select this experiment by itself |
| Connected operating systems | GitHub, Vercel, Supabase, Firecrawl, repository documentation, and local attached sources were accessible | 2026-08-12 | Search Console was not; `graph 2.html` attachment did not arrive and was not used |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| CAF already has excessive product breadth | Verified fact | 182-route inventory and product map | 2026-08-12 | Route count does not mean every route is redundant |
| The existing discharge page is the correct canonical acquisition surface | Supported inference | Indexed route, related internal links, current content, no competing product URL | 2026-08-12 | Current query demand is unknown |
| Care-transition financial navigation can express RN/case-management differentiation | Supported inference | Existing discharge logic plus cross-party coverage/acceptance sequence | 2026-08-12 | Product-use evidence is not yet available |
| A personalized owner-assigned brief is differentiated from checklist/directory alternatives | Supported inference | Direct product inspection of current alternatives | 2026-08-12 | Competitors can change and private features may not be visible |
| Original Medicare observation time generally does not count toward the standard three-day SNF qualifying stay | Verified source fact | Medicare.gov inpatient/outpatient and SNF coverage pages | 2026-08-12 | Current waivers, exceptions, MA rules, and individual facts require verification |
| A referral or order proves authorization, network status, acceptance, or patient cost | Rejected | Payer/provider workflow separation | 2026-08-12 | None; product explicitly keeps these states separate |
| Users will pay $29 for a Hospital-to-Home workspace | Unresolved uncertainty | No offer or payment evidence | 2026-08-12 | This release intentionally does not test it |
| Existing Benefits willingness-to-pay has been validated | Rejected | Zero v2 views and zero commitments | 2026-08-12 | No data is not negative demand evidence |
| The current search export proves hospital-to-home acquisition demand | Rejected | Sparse, stale export with no qualified denominator | 2026-08-12 | Revisit with current connected search data |

## 4. Context and decision memory

- **Relevant project-context sections:** User-value-first, product naming/route governance, first-party journey evidence, premium fail-closed boundary, source and privacy standards.
- **Active decision IDs:** CAF-D-003, CAF-D-014, CAF-D-015, CAF-D-016, CAF-D-017, CAF-D-020.
- **Decisions potentially in conflict:** CAF-D-017 cautions against another major standalone system. This work resolves the conflict by consolidating an existing route and deleting duplicate shallow UX rather than adding a route or platform.
- **Prior work-ledger entries:** CAF-W-013 through CAF-W-017 were inspected; especially Medicare, first-party evidence, search-to-decision loops, and Benefits pre-commerce.
- **Evidence records needing revalidation:** CAF-E-013 and CAF-E-017 remain technically relevant; their zero/sparse current business evidence was rechecked.
- **Founder confirmation required:** None for this reversible free experiment. Payment, paid infrastructure, human service, PHI intake, or plan-specific commercial conduct still requires a separate decision.
- **Prior completed work reconciled:** Benefits v2, Medicare product, Hospital Financial Assistance, shared Decision Plan, strict journey event mirror, print contract, Vercel release flow, and Supabase forced-RLS patterns.
- **Registry gaps:** The route was not a named flagship in every registry; direct route/source inspection proved the work existed and prevented a duplicate build.

## 5. Inherited-decision challenge gate

| Inherited item | Established when/why | Original evidence | Current status | Quantified present impact | Conflict or anomaly | Missing evidence | Red-team challenge | Revisit trigger |
|---|---|---|---|---:|---|---|---|---|
| Go deeper, not broader | 2026 strategy work | Broad route inventory and competitive research | Confirmed | 182 canonical routes preserved; 0 added | Could become an excuse to polish low-demand work | Current qualified demand | Consolidation must improve a complete task, not just copy | 25 consented views or new search evidence |
| Hospital-to-Home is the next candidate | August 12 hypothesis | RN domain fit and care-transition complexity | Confirmed as experiment, not business | 1 route changed | Search demand is not proven | Completion and high-intent use | Stop expansion if usage is weak | Thresholds in section 13 |
| Benefits remains the commercial benchmark | CAF-D-020 | Existing post-value $29 test | Confirmed | 0 Benefits changes | Both experiments currently have zero evidence | Genuine v2 denominator | Do not add another price offer | Benefits threshold or H2H product-use proof |
| Persistent cases may be a core primitive | Strategic hypothesis | Recurring tasks/owners/evidence | Deferred | 0 tables, uploads, accounts, or case workflows added | Premature platform risk | Repeat/return behavior | Browser-local generic tasks are enough for v1 | Proven repeat use and explicit persistence pain |
| Existing route and guide should be preserved | Current SEO/product architecture | Indexed canonical and supporting content | Confirmed | 182/182 canonical routes preserved | Long content could overwhelm the tool | Entry/start evidence | Put guided value first while retaining acquisition depth | Search or engagement regression |
| Shared journey evidence | CAF-D-017 | Service-only forced-RLS table and strict event contract | Confirmed and minimally extended | 1 key + 1 save event | Consent suppresses some denominator | Total traffic and qualitative feedback | Never call consented data representative | 25 consented views or privacy defect |
| $29 one-time offer | CAF-D-020 | Benefits-only hypothesis | Preserved, not reused | 1 active price test stays 1 | Temptation to compare before free value proof | H2H high-intent use | No H2H offer in this release | Benefits resolves and H2H clears product-use gate |

- Some inherited strategic research predates the current executive operating system and recent product releases; it was treated as directional evidence only.
- Passing technical tests proves implementation correctness, not demand, usefulness, satisfaction, willingness to pay, or enterprise value.
- Missing Search Console access was not treated as absence of demand; it reduced confidence and favored a lower-cost consolidation experiment.

## 6. Capability plan

| Need | Authoritative system/tool | Skill or workflow | Fallback | Write or risk level |
|---|---|---|---|---|
| Current source and release history | GitHub + local git | Repository/GitHub workflow | Direct clone and git remote | Moderate write at PR/merge |
| Production/deployment | Vercel | Deployment and hosted verification | Direct public URL + Firecrawl | Moderate release write |
| Data/RLS/evidence | Supabase | Schema, SQL, migration, advisors | Local migration inspection | High; backward-compatible DDL only |
| External product/source claims | Firecrawl/live web | First-party pages and primary government sources | Repository sources | Read only |
| Browser/responsive/accessibility | Playwright + hosted browser | Targeted E2E, axe, Firecrawl interact | Unit/jsdom + screenshots | Read-only browsing; durable test added |
| Uploaded research | Local PDF tools | PDF render/text verification | Existing strategy docs | Read only |
| Governance | Repository AI operating system | Work packet and ledgers | None | Documentation write |

## 7. Independent role matrix

| Role | Status | Material finding | Evidence | Action/acceptance test |
|---|---|---|---|---|
| Orchestrator | PASS | One existing route, one product loop, one evidence question | Scope diff | No second experiment |
| Context steward | PASS | Main, production, Vercel, Supabase, strategy, and recent PRs reconciled | Current-state table | Final SHA matches release |
| Capability router | PASS | Connected systems used at their authority boundary | Tool evidence | Limitations recorded |
| Executive strategy | PASS | Consolidation buys learning with lower founder cost than a new platform | Candidate matrix | One next evidence-triggered decision |
| Product management | PASS | 8–10 high-information questions produce a complete brief | Decision tests | Result contains risks, actions, owners, unknowns, sources |
| Healthcare user research | PASS | Urgency, fragmented ownership, and caregiver executability drive sequencing | Discharge logic | Today/status/auth/denial/caregiver branches |
| Information architecture | PASS | Canonical guide becomes the product; long-form content remains acquisition/support | Route diff | No route or redirect change |
| UX and design system | PASS | One decision at a time, unknown states, progress, review, focused result | Component and E2E | Mobile/desktop hosted check |
| Content and evidence integrity | PASS | Fact, CAF interpretation, user fact, and needs-verification remain visible | Typed brief | Current official links and no guarantee language |
| Frontend engineering | PASS | Typed pure logic separated from rendering; old duplicate component removed | Unit/component tests | Full lint/type/build |
| Systems architecture | PASS | No premature case platform; existing Decision Plan reused | Architecture diff | Generic task state only |
| Backend, data, and security | PASS | One allowlisted key/event; no answer fields; service-only RLS unchanged | Migration and API contract | Migration + advisors + production payload inspection |
| Platform and DevOps | PENDING | Release must follow current PR and Vercel conventions | Branch and deployment | Ready preview, merged PR, ready production |
| SEO and discovery | PASS | Canonical, sitemap, metadata, source content, and internal routes remain | 182-route build | Search gates and live route 200 |
| Monetization and conversion | PASS | No premium gate or second price test; free value must prove use first | UI and CAF-D-020 | No `$29`, checkout, or entitlement in route |
| Analytics and experimentation | PASS | Fixed start/result/high-intent and step reach answer the decision | SQL report | Production event storage/cleanup proof |
| Accessibility, performance, and reliability | PENDING | Focus, labels, progress, print isolation, bundle discipline designed | Unit/E2E/build | Hosted axe/mobile/desktop and runtime check |
| Privacy, legal, and user protection | PASS | Fixed choices are transient; generic task state only; explicit prohibited-data copy | Storage/payload tests | No answer or brief content in storage/telemetry |
| Publishing and governance | PENDING | Packet, ledgers, report, release evidence required | This packet | Close ledgers after production |
| Quality and release | PENDING | Focused suite passes; full suite and hosted certification remain | Test outputs | Full validation and exact-head checks |
| Adversarial red team | PASS | Strongest attack is unproven demand plus Medicare rule nuance | Gate findings | Honest uncertainty and stop rule |
| Process improvement | PASS | One SQL query and one durable E2E replace dashboard/manual ambiguity | New artifacts | Operators can reproduce decision metrics |

## 8. Executive accountability matrix

| Executive perspective | Registered role mapping | Status | Finding | Evidence | Consequence | Action/acceptance test |
|---|---|---|---|---|---|---|
| Chief Executive / Strategy | Executive strategy | PASS | Deepen one urgent workflow | Candidate comparison | Avoid breadth churn | No second build |
| Chief Operating Officer | Orchestrator, process | PASS | Browser-local tasks avoid service operations | Architecture | Low operational burden | No concierge promise |
| Chief Financial Officer | Monetization | PASS | No paid infrastructure or commerce | Scope | Capital conserved | $0 incremental paid platform requirement |
| Chief Revenue Officer | Monetization, analytics | WARN | WTP remains wholly unknown | Zero commitments | Product-use proof precedes offer | Do not infer revenue |
| Chief Product Officer | Product, UX | PASS | Personalized action ownership is the core value | Brief logic | Useful free result | Target-path review |
| Chief Technology Officer | Architecture, engineering | PASS | Pure typed logic and existing primitives are sufficient | Diff | Maintainable bounded change | No new framework/table |
| Chief Data and Analytics Officer | Analytics | PASS | Unique consented sessions and explicit denominators | Event contract/SQL | Trustworthy directional learning | Clean release verification rows |
| Chief Marketing and Discovery Officer | IA, SEO | PASS | Existing indexed route remains acquisition surface | Sitemap/build | Preserve search equity | No canonical/indexability change |
| Editorial and Evidence Officer | Evidence integrity | PASS | Sources and evidence labels remain visible | Result/source inventory | Trust preserved | Link and claim review |
| Healthcare User and Clinical Context Officer | Healthcare research | PASS | Product assigns financial-navigation tasks without making medical decisions | Branch logic | RN reasoning appears in sequence | Discharge disclaimer and owner labels |
| Privacy / Legal | Privacy and protection | PASS | No identity, diagnosis, member ID, medication name, document, or free text | UI/storage/API | Low-sensitivity experiment | Negative payload tests |
| Accessibility / Reliability | Accessibility, reliability | PENDING | Focus and print defects were corrected before release | Test additions | Must certify hosted | Axe and responsive checks |
| Quality / Release | Quality, DevOps | PENDING | Release not yet complete | Branch state | No completion claim yet | PR/CI/production evidence |
| Red Team | Adversarial red team | PASS | Checklist competitors and zero current demand weaken certainty, but not the bounded consolidation case | External/current evidence | Experiment, not strategy fait accompli | Stop/iterate thresholds |
| Process Improvement | Process role | PASS | Report turns events into a decision | SQL | Less founder analysis time | Reproducible output |

## 9. Anti-blindness findings

- **What the prompt emphasized:** Hospital-to-Home, persistent cases, free-value-first WTP, RN differentiation, extensive audit.
- **What it omitted:** Current consented product-use evidence is zero, current Search Console was inaccessible, and a direct checklist competitor now exists.
- **Strongest argument against the obvious solution:** CAF may be polishing an urgent but low-acquisition route while already having too much surface area.
- **Weakest assumption:** Enough qualified users will encounter the canonical route to reach a 25-session decision window.
- **Largest unused opportunity:** A document-aware employer-benefits product may have stronger commercial distribution, but it carries higher competition, privacy, document, and maintenance costs.
- **Metric that could improve while the product worsens:** Starts can rise because the tool is prominent; high-intent use and direct usefulness feedback must confirm result value.
- **Evidence that would change the decision:** Weak start/result/action rates at the defined denominators; material safety/compliance confusion; search evidence strongly favoring another existing product; or qualitative evidence that owner-assigned actions are not useful.

## 10. Quantified before-and-after impact

| Measure | Before | After | Absolute change | Percentage change | Consequence |
|---|---:|---:|---:|---:|---|
| Canonical routes | 182 | 182 | 0 | 0% | No surface expansion |
| Routes materially changed | 0/182 | 1/182 | +1 | 0.55% | Bounded blast radius |
| Discharge route guided questions | 4 selects + 8 static checks | 8–10 branched fixed questions | Replaced | n/a | Higher information value with progressive disclosure |
| Generic one-owner task systems on route | 1 | 0 | -1 | -100% | Duplicate shallow architecture retired |
| Owner-assigned brief actions | 0 | Branch-dependent, all actions | +all result actions | n/a | Case-management reasoning becomes visible |
| Indexable routes | 182 | 182 | 0 | 0% | SEO inventory preserved |
| Ad-eligible routes | 39 | 39 | 0 | 0% | Monetization inventory preserved |
| Products under price test | 1 | 1 | 0 | 0% | Benefits-only $29 test preserved |
| New database tables/policies | 0 | 0 | 0 | 0% | No case platform or data expansion |
| First-party journey keys | 11 | 12 | +1 | +9.1% | H2H can be queried safely |
| First-party journey event names | 11 | 12 | +1 | +9.1% | Browser-local save becomes measurable |

- **Monetization impact:** None in this release. Free use must clear a product-value gate before any H2H offer is designed.
- **User-journey impact:** A shallow checklist becomes a sequenced, personalized brief with owners, evidence labels, uncertainty, save/copy/print, and official handoffs.
- **SEO/discovery impact:** One title/description is clarified; URL, canonical, sitemap, source guide, and indexed supporting routes remain.
- **Maintenance impact:** One obsolete generic discharge component is deleted; one pure typed logic module and one focused component replace it.
- **Measurement impact:** CAF can query start, completion, step reach, save/copy/print/handoff, and high-intent/result rates for this route.
- **Second-order effects:** If value is proven, the same task/owner/evidence shape can inform a later case primitive; it is not generalized now.
- **Rollback path:** Revert the product commit and remove `hospital_to_home`/`journey_result_saved` acceptance only if no retained production rows require compatibility. No route/data table/payment rollback.

## 11. Anomaly gate

- [ ] Changes more than 20% of a major site surface.
- [ ] Materially reduces monetizable inventory.
- [ ] Materially reduces indexable inventory.
- [ ] Materially reduces usable functionality.
- [ ] Contradicts a confirmed founder objective.
- [ ] Implies extensive prior work was never completed.
- [ ] Depends on one incomplete registry or source.
- [ ] Produces an economically implausible outcome.
- [x] Creates a mismatch between technical success and business value.
- [ ] Leaves a high-intent journey without a meaningful next action.
- [ ] Cannot be explained clearly from current evidence.

The checked anomaly is intrinsic to an experiment: a perfect release does not establish usefulness or demand. Analytics and revenue reviewers require the no-decision minimum sample, strict language, and one evidence-triggered next decision.

## 12. Candidate work ranking

Scores are directional 1–5 judgments using equal weight; they organize uncertainty rather than manufacture precision. Effort, data, privacy, maintenance, and opportunity-cost scores are higher when the candidate is cheaper/safer.

| Criterion | Hospital-to-Home consolidation | Denial organizer | Employer benefits/document-aware | Bill-resolution case | Acquisition-only wait |
|---|---:|---:|---:|---:|---:|
| Problem severity | 5 | 5 | 4 | 5 | 2 |
| Frequency | 4 | 3 | 4 | 4 | 3 |
| Urgency | 5 | 5 | 3 | 4 | 2 |
| Search/current acquisition evidence | 2 | 3 | 4 | 4 | 4 |
| WTP potential | 3 | 4 | 4 | 4 | 1 |
| Meaningful free value first | 5 | 5 | 5 | 5 | 2 |
| RN/case-management differentiation | 5 | 5 | 3 | 4 | 1 |
| Competitive whitespace | 3 | 3 | 1 | 1 | 3 |
| Defensibility | 4 | 4 | 3 | 3 | 1 |
| Low implementation effort | 5 | 3 | 2 | 2 | 5 |
| Low data requirement | 5 | 4 | 2 | 2 | 5 |
| Low regulatory exposure | 4 | 3 | 3 | 3 | 5 |
| Low privacy risk | 5 | 4 | 2 | 2 | 5 |
| Low maintenance burden | 4 | 3 | 2 | 2 | 5 |
| Fast reliable learning | 4 | 4 | 3 | 3 | 2 |
| Fit with existing products | 5 | 5 | 5 | 5 | 3 |
| Reuse potential | 5 | 4 | 4 | 4 | 2 |
| Founder opportunity cost | 5 | 3 | 2 | 2 | 5 |
| Long-term enterprise value | 5 | 4 | 4 | 4 | 2 |
| **Total / 95** | **83** | **74** | **63** | **65** | **58** |

Hospital-to-Home wins because it concentrates existing CAF assets into one urgent, differentiated task at the lowest incremental architecture/data cost. The next-best denial organizer has high urgency and RN fit, but a safe resolution product needs stronger notice-specific logic, deadline handling, and potentially evidence organization; H2H already includes a bounded denial branch without becoming a generic appeal product.

## 13. Integrated decision

- **Selected outcome:** Replace the shallow canonical discharge checklist/command-center combination with a Hospital-to-Home Coverage & Cost Navigator on `/insurance/hospital-discharge-coverage`.
- **Why it outranks alternatives:** Highest combined urgency, RN differentiation, asset reuse, privacy safety, reversibility, and founder-time efficiency; one route becomes more useful without new acquisition surface or platform work.
- **Complete user journey:** Choose helper → timing → coverage → destination → Medicare status when relevant → service handoffs → authorization when relevant → receiving acceptance → written notice → primary unresolved concern → focused brief → save/copy/print/official handoff.
- **Architecture and source of truth:** Pure typed decision logic; React progressive UI; existing browser-local Decision Plan; existing journey event endpoint/table; one backward-compatible key/event allowlist migration; official Medicare sources; plan/facility/provider remains controlling.
- **Commercial/editorial treatment:** Complete result is free; no email or offer; preserved long-form content below the product; no coverage/eligibility/savings/appeal guarantee.
- **Instrumentation:** `journey_viewed`, `journey_started`, step, back, result, saved, copied, printed, restarted, and handoff using fixed properties only. No answers, result text, URLs, personal data, or service selections.
- **Rollback:** Code revert and, only if safe after checking retained rows, contract rollback. Route remains stable.
- **Evidence that would reverse the decision:** Safety defect, misleading official-source use, <10% start or result/view after 50 consented views, zero high-intent use at that denominator, or clear direct feedback that the brief does not improve action ownership.
- **Reassessment event:** Earliest at 25 consented viewed sessions. Go if start/view ≥35%, result/start ≥40%, and high-intent/result ≥20%. Iterate for concentrated step abandonment or result/view 10–25%. Stop expansion at 50 views with start/view <10%, result/view <10%, or zero high-intent action. These are directional, consented-only thresholds.

## 14. Separate validation dispositions

### Technical validation

- **Status:** WARN pending hosted browser, migration, full suite, PR/CI, and production certification.
- **Implementation correctness:** Focused pure-logic, component, contract, and evidence tests pass (17 tests).
- **Tests and typing:** Focused ESLint and build passed; full repository suite still pending.
- **Security and privacy:** No answer persistence/telemetry; migration only expands allowlists; live RLS/advisors pending.
- **Accessibility and reliability:** Result focus and print isolation corrected; durable Playwright/axe mobile+desktop spec added but local Chromium binary is unavailable.
- **Deployment and route behavior:** Pending preview and production.
- **Observability:** SQL report exists; production event storage/cleanup pending.
- **Rollback:** Reversible one-route code and allowlist change.

### Business validation

- **Status:** WARN. The experiment is strategically justified, but usefulness, acquisition, and willingness to pay are unvalidated.
- **User usefulness:** Strong branch/sequence hypothesis; no production behavior yet.
- **Strategic alignment:** Deepens and consolidates rather than broadens.
- **Revenue and sustainability:** Unknown; no H2H price signal is requested.
- **Opportunity cost:** Low relative to the alternatives because existing content, components, storage, analytics, and sources are reused.
- **Conversion and discovery:** Current search demand is unresolved.
- **Operational burden:** Low; no human service or manual case processing.
- **Economic plausibility:** Long-term case persistence may be valuable only after free task use is observed.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner role |
|---|---|---|---|---|
| Typed decision logic | `src/lib/hospitalToHomeDecision.ts` | Branch risks/tasks/owners/unknowns deterministic | Unit tests | Product + healthcare + engineering |
| Progressive UI | `HospitalToHomeNavigator.tsx` | 8–10 relevant questions; focus; result; task state; copy/print | Component + E2E | UX + frontend + accessibility |
| Canonical consolidation | `HospitalDischargeCoveragePage.tsx`; old command center deletion | Product first; source guide preserved; no duplicate shallow system | Route/build/SEO | IA + editorial |
| Evidence contract | Journey contract, migration, measurement script, docs | Fixed safe key/event; existing RLS unchanged | Unit + DB advisor + payload inspection | Data + security |
| Operator report | SQL + work packet + ledgers | Exact denominators and thresholds | SQL execution | Analytics + operations |
| Release | GitHub/Vercel/Supabase | Reviewable PR, green checks, ready deployments, cleanup | Preview/production certification | Quality + DevOps |

## 16. Release gates

- [x] Intended user can complete the target decision in implementation tests.
- [x] Inherited-decision challenge gate is complete.
- [x] Quantified-impact and anomaly gates are complete.
- [x] Technical validation has an explicit disposition.
- [x] Business validation has an explicit disposition.
- [x] Claims and calculations were reviewed against current official sources.
- [x] Architecture and security boundaries were reviewed.
- [ ] Analytics events validated through the production journey and synthetic rows removed.
- [ ] Hosted accessibility, responsive behavior, print, performance, and degraded states pass.
- [x] Local SEO, canonical, sitemap, and indexability effects pass.
- [x] Publication ownership, freshness, and correction paths remain intact.
- [ ] Full tests, lint, type checks, build, and repository-specific checks pass at final head.
- [ ] Latest PR head, preview, comments, and review threads inspected.
- [x] Red-team blockers resolved or re-scoped.
- [ ] Production smoke validation passes.

## 17. Executive closeout

- **What changed:** Pending final release record.
- **What did not change:** Route inventory, benefits offer, payments, accounts, entitlements, PHI boundary, source guide, provider comparison, and human operations.
- **Before-and-after metrics:** Section 10; real behavior remains unknown.
- **Production and release status:** Pending.
- **Validation performed:** Focused tests/lint/build; current-source review; remaining gates in section 16.
- **Unresolved warnings:** Current search demand, product usefulness, representative behavior, and WTP.
- **Business consequences:** The next investment can be tied to observed free-product use rather than strategic enthusiasm.
- **Owner-only actions:** None before evidence thresholds, absent a safety defect.
- **Rollback path:** Revert release commit; preserve route.
- **Evidence still missing:** Genuine consented sessions, direct feedback, current connected search data.
- **Single highest-value next action:** After the minimum sample, decide whether observed free brief use justifies a bounded persistence/value proposition experiment; do not create a generic backlog.

## 18. Compounding closeout

- **Project context updated:** Pending final release.
- **Decision ledger updated:** Pending CAF-D-021.
- **Evidence ledger updated:** Pending CAF-E-018.
- **Work ledger updated:** Pending CAF-W-018.
- **Route-level governance updated:** Existing canonical preserved; final record pending.
- **Skill or prompt improved:** No skill change required.
- **Reusable component/template/query created:** Typed brief logic, focused progressive component, production SQL report.
- **Automated check or regression test added:** Decision branches, privacy/storage contract, result focus, print isolation, mobile/desktop axe E2E.
- **Duplicate or stale artifact retired:** Generic one-owner `discharge-command-center.tsx`.
- **One remaining process debt:** No connected current Search Console access.
- **Trigger for future reassessment:** Section 13 thresholds or an immediate safety/privacy/runtime defect.
