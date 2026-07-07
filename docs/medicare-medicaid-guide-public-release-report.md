# Medicare and Medicaid Guide Public Release Report

Community Acquired Finance  
Draft PDF artifact QA pass  
Last updated: 2026-07-07

## Release decision

Status: **Not released**.

The final public downloadable PDF is still not being published because release gates remain open.

## What changed in recent passes

### Source-gap closure

The national official-source gaps identified in the fact-check report were materially improved.

Updated files:

- `/docs/medicare-medicaid-guide-source-binder.md`
- `/docs/medicare-medicaid-guide-fact-check.md`

### Final manuscript cleanup audit

The final pre-PDF manuscript cleanup audit confirmed:

- `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md` is the active manuscript path read by the PDF builder.
- Source-note posture now reflects the source-gap closure work.
- Risky language areas remain appropriately cautious for a final pre-PDF artifact pass.
- Worksheet sections remain practical and printable.
- Pre-release/draft warnings should stay in place until a final public PDF exists.

Cleanup audit file:

- `/docs/medicare-medicaid-guide-final-manuscript-cleanup-report.md`

### Draft PDF artifact QA

A fresh **Guide PDF Preflight Artifact** workflow was run from `main` after PR #103.

Reviewed run:

`28891566086`

Reviewed job:

`85705318587`

Commit:

`d413994c4fdc639ccde69b2cc095dc543885e658`

Artifact:

`medicare-medicaid-guide-preflight-draft`

Draft artifact QA confirmed:

- workflow succeeded,
- artifact contained generated HTML, generated PDF, and manifest,
- generated PDF opened successfully,
- generated PDF was 49 pages,
- no Chrome/browser headers or footers were found,
- no `file://` paths were found,
- no `docs/generated` leakage was found,
- 19 chapter headings were present,
- worksheets were present,
- endnotes/source map was present,
- QR placeholders were present,
- draft/preflight language remained visible,
- no generated PDF was committed,
- no PDF exists under `/public/drafts` or `/public/guides`.

Detailed artifact QA file:

- `/docs/medicare-medicaid-guide-pdf-preflight-report.md`

## Release posture after draft artifact QA

The guide is closer to public release, but the draft artifact QA pass is **not** final publication approval.

The guide can proceed to final release-readiness planning and current-year verification.

## Remaining release blockers

### Editorial and source-note QA

- [x] Confirm the final pre-PDF manuscript is the active source for PDF generation.
- [x] Confirm source-note posture reflects the source-gap closure work.
- [x] Confirm the Medicare Summary Notice and EOB sections use cautious wording.
- [x] Confirm Medicare Advantage prior authorization language stays neutral and process-focused.
- [x] Confirm dual-eligibility language distinguishes full Medicaid, limited Medicaid help, QMB, SLMB, QI, and QDWI.
- [x] Confirm estate recovery and spousal impoverishment are framed only as questions to ask state Medicaid agencies or qualified professionals.
- [x] Confirm no state-specific Medicaid claim appears without official state Medicaid sourcing.

### PDF artifact QA

- [x] Run **Guide PDF Preflight Artifact** from GitHub Actions after final manuscript cleanup.
- [x] Confirm the workflow succeeds.
- [x] Download `medicare-medicaid-guide-preflight-draft`.
- [x] Confirm the artifact contains generated HTML, generated PDF, and manifest.
- [x] Confirm no generated PDF is committed to the repo.
- [x] Confirm no generated PDF exists under `/public/drafts` or `/public/guides`.
- [x] Confirm browser headers/footers do not appear in the generated PDF.
- [x] Confirm full chapter sections, bullets, worksheets, and source notes render.

### Current-year verification

- [ ] Recheck all 2026 Medicare dollar amounts immediately before final PDF export.
- [ ] Confirm Part A, Part B, SNF, home health, DME, and drug-cost assistance amounts remain current.
- [ ] Confirm all year-specific claims have visible update discipline.
- [ ] Confirm exact CMS MOON wording and timing before publication.

### Visual, mobile, and print QA

- [ ] Open PDF on desktop browser as final public-candidate file.
- [ ] Open PDF on iPhone.
- [ ] Open PDF on Android if available.
- [ ] Print cover in black and white.
- [ ] Print one short chapter in black and white.
- [ ] Print one long chapter in black and white.
- [ ] Print one worksheet in black and white.
- [ ] Print source/endnote page in black and white.

### Public launch integration

- [ ] Create final public PDF only after artifact QA and final verification pass.
- [ ] Add final PDF to `/public/guides/` only after approval.
- [ ] Unlock landing page download CTA only after the real file exists.
- [ ] Add PDF URL to sitemap only after the real file exists.
- [ ] Generate QR codes only after final live URLs are tested.
- [ ] Test QR codes from phone screen and printed paper.

## Current landing page CTA status

Current landing page CTA status: **Unchanged**.

The guide landing page should continue to use the cautious CTA until the final approved PDF exists at the public asset path.

## Sitemap status

Sitemap status: **Unchanged for PDF URL**.

The guide landing page remains discoverable, but no PDF URL should be added until the final PDF exists.

## Final PDF asset path

Preferred final public path:

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

Current status: **Not created**.

## Non-goals preserved

This pass does not add:

- public PDF,
- public draft PDF,
- sitemap PDF URL,
- QR codes,
- landing page download unlock,
- ads,
- affiliate links,
- insurer rankings,
- plan recommendations,
- lead forms,
- sales language.

## Next recommended PR

After this draft PDF artifact QA documentation PR, the next step should be a final release-readiness PR focused on current-year Medicare dollar amount verification, exact CMS MOON wording/timing verification, device/print QA plan, final QR destination plan, and public launch integration sequencing.
