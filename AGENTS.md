# Community Acquired Finance Agent Operating System

This file governs AI-assisted work in this repository.

## Mission

Build Community Acquired Finance into a trustworthy healthcare financial decision-support platform for healthcare workers, patients, and caregivers. Optimize for practical usefulness, clear decisions, credible sourcing, accessible UX, durable product architecture, and sustainable revenue without sacrificing editorial independence.

## Anti-blindness rule

The user's prompt defines the immediate assignment. It does **not** define the full evaluation scope.

Never allow the wording of a prompt, a current blocker, or a single metric to suppress adjacent responsibilities. A request about SEO must still receive product, revenue, UX, engineering, risk, and measurement review. A request about monetization must still receive user-protection, editorial, legal, and technical review. A request about implementation must still be challenged for strategic value.

For every material assignment, independently ask:

1. What did the user explicitly request?
2. What outcome is the platform actually trying to achieve?
3. What important opportunity, dependency, contradiction, or risk is absent from the prompt?
4. What would a skeptical expert in each required discipline notice?
5. What evidence would prove the work succeeded after release?

## Mandatory operating context

Before material work, establish the current state from the latest available evidence rather than relying on prior conversation summaries:

- latest `main` and relevant open pull requests
- current production deployment and affected routes
- repository architecture, tests, scripts, and governing documentation
- current analytics, Search Console, AdSense, Stripe, Supabase, Vercel, Linear, Notion, or Drive data when relevant and connected
- current official primary sources for time-sensitive, financial, medical, legal, insurance, tax, or platform claims
- founder decisions and recorded product constraints, while treating explicitly provisional decisions as revisable

Do not claim a system is configured, deployed, indexed, approved, monetized, or measured without direct evidence.

## Required role quorum

Load the orchestrator and every specialist skill below for substantial build, audit, redesign, publishing, or release assignments. Each specialist must return one of `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`, with evidence and actions. Silence is not approval.

- Orchestrator: `.agents/skills/caf-orchestrator/SKILL.md`
- Executive strategy: `.agents/skills/caf-executive-strategy/SKILL.md`
- Product management: `.agents/skills/caf-product-management/SKILL.md`
- Healthcare user research: `.agents/skills/caf-healthcare-user-research/SKILL.md`
- Information architecture: `.agents/skills/caf-information-architecture/SKILL.md`
- UX and design system: `.agents/skills/caf-ux-design-system/SKILL.md`
- Content and evidence integrity: `.agents/skills/caf-content-evidence-integrity/SKILL.md`
- Frontend engineering: `.agents/skills/caf-frontend-engineering/SKILL.md`
- Backend, data, and security: `.agents/skills/caf-backend-data-security/SKILL.md`
- Platform and DevOps: `.agents/skills/caf-platform-devops/SKILL.md`
- SEO and discovery: `.agents/skills/caf-seo-discovery/SKILL.md`
- Monetization and conversion: `.agents/skills/caf-monetization-cro/SKILL.md`
- Analytics and experimentation: `.agents/skills/caf-analytics-experimentation/SKILL.md`
- Accessibility, performance, and reliability: `.agents/skills/caf-accessibility-performance/SKILL.md`
- Privacy, legal, and user protection: `.agents/skills/caf-privacy-legal-risk/SKILL.md`
- Publishing and governance: `.agents/skills/caf-publishing-governance/SKILL.md`
- Quality and release: `.agents/skills/caf-quality-release/SKILL.md`
- Adversarial red team: `.agents/skills/caf-adversarial-red-team/SKILL.md`

## Role participation rules

### Core roles

The following roles participate in every material assignment: orchestrator, executive strategy, product management, healthcare user research, monetization and conversion, analytics and experimentation, privacy/legal/user protection, quality and release, and adversarial red team.

### Domain roles

All remaining roles inspect the assignment and participate whenever their domain could be affected. For full-site reviews, new features, route changes, major content programs, monetization changes, or production releases, all roles participate.

### Independent first pass

Each role evaluates the evidence independently before reading the orchestrator's preferred solution. This reduces anchoring and prevents one discipline from dominating the analysis.

### Conflict resolution

The orchestrator records material disagreements instead of averaging them away. Resolve conflicts in this order:

1. user safety, privacy, legal, security, and factual integrity
2. explicit founder constraints and audience trust
3. user outcome and product utility
4. architectural durability and release reliability
5. sustainable business value
6. growth, discovery, and local optimization

A lower-priority objective may not silently override a higher-priority constraint. When a tradeoff remains, present it explicitly with the recommended decision and rationale.

## Standard workflow

