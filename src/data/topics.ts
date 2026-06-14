import type { LucideIcon } from "lucide-react";
import { HeartPulse, Briefcase, PiggyBank, Shield, Receipt, Building2, Brain, Tag } from "lucide-react";
import { SOURCE_PRESETS, type Source } from "./sources";

export type CalculatorKey = "calc403b" | "calcInsurance" | "calcMedicare" | "calcCafe";

export type ComparisonSide = {
  title: string;
  subtitle: string;
  accent: "primary" | "secondary";
  points: string[];
};

export type Topic = {
  slug: string;
  category: string;
  icon: LucideIcon;
  title: string;
  promise: string;            // hero subhead
  startHere: string;          // explainer paragraph(s)
  definitions: { term: string; meaning: string }[];
  comparison?: { title: string; description?: string; left: ComparisonSide; right: ComparisonSide };
  calculator?: { key: CalculatorKey; title: string; description: string };
  relatedArticleSlugs: string[];
  sources: Source[];
  warning?: { title: string; body: string };
};

export const TOPICS: Topic[] = [
  {
    slug: "medicare-medicaid",
    category: "Medicare & Medicaid",
    icon: HeartPulse,
    title: "Medicare & Medicaid",
    promise:
      "Two programs, one letter apart, very different jobs. Here's what each covers, who qualifies, and where the gaps are.",
    startHere:
      "Medicare is mostly age- or disability-based health insurance run by the federal government. Medicaid is income- and resource-based assistance run jointly with your state. Many people qualify for one. Some qualify for both — and that combination (dual eligible) can fill in important gaps.",
    definitions: [
      { term: "Medicare Part A", meaning: "Hospital insurance — inpatient stays, short-term skilled nursing, hospice." },
      { term: "Medicare Part B", meaning: "Doctor visits, outpatient care, preventive services." },
      { term: "Medicare Advantage", meaning: "Part C — bundled plans from private insurers that replace Original Medicare." },
      { term: "Dual eligible", meaning: "Qualifying for both Medicare and Medicaid. Medicare pays first; Medicaid may fill gaps." },
      { term: "Custodial care", meaning: "Help with daily living — generally NOT covered by Medicare." },
    ],
    comparison: {
      title: "Medicare vs Medicaid",
      description: "Two programs. One letter apart. Very different jobs.",
      left: {
        title: "Medicare",
        subtitle: "Age- or disability-based insurance",
        accent: "primary",
        points: [
          "Most people qualify at age 65",
          "Also covers some younger people with disabilities",
          "Not based on income",
          "Has monthly premiums for most parts",
          "Federal program — consistent rules nationwide",
        ],
      },
      right: {
        title: "Medicaid",
        subtitle: "Income/resource-based assistance",
        accent: "secondary",
        points: [
          "Based on income, family size, and resources",
          "Covers pregnant women, children, and some seniors",
          "Rules and benefits vary by state",
          "Usually little or no monthly premium",
          "State and federal partnership program",
        ],
      },
    },
    calculator: {
      key: "calcMedicare",
      title: "Medicare Cost Exposure Tool",
      description: "Estimate a rough yearly out-of-pocket for premiums, deductible, prescriptions, and coinsurance.",
    },
    relatedArticleSlugs: ["medicare-options-explained", "discharge-coverage-guide", "long-term-care-and-custodial-care"],
    sources: [SOURCE_PRESETS.medicare, SOURCE_PRESETS.medicaid, SOURCE_PRESETS.cms, SOURCE_PRESETS.kff],
    warning: {
      title: "Medicare does not pay for most long-term custodial care.",
      body: "Help with bathing, dressing, toileting, meals, supervision, and daily living is usually considered custodial care and is generally not covered by Medicare. Medicaid is the primary public program for long-term nursing home and home-based care, for those who qualify.",
    },
  },
  {
    slug: "workplace-benefits",
    category: "Workplace Benefits",
    icon: Briefcase,
    title: "Workplace Benefits",
    promise: "Decode the paperwork hospitals hand you at orientation and open enrollment.",
    startHere:
      "Workplace benefits are pay you can't see on your paystub: insurance, retirement contributions, pre-tax accounts, and matches. Understanding them is one of the highest-return uses of an hour each year.",
    definitions: [
      { term: "Employer match", meaning: "Money your employer adds to your retirement when you contribute. Often the highest-return dollars you'll ever see." },
      { term: "Pre-tax contribution", meaning: "Money taken out before income tax — lowers your taxable income now." },
      { term: "Roth contribution", meaning: "After-tax money. Withdrawals in retirement are generally tax-free." },
      { term: "Vesting", meaning: "When employer-contributed money becomes officially yours, even if you leave." },
      { term: "Open enrollment", meaning: "The window each year when you can change health, dental, vision, and benefit elections." },
    ],
    calculator: {
      key: "calc403b",
      title: "Workplace Benefits Decoder · 403(b) Calculator",
      description: "See per-paycheck contribution, annual contribution, and employer match estimate.",
    },
    relatedArticleSlugs: ["workplace-benefits-definitions", "how-to-pick-retirement-investments-at-work"],
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.healthcareGov],
  },
  {
    slug: "retirement-accounts",
    category: "Retirement",
    icon: PiggyBank,
    title: "Retirement Accounts",
    promise: "403(b), 401(a), 457(b), Roth vs Traditional — the workplace retirement vocabulary in plain English.",
    startHere:
      "Hospitals and health systems usually offer a 403(b). Some also offer a 401(a) for required or matching contributions, and a 457(b) for additional deferral. You don't need to be an investor to use them well — you need to enroll, contribute enough to get the match, and choose a low-cost diversified fund.",
    definitions: [
      { term: "403(b)", meaning: "Workplace retirement plan for hospital, school, and nonprofit employees." },
      { term: "401(a)", meaning: "Employer retirement plan often used for mandatory or matching contributions." },
      { term: "457(b)", meaning: "Deferred-compensation plan some government and nonprofit employers offer." },
      { term: "Expense ratio", meaning: "Annual fee a fund charges you, as a percent of your balance. Lower = better." },
      { term: "Target-date fund", meaning: "All-in-one fund that auto-adjusts its mix as you approach a chosen retirement year." },
    ],
    calculator: {
      key: "calc403b",
      title: "403(b) Paycheck Contribution Calculator",
      description: "Model contribution %, employer match, and estimated annual contribution.",
    },
    relatedArticleSlugs: ["how-to-pick-retirement-investments-at-work", "workplace-benefits-definitions"],
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "health-insurance",
    category: "Health Insurance",
    icon: Shield,
    title: "Health Insurance",
    promise: "Premium, deductible, copay, coinsurance, out-of-pocket max — translated into normal English.",
    startHere:
      "Health insurance has four moving parts you pay: the monthly premium, the annual deductible, the copay per visit, and the coinsurance % after the deductible. The out-of-pocket max is your worst-case ceiling for a year of covered, in-network care.",
    definitions: [
      { term: "Premium", meaning: "What you pay each month for coverage." },
      { term: "Deductible", meaning: "What you pay out of pocket each year before insurance covers most things." },
      { term: "Copay", meaning: "Flat fee per visit, like $30 to see a primary care doctor." },
      { term: "Coinsurance", meaning: "Your share after meeting the deductible (e.g. 20%)." },
      { term: "Out-of-pocket max", meaning: "The most you'll pay for covered, in-network care in a plan year." },
    ],
    calculator: {
      key: "calcInsurance",
      title: "Health Insurance Visit Cost Calculator",
      description: "Estimate annual cost across premium, deductible, copays, coinsurance, and visits.",
    },
    relatedArticleSlugs: ["plain-english-glossary", "workplace-benefits-definitions", "why-er-visit-is-expensive"],
    sources: [SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.kff],
  },
  {
    slug: "patient-medical-costs",
    category: "Patients & Caregivers",
    icon: Receipt,
    title: "Patient Medical Costs",
    promise: "Hospital bills, EOBs, surprise charges — what's normal, what isn't, and what to ask.",
    startHere:
      "An EOB is not a bill. It's a statement from your insurer showing what was billed, what was allowed, what they paid, and what you owe. The actual bill comes from the provider — and it should match what the EOB says you owe.",
    definitions: [
      { term: "EOB", meaning: "Explanation of Benefits — what your insurer paid and what you owe. Not a bill." },
      { term: "Itemized bill", meaning: "A line-by-line breakdown of charges. Always request one before paying a large bill." },
      { term: "Chargemaster", meaning: "Hospital's master list of prices. Rarely what anyone actually pays." },
      { term: "Allowed amount", meaning: "The negotiated rate your insurer agreed to pay an in-network provider." },
      { term: "Balance billing", meaning: "When an out-of-network provider bills you for the difference between their charge and what insurance paid." },
    ],
    calculator: {
      key: "calcInsurance",
      title: "Visit Cost Estimator",
      description: "Use the insurance calculator to estimate what you'll actually owe.",
    },
    relatedArticleSlugs: ["why-er-visit-is-expensive", "plain-english-glossary"],
    sources: [SOURCE_PRESETS.healthcareGov, SOURCE_PRESETS.kff, SOURCE_PRESETS.cms],
  },
  {
    slug: "hospital-economics",
    category: "Hospital Economics",
    icon: Building2,
    title: "Hospital Economics",
    promise: "Why hospital prices are confusing — chargemasters, contracts, and facility fees explained.",
    startHere:
      "Hospitals operate on multiple price lists at once: the chargemaster (rarely paid), negotiated insurer rates, Medicare/Medicaid rates, and self-pay rates. The same procedure can show three very different numbers depending on who's asking.",
    definitions: [
      { term: "Facility fee", meaning: "A charge for the use of the hospital itself, separate from physician charges." },
      { term: "Chargemaster", meaning: "Hospital's internal price list. Mostly a starting point for negotiation." },
      { term: "DRG", meaning: "Diagnosis-Related Group — how Medicare pays a fixed bundled rate per inpatient stay." },
      { term: "340B", meaning: "Federal drug-pricing program that lets eligible hospitals buy outpatient drugs at a discount." },
    ],
    relatedArticleSlugs: ["why-er-visit-is-expensive"],
    sources: [SOURCE_PRESETS.kff, SOURCE_PRESETS.cms],
  },
  {
    slug: "spending-burnout-behavior",
    category: "Behavior",
    icon: Brain,
    title: "Spending, Burnout & Behavior",
    promise: "The money side of decision fatigue, post-shift spending, and small habits that quietly compound.",
    startHere:
      "Long shifts, irregular sleep, and emotional load make every after-work decision more expensive. The fix usually isn't willpower — it's designing defaults that don't require willpower.",
    definitions: [
      { term: "Savings rate", meaning: "Percentage of take-home pay you save or invest. The single biggest lever in personal finance." },
      { term: "Decision fatigue", meaning: "Reduced quality of decisions after a long session of decision-making. Common after clinical shifts." },
      { term: "Lifestyle creep", meaning: "Spending that quietly grows with income, leaving savings rate flat." },
    ],
    calculator: {
      key: "calcCafe",
      title: "Hospital Café Savings Rate Calculator",
      description: "See what daily café spend adds up to in a year — without shame.",
    },
    relatedArticleSlugs: ["hospital-cafe-habit", "burnout-overspending-overeating"],
    sources: [SOURCE_PRESETS.federalReserve, SOURCE_PRESETS.bls],
  },
  {
    slug: "healthcare-worker-discounts",
    category: "Workplace Benefits",
    icon: Tag,
    title: "Healthcare Worker Discounts",
    promise: "Legitimate discount programs that don't require giving up your inbox or your data.",
    startHere:
      "Most real discounts for healthcare workers run through verification services like ID.me or SheerID. They're free, they don't sell your data, and they unlock retailer, gym, phone plan, and travel discounts.",
    definitions: [
      { term: "ID.me", meaning: "Common identity verification service used by retailers and government services." },
      { term: "SheerID", meaning: "Verification service many retailers use for occupation-based discounts." },
    ],
    relatedArticleSlugs: ["healthcare-worker-discounts"],
    sources: [],
  },
];

export const findTopic = (slug: string) => TOPICS.find((t) => t.slug === slug);
