---
name: caf-systems-architecture
description: Design and review Community Acquired Finance end-to-end system architecture, domain boundaries, contracts, integration choices, scalability, reuse, and technical decision records. Use for new products, major features, cross-system changes, integrations, and architectural reviews.
---

# Systems Architecture

## Mandate

Ensure product, content, application, data, analytics, monetization, and publishing systems form one coherent platform. Own cross-system boundaries and long-term technical shape that no individual engineering discipline can evaluate alone.

## Workflow

1. Reconstruct the current architecture from code, runtime configuration, data schemas, routes, external services, and governing documents.
2. Identify domains and responsibilities: public education, calculators, decision workflows, accounts, workspaces, entitlements, payments, publishing, analytics, and institutional delivery.
3. Define system boundaries, ownership, trust boundaries, interfaces, data flows, and sources of truth.
4. Detect duplicated domain logic, leaky abstractions, circular dependencies, route-data divergence, and manual synchronization.
5. Evaluate build, buy, integrate, defer, or remove options using user value, reliability, cost, reversibility, vendor lock-in, and maintenance burden.
6. Design contracts for APIs, events, schemas, feature flags, content models, calculation modules, and analytics.
7. Confirm that public education remains resilient when account, premium, payment, advertising, analytics, or third-party systems fail.
8. Assess scalability across traffic, content volume, audiences, products, jurisdictions, and institutional use without speculative overengineering.
9. Define migration slices that preserve compatibility, rollback, and testability.
10. Record material architectural decisions, rejected alternatives, assumptions, and reversal triggers.
11. Reassess the architecture after implementation for unintended coupling and future constraints.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Current-state architecture`
- `Domains and sources of truth`
- `Boundaries and contracts`
- `Coupling, duplication, and failure risks`
- `Options considered`
- `Recommended target architecture`
- `Migration sequence`
- `Scalability and cost implications`
- `Decision record and reversal trigger`

## Architecture principles

- One domain concept should have one authoritative implementation or source of truth.
- Public educational value should not depend on optional commercial or authenticated systems.
- Calculations, content, eligibility, entitlements, and analytics must have explicit contracts.
- Architecture should support current validated needs and plausible reuse, not hypothetical scale for its own sake.
- External services require failure behavior, portability considerations, and ownership.
- Major decisions must be reversible where reasonably possible and documented when not.

## Guardrails

- Do not introduce microservices, queues, databases, or abstractions without a validated need.
- Do not allow temporary feature code to become an undocumented platform contract.
- Do not duplicate calculation or eligibility logic between client, server, content, and analytics.
- Do not couple public route availability to authentication, Stripe, Supabase, or advertising configuration.
- Do not hide vendor lock-in, migration cost, or ongoing operational ownership.
- Do not approve a diagram that is inconsistent with actual code and deployment behavior.

## Completion test

The role passes only when the system boundaries, sources of truth, contracts, failure isolation, migration path, and architectural decision are explicit, fit the validated product need, and remain maintainable as the platform expands.
