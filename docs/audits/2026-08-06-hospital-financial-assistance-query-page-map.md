# Hospital Financial Assistance query-to-page map

Date: 2026-08-06

Canonical property: `sc-domain:communityacquiredfinance.com`

Product scope: Hospital Financial Assistance & Medical Bill Relief Finder

## Evidence boundary

The latest directly available settled Search Console evidence is the owner-provided export reconciled on 2026-07-29. It reports 13 headline clicks and 1,139 impressions; the Pages dimension reports 14 clicks and 1,593 impressions across 105 rows because Search Console applies dimension-specific aggregation and privacy filtering. The earlier medical-bill baseline reported 8 clicks, 871 impressions, 0.918% CTR, and average position 54.88, including 10 impressions at average position 4.8 for the existing hospital-financial-assistance resource. These are small, lagged baselines—not current demand totals or evidence of causality.

The available export does not provide a current query-to-page join for this product. Current public search-result review and primary-source availability therefore informed intent architecture, while every unobserved query remains a target hypothesis rather than a claimed ranking opportunity.

## Canonical ownership

| Intent or query family | Canonical page | Evidence and action | Cannibalization control |
|---|---|---|---|
| hospital financial assistance; hospital charity care; hospital financial assistance income limits | `/medical-bills/financial-assistance` | National product hub; direct answer, verified-system directory, methodology, source freshness, and tool entry | Owns broad discovery and directory intent; does not duplicate a hospital-specific policy |
| hospital financial assistance finder; charity care calculator/checker | `/tools/financial-assistance-checklist` | Existing indexed tool route upgraded into the full guided finder | `/tools/hospital-financial-assistance-finder` permanently redirects here; no second indexable tool |
| North Carolina hospital financial assistance; NC hospital charity care income limit | `/hospital-financial-assistance/north-carolina` | Complete state hub using current NCDHHS statewide terms plus eight reviewed systems | Owns statewide rules; system pages own facility-specific policy details |
| `[hospital/system] financial assistance policy/application/income limit` | `/hospital-financial-assistance/:hospitalSlug` | Eighteen pages with unique official policy, application, thresholds, providers, deadlines, contact, limitations, and dates | Published only for reviewed primary-source records; no mass-generated facility pages |
| financial assistance before paying a hospital bill | `/articles/check-hospital-financial-assistance-before-paying` | Existing explanatory article retained because its intent is education before action | Links into the canonical tool; does not serve as the policy directory |
| itemized hospital bill; review hospital bill charges | `/tools/medical-bill-review-flow` and `/insurance/medical-bill-review-toolkit` | Existing guided bill-review flow and complete response system | No new itemized-bill article was created; finder links to the established workflow |
| EOB versus medical bill | `/tools/eob-to-bill-match-checker` | Existing purpose-built comparison tool | Finder links to this tool instead of duplicating EOB logic |
| facility fee versus professional fee | `/articles/facility-fee-vs-professional-fee` | Existing focused article | Retained as the canonical fee-type explanation |
| multiple bills from one hospital visit | `/articles/why-one-hospital-visit-can-create-multiple-bills` | Existing focused article | Retained as the canonical multi-provider explanation |
| financial assistance with insurance; documents; overdue/collections; denial | `/medical-bills/financial-assistance` plus finder result sections | The product result adapts actions, documents, collection warnings, insured ambiguity, questions, and verification items | Consolidated into the product/hub for launch; separate pages require future query/page evidence and unique utility |

## Search Console opportunity classification

| Classification | Available evidence | Release response |
|---|---|---|
| Position 5–20 | Existing hospital-financial-assistance resource: 10 impressions, average position 4.8 (slightly above the requested band); facility/professional fee: 26 impressions, average position 18 | Preserve indexed routes, strengthen the product journey, and link the fee explainer into results |
| Impressions with weak CTR | Hospital financial assistance: 10 impressions and no reported click in the earlier baseline; EOB explainer: 52 impressions at average position 73.13 | Upgrade product utility without promising CTR lift; preserve the existing EOB canonical tool/article ecosystem |
| Cannibalization | Existing tool route, a broad explanatory article, and adjacent medical-bill toolkit overlap semantically but serve different jobs | Retain distinct intent ownership; redirect only the alternate finder alias; do not redirect the article or toolkit |
| Missing landing pages | Broad national policy directory, North Carolina state hub, and verified system-level policy pages were absent | Add one hub, one state hub, and 18 reviewed policy records; stop there until source and performance evidence justify expansion |
| Consolidate rather than duplicate | Itemized bills, EOB matching, facility/professional bills, and multiple-bill education already exist | Link existing resources from hub and result; do not create competing pages |

## Post-release review

After 30 full days of stable production exposure, export Search Console Queries and Pages for 7-day, 28-day, and 3-month windows and join by the canonical families above. Review positions 5–20, high-impression/low-CTR rows, new query overlap, and excluded/duplicate URLs. Do not split a consolidated intent into a new page until the query, user job, and unique source-backed value are all distinguishable.
