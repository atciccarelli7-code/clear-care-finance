---
name: caf-ux-design-system
description: Design and review Community Acquired Finance interaction patterns, visual hierarchy, responsive behavior, component consistency, and emotional usability. Use for every user-facing build, redesign, calculator, workflow, or site review.
---

# UX and Design System

## Mandate

Create Robinhood-level simplicity with substantially better educational depth. Make complex healthcare and financial decisions feel calm, credible, and actionable without disguising uncertainty.

## Workflow

1. Identify the user's task, emotional state, device, and likely attention span.
2. Review the complete journey rather than isolated screens.
3. Establish the visual and interaction hierarchy: orientation, inputs, result, interpretation, tradeoffs, next action, and verification.
4. Reduce unnecessary choices, repeated explanations, dense cards, and competing calls to action.
5. Use progressive disclosure so basic users can act while advanced users can inspect assumptions and details.
6. Confirm that form controls, calculator inputs, validation, defaults, units, and result changes are understandable.
7. Design loading, error, empty, unavailable, and edge-case states.
8. Apply the existing component system before introducing new patterns.
9. Check responsive behavior at narrow mobile widths, touch targets, zoom, long labels, large numbers, and dynamic text.
10. Distinguish editorial guidance, official resources, sponsored recommendations, and premium actions visually and semantically.
11. Test whether the page communicates trust without excessive disclaimers or decorative complexity.
12. Reassess the surrounding site for visual-semantic drift after implementation.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Primary task and emotional context`
- `Journey hierarchy`
- `Friction and confusion points`
- `Interaction design requirements`
- `Responsive and state requirements`
- `Component reuse plan`
- `Trust and monetization presentation`
- `Usability acceptance tests`

## Design principles

- One primary action per decision state.
- Results must include interpretation, not only numbers.
- Explanations should appear near the decision they clarify.
- Defaults must be safe, neutral, and visible.
- Important assumptions and limitations must be accessible without overwhelming the first view.
- Use plain language, strong spacing, restrained color, and consistent iconography.
- Never use anxiety, urgency, or loss framing to force conversion.
- Sponsored or affiliate actions must remain useful even when the user does not click them.

## Guardrails

- Do not redesign for novelty when existing patterns work.
- Do not solve information overload by hiding necessary risk information.
- Do not use decorative dashboards where a focused decision flow is clearer.
- Do not make mobile users perform desktop-sized comparison tasks without adaptation.
- Do not present external providers as part of an unbiased result without disclosure.
- Do not accept visual polish as evidence of task completion.

## Completion test

The role passes only when a first-time user can understand the page's purpose, complete the target task, interpret the result, distinguish commercial content, and identify the next action on mobile and desktop without expert assistance.
