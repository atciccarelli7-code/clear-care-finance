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

Statuses reflect the local release candidate and live Supabase policy check. Exact-head preview and deployed browser evidence remain pending; external Stripe test-mode payment evidence is unavailable.

| Role | Status | Finding and required evidence |
|---|---|---|
| Orchestrator | PASS | One coordinating flagship and one platform refactor; no parallel Medicare guide |
| Context steward | PASS | Production, repository, connected services, current routes, docs, and source state revalidated |
| Capability router | PASS | GitHub, Vercel, Supabase, Stripe planning, browser validation, and official web research selected |
| Executive strategy | PASS | Coordinating decision product compounds existing Medicare investments |
| Product management | PASS | Eight stages, uncertainty states, free/paid boundary, and final brief are implemented and deterministic personas pass |
| Healthcare user research | PASS pending validation | Turning 65, working past 65, current enrollee, caregiver, limited-income, and switching contexts are represented |
| Information architecture | PASS pending validation | Canonical product and app routes plus non-destructive internal links require sitemap/canonical proof |
| UX and design system | PASS pending validation | Progressive disclosure, one-decision-at-a-time flow, mobile comparison, and print require deployed review |
| Content and evidence integrity | PASS | Official-source registry, dated figures, stale behavior, assumptions, and unresolved questions are tested |
| Frontend engineering | PASS | Typed decision engine, low-sensitivity state, route splitting, and 705-test repository suite pass |
| Systems architecture | PASS | Product registry, per-product schema parser, API reuse, and third-product extensibility implemented |
| Backend, data, and security | PASS | Product-aware access/workspace/checkout/webhook/refund tests and live rolled-back RLS isolation matrix pass |
| Platform and DevOps | PASS pending preview | Exact-head Vercel preview, function count, headers, environment isolation, and rollback required |
| SEO and discovery | WARN | Current Search Console evidence unavailable; preserve URLs and avoid thin pages/cannibalization |
| Monetization and conversion | WARN | $29 is provisional; terms, refund policy, support, tax posture, and founder live authorization remain open |
| Analytics and experimentation | PASS | Only fixed event names and categorical properties are emitted; no names, plan facts, costs, or notes |
| Accessibility, performance, reliability | PASS pending certification | WCAG 2.2 AA checks, mobile/desktop, 200% zoom, keyboard, axe, print, and bundle budgets required |
| Privacy, legal, user protection | PASS pending copy audit | Educational-only, no TPMO/lead/enrollment activity, minimal data, and explicit uncertainty required |
| Publishing and governance | PASS pending PR | Public free release and paid commerce authorization remain separate decisions |
| Quality and release | PASS pending exact-head preview | Full unit/integration/browser/security/payment matrix and production smoke required |
| Adversarial red team | PASS | Manipulated products/prices/metadata, mixed mappings, processing grants, and false certainty fail closed in tests |
| Process improvement | PASS | Reusable product/workspace registries, source freshness workflow, and premium documentation are complete |

## 7. Executive accountability

| Perspective | Status | Finding |
|---|---|---|
| Strategy | PASS | A flagship coordinator is a stronger investment than additional disconnected Medicare content |
| Operations | WARN | Paid support, refunds, retention, and account deletion require owner-approved operating procedures |
| Finance | WARN | $29, refund terms, and tax posture are unapproved; no live revenue activation |
| Revenue | WARN | Only paid-workspace interest is measurable until the authorization checklist is approved |
| Product | PASS pending validation | Full workflow and brief must work before public promotion |
| Technology | PASS pending gates | Multi-product isolation is the release-critical architecture claim |
| Data and analytics | PASS pending inspection | No sensitive analytics values or URLs/logs |
| Discovery | WARN | No fresh Search Console dataset; preserve proven pages and measure product-entry behavior |
| Editorial integrity | PASS pending source tests | Dated official sources and stale warnings must be visible |
| Healthcare user context | PASS pending personas | All eight required personas must produce bounded, explainable outcomes |
| Privacy/legal | PASS pending final review | Feature narrowed to independent education; unresolved state-specific brokerage questions documented, not guessed |
| Accessibility/reliability | PASS pending preview | Automated and manual deployed evidence required |
| Quality/release | PASS pending preview/production | Public release requires exact-head preview, merge, production smoke, and rollback record |
| Red team | PASS pending tests | No insurer steering, arbitrary price, cross-product grant/revoke, or fake completion |
| Process improvement | PASS pending docs | Registry/state-parser pattern should make a third product routine |

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

## 12. Final evidence placeholders

- PR: pending
- Merge commit: pending
- Preview deployment: pending
- Production deployment: pending
- Unit/integration evidence: TypeScript and lint pass; 123 files / 705 tests pass; premium 12 files / 68 tests pass; full production build passes with 182 canonical routes and 496.67 KiB entry chunk
- Browser/accessibility evidence: automated spec committed; local execution blocked because the environment cannot download the pinned browser archive; deployed cloud-browser certification pending
- Supabase migration/RLS evidence: applied; two product rows; forced RLS confirmed; rolled-back cross-product two-user matrix passed
- Stripe test-mode product/price and signed event evidence: pending
- Commerce status: `NOT READY` until an authorized Stripe test-mode surface completes the signed event matrix
