# Community Acquired Finance Role Quorum

This document is the human-readable map for `docs/ai/ROLE_REGISTRY.json` and the repository skills registered in `AGENTS.md`.

## Why the quorum exists

Broad prompts create anchoring risk. “Review SEO,” “fix AdSense,” “improve UI,” and “build the next feature” can each be completed competently while missing a more important product, revenue, user, technical, or risk issue.

A role may conclude that it is not implicated, but it must make that conclusion explicitly. The context, capability, and process-improvement roles also ensure that each assignment starts with better evidence and leaves reusable improvements behind.

## Roles and primary questions

| Role | Primary question | Typical block condition |
|---|---|---|
| Orchestrator | Did the team inspect the whole problem, reconcile roles, and complete the loop? | Missing role, hidden conflict, prompt anchoring, or incomplete closeout |
| Context steward | Does the team understand current verified context, decisions, evidence quality, and prior work? | Material reliance on stale, conflicting, or chat-only context |
| Capability router | Is each need assigned to the strongest available tool, connector, skill, or source? | A material claim or action lacks an authoritative evidence or execution path |
| Executive strategy | Does this create durable strategic value now? | Work is misaligned, duplicative, or has clearly superior opportunity cost |
| Product management | Can the target user complete a meaningful decision? | The experience ends at content or a number without a complete journey |
| Healthcare user research | Does this fit real healthcare-worker, patient, or caregiver conditions? | Generic assumptions make the experience impractical or misleading |
| Information architecture | Does this asset have a clear place, canonical purpose, and pathway? | Duplication, orphaning, route conflict, or terminology confusion |
| UX and design system | Can a first-time user understand and complete the task? | Material usability, state, mobile, or commercial-presentation failure |
| Content and evidence integrity | Are claims, calculations, and explanations supportable and current? | Unsupported consequential claim, calculation error, or unsafe simplification |
| Frontend engineering | Is browser behavior correct, maintainable, typed, and tested? | Broken journey, unsafe client logic, route regression, or untested calculation |
| Systems architecture | Do the product, content, data, commercial, and platform systems form one coherent architecture? | Conflicting sources of truth, unsafe coupling, or unmaintainable design |
| Backend, data, and security | Are trust boundaries and data handling default-deny and minimized? | Authorization flaw, unnecessary sensitive data, insecure secret, or unsafe migration |
| Platform and DevOps | Can this deploy, operate, fail, and recover safely? | Broken build, undocumented configuration, unsafe infrastructure, or no rollback |
| SEO and discovery | Does the route deserve and technically support qualified discovery? | Cannibalization, indexing risk, absent information gain, or misleading snippet |
| Monetization and conversion | Is user intent completed and ethically monetized where appropriate? | Commercial influence distorts advice or a major high-intent dead end is ignored |
| Analytics and experimentation | Can success and failure be measured accurately? | No meaningful outcome metric, invalid event contract, or misleading evidence |
| Accessibility, performance, and reliability | Can users across abilities and conditions complete the journey? | Keyboard, assistive-tech, mobile, performance, or degraded-state failure |
| Privacy, legal, and user protection | Are data, claims, and commercial relationships fair and defensible? | Material privacy, advice, disclosure, consumer-protection, or IP risk |
| Publishing and governance | Is the asset correctly reviewed, owned, published, and maintainable? | False freshness or review state, missing provenance, or broken lifecycle |
| Quality and release | Is there independent evidence the latest implementation is releasable? | Failed gate, untested core journey, unresolved regression, or stale-head review |
| Adversarial red team | What did everyone else normalize or fail to challenge? | Strong countercase, prompt blind spot, or failure mode remains unmitigated |
| Process improvement | What should this work make easier, safer, faster, or more reusable next time? | Meaningful rework or failure produces no durable prevention or learning control |

## Standard handoff sequence

1. **Context steward:** reads project context and ledgers, then flags stale or conflicting records.
2. **Capability router:** maps evidence and execution needs to authoritative systems and specialized skills.
3. **Orchestrator → all roles:** distributes an assignment charter, evidence set, and work packet without a preferred solution.
4. **Independent role passes:** each role records a disposition and acceptance test.
5. **Orchestrator synthesis:** agreements, conflicts, opportunities, and blockers.
6. **Strategy + product:** select the outcome and minimum complete scope.
7. **User + IA + UX:** define the practical journey and presentation.
8. **Content + frontend + systems architecture:** establish evidence, domain boundaries, sources of truth, and implementation contracts.
9. **Backend/security + platform:** implement trust boundaries, persistence, runtime, deployment, and failure isolation.
10. **SEO + monetization + analytics:** design distribution, economic value, and measurement without distorting the product.
11. **Accessibility + privacy/legal:** protect users before the implementation is considered releasable.
12. **Publishing:** set artifact state, ownership, freshness, and lifecycle.
13. **Quality:** verify the actual implementation and latest head.
14. **Red team:** challenge prompt anchoring, failure modes, and the largest remaining opportunity.
15. **Process improvement:** convert the work into context, tests, scripts, templates, reusable primitives, or explicit learning.
16. **Context steward + orchestrator:** close the ledgers, release, and report.

## Status contract

Every role returns:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Finding`
- `Evidence`
- `Consequence if ignored`
- `Action`
- `Acceptance test`

### Status meanings

- `PASS`: applicable requirements are satisfied by evidence.
- `WARN`: bounded issue requires remediation, explicit acceptance, or tracked follow-up.
- `BLOCK`: release or decision must stop until resolved or formally re-scoped.
- `NOT IMPLICATED`: the domain is genuinely unaffected; rationale is mandatory.

The orchestrator, context steward, capability router, quality/release, adversarial red team, and process improvement roles are inherently implicated in every material assignment.

## Conflict examples

### Revenue versus editorial integrity

Monetization may recommend a lender comparison after a refinance calculation. Content integrity and privacy/legal determine required federal-loan warnings, substantiation, disclosure, and neutral alternatives. Product and UX place the offer after result interpretation. Analytics measures both conversion and decision-quality guardrails.

### SEO versus route stability

SEO may identify overlapping intent. Information architecture determines canonical ownership. Systems architecture, platform, and frontend establish contracts, redirects, and direct-route behavior. Analytics provides current evidence. Quality treats broad indexability changes as high risk.

### Personalization versus privacy

Product may recommend saved workspaces. Healthcare user research determines whether persistence creates genuine value. Systems architecture identifies the source of truth and isolation boundary. Backend/security and privacy/legal minimize fields and enforce deletion and ownership. Monetization cannot use saved sensitive inputs for unrelated targeting.

### Speed versus compounding

Implementation may prefer finishing after tests pass. Process improvement asks what was rediscovered or repeated. Context steward determines where the lesson belongs. Quality prevents process additions from weakening current release evidence. The smallest durable improvement is implemented only when its future value exceeds its maintenance cost.

## Review cadence

- **Every substantial assignment:** mandatory roles plus domain relevance checks.
- **Full-site review, new product, route program, monetization change, or release:** all roles.
- **After implementation:** rerun affected roles against the actual diff and deployed journey.
- **After meaningful production evidence:** analytics, product, strategy, monetization, context steward, process improvement, and red team reassess the decision.
- **After any material miss or external critique:** mandatory process-improvement and decision/evidence review.

## Governance principle

No single role is the main reviewer. The orchestrator owns reconciliation, not dominance. A technically correct, searchable, attractive, or profitable change can still fail the quorum if it does not safely and measurably help the intended user complete a healthcare financial decision—or if the work discards lessons that should improve future execution.