import type { ReadinessJourneyHandoffId, ReadinessJourneyId } from "@/lib/decisionJourneyAnalytics";

export type ReadinessJourneyHandoff = {
  id: ReadinessJourneyHandoffId;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const READINESS_JOURNEY_HANDOFFS: Record<ReadinessJourneyId, ReadinessJourneyHandoff[]> = {
  roth_traditional: [
    {
      id: "roth_403b_calculator",
      eyebrow: "Contribution amount",
      title: "Estimate the paycheck contribution",
      description: "Use the same contribution amount to separate paycheck impact from the Roth-versus-traditional tax-treatment question.",
      href: "/tools/403b-paycheck-calculator",
      cta: "Open calculator",
    },
    {
      id: "roth_benefits_command_center",
      eyebrow: "Complete package",
      title: "Review retirement inside the full benefits package",
      description: "Connect contribution type, employer match, vesting, health coverage, leave, and other workplace benefits in one private workspace.",
      href: "/tools/benefits-command-center",
      cta: "Open Command Center",
    },
  ],
  debt_retirement: [
    {
      id: "debt_financial_foundation",
      eyebrow: "Broader foundation",
      title: "Run the Financial Foundation Checkup",
      description: "Measure liquidity, costly debt, employer-match capture, recurring savings, and protection before changing the sequence.",
      href: "/start-here#financial-foundation-checkup",
      cta: "Run checkup",
    },
    {
      id: "debt_student_loans",
      eyebrow: "Loan-specific rules",
      title: "Separate federal and private student-loan paths",
      description: "Use the student-loan section when forgiveness, federal protections, refinancing, or private-loan terms control the decision.",
      href: "/student-loans",
      cta: "Open student loans",
    },
  ],
  observation_status: [
    {
      id: "observation_discharge_center",
      eyebrow: "Before discharge",
      title: "Open the Hospital Discharge Command Center",
      description: "Coordinate rehabilitation, home health, equipment, medication, transportation, coverage, and written discharge questions.",
      href: "/insurance/hospital-discharge-coverage",
      cta: "Open discharge center",
    },
    {
      id: "observation_medical_bill_toolkit",
      eyebrow: "Bills and notices",
      title: "Continue in the Medical Bill Review Toolkit",
      description: "Use the toolkit for EOBs, provider bills, financial assistance, call tracking, and problem-specific billing pathways.",
      href: "/insurance/medical-bill-review-toolkit",
      cta: "Open toolkit",
    },
  ],
  medicare_plan_verification: [
    {
      id: "medicare_turning_65",
      eyebrow: "Enrollment timing",
      title: "Build the Turning 65 timeline",
      description: "Connect current coverage, employer size, HSA contributions, Part D, Medigap, and enrollment timing before a deadline.",
      href: "/medicare-care-costs/turning-65",
      cta: "Build the timeline",
    },
    {
      id: "medicare_cost_hub",
      eyebrow: "Cost and coverage context",
      title: "Open the Medicare and care-cost hub",
      description: "Review 2026 cost references, Original Medicare gaps, Medicare versus Medicaid, and long-term care limits.",
      href: "/medicare-care-costs",
      cta: "Open Medicare hub",
    },
  ],
};
