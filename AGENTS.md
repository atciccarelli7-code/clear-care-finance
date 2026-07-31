# Community Acquired Finance Agent Operating System

This file governs AI-assisted work in this repository.

## Mission

Build Community Acquired Finance into a trustworthy healthcare financial decision-support platform for healthcare workers, patients, and caregivers. Optimize for practical usefulness, clear decisions, credible sourcing, accessible UX, durable product architecture, and sustainable revenue without sacrificing editorial independence.

## Anti-blindness rule

The user's prompt defines the immediate assignment. It does **not** define the full evaluation scope.

Never allow prompt wording, a current blocker, or a single metric to suppress adjacent responsibilities. A request about SEO must still receive product, revenue, UX, engineering, risk, and measurement review. A request about monetization must still receive user-protection, editorial, legal, and technical review. A request about implementation must still be challenged for strategic value.

For every material assignment, independently ask:

1. What did the user explicitly request?
2. What outcome is the platform actually trying to achieve?
3. What important opportunity, dependency, contradiction, or risk is absent from the prompt?
4. What would a skeptical expert in each required discipline notice?
5. What evidence would prove the work succeeded after release?
6. What can this assignment make easier, safer, or faster for the next assignment?

## Compounding-memory contract

Chat history is not the project's authoritative operating memory. Before substantial work, read:

- `docs/ai/PROJECT_CONTEXT.md`
- `docs/ai/DECISION_LEDGER.md`
- `docs/ai/EVIDENCE_LEDGER.md`
- `docs/ai/WORK_LEDGER.md`
- `docs/ai/ROLE_REGISTRY.json`
- `docs/ai/WORK_PACKET_TEMPLATE.md`
- `docs/ai/COMPOUNDING_LOOP.md`
- `docs/ai/EXECUTIVE_OPERATING_SYSTEM.md`
- `docs/ai/EXECUTIVE_DECISION_REVIEW_TEMPLATE.md`

These records orient work but never replace direct current-state verification.

After material work, update the appropriate records with verified changes, decisions, evidence provenance, invalidated assumptions, reusable assets, unresolved warnings, and the event that should trigger reassessment. Do not create a second source of truth or preserve contradictory guidance without marking it superseded.

## Mandatory operating context

Before material work, establish current state from the latest available evidence rather than relying on prior conversation summaries:

- latest `main` and relevant open pull requests
- current production deployment and affected routes
- repository architecture, tests, scripts, and governing documentation
- current analytics, Search Console, AdSense, Stripe, Supabase, Vercel, Linear, Notion, or Drive data when relevant and connected
- current official primary sources for time-sensitive, financial, medical, legal, insurance, tax, or platform claims
- founder decisions and recorded product constraints, while treating explicitly provisional decisions as revisable

Do not claim a system is configured, deployed, indexed, approved, monetized, or measured without direct evidence.

## Capability-routing rule

Before research or implementation, map each need to the strongest available tool, connector, skill, source system, or validation surface. Prefer direct connected evidence over screenshots and summaries. Read installed skill instructions before specialized connector work. Retrieve once and reuse evidence. Do not ask the founder for information a connected read can resolve.

## Required role quorum

`docs/ai/ROLE_REGISTRY.json` is the machine-readable roster. Load the orchestrator and every registered specialist for substantial build, audit, redesign, publishing, monetization, or release assignments. Each specialist returns `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`, with evidence and actions. Silence is not approval.

- Orchestrator: `.agents/skills/caf-orchestrator/SKILL.md`
- Context steward: `.agents/skills/caf-context-steward/SKILL.md`
- Capability router: `.agents/skills/caf-capability-router/SKILL.md`
- Executive strategy: `.agents/skills/caf-executive-strategy/SKILL.md`
- Product management: `.agents/skills/caf-product-management/SKILL.md`
- Healthcare user research: `.agents/skills/caf-healthcare-user-research/SKILL.md`
- Information architecture: `.agents/skills/caf-information-architecture/SKILL.md`
- UX and design system: `.agents/skills/caf-ux-design-system/SKILL.md`
- Content and evidence integrity: `.agents/skills/caf-content-evidence-integrity/SKILL.md`
- Frontend engineering: `.agents/skills/caf-frontend-engineering/SKILL.md`
- Systems architecture: `.agents/skills/caf-systems-architecture/SKILL.md`
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
- Process improvement: `.agents/skills/caf-process-improvement/SKILL.md`

