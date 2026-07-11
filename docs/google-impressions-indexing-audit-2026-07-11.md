# Google Impressions and Indexing Audit — July 11, 2026

## Executive assessment

Community Acquired Finance does not currently show a critical production crawlability or rendering blocker. The production site exposes a public robots file, a generated XML sitemap, canonical URLs, indexable robots directives, route-specific metadata, structured data, meaningful prerendered HTML, permanent redirects for retired aliases, and a real noindex 404 page.

The audit did identify preventable crawl-efficiency and discovery defects:

- sitemap generation and prerendering maintained separate hardcoded redirect exclusions instead of deriving them from the production redirect configuration;
- eight rendered internal links still pointed through the retired `/insurance/prior-authorization-guide` alias;
- three canonical pages had no inbound link in prerendered HTML: the healthcare-worker paycheck-tools hub, the Medicare Advantage marketing reality guide, and the canonical prior-authorization next-step guide.

This release corrects those defects and adds an all-route search-readiness audit that fails the production build when route, sitemap, prerender, metadata, structured-data, or internal-link invariants diverge.

## Data availability

Google Search Console performance and Page Indexing data were not available through the connected tools in this session. Therefore this audit cannot confirm current Google-known URL counts, impressions, clicks, average position, query trends, zero-impression indexed pages, or Search Console exclusion categories.

Public exact-brand, exact-title, and site-restricted search checks did not reliably surface the recently deployed broad-audience metadata. A public crawler result still exposed an older homepage title after production was already serving the new title. This is treated as recrawl/index-refresh lag, not proof of a production metadata failure.

## Confirmed technical state before this release

- Production robots.txt is public and allows crawling.
- robots.txt references the canonical sitemap URL.
- The production sitemap is public and contains 117 canonical URLs.
- Sitemap URLs use the production HTTPS origin and exclude the retired prior-authorization alias.
- Canonical pages are prerendered into meaningful HTML.
- Route-specific title, description, canonical, robots, Open Graph, and structured-data output is generated from the SEO registry.
- Invalid routes use a dedicated noindex 404 document.
- Permanent route aliases and hostname variants are handled in Vercel configuration.
- Preview deployments use platform-level noindex protection.
- The production entry bundle remains governed by the existing bundle budget.

## Corrections implemented

### 1. One redirect source of truth

Added `scripts/seo-route-utils.mjs` to read literal permanent redirects from `vercel.json` and remove redirect sources from the canonical route set.

Both sitemap generation and prerendering now use this shared canonical-route calculation. New permanent redirects no longer require separate manual exclusions in multiple build scripts.

### 2. Direct canonical internal links

Replaced source links to `/insurance/prior-authorization-guide` with direct links to `/tools/prior-authorization-next-step-guide` in:

- `src/pages/InsuranceBenefitsHub.tsx`;
- `src/pages/CommercialInsuranceComparisonPage.tsx`;
- `src/pages/HospitalDischargeCoveragePage.tsx`;
- `src/pages/DischargePrintableChecklistPage.tsx`;
- `src/pages/InsuranceDecisionToolsBundle.tsx`.

The old URL remains a permanent external-preservation redirect, but the site no longer spends an internal crawl hop reaching the canonical page.

### 3. Orphan-page corrections

- Added a healthcare-worker hub card linking to `/healthcare-workers/paycheck-tools`.
- Added a patient-and-caregiver hub card linking to `/insurance/what-medicare-advantage-marketing-may-not-emphasize`.
- Direct prior-authorization links now provide multiple inbound paths to `/tools/prior-authorization-next-step-guide`.

### 4. All-route search-readiness gate

Added `scripts/check-search-readiness.mjs` and integrated it into the production build.

For every canonical route, the check validates:

- a corresponding prerendered HTML document exists;
- sitemap, SEO registry, and prerender manifest contain the same canonical route set;
- permanent redirect sources do not appear in canonical outputs;
- exactly one title, meta description, canonical, robots directive, Googlebot directive, and H1 are present;
- title, description, and canonical match the centralized SEO metadata resolver;
- the page contains a primary main landmark and nonempty prerendered application content;
- JSON-LD exists and parses as valid JSON;
- titles are unique;
- internal HTML links do not point through permanent redirects or to unknown routes;
- every non-home canonical route receives at least one internal link;
- the 404 document remains noindex and contains an H1.

The check writes `dist/search-readiness-report.json` for build-level reconciliation evidence and fails the build on blocking inconsistencies.

## Validation result

The exact-head release passed:

- GitHub Actions lint advisory;
- publication-readiness, content, and unit tests;
- all quick-guide content checks;
- production Vite build;
- JavaScript bundle budget;
- prerendering of 117 canonical routes plus a real 404;
- search-readiness reconciliation of 117 canonical routes, 117 sitemap URLs, and 22 permanent redirects;
- zero search-readiness warnings;
- exact-head Vercel preview deployment;
- preview homepage HTTP 200 and meaningful prerendered content;
- preview noindex protection;
- no error or fatal runtime logs;
- no unresolved Vercel toolbar threads.

## URL reconciliation model

The release defines four separate URL classes:

1. **Canonical/indexable:** returned by the SEO registry after removing permanent redirect sources; included in sitemap and prerender manifest.
2. **Permanent alias:** configured in `vercel.json`; excluded from sitemap and prerender output and redirected to one canonical destination.
3. **Static non-HTML asset:** PDFs, images, manifests, scripts, styles, and other assets; excluded from canonical HTML route validation.
4. **Invalid route:** served by the real 404 document and marked noindex.

This is the build-time source of truth. Google Search Console should later be reconciled against the generated search-readiness report rather than against a manually maintained spreadsheet.

## Search-intent and cluster assessment

### Strongest differentiated clusters

| Cluster | Main hubs and tools | Search role | Current assessment |
|---|---|---|---|
| Medical bills | `/insurance/medical-bill-review-toolkit`, `/tools/medical-bill-review-flow`, EOB checker, supporting articles | Guide + interactive decision support | Strong differentiation and practical utility; maintain clear separation between overview, flow, and bill/EOB comparison intents. |
| Medicare and Medicaid | `/medicare-care-costs`, `/topics/medicare-medicaid`, eligibility checker, discharge guide, supporting articles | Broad hub + eligibility pathway + specific questions | Strong authority opportunity; avoid collapsing distinct enrollment, cost, discharge, and long-term-care intents into one page. |
| Workplace benefits | `/insurance`, `/open-enrollment`, Benefits Blueprint, Employer Benefits Action Plan | Education + pre-enrollment and post-document tools | Strong connected product pathway; general-public framing should be retained while healthcare-specific examples remain contextual. |
| Healthcare-worker compensation | healthcare-worker hub, paycheck tools, total-compensation calculator, job-offer article | Occupation-specific expertise + calculator | Distinctive and defensible; keep occupation-specific rather than broadening every title. |
| Retirement and financial independence | `/build-wealth`, retirement topic hub, 403(b) calculator, retirement articles | General-finance entry path with healthcare applications | Strategically important but more competitive; prioritize distinctive workplace-plan and healthcare-worker applications over generic investing volume. |

### Likely overlap requiring observation, not immediate consolidation

- `/medicare-care-costs` and `/topics/medicare-medicaid` serve related but different roles: an action-oriented cost hub versus a topic collection.
- `/insurance/medical-bill-review-toolkit` and `/tools/medical-bill-review-flow` should remain separate while the toolkit explains the process and the flow produces a tailored next step.
- `/insurance` and `/open-enrollment` overlap around benefits, but one is evergreen insurance/benefits architecture and the other is a selection-period workflow.
- The Benefits Blueprint and Employer Benefits Action Plan intentionally represent sequential stages and should remain connected rather than merged.

Search Console query/page data is required before declaring cannibalization.

## Indexing decisions

- **Canonical articles, hubs, guides, and standalone tools:** should remain indexable.
- **Permanent aliases:** correctly redirected and excluded from sitemap/prerender output.
- **Preview deployments:** should remain noindex.
- **404 document:** correctly noindex.
- **Trust pages:** retain indexability because they support transparency and publisher credibility, though they are not expected to generate meaningful search traffic.
- **Newsletter and contact pages:** retain current indexability unless Search Console later shows low-value duplication or crawl waste; no immediate technical reason requires noindex.
- **PDFs:** use HTML landing pages as the primary discoverable resource where available; do not add every file directly to the XML sitemap merely to increase URL count.

## High-value opportunities after Search Console access

1. Export Search Console performance for 7 days, 28 days, 3 months, and full available history.
2. Join page-level performance data to `search-readiness-report.json` by canonical path.
3. Prioritize pages ranking in positions 8–30 with meaningful impressions before publishing more content.
4. Inspect indexed-but-zero-impression pages for intent mismatch, weak internal links, or thin differentiation.
5. Evaluate suspected page overlap only when the same query is producing impressions for multiple URLs.
6. Re-submit the generated sitemap and request validation only for genuine coverage errors, not every correctly excluded alias.

## Release rule

Do not change the broad-audience homepage positioning, canonical URL structure, or major topic architecture solely because public search results have not refreshed immediately. Allow recrawl time and use Search Console evidence before making another structural SEO change.
