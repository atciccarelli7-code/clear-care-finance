# The Anatomy of a Hospital Bill — research and data record

Verified November 27, 2026. This record supports the flagship experience; it is not a patient cost quotation. Source metadata lives in `src/data/hospitalBillSources.ts`, scenarios in `src/data/hospitalBillScenarios.ts`, and exact public CMS query responses in `docs/data/hospital-bill/cms-2024-charlotte.json`.

## Evidence acquired and correction to the initiating example

The current CMS catalog resolves Medicare Inpatient Hospitals — by Provider and Service to reporting year 2024, dataset version `ca9b5ef0-1386-4759-b2b6-5f9b35116786`, modified April 23, 2026. The schema and four bounded provider/DRG queries were independently retrieved through the CMS Open Data connector. Each query returned exactly one matching row, no continuation, no clipped fields and no pagination limitation. The preserved responses contain source-identifying URLs, record identifiers, reporting period and publication date. No patient-level data were accessed.

| Hospital as named in CMS | CCN | DRG | Discharges | Average covered charges | Average total payments | Average Medicare payments |
|---|---|---|---:|---:|---:|---:|
| Novant Health Presbyterian Medical Center | 340053 | 194 | 24 | $35,054.96 | $7,540.96 | $5,686.38 |
| Carolinas Medical Center/Behav Health | 340113 | 194 | 65 | $43,645.31 | $12,976.22 | $6,931.57 |
| Novant Health Presbyterian Medical Center | 340053 | 291 | 109 | $37,941.76 | $10,122.89 | $9,135.69 |
| Carolinas Medical Center/Behav Health | 340113 | 291 | 155 | $49,953.26 | $15,709.30 | $10,502.95 |

DRG 194 is simple pneumonia and pleurisy with complication/comorbidity (CC). DRG 291 is heart failure and shock with major complication/comorbidity (MCC). Both hospitals are in Charlotte, North Carolina. Preserve the exact CMS hospital name; the Atrium pricing page separately identifies Carolinas Medical Center. Do not silently replace the reporting entity with every Atrium facility.

The original conversation's rounded Novant charge and total-payment figures were reproducible. Its $5,805 Medicare payment was a constructed subtraction of the 2026 deductible from a 2024 total-payment average. The observed 2024 Medicare average is instead $5,686.375. Neither value predicts an individual claim. The product must not perform that cross-year subtraction and label its result actual Medicare payment.

## Measurement definitions and comparison boundary

CMS's [dataset landing page](https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-provider-and-service) and [data dictionary](https://data.cms.gov/resources/medicare-inpatient-hospitals-by-provider-and-service-data-dictionary-0) establish the payment concepts. The readable [CMS dictionary PDF](https://data.cms.gov/sites/default/files/2023-05/394bc336-d146-4579-8ff3-9260c96ecd4e/MUP_INP_RY23_20230426_DD_PrvSrvc_508.pdf) was also read; it is a historical definition document, not the source of the 2024 records.

Covered charges are submitted covered-service charges averaged per discharge. Total payments combine Medicare payment with beneficiary cost-sharing responsibility and third-party coordination-of-benefits amounts. They include applicable DRG, teaching, disproportionate-share, capital and outlier components. Medicare payments exclude beneficiary cost sharing and coordination-of-benefits payments. The gap between these two averages is not an isolated patient deductible, an individual patient's liability, or proof of money actually collected. Neither average is an observed negotiated commercial price.

Comparisons are deliberately limited to the same year and DRG. They describe published Original Medicare fee-for-service inpatient records. CMS excludes provider/DRG records with ten or fewer discharges. The displayed sample sizes matter: these are small cohorts, not all patients with the diagnosis. The table does not control for wage index, teaching status, complexity within a DRG, transfers, outliers or other adjustments; it does not measure affordability, quality or hospital efficiency. Do not rank hospitals from this table or multiply it into a prospective personal estimate.

## Simulated statement and scenario decisions

The facility is fictional. No real hospital identity appears as the issuer of an educational statement. Patient names, ages, dates, service bundles, unit charges and care pathways are fictional. The first pneumonia statement totals $35,055 only as a reconstruction near the rounded public benchmark; its line items were not recovered from a hospital claim or chargemaster. Other examples use intentionally round teaching amounts.

Four initial scenarios prioritize complete explanations over breadth: pneumonia, heart failure, a counterfactual pneumonia discharge-delay variant, and outpatient observation. The delayed-discharge example holds the modeled allowed amount constant to expose the difference between additional charge/resource use and a case payment. It does not assert that every delay day is medically necessary or covered. The underlying clinical details do not establish CC/MCC coding. Actual coding requires the full documented record and grouper rules.

