import type { Source } from "@/data/sources";

export type CoverageType =
  | "medicare-advantage"
  | "original-medicare"
  | "medicaid"
  | "employer-commercial"
  | "marketplace"
  | "not-sure";

export type RequestType = "medication" | "imaging-test" | "procedure-surgery" | "therapy-post-acute" | "equipment-supply" | "other";
export type RequestStatus = "not-submitted" | "pending" | "more-information" | "written-denial" | "verbal-only" | "not-sure";
export type Urgency = "routine" | "serious-jeopardy" | "not-sure";
export type WrittenNotice = "yes" | "no" | "not-sure";
export type DenialReason =
  | "medical-necessity"
  | "missing-documentation"
  | "drug-rule"
  | "network-referral"
  | "excluded-benefit"
  | "administrative"
  | "not-stated";
export type ProviderAction = "resubmitting" | "peer-to-peer" | "supporting-records" | "none" | "not-sure";
export type ServiceTiming = "prospective" | "already-received" | "not-sure";
export type PendingDuration = "under-72-hours" | "three-to-seven-days" | "over-seven-days" | "not-sure" | "not-applicable";

export type PriorAuthorizationAnswers = {
  coverageType?: CoverageType;
  requestType?: RequestType;
  status?: RequestStatus;
  urgency?: Urgency;
  writtenNotice?: WrittenNotice;
  denialReason?: DenialReason;
  providerAction?: ProviderAction;
  serviceTiming?: ServiceTiming;
  pendingDuration?: PendingDuration;
};

export type RelatedLink = {
  title: string;
  description: string;
  href: string;
};

export type PriorAuthorizationPlan = {
  pathway:
    | "submission-not-started"
    | "pending"
    | "pending-possibly-late"
    | "more-information"
    | "formal-denial"
    | "verbal-only"
    | "urgent-review"
    | "drug-specific"
    | "coverage-uncertain";
  stageTitle: string;
  firstAction: string;
  why: string[];
  verify: string[];
  providerQuestions: string[];
  planQuestions: string[];
  documents: string[];
  urgentOrAppeal: string[];
  relatedLinks: RelatedLink[];
  sources: Source[];
  disclaimer: string;
};

export const PRIOR_AUTHORIZATION_SOURCES: Source[] = [
  {
    name: "CMS",
    pageTitle: "Interoperability and Prior Authorization Final Rule CMS-0057-F",
    url: "https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f",
    note: "Official 2026 operational requirements for specified non-drug prior authorization requests and impacted payers.",
  },
  {
    name: "Medicare.gov",
    pageTitle: "Appeals in Medicare health plans",
    url: "https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals/health-plan-decisions",
    note: "Official Medicare Advantage organization-determination, reconsideration, and fast-appeal guidance.",
  },
  {
    name: "HealthCare.gov",
    pageTitle: "Appealing a health plan decision",
    url: "https://www.healthcare.gov/appeal-insurance-company-decision/",
    note: "Official overview of internal appeals, expedited review, and independent external review for applicable plans.",
  },
  {
    name: "U.S. Department of Labor",
    pageTitle: "Filing a Claim for Your Health Benefits",
    url: "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/filing-a-claim-for-your-health-benefits",
    note: "Official ERISA guidance for many private-sector employer health plans, including claims, notices, and appeals.",
  },
  {
    name: "Medicaid.gov",
    pageTitle: "State Medicaid contacts",
    url: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip/index.html",
    note: "Official path to state-specific Medicaid and CHIP contacts; state notices and deadlines control.",
  },
];

const unique = (items: string[]) => [...new Set(items.filter(Boolean))];

const coverageLabel = (coverage?: CoverageType) => {
  switch (coverage) {
    case "medicare-advantage": return "Medicare Advantage plan";
    case "original-medicare": return "Original Medicare";
    case "medicaid": return "Medicaid plan or state program";
    case "employer-commercial": return "employer or commercial plan";
    case "marketplace": return "Marketplace plan";
    default: return "health plan";
  }
};

const requestLabel = (request?: RequestType) => {
  switch (request) {
    case "medication": return "medication request";
    case "imaging-test": return "imaging or testing request";
    case "procedure-surgery": return "procedure or surgery request";
    case "therapy-post-acute": return "therapy, rehab, skilled nursing, or post-acute request";
    case "equipment-supply": return "equipment or supply request";
    default: return "service request";
  }
};

