# Medicare and Medicaid Quick Guide Release Plan

Community Acquired Finance  
Two-tier guide offering plan  
Last updated: 2026-07-08

## Decision

Add a short public-facing quick guide as the front door to the larger Medicare/Medicaid guide system.

Public positioning:

- **Quick guide:** The Hospital Discharge & Medicare Quick Guide.
- **Full guide:** The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care.

The quick guide should be easier to advertise, download, skim, print, and send to a family member. The full guide remains the deeper reference for families who need more context, worksheets, source notes, and connected tools.

## Product ladder

1. **Quick Guide** — 10-page plain-English starting point.
2. **Full Guide** — deeper printable family reference.
3. **Worksheets** — action layer for discharge, rehab, bills, authorization, and Medicaid/LTSS questions.
4. **Connected tools** — cost estimator, EOB-to-bill checker, out-of-pocket estimator, and Medicare Advantage helper.
5. **Supporting articles** — search coverage and deeper plain-English explanations.

## Quick Guide purpose

The quick guide should help a family ask the first right questions during discharge planning, rehab or skilled nursing facility decisions, home health or equipment setup, long-term care confusion, Medicare Advantage authorization, and confusing bills or Medicare Summary Notices.

It should not try to teach every Medicare/Medicaid detail. It should route readers to the full guide, official sources, SHIP, plan documents, billing offices, state Medicaid agencies, or qualified professionals when the situation is specific.

## Quick Guide structure

The pre-PDF quick guide manuscript is stored at:

`docs/medicare-medicaid-quick-guide-pre-pdf-manuscript.md`

Current planned pages:

1. Start Here.
2. The 5 Misunderstandings.
3. Medicare vs Medicaid.
4. Original Medicare vs Medicare Advantage.
5. Inpatient vs Observation.
6. Before Discharge.
7. Rehab and Skilled Nursing Facility Care.
8. Home Health, Equipment, and Long-Term Care.
9. Bills, EOBs, and Medicare Summary Notices.
10. Scripts and Next Steps.

## Build and check scripts

Package scripts:

- `npm run guide:quick-content-check`
- `npm run guide:quick-pdf:draft`

The standard test command now runs both guide content checks before Vitest:

- `npm run guide:content-check`
- `npm run guide:quick-content-check`
- `vitest run`

## Quality bar

The quick guide should be judged by whether it is short enough to advertise, accurate enough to protect trust, simple enough for a stressed family member, useful during a phone call, printable in black and white, source-cautious, clearly educational, and connected to the full guide and tools without becoming a sales funnel.

## Guardrails

Do not publish the quick guide until content check, draft PDF generation, desktop review, phone review, black-and-white print review, source-note review, and destination testing are complete.

Do not add public PDF files, sitemap entries, QR codes, ads, affiliate links, lead forms, insurer rankings, plan recommendations, fake urgency, or state-specific Medicaid instructions without state source verification.

## Launch positioning

Primary public CTA after approval:

> Download the free 10-page Hospital Discharge & Medicare Quick Guide.

Secondary CTA:

> Need more detail? Use the full Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care.

Plain-English promise:

> Built to help families ask better questions before discharge, rehab, long-term care decisions, or paying a confusing medical bill.

## Public release sequence

1. Finish quick guide source review.
2. Generate draft quick guide PDF.
3. Review desktop, phone, and black-and-white print output.
4. Create final quick guide public PDF in a separate launch PR.
5. Add quick guide CTA to the guide hub.
6. Add full guide CTA only when the full guide is also public-ready.
7. Add sitemap URLs only after the public files exist.

## Current status

Pre-release source and builder exist. No public quick guide PDF has been committed. No CTA has been unlocked. No sitemap entry has been added.
