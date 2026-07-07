# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Guide PDF artifact review and layout fix pass  
Last updated: 2026-07-07

## Status

Draft/internal PDF build process remains in controlled pre-release. Public PDF release is **not approved**.

## Artifact workflow review

Workflow reviewed:

`/.github/workflows/guide-pdf-preflight.yml`

Workflow name:

`Guide PDF Preflight Artifact`

Available GitHub workflow metadata showed no verified successful run for the latest relevant main commits checked in this pass. Therefore, no generated draft PDF artifact was available for visual inspection from the connector review.

This means the PDF is **not ready for public release**.

## Workflow improvements made in this pass

The GitHub Actions workflow now:

- runs manually through `workflow_dispatch`,
- builds the draft HTML and PDF under `docs/generated/medicare-medicaid-guide/`,
- confirms both generated files exist,
- confirms both generated files are non-empty,
- fails if the generated PDF is unexpectedly small,
- fails if any PDF exists under `/public/drafts` or `/public/guides`,
- creates a `guide-preflight-artifact-manifest.txt`,
- records file sizes, SHA-256 hashes, commit SHA, run ID, and guardrail status,
- uploads the draft HTML, draft PDF, and manifest as one temporary artifact.

Expected artifact name:

`medicare-medicaid-guide-preflight-draft`

Expected artifact contents:

```text
docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.html
docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf
docs/generated/medicare-medicaid-guide/guide-preflight-artifact-manifest.txt
```

## Layout and readability fixes made in this pass

Updated:

- `/scripts/build-medicare-medicaid-guide-pdf.mjs`
- `/docs/medicare-medicaid-guide-print/final-guide-print-template.html`

Fixes:

- Updated cover/subtitle language to match the family-first site positioning.
- Slightly reduced the cover title size to reduce overflow risk.
- Increased body line-height for readability.
- Darkened border color for black-and-white print clarity.
- Added print color adjustment hints for browser PDF export.
- Added safer source-note splitting so long source blocks are less likely to create awkward whitespace.
- Preserved keep-together behavior for tool blocks and key answer boxes.
- Increased worksheet row height and notes area height.
- Kept long URL and inline-code wrapping safeguards.
- Kept flowing footers instead of absolute-positioned footers.

## What this pass could not verify

Because no successful artifact run was verified, this pass did **not** visually inspect a generated PDF.

Still requires manual review:

- cover title fit,
- mobile PDF readability,
- source-note readability,
- endnote/source map density,
- page breaks,
- footer placement,
- QR placeholder placement,
- worksheet spacing,
- black-and-white print quality.

## Local or GitHub Actions generation

Preferred review path:

1. Go to GitHub Actions.
2. Run **Guide PDF Preflight Artifact** from `main`.
3. Download `medicare-medicaid-guide-preflight-draft`.
4. Open the draft PDF on desktop.
5. Open the draft PDF on phone.
6. Print sample pages in black and white.
7. Review the manifest file for file size and SHA-256 details.

Local fallback:

```bash
npm run guide:pdf:draft
```

Expected local outputs:

```text
/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.html
/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf
```

Generated files under `/docs/generated/` are ignored by Git and must not be committed.

## Manual QA checklist

### Visual QA

- [ ] Cover title fits without clipping.
- [ ] Cover subtitle feels professional and family-first.
- [ ] Direct answer boxes do not clip text.
- [ ] Source notes do not overflow.
- [ ] Endnote URLs wrap cleanly.
- [ ] Footer does not overlap long content.
- [ ] Chapter starts begin cleanly on new pages.
- [ ] Callout/example blocks do not split badly.
- [ ] QR placeholders do not collide with tool text.
- [ ] Worksheets have enough writing space.

### Device QA

- [ ] Open PDF on desktop browser.
- [ ] Open PDF on iPhone.
- [ ] Open PDF on Android if available.
- [ ] Confirm the website guide hub remains the better mobile-first experience.

### Print QA

- [ ] Print cover in black and white.
- [ ] Print one short chapter in black and white.
- [ ] Print one long chapter in black and white.
- [ ] Print one worksheet in black and white.
- [ ] Print the source/endnote page in black and white.

### Content QA

- [ ] Recheck current-year Medicare dollar amounts immediately before release.
- [ ] Confirm no state-specific Medicaid claim appears without official state Medicaid sourcing.
- [ ] Confirm estate recovery and spousal impoverishment remain caution topics only.
- [ ] Confirm educational-only disclaimer appears near the front.
- [ ] Confirm source notes and endnotes are readable.

## What this pass does not do

- Does not commit a generated PDF.
- Does not add a file under `/public/drafts`.
- Does not add a file under `/public/guides`.
- Does not publish or link a downloadable guide.
- Does not change the public landing page CTA.
- Does not add the PDF to the sitemap.
- Does not generate final QR codes.
- Does not add ads, affiliate links, insurer rankings, lead forms, or plan recommendations.

## Current release decision

The PDF remains **not public**.

The next release decision can only happen after the GitHub Actions artifact workflow runs successfully, the artifact is downloaded, and the generated PDF passes manual visual, mobile, and print QA.
