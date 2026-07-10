export const ELIGIBILITY_LAST_REVIEWED = "2026-07-10";

export type OfficialSource = {
  id: string;
  title: string;
  url: string;
  effectiveDate: string;
  lastReviewed: string;
};

export const OFFICIAL_ELIGIBILITY_SOURCES = {
  medicareBefore65: {
    id: "medicare-before-65",
    title: "Medicare.gov: Getting Social Security benefits before 65",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/before-65",
    effectiveDate: "Current federal guidance",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicareEnrollmentTiming: {
    id: "medicare-enrollment-timing",
    title: "Medicare.gov: When can I sign up for Medicare?",
    url: "https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-can-i-sign-up-for-medicare",
    effectiveDate: "Current federal guidance",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicareEsrd: {
    id: "medicare-esrd",
    title: "Medicare.gov: End-Stage Renal Disease coverage",
    url: "https://www.medicare.gov/basics/end-stage-renal-disease",
    effectiveDate: "Current federal guidance",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  ssaDisabilityMedicare: {
    id: "ssa-disability-medicare",
    title: "SSA.gov: Medicare information for disability beneficiaries",
    url: "https://www.ssa.gov/disabilityresearch/wi/medicare.htm",
    effectiveDate: "Current federal guidance",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicaidEligibility: {
    id: "medicaid-eligibility",
    title: "Medicaid.gov: Eligibility policy",
    url: "https://www.medicaid.gov/medicaid/eligibility-policy",
    effectiveDate: "Current federal and state framework",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicaidStateContacts: {
    id: "medicaid-state-contacts",
    title: "Medicaid.gov: Official state Medicaid and CHIP contacts",
    url: "https://www.medicaid.gov/about-us/where-can-people-get-help-medicaid-chip",
    effectiveDate: "Current state contact directory",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicareSavingsPrograms: {
    id: "medicare-savings-programs",
    title: "Medicare.gov: Medicare Savings Programs",
    url: "https://www.medicare.gov/basics/costs/help/medicare-savings-programs",
    effectiveDate: "2026 federal limits",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicaidLongTermCare: {
    id: "medicaid-long-term-care",
    title: "Medicaid.gov: Long-term services and supports",
    url: "https://www.medicaid.gov/medicaid/long-term-services-supports",
    effectiveDate: "Current federal and state framework",
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
} satisfies Record<string, OfficialSource>;

export const FEDERAL_ELIGIBILITY_RULES = {
  medicareAge: {
    value: 65,
    unit: "years",
    effectiveDate: "Current federal rule",
    sourceUrl: OFFICIAL_ELIGIBILITY_SOURCES.medicareEnrollmentTiming.url,
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  disabilityMedicareWait: {
    value: 24,
    unit: "months of Social Security disability benefit entitlement",
    effectiveDate: "Current federal rule",
    sourceUrl: OFFICIAL_ELIGIBILITY_SOURCES.ssaDisabilityMedicare.url,
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
  },
  medicareSavingsPrograms2026: {
    effectiveDate: "2026",
    sourceUrl: OFFICIAL_ELIGIBILITY_SOURCES.medicareSavingsPrograms.url,
    lastReviewed: ELIGIBILITY_LAST_REVIEWED,
    individual: {
      qmbMonthlyIncome: 1350,
      slmbMonthlyIncome: 1616,
      qiMonthlyIncome: 1816,
      standardResourceLimit: 9950,
    },
    marriedCouple: {
      qmbMonthlyIncome: 1824,
      slmbMonthlyIncome: 2184,
      qiMonthlyIncome: 2455,
      standardResourceLimit: 14910,
    },
  },
} as const;

export type StateCode =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "DC" | "FL"
  | "GA" | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME"
  | "MD" | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH"
  | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI"
  | "SC" | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI"
  | "WY";

export type StateMedicaidLink = {
  code: StateCode;
  name: string;
  agencyName: string;
  officialUrl: string;
  directorySourceUrl: string;
  lastReviewed: string;
};

const STATE_DIRECTORY_SOURCE = OFFICIAL_ELIGIBILITY_SOURCES.medicaidStateContacts.url;

export const STATE_MEDICAID_LINKS: StateMedicaidLink[] = [
  { code: "AL", name: "Alabama", agencyName: "Alabama Medicaid", officialUrl: "https://medicaid.alabama.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "AK", name: "Alaska", agencyName: "Alaska Medicaid", officialUrl: "https://health.alaska.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "AZ", name: "Arizona", agencyName: "Arizona Health Care Cost Containment System", officialUrl: "https://www.azahcccs.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "AR", name: "Arkansas", agencyName: "Arkansas Medicaid", officialUrl: "https://humanservices.arkansas.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "CA", name: "California", agencyName: "California Department of Health Care Services", officialUrl: "https://www.dhcs.ca.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "CO", name: "Colorado", agencyName: "Health First Colorado", officialUrl: "https://www.healthfirstcolorado.com/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "CT", name: "Connecticut", agencyName: "Connecticut Medicaid / HUSKY Health", officialUrl: "https://portal.ct.gov/dss/health-and-home-care/health-and-home-care", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "DE", name: "Delaware", agencyName: "Delaware Medicaid & Medical Assistance", officialUrl: "https://dhss.delaware.gov/dhss/dmma/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "DC", name: "District of Columbia", agencyName: "DC Medicaid", officialUrl: "https://districtdirect.dc.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "FL", name: "Florida", agencyName: "Florida Medicaid", officialUrl: "https://ahca.myflorida.com/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "GA", name: "Georgia", agencyName: "Georgia Medicaid", officialUrl: "https://medicaid.georgia.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "HI", name: "Hawaii", agencyName: "Hawaii Med-QUEST Division", officialUrl: "https://medquest.hawaii.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "ID", name: "Idaho", agencyName: "Idaho Department of Health & Welfare", officialUrl: "https://healthandwelfare.idaho.gov/services-programs/medicaid-health", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "IL", name: "Illinois", agencyName: "Illinois Department of Healthcare and Family Services", officialUrl: "https://hfs.illinois.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "IN", name: "Indiana", agencyName: "Indiana Medicaid", officialUrl: "https://www.in.gov/medicaid/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "IA", name: "Iowa", agencyName: "Iowa Medicaid", officialUrl: "https://hhs.iowa.gov/programs/welcome-iowa-medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "KS", name: "Kansas", agencyName: "KanCare", officialUrl: "https://www.kancare.ks.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "KY", name: "Kentucky", agencyName: "Kentucky Medicaid", officialUrl: "https://www.chfs.ky.gov/agencies/dms/Pages/default.aspx", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "LA", name: "Louisiana", agencyName: "Healthy Louisiana", officialUrl: "https://ldh.la.gov/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "ME", name: "Maine", agencyName: "MaineCare", officialUrl: "https://www.maine.gov/dhhs/oms", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MD", name: "Maryland", agencyName: "Maryland Medicaid", officialUrl: "https://health.maryland.gov/mmcp/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MA", name: "Massachusetts", agencyName: "MassHealth", officialUrl: "https://www.mass.gov/masshealth", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MI", name: "Michigan", agencyName: "Michigan Medicaid", officialUrl: "https://www.michigan.gov/mdhhs/assistance-programs/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MN", name: "Minnesota", agencyName: "Minnesota Department of Human Services", officialUrl: "https://mn.gov/dhs/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MS", name: "Mississippi", agencyName: "Mississippi Division of Medicaid", officialUrl: "https://medicaid.ms.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MO", name: "Missouri", agencyName: "MO HealthNet", officialUrl: "https://mydss.mo.gov/healthcare", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "MT", name: "Montana", agencyName: "Montana Medicaid", officialUrl: "https://dphhs.mt.gov/MontanaHealthcarePrograms/Medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NE", name: "Nebraska", agencyName: "Nebraska Medicaid and Long-Term Care", officialUrl: "https://dhhs.ne.gov/Pages/Medicaid-and-Long-Term-Care.aspx", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NV", name: "Nevada", agencyName: "Nevada Medicaid", officialUrl: "https://dhcfp.nv.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NH", name: "New Hampshire", agencyName: "New Hampshire Medicaid", officialUrl: "https://www.dhhs.nh.gov/programs-services/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NJ", name: "New Jersey", agencyName: "NJ FamilyCare", officialUrl: "https://www.njfamilycare.org/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NM", name: "New Mexico", agencyName: "New Mexico Medicaid", officialUrl: "https://www.hca.nm.gov/lookingforassistance/medicaid/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NY", name: "New York", agencyName: "New York State Medicaid", officialUrl: "https://www.health.ny.gov/health_care/medicaid/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "NC", name: "North Carolina", agencyName: "NC Medicaid", officialUrl: "https://medicaid.ncdhhs.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "ND", name: "North Dakota", agencyName: "North Dakota Medicaid", officialUrl: "https://www.hhs.nd.gov/healthcare/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "OH", name: "Ohio", agencyName: "Ohio Department of Medicaid", officialUrl: "https://medicaid.ohio.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "OK", name: "Oklahoma", agencyName: "Oklahoma Health Care Authority", officialUrl: "https://oklahoma.gov/ohca.html", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "OR", name: "Oregon", agencyName: "Oregon Health Plan", officialUrl: "https://www.oregon.gov/oha/hsd/ohp/pages/index.aspx", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "PA", name: "Pennsylvania", agencyName: "Pennsylvania Medical Assistance", officialUrl: "https://www.dhs.pa.gov/Services/Assistance/Pages/Medical-Assistance.aspx", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "RI", name: "Rhode Island", agencyName: "Rhode Island Medicaid", officialUrl: "https://eohhs.ri.gov/consumer/medical-assistance", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "SC", name: "South Carolina", agencyName: "South Carolina Healthy Connections Medicaid", officialUrl: "https://www.scdhhs.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "SD", name: "South Dakota", agencyName: "South Dakota Medicaid", officialUrl: "https://dss.sd.gov/medicaid/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "TN", name: "Tennessee", agencyName: "TennCare", officialUrl: "https://www.tn.gov/tenncare.html", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "TX", name: "Texas", agencyName: "Texas Medicaid and CHIP", officialUrl: "https://www.hhs.texas.gov/services/health/medicaid-chip", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "UT", name: "Utah", agencyName: "Utah Medicaid", officialUrl: "https://medicaid.utah.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "VT", name: "Vermont", agencyName: "Vermont Medicaid", officialUrl: "https://dvha.vermont.gov/members/medicaid", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "VA", name: "Virginia", agencyName: "Virginia Department of Medical Assistance Services", officialUrl: "https://www.dmas.virginia.gov/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "WA", name: "Washington", agencyName: "Washington Apple Health", officialUrl: "https://www.hca.wa.gov/free-or-low-cost-health-care/apple-health-medicaid-coverage", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "WV", name: "West Virginia", agencyName: "West Virginia Medicaid", officialUrl: "https://dhhr.wv.gov/bms/Pages/default.aspx", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "WI", name: "Wisconsin", agencyName: "Wisconsin Medicaid", officialUrl: "https://www.dhs.wisconsin.gov/medicaid/index.htm", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
  { code: "WY", name: "Wyoming", agencyName: "Wyoming Medicaid", officialUrl: "https://health.wyo.gov/healthcarefin/medicaid/", directorySourceUrl: STATE_DIRECTORY_SOURCE, lastReviewed: ELIGIBILITY_LAST_REVIEWED },
];

export const getStateMedicaidLink = (code: StateCode | "") =>
  STATE_MEDICAID_LINKS.find((state) => state.code === code);
