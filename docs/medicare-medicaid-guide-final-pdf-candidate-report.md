# Medicare and Medicaid Guide Final PDF Candidate Report

Community Acquired Finance  
Final public PDF candidate pass  
Last updated: 2026-07-07

## Scope

This report documents creation of the first final public PDF candidate for the Medicare/Medicaid guide.

This pass creates a candidate PDF file at the planned public asset path so the preview deployment can test the direct PDF URL.

This pass does not unlock the landing page CTA, add the PDF URL to the sitemap, add QR codes, add ads, add affiliate links, add insurer rankings, add plan recommendations, or add lead forms.

## Source artifact/run used

The candidate was created from the last approved draft artifact:

- Workflow run ID: `28891566086`
- Job ID: `85705318587`
- Branch: `main`
- Commit: `d413994c4fdc639ccde69b2cc095dc543885e658`
- Artifact: `medicare-medicaid-guide-preflight-draft`
- Artifact ID: `8148433307`

Important context: PR #105 and PR #106 were documentation/status/checklist-only. They did not change the active manuscript, PDF builder, route, sitemap, landing page CTA, or public assets. Because the available connector cannot dispatch the manual PDF workflow, this candidate is derived from the previously approved artifact and then adjusted only to replace draft/preflight labels with public-candidate labels.

## Final candidate file

Planned public candidate path:

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

Planned public candidate URL in preview:

`/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

## Candidate PDF checks

Local PDF inspection passed before committing the candidate file.

| Check | Result |
|---|---:|
| PDF opens successfully | Passed |
| Page count | 49 |
| Browser headers/footers | 0 found |
| `file://` paths | 0 found |
| `docs/generated` leakage | 0 found |
| `draft` / `preflight` text | 0 found |
| `Public PDF candidate` cover label | Present |
| `Public candidate` footer label | Present |
| Chapter numbers | 1 through 19 present |
| Worksheets | Present |
| Endnotes and source map | Present |
| QR codes | Not added |
| QR placeholders | Still present |

Rendered spot-check pages:

- cover page,
- disclaimer/table of contents area,
- middle chapter page,
- QR/tool directory page.

## Candidate wording change

The candidate replaces draft/preflight language with public-candidate language.

Cover note now says:

`Public PDF candidate. Do not launch until device, print, QR, CTA, sitemap, and final approval checks pass.`

Footer label now says:

`Public candidate`

QR placeholder boxes remain placeholders. Final QR codes are still not added.

## Files changed in this PR

Expected changed files:

- `/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`
- `/docs/medicare-medicaid-guide-final-pdf-candidate-report.md`
- `/docs/medicare-medicaid-guide-public-release-report.md`

## Release posture

This candidate file is not the same as a full public launch.

The landing page CTA must remain locked in this PR.

The sitemap PDF URL must remain absent in this PR.

QR codes must remain absent in this PR.

## Remaining release blockers

Before full public launch:

- Confirm preview PDF URL returns 200.
- Complete desktop browser review.
- Complete iPhone review.
- Complete Android review if available.
- Complete black-and-white print review.
- Generate final QR codes only after destination URLs are tested.
- Run QR scan testing from phone screen and printed paper.
- Unlock landing page CTA only after the file is verified live.
- Add sitemap PDF URL only after the file is verified live.

## Explicit exclusions

This PR does not add:

- `/public/drafts/` PDF,
- landing page CTA unlock,
- sitemap PDF URL,
- QR codes,
- ads,
- affiliate links,
- insurer rankings,
- plan recommendations,
- lead forms,
- sales language.
