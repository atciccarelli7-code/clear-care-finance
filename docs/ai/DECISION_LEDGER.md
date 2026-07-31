# Community Acquired Finance Decision Ledger

This ledger records material strategic, product, technical, editorial, commercial, and operating decisions. It prevents prior choices from becoming invisible assumptions.

## Status definitions

- `CONFIRMED`: explicit founder decision or validated operating policy.
- `PROVISIONAL`: current direction that remains open to evidence.
- `EXPERIMENT`: bounded hypothesis with a measurement or review trigger.
- `SUPERSEDED`: replaced by a later decision; retained for history.
- `RETIRED`: intentionally abandoned.

## Decision template

| Field | Required content |
|---|---|
| ID | Stable identifier such as `CAF-D-001` |
| Date | Date decided or last substantively revised |
| Status | One status above |
| Decision | Clear statement of what is being decided |
| Rationale | Why this direction was chosen |
| Evidence | Direct source, founder confirmation, or validated implementation evidence |
| Consequences | What this enables, prevents, or deprioritizes |
| Revisit trigger | Evidence, date, milestone, or failure condition that requires reconsideration |
| Supersedes | Prior decision IDs, if any |

## Active decisions

### CAF-D-001 — Platform identity

- **Date:** 2026-07-29
- **Status:** CONFIRMED
- **Decision:** Community Acquired Finance is a healthcare financial decision-support platform for healthcare workers, patients, and caregivers.
- **Rationale:** This identity integrates healthcare employment, healthcare consumption, illness, insurance, discharge, caregiving, and long-term planning without reducing the brand to a narrow content niche.
- **Evidence:** Explicit founder direction recorded in project context.
- **Consequences:** New work must strengthen decision support and healthcare specificity rather than expand generic finance content.
- **Revisit trigger:** Explicit founder revision or strong evidence that the identity materially prevents serving the intended audiences.
- **Supersedes:** Earlier narrow descriptions such as personal finance for nurses or a medical-bill website.

### CAF-D-002 — Audience importance and phased execution

- **Date:** 2026-07-29
- **Status:** CONFIRMED
- **Decision:** Healthcare workers, patients, and caregivers are equally important at the brand and information-architecture level, while product development proceeds in focused phases.
- **Rationale:** The brand must intentionally serve all audiences without diluting execution across several incomplete experiences.
- **Evidence:** Explicit founder direction recorded in project context.
- **Consequences:** Navigation should represent all audiences; delivery should prioritize one complete flagship before broad parallel expansion.
- **Revisit trigger:** User evidence shows the audience model is confusing or a different sequence produces materially higher mission and business value.
- **Supersedes:** None.

### CAF-D-003 — User value before monetization

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** Monetization must follow useful interpretation and decision support, not precede or distort it.
- **Rationale:** Trust is the primary asset; ethical revenue can improve sustainability only when the user receives independent value first.
- **Evidence:** Repository mission, founder business rules, and multi-role operating policy.
- **Consequences:** Affiliate, advertising, email, premium, and sponsorship actions require neutral alternatives, disclosures, and complete upstream guidance.
- **Revisit trigger:** Never for the principle; implementation details may change with evidence.
- **Supersedes:** None.

### CAF-D-004 — Mandatory multi-role review

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** A founder prompt defines the immediate assignment but may not limit the total evaluation scope; substantial work requires the registered role quorum.
- **Rationale:** Broad and narrow prompts can anchor work on one objective and hide product, business, technical, user, or risk implications.
- **Evidence:** PR #229 and explicit founder instruction.
- **Consequences:** Every required role returns `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`; silence is not approval.
- **Revisit trigger:** The system creates measurable friction without preventing blind spots, in which case role participation may be refined but not silently removed.
- **Supersedes:** Informal single-lens site reviews.

### CAF-D-005 — Decision architecture for high-intent journeys

- **Date:** 2026-07-30
- **Status:** PROVISIONAL
- **Decision:** High-intent calculators and tools should be evaluated as decision journeys that can include interpretation, recommended actions, cautions, saved or printable output, value-aligned lead capture, and appropriate commercial resources.
- **Rationale:** A raw result followed by an external government link may leave both user value and sustainable revenue unrealized.
- **Evidence:** External critique, subsequent multi-role analysis, and founder concern about the missed opportunity.
- **Consequences:** Future reviews must inspect high-intent dead ends and prioritize completing the decision before adding monetization.
- **Revisit trigger:** Actual user behavior, conversion quality, trust signals, or compliance review shows a different sequence performs better.
- **Supersedes:** Calculator-result-only assumptions.

### CAF-D-006 — Repository-native compounding memory

- **Date:** 2026-07-30
- **Status:** CONFIRMED
- **Decision:** Stable project context, decisions, evidence provenance, work outcomes, and process lessons must be stored in version-controlled repository artifacts and validated automatically.
- **Rationale:** Chat context is incomplete, transient, and unsuitable as the sole operating memory for consequential product work.
- **Evidence:** Explicit founder instruction to compound from current work and improve future efficiency.
- **Consequences:** Material assignments must read and update the project context, ledgers, work packet, role registry, and compounding controls.
- **Revisit trigger:** A more reliable authoritative knowledge system replaces the repository artifacts and provides equivalent version history, access, validation, and agent readability.
- **Supersedes:** Dependence on prior conversation summaries.

### CAF-D-007 — Typed Decision Outcome pilot

- **Date:** 2026-07-31
- **Status:** EXPERIMENT
- **Decision:** High-intent tools may adopt a typed Decision Outcome contract that keeps pure calculation, deterministic recommendation, verification, portable output, analytics, and optional commercial eligibility as separate layers. The Private Student Loan Payoff Calculator is the first complete pilot.
- **Rationale:** The prior calculator ended at reactive numbers and could hide a worse refinance quote as `$0 saved`. A reusable contract prevents future tools from terminating without interpretation, caution, a prioritized action, verification, and a neutral path.
- **Evidence:** Founder assignment; current `main` and production inspection; pure-function and browser validation in the pilot pull request; CAF-E-003.
- **Consequences:** The private-loan recommendation engine cannot import partner configuration; federal, mixed, and uncertain debt fails into verification; My Plan stores only a fixed action; typed financial assumptions remain local, user-controlled copy/print data; portable output must preserve those assumptions; `Accelerate repayment` requires measurable modeled time and interest benefit; a quote must be payoff-safe before it can influence a recommendation; partner activation requires verified, current, disclosed configuration.
- **Revisit trigger:** User testing shows the outcome layer overwhelms or confuses users; valid-result completion materially falls; federal/mixed/uncertain commercial exposure is nonzero; recommendation error is found; official sources change; or a second tool cannot adopt the contract without calculator-specific duplication.
- **Supersedes:** None. Implements and tests CAF-D-005 as a bounded pilot.

## Updating the ledger

- Add a new entry for every material decision.
- Do not rewrite history when a decision changes; mark the old entry `SUPERSEDED` and link the replacement.
- Do not label a model recommendation `CONFIRMED` without founder confirmation or an established operating policy.
- Keep implementation details in the work ledger unless they establish a durable rule.
- Record uncertainty and revisit triggers explicitly.
