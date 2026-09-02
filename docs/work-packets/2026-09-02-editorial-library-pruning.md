# Editorial library pruning and positioning cleanup — work packet

## 1. Assignment charter

- **Plain-language request:** Audit every public CAF article, implement justified pruning and hierarchy changes, protect search equity, strengthen internal reading paths, validate, and release.
- **Actual user outcome:** A focused RN-led healthcare-systems archive whose strongest work dominates without reckless URL destruction.
- **Affected audiences:** First-time readers, returning readers, healthcare workers, patients, caregivers, search visitors, and the publisher.
- **Business outcome:** Make CAF's differentiated editorial identity legible while retaining the option value of existing search assets.
- **Success metrics:** 77/77 articles classified once; five durable editorial desks; six flagships first; generic material separated from the default experience; all canonical, redirect, sitemap, structured-data, mobile, and release gates pass.
- **Constraints:** No new articles, tools, broad redesign, monetization work, fabricated founder experience, unrelated cleanup, or evidence-light URL retirement.
- **Non-goals:** Content expansion, article rewrites, new keyword clusters, product work, or AdSense optimization.
- **Risk class:** Moderate: archive discoverability changes are broad, but URL/indexing behavior is preserved.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Homepage, `/articles`, flagship articles, robots, sitemap, canonicals, and navigation inspected at `communityacquiredfinance.com` | 2026-09-02 | Production was exact main `734e7b8e`; post-release check required. |
| GitHub/main | Public repository `atciccarelli7-code/clear-care-finance`, main `734e7b8e` | 2026-09-02 | Branch started from exact main. |
| Relevant PRs/issues | PR #281 supplied the current founder-led portfolio | 2026-09-02 | This assignment continues rather than redoes it. |
| Vercel/runtime | Production deployment `dpl_JAfKkmRFiwhgb4BoMEQx73sAsnRT` READY | 2026-09-02 | Preview and new production deployment pending until release. |
| Supabase/data/auth | No backend, data, identity, or auth change | 2026-09-02 | Not implicated. |
| Stripe/payments | No payment, offer, price, or entitlement change | 2026-09-02 | Not implicated. |
| Search/analytics/AdSense | August 28 GSC: 20 clicks / 3,449 impressions; page rows and filters read directly | 2026-09-02 | Tiny, lagged, privacy-filtered, non-additive; backlinks unavailable. |
| Drive | Connected Search Console export read directly | 2026-09-02 | Read-only. |
| External primary sources | No article factual claims changed | 2026-09-02 | Current article sources were not re-litigated because this is hierarchy work. |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| 77 articles are public and sitemap-eligible | Verified fact | Article registry/build | 2026-09-02 | Current release only. |
| Equal-weight legacy content weakens first impression | Supported inference | Production archive and confirmed strategy | 2026-09-02 | Perception is not yet measured with users. |
| Retirement would risk unknown equity | Conservative precaution | GSC + missing backlinks | 2026-09-02 | Does not prove every URL has equity. |
| Five desks are the smallest useful architecture | Supported inference | Complete inventory | 2026-09-02 | Revisit with reader behavior. |

## 4. Context and decision memory

- Relevant context: publication-first identity; founder voice; tools as supporting utilities; conservative URL policy.
- Active decisions: CAF-D-022, CAF-D-023, and new CAF-D-024.
- Potential conflict: a literal “prune” interpretation versus the requirement to preserve equity; resolved with presentation pruning and explicit future gates.
- Prior work: CAF-W-019 and CAF-W-020.
- Evidence revalidated: CAF-E-019 search baseline, current main/production, current generated inventory.
- Founder confirmation required: none for reversible hierarchy changes; destructive dispositions remain unmade.
- Completed work reconciled: all six founder articles and their pathway overrides remain intact.
- Registry gap: backlink data are absent and must not be interpreted as zero backlinks.

## 5. Inherited-decision challenge gate

| Inherited item | Established when/why | Current status | Present impact | Challenge | Revisit trigger |
|---|---|---|---|---|---|
| Publication-first identity | D022 | Confirmed | Sitewide | Archive hierarchy still exposed generic equality | Reader/Search evidence |
| Preserve URLs on 20-click baseline | 2026-08-29 triage | Confirmed precaution | 77 articles | No backlink data supports destructive change | Joined query/backlink data |
| Six founder features | D023 | Confirmed | 6/77 articles | Keep voice intact; do not genericize | Editorial defect/new founder work |
| Raw article categories | Earlier implementation | Merely implemented | Archive filter | Too granular and not reader-legible | Replaced by five desks |
| 500 KiB entry budget | Release governance | Confirmed guardrail | Sitewide | Only 0.19 KiB headroom at start | Build regression/framework change |

