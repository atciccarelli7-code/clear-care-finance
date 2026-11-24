import type { Source, Visual } from "./types";

export const reviewed = "November 24, 2026";
const source = (label: string, url: string, supports: string): Source => ({ label, url, supports });
const medicare = "https://www.medicare.gov";
const medicaid = "https://www.medicaid.gov/medicaid";
const irs = "https://www.irs.gov";
const cms = "https://www.cms.gov";
const snf = source("Medicare.gov · Skilled nursing", medicare + "/coverage/skilled-nursing-facility-care", "Original Medicare inpatient-day calculation, entry window, ongoing skilled need, certified facility, waivers and benefit-period limit.");
const eligibility = source("Medicaid.gov · Eligibility", medicaid + "/eligibility-policy", "MAGI, non-MAGI, state options, Medicare Savings Programs, nonfinancial criteria and appeals.");
const institutional = source("Medicaid.gov · Institutional care", medicaid + "/long-term-services-supports/institutional-long-term-care", "State level-of-care criteria and institutional long-term services and supports.");
const dual = source("Medicare.gov · Medicaid", medicare + "/basics/costs/help/medicaid", "Dual eligibility, payment order, Medicaid benefits and Medicare cost help.");
const nursing = source("Medicare.gov · Nursing home care", medicare + "/coverage/nursing-home-care", "Short-term skilled benefit and usual exclusion of long-term personal care.");
const glossary = source("HealthCare.gov · Cost-sharing glossary", "https://www.healthcare.gov/SBC-Glossary/", "Allowed amount, balance billing, deductible, coinsurance, copay and examples.");
const compare = source("Medicare.gov · Compare options", medicare + "/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage", "Networks, drug coverage, prior authorization, Medigap and medical out-of-pocket limits.");

