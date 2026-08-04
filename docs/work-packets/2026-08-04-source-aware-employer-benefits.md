# Source-Aware Employer Benefits Implementation

## 1. Assignment charter

- **Plain-language request:** Implement the newly located employer-benefits sources in the product before researching additional systems.
- **Actual user outcome:** A healthcare employee can search for an employer, see the exact verified public source CAF located, open it, and carry that source into a locally saved Benefits Receipt.
- **Affected audiences:** Healthcare workers evaluating employment or open-enrollment benefits; founder/research operators maintaining source coverage.
- **Business outcome:** Convert source research into a demonstrable product workflow and test whether employer-specific source availability creates a credible path toward the planned paid decision system.
- **Success metrics:** Verified source appears for covered systems; source URL/audience/year are preserved; local workspace handoff succeeds; no unreviewed figures are auto-filled; existing manual and reviewed-pilot paths still pass.
- **Constraints:** Public-safe metadata only; no private portal URLs; no employee credentials or personal data; remain within Vercel Hobby function limit; no database migration.
- **Non-goals:** Automatic extraction, plan recommendation, checkout activation, account persistence, prescription/network verification, or claiming all 639 systems are product-ready.
- **Risk class:** Moderate because employer-benefits sources are consequential and may be population-specific.

## 2. Current-state evidence

| Area | Direct evidence | Verified date | Coverage and limitation |
|---|---|---|---|
| Production | `/tools/benefits-command-center` currently exposes national status-only search and a five-employer reviewed pilot | 2026-08-04 | Status does not show the actual newly verified sources |
| GitHub/main | Merge commit `1c0e6b4`; `NationalEmployerDirectory.tsx`; `api/employer-benefits-source.ts` | 2026-08-04 | Directory API returns coverage metadata but no source detail |
| Supabase | 639 systems; 116 source records; 64 systems with verified public coverage; 51 source-verified records | 2026-08-04 | Source verification is distinct from fact and employee-population verification |
| Vercel/runtime | Vite project with 12 Node functions on Hobby plan | 2026-08-04 | No new function may be added safely |
| External primary sources | Official employer sources registered in Supabase | 2026-08-04 | Applicability can vary by entity, region, union, employee class, or plan year |

## 3. Evidence classification

| Claim or input | Classification | Source | Verified date | Limitation |
|---|---|---|---|---|
| A public employer source exists | Verified fact | `employer_benefits_discovered_sources.source_status` plus source verification | 2026-08-04 | Does not verify every fact in the source |
| A source applies to the current user | Unresolved uncertainty | Employee must confirm audience/location/group | 2026-08-04 | Product does not know employee eligibility |
| Values can be prefilled safely | Conservative precaution: no | Existing package/fact review gates | 2026-08-04 | Requires extraction and fact-level review |

## 4. Context and decision memory

- Relevant context: healthcare-worker flagship; complete decisions; visible uncertainty; user value before monetization.
- Active decisions: CAF-D-001, CAF-D-003, CAF-D-005, CAF-D-006, CAF-D-008.
- Prior completed work reconciled: PR #255 employer-aware foundation and PR #256 national directory.
- Registry gap: the national directory had newly verified source data in Supabase but exposed only aggregate status to users.

## 5. Inherited-decision challenge gate

| Inherited item | Original purpose | Current status | Present impact | Challenge | Decision |
|---|---|---|---|---|---|
| Status-only national directory | Safely launch national recognition before exposing research records | Provisional implementation | 64 covered systems looked the same as an abstract status | Passing search tests did not prove product usefulness | Expose source-verified public details only |
| Five-employer reviewed pilot | Prevent unreviewed automatic guidance | Confirmed safety boundary | Narrower than source-discovery coverage | Do not falsely treat source discovery as reviewed package readiness | Preserve pilot and add a separate source-aware manual path |
| One existing API function | Stay within 12-function Vercel limit | Confirmed operational constraint | Avoids paid-plan dependency | Enrich the GET response rather than adding an endpoint | Preserve |

## 6. Capability plan

