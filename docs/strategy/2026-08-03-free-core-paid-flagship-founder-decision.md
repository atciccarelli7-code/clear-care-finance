# Community Acquired Finance — Free Core and Single Paid Flagship Founder Decision

**Decision date:** August 3, 2026  
**Phase:** 1 — Define the business architecture  
**Status:** Founder-directed architecture decision; implementation remains subject to pull-request review and Phase 2 release gates  
**Commerce posture:** Checkout, paid access, entitlements, and active-purchase copy remain disabled

## Executive decision

Community Acquired Finance will operate as a **healthcare financial decision-support product company with a substantial free educational layer**.

CAF will not become a paywalled blog, a collection of unrelated digital downloads, a generic personal-finance publisher, or a storefront showing several unfinished paid products.

The selected architecture is:

> **Free decision preparation plus one paid decision-completion system.**

The single visible paid flagship is the **Healthcare Worker Benefits Decision System**. Its first commercial workflow is the **Open Enrollment Workspace**.

The existing technical product name and the first workflow are related as follows:

- **Flagship product:** Healthcare Worker Benefits Decision System
- **First paid workflow and market wedge:** Open Enrollment Workspace
- **Initial audience:** employed healthcare workers
- **Initial price hypothesis:** $29 one-time for bounded early-access validation
- **Launch model:** self-serve; no individualized financial management, meetings, document review service, or account-management promise

## Why this option was selected

CAF already owns three forms of reusable capital:

1. A large free library of source-backed articles, calculators, checklists, guides, and decision journeys.
2. A healthcare-worker domain advantage grounded in nursing experience and employer-benefit research.
3. A secure-by-default premium workspace foundation with authentication, entitlement, persistence, protected-content, print, and Stripe integration points that remain fail closed.

The employer packets studied from Atrium Health, UNC Health, ECU Health, Northwell Health, and Novant Health show that a real benefits decision is not a single deductible comparison. It can depend on employee class, FTE, geography, coverage tier, spouse rules, provider network, pharmacy channel, HSA or HRA funding, wellness incentives, retirement match and vesting, disability waiting periods, leave eligibility, payroll frequency, and source-document authority.

That complexity creates defensible product value when CAF coordinates the decision. It does not justify charging for basic definitions or a single transparent calculation.

## The business model

### Free layer — decision preparation

CAF will continue to provide meaningful public value through:

- Plain-English definitions and foundational education
- Official-source links and verification starting points
- Safety-critical deadlines and warnings
- General articles and topic guides
- Single-purpose calculators with transparent formulas
- Basic checklists and question prompts
- Decision routing through Start Here
- Representative examples and product previews
- Tools that help a user determine whether a coordinated workspace is relevant
- Patient, caregiver, medical-bill, Medicare, Medicaid, discharge, and clinical-safety resources

The free layer answers:

> What does this mean, what information do I need, and what is the next bounded step?

### Paid layer — decision completion

The paid workspace may provide:

- A current-benefits baseline
- Employer- and plan-specific structured entry
- Coordinated review across medical, pharmacy, HSA/HRA/FSA, retirement, disability, life, supplemental benefits, dependents, beneficiaries, and paycheck impact
- Multi-scenario comparisons
- Source-status tracking: verified, estimated, missing, conflicting, or requires official confirmation
- Personalized sequencing and verification questions
- Saved progress and cross-device resume after production validation
- A verification-ready election and decision brief
- Annual rollover and reuse for new hire, qualifying life event, spouse coordination, or the next open-enrollment cycle

The paid layer answers:

> Given my documents, elections, household constraints, and unresolved questions, how do I organize and finish this decision without losing track of what must be verified?

## Non-negotiable free-versus-paid boundary

CAF will not monetize by restricting access to:

- Government or controlling plan information
- Enrollment, appeal, discharge, billing, or coverage deadlines
- Basic financial literacy
- A result from a simple public calculator
- Patient-safety or medication-safety information
- Medicare, Medicaid, financial-assistance, or medical-bill starting points

CAF will not imply that purchase replaces an employer enrollment system, HR, a Summary Plan Description, an SBC, an insurer, a government agency, a licensed professional, or an official eligibility or coverage determination.

