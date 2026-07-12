import {
  calculateCompensation,
  createDefaultCompensationInput,
  getHourlyEquivalent,
  type CompensationInput,
  type CompensationResult,
} from "@/lib/totalCompensation";

export type BenefitsWorkspaceMode =
  | "current_package"
  | "compare_offers"
  | "open_enrollment"
  | "new_offer"
  | "benefits_review";

export type HealthPlanType = "ppo" | "hmo" | "epo" | "pos" | "hdhp" | "other" | "unsure";
export type CoverageTier = "employee" | "employee_spouse" | "employee_child" | "family" | "other";
export type VerificationStatus = "verified" | "not_verified" | "not_applicable";
export type BenefitStatus = "enrolled" | "available_unused" | "not_offered" | "unsure";
export type RetirementPlanType = "401k" | "403b" | "401a" | "pension" | "simple_ira" | "sep_ira" | "multiple" | "none" | "unsure";
export type QualitativeRating = "strong" | "neutral" | "weak" | "unsure";
export type ImportanceRating = "low" | "moderate" | "high" | "essential";

export interface HealthPlanOption {
  id: string;
  label: string;
  planType: HealthPlanType;
  coverageTier: CoverageTier;
  employeePremiumPerPaycheck: number;
  payPeriodsPerYear: number;
  annualSurcharges: number;
  employerPremiumContributionAnnual: number;
  individualDeductible: number;
  familyDeductible: number;
  coinsurancePercent: number;
  primaryCareCopay: number;
  specialistCopay: number;
  urgentCareCopay: number;
  emergencyRoomCopay: number;
  individualOutOfPocketMax: number;
  familyOutOfPocketMax: number;
  employerHsaHraContribution: number;
  networkStatus: VerificationStatus;
  prescriptionStatus: VerificationStatus;
}

export interface RetirementBenefitsProfile {
  planType: RetirementPlanType;
  employeeContributionPercent: number;
  employerMatchRatePercent: number;
  employerMatchCapPercent: number;
  employerNonElectivePercent: number;
  employerFixedContribution: number;
  vestingPercent: number;
  trueUpStatus: "yes" | "no" | "unsure" | "not_applicable";
  matchTiming: "per_paycheck" | "annual" | "unsure" | "not_applicable";
  rothAvailable: boolean;
  traditionalAvailable: boolean;
}

export interface PaidLeaveProfile {
  paidTimeOffHours: number;
  paidHolidayHours: number;
  parentalLeaveWeeks: number;
  carryoverStatus: VerificationStatus;
  payoutStatus: VerificationStatus;
}

export type HiddenBenefitId =
  | "life_insurance"
  | "short_term_disability"
  | "long_term_disability"
  | "dependent_care_fsa"
  | "childcare_support"
  | "tuition_assistance"
  | "certification_reimbursement"
  | "student_loan_assistance"
  | "commuter_benefit"
  | "professional_dues"
  | "parental_leave"
  | "mental_health_support";

export interface HiddenBenefitSelection {
  id: HiddenBenefitId;
  status: BenefitStatus;
  annualKnownValue: number;
}

export interface WorkStructureProfile {
  commuteMinutesPerWorkday: number;
  commuteCostAnnual: number;
  parkingAndTransitAnnual: number;
  workdaysPerWeek: number;
  onCallRating: QualitativeRating;
  schedulePredictability: QualitativeRating;
  flexibility: QualitativeRating;
  physicalDemand: QualitativeRating;
  careerTrajectory: QualitativeRating;
  scheduleImportance: ImportanceRating;
  flexibilityImportance: ImportanceRating;
  physicalDemandImportance: ImportanceRating;
  careerTrajectoryImportance: ImportanceRating;
}

export interface BenefitsPackage {
  id: string;
  label: string;
  schemaVersion: 1;
  isHealthcareWorker: boolean;
  compensation: CompensationInput;
  healthPlans: HealthPlanOption[];
  selectedHealthPlanId?: string;
  retirement: RetirementBenefitsProfile;
  paidLeave: PaidLeaveProfile;
  hiddenBenefits: HiddenBenefitSelection[];
  workStructure: WorkStructureProfile;
  lastUpdatedAt: string;
}

export interface BenefitsWorkspaceState {
  schemaVersion: 1;
  mode: BenefitsWorkspaceMode;
  packages: BenefitsPackage[];
  activePackageId: string;
  comparisonPackageIds: string[];
  savedAt: string;
}

export interface HealthPlanScenarioResult {
  planId: string;
  planLabel: string;
  annualPremium: number;
  lowUseMemberCost: number;
  moderateUseMemberCost: number;
  highUseMemberCost: number;
  lowUseNetAnnualCost: number;
  moderateUseNetAnnualCost: number;
  highUseNetAnnualCost: number;
  employerAccountContribution: number;
  employerPremiumContribution: number;
  requiresNetworkVerification: boolean;
  requiresPrescriptionVerification: boolean;
}

