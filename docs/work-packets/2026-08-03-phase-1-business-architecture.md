# CAF Phase 1 — Business Architecture Work Packet

## 1. Assignment charter

- **Plain-language request:** Complete the route and asset classification, define the free-versus-paid business architecture, and produce the founder decision memo before reorganizing the public site.
- **Actual user outcome:** Know what every current route does for the business, what stays free, what can support the paid product, what should be consolidated, and what Phase 2 is allowed to change.
- **Affected audiences:** Healthcare workers first; patients and caregivers remain intentional public audiences.
- **Business outcome:** Convert CAF from an undifferentiated educational-site model into a free-core, product-led platform with one visible paid flagship.
- **Success metrics:** 100% current canonical route coverage; all known premium/private routes classified; one founder decision; no checkout or production behavior change; explicit consolidation dispositions; machine-enforced coverage.
- **Constraints:** Checkout remains off; no broad URL deletion; no new paid products; no claims of demand validation; preserve public-interest information.
- **Non-goals:** Homepage redesign, navigation release, early-access funnel release, product-content implementation, authentication activation, payment activation, article deletion, or traffic claims.
- **Risk class:** Moderate strategic/governance risk; low direct production risk.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | Current homepage and public route language reviewed; one decision router and free tool library are live | 2026-08-03 | Public review does not establish demand or conversion |
| GitHub/main | 160-route canonical inventory; PR #249 released; PR #221 premium foundation released | 2026-08-03 | Route inventory is the canonical public baseline; private/API surfaces require supplemental classification |
| Relevant PRs/issues | PRs #221, #222, #224, #248, #249, #250; Linear AND-102, 106, 109, 88, 89 | 2026-08-03 | PR #224 and several Linear gates remain incomplete |
| Vercel/runtime | Latest known production releases are READY; this phase intentionally changes no runtime behavior | 2026-08-03 | Branch preview and CI must still validate the new governance scripts |
| Supabase/data/auth | RLS foundation and two-user isolation evidence exist; auth/persistence end-to-end work remains | 2026-07-27 | Not authorization to activate accounts or premium access |
| Stripe/payments | $29 one-time Product/Price foundation exists; checkout flags remain false; webhook and test matrix incomplete | 2026-07-27 | No live purchase is authorized |
| Search/analytics/AdSense | Latest connected Search Console baseline ends 2026-07-20 | 2026-08-03 review | Too stale and sparse to establish product demand or justify broad URL deletion |
| Notion/Linear/Drive | Product architecture program, deep-research synthesis, founder open-enrollment decision, product master, opportunity registry, and issue gates reviewed | 2026-08-03 | Research artifacts contain hypotheses that require behavioral validation |
| External primary sources | 2026 employer benefits guides from Atrium, UNC Health, ECU Health, Northwell, and Novant | 2026-08-03 | Documents support product requirements; they do not prove willingness to pay |

## 3. Evidence classification

| Claim or input | Classification | Source | Limitation |
|---|---|---|---|
| CAF has 160 current canonical public routes | Verified fact | GitHub route inventory | Baseline can change after later merges |
| Free education plus paid coordination is coherent | Supported inference | Deep research, route portfolio, employer packets | Does not establish price or conversion |
| Open Enrollment Workspace is first priority | Founder decision | Founder direction and Notion decision record | Remains testable and refinable |
| $29 is the correct price | Unresolved hypothesis | AND-102 and prior product master | Requires qualified commitment behavior |
| Several current benefits tools can be reused as modules | Supported inference | Existing tool promises and employer-guide complexity | Requires product UX and maintenance review |
| Medical-bill and patient resources should remain free now | Conservative precaution and strategic decision | Public-interest boundary, privacy/support risk | Future bounded productization may be reconsidered separately |
| Some routes should be merged or redirected | Supported but route-specific inference | Overlap and metadata anomalies | Requires search, link, live-route, and redirect evidence before execution |

## 4. Context and decision memory

