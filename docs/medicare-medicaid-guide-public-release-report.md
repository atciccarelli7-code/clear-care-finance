# Medicare and Medicaid Guide Public Release Report

Community Acquired Finance  
Guide PDF manuscript content parser fix pass  
Last updated: 2026-07-07

## Release decision

Status: **Not released**.

The final public downloadable PDF is not being published because the release gates are not fully satisfied.

This is intentional. Do not publish a fake, empty, placeholder, draft, or uninspected PDF.

## Latest artifact run reviewed

A manual run of **Guide PDF Preflight Artifact** succeeded after the workflow install fix.

Reviewed run:

`28861296788`

Reviewed job:

`85600255768`

Artifact created:

`medicare-medicaid-guide-preflight-draft`

The workflow completed the expected build, file existence checks, public-path guardrail check, manifest creation, and artifact upload.

## Release-blocking issue found

The generated artifact was downloaded and inspected.

The artifact contained:

- generated HTML,
- generated PDF,
- artifact manifest.

The PDF was not acceptable for public release because chapter pages rendered mostly as headings and labels without the manuscript body text.

This means the PDF generator produced a technically successful artifact, but the artifact failed content-rendering QA.

## Parser fix made

Updated:

`/scripts/build-medicare-medicaid-guide-pdf.mjs`

Fixes:

- Added newline normalization before parsing.
- Made chapter title parsing more robust.
- Made section heading parsing more robust.
- Added required-section validation for every chapter.
- Changed missing manuscript sections from silent blank PDF output into a failed build.
- Added console output showing parsed chapter and worksheet counts.

After this fix, the workflow should fail rather than upload a misleading PDF if chapter body text is not being extracted correctly.

## Workflow/process improvements now in place

The corrected artifact workflow:

- checks out the repository,
- sets up Node 20,
- sets up Chrome,
- builds the draft HTML and PDF under `docs/generated/medicare-medicaid-guide/`,
- verifies the generated HTML exists and is non-empty,
- verifies the generated PDF exists and is non-empty,
- fails if the generated PDF is unexpectedly small,
- fails if any PDF exists under `/public/drafts` or `/public/guides`,
- writes a manifest file with file sizes, SHA-256 hashes, commit SHA, run ID, and guardrail status,
- uploads the draft HTML, draft PDF, and manifest together.

Artifact name remains:

`medicare-medicaid-guide-preflight-draft`

## PDF layout status

The generator and print template were tightened in prior passes for likely layout risks before artifact review.

Improvements already made:

- family-first cover/subtitle language,
- slightly smaller cover title,
- improved body line-height,
- darker print borders,
- print color adjustment hints,
- safer source-note splitting,
- preserved keep-together behavior for answer/tool blocks,
- increased worksheet row and note space,
- continued long URL/code wrapping,
- continued flowing footers instead of absolute-positioned footers.

These are preflight improvements only. They do **not** prove the final PDF is visually ready.

## Final PDF asset path

Preferred final public path:

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

Current status: **Not created**.

Reason:

- The prior artifact failed content-rendering QA.
- The parser fix needs to be merged and rerun.
- A final approved PDF has not been visually inspected.
- Manual print and mobile PDF review are still pending.
- QR codes have not been generated from tested live URLs.
- It would be dishonest to publish a placeholder or draft file at the final public path.

## Landing page CTA status

Current landing page CTA status: **Unchanged**.

The guide landing page still uses the cautious CTA:

`Download guide — source review in progress`

This should remain unchanged until the final approved PDF exists at the public asset path.

The landing page keeps the Medicare cost exposure tool as the secondary CTA:

`/medicare-care-costs#cost-estimator`

## Sitemap status

Sitemap status: **Unchanged**.

No final PDF asset exists, so no PDF URL was added to `/public/sitemap.xml`.

The guide landing page remains the public discoverable asset:

`https://communityacquiredfinance.com/guides/medicare-medicaid-rehab-long-term-care`

## QR status

QR status: **Not final**.

No QR codes were generated in this pass.