export interface RetirementResult {
  employeeContribution: number;
  estimatedEmployerMatch: number;
  maximumEmployerMatch: number;
  uncapturedEmployerMatch: number;
  employerNonElectiveContribution: number;
  totalEmployerRetirementContribution: number;
  vestedEmployerRetirementValue: number;
  unvestedEmployerRetirementValue: number;
}

export interface BenefitsReceipt {
  packageId: string;
  packageLabel: string;
  generatedAt: string;
  compensation: CompensationResult;
  selectedHealthPlan?: HealthPlanScenarioResult;
  healthPlanScenarios: HealthPlanScenarioResult[];
  retirement: RetirementResult;
  paidLeaveEstimatedValue: number;
  paidLeaveIncludedInPackageValue: number;
  knownHiddenBenefitValue: number;
  qualitativeBenefits: HiddenBenefitSelection[];
  annualEmployeeBenefitCosts: number;
  estimatedQuantifiableEmployerBenefitValue: number;
  estimatedTotalPackageValue: number;
  estimatedValueAfterSelectedCosts: number;
  unvestedValue: number;
  verificationQuestions: string[];
  recommendedActionIds: string[];
  completenessPercent: number;
}

export interface PackageComparison {
  packageA: BenefitsReceipt;
  packageB: BenefitsReceipt;
  expectedCashDifference: number;
  packageValueDifference: number;
  selectedHealthPlanModerateCostDifference: number | null;
  selectedHealthPlanWorstCaseDifference: number | null;
  employerRetirementDifference: number;
  commuteMinutesDifference: number;
  classifications: string[];
  uncertaintySummary: string;
}

export const BENEFITS_COMMAND_CENTER_STORAGE_KEY = "caf-benefits-command-center-v1";
export const BENEFITS_COMMAND_CENTER_UPDATED_EVENT = "caf-benefits-command-center-updated";
export const MAX_BENEFITS_PACKAGES = 3;
export const MAX_HEALTH_PLANS_PER_PACKAGE = 3;

const finiteNonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const safeDiv = (numerator: number, denominator: number) => (denominator > 0 ? numerator / denominator : 0);
const safeLabel = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim().replace(/[<>]/g, "").slice(0, 60) : fallback;

export const HIDDEN_BENEFIT_LABELS: Record<HiddenBenefitId, string> = {
  life_insurance: "Employer-paid life insurance",
  short_term_disability: "Short-term disability",
  long_term_disability: "Long-term disability",
  dependent_care_fsa: "Dependent Care FSA",
  childcare_support: "Childcare or backup-care support",
  tuition_assistance: "Tuition assistance",
  certification_reimbursement: "Certification or licensure reimbursement",
  student_loan_assistance: "Student-loan assistance",
  commuter_benefit: "Commuter or parking benefit",
  professional_dues: "Professional dues or continuing education",
  parental_leave: "Paid parental leave",
  mental_health_support: "Mental-health or employee assistance support",
};

const hiddenBenefitIds = Object.keys(HIDDEN_BENEFIT_LABELS) as HiddenBenefitId[];

export const createDefaultHealthPlan = (id = "health-plan-1", label = "Health plan 1"): HealthPlanOption => ({
  id,
  label,
  planType: "unsure",
  coverageTier: "employee",
  employeePremiumPerPaycheck: 0,
  payPeriodsPerYear: 26,
  annualSurcharges: 0,
  employerPremiumContributionAnnual: 0,
  individualDeductible: 0,
  familyDeductible: 0,
  coinsurancePercent: 20,
  primaryCareCopay: 0,
  specialistCopay: 0,
  urgentCareCopay: 0,
  emergencyRoomCopay: 0,
  individualOutOfPocketMax: 0,
  familyOutOfPocketMax: 0,
  employerHsaHraContribution: 0,
  networkStatus: "not_verified",
  prescriptionStatus: "not_verified",
});

const createDefaultHiddenBenefits = (): HiddenBenefitSelection[] =>
  hiddenBenefitIds.map((id) => ({ id, status: "unsure", annualKnownValue: 0 }));