## Route and asset architecture

Every current canonical route and every known supplemental premium route is assigned one primary business role through `scripts/business-role-classification.mjs` and validated by `scripts/generate-business-role-inventory.mjs`.

The six governing roles are:

| Role | Purpose |
|---|---|
| `free_acquisition` | Attract and route the correct audience into CAF's public decision-preparation layer. |
| `free_trust_and_education` | Explain concepts, preserve public-interest resources, and demonstrate source, privacy, editorial, and nursing credibility. |
| `free_qualification` | Help a user identify the decision, required information, and whether the flagship workspace is relevant. |
| `paid_product_module_candidate` | Reusable logic or checklists that may be coordinated inside the paid workspace while the current bounded public version remains free. |
| `shared_product_infrastructure` | Account, entitlement, protected-content, persistence, and workspace routes that remain private and fail closed until later gates pass. |
| `archive_merge_redirect_remove_candidate` | Overlapping, legacy, or route-integrity assets requiring explicit content, search, redirect, and browser review before any destructive action. |

A `paid_product_module_candidate` label **does not authorize a paywall or removal**. It identifies reusable product logic. The standalone public route remains free unless a future founder decision explicitly changes that boundary.

## Flagship module candidates from the existing site

The following free assets contain logic that should inform the Open Enrollment Workspace:

- 403(b) Paycheck and Employer Match Calculator
- Benefits Change Detector
- Dependent Care FSA and Childcare Benefits Decision Guide
- Employer Benefits Action Plan
- Patient Cost Share Calculator
- Healthcare Worker Benefits Blueprint
- HSA vs FSA Decision Helper
- Open Enrollment Final Checklist
- Open Enrollment Paycheck Impact Calculator
- Open Enrollment True Cost Calculator
- Out-of-Pocket Maximum Estimator
- Supplemental Benefits Decision Helper

Their current single-purpose versions remain free. The paid value comes from coordinating them, preserving work, resolving source status, and producing one complete decision brief.

## Consolidation decisions

### Consolidate the Benefits Command Center into the flagship qualification path

The Benefits Command Center overlaps with the Benefits Blueprint, Employer Benefits Action Plan, open-enrollment hub, and paid-workspace concept. Phase 2 should stop presenting it as a parallel named system.

Useful logic and examples should be retained, but the public hierarchy should lead through:

1. Open Enrollment free education and tools
2. Healthcare Worker Benefits Decision System preview
3. Open Enrollment Workspace early-access validation

No redirect or deletion occurs in Phase 1.

### Preserve one canonical glossary

`/glossary` should remain the primary glossary. The article-form plain-English glossary is a merge or redirect candidate after current search equity and internal links are reviewed.

### Consolidate the hospital-discharge coverage hierarchy

The discharge coverage article, dedicated insurance guide, printable support, hospital guide, and Medicare checklist should be presented as one coherent free journey. URL changes require content and search review; Phase 1 authorizes the hierarchy decision, not automatic removal.

### Repair route-integrity anomalies before commercial reorganization

Routes recorded with `Page Not Found` metadata are classified as repair or consolidation candidates, not automatically deleted. Phase 2 must verify live rendering, SEO registry ownership, sitemap intent, internal links, and redirect requirements.

### Do not bulk-compress the educational library

Current search evidence is too sparse and dated to justify broad article deletion. Articles remain free and indexable under current governance unless a route-specific consolidation review establishes a better canonical destination.

## Information architecture approved for Phase 2 design

The public experience should make five concepts immediately distinguishable:

1. **Start Here** — one guided decision router
2. **Free Education and Tools** — articles, guides, calculators, checklists, glossary, and official sources
3. **Decision System** — one visible flagship and a clear preview of what paid coordination adds
4. **My Workspace** — private account and saved work only after the user intentionally enters the product path
5. **Trust and Methods** — RN role, sources, privacy, limitations, editorial policy, accessibility, and verification boundaries

The homepage should communicate two connected layers rather than two separate businesses:

- **Learn and prepare for free**
- **Use the decision system to coordinate and finish the decision**

