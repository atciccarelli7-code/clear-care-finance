# Medicare Coverage Decision System + Multi-Product Commerce

Date: 2026-08-09

Branch: `agent/medicare-coverage-decision-system`

Base: `main` at `91595b13d49613fdaba6765e84e960d8208c8e1c`

Risk class: High; consequential Medicare education, authenticated persistence, product-specific entitlements, Stripe checkout/webhooks, refund isolation, database product configuration, accessibility, and public release

## 1. Assignment charter

- **Request:** Build, validate, release, and document a Medicare coverage decision system that coordinates CAF's current Medicare resources and converts the premium foundation into a reusable multi-product platform.
- **Public product:** `/products/medicare-coverage-decision-system`.
- **Authenticated product:** `/app/medicare-coverage-decision`.
- **User outcome:** Move from enrollment context through coverage architecture, providers, prescriptions, cost exposure, managed-care tradeoffs, verification, and a printable Medicare Decision Brief without insurer steering.
- **Business outcome:** Ship a useful free public flagship and certify the second-product commerce architecture in test mode where external configuration permits. Live payment remains unauthorized.
- **Constraints:** Official sources control; no eligibility decision; no insurer ranking; no enrollment or lead sale; no sensitive beneficiary identifier or clinical-history collection; browser-supplied prices and redirect targets are rejected; production checkout remains fail closed.
- **Non-goals:** Medicare.gov scraping, a shadow Plan Finder, plan enrollment, compensation-based ordering, brokerage, plan-specific recommendation, claims/document intake, automatic tax activation, or recurring billing.

## 2. Revalidated starting point

| Area | Evidence | Disposition |
|---|---|---|
| GitHub | `main` and production both resolve to `91595b13`; current worktree began clean | Work only on the feature branch and release by focused PR |
| Vercel | Latest production deployment is READY and serves the same commit as `main` | Preserve the production baseline; validate exact-head preview before merge |
| Medicare routes | Existing hub, Turning 65 pathway, MA helper, Original-vs-MA and MA-vs-Medigap education, verification checklist, medication checklist, assistance screener, prior-authorization guide, and discharge resources are live | Reuse logic and link resources as stage modules; preserve search-entry URLs |
| Medicare source system | Existing source binders, chapter drafts, fact checks, source registries, dated 2026 cost figures, and freshness notices exist | Add a flagship-specific source registry and annual review procedure; avoid magic-number duplication |
| Supabase | Generic `products`, `entitlements`, and `workspaces` tables already exist; RLS is enabled; no current user/workspace/entitlement rows; one Benefits product row exists | Reuse the account/data stack and add an idempotent second product row; keep state versioned and low-sensitivity |
| Premium API | Checkout accepts a product key and rejects browser price/URL inputs, but registry, price config, workspace APIs, access route, and webhook validation still assume one product | Generalize through server-authoritative product contracts and per-product state validation |
| Stripe | The connected account surface exposes live mode and one live Benefits product; no live Medicare write is authorized | Do not create or mutate live Stripe objects; prepare and test code, then use only an independently verified test/sandbox surface |
| Search evidence | No current Search Console connector/export is available in the active environment | Preserve established URLs and use a small coordinating product route; do not claim current query-volume evidence |

## 3. Current official evidence

| Decision area | Controlling or primary source | Implementation rule |
|---|---|---|
| Coverage architecture | Medicare.gov, “Compare Original Medicare & Medicare Advantage” | Compare access, cost, drug coverage, prior authorization, and travel; never imply one universal winner |
| Plan-specific comparison | Medicare Plan Finder | Hand off for current local plan and drug-cost comparison; no scraping or shadow database |
| Enrollment timing | Medicare.gov and Social Security | Reuse Turning 65 logic; surface unresolved employer, HSA, COBRA, retiree, and creditable-drug-coverage questions |
| Medigap timing | Medicare.gov Medigap Open Enrollment and guaranteed-issue materials | Block any assumed MA-to-Original equivalence until availability, underwriting, federal rights, and state protections are verified |
| Limited-income help | Medicare.gov Medicare Savings Programs and Extra Help; Medicaid.gov/state agency | Identify a pathway only; the state/SSA makes the determination |
| HMO/PPO/HMO-POS | Medicare.gov plan-type materials | Explain networks/referrals and require plan-document/provider confirmation |
| Marketing/TPMO boundary | 42 CFR 422.2260, 422.2274, 423.2260 and current CMS guidance page | No sponsor relationship, compensation, leads, enrollment, plan ranking, or insurer recommendation; retain independent educational organization only |

