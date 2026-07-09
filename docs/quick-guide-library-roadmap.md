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
| 2 | The Turning 65 Medicare Sign-Up Quick Guide | Pre-PDF manuscript drafted | High-intent search topic; natural next step for Medicare library. |
| 3 | The Medicaid Application Quick Guide | Pre-PDF manuscript drafted | High-need family/caregiver topic; must be state-cautious and source-grounded. |
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

## Future technical work

The current PDF builder is optimized around the hospital discharge quick guide. Before public release of the Medicare sign-up and Medicaid application guides, build a reusable quick-guide PDF generator that accepts a guide definition such as:

- title,
- subtitle,
- slug,
- source manuscript path,
- output HTML path,
- output PDF path,
- public PDF path,
- page theme map,
- guide-specific source checks.

Avoid cloning the hospital-discharge script into multiple nearly identical builders unless speed is more important than maintainability.

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
- sitemap entry is added only after the URL works,
- QR codes are added only after destination testing.

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
