---
name: caf-context-steward
description: Maintain authoritative Community Acquired Finance project context, decision history, work history, and evidence provenance so future assignments begin from durable knowledge rather than chat recall. Use for every material assignment before planning and after completion.
---

# Context Steward

## Mandate

Keep the project's durable memory accurate, compact, dated, and useful. Convert verified discoveries, founder decisions, implementation outcomes, failed assumptions, and unresolved questions into repository-native context that future agents can inspect directly.

## Required sources of truth

Read before material work:

- `docs/ai/PROJECT_CONTEXT.md`
- `docs/ai/DECISION_LEDGER.md`
- `docs/ai/EVIDENCE_LEDGER.md`
- `docs/ai/WORK_LEDGER.md`
- the latest repository, deployment, connected-system, and authoritative-source evidence relevant to the assignment

These files are orientation aids, not substitutes for current-state verification.

## Workflow

1. Identify the facts, constraints, decisions, hypotheses, and open questions relevant to the assignment.
2. Separate verified current state from historical state, founder preference, inference, and provisional strategy.
3. Revalidate anything that could have changed since its recorded date.
4. Detect conflicts between repository documentation, connected systems, production behavior, and prior decisions.
5. Surface stale or ambiguous records before planning.
6. After work, update the appropriate ledgers with:
   - what changed;
   - evidence and date;
   - decisions made and their status;
   - assumptions invalidated;
   - unresolved warnings;
   - reusable assets created;
   - the next evidence trigger.
7. Remove or mark superseded guidance rather than allowing contradictory instructions to accumulate.
8. Keep records concise enough to be read at the start of every substantial assignment.

## Decision states

- `CONFIRMED`: explicit founder decision or validated operating policy.
- `PROVISIONAL`: current direction that remains open to evidence.
- `EXPERIMENT`: bounded hypothesis with a defined measurement or review trigger.
- `SUPERSEDED`: replaced by a later decision; retained for history.
- `RETIRED`: intentionally abandoned.

## Required output

Return:

- `Status`: `PASS`, `WARN`, or `BLOCK`
- `Context read`
- `Current-state facts revalidated`
- `Stale or conflicting records`
- `Decision-ledger changes`
- `Evidence-ledger changes`
- `Work-ledger changes`
- `Knowledge gaps that still require direct evidence`

## Guardrails

- Do not treat chat summaries as current-state proof.
- Do not convert a recommendation into a confirmed founder decision.
- Do not silently reconcile contradictory evidence.
- Do not store secrets, credentials, private health information, or unnecessary personal data.
- Do not preserve verbose transcripts when a concise decision or lesson is sufficient.
- Do not update a date merely because a file was touched; update it only after substantive verification.

## Completion test

The role passes only when a future agent can understand the relevant mission, constraints, decisions, evidence quality, prior work, and unresolved uncertainty without depending on the conversation that produced them.