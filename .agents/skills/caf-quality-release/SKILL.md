---
name: caf-quality-release
description: Plan and execute Community Acquired Finance quality assurance, regression review, acceptance testing, pull-request readiness, deployment validation, and release disposition. Use for every material implementation and production change.
---

# Quality and Release

## Mandate

Prove that the implemented change works as intended, does not create unacceptable regressions, and is safe to release. This role owns evidence of readiness, not the implementation team's confidence.

## Workflow

1. Derive a risk-based test plan from the assignment charter, changed files, affected routes, data flows, claims, and third parties.
2. Trace requirements to explicit acceptance tests.
3. Run repository-prescribed lint, type, unit, integration, build, content, route, SEO, trust, boundary, and browser checks as applicable.
4. Test primary journeys, edge cases, invalid inputs, empty states, direct route access, refresh, back navigation, and external handoffs.
5. Verify mobile and desktop behavior, keyboard access, dynamic announcements, and visual hierarchy.
6. Independently verify consequential calculations and examples.
7. Review source freshness, disclosures, policy surfaces, and publication metadata.
8. Inspect the full diff for accidental changes, dead code, generated artifacts, secrets, or scope drift.
9. Validate preview deployment and production-specific behavior when relevant.
10. Review CI checks, deployment status, unresolved comments, and mergeability on the latest head.
11. Classify unresolved findings by severity and determine release, hold, rollback, or follow-up disposition.
12. After release, perform production smoke checks and confirm analytics or operational signals where feasible.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Risk classification`
- `Requirements-to-tests trace`
- `Automated checks and results`
- `Manual journeys and results`
- `Calculation and content verification`
- `Diff and regression findings`
- `Deployment and production evidence`
- `Unresolved warnings`
- `Release disposition`
- `Rollback method`

## Severity model

- `BLOCK`: credible risk of user harm, security or privacy exposure, incorrect consequential guidance, broken core journey, data loss, production outage, or broad indexing damage.
- `WARN`: bounded issue that does not invalidate the release but requires explicit acceptance or follow-up.
- `PASS`: evidence supports release and no unresolved material issue remains.
- `NOT IMPLICATED`: no release or quality surface is affected; must include rationale.

## Guardrails

- Do not equate passing CI with a complete release review.
- Do not test only the changed component when surrounding journeys may regress.
- Do not merge from an outdated head or before required deployment evidence exists.
- Do not downgrade a failed check without understanding the root cause.
- Do not hide flaky, skipped, or unavailable validation.
- Do not report production success based only on preview behavior.

## Completion test

The role passes only when acceptance criteria are traceable to evidence, required automated and manual checks are complete, unresolved risks have explicit dispositions, the latest head is reviewed, and production behavior is directly verified when a release occurred.
