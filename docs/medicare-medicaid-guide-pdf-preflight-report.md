# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Guide PDF full-section parser fix pass  
Last updated: 2026-07-07

## Status

Draft/internal PDF build process remains in controlled pre-release. Public PDF release is **not approved**.

## Latest artifact run reviewed

A parser-fixed manual workflow run succeeded and uploaded the expected artifact:

`medicare-medicaid-guide-preflight-draft`

Run reviewed:

`28871797546`

Job reviewed:

`85636262114`

The run completed all expected steps, including build, file existence checks, public-path guardrail check, manifest creation, and artifact upload.

## Issue found in the generated artifact

The artifact generated a PDF with real chapter body text, which was progress from the prior blank-section artifact.

However, manual inspection showed another release-blocking parser issue: each manuscript section appeared to include only the first paragraph or first bullet.

Examples observed:

- Chapter 1 showed the first `Questions to ask` bullet, but not the full question list.
- Chapter 1 showed the first related tool, but not the full tool list.
- Multi-paragraph explanation sections appeared shortened.

This means the artifact is **not usable for public release**.

## Root cause

The previous parser used a regular expression with multiline behavior that allowed section extraction to stop too early. The build succeeded because every section had at least some content, but the content was incomplete.

## Fix made in this pass

Updated:

`/scripts/build-medicare-medicaid-guide-pdf.mjs`

Fixes:

- Replaced the regex-based section extraction with a line-by-line section parser.
- Extracts all lines from a matching `##` section until the next `##` heading or chapter divider.
- Preserves multi-paragraph sections.
- Preserves full bullet lists.
- Adds a question-list validation guard so chapters with fewer than two question bullets fail the build.
- Keeps the required-section validation already added in the prior pass.

The workflow should now fail rather than upload a misleading PDF if section extraction truncates chapter lists.

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
- preserved keep-together behavior for answer/tool blocks,
- increased worksheet row and note space,
- long URL and inline-code wrapping safeguards,
- flowing footers instead of absolute-positioned footers.

## What still requires manual review

After this full-section parser fix is merged, rerun the workflow and manually review the new artifact for:

- full chapter body text appears,
- full question lists appear,
- full related-tool lists appear,
- multi-paragraph explanation sections appear,
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

Generated files under `/docs/generated/` are ignored by Git and must not be committed.

## Manual QA checklist

### Content-rendering QA

- [ ] Chapter 1 contains body text under Direct answer.
- [ ] Chapter 1 contains the full Plain-English explanation.
- [ ] Chapter 1 contains body text under Common misunderstanding.
- [ ] Chapter 1 contains body text under Hospital/caregiver example.
- [ ] Chapter 1 contains the full Questions to ask list.
- [ ] Chapter 1 contains the full Related site tools list.
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

The next release decision can only happen after this full-section parser fix is merged, the GitHub Actions artifact workflow runs again successfully, the artifact is downloaded, and the generated PDF passes manual visual, mobile, print, and content-rendering QA.