- **Relevant project context:** CAF is a healthcare financial decision-support platform for healthcare workers, patients, and caregivers; sequence one exceptional healthcare-worker flagship first.
- **Active decisions:** CAF-D-001, CAF-D-002, CAF-D-003, CAF-D-013, CAF-D-014.
- **Potential conflicts:** Broad content growth and multiple product ideas could dilute the founder-selected flagship.
- **Prior work reconciled:** Navigation simplification, directional CTA ownership, premium foundation, Supabase hardening, Stripe prelaunch hardening, medical-bill system, patient guide, and AdSense route governance.
- **Founder confirmation:** The current assignment confirms the phase sequence and single-visible-flagship direction.
- **Registry gaps:** The canonical inventory excludes private/account/product-support routes, so the classifier adds a supplemental registry.

## 5. Inherited-decision challenge gate

| Inherited item | Current status | Present impact | Challenge | Decision |
|---|---|---|---|---|
| 160 canonical route inventory | Confirmed baseline | Defines public classification denominator | Route count does not equal business value | Use as coverage baseline only |
| Start Here as single router | Confirmed but measured evidence sparse | Prevents duplicate routing surfaces | Could overcentralize if destinations remain weak | Retain for Phase 2; improve destinations rather than add routers |
| Benefits Command Center as named system | Merely implemented and now overlapping | Competes with newer blueprint/action-plan and flagship language | Creates parallel product identity | Consolidate into flagship qualification path |
| Healthcare Worker Benefits Decision System | Confirmed technical foundation | Reusable architecture and product route | Existing scope is broader than first market wedge | Keep as flagship; make Open Enrollment Workspace first workflow |
| $29 one-time price | Provisional | Enables bounded validation | Could be too low, too high, or irrelevant without demand | Test, do not activate checkout |
| Broad free library | Confirmed strategic asset | Trust, acquisition, public value | Can create navigation clutter and maintenance burden | Preserve URLs; reorganize presentation, not bulk delete |
| Ads/affiliate monetization | Supplemental | May support free layer | Can weaken trust or distract from product | Keep subordinate to user outcome and route governance |

Passing technical tests proves implementation integrity, not demand, comprehension, or revenue. Absence from one registry was not treated as proof that a route or product capability was absent.

## 6. Capability plan

| Need | Authoritative system/tool | Workflow | Write/risk level |
|---|---|---|---|
| Route baseline and product architecture | GitHub | Read current main, prior PRs, route inventory, and premium docs | Read; low |
| Founder decisions and research synthesis | Notion | Fetch product architecture program, founder decision, product master, opportunity registry | Read/update; moderate |
| Work sequencing and gates | Linear | Fetch AND-102/106/109/88/89 and update with durable artifacts | Write; moderate |
| Evidence archive | Google Drive | Verify research and release records; archive final memo when supported | Read/write; low |
| Current public behavior | Production/Vercel/web | Verify representative surfaces and later branch preview | Read; low |
| Route coverage | Repository script + Vitest | Deterministic classifier over all canonical and supplemental routes | Write; low runtime risk |

## 7. Independent role matrix

