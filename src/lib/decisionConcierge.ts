import { DECISION_JOURNEYS, getDecisionJourney } from "@/data/decisionJourneys";
import { getToolHref, tools } from "@/data/tools";
import { getNavigatorRecommendation } from "@/lib/financialNavigator";

export type ConciergeProblemCategory =
  | "workplace_benefits"
  | "health_plans"
  | "open_enrollment_changes"
  | "retirement_contributions"
  | "roth_traditional"
  | "before_medical_care"
  | "medical_bill"
  | "prepare_medicare"
  | "medicare_medicaid_help"
  | "debt_retirement"
  | "job_total_comp"
  | "help_family"
  | "not_sure";

export type ConciergeTiming = "today" | "this_week" | "planning_ahead" | "not_sure";
export type ConciergeAudience = "healthcare_worker" | "patient_caregiver" | "employee" | "general";

export type ConciergeInput = {
  problem?: ConciergeProblemCategory;
  timing?: ConciergeTiming;
  audience?: ConciergeAudience;
};
export type ConciergeRouteDefinition = {
  label: string;
  journeyId: string;
  destinationPath: string;
  reason: string;
  haveAvailable: string[];
  effort: string;
  canSaveReceipt: boolean;
  myPlanActionId: string;
  secondaryPath?: string;
  secondaryLabel?: string;
};

export type ConciergeResult = ConciergeRouteDefinition & {
  problem: ConciergeProblemCategory;
  deadlineSensitive: boolean;
};

export const CONCIERGE_PROBLEM_OPTIONS: Array<{ id: ConciergeProblemCategory; label: string }> = [
  { id: "workplace_benefits", label: "Choose or review workplace benefits" },
  { id: "health_plans", label: "Compare health plans" },
  { id: "open_enrollment_changes", label: "Understand open-enrollment changes" },
  { id: "retirement_contributions", label: "Review retirement contributions" },
  { id: "roth_traditional", label: "Compare Roth and traditional contributions" },
  { id: "before_medical_care", label: "Prepare financially before medical care" },
  { id: "medical_bill", label: "Understand or reduce a medical bill" },
  { id: "prepare_medicare", label: "Prepare for Medicare" },
  { id: "medicare_medicaid_help", label: "Find Medicare or Medicaid assistance" },
  { id: "debt_retirement", label: "Coordinate debt and retirement" },
  { id: "job_total_comp", label: "Compare jobs or total compensation" },
  { id: "help_family", label: "Help a patient or family member" },
  { id: "not_sure", label: "Not sure where to start" },
];

export const CONCIERGE_TIMING_OPTIONS: Array<{ id: ConciergeTiming; label: string }> = [
  { id: "today", label: "I need to act today" },
  { id: "this_week", label: "I need to act this week" },
  { id: "planning_ahead", label: "I am planning ahead" },
  { id: "not_sure", label: "I am not sure" },
];

export const CONCIERGE_AUDIENCE_OPTIONS: Array<{ id: ConciergeAudience; label: string }> = [
  { id: "healthcare_worker", label: "Healthcare worker" },
  { id: "patient_caregiver", label: "Patient or caregiver" },
  { id: "employee", label: "Employee reviewing benefits" },
  { id: "general", label: "Something else" },
];

