# Community Acquired Finance — Structured Service Navigation Work Packet

## 1. Assignment charter

- **Plain-language request:** Make high-value CAF services easier to discover by replacing the generic `More` overflow and flat mobile menu with a structured service-navigation system.
- **Actual user outcome:** A healthcare worker, patient, caregiver, or general visitor can identify and open the relevant decision experience without first understanding CAF's internal content taxonomy.
- **Affected audiences:** Healthcare workers, patients, caregivers, first-time visitors, returning visitors, keyboard-only visitors, and mobile visitors.
- **Business outcome:** Expose completed utility, reduce navigation choice overload, and produce privacy-preserving evidence about service discovery without activating commerce.
- **Success metrics:** Six primary routes preserved; zero generic overflow destinations; four structured service groups; at least eight high-value services named globally; no route/indexability loss; accessibility, privacy, performance, and production gates pass.
- **Constraints:** Preserve routes, homepage, semantic design system, footer trust/legal links, AdSense governance, and fail-closed commercial posture.
- **Non-goals:** Full visual rebrand, homepage rewrite, route removal, affiliate activation, Stripe activation, AdSense resubmission, or marketing email.
- **Risk class:** Moderate.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | `communityacquiredfinance.com`; deployment `dpl_C3BUwVV6RBC53fp5p5sjCezuCsf5` READY | 2026-07-31 | Production before this release; must be reverified after merge. |
| GitHub/main | `418d868d23c6c639be84ecb2acbb614f31164ce4` | 2026-07-31 | Latest `main` at branch creation. |
| Relevant PRs/issues | PR #237; Linear AND-99; unrelated draft PR #224 | 2026-08-01 | PR #237 remains draft until all gates pass. |
| Vercel/runtime | Current production READY; exact-head previews created automatically | 2026-08-01 | Final preview and runtime evidence pending. |
| Supabase/data/auth | Active project `uzfcvtgnpkvuapgrkfcb`; `growth_events` has 0 rows and only insurance-event constraints before migration | 2026-07-31 | Navigation events unavailable until reviewed migration is applied. |
| Stripe/payments | No payment or entitlement change in scope | 2026-08-01 | Stripe not modified. |
| Search/analytics/AdSense | Existing consent-aware analytics and first-party insurance evidence contract; 39 of 71 articles eligible under CAF-D-009 | 2026-08-01 | No direct navigation-behavior baseline exists. |
| Notion/Linear/Drive | Design benchmark record, AND-99, CAF design and brand rules | 2026-08-01 | Research supports direction, not causal user-behavior claims. |
| External primary sources | Current benchmark sites and official Supabase security guidance reviewed in prior research/release | 2026-07-31 | Benchmark review is expert heuristic, not published usability testing. |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| Six primary desktop links, eight `More` links, fourteen flat mobile links | Verified fact | `src/components/layout/Header.tsx` on starting `main` | 2026-07-31 | Code inventory does not establish actual visitor confusion. |
| Footer contains twenty-one links | Verified fact | `src/components/layout/Footer.tsx` | 2026-07-31 | Link count alone does not establish poor UX. |
| Tools directory contains thirty-four tools | Verified fact | Current production Tools route and repository inventory | 2026-07-31 | Equal tool count does not imply equal value or readiness. |
| Generic overflow has become inadequate | Supported inference | Inventory growth, benchmark comparison, founder observation | 2026-08-01 | Must be tested through navigation behavior after release. |
| Four grouped service areas are preferable | Experiment | Typed registry and benchmark synthesis | 2026-08-01 | Group labels may require revision after evidence. |
| No sensitive data are needed for measurement | Conservative precaution | Existing consent/evidence architecture and privacy rules | 2026-08-01 | Does not establish representativeness of consented sessions. |

## 4. Context and decision memory

- **Relevant project-context sections:** Platform identity, equal audience importance, phased execution, Robinhood-level simplicity with greater educational depth.
- **Active decision IDs:** CAF-D-001, CAF-D-002, CAF-D-003, CAF-D-006, CAF-D-008, CAF-D-009, CAF-D-010.
- **Decisions potentially in conflict:** The July broad-audience six-item primary navigation intentionally moved audience and specialist routes into secondary navigation.
- **Prior work-ledger entries:** CAF-W-002, CAF-W-005, CAF-W-006, CAF-W-007.
- **Evidence records needing revalidation:** Final route count, tool count, AdSense disposition, production deployment, and Supabase grants.
- **Founder confirmation required:** None for this bounded release; the founder explicitly authorized implementation.
- **Prior completed work reconciled:** Existing Decision Concierge, homepage routing, semantic design system, consent architecture, and insurance evidence store are reused.
- **Registry gaps:** Absence from the former `More` list does not mean a service was absent or incomplete.

