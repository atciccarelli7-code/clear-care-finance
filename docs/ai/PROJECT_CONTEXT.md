# Community Acquired Finance Project Context

Last substantively reviewed: 2026-09-02

## Purpose

This is the compact, durable orientation record for AI-assisted work. Read it before substantial assignments, then verify current state directly. This document records strategy and stable context; it is not proof of current deployment, indexing, approval, traffic, revenue, or integration status.

## Platform identity

Community Acquired Finance is an RN-led healthcare economics, healthcare finance, navigation, and healthcare-system publication for patients, caregivers, and healthcare workers, supported by practical decision tools.

Central promise:

> Explain the money, incentives, and operational machinery behind healthcare from inside the system, then help readers navigate the decisions that machinery creates.

Do not reduce CAF to personal finance for nurses, a medical-bill website, a generic content library, a SaaS dashboard, or an advertising vehicle.

## Audience architecture

Healthcare workers, patients, and caregivers are equally important at the brand and information-architecture level. Equal importance does not require simultaneous product development.

Current phased direction:

1. Turn the strongest founder healthcare-system observations into exceptional source-backed articles.
2. Earn search, direct, newsletter, and returning readership around distinctive editorial clusters.
3. Connect articles to the existing calculators, guides, and Decision Outcome systems only when those utilities advance the reader's job.
4. Consider advertising, affiliates, sponsorships, or premium products only after audience and demand evidence justify them.
5. Avoid scaled AI content, generic topic expansion, and new products built only because the infrastructure exists.

The homepage and primary navigation should lead with the publication while keeping patients, caregivers, and healthcare workers intentionally served and preserving direct access to tools.

The public article library uses five durable reader-facing editorial areas: Hospital economics & operations; Costs, bills & insurance; Care transitions & discharge; Medicare & Medicaid; and Healthcare worker money & benefits. These are presentation-level desks, not a requirement to rewrite every implementation category. The complete article disposition registry is maintained in `src/data/editorialLibraryAudit.ts` and `docs/editorial/2026-09-02-editorial-library-audit.md`.

## Product principles

- Complete decisions, not merely explain topics.
- Use calm, simple UX with educational depth.
- Pair short explanations with calculators, guided workflows, comparisons, checklists, and printable or saved decision outputs.
- Prefer healthcare-specific context and founder nursing insight over generic finance material.
- Make uncertainty, assumptions, plan-specific variation, and official verification steps visible.
- Reuse systems and primitives instead of creating disconnected pages.
- Protect users before optimizing conversion.
- Measure useful task completion, not only traffic or clicks.

## Business principles

- User value precedes monetization.
- Ethical monetization may include advertising, affiliate or referral relationships, premium decision systems, email capture tied to real value, sponsorships, and institutional offerings.
- High-intent calculator and decision moments must be reviewed for a useful next action; sending users away without completing the decision is a product and business defect.
- Commercial relationships must not distort recommendations, hide alternatives, or weaken disclosure.
- Advertising should be supplemental rather than the sole definition of the business.
- Durable trust, reusable product architecture, and enterprise value matter more than short-term pageview optimization.

## Editorial and evidence principles

- Use primary and authoritative sources for consequential or changing claims.
- Distinguish official facts, model calculations, founder experience, interpretation, and individualized advice.
- Do not generate filler to satisfy content volume.
- Current financial, healthcare, insurance, Medicare, Medicaid, tax, legal, and platform claims require fresh verification.
- Preserve correction paths, review metadata, and publication ownership.

## Technical context

Repository: `atciccarelli7-code/clear-care-finance`

Production domain: `https://communityacquiredfinance.com`

Current repository architecture includes:

- Vite
- React
- TypeScript
- React Router
- Tailwind and shadcn/Radix-style components
- Vercel deployment
- Vercel Functions under `api`
- Supabase authentication and PostgreSQL foundation
- Stripe checkout and entitlement foundation, governed by fail-closed release controls
- structured content and calculator data
- a typed Decision Outcome contract for high-intent tools, including typed portable assumptions and bounded recommendation states, now applied to private student-loan payoff/refinance, 403(b) contribution and employer formulas, and patient cost sharing
- Vitest, Playwright, accessibility, publication, SEO, premium, and release checks

Verify the latest package, routes, deployment, environment configuration, and production behavior before relying on this list.

## Operating-system context

The repository contains a mandatory multi-role agent system in `AGENTS.md` and `.agents/skills`. The prompt states the immediate assignment but never the complete evaluation scope.

Every substantial assignment must also use:

- `docs/ai/DECISION_LEDGER.md`
- `docs/ai/EVIDENCE_LEDGER.md`
- `docs/ai/WORK_LEDGER.md`
- `docs/ai/WORK_PACKET_TEMPLATE.md`
- `docs/ai/COMPOUNDING_LOOP.md`
- `docs/ai/ROLE_REGISTRY.json`

## Founder-decision handling

- Treat explicitly confirmed decisions as authoritative until changed.
- Preserve decisions described as fluid, provisional, experimental, or dependent on new evidence.
- Do not infer confirmation from implementation alone.
- When evidence supports changing a provisional direction, present the conflict and recommended change.
- Record all meaningful decisions in the decision ledger with a revisit trigger.

## Audience validation baseline

As of the September 10, 2026 review, use the September 7 Search Console workbook through September 5: 27 property clicks and 4,257 impressions. Six founder flagships have 2 clicks/322 page impressions. Audience demand remains inconclusive. CAF-D-025 and `docs/work-packets/2026-09-10-audience-validation.md` define the fixed cohort, measurement limitations and next cycle. Do not infer non-branded or retained readership from missing data.

## Current strategic uncertainties

These must be re-evaluated with current evidence rather than assumed:

- the highest-value next flagship product;
- which high-intent journeys deserve affiliate, premium, saved-report, or email actions;
- the appropriate role of AdSense relative to other revenue models;
- the sequence and scope of patient and caregiver expansion;
- whether premium checkout and account infrastructure should remain paused or advance;
- which routes deserve continued investment based on qualified demand and user value.

## Context-maintenance rule

Update this document only when stable platform context changes. Put individual choices in the decision ledger, current source status in the evidence ledger, and assignment outcomes in the work ledger. Remove or mark superseded statements instead of accumulating contradictions.
