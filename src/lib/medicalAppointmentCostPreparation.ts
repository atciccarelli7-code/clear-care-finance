export type CareTiming = "planned" | "scheduled-soon" | "urgent-or-emergency" | "not-sure";
export type CareSetting =
  | "clinician-office"
  | "hospital-outpatient"
  | "ambulatory-surgery"
  | "imaging-laboratory"
  | "therapy"
  | "urgent-emergency"
  | "not-sure";
export type CoverageSituation = "private" | "medicare" | "medicaid" | "uninsured-self-pay" | "other-not-sure";
export type PreparationStatus = "confirmed" | "needs-check" | "not-applicable";
export type NextCallOwner = "provider" | "health-plan" | "both" | "not-sure";

export type MedicalAppointmentCostAnswers = {
  timing: CareTiming;
  setting: CareSetting;
  coverage: CoverageSituation;
  networkStatus: PreparationStatus;
  authorizationStatus: PreparationStatus;
  estimateStatus: PreparationStatus;
  facilityFeeStatus: PreparationStatus;
  separateBillsStatus: PreparationStatus;
  nextCallOwner: NextCallOwner;
};

export const DEFAULT_MEDICAL_APPOINTMENT_COST_ANSWERS: MedicalAppointmentCostAnswers = {
  timing: "not-sure",
  setting: "not-sure",
  coverage: "other-not-sure",
  networkStatus: "needs-check",
  authorizationStatus: "needs-check",
  estimateStatus: "needs-check",
  facilityFeeStatus: "needs-check",
  separateBillsStatus: "needs-check",
  nextCallOwner: "not-sure",
};

export type CostPreparationSection = {
  title: string;
  items: string[];
};

export type CostPreparationPlan = {
  headline: string;
  summary: string;
  urgentCareNotice: string | null;
  sections: CostPreparationSection[];
  callScripts: string[];
  limits: string[];
};

const unique = (items: string[]) => [...new Set(items)];