## 5. Inherited-decision challenge gate

| Inherited item | Established when/why | Original evidence | Current status | Quantified present impact | Conflict or anomaly | Missing evidence | Red-team challenge | Revisit trigger |
|---|---|---|---|---|---|---|---|---|
| Six primary navigation destinations | July 2026 to stop mixing audiences, topics, formats, and outcomes | Broad-audience IA review and implementation | Provisional | 6 direct primary destinations preserved | Specialist utility accumulated behind generic overflow | Direct navigation behavior | Do not undo a sound simplification by creating a sitemap-sized menu | 28-day navigation evidence |
| Generic `More` overflow | July 2026 as secondary access | Header implementation | Merely implemented | 8 equal-weight links | Label hides service value and mixes audiences/resources | Click/open evidence | A renamed mega-menu could be worse than `More` | Accessibility or selection failure |
| Flat mobile sheet | Existing responsive implementation | Header code and tests | Merely implemented | 14 sequential destinations | High scanning burden with no hierarchy | Mobile task evidence | Extra accordion taps may slow expert users | Mobile abandonment or task failure |
| Existing `growth_events` table | PR #235 bounded insurance evidence | CAF-D-010 / CAF-E-005 | Confirmed for insurance; provisional for expansion | 1 table, 2 event names, 1 surface | Unique index omitted surface because only one surface existed | Navigation volume | Avoid turning a bounded table into a general event warehouse | Schema growth or privacy concern |

- The inherited navigation predates the current service inventory and executive controls.
- Passing header tests proved behavior, not that the information architecture remained correct.
- No registry absence was treated as proof that prior work was absent.

## 6. Capability plan

| Need | Authoritative system/tool | Skill or workflow | Fallback | Write or risk level |
|---|---|---|---|---|
| Repository implementation | GitHub | GitHub connector and PR workflow | Local git when available | High write |
| Preview/production | Vercel | Deployment and browser verification | GitHub browser certification | High release |
| Data contract | Supabase | Versioned migration, SQL verification, advisors | No instrumentation expansion | High data |
| Operating record | Notion | Research/operating page update | Repository work packet | Medium write |
| Active work | Linear | AND-99 | GitHub PR record | Medium write |
| Brand constraints | Google Drive | Connected design/brand rules | Repository design tokens | Read only |

## 7. Independent role matrix

| Role | Status | Material finding | Evidence | Action/acceptance test |
|---|---|---|---|---|
| Orchestrator | PASS | Scope remains one navigation intervention | Assignment and PR #237 | No unrelated redesign |
| Context steward | PASS | Prior six-link decision preserved and challenged explicitly | Notion/GitHub IA records | Record replacement rationale |
| Capability router | PASS | GitHub, Vercel, Supabase, Notion, Linear, Drive used by authority | Connector reads/writes | No unsupported source substitution |
| Executive strategy | PASS | Better discovery compounds existing utility | 34-tool inventory | Preserve mission and routes |
| Product management | PASS | Outcome-led service selection is bounded | Typed registry | At least 8 concrete services surfaced |
| Healthcare user research | WARN | Founder observation is direct but no user test exists | Founder request | Treat labels as experiment |
| Information architecture | PASS | Four groups reduce flat choice overload | Benchmark synthesis and route inventory | Same hierarchy desktop/mobile |
| UX and design system | PASS | Existing semantic system is appropriate | `src/index.css` | No parallel visual language |
| Content and evidence integrity | PASS | Descriptions state outcomes without advice or commercial claims | Registry copy | Fixed plain-English descriptions |
| Frontend engineering | PASS | One typed registry can drive both surfaces | Header implementation | No duplicate route-label source |
| Systems architecture | PASS | Reuse existing evidence API/table | Current evidence pipeline | No second analytics system |
| Backend, data, and security | WARN | Migration must preserve forced RLS and least privilege | Migration contract | Apply only after code gates pass |
| Platform and DevOps | WARN | Preview/production verification pending | Vercel | Exact-head READY and clean runtime |
| SEO and discovery | PASS | Routes and indexability are unchanged | Registry/header-only scope | Sitemap/canonical checks pass |
| Monetization and conversion | PASS | No commercial activation | Scope and CAF-D-003 | Preserve neutral educational paths |
| Analytics and experimentation | PASS | Fixed open and selection events create a bounded funnel | Evidence contract | Consent and allowlist tests pass |
| Accessibility, performance, and reliability | WARN | Dense desktop panel and mobile disclosures require browser testing | Header implementation | 320px, laptop, keyboard, overflow gates |
| Privacy, legal, and user protection | PASS | No sensitive or arbitrary fields | Event parser and migration | Grants/RLS and payload tests pass |
| Publishing and governance | WARN | Ledgers/work packet require closeout | Repository operating system | Update before merge |
| Quality and release | WARN | First CI pass failed one Radix interaction test | CI run 30674840144 | Corrected full rerun passes |
| Adversarial red team | WARN | Grouped menu could become a disguised mega menu | 17 service destinations | No more than four groups; browser usability pass |
| Process improvement | PASS | Typed service registry prevents label drift | New registry/tests | Reuse for future discovery |