const deadlineContext = (answers: PriorAuthorizationAnswers) => {
  if (answers.requestType === "medication") {
    return "Drug prior authorization follows pharmacy, formulary, exception, step-therapy, Part D, or plan-specific rules. Do not apply the CMS non-drug 72-hour/seven-day operational rule to this request.";
  }

  if (answers.coverageType === "medicare-advantage" || answers.coverageType === "medicaid") {
    return "For certain impacted payers and complete non-drug requests, CMS generally requires decisions within 72 hours for expedited requests and seven calendar days for standard requests beginning in 2026. Confirm that the payer, service, and request are actually covered by that rule before relying on it.";
  }

  if (answers.coverageType === "marketplace") {
    return "Marketplace plans provide internal appeal and external-review rights, including expedited handling for urgent cases, but the CMS-0057-F 72-hour/seven-day operational timeframe excludes Qualified Health Plan issuers on the Federally Facilitated Exchanges.";
  }

  if (answers.coverageType === "employer-commercial") {
    return "Employer and commercial plan deadlines depend on whether the plan is self-funded or fully insured, the type of request, federal ERISA or ACA rules, state law, and the plan document. Use the written notice and Summary Plan Description rather than assuming one universal deadline.";
  }

  if (answers.coverageType === "original-medicare") {
    return "Original Medicare uses its own coverage, claim, and appeal processes. Some items or demonstrations may require prior authorization, but the Medicare Advantage organization-determination timeline should not be applied automatically.";
  }

  return "The controlling timeframe cannot be identified until the plan type, request type, and written plan instructions are confirmed.";
};

const coverageQuestions = (answers: PriorAuthorizationAnswers) => {
  const questions = [
    "What exact plan name, member-services number, and utilization-management or pharmacy number apply to this request?",
    "Can you confirm whether this is a prior authorization, coverage determination, referral issue, claim denial, or benefit exclusion?",
    "What is the submission date, reference number, current status, and department or vendor reviewing it?",
    "What written document states the reason, deadline, and next review or appeal step?",
  ];

  if (answers.coverageType === "medicare-advantage") {
    questions.push(
      "Is this an organization determination, reconsideration, Part D coverage determination, or another Medicare Advantage process?",
      "If delay could seriously jeopardize health or recovery, how can the treating clinician request an expedited decision?",
    );
  } else if (answers.coverageType === "original-medicare") {
    questions.push(
      "Is this an Original Medicare prior authorization program, an Advance Beneficiary Notice issue, or a claim/coverage appeal?",
      "Which Medicare Administrative Contractor or official notice controls the next step?",
    );
  } else if (answers.coverageType === "medicaid") {
    questions.push(
      "Is this Medicaid fee-for-service or a Medicaid managed care plan?",
      "What state appeal, grievance, continuation-of-benefits, or fair-hearing instructions apply?",
    );
  } else if (answers.coverageType === "employer-commercial") {
    questions.push(
      "Is the employer plan fully insured or self-funded, and who is the plan administrator named in the Summary Plan Description?",
      "What internal appeal, urgent-care review, and external-review process applies to this plan?",
    );
  } else if (answers.coverageType === "marketplace") {
    questions.push(
      "What internal appeal instructions and independent external-review rights are listed in the denial notice?",
      "Does the case qualify for an expedited internal appeal or simultaneous external review?",
    );
  } else {
    questions.push(
      "On the insurance card, is the coverage Medicare Advantage, Original Medicare, Medicaid, employer coverage, Marketplace coverage, or something else?",
      "Is a separate pharmacy benefit manager or utilization-management company handling the request?",
    );
  }

  return questions;
};

