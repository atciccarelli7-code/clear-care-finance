export const MEDICAL_BILL_WORKBOOK_ROUTE = "/products/expanded-medical-bill-response-workbook";
export const MEDICAL_BILL_RESPONSE_SYSTEM_ROUTE = "/insurance/medical-bill-review-toolkit";
export const MEDICAL_BILL_FREE_PACK_ROUTE = "/downloads/medical-bill-response-pack.html";

const configuredCheckoutUrl = String(
  import.meta.env.VITE_MEDICAL_BILL_WORKBOOK_CHECKOUT_URL ?? "",
).trim();

const isSecureHostedCheckout = (value: string) => {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const medicalBillWorkbook = {
  id: "expanded_medical_bill_response_workbook",
  name: "Expanded Medical Bill Response Workbook",
  shortName: "Expanded Medical Bill Workbook",
  priceUsd: 24,
  priceLabel: "$24 one-time",
  route: MEDICAL_BILL_WORKBOOK_ROUTE,
  checkoutUrl: isSecureHostedCheckout(configuredCheckoutUrl)
    ? configuredCheckoutUrl
    : "",
  checkoutEnabled: isSecureHostedCheckout(configuredCheckoutUrl),
  version: "1.0",
  releaseLabel: "July 2026",
  pageCount: 32,
  audience: "Patients, caregivers, spouses, and adult children organizing a medical-bill response.",
  promise:
    "Keep bills, EOBs, calls, deadlines, written requests, assistance records, and next actions in one calm system.",
  notFor:
    "It does not determine what you owe, review coding, negotiate a bill, represent you, or guarantee a result.",
  previewPages: [
    {
      number: 3,
      title: "First 15-minute response",
      description: "Reduce the issue to one document, one deadline, one owner, and one next action.",
    },
    {
      number: 8,
      title: "EOB-to-bill comparison",
      description: "Compare only matching service dates and billing entities without calculating a legal balance.",
    },
    {
      number: 17,
      title: "Denial notice decoder",
      description: "Capture the exact reason, policy language, submission instructions, and deadline.",
    },
    {
      number: 20,
      title: "Financial-assistance organizer",
      description: "Track the written policy, covered entities, documents, account hold, and decision date.",
    },
    {
      number: 23,
      title: "Deadline tracker",
      description: "Control follow-ups using dates taken from notices, policies, and written instructions.",
    },
    {
      number: 32,
      title: "Case summary and next action",
      description: "Close the loop with a current status, unresolved question, owner, deadline, and next step.",
    },
  ],
  sections: [
    {
      title: "Identify and map the problem",
      items: [
        "Document inventory",
        "One-visit and multiple-bill maps",
        "Claim and bill status summary",
        "Facility versus professional organizer",
      ],
    },
    {
      title: "Prepare calls and written requests",
      items: [
        "Provider and insurer call preparation",
        "Reusable call logs",
        "Secure-message tracking",
        "Itemized-bill request template",
      ],
    },
    {
      title: "Control denials, authorization, and assistance",
      items: [
        "Denial notice decoder",
        "Appeal-document organizer",
        "Prior-authorization breakdown",
        "Financial-assistance and hospital-policy organizers",
      ],
    },
    {
      title: "Coordinate payment and follow-through",
      items: [
        "Collections-response organizer",
        "Deadline tracker",
        "Caregiver coordination",
        "Payment-plan comparison and questions-before-paying sheet",
      ],
    },
    {
      title: "Use bounded scenario pathways",
      items: [
        "EOB and bill mismatch",
        "Claim still pending",
        "Unexpected out-of-network charge",
        "Self-pay estimate mismatch",
      ],
    },
  ],
} as const;

export type MedicalBillProductSource =
  | "medical_bill_response_system"
  | "free_response_pack"
  | "eob_article"
  | "financial_assistance_article"
  | "facility_fee_article"
  | "prior_authorization_article"
  | "patient_gateway"
  | "product_page";
