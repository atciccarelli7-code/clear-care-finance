# Publisher-first repositioning and CAF content engine

## 1. Assignment charter

- **Plain-language request:** Reposition Community Acquired Finance from a tool-led product surface into an RN-led healthcare economics and finance publication, publish the strongest book-derived work, retain useful tools, validate, and release.
- **Actual user outcome:** A credible editorial front door that turns Andrew Ciccarelli's firsthand hospital-system observations into source-backed articles, returning readership, and relevant tool use.
- **Affected audiences:** Patients, caregivers, healthcare workers, health-finance learners, and search visitors trying to understand hospital prices, payment incentives, discharge, and post-acute care.
- **Business outcome:** Build distribution and durable publisher inventory before adding more products; preserve future optionality for restrained advertising, sponsorship, affiliate, or premium experiments.
- **Success metrics:** Four differentiated manuscript-derived articles; publication-led home and navigation; complete authorship, freshness, citations, internal links, canonical/schema/sitemap coverage; no regression to existing tools; production release passes.
- **Constraints:** Preserve the raw Google Doc; use current authoritative sources; do not expose patient or employer-confidential information; no paid infrastructure; no mass AI content; no automatic manuscript publication.
- **Non-goals:** Book rewrite, new account system, new paid product, ad placement expansion, traffic purchase, or bulk keyword pages.
- **Risk class:** High (YMYL editorial claims, global information architecture, and production release).

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Live homepage, article library, About, tools, and trust surfaces inspected at `communityacquiredfinance.com` | 2026-08-29 | Homepage and navigation are tool/workflow-led; production evidence is a point-in-time read. |
| GitHub/main | `atciccarelli7-code/clear-care-finance`, main at `d41065c` after PR #279 | 2026-08-29 | Clean clone before branch creation. |
| Relevant PRs/issues | Recent releases #277-#279 reviewed in repository history | 2026-08-29 | Final PR head and checks must be re-inspected before merge. |
| Vercel/runtime | Git-integrated Vercel release path documented in project and deployment guidance | 2026-08-29 | Deployment state must be verified after PR merge. |
| Supabase/data/auth | No new data, auth, or database behavior required | 2026-08-29 | Existing integrations remain regression scope only. |
| Stripe/payments | No payment change requested or justified | 2026-08-29 | Existing premium boundaries remain unchanged. |
| Search/analytics/AdSense | Aug. 28 GSC export: 20 clicks and 3,449 impressions in chart/device totals; 71 reviewed published articles and 39 ad-eligible | 2026-08-29 | Page/query tables are privacy-filtered and non-additive; no traction claim may use their totals as sitewide totals. |
| Notion/Linear/Drive | Full 406-paragraph Google Doc `Hospitals Are a Business — Rough Draft / Idea Dump` read without editing | 2026-08-29 | The manuscript is an idea source, not a verified factual source. |
| External primary sources | CMS, Medicare.gov, IRS, AHRQ, HHS OIG, MedPAC, and RAND source pages/reports | 2026-08-29 | Article claims must preserve population, payer, and year qualifications. |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| CAF has 20 organic clicks and 3,449 impressions in the export period | Verified fact | GSC Chart/Devices tabs | 2026-08-29 | Last-six-month Web export; query/page totals are not additive. |
| The current homepage presents decisions and workflows before editorial work | Verified fact | Production and `src/pages/Index.tsx` | 2026-08-29 | Global navigation still exposes the article library through Explore/mobile. |
| Founder writing contains differentiated analogies and hospital-flow observations | Verified fact | Read-only manuscript review | 2026-08-29 | Firsthand observations still require de-identification and external verification. |
| Publisher-first is the best near-term growth strategy | Founder decision with supported inference | Assignment plus low current audience and prior outcome ledgers | 2026-08-29 | Must be reassessed with Search Console, return-visitor, newsletter, and article-to-tool evidence. |
| Four articles are the correct bounded first release | Supported inference | Manuscript quality, SERP gaps, source availability, overlap review | 2026-08-29 | More topics remain candidates, not commitments. |

## 4. Context and decision memory

- Relevant project-context sections: business objective, audiences, source hierarchy, architecture, privacy, SEO, monetization, release rules.
- Active decision IDs: D001, D003, D009, D013-D021.
- Decisions potentially in conflict: D013's workflow-first header/default and the earlier flagship-product emphasis are superseded in presentation priority, not deleted from the site.
- Prior work-ledger entries: W009, W014-W018.
- Evidence records needing revalidation: current route/article/ad counts, current GSC baseline, post-release production behavior.
- Founder confirmation required, if any: none; the assignment explicitly authorizes implementation and release.
- Prior completed work reconciled: Benefits Decision System, financial-assistance finder, hospital-to-home navigator, worker tools, and patient guides remain available as supporting utilities.
- Registry or record gaps that must not be mistaken for absent work: lack of clicks is not proof of no user value; privacy-filtered GSC query rows are not zero site clicks.

