export type VisualSource = {
  label: string;
  url: string;
  reviewed: string;
  scope: string;
};

export type MedicareCostReference = {
  id: string;
  label: string;
  amount: string;
  period: string;
  note: string;
};

export const MEDICARE_2026_OFFICIAL_COSTS: MedicareCostReference[] = [
  { id: "part_b_premium", label: "Part B standard premium", amount: "$202.90", period: "per month", note: "Higher-income adjustments may apply." },
  { id: "part_b_deductible", label: "Part B deductible", amount: "$283", period: "per year", note: "Part B coinsurance commonly applies after the deductible." },
  { id: "part_a_deductible", label: "Part A inpatient deductible", amount: "$1,736", period: "per benefit period", note: "A new benefit period can create another deductible." },
  { id: "part_a_days_61_90", label: "Inpatient days 61–90", amount: "$434", period: "per day", note: "Applies during each benefit period after day 60." },
  { id: "part_a_lifetime_reserve", label: "Inpatient lifetime reserve days", amount: "$868", period: "per day", note: "A limited lifetime pool applies after day 90." },
  { id: "snf_days_21_100", label: "Covered SNF days 21–100", amount: "$217", period: "per day", note: "Only when Medicare skilled-nursing coverage requirements are met." },
  { id: "part_d_deductible", label: "Part D maximum deductible", amount: "$615", period: "per year", note: "A plan may charge less; formulary and cost sharing still matter." },
  { id: "part_d_oop_threshold", label: "Part D covered-drug out-of-pocket threshold", amount: "$2,100", period: "per year", note: "After reaching the threshold, catastrophic coverage applies to covered Part D drugs." },
];

export const MEDICARE_MEDICAID_COMPARISON = [
  {
    label: "Medicare",
    memoryAid: "Federal health insurance",
    who: "Primarily people 65 or older and some younger people with disabilities or specific conditions.",
    controls: "Federal Medicare rules plus the chosen Original Medicare or private Medicare-plan structure.",
    verify: "Medicare.gov, Social Security, current plan documents, providers, pharmacies, and SHIP.",
  },
  {
    label: "Medicaid",
    memoryAid: "Federal-state assistance program",
    who: "People who meet state-specific eligibility rules; categories, income, resources, and benefits vary by state.",
    controls: "The state Medicaid program and, when applicable, its managed-care plan rules.",
    verify: "The official state Medicaid agency, state application portal, plan documents, and providers.",
  },
  {
    label: "Dual eligibility",
    memoryAid: "Both programs may work together",
    who: "Some people qualify for both Medicare and Medicaid or for Medicare Savings Programs.",
    controls: "Coordination rules depend on the exact Medicare, Medicaid, and state-program combination.",
    verify: "State Medicaid, Medicare.gov, SHIP, and current plan or program documents.",
  },
] as const;

export const ORIGINAL_MEDICARE_GAPS = [
  { label: "Annual medical out-of-pocket cap", status: "not-included", note: "Original Medicare has no yearly out-of-pocket maximum unless other coverage applies." },
  { label: "Long-term custodial care", status: "generally-not-covered", note: "Help with daily activities over time is generally not covered by Medicare." },
  { label: "Most routine dental care", status: "generally-not-covered", note: "Some Medicare Advantage plans may offer limited supplemental benefits." },
  { label: "Routine eye exams and eyeglasses", status: "generally-not-covered", note: "Limited exceptions and plan benefits may apply." },
  { label: "Hearing aids and routine fitting exams", status: "generally-not-covered", note: "Private-plan supplemental benefits vary in amount, network, and frequency." },
  { label: "Prescription drugs", status: "separate-coverage", note: "Usually requires a Part D plan or drug coverage through a Medicare Advantage plan." },
] as const;

export const MEDICARE_VISUAL_SOURCES: VisualSource[] = [
  {
    label: "CMS — 2026 Medicare Parts A & B premiums and deductibles",
    url: "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-and-deductibles",
    reviewed: "July 16, 2026",
    scope: "2026 Part A and Part B premiums, deductibles, hospital coinsurance, and SNF coinsurance.",
  },
  {
    label: "Medicare.gov — What Medicare costs",
    url: "https://www.medicare.gov/basics/costs/medicare-costs",
    reviewed: "July 16, 2026",
    scope: "Current Medicare costs and the absence of an annual Original Medicare out-of-pocket limit.",
  },
  {
    label: "Medicare.gov — Drug coverage costs",
    url: "https://www.medicare.gov/health-drug-plans/part-d/basics/costs",
    reviewed: "July 16, 2026",
    scope: "2026 Part D maximum deductible and covered-drug out-of-pocket threshold.",
  },
  {
    label: "Medicare.gov — Long-term care",
    url: "https://www.medicare.gov/coverage/long-term-care",
    reviewed: "July 16, 2026",
    scope: "General Medicare limits for long-term custodial care.",
  },
  {
    label: "Medicaid.gov — Seniors and Medicare-Medicaid enrollees",
    url: "https://www.medicaid.gov/medicaid/eligibility-policy/seniors-medicare-and-medicaid-enrollees",
    reviewed: "July 16, 2026",
    scope: "Medicaid and dual-eligibility program context; state rules vary.",
  },
];
