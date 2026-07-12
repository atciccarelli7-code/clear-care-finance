import {
  calculateBenefitsReceipt,
  compareBenefitsPackages,
  createDefaultBenefitsPackage,
  createDefaultBenefitsWorkspace,
  createDefaultHealthPlan,
  saveBenefitsWorkspace,
  type BenefitsPackage,
  type BenefitsWorkspaceState,
} from "@/lib/benefitsCommandCenter";

export type BenefitsActivationPath = "start_own" | "sample_receipt" | "sample_comparison";
export type BenefitsActivationEntrySurface =
  | "command_center"
  | "homepage"
  | "start_here"
  | "tools"
  | "healthcare_workers"
  | "insurance"
  | "open_enrollment"
  | "related_tool"
  | "unknown";

export type BenefitsActivationTourStatus = "not_started" | "skipped" | "completed";

export const BENEFITS_COMMAND_CENTER_TOUR_STORAGE_KEY = "caf-benefits-command-center-tour-v1";
export const SAMPLE_HOSPITAL_RN_PACKAGE_ID = "sample-hospital-rn";
export const SAMPLE_BEDSIDE_RN_PACKAGE_ID = "sample-bedside-rn-offer";
export const SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID = "sample-clinical-specialist-offer";

const updateHiddenBenefits = (
  benefitsPackage: BenefitsPackage,
  updates: Partial<Record<BenefitsPackage["hiddenBenefits"][number]["id"], { status: BenefitsPackage["hiddenBenefits"][number]["status"]; annualKnownValue?: number }>>,
) => ({
  ...benefitsPackage,
  hiddenBenefits: benefitsPackage.hiddenBenefits.map((benefit) => {
    const update = updates[benefit.id];
    return update ? { ...benefit, status: update.status, annualKnownValue: update.annualKnownValue ?? 0 } : benefit;
  }),
});

const createSampleHospitalRnPackage = (): BenefitsPackage => {
  const base = createDefaultBenefitsPackage(SAMPLE_HOSPITAL_RN_PACKAGE_ID, "Sample Hospital RN Package", "hourly");
  const healthPlan = {
    ...createDefaultHealthPlan("sample-rn-hdhp", "Illustrative HDHP option"),
    planType: "hdhp" as const,
    employeePremiumPerPaycheck: 92,
    payPeriodsPerYear: 26,
    employerPremiumContributionAnnual: 7_600,
    individualDeductible: 2_000,
    coinsurancePercent: 20,
    primaryCareCopay: 30,
    specialistCopay: 55,
    urgentCareCopay: 65,
    emergencyRoomCopay: 250,
    individualOutOfPocketMax: 6_500,
    employerHsaHraContribution: 750,
    networkStatus: "not_verified" as const,
    prescriptionStatus: "not_verified" as const,
  };

  return updateHiddenBenefits(
    {
      ...base,
      isHealthcareWorker: true,
      compensation: {
        ...base.compensation,
        name: "Sample Hospital RN Package",
        hourlyRate: 39,
        scheduledHoursPerWeek: 36,
        weeksWorkedPerYear: 50,
        overtimeHoursPerWeek: 2,
        overtimeMultiplier: 1.5,
        differentialPerHour: 3.5,
        differentialHoursPerWeek: 24,
        annualBonus: 0,
        signOnBonusAnnualized: 1_000,
        holidayAndSpecialtyPay: 600,
        annualDentalVisionPremium: 720,
        payPeriodsPerYear: 26,
      },
      healthPlans: [healthPlan],
      selectedHealthPlanId: healthPlan.id,
      retirement: {
        ...base.retirement,
        planType: "403b",
        employeeContributionPercent: 6,
        employerMatchRatePercent: 100,
        employerMatchCapPercent: 6,
        employerNonElectivePercent: 1,
        vestingPercent: 50,
        trueUpStatus: "unsure",
        matchTiming: "per_paycheck",
        rothAvailable: true,
        traditionalAvailable: true,
      },
      paidLeave: {
        paidTimeOffHours: 144,
        paidHolidayHours: 48,
        parentalLeaveWeeks: 4,
        carryoverStatus: "not_verified",
        payoutStatus: "not_verified",
      },
      workStructure: {
        ...base.workStructure,
        commuteMinutesPerWorkday: 50,
        commuteCostAnnual: 2_200,
        parkingAndTransitAnnual: 900,
        workdaysPerWeek: 3,
        onCallRating: "neutral",
        schedulePredictability: "neutral",
        flexibility: "weak",
        physicalDemand: "weak",
        careerTrajectory: "neutral",
        scheduleImportance: "high",
        flexibilityImportance: "high",
        physicalDemandImportance: "high",
        careerTrajectoryImportance: "high",
      },
      lastUpdatedAt: "2026-07-12T00:00:00.000Z",
    },
    {
      life_insurance: { status: "enrolled", annualKnownValue: 240 },
      short_term_disability: { status: "enrolled", annualKnownValue: 300 },
      long_term_disability: { status: "enrolled", annualKnownValue: 420 },
      tuition_assistance: { status: "available_unused", annualKnownValue: 3_000 },
      certification_reimbursement: { status: "enrolled", annualKnownValue: 500 },
      dependent_care_fsa: { status: "unsure" },
      childcare_support: { status: "unsure" },
      professional_dues: { status: "available_unused", annualKnownValue: 350 },
      mental_health_support: { status: "enrolled" },
    },
  );
};

