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
  publicFoundation: Array<{ label: string; href: string }>;
  includedAssets: string[];
  premiumModules: string[];
  limitations: string;
  validationOffer?: {
    name: string;
    route: string;
    status: "early_access_preparation";
  };
};

export type PaidProductBundle = {
  id: string;
  name: string;
  includedProductIds: string[];
  standardPrice: number;
  launchPrice: number;
  status: PaidProductStatus;
  checkoutEnabled: boolean;
  checkoutUrl: string;
};

export const PAID_PRODUCT_LAUNCH_GATES = [
  "Consistent non-founder traffic and repeated use of the related free tools",
  "Qualified early-access interest for the specific product",
  "Supabase authentication, database migrations, and row-level security verified",
  "Stripe account, test product, one-time test price, and signed webhook verified",
  "Protected module content seeded to the server-only store and boundary-tested",
  "Terms, disclosures, refund policy, privacy language, and support expectations reviewed",
  "Successful test checkout, receipt, authenticated access, refund, and support flow",
  "Privacy-safe conversion and purchase analytics verified",
  "Explicit founder approval to change the product to launch_ready",
] as const;

export const PAID_PRODUCTS: PaidProduct[] = [
  {
    id: "healthcare-worker-benefits-decision-system",
    name: "Healthcare Worker Benefits Decision System",
    shortName: "Benefits Decision System",
    audience: "Nurses and other employed healthcare workers comparing jobs, schedules, or annual benefit choices.",
    promise:
      "Turn pay, benefits, schedule burden, repayment risk, unresolved HR questions, and career trajectory into one documented decision before accepting or resigning.",
    standardPrice: 39,
    launchPrice: 29,
    status: "private_ready",
    checkoutEnabled: false,
    checkoutUrl: "",
    publicFoundation: [
      { label: "Total compensation comparison", href: "/tools/healthcare-worker-total-compensation-comparison" },
      { label: "Healthcare worker benefits blueprint", href: "/tools/healthcare-worker-benefits-blueprint" },
      { label: "Employer benefits action plan", href: "/tools/employer-benefits-action-plan" },
      { label: "403(b) paycheck calculator", href: "/tools/403b-paycheck-calculator" },
      { label: "Open enrollment guide", href: "/open-enrollment" },
    ],
    includedAssets: [
      "Account-based interactive decision workspace",
      "Saved compensation and benefits comparison",
      "Low-, expected-, and high-use health-plan scenarios",
      "Retirement match and vesting analysis",
      "Schedule, career, and quality-of-life tradeoff assessment",
      "Automatically generated verification list",
      "Browser-based printable Benefits Decision Brief",
    ],
    premiumModules: [
      "Define the decision",
      "Compare compensation",
      "Value workplace benefits",
      "Stress-test health-plan exposure",
      "Evaluate retirement benefits",
      "Measure schedule and career tradeoffs",
      "Build the verification list",
      "Generate the decision brief",
    ],
    limitations:
      "The system organizes user-supplied facts and estimates. It does not recommend an employer, determine legal overtime status, predict taxes, interpret plan documents as legal advice, or guarantee negotiation outcomes.",
    validationOffer: {
      name: "Healthcare Worker Benefits Decision System",
      route: "/products/healthcare-worker-benefits-decision-system",
      status: "early_access_preparation",
    },
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

export const PAID_PRODUCT_BUNDLE: PaidProductBundle = {
  id: "healthcare_money_decision_library",
  name: "Healthcare Money Decision Library",
  includedProductIds: PAID_PRODUCTS.map((product) => product.id),
  standardPrice: 59,
  launchPrice: 39,
  status: "private_ready",
  checkoutEnabled: false,
  checkoutUrl: "",
};

export const isPrivateProductLabEnabled = () =>
  import.meta.env.VITE_ENABLE_PRIVATE_PRODUCT_LAB === "true";

export const isPaidCommerceEnabled = () =>
  false;
