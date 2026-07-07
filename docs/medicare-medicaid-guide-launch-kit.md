# Medicare and Medicaid Guide Launch Kit

Community Acquired Finance  
Launch support kit for PDF candidate, QA, copy, internal links, and social distribution  
Last updated: 2026-07-07

## Scope

This document collects the work that can be completed before desktop/computer access is available for the final binary PDF upload.

It does **not** create or publish the PDF. It does **not** unlock the landing page CTA. It does **not** add the PDF URL to the sitemap. It does **not** add QR codes, ads, affiliate links, insurer rankings, plan recommendations, lead forms, or sales language.

## Current status

The final blocker before the PDF candidate PR is binary upload of the candidate PDF file.

Local candidate PDF path from the prior ChatGPT session:

`/mnt/data/final_pdf_candidate/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

Target repo path:

`public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

The candidate PDF was locally checked with the following result:

- 49 pages.
- Opens successfully.
- No `draft` text.
- No `preflight` text.
- No `file://` paths.
- No `docs/generated` leakage.
- 19 chapters present.
- Worksheets present.
- Endnotes/source map present.
- QR placeholders remain.
- No final QR codes added.

## Tonight computer-access execution packet

### Goal

Commit the final public PDF candidate into the repo without fully launching it yet.

Do not unlock the download CTA.  
Do not add the PDF URL to sitemap.  
Do not add QR codes yet.

### Branch

Use:

`guide-final-pdf-candidate`

If the branch already exists, reset or recreate it from latest `main` before adding the PDF.

### Files that should change

Expected:

1. `public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`
2. `docs/medicare-medicaid-guide-final-pdf-candidate-report.md`

Allowed only if needed:

3. `docs/medicare-medicaid-guide-public-release-report.md`

### Files that should not change

Do not change:

- `src/pages/MedicareMedicaidGuideLandingPage.tsx`
- `public/sitemap.xml`
- anything under `public/drafts/`
- QR code files
- ads, affiliate, ranking, recommendation, or lead-form content

### Candidate PDF checks before PR

Confirm:

- [ ] PDF opens successfully.
- [ ] Page count is 49 unless intentionally regenerated.
- [ ] No `draft` text.
- [ ] No `preflight` text.
- [ ] No `file://` paths.
- [ ] No `docs/generated` leakage.
- [ ] 19 chapters present.
- [ ] Worksheets present.
- [ ] Endnotes/source map present.
- [ ] QR placeholders still present.
- [ ] No final QR codes added.

### PR title

`Add Medicare Medicaid guide final PDF candidate`

### PR body checklist

Include:

- source artifact/run used:
  - run ID `28891566086`
  - job ID `85705318587`
  - artifact `medicare-medicaid-guide-preflight-draft`
- branch/commit used
- final PDF path
- PDF page count
- checks passed
- files changed
- CTA remains locked
- sitemap PDF URL was not added
- no `/public/drafts/` PDF exists
- no QR code added
- no ad, affiliate, ranking, recommendation, lead form, or sales language added

### PR validation

After PR opens:

1. Confirm CI passes.
2. Confirm Vercel preview is READY.
3. Confirm preview PDF URL returns 200:

`/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

4. Confirm guide landing page CTA is still locked.
5. Confirm sitemap still has no PDF URL.
6. Confirm no `/public/drafts/` PDF exists.

### Merge rule

Do not merge unless:

- CI passes.
- Vercel preview is healthy.
- Preview PDF URL returns 200.
- CTA remains locked.
- Sitemap PDF URL remains absent.
- No `/public/drafts/` PDF exists.

## Phone-friendly final PDF QA script

Use this after the candidate PDF PR preview is live.

### iPhone test

- [ ] Open the PR preview guide hub.
- [ ] Confirm the page loads without login.
- [ ] Confirm the download CTA is still locked.
- [ ] Open the direct preview PDF URL.
- [ ] Confirm the PDF opens without login.
- [ ] Confirm the filename is understandable.
- [ ] Zoom into body text; confirm it is readable.
- [ ] Jump/scroll through early, middle, and late pages.
- [ ] Confirm worksheets are readable.
- [ ] Confirm source/endnote section is readable.
- [ ] Use the share sheet; confirm save/share behavior is acceptable.

### Desktop test

- [ ] Open PR preview guide hub.
- [ ] Confirm download CTA is still locked.
- [ ] Open the direct preview PDF URL.
- [ ] Confirm PDF opens in browser.
- [ ] Confirm page count is 49.
- [ ] Confirm cover page renders.
- [ ] Confirm table of contents renders.
- [ ] Confirm a middle chapter renders.
- [ ] Confirm worksheets render.
- [ ] Confirm endnotes/source map renders.
- [ ] Search PDF text for `draft`, `preflight`, `file://`, and `docs/generated`.

### Black-and-white print test

Print or preview in black and white:

- [ ] Cover page.
- [ ] Disclaimer page.
- [ ] One short chapter.
- [ ] One long chapter.
- [ ] One worksheet.
- [ ] Source/endnote page.
- [ ] QR/tool directory page with placeholders.

Check:

- [ ] Text remains readable.
- [ ] Tables do not clip.
- [ ] Worksheets have enough writing room.
- [ ] Headings do not orphan at the bottom of a page.
- [ ] QR placeholders do not look like real scannable QR codes.

## Launch-page copy options for the eventual CTA unlock

Use only after the final PDF file exists and direct URL testing passes.

### Preferred button label

`Download the free guide`

### Conservative button label

`Open the PDF guide`

### Secondary helper text

`Free educational PDF. Built to help families ask better questions about Medicare, Medicaid, rehab, long-term care, and confusing bills.`

### Disclaimer line near CTA

`Educational only. Not medical, legal, tax, insurance, Medicaid planning, or financial advice. Verify your situation with official sources, your plan, the facility, SHIP, or a qualified professional.`

### What this guide helps with

- Understand inpatient, outpatient, and observation status.
- Ask better questions before discharge.
- Understand Medicare rehab and skilled nursing facility limits.
- Separate Medicare, Medicaid, and long-term care questions.
- Compare bills against Medicare Summary Notices, EOBs, and plan paperwork.
- Organize conversations with facilities, plans, billing offices, SHIP, and qualified professionals.

### Language to avoid on the CTA section

Do not use:

- `Avoid nursing home bills`
- `Secrets Medicare does not want you to know`
- `Save money guaranteed`
- `Best Medicare plan`
- `Apply now`
- `Talk to an agent`
- `We can get you approved`
- `Free care`
- `Loopholes`

## Internal-link and SEO map

The guide should be the hub. Related tools and articles should point to the guide after the PDF is public, but the guide hub should remain the primary destination.

### High-priority pages to link toward the guide

| Page | Suggested anchor text | Placement |
|---|---|---|
| `/medicare-care-costs` | `Medicare, Medicaid, rehab, and long-term care guide` | Near Medicare cost estimator intro or after calculator result. |
| `/medicare-care-costs#cost-estimator` | `Use this with the hospital family guide` | Calculator result/support text. |
| `/tools/eob-to-bill-match-checker` | `Need the bigger Medicare billing context? Read the hospital family guide.` | Tool intro or after result. |
| `/insurance/medicare-advantage` | `Medicare Advantage questions during discharge and rehab planning` | Related resources block. |
| `/insurance/prior-authorization-guide` | `Rehab and discharge coverage questions` | Related resources block. |
| `/insurance/hospital-discharge-coverage` | `The hospital family guide to Medicare, Medicaid, rehab, and long-term care` | Top or bottom related guide card. |
| `/insurance/medical-bill-review-toolkit` | `Use the family guide before paying confusing hospital or rehab bills` | Related tools/guides section. |
| `/topics/medicare-medicaid` | `Hospital family guide` | Featured resource card. |
| `/topics/patient-medical-costs` | `Medicare billing and discharge guide` | Featured or related resource. |

### Internal-link rules

- Use human phrases, not keyword stuffing.
- Avoid more than one prominent guide CTA per page.
- Prefer a short related-resource card over repeated inline links.
- Do not claim the guide determines coverage, eligibility, or what a family should choose.
- Keep the guide hub URL as the human landing page, even after the PDF exists.

## Social launch sequence

Existing draft social copy lives at:

`docs/medicare-medicaid-guide-distribution/social-posts-and-captions.md`

Use that file as the content bank. Use the sequence below to avoid dumping all posts at once.

### Day 0 — PDF candidate not launched yet

Use the source-review angle.

Main idea:

`The final PDF is close, but I am intentionally checking it before public release because families may use this during real discharge, rehab, long-term care, and billing decisions.`

### Launch day — LinkedIn

Use founder/healthcare-worker angle.

Main idea:

`I built a free plain-English guide because families are often expected to understand Medicare, Medicaid, rehab, long-term care, and bills during one of the most stressful moments of their lives.`

### Launch day — Facebook

Use caregiver angle.

Main idea:

`For anyone helping a parent, grandparent, spouse, or loved one after a hospital stay, this free guide is designed to help organize the questions.`

### Day 2 — Education post

Use Medicare vs Medicaid angle.

Main idea:

`Medicare and Medicaid are not the same thing, and that difference matters most when families are dealing with rehab, nursing home care, home support, and long-term care planning.`

### Day 4 — Bill confusion post

Use MSN/EOB/bill angle.

Main idea:

`A bill after Medicare paid is not automatically wrong, but it is worth understanding before paying blindly.`

### Day 7 — Healthcare worker post

Use shareability angle.

Main idea:

`Healthcare workers see this confusion often. The goal is not to give legal or insurance advice. The goal is to help families ask better questions.`

## Metrics to watch after launch

Do not obsess over one-day numbers. Watch:

- guide hub visits,
- PDF direct URL visits,
- clicks from related tools/articles,
- EOB checker usage,
- Medicare cost estimator usage,
- traffic source mix,
- average engagement time,
- search impressions over 2-6 weeks,
- whether social traffic returns to related tools.

## Next controlled step

The next technical step remains binary PDF upload through computer/Codex/manual GitHub access.

After the binary candidate PR is opened and validated, run device/print QA before the final launch PR that unlocks the CTA and adds the sitemap PDF URL.
