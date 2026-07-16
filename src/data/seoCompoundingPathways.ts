import type { NextStepCard } from "@/components/shared/NextStepCards";

export type CompoundingDestinationType = "article" | "tool" | "hub" | "guide";

export type CompoundingPathwayCard = NextStepCard & {
  destinationId: string;
  destinationType: CompoundingDestinationType;
};

export type SeoCompoundingPathway = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cards: CompoundingPathwayCard[];
};

const card = (
  destinationId: string,
  destinationType: CompoundingDestinationType,
  eyebrow: string,
  title: string,
  description: string,
  href: string,
  cta: string,
): CompoundingPathwayCard => ({ destinationId, destinationType, eyebrow, title, description, href, cta });

const COST_SHARING_PATHWAY: SeoCompoundingPathway = {
  id: "cost_sharing_to_bill_review",
  eyebrow: "Connected decision path",
  title: "From insurance terms to the final bill",
  description: "Understand the cost-sharing rule, estimate the exposure, compare the EOB, and verify the provider bill before paying.",
  cards: [
    card("cost_sharing_terms", "article", "Understand the terms", "Deductible, copay, coinsurance, and out-of-pocket maximum", "See how the four cost-sharing terms work together using the plan's allowed amount.", "/articles/deductible-copay-coinsurance-out-of-pocket-max", "Learn the terms"),
    card("out_of_pocket_estimator", "tool", "Estimate exposure", "Out-of-Pocket Maximum Estimator", "Estimate how much eligible in-network cost sharing may remain during the plan year.", "/tools/out-of-pocket-max-estimator", "Estimate exposure"),
    card("read_an_eob", "article", "Read the claim", "How to read an Explanation of Benefits", "Identify the allowed amount, insurer payment, adjustments, and patient responsibility.", "/articles/how-to-read-an-eob", "Read the EOB guide"),
    card("eob_bill_match", "tool", "Check the bill", "EOB-to-Bill Match Checker", "Compare the provider balance with the final processed EOB before paying.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
    card("true_cost_calculator", "tool", "Plan ahead", "Open Enrollment True Cost Calculator", "Use premiums, expected care, employer funding, and bad-year exposure to compare future plans.", "/tools/open-enrollment-true-cost-calculator", "Compare future plans"),
    card("plan_comparison", "guide", "Compare structures", "Health Insurance Comparison Framework", "Compare networks, prescriptions, authorization rules, and total annual cost without insurer rankings.", "/insurance/commercial-insurance-comparison", "Compare plan structures"),
  ],
};

const HOSPITAL_BILLING_PATHWAY: SeoCompoundingPathway = {
  id: "hospital_bill_review",
  eyebrow: "Connected bill-review path",
  title: "Understand every bill before deciding what to pay",
  description: "Separate billing entities, find the allowed amount, confirm network processing, match the EOB, and check financial assistance.",
  cards: [
    card("medical_cost_preparation", "tool", "Before planned care", "Medical Appointment Cost Preparation", "Prepare network, authorization, estimate, facility-fee, separate-bill, and assistance questions before the service.", "/tools/medical-appointment-cost-preparation", "Prepare before care"),
    card("multiple_hospital_bills", "article", "Start with the structure", "Why one hospital visit can create multiple bills", "Understand why the facility, clinician, laboratory, radiology, and anesthesia groups may bill separately.", "/articles/why-one-hospital-visit-can-create-multiple-bills", "Understand separate bills"),
    card("facility_professional_fee", "article", "Separate the charges", "Facility fee vs. professional fee", "Distinguish the hospital-owned site charge from the clinician's professional charge.", "/articles/facility-fee-vs-professional-fee", "Compare the fees"),
    card("allowed_amount", "article", "Find the working number", "Allowed amount on a medical bill", "Use the insurer's recognized amount rather than the provider's billed charge to understand cost sharing.", "/articles/allowed-amount-medical-bills", "Understand allowed amount"),
    card("network_surprise", "article", "Verify network processing", "In-network hospital and out-of-network bills", "Check whether separately billing clinicians and services were processed at the expected network level.", "/articles/in-network-hospital-out-of-network-bills", "Check network risk"),
    card("eob_bill_match", "tool", "Match the claim", "EOB-to-Bill Match Checker", "Compare the provider bill with the final EOB, insurer payment, adjustment, and patient responsibility.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
    card("medical_bill_toolkit", "tool", "Review the full balance", "Medical Bill Review Toolkit", "Work through itemization, coding, network status, insurer processing, and payment options.", "/insurance/medical-bill-review-toolkit", "Review the bill"),
    card("financial_assistance", "article", "Before paying", "Check hospital financial assistance", "Review charity-care and payment-assistance options before draining savings or using a credit card.", "/articles/check-hospital-financial-assistance-before-paying", "Check assistance"),
  ],
};

const PLANNED_CARE_COST_PATHWAY: SeoCompoundingPathway = {
  id: "planned_care_cost_preparation",
  eyebrow: "Before and after planned care",
  title: "Connect preparation, authorization, and final bill review",
  description: "Prepare before the appointment, resolve authorization questions, then compare the insurer explanation and every provider bill.",
  cards: [
    card("medical_cost_preparation", "tool", "Before the service", "Medical Appointment Cost Preparation", "Prepare provider, health-plan, estimate, facility-fee, and separate-bill questions without entering personal information.", "/tools/medical-appointment-cost-preparation", "Build the plan"),
    card("prior_authorization_guide", "tool", "Coverage process", "Prior Authorization Next-Step Guide", "Organize the next step for a pending, delayed, denied, expired, or unclear authorization.", "/tools/prior-authorization-next-step-guide", "Review authorization"),
    card("medical_bill_toolkit", "tool", "After care", "Medical Bill Review Toolkit", "Review the insurer explanation, itemization, separate bills, network processing, financial assistance, and follow-up record.", "/insurance/medical-bill-review-toolkit", "Review a bill"),
    card("eob_bill_match", "tool", "Compare documents", "EOB-to-Bill Match Checker", "Check whether the provider balance matches the final processed insurer explanation.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
    card("facility_professional_fee", "article", "Understand the setting", "Facility fee vs. professional fee", "Learn why a hospital-owned location and the clinician may create different charges.", "/articles/facility-fee-vs-professional-fee", "Compare the fees"),
  ],
};

const HEALTHCARE_RETIREMENT_PATHWAY: SeoCompoundingPathway = {
  id: "healthcare_retirement_sequence",
  eyebrow: "Healthcare-worker retirement path",
  title: "Turn the hospital retirement plan into a repeatable paycheck system",
  description: "Understand the match, choose a sustainable contribution, select the tax treatment and investments, then fit the decision into the broader money plan.",
  cards: [
    card("hospital_403b_match", "article", "Start with employer value", "How a hospital 403(b) match works", "Decode the match formula, eligible pay, payroll timing, true-up rules, 401(a) deposits, and vesting.", "/articles/how-hospital-403b-matching-works", "Understand the match"),
    card("nurse_403b_contribution", "article", "Choose a contribution", "How much should a nurse put in a 403(b)?", "Choose a contribution that captures the match without creating cash-flow stress or new debt.", "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck", "Choose a starting rate"),
    card("roth_traditional_403b", "article", "Choose tax treatment", "Roth vs. traditional 403(b) for healthcare workers", "Compare current tax savings, take-home pay, and future tax flexibility.", "/articles/roth-vs-traditional-403b-healthcare-workers", "Compare tax treatment"),
    card("retirement_investments", "article", "Choose investments", "How to pick retirement investments at work", "Review target-date funds, broad index funds, expense ratios, risk, and diversification.", "/articles/how-to-pick-retirement-investments-at-work", "Choose investments"),
    card("403b_paycheck_calculator", "tool", "Run the paycheck math", "403(b) Paycheck Contribution Calculator", "Estimate employee contributions, employer match, annual totals, and the effect of each payroll percentage.", "/tools/403b-paycheck-calculator", "Calculate each paycheck"),
    card("benefits_blueprint", "tool", "Fit the full package", "Healthcare Worker Benefits Blueprint", "Connect retirement, health coverage, HSA questions, and coverage choices to the worker's goals.", "/tools/healthcare-worker-benefits-blueprint", "Build a benefits blueprint"),
    card("healthcare_money_map", "article", "Use the broader system", "The Healthcare Worker Money Map", "Place emergency cash, debt, retirement, and investing into one durable order of operations.", "/articles/healthcare-worker-money-map", "Open the money map"),
  ],
};

const OPEN_ENROLLMENT_PATHWAY: SeoCompoundingPathway = {
  id: "household_open_enrollment",
  eyebrow: "Household open-enrollment path",
  title: "Move from benefit changes to a saved household decision",
  description: "Identify what changed, compare household coverage, verify medications, evaluate add-ons, calculate annual cost, and save the final choice.",
  cards: [
    card("benefit_changes", "article", "Identify changes", "What employer-benefit changes should you compare?", "Compare cost, access, employer value, protection, and family benefits before repeating last year's elections.", "/articles/what-employer-benefit-changes-should-i-compare", "Review benefit changes"),
    card("spouse_family_coverage", "article", "Compare household coverage", "Can you add a spouse to your health insurance?", "Compare one-plan, separate-plan, surcharge, network, and family-deductible scenarios.", "/articles/spouse-family-health-insurance-open-enrollment", "Compare spouse coverage"),
    card("prescription_coverage", "article", "Verify medications", "Check prescription coverage before choosing a plan", "Confirm formulary status, tier, deductible, pharmacy, and utilization rules for every regular medication.", "/articles/prescription-coverage-open-enrollment-checklist", "Check medications"),
    card("supplemental_insurance", "article", "Evaluate add-ons", "Accident vs. critical illness vs. hospital indemnity", "Compare benefit triggers, payout structures, exclusions, and overlap with existing protection.", "/articles/accident-critical-illness-hospital-indemnity-open-enrollment", "Compare supplemental coverage"),
    card("true_cost_calculator", "tool", "Calculate annual cost", "Open Enrollment True Cost Calculator", "Compare premiums, expected care, employer contributions, deductible exposure, and worst-case cost.", "/tools/open-enrollment-true-cost-calculator", "Calculate true cost"),
    card("benefits_change_detector", "tool", "Create a review receipt", "Benefits Change Detector", "Record meaningful changes and turn unclear details into verification questions for HR or the plan administrator.", "/tools/benefits-change-detector", "Detect benefit changes"),
    card("benefits_command_center", "tool", "Save the final decision", "Benefits Command Center", "Review pay, health coverage, retirement, protection, time off, and employer value as one compensation system.", "/tools/benefits-command-center", "Open Command Center"),
  ],
};

const ARTICLE_PATHWAY_BY_SLUG = new Map<string, SeoCompoundingPathway>();

[
  "deductible-copay-coinsurance-out-of-pocket-max",
  "how-to-read-an-eob",
].forEach((slug) => ARTICLE_PATHWAY_BY_SLUG.set(slug, COST_SHARING_PATHWAY));

[
  "why-one-hospital-visit-can-create-multiple-bills",
  "facility-fee-vs-professional-fee",
  "allowed-amount-medical-bills",
  "in-network-hospital-out-of-network-bills",
  "check-hospital-financial-assistance-before-paying",
].forEach((slug) => ARTICLE_PATHWAY_BY_SLUG.set(slug, HOSPITAL_BILLING_PATHWAY));

[
  "how-hospital-403b-matching-works",
  "how-much-should-a-nurse-put-in-403b-per-paycheck",
  "roth-vs-traditional-403b-healthcare-workers",
  "how-to-pick-retirement-investments-at-work",
  "healthcare-worker-money-map",
].forEach((slug) => ARTICLE_PATHWAY_BY_SLUG.set(slug, HEALTHCARE_RETIREMENT_PATHWAY));

[
  "what-employer-benefit-changes-should-i-compare",
  "spouse-family-health-insurance-open-enrollment",
  "prescription-coverage-open-enrollment-checklist",
  "accident-critical-illness-hospital-indemnity-open-enrollment",
  "premium-deductible-out-of-pocket-open-enrollment",
  "health-fsa-vs-dependent-care-fsa",
].forEach((slug) => ARTICLE_PATHWAY_BY_SLUG.set(slug, OPEN_ENROLLMENT_PATHWAY));

const HUB_PATHWAYS: Record<string, SeoCompoundingPathway> = {
  "/healthcare-workers": {
    id: "healthcare_worker_start",
    eyebrow: "Best starting sequence",
    title: "What should a healthcare worker do first with each paycheck and benefit package?",
    description: "Start with the money map, understand employer retirement value, run the paycheck math, and organize the full benefits package.",
    cards: [
      card("healthcare_money_map", "article", "Start here", "The Healthcare Worker Money Map", "Use one order of operations for cash, debt, retirement, investing, and financial flexibility.", "/articles/healthcare-worker-money-map", "Open the money map"),
      card("hospital_403b_match", "article", "Employer value", "Understand the hospital 403(b) match", "Decode matching, vesting, eligible pay, payroll timing, and 401(a) deposits.", "/articles/how-hospital-403b-matching-works", "Understand the match"),
      card("403b_paycheck_calculator", "tool", "Run the numbers", "403(b) Paycheck Contribution Calculator", "Estimate contributions and employer match before changing payroll elections.", "/tools/403b-paycheck-calculator", "Calculate contributions"),
      card("benefits_blueprint", "tool", "Organize the package", "Healthcare Worker Benefits Blueprint", "Turn retirement, health coverage, HSA, and coverage-tier choices into a goal-first plan.", "/tools/healthcare-worker-benefits-blueprint", "Build the blueprint"),
    ],
  },
  "/build-wealth": {
    id: "build_wealth_start",
    eyebrow: "Practical wealth sequence",
    title: "How can a healthcare worker build wealth without making money a second job?",
    description: "Use a simple order of operations, capture employer value, automate diversified investing, and protect enough liquidity to stay consistent.",
    cards: [
      card("healthcare_money_map", "article", "Start here", "The Healthcare Worker Money Map", "Organize emergency cash, debt, retirement contributions, and long-term investing.", "/articles/healthcare-worker-money-map", "Open the money map"),
      card("nurse_403b_contribution", "article", "Retirement rate", "Choose a sustainable 403(b) contribution", "Capture the match and increase gradually without creating paycheck stress.", "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck", "Choose a contribution"),
      card("retirement_investments", "article", "Investment choice", "Pick retirement investments at work", "Compare target-date funds, broad index funds, fees, and risk.", "/articles/how-to-pick-retirement-investments-at-work", "Choose investments"),
      card("403b_paycheck_calculator", "tool", "Run the math", "403(b) Paycheck Contribution Calculator", "Estimate annual contributions and employer match from each paycheck.", "/tools/403b-paycheck-calculator", "Calculate contributions"),
    ],
  },
  "/insurance": {
    id: "insurance_decision_start",
    eyebrow: "Insurance decision sequence",
    title: "What should you check before choosing a plan or paying a claim?",
    description: "Understand cost sharing, compare annual plan cost, verify claim processing, and resolve authorization barriers using the right tool.",
    cards: [
      card("cost_sharing_terms", "article", "Start with the terms", "Deductible, copay, coinsurance, and out-of-pocket maximum", "Understand how the major cost-sharing rules work together.", "/articles/deductible-copay-coinsurance-out-of-pocket-max", "Learn the terms"),
      card("true_cost_calculator", "tool", "Compare plans", "Open Enrollment True Cost Calculator", "Compare premiums, expected care, employer funding, and bad-year exposure.", "/tools/open-enrollment-true-cost-calculator", "Compare annual cost"),
      card("eob_bill_match", "tool", "Review a claim", "EOB-to-Bill Match Checker", "Confirm the provider bill matches the final insurer explanation.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
      card("prior_authorization_guide", "tool", "Resolve a delay", "Prior Authorization Next-Step Guide", "Get a qualified action plan for pending, delayed, or denied requests.", "/tools/prior-authorization-next-step-guide", "Review authorization"),
    ],
  },
  "/open-enrollment": {
    id: "open_enrollment_start",
    eyebrow: "Enrollment decision sequence",
    title: "How do you turn dozens of benefit choices into one defensible decision?",
    description: "Identify changes first, compare annual cost, verify household-specific risks, and save the final benefit decision.",
    cards: [
      card("benefit_changes", "article", "Start here", "Compare what changed this year", "Find changes in cost, access, employer value, protection, and family benefits.", "/articles/what-employer-benefit-changes-should-i-compare", "Review changes"),
      card("true_cost_calculator", "tool", "Run the cost", "Open Enrollment True Cost Calculator", "Compare premiums, expected care, employer contributions, and worst-case exposure.", "/tools/open-enrollment-true-cost-calculator", "Calculate annual cost"),
      card("spouse_family_coverage", "article", "Household decision", "Compare spouse and family coverage", "Evaluate one-plan, separate-plan, surcharge, network, and deductible scenarios.", "/articles/spouse-family-health-insurance-open-enrollment", "Compare household coverage"),
      card("benefits_command_center", "tool", "Save the decision", "Benefits Command Center", "Review the complete package and preserve a clear action plan.", "/tools/benefits-command-center", "Open Command Center"),
    ],
  },
  "/patients-families": {
    id: "patient_family_start",
    eyebrow: "Patient and family sequence",
    title: "What should a family do before paying a confusing medical bill?",
    description: "Read the insurer explanation, match the provider bill, review every charge, and check assistance before using savings or debt.",
    cards: [
      card("medical_cost_preparation", "tool", "Before planned care", "Medical Appointment Cost Preparation", "Prepare network, authorization, estimate, facility-fee, separate-bill, and assistance questions before care.", "/tools/medical-appointment-cost-preparation", "Prepare before care"),
      card("read_an_eob", "article", "Start here", "How to read an Explanation of Benefits", "Understand the allowed amount, adjustments, plan payment, and patient responsibility.", "/articles/how-to-read-an-eob", "Read the EOB guide"),
      card("eob_bill_match", "tool", "Compare documents", "EOB-to-Bill Match Checker", "Confirm the provider balance matches the final processed claim.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
      card("medical_bill_toolkit", "tool", "Review the balance", "Medical Bill Review Toolkit", "Check itemization, coding, network processing, and payment options.", "/insurance/medical-bill-review-toolkit", "Review the bill"),
      card("financial_assistance", "article", "Before paying", "Check hospital financial assistance", "Review charity-care and payment-assistance options before draining savings.", "/articles/check-hospital-financial-assistance-before-paying", "Check assistance"),
    ],
  },
  "/insurance/medical-bill-review-toolkit": PLANNED_CARE_COST_PATHWAY,
  "/tools/prior-authorization-next-step-guide": PLANNED_CARE_COST_PATHWAY,
  "/medicare-care-costs": {
    id: "medicare_cost_start",
    eyebrow: "Medicare decision sequence",
    title: "Which Medicare or Medicaid question should you answer first?",
    description: "Start with enrollment or eligibility, then compare coverage structure and prepare for hospital-discharge costs and rules.",
    cards: [
      card("turning_65", "guide", "Enrollment timing", "Turning 65 Medicare Enrollment Pathway", "Build an enrollment timeline using current coverage, employer size, HSA status, and prescription coverage.", "/medicare-care-costs/turning-65", "Build the timeline"),
      card("medicare_medicaid_eligibility", "tool", "Eligibility pathways", "Medicare and Medicaid Eligibility Check", "Identify possible Medicare, Medicaid, savings-program, disability, and long-term-care pathways.", "/tools/medicare-medicaid-eligibility-check", "Check pathways"),
      card("advantage_medigap", "guide", "Coverage structure", "Medicare Advantage vs. Medigap", "Compare provider access, premiums, cost sharing, travel, networks, and underwriting considerations.", "/insurance/medicare-advantage-vs-medigap", "Compare structures"),
      card("discharge_checklist", "tool", "After a hospital stay", "Hospital Discharge Medicare Checklist", "Verify status, rehab rules, authorization, networks, costs, and post-discharge coverage.", "/tools/hospital-discharge-medicare-checklist", "Review discharge coverage"),
    ],
  },
  "/articles": {
    id: "article_library_start",
    eyebrow: "Evidence-led starting points",
    title: "Start with the questions Google users are already asking",
    description: "These guides represent the strongest early search signals and the clearest healthcare-finance decisions on the site.",
    cards: [
      card("nurse_403b_contribution", "article", "Healthcare-worker retirement", "How much should a nurse put in a 403(b)?", "Choose a sustainable contribution and understand the employer match.", "/articles/how-much-should-a-nurse-put-in-403b-per-paycheck", "Read the 403(b) guide"),
      card("cost_sharing_terms", "article", "Insurance basics", "Deductible, copay, coinsurance, and out-of-pocket maximum", "Understand the terms that determine patient responsibility.", "/articles/deductible-copay-coinsurance-out-of-pocket-max", "Learn the terms"),
      card("read_an_eob", "article", "Claim review", "How to read an Explanation of Benefits", "Compare the allowed amount, plan payment, and final patient responsibility.", "/articles/how-to-read-an-eob", "Read an EOB"),
      card("facility_professional_fee", "article", "Hospital bills", "Facility fee vs. professional fee", "Understand why one visit can produce separate hospital and clinician charges.", "/articles/facility-fee-vs-professional-fee", "Compare the fees"),
    ],
  },
  "/tools": {
    id: "tool_library_start",
    eyebrow: "Four high-value starting tools",
    title: "Choose the tool that completes the decision in front of you",
    description: "Start with benefits, medical bills, retirement contributions, or Medicare and Medicaid eligibility instead of browsing every calculator.",
    cards: [
      card("benefits_command_center", "tool", "Workplace benefits", "Benefits Command Center", "Review pay, health coverage, retirement, protection, time off, and employer value together.", "/tools/benefits-command-center", "Review benefits"),
      card("eob_bill_match", "tool", "Medical bill", "EOB-to-Bill Match Checker", "Compare insurer processing with the provider's requested balance.", "/tools/eob-to-bill-match-checker", "Match EOB and bill"),
      card("403b_paycheck_calculator", "tool", "Retirement paycheck", "403(b) Paycheck Contribution Calculator", "Estimate employee contributions, employer match, and annual totals.", "/tools/403b-paycheck-calculator", "Calculate contributions"),
      card("medicare_medicaid_eligibility", "tool", "Coverage pathway", "Medicare and Medicaid Eligibility Check", "Identify possible enrollment, savings-program, disability, and long-term-care pathways.", "/tools/medicare-medicaid-eligibility-check", "Check pathways"),
    ],
  },
};

export const getArticleCompoundingPathway = (slug: string) => ARTICLE_PATHWAY_BY_SLUG.get(slug) ?? null;
export const getHubCompoundingPathway = (pathname: string) => HUB_PATHWAYS[pathname] ?? null;
export const getHubCompoundingPaths = () => Object.keys(HUB_PATHWAYS);

export const getVisibleCompoundingCards = (pathway: SeoCompoundingPathway, currentPath: string, limit = 4) => {
  const seen = new Set<string>();
  return pathway.cards.filter((item) => item.href !== currentPath && !seen.has(item.href) && seen.add(item.href)).slice(0, limit);
};