| Need | Authoritative system/tool | Write or risk level |
|---|---|---|
| Current source data | Supabase | Read-only product query; existing research writes already completed |
| Product implementation | GitHub branch and PR | Moderate |
| Runtime validation | Vercel preview | Read/validation |
| Journey validation | Vitest and Playwright CI | Required release gate |

## 7. Independent role matrix

| Role | Status | Material finding | Action/acceptance test |
|---|---|---|---|
| Orchestrator | PASS | The smallest complete slice is source display plus workspace handoff | One coherent search-to-workspace journey |
| Context steward | PASS | Builds directly on PRs #255 and #256 | No parallel database or registry |
| Capability router | PASS | Supabase, GitHub, and Vercel are the correct systems | Use connected systems directly |
| Executive strategy | PASS | Converts research inventory into product value | Demonstrable employer-specific workflow |
| Product management | PASS | Status-only coverage was not enough to validate demand | Exact source must be visible and actionable |
| Healthcare user research | PASS | Employees need source, audience, year, and applicability warning | Preserve all four in UI/context |
| Information architecture | PASS | Source detail belongs inside employer result and workspace handoff | No new top-level route |
| UX and design system | PASS | Progressive source cards avoid overwhelming search | Mobile cards and clear CTA |
| Content and evidence integrity | PASS | Source discovery must remain separate from fact verification | No auto-filled values |
| Frontend engineering | PASS | Typed source context and banner are reusable | Unit and browser tests |
| Systems architecture | PASS | Existing API can enrich results without new function | Preserve Vercel limit |
| Backend, data, and security | PASS | Service-role query must return public-safe allowlisted fields only | Omit private and unreviewed submissions |
| Platform and DevOps | PASS | No infrastructure change required | Preview READY and 12 functions |
| SEO and discovery | NOT IMPLICATED | No indexable route or metadata change | Confirm no route changes |
| Monetization and conversion | WARN | This validates product utility but not willingness to pay | Keep checkout off; measure later |
| Analytics and experimentation | WARN | No new first-party event contract in this slice | Use task-completion validation; add events only under existing bounded framework later |
| Accessibility, performance, reliability | PASS | New source cards and banner must remain keyboard/mobile safe | Existing browser certification |
| Privacy, legal, user protection | PASS | No personal data or portal credentials; source attachment stays local | Reject unsafe stored URLs |
| Publishing and governance | PASS | Public source claims are generated from governed database state | No editorial page publication |
| Quality and release | PASS | Existing full release suite is appropriate | CI, decision journey, browser certification, preview |
| Adversarial red team | PASS | Main risk is implying source applicability or verified figures | Explicit warning and no prefill |
| Process improvement | PASS | Reusable source-context primitive compounds future extraction work | Versioned storage helper and regression test |

## 8. Executive accountability summary

- **Strategy/Product:** PASS — source research becomes a user-completable workflow.
- **Technology/Data:** PASS — one API, existing database, public-safe metadata, no migration.
- **Finance/Revenue:** WARN — business validation is limited to product demonstrability; no revenue claim.
- **Editorial/Healthcare context:** PASS — applicability and population uncertainty remain explicit.
- **Privacy/Legal:** PASS — public URLs only; browser-local context; no personal data.
- **Quality/Red team:** PASS pending automated and preview validation.

## 9. Anti-blindness findings

- **Prompt emphasized:** Implement before more research.
- **Prompt omitted:** Exact safe boundary between located sources and usable plan facts.
- **Strongest argument against obvious solution:** Showing links without carrying context into the calculator would remain a research directory, not a product.
- **Weakest assumption:** Users will value a manual source-aware workspace before automatic extraction exists.
- **Largest unused opportunity:** Structured extraction and population matching for the strongest 2026 portals.
- **Metric that could improve while product worsens:** Number of visible source links without source applicability accuracy.
- **Evidence that would change decision:** User confusion, unsafe source exposure, or lack of workspace completion.

## 10. Quantified before-and-after impact