## 5. Inherited-decision challenge gate

| Inherited item | Established when/why | Original evidence | Current status | Quantified present impact | Conflict or anomaly | Missing evidence | Red-team challenge | Revisit trigger |
|---|---|---|---|---|---|---|---|---|
| Workflow-first homepage | D013-D021, to make product paths legible | Implementation and stated-intent evidence | Merely implemented as default | Occupies the entire pre-newsletter homepage | Conflicts with explicit publisher-first direction | Organic-to-workflow outcome evidence is minimal | A technically polished workflow front door can still hide CAF's scarce editorial advantage | Reassess after 90 days of article acquisition data |
| Five product/audience primary nav links | D013 information-architecture release | Route inventory and UX checks | Confirmed implementation, challenged business priority | 5 of 5 desktop primary links | Articles are not a primary desktop destination | No evidence the current labels earn repeat readership | Put the publication and strongest subject cluster in the primary path without removing utilities | Post-release nav selection evidence |
| 71-article/39-ad-eligible fixed assertions | D009 AdSense audit | Publisher review ledger | Confirmed before this release | 71/71 reviewed; 39/71 eligible | Hard-coded counts block legitimate new editorial inventory | None once generated inventory is rechecked | Update gates and snapshot rather than weakening them | Every new article release |
| Tools as core value | D001/D017 product architecture | Existing working utilities | Confirmed, reprioritized | Multiple high-value utilities retained | New products lack demand evidence | Article-to-tool evidence is extremely early | Tools should follow the explanation and remain ad-free | Tool use from article referrals |
| Search Console as prioritization evidence | D018-D019 | GSC exports | Provisional | 20 clicks / 3,449 impressions | Tiny sample can distort priorities | Return-user and newsletter cohort evidence | Use it to improve near-ranking pages, not to replace founder originality | Next 28/90-day export |

- Did any inherited item predate the current executive operating system? Yes; the broad product-company premise predates this explicit publisher-first founder directive.
- Did a passing test prove only implementation correctness rather than business correctness? Yes; prior workflow gates prove safe completion, not audience demand.
- Was absence from one registry treated as proof that work was absent? No; repository history, runtime data, Drive, and production were reconciled.

## 6. Capability plan

| Need | Authoritative system/tool | Skill or workflow | Fallback | Write or risk level |
|---|---|---|---|---|
| Manuscript and GSC | Google Drive/Docs/Sheets | Connected Drive read workflows | None; do not request manual copies | Read-only, high-sensitivity context |
| Current healthcare claims | Primary government/research sources | Web research with source qualification | Existing verified repo source records | Read-only research, high YMYL |
| Implementation | Git repository | React/TypeScript and repository governance | Re-scope article count, not standards | Production code write, high |
| Release | GitHub + Vercel | Branch, PR, preview, gates, merge, smoke | Leave a validated PR if protected workflow blocks merge | External write, high |
| Visual verification | Local/preview browser | Desktop/mobile route and console checks | Playwright and static prerender inspection | Read-only runtime checks |

## 7. Independent role matrix

