# CAF editorial library audit — 2026-09-02

## Disposition

All **77 currently published article URLs** were reviewed against CAF's confirmed RN-led, publication-first strategy and assigned exactly one primary classification. The runtime registry and regression test enforce completeness and uniqueness.

| Classification | Count | Public treatment |
|---|---:|---|
| FLAGSHIP | 6 | Leads the archive and receives explicit related-reading support. |
| KEEP | 52 | Remains indexed and available in the core subject library. |
| REWORK | 8 | Remains indexed and visible, but needs founder perspective, a narrower reader job, fresher evidence, or stronger differentiation before promotion. |
| CONSOLIDATE | 0 | No merge is justified on the current small and non-additive search sample. |
| DE-EMPHASIZE | 11 | Remains indexed and searchable, but moves to a collapsed secondary library and does not define CAF's first impression. |
| RETIRE | 0 | No retirement is justified without stronger traffic/backlink evidence or a clearly superior replacement. |

## Evidence and conservative URL standard

- The August 28, 2026 Search Console export is the authoritative search baseline: **20 sitewide clicks and 3,449 impressions**. The page table is non-additive at 21 clicks and 3,974 impressions.
- Generic pages are not assumed worthless. `/articles/can-you-live-off-dividends-passive-income-guide` recorded 1 click / 27 impressions, and `/articles/money-stress-after-hard-shift` recorded 1 click / 3 impressions. Both therefore retain their canonical URLs; the former is de-emphasized and the latter is marked for a differentiated rework.
- Qualified healthcare-worker pages retain prominence where evidence supports it: the hospital 403(b) match page recorded 3 clicks / 219 impressions, and the nurse 403(b) contribution page recorded 1 click / 34 impressions.
- Hospital-cost and care-transition pages with early impressions retain their current canonicals, including allowed amount (308 impressions), facility fee (86), observation status (56), hospital financial assistance (18), and short-term rehab (2).
- Current internal links, generated sitemap, canonicals, robots rules, permanent redirects, and article registry were inspected before making the dispositions.
- External backlink data was not available. That gap is one reason no indexed article is redirected, merged, deindexed, or retired in this release.

## Reader-facing editorial architecture

1. Hospital economics & operations
2. Costs, bills & insurance
3. Care transitions & discharge
4. Medicare & Medicaid
5. Healthcare worker money & benefits

These five desks are intentionally broader than the implementation categories in article data. They answer what CAF covers without exposing a long, unstable SEO taxonomy.

## Complete article inventory

