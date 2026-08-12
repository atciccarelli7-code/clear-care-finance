export const HOSPITAL_TO_HOME_VERSION = 1;

export type HelperRole = "patient" | "caregiver" | "advocate";
export type DischargeTiming = "today" | "one-two-days" | "later" | "already-home";
export type CoverageType = "original-medicare" | "medicare-advantage" | "commercial" | "medicaid-dual" | "uninsured" | "unknown";
export type DischargeDestination = "home" | "home-health" | "snf" | "inpatient-rehab" | "long-term-setting" | "unknown";
export type HospitalStatus = "inpatient" | "observation" | "changed-to-observation" | "unknown" | "not-applicable";
export type ServiceNeed = "home-health" | "dme" | "oxygen" | "rehab" | "transport" | "medications" | "personal-care";
export type AuthorizationStatus = "approved" | "pending" | "denied" | "not-started" | "not-required" | "unknown";
export type AcceptanceStatus = "confirmed" | "partial" | "not-confirmed" | "declined" | "not-applicable";
export type NoticeStatus = "written-denial" | "coverage-ending" | "moon-or-status-change" | "verbal-only" | "none" | "unknown";
export type PrimaryConcern = "leaving-before-ready" | "coverage-delay" | "unexpected-cost" | "caregiver-gap" | "medication-access" | "appeal";

export type HospitalToHomeAnswers = {
  helperRole?: HelperRole;
  timing?: DischargeTiming;
  coverage?: CoverageType;
  destination?: DischargeDestination;
  hospitalStatus?: HospitalStatus;
  services: ServiceNeed[];
  authorization?: AuthorizationStatus;
  acceptance?: AcceptanceStatus;
  notice?: NoticeStatus;
  concern?: PrimaryConcern;
};

export type BriefPriority = "before-discharge" | "today" | "follow-up";
export type BriefTask = {
  id: string;
  priority: BriefPriority;
  title: string;
  action: string;
  why: string;
  owner: string;
  evidenceType: "CAF interpretation" | "Needs verification";
  destinationRoute?: string;
};

export type BriefRisk = {
  id: string;
  title: string;
  detail: string;
  evidenceType: "Verified source fact" | "CAF interpretation" | "Needs verification";
};

export type HospitalToHomeBrief = {
  summary: string;
  risks: BriefRisk[];
  tasks: BriefTask[];
  unexpectedCostWarnings: string[];
  unresolvedItems: string[];
};

export const coverageLabels: Record<CoverageType, string> = {
  "original-medicare": "Original Medicare",
  "medicare-advantage": "Medicare Advantage",
  commercial: "an employer or commercial plan",
  "medicaid-dual": "Medicaid or dual coverage",
  uninsured: "no confirmed health coverage",
  unknown: "coverage that still needs to be identified",
};

export const destinationLabels: Record<DischargeDestination, string> = {
  home: "home without ordered home-health visits",
  "home-health": "home with home-health services",
  snf: "a skilled nursing facility or short-term rehabilitation",
  "inpatient-rehab": "an inpatient rehabilitation facility",
  "long-term-setting": "assisted living or another longer-term setting",
  unknown: "a destination that has not been finalized",
};

export const serviceLabels: Record<ServiceNeed, string> = {
  "home-health": "home health",
  dme: "durable medical equipment",
  oxygen: "oxygen or respiratory equipment",
  rehab: "skilled rehabilitation",
  transport: "medical transportation",
  medications: "medication access",
  "personal-care": "personal care or supervision",
};

export const isMedicareCoverage = (coverage?: CoverageType) =>
  coverage === "original-medicare" || coverage === "medicare-advantage";

export const needsAuthorizationQuestion = (answers: HospitalToHomeAnswers) =>
  answers.coverage !== "uninsured" && answers.services.length > 0;

const includes = (answers: HospitalToHomeAnswers, service: ServiceNeed) => answers.services.includes(service);

const task = (value: BriefTask) => value;
const risk = (value: BriefRisk) => value;

