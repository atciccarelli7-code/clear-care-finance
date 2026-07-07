# Medicare and Medicaid Guide Public Release Report

Community Acquired Finance  
Guide PDF workflow install fix pass  
Last updated: 2026-07-07

## Release decision

Status: **Not released**.

The final public downloadable PDF is not being published because the release gates are not fully satisfied.

This is intentional. Do not publish a fake, empty, placeholder, draft, or uninspected PDF.

## Latest workflow failure reviewed

A manual run of **Guide PDF Preflight Artifact** failed before the PDF artifact was created.

Failure step:

`Install dependencies`

Root cause:

`npm ci` failed because `package.json` and `package-lock.json` are out of sync. The log showed missing package-lock entries for `@react-email/render`, `resend`, and related transitive dependencies.

Result:

- No PDF artifact was uploaded.
- There was nothing to download from the failed run.
- The failure was not caused by the user clicking the wrong place.

## Workflow fix made

The guide PDF artifact workflow no longer installs project dependencies.

Reason:

- The PDF generator script uses Node built-in modules and Chrome/Chromium.
- It does not import installed npm packages.
- Dependency installation is unnecessary for this workflow.
- Removing `npm ci` lets the workflow test the PDF generator directly.

This does **not** fix the broader app-level lockfile mismatch. That should be handled separately if other workflows or builds require `npm ci`.

## Artifact workflow status

Workflow reviewed:

`/.github/workflows/guide-pdf-preflight.yml`

Workflow name:

`Guide PDF Preflight Artifact`

Current status: **Corrected workflow pending rerun**.

After this fix is merged, rerun the workflow from `main`.

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

The generator and print template were tightened in the prior pass for likely layout risks before artifact review.

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

- The corrected workflow still needs to be rerun.
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

- [ ] Rerun **Guide PDF Preflight Artifact** from GitHub Actions after the workflow install fix is merged.
- [ ] Confirm the workflow succeeds.
- [ ] Download `medicare-medicaid-guide-preflight-draft`.
- [ ] Confirm the artifact contains the generated HTML.
- [ ] Confirm the artifact contains the generated PDF.
- [ ] Confirm the artifact contains `guide-preflight-artifact-manifest.txt`.
- [ ] Review artifact file sizes and SHA-256 hashes.
- [ ] Confirm no generated PDF is committed to the repo.
- [ ] Confirm no generated PDF exists under `/public/drafts` or `/public/guides`.

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

1. The corrected GitHub Actions artifact workflow has run successfully.
2. The generated draft PDF artifact has been downloaded and inspected.
3. The PDF passes manual visual QA.
4. The PDF passes black-and-white print QA.
5. The PDF passes mobile viewing QA.
6. QR codes are generated from tested live URLs.
7. QR codes scan from printed paper.
8. A real final PDF is placed under:
   `/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`
9. The landing page CTA is changed to link to the final PDF.
10. The sitemap is updated intentionally only after the final PDF exists.
11. A final public-release report confirms the asset path, CTA, sitemap, QR status, and trust guardrails.

## Conclusion

This pass fixes the workflow failure that blocked artifact creation. The guide is still not ready for public PDF release. The correct next move is to rerun the manual GitHub Actions artifact workflow from `main`, download the draft PDF artifact if it succeeds, and complete hands-on visual, mobile, and print QA.