The scenario allowed amounts ($8,000 pneumonia/delay, $11,000 heart failure, $2,600 observation) and professional amounts are invented financial teaching assumptions. They are neither an application of a CMS rate formula nor verified commercial contracts. Actual historical aggregate benchmarks appear separately. No hospital operating-cost, profit, negotiated-price or claims observation is invented.

Revenue codes are broad illustrative department categories, not a coding reference. Routine nursing is included within the room-and-board example to avoid inventing a second nursing payment. Detail explanations distinguish bundled facility resources from potential separate emergency physician, hospitalist, specialist and radiologist claims.

Original Medicare observation facility pricing is explicitly unavailable. Part A inpatient cost sharing cannot be reused for observation. A credible OPPS example needs actual service codes, packaging, drugs, copayment exceptions and service-specific data. The observation narrative remains useful for classification and post-acute coverage even without claiming to calculate that missing amount.

## Coverage and patient-protection verification

- [Medicare costs](https://www.medicare.gov/basics/costs/medicare-costs): 2026 Part A deductible $1,736 per benefit period; days 61–90 $434 per day, lifetime reserve $868 per day. Corresponding announced 2027 amounts are $1,776, $444 and $888. Part B annual deductible is $283 in 2026 and $292 in 2027; most assigned physician services then use 20% coinsurance. Original Medicare has no annual medical out-of-pocket ceiling. These are coverage rules, not a way to derive facility reimbursement from historical averages.
- [Medigap benefits](https://www.medicare.gov/health-drug-plans/medigap/basics/compare-plan-benefits): distinguish standard Plan G from its high-deductible version; standard Plan G leaves the Part B deductible. Plan N has additional office/emergency visit caveats. A scenario does not choose or recommend a policy.
- [QMB billing prohibition](https://www.cms.gov/files/document/mln7936176-prohibition-billing-qualified-medicare-beneficiaries.pdf), September 2025: covered Part A/B cost sharing cannot be billed to a Qualified Medicare Beneficiary even if the state pays nothing. Unpaid protected cost sharing must not be presented as a secondary cash payment. “Dual eligible” by itself is not a blanket substitute for verifying the specific eligibility group.
- [NC Medicaid copays](https://medicaid.ncdhhs.gov/about-nc-medicaid/nc-medicaid-copays), modified April 24, 2026: listed adult doctor/outpatient copays are $4, with exempt populations/services. A covered NC inpatient facility example can assume no inpatient copay without generalizing that all Medicaid services nationally are free. Provider participation, coverage and state/plan rules matter.
- [Inpatient/outpatient status](https://www.medicare.gov/coverage/inpatient-hospital-care/inpatient-outpatient-status): an overnight bed is insufficient to establish inpatient status. [SNF coverage](https://www.medicare.gov/coverage/skilled-nursing-facility-care) ordinarily requires a qualifying three-day inpatient stay, excluding discharge day; observation does not count. ACO waivers and Medicare Advantage plan exceptions can apply. Clinical recommendation, coverage and an accepting facility are separate decisions.
- [No Surprises Act rights](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights): protected emergency and certain facility-based out-of-network care must not automatically create a balance bill. Federal ground-ambulance protection generally does not apply; state protections may differ. Out-of-network cases requiring unsupported plan facts should return an explanation, not an invented amount.
- [IRS financial assistance requirements](https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4): the applicable charitable hospital policy determines eligibility, assistance and covered providers. A separate physician can fall outside the hospital policy. Assistance is distinct from the contractual adjustment; neither is insurance cash.

## Competitor and search-intent review

The following is a bounded review of public surfaces on November 27, 2026, not proof that any competitor lacks a feature elsewhere. No claims of uniqueness or search-volume estimates are made.

| Resource inspected | What it contributes | CAF's defensible additional job |
|---|---|---|
| [CMS bill guide](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill) and [EOB guide](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits) | Authoritative document literacy and patient action steps | Keep one fictional encounter synchronized across itemization, benefit processing and patient balance |
| [KFF Health News Bill of the Month](https://kffhealthnews.org/series/bill-of-the-month/) | Reported real-bill investigations with patient context | Let readers change clearly fictional coverage assumptions without suggesting a real reported case is being re-adjudicated |
| [FAIR Health Consumer](https://www.fairhealthconsumer.org/en/insurance-basics/your-health-plan/get-covered) | Cost-tool navigation and extensive insurance explanations | Connect resource use, patient documents and hospital payment mechanisms; homepage fetch timed out, so no full tool audit is claimed |
| [Healthcare Bluebook / Valenz](https://www.valenzhealth.com/solutions/member-experience/) | Navigation, cost/quality and member-support products; former Bluebook homepage redirects here | Offer an openly accessible educational journey rather than claim equivalence to employer/plan-specific navigation |
| [ShowTheBill](https://showthebill.com/) | Public hospital pricing, Medicare references and explicit estimation limitations | Explore inpatient scenarios and benefit-period mechanics, keeping posted prices distinct from aggregate payment data |
| [Novant estimator information](https://www.novanthealth.org/for-patients/billing--insurance/price-transparency/) | Facility price estimator and financial navigator; warns estimates differ from final bills and professional fees may be separate | Explain why documents differ and when readers need the provider's actual estimate |
| [Atrium pricing information](https://atriumhealth.org/for-patients-visitors/financial-assistance/pricing) | Insured/uninsured estimates and hospital machine-readable file links | Teach comparison boundaries; do not relabel posted rows as a complete episode or patient's final liability |
| [University of Utah EOB guide](https://healthcare.utah.edu/bill/eob-explanation-benefits) | Annotated EOB and denial/reconsideration explanations | Synchronize a sample statement, payer ledger and practical bill-review questions |
| [Peterson-KFF Health System Tracker](https://www.healthsystemtracker.org/) | Expenditure/affordability charts and public calculators | Move between aggregate financial context and a clearly fictional individual document without confusing the two |
| [AHRQ HCUP cost ratios](https://hcup-us.ahrq.gov/db/ccr/costtocharge.jsp) | A documented way to estimate resource cost using hospital-level ratios | Explain why no admission-level profit can be inferred here. MEPS query page returned unauthorized; no MEPS figure is used |

Search intent is treated qualitatively: cost-of-stay questions need a distinction between charges and liability; sample-bill/EOB searches need document literacy; observation questions need classification; unaffordable-bill questions need assistance and insurer/billing-office next steps. A single flagship route with shareable public scenario identifiers avoids producing thin keyword variants. Future Search Console evidence, not claimed keyword volume, should determine discovery refinements.

Novant and Atrium publish large machine-readable files. This pass verified official access points and limitations but did not normalize an equivalent commercial contract/service pair. Commercial negotiated prices therefore remain unavailable, rather than estimated from Medicare averages. This is an accuracy boundary, not a claim that the hospitals failed to publish usable data.

## Maintenance and publication process

Owner: CAF editorial/product maintenance. Annual Medicare changes require substantive review before January 1; CMS updates require verifying the catalog version, schema and definitions, rerunning bounded CCN/DRG queries and retaining the returned provenance. Compare the same year and service; never silently combine reporting years. New snapshots replace public display only after reconciliation tests and source review. Preserve prior evidence in the release record.

For each new scenario: define the teaching question; label all invented financial assumptions; retrieve an eligible aggregate comparator or say unavailable; verify clinical and billing distinctions; reconcile quantities and cents; test each supported coverage; verify mobile, keyboard and assistance handoffs. A source date is not a clinical-review credential. No named clinician review or real-user testing is claimed by this research pass.

Publication dispositions for assigned roles:

- Content/evidence integrity: **PASS for the documented data layer**, with explicit exclusions for commercial prices, admission costs and Medicare observation adjudication. The UI must preserve those labels.
- Healthcare-user research: **WARN**. Patient/caregiver/professional workflows and practical questions are represented; no new patient interviews or screen-reader user studies were conducted.
- Context stewardship: **PASS for this research record**. Prior insurer-payment assumption corrected; complete public source snapshots retained. Parent workstream owns global ledger updates.
- Publishing governance: **WARN until integrated release verification**. Source owner/date, applicability, exclusions and update triggers are documented; production status must be checked by the release owner.

## Independent integrated source audit

The implemented flagship, methodology and education components were reviewed against the primary-source scope above. The labels correctly distinguish public aggregates, fictional charge details, invented covered payment bases, official cost sharing and assumed resource costs. The 2027 comparison explicitly leaves the fictional 2026 service dates unchanged. Unsupported Medicare observation and unprotected out-of-network pricing do not invent amounts.

Two integration findings were returned to the release owner: the next-care links initially used an unregistered `/hospital-to-home-navigator` route, and hospital economics initially received combined facility plus professional collections when the separate professional claim was enabled. The latter would mix two providers' receipts into a hospital-resource comparison. Release must use the existing discharge-coverage route and facility-only financial scope, with an explicit independent-assumption label for any fallback.

Added four data/evidence tests in `src/test/hospitalBillData.test.ts`; all passed. They compare all public benchmark fields to the retained independent CMS responses, enforce comparison-period and dataset consistency, check source references and observation boundaries, verify fictional encounter dates/day counts, and exercise reconciliation for every inpatient story across all nine coverage presets and both supported years with separate professional claims. TypeScript and targeted lint passed after this review. These checks validate internal evidence fidelity and calculations; they do not certify clinical coding, actual patient outcomes, commercial contracts, or a production deployment.