const createSampleBedsideRnPackage = (): BenefitsPackage => {
  const base = createSampleHospitalRnPackage();
  const healthPlan = {
    ...base.healthPlans[0],
    id: "sample-bedside-ppo",
    label: "Fictional bedside PPO",
    planType: "ppo" as const,
    employeePremiumPerPaycheck: 126,
    employerPremiumContributionAnnual: 8_100,
    individualDeductible: 1_250,
    coinsurancePercent: 15,
    individualOutOfPocketMax: 5_000,
    employerHsaHraContribution: 0,
    networkStatus: "verified" as const,
  };

  return {
    ...base,
    id: SAMPLE_BEDSIDE_RN_PACKAGE_ID,
    label: "Fictional Bedside RN Offer",
    compensation: {
      ...base.compensation,
      name: "Fictional Bedside RN Offer",
      hourlyRate: 41,
      overtimeHoursPerWeek: 4,
      differentialPerHour: 4,
      differentialHoursPerWeek: 24,
      signOnBonusAnnualized: 0,
      holidayAndSpecialtyPay: 900,
    },
    healthPlans: [healthPlan],
    selectedHealthPlanId: healthPlan.id,
    retirement: {
      ...base.retirement,
      employerMatchCapPercent: 6,
      employerNonElectivePercent: 1,
      vestingPercent: 100,
      trueUpStatus: "yes",
    },
    workStructure: {
      ...base.workStructure,
      commuteMinutesPerWorkday: 24,
      commuteCostAnnual: 1_300,
      parkingAndTransitAnnual: 500,
      schedulePredictability: "weak",
      flexibility: "weak",
      physicalDemand: "weak",
      careerTrajectory: "neutral",
      onCallRating: "neutral",
    },
    lastUpdatedAt: "2026-07-12T00:00:00.000Z",
  };
};

const createSampleClinicalSpecialistPackage = (): BenefitsPackage => {
  const base = createDefaultBenefitsPackage(SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID, "Fictional Clinical Specialist Offer", "salary");
  const healthPlan = {
    ...createDefaultHealthPlan("sample-specialist-hdhp", "Fictional specialist HDHP"),
    planType: "hdhp" as const,
    employeePremiumPerPaycheck: 104,
    payPeriodsPerYear: 24,
    employerPremiumContributionAnnual: 7_200,
    individualDeductible: 2_500,
    coinsurancePercent: 20,
    primaryCareCopay: 35,
    specialistCopay: 65,
    urgentCareCopay: 75,
    emergencyRoomCopay: 300,
    individualOutOfPocketMax: 6_800,
    employerHsaHraContribution: 1_000,
    networkStatus: "not_verified" as const,
    prescriptionStatus: "verified" as const,
  };

  return updateHiddenBenefits(
    {
      ...base,
      isHealthcareWorker: true,
      compensation: {
        ...base.compensation,
        name: "Fictional Clinical Specialist Offer",
        annualSalary: 88_000,
        scheduledHoursPerWeek: 42,
        weeksWorkedPerYear: 50,
        annualBonus: 8_000,
        signOnBonusAnnualized: 2_000,
        annualDentalVisionPremium: 840,
        payPeriodsPerYear: 24,
      },
      healthPlans: [healthPlan],
      selectedHealthPlanId: healthPlan.id,
      retirement: {
        ...base.retirement,
        planType: "401k",
        employeeContributionPercent: 5,
        employerMatchRatePercent: 100,
        employerMatchCapPercent: 4,
        employerNonElectivePercent: 0,
        vestingPercent: 50,
        trueUpStatus: "unsure",
        matchTiming: "annual",
        rothAvailable: true,
        traditionalAvailable: true,
      },
      paidLeave: {
        paidTimeOffHours: 160,
        paidHolidayHours: 80,
        parentalLeaveWeeks: 6,
        carryoverStatus: "verified",
        payoutStatus: "not_verified",
      },
      workStructure: {
        ...base.workStructure,
        commuteMinutesPerWorkday: 70,
        commuteCostAnnual: 3_800,
        parkingAndTransitAnnual: 0,
        workdaysPerWeek: 5,
        onCallRating: "neutral",
        schedulePredictability: "strong",
        flexibility: "neutral",
        physicalDemand: "strong",
        careerTrajectory: "strong",
        scheduleImportance: "high",
        flexibilityImportance: "high",
        physicalDemandImportance: "high",
        careerTrajectoryImportance: "essential",
      },
      lastUpdatedAt: "2026-07-12T00:00:00.000Z",
    },
    {
      life_insurance: { status: "enrolled", annualKnownValue: 260 },
      short_term_disability: { status: "enrolled", annualKnownValue: 320 },
      long_term_disability: { status: "enrolled", annualKnownValue: 500 },
      tuition_assistance: { status: "not_offered" },
      certification_reimbursement: { status: "enrolled", annualKnownValue: 1_200 },
      commuter_benefit: { status: "enrolled", annualKnownValue: 1_000 },
      professional_dues: { status: "enrolled", annualKnownValue: 650 },
      parental_leave: { status: "enrolled" },
      mental_health_support: { status: "enrolled" },
    },
  );
};

