# Search Console reconciliation — 2026-07-29

## Evidence boundary

This reconciliation uses the three owner-provided Search Console exports dated July 29, 2026, the production sitemap fetched on July 29, and the final generated sitemap. GSC Wizard could not return live property data because the connected GSC Wizard subscription is inactive. The exports do not contain URL Inspection results, per-URL last-crawl dates, Manual Actions, Security Issues, Core Web Vitals, or Mobile Usability data. Those items remain owner verification gates and are not inferred.

## Reconciled counts

| Measure | Exported or observed result | Interpretation |
|---|---:|---|
| Search performance headline total | 13 clicks; 1,139 impressions | The Countries and Devices exports reproduce the headline aggregate. |
| Pages-dimension total | 14 clicks; 1,593 impressions | Page-dimension exports do not always reconcile to other dimensions because Search Console applies privacy filtering and dimension-specific aggregation. |
| Page rows | 105 rows; 104 normalized URLs | HTTP and HTTPS homepage rows normalize to the same canonical path. |
| Page rows with zero clicks | 95 | Zero clicks is not a quality verdict. Every row still had at least one reported impression. |
| Production sitemap before remediation | 167 URLs | Fetched from production on July 29. |
| Production sitemap URLs absent from the Pages export | 64 | These URLs had no page-dimension row in the exported period. That can reflect no reported impressions, recency, privacy filtering, or another indexing/search-demand cause; the export cannot distinguish them. |
| Pages-export URLs outside the production sitemap | 1 | `/insurance/prior-authorization-guide`; a legitimate canonical route that was absent from the production sitemap at export comparison time. |
| Final sitemap | 160 URLs | Six discontinued organization routes and one duplicate printable were removed from the indexable set. |
| Latest coverage row, July 23 | 136 indexed; 5 not indexed | Coverage total is 141 known URLs, not a count of URLs that received impressions. |
| Not-indexed reasons | 3 Page with redirect; 2 Crawled—currently not indexed | The export does not include the example URLs, so exact URL attribution is unavailable. |
| Latest HTTPS row, July 28 | 26 HTTPS; 0 non-HTTPS | This report is not a total-index count and should not be compared directly with 136 indexed URLs. |
| AMP | No data | AMP is not an AdSense approval requirement and no AMP work is recommended. |

## Why 136 indexed URLs and 105 Pages rows differ

The 31-row arithmetic difference is expected because the reports measure different things:

1. Coverage counts known index-status outcomes at the latest reporting date.
2. Performance Pages lists URLs with reportable search activity during the selected performance period.
3. Search Console suppresses some data for privacy and applies different aggregation rules by dimension.
4. Indexed URLs can receive no reportable impressions during the period.
5. A performance row can represent a redirect, non-sitemap URL, URL variant, or page whose index state later changed.

After normalizing the HTTP and HTTPS homepage variants, the Pages export represents 104 unique paths. Of the 167 production sitemap paths, 103 intersect the Pages export and 64 do not. One normalized performance path was outside the production sitemap. This explains the material difference without assuming that every absent or zero-click URL is low value.

## URL-level evidence that informed remediation

The export shows useful pages with impressions but no clicks, including:

- `/tools/student-loan-payment-calculator`: 39 impressions, average position 82.31
- `/healthcare-workers/paycheck-tools`: 6 impressions, average position 6.5
- `/tools/medicare-advantage-plan-helper`: 4 impressions, average position 6.5
- `/insurance/what-medicare-advantage-marketing-may-not-emphasize`: 2 impressions, average position 3.5
- `/newsletter`: 2 impressions, average position 2

The paycheck-tools and Medicare Advantage marketing pages were strengthened because they combined thin rendered copy with visible impressions. The calculator, helper, and newsletter remain indexable because they provide legitimate standalone utility; low or zero clicks alone did not trigger removal.

The export also contains impressions for discontinued organization pages. Those routes were redirected because the connected product records say the organization program is canceled and archive-only, not because of their traffic.

## Remaining live checks

Before resubmission, the owner must open Search Console for the canonical property and confirm:

- Manual Actions: no issues
- Security Issues: no issues
- Page Indexing: no new material error class
- Sitemaps: final sitemap accepted and readable
- HTTPS: no non-HTTPS URLs
- Core Web Vitals and Mobile Usability: no sitewide blocking issue
- URL Inspection: homepage, About, one article, one calculator, and one recently remediated route are eligible for indexing with the intended canonical

Official references: [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en), [Manual Actions](https://support.google.com/webmasters/answer/9044175?hl=en), and [Security Issues](https://support.google.com/webmasters/answer/9044101?hl=en).
