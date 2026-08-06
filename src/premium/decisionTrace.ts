import {
  ancillaryKeys,
  ancillaryLabels,
  documentKeys,
  documentLabels,
  getMedicalRecommendation,
  getRetirementSummary,
  getVerificationItems,
  type DocumentStatus,
  type OpenEnrollmentPilotState,
} from "@/premium/openEnrollmentPilot";

export type DecisionTraceStatus = "supported" | "provisional" | "verification-required";

export type DecisionTraceSource = {
  key: string;
  label: string;
  status: DocumentStatus;
  implication: string;
};

export type DecisionTrace = {
  status: DecisionTraceStatus;
  label: string;
  summary: string;
  sourceCoverage: {
    ready: number;
    missing: number;
    unknown: number;
    notApplicable: number;
    total: number;
  };
  sourceLedger: DecisionTraceSource[];
  drivers: string[];
  assumptions: string[];
  changeTriggers: string[];
  verificationItems: string[];
};

const coverageLabels: Record<OpenEnrollmentPilotState["coverageTier"], string> = {
  "employee-only": "employee-only coverage",
  "employee-spouse": "employee-and-spouse coverage",
  "employee-child": "employee-and-child coverage",
  family: "family coverage",
  undecided: "an undecided coverage tier",
};

const useLabels: Record<OpenEnrollmentPilotState["healthcareUse"], string> = {
  low: "generally low healthcare use",
  expected: "typical or expected healthcare use",
  high: "likely high healthcare use",
  uncertain: "uncertain healthcare use",
};

const priorityLabels: Record<OpenEnrollmentPilotState["decisionPriority"], string> = {
  "lowest-expected-cost": "lowest expected cost",
  "predictable-costs": "more predictable costs",
  "lowest-worst-case": "lower bad-year exposure",
  "hsa-value": "HSA value",
  balanced: "a balanced tradeoff",
  undecided: "an undecided priority",
};

const accountLabel = (state: OpenEnrollmentPilotState) => {
  if (state.accountElection === "undecided") return "No healthcare-account election has been recorded.";
  if (state.accountElection === "verify") return "The healthcare-account election remains subject to eligibility verification.";
  if (state.accountElection === "none") return "No HSA, HRA, or healthcare FSA election is planned.";
  return `${state.accountElection.toUpperCase()} selected${
    typeof state.annualAccountContribution === "number"
      ? ` with an entered annual employee contribution of $${Math.round(state.annualAccountContribution).toLocaleString("en-US")}`
      : ""
  }.`;
};

const sourceImplication = (status: DocumentStatus) => {
  if (status === "ready") return "Available for final verification.";
  if (status === "missing") return "Must be obtained before relying on the affected election.";
  if (status === "not-applicable") return "Marked not applicable for this decision.";
  return "Status has not been confirmed.";
};

const unique = (items: string[]) => [...new Set(items.filter(Boolean))];

