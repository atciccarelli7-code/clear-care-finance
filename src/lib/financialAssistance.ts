export type FinancialAssistanceBillSource = "hospital" | "outside_clinician" | "not_sure";
export type FinancialAssistanceInsuranceStatus = "processed" | "pending" | "uninsured" | "not_sure";
export type FinancialAssistanceAffordability = "unaffordable" | "difficult" | "manageable" | "not_sure";
export type FinancialAssistanceCollectionStatus = "current" | "past_due" | "collections" | "paid" | "not_sure";
export type FinancialAssistanceNonprofitStatus = "yes" | "no" | "not_sure";
export type FinancialAssistancePolicyStatus = "found" | "not_found" | "not_sure";
export type FinancialAssistanceApplicationStatus = "not_requested" | "requested" | "submitted" | "not_sure";

export interface FinancialAssistanceAnswers {
  billSource: FinancialAssistanceBillSource;
  insuranceStatus: FinancialAssistanceInsuranceStatus;
  affordability: FinancialAssistanceAffordability;
  collectionStatus: FinancialAssistanceCollectionStatus;
  nonprofitStatus: FinancialAssistanceNonprofitStatus;
  policyStatus: FinancialAssistancePolicyStatus;
  applicationStatus: FinancialAssistanceApplicationStatus;
}

export type FinancialAssistanceScreeningLevel = "strong_reason" | "possible_reason" | "verify_first";

export interface FinancialAssistanceScreeningResult {
  level: FinancialAssistanceScreeningLevel;
  heading: string;
  summary: string;
  reasons: string[];
  doNow: string[];
  verify: string[];
  documents: string[];
  cautions: string[];
}

const unique = (items: string[]) => [...new Set(items)];

export const DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS: FinancialAssistanceAnswers = {
  billSource: "not_sure",
  insuranceStatus: "not_sure",
  affordability: "not_sure",
  collectionStatus: "not_sure",
  nonprofitStatus: "not_sure",
  policyStatus: "not_sure",
  applicationStatus: "not_sure",
};

