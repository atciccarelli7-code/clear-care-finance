# Medicare and Medicaid Guide PDF Artifact Review Rubric

Community Acquired Finance  
Artifact review rubric for PR #108 layout and visual refinement  
Last updated: 2026-07-07

## Scope

Use this rubric to review the next generated Medicare/Medicaid guide PDF artifact after the layout and visual refinement pass.

This rubric exists because the guide is intended to be a high-trust educational resource for healthcare workers, patients, caregivers, and families. The PDF should feel calmer, clearer, and more useful than a standard government or insurer handout, without becoming decorative, sales-oriented, or visually unserious.

This rubric does not publish the PDF, unlock the landing page CTA, add the PDF URL to the sitemap, add QR codes, add ads, add affiliate links, add insurer rankings, add plan recommendations, add lead forms, or add sales language.

## Review decision

Do not approve the layout/visual refinement PR unless the generated artifact passes all blocking checks and most quality checks below.

Decision options:

- **Pass** — artifact is clearly better than the prior candidate and launch gates remain closed.
- **Pass with minor follow-up** — artifact is better, but a small copy/style item should be fixed before public PDF candidate upload.
- **Fail** — artifact introduces clipping, clutter, credibility issues, broken flow, missing sections, or launch-gate risk.

## Blocking checks

The artifact fails if any item below is true.

- [ ] PDF does not open.
- [ ] Browser headers or footers appear.
- [ ] `file://` appears anywhere in the extracted text.
- [ ] `docs/generated` appears anywhere in the extracted text.
- [ ] Fewer than 19 chapters are present.
- [ ] Worksheets are missing.
- [ ] Endnotes/source map is missing.
- [ ] Any visual clips, overlaps, or becomes unreadable.
- [ ] Any visual looks like clip art, marketing collateral, or a low-credibility infographic.
- [ ] The guide implies coverage, eligibility, payment, plan choice, medical necessity, or legal outcome for a specific person.
- [ ] QR placeholders look like real scannable QR codes.
- [ ] Any final QR code is added before QR destination testing.
- [ ] Any public PDF is committed under `/public/guides/` in this PR.
- [ ] Any draft PDF is committed under `/public/drafts/` in this PR.
- [ ] Landing page CTA is unlocked in this PR.
- [ ] Sitemap PDF URL is added in this PR.
- [ ] Ads, affiliate links, insurer rankings, plan recommendations, lead forms, or sales language are added.

## Page-flow checks

Review the full PDF from front to back.

- [ ] Cover page feels credible and not cramped.
- [ ] Disclaimer page is readable and not visually buried.
- [ ] Table of contents remains readable.
- [ ] Chapters start cleanly.
- [ ] No repeated large blank spaces remain after headings, callouts, or tools sections.
- [ ] The tighter spacing does not make the guide feel dense or rushed.
- [ ] Direct-answer boxes remain easy to find.
- [ ] Common misunderstanding sections are visible but not overemphasized.
- [ ] Hospital/caregiver examples still feel practical.
- [ ] Questions-to-ask sections remain scannable.
- [ ] Related-tools and source-note sections do not dominate the page.
- [ ] Footers do not crowd content.

## Visual-quality checks

The visuals should be useful, restrained, and printable.

### Guide-use map

- [ ] Helps the reader understand how to use the guide.
- [ ] Does not feel like decorative filler.
- [ ] Step labels are readable.
- [ ] The five-step flow does not feel cramped.

### Medicare vs Medicaid visual

- [ ] Makes the program distinction easier to understand.
- [ ] Does not overstate what either program covers.
- [ ] Avoids jargon where plain-English wording would work better.
- [ ] If terms like ESRD or ALS appear, confirm they do not make the visual feel too technical for families.

### Bill review visual

- [ ] Clearly shows that a provider bill should be compared against the MSN/EOB/plan paperwork.
- [ ] Does not imply the bill is always wrong.
- [ ] Supports the EOB-to-bill checker without becoming a sales pitch.

### Discharge pathway visual

- [ ] Shows the difference between care setting and payer rule.
- [ ] Keeps home health, SNF/rehab, and long-term care distinct.
- [ ] Does not imply one pathway is always appropriate.

### SNF timeline visual

- [ ] Reinforces that SNF coverage is short-term and rule-based.
- [ ] Does not promise a specific number of days without context.
- [ ] Makes the skilled care vs custodial care distinction easier to understand.

## Black-and-white print checks

Print or preview these pages in black and white:

- [ ] Cover page.
- [ ] Disclaimer page.
- [ ] Guide-use map page.
- [ ] Medicare vs Medicaid visual page.
- [ ] Bill review visual page.
- [ ] Discharge pathway visual page.
- [ ] SNF timeline visual page.
- [ ] One worksheet.
- [ ] Endnotes/source map page.

Pass criteria:

- [ ] Borders remain visible.
- [ ] Text remains readable.
- [ ] Visual hierarchy still works without color.
- [ ] Tables/cards do not clip.
- [ ] Worksheet writing space remains usable.
- [ ] Source notes remain readable.

## Mobile/device checks

Open the generated PDF on:

- [ ] Desktop browser.
- [ ] iPhone.
- [ ] Android if available.

Pass criteria:

- [ ] PDF opens without login.
- [ ] Text is readable at normal zoom or easy pinch/zoom.
- [ ] Visual cards remain understandable.
- [ ] Share/download behavior is acceptable.
- [ ] The artifact feels credible enough to send to a family member or caregiver.

## Mission-fit checks

Ask these questions before approving the artifact:

- [ ] Would this help a stressed family ask better questions?
- [ ] Does it preserve plain-English clarity?
- [ ] Does it look more trustworthy than generic finance content?
- [ ] Does it avoid looking like insurer marketing?
- [ ] Does it avoid looking like a government PDF export with nicer fonts?
- [ ] Does it avoid visual clutter?
- [ ] Does it avoid unnecessary decoration?
- [ ] Does it feel like Community Acquired Finance: practical, calm, healthcare-aware, and honest?

## Approval note template

Use this note only after reviewing the artifact:

```text
Artifact review result: PASS / PASS WITH MINOR FOLLOW-UP / FAIL

Reviewed artifact/run:
- Run ID:
- Commit:
- Page count:

Blocking checks:
- PDF opens:
- No browser headers/footers:
- No file path leakage:
- 19 chapters present:
- Worksheets present:
- Endnotes/source map present:
- CTA remains locked:
- Sitemap PDF URL absent:
- No public PDF committed:

Visual review:
- Guide-use map:
- Medicare vs Medicaid visual:
- Bill review visual:
- Discharge pathway visual:
- SNF timeline visual:

Decision:
```

## Next step after rubric completion

If the artifact passes, PR #108 can be considered for merge. After merge, generate the final public PDF candidate from the improved builder and only then proceed to the binary PDF candidate PR.