| Role | Status | Material finding | Evidence | Action/acceptance test |
|---|---|---|---|---|
| Orchestrator | PASS | A four-article plus IA release is the highest-value bounded slice | Evidence reconciliation | Release only after all gates |
| Context steward | PASS | Raw manuscript must remain untouched | Drive read-only workflow | No Drive write |
| Capability router | PASS | Existing repo, Drive, web, GitHub, and Vercel cover the work | Tool inventory | No paid service activation |
| Executive strategy | PASS | Distribution precedes additional product building | Founder directive + tiny audience | Home leads with publication |
| Product management | PASS | Existing tools become contextual next steps | Route inventory | No tool removal/regression |
| Healthcare user research | PASS | Readers need the patient/hospital/payer/worker collision explained | Manuscript and existing journeys | Each article states practical implications |
| Information architecture | WARN | All five primary labels change priority | Global header | Keep legacy destinations in Explore/mobile/footer |
| UX and design system | PASS | Existing components support the shift | Component audit | Reuse styles; mobile/browser pass |
| Content and evidence integrity | PASS | Raw dramatic claims require correction and qualification | Primary-source review | Claim/source matrix complete |
| Frontend engineering | PASS | Backward-compatible article fields can support editorial narrative | Article model audit | Existing articles render unchanged |
| Systems architecture | PASS | Static content/data modules are the lowest-maintenance architecture | Current Vite design | No new backend |
| Backend, data, and security | PASS | No server/data changes are justified | Scope review | No new secrets or PHI |
| Platform and DevOps | PASS | Git preview-to-production remains the safe path | Existing integration | Build, preview, merge, production smoke |
| SEO and discovery | PASS | New intent ownership is distinct from allowed-amount and rehab coverage pages | GSC + SERP review | Canonical, schema, sitemap, internal links pass |
| Monetization and conversion | PASS | Do not add ads; review two general explainers as future-eligible and keep two discharge pieces ad-free | D003 + sensitivity | Conservative route-level classification |
| Analytics and experimentation | WARN | No new event taxonomy is needed, but publisher outcomes lack cohort data | Existing analytics | Reuse navigation/article events; document baseline |
| Accessibility, performance, and reliability | PASS | Semantic editorial sections and responsive flows are feasible | Component review | Automated and browser checks |
| Privacy, legal, and user protection | PASS | No clinical anecdote may be identifiable | Manuscript privacy rule | Composite/generalized examples only |
| Publishing and governance | PASS | Every article needs owner, dates, sources, review disposition | Existing gates | 75/75 articles reviewed after release |
| Quality and release | WARN | Global surface and YMYL content require full gate suite | AGENTS.md | No merge on blocker |
| Adversarial red team | PASS | Biggest risk is laundering oversimplified founder notes into authoritative-sounding prose | Manuscript comparison | Explicit corrections and limitations included |
| Process improvement | PASS | A repeatable source map and editorial operating document will compound | Assignment | Add durable CAF Content Engine document |

## 8. Executive accountability matrix

| Executive perspective | Registered role mapping | Status | Finding | Evidence | Consequence | Action/acceptance test |
|---|---|---|---|---|---|---|
| Chief Executive / Strategy | Executive strategy | PASS | Publisher-first directly reflects founder direction | Assignment | Reorder company presentation | Editorial hero and nav ship |
| Chief Operating Officer | Orchestrator + process | PASS | Small static release has modest ongoing burden | Architecture | Sustainable updates | Content engine documented |
| Chief Financial Officer | Monetization | PASS | No new spend or infrastructure | Scope | Protect runway | Zero paid activation |
| Chief Revenue Officer | Monetization + analytics | WARN | Revenue is not the current success test | 20-click baseline | Avoid premature conversion optimization | Track audience first |
| Chief Product Officer | Product | PASS | Utilities remain valuable after articles | Route inventory | Preserve compounding work | Contextual article-to-tool links |
| Chief Technology Officer | Systems + frontend | PASS | Extend, do not rewrite | Code audit | Low regression risk | Type/build/browser gates |
| Chief Data and Analytics Officer | Analytics | WARN | Baseline tables are privacy-filtered/non-additive | GSC export | Prevent inflated reporting | Use 20/3,449 only as total |
| Chief Marketing and Discovery Officer | SEO | PASS | Founder-led hospital economics is the defensible topical wedge | SERPs/manuscript | Clear query ownership | Four distinct canonical pages |
| Editorial and Evidence Officer | Content/evidence | PASS | Original voice plus primary sourcing differentiates CAF | Manuscript/source set | High trust | Sources and corrections visible |
| Healthcare User and Clinical Context Officer | User research | PASS | Multi-party incentive lens is uniquely helpful | Manuscript | Repeatable editorial device | System-lens blocks render |
| Privacy, Legal, and User Protection Officer | Privacy/legal | PASS | Generalized operational examples carry less disclosure risk | Scope | No PHI/employer disclosure | Final privacy review |
| Accessibility and Reliability Officer | A11y/reliability | PASS | Semantic content can remain mobile-usable | Component plan | No accessibility regression | Browser/mobile/tests |
| Quality and Release Officer | Quality/release | WARN | Release is conditional on complete gates | Repo rules | No unsafe ship | Explicit final disposition |
| Adversarial Red Team | Red team | PASS | Avoid false universal claims about DRGs, profit, authorization, and beds | Primary sources | Nuanced copy | Claim-by-claim review |
| Process Improvement Officer | Process | PASS | Source-to-asset mapping avoids future SEO busywork for founder | Assignment | Compounding system | Repository operating document |

## 9. Anti-blindness findings

