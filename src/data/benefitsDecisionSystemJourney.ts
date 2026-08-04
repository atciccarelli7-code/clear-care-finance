export type BenefitsDecisionJourneyStep = {
  id: "prepare" | "sources" | "confirm" | "situation" | "brief";
  number: number;
  title: string;
  summary: string;
  userAction: string;
  systemAction: string;
};

export type BenefitsDecisionDocument = {
  id:
    | "benefits-guide"
    | "medical-plan-materials"
    | "prescription-network-materials"
    | "retirement-materials"
    | "protection-leave-materials"
    | "comparison-materials";
  title: string;
  description: string;
  required: boolean;
};

export type BenefitsDecisionSituationItem = {
  id:
    | "coverage-household"
    | "healthcare-use-pattern"
    | "verification-needs"
    | "budget-risk"
    | "decision-priorities"
    | "employment-horizon";
  title: string;
  description: string;
};

export const benefitsDecisionJourneySteps: BenefitsDecisionJourneyStep[] = [
  {
    id: "prepare",
    number: 1,
    title: "Know what decision you are making",
    summary: "Choose the decision deadline and whether you are reviewing one employer, comparing offers, or coordinating coverage with a spouse or partner.",
    userAction: "Name the decision and bring the current plan-year materials that apply to you.",
    systemAction: "Build the correct path and hide questions that do not affect this decision.",
  },
  {
    id: "sources",
    number: 2,
    title: "Provide the controlling documents",
    summary: "Use current official employer or plan materials that you are entitled to possess. Public employer links may be attached as references when available.",
    userAction: "Identify the benefits guide, medical plan materials, rates, retirement terms, and other documents relevant to the decision.",
    systemAction: "Organize each source by employer, plan year, employee group, document type, and verification status.",
  },
  {
    id: "confirm",
    number: 3,
    title: "Confirm the important facts",
    summary: "The system should never silently treat extracted or public-source information as correct for your exact employee population.",
    userAction: "Confirm consequential values such as premiums, deductibles, employer contributions, eligibility, and vesting.",
    systemAction: "Show the source, page, original language, confidence, and whether each fact is confirmed or still unresolved.",
  },
  {
    id: "situation",
    number: 4,
    title: "Answer questions about your situation",
    summary: "Plain-language questions connect the plan documents to the household, financial risk, work pattern, and priorities that actually change the decision.",
    userAction: "Describe the coverage tier, general use pattern, budget tolerance, priorities, and expected employment horizon.",
    systemAction: "Run only the relevant scenarios and explain why each question changes the comparison.",
  },
  {
    id: "brief",
    number: 5,
    title: "Review the decision before acting",
    summary: "Finish with a source-backed decision brief rather than an unexplained score or universal recommendation.",
    userAction: "Resolve warnings, review assumptions, choose the election, and retain the brief with enrollment records.",
    systemAction: "Separate confirmed facts, estimates, tradeoffs, unresolved questions, deadlines, and official verification steps.",
  },
];

export const benefitsDecisionDocuments: BenefitsDecisionDocument[] = [
  {
    id: "benefits-guide",
    title: "Current benefits guide or employee benefits summary",
    description: "The plan-year guide that applies to the employee group, region, union status, or facility involved in the decision.",
    required: true,
  },
  {
    id: "medical-plan-materials",
    title: "Medical plan rates and Summary of Benefits and Coverage",
    description: "Payroll premiums, coverage tiers, SBCs, HSA or HRA funding, surcharges, and any separate pharmacy cost-sharing summary.",
    required: true,
  },
  {
    id: "prescription-network-materials",
    title: "Prescription and network verification resources",
    description: "Current formulary and provider-directory resources—not medical records, claims, member IDs, or account credentials.",
    required: false,
  },
  {
    id: "retirement-materials",
    title: "Retirement plan and vesting materials",
    description: "Match formula, non-elective contributions, eligibility, waiting periods, vesting schedule, and plan summary documents.",
    required: true,
  },
  {
    id: "protection-leave-materials",
    title: "Leave, disability, life, and other benefit summaries",
    description: "PTO, parental leave, short- and long-term disability, life insurance, tuition support, and other benefits that may change the decision.",
    required: false,
  },
  {
    id: "comparison-materials",
    title: "Other offer or household plan materials",
    description: "A second offer, spouse or partner plan, or current coverage summary when the decision requires a comparison.",
    required: false,
  },
];

export const benefitsDecisionSituationItems: BenefitsDecisionSituationItem[] = [
  {
    id: "coverage-household",
    title: "Who needs coverage",
    description: "Employee only, employee plus spouse or partner, children, or family coverage—and whether another employer plan is available.",
  },
  {
    id: "healthcare-use-pattern",
    title: "General healthcare-use pattern",
    description: "A low-, expected-, or higher-use planning pattern without requiring diagnoses, records, claims, or detailed medical history.",
  },
  {
    id: "verification-needs",
    title: "What must be verified",
    description: "Whether specific prescriptions, clinicians, facilities, therapies, or services need confirmation—without collecting their names in the public preparation flow.",
  },
  {
    id: "budget-risk",
    title: "Cash-flow and risk tolerance",
    description: "Whether the household prioritizes predictable payroll deductions, lower expected cost, tax advantages, or protection from a high-cost year.",
  },
  {
    id: "decision-priorities",
    title: "Personal priorities",
    description: "Network access, prescription coverage, retirement value, leave, disability protection, schedule, or other factors that matter most.",
  },
  {
    id: "employment-horizon",
    title: "Expected employment horizon",
    description: "How long the employee expects to stay, because waiting periods and vesting can change the value of a benefit package.",
  },
];

export const benefitsDecisionSystemBoundary = {
  currentRelease: "Preparation, source identification, guided comparison, verification planning, and decision-brief architecture.",
  uploadGate: "Private document upload, storage, extraction, and deletion are not activated until access control, encryption, malware scanning, retention, deletion, source citation, and incident-response controls are separately certified.",
  controllingDocuments: "Official employer, carrier, and plan documents control. CAF organizes user-provided information and planning estimates; it does not replace the employer, plan administrator, carrier, attorney, tax professional, or licensed adviser.",
  prohibitedData: [
    "Social Security numbers",
    "financial account or card numbers",
    "insurance member IDs",
    "account credentials",
    "claims or EOBs",
    "medical records or diagnoses",
    "full pay statements",
    "documents the user is not authorized to possess",
  ],
} as const;
