# Medicare and Medicaid Guide Public Release Report

Community Acquired Finance  
Guide PDF artifact QA and final-release decision pass  
Last updated: 2026-07-06

## Release decision

Status: **Not released**.

The final public downloadable PDF is not being published in this pass because the release gates are not fully satisfied.

This is intentional. Do not publish a fake, empty, placeholder, draft, or uninspected PDF.

## Artifact workflow status

Workflow reviewed:

`/.github/workflows/guide-pdf-preflight.yml`

Workflow name:

`Guide PDF Preflight Artifact`

Current status from available GitHub metadata: **No successful artifact run verified**.

The merge commit for the artifact workflow did not show associated workflow runs through the available workflow-run metadata check. That means the draft PDF artifact has not been verified from this review pass.

Required next action:

1. Go to GitHub Actions.
2. Open **Guide PDF Preflight Artifact**.
3. Click **Run workflow**.
4. Run it from `main`.
5. Wait for the workflow to complete.
6. Download the artifact named:

`medicare-medicaid-guide-preflight-draft`

7. Inspect the PDF manually before any public release PR.

## Files reviewed

- `/.github/workflows/guide-pdf-preflight.yml`
- `/docs/medicare-medicaid-guide-pdf-artifact-workflow.md`
- `/docs/medicare-medicaid-guide-public-release-report.md`
- `/docs/medicare-medicaid-guide-pdf-preflight-report.md`
- `/src/pages/MedicareMedicaidGuideLandingPage.tsx`
- `/public/sitemap.xml`

## Generator status

The PDF generator remains internal.

It writes generated draft files under:

`/docs/generated/medicare-medicaid-guide/`

Expected local/artifact outputs are:

`/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.html`

`/docs/generated/medicare-medicaid-guide/hospital-family-guide-medicare-medicaid-preflight.pdf`

The generator does not place files under `/public` by default.

Generated files under `/docs/generated/` are ignored by Git and should not be committed.

The GitHub Actions workflow also fails if any PDF is found under:

- `/public/drafts`
- `/public/guides`

## Final PDF asset path

Preferred final public path:

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

Current status: **Not created**.

Reason:

- No successful draft artifact has been verified in this pass.
- A final approved PDF has not been visually inspected.
- Manual print and mobile PDF review are still pending.
- QR codes have not been generated from tested live URLs.
- It would be dishonest to publish a placeholder or draft file at the final public path.

## Landing page CTA status

Current landing page CTA status: **Unchanged**.

The guide landing page still uses the cautious CTA:

`Download guide — source review in progress`

This should remain unchanged until the final approved PDF exists at the public asset path.

The landing page already includes a secondary CTA to the Medicare cost exposure tool:

`/medicare-care-costs#cost-estimator`

No CTA was changed in this pass.

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

Until then, QR placeholders should stay out of the final public PDF.

## Remaining manual QA items

Before public release, complete these checks:

### Artifact generation

- [ ] Run **Guide PDF Preflight Artifact** from GitHub Actions.
- [ ] Confirm the workflow succeeds.
- [ ] Download `medicare-medicaid-guide-preflight-draft`.
- [ ] Confirm the artifact contains the generated HTML.
- [ ] Confirm the artifact contains the generated PDF.
- [ ] Confirm no generated PDF is committed to the repo.
- [ ] Confirm no generated PDF exists under `/public/drafts` or `/public/guides`.

### Visual QA

- [ ] Check cover title fit.
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

### QR and link QA

- [ ] Test final guide landing page on mobile.
- [ ] Test Medicare cost exposure tool on mobile.
- [ ] Test EOB-to-bill checker on mobile.
- [ ] Test long-term care article on mobile.
- [ ] Test rehab article on mobile.
- [ ] Generate final QR codes only after URL testing.
- [ ] Scan final QR codes from screen.
- [ ] Scan final QR codes from printed paper.

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

1. The GitHub Actions artifact workflow has run successfully.
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

This pass reviews the release decision and confirms the guide is still not ready for public PDF release. The correct next move is to run the manual GitHub Actions artifact workflow, download the draft PDF artifact, and complete hands-on visual, mobile, and print QA. After that, a separate final release PR can add the real approved PDF asset, update the landing page CTA, and update the sitemap.
