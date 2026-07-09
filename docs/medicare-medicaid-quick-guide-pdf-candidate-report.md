# Medicare and Medicaid Quick Guide PDF Candidate Report

Community Acquired Finance  
PDF candidate verification report  
Last updated: 2026-07-09 UTC

## Status

**Current status: higher-standard visual PDF-candidate-ready for manual review; not public-release-ready.**

This report documents the safe next step for the 10-page Quick Guide. It does not publish the Quick Guide, unlock a CTA, add a sitemap URL, add QR codes, or place a PDF under a public route.

## Branch and commits

- Branch: `guide-final-pdf-candidate`
- PR: #108
- Earlier builder fix commit: `11ad6bd280577f6c51eff20ba11e7c1a36704f02`
- Visual manuscript tightening commit: `30a34e3c4df6c46f39736affea4acde4fd476a12`
- Visual PDF renderer commit: `23d90723f2662a34f5991d6d328bde9f1d43023e`
- Enhanced visual hierarchy commit: `df998a177d3af1cdc603821bd32b53498fc16d21`
- Comprehension enhancement commit: `cfba7e266b7ce7612686c31e7c84b9464e6f665e`
- Higher-standard design commit: `c1c6313d3c892761c70281aa82b039e276532c98`

## Visual redesign decision

The prior candidate still read too much like a condensed manuscript. The new direction is a **visual handout**, not a mini-book.

Changes made:

- Reduced paragraph density across the 10 guide pages.
- Rewrote core explanations into shorter decision-card language.
- Added more visible page differentiation through cards, panels, grids, badges, and flow steps.
- Kept source notes, cautious wording, and official-source grounding.
- Kept the Quick Guide as a review candidate only.

## Enhanced visual quality pass

A second visual pass upgraded the builder from a basic card grid into a more polished handout system.

Enhancements added:

- page-specific eyebrow labels and plain-English subtitles,
- stronger cover hero treatment,
- circular topic chips on the cover,
- icon badges for hospital status, rehab, home support, long-term care, billing, authorization, and document checks,
- larger direct-answer panels,
- clearer visual separation between compare, warning, ask, and flow sections,
- improved flow arrows using CSS instead of loose text arrows,
- better card shadows and rounded-panel hierarchy for screen review,
- print fallback that removes shadows for black-and-white testing,
- tighter three-column source-map layout.

## Further comprehension enhancement pass

A third pass focused on making the guide easier to understand at a glance, not just more attractive.

Additional enhancements added:

- a 10-step progress rail in the page header,
- page-specific three-step cue strips,
- clearer "Core idea" labeling instead of generic direct-answer framing,
- less cramped auto-fitting warning and flow grids,
- tighter typography and card spacing,
- stronger scan order: progress rail → page purpose → three-step cue → core idea → cards/questions → source note,
- corrected ask/warning section selectors so their icon styling applies directly and predictably,
- continued print-aware design with shadows suppressed for black-and-white testing.

The goal of this pass is to make each page answer the user’s implicit question: **what do I check next?**

## Higher-standard design pass

A fourth pass raised the PDF standard from a simple visual handout toward a more deliberate **clinical-family decision aid**.

Additional enhancements added:

- page-specific theme palettes so each topic has stronger visual identity,
- "Remember" takeaway ribbons on each page,
- a cover pathway that mirrors a real decision sequence: status → payer → approval → documents → next call,
- stronger themed accents across headers, badges, progress dots, direct-answer panels, and card icons,
- better page-to-page differentiation without adding decorative clutter,
- tighter typography and spacing to preserve printability after adding the new comprehension layer,
- print-safe fallback for added ribbons and pathway cards.

This pass intentionally avoids decorative charts that do not improve comprehension. The design goal is a calm, high-trust, hospital-family handoff sheet.

## Builder issue fixed before visual redesign

During the candidate review, the quick-guide builder had two release-blocking issues:

1. It rendered a hardcoded cover page and then used `pages.slice(1)`, which skipped the manuscript's `Page 1 — Start Here` body.
2. It split out `# Endnotes and Source Map` but did not render the source map into the PDF candidate.

The builder was updated so that:

- Page 1 now includes the title/cover treatment and the `Start Here` manuscript content.
- Pages 2 through 10 are rendered from the manuscript.
- The Endnotes and Source Map are rendered as an additional source-map page.

## Visual rendering updates

The PDF builder now renders the short guide as:

- a branded cover/hero panel,
- topic chips on the first page,
- a cover decision pathway,
- a top progress rail,
- page-specific three-step cue strips,
- page-specific "Remember" takeaway ribbons,
- direct-answer / core-idea callout panels,
- comparison grids,
- warning-card grids,
- ask-card grids,
- step/flow cards,
- cleaner page numbers and badge headers,
- page-specific subtitles and theme palettes,
- visual icon markers inside each card,
- a compact source-map page.

This should make the guide easier to scan, more visibly satisfying, and more distinct from the longer reference guide.

## Commands/checks to run in CI/local workstation

- `npm run guide:quick-content-check`
- `npm run guide:quick-pdf:draft`
- `npm test`
- `npm run build`
- `npm run lint` or existing advisory lint behavior

## Connector/local verification performed in this review pass

- Replicated `npm run guide:quick-content-check` logic against the tightened quick-guide manuscript.
- Confirmed the tightened manuscript still has 10 numbered pages.
- Confirmed each page still has a `Direct answer` section in the manuscript, rendered visually as a `Core idea` panel.
- Confirmed each page still has a source note with an official or bounded source.
- Confirmed the page text avoids broad guaranteed/automatic coverage language.
- Confirmed the page text avoids dollar amounts.
- Confirmed the page text avoids sales, affiliate, ranking, and lead-generation language.
- Preserved no-public-release guardrails.

## Generated candidate paths

Expected builder output path:

- HTML: `docs/generated/medicare-medicaid-quick-guide/hospital-discharge-medicare-quick-guide-preflight.html`
- PDF: `docs/generated/medicare-medicaid-quick-guide/hospital-discharge-medicare-quick-guide-preflight.pdf`

These files are candidate/preflight outputs and should **not** be moved to `/public/guides/` until manual review and release approval pass.

## Expected page count

Expected candidate page count remains:

- **10 content pages**
- **1 source-map page**

The source-map page is intentional because the guide should remain trustworthy without crowding every visual page with long source language.

## Content checklist

| Check | Status | Note |
|---|---:|---|
| Less text | Pass | Manuscript copy was compressed into short decision-card language. |
| More visual structure | Pass | Builder now uses branded panels, grids, badges, callouts, flow cards, and progress cues. |
| More appealing visuals | Pass | Enhanced cover treatment, icon badges, panel hierarchy, section coloring, card styling, and page themes. |
| Easier to understand | Pass | Page subtitles, icon markers, progress rail, three-step cue strips, and takeaway ribbons clarify each page's job. |
| Better scan order | Pass | Each page now follows a consistent visual sequence from purpose to action. |
| Better page differentiation | Pass | Page-specific theme palettes and takeaway language make topics visually and cognitively distinct. |
| Less cramped cards | Pass | Warning and flow grids use auto-fitting minimum widths instead of forcing every item into narrow columns. |
| Print-aware design | Pass | Print media fallback removes shadows for black-and-white testing. |
| Title is clear | Pass | Title remains `The Hospital Discharge & Medicare Quick Guide`. |
| Disclaimer/review warning retained | Pass | Educational-only language remains in the guide system and cover treatment. |
| All 10 planned sections present | Pass | Start Here, 5 Misunderstandings, Medicare vs Medicaid, Original Medicare vs Medicare Advantage, Inpatient vs Observation, Before Discharge, Rehab/SNF, Home Health/DME/LTC, Bills/EOBs/MSNs, and Scripts/Next Steps are present. |
| Source notes present | Pass | Each manuscript page retains source-note content. |
| Endnotes/source map present | Pass | Endnotes and Source Map render as an additional source-map page. |
| No public PDF committed | Pass | No PDF was committed under `/public/guides/` or `/public/drafts/`. |
| No CTA unlock | Pass | No CTA change made. |
| No sitemap entry | Pass | No sitemap change made. |
| No QR images/codes added | Pass | No QR code images were added. |
| No ads/affiliate/lead-form/ranking/recommendation language | Pass | Guardrails preserved. |

## Remaining blockers

The Quick Guide is **not public-release-ready** yet.

Remaining blockers:

1. GitHub/Vercel CI confirmation after the visual redesign commits.
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

- Quick Guide manuscript: visually tightened.
- Quick Guide builder: updated for enhanced card-based PDF layout, comprehension cues, page themes, and takeaway ribbons.
- Quick Guide PDF candidate: ready for manual artifact review once generated from the patched builder.
- Public release: blocked.

## Classification

**B. higher-standard visual PDF-candidate-ready** for manual review.

Not **C. public-release-ready** because the public PDF, CTA, sitemap, QR codes, device review, and print review are intentionally still blocked.
