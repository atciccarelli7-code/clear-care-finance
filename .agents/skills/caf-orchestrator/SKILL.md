---
name: caf-orchestrator
description: Coordinate every substantial Community Acquired Finance build, audit, redesign, publishing, monetization, or release assignment across the required specialist roles and compounding-memory system. Use whenever work spans multiple disciplines or prompt wording could create blind spots.
---

# Community Acquired Finance Orchestrator

## Purpose

Convert one founder prompt into a complete, evidence-backed, multi-disciplinary workstream. The prompt establishes the immediate objective; this skill establishes the full evaluation, execution, release, and learning scope.

## Non-negotiable principles

- Do not let one current concern dominate the entire analysis.
- Do not infer that an omitted discipline is unimportant.
- Require an explicit status from every registered role.
- Separate current-state facts, source-supported claims, founder decisions, assumptions, and recommendations.
- Prefer execution over recommendations when implementation is authorized and safe.
- Preserve user trust above local growth or revenue optimization.
- Do not depend on chat recall when repository-native context and connected evidence are available.
- Make completed work reduce the cost or risk of future work whenever practical.

## Required inputs

Read first:

- `AGENTS.md`
- `docs/ai/PROJECT_CONTEXT.md`
- `docs/ai/DECISION_LEDGER.md`
- `docs/ai/EVIDENCE_LEDGER.md`
- `docs/ai/WORK_LEDGER.md`
- `docs/ai/ROLE_REGISTRY.json`
- `docs/ai/WORK_PACKET_TEMPLATE.md`
- `docs/ai/COMPOUNDING_LOOP.md`

Then establish or retrieve:

- immediate founder request and desired outcome
- latest repository `main`, relevant pull requests, and deployment state
- affected production routes and user journeys
- current connected-system evidence and open work
- current authoritative sources for time-sensitive claims
- prior decisions, reusable assets, unresolved warnings, and evidence requiring revalidation

These records orient the work; they do not prove live status. Do not ask for information that connected systems or repository inspection can resolve.

## Workflow

### 1. Orient and create the work packet

Use `docs/ai/WORK_PACKET_TEMPLATE.md` to capture:

- platform north star
- immediate founder request
- primary audiences
- intended user and business outcomes
- success metrics
- constraints, non-goals, and risk class
- relevant decisions, prior work, and evidence gaps
- assumptions that remain provisional

### 2. Route capabilities

Activate the capability-router skill before broad research. Map each evidence, implementation, validation, publishing, and release need to the strongest available connector, tool, skill, source, or execution surface. Prefer direct connected evidence and reuse retrieved results.

### 3. Determine role participation

Load every role in `docs/ai/ROLE_REGISTRY.json`.

For full-site reviews, new products, route changes, monetization, publishing systems, or production releases, all roles participate fully. For narrower work, mandatory roles participate and every domain role performs a relevance check. `NOT IMPLICATED` requires a concrete reason.

### 4. Run independent first passes

Each role reviews the evidence before seeing the preferred implementation. Require:

- status: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- finding
- evidence
- consequence if ignored
- recommended action
- acceptance test

Do not merge findings prematurely.

### 5. Build the role matrix

Expose:

- agreements
- disagreements
- dependencies
- blockers
- opportunities omitted from the prompt
- evidence gaps
- irreversible decisions
- stale or conflicting project records

Explicitly call out prompt anchoring and any conflict between repository memory and direct current evidence.

### 6. Conduct the opportunity scan

Independently inspect for:

- incomplete user journeys and dead ends
- commercial-intent moments without an ethical next action
- productization beyond static education
- list-building, saved-workspace, and decision-brief opportunities tied to real value
- premium or institutional opportunities
- search and distribution gaps
- measurement blind spots
- duplicated or fragmented architecture
- maintenance and governance risks
- repeated manual work that should become a reusable product or operating primitive

This scan is mandatory even when the assignment is framed as SEO, engineering, design, content, or a narrow bug.

### 7. Prioritize

Score candidate work using:

- user value
- business value
- strategic fit
- evidence confidence
- effort
- reversibility
- operational burden
- safety and trust risk

Reject impressive work that does not materially advance the platform.

### 8. Produce the integrated plan

Define:

- implementation slices
- systems, tools, and data contracts
- source requirements
- instrumentation and decision thresholds
- tests and direct user journeys
- rollout and rollback
- documentation and ledger updates
- release gates

Resolve conflicts using the priority order in `AGENTS.md`. Record unresolved tradeoffs rather than hiding them.

### 9. Execute and coordinate

Maintain one coherent implementation. Prevent specialists from creating overlapping components, competing terminology, duplicate routes, inconsistent analytics, incompatible architecture, or parallel sources of truth.

After each material pass, reassess the whole affected experience and identify second-order effects.

### 10. Verify through the role quorum

Rerun affected roles against the actual implementation, latest pull-request head, preview, and production journey. A plan-level approval does not carry forward automatically to changed code or content.

No `BLOCK` may remain. Every `WARN` must be fixed, explicitly accepted with rationale, or assigned a recorded disposition.

### 11. Compound and close the record

Activate process improvement and context steward before completion. Determine:

- what had to be rediscovered;
- which founder explanation belongs in durable context;
- which decision, evidence record, or work outcome must be updated;
- which repeated check should become a script, test, template, query, component, or skill change;
- which stale or contradictory artifact should be retired;
- what evidence should trigger reassessment.

Implement the smallest safe durable improvement during the same assignment. Update the relevant ledgers and run `npm run ai:governance-check`.

### 12. Report

The final report must state:

- decision and rationale
- complete role-status summary
- what changed and what was deliberately not changed
- evidence and validation performed
- business and user implications
- compounding improvement created
- unresolved risks and unavailable evidence
- release state and rollback
- highest-value evidence-triggered next action

## Completion gate

The orchestration is complete only when:

- every registered role has a recorded disposition
- missing opportunities were independently examined
- conflicts were resolved transparently
- implementation and verification match the assignment charter
- direct current evidence supports reported state
- the release state is accurately reported
- project context and relevant ledgers are updated
- a meaningful lesson or repeated task produced a reusable improvement, or the rationale for no process change is recorded
- the AI governance check passes
- the result advances the platform, not merely the narrow wording of the prompt
