# Medicare and Medicaid Guide Hub Review

Community Acquired Finance  
Elite guide hub review pass  
Last updated: 2026-07-06

## Scope

Reviewed the public Medicare/Medicaid guide hub page:

`/guides/medicare-medicaid-rehab-long-term-care`

Primary file reviewed:

`/src/pages/MedicareMedicaidGuideLandingPage.tsx`

Supporting files checked:

- `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`
- `/docs/medicare-medicaid-guide-public-release-report.md`
- `/docs/medicare-medicaid-guide-pdf-preflight-report.md`
- `/public/sitemap.xml`
- `/src/App.tsx`

## Review summary

The page is directionally strong and now functions as a real Medicare/Medicaid guide hub rather than a thin landing page. It is organized around practical family situations, uses plain-English framing, connects to tools/articles, and preserves the PDF release guardrails.

The review found no reason to publish a PDF, add a placeholder download, update the sitemap for a PDF, add QR codes, or introduce monetization.

## Issues found

### Critical

None found.

No fake PDF, draft PDF, public `/public/guides` asset, sitemap PDF entry, QR code, lead form, affiliate link, insurer ranking, plan recommendation, or sales language was added.

### Important

1. **Mobile scroll fatigue risk**

The page contains eight substantial situation cards. The content is useful, but on mobile it could feel long before a reader reaches the exact scenario they need.

Fix implemented:

- Added a compact “Jump to the section that matches your situation” shortcut card.
- Added anchor IDs to all eight situation cards.
- Added `scroll-mt-24` so anchor jumps do not hide content behind the sticky/header area.

2. **Accessibility issue: invalid `aria-labelledby` reference**

The “Choose your situation” section referenced an ID that was not present on an actual heading element.

Fix implemented:

- Replaced the broken `aria-labelledby` usage with a direct `aria-label`.
- Added `aria-label` to the how-to-use and shortcut sections.

3. **Decorative bullet spans not hidden from assistive tech**

Small visual dots in checklist rows were decorative.

Fix implemented:

- Added `aria-hidden="true"` to decorative bullet spans.

4. **User-facing wording refinement**

One Medicare Advantage description said “The page should help families...” which sounded like an internal product note instead of reader-facing copy.

Fix implemented:

- Reworded it to “This path helps families...”

5. **Medicaid eligibility wording precision**

The Medicaid pathway needed to avoid sounding like the site determines eligibility.

Fix implemented:

- Reworded the pathway to say it points people to state verification, not eligibility promises.

### Nice-to-have

1. **Future analytics event tracking**

Consider tracking clicks on each situation shortcut and path CTA later, but only after the current public experience stabilizes.

2. **Future accordion/tabs version**

If mobile scroll fatigue remains high, consider converting the eight situation paths into an accordion or tabs pattern. The current card approach is acceptable and simpler for SEO/readability.

3. **Future visual QA screenshots**

After Vercel deploys, capture mobile and desktop screenshots for visual review before adding the final PDF CTA.

## Link integrity review

Checked the guide hub links against app routes and sitemap entries.

Key live routes confirmed:

- `/guides/medicare-medicaid-rehab-long-term-care`
- `/medicare-care-costs`
- `/medicare-care-costs#cost-estimator`
- `/tools/eob-to-bill-match-checker`
- `/tools/out-of-pocket-max-estimator`
- `/tools/medicare-advantage-plan-helper`
- `/glossary`
- `/disclosures`
- `/insurance/medicare-advantage`
- `/articles/does-medicare-cover-long-term-care`
- `/articles/does-medicare-cover-rehab-after-hospital-stay`
- `/articles/medicare-vs-medicaid-what-is-the-difference`
- `/articles/why-do-i-still-owe-money-with-medicare`
- `/articles/discharge-coverage-guide`
- `/articles/short-term-rehab-after-hospital`
- `/articles/medicaid-dual-eligibility-ltss`
- `/articles/plain-english-glossary`
- `/articles/deductible-copay-coinsurance-out-of-pocket-max`
- `/articles/how-to-read-an-eob`
- `/articles/observation-vs-inpatient-status`
- `/articles/prior-authorization-explained`

No broken guide-hub links were intentionally left in place.

## Trust and compliance review

Confirmed:

- Educational-only language remains.
- Non-affiliation language remains.
- The page does not imply endorsement by a hospital, employer, insurer, Medicare, Medicaid, CMS, or state agency.
- The page does not give individualized medical, legal, tax, insurance, Medicaid planning, or financial advice.
- The page does not contain insurer rankings, plan recommendations, ads, affiliate links, lead forms, or sales language.

## PDF release honesty review

Confirmed:

- The CTA still says `Download guide — source review in progress`.
- No fake PDF was added.
- No draft PDF was added.
- No file was added under `/public/guides`.
- No sitemap PDF entry was added.
- No QR codes were generated.

## Recommendation

Merge the review fixes. The public guide hub is meaningfully better after this pass and remains honest about the final PDF not being public yet.

Next recommended action after deploy:

1. Open the live page on mobile.
2. Confirm the shortcut grid reduces scroll fatigue.
3. Run the internal PDF artifact workflow.
4. Inspect the generated PDF artifact.
5. Only then decide whether to publish the final PDF.
