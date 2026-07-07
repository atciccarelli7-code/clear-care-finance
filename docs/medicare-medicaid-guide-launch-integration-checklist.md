# Medicare and Medicaid Guide Public Launch Integration Checklist

Community Acquired Finance  
Launch-integration planning pass  
Last updated: 2026-07-07

## Scope

This checklist defines the device, print, QR, rollback, and public-launch integration plan for the Medicare/Medicaid guide before any final public PDF is created or published.

This is a planning document only.

This pass does not create a final PDF, add a PDF under `/public/guides/`, add a PDF under `/public/drafts/`, unlock the landing page CTA, add a sitemap PDF URL, generate QR codes, add ads, add affiliate links, add insurer rankings, add plan recommendations, or add lead forms.

## Final public PDF asset plan

### Final public asset path

`/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

### Final public URL

`https://communityacquiredfinance.com/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

### Final filename

`hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

### Internal draft artifact name

`medicare-medicaid-guide-preflight-draft`

### Public file rule

Only commit the final PDF to `/public/guides/` after:

1. source-gap closure is complete,
2. final manuscript cleanup is complete,
3. draft PDF artifact QA passes,
4. 2026 Medicare amount verification is complete,
5. outpatient observation notice timing verification is complete,
6. final candidate opens on desktop and mobile,
7. black-and-white print review passes,
8. QR destinations are final and tested,
9. landing page CTA behavior is ready to change,
10. sitemap timing is ready.

## Landing page CTA plan

### Current pre-launch behavior

The landing page download CTA remains disabled and should continue to say:

`Download guide — source review in progress`

### Launch behavior after final PDF exists

Only after the final PDF exists at the public asset path:

- Replace disabled CTA with an enabled download/open button.
- Link directly to `/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`.
- Suggested button copy:
  - `Download the guide`
  - Optional secondary copy nearby: `Free PDF. Educational only. Verify rules with official sources.`
- Keep the Medicare cost tool CTA as the adjacent action.
- Confirm the PDF opens in a new tab or downloads predictably depending on browser behavior.

### CTA rollback rule

If the public PDF URL fails, remove or disable the CTA immediately and restore the pre-launch copy.

## Sitemap timing

Do not add the PDF URL to `public/sitemap.xml` until the public PDF file exists and the live URL returns 200.

After launch:

- Keep the existing guide hub URL in the sitemap.
- Add the final PDF URL only after file existence is verified.
- Use the launch date as the PDF `lastmod` date.
- Keep the guide hub as the primary human landing page.
- Treat the PDF URL as a downloadable supporting asset, not the main guide hub.

## QR destination map

QR codes should not be generated yet.

Final QR codes should be generated only after the destination URLs are live, mobile-tested, and stable.

| QR label | Destination | Purpose | Must test before QR generation |
|---|---|---|---|
| Guide hub | `/guides/medicare-medicaid-rehab-long-term-care` | Main online guide hub and status page | Opens on iPhone and Android; title and CTA render correctly. |
| Medicare cost estimator | `/medicare-care-costs#cost-estimator` | Help readers estimate Medicare cost exposure | Anchor scrolls or page loads close to estimator; tool usable on mobile. |
| EOB-to-bill match checker | `/tools/eob-to-bill-match-checker` | Help readers compare a bill against MSN/EOB/plan paperwork | Tool loads, inputs are usable, no PHI is requested. |
| Long-term care article | `/articles/does-medicare-cover-long-term-care` | Explain Medicare and long-term custodial care limits | Article loads and is readable on mobile. |
| Rehab after hospital article | `/articles/does-medicare-cover-rehab-after-hospital-stay` | Explain SNF/rehab coverage questions | Article loads and is readable on mobile. |
| Medicare vs Medicaid article | `/articles/medicare-vs-medicaid-what-is-the-difference` | Explain payer distinction | Article loads and is readable on mobile. |
| Contact / about | `/about` or `/contact` | Give reader a credibility or contact route | Page loads; no lead-form framing or sales funnel language. |

## QR generation rules

- Use final production URLs only.
- Do not encode preview URLs.
- Do not encode draft artifact URLs.
- Do not encode Vercel deployment URLs.
- Do not encode local development URLs.
- Do not add QR codes until the final public PDF candidate is ready.
- Test each QR code from a phone screen.
- Test each QR code from printed paper.
- Keep QR captions plain-English and destination-specific.

## Final device QA checklist

### Desktop browser

- [ ] Open guide hub at `/guides/medicare-medicaid-rehab-long-term-care`.
- [ ] Open final public PDF URL directly.
- [ ] Open PDF from landing page CTA.
- [ ] Confirm PDF opens without authentication.
- [ ] Confirm PDF filename is readable.
- [ ] Confirm PDF page count is expected.
- [ ] Confirm no browser header/footer leakage.
- [ ] Confirm no `file://` or `docs/generated` leakage.
- [ ] Confirm cover, disclaimer, table of contents, chapters, worksheets, and endnotes render.
- [ ] Confirm PDF is readable at default browser zoom.

