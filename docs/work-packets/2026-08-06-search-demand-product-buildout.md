# Search Demand Product Buildout — Product 1 work packet

Date: 2026-08-06

Branch: `agent/search-demand-product-buildout`

Base and production SHA: `bb654ae8602836b94189d2a35386235b3b198486`

Starting production deployment: `dpl_HnTQMNScPYxEXpw4JS2kWmQneApr` (`READY`)

Pull request: #265

Exact-head preview: `dpl_CSoUuuBveHZThkMAagPTSBFrQ9oH` (`READY`)

Risk class: High-content-integrity and moderate product risk; no PHI persistence, payment, authentication, upload, or database change

## Assignment charter and phased disposition

The program requests six integrated decision products in priority order. The release slice completes Product 1 end to end and builds reusable patterns already present in the repository—focused multi-step questions, progress, review, fixed-choice analytics, result sections, source records, print/download, route-level SEO, and local privacy boundaries. It does not publish promotional shells for Products 2–6.

| Product | Disposition in this release |
|---|---|
| 1. Hospital Financial Assistance | Complete release candidate |
| 2. 2027 Open Enrollment Decision Center | Existing Benefits Decision System and tools preserved; 2027 consolidation not claimed complete |
| 3. Claim Denial & Prior Authorization Organizer | Existing prior-authorization guide preserved; full organizer not claimed complete |
| 4. Shift Pay Calculator | Existing pay tools preserved; full requested shift decision model not claimed complete |
| 5. Hospital-to-Rehab Coverage Path | Existing discharge/Medicare resources preserved; full requested path not claimed complete |
| 6. 403(b) Match & Vesting Center | Existing 403(b) cluster preserved; full consolidation not claimed complete |

## Acceptance criteria

- Existing indexed tool route becomes a functional eight-step guided finder.
- No names, dates of birth, diagnoses, record/account/SSN fields, exact balances, uploads, or sensitive analytics.
- At least one national hub, one complete North Carolina hub, eight major North Carolina systems, and ten outside systems using current official sources.
- Every policy route contains meaningful unique source-backed data, missing-field disclosure, retrieval date, limitations, and official links.
- Result language never declares qualification; it handles free/discount/hardship/verify/insufficient/stale/excluded-provider conditions.
- 2026 HHS math supports contiguous states/DC, Alaska, Hawaii, and additional-person increments.
- Copy, plain-text download, print/save as PDF, internal actions, source links, analytics, canonical metadata, structured data, sitemap, navigation, and mobile/keyboard use work.
- Unit/component/full-repository/build/search/bundle/browser/preview/production gates pass before release.

## Evidence and consolidation

- Current repository, main branch, routes, articles, tools, design patterns, analytics, sitemap/robots, structured data, existing medical-bill/benefits/Medicare/retirement assets, open PRs/issues, connected project records, production deployment, and Supabase posture were revalidated.
- Current official sources include HHS/ASPE, IRS Section 501(r), NCDHHS, and each hospital/health system's own policy/application pages.
- Search evidence and intent ownership are recorded in `docs/audits/2026-08-06-hospital-financial-assistance-query-page-map.md`.
- Data, source, freshness, privacy, and maintenance rules are recorded in `docs/hospital-financial-assistance-data-governance.md`.
- Analytics and baseline limitations are recorded in `docs/hospital-financial-assistance-measurement-spec.md`.
- Supabase is not justified for the initial release because the product does not need accounts or persisted answers.

## Role quorum

