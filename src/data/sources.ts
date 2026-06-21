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
  medicareCosts: {
    name: "Medicare.gov",
    pageTitle: "Medicare costs",
    url: "https://www.medicare.gov/basics/costs/medicare-costs",
    note: "Official Medicare premiums, deductibles, coinsurance, and cost-sharing amounts.",
  },
  medicareCompareOriginalAdvantage: {
    name: "Medicare.gov",
    pageTitle: "Compare Original Medicare & Medicare Advantage",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage",
    note: "Official comparison of provider access, referrals, drug coverage, and plan rules.",
  },
  medicareSnf: {
    name: "Medicare.gov",
    pageTitle: "Skilled nursing facility care",
    url: "https://www.medicare.gov/coverage/skilled-nursing-facility-care",
    note: "Official Medicare coverage guidance for post-hospital skilled nursing facility care.",
  },
  medicareHomeHealth: {
    name: "Medicare.gov",
    pageTitle: "Home health services",
    url: "https://www.medicare.gov/coverage/home-health-services",
    note: "Official Medicare coverage guidance for skilled home health services.",
  },
  medicareDme: {
    name: "Medicare.gov",
    pageTitle: "Durable medical equipment coverage",
    url: "https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage",
    note: "Official Medicare coverage guidance for equipment used at home.",
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
  medicareMedigapHowWorks: {
    name: "Medicare.gov",
    pageTitle: "How Medigap works",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics/how-medigap-works",
    note: "Official explanation of how Medigap helps with Original Medicare cost-sharing.",
  },
  medicareMedigapCompareBenefits: {
    name: "Medicare.gov",
    pageTitle: "Compare Medigap plan benefits",
    url: "https://www.medicare.gov/health-drug-plans/medigap/basics/compare-plan-benefits",
    note: "Official Medigap benefit comparison, including skilled nursing facility coinsurance coverage by plan type.",
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
  kffMedicareCoverageSnapshot: {
    name: "KFF",
    pageTitle: "A Snapshot of Sources of Coverage Among Medicare Beneficiaries",
    url: "https://www.kff.org/medicare/a-snapshot-of-sources-of-coverage-among-medicare-beneficiaries/",
    note: "Independent context on Medicare Advantage, Traditional Medicare, supplemental coverage, and dual eligibility.",
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
  reutersMedicaidWorkRequirements2027: {
    name: "Reuters",
    pageTitle: "US agency announces interim guidance on Medicaid work requirements",
    url: "https://www.reuters.com/world/us-agency-announces-interim-guidance-medicaid-work-requirements-2026-06-01/",
    note: "Current reporting on CMS interim guidance for the January 1, 2027 Medicaid work-rule rollout.",
  },
  kiplingerObbbMedicareMedicaid: {
    name: "Kiplinger",
    pageTitle: "Four Proposed Changes to Medicare in the One Big Beautiful Bill Act — and What Ended Up in the Signed Bill",
    url: "https://www.kiplinger.com/retirement/medicare/changes-to-medicare-in-the-one-big-beautiful-bill-act",
    note: "Summary separating limited direct Medicare changes from broader Medicaid provisions in the signed law.",
  },
  investopediaObbbMedicaid: {
    name: "Investopedia",
    pageTitle: "What Medicaid Recipients Should Know About The One Big Beautiful Bill",
    url: "https://www.investopedia.com/what-medicaid-recipients-should-know-about-the-one-big-beautiful-bill-11773484",
    note: "Consumer-oriented summary of Medicaid verification, cost-sharing, retroactive coverage, and long-term care concerns.",
  },
  healthcareGovPremium: {
    name: "HealthCare.gov",
    pageTitle: "Premium",
    url: "https://www.healthcare.gov/glossary/premium/",
    note: "Official Marketplace definition for monthly insurance premiums.",
  },
  healthcareGovDeductible: {
    name: "HealthCare.gov",
    pageTitle: "Deductible",
    url: "https://www.healthcare.gov/glossary/deductible/",
    note: "Official Marketplace definition for deductibles.",
  },
  healthcareGovCopayment: {
    name: "HealthCare.gov",
    pageTitle: "Copayment",
    url: "https://www.healthcare.gov/glossary/co-payment/",
    note: "Official Marketplace definition for fixed copayments.",
  },
  healthcareGovCoinsurance: {
    name: "HealthCare.gov",
    pageTitle: "Coinsurance",
    url: "https://www.healthcare.gov/glossary/co-insurance/",
    note: "Official Marketplace definition for percentage cost-sharing.",
  },
  healthcareGovOutOfPocketMax: {
    name: "HealthCare.gov",
    pageTitle: "Out-of-pocket maximum/limit",
    url: "https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/",
    note: "Official Marketplace definition for annual covered in-network cost limits.",
  },
  healthcareGovHmo: {
    name: "HealthCare.gov",
    pageTitle: "Health Maintenance Organization (HMO)",
    url: "https://www.healthcare.gov/glossary/health-maintenance-organization-hmo/",
    note: "Official Marketplace definition for HMO plan structure.",
  },
  healthcareGovDental: {
    name: "HealthCare.gov",
    pageTitle: "Dental coverage in the Marketplace",
    url: "https://www.healthcare.gov/coverage/dental-coverage/",
    note: "Official Marketplace overview of dental coverage options and how dental benefits may be offered.",
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
