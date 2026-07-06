# Print Layout Spec

Guide: **The Hospital Family Guide to Medicare, Medicaid, Rehab, and Long-Term Care**  
Status: Draft layout only  
Last updated: 2026-07-06

## Design principle

The guide should feel calm, practical, and printable. It should look closer to a hospital-family workbook than a glossy sales brochure.

The reader may be stressed, tired, or trying to help a family member. The page design should reduce cognitive load.

## Page size

Primary target: US Letter, 8.5 x 11 inches.

Margins:

- Top: 0.65 in
- Bottom: 0.65 in
- Outside: 0.7 in
- Inside: 0.8 in

Keep the layout printable in black and white.

## Typography

Recommended system fonts:

- Headings: Arial, Helvetica, or Inter if available
- Body: Georgia, Charter, or system serif for long reading
- UI labels and callout labels: Arial or Helvetica

Recommended sizes:

- Cover title: 28-34 pt
- Part title: 22-26 pt
- Chapter title: 18-22 pt
- Section heading: 12-14 pt
- Body: 10.5-11.5 pt
- Footnotes/source notes: 8.5-9.5 pt
- Worksheet fields: 9.5-10.5 pt

## Color and contrast

Use mostly black, white, and light gray.

Use one restrained accent color if needed, but the guide must remain usable when printed in grayscale.

Avoid:

- low-contrast text,
- decorative gradients,
- large dark backgrounds,
- dense colored blocks,
- unnecessary icons.

## Standard chapter layout

Each chapter should follow this order:

1. Chapter number and title
2. Short chapter promise
3. Direct answer box
4. Plain-English explanation
5. Common misunderstanding callout
6. Hospital/caregiver example
7. Questions to ask checklist
8. Related site tools / QR placeholder
9. Source note

## Component styles

### Direct answer box

Purpose: give the reader the answer immediately.

Style:

- light border,
- light shaded background,
- label: `Direct answer`,
- 2-5 short sentences maximum.

### Common misunderstanding callout

Purpose: correct the most dangerous misconception.

Style:

- left border rule,
- label: `Common misunderstanding`,
- short paragraph,
- no scare language.

### Hospital/caregiver example

Purpose: make the rule concrete.

Style:

- small label,
- scenario in plain language,
- no patient-specific medical advice.

### Questions to ask

Purpose: convert education into action.

Style:

- checklist bullets,
- enough spacing for print readability,
- use direct question wording.

### Related site tools

Purpose: send the reader back to the site for tools and updates.

Style:

- list of 1-4 links,
- QR placeholder box,
- note that QR must be replaced only after the route is live.

### Source note

Purpose: preserve trust and show where the facts come from.

Style:

- small text,
- official source names first,
- avoid long raw URLs in the final PDF if endnotes are used.

## Front matter pages

1. Cover
2. Educational disclaimer
3. Who this guide is for
4. How to use this guide
5. The 5 biggest misunderstandings
6. Table of contents

## Back matter pages

1. Before-discharge checklist
2. Rehab facility comparison worksheet
3. Skilled vs custodial care worksheet
4. Prior authorization tracker
5. Bill review worksheet
6. Medicaid/LTSS next-step worksheet
7. Caregiver document checklist
8. Source notes
9. Update log
10. QR/tool directory

## QR placeholders

Use these placeholders until final URLs are live and tested:

- Guide landing page: `/guides/medicare-medicaid-rehab-long-term-care`
- Medicare cost exposure tool: `/medicare-care-costs#cost-estimator`
- EOB-to-bill checker: `/tools/eob-to-bill-match-checker`
- Long-term care article: `/articles/does-medicare-cover-long-term-care`
- Rehab article: `/articles/does-medicare-cover-rehab-after-hospital-stay`

Do not generate final QR codes until the landing page and tool routes are live, tested on mobile, and included in the release checklist.

## Print rules

- Avoid text smaller than 8.5 pt.
- Avoid putting source notes in tiny unreadable text.
- Keep callout boxes from splitting awkwardly across pages where possible.
- Keep worksheets mostly one page each.
- Use page breaks before major parts.
- Use repeated footer: `Community Acquired Finance | Educational only | Last updated YYYY-MM-DD`.
- Add page numbers.

## Accessibility rules

- Do not rely on color alone.
- Use real headings in the HTML/template.
- Keep links descriptive.
- Avoid dense paragraph blocks longer than 5-6 lines.
- Use checklist structure for action items.

## Distribution warning

The final guide and flyer must not imply endorsement by any hospital, clinic, employer, insurer, Medicare, Medicaid, CMS, or state agency.
