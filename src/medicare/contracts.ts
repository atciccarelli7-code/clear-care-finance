import { z } from "zod";

export const MEDICARE_PRODUCT_KEY = "medicare-coverage-decision-system" as const;

export const medicareStageIds = [
  "situation-timing",
  "coverage-architecture",
  "providers-geography",
  "prescriptions-pharmacy",
  "cost-exposure",
  "managed-care",
  "candidate-verification",
  "decision-brief",
] as const;

export type MedicareStageId = (typeof medicareStageIds)[number];

const yesNoUnsureSchema = z.enum(["yes", "no", "unsure"]);
const importanceSchema = z.enum(["low", "medium", "high", "unsure"]);
const verificationStatusSchema = z.enum(["confirmed", "not-confirmed", "not-applicable", "changed-next-year", "source-needed"]);
const evidenceSourceSchema = z.enum([
  "not-recorded",
  "medicare-plan-finder",
  "summary-of-benefits",
  "evidence-of-coverage",
  "annual-notice-of-change",
  "formulary",
  "provider-directory",
  "insurer-confirmation",
  "provider-confirmation",
  "ship-counseling",
  "other-official",
]);
const moneySchema = z.number().finite().min(0).max(1_000_000).nullable();

export const medicareSituationSchema = z.object({
  context: z.enum(["turning-65", "retiring-after-65", "already-enrolled", "annual-review", "caregiver", "unsure"]),
  alreadyEnrolled: yesNoUnsureSchema,
  activeEmployment: yesNoUnsureSchema,
  coverageSource: z.enum(["active-employer", "spouse-employer", "cobra", "retiree", "marketplace", "medicaid", "va-tricare", "none", "other", "unsure"]),
  employerSize: z.enum(["under-20", "20-plus", "not-applicable", "unsure"]),
  coverageEndingSoon: yesNoUnsureSchema,
  hsaContributions: yesNoUnsureSchema,
  creditableDrugCoverage: z.enum(["yes", "no", "none", "unsure"]),
  limitedIncomeHelp: yesNoUnsureSchema,
  currentArchitecture: z.enum(["original", "original-with-supplement", "medicare-advantage", "not-enrolled", "unsure"]),
  coverageChangeInterest: z.enum(["stay-review", "consider-original", "consider-advantage", "not-applicable", "unsure"]).default("unsure"),
  stateCode: z.string().regex(/^$|^[A-Z]{2}$/),
});

export const medicarePrioritiesSchema = z.object({
  providerFreedom: importanceSchema,
  specialistAccess: importanceSchema,
  travelFlexibility: importanceSchema,
  predictableCosts: importanceSchema,
  lowerFixedPremium: importanceSchema,
  integratedBenefits: importanceSchema,
  networkTolerance: z.enum(["low", "medium", "high", "unsure"]),
  referralTolerance: z.enum(["low", "medium", "high", "unsure"]),
  priorAuthorizationTolerance: z.enum(["low", "medium", "high", "unsure"]),
});

export const medicareProviderNeedsSchema = z.object({
  keepPrimaryDoctor: importanceSchema,
  keepSpecialists: importanceSchema,
  keepHospitalSystem: importanceSchema,
  regularTravel: yesNoUnsureSchema,
  splitResidence: yesNoUnsureSchema,
  routineCareAway: yesNoUnsureSchema,
  directoryChecked: yesNoUnsureSchema,
  providerConfirmed: yesNoUnsureSchema,
});

export const medicarePrescriptionNeedsSchema = z.object({
  recurringPrescriptions: yesNoUnsureSchema,
  costConcern: importanceSchema,
  specialtyMedication: yesNoUnsureSchema,
  pharmacyImportant: yesNoUnsureSchema,
  mailOrderAcceptable: yesNoUnsureSchema,
  planFinderComplete: yesNoUnsureSchema,
  formularyChecked: yesNoUnsureSchema,
  tierChecked: yesNoUnsureSchema,
  restrictionsChecked: yesNoUnsureSchema,
  pharmacyChecked: yesNoUnsureSchema,
  annualEstimateReviewed: yesNoUnsureSchema,
});

export const medicareCostScenarioSchema = z.object({
  partBMonthlyPremium: moneySchema,
  additionalMonthlyPremium: moneySchema,
  partDMonthlyPremium: moneySchema,
  medigapMonthlyPremium: moneySchema,
  medicalDeductible: moneySchema,
  drugDeductible: moneySchema,
  primaryCareCopay: moneySchema,
  specialistCopay: moneySchema,
  inpatientCostSharing: moneySchema,
  outpatientCostSharing: moneySchema,
  expectedMedicalCostSharing: moneySchema,
  expectedAnnualDrugCost: moneySchema,
  medicalMaximumOutOfPocket: moneySchema,
  otherAnnualVerifiedCost: moneySchema,
});

