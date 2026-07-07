# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Draft PDF generation and visual QA pass  
Last updated: 2026-07-06

## Status

Draft/internal build process created and tightened. Public PDF release is not approved.

## Decision: do not commit `/public/drafts/*.pdf`

The requested preferred path was:

`/public/drafts/hospital-family-guide-medicare-medicaid-preflight.pdf`

That path is not appropriate for an internal draft in this repo because Vercel serves files under `/public`. A merged PDF at that path would be publicly reachable even if it was not linked from a page or added to the sitemap.

Instead, the draft build process writes generated files under:

`/docs/generated/medicare-medicaid-guide/`

Generated files are ignored by Git and are not committed by this workflow.

## Files added or changed

- Added/updated: `/scripts/build-medicare-medicaid-guide-pdf.mjs`
- Updated: `/package.json`
- Updated: `.gitignore`
- Updated: `/docs/medicare-medicaid-guide-pdf-preflight-report.md`
- Updated: `/docs/medicare-medicaid-guide-print/final-guide-print-template.html`

## Local draft PDF generation command

Run:

```bash
npm run guide:pdf:draft
```

Expected generated outputs:

```text
/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.html
/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf
```

The script uses only Node built-ins plus a local Chrome, Chromium, or Microsoft Edge installation. If the browser cannot be found, set one of these environment variables:

```bash
CHROME_PATH=/path/to/chrome npm run guide:pdf:draft
```

or

```bash
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome npm run guide:pdf:draft
```

## What the script does

- Reads `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`.
- Parses the 19 chapter headings.
- Converts each chapter into a print HTML structure.
- Preserves the visual hierarchy:
  - chapter title,
  - direct answer box,
  - plain-English explanation,
  - common misunderstanding callout,
  - hospital/caregiver example,
  - questions checklist,
  - related tools,
  - QR placeholder,
  - source note.
- Adds front matter:
  - cover,
  - disclaimer,
  - how to use this guide,
  - table of contents.
- Adds back matter:
  - dedicated worksheet pages,
  - endnotes/source map,
  - QR/tool directory.
- Keeps QR placeholders only.
- Exports a local preflight PDF when Chrome/Chromium/Edge is available.

## Fixes made in the preflight-fix pass

### 1. Long source-note handling

Improved:

- Source notes now use smaller but still readable text.
- Source blocks use `overflow-wrap: anywhere` so long source strings can wrap.
- Source blocks are marked with soft keep-together behavior to reduce awkward splits.

Remaining manual QA:

- Inspect the final source/endnote pages after local PDF export.
- If source pages feel too dense, convert raw URLs into named linked sources before public release.

### 2. Raw URL wrapping

Improved:

- Inline code and URL-like strings now use `overflow-wrap: anywhere` and `word-break: break-word`.
- Related-tool routes and source URLs should wrap instead of overflowing page width.

Remaining manual QA:

- Check long CMS/Medicaid URLs in the rendered endnote section.
- Confirm browser/PDF export preserves readable wrapping.

### 3. Footer overlap risk

Improved:

- The generator and final template no longer rely on absolutely positioned footers.
- Footers now sit in document flow with margin above them.
- This reduces the risk that long source notes or callout boxes overlap the footer.

Remaining manual QA:

- Confirm footers still look acceptable visually.
- Confirm long chapters do not create lonely footer lines or odd page endings.

### 4. Page-break control

Improved:

- Headings use `break-after: avoid` / `page-break-after: avoid`.
- Chapter pages still begin on new pages.
- Callout, example, tool, and source blocks use keep-together behavior where practical.
- Paragraphs use basic widow/orphan controls.

Remaining manual QA:

- Inspect long chapters for awkward page breaks.
- Some chapters may still need manual forced page breaks after actual PDF rendering.

### 5. Worksheet spacing

Improved:

- Worksheets are parsed into dedicated pages instead of being compressed into one back-matter page.
- Worksheet rows have larger minimum height.
- Rows use a two-column label/notes layout.

Remaining manual QA:

- Confirm each worksheet has enough room for handwriting.
- Consider expanding the most important worksheets into two pages if the public version feels cramped.

### 6. Table of contents readability

Improved:

- The generated table of contents now uses one column instead of two.
- TOC items have slightly more spacing.
- The final static print template mirrors this one-column approach.

Remaining manual QA:

- Add final page numbers only after pagination is stable.

### 7. Mobile PDF readability

Improved:

- Cover title size is slightly reduced.
- Body line-height is slightly increased.
- Source and code wrapping are safer on narrow/mobile PDF viewers.

Remaining manual QA:

- Open the generated PDF on iPhone and Android.
- Confirm the landing page remains the better mobile-first version while the PDF remains print-first.

### 8. Black-and-white print clarity

Improved:

- Border and muted text colors were made slightly darker.
- Accent blocks remain light but clearer in grayscale.
- Worksheet lines and callout borders are more likely to print visibly.

Remaining manual QA:

- Print the cover, one chapter, one worksheet, and one source page in black and white.
- If light gray blocks are still too faint, darken `--line` and reduce `--soft` brightness.

## What this pass does not do

- Does not commit a generated PDF.
- Does not add a file under `/public/drafts`.
- Does not publish or link a downloadable guide.
- Does not change the public landing page CTA.
- Does not add the PDF to the sitemap.
- Does not generate final QR codes.
- Does not add ads, affiliate links, insurer rankings, lead forms, or plan recommendations.

## Preflight checklist to run after local export

### 1. Clipped text

Status: Improved in CSS; still requires local PDF render review.

Check:

- Cover title fits.
- Direct answer boxes do not clip text.
- Source notes do not overflow.
- Worksheet rows do not cut off labels.
- Endnote URLs do not overflow page width.

### 2. Overlapping boxes

Status: Improved by removing absolute footer positioning; still requires local PDF render review.

Check:

- Direct answer boxes do not overlap body text.
- Misunderstanding callouts do not collide with examples.
- QR placeholders do not collide with related tool text.
- Footer does not overlap long source notes.

### 3. Bad page breaks

Status: Improved with heading and block break controls; still requires local PDF render review.

Check:

- Chapter starts begin on new pages.
- Callouts are not split awkwardly across pages.
- Hospital/caregiver examples are not split awkwardly.
- Questions checklists remain readable.
- Worksheet sections mostly remain one page each.

### 4. Source-note readability

Status: Improved with wrapping and readable source-note sizing; still requires print review.

Check:

- Source notes stay readable.
- Source notes are not too faint in grayscale.
- Endnotes are readable when printed.
- Source map does not become a wall of tiny URLs.

### 5. Worksheet spacing

Status: Improved with one worksheet per page and larger writing rows; still requires print review.

Check:

- Before-discharge checklist has enough room for notes.
- Prior authorization tracker has enough writing space.
- Bill review worksheet has enough writing space.
- Medicaid/LTSS next-step worksheet has enough writing space.

### 6. Mobile PDF viewing

Status: Improved modestly; still requires device review.

Check:

- File opens on iPhone.
- File opens on Android.
- Text remains readable without excessive zooming.
- QR placeholder boxes do not visually dominate.
- Endnotes are not unusable on mobile.

### 7. Black-and-white printing

Status: Improved with darker borders and muted text; still requires print test.

Check:

- Accent color remains legible in grayscale.
- Callout borders remain visible.
- Direct answer boxes print clearly.
- Worksheet lines print clearly.
- QR placeholders scanability is not applicable yet because final QR codes are not generated.

## Recommended local QA workflow

1. Run:

```bash
npm run guide:pdf:draft
```

2. Open:

```text
docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf
```

3. Print at least these pages in black and white:

- cover,
- one short chapter,
- one long chapter,
- one worksheet,
- source/endnotes page.

4. Inspect on mobile:

- iPhone PDF viewer,
- Android PDF viewer if available,
- desktop browser PDF viewer.

5. Fix remaining issues in the generator/template before any public release PR.

## Release gate after this pass

Do not move any PDF into `/public` until:

- the draft PDF is visually inspected,
- clipping and overlap issues are fixed,
- QR codes are generated from final tested URLs,
- all QR codes scan from printed paper,
- the PDF is approved for public release,
- the landing page CTA is updated in a separate PR,
- sitemap changes are handled intentionally.

## Next recommended phase

After a local PDF is generated and visually inspected, the next build phase should be controlled release preparation:

- address any remaining manual QA issues,
- create final QR codes only after URL testing,
- place the final approved PDF under a public asset path,
- update the landing page download CTA,
- update the sitemap if needed,
- verify the live download.