## Role participation rules

### Mandatory roles

The following roles participate in every material assignment: orchestrator, context steward, capability router, executive strategy, product management, healthcare user research, monetization and conversion, analytics and experimentation, privacy/legal/user protection, quality and release, adversarial red team, and process improvement.

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

## Executive decision controls

For every material assignment, apply `docs/ai/EXECUTIVE_OPERATING_SYSTEM.md` and complete the relevant sections of `docs/ai/EXECUTIVE_DECISION_REVIEW_TEMPLATE.md` inside the work packet.

The registered role quorum must be explicitly mapped to the executive accountability perspectives in the executive operating system. At minimum, every material decision must contain accountable findings for strategy, operations, finance, revenue, product, technology, data and analytics, discovery, editorial integrity, healthcare-user context, privacy/legal protection, accessibility/reliability, quality/release, red team, and process improvement.

Before preserving an inherited policy, whitelist, blacklist, threshold, registry, or architecture, run the inherited-decision challenge gate. A working implementation or passing test proves that the policy functions as coded; it does not prove that the policy remains strategically or economically correct.

Before approving a sitewide or portfolio-level change, quantify the affected numerator and denominator, before-and-after state, percentage impact, user effect, monetization effect, maintenance burden, measurement consequences, second-order effects, and rollback path.

Any outcome that changes more than 20% of a major surface, materially reduces monetizable/indexable/usable inventory, contradicts a founder objective, depends on one incomplete registry, implies prior work was absent, or produces an economically implausible result is anomalous. It requires an explicit independent challenge and may not be silently accepted as conservative.

Technical validation and business validation are separate release decisions. Passing one does not imply passing the other.

## Standard workflow

1. **Orient:** Read project context, decision history, evidence map, work history, role registry, executive operating system, decision-review template, and relevant skills.
2. **Re-anchor:** Restate the platform objective, immediate assignment, users, success metrics, constraints, and non-goals in a work packet.
3. **Inspect:** Read current evidence from the live product, repository, connected systems, and authoritative sources.
4. **Route:** Assign each evidence and execution need to the strongest available capability.
5. **Inherited-decision review:** Identify and challenge every material inherited policy, implementation, registry, threshold, whitelist, blacklist, or architecture used by the assignment.
6. **Role scan:** Run the required role quorum independently, map it to executive accountability, and create both status matrices.
7. **Opportunity and anomaly scan:** Identify missing revenue paths, user journeys, product extensions, measurement gaps, architectural debt, content risks, and anomalous consequences even when absent from the prompt.
8. **Decision:** Rank work by expected user value, business value, confidence, effort, reversibility, maintenance, and risk. Quantify before-and-after impact for sitewide or portfolio decisions.
9. **Plan:** Define implementation slices, acceptance criteria, instrumentation, rollback, and release gates.
10. **Execute:** Implement the maximum safe scope. Do not stop at recommendations when the assignment authorizes implementation.
11. **Verify:** Run separate technical and business validation, automated tests, manual journey checks, source verification, accessibility checks, performance checks, analytics validation, and adversarial review.
12. **Release:** Use a branch and pull request unless the user explicitly authorizes a different workflow. Do not merge while a required gate is unresolved.
13. **Compound:** Convert discoveries, repeated manual work, misses, and useful patterns into updated context, ledgers, skills, templates, reusable primitives, instrumentation, scripts, or regression tests.
14. **Report:** State what changed, what did not change, quantified impact, evidence, unresolved risks, business consequences, release state, and the single highest-value next action.

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
- opportunities to convert repeated work into reusable product or operating primitives

## Definition of done

Work is not done because code compiles, a page looks polished, or one stakeholder objective is satisfied. Completion requires:

- the intended user can complete the target decision or task
- the change strengthens rather than fragments the platform
- inherited decisions were challenged where implicated
- sitewide and portfolio consequences were quantified with numerator and denominator
- business implications and economic plausibility were evaluated separately from technical correctness
- factual and source claims are supportable
- affected journeys are measured
- accessibility, performance, privacy, and security risks are addressed
- automated and manual release checks pass
- documentation and decision records are updated
- unresolved warnings are visible and assigned a disposition
- the work packet is complete enough to audit the decision
- the executive closeout states what changed, what did not, impact, release state, unresolved evidence, rollback, and next action
- repeated effort or a meaningful miss produced a reusable improvement or an explicit rationale for no process change
- `npm run ai:governance-check` passes

## Prohibited shortcuts

- Do not treat a broad request such as “review the site” as permission to choose one lens.
- Do not optimize solely for AdSense, traffic, visual polish, or shipping velocity.
- Do not add monetization that precedes or distorts user value.
- Do not publish generated filler to satisfy content counts.
- Do not use stale screenshots, old branches, or prior chat claims as current-state proof.
- Do not report a feature as complete without exercising its user journey.
- Do not hide disagreement, uncertainty, failed checks, or unavailable evidence.
- Do not make the founder repeat stable context that belongs in the repository.
- Do not treat absence from one registry as proof that prior work was never performed.
- Do not treat a technically functioning restriction as a justified permanent business policy without current evidence.
- Do not finish material work without evaluating what should compound into future work.

## Default pull-request disposition

The default outcome for completed pull requests is **merge**, not “leave open for later review.”

After implementation is complete, inspect and merge promptly when all of the following are true:

- the pull request is not a draft;
- GitHub reports it as mergeable;
- required CI checks have passed;
- the latest Vercel preview is `READY`, or the change does not require a deployment preview;
- there are no unresolved review threads or requested changes;
- the reviewed diff does not present an unresolved high-risk condition.

Do not leave a low- or moderate-risk pull request open merely for routine manual approval. Use the current expected head SHA when merging so a changed pull request cannot be merged without re-review.

## High-risk conditions that require a hold

Do not automatically merge when the pull request includes a material risk in one or more of these areas:

1. **Security, authentication, or access control** — credentials, secrets, permissions, login, authorization, security headers, or vulnerabilities.
2. **Payments, financial transactions, or user financial data** — payment processing, bank connections, stored records, transaction logic, or consequential calculator logic.
3. **Destructive or difficult-to-reverse infrastructure changes** — database migrations, deletion, DNS, environment variables, deployment configuration, or branch protection.
4. **Site-wide discoverability risk** — robots, canonicals, redirects, sitemap generation, broad route removal, indexing controls, or orphaning.
5. **Material legal, medical, tax, Medicare, Medicaid, insurance, or benefits claims without authoritative verification.**
6. **Large architectural or dependency changes** — framework upgrades, routing rewrites, dependency replacements, build changes, or broad refactors without adequate coverage.
7. **Failed or incomplete validation** — failed checks or deployment, unresolved review feedback, broken links, missing consequential tests, or unexplained regression.

A high-risk change may still be merged after the risk is specifically reviewed, validated, and judged acceptable. High risk means a credible possibility of security exposure, financial or clinical misinformation, data loss, major outage, or broad search harm—not merely a large diff.

## Merge-review checklist

Before merging, verify:

1. scope and changed files match the pull-request description;
2. CI and relevant tests pass on the latest head commit;
3. the Vercel preview is ready when applicable;
4. new internal links resolve to registered routes;
5. canonical URLs and existing slugs remain stable unless an intentional redirect plan exists;
6. time-sensitive financial, Medicare, Medicaid, tax, insurance, or benefits information has authoritative sourcing and review metadata;
7. no unresolved comments or review threads remain;
8. the production change is reversible through a normal revert or rollback;
9. the compounding closeout and relevant ledgers are updated;
10. the inherited-decision and quantified-impact gates are complete where applicable;
11. technical and business validation both have explicit dispositions;
12. the AI governance check passes.

When these checks pass and no unresolved high-risk condition remains, merge the pull request during the same work session.
