import {
  calculateHealthPlanScenarios,
  calculateRetirementValue,
} from "@/premium/calculations";
import type {
  BenefitDocumentKind,
  ExtractedBenefitFactKey,
} from "@/premium/documentIntakeContracts";

export const OPEN_ENROLLMENT_PILOT_VERSION = 1 as const;

export const openEnrollmentStepIds = [
  "event",
  "household",
  "documents",
  "medical",
  "accounts",
  "protection",
  "retirement",
  "review",
] as const;

export type OpenEnrollmentStepId = (typeof openEnrollmentStepIds)[number];
export type EnrollmentEventType = "annual" | "new-hire" | "qualifying-life-event" | "undecided";
export type CoverageTier = "employee-only" | "employee-spouse" | "employee-child" | "family" | "undecided";
export type YesNoUnknown = "yes" | "no" | "unknown";
export type HealthcareUsePattern = "low" | "expected" | "high" | "uncertain";
export type DecisionPriority =
  | "lowest-expected-cost"
  | "predictable-costs"
  | "lowest-worst-case"
  | "hsa-value"
  | "balanced"
  | "undecided";
export type DocumentStatus = "ready" | "missing" | "not-applicable" | "unknown";
export type PlanVerificationStatus = "confirmed" | "verify" | "not-relevant";
export type MedicalElection = "a" | "b" | "waive" | "verify" | "undecided";
export type AccountElection = "hsa" | "health-fsa" | "limited-fsa" | "hra" | "none" | "verify" | "undecided";
export type ElectionChoice = "enroll" | "decline" | "verify" | "not-offered" | "undecided";
export type RetirementOffered = "yes" | "no" | "unknown";
export type RetirementMatchStatus = "known" | "none" | "unknown";

export const documentKeys = [
  "benefits-guide",
  "payroll-rates",
  "medical-sbcs",
  "drug-network-resources",
  "account-rules",
  "protection-retirement-summaries",
] as const;

export type DocumentKey = (typeof documentKeys)[number];

export const documentLabels: Record<DocumentKey, string> = {
  "benefits-guide": "Benefits guide for the correct plan year and employee group",
  "payroll-rates": "Medical, dental, vision, and voluntary-benefit payroll rates",
  "medical-sbcs": "Summary of Benefits and Coverage for each medical option",
  "drug-network-resources": "Prescription formulary and provider-directory resources",
  "account-rules": "HSA, HRA, healthcare FSA, limited-purpose FSA, and dependent-care FSA rules",
  "protection-retirement-summaries": "Disability, life, supplemental-benefit, retirement, and vesting summaries",
};

export const ancillaryKeys = [
  "dental",
  "vision",
  "short-term-disability",
  "long-term-disability",
  "life-insurance",
  "accident",
  "critical-illness",
  "hospital-indemnity",
] as const;

export type AncillaryKey = (typeof ancillaryKeys)[number];

export const ancillaryLabels: Record<AncillaryKey, string> = {
  dental: "Dental",
  vision: "Vision",
  "short-term-disability": "Short-term disability",
  "long-term-disability": "Long-term disability",
  "life-insurance": "Employee-paid life insurance",
  accident: "Accident insurance",
  "critical-illness": "Critical illness insurance",
  "hospital-indemnity": "Hospital indemnity insurance",
};

export type HealthPlanInput = {
  label: string;
  annualPremium: number | null;
  deductible: number | null;
  coinsurancePercent: number | null;
  outOfPocketMaximum: number | null;
  employerAccountContribution: number | null;
  expectedAllowedCosts: number | null;
  networkStatus: PlanVerificationStatus;
  prescriptionStatus: PlanVerificationStatus;
};

export type ConfirmedSourceSummary = {
  sourceCategory: BenefitDocumentKind;
  factKeys: ExtractedBenefitFactKey[];
  confirmedAt: string;
};

