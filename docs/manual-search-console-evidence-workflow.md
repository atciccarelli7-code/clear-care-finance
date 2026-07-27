# Manual Google Search Console evidence workflow

Last updated: July 27, 2026

## Operating decision

Community Acquired Finance does not require GSC Wizard. Its free trial ended, and a recurring $20 monthly subscription is not justified at the site's current traffic and revenue stage.

Google Search Console remains the source of truth. Evidence enters the CAF operating system through dated manual exports stored in Google Drive.

## Cadence

Use a manual export:

- before the August 4 and August 18 scheduled journey reviews;
- after a material indexing or sitemap incident;
- before a search-focused implementation sprint;
- otherwise no more than weekly while traffic is low.

Do not create busywork by exporting daily low-volume data.

## Required exports

From Google Search Console Performance → Search results, export the same 28-day window for:

1. Queries
2. Pages
3. Countries, only when geographic interpretation is materially useful
4. Devices, only when mobile/desktop differences affect a decision

Also capture dated evidence for:

- Page indexing summary and affected URLs;
- sitemap submission and last-read status;
- Core Web Vitals summary;
- manual actions and security issues, when present.

## File naming

Use explicit dates and windows:

```text
CAF_GSC_Queries_28d_through_YYYY-MM-DD.csv
CAF_GSC_Pages_28d_through_YYYY-MM-DD.csv
CAF_GSC_Indexing_YYYY-MM-DD.pdf
CAF_GSC_Sitemaps_YYYY-MM-DD.pdf
```

Never label a file `latest`, `current`, or `final`.

## Google Drive location

Store exports in the existing CAF Google Drive operating area. Do not place emails, user identifiers, account IDs, or unrelated browser screenshots in the search evidence folder.

## Dashboard update

Update the CAF Growth & Revenue Operating Dashboard using observed values only:

- Executive Scorecard: organic clicks and non-brand clicks when classification is available;
- Search Baseline: page/query opportunities with snapshot date and exact window;
- Weekly Funnel: organic clicks for the appropriate week only when the export supports that window;
- Experiment Log: title, internal-link, or indexing changes and their decision date.

Blank means `UNVERIFIED`, not zero.

## Prioritization rules

Prioritize, in order:

1. indexing failures affecting canonical product or high-intent pages;
2. pages with impressions and weak or zero clicks;
3. average positions approximately 8–30;
4. queries that map to an existing canonical decision journey;
5. internal-link and first-answer improvements;
6. title/meta changes only when the search evidence supports the intent mismatch.

Do not create overlapping articles merely because a query exists. First determine whether an existing page can satisfy the intent more clearly.

## Comparison discipline

Every search conclusion must include:

- export end date;
- window length;
- whether the value is page-level or query-level;
- whether brand/non-brand classification is available;
- counts before percentages when volume is low;
- any page/query join limitation.

Do not compare different window lengths as though they are equivalent.

## Owner workflow

1. Open Google Search Console.
2. Select `communityacquiredfinance.com`.
3. Set Search type to Web.
4. Set Date to the required 28-day window.
5. Export Queries and Pages to Google Sheets or CSV.
6. Upload or retain the files in the CAF Drive operating area.
7. Record the snapshot date in the dashboard.
8. Run the search-opportunity review from the dated export.

This workflow replaces the paid connector dependency without reducing evidence quality.
