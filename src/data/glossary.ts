export type GlossaryEntry = {
  term: string;
  category: "Retirement" | "Insurance" | "Medicare" | "Medicaid" | "Paycheck" | "Care";
  definition: string;
  example?: string;
  next?: { label: string; href: string };
  source?: { label: string; href: string };
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "403(b)", category: "Retirement", definition: "A workplace retirement plan for employees of public schools, hospitals, and some nonprofits. Similar in spirit to a 401(k)." },
  { term: "401(a)", category: "Retirement", definition: "An employer-sponsored retirement plan often used by government and nonprofit employers for mandatory or matching contributions." },
  { term: "457(b)", category: "Retirement", definition: "A deferred-compensation plan offered by some government and nonprofit employers. Can stack with a 403(b)." },
  { term: "Roth contribution", category: "Retirement", definition: "Money you contribute after taxes. Qualified withdrawals in retirement are generally tax-free." },
  { term: "Traditional contribution", category: "Retirement", definition: "Money contributed pre-tax. Lowers your taxable income now; withdrawals in retirement are taxed." },
  { term: "Employer match", category: "Retirement", definition: "Money your employer adds to your retirement account based on how much you contribute. Often called \"free money\" because you only get it if you contribute." },
  { term: "Gross pay", category: "Paycheck", definition: "Your total pay before any taxes or deductions are taken out." },
  { term: "Net pay", category: "Paycheck", definition: "Your take-home pay after taxes, insurance, and retirement deductions." },
  {
    term: "Deductible", category: "Insurance",
    definition: "The amount you pay for certain covered services before the plan starts sharing those costs. Some services may be covered before you meet it, and prescriptions can have a separate deductible.",
    example: "Check how much you have left to meet and whether the deductible applies to the service you are planning.",
    source: { label: "HealthCare.gov on deductibles", href: "https://www.healthcare.gov/glossary/deductible/" },
    next: { label: "Work through a visit cost example", href: "/tools/health-insurance-visit-cost-calculator" },
  },
  { term: "Copay", category: "Insurance", definition: "A flat fee you pay for a specific service, like $30 for a primary care visit." },
  {
    term: "Coinsurance", category: "Insurance",
    definition: "Your percentage share of the allowed amount for a covered service, generally after you meet any applicable deductible.",
    example: "If the allowed amount is $100, your deductible is met and 20% coinsurance applies, your share is $20.",
    source: { label: "HealthCare.gov cost-sharing example", href: "https://www.healthcare.gov/glossary/deductible/" },
  },
  { term: "Premium", category: "Insurance", definition: "What you pay each month to have coverage, whether or not you use it." },
  {
    term: "Out-of-pocket maximum", category: "Insurance",
    definition: "For a health plan with an in-network annual limit, this caps what you pay in eligible cost sharing. After you reach it, the plan pays for covered in-network services for the rest of the plan year.",
    example: "When comparing plans, budget premiums separately. Premiums, noncovered services and out-of-network care are outside the in-network limit.",
    source: { label: "HealthCare.gov on out-of-pocket limits", href: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/" },
  },
  {
    term: "Allowed amount", category: "Insurance",
    definition: "The amount the plan recognizes for a covered service when it works out what the insurer and patient each pay.",
    example: "For a covered in-network service, a provider bills $500, the plan allows $300, the insurer pays $240, and you owe $60 in coinsurance. Look for the allowed amount and your share as separate lines.",
    source: { label: "HealthCare.gov on allowed amounts", href: "https://www.healthcare.gov/glossary/allowed-amount/" },
    next: { label: "Explore a worked hospital bill", href: "/hospital-bill-anatomy" },
  },
  {
    term: "Explanation of benefits (EOB)", category: "Insurance",
    definition: "The insurer's record of how it processed a claim. It shows what the provider charged, what the plan allowed and paid, and what the patient may owe.",
    example: "Use the provider statement to see the requested balance. Match it to the processed EOB by provider and date of service before comparing the amounts.",
    source: { label: "CMS guide to reading an EOB", href: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits" },
    next: { label: "Compare your bill with your EOB", href: "/tools/eob-to-bill-match-checker" },
  },
  { term: "HSA", category: "Insurance", definition: "Health Savings Account. Tax-advantaged account paired with a high-deductible health plan. Money rolls over each year." },
  { term: "FSA", category: "Insurance", definition: "Flexible Spending Account. Pre-tax account for medical costs. Generally use-it-or-lose-it each year." },
  { term: "HRA", category: "Insurance", definition: "Health Reimbursement Arrangement. Employer-funded account that reimburses certain medical expenses." },
  { term: "Medicare Part A", category: "Medicare", definition: "Hospital insurance. Covers inpatient stays, some skilled nursing, hospice, and limited home health." },
  { term: "Medicare Part B", category: "Medicare", definition: "Medical insurance. Covers doctor visits, outpatient care, and preventive services." },
  { term: "Medicare Advantage", category: "Medicare", definition: "Part C — a private plan alternative for receiving Part A and Part B benefits. Often bundles Part D." },
  { term: "Part D", category: "Medicare", definition: "Prescription drug coverage offered through private plans." },
  { term: "Medigap", category: "Medicare", definition: "Supplemental insurance that helps pay costs Original Medicare leaves behind, like coinsurance and deductibles." },
  { term: "Medicaid", category: "Medicaid", definition: "Joint federal/state program that helps with healthcare costs for people with limited income and resources." },
  { term: "Dual eligible", category: "Medicaid", definition: "Someone who qualifies for both Medicare and Medicaid. Medicare pays first; Medicaid may fill gaps." },
  { term: "Benefit period", category: "Medicare", definition: "A Medicare-specific window that starts when you're admitted as an inpatient and ends after 60 days out of a hospital or skilled nursing facility." },
  { term: "Skilled nursing facility", category: "Care", definition: "A facility that provides skilled medical care, like wound care or IV therapy. Medicare covers this only short-term, after a qualifying hospital stay." },
  { term: "Custodial care", category: "Care", definition: "Help with daily living — bathing, dressing, eating. Generally NOT covered by Medicare." },
  { term: "Prior authorization", category: "Insurance", definition: "Approval an insurer requires before they'll pay for certain medications, tests, or procedures." },
  { term: "In-network", category: "Insurance", definition: "Providers and facilities that have a contract with your insurance to provide care at negotiated rates." },
  { term: "Out-of-network", category: "Insurance", definition: "Providers without a contract with your insurer. Usually costs more — sometimes a lot more." },
];

export const GLOSSARY_CATEGORIES = [
  "All",
  "Retirement",
  "Paycheck",
  "Insurance",
  "Medicare",
  "Medicaid",
  "Care",
] as const;