export type OpenEnrollmentPilotState = {
  version: typeof OPEN_ENROLLMENT_PILOT_VERSION;
  currentStep: OpenEnrollmentStepId;
  eventType: EnrollmentEventType;
  deadline: string;
  coverageTier: CoverageTier;
  otherCoverageAvailable: YesNoUnknown;
  healthcareUse: HealthcareUsePattern;
  decisionPriority: DecisionPriority;
  documents: Record<DocumentKey, DocumentStatus>;
  compareSecondPlan: boolean;
  plans: {
    a: HealthPlanInput;
    b: HealthPlanInput;
  };
  sourceAssistance: {
    a: ConfirmedSourceSummary | null;
    b: ConfirmedSourceSummary | null;
  };
  medicalElection: MedicalElection;
  accountElection: AccountElection;
  annualAccountContribution: number | null;
  dependentCareFsa: ElectionChoice;
  payPeriods: number | null;
  ancillary: Record<AncillaryKey, ElectionChoice>;
  ancillaryAnnualPremium: number | null;
  retirementOffered: RetirementOffered;
  eligibleCompensation: number | null;
  employeeContributionPercent: number | null;
  retirementMatchStatus: RetirementMatchStatus;
  matchRatePercent: number | null;
  matchLimitPercent: number | null;
  vestedPercent: number | null;
  finalReviewAcknowledged: boolean;
};

export type PlanEstimate = {
  lowUse: number;
  expectedUse: number;
  highUse: number;
  warning: string;
};

export type MedicalRecommendation = {
  status: "incomplete" | "single-plan" | "recommendation" | "tie" | "verification-first";
  recommendedPlanId: "a" | "b" | null;
  scenario: "lowUse" | "expectedUse" | "highUse";
  scenarioLabel: string;
  estimatedDifference: number | null;
  explanation: string;
  cautions: string[];
};

export type ElectionPlan = {
  medicalSelection: string;
  medicalSummary: string;
  accountSelection: string;
  ancillarySelections: Array<{ label: string; selection: string }>;
  retirementSelection: string;
  estimatedAnnualPayrollElections: number | null;
  estimatedPerPaycheckElections: number | null;
  verificationItems: string[];
};

const blankPlan = (label: string): HealthPlanInput => ({
  label,
  annualPremium: null,
  deductible: null,
  coinsurancePercent: null,
  outOfPocketMaximum: null,
  employerAccountContribution: null,
  expectedAllowedCosts: null,
  networkStatus: "verify",
  prescriptionStatus: "verify",
});

export const createOpenEnrollmentPilotState = (): OpenEnrollmentPilotState => ({
  version: OPEN_ENROLLMENT_PILOT_VERSION,
  currentStep: "event",
  eventType: "undecided",
  deadline: "",
  coverageTier: "undecided",
  otherCoverageAvailable: "unknown",
  healthcareUse: "uncertain",
  decisionPriority: "undecided",
  documents: Object.fromEntries(documentKeys.map((key) => [key, "unknown"])) as Record<DocumentKey, DocumentStatus>,
  compareSecondPlan: true,
  plans: {
    a: blankPlan("Plan A"),
    b: blankPlan("Plan B"),
  },
  sourceAssistance: { a: null, b: null },
  medicalElection: "undecided",
  accountElection: "undecided",
  annualAccountContribution: null,
  dependentCareFsa: "verify",
  payPeriods: 26,
  ancillary: Object.fromEntries(ancillaryKeys.map((key) => [key, "undecided"])) as Record<AncillaryKey, ElectionChoice>,
  ancillaryAnnualPremium: null,
  retirementOffered: "unknown",
  eligibleCompensation: null,
  employeeContributionPercent: null,
  retirementMatchStatus: "unknown",
  matchRatePercent: null,
  matchLimitPercent: null,
  vestedPercent: null,
  finalReviewAcknowledged: false,
});

const finiteNonNegative = (value: number | null) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

export const isHealthPlanComplete = (plan: HealthPlanInput) =>
  finiteNonNegative(plan.annualPremium) &&
  finiteNonNegative(plan.deductible) &&
  finiteNonNegative(plan.coinsurancePercent) &&
  finiteNonNegative(plan.outOfPocketMaximum) &&
  finiteNonNegative(plan.employerAccountContribution) &&
  finiteNonNegative(plan.expectedAllowedCosts);

