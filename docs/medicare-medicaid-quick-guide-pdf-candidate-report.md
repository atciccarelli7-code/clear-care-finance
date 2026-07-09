# Medicare and Medicaid Quick Guide PDF Candidate Report

Community Acquired Finance  
PDF candidate verification report  
Last updated: 2026-07-09 UTC

## Status

**Current status: PDF-candidate-ready for manual review; not public-release-ready.**

This report documents the safe next step for the 10-page Quick Guide. It does not publish the Quick Guide, unlock a CTA, add a sitemap URL, add QR codes, or place a PDF under a public route.

## Branch and commits

- Branch: `guide-final-pdf-candidate`
- PR: #108
- Builder fix commit: `11ad6bd280577f6c51eff20ba11e7c1a36704f02`
- Report commit: created after the builder fix

## Important builder issue found and fixed

During the candidate review, the quick-guide builder had two release-blocking issues:

1. It rendered a hardcoded cover page and then used `pages.slice(1)`, which skipped the manuscript's `Page 1 — Start Here` body.
2. It split out `# Endnotes and Source Map` but did not render the source map into the PDF candidate.

The builder was updated so that:

- Page 1 now includes the title/cover treatment and the `Start Here` manuscript content.
- Pages 2 through 10 are rendered from the manuscript.
- The Endnotes and Source Map are rendered as an additional source-map page.
- The PDF body avoids `draft`, `preflight`, `file://`, and `docs/generated` text leakage.
- The Chrome call includes `--disable-dev-shm-usage` and a timeout guard.

## Commands/checks performed

Repository-side commands intended for CI/local workstation:

- `npm run guide:quick-content-check`
- `npm run guide:quick-pdf:draft`
- `npm test`
- `npm run build`
- `npm run lint` or existing advisory lint behavior

Connector/local verification performed in this review pass:

- Replicated `npm run guide:quick-content-check` logic against the quick-guide manuscript.
- Generated the quick-guide HTML candidate from the patched builder logic.
- Rendered an inspection PDF from the generated HTML for visual QA.
- Rendered all PDF pages to PNG for page-level inspection.
- Inspected the cover/start page and source-map page.
- Extracted PDF text and searched for blocked leakage terms.

## Generated candidate paths

Expected builder output path:

- HTML: `docs/generated/medicare-medicaid-quick-guide/hospital-discharge-medicare-quick-guide-preflight.html`
- PDF: `docs/generated/medicare-medicaid-quick-guide/hospital-discharge-medicare-quick-guide-preflight.pdf`

These files are candidate/preflight outputs and should **not** be moved to `/public/guides/` until manual review and release approval pass.

## Page count

- Candidate inspection PDF page count: **11 pages**

Reason: the guide keeps the 10 planned content pages and adds an intentional Endnotes and Source Map page. This is acceptable for review because the source map is required for trust and should not be silently dropped.

## Content checklist

| Check | Status | Note |
|---|---:|---|
| PDF opens | Pass | Candidate inspection PDF opened and rendered. |
| Title is clear | Pass | Title renders as `The Hospital Discharge & Medicare Quick Guide`. |
| Disclaimer/review warning visible | Pass | Front page includes educational-only verification language and review-candidate warning. |
| All 10 planned sections present | Pass | Start Here, 5 Misunderstandings, Medicare vs Medicaid, Original Medicare vs Medicare Advantage, Inpatient vs Observation, Before Discharge, Rehab/SNF, Home Health/DME/LTC, Bills/EOBs/MSNs, and Scripts/Next Steps are present. |
| Source notes present | Pass | Each manuscript page retains source-note content. |
| Endnotes/source map present | Pass | Endnotes and Source Map render as an additional source-map page. |
| No `draft` text in rendered PDF body | Pass | Search returned 0 matches in extracted candidate text. |
| No `preflight` text in rendered PDF body | Pass | Search returned 0 matches in extracted candidate text. |
| No `file://` leakage | Pass | Search returned 0 matches in extracted candidate text. |
| No `docs/generated` leakage | Pass | Search returned 0 matches in extracted candidate text. |
| No ads/affiliate/lead-form/ranking/recommendation language | Pass | Search returned 0 matches for blocked sales/ranking terms. |
| No QR images/codes added | Pass | No actual QR code images were added. The guide still warns that final QR/public links should only be added after testing. |
| CTA remains locked | Pass | No CTA change made in this report/fix. |
| Sitemap remains unchanged | Pass | No sitemap change made in this report/fix. |
| Public PDF not committed | Pass | No PDF was committed under `/public/guides/` or `/public/drafts/`. |

## Issues / remaining blockers

The Quick Guide is **not public-release-ready** yet.

Remaining blockers:

1. GitHub/Vercel CI confirmation after this builder fix.
2. Official Chrome-generated artifact from `npm run guide:quick-pdf:draft` on a normal workstation or GitHub Actions environment.
3. Desktop PDF review.
4. iPhone review.
5. Android review if available.
6. Black-and-white print review.
7. Final decision on whether the source-map page remains page 11 or source notes are compressed into a strict 10-page version.
8. CTA unlock only after a final public PDF exists and direct URL testing passes.
9. Sitemap entry only after a real public PDF URL exists and returns 200.
10. QR destination map and scan testing before adding QR codes.

## Release gate state

- Quick Guide manuscript: ready.
- Quick Guide builder: fixed for candidate generation.
- Quick Guide PDF candidate: ready for manual artifact review once generated from the patched builder.
- Public release: blocked.

## Classification

**B. PDF-candidate-ready** for manual review.

Not **C. public-release-ready** because the public PDF, CTA, sitemap, QR codes, device review, and print review are intentionally still blocked.
