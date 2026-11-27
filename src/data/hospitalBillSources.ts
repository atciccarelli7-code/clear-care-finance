export interface HospitalBillSource {
  id: string;
  organization: string;
  title: string;
  url: string;
  verifiedAt: string;
  scope: string;
  limitations: string;
}

export interface HospitalBenchmark {
  hospital: string; ccn: string; city: string; state: string;
  reportingYear: number; drg: string; description: string; discharges: number;
  averageCoveredCharges: number; averageTotalPayments: number; averageMedicarePayments: number;
  sourceUrl: string; recordId: string; datasetVersion: string; publishedAt: string; retrievedAt: string;
  limitations: string[];
}

export const hospitalBillVerifiedAt = '2026-11-27';
export const hospitalBillSources: HospitalBillSource[] = [
  {
    id: 'cms-inpatient', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Medicare Inpatient Hospitals — by Provider and Service, 2024',
    url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-inpatient-hospitals/medicare-inpatient-hospitals-by-provider-and-service',
    verifiedAt: hospitalBillVerifiedAt, scope: '2024 Original Medicare fee-for-service inpatient discharges; public version modified April 23, 2026.',
    limitations: 'Hospital-and-DRG averages; excludes records with 10 or fewer discharges. Not current prices or patient claims. Raw filtered responses are preserved in the research record.',
  },
  {
    id: 'cms-dictionary', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Inpatient provider-and-service data dictionary',
    url: 'https://data.cms.gov/resources/medicare-inpatient-hospitals-by-provider-and-service-data-dictionary-0',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Definitions of covered charges, total payments and Medicare payments; cross-checked against the readable CMS dictionary PDF.',
    limitations: 'Total payments include patient cost sharing and third-party coordination of benefits. Subtracting a current deductible from a historical average does not recover an observed insurer payment.',
  },
  {
    id: 'cms-dictionary-pdf', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Readable CMS inpatient data dictionary (May 2023 definitions)',
    url: 'https://data.cms.gov/sites/default/files/2023-05/394bc336-d146-4579-8ff3-9260c96ecd4e/MUP_INP_RY23_20230426_DD_PrvSrvc_508.pdf',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Payment definitions independently read in CMS PDF and reconciled with the current dataset landing-page definition.',
    limitations: 'Historical dictionary documents definitions, not the 2024 numerical records. Current column schema separately verified through the CMS connector.',
  },
  {
    id: 'medicare-costs', organization: 'Medicare.gov',
    title: 'Medicare costs: 2026 and announced 2027 amounts',
    url: 'https://www.medicare.gov/basics/costs/medicare-costs',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Calendar-year cost sharing; Part A deductible is per benefit period. Physician services generally use Part B.',
    limitations: 'Original Medicare has no annual medical out-of-pocket maximum. Premiums, drug coverage and noncovered services are outside this model.',
  },
  {
    id: 'medigap', organization: 'Medicare.gov',
    title: 'Compare Medigap plan benefits',
    url: 'https://www.medicare.gov/health-drug-plans/medigap/basics/compare-plan-benefits',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Standardized benefits, including standard Plan G; high-deductible variants differ.',
    limitations: 'Standard Plan G does not cover the Part B deductible. Plan N has some office and emergency copayments. Premiums and availability vary.',
  },
  {
    id: 'ipps', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Medicare Payment Systems: acute inpatient payment',
    url: 'https://www.cms.gov/Outreach-and-Education/Medicare-Learning-Network-MLN/MLNProducts/html/medicare-payment-systems.html',
    verifiedAt: hospitalBillVerifiedAt, scope: 'IPPS case payments, DRG severity, wage and teaching adjustments, outliers and transfer policy.',
    limitations: 'A fixed case amount is an educational simplification. Actual payment depends on coded facts and policy adjustments; additional days are not always covered.',
  },
  {
    id: 'inpatient-status', organization: 'Medicare.gov',
    title: 'Inpatient or outpatient hospital status affects your costs',
    url: 'https://www.medicare.gov/coverage/inpatient-hospital-care/inpatient-outpatient-status',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Formal inpatient admission versus outpatient observation; outpatient copayment distinctions.',
    limitations: 'An overnight bed does not establish inpatient status. Actual outpatient payment needs service-level packaging, drug and copayment information.',
  },
  {
    id: 'inpatient-coverage', organization: 'Medicare.gov',
    title: 'Inpatient hospital care',
    url: 'https://www.medicare.gov/coverage/inpatient-hospital-care',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Hospital benefit and separately billed physician services.',
    limitations: 'Medical necessity, admission status and coverage criteria remain necessary; the scenarios do not determine eligibility.',
  },
  {
    id: 'snf', organization: 'Medicare.gov',
    title: 'Skilled nursing facility care',
    url: 'https://www.medicare.gov/coverage/skilled-nursing-facility-care',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Skilled care and qualifying inpatient stay requirements under Original Medicare.',
    limitations: 'Observation generally does not count toward the three-day inpatient requirement. Waivers and other exceptions may apply; custodial care is different.',
  },
  {
    id: 'eob', organization: 'Centers for Medicare & Medicaid Services',
    title: 'How to read an explanation of benefits',
    url: 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/read-explanation-benefits',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Payer explanation of claim processing; an EOB is not a bill.',
    limitations: 'The educational EOB is not a real payer document. Original Medicare generally sends a Medicare Summary Notice.',
  },
  {
    id: 'bill', organization: 'Centers for Medicare & Medicaid Services',
    title: 'How to read your medical bill',
    url: 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/how-read-your-bill',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Match service dates, patient information, services and insurer processing.',
    limitations: 'A confusing line does not establish an error or fraud; obtain the itemization and ask the billing office.',
  },
  {
    id: 'qmb', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Prohibition on billing Qualified Medicare Beneficiaries',
    url: 'https://www.cms.gov/files/document/mln7936176-prohibition-billing-qualified-medicare-beneficiaries.pdf',
    verifiedAt: hospitalBillVerifiedAt, scope: 'September 2025 CMS guidance: QMB Medicare Part A/B cost-sharing protections.',
    limitations: 'Providers cannot bill a QMB for covered Medicare cost sharing even if Medicaid pays nothing. Dual eligibility alone is not modeled as proof of QMB status.',
  },
  {
    id: 'nc-medicaid', organization: 'North Carolina Department of Health and Human Services',
    title: 'NC Medicaid copays',
    url: 'https://medicaid.ncdhhs.gov/about-nc-medicaid/nc-medicaid-copays',
    verifiedAt: hospitalBillVerifiedAt, scope: 'NC only; page modified April 24, 2026. Listed outpatient/doctor copays are $4, with exempt populations and services.',
    limitations: 'The inpatient facility example assumes covered participating-provider care and no inpatient copay. It does not claim all Medicaid beneficiaries nationwide owe zero.',
  },
  {
    id: 'surprise-billing', organization: 'Centers for Medicare & Medicaid Services',
    title: 'Know your medical bill rights',
    url: 'https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-rights',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Federal surprise-billing protections for qualifying emergency and certain non-emergency out-of-network care.',
    limitations: 'Do not automatically add a balance bill for protected services. Ground ambulance generally falls outside federal NSA protections; state law and plan rules may differ.',
  },
  {
    id: 'financial-assistance', organization: 'Internal Revenue Service',
    title: 'Financial assistance policies — Section 501(r)(4)',
    url: 'https://www.irs.gov/charities-non-profits/financial-assistance-policy-and-emergency-medical-care-policy-section-501r4',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Requirements for charitable hospital financial-assistance and emergency-care policies.',
    limitations: 'Eligibility and provider coverage follow the actual policy. A hospital’s policy may not cover every separately billing professional.',
  },
  {
    id: 'cost-method', organization: 'Agency for Healthcare Research and Quality',
    title: 'HCUP cost-to-charge ratio files',
    url: 'https://hcup-us.ahrq.gov/db/ccr/costtocharge.jsp',
    verifiedAt: hospitalBillVerifiedAt, scope: 'Cost-estimation methodology distinguishes hospital charges from resource costs.',
    limitations: 'Hospital-wide ratios do not prove admission-specific cost or profit. No admission-level operating-cost observation is available in this product.',
  },
];