## 8. Executive accountability matrix

| Executive perspective | Registered role mapping | Status | Finding | Evidence | Consequence | Action/acceptance test |
|---|---|---|---|---|---|---|
| Chief Executive / Strategy | Executive strategy | PASS | Compounds completed utility rather than adding disconnected content | Site inventory | Stronger platform coherence | Preserve mission |
| Chief Operating Officer | Orchestrator / publishing | WARN | Cross-system records must agree at closeout | PR/Notion/Linear | Avoid stale state | Reconcile after production |
| Chief Financial Officer | Monetization | PASS | Small reversible build; no paid service activation | Scope | No direct revenue claim | Report opportunity cost honestly |
| Chief Revenue Officer | Monetization/conversion | PASS | Discovery may support future value, but revenue is not the release metric | No conversion baseline | No premature commerce | Measure selection first |
| Chief Product Officer | Product / IA | PASS | Structured outcome navigation is the highest-value bounded intervention | Benchmark and current inventory | More utility becomes visible | 4 groups and named outputs |
| Chief Technology Officer | Frontend / architecture | PASS | Typed registry and shared evidence pipeline fit current stack | Code design | Low architecture duplication | Full build/typecheck |
| Chief Data and Analytics Officer | Analytics | WARN | Consented sample may remain small | Existing 0-row baseline | Counts may be non-interpretable | Threshold 25 opened sessions |
| Chief Marketing and Discovery Officer | SEO/discovery | PASS | Global discovery improves without changing indexed pages | Header-only route links | No SEO loss expected | Search readiness passes |
| Editorial and Evidence Officer | Content/evidence | PASS | Outcome descriptions are educational and bounded | Registry copy | No new substantive claims | Copy review/test |
| Healthcare User and Clinical Context Officer | Healthcare research | PASS | Patient/caregiver and worker pathways receive equal intentional visibility | Four-group model | Mission alignment | Representative journeys pass |
| Privacy, Legal, and User Protection Officer | Privacy/legal | WARN | Database migration requires effective privilege verification | Supabase contract | No public evidence access | RLS/grants/advisors pass |
| Accessibility and Reliability Officer | Accessibility/reliability | WARN | Panel density and disclosure behavior need exact browser evidence | UI change | Merge blocked until pass | Keyboard/mobile/browser checks |
| Quality and Release Officer | Quality/release | WARN | One first-pass test defect found | CI logs | Correct before migration/merge | All final-head workflows pass |
| Adversarial Red Team | Red team | WARN | More visible links could recreate overload | 17 selected service entries | Must remain scannable | Browser/business validation |
| Process Improvement Officer | Process improvement | PASS | Registry and contract tests make future changes safer | New reusable assets | Less navigation drift | Automated tests retained |

## 9. Anti-blindness findings

- **What the prompt emphasized:** Navigation complexity, hidden high-value services, desktop/mobile consistency, and benchmark-informed design.
- **What it omitted:** Direct user testing and sufficient existing navigation telemetry.
- **Strongest argument against the solution:** A large grouped panel may increase cognitive load and merely rename a mega menu.
- **Weakest assumption:** Visitors will understand the four proposed group labels without testing.
- **Largest unused opportunity:** A future searchable service finder, only if grouped navigation evidence remains weak.
- **Metric that could improve while the product worsens:** More destination clicks could reflect confusion or accidental exploration rather than successful wayfinding.
- **Evidence that would change the decision:** Lower high-value destination selection, accessibility regressions, high menu-open/no-selection behavior, or direct user confusion.

## 10. Quantified before-and-after impact