Do not place QR codes in the public PDF until:

1. The final guide PDF URL exists.
2. The landing page works on mobile.
3. The Medicare cost tool URL works on mobile.
4. The EOB-to-bill checker URL works on mobile.
5. The long-term care article URL works on mobile.
6. The rehab article URL works on mobile.
7. QR codes scan from a phone screen.
8. QR codes scan from printed paper.

## Remaining manual QA items

Before public release, complete these checks:

### Artifact generation

- [ ] Rerun **Guide PDF Preflight Artifact** from GitHub Actions after the parser fix is merged.
- [ ] Confirm the workflow succeeds.
- [ ] Download `medicare-medicaid-guide-preflight-draft`.
- [ ] Confirm the artifact contains the generated HTML.
- [ ] Confirm the artifact contains the generated PDF.
- [ ] Confirm the artifact contains `guide-preflight-artifact-manifest.txt`.
- [ ] Review artifact file sizes and SHA-256 hashes.
- [ ] Confirm no generated PDF is committed to the repo.
- [ ] Confirm no generated PDF exists under `/public/drafts` or `/public/guides`.

### Content-rendering QA

- [ ] Confirm Chapter 1 has real body text under every expected section.
- [ ] Confirm several later chapters have real body text under every expected section.
- [ ] Confirm related tools and source notes render.
- [ ] Confirm worksheets render.
- [ ] Confirm endnotes/source map renders.

### Visual QA

- [ ] Check cover title fit.
- [ ] Check cover subtitle tone.
- [ ] Check direct answer boxes for clipping.
- [ ] Check source notes for overflow.
- [ ] Check raw URL wrapping.
- [ ] Check footer overlap.
- [ ] Check page breaks in short chapters.
- [ ] Check page breaks in long chapters.
- [ ] Check callout and example block splits.
- [ ] Check source/endnote readability.
- [ ] Check worksheet spacing.

### Device and print QA

- [ ] Open PDF on desktop browser.
- [ ] Open PDF on iPhone.
- [ ] Open PDF on Android if available.
- [ ] Print cover in black and white.
- [ ] Print one short chapter in black and white.
- [ ] Print one long chapter in black and white.
- [ ] Print one worksheet in black and white.
- [ ] Print source/endnote page in black and white.

### Content QA

- [ ] Recheck current-year Medicare dollar amounts immediately before release.
- [ ] Confirm no state-specific Medicaid claim appears without official state Medicaid sourcing.
- [ ] Confirm estate recovery and spousal impoverishment remain caution topics only.
- [ ] Confirm educational-only disclaimer appears near the front.
- [ ] Confirm source notes and endnotes are readable.

## Monetization and trust guardrails

Confirmed for this pass:

- No ads added.
- No affiliate links added.
- No insurer rankings added.
- No lead forms added.
- No plan recommendations added.
- No sales language added.
- No hospital, employer, insurer, Medicare, Medicaid, CMS, state agency, or professional-organization endorsement implied.

## Release criteria for the next pass

The next pass may publish the final PDF only if all of the following are true:

1. The parser-fixed GitHub Actions artifact workflow has run successfully.
2. The generated draft PDF artifact has been downloaded and inspected.
3. The PDF passes content-rendering QA.
4. The PDF passes manual visual QA.
5. The PDF passes black-and-white print QA.
6. The PDF passes mobile viewing QA.
7. QR codes are generated from tested live URLs.
8. QR codes scan from printed paper.
9. A real final PDF is placed under:
   `/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`
10. The landing page CTA is changed to link to the final PDF.
11. The sitemap is updated intentionally only after the final PDF exists.
12. A final public-release report confirms the asset path, CTA, sitemap, QR status, and trust guardrails.

## Conclusion

This pass fixes the parser issue that allowed an artifact to succeed while chapter body content was missing. The guide is still not ready for public PDF release. The correct next move is to merge this parser fix, rerun the manual GitHub Actions artifact workflow from `main`, download the new draft PDF artifact if it succeeds, and complete content-rendering, visual, mobile, and print QA.
