import type { Article, ArticleSection } from "./articles";

const REVIEW_DATE = "2026-07-13";
const NEXT_REVIEW_DATE = "2027-01-15";

const directAnswerSection = (definition: string, keyPoints: string[], watchOut?: string): ArticleSection => ({
  title: "The direct answer",
  definition,
  keyPoints,
  ...(watchOut ? { watchOut } : {}),
});

const prependSection = (article: Article, section: ArticleSection) => [section, ...(article.sections ?? [])];

const reviewMetadata = (scope: string) => ({
  lastReviewedAt: REVIEW_DATE,
  nextReviewAt: NEXT_REVIEW_DATE,
  reviewScope: scope,
  updateNote: "Updated after reviewing Google Search Console impressions, ranking position, and query intent for Community Acquired Finance.",
});

const enhanceArticle = (article: Article): Article => {
  switch (article.slug) {
    case "how-hospital-403b-matching-works":
      return {
        ...article,
        ...reviewMetadata("Hospital 403(b) employer-match formulas, eligible pay, payroll timing, vesting, 401(a) deposits, and contribution examples."),
        title: "How Does a Hospital 403(b) Match Work? Examples and Vesting",
        promise: "Decode hospital 403(b) matching formulas, calculate the contribution needed for the full match, and check vesting before changing jobs.",
        description: "See how hospital 403(b) matching works, including common formulas, contribution examples, vesting, eligible pay, and 401(a) employer deposits.",
        summary: "A hospital 403(b) match is employer money tied to your own contribution under the plan's formula. A match of 100% up to 6% usually means you must contribute 6% of eligible pay to receive the maximum available match. A match of 50% on the first 6% usually produces an employer contribution equal to 3% of eligible pay. Check eligible compensation, per-paycheck timing, true-up rules, the account receiving employer money, and vesting before assuming you are receiving the full benefit.",
        sections: prependSection(
          article,
          directAnswerSection(
            "The contribution needed for the full hospital 403(b) match depends on the exact formula in the plan document.",
            [
              "A 100% match up to 6% generally requires a 6% employee contribution to receive the maximum match.",
              "A 50% match on the first 6% generally requires a 6% employee contribution and produces an employer contribution equal to 3% of eligible pay.",
              "Employer money may be deposited into the 403(b) or a related 401(a) account.",
              "Eligible pay, payroll timing, annual true-up rules, and vesting can change the result.",
            ],
            "Do not rely only on a benefits summary. Confirm the formula, eligible compensation, true-up provisions, and vesting in the current plan materials.",
          ),
        ),
        comparisonTable: {
          headers: ["Match formula", "Employee contribution for full match", "Employer contribution at the cap"],
          rows: [
            ["100% of the first 3%", "3% of eligible pay", "Up to 3% of eligible pay"],
            ["100% of the first 6%", "6% of eligible pay", "Up to 6% of eligible pay"],
            ["50% of the first 6%", "6% of eligible pay", "Up to 3% of eligible pay"],
            ["Fixed 2% plus 50% of the first 4%", "4% of eligible pay", "Up to 4% total employer contribution"],
          ],
        },
        numberedSteps: [
          "Find the exact employer-match formula in the plan document or benefits portal.",
          "Identify which earnings count as eligible pay, including base pay, overtime, differentials, bonuses, or incentive pay.",
          "Calculate the employee contribution percentage needed to reach the match cap.",
          "Confirm whether the employer deposit appears in the 403(b), a 401(a), or another related account.",
          "Check per-paycheck matching and whether the plan offers an annual true-up if contributions are front-loaded.",
          "Review the vesting schedule before changing employers.",
        ],
        questionsToAsk: [
          "What employee contribution percentage is required to receive the full employer match?",
          "Which types of compensation count as eligible pay?",
          "Is the match calculated each paycheck, and is there an annual true-up?",
          "Where are employer contributions deposited?",
          "When are employer contributions fully vested?",
          "Does the employer match Roth contributions, pre-tax contributions, or both?",
        ],
        relatedCalculator: { label: "403(b) Paycheck Contribution Calculator", href: "/tools/403b-paycheck-calculator" },
      };

    case "facility-fee-vs-professional-fee":
      return {
        ...article,
        ...reviewMetadata("Facility fees, professional fees, hospital outpatient billing, EOB matching, network status, and duplicate-bill review."),
        title: "Facility Fee vs. Professional Fee: Why One Visit Can Produce Two Bills",
        promise: "Separate the hospital or clinic charge from the clinician charge, then match both bills to the EOB before paying.",
        description: "Learn the difference between a facility fee and professional fee, why one visit can create two bills, and what to verify before paying.",
        summary: "A facility fee pays for the hospital-owned building, equipment, staff, and overhead. A professional fee pays for the physician or other clinician's work. One outpatient visit can legitimately produce both charges, sometimes from separate billing entities. Match each bill to the EOB, confirm the allowed amount and network status, and ask whether the location bills as a hospital outpatient department before paying a surprising balance.",
        sections: prependSection(
          article,
          directAnswerSection(
            "A facility fee and a professional fee pay for different parts of the same visit, so one appointment can create two separate claims or bills.",
            [
              "The facility fee generally covers the site, equipment, supplies, support staff, and hospital overhead.",
              "The professional fee generally covers the physician, advanced practice clinician, radiologist, anesthesiologist, or other licensed professional.",
              "The two charges may have different claim numbers, billing groups, network statuses, and patient-responsibility amounts.",
              "The EOB should show whether the insurer processed each claim and how the allowed amount was calculated.",
            ],
            "Two bills are not automatically duplicate bills, but an unexplained or mismatched charge should be reviewed before payment.",
          ),
        ),
        comparisonTable: {
          headers: ["Charge", "What it commonly pays for", "What to verify"],
          rows: [
            ["Facility fee", "Hospital-owned site, equipment, supplies, support staff, and overhead", "Place of service, network status, allowed amount, and whether the site is hospital-based"],
            ["Professional fee", "Clinician evaluation, interpretation, procedure, or professional work", "Clinician or billing group, network status, service code, and allowed amount"],
            ["Separate ancillary bill", "Radiology, pathology, anesthesia, laboratory, or other separately billed service", "Whether the service was expected, processed by insurance, and protected by applicable surprise-billing rules"],
          ],
        },
        numberedSteps: [
          "Collect every bill and the insurer EOB for the same date of service.",
          "Match the provider or billing entity, claim number, service date, billed amount, allowed amount, and patient responsibility.",
          "Ask whether the location is a hospital outpatient department and whether a facility fee was disclosed.",
          "Confirm the facility and professional billing groups were processed at the expected network level.",
          "Request an itemized bill and coding review when the charges do not match the EOB or the visit performed.",
          "Check financial assistance before using savings or a credit card for a large hospital balance.",
        ],
        questionsToAsk: [
          "Is this a facility fee, professional fee, or ancillary-service bill?",
          "Was this location billed as a hospital outpatient department?",
          "Which claim and EOB correspond to this bill?",
          "Were both the facility and clinician processed in-network?",
          "Does the patient responsibility match the insurer's EOB?",
          "Can the billing office provide an itemized statement and financial-assistance application?",
        ],
        relatedCalculator: { label: "EOB to Medical Bill Match Checker", href: "/tools/eob-to-bill-match-checker" },
      };

    case "backup-care-plans-for-busy-healthcare-workers":
      return {
        ...article,
        ...reviewMetadata("Backup childcare planning for healthcare shifts, call, weekends, holidays, illness, school closures, employer benefits, and dependent-care costs."),
        title: "Backup Childcare for Healthcare Workers: A Shift-Proof Plan",
        promise: "Build a primary, backup, and emergency childcare plan that can survive early shifts, weekends, call, illness, and school closures.",
        description: "Create a backup childcare plan for nursing shifts, weekends, call, illness, and school closures, including employer benefits and cost planning.",
        summary: "Healthcare schedules need more than one childcare option. A practical plan names a primary caregiver, a backup for predictable disruptions, and an emergency option for same-day failures. Confirm operating hours, illness policies, pickup permissions, travel time, cost, employer backup-care benefits, and who can respond when a shift runs late.",
        sections: prependSection(
          article,
          directAnswerSection(
            "A reliable childcare plan for healthcare work should include a primary arrangement, a scheduled backup, and an emergency same-day option.",
            [
              "Test the plan against early starts, late handoffs, weekends, holidays, mandatory education, call, and overtime.",
              "Write down pickup permissions, medication instructions, emergency contacts, and transportation details before a disruption.",
              "Check employer backup-care programs, dependent-care FSAs, and childcare discounts before assuming the full cost is out of pocket.",
              "Price the backup plan into the job's real compensation and schedule value.",
            ],
            "A backup that cannot accept a sick child, open before shift report, or handle a late pickup is not a complete backup for many healthcare schedules.",
          ),
        ),
        numberedSteps: [
          "List the schedule disruptions most likely to break the normal childcare plan.",
          "Name one primary, one backup, and one emergency option for each child.",
          "Confirm hours, illness rules, pickup authorization, transportation, and response time.",
          "Estimate monthly and emergency costs, including late fees and transportation.",
          "Check employer backup-care, dependent-care FSA, and local program eligibility.",
          "Run a practice scenario before the first real emergency.",
        ],
        questionsToAsk: [
          "Can this option cover early mornings, evenings, weekends, holidays, or call?",
          "What happens when a child is mildly ill or school closes unexpectedly?",
          "Who is authorized to pick up the child if a shift runs late?",
          "Does the employer subsidize backup care or dependent-care expenses?",
          "What is the true hourly cost after fees, travel, and missed work?",
        ],
        relatedCalculator: { label: "Childcare Benefits Decision Guide", href: "/tools/childcare-benefits-decision-guide" },
      };

    case "prescription-coverage-open-enrollment-checklist":
      return {
        ...article,
        ...reviewMetadata("Prescription formularies, tiers, pharmacies, deductibles, prior authorization, step therapy, quantity limits, and annual health-plan comparison."),
        title: "How to Check Prescription Drug Coverage Before Choosing a Health Plan",
        promise: "Verify each medication, tier, pharmacy, restriction, and expected annual cost before choosing a health plan.",
        description: "Check prescription drug coverage before choosing a health plan, including formularies, tiers, pharmacies, deductibles, and prior authorization.",
        summary: "A plan can have a low premium and still be expensive if a medication is excluded, placed on a high tier, subject to a drug deductible, or limited to certain pharmacies. Check the exact drug name, dose, formulation, tier, copay or coinsurance, deductible, prior authorization, step therapy, quantity limits, and preferred pharmacy for every regularly used medication.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Check every regular medication against the exact plan formulary before enrollment, not only the insurer's general drug search page.",
            [
              "Confirm the exact drug, dose, formulation, and quantity.",
              "Identify the tier and whether the price is a copay or percentage coinsurance.",
              "Check whether a separate drug deductible applies before normal cost sharing begins.",
              "Verify preferred pharmacies, mail-order rules, prior authorization, step therapy, and quantity limits.",
            ],
            "A medication appearing on a formulary does not guarantee a low price or unrestricted access.",
          ),
        ),
        comparisonTable: {
          headers: ["Coverage detail", "Why it matters", "What to record"],
          rows: [
            ["Formulary status and tier", "Determines whether the drug is covered and the usual cost-sharing level", "Exact drug, dose, formulation, tier, and alternatives"],
            ["Drug deductible", "May require full negotiated cost before normal copays or coinsurance begin", "Deductible amount and which tiers it applies to"],
            ["Pharmacy network", "Preferred pharmacies can be materially cheaper than standard or out-of-network pharmacies", "Preferred retail, specialty, and mail-order options"],
            ["Utilization rules", "Prior authorization, step therapy, and quantity limits can delay or restrict access", "Rule, required documentation, and appeal pathway"],
          ],
        },
        numberedSteps: [
          "Create a medication list with exact names, doses, formulations, quantities, and prescribing clinicians.",
          "Search each medication in the exact plan formulary for the upcoming plan year.",
          "Record tier, deductible, copay or coinsurance, preferred pharmacy, and mail-order price.",
          "Identify prior authorization, step therapy, quantity limits, or specialty-pharmacy requirements.",
          "Estimate annual medication cost under each plan, not just the first refill.",
          "Confirm high-cost or essential medications directly with the plan before enrollment closes.",
        ],
        questionsToAsk: [
          "Is this exact medication, dose, and formulation covered?",
          "Which tier applies, and is the cost a copay or coinsurance percentage?",
          "Does a separate prescription deductible apply?",
          "Which pharmacies are preferred, and is mail order required or cheaper?",
          "Does the drug require prior authorization, step therapy, or quantity limits?",
          "What is the exception or appeal process if coverage changes?",
        ],
        relatedCalculator: { label: "Medication Coverage Checklist", href: "/insurance/medication-coverage-checklist" },
      };

    case "prior-authorization-explained":
      return {
        ...article,
        ...reviewMetadata("Prior authorization requests, pending and denied statuses, provider documentation, plan criteria, appeals, and urgent-review pathways."),
        title: "What Is Prior Authorization? Why Insurance Can Delay Doctor-Recommended Care",
        promise: "Understand what prior authorization means, why approval can be delayed or denied, and the next questions to ask the provider and insurer.",
        description: "Learn what prior authorization is, why insurance may delay doctor-recommended care, and what to do when a request is pending or denied.",
        summary: "Prior authorization is a plan requirement to approve certain drugs, tests, procedures, equipment, or post-acute services before coverage is confirmed. A clinician's recommendation does not guarantee plan approval. Delays often involve missing documentation, unmet criteria, coding or site-of-care issues, network rules, or a request that has not been submitted. Ask for the request date, reference number, status, reason, required documentation, and appeal or urgent-review pathway.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Prior authorization is an insurer or benefit-plan review that may be required before the plan agrees to cover a service or medication.",
            [
              "The ordering clinician usually supplies clinical documentation, diagnosis codes, prior treatments, and the requested service details.",
              "The plan compares the request with its coverage criteria and may approve, request more information, redirect care, or deny coverage.",
              "A pending request is different from a denied request, and an unsubmitted request is different from both.",
              "Urgent-review and appeal options may exist when delay could jeopardize health or recovery.",
            ],
            "Do not assume the insurer is reviewing the request until the provider confirms submission and provides a reference number or other evidence.",
          ),
        ),
        numberedSteps: [
          "Confirm whether prior authorization is required for the exact service, medication, equipment, facility, and provider.",
          "Ask the ordering office when the request was submitted and obtain the reference number.",
          "Ask the plan whether the request is pending, approved, denied, cancelled, or waiting for information.",
          "Identify the specific missing document or coverage criterion when action is required.",
          "Coordinate the provider response, peer-to-peer review, corrected coding, or alternative site of care when appropriate.",
          "Use the appeal, expedited review, or external-review pathway when the plan's decision warrants challenge.",
        ],
        questionsToAsk: [
          "Was the request submitted, and what is the reference number?",
          "What is the exact status and expected decision date?",
          "Is any clinical note, test result, code, or treatment history missing?",
          "Which coverage criterion or policy is being applied?",
          "Can the ordering clinician request a peer-to-peer review?",
          "Does the situation qualify for expedited review or appeal?",
        ],
        relatedCalculator: { label: "Prior Authorization Next-Step Guide", href: "/tools/prior-authorization-next-step-guide" },
      };

    case "spouse-family-health-insurance-open-enrollment":
      return {
        ...article,
        ...reviewMetadata("Spouse enrollment, qualifying life events, employer eligibility, spousal surcharges, dual coverage, coordination of benefits, family deductibles, and annual plan cost."),
        title: "Can You Add a Spouse to Your Health Insurance? Rules, Costs, and Dual Coverage",
        promise: "Learn when a spouse can join an employer health plan, what surcharges and deadlines may apply, and whether one plan or separate plans costs less.",
        description: "Learn when you can add a spouse to health insurance, how qualifying life events work, and how to compare surcharges, dual coverage, and family costs.",
        summary: "You can usually add an eligible spouse during annual open enrollment or after a qualifying life event such as marriage or loss of other coverage, subject to the employer plan's deadline and documentation rules. The best arrangement may be one employer plan, separate employer plans, or—in limited cases—dual coverage. Compare payroll premiums, spousal surcharges, employer contributions, deductibles, out-of-pocket maximums, provider networks, prescriptions, and coordination-of-benefits rules.",
        sections: prependSection(
          article,
          directAnswerSection(
            "An eligible spouse can usually be added during open enrollment or within the plan's deadline after a qualifying life event.",
            [
              "Marriage and loss of other coverage commonly create special-enrollment opportunities, but deadlines are plan-specific.",
              "Some employers charge a spousal surcharge when the spouse has access to other employer coverage.",
              "Separate plans may preserve lower employee-only premiums, while one family plan may simplify deductibles and billing.",
              "Dual coverage can create two premiums and coordination-of-benefits complexity without guaranteeing lower total cost.",
            ],
            "Missing the employer's special-enrollment deadline can force the household to wait until the next open-enrollment period unless another qualifying event occurs.",
          ),
        ),
        comparisonTable: {
          headers: ["Coverage arrangement", "Potential advantage", "Main risk to check"],
          rows: [
            ["Both spouses on one employer plan", "One network, one payroll deduction, and potentially one family deductible structure", "Higher family premium, spouse surcharge, or weaker network for one spouse"],
            ["Each spouse uses their own employer plan", "May preserve employer subsidies and employee-only pricing", "Two deductibles, two out-of-pocket limits, and more complex family coverage"],
            ["One spouse has dual coverage", "Secondary coverage may pay some remaining eligible costs", "Two premiums, coordination rules, claim delays, and limited incremental value"],
            ["Children split or placed on one plan", "Can optimize pediatric network and family pricing", "Different deductibles, provider access, and administrative complexity"],
          ],
        },
        numberedSteps: [
          "Confirm spouse and dependent eligibility under both employer plans.",
          "Write down the enrollment deadline and documentation required for marriage or loss of coverage.",
          "Compare payroll premiums and any spousal surcharge or working-spouse exclusion.",
          "Compare deductibles, out-of-pocket maximums, employer HSA or HRA funding, networks, and prescriptions.",
          "Model one-plan, separate-plan, and any realistic dual-coverage scenario using annual cost rather than premium alone.",
          "Save the enrollment confirmation and verify the first payroll deduction and coverage effective date.",
        ],
        questionsToAsk: [
          "When can I add my spouse, and what is the exact enrollment deadline?",
          "Does the plan impose a spousal surcharge or exclude spouses with access to other employer coverage?",
          "How do individual and family deductibles and out-of-pocket maximums work?",
          "Can either spouse contribute to an HSA if the household uses this coverage arrangement?",
          "How will coordination of benefits work if a spouse keeps two plans?",
          "Which plan covers the household's doctors, hospitals, medications, and expected services?",
        ],
        relatedCalculator: { label: "Open Enrollment True Cost Calculator", href: "/tools/open-enrollment-true-cost-calculator" },
      };

    case "accident-critical-illness-hospital-indemnity-open-enrollment":
      return {
        ...article,
        ...reviewMetadata("Accident insurance, critical illness insurance, hospital indemnity benefits, covered events, benefit triggers, exclusions, premiums, and major-medical coordination."),
        title: "Accident vs. Critical Illness vs. Hospital Indemnity Insurance",
        promise: "Compare what each supplemental policy pays, what triggers a benefit, and when the payroll deduction may or may not be worthwhile.",
        description: "Compare accident, critical illness, and hospital indemnity insurance by benefit trigger, payout, exclusions, and fit with your health plan.",
        summary: "Accident insurance usually pays fixed benefits for covered injuries and related treatment. Critical illness insurance usually pays a lump sum after a covered diagnosis such as cancer, heart attack, or stroke, subject to the policy definition. Hospital indemnity insurance usually pays fixed amounts for covered admission or hospital days. These policies do not replace major medical insurance and do not usually reduce the health-plan deductible directly; they pay cash under their own contract when a covered event occurs.",
        sections: prependSection(
          article,
          directAnswerSection(
            "The three policies pay for different triggers: covered injuries, covered serious diagnoses, or covered hospital events.",
            [
              "Accident insurance is event-based and commonly schedules benefits for emergency treatment, fractures, imaging, therapy, or follow-up care.",
              "Critical illness insurance is diagnosis-based and often pays a lump sum when the diagnosis meets the contract definition.",
              "Hospital indemnity insurance is admission- or day-based and pays fixed cash benefits for covered hospital events.",
              "Payouts are separate from the health plan and may be used for medical or household expenses, subject to policy terms.",
            ],
            "A policy can sound broad in enrollment materials while using narrow definitions, exclusions, waiting periods, or evidence requirements in the certificate of coverage.",
          ),
        ),
        comparisonTable: {
          headers: ["Policy", "Typical benefit trigger", "Best verification question"],
          rows: [
            ["Accident insurance", "A covered accidental injury and listed treatment", "Which injuries, services, follow-up visits, and activity exclusions are covered?"],
            ["Critical illness insurance", "A covered diagnosis meeting the policy definition", "Which diagnoses, severity thresholds, recurrence rules, and pre-existing-condition limits apply?"],
            ["Hospital indemnity insurance", "A covered admission, ICU stay, or hospital day", "What counts as an admission, and are observation, maternity, mental health, or rehabilitation stays covered?"],
          ],
        },
        numberedSteps: [
          "Start with the risk your major medical plan leaves behind: deductible, coinsurance, lost income, travel, childcare, or household bills.",
          "Read the certificate of coverage, not only the enrollment summary.",
          "List the exact covered events, benefit amounts, exclusions, waiting periods, and claim documentation.",
          "Compare the annual payroll premium with the probability and usefulness of the benefit.",
          "Check emergency savings, disability coverage, HSA funds, and employer-paid benefits before buying overlapping protection.",
          "Reassess the policy when health coverage, savings, family needs, or employment changes.",
        ],
        questionsToAsk: [
          "What exact event triggers payment?",
          "Is the benefit a lump sum, a scheduled amount, or a per-day payment?",
          "Which exclusions, waiting periods, recurrence rules, or pre-existing-condition provisions apply?",
          "Does observation status count as hospital admission under the hospital indemnity policy?",
          "How is a claim filed, and what documentation is required?",
          "Would emergency savings, HSA funds, or stronger disability insurance solve the risk more directly?",
        ],
        relatedCalculator: { label: "Supplemental Benefits Decision Helper", href: "/tools/supplemental-benefits-decision-helper" },
      };

    case "deductible-copay-coinsurance-out-of-pocket-max":
      return {
        ...article,
        ...reviewMetadata("Health-plan deductible, copay, coinsurance, allowed amount, out-of-pocket maximum, in-network coverage, and claim-order examples."),
        title: "Deductible vs. Copay vs. Coinsurance vs. Out-of-Pocket Maximum",
        promise: "See how the four major health-insurance cost-sharing terms work together and estimate what a covered in-network service may cost.",
        description: "Learn the difference between a deductible, copay, coinsurance, and out-of-pocket maximum with a simple medical-bill example.",
        summary: "The deductible is the amount you may pay for covered services before the plan begins its normal cost sharing. A copay is a fixed amount for a service or prescription. Coinsurance is a percentage of the plan's allowed amount. The out-of-pocket maximum is the yearly cap on eligible in-network deductibles, copays, and coinsurance—not premiums, non-covered care, or most out-of-network charges. The order depends on the service and plan rules.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Deductibles, copays, coinsurance, and out-of-pocket maximums are separate parts of the same health-plan cost-sharing system.",
            [
              "The deductible is an amount you may pay before the plan shares eligible costs under its normal rules.",
              "A copay is a fixed dollar amount for a covered visit, service, or prescription.",
              "Coinsurance is a percentage of the insurer's allowed amount, often after the deductible.",
              "The out-of-pocket maximum caps eligible in-network cost sharing for the plan year, but it does not include premiums or every possible charge.",
            ],
            "Always calculate from the allowed amount and the exact benefit category; the provider's billed charge alone does not determine patient responsibility.",
          ),
        ),
        comparisonTable: {
          headers: ["Term", "How it is calculated", "Common misunderstanding"],
          rows: [
            ["Deductible", "Dollar amount accumulated across eligible services", "Meeting it does not usually make all later care free"],
            ["Copay", "Fixed amount for a covered service or prescription", "Some copays apply before the deductible; others do not"],
            ["Coinsurance", "Percentage of the plan's allowed amount", "It is not usually a percentage of the provider's full billed charge"],
            ["Out-of-pocket maximum", "Yearly total of eligible in-network cost sharing", "Premiums, non-covered services, and many out-of-network charges do not count"],
          ],
        },
        numberedSteps: [
          "Confirm the service is covered and the provider is in-network.",
          "Find the plan's allowed amount for the service.",
          "Check whether a copay applies or whether the service is subject to the deductible.",
          "Apply any remaining deductible, then the plan's coinsurance rule when required.",
          "Confirm how much eligible cost sharing has already accumulated toward the out-of-pocket maximum.",
          "Match the final provider bill to the EOB before paying.",
        ],
        questionsToAsk: [
          "Is this service subject to a copay, deductible, coinsurance, or more than one?",
          "What is the allowed amount?",
          "How much deductible remains?",
          "Does this patient responsibility count toward the in-network out-of-pocket maximum?",
          "Are there separate individual and family deductibles or limits?",
          "Does the EOB match the provider bill?",
        ],
        relatedCalculator: { label: "Out-of-Pocket Maximum Estimator", href: "/tools/out-of-pocket-max-estimator" },
      };

    case "how-to-read-an-eob":
      return {
        ...article,
        ...reviewMetadata("Explanation of Benefits fields, billed amount, allowed amount, adjustments, plan payment, patient responsibility, denial reasons, and provider-bill matching."),
        title: "How to Read an Explanation of Benefits (EOB) Before Paying a Medical Bill",
        promise: "Match the EOB to the provider bill and verify the allowed amount, plan payment, adjustments, and patient responsibility before paying.",
        description: "Learn how to read an Explanation of Benefits, match it to a medical bill, and verify allowed amount, insurance payment, and patient responsibility.",
        summary: "An EOB is the insurer's explanation of how it processed a claim; it is not usually a bill. Start with the patient, provider, date of service, and claim number. Then compare the billed amount, allowed amount, network adjustment, plan payment, deductible, copay, coinsurance, denial reason, and patient responsibility. Pay the provider only after the provider bill matches the final processed EOB.",
        sections: prependSection(
          article,
          directAnswerSection(
            "Use the EOB to understand how the insurer processed the claim, then compare its patient-responsibility amount with the provider's bill.",
            [
              "The billed amount is what the provider submitted, not necessarily the amount used to calculate your share.",
              "The allowed amount is the plan-recognized amount for the covered service under the claim's network and benefit rules.",
              "Adjustments show amounts removed through network contracts or claim processing.",
              "Patient responsibility may include deductible, copay, coinsurance, non-covered amounts, or other plan-specific responsibility.",
            ],
            "An EOB marked pending, denied, corrected, or reprocessed may not represent the final amount owed.",
          ),
        ),
        comparisonTable: {
          headers: ["EOB field", "What it means", "What to do"],
          rows: [
            ["Billed amount", "The provider's submitted charge", "Do not use this number alone to calculate what you owe"],
            ["Allowed amount", "The amount recognized by the plan for claim processing", "Use this with the benefit rule to understand cost sharing"],
            ["Plan paid", "The insurer's payment after processing", "Confirm the provider credited the same amount"],
            ["Patient responsibility", "The amount the plan says may be your responsibility", "Pay only after the provider bill matches and the claim is final"],
          ],
        },
        numberedSteps: [
          "Confirm the patient, provider, date of service, and claim number.",
          "Match each service line to the provider bill or itemized statement.",
          "Compare billed amount, allowed amount, adjustments, and plan payment.",
          "Identify deductible, copay, coinsurance, denial, or non-covered amounts.",
          "Read every remark code and confirm whether the claim is final, pending, denied, corrected, or reprocessed.",
          "Contact the insurer or provider before paying when the bill exceeds the final EOB patient responsibility.",
        ],
        questionsToAsk: [
          "Is this the final processed EOB or will the claim be reprocessed?",
          "Why is this amount assigned to deductible, copay, coinsurance, or non-covered responsibility?",
          "Was the provider processed in-network?",
          "What does the denial or remark code mean?",
          "Did the provider credit the insurer payment and contractual adjustment?",
          "Why does the provider bill differ from the EOB patient responsibility?",
        ],
        relatedCalculator: { label: "EOB to Medical Bill Match Checker", href: "/tools/eob-to-bill-match-checker" },
      };

    default:
      return article;
  }
};

export const applySearchConsoleArticleEnhancements = (articles: Article[]) => articles.map(enhanceArticle);