| Measure | Before | Proposed/after | Absolute change | Percentage change | Consequence |
|---|---:|---:|---:|---:|---|
| Primary desktop destinations | 6 | 6 | 0 | 0% | Original broad entry layer preserved |
| Generic overflow destinations | 8 | 0 | -8 | -100% | Generic `More` removed |
| Structured service groups | 0 | 4 | +4 | n/a | Secondary choices gain hierarchy |
| Flat mobile destinations | 14 | 3 direct + 4 groups | -11 flat items | -78.6% flat choices | Less initial scanning; disclosures add one tap |
| Concrete high-value services named globally | 0 | 9 | +9 | n/a | Completed utility becomes visible |
| Footer links | 21 | 21 | 0 | 0% | Comprehensive recovery/trust access preserved |
| Public tools | 34 | 34 | 0 | 0% | No utility removed |
| Indexable routes | 160 expected | 160 expected | 0 | 0% | Must be revalidated |
| Ad-eligible routes | 39 | 39 | 0 | 0% | Monetization governance unchanged |
| Instrumented navigation events | 0 | 2 | +2 | n/a | Creates bounded open/selection evidence |
| Evidence tables | 1 | 1 | 0 | 0% | Existing table extended, no warehouse |

- **Monetization impact:** None directly; better discovery may support future value but no revenue claim is made.
- **User-journey impact:** Nine concrete decision services become globally named with outcome descriptions.
- **SEO/discovery impact:** Internal-link visibility increases; canonical routes and indexability remain unchanged.
- **Maintenance impact:** One typed registry replaces duplicated secondary labels.
- **Measurement impact:** Two fixed navigation events and desktop/mobile surfaces are added.
- **Second-order effects:** Header panel density and mobile disclosure taps require measurement.
- **Rollback path:** Revert PR #237 and the migration; preserve existing event rows or archive them before constraint rollback if any have been collected.

## 11. Anomaly gate

- [x] Changes more than 20% of a major site surface.
- [ ] Materially reduces monetizable inventory.
- [ ] Materially reduces indexable inventory.
- [ ] Materially reduces usable functionality.
- [ ] Contradicts a confirmed founder objective.
- [ ] Implies extensive prior work was never completed.
- [ ] Depends on one incomplete registry or source.
- [ ] Produces an economically implausible outcome.
- [x] Creates a mismatch risk between technical success and business value.
- [ ] Leaves a high-intent journey without a meaningful next action.
- [ ] Cannot be explained clearly from current evidence.

- **Why justified:** The header is globally visible, but routes and the six primary destinations remain unchanged; the change is reversible and measurement-gated.
- **Independent executive reviewer:** Product, accessibility/reliability, analytics, and red-team roles.
- **Mitigation:** Exact browser certification, no more than four groups, fixed measurement, and 28-day review.
- **Acceptance test:** Technical and business validation both PASS before merge.

## 12. Candidate work ranking

| Candidate | User value | Business value | Strategic fit | Confidence | Effort | Reversibility | Maintenance | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Structured Explore CAF navigation | 5 | 4 | 5 | 4 | 3 | 5 | 4 | 3 | Selected |
| Homepage pathway rewrite | 4 | 4 | 4 | 3 | 3 | 4 | 3 | 3 | Rejected; homepage already has coherent router |
| Searchable service finder | 4 | 4 | 4 | 2 | 2 | 4 | 2 | 3 | Defer pending evidence |
| Flagship hub visual pilot | 3 | 3 | 4 | 3 | 3 | 4 | 3 | 2 | Does not solve global discovery |
| Full visual redesign | 3 | 2 | 2 | 2 | 1 | 2 | 1 | 5 | Rejected |

## 13. Integrated decision

- **Selected outcome:** Structured `Explore CAF` navigation using one four-group typed registry across desktop and mobile.
- **Why it outranks alternatives:** It improves global discovery while preserving existing routes, homepage logic, design system, SEO, and commercial boundaries.
- **Complete user journey:** Open header navigation, identify a real-world decision group, read an outcome description, select a canonical destination, complete the existing tool or guide.
- **Architecture:** Registry is code authority; existing evidence API/table is extended with fixed events.
- **Commercial/editorial treatment:** Educational descriptions only; no partner or sales placement.
- **Instrumentation:** `service_navigation_opened` and `service_navigation_destination_selected` after analytics consent.
- **Rollback:** Revert implementation and migration; review any collected rows first.
- **Evidence that would reverse the decision:** Accessibility failure, performance failure, low selection at adequate volume, or user evidence favoring another IA.
- **Reassessment:** 28 days after production release or 25 distinct consented opened sessions, whichever provides interpretable evidence.

## 14. Separate validation dispositions

### Technical validation