export const estimateHealthPlan = (plan: HealthPlanInput): PlanEstimate | null => {
  if (!isHealthPlanComplete(plan)) return null;
  return calculateHealthPlanScenarios({
    annualEmployeePremium: plan.annualPremium ?? 0,
    deductible: plan.deductible ?? 0,
    coinsurancePercent: plan.coinsurancePercent ?? 0,
    copays: 0,
    outOfPocketMaximum: plan.outOfPocketMaximum ?? 0,
    employerAccountContribution: plan.employerAccountContribution ?? 0,
    expectedAllowedCosts: plan.expectedAllowedCosts ?? 0,
  });
};

const scenarioForUse = (use: HealthcareUsePattern) => {
  if (use === "low") return { key: "lowUse" as const, label: "low-use" };
  if (use === "high") return { key: "highUse" as const, label: "high-use" };
  return { key: "expectedUse" as const, label: "expected-use" };
};

const verificationCautions = (state: OpenEnrollmentPilotState, planId: "a" | "b") => {
  const plan = state.plans[planId];
  const cautions: string[] = [];
  if (plan.networkStatus === "verify") cautions.push(`${plan.label}: confirm required clinicians and facilities are in network.`);
  if (plan.prescriptionStatus === "verify") cautions.push(`${plan.label}: confirm recurring prescriptions, tiers, pharmacy rules, and prior authorization.`);
  return cautions;
};

export const getMedicalRecommendation = (state: OpenEnrollmentPilotState): MedicalRecommendation => {
  const scenario = scenarioForUse(state.healthcareUse);
  const estimateA = estimateHealthPlan(state.plans.a);
  const estimateB = state.compareSecondPlan ? estimateHealthPlan(state.plans.b) : null;
  const cautions = [
    ...verificationCautions(state, "a"),
    ...(state.compareSecondPlan ? verificationCautions(state, "b") : []),
  ];

  if (!estimateA || (state.compareSecondPlan && !estimateB)) {
    return {
      status: "incomplete",
      recommendedPlanId: null,
      scenario: scenario.key,
      scenarioLabel: scenario.label,
      estimatedDifference: null,
      explanation: "Complete the core plan-cost fields or mark the medical election for verification before relying on a comparison.",
      cautions,
    };
  }

  if (!state.compareSecondPlan) {
    return {
      status: cautions.length ? "verification-first" : "single-plan",
      recommendedPlanId: "a",
      scenario: scenario.key,
      scenarioLabel: scenario.label,
      estimatedDifference: null,
      explanation: `${state.plans.a.label} is the only plan entered. Review affordability and verification items before electing it.`,
      cautions,
    };
  }

  const a = estimateA[scenario.key];
  const b = estimateB?.[scenario.key] ?? a;
  const difference = Math.abs(a - b);
  if (difference < 1) {
    return {
      status: cautions.length ? "verification-first" : "tie",
      recommendedPlanId: null,
      scenario: scenario.key,
      scenarioLabel: scenario.label,
      estimatedDifference: difference,
      explanation: `The entered plans are effectively tied under the ${scenario.label} estimate. Use network, prescription, risk, and account differences to break the tie.`,
      cautions,
    };
  }

  const recommendedPlanId = a < b ? "a" : "b";
  const recommendedLabel = state.plans[recommendedPlanId].label;
  return {
    status: cautions.length ? "verification-first" : "recommendation",
    recommendedPlanId,
    scenario: scenario.key,
    scenarioLabel: scenario.label,
    estimatedDifference: difference,
    explanation: `${recommendedLabel} appears lower by about ${Math.round(difference).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} under the ${scenario.label} estimate.`,
    cautions,
  };
};

export const getRetirementSummary = (state: OpenEnrollmentPilotState) => {
  if (
    state.retirementOffered !== "yes" ||
    !finiteNonNegative(state.eligibleCompensation) ||
    !finiteNonNegative(state.employeeContributionPercent)
  ) {
    return null;
  }

  const matchPercent = state.retirementMatchStatus === "known" && finiteNonNegative(state.matchRatePercent)
    ? state.matchRatePercent ?? 0
    : 0;
  const matchLimitPercent = state.retirementMatchStatus === "known" && finiteNonNegative(state.matchLimitPercent)
    ? state.matchLimitPercent ?? 0
    : 0;
  const vestedPercent = finiteNonNegative(state.vestedPercent) ? state.vestedPercent ?? 0 : 0;

  return calculateRetirementValue({
    eligibleCompensation: state.eligibleCompensation ?? 0,
    employeeContributionPercent: state.employeeContributionPercent ?? 0,
    matchPercent,
    matchLimitPercent,
    nonelectivePercent: 0,
    vestedPercent,
    waitingPeriodMonths: 0,
  });
};