export const createDefaultBenefitsPackage = (
  id = "current-package",
  label = "Current package",
  payType: "hourly" | "salary" = "hourly",
): BenefitsPackage => {
  const compensation = createDefaultCompensationInput(label, payType);
  compensation.hourlyRate = 0;
  compensation.annualSalary = 0;
  compensation.employerRetirementPercent = 0;
  compensation.employerRetirementFixed = 0;
  compensation.employerHsaHraContribution = 0;
  compensation.additionalBenefitValue = 0;
  compensation.annualEmployeeHealthPremium = 0;
  compensation.annualDentalVisionPremium = 0;
  compensation.annualCommuteCost = 0;
  compensation.annualParkingAndTolls = 0;
  compensation.paidTimeOffHours = 0;

  return {
    id,
    label,
    schemaVersion: 1,
    isHealthcareWorker: false,
    compensation,
    healthPlans: [createDefaultHealthPlan()],
    selectedHealthPlanId: "health-plan-1",
    retirement: {
      planType: "unsure",
      employeeContributionPercent: 0,
      employerMatchRatePercent: 0,
      employerMatchCapPercent: 0,
      employerNonElectivePercent: 0,
      employerFixedContribution: 0,
      vestingPercent: 100,
      trueUpStatus: "unsure",
      matchTiming: "unsure",
      rothAvailable: false,
      traditionalAvailable: false,
    },
    paidLeave: {
      paidTimeOffHours: 0,
      paidHolidayHours: 0,
      parentalLeaveWeeks: 0,
      carryoverStatus: "not_verified",
      payoutStatus: "not_verified",
    },
    hiddenBenefits: createDefaultHiddenBenefits(),
    workStructure: {
      commuteMinutesPerWorkday: 0,
      commuteCostAnnual: 0,
      parkingAndTransitAnnual: 0,
      workdaysPerWeek: payType === "hourly" ? 3 : 5,
      onCallRating: "unsure",
      schedulePredictability: "unsure",
      flexibility: "unsure",
      physicalDemand: "unsure",
      careerTrajectory: "unsure",
      scheduleImportance: "high",
      flexibilityImportance: "moderate",
      physicalDemandImportance: "moderate",
      careerTrajectoryImportance: "high",
    },
    lastUpdatedAt: new Date().toISOString(),
  };
};

export const createDefaultBenefitsWorkspace = (): BenefitsWorkspaceState => {
  const first = createDefaultBenefitsPackage();
  return {
    schemaVersion: 1,
    mode: "current_package",
    packages: [first],
    activePackageId: first.id,
    comparisonPackageIds: [first.id],
    savedAt: new Date().toISOString(),
  };
};

export const calculateHealthPlanScenario = (plan: HealthPlanOption): HealthPlanScenarioResult => {
  const annualPremium = finiteNonNegative(plan.employeePremiumPerPaycheck) * clamp(plan.payPeriodsPerYear, 1, 52) + finiteNonNegative(plan.annualSurcharges);
  const deductible = plan.coverageTier === "family" ? finiteNonNegative(plan.familyDeductible || plan.individualDeductible) : finiteNonNegative(plan.individualDeductible);
  const outOfPocketMax = plan.coverageTier === "family" ? finiteNonNegative(plan.familyOutOfPocketMax || plan.individualOutOfPocketMax) : finiteNonNegative(plan.individualOutOfPocketMax);
  const cap = outOfPocketMax || Math.max(deductible, 1);
  const coinsurance = clamp(plan.coinsurancePercent, 0, 100) / 100;

  const lowUseMemberCost = Math.min(
    cap,
    finiteNonNegative(plan.primaryCareCopay) * 2 + finiteNonNegative(plan.specialistCopay) + Math.min(deductible * 0.1, 500),
  );
  const moderateUseMemberCost = Math.min(
    cap,
    finiteNonNegative(plan.primaryCareCopay) * 4 +
      finiteNonNegative(plan.specialistCopay) * 2 +
      finiteNonNegative(plan.urgentCareCopay) +
      Math.min(deductible * 0.6 + deductible * 0.4 * coinsurance, cap),
  );
  const highUseMemberCost = cap;
  const employerAccountContribution = finiteNonNegative(plan.employerHsaHraContribution);

  return {
    planId: plan.id,
    planLabel: safeLabel(plan.label, "Health plan"),
    annualPremium: roundMoney(annualPremium),
    lowUseMemberCost: roundMoney(lowUseMemberCost),
    moderateUseMemberCost: roundMoney(moderateUseMemberCost),
    highUseMemberCost: roundMoney(highUseMemberCost),
    lowUseNetAnnualCost: roundMoney(Math.max(0, annualPremium + lowUseMemberCost - employerAccountContribution)),
    moderateUseNetAnnualCost: roundMoney(Math.max(0, annualPremium + moderateUseMemberCost - employerAccountContribution)),
    highUseNetAnnualCost: roundMoney(Math.max(0, annualPremium + highUseMemberCost - employerAccountContribution)),
    employerAccountContribution: roundMoney(employerAccountContribution),
    employerPremiumContribution: roundMoney(finiteNonNegative(plan.employerPremiumContributionAnnual)),
    requiresNetworkVerification: plan.networkStatus === "not_verified",
    requiresPrescriptionVerification: plan.prescriptionStatus === "not_verified",
  };
};

