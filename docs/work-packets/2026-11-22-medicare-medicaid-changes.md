# Medicare & Medicaid Changes hub — November 22, 2026

## Assignment and decision

Build one maintained reference for healthcare policy changes that affect patients, caregivers and care transitions. Base: refreshed `origin/main` at `155877ba0d5c3ae90ade6821538e64b4d7b3212a`; branch `feature/medicare-medicaid-changes`; isolated worktree `caf-policy-changes`. Preserve existing pages and do not release production while approval constraints are unresolved.

User explicitly requested this hub, overriding the older provisional experiment restricting content expansion. This is a publication utility with bounded updates, not a generic news production program, calculator or redesign. One new canonical route; no new article record, tools, paid enrollment, ad activation, tracking service, backend or account flow. All original article URLs remain. Current regenerated inventory: 81 articles and 193 canonical URLs; normalized base is 192 routes. Checked-in generated metadata had lagged four already-existing articles, which generation reconciles. Those four are not newly authored or published by this assignment.

Risk class: moderate (consequential coverage/eligibility claims); implementation status: draft, authorized scope, awaiting separate release verification. Success criterion: readers can find a scoped, dated, sourced next action and reach relevant existing reporting on a narrow screen. Business outcome remains a hypothesis until actual readership evidence exists.

## Direct inspection and inherited-decision challenge

- Inspected repository instructions, required operating records and role skills; independent specialist review performed by review agent. Main contains current November home-health/manuscript improvements; those are preserved.
- Opened public `/medicare-care-costs` and the existing January 2027 article. The latter currently relies partly on secondary media and generalizes Medicaid timing. It is already published/indexable and sensitive/ad-free.
- Kept the old slug, revised it into care-transition background and added a prominent hub handoff. The hub owns all evolving dates and status records. Medicare cost utility retains 2026 inputs rather than applying next year's figures early.
- Existing site design, route lazy loading, SEO registry, generated sitemap and advertising governance are adequate. Reused them; no new dependency.
- Default navigation classification was too weak for a healthcare eligibility reference; the new hub is explicitly sensitive and ad-free within existing hub governance. No advertising eligibility added.
- Owner-only AdSense approval/review status could not be confirmed. Repository script presence, a current public site and historical pending-review notes do not prove approval. No merge, production deployment or resubmission authorized by these observations.
- Initial GitHub connector issue-search results did not honor the requested PR filter consistently; they are not treated as a complete current PR inventory. Latest main was verified by direct Git fetch. Existing local design/editorial worktrees were left intact.
- Direct GitHub CLI open-PR check found #287, #286, #283, #250, #244 and #224; none owns a Medicare/Medicaid changes hub. Existing editorial/AdSense review PR #287 remains separate.

## Primary-source evidence, checked November 22

Exact URLs are maintained in `POLICY_SOURCES` and attached to each public entry. Sources were opened directly; no secondary policy-news source supplies a published claim.