export const createSampleReceiptWorkspace = (): BenefitsWorkspaceState => {
  const sample = createSampleHospitalRnPackage();
  return {
    schemaVersion: 1,
    mode: "current_package",
    packages: [sample],
    activePackageId: sample.id,
    comparisonPackageIds: [sample.id],
    savedAt: "2026-07-12T00:00:00.000Z",
  };
};

export const createSampleComparisonWorkspace = (): BenefitsWorkspaceState => {
  const bedside = createSampleBedsideRnPackage();
  const specialist = createSampleClinicalSpecialistPackage();
  return {
    schemaVersion: 1,
    mode: "compare_offers",
    packages: [bedside, specialist],
    activePackageId: bedside.id,
    comparisonPackageIds: [bedside.id, specialist.id],
    savedAt: "2026-07-12T00:00:00.000Z",
  };
};

export const getSampleBenefitsReceipt = () => calculateBenefitsReceipt(createSampleHospitalRnPackage());
export const getSampleBenefitsComparison = () => compareBenefitsPackages(createSampleBedsideRnPackage(), createSampleClinicalSpecialistPackage());

export const isSampleBenefitsPackage = (benefitsPackage: BenefitsPackage) =>
  [SAMPLE_HOSPITAL_RN_PACKAGE_ID, SAMPLE_BEDSIDE_RN_PACKAGE_ID, SAMPLE_CLINICAL_SPECIALIST_PACKAGE_ID].includes(benefitsPackage.id);

export const isBenefitsWorkspacePristine = (workspace: BenefitsWorkspaceState | null) => {
  if (!workspace || workspace.packages.length !== 1) return !workspace;
  const benefitsPackage = workspace.packages[0];
  const compensation = benefitsPackage.compensation;
  const healthPlan = benefitsPackage.healthPlans[0];
  return (
    !isSampleBenefitsPackage(benefitsPackage) &&
    compensation.hourlyRate === 0 &&
    compensation.annualSalary === 0 &&
    compensation.annualBonus === 0 &&
    compensation.overtimeHoursPerWeek === 0 &&
    healthPlan?.employeePremiumPerPaycheck === 0 &&
    benefitsPackage.retirement.employeeContributionPercent === 0 &&
    benefitsPackage.paidLeave.paidTimeOffHours === 0 &&
    benefitsPackage.hiddenBenefits.every((benefit) => benefit.status === "unsure")
  );
};

export const activateSampleWorkspace = (path: Exclude<BenefitsActivationPath, "start_own">) => {
  const workspace = path === "sample_comparison" ? createSampleComparisonWorkspace() : createSampleReceiptWorkspace();
  return saveBenefitsWorkspace(workspace);
};

export const createFreshUserWorkspace = () => saveBenefitsWorkspace(createDefaultBenefitsWorkspace());

export const readBenefitsTourStatus = (): BenefitsActivationTourStatus => {
  if (typeof window === "undefined") return "not_started";
  const value = window.localStorage.getItem(BENEFITS_COMMAND_CENTER_TOUR_STORAGE_KEY);
  return value === "skipped" || value === "completed" ? value : "not_started";
};

export const saveBenefitsTourStatus = (status: Exclude<BenefitsActivationTourStatus, "not_started">) => {
  if (typeof window !== "undefined") window.localStorage.setItem(BENEFITS_COMMAND_CENTER_TOUR_STORAGE_KEY, status);
  return status;
};

export const buildBenefitsActivationEventProperties = ({
  entrySurface,
  activationPath,
  moduleId,
  packageCount,
  completionBand,
}: {
  entrySurface: BenefitsActivationEntrySurface;
  activationPath?: BenefitsActivationPath;
  moduleId?: "activation" | "tour" | "receipt" | "comparison" | "workspace";
  packageCount?: 0 | 1 | 2 | 3;
  completionBand?: "0_25" | "26_50" | "51_75" | "76_100";
}) => ({
  event_category: "tools",
  tool_id: "benefits_command_center",
  entry_surface: entrySurface,
  ...(activationPath ? { activation_path: activationPath } : {}),
  ...(moduleId ? { module_id: moduleId } : {}),
  ...(packageCount === undefined ? {} : { package_count: packageCount }),
  ...(completionBand ? { completion_band: completionBand } : {}),
});
