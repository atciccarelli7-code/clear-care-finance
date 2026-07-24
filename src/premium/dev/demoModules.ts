import type { PremiumModuleDefinition } from "../contracts.js";

export const DEVELOPMENT_CONTENT_SENTINEL = "CAF_PREMIUM_DEVELOPMENT_CONTENT_SENTINEL_84f6c1d9";

const privacyHelp = "Use generic labels only. Do not enter identifiers, medical details, account numbers, or confidential employer information.";
const benefitTypes = [
  ["health-contribution", "Employer health-plan contribution"],
  ["retirement-match", "Retirement match"],
  ["retirement-contribution", "Employer retirement contribution"],
  ["pto", "Paid time off"],
  ["disability", "Disability insurance"],
  ["life", "Life insurance"],
  ["education", "Education assistance"],
  ["loan-repayment", "Loan repayment"],
  ["certification", "Certification support"],
  ["other-benefits", "Other employer benefits"],
] as const;
const benefitFields: PremiumModuleDefinition["fields"] = benefitTypes.flatMap(([id, label]) => [
  { id: `${id}-value`, label: `${label} — annual value`, type: "currency", min: 0, group: "shared" },
  {
    id: `${id}-status`,
    label: `${label} — value status`,
    type: "select",
    options: [
      { value: "known", label: "Known value" },
      { value: "estimated", label: "Estimated value" },
      { value: "unknown", label: "Unknown value" },
      { value: "non-cash", label: "Non-cash value" },
    ],
    group: "shared",
  },
]);

