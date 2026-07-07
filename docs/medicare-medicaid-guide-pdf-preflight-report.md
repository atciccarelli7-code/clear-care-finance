# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Guide PDF manuscript content parser fix pass  
Last updated: 2026-07-07

## Status

Draft/internal PDF build process remains in controlled pre-release. Public PDF release is **not approved**.

## Latest artifact run reviewed

A corrected manual workflow run succeeded and uploaded the expected artifact:

`medicare-medicaid-guide-preflight-draft`

Run reviewed:

`28861296788`

Job reviewed:

`85600255768`

The run completed all expected steps, including build, file existence checks, public-path guardrail check, manifest creation, and artifact upload.

## Critical issue found in the generated artifact

The artifact generated a PDF, but manual inspection showed that chapter pages rendered mostly as headings and section labels without the manuscript body text.

This means the prior artifact is **not usable for public release**.

Root cause:

The PDF generator parsed the 19 chapter titles, but the section parser failed to reliably extract manuscript sections such as:

- Direct answer
- Plain-English explanation
- Common misunderstanding
- Hospital/caregiver example
- Questions to ask
- Related site tools
- Source note

## Fix made in this pass

Updated:

`/scripts/build-medicare-medicaid-guide-pdf.mjs`

Fixes:

- Added newline normalization before parsing.
- Made chapter title parsing more robust.
- Made section heading parsing more robust.
- Added hard validation for all required chapter sections.
- Changed missing chapter sections from silent empty output into a failed build.
- Added console output showing parsed chapter and worksheet counts.

The workflow should now fail rather than upload a visually misleading PDF if manuscript content is not being extracted correctly.

## Artifact workflow review

Workflow reviewed:

`/.github/workflows/guide-pdf-preflight.yml`

Workflow name:

`Guide PDF Preflight Artifact`

The workflow now:

- runs manually through `workflow_dispatch`,
- checks out the repository,
- sets up Node 20,
- sets up Chrome,
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

## Layout and readability fixes already in place

The generator and print template have already been tightened for likely layout risks:

- family-first cover/subtitle language,
- slightly smaller cover title,
- improved body line-height,
- darker print borders,
- print color adjustment hints,
- safer source-note splitting,
- preserved keep-together behavior for answer/tool blocks,
- increased worksheet row and note space,
- long URL and inline-code wrapping safeguards,
- flowing footers instead of absolute-positioned footers.

## What still requires manual review

The prior successful artifact was rejected because the chapter body content did not render.

After this parser fix is merged, rerun the workflow and manually review the new artifact for:

- chapter body text actually appears,
- cover title fit,
- mobile PDF readability,
- source-note readability,
- endnote/source map density,
- page breaks,
- footer placement,
- QR placeholder placement,
- worksheet spacing,
- black-and-white print quality.

## How to run the corrected workflow

1. Go to GitHub Actions.
2. Run **Guide PDF Preflight Artifact** from `main`.
3. Wait for the workflow to finish successfully.
4. Download `medicare-medicaid-guide-preflight-draft`.
5. Open the draft PDF on desktop.
6. Open the draft PDF on phone.
7. Print sample pages in black and white.
8. Review the manifest file for file size and SHA-256 details.

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

### Content-rendering QA

- [ ] Chapter 1 contains body text under Direct answer.
- [ ] Chapter 1 contains body text under Plain-English explanation.
- [ ] Chapter 1 contains body text under Common misunderstanding.
- [ ] Chapter 1 contains body text under Hospital/caregiver example.
- [ ] Chapter 1 contains body text under Questions to ask.
- [ ] Chapter 1 contains source note text.
- [ ] Randomly check several later chapters for the same pattern.

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

The next release decision can only happen after the parser fix is merged, the GitHub Actions artifact workflow runs again successfully, the artifact is downloaded, and the generated PDF passes manual visual, mobile, print, and content-rendering QA.