- **Status:** WARN — final-head rerun, database verification, preview, and production validation pending.
- **Implementation correctness:** Typed registry and parser/client/migration tests implemented.
- **Tests and typing:** First run passed 556 of 557 tests; one Radix test-harness interaction was corrected.
- **Security and privacy:** Fixed contract implemented; production migration not yet applied.
- **Accessibility and reliability:** Existing focus behavior preserved; exact browser evidence pending.
- **Deployment and route behavior:** Preview pending on corrected head.
- **Observability:** Two fixed events defined; runtime verification pending.
- **Rollback:** Revert PR and migration.

### Business validation

- **Status:** WARN — implementation is rational, but final browser usability and route inventory checks remain pending.
- **User usefulness:** Nine high-value services receive global outcome-led visibility.
- **Strategic alignment:** Supports all three audiences and existing decision systems.
- **Revenue and sustainability:** No direct revenue activation or claim.
- **Opportunity cost:** Smaller and more reversible than homepage or visual redesign.
- **Conversion and discovery:** Navigation selection is measurable without sensitive data.
- **Operational burden:** One typed registry; no custom media pipeline.
- **Economic plausibility:** Exposes completed assets without creating new content inventory.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Validation | Owner role |
|---|---|---|---|---|
| Typed IA | `src/data/serviceNavigation.ts` | Four groups, unique IDs/routes, at least 8 concrete services | Unit contract | IA/frontend |
| Desktop/mobile UI | `Header.tsx` | Same hierarchy, focus/escape/mobile behavior | Unit + browser | UX/accessibility |
| Evidence client/contract | evidence TS files | Consent, fixed surfaces/IDs, no arbitrary fields | Unit/API typecheck | Analytics/privacy |
| Database | migration | Forced RLS, least privilege, strict checks | SQL/advisors | Data/security |
| Governance | ledgers/work packet/records | Current state and rollback documented | Governance check | Publishing/quality |
| Release | GitHub/Vercel | All exact-head gates, merge, production smoke | CI/browser/runtime | Quality/DevOps |

## 16. Release gates

- [ ] Intended users complete representative service-navigation journeys.
- [x] Inherited-decision challenge gate is complete.
- [x] Quantified-impact and anomaly gates are complete.
- [ ] Technical validation has PASS.
- [ ] Business validation has PASS.
- [x] Claims and calculations are bounded and verified.
- [ ] Architecture and security boundaries receive production verification.
- [ ] Analytics events are validated through the actual journey.
- [ ] Accessibility, responsive behavior, performance, and degraded states pass.
- [ ] SEO, canonical, redirect, sitemap, and indexability effects pass.
- [x] Publication ownership and correction paths remain unchanged.
- [ ] Tests, lint, type checks, build, and repository checks pass on final head.
- [ ] Latest PR head, preview, comments, and review threads are inspected.
- [ ] Red-team warnings are resolved.
- [ ] Production smoke validation passes.

## 17. Executive closeout

- **What changed:** Pending final release; grouped navigation, typed registry, and evidence extension implemented on PR #237.
- **What did not change:** Homepage, footer, routes, indexability, AdSense settings, Stripe, affiliates, email, and visual identity.
- **Before-and-after metrics:** Recorded in Section 10; final counts pending build verification.
- **Production and release status:** Not yet merged; production unchanged.
- **Validation performed:** First CI isolated one test-harness defect after 556 passes; corrected rerun pending.
- **Unresolved warnings:** Browser density, database effective privileges, final production health.
- **Business consequences:** More completed utility becomes discoverable; no direct monetization claim.
- **Owner-only actions:** None.
- **Rollback path:** Revert PR and migration after inspecting stored rows.
- **Evidence still missing:** Live navigation selections and direct usability feedback.
- **Single highest-value next action:** Review 28-day navigation evidence after release.

## 18. Compounding closeout

- **Project context updated:** Pending final closeout.
- **Decision ledger updated:** Pending CAF-D-011.
- **Evidence ledger updated:** Pending CAF-E-006.
- **Work ledger updated:** Pending CAF-W-008.
- **Route-level governance updated:** No route disposition change.
- **Skill or prompt improved:** Benchmark-to-implementation sequence documented in Notion and this packet.
- **Reusable component/template/query created:** Typed service-navigation registry and fixed evidence contract.
- **Automated check or regression test added:** Registry, Header, evidence client/parser, and migration tests.
- **Duplicate or stale artifact retired:** Generic `More` and flat mobile secondary list in implementation.
- **One remaining process debt:** No automated cross-check yet proves every service registry route exists in the canonical route manifest.
- **Trigger for future reassessment:** 28 days, 25 opened sessions, accessibility/performance issue, or route drift.