const providerQuestions = (answers: PriorAuthorizationAnswers) => {
  const questions = [
    "Who in the office owns this request, and what is the best direct number for that team?",
    "When was the request submitted, through which portal or fax number, and what confirmation or reference number was received?",
    "What clinical records, diagnosis codes, procedure or drug codes, treatment history, and medical-necessity explanation were sent?",
    "Can the office confirm whether the plan requested additional information or offered a peer-to-peer review?",
  ];

  if (answers.denialReason === "medical-necessity") {
    questions.push("Which coverage criteria were not met, and can the clinician address each criterion in a supporting note or appeal?");
  }
  if (answers.denialReason === "missing-documentation") {
    questions.push("What exact record is missing, who will send it, and how will receipt be confirmed?");
  }
  if (answers.denialReason === "drug-rule" || answers.requestType === "medication") {
    questions.push("Has the prescriber documented prior treatments, contraindications, adverse effects, and the reason a formulary alternative is not appropriate?");
  }
  if (answers.denialReason === "network-referral") {
    questions.push("Can the office verify referral requirements, network status, site-of-care rules, and whether an in-network alternative exists?");
  }
  if (answers.denialReason === "administrative") {
    questions.push("Can the office correct the member information, codes, dates, ordering provider, rendering provider, or submission destination and resubmit?");
  }
  if (answers.urgency === "serious-jeopardy") {
    questions.push("Will the treating clinician document why waiting could seriously jeopardize life, health, or the ability to regain maximum function and request expedited handling?");
  }

  return unique(questions);
};

const documentsFor = (answers: PriorAuthorizationAnswers) => unique([
  "Insurance card and plan name",
  "Ordering clinician and office contact information",
  "Requested medication, test, procedure, therapy, facility, equipment, or service",
  "Submission date, confirmation, tracking number, and every call reference number",
  "Prior authorization request or portal status screenshot, if available",
  "Written approval, request for information, adverse determination, or denial notice",
  "Relevant plan document, Evidence of Coverage, Summary Plan Description, formulary, or coverage policy",
  "Clinical notes, test results, prior treatment history, and medical-necessity letter supplied by the provider",
  answers.serviceTiming === "already-received" ? "Claim, EOB, Medicare Summary Notice, provider bill, and any retroactive-authorization correspondence" : "Appointment, procedure, therapy, discharge, or medication start date",
]);

const relatedLinksFor = (answers: PriorAuthorizationAnswers): RelatedLink[] => {
  const links: RelatedLink[] = [
    {
      title: "Prior Authorization Explained",
      description: "Understand the basic process, common delay points, and why a written decision matters.",
      href: "/articles/prior-authorization-explained",
    },
    {
      title: "Medical Bill Review Flow",
      description: "Use this if care already occurred and the problem has become a claim or bill.",
      href: "/tools/medical-bill-review-flow",
    },
  ];

  if (answers.requestType === "medication") {
    links.unshift({
      title: "Medication Coverage Checklist",
      description: "Check formulary status, tier, step therapy, quantity limits, pharmacy rules, and exception questions.",
      href: "/insurance/medication-coverage-checklist",
    });
  }
  if (answers.requestType === "therapy-post-acute") {
    links.unshift({
      title: "Hospital Discharge Coverage Guide",
      description: "Work through rehab, skilled nursing, home health, equipment, and post-hospital coverage questions.",
      href: "/insurance/hospital-discharge-coverage",
    });
  }
  if (answers.coverageType === "medicare-advantage") {
    links.unshift({
      title: "Medicare Advantage Comparison Guide",
      description: "Review networks, authorization, drug coverage, and out-of-pocket exposure in context.",
      href: "/insurance/medicare-advantage",
    });
  }

  return links.slice(0, 4);
};

const formalAppealGuidance = (answers: PriorAuthorizationAnswers) => {
  const guidance = [
    "Use the written notice—not a verbal summary—to identify the decision, reason, filing method, deadline, and review level.",
    "Ask the treating clinician for a focused statement addressing the stated coverage criteria and the consequences of delay.",
    "Keep proof of submission and ask how to verify that the appeal or reconsideration was received and marked complete.",
  ];

  if (answers.coverageType === "medicare-advantage") {
    guidance.push(
      "Medicare.gov states that a level-one Medicare Advantage appeal generally must be filed within 65 days of the initial denial notice; verify the exact date and instructions on the notice.",
      "A fast appeal may be available when waiting for a standard decision may seriously jeopardize life, health, or the ability to regain maximum function; Medicare.gov describes a 72-hour decision timeframe for an accepted fast appeal.",
    );
  } else if (answers.coverageType === "marketplace" || answers.coverageType === "employer-commercial") {
    guidance.push(
      "Applicable plans generally provide an internal appeal and may provide independent external review. The written notice and plan document control the process and deadline.",
      "For urgent cases, ask whether an expedited internal appeal and expedited or simultaneous external review are available.",
    );
  } else if (answers.coverageType === "medicaid") {
    guidance.push(
      "Follow the state Medicaid or managed care notice for plan appeal, grievance, continuation-of-benefits, and fair-hearing rights. State rules and timing control.",
    );
  } else if (answers.coverageType === "original-medicare") {
    guidance.push(
      "Use the applicable Medicare notice to determine whether this is a coverage decision, claim appeal, Advance Beneficiary Notice issue, or another Medicare process.",
    );
  }

  return guidance;
};

