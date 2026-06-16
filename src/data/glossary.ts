export type GlossaryEntry = {
  term: string;
  category: "Retirement" | "Insurance" | "Medicare" | "Medicaid" | "Paycheck" | "Care";
  definition: string;
  example?: string;
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
  { term: "Deductible", category: "Insurance", definition: "The amount you pay out of pocket each year before your insurance starts paying most costs." },
  { term: "Copay", category: "Insurance", definition: "A flat fee you pay for a specific service, like $30 for a primary care visit." },
  { term: "Coinsurance", category: "Insurance", definition: "Your share of a covered cost after the deductible, usually expressed as a percentage (e.g. 20%)." },
  { term: "Premium", category: "Insurance", definition: "What you pay each month to have coverage, whether or not you use it." },
  { term: "Out-of-pocket maximum", category: "Insurance", definition: "The most you'll pay for covered services in a plan year. After this, insurance pays 100% of covered costs." },
  { term: "Allowed amount", category: "Insurance", definition: "The negotiated price your insurance has agreed to pay an in-network provider for a service." },
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
