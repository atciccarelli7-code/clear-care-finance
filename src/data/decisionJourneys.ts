export type DecisionJourneyLayer = "immediate-answer" | "complete-explanation" | "personalized-support" | "action-plan" | "verification-escalation";

export type DecisionJourney = {
  id: string;
  audiences: string[];
  primaryQuestion: string;
  canonicalPath: string;
  relatedPaths: string[];
  toolPaths: string[];
  officialVerification: Array<{ label: string; url: string }>;
  requiredLayers: DecisionJourneyLayer[];
  supportsLocalProgress: boolean;
};

const FIVE_LAYERS: DecisionJourneyLayer[] = [
  "immediate-answer",
  "complete-explanation",
  "personalized-support",
  "action-plan",
  "verification-escalation",
];

export const DECISION_JOURNEYS: DecisionJourney[] = [
  {
    id: "healthcare-worker-wealth",
    audiences: ["healthcare-workers"],
    primaryQuestion: "What should I do with my available money, and in what order?",
    canonicalPath: "/build-wealth",
    relatedPaths: ["/healthcare-workers", "/articles/healthcare-worker-money-map"],
    toolPaths: ["/tools/403b-paycheck-calculator", "/tools/employer-benefits-action-plan"],
    officialVerification: [{ label: "IRS retirement plans", url: "https://www.irs.gov/retirement-plans" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "workplace-open-enrollment",
    audiences: ["healthcare-workers", "employees", "families"],
    primaryQuestion: "Which workplace benefit elections should I submit?",
    canonicalPath: "/open-enrollment",
    relatedPaths: ["/insurance", "/tools/benefits-command-center"],
    toolPaths: ["/tools/open-enrollment-true-cost-calculator", "/tools/employer-benefits-action-plan"],
    officialVerification: [{ label: "HealthCare.gov plan costs", url: "https://www.healthcare.gov/choose-a-plan/your-total-costs/" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "medical-bills",
    audiences: ["patients", "caregivers", "families"],
    primaryQuestion: "What is wrong with this medical bill, and what should I do next?",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
    relatedPaths: ["/topics/patient-medical-costs"],
    toolPaths: ["/tools/medical-bill-review-flow", "/tools/eob-to-bill-match-checker", "/tools/prior-authorization-next-step-guide"],
    officialVerification: [{ label: "CMS medical bill rights", url: "https://www.cms.gov/medical-bill-rights" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "hospital-discharge",
    audiences: ["patients", "caregivers", "families", "healthcare-workers"],
    primaryQuestion: "What must be arranged and verified before the patient leaves the hospital?",
    canonicalPath: "/insurance/hospital-discharge-coverage",
    relatedPaths: ["/guides/hospital-discharge-medicare"],
    toolPaths: ["/tools/hospital-discharge-medicare-checklist", "/tools/prior-authorization-next-step-guide"],
    officialVerification: [{ label: "Medicare coverage", url: "https://www.medicare.gov/what-medicare-covers" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "turning-65-medicare",
    audiences: ["patients", "caregivers", "families"],
    primaryQuestion: "What Medicare actions must I take, and when?",
    canonicalPath: "/medicare-care-costs/turning-65",
    relatedPaths: ["/medicare-care-costs", "/insurance/medicare-advantage-vs-medigap"],
    toolPaths: ["/tools/medicare-medicaid-eligibility-check", "/tools/medicare-advantage-plan-helper"],
    officialVerification: [
      { label: "Medicare sign-up timing", url: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare" },
      { label: "Social Security Medicare enrollment", url: "https://www.ssa.gov/medicare/sign-up" },
    ],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "medicare-plan-comparison",
    audiences: ["patients", "caregivers", "families"],
    primaryQuestion: "Should I use Original Medicare or Medicare Advantage?",
    canonicalPath: "/insurance/medicare-advantage",
    relatedPaths: ["/insurance/medicare-advantage-vs-medigap", "/medicare-care-costs"],
    toolPaths: ["/tools/medicare-advantage-plan-helper"],
    officialVerification: [{ label: "Medicare Plan Finder", url: "https://www.medicare.gov/plan-compare/" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "student-loans",
    audiences: ["healthcare-workers"],
    primaryQuestion: "Which federal or private student-loan path applies now?",
    canonicalPath: "/student-loans",
    relatedPaths: ["/healthcare-workers"],
    toolPaths: ["/tools#student-loan-path", "/tools#pslf-progress", "/tools#private-loan-payoff"],
    officialVerification: [{ label: "Federal Student Aid", url: "https://studentaid.gov/" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "healthcare-career-decisions",
    audiences: ["healthcare-workers"],
    primaryQuestion: "Should I accept this healthcare role or remain in my current position?",
    canonicalPath: "/healthcare-workers/career-decisions",
    relatedPaths: ["/healthcare-workers", "/articles/how-healthcare-workers-should-compare-job-offers"],
    toolPaths: ["/tools/healthcare-worker-total-compensation-comparison", "/tools/benefits-command-center"],
    officialVerification: [{ label: "BLS occupational information", url: "https://www.bls.gov/ooh/healthcare/" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "childcare-benefits",
    audiences: ["healthcare-workers", "families"],
    primaryQuestion: "Which employer and tax benefits can reduce my childcare burden?",
    canonicalPath: "/open-enrollment",
    relatedPaths: ["/articles/health-fsa-vs-dependent-care-fsa", "/articles/backup-care-plans-for-busy-healthcare-workers"],
    toolPaths: ["/tools/benefits-command-center"],
    officialVerification: [{ label: "IRS dependent care benefits", url: "https://www.irs.gov/publications/p503" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
  {
    id: "long-term-care-medicaid",
    audiences: ["patients", "caregivers", "families"],
    primaryQuestion: "Who may pay for ongoing daily care, and what should the family investigate?",
    canonicalPath: "/medicare-care-costs",
    relatedPaths: ["/articles/does-medicare-cover-long-term-care", "/insurance/hospital-discharge-coverage"],
    toolPaths: ["/tools/medicare-medicaid-eligibility-check"],
    officialVerification: [{ label: "Medicaid long-term services", url: "https://www.medicaid.gov/medicaid/long-term-services-supports/index.html" }],
    requiredLayers: FIVE_LAYERS,
    supportsLocalProgress: true,
  },
];

export const getDecisionJourney = (id: string) => DECISION_JOURNEYS.find((journey) => journey.id === id);