The site must not display a catalog of future paid products. Job-offer, medical-bill, Medicare/caregiver, hospital-to-home, and student-loan products remain research or future options.

## Options considered

### Selected: free platform with one flagship paid system

This option concentrates product development, marketing, measurement, maintenance, and founder attention while preserving CAF's broad public mission.

### Rejected for now: several modular paid systems

Multiple paid systems would fragment traffic, product quality, support, trust, and measurement before the first offer is validated.

### Deferred: free consumer platform with employer or institutional licensing

Institutional licensing may become attractive later, particularly for benefits or patient-transition systems, but procurement, compliance, implementation, and buyer discovery would slow the initial consumer validation.

### Supplemental only: ads, affiliates, and optional products

Advertising and carefully governed commercial handoffs may support free content, but they do not define CAF's core value proposition. They remain subordinate to usefulness, independence, and product trust.

### Rejected: defer productization and continue accumulating content

The research base, employer packets, free tools, founder direction, and premium foundation are sufficient to begin architecture and demand validation. More unrelated content would not resolve willingness to pay.

## Economics and operating assumptions

The $29 amount is a validation hypothesis, not a proven market price.

Phase 1 does not claim:

- Product-market fit
- A validated conversion rate
- Customer acquisition cost
- Lifetime value
- Subscription retention
- Revenue or margin
- Reduced user error or decision time

The first product should remain one-time and self-serve during validation. A subscription is not justified until repeated annual or life-event use and willingness to renew are observed.

The product must minimize support burden through clear input guidance, examples, source status, fail-closed calculations, exportable output, and explicit escalation to official sources.

## Demand-validation gate

Before live checkout, CAF will run the bounded $29 early-access test already defined in AND-102:

- Minimum sample: 25 distinct consented qualified offer views within 28 days
- Continue: at least 3 saved price-qualified commitments and at least 10% view-to-commitment
- Stop or materially rework: 50 qualified views with zero saved commitments
- Below sample: inconclusive; extend the test or use direct founder outreach without pretending the market rejected or validated the offer

A generic CTA click is not a commitment. The visitor must see the price, product boundary, expected outcome, privacy posture, and unavailable-checkout status before joining the product-specific early-access list.

## Safety and technical controls

Until later phases explicitly pass:

- `PREMIUM_CHECKOUT_ENABLED=false`
- `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false`
- No public purchase control
- No active entitlement from a success URL
- No production protected module delivery
- No claim of cross-device persistence until validated
- No document upload or automated PDF ingestion in the first product version
- No collection of medical records, member IDs, claim numbers, account credentials, or confidential employer documents
- No financial inputs, employer details, plan details, or calculated results in analytics

## Phase 1 completion criteria

Phase 1 is complete when:

- The route-role classifier covers the current canonical public inventory and supplemental premium routes.
- The founder decision memo is approved.
- The Benefits Command Center and other consolidation candidates have explicit dispositions.
- The free-versus-paid boundary is reflected in the product master and research program.
- Linear AND-106 and AND-109 link to the durable artifacts.
- Checkout remains off.

## Phase 2 release gate

Phase 2 may reorganize public presentation only after review of the route-level classification and this decision memo. It must preserve canonical URLs by default, avoid broad article deletion, keep one visible paid flagship, and make no checkout or entitlement change.

## Evidence used

- Current 160-route canonical inventory and directional CTA release records
- CAF Product Architecture and Offer Research Program
- Deep Research Synthesis — Productizing CAF — August 3, 2026
- Founder Decision — Open Enrollment Workspace as First Paid Product — August 3, 2026
- Healthcare Worker Benefits Decision System product master and premium architecture
- Linear AND-102, AND-106, AND-109, AND-88, and AND-89
- Official 2026 employer benefits guides supplied for Atrium Health, UNC Health, ECU Health, Northwell Health, and Novant Health
- Existing premium, Supabase, Stripe, privacy, analytics, accessibility, and release-governance evidence

## Known evidence limits

The latest connected Search Console baseline ends July 20, 2026 and must not be described as current demand evidence. Route counts, technical quality, and founder conviction do not establish willingness to pay. The business decision authorizes focused validation, not live commerce.
