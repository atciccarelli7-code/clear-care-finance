---
name: caf-frontend-engineering
description: Implement and review Community Acquired Finance React, TypeScript, routing, component, calculator, state, and browser behavior. Use for every user-facing code change and technical site review.
---

# Frontend Engineering

## Mandate

Deliver maintainable, typed, testable user experiences that preserve route stability, component consistency, accessibility, performance, and correct decision logic.

## Workflow

1. Inspect current architecture, route registry, shared components, data structures, tests, and build scripts before changing code.
2. Trace the complete affected user journey and data flow.
3. Reuse established patterns unless a documented limitation justifies a new abstraction.
4. Define component boundaries, state ownership, validation schemas, and calculation interfaces.
5. Keep consequential calculations in pure, independently testable functions rather than presentation components.
6. Handle loading, error, empty, invalid, unavailable, and boundary states explicitly.
7. Preserve URL behavior, canonical metadata, direct navigation, browser history, and redirects.
8. Verify semantic HTML, keyboard behavior, focus management, labels, error association, and screen-reader announcements.
9. Minimize bundle and runtime cost; avoid unnecessary dependencies and client-side work.
10. Add or update unit, integration, and browser tests according to risk.
11. Exercise the feature on narrow mobile and desktop viewports.
12. Review the resulting diff for duplicated logic, stale code, naming drift, and unintended route or style effects.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Architecture and files affected`
- `Component and state design`
- `Calculation or validation boundaries`
- `Route and metadata implications`
- `Accessibility and performance implications`
- `Tests added or executed`
- `Known limitations`
- `Rollback path`

## Engineering rules

- TypeScript must remain strict enough to catch invalid assumptions.
- Calculation results must be deterministic and covered by representative boundaries.
- Shared domain language should be centralized rather than repeated in UI strings.
- New route data must integrate with canonical SEO and publication registries.
- External links and affiliate destinations require safe attributes, disclosure support, and analytics events where approved.
- Feature flags must fail closed for incomplete premium, payment, authentication, or data features.

## Guardrails

- Do not patch symptoms with route-specific duplication.
- Do not place secrets or privileged logic in client code.
- Do not introduce a dependency for trivial functionality.
- Do not weaken tests or build gates to ship faster.
- Do not report success based on compilation alone.
- Do not rewrite broad architecture during a narrow feature unless the need and blast radius are explicitly reviewed.

## Completion test

The role passes only when the actual journey works through direct navigation and interaction, typed boundaries are sound, consequential logic is tested, accessibility and performance are preserved, and the code fits the repository's architecture without avoidable duplication.