A passing route test proves implementation, not reader value. Absence from the available backlink systems was not treated as proof that links do not exist.

## 6. Capability plan

| Need | Authoritative system/tool | Workflow | Fallback | Risk |
|---|---|---|---|---|
| Search evidence | Connected Search Console Sheet | Read-only page/query/filter audit | Repository export | Read-only |
| Repository/release | GitHub + git | Exact-head PR workflow | Local evidence | High write |
| Runtime | Vercel | Preview/production reconciliation | Public HTTP checks | High write |
| Responsive behavior | Browser certification | Desktop/mobile archive journey | Hosted CI | Read-only |
| Governance | Git-backed docs/tests | Ledgers + complete registry | None | Moderate write |

## 7. Independent role matrix

| Role | Status | Material finding | Evidence | Action/acceptance test |
|---|---|---|---|---|
| Orchestrator | PASS | Bounded archive change solves the immediate identity problem | Scope/diff | Close every release gate. |
| Context steward | PASS | Extend D022/D023 | Ledgers | Preserve prior work. |
| Capability router | PASS | Repository, Drive, Vercel, and browser/CI cover the task | Access checks | Record backlink gap. |
| Executive strategy | PASS | Differentiation, not volume, is the objective | Founder strategy | Flagships and desks lead. |
| Product management | PASS | Archive helps readers choose a question | Five desks | No dead-end subject card. |
| Healthcare user research | PASS | Reader language is clearer than internal categories | Inventory | Question-led labels. |
| Information architecture | PASS | Five desks cover all 77 articles | Registry test | Every article maps once. |
| UX and design system | PASS | Existing cards/details/filter patterns suffice | Current components | No redesign. |
| Content and evidence integrity | PASS | No factual or founder-voice rewrite is needed | Diff | Preserve article bodies. |
| Frontend engineering | PASS | Small typed registries support deterministic rendering | TypeScript/tests | Build and interaction pass. |
| Systems architecture | PASS | Article catalog remains the source of truth | `ALL_ARTICLES` | No route fork. |
| Backend, data, and security | NOT IMPLICATED | No data surface changes | Diff | No schema/API change. |
| Platform and DevOps | PASS | Existing exact-head pipeline is sufficient | Vercel/GitHub | READY preview and production. |
| SEO and discovery | PASS | Preserve all URLs; remove public SEO-operations copy | GSC + archive | Canonical/sitemap/redirect checks. |
| Monetization and conversion | NOT IMPLICATED | No ad/offer change | Route governance | Counts unchanged. |
| Analytics and experimentation | WARN | No article-level satisfaction data | Available exports | Do not claim outcome. |
| Accessibility, performance, and reliability | PASS | Native controls and existing cards are suitable | Lint/build/browser gates | Axe/overflow/build pass. |
| Privacy, legal, and user protection | PASS | No new collection or consequential claim | Diff | Preserve boundaries. |
| Publishing and governance | PASS | Every article now has one durable disposition | Audit/test | 77 unique classifications. |
| Quality and release | PASS | Local gates pass; hosted exact-head remains the release gate | Test/build results | Green CI + prod smoke. |
| Adversarial red team | PASS | Deleting generic pages would outrun evidence | GSC/backlink gap | Zero new retirements. |
| Process improvement | PASS | Registry prevents future unclassified URLs | Unit test | Fails on missing/duplicate article. |

## 8. Executive accountability matrix

