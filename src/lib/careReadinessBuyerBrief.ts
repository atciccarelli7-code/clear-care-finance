export const buyerOrganizationTypes = [
  { id: "hospital_health_system", label: "Hospital or health system" },
  { id: "academic_medical_center", label: "Academic medical center" },
  { id: "community_hospital", label: "Community hospital" },
  { id: "other_care_organization", label: "Other care organization" },
] as const;

export const buyerRoles = [
  { id: "nursing_operations", label: "Nursing leadership or operations" },
  { id: "pharmacy_anticoagulation", label: "Pharmacy or anticoagulation service" },
  { id: "patient_education", label: "Patient education or health literacy" },
  { id: "quality_safety", label: "Quality, safety, or readmissions" },
  { id: "case_management", label: "Case management or transitions of care" },
  { id: "innovation_procurement", label: "Innovation, digital health, or procurement" },
] as const;

export const buyerPilotSettings = [
  { id: "acute_inpatient_unit", label: "One acute-care inpatient unit" },
  { id: "observation_unit", label: "One observation unit" },
  { id: "ed_to_inpatient", label: "ED-to-inpatient education handoff" },
  { id: "setting_not_selected", label: "Setting is not selected yet" },
] as const;

export const buyerPriorities = [
  { id: "medication_match", label: "Correct medication and regimen matching" },
  { id: "comprehension", label: "Patient or caregiver comprehension" },
  { id: "pharmacy_access", label: "Pharmacy, affordability, or authorization continuity" },
  { id: "caregiver_support", label: "Caregiver readiness and support" },
  { id: "follow_up_continuity", label: "Monitoring, follow-up, and after-hours ownership" },
  { id: "workflow_consistency", label: "Consistent nursing discharge workflow" },
] as const;

export const buyerReviewStages = [
  { id: "exploratory", label: "Exploratory problem review" },
  { id: "workflow_review", label: "Cross-functional workflow review" },
  { id: "design_partner", label: "Potential design-partner evaluation" },
  { id: "procurement", label: "Procurement or formal pilot planning" },
] as const;

export const buyerOwnerCoverage = [
  { id: "no_owner", label: "No accountable owner identified" },
  { id: "single_owner", label: "One interested owner identified" },
  { id: "nursing_pharmacy", label: "Nursing and pharmacy owners identified" },
  { id: "cross_functional", label: "Cross-functional sponsor and review team identified" },
] as const;

export const buyerPrivacyBoundaries = [
  { id: "confirmed", label: "Confirmed: no PHI, patient records, case narratives, or confidential files" },
] as const;

export type BuyerOrganizationTypeId = (typeof buyerOrganizationTypes)[number]["id"];
export type BuyerRoleId = (typeof buyerRoles)[number]["id"];
export type BuyerPilotSettingId = (typeof buyerPilotSettings)[number]["id"];
export type BuyerPriorityId = (typeof buyerPriorities)[number]["id"];
export type BuyerReviewStageId = (typeof buyerReviewStages)[number]["id"];
export type BuyerOwnerCoverageId = (typeof buyerOwnerCoverage)[number]["id"];
export type BuyerPrivacyBoundaryId = (typeof buyerPrivacyBoundaries)[number]["id"];

export type CareReadinessBuyerBriefInput = {
  organizationType: BuyerOrganizationTypeId;
  role: BuyerRoleId;
  pilotSetting: BuyerPilotSettingId;
  priority: BuyerPriorityId;
  reviewStage: BuyerReviewStageId;
  ownerCoverage: BuyerOwnerCoverageId;
  privacyBoundary: BuyerPrivacyBoundaryId;
};

export type CareReadinessBuyerBriefPlan = {
  status: "discovery_only" | "controlled_review_ready" | "design_partner_path";
  label: string;
  summary: string;
  nextStep: string;
  requiredAttendees: string[];
  prerequisites: string[];
  stopConditions: string[];
  boundaries: string[];
};

const labelFor = <T extends string>(options: readonly { id: T; label: string }[], id: T) =>
  options.find((option) => option.id === id)?.label ?? id;

