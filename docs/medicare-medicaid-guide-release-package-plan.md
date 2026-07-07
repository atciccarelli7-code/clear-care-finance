# Medicare and Medicaid Guide Release Package Plan

Community Acquired Finance  
Release package foundation  
Last updated: 2026-07-07

## Goal

Build the Medicare and Medicaid guide into a release-quality offering, not just a downloadable PDF.

The public product should feel like a calm, trustworthy family decision kit for discharge, rehab, home health, long-term care, Medicaid, Medicare Advantage authorization, and confusing medical bills.

## Current status

### Completed foundation

- Family-first public guide hub exists at `/guides/medicare-medicaid-rehab-long-term-care`.
- Manuscript exists with 19 chapters and practical chapter structure.
- Worksheets are specified in the manuscript.
- PDF build script exists.
- Manual GitHub Actions artifact workflow exists.
- PR #100 was merged after the branch-correct artifact run passed PDF preflight.
- The latest inspected artifact fixed the prior browser header/footer leak and preserved full manuscript sections.

### Still not public-release-ready

The final public PDF should remain unpublished until these gates are completed:

1. Missing official source gaps are closed.
2. Final manuscript gets one editorial pass for plain-English clarity and no overclaiming.
3. Final PDF asset is generated from the approved manuscript.
4. The PDF is reviewed on desktop, iPhone, and printed black-and-white pages.
5. Final QR destinations are verified on live URLs.
6. Sitemap and landing page CTA are updated only after the real public PDF exists.

## Product shape

The guide offering should include five connected parts.

### 1. Public guide hub

Purpose: the SEO and user entry point.

Must include:

- situation pathways,
- family scripts,
- connected calculators,
- connected articles,
- download status,
- source/trust notes,
- clear disclaimers,
- no insurer rankings,
- no affiliate language,
- no lead-form pressure.

### 2. Final PDF guide

Purpose: the printable family handoff.

Must include:

- cover,
- disclaimer,
- 19 practical chapters,
- worksheets,
- scripts,
- source notes/endnotes,
- update log,
- QR/tool directory,
- visible last-updated date.

Preferred final public path:

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

### 3. Worksheet pack

Purpose: the action layer.

Should eventually be extractable as standalone printables:

- before-discharge checklist,
- rehab facility comparison worksheet,
- skilled care vs custodial care worksheet,
- prior authorization tracker,
- bill review worksheet,
- Medicaid/LTSS next-step worksheet.

### 4. Connected tools

Purpose: turn reading into practical next questions.

Connected tools:

- `/medicare-care-costs#cost-estimator`,
- `/tools/eob-to-bill-match-checker`,
- `/tools/out-of-pocket-max-estimator`,
- `/tools/medicare-advantage-plan-helper`.

### 5. Supporting article cluster

Purpose: search coverage and deeper explanations.

Core cluster:

- `/articles/does-medicare-cover-long-term-care`,
- `/articles/does-medicare-cover-rehab-after-hospital-stay`,
- `/articles/medicare-vs-medicaid-what-is-the-difference`,
- `/articles/why-do-i-still-owe-money-with-medicare`,
- `/articles/observation-vs-inpatient-status`,
- `/articles/prior-authorization-explained`,
- `/articles/discharge-coverage-guide`,
- `/articles/how-to-read-an-eob`.

## Source gaps to close before final release

The fact-check report identifies these as the main unresolved source gaps:

| Topic | Required action |
|---|---|
| Dual eligibility and payment coordination | Add official Medicare/CMS/Medicaid source language. |
| Full Medicaid vs limited Medicaid assistance | Add official Medicare Savings Program / QMB / SLMB / QI / QDWI source language. |
| Medicare Summary Notice | Add official Medicare source language. |
| EOB and provider billing | Add official Medicare/CMS or consumer billing source language, or soften claims. |
| Observation notice / MOON | Add official CMS or Medicare source language. |
| Appeals and denials | Add official Medicare and Medicare Advantage appeals source language. |
| State Medicaid LTSS | Keep state-specific claims out of the national guide unless sourced to the state. |
| Current-year dollar amounts | Recheck immediately before public PDF release and annually. |

## Release sequence

### Phase 1 — Safety foundation

Status: started.

- Merge PDF parser/header-footer guardrail PR.
- Add standard CI for PRs and pushes to `main`.
- Keep guide PDF artifact workflow separate and manual until final release process is stable.

### Phase 2 — Source gap closure

Next content PR.

- Add official source entries for dual eligibility, MSP/QMB, Medicare Summary Notice, MOON, and appeals.
- Update manuscript source notes chapter by chapter.
- Soften or remove any claim that is practical but not officially sourced.

### Phase 3 — Final manuscript pass

- Remove draft language.
- Tighten chapter titles.
- Add source/endnote references consistently.
- Confirm the guide still reads like a family help document, not a government manual.

### Phase 4 — Final PDF package

- Generate final PDF artifact.
- Review visual layout, page breaks, source notes, worksheets, mobile opening, and print output.
- Create final public PDF only after review passes.

### Phase 5 — Public launch integration

- Add public PDF file to `/public/guides/`.
- Enable landing page download CTA.
- Add PDF to sitemap only after the file exists.
- Add tested QR codes to final PDF.
- Verify live page, PDF, tools, and articles on mobile.

### Phase 6 — Promotion package

- Create launch post copy for Facebook, LinkedIn, and short-form excerpts.
- Create a plain-language “send this to your family” caption.
- Create a healthcare-worker explainer post.
- Avoid clickbait and avoid implying the guide can decide coverage.

## Quality bar

This guide should be judged against these standards:

- Accurate enough to protect trust.
- Simple enough for a stressed family member.
- Practical enough to use during a phone call.
- Cited enough to survive scrutiny.
- Clean enough to print.
- Calm enough to match the Community Acquired Finance brand.

## Non-goals

Do not add:

- plan rankings,
- insurer recommendations,
- affiliate CTAs,
- lead-broker language,
- fake urgency,
- state-specific Medicaid instructions without state source verification,
- legal-planning instructions beyond recommending qualified help.

## Immediate next PR after this foundation

The next PR should close the official-source gaps and update manuscript source notes before any public PDF release work continues.
