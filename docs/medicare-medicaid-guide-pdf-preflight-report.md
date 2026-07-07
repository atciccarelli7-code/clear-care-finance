# Medicare and Medicaid Guide PDF Preflight Report

Community Acquired Finance  
Post-PR #103 draft artifact QA pass  
Last updated: 2026-07-07

## Status

Draft/internal PDF build process remains in controlled pre-release.

Public PDF release is **not approved**.

This report documents the fresh draft artifact generated after:

- PR #100: PDF parser/header-footer guardrails,
- PR #101: standard CI and release package plan,
- PR #102: official source-gap closure,
- PR #103: final pre-PDF manuscript cleanup audit.

## Latest artifact run reviewed

Workflow name:

`Guide PDF Preflight Artifact`

Workflow run ID:

`28891566086`

Job ID:

`85705318587`

Branch used:

`main`

Commit used:

`d413994c4fdc639ccde69b2cc095dc543885e658`

Artifact name:

`medicare-medicaid-guide-preflight-draft`

Artifact ID:

`8148433307`

Artifact digest:

`sha256:28237bb74ee6360af88dddaca609a565d4da2dfa44c9d422733bafc885195c1a`

Artifact expires:

`2026-07-21T19:06:26Z`

## Workflow result

Status: **Passed**.

The workflow completed all expected steps:

- checkout,
- Node setup,
- Chrome setup,
- draft PDF build into `docs/generated/medicare-medicaid-guide/`,
- generated HTML/PDF existence check,
- generated file size check,
- public-path PDF guardrail check,
- artifact manifest creation,
- artifact upload.

The workflow checked out `main` at commit `d413994c4fdc639ccde69b2cc095dc543885e658`.

## Artifact contents inspected

Downloaded artifact:

`medicare-medicaid-guide-preflight-draft-run-28891566086.zip`

Artifact contents:

```text
hospital-family-guide-medicare-medicaid-preflight.html
hospital-family-guide-medicare-medicaid-preflight.pdf
guide-preflight-artifact-manifest.txt
```

File sizes from local artifact inspection:

```text
hospital-family-guide-medicare-medicaid-preflight.html — 80,294 bytes
hospital-family-guide-medicare-medicaid-preflight.pdf — 413,264 bytes
guide-preflight-artifact-manifest.txt — 1,060 bytes
```

Manifest-reported generated file sizes:

```text
HTML: 79K
PDF: 404K
```

Manifest-reported checksums:

```text
HTML: 304a9eda2b01a965ffa844162efa37e37b2db090d982191a9cd4e9cd0544bb56
PDF:  a5453b4d99d6d9c2f224c40be83851cf587d94e4ca17937accbc98d9e454eb76
```

## PDF inspection result

PDF opens successfully.

PDF metadata / structure:

```text
Pages: 49
Page size: Letter
Encrypted: no
Form: none
PDF version: 1.4
```

Text extraction succeeded.

Text extraction checks:

| Check | Result |
|---|---:|
| `file://` paths | 0 found |
| `docs/generated` leakage | 0 found |
| Chrome/browser date headers | 0 found |
| browser/footer path leakage | 0 found |
| `CHAPTER` headings | 19 found |
| Chapter numbers present | 1 through 19 |
| `Worksheet` text | present |
| `Endnotes and source map` | present |
| `QR PLACEHOLDER` | present |
| `Draft preflight` language | present |

Rendered-page spot check:

- cover page renders,
- educational disclaimer renders,
- table of contents renders,
- early chapters render,
- middle chapters render,
- Chapter 19 renders,
- worksheet pages render,
- endnote/source map page renders,
- QR/tool directory renders with placeholders.

## Content-rendering QA result

Status: **Passed for draft artifact QA**.

Confirmed:

- 19 chapters render.
- Chapter content is not blank.
- Multi-paragraph sections are preserved.
- Question lists are preserved.
- Related site tool lists are preserved.
- Worksheet section is present.
- Endnotes/source map section is present.
- QR placeholders remain placeholders.
- Draft/preflight warnings remain visible.

## Public-path guardrail result

Status: **Passed**.

Manifest says:

```text
public/drafts: directory does not exist
public/guides: directory does not exist
```

Additional repo checks confirmed the expected public PDF paths were not present:

```text
/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf
/public/drafts/hospital-family-guide-medicare-medicaid-preflight.pdf
```

## Landing page and sitemap status

Landing page CTA status: **Still locked**.

The guide hub still uses a disabled download button with the label:

`Download guide — source review in progress`

Sitemap status: **No public PDF URL added**.

The sitemap includes the guide hub URL but does not include the final public PDF URL.

## Issues found

No release-blocking artifact-generation issue was found in this pass.

No browser headers, browser footers, `file://` paths, or generated-path leakage were found.

The generated artifact is suitable for the next controlled review stage.

## Remaining release blockers

The artifact passing draft QA is **not** the same as approving public PDF release.

Remaining blockers before public launch:

- Recheck every 2026 Medicare dollar amount immediately before final export.
- Confirm exact CMS MOON wording and timing before final publication.
- Open the PDF on desktop browser using the final public candidate file.
- Open the PDF on iPhone.
- Open the PDF on Android if available.
- Print sample pages in black and white.
- Confirm print readability for cover, a short chapter, a long chapter, a worksheet, and the source/endnote page.
- Replace QR placeholders only after final live URLs are verified.
- Create final public PDF only after artifact and visual QA pass.
- Add final public PDF to `/public/guides/` only after approval.
- Unlock landing page download CTA only after the real public file exists.
- Add sitemap PDF URL only after the real public file exists.

## Explicit exclusions

This pass does not add:

- public PDF,
- generated PDF commit,
- `/public/guides/` PDF,
- `/public/drafts/` PDF,
- sitemap PDF URL,
- final QR codes,
- landing page CTA unlock,
- ads,
- affiliate links,
- insurer rankings,
- plan recommendations,
- lead forms,
- sales language.

## Current release decision

The draft PDF artifact now passes the controlled artifact QA gate.

The PDF remains **not public**.

The next step is a final release-readiness pass focused on current-year amount verification, MOON wording verification, device/print QA, final QR planning, and final public-PDF integration planning.
