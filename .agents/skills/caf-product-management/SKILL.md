---
name: caf-product-management
description: Define and evaluate Community Acquired Finance products, tools, journeys, requirements, prioritization, and outcomes. Use for every material feature, calculator, guide, workflow, redesign, or review.
---

# Product Management

## Mandate

Ensure every change solves a specific user problem, completes a coherent decision journey, and produces a measurable outcome. Convert educational content and calculators into usable decision-support products without overbuilding.

## Product standard

A page or calculator is not automatically a product. A strong product experience helps a user:

1. recognize the decision they face;
2. provide or understand the relevant inputs;
3. receive a correct and interpretable result;
4. understand uncertainty and tradeoffs;
5. choose a next action;
6. save, print, share, or revisit the decision when useful;
7. know when professional or official verification is required.

## Workflow

1. Identify the primary user, context, trigger event, and job to be done.
2. Describe the current workaround and its failure modes.
3. Define the user decision, not merely the content topic.
4. Map the full journey from entry intent through result, interpretation, next action, and follow-up.
5. Inspect existing routes and components for overlap before proposing anything new.
6. Identify the minimum complete experience and distinguish it from optional enhancement.
7. Define functional requirements, edge cases, empty states, error states, loading states, and mobile behavior.
8. Specify trust requirements: sources, assumptions, calculation boundaries, disclosures, and verification prompts.
9. Define ethical next actions, including internal resources, official sources, email capture, affiliate options, premium workflows, or human assistance when appropriate.
10. Define instrumentation for discovery, activation, completion, next-action selection, return usage, and failure.
11. Establish acceptance criteria that can be exercised on the live product.
12. Reassess the surrounding product after implementation for duplicated concepts, inconsistent terminology, and newly exposed gaps.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Primary user and context`
- `Job to be done`
- `Decision being supported`
- `Current failure or unmet need`
- `Minimum complete journey`
- `Requirements and edge cases`
- `Next-action architecture`
- `Success and guardrail metrics`
- `Acceptance criteria`
- `Out-of-scope items`

## Prioritization

Rank work using:

- severity and frequency of the user problem
- strength of founder insight or evidence
- number of existing users or routes affected
- ability to reuse platform components
- strategic and revenue leverage
- confidence in the solution
- implementation and maintenance cost
- safety, privacy, and trust risk

## Guardrails

- Do not build a tool whose result ends without interpretation or action.
- Do not create a new route when an existing journey can be strengthened.
- Do not confuse feature completeness with user success.
- Do not add email capture or monetization unless the user receives clear value.
- Do not require accounts for functionality that does not need persistence.
- Do not use engagement alone as proof of benefit.

## Completion test

The role passes only when the target user, decision, complete journey, acceptance criteria, and measurable outcome are explicit and the implementation avoids a known dead end.
