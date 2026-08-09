export type MedicareCoverageSource = {
  id: string;
  title: string;
  url: string;
  agency: string;
  effectiveYear: number | "current";
  lastVerified: string;
  nextReview: string;
  geography: string;
  supports: string;
  authority: "controlling" | "primary-explanatory";
};

export const MEDICARE_COVERAGE_SOURCE_REGISTRY: MedicareCoverageSource[] = [
  {
    id: "medicare-architecture",
    title: "Compare Original Medicare & Medicare Advantage",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-10-01",
    geography: "United States",
    supports: "Coverage architecture, provider choice, costs, prior authorization, drugs, and travel",
    authority: "primary-explanatory",
  },
  {
    id: "medicare-costs-2026",
    title: "2026 Medicare Costs",
    url: "https://www.medicare.gov/publications/11579-medicare-costs.pdf",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: 2026,
    lastVerified: "2026-08-09",
    nextReview: "2026-10-01",
    geography: "United States",
    supports: "2026 Part A and Part B premiums, deductibles, coinsurance, and SNF cost sharing",
    authority: "primary-explanatory",
  },
  {
    id: "working-past-65",
    title: "Working past 65",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-11-01",
    geography: "United States",
    supports: "Employer coverage, COBRA, retirement, and enrollment timing",
    authority: "primary-explanatory",
  },
  {
    id: "medigap-timing",
    title: "Get ready to buy Medigap",
    url: "https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-11-01",
    geography: "Federal baseline; state protections may add rights",
    supports: "Medigap open enrollment, availability, and timing warnings",
    authority: "primary-explanatory",
  },
  {
    id: "plan-finder",
    title: "Medicare Plan Finder",
    url: "https://www.medicare.gov/plan-compare/",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-10-01",
    geography: "United States; plan availability is local",
    supports: "Plan-specific availability, benefits, formularies, pharmacies, and estimated drug cost",
    authority: "primary-explanatory",
  },
  {
    id: "msp-extra-help",
    title: "Medicare Savings Programs",
    url: "https://www.medicare.gov/basics/costs/help/medicare-savings-programs",
    agency: "Centers for Medicare & Medicaid Services",
    effectiveYear: 2026,
    lastVerified: "2026-08-09",
    nextReview: "2026-10-01",
    geography: "Federal reference values; state rules can differ",
    supports: "Medicare Savings Program and Extra Help pathways",
    authority: "primary-explanatory",
  },
  {
    id: "ssa-enrollment",
    title: "Sign up for Medicare",
    url: "https://www.ssa.gov/medicare/sign-up",
    agency: "Social Security Administration",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2027-02-01",
    geography: "United States",
    supports: "Part A and Part B enrollment action",
    authority: "controlling",
  },
  {
    id: "ship",
    title: "Find your local SHIP",
    url: "https://www.shiphelp.org/",
    agency: "State Health Insurance Assistance Program Technical Assistance Center",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2027-02-01",
    geography: "United States; state and territory programs",
    supports: "Free, local, one-on-one Medicare counseling",
    authority: "primary-explanatory",
  },
  {
    id: "cfr-422-marketing",
    title: "42 CFR Part 422, Subpart V",
    url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-V",
    agency: "Centers for Medicare & Medicaid Services / Office of the Federal Register",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-11-01",
    geography: "United States",
    supports: "Medicare Advantage communications, marketing, TPMO, agent, broker, and third-party requirements",
    authority: "controlling",
  },
  {
    id: "cfr-423-marketing",
    title: "42 CFR Part 423, Subpart V",
    url: "https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-423/subpart-V",
    agency: "Centers for Medicare & Medicaid Services / Office of the Federal Register",
    effectiveYear: "current",
    lastVerified: "2026-08-09",
    nextReview: "2026-11-01",
    geography: "United States",
    supports: "Part D communications, marketing, and TPMO definitions",
    authority: "controlling",
  },
];

export const getStaleMedicareSources = (asOf = new Date()) => MEDICARE_COVERAGE_SOURCE_REGISTRY.filter((source) => (
  new Date(`${source.nextReview}T00:00:00Z`).getTime() < asOf.getTime()
));
