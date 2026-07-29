# AdSense resubmission release report — 2026-07-29

## Executive determination

**NOT READY TO RESUBMIT**

Confidence: **high (0.88)**.

The code release candidate is materially stronger and its automated repository gates pass. The resubmission gate remains closed because live Search Console Manual Actions and Security Issues could not be verified, and the owner-only AdSense dashboard state—including the exact site URL, ownership status, issued `ads.txt` line, consent configuration, and review eligibility—was not available through the connected sources. This report does not convert missing evidence into a pass.

## Ranked rejection-cause assessment

| Rank | Finding | Classification | Evidence | Affected URLs | Action taken | Remaining uncertainty |
|---:|---|---|---|---|---|---|
| 1 | The indexable footprint included inactive organization inventory and a canceled sales program. | Verified defect | Six organization routes were in the sitemap and public navigation history, while the connected Notion/Linear control records classify the B2B program as canceled and archive-only. Search Console recorded impressions for organization pages. | `/for-organizations` and five child routes | Removed the page implementations and SEO entries; added permanent redirects to `/about`; removed all six from the sitemap and prerender manifest. | Google must recrawl the redirects. |
| 2 | Sitemap, redirect, and canonical sources were internally inconsistent. | Verified defect | The baseline AdSense/search checks failed because redirect sources remained in the sitemap and the sitemap was stale. A duplicate printable was indexable, and an internal download link used a redirecting `.html` path. | `/products`, product paths, organization paths, discharge printable, medical-bill download | Regenerated a single 160-URL sitemap; removed redirect sources; noindexed the duplicate printable and supporting downloads; repaired internal links to their final destination. | Final production headers and redirects must be rechecked after deployment. |
| 3 | The site exposed a broad review surface with too many pages treated as potential ad inventory. | Strong risk | Baseline governance marked 10 article routes ad-eligible even though five lacked an article-specific RN note. Tools, forms, private shells, trust/legal pages, and sensitive flows require conservative placement. | Sitewide; especially interactive and health/financial decision routes | Reduced explicit ad eligibility from 10 routes to 5; kept 155 indexable routes permanently ad-free or pending affirmative editorial review. | Google does not disclose page-specific AdSense reasoning. |
| 4 | The thinnest useful pages did not explain enough context before interaction. | Verified defect | Production crawl found 10 indexable pages under 250 rendered words, including one under 100 words. Two pages had visible impressions and only 95/152 words. | `/healthcare-workers/paycheck-tools`; `/insurance/what-medicare-advantage-marketing-may-not-emphasize` | Added RN-led decision context, verification steps, authoritative sources, assumptions, and next actions. Retired three thin organization pages. Final footprint has 6 sub-250-word pages and none under 100; the remaining six are legitimate forms, calculators, or narrowly scoped navigation. | Word count is only a diagnostic, not a Google requirement. |
| 5 | Public trust copy contained stale prelaunch language and a contact pathway for an unavailable program. | Verified defect | Accessibility said the site was still under development and referenced pre-production work; Contact offered organization review language inconsistent with the canceled program. | `/accessibility`, `/contact` | Replaced stale language with current limitations and release checks; removed unavailable program outreach; retained correction, sourcing, privacy, and accessibility contacts. | Owner must verify that contact delivery works in production. |
| 6 | Product availability was inconsistent across systems. | Strong risk | Public checkout is disabled and product pages now redirect, but Stripe still contains an active live-mode $29 product and price marked `prelaunch`. | Former product routes; Stripe product `prod_Uxp2XvStVfkORZ` | Removed public product implementations and sitemap entries; retained fail-closed private application boundaries. | Stripe’s API connector did not expose a safe product-archive operation. Archive the live product/price unless it is intentionally retained for a nonpublic test. This is not visible AdSense inventory after this release. |
| 7 | Low traffic or lack of AMP caused rejection. | Unlikely cause | Official Google guidance does not establish traffic, article-count, word-count, site-age, or AMP minimums for AdSense. The exports show actual search impressions and no HTTPS defect. | None | No AMP or filler-content work performed. | The AdSense rejection remains nonspecific. |

## Implementation report

### Public-footprint changes

- Removed six discontinued organization pages and redirected them permanently to About.
- Removed inactive public product pages and retained clear redirects to useful free resources.
- Removed seven URLs from the indexable sitemap footprint: six organization pages and one duplicate printable.
- Added controlled `noindex` treatment for the duplicate printable, downloadable response pack, quick-guide PDF, and machine-readable patient-education assets.
- Repaired internal links that unnecessarily traversed the `.html` download redirect.
- Added an explicit shared React route for seven complete diagnosis guides instead of relying on the not-found recovery component.

### Content and trust changes