| Measure | Before | After | Change | Consequence |
|---|---:|---:|---:|---|
| National systems searchable | 639/639 | 639/639 | 0 | Coverage preserved |
| Systems with verified public coverage | 64/639 | 64/639 | 0 | Data unchanged; product utilization changes |
| Search results able to show exact verified source | 0/64 covered systems | Up to 64/64, constrained by source-verification metadata | +64 potential systems | Research becomes inspectable |
| Search-to-source-aware workspace journey | 0 | 1 | +1 | User can retain source context |
| New serverless functions | 0 | 0 | 0 | Hobby-plan limit preserved |
| Automatic plan-value prefills | 0 | 0 | 0 | Safety boundary preserved |

- **Monetization impact:** No checkout or affiliate change; creates a credible product-validation surface.
- **User-journey impact:** Removes the dead end between “source located” and manual entry.
- **SEO impact:** None; no route or canonical changes.
- **Maintenance impact:** One typed context helper, one banner, one API enrichment.
- **Measurement impact:** Automated completion regression added; behavioral analytics deferred.
- **Rollback:** Remove API source enrichment, source cards, context helper/banner, and associated tests.

## 11. Anomaly gate

- [x] Depends on one incomplete registry or source.
- [x] Creates a mismatch between technical success and business value if implemented as links only.

Mitigation: Supabase remains the research ledger, but no single source is treated as complete employee guidance. The source-aware handoff must complete a user task and keep figures manual.

## 12. Candidate work ranking

| Candidate | User value | Business value | Confidence | Effort | Risk | Decision |
|---|---:|---:|---:|---:|---:|---|
| Display exact sources only | Medium | Low | High | Low | Low | Insufficient alone |
| Display sources plus local workspace handoff | High | High | High | Moderate | Moderate | Selected |
| Auto-extract and prefill all 64 systems | Very high | High | Low | Very high | High | Deferred |
| Continue finding more sources first | Medium | Medium | High | High | Low | Paused by founder |

## 13. Integrated decision

- **Selected outcome:** Source-aware employer search and local workspace handoff.
- **Architecture:** Existing Supabase research ledger and existing API remain authoritative; a new browser-local context records the selected public source.
- **Commercial/editorial treatment:** Free, non-commercial, and explicitly non-recommendatory.
- **Instrumentation:** Automated journey test now; bounded behavioral event considered after the flow is proven.
- **Rollback:** Revert the seven-file feature slice; no database rollback.
- **Reassessment:** After production journey validation and founder inspection.

## 14. Separate validation dispositions

### Technical validation

- **Status:** Pending CI and preview.
- **Security/privacy:** Public-safe fields only; unsafe stored URLs rejected.
- **Accessibility/reliability:** Source links, buttons, live status, and removal control covered by browser suite.

### Business validation

- **Status:** WARN pending founder/user inspection.
- **User usefulness:** Stronger than status-only directory.
- **Revenue:** Not tested.
- **Economic plausibility:** Supports the paid-system thesis without activating checkout.

## 15. Implementation slices

| Slice | Files/systems | Acceptance criteria |
|---|---|---|
| Public source API | `api/employer-benefits-source.ts` | Only verified public source rows returned |
| Search-result source cards | `NationalEmployerDirectory.tsx` | Source details and official link visible |
| Local source context | `employerBenefitsSourceContext.ts` | Versioned save/load/clear and unsafe URL rejection |
| Workspace continuity | `EmployerSourceContextBanner.tsx`, page | Attached source visible after handoff |
| Regression coverage | unit and Playwright tests | Search-to-workspace journey and storage pass |

## 16. Release gates

- [ ] CI, lint, type checks, build, and governance pass.
- [ ] Browser employer-benefits journey passes.
- [ ] Vercel preview is READY.
- [ ] Public API omits private and unreviewed submissions.
- [ ] Mobile and accessibility certification passes.
- [ ] PR diff and exact head are reviewed before merge.
- [ ] Production smoke validation passes after merge.

## 17. Executive closeout

To be completed after release.

## 18. Compounding closeout

- Reusable source-context storage helper created.
- Reusable source-aware handoff pattern created.
- Regression coverage added.
- Remaining process debt: employer lifecycle status and structured extraction queue remain separate future work.