| Role | Status | Material finding | Action/acceptance test |
|---|---|---|---|
| Orchestrator | PASS | Phase sequence is coherent and bounded | Complete Phase 1 artifacts before Phase 2 |
| Context steward | PASS | Founder decision supersedes prior “research only” posture for architecture | Link current evidence and preserve uncertainty labels |
| Capability router | PASS | GitHub, Notion, Linear, Drive, production, Supabase, and Stripe evidence are relevant | Use authoritative source for each claim |
| Executive strategy | PASS | One flagship concentrates scarce founder and product resources | Reject multi-product public catalog |
| Product management | PASS | Free preparation versus paid completion is a defensible boundary | Define precise product outcome and exclusions |
| Healthcare user research | WARN | Employer packets prove complexity, not purchase demand | Run qualified $29 validation and user interviews |
| Information architecture | PASS | Decision-first hierarchy is preferable to route-count exposure | Design Phase 2 around Start Here, Free Resources, Decision System, Workspace, Trust |
| UX and design system | PASS | Paid experience must feel like completion, not a paywall | Preview outcome and preserve free result clarity |
| Content and evidence integrity | PASS | Foundational and safety-critical information remains free | Preserve source authority and verification status |
| Frontend engineering | PASS | Phase 1 can be docs/governance only | No runtime imports or route changes |
| Systems architecture | PASS | Existing premium foundation is reusable | Avoid parallel product stack |
| Backend, data, and security | WARN | Foundation exists; activation evidence incomplete | Keep auth, persistence, content, and checkout disabled |
| Platform and DevOps | PASS | No deployment configuration change is needed | CI must pass on branch head |
| SEO and discovery | WARN | Search evidence is dated and sparse | Preserve URLs by default; require route-specific redirect evidence |
| Monetization and conversion | WARN | $29 remains unvalidated | Use commitment threshold, not CTA clicks |
| Analytics and experimentation | WARN | No current qualified sample | Instrument Phase 3 without sensitive data |
| Accessibility, performance, and reliability | PASS | No public UX changes in Phase 1 | New scripts/tests must not break build |
| Privacy, legal, and user protection | PASS | Data minimization and public-interest boundaries are explicit | No upload/PHI/individual advice in first version |
| Publishing and governance | PASS | Role classifier creates durable source of truth | Every route must receive exactly one role |
| Quality and release | WARN | Technical checks pending PR CI | Block merge on failed test/build or unresolved review |
| Adversarial red team | PASS | Biggest risk is mistaking founder conviction for market proof | Keep checkout off and test demand first |
| Process improvement | PASS | Route roles now become reusable Phase 2 input | Add coverage regression to Vitest |

## 8. Executive accountability matrix

| Perspective | Status | Finding | Consequence |
|---|---|---|---|
| CEO / Strategy | PASS | Free core plus one paid flagship is the highest-focus architecture | Proceed to site reorganization after Phase 1 approval |
| COO | PASS | Self-serve product limits founder support burden | Do not sell individualized service |
| CFO | WARN | Price and acquisition economics remain unproven | Treat $29 as test, not forecast |
| CRO | WARN | Qualified commitment path is not yet released | Phase 3 must measure price-qualified interest |
| CPO | PASS | Open Enrollment Workspace is the first bounded workflow | Do not expose multiple paid products |
| CTO | PASS | Existing premium system is sufficient technical capital | Reuse, do not rebuild parallel architecture |
| Data/Analytics | WARN | Current demand evidence is insufficient | Define exact funnel denominator and consent rules |
| Marketing/Discovery | PASS | Free tools and education provide credible acquisition paths | Organize by decision and use contextual handoffs |
| Editorial/Evidence | PASS | Free public source layer protects credibility | Keep official and safety-critical content free |
| Healthcare User Context | PASS | Employer packets confirm real-world rule complexity | Build structured manual entry before document ingestion |
| Privacy/Legal | PASS | First version can avoid sensitive records and uploads | Maintain strict data boundary |
| Accessibility/Reliability | PASS | Documentation change only | Retain existing product gates later |
| Quality/Release | WARN | Await branch CI and review | No merge before validation |
| Red Team | PASS | Overbuilding before demand is the main business hazard | Validate one offer before product completion |
| Process Improvement | PASS | Machine-readable roles reduce future re-audit cost | Use classifier as Phase 2 source of truth |

## 9. Anti-blindness findings

- **Prompt emphasis:** Complete five phases in order.
- **Prompt omission:** It does not itself prove demand, traffic quality, or price.
- **Strongest argument against the obvious solution:** Reorganizing around a product could confuse a small audience and weaken search discoverability before demand exists.
- **Weakest assumption:** Users will tolerate manual plan entry and pay $29 for coordination.
- **Largest unused opportunity:** Current-benefits baseline can make the product useful outside annual enrollment.
- **Metric that could improve while product worsens:** Product-page click-through could rise from aggressive promotion while trust or free-task completion declines.
- **Evidence that would change the decision:** 50 qualified views with zero commitments, high input abandonment, or evidence that HR/employer tools already solve the workflow adequately.