export const visuals = {
  "bill-to-payment": {
    title: "From a $1,000 charge to a $180 patient share",
    takeaway: "Your share comes from the $500 allowed amount after the plan’s contract adjustment.",
    scope: "Illustrative covered, in-network claim",
    diagram: { kind: "breakdown", billed: 1000, allowed: 500, deductible: 100, rate: 0.20 },
    check: "This service uses coinsurance. A copay is a fixed amount some services use. The example assumes $100 left on the deductible and that the out-of-pocket limit does not change the split.",
    sources: [glossary, source("HealthCare.gov · Out-of-pocket limit", "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/", "Eligible cost sharing counts toward the limit and what is excluded."), source("CMS · Hospital prices", cms + "/priorities/key-initiatives/hospital-price-transparency/hospitals", "Gross charges and negotiated prices are distinct categories.")],
  },
  "medicare-snf": {
    title: "Will Medicare cover a skilled nursing stay?",
    takeaway: "Check the hospital stay, the timing, and the skilled care needed before counting on coverage.",
    scope: "Original Medicare Part A · Medicare Advantage rules may differ",
    diagram: { kind: "sequence", steps: [
      { cue: "3 inpatient days", title: "Count from inpatient admission", text: "Usually at least three consecutive medically necessary inpatient days. Observation time and discharge day do not count." },
      { cue: "Generally within 30 days", title: "Enter a Medicare-certified facility", text: "The usual clock starts when you leave the hospital." },
      { cue: "Daily skilled care", title: "Confirm the ongoing need", text: "Skilled care may help you improve, maintain function, or slow decline." },
    ] },
    check: "Part A caps covered care at 100 days per benefit period, and coverage can end sooner. Some Original Medicare arrangements waive the three-day rule. Check your Advantage plan’s own requirements.",
    sources: [snf, compare],
  },
  "medicaid-pathways": {
    title: "Which Medicaid rules should you ask about?",
    takeaway: "Tell the state what you need. The state can screen more than one route.",
    scope: "Federal framework · Your state makes the eligibility decision",
    diagram: { kind: "branch", root: "What type of coverage or help do you need?", branches: [
      { cue: "Health coverage", title: "Income route (MAGI)", text: "Used for most children, pregnant people, parents and many adults. Uses tax-based income and household rules. No asset test." },
      { cue: "Age 65+, blindness or disability", title: "Non-MAGI route", text: "These groups generally use different income rules. The state may also look at assets." },
      { cue: "Ongoing daily support", title: "Long-term care (LTSS)", text: "Ask about both the financial rules and the care-needs assessment. Nursing facility and home-based programs can differ." },
    ] },
    check: "Long-term care can use a non-MAGI financial pathway. State residency and citizenship or eligible immigration rules may apply, with exceptions. Ask about Medicare Savings Programs if you have Medicare.",
    sources: [eligibility, institutional, source("Medicaid.gov · Home and community-based services", medicaid + "/home-community-based-services", "State pathways for services in home and community settings.")],
  },
  "medicaid-application": {
    title: "What happens after you apply for Medicaid?",
    takeaway: "Keep the filing date, answer requests for information, and save the written decision.",
    scope: "Federal application framework · States handle the details",
    diagram: { kind: "sequence", steps: [
      { title: "Submit", text: "Apply through the state Medicaid agency. Say if you also need long-term care and keep confirmation." },
      { title: "State verifies", text: "Respond to requests. For long-term care, ask how to schedule the care-needs assessment." },
      { title: "Read the notice", text: "Check the approved coverage and start date. If denied, read the reason and appeal instructions." },
    ] },
    check: "Federal standards generally allow up to 90 days for disability-based applications and 45 days for other applications. Defined exceptions apply. Those limits do not promise a placement or service start date.",
    sources: [source("HealthCare.gov · How to apply", "https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/", "Application channels and year-round application availability."), source("42 CFR § 435.912 · Decision timelines", "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-C/part-435/subpart-J/section-435.912", "Federal 45- and 90-day standards, scope and exceptions."), eligibility, institutional],
  },
  "medicare-medicaid": {
    title: "Medicare and Medicaid solve different problems",
    takeaway: "Medicare is federal health insurance. Medicaid is state-administered coverage under federal rules. Some people qualify for both.",
    scope: "U.S. program comparison · State and plan rules affect benefits",
    diagram: { kind: "matrix", columns: ["Medicare", "Medicaid"], rows: [
      { title: "Who it serves", cells: ["Mostly people 65 and older, plus certain younger people with disabilities or qualifying conditions.", "People who meet requirements for a state eligibility group. Income and other tests depend on the pathway."] },
      { title: "What it can cover", cells: ["Hospital and medical services. Drug coverage depends on how you get Medicare.", "Medical services and, for those who qualify, certain long-term care services."] },
      { title: "Help when you have both", cells: ["Generally pays before Medicaid for Medicare-covered care.", "May help with Medicare costs. Full Medicaid can cover additional services."] },
    ] },
    check: "A Medicare Savings Program can help with Medicare costs. Eligibility for full Medicaid benefits is a separate question.",
    sources: [dual, eligibility, source("Medicare.gov · Getting started", medicare + "/basics/get-started-with-medicare", "Medicare eligibility by age, disability and qualifying condition."), source("Medicare.gov · Who pays first?", medicare + "/health-drug-plans/coordination/who-pays-first", "Payer coordination and Medicaid as payer of last resort.")],
  },
  "medicare-options": {
    title: "Two ways to get Medicare benefits",
    takeaway: "Parts A and B are the core benefits. Part C is another way to receive them. Part D helps cover prescriptions.",
    scope: "Medicare plan structures · Check the current plan documents",
    diagram: { kind: "matrix", columns: ["Original Medicare", "Medicare Advantage (Part C)"], rows: [
      { title: "Hospital + medical", cells: ["Part A (hospital) and Part B (medical), through the federal program.", "A private Medicare plan delivers Part A and Part B benefits."] },
      { title: "Prescriptions", cells: ["You can generally add a separate Part D drug plan.", "Most plans include Part D."] },
      { title: "Doctors and approvals", cells: ["Use providers that take Medicare. Prior authorization is generally limited.", "Network, referral and prior authorization rules may apply."] },
      { title: "Large medical bills", cells: ["No yearly Part A/B spending cap. Medigap can help with certain costs.", "Has a yearly limit for covered Part A/B services. Medigap cannot pay Advantage cost sharing."] },
    ] },
    check: "Check your doctors, medications, and annual medical spending limit before choosing a plan.",
    sources: [compare, source("Medicare.gov · Parts A–D", medicare + "/basics/get-started-with-medicare/medicare-basics/parts-of-medicare", "Part definitions and how coverage is combined.")],
  },
  "nursing-home-payers": {
    title: "Who can pay for nursing home care?",
    takeaway: "The care you need matters more than the name on the building.",
    scope: "Common payment paths · Eligibility and facility participation matter",
    diagram: { kind: "branch", root: "What care does the person need?", branches: [
      { cue: "Short-term skilled care", title: "Check Medicare or the health plan", text: "Medicare can cover qualifying skilled nursing or therapy for a limited period. Verify the coverage conditions." },
      { cue: "Ongoing help with daily activities", title: "Check long-term care funding", text: "Medicare generally excludes this care. Options include Medicaid if eligible, a long-term care policy if it pays, or personal funds." },
    ] },
    check: "Ask which benefit is paying today, what would end it, and whether the facility participates in Medicaid if ongoing care is needed.",
    sources: [nursing, snf, institutional, source("Medicare.gov · Long-term care", medicare + "/coverage/long-term-care", "Most long-term daily support is excluded from Medicare coverage.")],
  },
  "financial-assistance": {
    title: "How to ask for help with a hospital bill",
    takeaway: "Find the hospital’s policy and check which bills it covers before applying.",
    scope: "Federal § 501(r) rules for tax-exempt hospitals · Policies differ",
    diagram: { kind: "sequence", steps: [
      { title: "Get the policy", text: "Ask billing for the financial assistance policy, plain-language summary, and application." },
      { title: "Check each bill", text: "Look at eligibility and the covered-provider list. A separate doctor’s bill may follow a different policy." },
      { title: "Apply and follow up", text: "Keep the submission confirmation. Ask about the decision and collection status while it is reviewed." },
    ] },
    check: "A tax-exempt hospital’s policy must cover emergency and other medically necessary care that the hospital facility provides. The policy defines who qualifies for free or discounted care.",
    sources: [source("IRS · Financial assistance policies", irs + "/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4", "Written policies, required scope, eligibility, methods of application and covered-provider lists."), source("IRS · Billing and collections", irs + "/charities-non-profits/billing-and-collections-section-501r6", "Reasonable efforts and conditions around extraordinary collection actions.")],
  },
  "medicare-enrollment": {
    title: "How to sign up for Medicare at 65",
    takeaway: "First check whether Part A and Part B will start automatically. If you need to apply, start with Social Security.",
    scope: "Medicare enrollment at 65 · Most U.S. residents",
    diagram: { kind: "branch", root: "Will you already be getting Social Security benefits at least four months before you turn 65?", branches: [
      { cue: "Yes · Usually automatic", title: "Check your Medicare card", text: "You generally get Part A and Part B automatically. Confirm your start dates and read the enrollment packet." },
      { cue: "No or unsure · Check with Social Security", title: "Confirm whether you need to apply", text: "If you need to sign up, the usual window begins three months before your birthday month and ends three months after it." },
    ] },
    check: "Before delaying Part B, verify the rules for coverage through your or your spouse’s current job. COBRA and retiree coverage work differently. Railroad Retirement and residents of Puerto Rico can follow different enrollment steps.",
    sources: [
      source("Medicare.gov · How to sign up", medicare + "/basics/get-started-with-medicare/sign-up/how-do-i-sign-up-for-medicare", "Automatic enrollment and application pathways."),
      source("Medicare.gov · When to sign up", medicare + "/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare", "Initial and special enrollment periods, active employment and COBRA."),
      source("Social Security · Sign up for Medicare", "https://www.ssa.gov/medicare/sign-up", "Application and enrollment contact."),
    ],
  },
  "disability-coverage": {
    title: "How disability can lead to Medicare or Medicaid",
    takeaway: "Social Security Disability Insurance (SSDI) and Supplemental Security Income (SSI) can lead to different health coverage. Check both paths if you need coverage now.",
    scope: "Federal Medicare rules · State Medicaid eligibility",
    diagram: { kind: "matrix", columns: ["SSDI", "SSI or disability-based Medicaid"], rows: [
      { title: "Coverage to check", cells: ["Medicare usually starts automatically after 24 months of Social Security disability benefit entitlement.", "Most states link SSI eligibility to Medicaid in some way. Some require a separate application or use different rules."] },
      { title: "What can change the timing", cells: ["With ALS, Medicare generally starts when disability benefits begin. End-stage renal disease (ESRD) has its own eligibility and timing rules.", "You can ask your state to screen you for Medicaid while SSDI or Medicare is pending. The state can check disability-based and other eligible groups."] },
    ] },
    check: "Ask Social Security for your disability benefit entitlement date and Medicare start date. Ask the state Medicaid agency about income, assets and any separate application, especially if you also need long-term care.",
    sources: [
      source("Medicare.gov · Disability and enrollment", medicare + "/basics/get-started-with-medicare/sign-up/how-do-i-sign-up-for-medicare", "Disability wait, ALS and ESRD pathways."),
      source("Social Security · SSI and other benefits", "https://www.ssa.gov/ssi/text-other-ussi.htm", "SSI and state Medicaid relationships."),
      eligibility,
    ],
  },
  "eob-match": {
    title: "Match the insurer’s EOB to the provider’s bill",
    takeaway: "Your insurer’s explanation of benefits shows how it processed the claim. The provider’s statement asks for payment.",
    scope: "After your plan processes a medical claim",
    diagram: { kind: "sequence", steps: [
      { title: "Find the same claim", text: "Match the patient, billing provider, date and service. Use the claim number if both documents show it." },
      { title: "Compare the patient amounts", text: "Find patient responsibility on the latest EOB. Compare it with the current bill and account for payments you already made." },
    ], outcomeLabel: "What to do with the result", outcomes: [
      { title: "Amounts line up", text: "Check that any earlier payment or credit is reflected before paying the remaining balance." },
      { title: "Amounts differ or the claim is pending", text: "Ask the billing office to reconcile the statement and the insurer to explain the claim if needed. Confirm the payment or appeal deadline." },
    ] },
    check: "If there are several bills, repeat this for each claim. The latest statement and EOB can change after a claim is corrected.",
    sources: [
      source("CMS · Read an EOB", cms + "/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits", "EOB fields and matching patient amounts."),
      source("CMS · Read a medical bill", cms + "/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill", "Provider bills and discrepancies."),
    ],
  },
  "multiple-bills": {
    title: "One ER visit can produce two separate claims",
    takeaway: "Match each statement to its own insurer explanation of benefits (EOB), even when both services happened on the same day.",
    scope: "Illustrative in-network claims · Deductible met · 20% coinsurance",
    diagram: { kind: "matrix", columns: ["Hospital facility", "Emergency clinician group"], rows: [
      { title: "Who billed", cells: ["Hospital for facility services.", "Clinician group for professional services."] },
      { title: "Charge / allowed / plan paid", cells: ["$1,200 / $600 / $480", "$400 / $200 / $160"] },
      { title: "Your share on the EOB", cells: ["$120", "$40"] },
      { title: "Provider statement", cells: ["$120", "$400"] },
      { title: "Next step", cells: ["The amounts match. Check any payments already made.", "Ask the clinician group to explain the $360 difference and confirm the payment deadline."] },
    ] },
    check: "This example assumes no copays, prior payments or secondary insurance. A mismatch is a reason to check the claim and statement before deciding what you owe.",
    sources: [
      source("CMS · Read a medical bill", cms + "/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill", "Separate claims and matching bills."),
      source("CMS · Read an EOB", cms + "/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits", "Patient responsibility and reconciliation."),
    ],
  },
} satisfies Record<string, Visual>;