| Claim | Original evidence | Classification and limits |
| --- | --- | --- |
| FY 2027 hospital/LTCH rates and later model dates | CMS July 31 fact sheet; Federal Register CMS-1849-F, FR 2026-15833, and September correction | PRIMARY-SOURCE. October payment applicability distinguished from January 2028 CJR-X; 2.3% base update is not every provider's total change. |
| FY 2027 SNF payment update | CMS July 29 final fact sheet; FR 2026-15562 | PRIMARY-SOURCE. 2.4% payment update; no extra covered days inferred. |
| October noncitizen funding limits | CMS SHO 26-001, April 8; NC detailed immigration page modified October 29 | PRIMARY-SOURCE. Federal matching versus NC eligibility separated; exceptions and emergency coverage retained. |
| Final 2027 A/B amounts | CMS November 17 release; Medicare.gov costs; November 19 federal notice cross-check | PRIMARY-SOURCE. $209.40 Part B monthly standard, $292 deductible; $1,776 Part A benefit-period deductible; $222 SNF daily days 21–100. Not universal MA copays. |
| Part D parameters | CMS April 6 rate announcement Table V-6; Medicare.gov drug-cost page | PRIMARY-SOURCE. 2027 $2,400 threshold/$700 defined-standard deductible versus 2026 $2,100/$615. Covered Part D drugs only. |
| Negotiated drugs and MA rule | CMS selected-drug list; April 2 CY 2027 final-rule fact sheet; Medicare.gov open enrollment | PRIMARY-SOURCE. Second 15-drug cycle January 2027; no guaranteed copay or newly covered indication. Codification versus earlier reform and plan-specific changes separated. |
| Medicaid six-month renewal | SMD 26-001 and NC changes page | PRIMARY-SOURCE. Expansion group and exceptions; renewals initiated on/after January 1. Not a universal all-member renewal rule. |
| Community engagement and optional transition | June interim final rule FR 2026-11094, reconciled with November 13 SMD 26-006 | PRIMARY-SOURCE. Optional CMS-approved transition through June 30; assessments/other eligibility requirements remain. Letter footnote acknowledges partial court vacatur; no unchanged medical-frailty test asserted. |
| NC rollout | Detailed NC work page modified October 13 and NC changes page; NCDHHS September toolkit press release checked for context | PRIMARY-SOURCE. NC still says January 1; no verified NC election/CMS approval of new transition option. Exclusions include Medicare qualification. |
| Retroactive coverage | November 18 CMS eligibility CIB slides 26–30 plus NC changes page | PRIMARY-SOURCE. Statutory one-/two-month limits for January applications, waivers and individual-month eligibility caveats. Intended implementing regulation is not described as finalized. |
| Home health and physician calendar | FR 2026-22750 HH final text; CMS November 4 PFS final-rule fact sheet and CMS-1848-F index | PRIMARY-SOURCE. January payment dates only; no claim every provision shares one date. |
| Later/adopted versus proposed | CMS CJR-X final-rule summary; Medicaid roadmap; November 20 CY 2028 proposal CMS-4214-P2 | PRIMARY-SOURCE. Illustrative roadmap is bounded; model and proposal dates are not current beneficiary entitlements. |
| Care-transition implications | CAF editorial analysis of the rules and existing founder reporting | SUPPORTED-INFERENCE. Labeled as interpretation/planning questions, not measured effects, invented experience or guaranteed individual outcomes. |

## Implementation map

- New typed records, statuses, scopes, stable IDs, source registry and search helper: `src/data/medicareMedicaidChanges.ts`.
- New responsive page, visible verification date, manual status labels, combined filters, empty state, anchors, archive, care-transition reading and correction path: `src/pages/MedicareMedicaidChangesPage.tsx`.
- Route/lazy loading: `src/App.tsx`; canonical discovery: `src/lib/seoRegistry.ts`; sensitivity/ad-free: `src/lib/contentGovernance.ts`. No eager hub preload added.
- Incoming links: cost hub and Medicare learning path. Existing article gets a visible above-content handoff in `ArticlePage.tsx`.
- Existing article corrected without duplicating the timeline: `policyChangeArticles.ts`; contextual voice note and review dates synchronized in both publisher review registries.
- Generated `public/sitemap.xml` and `runtimeSeoManifest.ts` reconcile current source records.
- New data safeguards and desktop/mobile journey test; editorial workflow/source desk in `docs/medicare-medicaid-changes-workflow.md`.

## Independent role quorum and executive accountability

Independent first pass ran before final implementation review. PASS below means design/implementation suitability, not permission to publish before checks. No role silence treated as approval.

| Roles | Status | Evidence, consequence, acceptance |
| --- | --- | --- |
| Orchestrator; executive strategy; product management | PASS | One source-checked hub serves the user task; one new route versus annual page proliferation. Acceptance: identify scope/date/action from each entry. |
| Context steward; capability router | WARN | Main/current sources refreshed; authenticated AdSense state unavailable. Do not infer release approval. |
| Healthcare user research; privacy/legal | PASS with gap | Population-specific entries, notice action, Medicare exclusion, no individualized determinations or record collection. NC transition gap remains visible. |
| Information architecture; SEO/discovery | PASS | Existing URL retained; hub linked from cost hub, learning path and prior article. One evergreen canonical. |
| UX/design; frontend; systems architecture | PASS subject to tests | Existing components; typed static records; no backend. Visible labels, status text, count and reset. |
| Backend/data/security | NOT IMPLICATED | No service, data model, credentials or server writes added. |
| Monetization/conversion | PASS | Permanent ad-free posture; useful next reading and official sources. No commercial enrollment conflict. |
| Analytics/experimentation | WARN | No new arbitrary-text analytics. Search state not stored, transmitted or put in URLs. Audience value unmeasured; no lift claim. |
| Platform/DevOps; accessibility/performance; quality/release | WARN pending evidence below | Require local build/browser checks; production/preview certification is separate. Preserve budget rather than raising it. |
| Content/evidence; publishing/governance | PASS with verification limits | Primary sources and per-entry reviews; manually controlled statuses; editorial checklist and archive. NC election not asserted. |
| Adversarial review | PASS after correction | CMS approval wording corrected; rendering groups cover all new dates; old article handoff prominent. Main failure case is a reader assuming universal termination; adjacent caveats prevent it. |
| Process improvement | PASS | Single record/source system, review triggers, stable anchors and historical preservation. |

