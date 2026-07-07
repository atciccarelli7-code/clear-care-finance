# Medicare and Medicaid Guide PDF Build Plan

Community Acquired Finance  
PDF build preparation pass  
Last updated: 2026-07-06

## Purpose

Prepare the final print/PDF build package for **The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care** without publishing the PDF yet.

This phase converts the final pre-PDF manuscript structure into a print-ready HTML template and defines the preflight checks required before the PDF can become a public download.

## Inputs

Use these existing files as the source of truth:

- `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`
- `/docs/medicare-medicaid-guide-print/print-layout-spec.md`
- `/docs/medicare-medicaid-guide-print/print-template.html`
- `/docs/medicare-medicaid-guide-print/print-release-checklist.md`
- `/docs/medicare-medicaid-guide-distribution/one-page-flyer.md`
- `/docs/medicare-medicaid-guide-distribution/two-page-hospital-handout.md`

## Outputs from this phase

- `/docs/medicare-medicaid-guide-pdf-build-plan.md`
- `/docs/medicare-medicaid-guide-print/final-guide-print-template.html`

## Non-goals

Do not use this phase to:

- generate the final PDF,
- generate final QR codes,
- publish or link a downloadable PDF,
- change the public guide landing page CTA,
- add ads,
- add affiliate links,
- add insurer rankings,
- add lead forms,
- add plan recommendations,
- add sales language,
- imply endorsement by any hospital, employer, insurer, Medicare, Medicaid, CMS, state agency, or professional organization.

## Build architecture

The final PDF should be generated from the print HTML template after the final editorial pass.

Recommended flow:

1. Use `final-guide-print-template.html` as the print shell.
2. Replace all placeholder chapter copy with the approved final manuscript sections.
3. Keep the chapter component order stable.
4. Add all worksheets from the final pre-PDF manuscript.
5. Keep QR placeholders until the guide download route and all tool routes are tested.
6. Export a draft PDF from the HTML template.
7. Run PDF preflight.
8. Only after approval, generate final QR codes and publish the downloadable PDF.

## Required page structure

### Front matter

1. Cover
2. Educational disclaimer
3. How to use this guide
4. Table of contents
5. The five biggest misunderstandings

### Chapter body

Every chapter should use the same visual hierarchy:

1. Chapter title
2. Direct answer box
3. Plain-English explanation
4. Common misunderstanding callout
5. Hospital/caregiver example
6. Questions to ask checklist
7. Related site tools
8. QR placeholder
9. Source note

### Back matter

1. Before-discharge checklist
2. Rehab facility comparison worksheet
3. Prior authorization tracker
4. Bill review worksheet
5. Medicaid/LTSS next-step worksheet
6. Endnotes and source map
7. Update log
8. QR/tool directory

## Print standards

- US Letter, 8.5 x 11 inches.
- Black-and-white printable.
- Mostly black, white, and light gray.
- One restrained accent color is acceptable if it remains legible in grayscale.
- Body text should stay around 10.5-11.5 pt.
- Source notes should not drop below 8.5 pt.
- Avoid dense paragraphs longer than 5-6 lines.
- Use checklists for action items.
- Avoid decorative gradients, large dark blocks, and unnecessary icons.
- Use repeated footer text: `Community Acquired Finance | Educational only | Last updated YYYY-MM-DD`.

## QR placeholder rules

Keep QR placeholders only in this phase.

Placeholder text:

`QR PLACEHOLDER — DO NOT PRINT FINAL UNTIL URL IS LIVE AND TESTED`

Planned destinations:

- Guide landing page: `/guides/medicare-medicaid-rehab-long-term-care`
- Medicare cost exposure tool: `/medicare-care-costs#cost-estimator`
- EOB-to-bill checker: `/tools/eob-to-bill-match-checker`
- Long-term care article: `/articles/does-medicare-cover-long-term-care`
- Rehab article: `/articles/does-medicare-cover-rehab-after-hospital-stay`

Do not replace placeholders with QR images until:

1. The public download route exists.
2. All tool/article URLs are live.
3. The landing page works on mobile.
4. Test QR codes scan from a phone screen.
5. Test QR codes scan from printed paper.

## PDF preflight checklist

Before any public PDF release:

### Content preflight

- [ ] Final manuscript text is inserted.
- [ ] Every chapter source note has matching endnotes.
- [ ] Educational disclaimer appears near the front.
- [ ] No personalized coverage, legal, medical, tax, Medicaid planning, or financial advice is present.
- [ ] No insurer ranking, plan recommendation, affiliate copy, lead form, or sales framing is present.
- [ ] Estate recovery and spousal impoverishment remain caution topics only.
- [ ] State-specific Medicaid details are absent unless official state Medicaid sources are cited.
- [ ] Current-year Medicare dollar amounts are rechecked immediately before export.

### Layout preflight

- [ ] Export draft PDF.
- [ ] Render PDF pages to images.
- [ ] Check for clipped text.
- [ ] Check for overlapping boxes.
- [ ] Check for awkward page breaks.
- [ ] Check for callouts split across pages.
- [ ] Check for unreadable source notes.
- [ ] Check for broken glyphs or missing characters.
- [ ] Check table of contents page references after pagination.
- [ ] Check that worksheets have enough writing space.
- [ ] Check black-and-white printing.
- [ ] Check mobile PDF viewing.

### Link and QR preflight

- [ ] Guide landing page works.
- [ ] Download route works.
- [ ] Medicare cost tool opens.
- [ ] EOB-to-bill checker opens.
- [ ] Out-of-pocket max estimator opens.
- [ ] Long-term care article opens.
- [ ] Rehab article opens.
- [ ] QR codes are generated only from final live URLs.
- [ ] QR codes scan from screen.
- [ ] QR codes scan from printed page.
- [ ] No QR placeholder remains in final public PDF.

### File preflight

- [ ] Final PDF filename is clear and versioned.
- [ ] Metadata does not contain draft labels.
- [ ] File size is reasonable for mobile download.
- [ ] PDF opens in browser, iOS, Android, and desktop viewer.
- [ ] Final file is saved under the approved public asset path only after approval.

## Recommended file naming

Draft files:

- `hospital-family-guide-medicare-medicaid-draft.pdf`
- `hospital-family-guide-medicare-medicaid-preflight.pdf`

Final public file:

- `hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf`

## Release gate

The PDF should not become a public download until all of these are true:

1. Final manuscript text is approved.
2. Source notes and endnotes are complete.
3. Current-year dollar amounts are rechecked.
4. QR codes are generated from tested URLs.
5. PDF preflight passes.
6. Landing page CTA is updated in a separate PR.
7. Sitemap is updated if a public PDF URL is added.

## Next phase after this

The next phase should be actual PDF generation and visual QA in a controlled draft path, still without changing the public download CTA until the draft PDF passes preflight.