export const hospitalBenchmarks: HospitalBenchmark[] = [
  {
    "hospital": "Novant Health Presbyterian Medical Center",
    "ccn": "340053",
    "city": "Charlotte",
    "state": "NC",
    "reportingYear": 2024,
    "drg": "194",
    "description": "SIMPLE PNEUMONIA AND PLEURISY WITH CC",
    "discharges": 24,
    "averageCoveredCharges": 35054.958333,
    "averageTotalPayments": 7540.9583333,
    "averageMedicarePayments": 5686.375,
    "sourceUrl": "https://data.cms.gov/data-api/v1/dataset/ca9b5ef0-1386-4759-b2b6-5f9b35116786/data?size=10&offset=0&sort=Rndrng_Prvdr_CCN%2CDRG_Cd&filter%5Bfilter-0%5D%5Bcondition%5D%5Bpath%5D=Rndrng_Prvdr_Org_Name&filter%5Bfilter-0%5D%5Bcondition%5D%5Boperator%5D=CONTAINS&filter%5Bfilter-0%5D%5Bcondition%5D%5Bvalue%5D=Presbyterian&filter%5BDRG_Cd%5D=194&filter%5BRndrng_Prvdr_State_Abrvtn%5D=NC",
    "recordId": "ca9b5ef0-1386-4759-b2b6-5f9b35116786:340053:194",
    "datasetVersion": "ca9b5ef0-1386-4759-b2b6-5f9b35116786",
    "publishedAt": "2026-04-23",
    "retrievedAt": "2026-11-27",
    "limitations": [
      "Original Medicare fee-for-service inpatient aggregate; not Medicare Advantage, commercial prices, an individual claim or hospital costs.",
      "Average total payments include beneficiary responsibility and coordination-of-benefits amounts; not proof of collected revenue.",
      "Same DRG and year do not adjust for teaching, wage index, patient mix, outliers or transfers. CMS suppresses rows with 10 or fewer discharges."
    ]
  },
  {
    "hospital": "Carolinas Medical Center/Behav Health",
    "ccn": "340113",
    "city": "Charlotte",
    "state": "NC",
    "reportingYear": 2024,
    "drg": "194",
    "description": "SIMPLE PNEUMONIA AND PLEURISY WITH CC",
    "discharges": 65,
    "averageCoveredCharges": 43645.307692,
    "averageTotalPayments": 12976.215385,
    "averageMedicarePayments": 6931.5692308,
    "sourceUrl": "https://data.cms.gov/data-api/v1/dataset/ca9b5ef0-1386-4759-b2b6-5f9b35116786/data?size=10&offset=0&sort=Rndrng_Prvdr_CCN%2CDRG_Cd&filter%5Bfilter-0%5D%5Bcondition%5D%5Bpath%5D=Rndrng_Prvdr_Org_Name&filter%5Bfilter-0%5D%5Bcondition%5D%5Boperator%5D=CONTAINS&filter%5Bfilter-0%5D%5Bcondition%5D%5Bvalue%5D=Carolinas+Medical+Center&filter%5BDRG_Cd%5D=194&filter%5BRndrng_Prvdr_State_Abrvtn%5D=NC",
    "recordId": "ca9b5ef0-1386-4759-b2b6-5f9b35116786:340113:194",
    "datasetVersion": "ca9b5ef0-1386-4759-b2b6-5f9b35116786",
    "publishedAt": "2026-04-23",
    "retrievedAt": "2026-11-27",
    "limitations": [
      "Original Medicare fee-for-service inpatient aggregate; not Medicare Advantage, commercial prices, an individual claim or hospital costs.",
      "Average total payments include beneficiary responsibility and coordination-of-benefits amounts; not proof of collected revenue.",
      "Same DRG and year do not adjust for teaching, wage index, patient mix, outliers or transfers. CMS suppresses rows with 10 or fewer discharges."
    ]
  },
  {
    "hospital": "Novant Health Presbyterian Medical Center",
    "ccn": "340053",
    "city": "Charlotte",
    "state": "NC",
    "reportingYear": 2024,
    "drg": "291",
    "description": "HEART FAILURE AND SHOCK WITH MCC",
    "discharges": 109,
    "averageCoveredCharges": 37941.761468,
    "averageTotalPayments": 10122.889908,
    "averageMedicarePayments": 9135.6880734,
    "sourceUrl": "https://data.cms.gov/data-api/v1/dataset/ca9b5ef0-1386-4759-b2b6-5f9b35116786/data?size=10&offset=0&sort=Rndrng_Prvdr_CCN%2CDRG_Cd&filter%5Bfilter-0%5D%5Bcondition%5D%5Bpath%5D=Rndrng_Prvdr_Org_Name&filter%5Bfilter-0%5D%5Bcondition%5D%5Boperator%5D=CONTAINS&filter%5Bfilter-0%5D%5Bcondition%5D%5Bvalue%5D=Presbyterian&filter%5BDRG_Cd%5D=291&filter%5BRndrng_Prvdr_State_Abrvtn%5D=NC",
    "recordId": "ca9b5ef0-1386-4759-b2b6-5f9b35116786:340053:291",
    "datasetVersion": "ca9b5ef0-1386-4759-b2b6-5f9b35116786",
    "publishedAt": "2026-04-23",
    "retrievedAt": "2026-11-27",
    "limitations": [
      "Original Medicare fee-for-service inpatient aggregate; not Medicare Advantage, commercial prices, an individual claim or hospital costs.",
      "Average total payments include beneficiary responsibility and coordination-of-benefits amounts; not proof of collected revenue.",
      "Same DRG and year do not adjust for teaching, wage index, patient mix, outliers or transfers. CMS suppresses rows with 10 or fewer discharges."
    ]
  },
  {
    "hospital": "Carolinas Medical Center/Behav Health",
    "ccn": "340113",
    "city": "Charlotte",
    "state": "NC",
    "reportingYear": 2024,
    "drg": "291",
    "description": "HEART FAILURE AND SHOCK WITH MCC",
    "discharges": 155,
    "averageCoveredCharges": 49953.258065,
    "averageTotalPayments": 15709.303226,
    "averageMedicarePayments": 10502.954839,
    "sourceUrl": "https://data.cms.gov/data-api/v1/dataset/ca9b5ef0-1386-4759-b2b6-5f9b35116786/data?size=10&offset=0&sort=Rndrng_Prvdr_CCN%2CDRG_Cd&filter%5Bfilter-0%5D%5Bcondition%5D%5Bpath%5D=Rndrng_Prvdr_Org_Name&filter%5Bfilter-0%5D%5Bcondition%5D%5Boperator%5D=CONTAINS&filter%5Bfilter-0%5D%5Bcondition%5D%5Bvalue%5D=Carolinas+Medical+Center&filter%5BDRG_Cd%5D=291&filter%5BRndrng_Prvdr_State_Abrvtn%5D=NC",
    "recordId": "ca9b5ef0-1386-4759-b2b6-5f9b35116786:340113:291",
    "datasetVersion": "ca9b5ef0-1386-4759-b2b6-5f9b35116786",
    "publishedAt": "2026-04-23",
    "retrievedAt": "2026-11-27",
    "limitations": [
      "Original Medicare fee-for-service inpatient aggregate; not Medicare Advantage, commercial prices, an individual claim or hospital costs.",
      "Average total payments include beneficiary responsibility and coordination-of-benefits amounts; not proof of collected revenue.",
      "Same DRG and year do not adjust for teaching, wage index, patient mix, outliers or transfers. CMS suppresses rows with 10 or fewer discharges."
    ]
  }
];

