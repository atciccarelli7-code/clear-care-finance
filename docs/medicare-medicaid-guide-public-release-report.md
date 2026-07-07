# Medicare and Medicaid Guide Public Release Report

Community Acquired Finance  
Source-gap closure pass  
Last updated: 2026-07-07

## Release decision

Status: **Not released**.

The final public downloadable PDF is still not being published because release gates remain open.

This is intentional. Do not publish a fake, empty, placeholder, draft, uninspected, or partially sourced PDF.

## What changed in this pass

The national official-source gaps identified in the fact-check report have been materially improved.

Updated files:

- `/docs/medicare-medicaid-guide-source-binder.md`
- `/docs/medicare-medicaid-guide-fact-check.md`

The source binder now includes official-source anchors for:

- Medicare Savings Programs / QMB / SLMB / QI / QDWI,
- Medicare Summary Notice,
- Medicare appeals,
- CMS Medicare-Medicaid coordination,
- CMS coordination of benefits,
- CMS QMB program guidance,
- CMS managed-care appeals and grievances,
- CMS Medicare Outpatient Observation Notice / MOON,
- Medicaid.gov seniors and Medicare-Medicaid enrollees,
- Medicaid.gov estate recovery,
- Medicaid.gov spousal impoverishment.

## Release posture after source-gap closure

The guide is closer to public release, but the source-gap closure pass is **not** the same as final publication approval.

The guide can proceed to final manuscript/editorial cleanup after this pass.

The guide should not proceed directly to public PDF release until the remaining gates below are completed.

## Remaining release blockers

### Editorial and source-note QA

- [ ] Confirm the final pre-PDF manuscript is the active source for PDF generation.
- [ ] Confirm every chapter source note points to the correct source/endnote.
- [ ] Confirm the Medicare Summary Notice and EOB sections use cautious wording.
- [ ] Confirm Medicare Advantage prior authorization language stays neutral and process-focused.
- [ ] Confirm dual-eligibility language distinguishes full Medicaid, limited Medicaid help, QMB, SLMB, QI, and QDWI.
- [ ] Confirm estate recovery and spousal impoverishment are framed only as questions to ask state Medicaid agencies or qualified professionals.
- [ ] Confirm no state-specific Medicaid claim appears without official state Medicaid sourcing.

### Current-year verification

- [ ] Recheck all 2026 Medicare dollar amounts immediately before PDF export.
- [ ] Confirm Part A, Part B, SNF, home health, DME, and drug-cost assistance amounts remain current.
- [ ] Confirm all year-specific claims have visible update discipline.

### PDF artifact QA

- [ ] Run **Guide PDF Preflight Artifact** from GitHub Actions after final manuscript cleanup.
- [ ] Confirm the workflow succeeds.
- [ ] Download `medicare-medicaid-guide-preflight-draft`.
- [ ] Confirm the artifact contains generated HTML, generated PDF, and manifest.
- [ ] Confirm no generated PDF is committed to the repo.
- [ ] Confirm no generated PDF exists under `/public/drafts` or `/public/guides`.
- [ ] Confirm browser headers/footers do not appear in the generated PDF.
- [ ] Confirm full chapter sections, bullets, worksheets, and source notes render.

### Visual, mobile, and print QA

- [ ] Open PDF on desktop browser.
- [ ] Open PDF on iPhone.
- [ ] Open PDF on Android if available.
- [ ] Print cover in black and white.
- [ ] Print one short chapter in black and white.
- [ ] Print one long chapter in black and white.
- [ ] Print one worksheet in black and white.
- [ ] Print source/endnote page in black and white.

### Public launch integration

- [ ] Create final public PDF only after artifact QA passes.
- [ ] Add final PDF to `/public/guides/` only after approval.
- [ ] Unlock landing page download CTA only after the real file exists.
- [ ] Add PDF URL to sitemap only after the real file exists.
- [ ] Generate QR codes only after final live URLs are tested.
- [ ] Test QR codes from phone screen and printed paper.

## Current landing page CTA status

Current landing page CTA status: **Unchanged**.

The guide landing page should continue to use the cautious CTA until the final approved PDF exists at the public asset path.

Do not unlock the public download CTA in this pass.

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

After this source-gap closure PR, the next PR should perform a final editorial/source-note cleanup pass on the active final pre-PDF manuscript before any PDF publication work continues.
