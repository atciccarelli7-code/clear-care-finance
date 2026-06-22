import type { CalculatorKey } from "@/data/topics";

export type CalculatorIconName =
  | "wallet"
  | "shield"
  | "heart"
  | "coffee"
  | "credit-card"
  | "piggy-bank"
  | "chart"
  | "clock";

export interface CalculatorDefinition {
  key: CalculatorKey;
  slug: string;
  legacyAnchor: string;
  title: string;
  description: string;
  eyebrow: string;
  icon: CalculatorIconName;
  relatedArticle?: { label: string; href: string };
}

export const CALCULATORS: CalculatorDefinition[] = [
  {
    key: "calc403b",
    slug: "403b-contribution",
    legacyAnchor: "403b",
    title: "403(b) Paycheck Contribution Calculator",
    description: "Find the per-paycheck amount and percentage needed to reach an annual 403(b) contribution goal.",
    eyebrow: "For healthcare workers",
    icon: "wallet",
    relatedArticle: {
      label: "How to Pick Retirement Investments at Work",
      href: "/articles/how-to-pick-retirement-investments-at-work",
    },
  },
  {
    key: "calcInsurance",
    slug: "hospital-bill",
    legacyAnchor: "insurance",
    title: "Hospital Bill and Insurance Cost Estimator",
    description: "Build a plain-English estimate of deductible, coinsurance, copay, and possible patient responsibility.",
    eyebrow: "For patients and caregivers",
    icon: "shield",
    relatedArticle: {
      label: "Why an ER Visit Is So Expensive",
      href: "/articles/why-er-visit-is-expensive",
    },
  },
  {
    key: "calcEmergencyFund",
    slug: "emergency-fund",
    legacyAnchor: "emergency-fund",
    title: "Emergency Fund Calculator for Healthcare Workers",
    description: "Turn essential monthly expenses into a practical savings target and timeline.",
    eyebrow: "Resilience without shame",
    icon: "piggy-bank",
  },
  {
    key: "calcSavingsRate",
    slug: "savings-rate",
    legacyAnchor: "savings-rate",
    title: "Healthcare Worker Savings Rate Calculator",
    description: "See cash savings and total wealth-building rates without treating the result like a grade.",
    eyebrow: "For healthcare workers",
    icon: "chart",
  },
  {
    key: "calcCafe",
    slug: "hospital-cafe",
    legacyAnchor: "cafe",
    title: "Hospital Cafe and Small Purchases Calculator",
    description: "See how drinks, meals, and snacks add up while keeping room for comfort and choice.",
    eyebrow: "Spending, no shame",
    icon: "coffee",
    relatedArticle: {
      label: "Your Hospital Cafe Habit Might Be Quietly Eating Your Savings Rate",
      href: "/articles/hospital-cafe-habit",
    },
  },
  {
    key: "calcOvertime",
    slug: "overtime-burnout",
    legacyAnchor: "overtime-burnout",
    title: "Overtime Pay vs. Burnout Calculator",
    description: "Estimate overtime's financial benefit after withholding and overtime-linked spending, with safety kept in view.",
    eyebrow: "Money and recovery",
    icon: "clock",
  },
  {
    key: "calcMedicare",
    slug: "medicare-costs",
    legacyAnchor: "medicare",
    title: "Medicare Cost Exposure Tool",
    description: "Create a rough annual budget for Part B premiums, deductible, prescriptions, and visit coinsurance.",
    eyebrow: "For patients and caregivers",
    icon: "heart",
    relatedArticle: {
      label: "Medicare Options Explained",
      href: "/articles/medicare-options-explained",
    },
  },
  {
    key: "calcLoan",
    slug: "student-loan-payment",
    legacyAnchor: "loan",
    title: "Student Loan Payment Calculator",
    description: "Estimate an equal monthly payment, total repaid, and total interest for a fixed-rate loan.",
    eyebrow: "For everyone",
    icon: "credit-card",
  },
];

export const getCalculatorBySlug = (slug: string | undefined) =>
  CALCULATORS.find((calculator) => calculator.slug === slug);
