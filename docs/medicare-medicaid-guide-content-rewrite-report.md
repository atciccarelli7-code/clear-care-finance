# Medicare and Medicaid Guide Source-Backed Content Rewrite Report

Community Acquired Finance  
PR #108 continuation pass  
Last updated: 2026-07-08

## Status

Content rewrite pass completed on the draft `guide-final-pdf-candidate` branch. This report does not publish the PDF, unlock the landing page CTA, add the PDF URL to the sitemap, add QR codes, add ads, add affiliate links, add insurer rankings, add lead forms, add plan recommendations, or add sales language.

## Chapters rewritten

The active manuscript `docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md` was revised with a source-cautious clarity pass across the high-risk chapters flagged in the content audit:

- Chapter 4 — Medicare vs Medicaid
- Chapter 6 — Original Medicare vs Medicare Advantage
- Chapter 7 — What Medicare Does Not Cover
- Chapter 8 — Why Medicare Can Pay and You Still Owe
- Chapter 9 — Inpatient vs Observation
- Chapter 10 — What to Ask Before Discharge
- Chapter 11 — Rehab After a Hospital Stay
- Chapter 12 — Skilled Nursing Facility Care
- Chapter 13 — Home Health and Durable Medical Equipment
- Chapter 15 — Long-Term Care and Medicaid
- Chapter 16 — Dual Eligibility
- Chapter 17 — Medicare Advantage Prior Authorization
- Chapter 18 — Bills, EOBs, Medicare Summary Notices, and Scripts

Adjacent wording in Chapters 1-3 was also tightened where the old text could imply payment based on need alone.

## Source-risk language softened

The rewrite preserved the guide's educational posture and tightened high-risk claims:

- Medicare vs Medicaid now distinguishes federal Medicare from state-administered Medicaid under federal rules, without implying Medicaid is only for long-term care.
- Dual eligibility now states that Medicaid help depends on eligibility category, state rules, provider participation, plan structure, and service type.
- QMB billing protection now stays tied to Medicare-covered Part A and Part B services/items and related cost-sharing.
- Original Medicare vs Medicare Advantage now distinguishes non-emergency network rules, yearly limits, Medigap incompatibility with Medicare Advantage, and prior authorization for certain services/supplies.
- SNF language now explicitly separates skilled SNF care from long-term custodial care and identifies the Original Medicare 3-day inpatient stay rule while preserving waiver/plan caveats.
- Observation language now avoids broad claims and keeps the issue tied to specific downstream rules, especially Original Medicare SNF coverage.
- Home health language now clarifies part-time/intermittent skilled care and separates Medicare-covered home health from full-time custodial support.
- Long-term care language now treats estate recovery and spousal impoverishment as questions for qualified/state sources, not DIY legal planning.
- Prior authorization language now avoids implying every Medicare Advantage service requires approval.
- Billing language now treats MSN/EOB documents as comparison tools, not final bill adjudication.

## Checks performed in this pass

Connector-side static content check was replicated against the same logic used by `scripts/check-medicare-medicaid-guide-content.mjs`:

- 19 chapter headings found.
- Every chapter retains a `Questions to ask` section.
- No route-only bullets appear inside `Questions to ask`.
- High-risk chapters retain official-source source notes.
- No broad `guaranteed coverage`, `guarantees coverage`, `will automatically cover`, or `automatically pays` language remains.

## Checks still requiring GitHub/Vercel confirmation

Because this pass was made through the GitHub connector rather than a checked-out local repository, the following should be confirmed by GitHub Actions and/or a follow-up local run:

- `npm run guide:content-check`
- `npm test`
- `npm run build`
- `npm run lint` or existing advisory lint
- optional draft PDF artifact workflow after content review

## Public release blockers still open

Do not publish the PDF yet. Remaining blockers:

- GitHub Actions confirmation for test/build status after the content rewrite commit.
- Fresh draft PDF artifact generated from the revised manuscript.
- PDF visual review for page breaks, source-note rendering, visuals, worksheets, and awkward whitespace.
- iPhone review.
- Android review if available.
- Black-and-white print review.
- Exact CMS MOON wording and timing verification before final release.
- Current-year Medicare dollar amount verification immediately before final export.
- QR destination map and scan testing before adding QR codes.
- Final public PDF upload in a later PR only.
- CTA unlock only after the final file exists.
- Sitemap PDF URL only after the final file exists.

## Morning review note

This PR should remain draft until CI passes, the draft PDF artifact is regenerated, and device/print review has been completed. The guide is closer to content-ready, but it is not public-release-ready.