### iPhone

- [ ] Open guide hub in Safari.
- [ ] Tap final CTA.
- [ ] Confirm PDF opens without login.
- [ ] Confirm pinch/zoom works.
- [ ] Confirm text is readable.
- [ ] Confirm worksheets are usable when viewed on mobile.
- [ ] Confirm share sheet works.
- [ ] Confirm download/save behavior is acceptable.
- [ ] Scan QR codes from screen.
- [ ] Scan QR codes from printed page.

### Android if available

- [ ] Open guide hub in Chrome.
- [ ] Tap final CTA.
- [ ] Confirm PDF opens without login.
- [ ] Confirm text is readable.
- [ ] Confirm download/save behavior is acceptable.
- [ ] Scan QR codes from screen.
- [ ] Scan QR codes from printed page.

## Black-and-white print QA checklist

Print and review:

- [ ] Cover page.
- [ ] Disclaimer / educational-boundaries page.
- [ ] Table of contents.
- [ ] One short chapter.
- [ ] One long chapter.
- [ ] Before-discharge worksheet.
- [ ] Rehab facility comparison worksheet.
- [ ] Prior authorization tracker.
- [ ] Bill review worksheet.
- [ ] Medicaid/LTSS next-step worksheet.
- [ ] Source/endnote page.
- [ ] QR/tool directory page after QR codes are generated.

Print-quality checks:

- [ ] Text remains readable in black and white.
- [ ] Links are visible enough as text.
- [ ] Tables do not clip.
- [ ] Worksheets leave enough writing space.
- [ ] Page breaks do not split important headings from content.
- [ ] QR codes scan from printed paper.
- [ ] Disclaimer remains near the front.
- [ ] Source/update language remains visible.

## Launch sequence

### Phase 1 — Final public candidate

1. Generate final public PDF candidate from the active final pre-PDF manuscript.
2. Confirm candidate uses the final filename.
3. Confirm candidate does not contain draft artifact paths.
4. Confirm candidate does not contain browser header/footer leakage.
5. Confirm candidate does not include final QR codes until QR URLs are verified.

### Phase 2 — Candidate QA

1. Open candidate locally or from artifact.
2. Confirm page count.
3. Confirm all chapters render.
4. Confirm worksheets render.
5. Confirm source/endnote section renders.
6. Complete desktop, iPhone, Android if available, and print QA.
7. If anything fails, fix before public commit.

### Phase 3 — Public asset commit

Only after candidate QA passes:

1. Commit final PDF to `/public/guides/`.
2. Confirm no file is added to `/public/drafts/`.
3. Confirm final file path matches the planned filename exactly.
4. Open a PR with only the public PDF asset and necessary launch wiring.

### Phase 4 — Landing page and sitemap

Only after the public PDF file exists in the PR:

1. Unlock the landing page CTA.
2. Point CTA to the final PDF URL.
3. Add sitemap PDF URL.
4. Keep the guide hub URL in the sitemap.
5. Do not add promotional or sales language.

### Phase 5 — Post-merge live QA

After merge to production:

1. Confirm Vercel production deployment is ready.
2. Confirm guide hub returns 200.
3. Confirm final PDF URL returns 200.
4. Confirm CTA opens the final PDF.
5. Confirm sitemap includes the PDF URL.
6. Confirm QR codes scan to production URLs.
7. Confirm Search Console sitemap submission readiness.
8. If any critical failure appears, execute rollback plan.

## Rollback plan

If the PDF launch breaks:

1. Disable the landing page download CTA.
2. Remove the PDF URL from sitemap.
3. Leave the guide hub live.
4. Keep related articles and tools live.
5. Keep the public PDF file only if the issue is CTA/sitemap routing; remove or replace it if the file itself is defective.
6. Open a hotfix PR documenting the issue, action taken, and next verification step.
7. Do not re-enable CTA until the direct PDF URL returns 200 and device/print QA passes again.

## Final launch PR acceptance criteria

The final public launch PR should not be approved unless:

- [ ] Public PDF file exists at the planned path.
- [ ] No draft PDF is committed.
- [ ] Landing page CTA points to the real file.
- [ ] Sitemap PDF URL exists only after the file exists.
- [ ] Desktop PDF open test passes.
- [ ] iPhone PDF open test passes.
- [ ] Android test passes if available.
- [ ] Black-and-white print test passes.
- [ ] QR destinations are production URLs.
- [ ] QR codes scan from screen and paper.
- [ ] No ads, affiliate links, insurer rankings, plan recommendations, lead forms, or sales language are added.

## Next step after this planning PR

After this planning PR is merged, the next controlled step is to prepare the final public PDF candidate and run the final device/print QA sequence. Do not unlock the CTA or add the sitemap PDF URL until the public PDF file exists and has passed direct URL testing.
