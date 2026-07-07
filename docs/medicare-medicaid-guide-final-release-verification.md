# Medicare and Medicaid Guide Final Release Fact Verification

Community Acquired Finance  
Final release-readiness verification pass  
Last updated: 2026-07-07

## Scope

This document records the final release-readiness verification pass for current-year Medicare dollar amounts and Medicare outpatient observation notice timing before any public PDF is created.

Files compared:

- `/docs/medicare-medicaid-guide-final-pre-pdf-manuscript.md`
- `/docs/medicare-medicaid-guide-source-binder.md`
- `/docs/medicare-medicaid-guide-fact-check.md`
- `/docs/medicare-medicaid-guide-public-release-report.md`

This pass does not publish the PDF, add a public PDF, unlock the landing page CTA, add a sitemap PDF URL, add QR codes, add ads, add affiliate links, add insurer rankings, add plan recommendations, or add lead forms.

## Public-release guardrails checked

Status before this PR:

- Latest production deployment after PR #104 was ready.
- The guide route returned HTTP 200 on the production deployment URL.
- `/public/guides/hospital-family-guide-medicare-medicaid-rehab-long-term-care.pdf` was not found in the repo.
- `/public/drafts/hospital-family-guide-medicare-medicaid-preflight.pdf` was not found in the repo.
- The guide landing page CTA remained disabled with the text `Download guide — source review in progress`.
- The sitemap included the guide hub URL but no public PDF URL.

## Official sources checked

### Medicare.gov Costs

Source:

`https://www.medicare.gov/basics/costs/medicare-costs`

Verified official 2026 amounts and cost-sharing language:

| Topic | Verified value / language |
|---|---|
| Part A inpatient hospital deductible | `$1,736` for each inpatient hospital benefit period before Original Medicare starts to pay. |
| Part A inpatient days 1-60 | `$0` after the Part A deductible. |
| Part A inpatient days 61-90 | `$434` each day. |
| Part A lifetime reserve days 91-150 | `$868` each day while using lifetime reserve days. |
| After day 150 | Patient pays all costs. |
| Skilled nursing facility days 1-20 | `$0`. |
| Skilled nursing facility days 21-100 | `$217` each day. |
| Skilled nursing facility days 101 and beyond | Patient pays all costs. |
| Covered home health services | `$0` for covered home health care services. |
| Durable medical equipment under home health / Part B | `20%` of the Medicare-approved amount after the Part B deductible. |
| Part B premium | `$202.90` each month for most people, higher depending on income. |
| Part B deductible | `$283` before Original Medicare starts to pay; paid once each year. |
| General Part B services | Usually `20%` of the cost for Medicare-covered services or items after the deductible when the provider accepts assignment. |

### Medicare.gov Skilled Nursing Facility Care

Source:

`https://www.medicare.gov/coverage/skilled-nursing-facility-care`

Verified official SNF language:

- Medicare Part A covers skilled nursing facility care for eligible beneficiaries for a limited time on a short-term basis.
- Original Medicare generally requires a qualifying inpatient hospital stay of at least 3 days in a row, starting the day the person was admitted as an inpatient and not including the discharge day.
- Time spent under observation or in the emergency room before inpatient admission does not count toward the 3-day qualifying inpatient hospital stay, even if the patient was there overnight.
- 2026 SNF cost-sharing is: days 1-20 `$0` each day after the relevant Part A deductible context, days 21-100 `$217` each day, and days 101 and beyond all costs.
- Part A limits SNF coverage to 100 days in each benefit period.

### Medicare.gov Home Health Services

Source:

`https://www.medicare.gov/coverage/home-health-services`

Verified official home health language:

- Medicare covers certain home health services under Part A and Part B when eligibility rules are met.
- Covered services can include medically necessary part-time or intermittent skilled nursing care, therapy, medical social services, certain home health aide care tied to skilled services, durable medical equipment, and medical supplies for home use.
- Medicare does not pay for 24-hour-a-day care at home, home meal delivery, unrelated homemaker services, or custodial/personal care when that is the only care needed.
- Covered home health services cost `$0`.
- After the Part B deductible, Medicare-covered medical equipment generally costs `20%` of the Medicare-approved amount.

### Medicare.gov Durable Medical Equipment

Source:

`https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage`

Verified official DME language:

- Medicare Part B covers medically necessary DME if the person is eligible.
- DME must be durable, used for a medical reason, generally useful only to someone sick or injured, used in the home, and expected to last at least 3 years.
- After the Part B deductible, the patient generally pays `20%` of the Medicare-approved amount if the supplier accepts assignment.
- If a DME supplier does not participate in Medicare or will not accept assignment, the patient may be charged more.

