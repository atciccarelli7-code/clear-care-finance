# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Draft PDF generation and visual QA pass  
Last updated: 2026-07-06

## Status

Draft/internal build process created. Public PDF release is not approved.

## Decision: do not commit `/public/drafts/*.pdf`

The requested preferred path was:

`/public/drafts/hospital-family-guide-medicare-medicaid-preflight.pdf`

That path is not appropriate for an internal draft in this repo because Vercel serves files under `/public`. A merged PDF at that path would be publicly reachable even if it was not linked from a page or added to the sitemap.

Instead, this pass adds a local draft build process that writes generated files under:

`/docs/generated/medicare-medicaid-guide/`

Generated files are not committed by this PR.

## Files added or changed

- Added: `/scripts/build-medicare-medicaid-guide-pdf.mjs`
- Updated: `/package.json`
- Added: `/docs/medicare-medicaid-guide-pdf-preflight-report.md`

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
  - worksheets,
  - endnotes/source map,
  - QR/tool directory.
- Keeps QR placeholders only.
- Exports a local preflight PDF when Chrome/Chromium/Edge is available.

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

Status: Documented, pending local PDF render review.

Check:

- Cover title fits.
- Direct answer boxes do not clip text.
- Source notes do not overflow.
- Worksheet rows do not cut off labels.
- Endnote URLs do not overflow page width.

Potential issue:

Raw URLs in endnotes may wrap awkwardly. Final PDF may need shorter endnote labels or linked source names instead of visible raw URLs.

### 2. Overlapping boxes

Status: Documented, pending local PDF render review.

Check:

- Direct answer boxes do not overlap body text.
- Misunderstanding callouts do not collide with examples.
- QR placeholders do not collide with related tool text.
- Footer does not overlap long source notes.

Potential issue:

Long source-note blocks may collide with footers if a chapter runs close to the bottom of the page. Final QA should render pages to images and inspect the last quarter of each page.

### 3. Bad page breaks

Status: Documented, pending local PDF render review.

Check:

- Chapter starts begin on new pages.
- Callouts are not split awkwardly across pages.
- Hospital/caregiver examples are not split awkwardly.
- Questions checklists remain readable.
- Worksheet sections mostly remain one page each.

Potential issue:

Some longer chapters may need manual page-break adjustments after the first generated PDF.

### 4. Source-note readability

Status: Documented, pending local PDF render review.

Check:

- Source notes stay at or above 8.5 pt equivalent.
- Source notes are not too faint in grayscale.
- Endnotes are readable when printed.
- Source map does not become a wall of tiny URLs.

Potential issue:

The final public PDF should probably use readable source names and linked URLs rather than exposing every raw URL in long form.

### 5. Worksheet spacing

Status: Documented, pending local PDF render review.

Check:

- Before-discharge checklist has enough room for notes.
- Prior authorization tracker has enough writing space.
- Bill review worksheet has enough writing space.
- Medicaid/LTSS next-step worksheet has enough writing space.

Potential issue:

The generated back matter may need one worksheet per page, with larger blank fields, before public release.

### 6. Mobile PDF viewing

Status: Documented, pending local PDF render review.

Check:

- File opens on iPhone.
- File opens on Android.
- Text remains readable without excessive zooming.
- QR placeholder boxes do not visually dominate.
- Endnotes are not unusable on mobile.

Potential issue:

A print-first guide can be less comfortable on mobile. The landing page should remain the mobile-first entry point even after PDF release.

### 7. Black-and-white printing

Status: Documented, pending local PDF print test.

Check:

- Accent color remains legible in grayscale.
- Callout borders remain visible.
- Direct answer boxes print clearly.
- Worksheet lines print clearly.
- QR placeholders scanability is not applicable yet because final QR codes are not generated.

Potential issue:

Light gray blocks may need slightly darker borders after test printing.

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

4. Render pages to images if available locally:

```bash
python /home/oai/skills/pdfs/scripts/render_pdf.py docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf --out_dir docs/generated/medicare-medicaid-guide/rendered-pages --dpi 200
```

If the local environment does not have that script, use a browser PDF viewer, Preview, Acrobat, or another PDF renderer and inspect pages manually.

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

After local PDF generation and visual inspection, the next build phase should be a controlled public-release prep pass:

- fix layout issues found in preflight,
- create final QR codes only after URL testing,
- place final PDF under a public asset path,
- update the landing page download CTA,
- update sitemap if needed,
- verify the live download.
