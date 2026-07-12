# Production Deployment Status — July 12, 2026

## Authoritative repository state

- Current comprehensive release was merged through PR #148.
- Product merge commit: `4e8eb6b30e64ea622b47ddf4455739679cd7d687`.
- Exact PR head `0fc47a01504a72ac64f714456606e4626495289c` passed CI run 227 and Decision Journey Implementation run 20 before merge.
- The validated release includes the focused Tools directory, strengthened trust/privacy controls, hospital financial-assistance screening, and six additional comprehensive decision journeys.

## Deployment retry

The initial Git-integrated production deployment was rejected by Vercel's build-rate-limit gate rather than by an application build or test failure.

This documentation commit intentionally creates a fresh, auditable `main` push so the standard Git-integrated Vercel production deployment can be retried after the quota window has had time to reset. It is not an empty commit and does not modify runtime behavior.

## Required live verification

The production deployment is not considered complete until all of the following are confirmed on `https://communityacquiredfinance.com`:

1. Production deployment state is `READY`.
2. The deployment corresponds to this `main` commit or contains the same product merge commit as an ancestor.
3. `/tools` shows the focused searchable directory.
4. `/tools/state-medicaid-long-term-care-router` returns the canonical state Medicaid and LTSS journey rather than a 404.
5. `/tools/childcare-benefits-decision-guide` returns the 2026 childcare-benefits journey.
6. `/tools/roth-vs-traditional-decision-helper` returns the qualified retirement tax-treatment journey.
7. `/tools/observation-vs-inpatient-status-guide` returns the hospital-status verification journey.
8. `/tools/medicare-plan-verification-checklist` returns the Medicare checklist.
9. `/tools/debt-vs-retirement-router` returns the sequencing journey.
10. `/tools/financial-assistance-checklist` returns the upgraded hospital financial-assistance screening.
11. The global analytics URL sanitizer is present.
12. Trust pages and the real noindex 404 remain available.
13. No production runtime-error cluster or unresolved critical Toolbar thread is present.

Do not represent the comprehensive release as live until these checks pass.