| URL | Article | Editorial area | Classification |
|---|---|---|---|
| `/articles/20-dollar-tylenol-hospital-prices` | The $20 Tylenol Isn’t Really About the Tylenol | Hospital economics & operations | FLAGSHIP |
| `/articles/what-nonprofit-hospital-actually-means` | What a Nonprofit Hospital Actually Is (and Isn’t) | Hospital economics & operations | FLAGSHIP |
| `/articles/why-hospitals-care-about-length-of-stay` | Why Hospitals Care So Much About Length of Stay | Hospital economics & operations | FLAGSHIP |
| `/articles/why-just-send-them-to-rehab-is-not-simple` | Why “Just Send Them to Rehab” Is Not That Simple | Care transitions & discharge | FLAGSHIP |
| `/articles/why-hospitals-become-the-systems-shock-absorber` | Why the Hospital Becomes the System’s Shock Absorber | Hospital economics & operations | FLAGSHIP |
| `/articles/home-with-family-is-not-a-free-care-plan` | “Home With Family” Is Not a Free Care Plan | Care transitions & discharge | FLAGSHIP |
| `/articles/what-employer-benefit-changes-should-i-compare` | What Employer-Benefit Changes Should I Compare During Open Enrollment? | Healthcare worker money & benefits | KEEP |
| `/articles/does-medicare-cover-long-term-care` | Does Medicare Cover Long-Term Care? | Medicare & Medicaid | KEEP |
| `/articles/does-medicare-cover-rehab-after-hospital-stay` | Does Medicare Cover Rehab After a Hospital Stay? | Medicare & Medicaid | KEEP |
| `/articles/medicare-vs-medicaid-what-is-the-difference` | Medicare vs Medicaid: What Is the Difference? | Medicare & Medicaid | KEEP |
| `/articles/what-does-medicare-not-cover` | What Does Medicare Not Cover? | Medicare & Medicaid | KEEP |
| `/articles/why-do-i-still-owe-money-with-medicare` | Why Do I Still Owe Money With Medicare? | Medicare & Medicaid | KEEP |
| `/articles/how-much-should-a-nurse-put-in-403b-per-paycheck` | How Much Should a Nurse Put in a 403(b) Per Paycheck? | Healthcare worker money & benefits | KEEP |
| `/articles/how-hospital-403b-matching-works` | How Does a Hospital 403(b) Match Work? Examples and Vesting | Healthcare worker money & benefits | KEEP |
| `/articles/how-to-pick-retirement-investments-at-work` | How to Pick Retirement Investments at Work | Healthcare worker money & benefits | KEEP |
| `/articles/healthcare-worker-money-map` | The Healthcare Worker Money Map | Healthcare worker money & benefits | REWORK |
| `/articles/how-healthcare-workers-can-invest-without-picking-stocks` | How Healthcare Workers Can Invest Without Picking Stocks | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/savings-rate-that-actually-changes-your-life` | The Savings Rate That Actually Changes Your Life | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/roth-vs-traditional-403b-healthcare-workers` | Roth vs Traditional 403(b) for Healthcare Workers | Healthcare worker money & benefits | KEEP |
| `/articles/can-healthcare-workers-reach-financial-independence` | Can Healthcare Workers Reach Financial Independence? | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/cash-vs-investing-when-you-feel-behind` | Should You Keep Cash or Invest It? A Practical Decision Framework | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/can-you-live-off-dividends-passive-income-guide` | Can You Live Off Dividends? A Plain-English Passive Income Guide | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/money-stress-after-hard-shift` | Money Stress After a Hard Shift | Healthcare worker money & benefits | REWORK |
| `/articles/earn-more-without-burning-out-bedside` | How to Earn More Without Burning Out at Bedside | Healthcare worker money & benefits | REWORK |
| `/articles/managing-money-has-never-been-easier-or-harder` | Managing Money Has Never Been Easier—or Harder | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/use-credit-cards-without-credit-card-debt` | How to Use a Credit Card Without Carrying Credit Card Debt | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/open-enrollment-mistakes-healthcare-workers` | Open Enrollment Mistakes Healthcare Workers Make Every Year | Healthcare worker money & benefits | KEEP |
| `/articles/premium-deductible-out-of-pocket-open-enrollment` | Premium, Deductible, and Out-of-Pocket Max: How to Compare Health Plans | Healthcare worker money & benefits | KEEP |
| `/articles/spouse-family-health-insurance-open-enrollment` | Can You Add a Spouse to Your Health Insurance? Rules, Costs, and Dual Coverage | Healthcare worker money & benefits | KEEP |
| `/articles/prescription-coverage-open-enrollment-checklist` | How to Check Prescription Drug Coverage Before Choosing a Health Plan | Healthcare worker money & benefits | KEEP |
| `/articles/network-checklist-open-enrollment` | In-Network Is Not One Checkbox: What to Verify During Open Enrollment | Healthcare worker money & benefits | KEEP |
| `/articles/disability-insurance-healthcare-workers-open-enrollment` | Disability Insurance for Healthcare Workers: The Benefit You Should Not Ignore | Healthcare worker money & benefits | KEEP |
| `/articles/employer-life-insurance-open-enrollment` | Employer Life Insurance: Helpful, But Usually Not a Full Plan | Healthcare worker money & benefits | KEEP |
| `/articles/accident-critical-illness-hospital-indemnity-open-enrollment` | Accident vs. Critical Illness vs. Hospital Indemnity Insurance | Healthcare worker money & benefits | KEEP |
| `/articles/dental-vision-insurance-open-enrollment` | Dental and Vision Insurance: What to Check Before Adding Them | Healthcare worker money & benefits | KEEP |
| `/articles/health-fsa-vs-dependent-care-fsa` | Health FSA vs Dependent Care FSA: Same Name, Totally Different Use | Healthcare worker money & benefits | KEEP |
| `/articles/open-enrollment-paycheck-impact` | How Open Enrollment Changes Your Paycheck | Healthcare worker money & benefits | KEEP |
| `/articles/beneficiaries-open-enrollment-checklist` | The 10-Minute Open Enrollment Task That Prevents a Legal Mess | Healthcare worker money & benefits | KEEP |
| `/articles/from-the-bedside-medicare-prescription-cost` | Why Is My Prescription So Expensive If I Have Medicare? | Medicare & Medicaid | KEEP |
| `/articles/from-the-bedside-long-term-care-medicaid-hospital-delay` | From the Bedside: Long-Term Care Medicaid Should Not Wait Until a Crisis | Medicare & Medicaid | KEEP |
| `/articles/why-am-i-getting-a-blood-thinner-in-the-hospital` | Why Am I Getting a Blood Thinner in the Hospital? | Care transitions & discharge | KEEP |
| `/articles/why-did-the-hospital-stop-or-change-my-home-medications` | Why Did the Hospital Stop or Change My Home Medications? | Care transitions & discharge | KEEP |
| `/articles/safe-hospital-discharge-first-72-hours` | Safe Hospital Discharge and the First 72 Hours at Home | Care transitions & discharge | KEEP |
| `/articles/blood-thinner-safety-before-going-home` | Blood Thinner Safety: What to Verify Before Going Home | Care transitions & discharge | KEEP |
| `/articles/copd-recovery-after-hospital` | COPD Recovery After a Hospital Visit | Care transitions & discharge | KEEP |
| `/articles/heart-failure-plan-after-discharge` | Heart Failure: Understanding the Plan After Discharge | Care transitions & discharge | KEEP |
| `/articles/new-home-oxygen-nebulizer-guide` | New Home Oxygen and Nebulizer Guide | Care transitions & discharge | KEEP |
| `/articles/diagnosis-explained` | Diagnosis, Explained: Our Plain-English Guide System | Care transitions & discharge | DE-EMPHASIZE |
| `/articles/how-healthcare-workers-should-compare-job-offers` | How Healthcare Workers Should Compare Two Job Offers | Healthcare worker money & benefits | KEEP |
| `/articles/why-one-hospital-visit-can-create-multiple-bills` | Why One Hospital Visit Can Create Multiple Bills | Costs, bills & insurance | KEEP |
| `/articles/facility-fee-vs-professional-fee` | Facility Fee vs. Professional Fee: Why One Visit Can Produce Two Bills | Costs, bills & insurance | KEEP |
| `/articles/observation-vs-inpatient-status` | Observation vs. Inpatient Status: The Hospital Classification That Can Change the Bill | Medicare & Medicaid | KEEP |
| `/articles/in-network-hospital-out-of-network-bills` | In-Network Hospital Does Not Always Mean Every Bill Is In-Network | Costs, bills & insurance | KEEP |
| `/articles/allowed-amount-medical-bills` | Allowed Amount: The Number That Actually Matters on a Medical Bill | Costs, bills & insurance | KEEP |
| `/articles/prior-authorization-explained` | What Is Prior Authorization? Why Insurance Can Delay Doctor-Recommended Care | Costs, bills & insurance | KEEP |
| `/articles/check-hospital-financial-assistance-before-paying` | Before You Pay a Hospital Bill, Check Financial Assistance | Costs, bills & insurance | KEEP |
| `/articles/insurance-is-future-planning` | Insurance Is Future Planning, Not Just a Monthly Bill | Costs, bills & insurance | KEEP |
| `/articles/medicare-advantage-vs-original-medicare-2026` | Medicare Advantage vs. Original Medicare in 2026: Key Tradeoffs | Medicare & Medicaid | KEEP |
| `/articles/hsa-vs-fsa-healthcare-workers` | HSA vs FSA: The Plain-English Guide for Healthcare Workers | Healthcare worker money & benefits | KEEP |
| `/articles/medicare-medicaid-changes-january-2027` | Medicare and Medicaid Changes Scheduled for January 1, 2027 | Medicare & Medicaid | REWORK |
| `/articles/obbb-overtime-tax-deduction-healthcare-workers` | The OBBB Overtime Tax Deduction, Explained for Healthcare Workers | Healthcare worker money & benefits | REWORK |
| `/articles/backup-care-plans-for-busy-healthcare-workers` | Backup Childcare for Healthcare Workers: A Shift-Proof Plan | Healthcare worker money & benefits | KEEP |
| `/articles/workplace-benefits-definitions` | Workplace Benefits Definitions | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/deductible-copay-coinsurance-out-of-pocket-max` | Deductible vs. Copay vs. Coinsurance vs. Out-of-Pocket Maximum | Costs, bills & insurance | KEEP |
| `/articles/how-to-read-an-eob` | How to Read an Explanation of Benefits (EOB) Before Paying a Medical Bill | Costs, bills & insurance | KEEP |
| `/articles/why-er-visit-is-expensive` | Why an ER Visit Can Be So Expensive | Costs, bills & insurance | KEEP |
| `/articles/medicare-options-explained` | Medicare Options Explained | Medicare & Medicaid | KEEP |
| `/articles/discharge-coverage-guide` | Discharge Coverage Guide | Medicare & Medicaid | REWORK |
| `/articles/short-term-rehab-after-hospital` | Short-Term Rehab After the Hospital | Medicare & Medicaid | REWORK |
| `/articles/home-health-after-discharge` | Home Health After Discharge | Medicare & Medicaid | KEEP |
| `/articles/durable-medical-equipment-after-discharge` | Durable Medical Equipment After Discharge | Medicare & Medicaid | KEEP |
| `/articles/long-term-care-and-custodial-care` | Skilled Care vs. Custodial Care: What Medicare Usually Covers | Medicare & Medicaid | KEEP |
| `/articles/medicaid-dual-eligibility-ltss` | Medicaid, Dual Eligibility, and LTSS | Medicare & Medicaid | KEEP |
| `/articles/plain-english-glossary` | Plain-English Healthcare Finance Glossary | Costs, bills & insurance | DE-EMPHASIZE |
| `/articles/hospital-cafe-habit` | How Much Does Hospital Cafeteria Spending Cost Per Year? | Healthcare worker money & benefits | KEEP |
| `/articles/healthcare-worker-discounts` | Healthcare Worker Discounts and Perks Directory | Healthcare worker money & benefits | DE-EMPHASIZE |
| `/articles/burnout-overspending-overeating` | Burnout, Overspending, and Overeating After Hard Shifts | Healthcare worker money & benefits | REWORK |

## Action standard by classification

- **FLAGSHIP:** keep intact; lead the archive; preserve founder voice and article-specific related-reading paths.
- **KEEP:** retain canonical, indexability, sitemap presence, and core-library placement.
- **REWORK:** retain canonical and current availability; improve in place in a future founder-led editing assignment rather than publishing a replacement URL.
- **DE-EMPHASIZE:** retain canonical, sitemap, direct search access, and archive search; remove from the default core grid and place in the collapsed additional-guides section.
- **CONSOLIDATE / RETIRE:** none. The two apparent rehab pages remain distinct coverage and practical-setting jobs; the generic glossary/reference pages lack enough current URL and backlink evidence for destructive handling.

## Revisit trigger

Re-run the inventory after 28 and 90 settled days of post-release Search Console evidence, or earlier if a page becomes unsafe, obsolete, receives material backlinks/traffic, or demonstrates query cannibalization. Any future merge or retirement must name the replacement, verify external and internal links where data are available, avoid redirect chains, and pass sitemap/canonical/link checks.
