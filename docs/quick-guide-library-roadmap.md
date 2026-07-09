# Quick Guide Library Roadmap

Community Acquired Finance  
Last updated: 2026-07-09

## Purpose

Build a repeatable library of short, calm, printable healthcare-finance quick guides for patients, caregivers, families, and healthcare workers.

The library should feel like:

- Robinhood-level simplicity,
- healthcare-worker credibility,
- source-grounded caution,
- practical next steps,
- no spam, no ranking, no affiliate pressure.

## Product standard

Every quick guide should answer one urgent viewer question:

> What should I check next?

Every quick guide should include:

1. Direct answer.
2. Who this is for.
3. Five-step path or decision sequence.
4. Documents to gather or questions to ask.
5. Mistakes to avoid.
6. Scripts for calls.
7. Official source note on each page.
8. Endnotes/source map.
9. Desktop, phone, and black-and-white print review before public release.
10. No ads, affiliate links, lead forms, insurer rankings, plan recommendations, or sales language.

## Build queue

| Priority | Guide | Status | Why it matters |
|---:|---|---|---|
| 1 | The Hospital Discharge & Medicare Quick Guide | Public launch-review PDF committed | First flagship quick guide; connects discharge, rehab, Medicaid, long-term care, and bills. |
| 2 | The Turning 65 Medicare Sign-Up Quick Guide | Preflight-only manuscript drafted | High-intent search topic; natural next step for Medicare library. |
| 3 | The Medicaid Application Quick Guide | Preflight-only manuscript drafted | High-need family/caregiver topic; must be state-cautious and source-grounded. |
| 4 | Medicare or Medicaid? Start Here Quick Guide | Planned | Prevents users from starting with the wrong program assumption. |
| 5 | Still Working at 65? Medicare Questions to Ask | Planned | Valuable employer-benefits topic with high confusion and high financial stakes. |
| 6 | Denied Medicaid or Lost Medicaid Quick Guide | Planned | Helps users preserve options after a denial, renewal issue, or coverage loss. |

## Current implementation

- Public guide library route: `/guides`
- Redirect route: `/quick-guides` → `/guides`
- Current live guide hub: `/guides/medicare-medicaid-rehab-long-term-care`
- Current public PDF path: `/guides/hospital-discharge-medicare-quick-guide.pdf`

## New manuscript files

- `docs/medicare-sign-up-quick-guide-pre-pdf-manuscript.md`
- `docs/medicaid-application-quick-guide-pre-pdf-manuscript.md`

## Current technical system

Quick-guide PDF generation now uses a shared definition-driven system:

- `scripts/quick-guide-definitions.mjs` owns guide ids, titles, slugs, source manuscripts, generated HTML/PDF paths, public-path eligibility, route metadata, page theme maps, and required source cues.
- `scripts/check-quick-guide-content.mjs` checks one guide or `all` for 10 pages, direct answers, source notes, endnotes/source map, official-source cues, blocked sales/ranking language, dollar amounts, and unapproved destination-marker language.
- `scripts/build-quick-guide-pdf.mjs` builds one guide or `all` into `docs/generated`.
- `scripts/build-medicare-medicaid-quick-guide-pdf.mjs` and `scripts/check-medicare-medicaid-quick-guide-content.mjs` remain compatibility wrappers for the hospital discharge guide.
- `.github/workflows/ci.yml` runs the standard guide checks plus `npm run guide:quick-content-check:all`.
- `.github/workflows/guide-pdf-preflight.yml` builds and uploads separate quick-guide preflight artifacts for the hospital discharge, Medicare sign-up, and Medicaid application guides.

Only `public/guides/hospital-discharge-medicare-quick-guide.pdf` is approved for public launch review. The Medicare sign-up and Medicaid application quick-guide PDFs remain preflight-only under `docs/generated` until they pass manual review and get a separate release decision.

## Useful commands

Run the original hospital discharge quick-guide content check:

```bash
npm run guide:quick-content-check
```

Run all quick-guide content checks:

```bash
npm run guide:quick-content-check:all
```

Build the original hospital discharge quick-guide draft PDF:

```bash
npm run guide:quick-pdf:draft
```

Build all quick-guide preflight PDFs:

```bash
npm run guide:quick-pdf:draft:all
```

Run the full standard validation path:

```bash
npm run guide:content-check
npm run guide:quick-content-check
npm run guide:quick-content-check:all
npm test
npm run build
```

## Release gates for each future guide

Do not publish a new quick guide PDF until:

- manuscript has 10 pages plus source map,
- every page has a direct answer,
- every page has a source note,
- current rules are checked against official sources,
- no dollar amounts are used unless freshly verified,
- no sales/ranking/affiliate language appears,
- PDF artifact workflow succeeds,
- desktop review passes,
- iPhone review passes,
- black-and-white print review passes,
- final public PDF URL returns 200 after deployment,
- public discovery changes are reviewed only after the URL works,
- destination-marker work is handled separately after destination testing.

## SEO architecture

Guide-library cluster should eventually include:

- `/guides`
- `/guides/medicare-medicaid-rehab-long-term-care`
- `/guides/medicare-sign-up`
- `/guides/medicaid-application`
- `/guides/medicare-or-medicaid-start-here`
- `/guides/still-working-at-65-medicare`
- `/guides/denied-medicaid-next-steps`

Each public guide should link to:

- a PDF download,
- a related calculator/tool,
- 3-5 related articles,
- official-source map,
- disclosures.

## Editorial rule

The library should not act like an insurance broker. It should act like a calm, credible healthcare-worker explainer that helps the reader ask better questions before signing, paying, enrolling, or appealing.
