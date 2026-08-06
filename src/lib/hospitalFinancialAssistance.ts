import type { HospitalFinancialAssistancePolicy } from "@/data/hospitalFinancialAssistancePolicies";

export type HospitalAssistanceInsuranceStatus = "insured" | "uninsured" | "unknown";
export type HospitalBillStage = "expected" | "received" | "overdue" | "collections" | "unknown";
export type IncomeBandId =
  | "0_100"
  | "100_138"
  | "138_175"
  | "175_200"
  | "200_250"
  | "250_300"
  | "300_400"
  | "400_600"
  | "over_600"
  | "unknown";

export type HospitalAssistanceResultStatus =
  | "free_range"
  | "discounted_range"
  | "hardship_review"
  | "verify_policy"
  | "insufficient_information";

export type HospitalAssistanceAnswers = {
  stateCode: string;
  policySlug: string;
  householdSize: number | null;
  incomeBand: IncomeBandId;
  insuranceStatus: HospitalAssistanceInsuranceStatus;
  billStage: HospitalBillStage;
  serviceMonth: string;
};

export type IncomeBand = {
  id: IncomeBandId;
  label: string;
  lowerPercent: number | null;
  upperPercent: number | null;
};

export type HospitalAssistanceScreeningResult = {
  status: HospitalAssistanceResultStatus;
  heading: string;
  summary: string;
  policyFinding: string;
  enteredFacts: string[];
  nextActions: string[];
  documents: string[];
  questions: string[];
  missingInformation: string[];
  verificationItems: string[];
  warnings: string[];
  povertyGuidelineAmount: number | null;
  estimatedIncomeRange: { lower: number | null; upper: number | null } | null;
  policyStale: boolean;
};

export const HHS_2026_POVERTY_GUIDELINES = {
  year: 2026,
  effectiveDate: "2026-01-01",
  retrievedAt: "2026-08-06",
  sourceUrl: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  regions: {
    contiguous: { onePerson: 15_960, eachAdditional: 5_680 },
    alaska: { onePerson: 19_950, eachAdditional: 7_100 },
    hawaii: { onePerson: 18_360, eachAdditional: 6_530 },
  },
} as const;

export const INCOME_BANDS: IncomeBand[] = [
  { id: "0_100", label: "At or below 100% of the poverty guideline", lowerPercent: 0, upperPercent: 100 },
  { id: "100_138", label: "Above 100% through 138%", lowerPercent: 100, upperPercent: 138 },
  { id: "138_175", label: "Above 138% through 175%", lowerPercent: 138, upperPercent: 175 },
  { id: "175_200", label: "Above 175% through 200%", lowerPercent: 175, upperPercent: 200 },
  { id: "200_250", label: "Above 200% through 250%", lowerPercent: 200, upperPercent: 250 },
  { id: "250_300", label: "Above 250% through 300%", lowerPercent: 250, upperPercent: 300 },
  { id: "300_400", label: "Above 300% through 400%", lowerPercent: 300, upperPercent: 400 },
  { id: "400_600", label: "Above 400% through 600%", lowerPercent: 400, upperPercent: 600 },
  { id: "over_600", label: "Above 600%", lowerPercent: 600, upperPercent: null },
  { id: "unknown", label: "I don't know", lowerPercent: null, upperPercent: null },
];

export const DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS: HospitalAssistanceAnswers = {
  stateCode: "",
  policySlug: "",
  householdSize: null,
  incomeBand: "unknown",
  insuranceStatus: "unknown",
  billStage: "unknown",
  serviceMonth: "",
};

const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
}).format(value);

const unique = (items: string[]) => [...new Set(items)];

export const povertyGuidelineForHousehold = (householdSize: number, stateCode: string) => {
  const size = Math.max(1, Math.floor(householdSize));
  const region = stateCode === "AK"
    ? HHS_2026_POVERTY_GUIDELINES.regions.alaska
    : stateCode === "HI"
      ? HHS_2026_POVERTY_GUIDELINES.regions.hawaii
      : HHS_2026_POVERTY_GUIDELINES.regions.contiguous;
  return region.onePerson + (size - 1) * region.eachAdditional;
};

export const incomeBandDollarRange = (bandId: IncomeBandId, householdSize: number, stateCode: string) => {
  const band = INCOME_BANDS.find((candidate) => candidate.id === bandId);
  if (!band || band.lowerPercent === null) return null;
  const guideline = povertyGuidelineForHousehold(householdSize, stateCode);
  return {
    lower: Math.round(guideline * band.lowerPercent / 100),
    upper: band.upperPercent === null ? null : Math.round(guideline * band.upperPercent / 100),
  };
};

