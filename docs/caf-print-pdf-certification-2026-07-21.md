# CAF Flagship Print and PDF Certification

**Certification date:** July 21, 2026  
**Issue:** Linear AND-70  
**Release pull request:** #202  
**Release merge commit:** `fff94dba1285345d40c50b932e81855ddf902a5c`  
**Certified implementation commit:** `dbc7795b751806752bafaf743dccdf36262befcb`  
**Browser engine:** Chromium through Playwright  
**Browser viewport before print:** 1440 × 1000  
**Formats:** US Letter and A4  
**Final Browser certification run:** `29837406845`  
**Workflow artifact:** `browser-certification-29837406845` / artifact `8497940205`

## Scope

The certification exercised Chromium's print-to-PDF rendering path for the following representative high-stress outputs:

1. Medical Bill Response System — selected hospital or facility bill result.
2. Medical Bill Response Pack — complete ten-page worksheet pack.
3. Hospital & Patient Guide — leaving-the-hospital action plan.
4. Healthcare Worker Total Compensation — comparison result and completed Offer Verification Plan.
5. Turning 65 Medicare pathway — generated enrollment timeline and official verification resources.

Each output was generated in both US Letter and A4 with backgrounds enabled, browser headers and footers disabled, tagged PDF output enabled, and 0.45-inch margins.

## Defects found and corrected

The first generated artifact exposed material print defects that were not visible in screen-mode browser certification:

- the global site header, footer, mobile navigation, trust navigation, and unrelated page sections printed with the intended result;
- interactive forms and controls remained in several documents;
- the Medical Bill Response System printed blank leading and trailing pages;
- the healthcare-offer document printed a blank trust-navigation page before the result;
- long comparison tables depended on screen-only horizontal scrolling;
- result documents did not consistently provide a durable printed title, controlling-source boundary, or canonical route.

Corrections introduced governed print-only rules that:

- remove navigation, advertising surfaces, notifications, trust navigation, and interactive-only controls;
- isolate the selected or generated result rather than printing the entire website route;
- preserve the complete compensation comparison and verification checklist as one governed document;
- size tables to the printable width, allow repeated table headers, and remove screen overflow behavior;
- retain warnings, official verification boundaries, source URLs, privacy notes, and educational limitations;
- remove layout minimum height and bottom padding that caused blank pages;
- add print-only document titles and canonical route references where screen context otherwise disappeared.

## Final page counts

| Artifact | US Letter | A4 |
|---|---:|---:|
| Medical Bill Response System result | 1 | 1 |
| Medical Bill Response Pack | 10 | 10 |
| Hospital discharge action plan | 1 | 1 |
| Healthcare offer comparison and verification plan | 7 | 7 |
| Turning 65 Medicare timeline | 4 | 4 |

## Automated print assertions

The print certification test now fails when a governed application route exposes any of the following in print media:

- site header;
- site footer;
- site trust navigation;
- mobile bottom navigation;
- visible buttons or button-role controls;
- horizontal document overflow.

The test also verifies that each expected result is present before generating the Letter and A4 files.

## Manual rendered-page inspection

Every page from the final artifact was rasterized and reviewed after the workflow completed.

### Medical Bill Response System result

- One-page output in Letter and A4.
- Document classification, first checks, common mistakes, questions, safest next action, and official source remain visible.
- No blank pages, navigation, unrelated medical-bill content, or interactive controls remain.

### Medical Bill Response Pack

- Ten purposeful pages in both formats.
- Worksheets, checkboxes, tables, call log, request script, assistance checklist, denial organizer, deadline tracker, questions-before-paying sheet, notes area, and official sources remain usable.
- No clipping or broken tables observed.

### Hospital & Patient Guide action plan

- One-page output in both formats.
- Plain-English starting point, three actions, questions, verify-before-acting boundary, patient-specific limitation, and canonical route remain together.
- The document remains understandable without the website shell.

### Healthcare offer comparison and verification plan

- Seven pages in both formats.
- Compensation summary, breakdown table, effective-value cards, quality-of-life table, HR questions, limitations, full verification checklist, privacy statement, and official reference URLs remain visible.
- Tables fit within the printable area and do not require horizontal scrolling.
- Section order remains coherent across page boundaries.

### Turning 65 Medicare timeline

- Four pages in both formats.
- Immediate answer, action plan, dated timeline, documents, employer questions, official actions, warnings, official verification resources, and controlling-source limitation remain visible.
- Source URLs wrap within their cards and remain legible.

## Grayscale review

Letter-format contact sheets were converted to grayscale and inspected. Meaning does not depend on color alone:

- numbered actions remain numbered;
- warning and verification sections retain explicit text labels and borders;
- completion markers remain visible;
- headings, table structure, checkboxes, and source URLs remain distinguishable.

## Outcome

**PASS.** The final Chromium print-to-PDF artifacts are usable in US Letter and A4, preserve the required decision and verification content, remove website-only chrome and controls, and show no observed clipping, horizontal overflow, unintended blank pages, or color-only meaning.

The GitHub workflow artifact retains the generated PDFs for fourteen days. This repository record preserves the test conditions, defects, page counts, and acceptance decision after the binary artifact expires.
