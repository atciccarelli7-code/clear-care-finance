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