## 4. Asset disposition

| Existing asset | Disposition |
|---|---|
| Turning 65 pathway and `turning65Medicare` logic | Reuse directly in Stage 1; keep the standalone search-entry route |
| Medicare Advantage plan helper | Convert its tradeoff model into Stage 2/6 supporting education; keep its standalone route |
| Medicare Advantage comparison and MA-vs-Medigap pages | Link as deep education from architecture results; keep canonical URLs |
| Medicare Plan Verification Checklist and `medicarePlanVerification` logic | Extend its statuses for Stage 7 and reuse completion groups; keep the standalone checklist |
| Medication Coverage Checklist | Link from Stage 4 and reuse its verification sequence without storing drug names |
| Medicare/Medicaid eligibility screener | Link from the assistance branch; do not merge official eligibility claims into the flagship |
| Prior authorization and hospital-discharge tools | Link from managed-care/post-acute verification; keep standalone search acquisition |
| Medicare care-cost estimator | Extract/reuse calculation concepts in Stage 5; keep the full standalone estimator |
| Medicare docs/source binders | Preserve and update as editorial evidence; add a flagship architecture/source map rather than replace them |

## 5. Product and commerce decisions

- The public flagship contains the complete safety-critical decision sequence and works browser-locally without an account.
- The paid layer is organization, persistence, cross-device continuity, up to three candidate structures, reusable verification state, saved cost scenarios, and an updateable Decision Brief.
- The provisional commercial definition is one-time access at $29. It is not a production offer and does not authorize a live Checkout CTA.
- Candidate labels are generic. Provider/drug names, plan IDs, beneficiary IDs, diagnoses, and free-form clinical notes are not required or persisted.
- Product-specific workspaces share one table and one API family but are parsed by a server-selected schema. The browser cannot choose a schema or entitlement target independently of a registered product.
- Refund and failure events may transition only the entitlement whose trusted product, user, payment intent, and server price mapping agree.

## 6. Independent role matrix

Statuses reflect the merged public release, exact-head preview/production checks, cloud browser certification, and live Supabase policy check. External Stripe test-mode payment evidence remains unavailable, so commerce is not ready.

| Role | Status | Finding and required evidence |
|---|---|---|
| Orchestrator | PASS | One coordinating flagship and one platform refactor; no parallel Medicare guide |
| Context steward | PASS | Production, repository, connected services, current routes, docs, and source state revalidated |
| Capability router | PASS | GitHub, Vercel, Supabase, Stripe planning, browser validation, and official web research selected |
| Executive strategy | PASS | Coordinating decision product compounds existing Medicare investments |
| Product management | PASS | Eight stages, uncertainty states, free/paid boundary, and final brief are implemented and deterministic personas pass |
| Healthcare user research | PASS | Turning 65, working past 65, current enrollee, caregiver, limited-income, switching, and insufficient-information contexts pass deterministic persona tests |
| Information architecture | PASS | Canonical product/app routes, 182-route sitemap, and non-destructive Medicare entry links passed build and deployed checks |
| UX and design system | PASS | Progressive disclosure, mobile comparison, evidence ledger, and Decision Brief print passed Chromium and WebKit certification |
| Content and evidence integrity | PASS | Official-source registry, dated figures, stale behavior, assumptions, and unresolved questions are tested |
| Frontend engineering | PASS | Typed decision engine, low-sensitivity state, route splitting, and 706-test repository suite pass |
| Systems architecture | PASS | Product registry, per-product schema parser, API reuse, and third-product extensibility implemented |
| Backend, data, and security | PASS | Product-aware access/workspace/checkout/webhook/refund tests and live rolled-back RLS isolation matrix pass |
| Platform and DevOps | PASS | Exact-head preview and merge-SHA production deployments are ready; public/private cache and indexing headers passed direct checks |
| SEO and discovery | WARN | Current Search Console evidence unavailable; preserve URLs and avoid thin pages/cannibalization |
| Monetization and conversion | WARN | $29 is provisional; terms, refund policy, support, tax posture, and founder live authorization remain open |
| Analytics and experimentation | PASS | Only fixed event names and categorical properties are emitted; no names, plan facts, costs, or notes |
| Accessibility, performance, reliability | PASS | Keyboard, focus, axe, mobile/desktop, overflow, print, WebKit, Chromium, and bundle budgets passed cloud certification |
| Privacy, legal, user protection | PASS | Released behavior is educational-only, excludes TPMO/lead/enrollment activity, minimizes data, and preserves explicit uncertainty |
| Publishing and governance | PASS | PR #268 merged the public free release; paid commerce remains a separate, unapproved gate |
| Quality and release | PASS public / WARN commerce | Unit, integration, browser, security, preview, and production smoke passed; real Stripe test-mode event-chain evidence is unavailable |
| Adversarial red team | PASS | Manipulated products/prices/metadata, mixed mappings, processing grants, and false certainty fail closed in tests |
| Process improvement | PASS | Reusable product/workspace registries, source freshness workflow, and premium documentation are complete |

