export type Source = {
  name: string;       // e.g. "Medicare.gov"
  pageTitle: string;  // page or topic title
  url: string;
  note?: string;      // why this source is useful
};

export const SOURCE_PRESETS: Record<string, Source> = {
  medicare: {
    name: "Medicare.gov",
    pageTitle: "Official Medicare program information",
    url: "https://www.medicare.gov",
    note: "Federal site for benefits, enrollment, and coverage rules.",
  },
  medicaid: {
    name: "Medicaid.gov",
    pageTitle: "Federal Medicaid program overview",
    url: "https://www.medicaid.gov",
    note: "Eligibility frameworks and state-by-state program details.",
  },
  cms: {
    name: "CMS",
    pageTitle: "Centers for Medicare & Medicaid Services",
    url: "https://www.cms.gov",
    note: "Regulator that publishes the underlying coverage and payment rules.",
  },
  kff: {
    name: "KFF",
    pageTitle: "Health policy research and explainers",
    url: "https://www.kff.org",
    note: "Independent analysis on insurance, Medicare, and Medicaid.",
  },
  medicareParts: {
    name: "Medicare.gov",
    pageTitle: "Parts of Medicare",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/parts-of-medicare",
    note: "Official overview of Part A, Part B, Medicare Advantage, and Part D.",
  },
  medicareMedigap: {
    name: "Medicare.gov",
    pageTitle: "Medigap basics",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics",
    note: "Official explanation of how Medicare Supplement insurance works with Original Medicare.",
  },
  medicareLongTermCare: {
    name: "Medicare.gov",
    pageTitle: "Long-term care coverage",
    url: "https://www.medicare.gov/coverage/long-term-care",
    note: "Official coverage guidance for long-term and custodial care.",
  },
  medicaidEligibility: {
    name: "Medicaid.gov",
    pageTitle: "Medicaid eligibility",
    url: "https://www.medicaid.gov/medicaid/eligibility/index.html",
    note: "Federal eligibility framework; each state administers its own program within federal rules.",
  },
  medicaidLtss: {
    name: "Medicaid.gov",
    pageTitle: "Long-term services and supports",
    url: "https://www.medicaid.gov/medicaid/long-term-services-supports/index.html",
    note: "Federal overview of Medicaid long-term services and supports, with state-administered coverage.",
  },
  cmsMedicaidCoordination: {
    name: "CMS",
    pageTitle: "Medicare-Medicaid coordination",
    url: "https://www.cms.gov/medicare/medicaid-coordination/about",
    note: "CMS resources for coordinating benefits for people enrolled in both programs.",
  },
  kffMedicareAdvantage2026: {
    name: "KFF",
    pageTitle: "Medicare Advantage in 2026: Enrollment Update and Key Trends",
    url: "https://www.kff.org/medicare/medicare-advantage-in-2026-enrollment-update-and-key-trends/",
    note: "Independent current context on Medicare Advantage enrollment and plan trends.",
  },
  kffMedicaid101: {
    name: "KFF",
    pageTitle: "Medicaid 101",
    url: "https://www.kff.org/medicaid/health-policy-101-medicaid/",
    note: "Independent overview of Medicaid structure, financing, eligibility, and benefits.",
  },
  irs: {
    name: "IRS",
    pageTitle: "Retirement plan and tax guidance",
    url: "https://www.irs.gov/retirement-plans",
    note: "Official contribution limits and tax treatment for 403(b), HSA, FSA.",
  },
  bls: {
    name: "Bureau of Labor Statistics",
    pageTitle: "Healthcare occupational wage data",
    url: "https://www.bls.gov/oes/current/oes_nat.htm",
    note: "Published wage data for healthcare occupations.",
  },
  federalReserve: {
    name: "Federal Reserve",
    pageTitle: "Household economic data",
    url: "https://www.federalreserve.gov/publications/report-economic-well-being-us-households.htm",
    note: "Household financial well-being and savings benchmarks.",
  },
  healthcareGov: {
    name: "Healthcare.gov",
    pageTitle: "Marketplace insurance basics",
    url: "https://www.healthcare.gov",
    note: "Definitions for premiums, deductibles, copays, and coinsurance.",
  },
};