export const medicareCandidateSchema = z.object({
  id: z.enum(["candidate-1", "candidate-2", "candidate-3"]),
  label: z.enum(["Candidate 1", "Candidate 2", "Candidate 3"]),
  planYear: z.number().int().min(2026).max(2028),
  structure: z.enum(["original", "original-with-part-d", "original-with-medigap", "medicare-advantage-hmo", "medicare-advantage-ppo", "medicare-advantage-hmo-pos", "other", "unsure"]),
  cost: medicareCostScenarioSchema,
  verification: z.record(z.string().regex(/^[a-z][a-z0-9-]{1,63}$/), verificationStatusSchema),
  evidenceSources: z.record(z.string().regex(/^[a-z][a-z0-9-]{1,63}$/), evidenceSourceSchema).default({}),
  evidenceDates: z.record(z.string().regex(/^[a-z][a-z0-9-]{1,63}$/), z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/)).default({}),
});

export type MedicareCandidate = z.infer<typeof medicareCandidateSchema>;
export type MedicareVerificationStatus = z.infer<typeof verificationStatusSchema>;
export type MedicareEvidenceSource = z.infer<typeof evidenceSourceSchema>;

export const medicareCoverageStateSchema = z.object({
  version: z.literal(1),
  activeStage: z.enum(medicareStageIds),
  completedStages: z.array(z.enum(medicareStageIds)).max(medicareStageIds.length),
  situation: medicareSituationSchema,
  priorities: medicarePrioritiesSchema,
  providers: medicareProviderNeedsSchema,
  prescriptions: medicarePrescriptionNeedsSchema,
  managedCare: z.object({
    referralsReviewed: yesNoUnsureSchema,
    priorAuthorizationReviewed: yesNoUnsureSchema,
    stepTherapyReviewed: yesNoUnsureSchema,
    postAcuteReviewed: yesNoUnsureSchema,
    emergencyTravelReviewed: yesNoUnsureSchema,
    extraBenefitsReviewedLast: yesNoUnsureSchema,
  }),
  candidates: z.array(medicareCandidateSchema).max(3),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type MedicareCoverageState = z.infer<typeof medicareCoverageStateSchema>;

const emptyCost = () => ({
  partBMonthlyPremium: null,
  additionalMonthlyPremium: null,
  partDMonthlyPremium: null,
  medigapMonthlyPremium: null,
  medicalDeductible: null,
  drugDeductible: null,
  primaryCareCopay: null,
  specialistCopay: null,
  inpatientCostSharing: null,
  outpatientCostSharing: null,
  expectedMedicalCostSharing: null,
  expectedAnnualDrugCost: null,
  medicalMaximumOutOfPocket: null,
  otherAnnualVerifiedCost: null,
});

export const emptyMedicareCoverageState = (): MedicareCoverageState => ({
  version: 1,
  activeStage: "situation-timing",
  completedStages: [],
  situation: {
    context: "unsure",
    alreadyEnrolled: "unsure",
    activeEmployment: "unsure",
    coverageSource: "unsure",
    employerSize: "unsure",
    coverageEndingSoon: "unsure",
    hsaContributions: "unsure",
    creditableDrugCoverage: "unsure",
    limitedIncomeHelp: "unsure",
    currentArchitecture: "unsure",
    coverageChangeInterest: "unsure",
    stateCode: "",
  },
  priorities: {
    providerFreedom: "unsure",
    specialistAccess: "unsure",
    travelFlexibility: "unsure",
    predictableCosts: "unsure",
    lowerFixedPremium: "unsure",
    integratedBenefits: "unsure",
    networkTolerance: "unsure",
    referralTolerance: "unsure",
    priorAuthorizationTolerance: "unsure",
  },
  providers: {
    keepPrimaryDoctor: "unsure",
    keepSpecialists: "unsure",
    keepHospitalSystem: "unsure",
    regularTravel: "unsure",
    splitResidence: "unsure",
    routineCareAway: "unsure",
    directoryChecked: "unsure",
    providerConfirmed: "unsure",
  },
  prescriptions: {
    recurringPrescriptions: "unsure",
    costConcern: "unsure",
    specialtyMedication: "unsure",
    pharmacyImportant: "unsure",
    mailOrderAcceptable: "unsure",
    planFinderComplete: "unsure",
    formularyChecked: "unsure",
    tierChecked: "unsure",
    restrictionsChecked: "unsure",
    pharmacyChecked: "unsure",
    annualEstimateReviewed: "unsure",
  },
  managedCare: {
    referralsReviewed: "unsure",
    priorAuthorizationReviewed: "unsure",
    stepTherapyReviewed: "unsure",
    postAcuteReviewed: "unsure",
    emergencyTravelReviewed: "unsure",
    extraBenefitsReviewedLast: "unsure",
  },
  candidates: [
    { id: "candidate-1", label: "Candidate 1", planYear: 2026, structure: "unsure", cost: emptyCost(), verification: {}, evidenceSources: {}, evidenceDates: {} },
    { id: "candidate-2", label: "Candidate 2", planYear: 2026, structure: "unsure", cost: emptyCost(), verification: {}, evidenceSources: {}, evidenceDates: {} },
  ],
});

export const medicareWorkspaceRecordSchema = z.object({
  id: z.string().uuid(),
  productKey: z.literal(MEDICARE_PRODUCT_KEY),
  title: z.string().min(1).max(120),
  status: z.enum(["active", "completed", "archived"]),
  progressPercent: z.number().min(0).max(100),
  state: medicareCoverageStateSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type MedicareWorkspaceRecord = z.infer<typeof medicareWorkspaceRecordSchema>;
