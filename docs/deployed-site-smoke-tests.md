# Deployed-site smoke tests

Community Acquired Finance validates both the built application and the application that visitors actually receive.

Build, prerender, unit, trust, bundle, route, and search-readiness checks remain the first release gate. The deployed-site smoke workflow is a separate post-deployment gate. It detects failures that only appear after hosting, alias assignment, redirects, response headers, or deployment protection are applied.

## Representative route set

The smoke test intentionally checks a bounded cross-section instead of crawling the entire site on every deployment:

- `/`
- `/start-here`
- `/tools`
- `/tools/benefits-change-detector`
- `/tools/roth-vs-traditional-decision-helper`
- `/insurance/medical-bill-review-toolkit`
- `/medicare-care-costs/turning-65`
- `/articles/what-employer-benefit-changes-should-i-compare`
- `/robots.txt`
- `/sitemap.xml`

This set covers the homepage, routing entry points, the tools directory, two deterministic financial journeys, a healthcare-billing hub, a Medicare journey, a source-backed acquisition article, and the two primary crawler-control files.

## Assertions

Every HTML route must return:

- an HTTP success response;
- HTML content;
- a meaningful title and H1;
- a route-specific content marker;
- a canonical URL on `https://communityacquiredfinance.com`;
- indexable HTML metadata;
- the CAF application root rather than an error or deployment shell;
- the expected security headers.

Production responses must not send an `X-Robots-Tag: noindex` directive. Vercel preview responses may carry a response-level noindex directive, but their prerendered HTML must remain canonical and free of accidental noindex metadata.

Routes designated as ad-free must not contain the route-managed AdSense script in their initial HTML.

`robots.txt` must allow the public site and point to the canonical sitemap and host. `sitemap.xml` must contain only canonical-host URLs and include every representative public route.

## Automatic execution

`.github/workflows/deployed-site-smoke.yml` listens for successful deployment-status events.

- Production deployments are verified against the canonical domain after the production alias is assigned.
- Preview deployments are verified against the Vercel environment URL.
- A small retry window absorbs normal deployment propagation.
- Results are printed in the GitHub job summary and uploaded as a JSON artifact for 14 days.

If Vercel deployment protection blocks GitHub Actions, add a repository Actions secret named `VERCEL_AUTOMATION_BYPASS_SECRET`. The verifier sends it only as Vercel's protection-bypass header. It is never written to the report or logs.

## Manual execution

Production:

```bash
npm run smoke:deployed -- \
  --base-url https://communityacquiredfinance.com \
  --environment production \
  --attempts 3 \
  --delay-ms 3000
```

Preview:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET="..." npm run smoke:deployed -- \
  --base-url https://your-preview.vercel.app \
  --environment preview
```

The workflow can also be run manually from GitHub Actions with a specified base URL and environment.

## Failure handling

A failure must name the route and failed assertion. Do not dismiss a smoke failure merely because the compile-time build passed.

Use this order:

1. Confirm the deployment URL and environment classification.
2. Inspect the uploaded JSON report.
3. Check the exact Vercel deployment and build logs.
4. Reproduce the failing route directly.
5. Fix the underlying route, prerender, header, redirect, canonical, sitemap, or hosting configuration.
6. Re-run the workflow against the same deployment when appropriate.

Do not weaken an assertion solely to make the workflow green. Change an assertion only when the site's explicit product, privacy, indexing, or security standard has changed and the controlling documentation is updated in the same pull request.