export const CONCIERGE_ROUTING_MAP: Record<ConciergeProblemCategory, ConciergeRouteDefinition> = {
  workplace_benefits: {
    label: "Benefits Command Center",
    journeyId: "workplace-open-enrollment",
    destinationPath: "/tools/benefits-command-center",
    reason: "Review pay, health coverage, retirement, protection, and time-off benefits as one compensation system.",
    haveAvailable: ["Enrollment deadline", "Benefits guide or portal", "Current elections if available"],
    effort: "About 10–15 minutes for a full comparison",
    canSaveReceipt: true,
    myPlanActionId: "benefits_action_plan",
    secondaryPath: "/tools/benefits-change-detector",
    secondaryLabel: "Start with what changed this year",
  },
  health_plans: {
    label: "Open Enrollment True Cost Calculator",
    journeyId: "workplace-open-enrollment",
    destinationPath: "/tools/open-enrollment-true-cost-calculator",
    reason: "Compare premiums with expected care, employer funding, and bad-year exposure instead of looking at premium alone.",
    haveAvailable: ["Plan premiums", "Deductibles and out-of-pocket limits", "Employer HSA or HRA funding"],
    effort: "About 5–8 minutes once plan documents are available",
    canSaveReceipt: false,
    myPlanActionId: "benefits_health_cost",
    secondaryPath: "/insurance/how-to-read-an-sbc",
    secondaryLabel: "Learn where to find the numbers",
  },
  open_enrollment_changes: {
    label: "Benefits Change Detector",
    journeyId: "workplace-open-enrollment",
    destinationPath: "/tools/benefits-change-detector",
    reason: "Identify which year-over-year changes deserve review and turn unresolved items into questions for HR or the plan administrator.",
    haveAvailable: ["Current enrollment materials", "Prior-year summary if available", "Enrollment deadline"],
    effort: "About 6–10 minutes for a practical annual review",
    canSaveReceipt: true,
    myPlanActionId: "benefits_action_plan",
    secondaryPath: "/tools/benefits-command-center",
    secondaryLabel: "Compare the full benefits package",
  },
  retirement_contributions: {
    label: "403(b) Paycheck Contribution Calculator",
    journeyId: "healthcare-worker-wealth",
    destinationPath: "/tools/403b-paycheck-calculator",
    reason: "Estimate the paycheck contribution and employer match before changing an election.",
    haveAvailable: ["Pay frequency", "Planned contribution", "Employer match formula"],
    effort: "About 3–5 minutes",
    canSaveReceipt: false,
    myPlanActionId: "wealth_403b",
    secondaryPath: "/build-wealth",
    secondaryLabel: "Review the broader saving order",
  },
  roth_traditional: {
    label: "Roth vs Traditional Decision Helper",
    journeyId: "healthcare-worker-wealth",
    destinationPath: "/tools/roth-vs-traditional-decision-helper",
    reason: "Organize tax-timing, account-access, and diversification factors without declaring one option universally better.",
    haveAvailable: ["Available account types", "Current contribution mix", "Whether employer contributions are pre-tax"],
    effort: "About 4–6 minutes",
    canSaveReceipt: false,
    myPlanActionId: "wealth_403b",
    secondaryPath: "/tools/403b-paycheck-calculator",
    secondaryLabel: "Estimate the paycheck effect",
  },
  before_medical_care: {
    label: "Medical Appointment Cost Preparation",
    journeyId: "medical-bills",
    destinationPath: "/tools/medical-appointment-cost-preparation",
    reason: "Prepare questions about network status, authorization, expected cost, and financial assistance before care when possible.",
    haveAvailable: ["Plan card or portal", "Written estimate if offered", "Authorization instructions"],
    effort: "About 4–7 minutes to organize the first calls",
    canSaveReceipt: false,
    myPlanActionId: "cost_prepare_care",
    secondaryPath: "/tools/prior-authorization-next-step-guide",
    secondaryLabel: "Check an authorization issue",
  },
  medical_bill: {
    label: "Medical Bill Review Toolkit",
    journeyId: "medical-bills",
    destinationPath: "/insurance/medical-bill-review-toolkit",
    reason: "Identify the document, compare it with the payer explanation, and choose the next verification step before paying.",
    haveAvailable: ["Provider bill", "EOB or Medicare notice", "Any written deadline"],
    effort: "About 5–8 minutes for the first review",
    canSaveReceipt: true,
    myPlanActionId: "cost_toolkit",
    secondaryPath: "/tools/financial-assistance-checklist",
    secondaryLabel: "Prepare a financial-assistance request",
  },
  prepare_medicare: {
    label: "Turning 65 Medicare Pathway",
    journeyId: "turning-65-medicare",
    destinationPath: "/medicare-care-costs/turning-65",
    reason: "Build a qualified enrollment timeline around current coverage, work status, HSA use, and official enrollment rules.",
    haveAvailable: ["Current coverage type", "Employment status", "Important enrollment dates"],
    effort: "About 8–12 minutes",
    canSaveReceipt: true,
    myPlanActionId: "cost_program_guide",
    secondaryPath: "/medicare-care-costs",
    secondaryLabel: "Learn Medicare cost basics",
  },
  medicare_medicaid_help: {
    label: "Medicare and Medicaid Eligibility Check",
    journeyId: "long-term-care-medicaid",
    destinationPath: "/tools/medicare-medicaid-eligibility-check",
    reason: "Separate possible Medicare, Medicaid, savings-program, disability, and long-term-care pathways before contacting the official agency.",
    haveAvailable: ["Current coverage", "State of residence", "Broad assistance need"],
    effort: "About 5–8 minutes",
    canSaveReceipt: true,
    myPlanActionId: "cost_program_guide",
    secondaryPath: "/medicare-care-costs",
    secondaryLabel: "Review the program differences",
  },
  debt_retirement: {
    label: "Debt vs Retirement Decision Router",
    journeyId: "healthcare-worker-wealth",
    destinationPath: "/tools/debt-vs-retirement-router",
    reason: "Order liquidity, required payments, employer match, expensive debt, and sustainable retirement progress.",
    haveAvailable: ["Debt type", "Emergency-savings position", "Employer match status"],
    effort: "About 4–6 minutes",
    canSaveReceipt: false,
    myPlanActionId: "wealth_high_interest_debt",
    secondaryPath: "/build-wealth",
    secondaryLabel: "Open the full wealth sequence",
  },
  job_total_comp: {
    label: "Healthcare Worker Total Compensation Comparison",
    journeyId: "healthcare-career-decisions",
    destinationPath: "/tools/healthcare-worker-total-compensation-comparison",
    reason: "Compare pay, retirement, insurance, time off, commute, and schedule instead of base pay alone.",
    haveAvailable: ["Written offers", "Benefit summaries", "Expected schedule and commute"],
    effort: "About 8–12 minutes",
    canSaveReceipt: true,
    myPlanActionId: "career_total_comp",
    secondaryPath: "/healthcare-workers/career-decisions",
    secondaryLabel: "Review nonfinancial tradeoffs",
  },
  help_family: {
    label: "Patient and Caregiver Decision Hub",
    journeyId: "hospital-discharge",
    destinationPath: "/patients-families",
    reason: "Start with the care situation, coverage document, or bill that needs the next practical action.",
    haveAvailable: ["The main question", "Relevant notice or benefit document", "Any deadline"],
    effort: "About 3 minutes to choose the right pathway",
    canSaveReceipt: false,
    myPlanActionId: "cost_toolkit",
    secondaryPath: "/insurance/hospital-discharge-coverage",
    secondaryLabel: "Prepare for hospital discharge",
  },
  not_sure: {
    label: "Financial Navigator",
    journeyId: "healthcare-worker-wealth",
    destinationPath: "/start-here",
    reason: "Choose the broad situation first and receive a short, fixed action plan without entering identifying details.",
    haveAvailable: ["The decision that feels most urgent", "Any deadline"],
    effort: "About 3–5 minutes",
    canSaveReceipt: true,
    myPlanActionId: "wealth_cash_flow",
    secondaryPath: "/tools",
    secondaryLabel: "Browse every focused tool",
  },
};