export const calculateRetirementBenefits = (profile: RetirementBenefitsProfile, baseAnnualCash: number): RetirementResult => {
  const eligibleCompensation = finiteNonNegative(baseAnnualCash);
  const employeeRate = clamp(profile.employeeContributionPercent, 0, 100) / 100;
  const matchRate = clamp(profile.employerMatchRatePercent, 0, 500) / 100;
  const matchCap = clamp(profile.employerMatchCapPercent, 0, 100) / 100;
  const nonElectiveRate = clamp(profile.employerNonElectivePercent, 0, 100) / 100;
  const vestingRate = clamp(profile.vestingPercent, 0, 100) / 100;
  const employeeContribution = eligibleCompensation * employeeRate;
  const estimatedEmployerMatch = eligibleCompensation * Math.min(employeeRate, matchCap) * matchRate;
  const maximumEmployerMatch = eligibleCompensation * matchCap * matchRate;
  const employerNonElectiveContribution = eligibleCompensation * nonElectiveRate + finiteNonNegative(profile.employerFixedContribution);
  const totalEmployerRetirementContribution = estimatedEmployerMatch + employerNonElectiveContribution;

  return {
    employeeContribution: roundMoney(employeeContribution),
    estimatedEmployerMatch: roundMoney(estimatedEmployerMatch),
    maximumEmployerMatch: roundMoney(maximumEmployerMatch),
    uncapturedEmployerMatch: roundMoney(Math.max(0, maximumEmployerMatch - estimatedEmployerMatch)),
    employerNonElectiveContribution: roundMoney(employerNonElectiveContribution),
    totalEmployerRetirementContribution: roundMoney(totalEmployerRetirementContribution),
    vestedEmployerRetirementValue: roundMoney(totalEmployerRetirementContribution * vestingRate),
    unvestedEmployerRetirementValue: roundMoney(totalEmployerRetirementContribution * (1 - vestingRate)),
  };
};

const getVerificationQuestions = (
  benefitsPackage: BenefitsPackage,
  retirement: RetirementResult,
  selectedHealthPlan: HealthPlanScenarioResult | undefined,
): string[] => {
  const questions: string[] = [];
  const add = (question: string) => {
    if (!questions.includes(question)) questions.push(question);
  };

  if (benefitsPackage.retirement.planType !== "none" && benefitsPackage.retirement.trueUpStatus === "unsure") {
    add("Does the retirement plan provide a year-end match true-up if contributions vary during the year?");
  }
  if (benefitsPackage.retirement.planType !== "none" && benefitsPackage.retirement.matchTiming === "unsure") {
    add("Is the employer match calculated each paycheck or using annual eligible compensation?");
  }
  if (retirement.totalEmployerRetirementContribution > 0 && benefitsPackage.retirement.vestingPercent < 100) {
    add("What service date and schedule control vesting of employer retirement contributions?");
  }
  if (selectedHealthPlan?.requiresNetworkVerification) add("Are the preferred hospitals, clinicians, and laboratories in network under this exact plan option?");
  if (selectedHealthPlan?.requiresPrescriptionVerification) add("Are required prescriptions covered, at which tier, and with what authorization or step-therapy rules?");
  if (selectedHealthPlan && benefitsPackage.healthPlans.find((plan) => plan.id === selectedHealthPlan.planId)?.planType === "hdhp") {
    add("Does the employer HSA contribution require a specific account, payroll election, or active coverage date?");
  }
  if (benefitsPackage.paidLeave.carryoverStatus === "not_verified") add("Is paid leave accrued or front-loaded, and how much carries into the next year?");
  if (benefitsPackage.paidLeave.payoutStatus === "not_verified") add("Is unused paid leave paid when employment ends, and which leave categories are excluded?");

  const longTermDisability = benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "long_term_disability");
  if (longTermDisability && ["enrolled", "available_unused", "unsure"].includes(longTermDisability.status)) {
    add("Does long-term disability replace base pay only, and are overtime, bonuses, or differentials excluded?");
  }
  const tuition = benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "tuition_assistance");
  if (tuition && ["enrolled", "available_unused"].includes(tuition.status)) add("Does tuition assistance require repayment if employment ends within a stated period?");
  const life = benefitsPackage.hiddenBenefits.find((benefit) => benefit.id === "life_insurance");
  if (life && life.status !== "not_offered") add("Are life-insurance beneficiaries current, and does coverage continue or convert after employment ends?");

  return questions.slice(0, 12);
};

const getRecommendedActionIds = (
  benefitsPackage: BenefitsPackage,
  retirement: RetirementResult,
  selectedHealthPlan: HealthPlanScenarioResult | undefined,
  verificationQuestions: string[],
): string[] => {
  const actions: string[] = [];
  const add = (id: string) => {
    if (!actions.includes(id)) actions.push(id);
  };

  if (retirement.uncapturedEmployerMatch > 0 || benefitsPackage.retirement.planType === "unsure") add("benefits_match");
  if (selectedHealthPlan) add("benefits_health_cost");
  if (selectedHealthPlan?.requiresNetworkVerification || selectedHealthPlan?.requiresPrescriptionVerification) add("benefits_sbc");
  if (benefitsPackage.hiddenBenefits.some((benefit) => benefit.status === "available_unused" || benefit.status === "unsure")) add("benefits_action_plan");
  if (verificationQuestions.length >= 3) add("benefits_blueprint");
  if (benefitsPackage.compensation.annualBonus > 0 || benefitsPackage.compensation.overtimeHoursPerWeek > 0) add("benefits_total_comp");

  return actions.slice(0, 5);
};