- Strengthened the healthcare-worker paycheck tools with RN-led use context, ordering guidance, and IRS/DOL sources.
- Strengthened Medicare Advantage marketing guidance with a verification sequence and official Medicare sources.
- Corrected Accessibility’s stale prelaunch language.
- Removed unavailable organization-program language from Contact.
- Reduced article ad eligibility to the five routes with explicit depth, sourcing, and visible RN context.

### Technical changes

- Final sitemap: 160 canonical URLs.
- Final redirect registry: 39 permanent redirects, including six new organization consolidations.
- Controlled noindex prerenders: 4.
- Private noindex denial shells: 2.
- Sitemap, canonical, robots, structured-data, internal-link, orphan-route, prerender, and 404 checks: passing.
- Supporting static assets receive `X-Robots-Tag` headers where appropriate.
- `ads.txt` and the publisher meta tag consistently use publisher ID `pub-3330626498830044`; the owner must compare the exact line to the AdSense dashboard.

### Files and route-level detail

The complete original/final state is in [the URL ledger](./adsense-url-ledger-2026-07-29.csv). The generated route governance audit is in [the AdSense readiness audit](./adsense-readiness-audit.md), and the Search Console count reconciliation is in [the Search Console report](./search-console-reconciliation-2026-07-29.md).

Commit, pull request, deployment URL, and final production smoke results are added to the release record after publication.

## Before-and-after validation

| Measure | Before | Release candidate | Result |
|---|---:|---:|---|
| Production sitemap URLs | 167 | 160 | 7 fewer indexable URLs |
| Explicit ad-eligible routes | 10 | 5 | 50% reduction |
| Permanent redirects | 33 | 39 | 6 inactive routes consolidated |
| Indexable pages under 250 rendered words | 10 | 6 | 4 resolved or retired |
| Indexable pages under 100 rendered words | 1 | 0 | resolved |
| Duplicate indexable printable routes | 1 | 0 | noindexed |
| Internal links through the download redirect | Present | 0 | repaired |
| Exact duplicate titles | 0 | 0 | passing |
| Orphan canonical routes | 0 | 0 | passing |
| Search-readiness errors | Baseline defects present | 0 | passing |
| Unit/component tests | — | 451 passed | passing |
| TypeScript | — | passed | passing |
| ESLint | — | 0 errors; 12 existing warnings | passing |
| Production build/prerender | — | passed | passing |
| Local Playwright execution | Browser binary absent | blocked by the workspace certificate gateway | not treated as a pass |

## Validation still required on the deployed release

- Desktop and mobile browser journeys, including keyboard-only critical flows
- Browser console and production network-error review
- Vercel build logs and production runtime errors
- Production redirects, headers, sitemap, canonical tags, structured data, and real 404 status
- Live Search Console Manual Actions, Security Issues, Page Indexing, sitemap, HTTPS, and representative URL Inspections
- AdSense site URL, ownership, exact `ads.txt` line, consent configuration, and resubmit-button state

## Owner resubmission checklist

- [ ] Verify the final production deployment is the release referenced in this report.
- [ ] Inspect the homepage, About, author identity, Privacy, Terms, Editorial Policy, Disclosures, Contact, and Accessibility pages.
- [ ] Inspect at least one RN-led article, one calculator, one patient guide, and the two strengthened routes.
- [ ] Confirm the AdSense site URL is exactly `communityacquiredfinance.com`.
- [ ] Confirm AdSense ownership verification is successful.
- [ ] Compare the dashboard-issued `ads.txt` line with production `/ads.txt`.
- [ ] Confirm the required Google consent-management configuration for the site’s served regions.
- [ ] Confirm Search Console reports no Manual Action and no Security Issue.
- [ ] Confirm no maintenance banner, password wall, preview-only deployment, or incomplete product offer is public.
- [ ] Archive the active Stripe prelaunch product/price unless intentionally retained for a nonpublic test.
- [ ] When every unchecked release gate above is verified, press the AdSense resubmit button.
- [ ] Record the exact resubmission date and release commit.

## Deferred, nonblocking improvements

- Continue affirmative editorial review of currently ad-free articles; do not broaden ad placement automatically.
- Reassess overlapping Medicare and health-insurance clusters after a new settled Search Console window.
- Add monitoring for route-to-sitemap drift and unexpected soft-404 content.
- Update the Browserslist dataset during a routine dependency-maintenance release.
- Re-run the full local Playwright suite in an environment with the pinned browser available.

These are nonblocking only after the live owner checks and production browser/deployment checks pass.

Official policy basis: [Google Publisher Policies](https://support.google.com/adsense/answer/10502938?hl=en), [AdSense Program policies](https://support.google.com/adsense/answer/48182?hl=en), [AdSense eligibility and unique content](https://support.google.com/adsense/answer/9724?hl=en), [helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), and [Search Essentials](https://developers.google.com/search/docs/essentials).