export const buildFinancialAssistanceScreening = (
  answers: FinancialAssistanceAnswers,
): FinancialAssistanceScreeningResult => {
  const reasons: string[] = [];
  const doNow: string[] = [];
  const verify: string[] = [];
  const cautions: string[] = [];

  const documents = [
    "The provider bill or current statement",
    "The matching EOB or Medicare Summary Notice, when insurance is involved",
    "The hospital's written financial-assistance policy and application",
    "Only the income and household documents specifically requested by the written policy",
    "Proof of submission, reference numbers, and written responses",
  ];

  let strongSignal = false;
  let possibleSignal = false;

  if (answers.billSource === "hospital") {
    reasons.push("The balance appears to come from a hospital or facility, so the hospital's written assistance policy may be relevant.");
    possibleSignal = true;
  } else if (answers.billSource === "outside_clinician") {
    cautions.push("An outside physician, laboratory, imaging group, ambulance service, or other separately billing clinician may not be covered by the hospital's policy.");
    verify.push("Ask whether the bill is included in the hospital policy or requires a separate application, discount request, or payment discussion.");
  } else {
    doNow.push("Identify who issued the bill and whether it is the hospital facility bill or a separately billed professional service.");
  }

  if (answers.insuranceStatus === "pending") {
    doNow.push("Confirm that the claim was submitted and fully processed before treating the requested balance as final.");
    cautions.push("A pending, rejected, or unprocessed claim can make the current balance incomplete.");
  } else if (answers.insuranceStatus === "uninsured") {
    reasons.push("Uninsured or self-pay status is a strong reason to request the written policy and ask about assistance or self-pay discounts.");
    strongSignal = answers.billSource !== "outside_clinician";
  } else if (answers.insuranceStatus === "processed") {
    reasons.push("Insurance processing appears complete, so assistance screening can focus on the remaining patient balance.");
  } else {
    verify.push("Ask whether insurance processing is complete and whether every related claim from the episode has been adjudicated.");
  }

  if (answers.affordability === "unaffordable") {
    reasons.push("Paying the balance would interfere with essentials, create high-interest debt, or materially deplete necessary savings.");
    strongSignal = true;
  } else if (answers.affordability === "difficult") {
    reasons.push("The balance would create meaningful household strain, which is a practical reason to review the written policy before agreeing to payment terms.");
    possibleSignal = true;
  } else if (answers.affordability === "not_sure") {
    verify.push("Compare the requested payment with essential expenses and available cash before committing to a lump-sum payment or long payment plan.");
  }

  if (answers.collectionStatus === "collections") {
    reasons.push("Collection activity makes it important to ask immediately whether review or collection activity can pause during an assistance application.");
    doNow.push("Contact the hospital financial-assistance or patient-financial-services office and request written instructions for handling collection activity during review.");
    strongSignal = true;
  } else if (answers.collectionStatus === "past_due") {
    doNow.push("Ask whether the account can be placed on hold while the application or bill review is pending.");
    possibleSignal = true;
  } else if (answers.collectionStatus === "paid") {
    verify.push("Ask whether the policy permits retroactive review of recently paid bills or refunds after approval.");
    possibleSignal = true;
  } else if (answers.collectionStatus === "not_sure") {
    verify.push("Confirm the account status, current deadline, and whether any outside collection agency is involved.");
  }

  if (answers.nonprofitStatus === "yes") {
    reasons.push("The hospital is believed to be nonprofit, so its written financial-assistance policy and plain-language summary should be available for review.");
    possibleSignal = true;
  } else if (answers.nonprofitStatus === "not_sure") {
    verify.push("Confirm whether the hospital is nonprofit and request the exact written financial-assistance policy either way.");
  }

  if (answers.policyStatus === "not_found") {
    doNow.push("Request the written financial-assistance policy, plain-language summary, application, and covered-provider list before paying in full.");
    possibleSignal = true;
  } else if (answers.policyStatus === "not_sure") {
    doNow.push("Search the hospital website or call patient financial services for the written policy and application.");
  } else {
    verify.push("Read the policy's household definition, income period, documentation rules, covered bills, deadlines, and appeal process.");
  }

  if (answers.applicationStatus === "not_requested") {
    doNow.push("Request the application and ask how to submit it securely.");
  } else if (answers.applicationStatus === "requested") {
    doNow.push("Review the application against the written policy and gather only the documents it actually requests.");
  } else if (answers.applicationStatus === "submitted") {
    verify.push("Save proof of submission and ask when a written decision should be expected.");
  } else {
    verify.push("Confirm whether an application has already been opened, submitted, or decided.");
  }

  verify.push(
    "Ask which hospital, clinician, laboratory, imaging, anesthesia, ambulance, or other bills are included or excluded.",
    "Ask what happens to billing deadlines, payment plans, and collection activity while the application is reviewed.",
    "Ask whether a denial can be appealed and what additional documents would be required.",
    "Ask what discount or payment-plan options remain if the application is not approved.",
  );

  cautions.push(
    "This screening does not determine eligibility, legal rights, coverage, coding, or whether the balance is officially owed.",
    "Do not ignore a written appeal, lawsuit, collection, or payment deadline while requesting assistance or clarification.",
  );

  const level: FinancialAssistanceScreeningLevel = strongSignal
    ? "strong_reason"
    : possibleSignal
      ? "possible_reason"
      : "verify_first";

  const heading = level === "strong_reason"
    ? "There is a strong reason to request financial-assistance review before paying more."
    : level === "possible_reason"
      ? "It is worth checking the written policy before deciding how to pay."
      : "Verify the bill source and insurance status before choosing a payment path.";

  const summary = level === "strong_reason"
    ? "The answers point to meaningful affordability, coverage, or collection concerns. Request the exact hospital policy and application, but do not treat this result as approval."
    : level === "possible_reason"
      ? "The answers show enough uncertainty or hardship to justify a policy review. The hospital's written rules and the specific bill control the outcome."
      : "The current information is too incomplete for a useful screening direction. Start by identifying the bill issuer, claim status, written policy, and deadline.";

  return {
    level,
    heading,
    summary,
    reasons: unique(reasons.length ? reasons : ["Several controlling details are still unknown, so the safest first step is document verification."]),
    doNow: unique(doNow),
    verify: unique(verify),
    documents,
    cautions: unique(cautions),
  };
};