## 10. Quantified before-and-after impact

| Measure | Before | Phase 1 after | Change | Consequence |
|---|---:|---:|---:|---|
| Canonical routes with explicit business role | 0/160 | 160/160 | +160 | Complete architecture coverage |
| Known supplemental premium/private routes classified | 0 | 9 | +9 | Product infrastructure separated from public education |
| Visible paid flagships approved | Unclear/competing concepts | 1 | Concentrated | Reduces product dilution |
| Purchasable products | 0 | 0 | 0 | Checkout remains off |
| Indexable canonical routes | 160 | 160 | 0 | No Phase 1 SEO loss |
| Ad-eligible articles | 39/71 | 39/71 | 0 | Monetization governance unchanged |
| Public route removals | 0 | 0 | 0 | Consolidation is planned, not executed |
| Automated business-role coverage checks | 0 | 1 | +1 | Future route drift fails tests |

- **Monetization impact:** No revenue activated; creates a validated architecture for later offer testing.
- **User-journey impact:** No public change in Phase 1.
- **SEO/discovery impact:** None intended; no route or metadata changes.
- **Maintenance impact:** Adds route-role governance and reduces future classification ambiguity.
- **Measurement impact:** Defines what Phase 3 must measure.
- **Second-order effect:** Existing benefits assets are no longer treated as competing products.
- **Rollback:** Revert documentation, classifier, and test commits; no user or payment state exists.

## 11. Anomaly gate

- [x] Changes the strategic role assigned to more than 20% of the site inventory.
- [ ] Materially reduces monetizable inventory.
- [ ] Materially reduces indexable inventory.
- [ ] Materially reduces usable functionality.
- [ ] Contradicts a confirmed founder objective.
- [ ] Implies extensive prior work was never completed.
- [ ] Depends on one incomplete registry or source.
- [ ] Produces an economically implausible outcome.
- [x] Could create a mismatch between technical success and business value if interpreted as demand proof.
- [ ] Leaves a high-intent journey without a meaningful next action.
- [ ] Cannot be explained clearly from current evidence.

The strategic coverage change is justified because it is classification only, preserves current behavior, and is reviewed through multiple evidence systems. The demand-proof mismatch is mitigated by explicit AND-102 thresholds and disabled checkout.

## 12. Candidate work ranking

| Candidate | User value | Business value | Strategic fit | Confidence | Effort | Risk | Decision |
|---|---:|---:|---:|---:|---:|---:|---|
| Free core + one paid flagship | 9 | 9 | 10 | 8 | 6 | 4 | Select |
| Several paid systems | 7 | 6 | 4 | 3 | 10 | 9 | Reject for now |
| Free consumer + immediate B2B | 7 | 8 | 6 | 3 | 10 | 8 | Defer |
| Ads/affiliates as primary model | 5 | 4 | 4 | 5 | 4 | 6 | Supplemental only |
| Continue content accumulation | 6 | 3 | 3 | 7 | 7 | 5 | Reject as next move |

Scores are directional, not financial forecasts.

## 13. Integrated decision

- **Selected outcome:** Free public decision-preparation platform with one paid Healthcare Worker Benefits Decision System; Open Enrollment Workspace is the first workflow.
- **Why it outranks alternatives:** Highest focus, best use of existing assets, strongest healthcare-worker fit, lower privacy and support risk than other candidates, and fastest path to behavioral validation.
- **Complete user journey:** Free education/tool → clear result → flagship preview → price-qualified early-access commitment → later self-serve workspace → verification-ready brief.
- **Architecture source of truth:** Founder memo plus deterministic route classifier.
- **Commercial treatment:** One-time $29 validation hypothesis; no checkout.
- **Editorial treatment:** Basic and safety-critical information remains free.
- **Instrumentation:** Phase 3 only; fixed event metadata, no plan or health details.
- **Rollback:** Revert Phase 1 artifacts.
- **Evidence that would reverse decision:** Failed qualified commitment test or unacceptable input/support burden.
- **Reassessment:** At AND-102 threshold or before Phase 4 implementation.

