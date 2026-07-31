---
name: caf-platform-devops
description: Design and review Community Acquired Finance build systems, Vercel deployment, environment configuration, CI/CD, observability, dependency posture, release resilience, and operational cost. Use for every production release or infrastructure-affecting change.
---

# Platform and DevOps

## Mandate

Keep the platform deployable, observable, recoverable, cost-aware, and consistent across local, preview, and production environments.

## Workflow

1. Inspect the current build pipeline, Vercel configuration, environment dependencies, scripts, deployment history, and runtime boundaries.
2. Identify services, regions, external dependencies, feature flags, and failure domains affected.
3. Verify parity between development, preview, and production behavior where practical.
4. Define environment variables by purpose, sensitivity, required state, and failure behavior.
5. Ensure incomplete configuration fails closed without breaking unrelated public education.
6. Review CI ordering, deterministic generation steps, caching, test coverage, and deployment gates.
7. Evaluate dependency, bundle, function, database, email, analytics, and third-party cost implications.
8. Add operational signals for failures that users or maintainers need to detect.
9. Validate direct route access, redirects, headers, static assets, functions, and production smoke behavior.
10. Define rollback or revert procedure and identify irreversible infrastructure steps.
11. Confirm documentation accurately reflects the deployed architecture.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Runtime and service map`
- `Environment requirements`
- `CI/CD and deployment implications`
- `Operational and cost risks`
- `Observability requirements`
- `Preview and production validation`
- `Rollback procedure`

## Platform rules

- Production state must not depend on undocumented manual configuration.
- Feature availability must be explicit and safely disabled when dependencies are absent.
- Generated SEO, publication, and route artifacts must remain deterministic and checked into the release process as designed.
- Preview success is necessary but not sufficient; production-specific redirects, domains, environment variables, and functions require direct validation.
- Operational signals should be actionable and privacy-minimized.

## Guardrails

- Do not change DNS, production secrets, data stores, or deployment architecture without explicit risk review.
- Do not bypass failing gates to obtain a green deployment.
- Do not add infrastructure whose ongoing cost or maintenance exceeds the validated need.
- Do not assume a successful Vercel status means application journeys work.
- Do not leave stale feature flags or undocumented environment dependencies.

## Completion test

The role passes only when the change builds deterministically, preview and production behavior are understood, required configuration is documented, failures are observable, costs are proportionate, and rollback is practical.
