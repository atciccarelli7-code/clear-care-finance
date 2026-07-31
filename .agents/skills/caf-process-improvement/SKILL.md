---
name: caf-process-improvement
description: Convert Community Acquired Finance work into reusable improvements to prompts, skills, tests, documentation, components, research methods, and release controls. Use after every material assignment and after any miss, rework, failure, or external critique.
---

# Process Improvement

## Mandate

Make each completed assignment reduce the cost, ambiguity, and error rate of the next one. Treat mistakes, duplicated effort, external critiques, failed checks, and unexpected production evidence as inputs to the operating system—not isolated incidents.

## Workflow

1. Compare the intended outcome, implemented scope, validation evidence, and actual result.
2. Identify:
   - what had to be rediscovered;
   - where the prompt anchored or narrowed the team;
   - which evidence was difficult to obtain;
   - which task was repeated manually;
   - which role caught a material issue late;
   - which check could have prevented rework earlier;
   - which artifact, component, script, template, or skill should be reusable.
3. Perform a blameless root-cause analysis for meaningful misses.
4. Classify the improvement as:
   - context or decision-memory update;
   - skill or prompt refinement;
   - reusable product or code primitive;
   - automated check or test;
   - source/evidence governance improvement;
   - observability or analytics improvement;
   - workflow or release change.
5. Implement the smallest durable improvement during the same assignment when safe.
6. Add a regression check for repeated or high-consequence failures.
7. Record the lesson and the artifact changed in `docs/ai/WORK_LEDGER.md`.
8. Define the trigger for revisiting any improvement that remains provisional.
9. Verify that the new process does not add more friction than the failure it prevents.

## Required output

Return:

- `Status`: `PASS`, `WARN`, or `BLOCK`
- `What was learned`
- `Root cause of rework or miss`
- `Reusable asset created or improved`
- `Automation or regression check added`
- `Documentation or skill updated`
- `Expected future time or risk reduction`
- `Remaining process debt`

## Compounding rules

- A repeated manual check should become a script, test, template, or documented query.
- A repeated founder explanation should become durable project context or a structured intake field.
- A corrected factual workflow should update the evidence ledger and freshness policy.
- A missed role concern should update the role registry, skill, or orchestration sequence.
- A reusable user journey should become a shared component or system rather than another one-off page.
- A production surprise should produce observability or a release check when feasible.

## Guardrails

- Do not create process artifacts that no future agent will read or execute.
- Do not add ceremony to trivial work.
- Do not confuse more documentation with better memory; retire stale or duplicative records.
- Do not automate an unstable process before understanding it.
- Do not preserve a weak workflow merely because it already exists.
- Do not end a meaningful failure review with only a recommendation.

## Completion test

The role passes only when the assignment leaves behind at least one verified reusable improvement or explicitly demonstrates that no durable improvement is warranted.