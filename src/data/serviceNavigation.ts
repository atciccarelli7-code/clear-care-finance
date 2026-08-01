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
  { to: "/start-here", label: "Start Here" },
  { to: "/tools", label: "Tools" },
  { to: "/build-wealth", label: "Money & Retirement" },
  { to: "/insurance", label: "Benefits & Insurance" },
  { to: "/medicare-care-costs", label: "Medicare & Medicaid" },
  { to: "/articles", label: "Articles" },
] as const;

export const SERVICE_NAVIGATION_GROUPS: readonly ServiceNavigationGroup[] = [
  {
    id: "start",
    label: "Find the right starting point",
    description: "Choose a question, see the expected outcome, or browse the complete tool library.",
    items: [
      {
        id: "decision_concierge",
        to: "/#decision-concierge",
        label: "Decision Concierge",
        description: "Answer one short routing question and open the experience responsible for the answer.",
      },
      {
        id: "start_here",
        to: "/start-here",
        label: "Start Here",
        description: "Use a guided financial navigator when you are not sure which topic or tool fits.",
      },
      {
        id: "all_tools",
        to: "/tools",
        label: "All calculators and guides",
        description: "Browse every public calculator, checklist, comparison, and guided decision tool.",
      },
    ],
  },
  {
    id: "healthcare_workers",
    label: "Healthcare-worker decisions",
    description: "Compare compensation, understand benefits, and prepare for a career or enrollment decision.",
    items: [
      {
        id: "benefits_command_center",
        to: "/tools/benefits-command-center",
        label: "Benefits Command Center",
        description: "Turn scattered workplace-benefit documents into one organized review plan.",
        audience: "Healthcare workers",
      },
      {
        id: "benefits_change_detector",
        to: "/tools/benefits-change-detector",
        label: "Benefits Change Detector",
        description: "Compare plan-year documents and leave with a focused list of changes to verify.",
        audience: "Open enrollment",
      },
      {
        id: "total_compensation",
        to: "/tools/healthcare-worker-total-compensation-comparison",
        label: "Total Compensation Comparison",
        description: "Compare job offers beyond hourly pay, including benefits and schedule tradeoffs.",
        audience: "Career decisions",
      },
      {
        id: "paycheck_403b",
        to: "/tools/403b-paycheck-calculator",
        label: "403(b) Paycheck Calculator",
        description: "Estimate how a contribution change may affect retirement savings and take-home pay.",
        audience: "Retirement benefits",
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
        to: "/insurance/medical-bill-review-toolkit",
        label: "Medical Bill Review",
        description: "Organize an EOB and provider bill into a practical review and question list.",
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
    label: "Coverage and learning",
    description: "Open a trusted hub or library when you need broader education before choosing a tool.",
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
        to: "/topics",
        label: "Topic Guides",
        description: "Browse related articles and tools through a structured subject pathway.",
      },
    ],
  },
] as const;

export const MOBILE_PRIORITY_DESTINATION_IDS: readonly NavigationDestinationId[] = [
  "decision_concierge",
  "all_tools",
  "articles",
] as const;

export const MOBILE_PRIORITY_ITEMS: readonly ServiceNavigationItem[] = [
  {
    id: "decision_concierge",
    to: "/#decision-concierge",
    label: "Start a decision",
    description: "Answer one routing question.",
  },
  {
    id: "all_tools",
    to: "/tools",
    label: "Browse tools",
    description: "Open every calculator and guide.",
  },
  {
    id: "articles",
    to: "/articles",
    label: "Read articles",
    description: "Browse source-backed explanations.",
  },
] as const;

export const MOBILE_GROUP_ITEMS = SERVICE_NAVIGATION_GROUPS.map((group) => ({
  ...group,
  items: group.items.filter((item) => !MOBILE_PRIORITY_DESTINATION_IDS.includes(item.id)),
})).filter((group) => group.items.length > 0);