export const isOpenEnrollmentStepComplete = (
  state: OpenEnrollmentPilotState,
  step: OpenEnrollmentStepId,
) => {
  switch (step) {
    case "event":
      return state.eventType !== "undecided" && Boolean(state.deadline);
    case "household":
      return (
        state.coverageTier !== "undecided" &&
        state.otherCoverageAvailable !== "unknown" &&
        state.healthcareUse !== "uncertain" &&
        state.decisionPriority !== "undecided"
      );
    case "documents":
      return documentKeys.every((key) => state.documents[key] !== "unknown");
    case "medical":
      return state.medicalElection !== "undecided";
    case "accounts":
      return state.accountElection !== "undecided" && state.dependentCareFsa !== "undecided" && finiteNonNegative(state.payPeriods);
    case "protection":
      return ancillaryKeys.every((key) => state.ancillary[key] !== "undecided");
    case "retirement":
      if (state.retirementOffered === "no") return true;
      if (
        state.retirementOffered !== "yes" ||
        !finiteNonNegative(state.eligibleCompensation) ||
        !finiteNonNegative(state.employeeContributionPercent)
      ) return false;
      if (state.retirementMatchStatus === "unknown") return false;
      if (state.retirementMatchStatus === "known") {
        return finiteNonNegative(state.matchRatePercent) && finiteNonNegative(state.matchLimitPercent);
      }
      return true;
    case "review":
      return state.finalReviewAcknowledged;
    default:
      return false;
  }
};

export const getOpenEnrollmentProgress = (state: OpenEnrollmentPilotState) => {
  const complete = openEnrollmentStepIds.filter((step) => isOpenEnrollmentStepComplete(state, step)).length;
  return Math.round((complete / openEnrollmentStepIds.length) * 100);
};

export const getNextIncompleteStep = (state: OpenEnrollmentPilotState) =>
  openEnrollmentStepIds.find((step) => !isOpenEnrollmentStepComplete(state, step)) ?? "review";

const selectionLabel = (choice: ElectionChoice) => {
  if (choice === "enroll") return "Enroll";
  if (choice === "decline") return "Decline";
  if (choice === "verify") return "Verify before deciding";
  if (choice === "not-offered") return "Not offered";
  return "Not decided";
};

export const getVerificationItems = (state: OpenEnrollmentPilotState) => {
  const items: string[] = [];
  documentKeys.forEach((key) => {
    if (state.documents[key] === "missing") items.push(`Obtain: ${documentLabels[key]}.`);
  });

  if (state.otherCoverageAvailable === "unknown") {
    items.push("Confirm whether another employer plan is available to the household and whether a spouse surcharge applies.");
  }

  const medical = getMedicalRecommendation(state);
  if (medical.status === "incomplete") items.push("Complete or verify the core medical-plan cost fields before relying on the comparison.");
  items.push(...medical.cautions);

  if (state.medicalElection === "verify") items.push("Resolve the medical-plan election before submitting through the employer portal.");
  if (state.accountElection === "verify") items.push("Confirm account eligibility and contribution rules before electing an HSA, HRA, or FSA.");
  if (state.dependentCareFsa === "verify") items.push("Confirm eligible dependent-care expenses and plan rules before electing a dependent-care FSA.");

  ancillaryKeys.forEach((key) => {
    if (state.ancillary[key] === "verify") items.push(`Review the official ${ancillaryLabels[key].toLowerCase()} summary and payroll cost before deciding.`);
  });

  if (state.retirementOffered === "unknown") items.push("Confirm whether a workplace retirement plan is available and when eligibility begins.");
  if (state.retirementOffered === "yes" && !finiteNonNegative(state.eligibleCompensation)) {
    items.push("Confirm the eligible compensation used for workplace retirement contributions and matching.");
  }
  if (state.retirementOffered === "yes" && !finiteNonNegative(state.employeeContributionPercent)) {
    items.push("Choose or verify the employee retirement contribution percentage.");
  }
  if (state.retirementMatchStatus === "unknown" && state.retirementOffered === "yes") {
    items.push("Confirm the employer retirement match formula and vesting schedule.");
  }
  if (state.retirementOffered === "yes" && state.retirementMatchStatus === "known") {
    if (!finiteNonNegative(state.matchRatePercent)) items.push("Confirm the employer retirement match rate.");
    if (!finiteNonNegative(state.matchLimitPercent)) items.push("Confirm the compensation percentage eligible for the employer match.");
  }
  if (state.retirementOffered === "yes" && !finiteNonNegative(state.vestedPercent)) {
    items.push("Confirm what percentage of employer retirement contributions is currently vested.");
  }

  return [...new Set(items)];
};