| Perspective | Role mapping | Status | Finding | Consequence | Acceptance test |
|---|---|---|---|---|---|
| CEO / Strategy | Executive strategy | PASS | Focus beats inventory volume | Lead with distinct work | First viewport is publication-led. |
| COO | Orchestrator/publishing | PASS | Reversible hierarchy is maintainable | Low operating burden | One registry. |
| CFO | Monetization | PASS | No current revenue case for URL loss | Preserve optionality | Ad inventory unchanged. |
| CRO | SEO/product | WARN | Traffic outcome unknown | No uplift claim | Revisit settled data. |
| CPO | Product/IA | PASS | Questions provide a clearer entry | Five desks | All have destinations. |
| CTO | Systems/frontend | PASS | Existing architecture is sufficient | No new service | Build passes. |
| Data officer | Analytics | WARN | Sample is too small for deletion | Conservative action | Baseline recorded. |
| Marketing/discovery | SEO | PASS | Current canonicals retain equity | Zero churn | Search gates pass. |
| Editorial officer | Content integrity | PASS | Six flagships best express CAF | Archive priority | Founder copy intact. |
| Clinical context | User research | PASS | Discharge pathways deserve explicit support | Two overrides | Routes resolve. |
| Privacy/legal | Protection | PASS | No new risk surface | Boundaries unchanged | Diff review. |
| Accessibility/reliability | Accessibility | PASS | Native filter/details controls | Usable mobile archive | Browser certification. |
| Quality/release | Release | PASS | Exact-head deployment required | Merge only when green | CI/preview/prod. |
| Red team | Red team | PASS | Backlink blindness blocks retirement | Keep URLs | No soft 404s. |
| Process improvement | Process | PASS | Automated completeness compounds | Prevent drift | Test fails on mismatch. |

## 9. Anti-blindness findings

- Prompt emphasis: prune generic finance and implement, not merely advise.
- Prompt omission: no dependable backlink or article-engagement dataset was available.
- Strongest counterargument: moving eleven pages may reduce archive discovery for users who value basic finance education.
- Weakest assumption: first-time visitor perception is inferred from hierarchy, not tested in interviews.
- Largest opportunity: improve focus without surrendering URL equity.
- Misleading metric: fewer visible default cards could improve perceived focus while hiding a genuinely valuable page.
- Reversal evidence: strong clicks, backlinks, engagement, or reader feedback for a de-emphasized page.

## 10. Quantified before-and-after impact

| Measure | Before | After | Change | Consequence |
|---|---:|---:|---:|---|
| Articles classified once | 0/77 | 77/77 | +77 | Complete governance. |
| Default archive subject filters | 18 implementation categories | 5 editorial desks | -13 | Clearer architecture. |
| De-emphasized default cards | 0/77 | 11/77 | +11 | Generic/reference work no longer dominates. |
| Indexable routes | 188/188 | 188/188 | 0 | Equity preserved. |
| Article canonicals | 77/77 | 77/77 | 0 | No churn. |
| Permanent redirects | 39 | 39 | 0 | No chain risk introduced. |
| Ad-eligible routes | 42/188 | 42/188 | 0 | No monetization change. |
| Explicit legacy-to-flagship paths | baseline | +4 links across 2 articles | +4 | Better transition reading. |

- **Monetization:** unchanged.
- **User journey:** flagship → desk → focused core library; search still covers all 77; secondary guides remain available.
- **SEO:** no route/index/canonical change; internal hierarchy improves.
- **Maintenance:** one typed map, one disposition registry, one regression test.
- **Measurement:** baseline preserved; no new events.
- **Rollback:** revert the archive/registry/override commit; no migration or redirect dependency.

## 11. Anomaly gate

- [x] Changes more than 20% of a major site surface: default archive treatment changes for all 77 cards.
- [ ] Reduces monetizable inventory, indexable inventory, functionality, or a confirmed objective.
- [ ] Depends on one incomplete registry or produces an economically implausible outcome.
- [ ] Leaves a high-intent path without a next action or cannot be explained from evidence.

The archive-wide change is justified because it is presentation-only, reversible, tested, and preserves every URL. Editorial, IA, SEO, accessibility, and release roles independently require the five-desk/secondary-library acceptance tests.

## 12. Candidate work ranking

| Candidate | User value | Strategic fit | Confidence | Effort | Reversibility | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---|
| Five desks + secondary library | 5 | 5 | 5 | 2 | 5 | 2 | Implement |
| Rewrite eight articles now | 3 | 4 | 2 | 5 | 4 | 4 | Defer; separate assignment |
| Consolidate rehab/glossary pairs | 2 | 3 | 1 | 3 | 2 | 4 | Do not implement |
| Retire all generic finance | 2 | 4 | 1 | 2 | 1 | 5 | Reject |
| Leave archive unchanged | 1 | 1 | 5 | 1 | 5 | 3 | Reject |