export const calculateBenefitsReceipt = (benefitsPackage: BenefitsPackage): BenefitsReceipt => {
  const compensationInput: CompensationInput = {
    ...benefitsPackage.compensation,
    name: safeLabel(benefitsPackage.label, "Benefits package"),
    employerRetirementPercent: 0,
    employerRetirementFixed: 0,
    employerHsaHraContribution: 0,
    additionalBenefitValue: 0,
    paidTimeOffHours: 0,
    annualEmployeeHealthPremium: 0,
    annualCommuteCost: benefitsPackage.workStructure.commuteCostAnnual,
    annualParkingAndTolls: benefitsPackage.workStructure.parkingAndTransitAnnual,
    qualityOfLife: {
      ...benefitsPackage.compensation.qualityOfLife,
      workdaysPerWeek: benefitsPackage.workStructure.workdaysPerWeek,
      commuteMinutesPerWorkday: benefitsPackage.workStructure.commuteMinutesPerWorkday,
      schedulePredictability: benefitsPackage.workStructure.schedulePredictability,
      flexibility: benefitsPackage.workStructure.flexibility,
      physicalDemand: benefitsPackage.workStructure.physicalDemand,
      careerDevelopment: benefitsPackage.workStructure.careerTrajectory,
    },
  };
  const compensation = calculateCompensation(compensationInput);
  const healthPlanScenarios = benefitsPackage.healthPlans.slice(0, MAX_HEALTH_PLANS_PER_PACKAGE).map(calculateHealthPlanScenario);
  const selectedHealthPlan = healthPlanScenarios.find((plan) => plan.planId === benefitsPackage.selectedHealthPlanId) ?? healthPlanScenarios[0];
  const retirement = calculateRetirementBenefits(benefitsPackage.retirement, compensation.baseAnnualCash);
  const hourlyEquivalent = getHourlyEquivalent(compensationInput);
  const paidLeaveEstimatedValue = hourlyEquivalent * (finiteNonNegative(benefitsPackage.paidLeave.paidTimeOffHours) + finiteNonNegative(benefitsPackage.paidLeave.paidHolidayHours));
  const paidLeaveIncludedInPackageValue = compensationInput.payType === "hourly" ? paidLeaveEstimatedValue : 0;
  const knownHiddenBenefitValue = benefitsPackage.hiddenBenefits.reduce(
    (sum, benefit) => sum + (benefit.status === "enrolled" ? finiteNonNegative(benefit.annualKnownValue) : 0),
    0,
  );
  const qualitativeBenefits = benefitsPackage.hiddenBenefits.filter((benefit) => benefit.status === "enrolled" || benefit.status === "available_unused");
  const annualEmployeeBenefitCosts =
    finiteNonNegative(selectedHealthPlan?.annualPremium ?? 0) +
    finiteNonNegative(compensationInput.annualDentalVisionPremium) +
    finiteNonNegative(benefitsPackage.workStructure.commuteCostAnnual) +
    finiteNonNegative(benefitsPackage.workStructure.parkingAndTransitAnnual);
  const employerHealthValue = finiteNonNegative(selectedHealthPlan?.employerPremiumContribution ?? 0) + finiteNonNegative(selectedHealthPlan?.employerAccountContribution ?? 0);
  const estimatedQuantifiableEmployerBenefitValue =
    retirement.totalEmployerRetirementContribution + employerHealthValue + knownHiddenBenefitValue + paidLeaveIncludedInPackageValue;
  const estimatedTotalPackageValue = compensation.annualCashCompensation + estimatedQuantifiableEmployerBenefitValue;
  const estimatedValueAfterSelectedCosts = estimatedTotalPackageValue - annualEmployeeBenefitCosts;
  const verificationQuestions = getVerificationQuestions(benefitsPackage, retirement, selectedHealthPlan);
  const recommendedActionIds = getRecommendedActionIds(benefitsPackage, retirement, selectedHealthPlan, verificationQuestions);

  let completedFields = 0;
  const totalFields = 10;
  if (compensation.baseAnnualCash > 0) completedFields += 1;
  if (benefitsPackage.compensation.scheduledHoursPerWeek > 0) completedFields += 1;
  if (selectedHealthPlan && selectedHealthPlan.annualPremium >= 0 && (benefitsPackage.healthPlans[0]?.individualOutOfPocketMax ?? 0) > 0) completedFields += 2;
  if (benefitsPackage.retirement.planType !== "unsure") completedFields += 1;
  if (benefitsPackage.retirement.trueUpStatus !== "unsure") completedFields += 1;
  if (benefitsPackage.paidLeave.paidTimeOffHours > 0 || benefitsPackage.paidLeave.paidHolidayHours > 0) completedFields += 1;
  if (benefitsPackage.paidLeave.carryoverStatus !== "not_verified") completedFields += 1;
  if (benefitsPackage.hiddenBenefits.some((benefit) => benefit.status !== "unsure")) completedFields += 1;
  if (benefitsPackage.workStructure.schedulePredictability !== "unsure") completedFields += 1;

  return {
    packageId: benefitsPackage.id,
    packageLabel: safeLabel(benefitsPackage.label, "Benefits package"),
    generatedAt: new Date().toISOString(),
    compensation,
    selectedHealthPlan,
    healthPlanScenarios,
    retirement,
    paidLeaveEstimatedValue: roundMoney(paidLeaveEstimatedValue),
    paidLeaveIncludedInPackageValue: roundMoney(paidLeaveIncludedInPackageValue),
    knownHiddenBenefitValue: roundMoney(knownHiddenBenefitValue),
    qualitativeBenefits,
    annualEmployeeBenefitCosts: roundMoney(annualEmployeeBenefitCosts),
    estimatedQuantifiableEmployerBenefitValue: roundMoney(estimatedQuantifiableEmployerBenefitValue),
    estimatedTotalPackageValue: roundMoney(estimatedTotalPackageValue),
    estimatedValueAfterSelectedCosts: roundMoney(estimatedValueAfterSelectedCosts),
    unvestedValue: retirement.unvestedEmployerRetirementValue,
    verificationQuestions,
    recommendedActionIds,
    completenessPercent: Math.round((completedFields / totalFields) * 100),
  };
};

