export const MEDICAL_BILL_PRODUCT = {
  id: "expanded_medical_bill_response_workbook",
  name: "Expanded Medical Bill Response Workbook",
  status: "foundation" as const,
  version: "1.0",
  plannedPrice: 24,
  paymentEnabled: false,
  previewPath: "/downloads/expanded-medical-bill-response-workbook-preview.html",
  freeSystemPath: "/insurance/medical-bill-review-toolkit",
  freePackPath: "/downloads/medical-bill-response-pack.html",
  audience: "Patients, caregivers, spouses, and adult children organizing a confusing medical-bill process.",
  promise:
    "Keep bills, EOBs, calls, written requests, deadlines, assistance records, denials, and caregiver tasks in one structured system.",
  limitations:
    "The workbook organizes a process. It does not determine what someone owes, review coding, provide legal conclusions, negotiate a bill, or guarantee savings or appeal success.",
  includedSections: [
    "Document inventory and one-visit map",
    "EOB-to-bill line comparison worksheets",
    "Facility and professional bill organizer",
    "Provider and insurer call preparation and logs",
    "Written-request and itemized-bill templates",
    "Claim, denial, and prior-authorization organizers",
    "Financial-assistance and hospital-policy worksheets",
    "Collections, deadline, and follow-up control",
    "Caregiver coordination and payment-plan comparison",
    "Scenario action plans and official-source directory",
  ],
  previewSections: [
    "How to use the workbook safely",
    "First 15-minute medical-bill response",
    "EOB-to-bill comparison",
    "Provider call log",
    "Case summary and next action",
  ],
} as const;

export type MedicalBillProduct = typeof MEDICAL_BILL_PRODUCT;