- What the prompt emphasized: Editorial identity, founder voice, research rigor, publication, and release.
- What it omitted: Exact article count required now, newsletter infrastructure changes, and a traffic threshold for monetization.
- Strongest argument against the obvious solution: A large homepage/content rewrite could erase working decision paths and create four unproven search pages.
- Weakest assumption: That hospital-economics explainers will earn more attention than the existing 403(b) and hospital-assistance pages.
- Largest unused opportunity: Use book additions as a recurring source of distinctive updates rather than new products or generic keyword pages.
- Metric that could improve while the product worsens: Indexable page count or impressions could rise while trust, CTR, and reader usefulness fall.
- Evidence that would change the decision: Sustained evidence that readers overwhelmingly enter and complete a specific workflow while ignoring editorial content, or that articles fail to index/earn relevant impressions after sufficient time.

## 10. Quantified before-and-after impact

| Measure | Before | Proposed/after | Absolute change | Percentage change | Consequence |
|---|---:|---:|---:|---:|---|
| Affected routes | 182 / 182 global chrome | 186 / 186 global chrome | +4 canonical; all chrome reprioritized | +2.2% inventory | Global presentation changes; route availability does not shrink |
| Relevant site inventory | 71 articles | 75 articles | +4 | +5.6% | Four substantial publisher assets |
| Indexable routes | 182 | 186 | +4 | +2.2% | Sitemap/schema/canonical expansion |
| Ad-eligible routes | 39 | 41 | +2 | +5.1% | Eligibility only; no new placements or approval claim |
| Commercially eligible journeys | 39 article routes | 41 article routes | +2 | +5.1% | Sensitive discharge content remains ad-free |
| User-completable journeys | Existing utilities retained | Existing utilities retained | 0 removed | 0% reduction | Articles add explanation before action |
| Instrumented journeys | Existing site events | Existing events retained | 0 new taxonomies | 0% | Avoid duplicate analytics systems |

- **Monetization impact:** Improves future legitimate publisher inventory without turning on new ads or changing paid products.
- **User-journey impact:** Publication discovery becomes primary; tools remain available in context and directories.
- **SEO/discovery impact:** Four distinct hospital-economics/discharge intents plus stronger hub/internal links.
- **Maintenance impact:** Four review schedules and one documented manuscript intake loop; no backend burden.
- **Measurement impact:** Baseline and future Search Console review rules documented.
- **Second-order effects:** CAF can earn direct readership while preserving high-intent tool paths; older product-first language becomes less prominent.
- **Rollback path:** Revert the release commit/PR; no schema, data, billing, or destructive content migration is involved.

## 11. Anomaly gate

- [x] Changes more than 20% of a major site surface.
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

For the global navigation anomaly, the change is justified by the explicit founder strategy and mitigated by preserving every legacy path in Explore, mobile, contextual links, and footer. Executive strategy and IA independently require a production browser check. For the technical/business mismatch, gates must report technical and business validation separately; passing build tests alone cannot establish audience demand.

## 12. Candidate work ranking

| Candidate | User value | Business value | Strategic fit | Confidence | Effort | Reversibility | Maintenance | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Four source-backed founder articles + editorial IA | 5 | 5 | 5 | 4 | 4 | 5 | 4 | 3 | Select |
| Publish 10+ articles immediately | 3 | 3 | 3 | 2 | 1 | 4 | 2 | 5 | Reject |
| Improve only near-ranking legacy pages | 4 | 3 | 3 | 4 | 4 | 5 | 5 | 2 | Defer as next measurement-led slice |
| Build another software workflow | 3 | 2 | 1 | 2 | 2 | 3 | 1 | 4 | Reject |
| Strategy/documentation only | 1 | 1 | 2 | 5 | 5 | 5 | 5 | 1 | Reject |

## 13. Integrated decision

- **Selected outcome:** Ship a publisher-led home/navigation/library/hub, an editorial article format, four manuscript-derived articles, conservative publisher classifications, and a reusable content-engine document.
- **Why it outranks alternatives:** It uses the founder's scarce insight, creates indexable distribution assets, reuses current tools, and avoids new operations or mass content.
- **Complete user journey:** Search/direct/newsletter visitor → featured or topic article → source-backed multi-party explanation → related CAF article/tool/official source → optional monthly email.
- **Architecture and source-of-truth decisions:** TypeScript article data remains canonical for published content; the raw Google Doc remains read-only; the repository operating document owns the intake method.
- **Commercial and editorial treatment:** Two general hospital-finance explainers may be route-reviewed as ad-eligible; hospital-flow and rehab articles stay ad-free; no new ads are served by this work.
- **Instrumentation:** Reuse homepage navigation, article page, newsletter, and tool analytics.
- **Rollback:** Revert one release PR.
- **Evidence that would reverse the decision:** Poor relevant indexing/CTR/engagement after a reasonable observation window combined with stronger evidence for a different topic wedge.
- **Reassessment event or date:** Next 28- and 90-day Search Console exports, plus article-to-tool and newsletter events.