export const compareBenefitsPackages = (packageA: BenefitsPackage, packageB: BenefitsPackage): PackageComparison => {
  const receiptA = calculateBenefitsReceipt(packageA);
  const receiptB = calculateBenefitsReceipt(packageB);
  const classifications: string[] = [];
  const cashDifference = receiptB.compensation.annualCashCompensation - receiptA.compensation.annualCashCompensation;
  const packageValueDifference = receiptB.estimatedValueAfterSelectedCosts - receiptA.estimatedValueAfterSelectedCosts;
  const retirementDifference = receiptB.retirement.totalEmployerRetirementContribution - receiptA.retirement.totalEmployerRetirementContribution;
  const moderateCostDifference = receiptA.selectedHealthPlan && receiptB.selectedHealthPlan
    ? receiptB.selectedHealthPlan.moderateUseNetAnnualCost - receiptA.selectedHealthPlan.moderateUseNetAnnualCost
    : null;
  const worstCaseDifference = receiptA.selectedHealthPlan && receiptB.selectedHealthPlan
    ? receiptB.selectedHealthPlan.highUseNetAnnualCost - receiptA.selectedHealthPlan.highUseNetAnnualCost
    : null;
  const commuteDifference = packageB.workStructure.commuteMinutesPerWorkday - packageA.workStructure.commuteMinutesPerWorkday;

  if (Math.abs(cashDifference) < Math.max(receiptA.compensation.annualCashCompensation, receiptB.compensation.annualCashCompensation, 1) * 0.03) {
    classifications.push("Expected cash compensation is relatively close.");
  } else {
    classifications.push(`${cashDifference > 0 ? receiptB.packageLabel : receiptA.packageLabel} has higher expected cash compensation.`);
  }
  if (Math.abs(retirementDifference) > 100) classifications.push(`${retirementDifference > 0 ? receiptB.packageLabel : receiptA.packageLabel} has stronger estimated employer retirement value.`);
  if (moderateCostDifference !== null && Math.abs(moderateCostDifference) > 100) classifications.push(`${moderateCostDifference < 0 ? receiptB.packageLabel : receiptA.packageLabel} has lower estimated moderate-use health cost.`);
  if (worstCaseDifference !== null && Math.abs(worstCaseDifference) > 100) classifications.push(`${worstCaseDifference < 0 ? receiptB.packageLabel : receiptA.packageLabel} has lower estimated worst-case health-plan exposure.`);
  if (Math.abs(commuteDifference) >= 10) classifications.push(`${commuteDifference < 0 ? receiptB.packageLabel : receiptA.packageLabel} has the shorter entered commute.`);

  const uncertaintyCount = receiptA.verificationQuestions.length + receiptB.verificationQuestions.length;
  return {
    packageA: receiptA,
    packageB: receiptB,
    expectedCashDifference: roundMoney(cashDifference),
    packageValueDifference: roundMoney(packageValueDifference),
    selectedHealthPlanModerateCostDifference: moderateCostDifference === null ? null : roundMoney(moderateCostDifference),
    selectedHealthPlanWorstCaseDifference: worstCaseDifference === null ? null : roundMoney(worstCaseDifference),
    employerRetirementDifference: roundMoney(retirementDifference),
    commuteMinutesDifference: roundMoney(commuteDifference),
    classifications: classifications.slice(0, 6),
    uncertaintySummary: uncertaintyCount >= 8
      ? "The comparison contains several unverified assumptions. Confirm plan documents before treating the difference as decision-ready."
      : uncertaintyCount >= 3
        ? "The comparison is useful, but several plan details still require verification."
        : "The entered packages have relatively few unresolved verification items.",
  };
};

