export type PaidProductStatus = "private_ready" | "launch_ready" | "live";

export type PaidProduct = {
  id: string;
  name: string;
  shortName: string;
  audience: string;
  promise: string;
  standardPrice: number;
  launchPrice: number;
  status: PaidProductStatus;
  checkoutEnabled: boolean;
  checkoutUrl: string;
  checkoutEnvKey: string;
  publicFoundation: Array<{ label: string; href: string }>;
  includedAssets: string[];
  premiumModules: string[];
  limitations: string;
};

export const PAID_PRODUCT_LAUNCH_GATES = [
  "Consistent non-founder traffic and repeated use of the related free tools",
  "Qualified early-access interest for the specific product",
  "Vercel Pro activated with spending controls",
  "Lemon Squeezy merchant approval and payout verification",
  "Final product files uploaded to hosted delivery",
  "Terms, disclosures, refund policy, privacy language, and support expectations reviewed",
  "Successful test checkout, receipt, download, refund, and support flow",
  "Privacy-safe conversion and purchase analytics verified",
  "Explicit founder approval to change the product to launch_ready",
] as const;

export const PAID_PRODUCTS: PaidProduct[] = [
  {
    id: "healthcare_worker_career_benefits_decision_system",
    name: "Healthcare Worker Career & Benefits Decision System",
    shortName: "Healthcare Career & Benefits System",
    audience: "Nurses and other employed healthcare workers comparing jobs, schedules, or annual benefit choices.",
    promise:
      "Turn pay, benefits, schedule burden, repayment risk, unresolved HR questions, and career trajectory into one documented decision before accepting or resigning.",
    standardPrice: 39,
    launchPrice: 29,
    status: "private_ready",
    checkoutEnabled: false,
    checkoutUrl: "",
    checkoutEnvKey: "VITE_LEMON_SQUEEZY_HEALTHCARE_PRODUCT_URL",
    publicFoundation: [
      { label: "Total compensation comparison", href: "/tools/healthcare-worker-total-compensation-comparison" },
      { label: "Healthcare worker benefits blueprint", href: "/tools/healthcare-worker-benefits-blueprint" },
      { label: "Employer benefits action plan", href: "/tools/employer-benefits-action-plan" },
      { label: "403(b) paycheck calculator", href: "/tools/403b-paycheck-calculator" },
      { label: "Open enrollment guide", href: "/open-enrollment" },
    ],
    includedAssets: [
      "Career and benefits decision workbook",
      "Total-compensation input sheet and print-certified comparison result",
      "Three-scenario health-plan true-cost worksheet",
      "Retirement match and vesting worksheet",
      "Schedule, commute, call, travel, and unpaid-time audit",
      "PTO, leave, disability, and protection audit",
      "Sign-on, tuition, relocation, and repayment-risk worksheet",
      "HR verification tracker and email scripts",
      "Negotiation planner and written-request scripts",
      "Final decision memo and resignation-readiness checklist",
      "30/60/90-day role reality check",
      "Reusable annual benefits review checklist",
    ],
    premiumModules: [
      "Decision setup and document collection",
      "Whole-offer compensation comparison",
      "Low-, expected-, and high-use health-plan scenarios",
      "Retirement match, eligibility, and vesting risk",
      "Schedule and annual time-cost audit",
      "PTO, disability, leave, and insurance protections",
      "Bonus and repayment-obligation review",
      "Career trajectory and role-risk review",
      "Written verification plan",
      "Negotiation preparation",
      "Transition and first-90-day plan",
      "Annual review and benefits-change workflow",
    ],
    limitations:
      "The system organizes user-supplied facts and estimates. It does not recommend an employer, determine legal overtime status, predict taxes, interpret plan documents as legal advice, or guarantee negotiation outcomes.",
  },
  {
    id: "medical_bill_response_resolution_system",
    name: "Medical Bill Response & Resolution System",
    shortName: "Medical Bill Response System",
    audience: "Patients, caregivers, spouses, and adult children organizing a confusing medical-bill process.",
    promise:
      "Keep bills, EOBs, claims, calls, written requests, assistance applications, denials, deadlines, collections, payment options, and caregiver handoffs in one controlled system.",
    standardPrice: 29,
    launchPrice: 19,
    status: "private_ready",
    checkoutEnabled: false,
    checkoutUrl: "",
    checkoutEnvKey: "VITE_LEMON_SQUEEZY_MEDICAL_BILL_PRODUCT_URL",
    publicFoundation: [
      { label: "Medical Bill Response System", href: "/insurance/medical-bill-review-toolkit" },
      { label: "Medical bill review flow", href: "/tools/medical-bill-review-flow" },
      { label: "EOB-to-bill match checker", href: "/tools/eob-to-bill-match-checker" },
      { label: "Free Medical Bill Response Pack", href: "/downloads/medical-bill-response-pack.html" },
      { label: "Expanded workbook sample", href: "/downloads/expanded-medical-bill-response-workbook-preview.html" },
    ],
    includedAssets: [
      "32-page Expanded Medical Bill Response Workbook",
      "Premium case-command dashboard",
      "One-visit bill and billing-entity map",
      "EOB-to-bill comparison worksheets",
      "Provider and insurer contact-preparation sheets",
      "Written-request and communication-template library",
      "Financial-assistance application tracker",
      "Denial and appeal control packet",
      "Collections-response organizer",
      "Payment-plan comparison sheet",
      "Caregiver coordination and handoff packet",
      "Deadline and escalation calendar",
      "Case-closure checklist",
      "Existing 10-page free Response Pack as a quick-start companion",
    ],
    premiumModules: [
      "Case command page",
      "Complete document inventory",
      "One-visit bill map",
      "EOB-to-bill comparison",
      "Provider contact preparation",
      "Insurer contact preparation",
      "Written request library",
      "Financial-assistance workflow",
      "Denial and appeal control",
      "Collections preparation",
      "Payment-plan comparison",
      "Caregiver coordination",
      "Deadline and escalation calendar",
      "Case closure and proof retention",
    ],
    limitations:
      "The system organizes a process. It does not determine what someone legally owes, review coding or clinical records, negotiate with providers or insurers, provide legal or medical advice, or guarantee savings, coverage, assistance, or appeal success.",
  },
];

export const PAID_PRODUCT_BUNDLE = {
  id: "healthcare_money_decision_library",
  name: "Healthcare Money Decision Library",
  includedProductIds: PAID_PRODUCTS.map((product) => product.id),
  standardPrice: 59,
  launchPrice: 39,
  status: "private_ready" as const,
  checkoutEnabled: false,
  checkoutUrl: "",
  checkoutEnvKey: "VITE_LEMON_SQUEEZY_PRODUCT_BUNDLE_URL",
};

export const isPrivateProductLabEnabled = () =>
  import.meta.env.VITE_ENABLE_PRIVATE_PRODUCT_LAB === "true";

export const isPaidCommerceEnabled = () =>
  import.meta.env.VITE_ENABLE_PAID_PRODUCTS === "true" &&
  PAID_PRODUCTS.every((product) => product.status !== "private_ready" && product.checkoutEnabled && product.checkoutUrl.length > 0) &&
  PAID_PRODUCT_BUNDLE.status !== "private_ready" &&
  PAID_PRODUCT_BUNDLE.checkoutEnabled &&
  PAID_PRODUCT_BUNDLE.checkoutUrl.length > 0;