| Role | Status | Disposition |
|---|---|---|
| Orchestrator | PASS | Product 1 was completed before broader expansion; unfinished products are not advertised. |
| Context steward | PASS | Current code, production, ledgers, connected records, source files, and conflicting open PRs were reconciled. |
| Capability router | PASS | Repository, GitHub, Vercel, Search/Drive evidence, official web sources, and browser validation cover the release; no new vendor is needed. |
| Executive strategy | PASS | A high-stakes action product creates more defensible utility than another broad content batch. |
| Product management | PASS | The primary journey ends in a reviewable, printable, source-backed action plan. |
| Healthcare user research | PASS | Expected/current/overdue/collections stages, insured ambiguity, caregiver use, unknowns, and separate-provider risk are represented. |
| Information architecture | PASS | Broad hub, state hub, system records, preserved tool route, and distinct supporting intents have explicit ownership. |
| UX and design system | PASS | Existing calm CAF components, one-question steps, progress, review, back/continue, clear errors, and mobile-first layout are used. |
| Content and evidence integrity | PASS | Missing policy terms remain missing; every material threshold is tied to a primary source and date. |
| Frontend engineering | PASS | Calculation/domain logic is separate from presentation; route data is lazy-loaded and typed. |
| Systems architecture | PASS | Browser-temporary state and existing fixed My Plan action avoid unnecessary persistence and new platform coupling. |
| Backend, data, and security | PASS | No new API/schema/RLS surface; sensitive entries are neither requested nor transmitted. |
| Platform and DevOps | PASS | Generated routes, redirects, prerender, bundle budget, and deployment gates are preserved. |
| SEO and discovery | PASS | One canonical hub/tool/state/system architecture resolves alias duplication and adds only meaningful source-backed pages. |
| Monetization and conversion | PASS | No paid, affiliate, or obstructive advertising path was introduced; useful action remains primary. |
| Analytics and experimentation | PASS | Events answer discovery/completion/action questions with fixed non-sensitive identifiers only. |
| Accessibility, performance, and reliability | PASS pending browser CI | Deployed desktop keyboard completion, focus transfer, overflow, metadata, source-link, print-control, and runtime smoke pass; repository mobile/axe browser CI remains a release gate. |
| Privacy, legal, and user protection | PASS | No definitive eligibility, PHI collection, medical advice, legal advice, tax advice, or ignored-deadline instruction. |
| Publishing and governance | PASS | Programmatic safeguards are enforced by a reviewed launch set and source-review process. |
| Quality and release | PASS pending merge | Local full-suite/build gates and exact-head READY preview verification pass; repository CI, merge, production deployment, and production smoke remain required. |
| Adversarial red team | PASS | Tests cover free, discount, above-range, missing, insured ambiguity, boundaries, Alaska/Hawaii, stale/malformed, excluded provider, and unsupported hospital states. |
| Process improvement | PASS | Reusable policy schema, FPG engine, bounded result builder, source/SEO index alignment test, query map, measurement spec, and maintenance process are durable. |

## Quantified change

| Measure | Before | Release candidate |
|---|---:|---:|
| Guided finder questions | Short checklist-style screen | 8 focused steps including review |
| Reviewed hospital/system records | 0 structured launch records | 18 |
| North Carolina systems | 0 structured launch records | 8 plus statewide hub |
| Canonical routes | 161 | 181 |
| Permanent redirects | 38 | 39 |
| Database migrations | 0 | 0 |
| Sensitive/answer analytics fields | 0 intended | 0 intended |
| Entry bundle | Existing budget below 500 KiB | 499.83 KiB |

## Release gates and rollback

- Local gates: TypeScript, lint, 119 test files / 679 tests, production build, governance, privacy/publication, bundle, prerender, structured metadata, sitemap, and search readiness.
- Deployed gates: exact-head checks, READY preview, desktop/mobile browser flow, keyboard, axe, print, source/application links, alias redirect, analytics payload key inspection, merge, production deployment, and smoke.
- Rollback: revert the focused merge commit. The earlier tool implementation and supporting medical-bill routes remain in Git history; no database rollback is required.
- Stop condition: any wrong threshold, source mismatch, definitive eligibility language, sensitive payload, broken print/source path, accessibility blocker, or failing release gate.

## Open evidence limits

- Search Console exports are lagged and small; live query/page joining and URL Inspection were unavailable and are not inferred.
- Current analytics implementation can be verified, but post-release funnel counts do not exist yet.
- Hospital source links can change after retrieval; annual and event-driven human review remains required.
- `graph 2.html` from the supplied attachments did not materialize in the workspace and was not used.