const validModes: BenefitsWorkspaceMode[] = ["current_package", "compare_offers", "open_enrollment", "new_offer", "benefits_review"];
const validPayTypes = ["hourly", "salary"];

const normalizeHealthPlan = (value: unknown, index: number): HealthPlanOption | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<HealthPlanOption>;
  if (typeof candidate.id !== "string") return null;
  const defaults = createDefaultHealthPlan(candidate.id, safeLabel(candidate.label, `Health plan ${index + 1}`));
  return {
    ...defaults,
    ...candidate,
    id: candidate.id.slice(0, 80),
    label: safeLabel(candidate.label, defaults.label),
    employeePremiumPerPaycheck: finiteNonNegative(Number(candidate.employeePremiumPerPaycheck)),
    payPeriodsPerYear: clamp(Number(candidate.payPeriodsPerYear), 1, 52),
    annualSurcharges: finiteNonNegative(Number(candidate.annualSurcharges)),
    employerPremiumContributionAnnual: finiteNonNegative(Number(candidate.employerPremiumContributionAnnual)),
    individualDeductible: finiteNonNegative(Number(candidate.individualDeductible)),
    familyDeductible: finiteNonNegative(Number(candidate.familyDeductible)),
    coinsurancePercent: clamp(Number(candidate.coinsurancePercent), 0, 100),
    primaryCareCopay: finiteNonNegative(Number(candidate.primaryCareCopay)),
    specialistCopay: finiteNonNegative(Number(candidate.specialistCopay)),
    urgentCareCopay: finiteNonNegative(Number(candidate.urgentCareCopay)),
    emergencyRoomCopay: finiteNonNegative(Number(candidate.emergencyRoomCopay)),
    individualOutOfPocketMax: finiteNonNegative(Number(candidate.individualOutOfPocketMax)),
    familyOutOfPocketMax: finiteNonNegative(Number(candidate.familyOutOfPocketMax)),
    employerHsaHraContribution: finiteNonNegative(Number(candidate.employerHsaHraContribution)),
  };
};

const normalizePackage = (value: unknown, index: number): BenefitsPackage | null => {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<BenefitsPackage>;
  if (candidate.schemaVersion !== 1 || typeof candidate.id !== "string" || !candidate.compensation) return null;
  const payType = validPayTypes.includes(candidate.compensation.payType) ? candidate.compensation.payType : "hourly";
  const defaults = createDefaultBenefitsPackage(candidate.id, safeLabel(candidate.label, `Package ${index + 1}`), payType);
  const healthPlans = Array.isArray(candidate.healthPlans)
    ? candidate.healthPlans.slice(0, MAX_HEALTH_PLANS_PER_PACKAGE).flatMap((plan, planIndex) => {
        const normalized = normalizeHealthPlan(plan, planIndex);
        return normalized ? [normalized] : [];
      })
    : [];
  const hiddenBenefits = hiddenBenefitIds.map((id) => {
    const selected = Array.isArray(candidate.hiddenBenefits) ? candidate.hiddenBenefits.find((benefit) => benefit?.id === id) : undefined;
    return {
      id,
      status: selected && ["enrolled", "available_unused", "not_offered", "unsure"].includes(selected.status) ? selected.status : "unsure",
      annualKnownValue: finiteNonNegative(Number(selected?.annualKnownValue)),
    } as HiddenBenefitSelection;
  });

  return {
    ...defaults,
    ...candidate,
    id: candidate.id.slice(0, 80),
    label: safeLabel(candidate.label, defaults.label),
    schemaVersion: 1,
    isHealthcareWorker: Boolean(candidate.isHealthcareWorker),
    compensation: { ...defaults.compensation, ...candidate.compensation, name: safeLabel(candidate.label, defaults.label), payType },
    healthPlans: healthPlans.length ? healthPlans : [createDefaultHealthPlan()],
    selectedHealthPlanId: typeof candidate.selectedHealthPlanId === "string" ? candidate.selectedHealthPlanId : healthPlans[0]?.id,
    retirement: { ...defaults.retirement, ...(candidate.retirement ?? {}) },
    paidLeave: { ...defaults.paidLeave, ...(candidate.paidLeave ?? {}) },
    hiddenBenefits,
    workStructure: { ...defaults.workStructure, ...(candidate.workStructure ?? {}) },
    lastUpdatedAt: typeof candidate.lastUpdatedAt === "string" ? candidate.lastUpdatedAt : new Date().toISOString(),
  };
};