export const buildCareReadinessBuyerBrief = (input: CareReadinessBuyerBriefInput): CareReadinessBuyerBriefPlan => {
  const hasClinicalPair = input.ownerCoverage === "nursing_pharmacy" || input.ownerCoverage === "cross_functional";
  const hasFullTeam = input.ownerCoverage === "cross_functional";
  const seeksDesignPartner = input.reviewStage === "design_partner" || input.reviewStage === "procurement";

  const status: CareReadinessBuyerBriefPlan["status"] = hasFullTeam && seeksDesignPartner
    ? "design_partner_path"
    : hasClinicalPair
      ? "controlled_review_ready"
      : "discovery_only";

  const label = status === "design_partner_path"
    ? "Design-partner pathway can be evaluated"
    : status === "controlled_review_ready"
      ? "Controlled review is ready for cross-functional scoping"
      : "Discovery can begin, but pilot planning is premature";

  const nextStep = status === "design_partner_path"
    ? "Schedule a bounded 45-minute workflow and governance review, then document the exact approval path, pilot unit, evidence requirements, legal review, and stop conditions."
    : status === "controlled_review_ready"
      ? "Hold a controlled workflow review with nursing, pharmacy, patient education, quality, and an operational sponsor before discussing design-partner terms."
      : "Identify an accountable sponsor plus nursing and pharmacy owners before advancing beyond problem discovery.";

  const requiredAttendees = [
    "Accountable operational or service-line sponsor",
    "Nursing or discharge-workflow owner",
    "Pharmacy or anticoagulation owner",
    "Patient education or health-literacy owner",
    "Quality, safety, or measurement owner",
    ...(seeksDesignPartner ? ["Legal, privacy, security, or procurement representative"] : []),
  ];

  return {
    status,
    label,
    summary: `${labelFor(buyerReviewStages, input.reviewStage)} for a ${labelFor(buyerPilotSettings, input.pilotSetting).toLowerCase()}, led by ${labelFor(buyerRoles, input.role).toLowerCase()}, with ${labelFor(buyerPriorities, input.priority).toLowerCase()} as the first decision problem.`,
    nextStep,
    requiredAttendees,
    prerequisites: [
      "A named hospital owner for patient-specific orders, medication reconciliation, local clinical language, and emergency response",
      "A no-PHI review design unless a separately approved secure architecture and agreement exist",
      "Qualified clinical, RN, health-literacy, accessibility, patient-testing, legal, insurance, and institutional release gates",
      "One bounded setting, population, workflow, measurement question, and stop rule",
    ],
    stopConditions: [
      "No accountable clinical or operational owner",
      "Request to distribute medication instructions before exact-version review and hospital approval",
      "Need to send patient records, case narratives, medication orders, or other PHI through the public site",
      "No pharmacy, after-hours, monitoring, correction, or recall owner",
      "Expectation of guaranteed reductions in readmissions, adverse events, costs, or emergency use",
    ],
    boundaries: [
      "This fixed-choice brief is not saved, placed in the URL, or sent as answer-level analytics.",
      "It does not authorize clinical use, patient use, discharge, procurement, or a hospital pilot.",
      "CAF does not select the patient, prescribe, reconcile orders, or provide emergency care.",
      "The hospital controls patient-specific personalization, local approval, distribution, documentation, and clinical response.",
    ],
  };
};

export const careReadinessBuyerBriefToText = (input: CareReadinessBuyerBriefInput, plan: CareReadinessBuyerBriefPlan) => [
  "CAF BLOOD THINNER CARE READINESS - CONTROLLED BUYER REVIEW BRIEF",
  "",
  `Organization type: ${labelFor(buyerOrganizationTypes, input.organizationType)}`,
  `Stakeholder role: ${labelFor(buyerRoles, input.role)}`,
  `First setting: ${labelFor(buyerPilotSettings, input.pilotSetting)}`,
  `Primary problem: ${labelFor(buyerPriorities, input.priority)}`,
  `Review stage: ${labelFor(buyerReviewStages, input.reviewStage)}`,
  `Internal owner coverage: ${labelFor(buyerOwnerCoverage, input.ownerCoverage)}`,
  `Privacy boundary: ${labelFor(buyerPrivacyBoundaries, input.privacyBoundary)}`,
  "",
  `STATUS: ${plan.label}`,
  plan.summary,
  "",
  "RECOMMENDED NEXT STEP",
  plan.nextStep,
  "",
  "REQUIRED ATTENDEES",
  ...plan.requiredAttendees.map((item) => `- ${item}`),
  "",
  "PREREQUISITES",
  ...plan.prerequisites.map((item) => `- ${item}`),
  "",
  "STOP CONDITIONS",
  ...plan.stopConditions.map((item) => `- ${item}`),
  "",
  "PRIVACY, CLINICAL, AND COMMERCIAL BOUNDARIES",
  ...plan.boundaries.map((item) => `- ${item}`),
  "",
  "Evaluation copy. Clinical review required. Not approved for patient use. This nonbinding brief does not authorize a pilot or create a commercial agreement.",
].join("\n");