## 7. Executive accountability

| Perspective | Status | Finding |
|---|---|---|
| Strategy | PASS | A flagship coordinator is a stronger investment than additional disconnected Medicare content |
| Operations | WARN | Paid support, refunds, retention, and account deletion require owner-approved operating procedures |
| Finance | WARN | $29, refund terms, and tax posture are unapproved; no live revenue activation |
| Revenue | WARN | Only paid-workspace interest is measurable until the authorization checklist is approved |
| Product | PASS | Full workflow, verification workspace, and Decision Brief passed deployed browser certification |
| Technology | PASS | Multi-product registry, workspace, entitlement, webhook, failure, and refund isolation passed automated tests |
| Data and analytics | PASS | Analytics use controlled categorical values and strip query/fragment data; no provider, drug, plan, note, or identifier values are emitted |
| Discovery | WARN | No fresh Search Console dataset; preserve proven pages and measure product-entry behavior |
| Editorial integrity | PASS | Dated official sources and stale warnings are visible and covered by source-registry tests |
| Healthcare user context | PASS | All eight required personas produce bounded, explainable outcomes without insurer recommendations |
| Privacy/legal | PASS for released scope | Feature is narrowed to independent education; any future plan-specific marketing/brokerage expansion requires separate legal approval |
| Accessibility/reliability | PASS | Exact-head cloud browser, axe, mobile WebKit, desktop Chromium, print, and PDF checks passed |
| Quality/release | PASS public / WARN commerce | Exact-head preview, merge, production smoke, and rollback record passed; commerce still lacks an external Stripe test chain |
| Red team | PASS | Insurer steering, arbitrary price, cross-product grant/revoke, stale webhook, and fake completion cases fail closed |
| Process improvement | PASS | Registry/state-parser/source-ledger patterns and updated premium docs make a third product routine |

## 8. Inherited-policy challenge

| Inherited assumption | Challenge | Decision |
|---|---|---|
| One premium product and one Stripe price are enough | This creates cross-product entitlement and refund risk | Replace with a server-authoritative registry and per-product environment mapping |
| Product-specific workspace endpoints can hard-code the Benefits state | A second product would either collide or create a duplicate API stack | Select registered product and schema server-side; retain user/product ownership filters |
| A Medicare Advantage helper can lead the plan conversation | The architecture fork must come before MA subtype evaluation | Put Original Medicare + drug/supplemental coverage and Medicare Advantage at the first major fork |
| A disclaimer is sufficient protection | Regulated status turns on conduct and relationships, not a footer | Exclude compensation, leads, enrollment, plan ranking, and insurer-specific steering in product behavior |
| Current annual figures can remain anonymous component constants | Medicare figures and plan rules change | Centralize source metadata, effective year, review horizon, and stale behavior |

## 9. Quantified targets