### eCFR / 42 CFR 489.20(y) — MOON timing and content requirements

Source:

`https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-G/part-489/subpart-B/section-489.20`

Verified Medicare outpatient observation notice requirement:

- A hospital or critical access hospital must provide notice to a Medicare beneficiary who receives observation services as an outpatient for more than 24 hours.
- The notice must be provided no later than 36 hours after observation services are initiated, or sooner if the person is transferred, discharged, or admitted.
- The notice may be provided before the person receives 24 hours of outpatient observation services.
- The standardized written notice must explain that the person is an outpatient receiving observation services and not an inpatient, and explain the reason for outpatient observation status.
- The written notice must explain the implications of outpatient observation status, including Medicare cost-sharing requirements and subsequent eligibility for Medicare coverage of skilled nursing facility services.
- The hospital must give an oral explanation of the written notice.
- The written notice must be signed by the individual or representative, or staff must document refusal/signature details as required.

Note: eCFR states that it is an authoritative but unofficial online version of the CFR. The underlying agency for the section is CMS/HHS. This is appropriate for release-readiness verification of the timing and notice-language guardrail, while the final guide should still point readers to Medicare/CMS resources rather than asking them to interpret regulations.

## Comparison against repository files

### Source binder

Status: **Correct for 2026 dollar amounts.**

The source binder already matched the verified Medicare.gov values:

- Part A inpatient deductible: `$1,736`.
- Part A days 61-90: `$434` per day.
- Lifetime reserve days: `$868` per day.
- SNF days 1-20: `$0`.
- SNF days 21-100: `$217` per day.
- Part B premium: `$202.90` per month for most people.
- Part B deductible: `$283`.
- Home health services: `$0` for covered services.
- DME: generally `20%` of the Medicare-approved amount after the Part B deductible.

Status: **MOON source anchor present but exact timing now separately verified in this report.**

The source binder already identifies CMS MOON as the source anchor and keeps observation discussion tied to specific coverage rules. This verification report records the exact 24-hour / 36-hour timing rule and required content elements.

### Final pre-PDF manuscript

Status: **No dollar-amount correction required.**

The active final pre-PDF manuscript avoids embedding detailed 2026 dollar amounts in chapter prose and instead refers to cost-sharing concepts and current-year verification discipline. This is safer for annual updates.

Status: **No immediate MOON correction required.**

The manuscript uses cautious observation language and tells families to ask whether the patient is inpatient, outpatient, or observation. It also warns not to generalize observation effects beyond the SNF qualifying-stay issue. It does not currently state a contradictory MOON timing rule.

Recommended final-copy option before public PDF creation:

If the final public guide should include exact MOON timing in Chapter 9, use plain-English wording like:

> For Medicare beneficiaries receiving outpatient observation services for more than 24 hours, hospitals generally must provide the Medicare Outpatient Observation Notice no later than 36 hours after observation services begin, or sooner if the patient is transferred, discharged, or admitted. Ask for the notice and an oral explanation if observation status is part of the situation.

Adding that sentence to the manuscript would require one more draft PDF preflight artifact run before publication.

### Fact-check report

Status: **Still accurate.**

The fact-check report correctly treated current-year dollar amounts and exact MOON wording/timing as final release checks. This document completes those checks for the current release-readiness pass.

### Public release report

Status: **Updated in this PR.**

The public release report should now mark current-year verification and MOON timing verification as complete, while keeping public release blocked until device, print, QR, and final public integration work are done.

## Release decision after this verification

Status: **Not released**.

The guide is closer to publication, but public release should still wait for:

- desktop review of the final public-candidate PDF,
- iPhone review,
- Android review if available,
- black-and-white print review,
- final QR destination plan,
- QR scan testing from screen and paper,
- creation of the final public PDF asset,
- landing page CTA unlock only after the file exists,
- sitemap PDF URL only after the file exists.

## Does this PR require another draft PDF artifact run?

No, not by itself.

This PR records verification and updates release-status documentation. It does not change the active manuscript, PDF builder, layout, public assets, sitemap, or landing page CTA.

If a follow-up PR adds exact MOON timing language directly to the manuscript, then another draft PDF preflight artifact run is required before public launch.

## Explicit exclusions

This pass does not add:

- public PDF,
- generated PDF commit,
- `/public/guides/` PDF,
- `/public/drafts/` PDF,
- sitemap PDF URL,
- QR codes,
- landing page CTA unlock,
- ads,
- affiliate links,
- insurer rankings,
- plan recommendations,
- lead forms,
- sales language.