export const buildPriorAuthorizationPlan = (answers: PriorAuthorizationAnswers): PriorAuthorizationPlan => {
  const planName = coverageLabel(answers.coverageType);
  const service = requestLabel(answers.requestType);
  const isDrug = answers.requestType === "medication" || answers.denialReason === "drug-rule";
  const urgent = answers.urgency === "serious-jeopardy";
  const potentiallyLate = answers.status === "pending" && (
    answers.pendingDuration === "over-seven-days" ||
    (urgent && answers.pendingDuration !== "under-72-hours" && answers.pendingDuration !== "not-applicable")
  );

  let pathway: PriorAuthorizationPlan["pathway"] = "pending";
  let stageTitle = "The request appears to be pending";
  let firstAction = `Call the ${planName} and the ordering provider with the submission date and reference number. Confirm whether the ${service} is complete, pending, or waiting for information.`;
  const why = [deadlineContext(answers)];
  const verify = [
    "Whether the request was submitted to the correct plan, benefit manager, or utilization-management vendor",
    "Whether the plan considers the request complete and the date its decision clock began",
    "Whether the service is non-drug medical care or a drug/formulary request",
    "Whether the written plan document or notice provides a different process or shorter deadline",
  ];
  let urgentOrAppeal: string[] = [];

  if (!answers.coverageType || answers.coverageType === "not-sure") {
    pathway = "coverage-uncertain";
    stageTitle = "The controlling coverage pathway is not clear yet";
    firstAction = "Use the insurance card and plan documents to identify the exact coverage type and the company or agency handling medical versus pharmacy authorization.";
    why.unshift("Deadlines and appeal rights differ among Medicare Advantage, Original Medicare, Medicaid, employer plans, Marketplace plans, and pharmacy benefits.");
    verify.push("Whether the employer plan is self-funded or fully insured", "Whether a separate pharmacy benefit manager or authorization vendor appears on the card or notice");
  } else if (answers.status === "not-submitted") {
    pathway = "submission-not-started";
    stageTitle = "The authorization process does not appear to have started";
    firstAction = "Contact the ordering provider. Ask who owns the request, what information is needed, when it will be submitted, and how you will receive the confirmation number.";
    why.unshift("A plan cannot make an authorization decision until the correct request and supporting information reach the correct reviewer.");
  } else if (isDrug) {
    pathway = "drug-specific";
    stageTitle = "This appears to be a drug-specific coverage pathway";
    firstAction = "Call the pharmacy benefit number on the insurance card and the prescriber. Confirm formulary status, prior authorization, step therapy, quantity limits, and whether a coverage exception is needed.";
    why.unshift("CMS-0057-F operational deadlines and APIs exclude drug prior authorization. Drug requests use Part D, formulary, pharmacy-benefit, exception, or plan-specific rules.");
    verify.push("The exact drug, dose, quantity, pharmacy, formulary tier, required alternatives, and exception form");
    urgentOrAppeal = formalAppealGuidance(answers);
  } else if (answers.status === "more-information") {
    pathway = "more-information";
    stageTitle = "The request appears to be waiting for additional information";
    firstAction = "Ask the plan what exact item is missing, who must send it, where it must be sent, and how receipt will be confirmed. Then give that information to the provider office handling the request.";
    why.unshift("A request for more information is not the same as an approval or final denial. The immediate task is to close the documentation gap.");
    verify.push("Whether the request remains open while the missing information is supplied", "Whether a new submission or resubmission is required");
  } else if (answers.status === "verbal-only" || (answers.status === "written-denial" && answers.writtenNotice === "no")) {
    pathway = "verbal-only";
    stageTitle = "You do not yet have a usable written denial";
    firstAction = "Request the written decision, specific reason, coverage criteria, appeal instructions, deadline, and reference number. Do not rely only on a phone summary.";
    why.unshift("A verbal statement may describe the current status, but the written notice is what normally identifies the formal decision and appeal path.");
    verify.push("Whether the request is actually denied, incomplete, withdrawn, administratively closed, or still pending");
  } else if (answers.status === "written-denial" || answers.writtenNotice === "yes") {
    pathway = urgent ? "urgent-review" : "formal-denial";
    stageTitle = urgent ? "A formal denial and expedited review question may apply" : "You appear to have a formal denial";
    firstAction = urgent
      ? "Contact the treating clinician immediately. Ask the clinician to document why waiting could seriously jeopardize health or recovery and to request the plan's expedited review or appeal process."
      : "Read the denial notice from top to bottom. Mark the reason, deadline, filing method, review level, and documents the plan says are needed.";
    why.unshift("A written denial creates a specific record that can be matched to the coverage criteria and appeal instructions.");
    urgentOrAppeal = formalAppealGuidance(answers);
  } else if (urgent) {
    pathway = "urgent-review";
    stageTitle = "Expedited review may be appropriate";
    firstAction = "Ask the treating clinician to document why waiting could seriously jeopardize life, health, or the ability to regain maximum function and to request expedited handling through the correct plan process.";
    why.unshift("Urgency is generally based on clinical risk from delay, not inconvenience or an approaching appointment alone.");
    urgentOrAppeal = formalAppealGuidance(answers);
  } else if (potentiallyLate) {
    pathway = "pending-possibly-late";
    stageTitle = "The request may be beyond a potentially applicable decision window";
    firstAction = "Request an immediate status review and written explanation. Confirm when the plan marked the request complete, which rule applies, and whether additional information paused or restarted the process.";
    why.unshift("The elapsed time may exceed a federal or plan timeframe, but that cannot be treated as a legal violation until payer type, request completeness, service type, and controlling rules are confirmed.");
  } else if (answers.status === "not-sure") {
    pathway = "pending";
    stageTitle = "The current process stage is not clear";
    firstAction = "Call the provider and plan separately. Ask each to state whether the request was submitted, received, marked complete, approved, denied, or returned for more information.";
    why.unshift("Different offices may use words such as pending, denied, closed, or incomplete differently. A submission date and reference number create a common record.");
  }

  if (answers.providerAction === "peer-to-peer") {
    why.push("A peer-to-peer review has been offered or scheduled, so the provider should confirm what criteria and deadline apply to that conversation.");
  } else if (answers.providerAction === "resubmitting") {
    why.push("The provider is resubmitting, so confirm whether the original request stays open or a new decision clock begins.");
  } else if (answers.providerAction === "supporting-records") {
    why.push("Supporting records have been supplied; the next checkpoint is confirmation that the reviewer received them and considers the request complete.");
  } else if (answers.providerAction === "none") {
    verify.push("Who at the provider office will take ownership of the next submission, documentation, peer-to-peer, or appeal step");
  }

  if (answers.serviceTiming === "already-received") {
    why.push("Because care already occurred, this may now involve a retroactive authorization, claim denial, billing dispute, or coverage appeal rather than only a prospective prior authorization.");
    verify.push("Whether the provider submitted a claim and whether a separate EOB, Medicare Summary Notice, or bill has been issued");
  }

  if (answers.denialReason === "not-stated") {
    verify.push("The specific denial reason and the exact coverage criteria used");
  }

  return {
    pathway,
    stageTitle,
    firstAction,
    why: unique(why),
    verify: unique(verify),
    providerQuestions: providerQuestions(answers),
    planQuestions: unique(coverageQuestions(answers)),
    documents: documentsFor(answers),
    urgentOrAppeal: unique(urgentOrAppeal),
    relatedLinks: relatedLinksFor(answers),
    sources: PRIOR_AUTHORIZATION_SOURCES,
    disclaimer: "Educational process guidance only. This tool does not determine coverage, medical necessity, urgency, authorization, appeal eligibility, legal compliance, or payment responsibility. The treating clinician, official notice, plan document, insurer, government program, and applicable law control.",
  };
};
