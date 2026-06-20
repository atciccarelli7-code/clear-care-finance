import type { LucideIcon } from "lucide-react";
import { HeartPulse, Briefcase, PiggyBank, Shield, Receipt, Building2, Brain, Tag } from "lucide-react";
import { SOURCE_PRESETS, type Source } from "./sources";

export type CalculatorKey = "calc403b" | "calcInsurance" | "calcMedicare" | "calcCafe" | "calcLoan" | "calcOvertime";

export type ComparisonSide = {
  title: string;
  subtitle: string;
  accent: "primary" | "secondary";
  points: string[];
};

export type FactSheetItem = {
  title: string;
  definition: string;
  bullets: string[];
  reminder?: string;
};

export type FactSheet = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: FactSheetItem[];
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
  factSheet?: FactSheet;
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
      "A quick guide to what each program does, how Medicare's parts fit together, and where long-term care gaps can appear.",
    startHere:
      "Medicare and Medicaid are different public health coverage programs. Medicare is federal health insurance mainly for people 65 and older and certain younger people with disabilities. Medicaid is jointly funded by federal and state governments and administered by each state. Some people qualify for both.",
    definitions: [
      {
        term: "Medicare",
        meaning:
          "Federal health insurance mainly for people 65 and older, plus certain younger people with disabilities or qualifying conditions. Eligibility is not generally based on income.",
      },
      {
        term: "Medicaid",
        meaning:
          "Health coverage administered by each state within federal rules. Eligibility and benefits depend on the state, eligibility group, income, and sometimes other factors.",
      },
      {
        term: "Dual eligible",
        meaning:
          "A person enrolled in both Medicare and Medicaid. Medicare generally pays first for Medicare-covered services; Medicaid may help with premiums, cost-sharing, and additional benefits under state rules.",
      },
    ],
    comparison: {
      title: "Original Medicare vs Medicare Advantage",
      description: "Two ways to receive Medicare Part A and Part B benefits.",
      left: {
        title: "Original Medicare",
        subtitle: "Part A and Part B through the federal government",
        accent: "primary",
        points: [
          "Use any doctor or hospital that accepts Medicare.",
          "Add a standalone Part D plan for prescription coverage.",
          "Medigap may help with deductibles and coinsurance.",
          "No built-in yearly out-of-pocket limit for Part A and Part B services.",
        ],
      },
      right: {
        title: "Medicare Advantage",
        subtitle: "A Medicare-approved private plan, also called Part C",
        accent: "secondary",
        points: [
          "Provides Part A and Part B benefits through a private plan.",
          "Often includes Part D and may include extra benefits.",
          "Usually uses provider networks and plan-specific rules.",
          "Includes a yearly out-of-pocket limit for covered Part A and Part B services.",
        ],
      },
    },
    factSheet: {
      eyebrow: "Medicare fact sheet",
      title: "The parts at a glance",
      description: "Four building blocks that are easy to confuse.",
      items: [
        {
          title: "Part A — Hospital insurance",
          definition: "Helps cover inpatient hospital care and certain post-hospital services.",
          bullets: [
            "Inpatient hospital care.",
            "Limited skilled nursing facility care when coverage rules are met.",
            "Hospice and some home health care.",
          ],
          reminder: "Inpatient hospital care is not the same as long-term custodial care.",
        },
        {
          title: "Part B — Medical insurance",
          definition: "Helps cover medically necessary outpatient care and preventive services.",
          bullets: [
            "Doctor and outpatient visits.",
            "Preventive services and screenings.",
            "Durable medical equipment and some home health care.",
          ],
          reminder: "Part B usually has a monthly premium and cost-sharing.",
        },
        {
          title: "Part D — Prescription drugs",
          definition: "Helps pay for outpatient prescription medications through private plans.",
          bullets: [
            "Available as a standalone plan with Original Medicare.",
            "Often included in Medicare Advantage plans.",
            "Formularies, pharmacies, and costs can change each year.",
          ],
          reminder: "Check every medication and preferred pharmacy during annual enrollment.",
        },
        {
          title: "Medigap — Supplemental coverage",
          definition: "Private insurance that helps pay some costs left by Original Medicare.",
          bullets: [
            "Works with Original Medicare, not Medicare Advantage.",
            "May help with deductibles, copays, and coinsurance.",
            "Does not replace a Part D prescription drug plan.",
          ],
          reminder: "Enrollment timing can affect whether a policy is available without medical underwriting.",
        },
      ],
    },
    calculator: {
      key: "calcMedicare",
      title: "Medicare Cost Exposure Tool",
      description: "Estimate a rough yearly out-of-pocket for premiums, deductible, prescriptions, and coinsurance.",
    },
    relatedArticleSlugs: [
      "medicare-options-explained",
      "discharge-coverage-guide",
      "short-term-rehab-after-hospital",
      "home-health-after-discharge",
      "durable-medical-equipment-after-discharge",
      "long-term-care-and-custodial-care",
      "medicaid-dual-eligibility-ltss",
      "plain-english-glossary",
    ],
    sources: [
      SOURCE_PRESETS.medicareParts,
      SOURCE_PRESETS.medicareCosts,
      SOURCE_PRESETS.medicareCompareOriginalAdvantage,
      SOURCE_PRESETS.medicareMedigap,
      SOURCE_PRESETS.medicareSnf,
      SOURCE_PRESETS.medicareHomeHealth,
      SOURCE_PRESETS.medicareDme,
      SOURCE_PRESETS.medicareLongTermCare,
      SOURCE_PRESETS.medicaidEligibility,
      SOURCE_PRESETS.medicaidLtss,
      SOURCE_PRESETS.cmsMedicaidCoordination,
      SOURCE_PRESETS.kffMedicareCoverageSnapshot,
      SOURCE_PRESETS.kffMedicareAdvantage2026,
      SOURCE_PRESETS.kffMedicaid101,
    ],
    warning: {
      title: "Medicare does not cover most long-term custodial care.",
      body: "Ongoing help with bathing, dressing, eating, toileting, meals, or supervision is usually custodial care. Medicare may cover limited skilled care when specific rules are met, but not indefinite personal care. Medicaid can cover long-term services and supports for people who qualify, but eligibility, covered services, and delivery systems vary by state.",
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
    promise: "Why hospitals make decisions that feel confusing from the bedside or the bill.",
    startHere:
      "Hospitals are clinical organizations operating inside a complicated reimbursement system. Staffing, payer mix, uncompensated care, quality penalties, capital spending, and negotiated rates all shape what patients and workers experience.",
    definitions: [
      { term: "Payer mix", meaning: "The blend of Medicare, Medicaid, commercial insurance, self-pay, and uninsured patients a hospital treats." },
      { term: "Reimbursement", meaning: "The amount a hospital is paid for providing care." },
      { term: "Uncompensated care", meaning: "Care delivered that the hospital is not fully paid for." },
      { term: "Operating margin", meaning: "How much money remains after operating revenue minus operating expenses." },
      { term: "Capital spending", meaning: "Large investments in buildings, equipment, technology, or facilities." },
    ],
    relatedArticleSlugs: ["why-hospitals-feel-broke", "why-er-visit-is-expensive"],
    sources: [SOURCE_PRESETS.cms, SOURCE_PRESETS.kff],
  },
  {
    slug: "behavior-burnout",
    category: "Behavior & Burnout",
    icon: Brain,
    title: "Behavior & Burnout",
    promise: "Money habits that happen after hard shifts — without shame or fake discipline advice.",
    startHere:
      "Burnout does not just affect mood. It affects spending, eating, alcohol, impulse purchases, and whether you have energy to plan. The fix is not shame. It is better defaults before the shift happens.",
    definitions: [
      { term: "Decision fatigue", meaning: "The worn-down feeling after making too many decisions or managing too much stress." },
      { term: "Burnout spending", meaning: "Spending used as quick relief after a hard shift or emotional overload." },
      { term: "Recovery budget", meaning: "A planned amount for convenience and comfort that does not sabotage bigger goals." },
      { term: "Default", meaning: "The easiest choice when you are tired. Good defaults beat willpower." },
    ],
    calculator: {
      key: "calcCafe",
      title: "Hospital Café Savings Rate Calculator",
      description: "Turn shift purchases into monthly and yearly numbers without moralizing them.",
    },
    relatedArticleSlugs: ["hospital-cafe-habit", "burnout-overspending-overeating"],
    sources: [SOURCE_PRESETS.federalReserve],
  },
  {
    slug: "discounts-perks",
    category: "Discounts & Perks",
    icon: Tag,
    title: "Healthcare Worker Discounts & Perks",
    promise: "Use discounts as a tool, not as a shopping trigger.",
    startHere:
      "A discount only helps if it lowers the price of something you already planned to buy. Healthcare-worker perks can be useful, but many lists become shopping traps. Compare final price, return rules, subscriptions, and whether you actually need the item.",
    definitions: [
      { term: "Verification", meaning: "A process that confirms healthcare-worker status before a discount is applied." },
      { term: "Final price", meaning: "The cost after discount, shipping, fees, tax, return rules, and subscriptions." },
      { term: "False savings", meaning: "Buying something you would not have bought without the discount." },
    ],
    relatedArticleSlugs: ["healthcare-worker-discounts"],
    sources: [SOURCE_PRESETS.federalReserve],
  },
];

export const findTopic = (slug: string) => TOPICS.find((topic) => topic.slug === slug);