const selectedPlan = (state: OpenEnrollmentPilotState) => {
  if (state.medicalElection === "a") return state.plans.a;
  if (state.medicalElection === "b") return state.plans.b;
  return null;
};

export const buildElectionPlan = (state: OpenEnrollmentPilotState): ElectionPlan => {
  const selected = selectedPlan(state);
  const medicalRecommendation = getMedicalRecommendation(state);
  const retirement = getRetirementSummary(state);
  const verificationItems = getVerificationItems(state);

  const medicalSelection =
    state.medicalElection === "waive"
      ? "Waive employer medical coverage"
      : state.medicalElection === "verify"
        ? "Medical election requires verification"
        : selected?.label ?? "Medical election not decided";

  const accountSelection =
    state.accountElection === "undecided"
      ? "Account election not decided"
      : state.accountElection === "verify"
        ? "Account election requires verification"
        : state.accountElection === "none"
          ? "No HSA, HRA, or healthcare FSA election"
          : state.accountElection.toUpperCase();

  const annualMedicalPremium = selected && finiteNonNegative(selected.annualPremium) ? selected.annualPremium ?? 0 : null;
  const annualAccountContribution = finiteNonNegative(state.annualAccountContribution) ? state.annualAccountContribution ?? 0 : 0;
  const annualAncillaryPremium = finiteNonNegative(state.ancillaryAnnualPremium) ? state.ancillaryAnnualPremium ?? 0 : 0;
  const annualRetirementContribution =
    state.retirementOffered === "yes" &&
    finiteNonNegative(state.eligibleCompensation) &&
    finiteNonNegative(state.employeeContributionPercent)
      ? (state.eligibleCompensation ?? 0) * ((state.employeeContributionPercent ?? 0) / 100)
      : 0;

  const estimatedAnnualPayrollElections =
    annualMedicalPremium === null
      ? null
      : annualMedicalPremium + annualAccountContribution + annualAncillaryPremium + annualRetirementContribution;
  const estimatedPerPaycheckElections =
    estimatedAnnualPayrollElections !== null && finiteNonNegative(state.payPeriods) && (state.payPeriods ?? 0) > 0
      ? estimatedAnnualPayrollElections / (state.payPeriods ?? 1)
      : null;

  return {
    medicalSelection,
    medicalSummary: medicalRecommendation.explanation,
    accountSelection,
    ancillarySelections: ancillaryKeys.map((key) => ({
      label: ancillaryLabels[key],
      selection: selectionLabel(state.ancillary[key]),
    })),
    retirementSelection:
      state.retirementOffered === "no"
        ? "No workplace retirement plan entered"
        : state.retirementOffered === "yes" && finiteNonNegative(state.employeeContributionPercent)
          ? `Contribute ${state.employeeContributionPercent}% of eligible pay${
              retirement ? `; estimated annual employer value ${Math.round(retirement.annualEmployerValue).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}` : ""
            }`
          : "Retirement election requires verification",
    estimatedAnnualPayrollElections,
    estimatedPerPaycheckElections,
    verificationItems,
  };
};