export const developmentDemoModules: PremiumModuleDefinition[] = [
  {
    key: "define-decision",
    number: 1,
    title: "Define the decision",
    summary: "Name the two choices, deadline, priorities, constraints, and must-have requirements.",
    education: ["A clear decision statement makes later tradeoffs easier to audit.", privacyHelp],
    fields: [
      { id: "current-role", label: "Current role or offer", type: "text", required: true, sensitiveReminder: true, group: "optionA" },
      { id: "alternative-role", label: "Alternative role or offer", type: "text", required: true, sensitiveReminder: true, group: "optionB" },
      { id: "decision-deadline", label: "Decision deadline", type: "date", required: true, group: "shared" },
      { id: "priorities", label: "Top priorities", type: "textarea", sensitiveReminder: true, group: "shared" },
      { id: "constraints", label: "Known constraints", type: "textarea", sensitiveReminder: true, group: "shared" },
      { id: "must-haves", label: "Must-have requirements", type: "textarea", sensitiveReminder: true, group: "shared" },
      { id: "reasons", label: "Reasons for considering the decision", type: "textarea", sensitiveReminder: true, group: "shared" },
      { id: "assumptions", label: "Key assumptions (one per line)", type: "textarea", sensitiveReminder: true, group: "shared" },
    ],
    verificationTemplates: [],
  },
  {
    key: "compare-compensation",
    number: 2,
    title: "Compare compensation",
    summary: "Estimate annual gross compensation while separating base pay from conditional assumptions.",
    education: ["Estimates are planning inputs, not guaranteed compensation."],
    fields: [
      { id: "pay-type", label: "Pay type", type: "select", options: [{ value: "hourly", label: "Hourly" }, { value: "salary", label: "Salary" }], required: true, group: "shared" },
      { id: "base-pay", label: "Hourly rate or annual salary", type: "currency", required: true, min: 0, group: "shared" },
      { id: "annual-hours", label: "Expected annual regular hours", type: "number", min: 0, group: "shared" },
      { id: "overtime-hours", label: "Expected annual overtime hours", type: "number", min: 0, group: "shared" },
      { id: "overtime-multiplier", label: "Overtime pay multiplier", type: "number", min: 1, max: 5, step: 0.01, group: "shared" },
      { id: "shift-differential", label: "Shift differential per hour", type: "currency", min: 0, group: "shared" },
      { id: "differential-hours", label: "Expected annual differential-eligible hours", type: "number", min: 0, group: "shared" },
      { id: "bonus", label: "Expected bonus", type: "currency", min: 0, group: "shared" },
      { id: "call-pay", label: "Expected annual call pay", type: "currency", min: 0, group: "shared" },
      { id: "weekend-holiday", label: "Expected weekend or holiday pay", type: "currency", min: 0, group: "shared" },
    ],
    verificationTemplates: [{ fieldId: "call-pay", audience: "recruiter", question: "Is call pay included in the compensation amount provided, and which call hours qualify?" }],
  },
  {
    key: "value-benefits",
    number: 3,
    title: "Value workplace benefits",
    summary: "Separate known, estimated, unknown, and non-cash employer benefits.",
    education: ["A valuable benefit may still require eligibility, use, or retention conditions."],
    fields: benefitFields,
    verificationTemplates: [{ fieldId: "health-contribution-status", audience: "benefits-department", question: "Does the employer health-plan contribution change by coverage tier?" }],
  },
  {
    key: "health-plan-exposure",
    number: 4,
    title: "Stress-test health-plan exposure",
    summary: "Compare low-, expected-, and high-use planning scenarios.",
    education: ["This tool does not determine official coverage, network status, medical necessity, claim liability, or plan interpretation."],
    fields: [
      { id: "annual-premium", label: "Annual employee premium", type: "currency", min: 0, group: "shared" },
      { id: "deductible", label: "Deductible", type: "currency", min: 0, group: "shared" },
      { id: "coinsurance", label: "Coinsurance", type: "percent", min: 0, max: 100, group: "shared" },
      { id: "copays", label: "Estimated annual copays", type: "currency", min: 0, group: "shared" },
      { id: "oop-max", label: "Out-of-pocket maximum", type: "currency", min: 0, group: "shared" },
      { id: "employer-account", label: "Employer HSA or HRA contribution", type: "currency", min: 0, group: "shared" },
      { id: "expected-allowed-costs", label: "Expected covered allowed costs", type: "currency", min: 0, group: "shared" },
    ],
    verificationTemplates: [{ fieldId: "expected-allowed-costs", audience: "plan-document", question: "Are the requested providers and facilities in network under this exact plan?" }],
  },
  {
    key: "retirement-benefits",
    number: 5,
    title: "Evaluate retirement benefits",
    summary: "Separate employee contributions, employer value, waiting periods, vesting, and forfeiture risk.",
    education: ["Immediately vested value and conditional value are shown separately."],
    fields: [
      { id: "eligible-compensation", label: "Eligible annual compensation", type: "currency", min: 0, group: "shared" },
      { id: "employee-contribution", label: "Employee contribution", type: "percent", min: 0, max: 100, group: "shared" },
      { id: "match-percent", label: "Employer match rate", type: "percent", min: 0, max: 200, group: "shared" },
      { id: "match-limit", label: "Compensation eligible for match", type: "percent", min: 0, max: 100, group: "shared" },
      { id: "nonelective", label: "Employer nonelective contribution", type: "percent", min: 0, max: 100, group: "shared" },
      { id: "waiting-period", label: "Eligibility waiting period (months)", type: "number", min: 0, group: "shared" },
      { id: "vested-percent", label: "Currently vested", type: "percent", min: 0, max: 100, group: "shared" },
    ],
    verificationTemplates: [
      { fieldId: "waiting-period", audience: "retirement-administrator", question: "When does retirement matching begin?" },
      { fieldId: "vested-percent", audience: "retirement-administrator", question: "Is the employer contribution immediately vested?" },
    ],
  },
  {
    key: "schedule-career",
    number: 6,
    title: "Measure schedule and career tradeoffs",
    summary: "Record work-pattern, burden, quality-of-life, and career factors without false precision.",
    education: ["Scores show the formula and organize your ratings; they are not objective recommendations."],
    fields: [
      ...["weekly-hours", "shift-length", "nights", "weekends", "holidays", "call-burden", "commute", "schedule-predictability", "physical-burden", "emotional-burden", "career-development", "advancement", "transferable-skills", "quality-of-life"].map((id) => ({
        id,
        label: id.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" "),
        type: id === "weekly-hours" || id === "shift-length" || id === "commute" ? "number" as const : "rating" as const,
        min: 0,
        max: id === "weekly-hours" ? 100 : id === "commute" ? 300 : 5,
        group: "shared" as const,
      })),
    ],
    verificationTemplates: [{ fieldId: "schedule-predictability", audience: "hiring-manager", question: "How far in advance is the schedule usually finalized, and how often does it change?" }],
  },
  {
    key: "verification-list",
    number: 7,
    title: "Build the verification list",
    summary: "Turn unknown or incomplete information into professional questions for the right source.",
    education: ["Ask for written answers and retain the controlling plan or employment document."],
    fields: [
      { id: "verification-notes", label: "Additional verification items", type: "textarea", sensitiveReminder: true, group: "shared" },
    ],
    verificationTemplates: [
      { fieldId: "annual-hours", audience: "human-resources", question: "What hours count toward benefit eligibility?" },
      { fieldId: "health-contribution", audience: "benefits-department", question: "Does the employer contribution change by coverage tier?" },
    ],
  },
  {
    key: "decision-brief",
    number: 8,
    title: "Generate the decision brief",
    summary: "Review the comparison, unknowns, assumptions, observations, and your final selected decision.",
    education: ["The system organizes your information; you make the decision."],
    fields: [
      { id: "final-decision", label: "Final user-selected decision", type: "textarea", required: true, sensitiveReminder: true, group: "shared" },
      { id: "decision-date", label: "Decision date", type: "date", required: true, group: "shared" },
    ],
    verificationTemplates: [],
  },
];

export const getDevelopmentDemoModule = (key: string) =>
  developmentDemoModules.find((module) => module.key === key);
