export type NavigatorPath = "wealth" | "workplace_benefits" | "healthcare_costs" | "healthcare_career";
export type StoredNavigatorPath = NavigatorPath | "mixed";
export type PlanPriority = "do_now" | "do_next" | "learn_later";
export type RecommendationType = "action" | "tool" | "article" | "official_source" | "checklist" | "calculation" | "verification";

export interface NavigatorOption {
  id: string;
  label: string;
  description?: string;
}

export interface NavigatorQuestion {
  id: string;
  prompt: string;
  help?: string;
  options: NavigatorOption[];
}

export interface NavigatorRecommendation {
  id: string;
  pathway: NavigatorPath;
  priority: PlanPriority;
  type: RecommendationType;
  title: string;
  reason: string;
  actionText: string;
  destinationPath: string;
  caution?: string;
  fixedAnalyticsId: string;
}

export interface NavigatorPlan {
  pathway: NavigatorPath;
  pathwayLabel: string;
  objectiveLabel: string;
  generatedAt: string;
  recommendations: NavigatorRecommendation[];
}

export interface StoredNavigatorPlan {
  schemaVersion: 1;
  pathway: StoredNavigatorPath;
  objectiveLabel: string;
  actionIds: string[];
  completedActionIds: string[];
  savedAt: string;
}

export const NAVIGATOR_STORAGE_KEY = "caf-financial-navigator-v1";
export const NAVIGATOR_PLAN_UPDATED_EVENT = "caf-financial-navigator-plan-updated";

export const NAVIGATOR_PATHS: Record<NavigatorPath, { label: string; description: string; examples: string }> = {
  wealth: {
    label: "Build wealth and financial stability",
    description: "Organize emergency savings, debt, retirement contributions, investing, and long-term flexibility.",
    examples: "Emergency fund · employer match · debt · investing · financial independence",
  },
  workplace_benefits: {
    label: "Understand workplace benefits",
    description: "Turn open enrollment, retirement plans, health coverage, and job offers into a practical checklist.",
    examples: "Health plans · 403(b)/401(k) · HSA/FSA · total compensation · childcare benefits",
  },
  healthcare_costs: {
    label: "Handle a healthcare-cost problem",
    description: "Identify the document, deadline, organization to contact, and specialized tool that fits the issue.",
    examples: "Medical bills · EOBs · denials · prior authorization · Medicare · Medicaid",
  },
  healthcare_career: {
    label: "Make a healthcare-career decision",
    description: "Compare compensation, schedule, burnout, benefits, and long-term trajectory before changing roles.",
    examples: "Job offers · bedside exit · overtime · salary · clinical specialist · quality of life",
  },
};

const urgencyOptions: NavigatorOption[] = [
  { id: "today", label: "Today", description: "A deadline, delayed care, enrollment window, or job decision needs attention now." },
  { id: "week", label: "Within a week" },
  { id: "month", label: "Within a month" },
  { id: "planning", label: "Planning ahead" },
  { id: "none", label: "No firm deadline" },
];