export const buildHospitalToHomeBrief = (answers: HospitalToHomeAnswers): HospitalToHomeBrief => {
  const coverage = coverageLabels[answers.coverage ?? "unknown"];
  const destination = destinationLabels[answers.destination ?? "unknown"];
  const role = answers.helperRole === "patient" ? "The patient" : answers.helperRole === "caregiver" ? "A caregiver" : "A helper or advocate";
  const summary = `${role} is preparing for discharge to ${destination} using ${coverage}. This brief separates the clinical recommendation, payer decision, receiving-service acceptance, and patient-cost questions that still need to be verified.`;
  const risks: BriefRisk[] = [];
  const tasks: BriefTask[] = [];
  const unexpectedCostWarnings = [
    "Coverage approval does not mean the service is free. Ask for the deductible, copay, coinsurance, daily rate, and any noncovered amount.",
  ];
  const unresolvedItems: string[] = [];

  tasks.push(task({
    id: "written-plan",
    priority: "before-discharge",
    title: "Get one written discharge plan",
    action: "Ask the hospital case manager or social worker to list the destination, ordered services, accepting organizations, equipment delivery, medication access, follow-up, and the backup plan if any item fails.",
    why: "A medical discharge order does not prove that every coverage, acceptance, delivery, or caregiver step is complete.",
    owner: "Hospital case manager or social worker",
    evidenceType: "CAF interpretation",
  }));

  if (answers.coverage === "unknown") {
    risks.push(risk({ id: "coverage-unknown", title: "The controlling coverage is not identified", detail: "Different plans can use different networks, authorization rules, cost sharing, and appeal processes.", evidenceType: "Needs verification" }));
    unresolvedItems.push("Which plan is responsible for each post-discharge service?");
    tasks.push(task({ id: "identify-payer", priority: "before-discharge", title: "Identify the payer for each service", action: "Ask which insurance benefit will process the facility, agency, equipment, transport, and medication claims, then save the correct member-services number.", why: "A hospital referral cannot establish coverage by itself.", owner: "Patient or caregiver with hospital case manager", evidenceType: "Needs verification" }));
  }

  if (answers.destination === "unknown") {
    risks.push(risk({ id: "destination-unknown", title: "The discharge destination is unresolved", detail: "Authorization, facility acceptance, equipment, transportation, and caregiver planning depend on the intended setting.", evidenceType: "CAF interpretation" }));
    unresolvedItems.push("What setting is recommended, what alternatives exist, and when must the decision be made?");
  }

  if (isMedicareCoverage(answers.coverage) && (answers.hospitalStatus === "unknown" || answers.hospitalStatus === "observation" || answers.hospitalStatus === "changed-to-observation")) {
    risks.push(risk({
      id: "hospital-status",
      title: answers.hospitalStatus === "unknown" ? "Hospital status is not confirmed" : "Observation or changed status may affect cost and next-setting coverage",
      detail: answers.coverage === "original-medicare"
        ? "For Original Medicare, observation time generally does not count toward the qualifying inpatient stay used for standard SNF coverage. Current appeal rights may apply when inpatient status was changed to observation."
        : "Hospital status can affect which Medicare benefit pays and patient cost. Medicare Advantage coverage rules and waivers can differ from Original Medicare.",
      evidenceType: "Verified source fact",
    }));
    tasks.push(task({
      id: "confirm-status",
      priority: "before-discharge",
      title: "Confirm hospital status and notices",
      action: "Ask whether the stay is inpatient or outpatient/observation, when that status began, and whether a MOON or Medicare Change of Status Notice should be provided. If status changed, ask for the current appeal instructions.",
      why: "Status can change patient cost and may affect Original Medicare SNF eligibility.",
      owner: "Hospital utilization review or case management",
      evidenceType: "Needs verification",
      destinationRoute: "/tools/observation-vs-inpatient-status-guide",
    }));
  }

  if (answers.authorization === "pending" || answers.authorization === "not-started" || answers.authorization === "unknown") {
    risks.push(risk({ id: "authorization-open", title: "Prior authorization is not complete", detail: "A recommendation or referral is not the same as payer approval.", evidenceType: "CAF interpretation" }));
    unresolvedItems.push("What was submitted, when was the complete request received, and who is following up today?");
    tasks.push(task({ id: "authorization-followup", priority: "before-discharge", title: "Name the authorization owner", action: "Get the service requested, submission time, reference number, missing documents, expected decision time, and the person following up before discharge.", why: "Incomplete or unowned requests are a common transition failure point.", owner: "Hospital case manager and insurer", evidenceType: "Needs verification", destinationRoute: "/tools/prior-authorization-next-step-guide" }));
  }

  if (answers.authorization === "denied" || answers.notice === "written-denial" || answers.concern === "appeal") {
    risks.push(risk({ id: "denial", title: "A coverage denial or appeal issue is active", detail: "The exact written reason, service and dates, deadline, review type, and missing evidence control the next step.", evidenceType: "Needs verification" }));
    tasks.push(task({ id: "denial-response", priority: "today", title: "Build the denial response from the notice", action: "Obtain the written denial, mark the deadline, ask whether expedited review applies, and ask the ordering clinician what documentation or peer-to-peer review could address the stated reason.", why: "A verbal summary may omit the controlling reason and deadline.", owner: "Patient or caregiver, ordering clinician, and insurer", evidenceType: "Needs verification", destinationRoute: "/tools/prior-authorization-next-step-guide" }));
  }

  if (answers.notice === "coverage-ending") {
    risks.push(risk({ id: "coverage-ending", title: "A covered service may be ending", detail: "Medicare fast-appeal rights can apply when certain hospital, SNF, home-health, rehabilitation, or hospice services are ending too soon.", evidenceType: "Verified source fact" }));
    tasks.push(task({ id: "fast-appeal", priority: "today", title: "Read the service-ending notice now", action: "Use the contact and deadline on the notice to ask whether a fast appeal applies; do not substitute a general web deadline for the notice in hand.", why: "Fast-appeal windows can be short and setting-specific.", owner: "Patient or representative", evidenceType: "Needs verification" }));
  }

  if (answers.notice === "verbal-only") {
    unresolvedItems.push("What written notice or plan document supports the verbal coverage answer?");
    tasks.push(task({ id: "written-notice", priority: "today", title: "Request the answer in writing", action: "Ask for the exact service, dates, reason, cost consequence, appeal or complaint path, and controlling plan language.", why: "Written notices are more reliable than a verbal paraphrase for time-sensitive decisions.", owner: "Insurer, hospital, or service provider", evidenceType: "Needs verification" }));
  }

  if (answers.acceptance === "partial" || answers.acceptance === "not-confirmed" || answers.acceptance === "declined") {
    risks.push(risk({ id: "acceptance", title: "Receiving services are not fully accepted and scheduled", detail: "Referral, payer approval, network participation, clinical acceptance, capacity, and start date are separate checks.", evidenceType: "CAF interpretation" }));
    tasks.push(task({ id: "acceptance-check", priority: "before-discharge", title: "Confirm acceptance—not just referral", action: "Ask which facility, agency, supplier, pharmacy, or transport provider accepted; confirm network status, start or delivery time, patient cost, and the backup option.", why: "A referral can remain pending or be declined even after it is sent.", owner: "Hospital case manager and receiving organization", evidenceType: "Needs verification" }));
  }

  if (answers.destination === "snf" || includes(answers, "rehab")) {
    unexpectedCostWarnings.push("For rehabilitation or SNF care, verify both the broad benefit and the number of days approved now, including any daily copay and what happens when coverage changes.");
    tasks.push(task({ id: "rehab-verification", priority: "before-discharge", title: "Separate skilled need, coverage, and facility acceptance", action: "Ask what daily skilled need supports the stay, which facility accepted, how many days are approved now, the patient cost, and what notice arrives before coverage ends.", why: "Therapy recommendation, payer approval, and facility acceptance are different decisions.", owner: "Therapy, case management, insurer, and receiving facility", evidenceType: "Needs verification" }));
  }

  if (answers.destination === "home-health" || includes(answers, "home-health")) {
    tasks.push(task({ id: "home-health", priority: "before-discharge", title: "Confirm the first home-health visit", action: "Get the accepting agency, ordered disciplines, expected first visit, coverage status, and what help the family must provide between intermittent visits.", why: "Home health is not the same as continuous home care or general household help.", owner: "Hospital case manager and home-health agency", evidenceType: "Needs verification" }));
    unexpectedCostWarnings.push("Covered home health generally does not include around-the-clock care, meal delivery, or personal care when personal care is the only need.");
  }

  if (includes(answers, "dme") || includes(answers, "oxygen")) {
    tasks.push(task({ id: "equipment", priority: "before-discharge", title: "Confirm the complete equipment handoff", action: "Verify the order and supporting documentation, covered supplier, rent-versus-purchase terms, accessories, delivery location and time, training, and patient cost.", why: "An order alone does not confirm supplier acceptance, coverage, or delivery.", owner: "Ordering clinician, case manager, and DME supplier", evidenceType: "Needs verification" }));
    unexpectedCostWarnings.push("DME can involve the Part B deductible and coinsurance under Original Medicare; plan and supplier rules can change the amount owed.");
  }

  if (includes(answers, "transport")) {
    tasks.push(task({ id: "transport", priority: "before-discharge", title: "Price and document transportation", action: "Ask which level of transport is medically necessary, who documented it, whether authorization and network rules apply, and the private-pay estimate if coverage fails.", why: "Ambulance, stretcher, wheelchair-van, and ordinary ride coverage can differ.", owner: "Hospital case manager, transport provider, and insurer", evidenceType: "Needs verification" }));
    unexpectedCostWarnings.push("Transportation may be denied when the record does not support the billed level of medical necessity or the provider is not covered.");
  }

  if (includes(answers, "medications") || answers.concern === "medication-access") {
    tasks.push(task({ id: "medications", priority: "before-discharge", title: "Confirm the first medication fill", action: "Ask the pharmacy to confirm stock, coverage, prior authorization, quantity limits, and today’s price; ask the prescriber about an appropriate covered alternative if access fails.", why: "A prescription is not an executable plan until the patient can obtain and afford it.", owner: "Prescriber, pharmacist, insurer, and patient or caregiver", evidenceType: "Needs verification" }));
  }

  if (includes(answers, "personal-care") || answers.concern === "caregiver-gap") {
    risks.push(risk({ id: "caregiver-gap", title: "The plan may depend on unpaid or noncovered daily help", detail: "Personal care, supervision, meals, housekeeping, and long-term custodial support often use different funding paths than intermittent skilled services.", evidenceType: "CAF interpretation" }));
    tasks.push(task({ id: "caregiver-plan", priority: "before-discharge", title: "Make the assumed caregiver work visible", action: "List the tasks, hours, transfers, supervision, medication help, transportation, and overnight coverage the home plan assumes. State what the family cannot safely provide and ask for realistic alternatives.", why: "A plan can be medically acceptable while still being impossible for the available caregiver.", owner: "Patient or caregiver with case management and therapy", evidenceType: "Needs verification" }));
    unexpectedCostWarnings.push("Personal care, supervision, meals, and long-term custodial help may require Medicaid eligibility, VA benefits, community services, family support, or private payment.");
  }

  if (answers.timing === "today" || answers.concern === "leaving-before-ready") {
    tasks.unshift(task({ id: "today-huddle", priority: "before-discharge", title: "Request a same-day discharge huddle", action: "Ask bedside nursing or case management to gather the unresolved coverage, destination, equipment, medication, transport, teaching, and caregiver items into one review before leaving.", why: "Time pressure makes fragmented ownership more likely.", owner: "Patient or caregiver and hospital team", evidenceType: "CAF interpretation" }));
  }

  if (answers.concern === "unexpected-cost") {
    tasks.push(task({ id: "cost-estimate", priority: "today", title: "Ask for service-by-service cost exposure", action: "For each facility, agency, supplier, transport provider, and pharmacy, ask what is approved, in network, subject to cost sharing, or potentially noncovered.", why: "A single ‘covered’ answer can hide multiple billing entities and cost rules.", owner: "Insurer and each receiving organization", evidenceType: "Needs verification" }));
  }

  if (unresolvedItems.length === 0) unresolvedItems.push("Final patient cost and the backup plan if the first arrangement fails.");

  const priorityRank: Record<BriefPriority, number> = { "before-discharge": 0, today: 1, "follow-up": 2 };
  return {
    summary,
    risks,
    tasks: [...new Map(tasks.map((item) => [item.id, item])).values()].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]),
    unexpectedCostWarnings: [...new Set(unexpectedCostWarnings)],
    unresolvedItems: [...new Set(unresolvedItems)],
  };
};

export const hospitalToHomeBriefText = (brief: HospitalToHomeBrief) => [
  "Community Acquired Finance — Discharge Coverage & Cost Brief",
  "Educational decision support. Verify coverage, care, cost, and deadlines with the controlling organization.",
  "",
  "Situation summary",
  brief.summary,
  "",
  "Priority risks",
  ...(brief.risks.length ? brief.risks.map((item) => `- ${item.title}: ${item.detail} [${item.evidenceType}]`) : ["- No branch-specific risk was identified; final coverage and cost still need official verification."]),
  "",
  "Next actions",
  ...brief.tasks.map((item) => `- [ ] ${item.title} — ${item.action} Owner: ${item.owner}. [${item.evidenceType}]`),
  "",
  "Unexpected-cost warnings",
  ...brief.unexpectedCostWarnings.map((item) => `- ${item}`),
  "",
  "Still unresolved",
  ...brief.unresolvedItems.map((item) => `- ${item}`),
].join("\n");