Executive mapping: strategy/product to first row; operations to context/publishing/process; finance/revenue to bounded maintenance and monetization; technology to frontend/systems/backend/platform; data to analytics; discovery to IA/SEO; editorial to evidence/publishing; healthcare context/protection to research/privacy; accessibility/reliability to accessibility/platform; quality to release; independent challenge to adversarial; process to improvement.

## Value, risk, measurement and rollback

Value hypothesis: a reader can locate the applicable change and official next step without confusing payment and eligibility. Search/filter locally, follow existing reporting, or open controlling agency source. Audience and search lift are unverified. Existing consent-gated page measurement can observe the route after release; no search terms or medical/immigration details are tracked. No newsletter expansion or monetization experiment needed for acceptance.

Impact: normalized canonical inventory 192 → 193 (+0.52%); 81 → 81 articles; one existing article narrowed; no deleted URLs, ads, calculators or provider tables. Ongoing cost is human review of selected records; scope deliberately excludes exhaustive provider compliance and all-state policy surveillance.

Rollback: revert this branch's changes, including route/discovery links and generated files together. No migration or external state restoration needed. Preserve the old article's factual corrections if only the hub UI must be rolled back.

## Verification and remaining gates

Results recorded below as checks finish. Current known source limits: NC hold harmless election/approval; future rule corrections/state notices; individualized eligibility or medical-frailty interpretations. Current authenticated AdSense state and production preview certification unavailable. Do not equate those limits with a confirmed pending review or approval.

### Build and links

- Full production build: PASS, exit 0. Governance, content, API, ad-safety, bundle, prerender and search checks pass. 193 canonical/sitemap routes, 39 permanent redirects, zero search-readiness warnings. Existing voice-note/Browserslist warnings remain; esbuild prints cancellation during final server disposal after successful checks, exit 0.
- Main entry: 499.99 KiB against unchanged 500 KiB budget (normalized main baseline 499.53 KiB). Reduced added metadata/eager preload overhead instead of raising the budget. Headroom is very small; future shared-entry additions may require separate optimization.
- Targeted suite: 53/53 passed, including source/record safeguards, internal links checked against actual indexable routes, ad-routing and SEO. Official source links opened during research; no automated external monitoring promised.
- Affected lint: zero errors, one existing App fast-refresh warning.
- Broader suite: 773/774 passed before the final additional internal-link test. Sole failure: `documentIntakeFoundation.test.ts:161`, an LF-only assertion against a CRLF SQL fixture. Same failure reproduced on unchanged main; no migration/security code changed.
- Full application type check: 37 errors on main and candidate; normalized comparison introduces zero new errors. Existing ES2021 library, merged declaration, premium/test type issues remain. API type check in production build passes. This is not a clean full-typing claim.

### Mobile and desktop usability

- `npm run test:browser:policy`: 2/2 passed, exit 0, 15.6 seconds. Mobile 390px, desktop 1440px; additional 320px reflow check with no horizontal overflow.
- Tested visible date, combined scope/status/search, empty/reset, archive, keyboard focus, section anchors, canonical, ad-script absence and both incoming journeys. No page errors.
- Axe WCAG A/AA/2.1 AA scan within main: zero violations on both viewports. Inspected viewport screenshots; mobile title/date/links wrap cleanly. This is not full accessibility certification, separately measured 200% browser zoom, or production field-performance evidence.
- Standard webServer teardown stalled on Windows after tests passed. Added a bounded wrapper owning its ephemeral Vite server; clean exit now verified. No browser/production service installed.

### Business validation and release

Technical implementation PASS for affected behavior, WARN for inherited full-suite/type gaps. Business validation PASS for requested editorial fit and next actions; WARN for unmeasured audience value and recurring human review burden. Production release HOLD. Current AdSense state remains unconfirmed; a narrow Gmail check found no recent Google account notice, which does not establish account state. No approval, pending-review or live-release claim.

No >20% surface-change/inventory-reduction anomaly triggered. Reconciled prior articles instead of treating stale generated rows as absent work. Accepted tradeoff: curated care-transition relevance instead of exhaustive policy surveillance. No material role disagreement remains after correcting approval wording, future-date rendering and the old-article handoff.

Highest-value next editorial action: confirm NC election/CMS approval by December 11 and recheck before January 1. Confirm owner-dashboard release constraints and certify the draft head separately before merge. Stable project mission unchanged; ledgers updated with decision, evidence and outcomes.