## 14. Separate validation dispositions

### Technical validation

- **Status:** WARN pending exact-head hosted browser and release gates; all executable local gates pass.
- **Implementation correctness:** The article model is backward compatible, the four new routes use the existing canonical article renderer, and the first complete build caught and corrected one invalid Hospital-to-Home link before release.
- **Tests and typing:** 135 Vitest files / 754 tests pass; API TypeScript, repository governance, publication, freshness, premium, institutional, patient-education, AdSense, bundle, prerender, sitemap, redirect, and search-readiness gates pass. Lint has zero errors and 15 unchanged Fast Refresh warnings.
- **Security and privacy:** No backend, secrets, uploads, or manuscript writes.
- **Accessibility and reliability:** A 14-case mobile/desktop Playwright contract now covers the publication front door, library search, four articles, a legacy calculator, the Hospital-to-Home utility, axe, overflow, metadata, schema, and runtime errors. The local Chromium archive could not be downloaded because the browser CDN timed out, so exact-head hosted execution remains required.
- **Deployment and route behavior:** Preview and production smoke remain required.
- **Observability:** Existing analytics are retained; the static internal-link crawl passes across all 186 canonical routes with zero warnings. Deployed console/runtime inspection remains required.
- **Rollback:** Single PR revert.

### Business validation

- **Status:** PASS for release, WARN for demand outcome.
- **User usefulness:** Four high-intent questions get direct, nuanced explanations.
- **Strategic alignment:** Direct match to founder direction.
- **Revenue and sustainability:** No immediate revenue claim; low-maintenance inventory improves future readiness.
- **Opportunity cost:** Four articles chosen over ten to protect quality.
- **Conversion and discovery:** Editorial discovery comes first; contextual tools and newsletter follow.
- **Operational burden:** Static content and scheduled review only.
- **Economic plausibility:** Audience-building is an experiment; success cannot be inferred from deployment.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner role |
|---|---|---|---|---|
| Editorial data and format | Article types, article page, new data/source maps | Four complete, differentiated articles render with citations and system lens | Content, TS, browser | Content + frontend |
| Publication identity | Home, header/nav, footer, articles page | Editorial question and featured work precede tools | Responsive browser | IA + UX |
| Topic authority | Hospital economics topic and internal links | New cluster is discoverable without duplicate intent | SEO/link checks | SEO |
| Governance | Publisher reviews, SEO manifests, audit, ledgers, content engine | Counts, schema, sitemap, review ownership all reconcile | Repo gates | Publishing |
| Release | Branch, PR, preview, production | Checks pass; live routes and legacy tools smoke | GitHub/Vercel/browser | Quality/release |

## 16. Release gates

- [ ] Intended user completes the target task or decision.
- [x] Inherited-decision challenge gate is complete.
- [x] Quantified-impact and anomaly gates are complete.
- [ ] Technical validation has an explicit disposition.
- [x] Business validation has an explicit disposition.
- [x] Claims and calculations are verified.
- [x] Architecture and security boundaries are reviewed.
- [ ] Analytics events are validated through the actual journey.
- [ ] Accessibility, responsive behavior, performance, and degraded states pass.
- [x] SEO, canonical, redirect, sitemap, and indexability effects pass.
- [x] Publication ownership, freshness, and correction paths are correct.
- [x] Tests, lint, type checks, build, and repository-specific checks pass.
- [ ] Latest PR head, preview, comments, and review threads are inspected.
- [ ] Red-team blockers are resolved or explicitly re-scoped.
- [ ] Production smoke validation passes where applicable.

## 17. Executive closeout

To be completed after release with exact commit, PR, deployment, route counts, checks, warnings, rollback, and highest-value next action.

## 18. Compounding closeout

- Project context updated: complete
- Decision ledger updated: complete
- Evidence ledger updated: complete
- Work ledger updated: complete
- Route-level governance updated: complete
- Skill or prompt improved: not required
- Reusable component/template/query created: editorial narrative, process-map, and multi-party system-lens article format
- Automated check or regression test added: founder-article quality contract plus 14-case desktop/mobile publisher browser certification
- Duplicate or stale artifact retired: product-first homepage, navigation, footer, and trust copy replaced; no useful route or tool retired
- One remaining process debt: article outcome dashboard has not yet accumulated sufficient traffic
- Trigger for future reassessment: next 28/90-day GSC and first-party article-to-tool evidence
