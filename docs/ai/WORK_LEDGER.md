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
- **Decision:** Add a repository-native compounding loop and enforce it through machine-readable role registration, pull-request controls, and build/test validation.
- **Implementation:** Added context-steward, capability-router, and process-improvement skills; project context; decision, evidence, and work ledgers; work-packet and compounding-loop templates; a 22-role registry; governance check; pull-request template; and orchestration rules requiring preflight and closeout.
- **Validation:** The new governance check ran inside the Vercel build and passed. Existing publication, content freshness, patient-guide contracts, AdSense governance, unit tests, production build, bundle budget, prerender, comprehensive route, search-readiness, and decision-journey checks passed on the pull-request branch before merge; the latest browser and CI runs remain the authoritative release evidence in PR #230.
- **Release state:** Delivered through PR #230 from `codex/caf-compounding-operating-system`; GitHub and Vercel are authoritative for the final merge SHA and deployment state.
- **User and business impact expected:** Less repeated explanation, faster current-state orientation, more reliable tool use, explicit evidence provenance, earlier detection of conflicts, and systematic conversion of every assignment into reusable assets or checks.
- **What was learned:** Compounding requires a closed loop—retrieve context, verify, route capabilities, decide, execute, validate, record, automate, and re-enter the next task with better priors. The rollout itself caught two defects before merge: an accidental package reconstruction omitted existing build dependencies, and the initial governance check assumed one exact completion-heading convention. Both were corrected, and the final package diff was reduced to the intended script additions only.
- **Assumption invalidated:** Versioned role instructions alone create sufficient project memory, and documentation-only changes are immune from implementation regression.
- **Reusable asset created:** Full compounding operating system with machine-readable role governance and reusable work packet.
- **Process improvement implemented:** AI governance now runs in both `npm test` and `npm run build`; pull requests require evidence, role, anti-blindness, validation, and compounding closeout.
- **Unresolved warning:** The system still depends on agents following repository instructions. CI can detect structural drift but cannot prove the quality of every future reasoning pass; failures or repeated founder explanation must trigger process-improvement review.
- **Evidence or event that should trigger reassessment:** Repeated founder context requests, stale or contradictory ledgers, governance check failures, material misses despite the role quorum, or process overhead that exceeds the failures it prevents.
- **Links:** PR #230.

## Maintenance rules

- Add entries only for material work that changes the product, operating system, evidence base, or strategic direction.
- Update an in-progress entry when validation and release finish; do not create a duplicate completion entry.
- Record failures and reversals, not only successes.
- Convert repeated warnings into an owner, test, skill update, or explicit accepted risk.
- Keep the ledger concise; detailed implementation remains in pull requests and linked documentation.