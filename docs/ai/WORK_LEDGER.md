# Community Acquired Finance Work Ledger

This ledger records the outcome and reusable learning from material assignments. It is not a backlog and should not become a transcript.

## Entry template

### `[WORK ID] — [Outcome]`

- **Date:**
- **Assignment:**
- **Starting evidence:**
- **Decision:**
- **Implementation:**
- **Validation:**
- **Release state:**
- **User and business impact expected:**
- **What was learned:**
- **Assumption invalidated:**
- **Reusable asset created:**
- **Process improvement implemented:**
- **Unresolved warning:**
- **Evidence or event that should trigger reassessment:**
- **Links:**

## Completed work

### CAF-W-001 — Multi-role agent operating system

- **Date:** 2026-07-30
- **Assignment:** Prevent founder prompt wording or a single current blocker from narrowing future website evaluations.
- **Starting evidence:** Prior reviews emphasized search quality and AdSense readiness while failing to elevate high-intent monetization architecture until an external critique exposed it.
- **Decision:** Require an orchestrator and independent specialist roles to inspect strategy, product, healthcare users, architecture, UX, engineering, evidence, growth, monetization, analytics, risk, publishing, release, and adversarial concerns.
- **Implementation:** Added `AGENTS.md`, one orchestrator skill, 18 specialist skills, a unified master prompt, and a role-quorum document.
- **Validation:** GitHub PR #229 was reviewed and merged; only governance and skill files changed.
- **Release state:** Merged to `main` in commit `4422189036657f43e6391ceebeeb7cc4ee07cb66`.
- **User and business impact expected:** Broader, more intentional site work with fewer single-lens blind spots.
- **What was learned:** Independent role review needs durable memory and automated enforcement or future agents may still rediscover context and omit required operating steps.
- **Assumption invalidated:** A sufficiently detailed one-time master prompt is enough to preserve quality across future sessions.
- **Reusable asset created:** Repository-native role system.
- **Process improvement implemented:** Role-status contract and anti-blindness opportunity scan.
- **Unresolved warning:** Documentation alone does not prove compliance.
- **Evidence or event that should trigger reassessment:** A future task omits a role, repeats prior discovery, or produces a material miss despite the quorum.
- **Links:** PR #229.

### CAF-W-002 — Compounding context and workflow controls

- **Date:** 2026-07-30
- **Assignment:** Implement every safe improvement available now that can make future Community Acquired Finance work faster, more informed, and less dependent on founder prompting or chat memory.
- **Starting evidence:** The role system could review assignments but lacked a persistent context file, decision ledger, evidence map, work history, capability-routing role, learning role, work-packet contract, and automated drift check.
- **Decision:** Add a repository-native compounding loop and enforce it through machine-readable role registration and CI.
- **Implementation:** Added context, capability-routing, and process-improvement skills; project context; decision, evidence, and work ledgers; work-packet and compounding-loop templates; role registry; governance check; and pull-request controls.
- **Validation:** Pending branch checks and pull-request review at the time of this entry.
- **Release state:** In progress on `codex/caf-compounding-operating-system`.
- **User and business impact expected:** Less repeated explanation, faster current-state orientation, more reliable tool use, explicit evidence provenance, earlier detection of conflicts, and systematic conversion of every assignment into reusable assets or checks.
- **What was learned:** Compounding requires not merely more roles but a closed loop: retrieve context, decide, execute, validate, record, automate, and re-enter the next task with better priors.
- **Assumption invalidated:** Versioned role instructions alone create sufficient project memory.
- **Reusable asset created:** Full compounding operating system.
- **Process improvement implemented:** This assignment is the initial implementation.
- **Unresolved warning:** The system still depends on agents reading repository instructions; CI can detect structural drift but not every reasoning failure.
- **Evidence or event that should trigger reassessment:** Repeated founder context requests, stale ledgers, governance check failures, or a future miss not represented in the role and workflow system.
- **Links:** To be updated with pull request and merge commit.

## Maintenance rules

- Add entries only for material work that changes the product, operating system, evidence base, or strategic direction.
- Update an in-progress entry when validation and release finish; do not create a duplicate completion entry.
- Record failures and reversals, not only successes.
- Convert repeated warnings into an owner, test, skill update, or explicit accepted risk.
- Keep the ledger concise; detailed implementation remains in pull requests and linked documentation.