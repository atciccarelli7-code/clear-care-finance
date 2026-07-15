# Repository Agent Instructions

## Default pull-request disposition

The default outcome for completed pull requests is **merge**, not “leave open for later review.”

After implementation is complete, the agent must inspect the pull request and merge it promptly when all of the following are true:

- the pull request is not a draft;
- GitHub reports it as mergeable;
- required CI checks have passed;
- the latest Vercel preview is `READY`, or the change does not require a deployment preview;
- there are no unresolved review threads or requested changes;
- the reviewed diff does not present a high-risk condition defined below.

Do not leave a low- or moderate-risk pull request open merely for routine manual approval. Use the current expected head SHA when merging so a changed pull request cannot be merged without re-review.

## High-risk conditions that require a hold

Do not automatically merge when the pull request includes a material risk in one or more of these areas:

1. **Security, authentication, or access control**
   - credentials, secrets, tokens, permissions, login flows, authorization, security headers, or dependency vulnerabilities;
2. **Payments, financial transactions, or user financial data**
   - payment processing, bank connections, stored financial records, transaction logic, or materially consequential calculator logic;
3. **Destructive or difficult-to-reverse infrastructure changes**
   - database migrations, data deletion, DNS/domain changes, production environment variables, deployment configuration, rollback logic, or repository/branch protection;
4. **Site-wide discoverability risk**
   - robots directives, canonical strategy, redirects, sitemap generation, broad route removal, indexing controls, or changes that could deindex or orphan multiple pages;
5. **Material legal, medical, tax, Medicare, Medicaid, insurance, or benefits claims without authoritative verification**
   - current dollar limits, eligibility rules, deadlines, coverage rules, or compliance language must be verified against authoritative sources before merging;
6. **Large architectural or dependency changes**
   - major framework upgrades, broad routing rewrites, large dependency replacements, build-system changes, or refactors whose blast radius is not covered by tests;
7. **Failed or incomplete validation**
   - failing checks, a failed Vercel deployment, unresolved review feedback, broken internal links, missing tests for consequential behavior, or an unexplained regression.

A change in one of these areas may still be merged after the risk is specifically reviewed, validated, and judged acceptable. “High risk” means a credible possibility of security exposure, financial or clinical misinformation, data loss, major production outage, or broad search-indexing harm—not simply that the pull request is large.

## Merge-review checklist

Before merging, verify:

1. scope and changed files match the pull-request description;
2. CI and relevant tests pass on the latest head commit;
3. the Vercel preview is ready when applicable;
4. new internal links resolve to registered routes;
5. canonical URLs and existing slugs remain stable unless an intentional redirect plan exists;
6. time-sensitive financial, Medicare, Medicaid, tax, insurance, or benefits information has authoritative sourcing and review metadata;
7. no unresolved comments or review threads remain;
8. the production change is reversible through a normal revert or rollback.

When these checks pass and no unresolved high-risk condition remains, merge the pull request during the same work session.