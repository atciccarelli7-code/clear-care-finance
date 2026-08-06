# Hospital Financial Assistance flagship release

Date: 2026-08-06

Status: release candidate; update with PR, merge, deployment, and production smoke evidence at release

## Released product scope

- Upgraded the existing `/tools/financial-assistance-checklist` route into an eight-step, one-question-at-a-time Hospital Financial Assistance & Medical Bill Relief Finder.
- Added a national hub, a complete North Carolina hub, eight reviewed North Carolina systems, and ten additional major nonprofit systems.
- Added current 2026 HHS poverty-guideline screening for the contiguous states/DC, Alaska, and Hawaii.
- Added bounded free-care, discounted-care, hardship, verification, insufficient-information, stale-policy, insured-ambiguity, and provider-exclusion states.
- Added entered facts, next actions, documentation, billing questions, missing information, verification, warnings, official sources, last review, copy, download, and print/save-as-PDF output.
- Preserved privacy by keeping answers in temporary component state and excluding sensitive/answer data from analytics and My Plan.
- Added canonical hubs and policy routes, breadcrumb/WebPage structured data, internal navigation, footer/patient discovery links, a permanent finder alias redirect, and a regenerated sitemap.
- Reused the existing itemized-bill, EOB, facility/professional fee, and multiple-bill resources instead of creating competing pages.

## Launch dataset

North Carolina: Atrium Health, Novant Health, Duke Health, UNC Health, WakeMed, ECU Health, Cone Health, and Mission Health.

Outside North Carolina: Cleveland Clinic Ohio, Mass General Brigham, Johns Hopkins Medicine, Mayo Clinic, UPMC, Stanford Health Care, Cedars-Sinai, Northwestern Medicine, Mount Sinai Health System, and Providence Oregon.

## Validation before release

- Focused policy and component tests: pass.
- Full repository suite: 119 files and 679 tests pass on the final local release candidate.
- TypeScript: pass.
- Lint: zero errors; inherited warnings only.
- Full build/governance/publication/premium/privacy/content/SEO: pass.
- Bundle: 499.83 KiB entry, below the fixed 500 KiB budget; full policy records remain lazy-loaded.
- Prerender/search: 181 canonical routes, 4 controlled noindex routes, 2 private denial shells, 39 permanent redirects, and zero search-readiness warnings.
- Database migrations: none.

## Known limits

The finder is not a national directory, eligibility determination, application submission, hospital representative, debt-defense service, or source of medical/legal/tax advice. Hospital sites and policies can change. Separate providers may bill outside a hospital policy. Users must verify deadlines and should not ignore legal or insurer deadlines while an application is pending.