export const buildDecisionTrace = (state: OpenEnrollmentPilotState): DecisionTrace => {
  const medical = getMedicalRecommendation(state);
  const retirement = getRetirementSummary(state);
  const verificationItems = getVerificationItems(state);
  const sourceLedger = documentKeys.map((key) => ({
    key,
    label: documentLabels[key],
    status: state.documents[key],
    implication: sourceImplication(state.documents[key]),
  }));

  const sourceCoverage = sourceLedger.reduce(
    (counts, source) => {
      if (source.status === "ready") counts.ready += 1;
      if (source.status === "missing") counts.missing += 1;
      if (source.status === "unknown") counts.unknown += 1;
      if (source.status === "not-applicable") counts.notApplicable += 1;
      return counts;
    },
    { ready: 0, missing: 0, unknown: 0, notApplicable: 0, total: sourceLedger.length },
  );

  const protectionEnrollments = ancillaryKeys
    .filter((key) => state.ancillary[key] === "enroll")
    .map((key) => ancillaryLabels[key]);
  const protectionVerifications = ancillaryKeys
    .filter((key) => state.ancillary[key] === "verify")
    .map((key) => ancillaryLabels[key]);
  const assistedPlans = (["a", "b"] as const)
    .filter((planId) => state.sourceAssistance[planId])
    .map((planId) => state.plans[planId].label || `Plan ${planId.toUpperCase()}`);

  const drivers = unique([
    `The planning context is ${coverageLabels[state.coverageTier]}, ${useLabels[state.healthcareUse]}, with ${priorityLabels[state.decisionPriority]} as the stated priority.`,
    `Medical-plan interpretation: ${medical.explanation}`,
    accountLabel(state),
    retirement
      ? `The retirement entry implies about $${Math.round(retirement.annualEmployerValue).toLocaleString("en-US")} of annual employer value, with $${Math.round(retirement.immediatelyVestedValue).toLocaleString("en-US")} immediately vested.`
      : state.retirementOffered === "no"
        ? "No workplace retirement plan was entered."
        : "The retirement decision is not sufficiently complete for a value estimate.",
    protectionEnrollments.length
      ? `Planned protection and supplemental enrollments: ${protectionEnrollments.join(", ")}.`
      : "No protection or supplemental enrollment has been selected yet.",
    assistedPlans.length
      ? `Browser-local source assistance contributed user-confirmed structured values to ${assistedPlans.join(" and ")}; raw source text and files were not retained.`
      : "Plan values were entered manually; no browser-local source-assisted values are recorded.",
  ]);

  const assumptions = [
    "Entered premiums and contribution amounts are treated as annual unless a field explicitly says otherwise.",
    "Medical estimates use premiums, deductible, coinsurance, out-of-pocket maximum, employer account funding, and expected covered allowed costs; copays, excluded care, balance bills, and tax effects are not modeled.",
    "Payroll estimates are planning estimates before taxes and are not take-home pay projections.",
    "Provider networks, formularies, eligibility rules, employer contributions, and payroll deductions can change; current official documents and the employer portal control.",
  ];

  const changeTriggers = unique([
    ...sourceLedger
      .filter((source) => source.status === "missing" || source.status === "unknown")
      .map((source) => `${source.label}: ${source.implication}`),
    ...medical.cautions,
    state.healthcareUse === "uncertain"
      ? "A clearer estimate of likely healthcare use could change the medical-plan comparison."
      : "A material change in expected healthcare use could change the medical-plan comparison.",
    state.otherCoverageAvailable === "yes"
      ? "Another employer plan is available, so household premiums, spouse surcharges, networks, and account eligibility could change the preferred election."
      : state.otherCoverageAvailable === "unknown"
        ? "Whether another employer plan is available has not been confirmed."
        : "A future change in other household coverage could change this decision.",
    protectionVerifications.length
      ? `The following elections remain verification-sensitive: ${protectionVerifications.join(", ")}.`
      : "New benefit costs or exclusions could change protection and supplemental elections.",
    state.finalReviewAcknowledged ? "" : "The final review and submission checklist have not been acknowledged.",
  ]);

  const verificationRequired =
    verificationItems.length > 0 ||
    sourceCoverage.missing > 0 ||
    sourceCoverage.unknown > 0 ||
    medical.status === "incomplete" ||
    medical.status === "verification-first";

  const status: DecisionTraceStatus = verificationRequired
    ? "verification-required"
    : state.finalReviewAcknowledged
      ? "supported"
      : "provisional";

  const label =
    status === "supported"
      ? "Supported planning record"
      : status === "provisional"
        ? "Provisional planning record"
        : "Verification required";

  const summary =
    status === "supported"
      ? "The recorded election plan is supported by the entered structured values and has no generated verification items. Official enrollment materials and the employer portal still control."
      : status === "provisional"
        ? "The structured comparison is complete enough to review, but the final acknowledgement has not been completed."
        : `The current plan has ${verificationItems.length} generated verification item${verificationItems.length === 1 ? "" : "s"} and should not be treated as final.`;

  return {
    status,
    label,
    summary,
    sourceCoverage,
    sourceLedger,
    drivers,
    assumptions,
    changeTriggers,
    verificationItems,
  };
};