## 14. Separate validation dispositions

### Technical validation

- **Status:** WARN pending CI
- **Implementation correctness:** Classifier and generator added; coverage test added.
- **Tests and typing:** Must pass repository CI and Vitest.
- **Security and privacy:** No runtime data or secret change.
- **Accessibility and reliability:** No public interface change.
- **Deployment and route behavior:** No intended effect.
- **Observability:** Existing systems unchanged.
- **Rollback:** Normal commit revert.

### Business validation

- **Status:** PASS for architecture; WARN for market demand
- **User usefulness:** Free value remains substantial; paid boundary is outcome-based.
- **Strategic alignment:** Matches founder direction and phased audience architecture.
- **Revenue and sustainability:** Plausible but unvalidated.
- **Opportunity cost:** Prevents scattered product work.
- **Conversion and discovery:** Requires Phase 3 evidence.
- **Operational burden:** Self-serve and no-upload boundaries reduce risk.
- **Economic plausibility:** $29 test is plausible but not forecastable.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria | Owner role |
|---|---|---|---|
| Route role registry | `scripts/business-role-classification.mjs` | Every current route receives one valid role | Information architecture |
| Coverage generator | `scripts/generate-business-role-inventory.mjs` | 160 canonical plus supplemental routes classify without gaps | Publishing/governance |
| Regression test | `src/test/businessArchitecture.test.ts` | Existing Vitest suite executes classifier | Quality/release |
| Founder memo | `docs/strategy/2026-08-03-free-core-paid-flagship-founder-decision.md` | Clear choice, boundary, alternatives, risks, and validation gate | CEO/CPO |
| Durable records | Notion, Linear, Drive, GitHub ledgers | All systems link to the same source of truth | Context steward |

## 16. Release gates

- [x] Intended business decision is fully specified.
- [x] Inherited-decision challenge gate is complete.
- [x] Quantified-impact and anomaly gates are complete.
- [ ] Technical validation has passed CI.
- [x] Business validation has an explicit disposition.
- [x] Claims and source limitations are labeled.
- [x] Architecture and security boundaries are reviewed.
- [x] No analytics change is included.
- [x] No accessibility or public UX change is included.
- [x] No SEO, canonical, redirect, sitemap, or indexability change is included.
- [x] Checkout remains disabled.
- [ ] Latest PR head, checks, preview, and review threads are inspected.
- [x] Red-team blockers are resolved or explicitly deferred.

## 17. Executive closeout

- **What changed:** Business roles, free/paid boundary, single-flagship decision, consolidation decisions, and machine coverage were added.
- **What did not change:** Production UI, routes, content, ads, analytics, Supabase, Stripe, auth, entitlements, checkout, and customer state.
- **Before/after:** 0/160 to 160/160 canonical route-role coverage; 0 to 9 supplemental route classifications; purchasable products remain 0.
- **Production status:** Unchanged.
- **Validation performed:** Cross-system evidence synthesis and deterministic test added; CI pending.
- **Unresolved warning:** Demand, price, entry burden, and conversion remain unvalidated.
- **Business consequence:** Phase 2 can reorganize presentation without inventing the business architecture during implementation.
- **Owner-only action:** Approve the memo/PR before Phase 2 release work.
- **Rollback:** Revert Phase 1 commits.
- **Highest-value next action:** Review and approve the founder decision memo, then execute Phase 2 against the route-role source of truth.

## 18. Compounding closeout

- Project context: update after approval.
- Decision ledger: add the free-core/single-flagship decision after ID verification.
- Evidence ledger: record route inventory, founder direction, employer packets, and premium foundation.
- Work ledger: record Phase 1 completion after CI.
- Route governance: deterministic classifier added.
- Reusable component: route role model and generator.
- Automated check: Vitest coverage gate.
- Duplicate/stale artifact: Benefits Command Center designated for later hierarchy consolidation.
- Remaining process debt: generated row-level CSV should be refreshed and committed through the approved repository workflow.
- Reassessment trigger: AND-102 demand thresholds or any material route inventory change.
