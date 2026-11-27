import type { LucideIcon } from "lucide-react";
import { HeartPulse, Briefcase, PiggyBank, Shield, Receipt, Building2, Brain } from "lucide-react";
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
  toolLink?: { href: string; label: string; description: string };
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
    title: "Healthcare Worker Benefits Hub",
    promise: "Move from match and paycheck decisions to health-plan math, HSA or FSA choices, disability coverage, life insurance, and beneficiaries in one connected path.",
    startHere:
      "Workplace benefits are compensation you cannot see in the hourly rate alone: employer retirement contributions, health coverage, tax-advantaged accounts, disability protection, life insurance, and paid time away. Use this hub in decision order: set priorities before opening the portal, find the controlling numbers, compare the paycheck and bad-year exposure, protect income and dependents, then save the final enrollment receipt.",
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
    relatedArticleSlugs: [
      "workplace-benefits-definitions",
      "how-hospital-403b-matching-works",
      "roth-vs-traditional-403b-healthcare-workers",
      "hsa-vs-fsa-healthcare-workers",
      "disability-insurance-healthcare-workers-open-enrollment",
      "employer-life-insurance-open-enrollment",
      "beneficiaries-open-enrollment-checklist",
      "open-enrollment-paycheck-impact",
    ],
    sources: [SOURCE_PRESETS.irs, SOURCE_PRESETS.healthcareGov],
  },
  {
    slug: "retirement-accounts",
    category: "Retirement",
    icon: PiggyBank,
    title: "Retirement Accounts",
    promise: "Check your hospital retirement plan, employer match and pay stub.",
    startHere:
      "Start with the plan name in your offer or benefits packet. Then look for the retirement deduction on your pay stub and the employer deposit on your plan statement. A new hire can see a payroll deduction before becoming eligible for employer money. The plan document tells you the eligibility date, what pay counts and when you keep the employer contribution if you leave.",
    definitions: [
      { term: "403(b)", meaning: "A workplace retirement plan available through eligible employers, such as public schools and certain tax-exempt organizations." },
      { term: "401(a)", meaning: "Employer retirement plan often used for mandatory or matching contributions." },
      { term: "457(b)", meaning: "Deferred-compensation plan some government and nonprofit employers offer." },
      { term: "Expense ratio", meaning: "Annual fee a fund charges you, as a percent of your balance. Lower = better." },
      { term: "Target-date fund", meaning: "All-in-one fund that auto-adjusts its mix as you approach a chosen retirement year." },
    ],
    factSheet: {
      title: "Check the employer formula against a real paycheck",
      description: "In this hypothetical example, $2,000 in eligible pay and a 4% employee election produce an $80 contribution.",
      items: [
        { title: "Read the formula", definition: "A 50% match on the first 4% of eligible pay would add $40.", bullets: ["Check whether overtime and differentials count as eligible pay.", "Ask when employer contributions begin and how the vesting schedule works."] },
        { title: "Compare the records", definition: "Your pay stub shows the employee deduction. The plan statement shows the employer deposit.", bullets: ["Check both records before treating a difference as missing money.", "Ask payroll whether the formula applies per paycheck and whether there is a year-end true-up."] },
      ],
    },
    calculator: {
      key: "calc403b",
      title: "403(b) Paycheck Contribution Calculator",
      description: "Model contribution %, employer match, and estimated annual contribution.",
    },
    relatedArticleSlugs: ["how-hospital-403b-matching-works", "roth-vs-traditional-403b-healthcare-workers", "how-to-pick-retirement-investments-at-work"],
    sources: [
      { name: "IRS", pageTitle: "403(b) tax-sheltered annuity plans", url: "https://www.irs.gov/retirement-plans/irc-403b-tax-sheltered-annuity-plans" },
      { name: "IRS", pageTitle: "457(b) deferred compensation plans", url: "https://www.irs.gov/retirement-plans/irc-457b-deferred-compensation-plans" },
    ],
  },
  {
    slug: "health-insurance",
    category: "Health Insurance",
    icon: Shield,
    title: "Health Insurance",
    promise: "Compare what two health plans could cost before you enroll, and verify the care you need is covered.",
    startHere:
      "Start with the amount you pay to keep the plan, then estimate what you would pay when you use it. Compare the same doctors, medications, and services under each option. The out-of-pocket maximum caps what you pay for covered in-network care during the plan year. Premiums, care the plan does not cover, and most out-of-network spending are separate.",
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
    relatedArticleSlugs: ["premium-deductible-out-of-pocket-open-enrollment", "network-checklist-open-enrollment", "prescription-coverage-open-enrollment-checklist"],
    sources: [
      { name: "CMS", pageTitle: "Summary of Benefits and Coverage and Uniform Glossary", url: "https://www.cms.gov/marketplace/health-plans-issuers/summary-benefits-coverage" },
      { name: "HealthCare.gov", pageTitle: "Out-of-pocket maximum", url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" },
    ],
  },
  {
    slug: "patient-medical-costs",
    category: "Patients & Caregivers",
    icon: Receipt,
    title: "Patient Medical Costs",
    promise: "Match an insured medical bill to the right claim and find out what to ask when the numbers differ.",
    startHere:
      "Start with the billing provider, date of service, and insurer’s current Explanation of Benefits (EOB). One visit can produce multiple claims, and an earlier EOB can be replaced after the insurer reprocesses a claim. Match the documents before comparing the patient responsibility. For an uninsured or self-pay bill, start with the itemized statement and any written estimate.",
    definitions: [
      { term: "EOB", meaning: "Explanation of Benefits — what your insurer paid and what you owe. Not a bill." },
      { term: "Itemized bill", meaning: "A line-by-line breakdown of charges. Always request one before paying a large bill." },
      { term: "Chargemaster", meaning: "Hospital's master list of prices. Rarely what anyone actually pays." },
      { term: "Allowed amount", meaning: "The negotiated rate your insurer agreed to pay an in-network provider." },
      { term: "Balance billing", meaning: "When an out-of-network provider bills you for the difference between their charge and what insurance paid." },
    ],
    factSheet: {
      title: "One visit, two statements. Which charge should you check?",
      description: "In this hypothetical example, the hospital’s bill is for the facility and the physician group bills separately for the clinician’s work.",
      items: [
        {
          title: "Match the facility claim",
          definition: "The hospital bill says $180. The facility EOB assigns $130 to you.",
          bullets: ["Confirm the service date and billing organization, then check that this is the latest EOB.", "Ask the hospital to explain the $50 difference and confirm whether it applied the insurer’s adjustment and any payments you already made."],
        },
        {
          title: "Check the clinician separately",
          definition: "The physician group sends a $45 bill for the same date.",
          bullets: ["Look for an EOB for the physician group. The facility EOB cannot tell you what you owe the clinician.", "If the clinician’s EOB is missing or the claim is pending, ask the provider and insurer for the claim status and confirm the bill’s due date."],
        },
      ],
    },
    toolLink: {
      href: "/tools/eob-to-bill-match-checker",
      label: "Compare an EOB with a bill",
      description: "Check which figures match, identify the discrepancy to explain, and prepare questions for the right billing office.",
    },
    relatedArticleSlugs: ["how-to-read-an-eob", "why-one-hospital-visit-can-create-multiple-bills", "check-hospital-financial-assistance-before-paying"],
    sources: [
      { name: "CMS", pageTitle: "How to read a health insurance explanation of benefits", url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits" },
      { name: "CMS", pageTitle: "How to read your medical bill", url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill" },
    ],
  },
  {
    slug: "hospital-economics",
    category: "Hospital Economics",
    icon: Building2,
    title: "Hospital Economics: Prices, Payment, Capacity, and Discharge",
    promise: "See the money, operating constraints, and competing incentives behind the hospital bill, the staffed bed, and the pressure to move care forward.",
    startHere:
      "A hospital encounter can look completely different depending on where you sit. A patient sees a frightening bill. A clinician sees the care that was necessary. A payer sees a contract and coverage rules. A hospital sees labor, capacity, payment, and financial risk. This hub puts those views on the same page so confusing behavior can be explained without pretending any one participant controls the whole system.",
    definitions: [
      { term: "Gross charge", meaning: "A hospital's standard listed price before discounts, contracts, or coverage rules. It is a starting data point, not necessarily the amount paid." },
      { term: "Allowed amount", meaning: "The maximum amount a health plan recognizes for a covered service under its rules or provider contract. Insurer payment and patient cost sharing are usually derived from it." },
      { term: "MS-DRG / IPPS", meaning: "For many Medicare inpatient stays, the hospital's facility payment is based largely on the patient's diagnosis-related group and adjustments rather than a separate payment for every routine item." },
      { term: "Staffed capacity", meaning: "A usable care space with the appropriate nurses, clinicians, equipment, and operational support—not merely an empty room or licensed bed." },
      { term: "Operating margin", meaning: "Operating revenue minus operating expense, divided by operating revenue. Positive margin can fund payroll, reserves, debt, facilities, and future care even when the hospital is nonprofit." },
    ],
    relatedArticleSlugs: [
      "why-hospitals-become-the-systems-shock-absorber",
      "home-with-family-is-not-a-free-care-plan",
      "20-dollar-tylenol-hospital-prices",
      "what-nonprofit-hospital-actually-means",
      "why-hospitals-care-about-length-of-stay",
      "why-just-send-them-to-rehab-is-not-simple",
      "allowed-amount-medical-bills",
      "facility-fee-vs-professional-fee",
      "observation-vs-inpatient-status",
      "prior-authorization-explained",
    ],
    sources: [
      {
        name: "CMS",
        pageTitle: "Hospital Price Transparency",
        url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
        note: "Official definitions and hospital disclosure requirements for standard charges and shoppable services.",
      },
      {
        name: "CMS",
        pageTitle: "Acute Inpatient PPS",
        url: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps",
        note: "Official description of Medicare's inpatient prospective payment system and MS-DRG framework.",
      },
      {
        name: "Internal Revenue Service",
        pageTitle: "Charitable hospitals — Section 501(c)(3) requirements",
        url: "https://www.irs.gov/charities-non-profits/charitable-hospitals-general-requirements-for-tax-exemption-under-section-501c3",
        note: "Federal requirements for charitable-hospital tax exemption and community benefit.",
      },
      {
        name: "AHRQ",
        pageTitle: "Emergency Department Boarding: Decisions and Practices Leading to Boarding",
        url: "https://effectivehealthcare.ahrq.gov/products/ed-boarding/research",
        note: "Federal evidence review on the system-level causes and consequences of emergency-department boarding.",
      },
    ],
  },
  {
    slug: "behavior-burnout",
    category: "Behavior & Burnout",
    icon: Brain,
    title: "Behavior & Burnout",
    promise: "Plan meals and spending for long shifts and late breaks.",
    startHere:
      "Long shifts can leave less time for recovery, and a late break may leave you with fewer places to buy food. Start by checking what is actually open on your shift. Make one plan for a normal break and one for a late break or late clock-out.",
    definitions: [],
    factSheet: {
      title: "Make a plan for the shift that runs late",
      description: "In this hypothetical example, a café meal costs $14 and a packed fallback costs $5. Using the fallback twice in the same week frees up $18.",
      items: [
        { title: "Before the shift", definition: "Choose one meal you can eat if the café is closed or you cannot get away when you expected.", bullets: ["Check what storage and heating are available on your unit.", "Budget for the purchases you actually want to keep."] },
        { title: "After the shift", definition: "Check what you bought and what changed your plan.", bullets: ["If the issue was a missed break, a cheaper lunch cannot fix staffing or coverage. Ask how breaks are covered on your unit.", "If the fallback worked, use what you actually saved to decide what to set aside."] },
      ],
    },
    calculator: {
      key: "calcCafe",
      title: "Hospital Café Savings Rate Calculator",
      description: "Turn shift purchases into monthly and yearly numbers without moralizing them.",
    },
    relatedArticleSlugs: ["hospital-cafe-habit", "burnout-overspending-overeating"],
    sources: [
      { name: "CDC / NIOSH", pageTitle: "How shift work and long work hours increase health and safety risks", url: "https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod2/01.html", note: "Background on long work hours, fatigue and recovery time." },
      { name: "CDC / NIOSH", pageTitle: "Rest breaks for nurses", url: "https://www.cdc.gov/niosh/work-hour-training-for-nurses/longhours/mod5/10.html", note: "Explains the employer's role in providing coverage for breaks." },
    ],
  },
];

export const findTopic = (slug: string) => TOPICS.find((topic) => topic.slug === slug);