export const incomeBandOptionLabel = (band: IncomeBand, householdSize: number | null, stateCode: string) => {
  if (!householdSize || band.lowerPercent === null) return band.label;
  const range = incomeBandDollarRange(band.id, householdSize, stateCode);
  if (!range) return band.label;
  if (range.upper === null) return `More than ${formatCurrency(range.lower)} (${band.label.toLowerCase()})`;
  if (band.lowerPercent === 0) return `Up to ${formatCurrency(range.upper)} (${band.label.toLowerCase()})`;
  return `More than ${formatCurrency(range.lower)} through ${formatCurrency(range.upper)}`;
};

export const isHospitalPolicyStale = (
  policy: HospitalFinancialAssistancePolicy,
  asOf = new Date(),
) => {
  const retrieved = new Date(`${policy.sourceRetrievedAt}T00:00:00Z`);
  if (Number.isNaN(retrieved.getTime())) return true;
  return asOf.getTime() - retrieved.getTime() > 370 * 24 * 60 * 60 * 1000;
};

const thresholdFor = (
  policy: HospitalFinancialAssistancePolicy,
  insuranceStatus: HospitalAssistanceInsuranceStatus,
  type: "free" | "discounted",
) => {
  if (insuranceStatus === "unknown") return null;
  const threshold = type === "free" ? policy.freeCareThresholdFpl : policy.discountedCareThresholdFpl;
  return insuranceStatus === "insured" ? threshold.insured : threshold.uninsured;
};

const stageActions = (stage: HospitalBillStage) => {
  if (stage === "expected") return [
    "Ask for the written policy, application, estimate, and provider list before agreeing to a deposit or payment plan.",
    "Verify which hospital, facility, and separately billing clinicians are expected to issue charges.",
  ];
  if (stage === "received") return [
    "Compare the hospital bill with the processed EOB or Medicare Summary Notice before treating the balance as final.",
    "Request an itemized bill and ask for an account hold while a complete application is reviewed.",
  ];
  if (stage === "overdue") return [
    "Call promptly, request the application, and ask in writing whether billing or collection activity can pause during review.",
    "Keep every deadline, confirmation number, submission receipt, and written response.",
  ];
  if (stage === "collections") return [
    "Tell both the hospital and collector that you are seeking financial-assistance review and ask what can be paused while the application is pending.",
    "Do not ignore a lawsuit, appeal, validation, or payment deadline; financial-assistance review does not automatically stop every collection step.",
  ];
  return ["Confirm whether the balance is expected, current, overdue, or with a collector before choosing the next step."];
};