export const buildMedicalAppointmentCostPlan = (
  answers: MedicalAppointmentCostAnswers,
): CostPreparationPlan => {
  const providerQuestions = [
    "Which facility, department, and separately billing clinicians or organizations may be involved?",
    "Can the provider or facility give a written estimate and explain which expected charges are not included?",
    "Who should receive insurance, network, authorization, estimate, and billing questions before the service?",
  ];
  const planQuestions = [
    "Is this service covered under the current plan, and which benefit category and cost-sharing rules apply?",
    "Which facility and professional participants should be verified separately for network status?",
    "Does the plan require prior authorization, a referral, step therapy, or another pre-service review?",
  ];
  const separateBills = [
    "Ask whether the facility and treating clinician bill separately.",
    "Ask whether laboratory, imaging, interpretation, anesthesia, pathology, equipment, therapy, or other professional services could bill separately.",
  ];
  const documents = [
    "Keep the written estimate, network confirmation, authorization status, reference numbers, dates, departments, and names or roles of the people contacted.",
    "Keep the relevant plan document, Summary of Benefits and Coverage, Evidence of Coverage, referral, order, and written notices that control the decision.",
    "After care, keep the EOB, Medicare Summary Notice, or Medicaid notice with every provider or facility bill.",
  ];
  const paymentQuestions = [
    "Ask whether a deposit is required, what it represents, and how it will be reconciled after insurance processes the claim.",
    "Ask for the written financial-assistance, discount, and payment-plan policies before agreeing to long-term debt or high-interest credit.",
    "Ask whether the estimate changes if the setting, billing entity, network status, or expected services change.",
  ];
  const afterCareChecks = [
    "Wait for the payer explanation when one is expected, then compare dates, billing entities, adjustments, payments, and patient responsibility with each bill.",
    "If the final bill differs from the estimate or a network or authorization confirmation, ask for a written explanation before deciding what to pay.",
    "Continue into the Medical Bill Review Toolkit when a bill is confusing, unaffordable, unprocessed, denied, out of network, or different from the written preparation record.",
  ];

  if (answers.setting === "hospital-outpatient") {
    providerQuestions.push(
      "Is this location treated as a hospital outpatient department or provider-based department, and should a facility fee be expected?",
    );
    separateBills.push("Verify whether the hospital outpatient charge and the clinician professional charge will arrive on separate bills.");
  }

  if (answers.setting === "ambulatory-surgery") {
    separateBills.push(
      "Verify the surgery-center or hospital facility, surgeon, anesthesia, pathology, radiology, laboratory, implant, and assistant charges separately when applicable.",
    );
  }

  if (answers.setting === "imaging-laboratory") {
    separateBills.push(
      "Ask whether the technical service and the professional interpretation are billed separately and whether contrast, pathology, or outside laboratory processing may add another bill.",
    );
  }

  if (answers.setting === "therapy") {
    providerQuestions.push(
      "How many visits are currently ordered, what re-evaluation rules apply, and could the location or therapist change the network or cost-sharing category?",
    );
  }

  if (answers.networkStatus === "needs-check") {
    providerQuestions.push("What legal entity will bill for the facility and each professional service, so network status can be checked using the correct name?");
    planQuestions.unshift("Please confirm the network status of the facility and every separately billing participant using the plan's current records.");
  }

  if (answers.authorizationStatus === "needs-check") {
    providerQuestions.push("Who is responsible for submitting any authorization or referral, and has the request been accepted by the plan?");
    planQuestions.push("If authorization is required, what service, setting, dates, and billing entities does the recorded approval cover?");
    documents.push("Keep the authorization or referral status and the plan's reference number; approval is not a guarantee of final payment.");
  }

  if (answers.estimateStatus === "needs-check") {
    providerQuestions.unshift("Can I receive a written estimate before care, and does it include both facility and professional charges?");
  }

  if (answers.facilityFeeStatus === "needs-check") {
    providerQuestions.push("Will a facility or hospital outpatient fee apply at this location, and is that fee included in the estimate?");
  }

  if (answers.separateBillsStatus === "needs-check") {
    providerQuestions.push("Which clinicians, laboratories, imaging groups, or other services may send a separate bill?");
  }

  if (answers.coverage === "private") {
    planQuestions.push(
      "How will the deductible, copayment, coinsurance, and out-of-pocket maximum apply if every service is covered and in network?",
      "Do federal or state surprise-billing protections apply to any out-of-network participant at the expected facility?",
    );
  } else if (answers.coverage === "medicare") {
    planQuestions.push(
      "Is coverage through Original Medicare or a Medicare Advantage plan, and which official documents control the service, setting, authorization, and cost sharing?",
      "If Original Medicare applies, does the clinician accept assignment and could an advance written notice be relevant for a service Medicare may not cover?",
    );
  } else if (answers.coverage === "medicaid") {
    planQuestions.push(
      "Which state Medicaid program or managed-care plan controls the network, referral, authorization, transportation, and cost-sharing rules?",
    );
  } else if (answers.coverage === "uninsured-self-pay") {
    providerQuestions.unshift(
      "Please provide the written good-faith estimate available for uninsured or self-pay care and explain which providers or facilities are not included.",
    );
    documents.unshift("Keep every written good-faith estimate so it can be compared with the final bills.");
    planQuestions.splice(0, planQuestions.length, "Confirm whether insurance will not be used and whether the provider is treating the service as uninsured or self-pay for estimate purposes.");
  }

  if (answers.nextCallOwner === "provider") {
    providerQuestions.unshift("Start with the scheduling provider or facility and request the billing entities, setting, estimate, and authorization owner.");
  } else if (answers.nextCallOwner === "health-plan") {
    planQuestions.unshift("Start with the health plan and request benefit, network, authorization, and cost-sharing verification for the expected setting.");
  } else if (answers.nextCallOwner === "both" || answers.nextCallOwner === "not-sure") {
    providerQuestions.unshift("Ask the provider or facility for the exact setting and billing entities before relying on a network or estimate answer.");
    planQuestions.unshift("Ask the health plan to verify coverage, network, authorization, and cost sharing using those billing entities and the expected setting.");
  }

  const urgent = answers.timing === "urgent-or-emergency" || answers.setting === "urgent-emergency";

  return {
    headline: urgent ? "Get necessary care first; organize cost questions when it is safe" : "Your medical-care cost preparation plan",
    summary: urgent
      ? "Cost research should not delay emergency evaluation or time-sensitive care. Use this plan later to organize written notices, payer processing, separate bills, and assistance questions."
      : "Use the provider and health-plan questions together. A written estimate, network answer, or authorization record is useful preparation, but none guarantees final coverage or price.",
    urgentCareNotice: urgent
      ? "Do not delay emergency or urgently needed care to complete cost research, obtain an estimate, or resolve an insurance question."
      : null,
    sections: [
      { title: "Questions for the healthcare provider or facility", items: unique(providerQuestions) },
      { title: "Questions for the insurer or health plan", items: unique(planQuestions) },
      { title: "Possible separate bills to verify", items: unique(separateBills) },
      { title: "Documents and confirmation details to retain", items: unique(documents) },
      { title: "Estimates, deposits, payment plans, and financial assistance", items: unique(paymentQuestions) },
      { title: "What to verify after the EOB or bill arrives", items: unique(afterCareChecks) },
    ],
    callScripts: [
      "Provider or facility: 'Is this location treated as a hospital outpatient department, and should I expect a facility fee in addition to professional charges?'",
      "Provider or facility: 'Which clinicians or services may bill separately, and does the written estimate include anesthesia, pathology, radiology, laboratory, interpretation, or other professional charges?'",
      "Health plan: 'Please verify the facility and every separately billing participant, the expected care setting, and any authorization or referral requirement.'",
      "Health plan: 'If authorization is required, can you confirm what the recorded approval covers and give me the reference number and current status?'",
      "Self-pay: 'Please provide the written good-faith estimate available for this scheduled care and tell me which expected providers or charges are not included.'",
      "Billing or financial assistance: 'Please send the written financial-assistance, discount, deposit, and payment-plan policies before I agree to a payment arrangement.'",
    ],
    limits: [
      "An estimate is not a guarantee of final coverage or price.",
      "Network and authorization information should be verified with the relevant provider, facility, and health plan.",
      "Separate bills may still occur even when one organization schedules the care.",
      "This tool provides educational preparation, not legal, medical, insurance, billing, or financial advice.",
    ],
  };
};

export const createMedicalAppointmentCostPlanText = (plan: CostPreparationPlan) => [
  "MEDICAL APPOINTMENT COST PREPARATION",
  plan.headline,
  plan.summary,
  plan.urgentCareNotice ?? "",
  "",
  ...plan.sections.flatMap((section) => [section.title.toUpperCase(), ...section.items.map((item) => `- ${item}`), ""]),
  "FIXED CALL SCRIPTS",
  ...plan.callScripts.map((script) => `- ${script}`),
  "",
  "IMPORTANT LIMITS",
  ...plan.limits.map((item) => `- ${item}`),
].filter(Boolean).join("\n");