## 13. Integrated decision

- **Selected outcome:** Five editorial desks, six flagships, focused default library, eleven-page secondary library, full search, and zero URL churn.
- **Why:** Highest identity benefit at the lowest search-equity risk.
- **Journey:** See CAF thesis → choose system question → read core article → follow contextual next steps.
- **Source of truth:** `ALL_ARTICLES`, `editorialLibrary.ts`, and `editorialLibraryAudit.ts`.
- **Commercial/editorial treatment:** unchanged; classifications are hierarchy decisions, not ad decisions.
- **Instrumentation:** unchanged.
- **Rollback:** single revert.
- **Reassessment:** 28/90 settled days or new search/backlink/safety evidence.

## 14. Separate validation dispositions

### Technical validation

- **Status:** PASS locally; hosted exact-head and production certification required before closeout.
- **Implementation:** Typed registry, deterministic filtering, and native details/filter controls.
- **Tests/typing:** 137 files / 763 tests, TypeScript, lint (0 errors / 15 existing warnings), full build pass.
- **Security/privacy:** no API, storage, auth, payment, or intake change.
- **Accessibility/reliability:** static gates pass; hosted desktop/mobile axe and overflow remain.
- **Deployment/routes:** local 188-route prerender, 39 redirects, sitemap/canonical/search checks pass.
- **Observability:** unchanged.
- **Rollback:** revert commit.

### Business validation

- **Status:** PASS with outcome-measurement warning.
- **User usefulness:** clearer questions and less generic default inventory.
- **Strategic alignment:** directly advances D022.
- **Revenue:** neutral and intentionally not optimized.
- **Opportunity cost:** eight reworks deferred; no replacement content created.
- **Discovery:** URL equity preserved; presentation relevance improved.
- **Operational burden:** low.
- **Economic plausibility:** no traffic or revenue claim.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner |
|---|---|---|---|---|
| Audit | registry + audit doc | 77 unique dispositions | Unit test | Publishing/SEO |
| Archive | `Articles.tsx` | six flagships, five desks, focused core, secondary guides | Browser + E2E | IA/frontend |
| Pathways | `ArticlePage.tsx` | legacy discharge pages link to flagship explanations | Link/route checks | Editorial/product |
| Governance | context/ledgers/packet | durable decision/evidence | AI governance check | Context steward |
| Release | GitHub/Vercel | green exact-head, READY prod, smoke | Hosted checks | Release |

## 16. Release gates

- [x] Complete article inventory and classification.
- [x] Inherited-decision, impact, anomaly, business, and technical-local dispositions.
- [x] Claims/calculations/security/privacy boundaries unchanged.
- [x] SEO, canonical, redirect, sitemap, indexability, publication, and local build gates.
- [x] Unit tests, TypeScript, lint, and repository governance checks.
- [ ] Hosted accessibility/responsive behavior.
- [ ] Latest PR head, preview, comments, and review threads.
- [ ] Production smoke validation.

## 17. Executive closeout

- **Changed:** archive hierarchy, classification governance, and two legacy-to-flagship paths.
- **Unchanged:** all articles, bodies, URLs, canonicals, indexability, redirects, sitemap count, ads, products, data, and founder-authored content.
- **Metrics:** 77/77 classified; 18 filters to 5 desks; 11/77 de-emphasized; 188 routes and 39 redirects preserved.
- **Release status:** Pending hosted exact-head release at packet creation.
- **Validation:** Local 763-test, lint, TypeScript, build, prerender, SEO, sitemap, canonical, and governance gates pass.
- **Warnings:** backlinks and reliable engagement unavailable; outcome unproven.
- **Owner actions:** none unless hosted release reveals a blocker.
- **Rollback:** revert the release commit.
- **Remaining evidence:** hosted browser/preview/production state and settled post-release data.
- **Highest-value next action:** Complete exact-head release and production certification, then stop.

## 18. Compounding closeout

- Project context: updated.
- Decision/evidence/work ledgers: D024/E021/W021 added.
- Route governance: unchanged and verified.
- Reusable asset: five-desk registry and complete disposition registry.
- Automated regression: exact coverage/uniqueness/area test plus archive E2E.
- Stale artifact: earlier triage updated to point to the complete audit.
- Process debt: backlink and article-level engagement coverage.
- Reassessment: 28/90 days or new evidence/defect.