export const loadBenefitsWorkspace = (): BenefitsWorkspaceState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BenefitsWorkspaceState>;
    if (parsed.schemaVersion !== 1 || !validModes.includes(parsed.mode as BenefitsWorkspaceMode) || !Array.isArray(parsed.packages)) return null;
    const packages = parsed.packages.slice(0, MAX_BENEFITS_PACKAGES).flatMap((item, index) => {
      const normalized = normalizePackage(item, index);
      return normalized ? [normalized] : [];
    });
    if (!packages.length) return null;
    const activePackageId = packages.some((item) => item.id === parsed.activePackageId) ? String(parsed.activePackageId) : packages[0].id;
    const comparisonPackageIds = Array.isArray(parsed.comparisonPackageIds)
      ? parsed.comparisonPackageIds.filter((id): id is string => typeof id === "string" && packages.some((item) => item.id === id)).slice(0, 2)
      : [];
    return {
      schemaVersion: 1,
      mode: parsed.mode as BenefitsWorkspaceMode,
      packages,
      activePackageId,
      comparisonPackageIds: comparisonPackageIds.length ? comparisonPackageIds : [activePackageId],
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
};

const emitWorkspaceUpdated = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(BENEFITS_COMMAND_CENTER_UPDATED_EVENT));
};

export const saveBenefitsWorkspace = (workspace: BenefitsWorkspaceState) => {
  if (typeof window === "undefined") return workspace;
  const normalizedPackages = workspace.packages.slice(0, MAX_BENEFITS_PACKAGES).flatMap((item, index) => {
    const normalized = normalizePackage(item, index);
    return normalized ? [{ ...normalized, lastUpdatedAt: new Date().toISOString() }] : [];
  });
  if (!normalizedPackages.length) return workspace;
  const normalized: BenefitsWorkspaceState = {
    schemaVersion: 1,
    mode: validModes.includes(workspace.mode) ? workspace.mode : "current_package",
    packages: normalizedPackages,
    activePackageId: normalizedPackages.some((item) => item.id === workspace.activePackageId) ? workspace.activePackageId : normalizedPackages[0].id,
    comparisonPackageIds: workspace.comparisonPackageIds.filter((id) => normalizedPackages.some((item) => item.id === id)).slice(0, 2),
    savedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY, JSON.stringify(normalized));
  emitWorkspaceUpdated();
  return normalized;
};

export const clearBenefitsWorkspace = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(BENEFITS_COMMAND_CENTER_STORAGE_KEY);
  emitWorkspaceUpdated();
};

export const createBenefitsReceiptSummary = (receipt: BenefitsReceipt) => {
  const currency = (value: number) => Math.round(value).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const lines = [
    "CAF BENEFITS RECEIPT",
    receipt.packageLabel,
    `Generated: ${new Date(receipt.generatedAt).toLocaleDateString()}`,
    "",
    `Expected cash compensation: ${currency(receipt.compensation.annualCashCompensation)}`,
    `Quantifiable employer benefit value: ${currency(receipt.estimatedQuantifiableEmployerBenefitValue)}`,
    `Estimated total package value: ${currency(receipt.estimatedTotalPackageValue)}`,
    `Selected employee benefit and work costs: ${currency(receipt.annualEmployeeBenefitCosts)}`,
    `Estimated value after selected costs: ${currency(receipt.estimatedValueAfterSelectedCosts)}`,
    `Employer retirement contribution: ${currency(receipt.retirement.totalEmployerRetirementContribution)}`,
    `Potential uncaptured employer match: ${currency(receipt.retirement.uncapturedEmployerMatch)}`,
    `Unvested employer retirement value: ${currency(receipt.unvestedValue)}`,
  ];
  if (receipt.selectedHealthPlan) {
    lines.push(
      `Selected health plan low-use estimate: ${currency(receipt.selectedHealthPlan.lowUseNetAnnualCost)}`,
      `Selected health plan moderate-use estimate: ${currency(receipt.selectedHealthPlan.moderateUseNetAnnualCost)}`,
      `Selected health plan worst-case estimate: ${currency(receipt.selectedHealthPlan.highUseNetAnnualCost)}`,
    );
  }
  if (receipt.verificationQuestions.length) {
    lines.push("", "QUESTIONS TO VERIFY");
    receipt.verificationQuestions.forEach((question) => lines.push(`- ${question}`));
  }
  lines.push("", "Educational estimate only. Verify all material details using current plan documents, written offers, employer materials, official sources, and qualified professionals.");
  return lines.join("\n");
};
