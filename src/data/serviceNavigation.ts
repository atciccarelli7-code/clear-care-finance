import type { NavigationDestinationId } from "@/lib/evidenceEventContract";

export type PrimaryNavigationItem = {
  to: string;
  label: string;
};

export type ServiceNavigationItem = {
  id: NavigationDestinationId;
  to: string;
  label: string;
  description: string;
  audience?: string;
};

export type ServiceNavigationGroup = {
  id: "start" | "healthcare_workers" | "patients_caregivers" | "coverage_learning";
  label: string;
  description: string;
  items: readonly ServiceNavigationItem[];
};

export const PRIMARY_NAVIGATION_ITEMS: readonly PrimaryNavigationItem[] = [
  { to: "/articles", label: "Articles" },
  { to: "/topics/hospital-economics", label: "Hospitals & Insurance" },
  { to: "/insurance", label: "Healthcare Costs" },
  { to: "/healthcare-workers", label: "Healthcare Workers" },
  { to: "/patients-families", label: "Patients & Caregivers" },
  { to: "/tools", label: "Guides & Tools" },
] as const;

export const SERVICE_NAVIGATION_GROUPS: readonly ServiceNavigationGroup[] = [
  {
    id: "start",
    label: "Read or find a starting point",
    description: "Browse the publication first, or use a guided starting point when the question is not clear yet.",
    items: [
      {
        id: "articles",
        to: "/articles",
        label: "Articles",
        description: "Read RN-led, source-backed explanations of healthcare money, incentives, insurance, and patient transitions.",
        audience: "Publication",
      },
      {
        id: "start_here",
        to: "/start-here",
        label: "Start Here",
        description: "Answer a few plain-English questions when you are not sure which topic or tool fits.",
      },
      {
        id: "all_tools",
        to: "/tools",
        label: "Free calculators and guides",
        description: "Browse every public calculator, checklist, comparison, and guided decision tool.",
      },
    ],
  },
  {
    id: "healthcare_workers",
    label: "Healthcare-worker decisions",
    description: "Prepare for open enrollment, compare compensation, and understand the benefits behind the paycheck.",
    items: [
      {
        id: "benefits_command_center",
        to: "/products/healthcare-worker-benefits-decision-system",
        label: "Benefits Decision System",
        description: "Use the free, browser-based workflow to organize an enrollment event without uploading confidential documents.",
        audience: "Free guided workflow",
      },
      {
        id: "benefits_change_detector",
        to: "/tools/benefits-change-detector",
        label: "Review benefit changes",
        description: "Compare plan-year documents and leave with a focused list of changes to verify.",
        audience: "Free open-enrollment tool",
      },
      {
        id: "total_compensation",
        to: "/tools/healthcare-worker-total-compensation-comparison",
        label: "Compare job offers",
        description: "Compare job offers beyond hourly pay, including benefits and schedule tradeoffs.",
        audience: "Free career tool",
      },
      {
        id: "paycheck_403b",
        to: "/tools/403b-paycheck-calculator",
        label: "403(b) Paycheck Calculator",
        description: "Estimate how a contribution change may affect retirement savings and take-home pay.",
        audience: "Free retirement tool",
      },
      {
        id: "career_decision_center",
        to: "/healthcare-workers/career-decisions",
        label: "Healthcare Career Decision Center",
        description: "Compare a career move through pay, schedule, benefits, growth, and quality-of-life tradeoffs.",
        audience: "Healthcare workers",
      },
    ],
  },
  {
    id: "patients_caregivers",
    label: "Patient and caregiver decisions",
    description: "Prepare questions and next actions for bills, denials, discharge, and follow-up care.",
    items: [
      {
        id: "hospital_patient_guide",
        to: "/patients-families/hospital-guide",
        label: "Hospital & Patient Guide",
        description: "Prepare for discharge, medicines, equipment, follow-up, coverage barriers, and caregiving.",
        audience: "Patients and caregivers",
      },
      {
        id: "medical_bill_review",
        to: "/medical-bills/financial-assistance",
        label: "Hospital Bill & Assistance",
        description: "Find a hospital financial-assistance policy and organize the bill, application, and verification steps.",
        audience: "Medical bills",
      },
      {
        id: "eob_bill_match",
        to: "/tools/eob-to-bill-match-checker",
        label: "EOB-to-Bill Match Checker",
        description: "Check whether a provider bill lines up with the explanation of benefits before paying.",
        audience: "Billing review",
      },
      {
        id: "prior_authorization",
        to: "/tools/prior-authorization-next-step-guide",
        label: "Prior Authorization Next Step",
        description: "Identify the next document, office, or question after an authorization delay or denial.",
        audience: "Coverage barriers",
      },
    ],
  },
  {
    id: "coverage_learning",
    label: "Subject hubs and guides",
    description: "Open a focused subject desk when you need broader context before choosing a practical utility.",
    items: [
      {
        id: "benefits_insurance",
        to: "/insurance",
        label: "Benefits & Insurance",
        description: "Understand plan documents, medical costs, open enrollment, bills, and coverage decisions.",
      },
      {
        id: "medicare_medicaid",
        to: "/medicare-care-costs",
        label: "Medicare & Medicaid",
        description: "Prepare for enrollment, costs, coverage verification, and hospital-to-home questions.",
      },
      {
        id: "open_enrollment",
        to: "/open-enrollment",
        label: "Open Enrollment",
        description: "Compare the documents, costs, and benefits that matter before making elections.",
      },
      {
        id: "quick_guides",
        to: "/guides",
        label: "Quick Guides",
        description: "Open calm, printable explanations for healthcare-finance decisions and conversations.",
      },
      {
        id: "topic_guides",
        to: "/topics/hospital-economics",
        label: "Hospital Economics",
        description: "Understand hospital prices, nonprofit status, reimbursement, margins, capacity, patient flow, and discharge incentives.",
      },
    ],
  },
] as const;

export const MOBILE_PRIORITY_DESTINATION_IDS: readonly NavigationDestinationId[] = [
  "articles",
  "all_tools",
  "start_here",
] as const;

export const MOBILE_PRIORITY_ITEMS: readonly ServiceNavigationItem[] = [
  {
    id: "articles",
    to: "/articles",
    label: "Read CAF",
    description: "Browse the publication.",
  },
  {
    id: "all_tools",
    to: "/tools",
    label: "Free tools",
    description: "Open every calculator and guide.",
  },
  {
    id: "start_here",
    to: "/start-here",
    label: "Start Here",
    description: "Find the right next step.",
  },
] as const;

export const MOBILE_GROUP_ITEMS = SERVICE_NAVIGATION_GROUPS.map((group) => ({
  ...group,
  items: group.items.filter((item) => !MOBILE_PRIORITY_DESTINATION_IDS.includes(item.id)),
})).filter((group) => group.items.length > 0);