export const NAVIGATOR_QUESTIONS: Record<NavigatorPath, NavigatorQuestion[]> = {
  wealth: [
    {
      id: "wealth_goal",
      prompt: "What is the main financial goal in front of you?",
      options: [
        { id: "emergency", label: "Build an emergency fund" },
        { id: "retirement", label: "Increase retirement savings" },
        { id: "investing", label: "Start or improve investing" },
        { id: "debt", label: "Pay down debt" },
        { id: "cash_flow", label: "Improve monthly cash flow" },
        { id: "fi", label: "Work toward financial independence" },
        { id: "extra_income", label: "Decide how to use extra income" },
        { id: "unsure", label: "Understand where to begin" },
      ],
    },
    {
      id: "emergency_position",
      prompt: "How much emergency savings do you currently have?",
      help: "Use a broad range. The Navigator does not need an exact balance.",
      options: [
        { id: "none", label: "None" },
        { id: "under_one", label: "Less than one month of essential expenses" },
        { id: "one_to_three", label: "One to three months" },
        { id: "three_to_six", label: "Three to six months" },
        { id: "over_six", label: "More than six months" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "debt_type",
      prompt: "Which debt category matters most right now?",
      options: [
        { id: "none", label: "No major debt concern" },
        { id: "high_interest", label: "Credit card or similar high-interest debt" },
        { id: "student", label: "Student loans" },
        { id: "auto", label: "Auto loan" },
        { id: "medical", label: "Medical debt" },
        { id: "multiple", label: "Multiple forms of debt" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "retirement_access",
      prompt: "Do you have access to a workplace retirement plan?",
      options: [
        { id: "403b", label: "403(b)" },
        { id: "401k", label: "401(k)" },
        { id: "pension_401a", label: "Pension or 401(a)" },
        { id: "multiple", label: "More than one plan" },
        { id: "none", label: "No workplace plan" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "match_status",
      prompt: "Are you receiving the full employer retirement match?",
      options: [
        { id: "full", label: "Yes, I receive the full match" },
        { id: "below", label: "I contribute, but may be below the full match" },
        { id: "not_contributing", label: "I am not contributing" },
        { id: "no_match", label: "My employer does not offer a match" },
        { id: "unsure", label: "I do not know" },
      ],
    },
    { id: "urgency", prompt: "How soon do you need a workable plan?", options: urgencyOptions },
  ],
  workplace_benefits: [
    {
      id: "benefits_decision",
      prompt: "Which workplace-benefits decision are you making?",
      options: [
        { id: "health_plan", label: "Choose a health plan" },
        { id: "retirement", label: "Choose a retirement contribution" },
        { id: "hsa_fsa", label: "Understand HSA or FSA options" },
        { id: "insurance", label: "Review life or disability coverage" },
        { id: "open_enrollment", label: "Prepare for open enrollment" },
        { id: "job_offers", label: "Compare two job offers" },
        { id: "total_comp", label: "Understand total compensation" },
        { id: "childcare", label: "Review childcare benefits" },
        { id: "unsure", label: "Not sure where to start" },
      ],
    },
    {
      id: "benefits_timing",
      prompt: "What is driving the timing?",
      options: [
        { id: "enrolling", label: "I am currently enrolling" },
        { id: "job_offer", label: "I have a new job offer" },
        { id: "new_role", label: "I am starting a new role" },
        { id: "annual", label: "Annual open enrollment" },
        { id: "review", label: "I am reviewing current benefits" },
        { id: "life_event", label: "I am planning for a life event" },
      ],
    },
    {
      id: "health_usage",
      prompt: "Which broad healthcare-use pattern is closest?",
      help: "Do not enter diagnoses or medical details.",
      options: [
        { id: "low", label: "Usually low healthcare use" },
        { id: "moderate", label: "Moderate, predictable use" },
        { id: "high", label: "High or recurring use" },
        { id: "dependents", label: "Covering dependents is the main concern" },
        { id: "known_expense", label: "A major known expense may occur" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "plan_preference",
      prompt: "What matters most in a health-plan decision?",
      options: [
        { id: "lower_payroll", label: "Lower payroll deductions" },
        { id: "predictable", label: "More predictable out-of-pocket costs" },
        { id: "network", label: "Broader provider network" },
        { id: "hsa", label: "HSA eligibility" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "benefits_retirement_status",
      prompt: "Where are you with workplace retirement contributions?",
      options: [
        { id: "not_contributing", label: "Not contributing" },
        { id: "below_match", label: "Below the full employer match" },
        { id: "at_match", label: "At the full employer match" },
        { id: "above_match", label: "Above the match" },
        { id: "maxing", label: "Maxing the account" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    { id: "urgency", prompt: "How soon must the election or decision be made?", options: urgencyOptions },
  ],
  healthcare_costs: [
    {
      id: "cost_document",
      prompt: "What did you receive?",
      options: [
        { id: "bill", label: "Medical bill" },
        { id: "eob", label: "Explanation of Benefits" },
        { id: "msn", label: "Medicare Summary Notice" },
        { id: "denial", label: "Denial or adverse-benefit notice" },
        { id: "collection", label: "Collection or past-due notice" },
        { id: "estimate", label: "Estimate or good-faith estimate" },
        { id: "prior_auth", label: "Prior-authorization notice" },
        { id: "medicaid", label: "Medicaid notice" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "cost_issue",
      prompt: "What is the main problem?",
      options: [
        { id: "no_processing", label: "Insurance has not processed the claim" },
        { id: "mismatch", label: "Bill does not match the payer explanation" },
        { id: "unaffordable", label: "The amount is unaffordable" },
        { id: "network", label: "Unexpected out-of-network charge" },
        { id: "multiple_bills", label: "Multiple bills arrived from one visit" },
        { id: "denied", label: "Claim or service was denied" },
        { id: "prior_auth", label: "Prior authorization is involved" },
        { id: "medicare", label: "Medicare coverage or cost" },
        { id: "medicaid", label: "Medicaid eligibility or billing" },
        { id: "discharge", label: "Hospital discharge or post-acute cost" },
        { id: "collection", label: "Collection activity" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "cost_payer",
      prompt: "Which payer or coverage category is involved?",
      options: [
        { id: "employer_plan", label: "Employer or commercial health plan" },
        { id: "marketplace", label: "Marketplace plan" },
        { id: "medicare", label: "Medicare" },
        { id: "medicaid", label: "Medicaid" },
        { id: "uninsured", label: "No insurance or self-pay" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "cost_support",
      prompt: "What would be most useful right now?",
      options: [
        { id: "first_call", label: "Know who to contact first" },
        { id: "compare", label: "Compare the bill with the payer document" },
        { id: "checklist", label: "Build a document and call checklist" },
        { id: "assistance", label: "Find affordability or assistance steps" },
        { id: "official", label: "Find official appeal or rights resources" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    { id: "urgency", prompt: "How urgent is the situation?", options: [
      { id: "delayed_care", label: "Care is currently delayed" },
      { id: "today", label: "A deadline is within seven days" },
      { id: "collection", label: "A collection notice is involved" },
      { id: "week", label: "Payment is requested soon" },
      { id: "planning", label: "No immediate deadline" },
      { id: "unsure", label: "Not sure" },
    ] },
  ],
  healthcare_career: [
    {
      id: "career_decision",
      prompt: "Which career decision are you making?",
      options: [
        { id: "compare_offers", label: "Compare two job offers" },
        { id: "leave_bedside", label: "Evaluate leaving bedside care" },
        { id: "hourly_salary", label: "Compare hourly and salaried work" },
        { id: "overtime", label: "Decide whether overtime is worth it" },
        { id: "non_bedside", label: "Evaluate a non-bedside role" },
        { id: "total_comp", label: "Understand total compensation" },
        { id: "income_qol", label: "Improve income without sacrificing quality of life" },
        { id: "long_term", label: "Plan a healthcare-business career" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "current_role",
      prompt: "Which role is closest to your current work?",
      options: [
        { id: "bedside_rn", label: "Bedside RN" },
        { id: "outpatient_rn", label: "Outpatient RN" },
        { id: "advanced_practice", label: "Advanced practice" },
        { id: "allied_health", label: "Allied health" },
        { id: "operations", label: "Healthcare operations" },
        { id: "health_tech", label: "Healthcare technology" },
        { id: "device", label: "Medical-device role" },
        { id: "student", label: "Student or new graduate" },
        { id: "other", label: "Other healthcare role" },
      ],
    },
    {
      id: "career_priority",
      prompt: "What matters most in the next role?",
      options: [
        { id: "income", label: "Higher income" },
        { id: "schedule", label: "Better schedule" },
        { id: "burnout", label: "Less burnout" },
        { id: "progression", label: "Career progression" },
        { id: "remote", label: "Remote or hybrid work" },
        { id: "physical", label: "Lower physical burden" },
        { id: "benefits", label: "Better benefits" },
        { id: "predictable", label: "More predictable hours" },
        { id: "long_term_income", label: "Long-term earning potential" },
      ],
    },
    {
      id: "compensation_structure",
      prompt: "Which compensation structures are you comparing?",
      options: [
        { id: "hourly", label: "Hourly" },
        { id: "salary", label: "Salary" },
        { id: "hourly_overtime", label: "Hourly with overtime" },
        { id: "salary_bonus", label: "Salary with bonus" },
        { id: "variable", label: "Commission or variable compensation" },
        { id: "mixed", label: "Different structures" },
      ],
    },
    {
      id: "tradeoff_tolerance",
      prompt: "Which tradeoff best describes your decision?",
      options: [
        { id: "trajectory", label: "I can accept lower initial pay for stronger trajectory" },
        { id: "immediate_income", label: "I need equal or higher immediate income" },
        { id: "quality_of_life", label: "Quality of life is the priority" },
        { id: "income_growth", label: "Income growth is the priority" },
        { id: "geographic", label: "I need geographic stability" },
        { id: "unsure", label: "Not sure" },
      ],
    },
    { id: "urgency", prompt: "How soon do you need to decide?", options: urgencyOptions },
  ],
};

const recommendations: NavigatorRecommendation[] = [
  { id: "wealth_starter_reserve", pathway: "wealth", priority: "do_now", type: "action", title: "Build a starter emergency reserve", reason: "A small liquid reserve prevents routine surprises from forcing new high-interest debt and creates room for better long-term decisions.", actionText: "Open the wealth-building sequence", destinationPath: "/build-wealth", caution: "The right reserve size depends on job stability, household obligations, insurance, and upcoming expenses.", fixedAnalyticsId: "wealth_starter_reserve" },
  { id: "wealth_capture_match", pathway: "wealth", priority: "do_now", type: "verification", title: "Verify and capture the full employer match", reason: "An employer match is part of compensation, but contribution, vesting, and eligibility rules differ by plan.", actionText: "Estimate the paycheck contribution", destinationPath: "/tools/403b-paycheck-calculator", caution: "Confirm the actual match formula and vesting schedule in the plan document or benefits portal.", fixedAnalyticsId: "wealth_capture_match" },
  { id: "wealth_high_interest_debt", pathway: "wealth", priority: "do_now", type: "action", title: "Separate high-interest debt from long-term investing", reason: "High borrowing costs can overwhelm expected investment returns, but minimum payments, taxes, liquidity, and employer matching still matter.", actionText: "Review the stabilize-first framework", destinationPath: "/build-wealth", caution: "Do not stop required payments or abandon an employer match without reviewing the full tradeoff.", fixedAnalyticsId: "wealth_high_interest_debt" },
  { id: "wealth_student_loans", pathway: "wealth", priority: "do_next", type: "tool", title: "Build a student-loan decision path", reason: "Federal-program decisions and private-loan payoff math require different information and should not be mixed together.", actionText: "Open the student-loan path", destinationPath: "/student-loans", caution: "Verify current federal program rules through official sources before changing repayment or refinancing federal loans.", fixedAnalyticsId: "wealth_student_loans" },
  { id: "wealth_cash_flow", pathway: "wealth", priority: "do_next", type: "calculation", title: "Find the cash-flow lever that can be automated", reason: "A sustainable recurring transfer usually compounds more effectively than relying on occasional motivation.", actionText: "Browse cash-flow and savings tools", destinationPath: "/tools", fixedAnalyticsId: "wealth_cash_flow" },
  { id: "wealth_403b", pathway: "wealth", priority: "do_next", type: "calculation", title: "Model the paycheck effect of a 403(b) contribution", reason: "Contribution percentages are easier to choose when the estimated paycheck effect and annual savings are visible together.", actionText: "Use the 403(b) paycheck calculator", destinationPath: "/tools/403b-paycheck-calculator", caution: "The estimate cannot reproduce every payroll, tax, or plan rule.", fixedAnalyticsId: "wealth_403b" },
  { id: "wealth_investing_foundations", pathway: "wealth", priority: "learn_later", type: "article", title: "Use a diversified investing foundation", reason: "Long-term investing should be built around time horizon, diversification, costs, and behavior—not short-term predictions.", actionText: "Open the long-term wealth hub", destinationPath: "/build-wealth", fixedAnalyticsId: "wealth_investing_foundations" },
  { id: "wealth_fi", pathway: "wealth", priority: "learn_later", type: "article", title: "Translate financial independence into milestones", reason: "A distant target becomes more useful when broken into savings rate, retirement access, liquidity, and career-income milestones.", actionText: "Review the financial-independence path", destinationPath: "/build-wealth", fixedAnalyticsId: "wealth_fi" },

  { id: "benefits_deadline", pathway: "workplace_benefits", priority: "do_now", type: "verification", title: "Confirm the election deadline and what cannot be changed later", reason: "Benefits elections may be locked after the enrollment window unless a qualifying event applies.", actionText: "Open the open-enrollment guide", destinationPath: "/open-enrollment", caution: "Use the employer portal and official plan materials for the controlling deadline and election rules.", fixedAnalyticsId: "benefits_deadline" },
  { id: "benefits_sbc", pathway: "workplace_benefits", priority: "do_now", type: "checklist", title: "Read the Summary of Benefits and Coverage", reason: "The SBC gives a standardized starting point for deductibles, cost sharing, networks, and coverage examples.", actionText: "Use the SBC reading guide", destinationPath: "/insurance/how-to-read-an-sbc", caution: "The full plan document and provider or drug directories may contain details the SBC does not show.", fixedAnalyticsId: "benefits_sbc" },
  { id: "benefits_match", pathway: "workplace_benefits", priority: "do_now", type: "verification", title: "Verify the employer retirement match", reason: "The match can materially change total compensation, but the formula, vesting schedule, and eligible pay may differ.", actionText: "Estimate a contribution level", destinationPath: "/tools/403b-paycheck-calculator", fixedAnalyticsId: "benefits_match" },
  { id: "benefits_blueprint", pathway: "workplace_benefits", priority: "do_next", type: "tool", title: "Build a benefits blueprint before entering the HR portal", reason: "A prebuilt decision framework makes plan elections easier when the portal presents many choices at once.", actionText: "Open the Benefits Blueprint", destinationPath: "/tools/healthcare-worker-benefits-blueprint", fixedAnalyticsId: "benefits_blueprint" },
  { id: "benefits_action_plan", pathway: "workplace_benefits", priority: "do_next", type: "tool", title: "Turn employer benefits into an action checklist", reason: "Retirement, insurance, tax accounts, and voluntary benefits should be reviewed as one compensation system.", actionText: "Build the employer-benefits action plan", destinationPath: "/tools/employer-benefits-action-plan", fixedAnalyticsId: "benefits_action_plan" },
  { id: "benefits_health_cost", pathway: "workplace_benefits", priority: "do_next", type: "calculation", title: "Compare health plans using total annual exposure", reason: "Payroll premiums alone can hide deductible, coinsurance, prescription, and out-of-pocket differences.", actionText: "Compare true annual plan cost", destinationPath: "/tools/open-enrollment-true-cost-calculator", caution: "Verify networks, covered services, drug formularies, and employer contributions separately.", fixedAnalyticsId: "benefits_health_cost" },
  { id: "benefits_total_comp", pathway: "workplace_benefits", priority: "do_next", type: "calculation", title: "Compare the complete value of two offers", reason: "Base pay can mislead when overtime, premiums, retirement contributions, PTO, commute, and schedule differ.", actionText: "Use the total-compensation comparison", destinationPath: "/tools/healthcare-worker-total-compensation-comparison", fixedAnalyticsId: "benefits_total_comp" },
  { id: "benefits_insurance_hub", pathway: "workplace_benefits", priority: "learn_later", type: "article", title: "Learn the insurance terms behind the election", reason: "Understanding deductibles, copays, coinsurance, networks, and prior authorization improves future plan decisions.", actionText: "Open the benefits and insurance hub", destinationPath: "/insurance", fixedAnalyticsId: "benefits_insurance_hub" },

  { id: "cost_confirm_processing", pathway: "healthcare_costs", priority: "do_now", type: "verification", title: "Confirm the payer processed the claim", reason: "A provider balance may not reflect the final patient responsibility when a claim is pending, missing, rejected, or submitted with incorrect information.", actionText: "Use the Medical Bill Review Flow", destinationPath: "/tools/medical-bill-review-flow", caution: "Do not ignore a written payment, appeal, or collection deadline while requesting clarification.", fixedAnalyticsId: "cost_confirm_processing" },
  { id: "cost_compare_eob", pathway: "healthcare_costs", priority: "do_now", type: "tool", title: "Compare the bill with the EOB or Medicare notice", reason: "The provider bill and payer explanation should tell a consistent story about the service, allowed amount, payment, adjustment, and patient responsibility.", actionText: "Run the EOB-to-bill match check", destinationPath: "/tools/eob-to-bill-match-checker", caution: "The checker organizes questions; it does not determine whether a balance is legally or contractually owed.", fixedAnalyticsId: "cost_compare_eob" },
  { id: "cost_deadline", pathway: "healthcare_costs", priority: "do_now", type: "checklist", title: "Record every call, promise, and deadline", reason: "Billing and coverage problems become harder to manage when dates, departments, reference numbers, and promised actions are scattered.", actionText: "Open the local call and deadline tracker", destinationPath: "/insurance/medical-bill-review-toolkit#call-tracker", caution: "Verify dates against the written notice or official portal and avoid entering claim, member, or medical-record numbers.", fixedAnalyticsId: "cost_deadline" },
  { id: "cost_prior_auth", pathway: "healthcare_costs", priority: "do_now", type: "tool", title: "Organize the prior-authorization next steps", reason: "A pending or denied authorization may require different questions for the provider and the health plan, especially when care is delayed.", actionText: "Use the prior-authorization guide", destinationPath: "/tools/prior-authorization-next-step-guide", caution: "For urgent clinical concerns, contact the treating team and plan using the urgency instructions in the notice.", fixedAnalyticsId: "cost_prior_auth" },
  { id: "cost_financial_assistance", pathway: "healthcare_costs", priority: "do_next", type: "article", title: "Check hospital financial assistance before long-term debt", reason: "Hospital assistance or discount policies may matter before draining savings, using high-interest credit, or accepting a long payment arrangement.", actionText: "Read the financial-assistance guide", destinationPath: "/articles/check-hospital-financial-assistance-before-paying", caution: "Eligibility and covered providers vary by hospital and state; request the exact written policy.", fixedAnalyticsId: "cost_financial_assistance" },
  { id: "cost_program_guide", pathway: "healthcare_costs", priority: "do_next", type: "tool", title: "Use the Medicare and Medicaid eligibility pathway", reason: "Medicare and Medicaid have different purposes, qualification rules, agencies, and billing protections.", actionText: "Open the eligibility guidance", destinationPath: "/tools/medicare-medicaid-eligibility-check", caution: "The tool is educational and cannot issue an official eligibility or coverage determination.", fixedAnalyticsId: "cost_program_guide" },
  { id: "cost_discharge", pathway: "healthcare_costs", priority: "do_next", type: "checklist", title: "Build the hospital-discharge coverage checklist", reason: "Rehabilitation, home health, equipment, transportation, and follow-up care can involve separate coverage rules and vendors.", actionText: "Open the discharge guide", destinationPath: "/guides/hospital-discharge-medicare", fixedAnalyticsId: "cost_discharge" },
  { id: "cost_toolkit", pathway: "healthcare_costs", priority: "do_next", type: "tool", title: "Use the complete Medical Bill Review Toolkit", reason: "The hub connects document identification, bill review, financial assistance, official resources, and follow-up tracking.", actionText: "Open the medical-bill toolkit", destinationPath: "/insurance/medical-bill-review-toolkit", fixedAnalyticsId: "cost_toolkit" },
  { id: "cost_network", pathway: "healthcare_costs", priority: "learn_later", type: "article", title: "Understand an out-of-network bill from an in-network facility", reason: "Network status, claim processing, and federal or state surprise-billing protections must be separated before choosing the next step.", actionText: "Read the network-billing guide", destinationPath: "/articles/in-network-hospital-out-of-network-bills", fixedAnalyticsId: "cost_network" },
  { id: "cost_multiple_bills", pathway: "healthcare_costs", priority: "learn_later", type: "article", title: "Understand why one visit can create multiple bills", reason: "Facility, physician, imaging, laboratory, anesthesia, pathology, and ambulance services may bill separately.", actionText: "Read the multiple-bills explainer", destinationPath: "/articles/why-one-hospital-visit-can-create-multiple-bills", fixedAnalyticsId: "cost_multiple_bills" },

  { id: "career_total_comp", pathway: "healthcare_career", priority: "do_now", type: "calculation", title: "Compare total compensation—not only base pay", reason: "Overtime, differentials, bonus, retirement contributions, health premiums, PTO, commute, and schedule can reverse an apparent pay difference.", actionText: "Use the total-compensation comparison", destinationPath: "/tools/healthcare-worker-total-compensation-comparison", caution: "Use realistic assumptions and verify benefits in the written offer and plan documents.", fixedAnalyticsId: "career_total_comp" },
  { id: "career_baseline", pathway: "healthcare_career", priority: "do_now", type: "calculation", title: "Establish the real value of your current healthcare role", reason: "A transition decision needs a baseline that includes overtime, differentials, benefits, commute, and schedule—not only hourly wage.", actionText: "Open healthcare-worker paycheck tools", destinationPath: "/healthcare-workers/paycheck-tools", fixedAnalyticsId: "career_baseline" },
  { id: "career_tradeoffs", pathway: "healthcare_career", priority: "do_next", type: "checklist", title: "Score the quality-of-life tradeoffs explicitly", reason: "Schedule, call burden, travel, commute, physical strain, flexibility, and progression are real economic variables even when they do not appear in salary.", actionText: "Compare the offers side by side", destinationPath: "/tools/healthcare-worker-total-compensation-comparison", fixedAnalyticsId: "career_tradeoffs" },
  { id: "career_transition_hub", pathway: "healthcare_career", priority: "do_next", type: "article", title: "Build a healthcare-career transition path", reason: "Clinical credibility can transfer into education, quality, operations, utilization, devices, customer success, and healthcare technology.", actionText: "Open the healthcare-worker hub", destinationPath: "/healthcare-workers", fixedAnalyticsId: "career_transition_hub" },
  { id: "career_overtime", pathway: "healthcare_career", priority: "do_next", type: "calculation", title: "Separate sustainable income from overtime-dependent income", reason: "Current annual earnings may be difficult to replace if they depend on recurring overtime, nights, weekends, or burnout-producing schedules.", actionText: "Review paycheck and overtime tools", destinationPath: "/healthcare-workers/paycheck-tools", fixedAnalyticsId: "career_overtime" },
  { id: "career_trajectory", pathway: "healthcare_career", priority: "learn_later", type: "article", title: "Compare the three-year trajectory, not only year one", reason: "A role with training, commercial exposure, leadership scope, or transferable technology experience may create greater future optionality.", actionText: "Review healthcare-career resources", destinationPath: "/healthcare-workers", fixedAnalyticsId: "career_trajectory" },
];

const recommendationMap = new Map(recommendations.map((recommendation) => [recommendation.id, recommendation]));

export const getNavigatorRecommendation = (id: string) => recommendationMap.get(id);
export const getAllNavigatorRecommendations = () => [...recommendations];

const getOptionLabel = (pathway: NavigatorPath, questionId: string, optionId: string) =>
  NAVIGATOR_QUESTIONS[pathway]
    .find((question) => question.id === questionId)
    ?.options.find((option) => option.id === optionId)?.label ?? NAVIGATOR_PATHS[pathway].label;

const caps: Record<PlanPriority, number> = { do_now: 3, do_next: 4, learn_later: 5 };

export const generateNavigatorPlan = (pathway: NavigatorPath, answers: Record<string, string>): NavigatorPlan => {
  const scored = new Map<string, number>();
  const add = (id: string, score: number) => scored.set(id, Math.max(score, scored.get(id) ?? 0));

  if (pathway === "wealth") {
    const goal = answers.wealth_goal;
    const emergency = answers.emergency_position;
    const debt = answers.debt_type;
    const access = answers.retirement_access;
    const match = answers.match_status;

    if (goal === "emergency" || emergency === "none" || emergency === "under_one") add("wealth_starter_reserve", 110);
    if (debt === "high_interest" || debt === "multiple") add("wealth_high_interest_debt", 105);
    if (debt === "student") add("wealth_student_loans", 95);
    if (debt === "medical") add("cost_toolkit", 90);
    if (match === "below" || match === "not_contributing" || match === "unsure") add("wealth_capture_match", 108);
    if (access === "403b" || access === "multiple") add("wealth_403b", 92);
    if (goal === "cash_flow" || goal === "extra_income" || goal === "unsure") add("wealth_cash_flow", 88);
    if (goal === "investing") add("wealth_investing_foundations", 82);
    if (goal === "fi") add("wealth_fi", 85);
    add("wealth_cash_flow", 55);
    add("wealth_investing_foundations", 45);
    add("wealth_fi", 35);
  }

  if (pathway === "workplace_benefits") {
    const decision = answers.benefits_decision;
    const timing = answers.benefits_timing;
    const retirement = answers.benefits_retirement_status;

    if (["enrolling", "job_offer", "new_role", "annual"].includes(timing) || ["today", "week"].includes(answers.urgency)) add("benefits_deadline", 110);
    if (["health_plan", "open_enrollment", "hsa_fsa", "unsure"].includes(decision)) {
      add("benefits_sbc", 105);
      add("benefits_health_cost", 92);
      add("benefits_blueprint", 88);
    }
    if (["retirement", "unsure"].includes(decision) || retirement === "not_contributing" || retirement === "below_match" || retirement === "unsure") add("benefits_match", 104);
    if (decision === "job_offers" || decision === "total_comp" || timing === "job_offer") add("benefits_total_comp", 108);
    if (decision === "childcare" || decision === "insurance" || decision === "unsure") add("benefits_action_plan", 95);
    add("benefits_action_plan", 70);
    add("benefits_blueprint", 65);
    add("benefits_insurance_hub", 40);
  }

  if (pathway === "healthcare_costs") {
    const document = answers.cost_document;
    const issue = answers.cost_issue;
    const support = answers.cost_support;
    const urgency = answers.urgency;

    if (document === "bill" || issue === "no_processing" || support === "first_call") add("cost_confirm_processing", 108);
    if (document === "eob" || document === "msn" || issue === "mismatch" || support === "compare") add("cost_compare_eob", 110);
    if (["denial", "prior_auth"].includes(document) || ["denied", "prior_auth"].includes(issue) || urgency === "delayed_care") add("cost_prior_auth", 112);
    if (["today", "week", "collection", "delayed_care"].includes(urgency) || document === "collection" || issue === "collection" || support === "checklist") add("cost_deadline", 106);
    if (issue === "unaffordable" || support === "assistance" || answers.cost_payer === "uninsured") add("cost_financial_assistance", 104);
    if (["medicare", "medicaid"].includes(issue) || ["medicare", "medicaid"].includes(answers.cost_payer) || ["msn", "medicaid"].includes(document)) add("cost_program_guide", 100);
    if (issue === "discharge") add("cost_discharge", 100);
    if (issue === "network") add("cost_network", 90);
    if (issue === "multiple_bills") add("cost_multiple_bills", 90);
    add("cost_toolkit", 80);
    add("cost_deadline", 60);
    add("cost_multiple_bills", 35);
  }

  if (pathway === "healthcare_career") {
    const decision = answers.career_decision;
    const priority = answers.career_priority;
    const structure = answers.compensation_structure;
    const tradeoff = answers.tradeoff_tolerance;

    if (["compare_offers", "hourly_salary", "total_comp", "income_qol"].includes(decision) || ["salary", "salary_bonus", "variable", "mixed"].includes(structure)) add("career_total_comp", 110);
    if (["overtime", "hourly_salary"].includes(decision) || structure === "hourly_overtime" || priority === "income") add("career_baseline", 105);
    if (decision === "overtime" || structure === "hourly_overtime") add("career_overtime", 98);
    if (["leave_bedside", "non_bedside", "long_term"].includes(decision) || answers.current_role === "bedside_rn") add("career_transition_hub", 100);
    if (["schedule", "burnout", "remote", "physical", "predictable"].includes(priority) || tradeoff === "quality_of_life") add("career_tradeoffs", 104);
    if (["trajectory", "income_growth"].includes(tradeoff) || ["progression", "long_term_income"].includes(priority)) add("career_trajectory", 92);
    add("career_total_comp", 75);
    add("career_transition_hub", 65);
    add("career_trajectory", 45);
  }

  const grouped: Record<PlanPriority, Array<{ recommendation: NavigatorRecommendation; score: number }>> = {
    do_now: [],
    do_next: [],
    learn_later: [],
  };

  scored.forEach((score, id) => {
    const recommendation = recommendationMap.get(id);
    if (recommendation) grouped[recommendation.priority].push({ recommendation, score });
  });

  const selected = (["do_now", "do_next", "learn_later"] as PlanPriority[]).flatMap((priority) =>
    grouped[priority]
      .sort((a, b) => b.score - a.score || a.recommendation.title.localeCompare(b.recommendation.title))
      .slice(0, caps[priority])
      .map(({ recommendation }) => recommendation),
  );

  const firstQuestion = NAVIGATOR_QUESTIONS[pathway][0];
  return {
    pathway,
    pathwayLabel: NAVIGATOR_PATHS[pathway].label,
    objectiveLabel: getOptionLabel(pathway, firstQuestion.id, answers[firstQuestion.id]),
    generatedAt: new Date().toISOString(),
    recommendations: selected,
  };
};

const emitPlanUpdated = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(NAVIGATOR_PLAN_UPDATED_EVENT));
};

export const loadStoredNavigatorPlan = (): StoredNavigatorPlan | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(NAVIGATOR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredNavigatorPlan>;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.actionIds) || !Array.isArray(parsed.completedActionIds)) return null;
    const actionIds = [...new Set(parsed.actionIds.filter((id): id is string => typeof id === "string" && recommendationMap.has(id)))];
    if (!actionIds.length) return null;
    const completedActionIds = [...new Set(parsed.completedActionIds.filter((id): id is string => typeof id === "string" && actionIds.includes(id)))];
    const pathway = parsed.pathway && ["wealth", "workplace_benefits", "healthcare_costs", "healthcare_career", "mixed"].includes(parsed.pathway)
      ? parsed.pathway as StoredNavigatorPath
      : "mixed";
    return {
      schemaVersion: 1,
      pathway,
      objectiveLabel: typeof parsed.objectiveLabel === "string" && parsed.objectiveLabel.trim() ? parsed.objectiveLabel.slice(0, 120) : "My financial action plan",
      actionIds,
      completedActionIds,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

const persistStoredPlan = (plan: StoredNavigatorPlan) => {
  if (typeof window === "undefined") return plan;
  window.localStorage.setItem(NAVIGATOR_STORAGE_KEY, JSON.stringify(plan));
  emitPlanUpdated();
  return plan;
};

export const saveNavigatorPlan = (plan: NavigatorPlan): StoredNavigatorPlan => {
  const existing = loadStoredNavigatorPlan();
  const generatedIds = plan.recommendations.map((recommendation) => recommendation.id);
  const actionIds = [...new Set([...(existing?.actionIds ?? []), ...generatedIds])];
  const pathway: StoredNavigatorPath = existing && existing.pathway !== plan.pathway ? "mixed" : plan.pathway;
  return persistStoredPlan({
    schemaVersion: 1,
    pathway,
    objectiveLabel: existing && existing.pathway !== plan.pathway ? "My combined financial action plan" : plan.objectiveLabel,
    actionIds,
    completedActionIds: (existing?.completedActionIds ?? []).filter((id) => actionIds.includes(id)),
    savedAt: new Date().toISOString(),
  });
};

export const addNavigatorAction = (recommendationId: string): { plan: StoredNavigatorPlan | null; added: boolean } => {
  const recommendation = recommendationMap.get(recommendationId);
  if (!recommendation) return { plan: loadStoredNavigatorPlan(), added: false };
  const existing = loadStoredNavigatorPlan();
  if (existing?.actionIds.includes(recommendationId)) return { plan: existing, added: false };
  const plan: StoredNavigatorPlan = {
    schemaVersion: 1,
    pathway: existing && existing.pathway !== recommendation.pathway ? "mixed" : recommendation.pathway,
    objectiveLabel: existing ? (existing.pathway === recommendation.pathway ? existing.objectiveLabel : "My combined financial action plan") : NAVIGATOR_PATHS[recommendation.pathway].label,
    actionIds: [...(existing?.actionIds ?? []), recommendationId],
    completedActionIds: existing?.completedActionIds ?? [],
    savedAt: new Date().toISOString(),
  };
  return { plan: persistStoredPlan(plan), added: true };
};

export const setNavigatorActionCompleted = (recommendationId: string, completed: boolean) => {
  const existing = loadStoredNavigatorPlan();
  if (!existing || !existing.actionIds.includes(recommendationId)) return existing;
  const completedActionIds = completed
    ? [...new Set([...existing.completedActionIds, recommendationId])]
    : existing.completedActionIds.filter((id) => id !== recommendationId);
  return persistStoredPlan({ ...existing, completedActionIds, savedAt: new Date().toISOString() });
};

export const removeNavigatorAction = (recommendationId: string) => {
  const existing = loadStoredNavigatorPlan();
  if (!existing) return null;
  const actionIds = existing.actionIds.filter((id) => id !== recommendationId);
  if (!actionIds.length) {
    clearNavigatorPlan();
    return null;
  }
  return persistStoredPlan({
    ...existing,
    actionIds,
    completedActionIds: existing.completedActionIds.filter((id) => id !== recommendationId),
    savedAt: new Date().toISOString(),
  });
};

export const clearNavigatorPlan = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(NAVIGATOR_STORAGE_KEY);
  emitPlanUpdated();
};

export const getStoredPlanRecommendations = (plan: StoredNavigatorPlan | null) =>
  plan?.actionIds.flatMap((id) => {
    const recommendation = recommendationMap.get(id);
    return recommendation ? [recommendation] : [];
  }) ?? [];

export const createNavigatorPlanSummary = (plan: StoredNavigatorPlan) => {
  const byPriority: Record<PlanPriority, NavigatorRecommendation[]> = { do_now: [], do_next: [], learn_later: [] };
  getStoredPlanRecommendations(plan).forEach((recommendation) => byPriority[recommendation.priority].push(recommendation));
  const labels: Record<PlanPriority, string> = { do_now: "DO NOW", do_next: "DO NEXT", learn_later: "LEARN LATER" };
  const lines = ["CAF FINANCIAL NAVIGATOR", plan.objectiveLabel, `Saved: ${new Date(plan.savedAt).toLocaleDateString()}`, ""];
  (["do_now", "do_next", "learn_later"] as PlanPriority[]).forEach((priority) => {
    if (!byPriority[priority].length) return;
    lines.push(labels[priority]);
    byPriority[priority].forEach((recommendation) => {
      const complete = plan.completedActionIds.includes(recommendation.id) ? "[x]" : "[ ]";
      lines.push(`${complete} ${recommendation.title}`);
      lines.push(`    ${recommendation.reason}`);
      lines.push(`    https://communityacquiredfinance.com${recommendation.destinationPath}`);
    });
    lines.push("");
  });
  lines.push("Educational only. Verify decisions with current official sources, plan documents, agencies, employers, insurers, billing offices, and qualified professionals.");
  return lines.join("\n");
};
