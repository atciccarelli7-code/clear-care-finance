# Medicare Coverage Decision System

Last verified: August 9, 2026

## Release identity and boundaries

- Product key: `medicare-coverage-decision-system`
- Public route: `/products/medicare-coverage-decision-system`
- Authenticated route: `/app/medicare-coverage-decision`
- Workspace schema: version 1, validated by `src/medicare/contracts.ts`
- Position: independent educational decision organization
- Commerce posture: disabled and fail-closed until the live-payment authorization checklist is separately approved
- Planning price: USD 29 one-time; this is not a live offer or approval to charge customers

CAF does not sell or enroll Medicare plans, rank insurers, accept insurer or broker compensation, sell leads, make eligibility determinations, promise coverage or savings, or imply CMS affiliation. The system compares coverage structures and user-entered attributes, not insurers. Enrollment happens through Medicare.gov or another independently chosen authorized channel.

The implementation is intentionally narrower than Medicare plan marketing: no compensation, insurer ordering, lead transfer, plan-specific recommendation, sales appointment, enrollment, or plan-benefit import. A disclaimer is not treated as permission to cross that boundary. Any future plan-specific commercial relationship requires separate qualified legal review against the then-current Medicare Communications and Marketing Guidelines and 42 CFR Parts 422 and 423.

## Product architecture

The public system is a route-level lazy-loaded React application. Free progress is stored in browser local storage under `caf:medicare-coverage-decision:v1`. The paid shell reuses the existing Supabase account, entitlement, and workspace APIs; it does not create another identity or persistence stack.

The eight stages are:

1. situation and enrollment timing;
2. Original Medicare versus Medicare Advantage architecture;
3. provider, hospital, specialist, travel, and geographic access;
4. prescription and pharmacy verification;
5. fixed, expected-use, and defensible higher-use cost exposure;
6. managed-care, authorization, post-acute, travel, and extra-benefit tradeoffs;
7. two-candidate verification workspace with bounded status, evidence-source category, and checked-date fields;
8. reviewable and printable Medicare Decision Brief.

The architecture engine in `src/lib/medicareCoverageDecision.ts` returns only one of four bounded investigation states: Original-first, Medicare Advantage-first, balanced, or verification-required. It never returns an insurer or enrollment recommendation. It withholds a direction when timing, high-impact drug verification, Medigap switching rights, or preference evidence is incomplete.

Cost calculations use only entered values. A zero must be entered explicitly when it is a verified applicable premium. The official annual drug estimate is treated as including the drug deductible; the calculator does not double count it. Original Medicare receives no invented annual cap. A Medicare Advantage higher-use scenario uses the medical maximum out-of-pocket plus the entered annual drug estimate and expressly states that this is not a combined medical-and-drug maximum.

## Existing Medicare asset disposition

| Existing asset | Disposition in the flagship |
|---|---|
| `/medicare-care-costs` | Preserved as the Medicare hub and search entry point; now routes deeper decisions into the flagship. |
| `/medicare-care-costs/turning-65` | Existing `buildTurning65Plan` logic is reused directly in stage 1; detailed route remains the supporting enrollment pathway. |
| `/tools/medicare-advantage-plan-helper` | Preserved as focused education and linked support after the architecture fork. |
| `/insurance/medicare-advantage` | Preserved as a standalone search answer; flagship becomes the deeper decision CTA. |
| `/insurance/medicare-advantage-vs-medigap` | Preserved for search intent and switching education; stage 2 and the Decision Brief enforce the Medigap-rights verification warning. |
| `/tools/medicare-plan-verification-checklist` | Adapted into the stage 7 status matrix and retained as a standalone checklist. |
| `/tools/medicare-medicaid-eligibility-check` | Retained as an educational pathway; stage 1/8 route possible limited-income users to Medicaid, MSP, Extra Help, and SHIP without deciding eligibility. |
| `/insurance/medication-coverage-checklist` | Retained and linked from stage 4; the flagship persists verification status rather than drug names. |
| Prior-authorization resources | Retained and linked from stage 6; authorization tolerance also influences the architecture investigation order. |
| Hospital-discharge Medicare resources | Retained and linked for SNF, rehab, home health, and post-acute verification. |
| Existing Medicare cost-risk estimator | Retained as the detailed supporting calculator; stage 5 adds candidate-specific user-entered scenarios without duplicating its annual reference logic. |
| Medicare source binders, fact-checks, chapter drafts, launch material, and source registries in `docs` | Reviewed as evidence and historical context. Controlling current behavior is backed by the dated official registry in `src/data/medicareCoverageSources.ts`. |

No useful Medicare URL was retired. The information architecture remains: search answer or focused tool → educational explanation → flagship when deeper organization is useful.

## Source and annual-freshness model

`src/data/medicareCoverageSources.ts` records the source title, authoritative URL, agency, effective year, last-verified date, next-review date, geography, supported rule, and controlling/explanatory classification. The first registry covers Medicare.gov comparison and Plan Finder, 2026 costs, working-past-65/HSA coordination, Medigap rights, assistance pathways, Social Security, SHIP, and 42 CFR Parts 422 and 423.

The Decision Brief prints the plan year and source dates. When the current date is past any source review horizon, it displays a warning and routes the user to the official source instead of silently presenting stale information as current.

Annual update procedure:

1. Review CMS, Medicare.gov, Social Security, Medicaid.gov, SHIP, and applicable state sources before annual plan-year content is used.
2. Update the registry metadata and time-sensitive centralized values; do not scatter anonymous figures through components.
3. Add the next supported plan year to the candidate schema only after its official materials exist.
4. Rerun persona, source-freshness, cost, browser, accessibility, print, and full repository tests.
5. Record the evidence date and controlling URL in the work packet and evidence ledger.
6. If review is incomplete, keep the stale warning and official handoff visible.

## Free and paid boundary

The public route provides the complete safety and education sequence without an account: timing orientation, coverage-architecture tradeoffs, provider/drug/cost warnings, current official handoffs, two candidate structures, verification matrix, uncertainty, and the printable Decision Brief. Existing calculators, checklists, and educational pages remain free.

The planned one-time paid entitlement adds convenience only: authenticated save/resume, cross-device continuity, durable candidate and cost scenarios, completion tracking, reusable verification states, and a retained Decision Brief. It does not unlock hidden safety warnings, official links, insurer ranking, plan enrollment, or sales assistance. Live purchase copy and checkout remain absent until separately authorized.

## Privacy and data model

Permitted workspace values are bounded decision categories, generic candidate slots, plan year and structure, user-entered cost figures, verification statuses, bounded official-evidence categories, checked dates, stage completion, and update timestamps. The evidence ledger deliberately does not accept free-form source URLs, plan names, provider names, or notes. The first release has no document uploads and does not request drug names, diagnoses, claim details, or beneficiary identifiers.

Never request or persist Social Security numbers, Medicare Beneficiary Identifiers, Medicare or insurance card numbers, member IDs, account numbers, payment cards outside Stripe, login credentials, claims, medical records, EOBs, diagnoses, or clinical histories. These values must not enter URLs, analytics, metadata, page titles, or logs. Browser forms use categories where details are unnecessary. A future upload or medication-name feature requires a separate privacy, security, storage, retention, deletion, logging, and legal approval before implementation.

The generic `workspaces` table is keyed by user and product, with a schema/version field. The API resolves the product from the owned database row, validates the product-specific Zod contract, checks the matching entitlement, and scopes every mutation by user and product. Existing RLS requires the authenticated user to own the row and hold an active or test entitlement for that same product.

## Multi-product commerce and entitlement lifecycle

`api/_lib/productRegistry.ts` is the server authority for product name, state, access type, expected currency/amount, public route, application route, workspace kind, authorized modules, and environment-specific Stripe price mapping. Browser price IDs, success URLs, cancel URLs, and entitlement targets are rejected. Stripe card data stays on hosted Checkout.

For a signed successful event, the webhook claims the event ID idempotently, retrieves the Checkout Session server-side, reads the product from trusted session metadata, resolves that product's server price, verifies exactly one expected line item and amount, validates user metadata and test/live mode, and grants only the purchased entitlement. Unknown products, altered metadata, wrong or mixed prices, amount mismatch, and mode mismatch fail closed.

Failure and refund events first identify the existing entitlement through its trusted Stripe payment intent, then apply the transition only to that user/product row. Partial refunds do not revoke access automatically. Duplicate and older events do not replay or reverse newer state. A Medicare event cannot change the Benefits entitlement, and vice versa.

Environment variables:

```text
STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM=<price_...>
STRIPE_PRICE_MEDICARE_COVERAGE_DECISION_SYSTEM=<price_...>
PREMIUM_CHECKOUT_ENABLED=false
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false
```

The remaining standard Supabase, Stripe secret/webhook, environment, authentication, persistence, and entitlement variables are documented in `.env.example` and `docs/premium-system-setup.md`. No secret uses a `VITE_` prefix.

## Analytics and accessibility

The public funnel uses controlled categorical events: `medicare_product_view`, `medicare_decision_start`, `medicare_stage_complete`, `medicare_architecture_result`, `medicare_verification_start`, `medicare_verification_complete`, `medicare_plan_finder_handoff`, `ship_handoff`, `medicare_decision_brief_complete`, `medicare_print`, and `medicare_paid_workspace_interest`. Generic commerce events remain product-key scoped. No provider, drug, plan name, note, cost, identifier, or free text is sent.

The interaction uses semantic labels, visible focus, 44-pixel minimum controls, a live progress announcement, `I'm not sure` options, no hover-only critical content, no color-only status, responsive comparison cards, reduced-motion-compatible scrolling, and print isolation. Certification covers keyboard flow, automated WCAG A/AA serious/critical violations, desktop Chromium, mobile WebKit as the Safari-engine proxy, overflow, and print media.

## Production-payment authorization checklist

Every item below must be checked and linked to evidence before `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=true`:

- [ ] Product behavior approved
- [ ] Exact paid value approved
- [ ] Exact price approved
- [ ] Purchase terms approved
- [ ] Refund policy approved
- [ ] Privacy policy updated
- [ ] Data-retention policy approved
- [ ] Support path working
- [ ] Accessibility certified
- [ ] Stripe test payment passed
- [ ] Webhook grant passed
- [ ] Asynchronous payment behavior handled where applicable
- [ ] Duplicate event passed
- [ ] Failed payment passed
- [ ] Refund passed
- [ ] Entitlement revocation passed
- [ ] Multi-product isolation passed
- [ ] Supabase production authentication passed
- [ ] RLS passed
- [ ] Checkout success and cancel handling passed
- [ ] Analytics contain no sensitive values
- [ ] Production secrets and configuration verified
- [ ] Production checkout authorization flag intentionally enabled

Unchecked items mean checkout remains disabled. Existing live Stripe credentials or a live Stripe Product do not count as approval.