| Measure | Baseline | Release target |
|---|---:|---:|
| Coordinating Medicare flagship routes | 0 | 1 public + 1 protected app |
| Major decision stages | 0 | 8 |
| Reused standalone Medicare assets | 0 coordinated | At least 8 mapped into stages/handoffs |
| Registered premium products | 1 | 2 |
| Browser-selectable Stripe prices | 0 | 0 |
| Persisted specific provider/drug names required | 0 | 0 |
| Required decision-engine personas | 0 | 8 |
| Public live payment CTAs | 0 | 0 until explicit authorization |
| Cross-product grant/refund isolation tests | 0 | At least 4 direct isolation cases plus negative metadata/price cases |

## 10. Release gates and status

- Technical validation and business/authorization validation are separate.
- Public product release can pass with live checkout disabled.
- A Stripe product object or available live credential is not business authorization.
- The only acceptable paid status without real signed test Checkout, webhook grant, duplicate delivery, refund, revocation, and cross-product proof is `NOT READY`.
- `TEST MODE READY` requires the external Stripe test-mode event chain, not mocks alone.
- `READY FOR LIVE AUTHORIZATION` additionally requires every owner/legal/support/privacy/accessibility/production-configuration item in the payment authorization checklist.
- `LIVE AND VERIFIED` is prohibited in this assignment unless the founder separately authorizes live commerce and a real production purchase/refund cycle is completed.

## 11. Rollback

- Keep `PREMIUM_CHECKOUT_ENABLED=false`, `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false`, and production Stripe mode disabled throughout public release.
- Roll back public behavior by reverting the focused PR; existing Medicare routes remain independent.
- Roll back the second product seed by marking the product `retired` or reverting the idempotent seed migration; do not delete entitlements or workspaces destructively.
- On any entitlement isolation defect, disable checkout and entitlement access before investigating.
- On any medical/legal/sourcing defect, remove or narrow the affected branch and route users to the current official source.

## 12. Final evidence

- PR: [#268](https://github.com/atciccarelli7-code/clear-care-finance/pull/268)
- Merge commit: [`469490226dbd0cd1699e5d80070ca347cd79fb74`](https://github.com/atciccarelli7-code/clear-care-finance/commit/469490226dbd0cd1699e5d80070ca347cd79fb74)
- Exact-head preview: `dpl_2aDLkE8iqfRQ3uTaprwMwQDuEZzN`, ready at commit `be307430431e708f2608822683aab243a0bda400`; product route returned 200 and no error/fatal runtime logs were present
- Production deployment: `dpl_CpBf86vGzCLJoUGbGraJF5Ar86N1`, ready at merge commit `469490226dbd0cd1699e5d80070ca347cd79fb74`
- Production smoke: public product returned 200 with the intended indexable canonical and no purchase/internal-release copy; protected app returned `private, no-store` and `noindex`; existing Benefits route returned 200; production Medicare checkout returned `503 checkout_disabled`; no error/fatal runtime logs were present
- Unit/integration evidence: CI [run 31290307408](https://github.com/atciccarelli7-code/clear-care-finance/actions/runs/31290307408) passed; 123 files / 706 tests pass; premium 12 files / 69 tests pass; API TypeScript, lint, full production build, 182 canonical routes, and the 496.82 KiB entry-budget gate pass
- Decision-journey evidence: [run 31290307410](https://github.com/atciccarelli7-code/clear-care-finance/actions/runs/31290307410) passed
- Browser/accessibility evidence: [run 31290307405](https://github.com/atciccarelli7-code/clear-care-finance/actions/runs/31290307405) passed desktop Chromium, mobile WebKit, Medicare and Benefits regressions, axe, overflow, print, and PDF checks; artifact `browser-certification-31290307405` has artifact id `9031215853` and SHA-256 `5c5be3800d737be112b39187b158a3d167c37869535bde17207224f138a1d49d`
- Supabase migration/RLS evidence: applied; two product rows; forced RLS confirmed; rolled-back cross-product two-user matrix passed
- Stripe test-mode product/price and signed event evidence: unavailable from the connected Stripe surface; no Stripe objects were changed
- Commerce status: `NOT READY` until an authorized Stripe test-mode surface completes Checkout, signed webhook grant, duplicate delivery, failure, full refund, revocation, and cross-product isolation with real events