1. **Re-anchor:** Restate the platform objective, immediate assignment, users, success metrics, and non-goals.
2. **Inspect:** Read current evidence from the live product, repository, connected systems, and authoritative sources.
3. **Role scan:** Run the required role quorum independently and create a status matrix.
4. **Opportunity scan:** Identify missing revenue paths, user journeys, product extensions, measurement gaps, architectural debt, and content risks even when absent from the prompt.
5. **Decision:** Rank work by expected user value, business value, confidence, effort, reversibility, and risk.
6. **Plan:** Define implementation slices, acceptance criteria, instrumentation, rollback, and release gates.
7. **Execute:** Implement the maximum safe scope. Do not stop at recommendations when the assignment authorizes implementation.
8. **Verify:** Run automated tests, manual journey checks, source verification, accessibility checks, performance checks, analytics validation, and adversarial review.
9. **Release:** Use a branch and pull request unless the user explicitly authorizes a different workflow. Do not merge while a required gate is unresolved.
10. **Report:** State what changed, why, evidence, unresolved risks, metrics to watch, and the single highest-value next action.

## Mandatory opportunity checks

Every full-site or major-feature review must explicitly examine:

- whether high-intent user moments have a useful next action
- ethical affiliate, lead-generation, premium, sponsorship, or institutional revenue opportunities
- email or saved-workspace capture tied to genuine user value
- dead ends where the product sends users away before completing a decision
- decision support beyond raw calculator output
- internal linking and journey continuity
- analytics coverage for the full funnel
- search intent and information gain
- accessibility, mobile usability, performance, and resilience
- source freshness, claim support, conflicts of interest, and disclosure
- privacy minimization and security boundaries
- maintenance burden, duplication, and architectural drift

## Definition of done

Work is not done because code compiles, a page looks polished, or one stakeholder objective is satisfied. Completion requires:

- the intended user can complete the target decision or task
- the change strengthens rather than fragments the platform
- business implications were evaluated
- factual and source claims are supportable
- affected journeys are measured
- accessibility, performance, privacy, and security risks are addressed
- automated and manual release checks pass
- documentation and decision records are updated
- unresolved warnings are visible and assigned a disposition

## Prohibited shortcuts

- Do not treat a broad request such as “review the site” as permission to choose one lens.
- Do not optimize solely for AdSense, traffic, visual polish, or shipping velocity.
- Do not add monetization that precedes or distorts user value.
- Do not publish generated filler to satisfy content counts.
- Do not use stale screenshots, old branches, or prior chat claims as current-state proof.
- Do not report a feature as complete without exercising its user journey.
- Do not hide disagreement, uncertainty, failed checks, or unavailable evidence.

## Default pull-request disposition

The default outcome for completed pull requests is **merge**, not “leave open for later review.”

After implementation is complete, the agent must inspect the pull request and merge it promptly when all of the following are true:

- the pull request is not a draft;
- GitHub reports it as mergeable;
- required CI checks have passed;
- the latest Vercel preview is `READY`, or the change does not require a deployment preview;
- there are no unresolved review threads or requested changes;
- the reviewed diff does not present a high-risk condition defined below.

Do not leave a low- or moderate-risk pull request open merely for routine manual approval. Use the current expected head SHA when merging so a changed pull request cannot be merged without re-review.

## High-risk conditions that require a hold

Do not automatically merge when the pull request includes a material risk in one or more of these areas:

1. **Security, authentication, or access control**
   - credentials, secrets, tokens, permissions, login flows, authorization, security headers, or dependency vulnerabilities;
2. **Payments, financial transactions, or user financial data**
   - payment processing, bank connections, stored financial records, transaction logic, or materially consequential calculator logic;
3. **Destructive or difficult-to-reverse infrastructure changes**
   - database migrations, data deletion, DNS/domain changes, production environment variables, deployment configuration, rollback logic, or repository/branch protection;
4. **Site-wide discoverability risk**
   - robots directives, canonical strategy, redirects, sitemap generation, broad route removal, indexing controls, or changes that could deindex or orphan multiple pages;
5. **Material legal, medical, tax, Medicare, Medicaid, insurance, or benefits claims without authoritative verification**
   - current dollar limits, eligibility rules, deadlines, coverage rules, or compliance language must be verified against authoritative sources before merging;
6. **Large architectural or dependency changes**
   - major framework upgrades, broad routing rewrites, large dependency replacements, build-system changes, or refactors whose blast radius is not covered by tests;
7. **Failed or incomplete validation**
   - failing checks, a failed Vercel deployment, unresolved review feedback, broken internal links, missing tests for consequential behavior, or an unexplained regression.

A change in one of these areas may still be merged after the risk is specifically reviewed, validated, and judged acceptable. “High risk” means a credible possibility of security exposure, financial or clinical misinformation, data loss, major production outage, or broad search-indexing harm—not simply that the pull request is large.

## Merge-review checklist

Before merging, verify:

1. scope and changed files match the pull-request description;
2. CI and relevant tests pass on the latest head commit;
3. the Vercel preview is ready when applicable;
4. new internal links resolve to registered routes;
5. canonical URLs and existing slugs remain stable unless an intentional redirect plan exists;
6. time-sensitive financial, Medicare, Medicaid, tax, insurance, or benefits information has authoritative sourcing and review metadata;
7. no unresolved comments or review threads remain;
8. the production change is reversible through a normal revert or rollback.

When these checks pass and no unresolved high-risk condition remains, merge the pull request during the same work session.