export const buildHospitalAssistanceResult = (
  answers: HospitalAssistanceAnswers,
  policy: HospitalFinancialAssistancePolicy | null,
  asOf?: Date,
): HospitalAssistanceScreeningResult => {
  const missingInformation: string[] = [];
  const verificationItems: string[] = [];
  const warnings: string[] = [];
  const enteredFacts: string[] = [];
  const nextActions = stageActions(answers.billStage);
  const questions = [
    "Does this policy apply to the exact facility, date of service, and type of care?",
    "Which facility and professional bills are included, and which providers bill separately?",
    "What household definition, income period, assets, residency, and insurance rules apply?",
    "Which documents are required, how should they be submitted securely, and when is the application complete?",
    "Will billing or collection activity pause during review, and how can a denial be appealed?",
  ];

  if (answers.stateCode) enteredFacts.push(`State: ${answers.stateCode}`);
  else missingInformation.push("State");
  if (policy) enteredFacts.push(`Hospital or health system: ${policy.name}`);
  else missingInformation.push("A supported hospital or health system");
  if (answers.householdSize) enteredFacts.push(`Household size used for screening: ${answers.householdSize}`);
  else missingInformation.push("Household size");
  if (answers.incomeBand !== "unknown") {
    const band = INCOME_BANDS.find((candidate) => candidate.id === answers.incomeBand);
    if (band) enteredFacts.push(`Approximate income range: ${band.label}`);
  } else missingInformation.push("Approximate household-income range");
  enteredFacts.push(`Insurance status: ${answers.insuranceStatus === "unknown" ? "Not known" : answers.insuranceStatus}`);
  enteredFacts.push(`Bill stage: ${answers.billStage === "unknown" ? "Not known" : answers.billStage}`);
  if (answers.serviceMonth) enteredFacts.push(`Approximate service month: ${answers.serviceMonth}`);
  else verificationItems.push("Confirm the date of service and the date of the first post-discharge bill.");

  if (!policy) {
    return {
      status: "insufficient_information",
      heading: "Use the national action plan and verify the hospital's policy directly.",
      summary: "The selected hospital is not in this verified launch set. No eligibility terms have been inferred.",
      policyFinding: "Insufficient published information is available in this finder for the selected hospital.",
      enteredFacts,
      nextActions: unique(["Search the hospital's official website for “financial assistance,” “charity care,” or “patient financial services.”", ...nextActions]),
      documents: ["Hospital or facility bill", "Processed EOB or Medicare Summary Notice", "Written hospital policy, application, and provider list", "Only the household and income documents required by that policy"],
      questions,
      missingInformation: unique(missingInformation),
      verificationItems: unique(["Verify the official policy URL, effective date, application, phone, deadline, and provider list.", ...verificationItems]),
      warnings: ["Do not rely on a third-party summary as the controlling policy.", "The hospital must make the final eligibility determination."],
      povertyGuidelineAmount: answers.householdSize ? povertyGuidelineForHousehold(answers.householdSize, answers.stateCode) : null,
      estimatedIncomeRange: answers.householdSize ? incomeBandDollarRange(answers.incomeBand, answers.householdSize, answers.stateCode) : null,
      policyStale: false,
    };
  }

  const policyStale = isHospitalPolicyStale(policy, asOf);
  const northCarolinaStateFloorApplies = policy.stateCode === "NC";
  if (policyStale) warnings.push("This policy source may be stale. Verify every term and date directly with the hospital before relying on it.");
  if (policy.reviewStatus === "direct_verification_required") verificationItems.push("The policy record is source-linked but one or more material thresholds require direct verification.");
  if (answers.insuranceStatus === "unknown") missingInformation.push("Whether the patient is insured or uninsured");
  if (answers.billStage === "unknown") missingInformation.push("Current bill or collection stage");
  if (policy.applicationDeadline === null) verificationItems.push("The public source did not establish one universal application deadline; ask for the deadline and lookback period in writing.");
  if (policy.providersExcluded.length) warnings.push("This provider may bill separately. Verify every facility, clinician, laboratory, imaging, anesthesia, ambulance, and other bill against the provider list.");
  if (northCarolinaStateFloorApplies) {
    verificationItems.push("North Carolina's participating acute-care hospitals committed to a 100% discount below 200% FPG and income-based discounts of 50–100% through 300% FPG for insured and uninsured North Carolina residents. Verify the exact discount, bill, and facility under the current NCDHHS program and hospital policy.");
  }

  const documents = unique([
    "The hospital or facility bill and every separately issued bill from the same visit",
    "The matching processed EOB or Medicare Summary Notice, when insurance is involved",
    "The current written policy, plain-language summary, application, and provider list",
    ...policy.requiredDocumentation,
    "Submission receipt, call log, reference numbers, and written decisions",
  ]);

  const policyFreeThreshold = thresholdFor(policy, answers.insuranceStatus, "free");
  const policyDiscountedThreshold = thresholdFor(policy, answers.insuranceStatus, "discounted");
  const freeThreshold = northCarolinaStateFloorApplies
    ? Math.max(policyFreeThreshold ?? 0, 200)
    : policyFreeThreshold;
  const discountedThreshold = northCarolinaStateFloorApplies
    ? Math.max(policyDiscountedThreshold ?? 0, 300)
    : policyDiscountedThreshold;
  const band = INCOME_BANDS.find((candidate) => candidate.id === answers.incomeBand) ?? INCOME_BANDS[INCOME_BANDS.length - 1];
  const guideline = answers.householdSize ? povertyGuidelineForHousehold(answers.householdSize, answers.stateCode) : null;
  const estimatedIncomeRange = answers.householdSize ? incomeBandDollarRange(answers.incomeBand, answers.householdSize, answers.stateCode) : null;

  let status: HospitalAssistanceResultStatus = "verify_policy";
  let heading = "The policy requires direct verification.";
  let policyFinding = "The available inputs do not support a bounded income-range result.";

  if (!answers.householdSize || band.lowerPercent === null || answers.insuranceStatus === "unknown") {
    status = "insufficient_information";
    heading = "More information is needed for an income-range screening.";
    policyFinding = "Household size, approximate income range, and insurance status are needed to compare the entry with a published threshold.";
  } else if ((!northCarolinaStateFloorApplies && policy.reviewStatus === "direct_verification_required") || (!freeThreshold && !discountedThreshold)) {
    status = policy.hardshipProvision ? "hardship_review" : "verify_policy";
    heading = policy.hardshipProvision ? "A hardship review may be available." : "The policy requires direct verification.";
    policyFinding = "The official source does not support a reliable numerical range result in this finder.";
  } else if (policyStale) {
    status = "verify_policy";
    heading = "The policy source may be stale and requires verification.";
    policyFinding = "A numerical comparison is withheld because the source-review date is outside the freshness window.";
  } else if (answers.insuranceStatus === "insured" && (policy.insuredPatientsMayQualify === "limited" || policy.insuredPatientsMayQualify === "unclear")) {
    status = "verify_policy";
    heading = "Insured-patient eligibility requires direct verification.";
    policyFinding = "The published policy limits or does not clearly establish how insured balances fit the income ranges.";
  } else if (band.upperPercent !== null && freeThreshold !== null && band.upperPercent <= freeThreshold) {
    status = "free_range";
    heading = "Your entered income appears to fall within the policy's published free-care range.";
    policyFinding = `The selected income band is fully at or below the published ${freeThreshold}% FPG screening threshold for the entered insurance status.`;
  } else if (freeThreshold !== null && band.upperPercent !== null && band.lowerPercent < freeThreshold && band.upperPercent > freeThreshold) {
    status = "verify_policy";
    heading = "Your income range crosses a published policy threshold.";
    policyFinding = `The selected range spans the policy's ${freeThreshold}% FPG free-care threshold, so a narrower estimate or direct hospital calculation is needed.`;
  } else if (band.upperPercent !== null && discountedThreshold !== null && band.upperPercent <= discountedThreshold) {
    status = "discounted_range";
    heading = "Your entered income appears to fall within a published discounted-care range.";
    policyFinding = `The selected income band is fully at or below the published ${discountedThreshold}% FPG screening ceiling for discounted assistance.`;
  } else if (discountedThreshold !== null && band.upperPercent !== null && band.lowerPercent < discountedThreshold && band.upperPercent > discountedThreshold) {
    status = "verify_policy";
    heading = "Your income range crosses a published discount threshold.";
    policyFinding = `The selected range spans the policy's ${discountedThreshold}% FPG screening ceiling, so the hospital must calculate the result from its current rules.`;
  } else if (policy.hardshipProvision) {
    status = "hardship_review";
    heading = "A hardship review may be available even outside the standard income range.";
    policyFinding = policy.hardshipProvision;
  } else {
    status = "verify_policy";
    heading = "The entered range is above the published standard range, but direct verification is still appropriate.";
    policyFinding = "No standard income-based result is shown. Other hospital, state, hardship, presumptive, or payment rules may still apply.";
  }

  const summary = status === "free_range"
    ? "This is a screening result, not an eligibility decision. The hospital must confirm the household definition, documents, covered care, providers, insurance treatment, and final award."
    : status === "discounted_range"
      ? "The policy publishes a possible discount within this band, but the percentage and covered balance still require hospital review."
      : status === "hardship_review"
        ? "The standard income comparison does not establish free or discounted care, but the official policy describes a hardship path worth requesting."
        : status === "insufficient_information"
          ? "The finder is withholding an estimate because a controlling input or policy threshold is missing."
          : "The available policy or entered range needs a direct hospital calculation before it can support an action plan.";

  verificationItems.push(
    `Verify the policy effective date${policy.policyEffectiveDate ? ` (currently recorded as ${policy.policyEffectiveDate})` : " and current revision"}.`,
    "Verify that the policy applies to this facility, service, date, and provider.",
    "Verify the hospital's household definition, income lookback period, asset rules, residency rules, and treatment of insurance.",
    "Verify the application deadline, appeal process, and collection status directly with the hospital.",
  );

  nextActions.unshift(
    `Open ${policy.name}'s official policy and application rather than relying on this summary alone.`,
    `Call ${policy.phone ?? "the hospital's current patient-financial-services number"} and ask for a financial-assistance review.`,
  );

  warnings.push(
    "The hospital must make the final eligibility determination.",
    "This tool does not decide whether a balance is correctly billed, covered, collectible, or legally owed.",
    "Do not ignore a lawsuit, appeal, validation, authorization, or collection deadline while applying.",
  );

  return {
    status,
    heading,
    summary,
    policyFinding,
    enteredFacts,
    nextActions: unique(nextActions),
    documents,
    questions,
    missingInformation: unique(missingInformation),
    verificationItems: unique(verificationItems),
    warnings: unique(warnings),
    povertyGuidelineAmount: guideline,
    estimatedIncomeRange,
    policyStale,
  };
};