export const getConciergeResult = (input: ConciergeInput): ConciergeResult => {
  let problem = input.problem ?? "not_sure";
  if (problem === "not_sure" && input.audience === "patient_caregiver") problem = "help_family";
  if (problem === "not_sure" && input.audience === "employee") problem = "workplace_benefits";
  if (problem === "not_sure" && input.audience === "healthcare_worker") problem = "retirement_contributions";

  const route = CONCIERGE_ROUTING_MAP[problem];
  const deadlineSensitive = input.timing === "today" || input.timing === "this_week";
  if (!deadlineSensitive) return { ...route, problem, deadlineSensitive };

  if (["workplace_benefits", "health_plans", "open_enrollment_changes"].includes(problem)) {
    return {
      ...route,
      problem,
      deadlineSensitive,
      reason: `${route.reason} Confirm the controlling enrollment deadline first.`,
      haveAvailable: ["Controlling enrollment deadline", ...route.haveAvailable.filter((item) => item !== "Enrollment deadline")],
    };
  }

  return { ...route, problem, deadlineSensitive };
};

export const validateConciergeRoutingMap = () => {
  const knownPaths = new Set([
    "/",
    "/start-here",
    "/build-wealth",
    "/insurance",
    "/patients-families",
    "/medicare-care-costs",
    ...tools.map(getToolHref),
    ...DECISION_JOURNEYS.flatMap((journey) => [journey.canonicalPath, ...journey.relatedPaths, ...journey.toolPaths]),
    "/tools/benefits-change-detector",
    "/tools/roth-vs-traditional-decision-helper",
    "/tools/debt-vs-retirement-router",
    "/tools/financial-assistance-checklist",
  ]);

  return Object.entries(CONCIERGE_ROUTING_MAP).flatMap(([problem, route]) => {
    const errors: string[] = [];
    const journey = getDecisionJourney(route.journeyId);
    if (!journey) errors.push(`${problem}: unknown journey ${route.journeyId}`);
    if (!knownPaths.has(route.destinationPath)) errors.push(`${problem}: unknown destination ${route.destinationPath}`);
    if (journey && ![journey.canonicalPath, ...journey.relatedPaths, ...journey.toolPaths, "/start-here", "/tools/benefits-change-detector", "/tools/roth-vs-traditional-decision-helper", "/tools/debt-vs-retirement-router", "/tools/403b-paycheck-calculator", "/insurance", "/patients-families"].includes(route.destinationPath)) {
      errors.push(`${problem}: destination is outside its canonical journey`);
    }
    if (!getNavigatorRecommendation(route.myPlanActionId)) errors.push(`${problem}: unknown My Plan action ${route.myPlanActionId}`);
    return errors;
  });
};
