# Medicare and Medicaid Guide Final Manuscript Cleanup Report

Community Acquired Finance  
Final pre-PDF manuscript cleanup pass  
Last updated: 2026-07-07

## Scope

This report documents the final editorial/source-note cleanup pass before public PDF packaging begins.

Files reviewed:

- `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`
- `/docs/medicare-medicaid-guide-source-binder.md`
- `/docs/medicare-medicaid-guide-fact-check.md`
- `/docs/medicare-medicaid-guide-public-release-report.md`
- `/scripts/build-medicare-medicaid-guide-pdf.mjs`

This pass does not publish the guide, add a PDF, add QR codes, unlock the landing page CTA, add a PDF sitemap URL, add ads, add affiliate language, add insurer rankings, add plan recommendations, or add lead forms.

## Active manuscript confirmation

The active source for the draft PDF builder is:

`/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`

The PDF builder reads this path directly through `manuscriptPath` in `/scripts/build-medicare-medicaid-guide-pdf.mjs`.

## Editorial posture

The active manuscript is suitable for a final pre-PDF cleanup stage but is not yet a public release asset.

The manuscript should continue to say that it is pre-release until the following are complete:

1. current-year Medicare dollar amount verification,
2. exact CMS MOON wording/timing review,
3. draft PDF artifact generation,
4. desktop/mobile visual review,
5. black-and-white print review,
6. final QR destination testing,
7. public PDF asset creation,
8. landing page CTA unlock,
9. sitemap update.

## Source-note and endnote cleanup status

The source-note map now reflects the source-gap closure work from PR #102.

### Source areas represented

- Medicare.gov How Medicare Works
- Medicare.gov Original Medicare vs Medicare Advantage comparison
- Medicare.gov Costs
- Medicare.gov Long-Term Care
- Medicare.gov Skilled Nursing Facility Care
- Medicare.gov Home Health Services
- Medicare.gov Durable Medical Equipment
- Medicare.gov Medicare Summary Notice
- Medicare.gov Medicare appeals
- Medicare.gov Medicare Savings Programs
- Medicare.gov health plan options
- CMS Medicare-Medicaid Coordination Office
- CMS Coordination of Benefits
- CMS Qualified Medicare Beneficiary Program
- CMS Managed Care Appeals and Grievances
- CMS Medicare Outpatient Observation Notice / MOON
- Medicaid.gov LTSS
- Medicaid.gov Eligibility Policy
- Medicaid.gov Seniors and Medicare-Medicaid enrollees
- Medicaid.gov Estate Recovery
- Medicaid.gov Spousal Impoverishment
- HealthCare.gov glossary entries for deductible, copayment, coinsurance, out-of-pocket maximum, and allowed amount
- SHIP local Medicare counseling

## Risky-language cleanup status

### Medicaid and dual eligibility

Status: acceptable for final pre-PDF cleanup.

The manuscript should keep careful language that:

- some people have both Medicare and Medicaid,
- exact program status matters,
- full Medicaid, limited Medicaid help, QMB, SLMB, QI, and QDWI are not interchangeable,
- Medicare generally pays first for services covered by both Medicare and Medicaid,
- Medicaid help depends on eligibility, state rules, provider participation, and program category,
- families should verify status with Medicaid, Medicare, SHIP, the plan, or provider.

### Medicare Summary Notice, EOBs, and provider bills

Status: acceptable with caution preserved.

The manuscript should keep careful language that:

- a Medicare Summary Notice is not a bill,
- an EOB or plan document is a comparison tool,
- provider bills should be matched against MSN/EOB/plan paperwork before payment,
- the guide should not decide whether a specific bill is valid,
- families should ask the billing office to explain patient responsibility.

### Observation and MOON

Status: acceptable for final pre-PDF cleanup, with one remaining release blocker.

The manuscript correctly avoids treating observation status as a universal Medicare rule. The final release pass still must verify exact CMS MOON language and timing before public PDF publication.

### Medicare Advantage prior authorization and appeals

Status: acceptable.

The manuscript keeps neutral process language:

- clinician recommendation and plan approval are separate steps,
- prior authorization may be required,
- families should ask whether a request is submitted, approved, denied, pending, or partially approved,
- written decisions, missing documentation, reference numbers, and appeal deadlines matter.

The manuscript should not frame Medicare Advantage as categorically bad or Original Medicare as categorically better.

### Estate recovery and spousal impoverishment

Status: acceptable as caution-only topics.

The manuscript should continue to mention these only as questions to ask state Medicaid agencies or qualified professionals. It should not provide asset-protection, transfer, eligibility-calculation, Medicaid-planning, or legal-planning instructions.

## Worksheet cleanup status

The worksheet section is practical and printable enough for the next draft PDF preflight.

Worksheets reviewed:

- before-discharge checklist,
- rehab facility comparison worksheet,
- prior authorization tracker,
- bill review worksheet,
- Medicaid/LTSS next-step worksheet.

The worksheets remain action-oriented and avoid legal/technical overreach. They ask families to capture facts, documents, dates, status, costs, notices, and next contacts rather than making eligibility or coverage determinations.

## Stale draft-language review

The manuscript still contains pre-release/draft language by design.

This is appropriate because:

- no final public PDF exists,
- QR codes are still placeholders,
- final current-year dollar amount verification has not happened,
- final visual/mobile/print review has not happened,
- the landing page download CTA remains locked.

Do not remove pre-release warnings until the final public PDF path exists and the launch integration PR is ready.

## Manuscript edits made in this pass

No direct manuscript body edits were made in this pass.

Reason: the active manuscript already reflects the source-gap closure posture closely enough for the next phase, and a broad full-manuscript rewrite would create avoidable PDF/parser risk before the next draft artifact run. This pass records the editorial/source-note audit and keeps remaining public-release gates explicit.

The next PR may safely perform narrow text edits if the draft PDF artifact reveals readability, page-break, source-note, or print-layout issues.

## Remaining blockers before public PDF release

- Recheck every 2026 Medicare dollar amount.
- Confirm exact CMS MOON wording and timing.
- Run the draft guide PDF preflight workflow from the current manuscript.
- Inspect generated HTML and PDF artifact.
- Confirm no browser headers/footers appear.
- Confirm all 19 chapters, worksheets, and endnotes render.
- Perform desktop, mobile, and print review.
- Add final QR codes only after live URLs are tested.
- Add final public PDF only after approval.
- Unlock landing page CTA only after the real file exists.
- Add sitemap PDF URL only after the real file exists.

## Non-goals preserved

This cleanup pass does not add:

- public PDF,
- generated PDF,
- `/public/guides/` PDF,
- `/public/drafts/` PDF,
- sitemap PDF URL,
- QR codes,
- landing page CTA unlock,
- ads,
- affiliate links,
- insurer rankings,
- plan recommendations,
- lead forms,
- sales language.

## Next recommended step

Run a fresh draft PDF preflight artifact from the current `main` lineage after this cleanup-report PR passes CI and Vercel preview. The artifact should be inspected for parser preservation, page breaks, source-note rendering, worksheet usability, mobile opening, and black-and-white print readiness before a final public PDF is created.
