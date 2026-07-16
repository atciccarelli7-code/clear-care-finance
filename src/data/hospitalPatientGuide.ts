export type HospitalGuideStageId =
  | "before_hospital"
  | "during_stay"
  | "medications_treatments"
  | "discharge_recovery"
  | "bills_coverage";

export type HospitalGuidePageRole = "hub" | "article" | "guide" | "tool" | "checklist" | "printable" | "official-resource";
export type HospitalGuideLaunchStatus = "published" | "planned" | "blocked-review";
export type HospitalGuideSensitivity = "low" | "moderate" | "high";

export type HospitalGuideResource = {
  id: string;
  title: string;
  description: string;
  canonicalRoute: string;
  stageId: HospitalGuideStageId;
  pageRole: HospitalGuidePageRole;
  availability: "existing" | "new" | "proposed";
  launchStatus: HospitalGuideLaunchStatus;
  priority: 1 | 2 | 3;
  primarySearchIntent: string;
  audience: string[];
  clinicalSensitivity: HospitalGuideSensitivity;
  insuranceLegalSensitivity: HospitalGuideSensitivity;
  reviewRequirement: string;
  relatedTools: string[];
  relatedArticles: string[];
  officialVerificationResources: string[];
  cta: string;
};

export type HospitalGuideStage = {
  id: HospitalGuideStageId;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  prompt: string;
};

export const HOSPITAL_GUIDE_ROUTE = "/patients-families/hospital-guide";

export const HOSPITAL_GUIDE_STAGES: HospitalGuideStage[] = [
  {
    id: "before_hospital",
    number: 1,
    title: "Before going to the hospital",
    shortTitle: "Before you go",
    description: "Know what to bring, how care settings differ, and which insurance or transportation questions can be asked before a planned visit.",
    prompt: "Preparing for a planned visit or deciding where to go",
  },
  {
    id: "during_stay",
    number: 2,
    title: "During the hospital stay",
    shortTitle: "During the stay",
    description: "Understand admission, observation status, monitoring, hospital roles, routine safety steps, and why the plan can change from day to day.",
    prompt: "Trying to understand what is happening right now",
  },
  {
    id: "medications_treatments",
    number: 3,
    title: "Medications and treatments",
    shortTitle: "Medications",
    description: "Prepare safe questions about preventive medicines, temporary substitutions, testing, side effects, and what should continue after discharge.",
    prompt: "A medication or treatment is confusing or unexpected",
  },
  {
    id: "discharge_recovery",
    number: 4,
    title: "Discharge and recovery",
    shortTitle: "Discharge",
    description: "Clarify medication reconciliation, rehabilitation, home health, equipment, transportation, authorization, and the backup plan.",
    prompt: "Discharge, rehabilitation, or home support is being planned",
  },
  {
    id: "bills_coverage",
    number: 5,
    title: "Bills, insurance, and financial help",
    shortTitle: "Bills & coverage",
    description: "Separate bills from EOBs, identify facility and professional charges, verify coverage decisions, and ask about financial assistance.",
    prompt: "A bill, denial, or insurance rule needs attention",
  },
];

export const HOSPITAL_GUIDE_RESOURCES: HospitalGuideResource[] = [
  {
    id: "er_cost_explainer",
    title: "Why an ER Visit Can Be So Expensive",
    description: "See how facility, clinician, lab, imaging, medication, and insurance charges can appear after one emergency visit.",
    canonicalRoute: "/articles/why-er-visit-is-expensive",
    stageId: "before_hospital",
    pageRole: "article",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "why an emergency room visit costs so much",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "low",
    insuranceLegalSensitivity: "moderate",
    reviewRequirement: "Billing and coverage language review",
    relatedTools: ["/tools/eob-to-bill-match-checker"],
    relatedArticles: ["/articles/why-one-hospital-visit-can-create-multiple-bills"],
    officialVerificationResources: ["https://www.healthcare.gov/using-marketplace-coverage/getting-emergency-care/"],
    cta: "Understand ER charges",
  },
  {
    id: "medication_coverage_checklist",
    title: "Medication Coverage Checklist",
    description: "Verify a formulary, tier, pharmacy, prior authorization, quantity limit, and estimated prescription cost.",
    canonicalRoute: "/insurance/medication-coverage-checklist",
    stageId: "before_hospital",
    pageRole: "checklist",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "check whether a medication is covered",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "moderate",
    reviewRequirement: "Insurance qualification review",
    relatedTools: [],
    relatedArticles: [],
    officialVerificationResources: ["https://www.medicare.gov/plan-compare/"],
    cta: "Check medication coverage",
  },
  {
    id: "observation_inpatient_article",
    title: "Observation vs. Inpatient Status",
    description: "Understand why the hospital room does not determine admission status and why the distinction can affect cost and post-acute coverage.",
    canonicalRoute: "/articles/observation-vs-inpatient-status",
    stageId: "during_stay",
    pageRole: "article",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "observation versus inpatient hospital status",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "CMS notice, Medicare, plan, and appeal qualification review",
    relatedTools: ["/tools/observation-vs-inpatient-status-guide"],
    relatedArticles: ["/articles/does-medicare-cover-rehab-after-hospital-stay"],
    officialVerificationResources: ["https://www.cms.gov/medicare/forms-notices/beneficiary-notices-initiative/ffs-moon"],
    cta: "Understand hospital status",
  },
  {
    id: "observation_inpatient_tool",
    title: "Observation vs. Inpatient Status Guide",
    description: "Prepare questions about the written order, notice, cost-sharing pathway, skilled-care implications, and active deadlines.",
    canonicalRoute: "/tools/observation-vs-inpatient-status-guide",
    stageId: "during_stay",
    pageRole: "tool",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "questions to ask about observation status",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Keep local-first and verify controlling notices",
    relatedTools: ["/tools/hospital-discharge-medicare-checklist"],
    relatedArticles: ["/articles/observation-vs-inpatient-status"],
    officialVerificationResources: ["https://www.medicare.gov/basics/costs/medicare-costs/provider-service-costs/inpatient-hospital-care"],
    cta: "Prepare status questions",
  },
  {
    id: "blood_thinner_article",
    title: "Why Am I Getting a Blood Thinner in the Hospital?",
    description: "Understand preventive versus treatment use, common medication classes, bleeding concerns, and the questions to ask the bedside team.",
    canonicalRoute: "/articles/why-am-i-getting-a-blood-thinner-in-the-hospital",
    stageId: "medications_treatments",
    pageRole: "article",
    availability: "new",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "why hospitals give blood thinners",
    audience: ["hospital patients", "caregivers"],
    clinicalSensitivity: "high",
    insuranceLegalSensitivity: "low",
    reviewRequirement: "Clinical source review; no individualized dosing or treatment advice",
    relatedTools: [],
    relatedArticles: ["/articles/why-did-the-hospital-stop-or-change-my-home-medications"],
    officialVerificationResources: [
      "https://www.cdc.gov/blood-clots/risk-factors/ha-vte.html",
      "https://medlineplus.gov/druginfo/meds/a682826.html",
    ],
    cta: "Understand the medication",
  },
  {
    id: "home_medication_changes_article",
    title: "Why Did the Hospital Stop or Change My Home Medications?",
    description: "Learn why a hospital may temporarily hold, substitute, reschedule, or reassess a home medicine—and what to verify before discharge.",
    canonicalRoute: "/articles/why-did-the-hospital-stop-or-change-my-home-medications",
    stageId: "medications_treatments",
    pageRole: "article",
    availability: "new",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "why hospital stopped home medication",
    audience: ["hospital patients", "caregivers"],
    clinicalSensitivity: "high",
    insuranceLegalSensitivity: "low",
    reviewRequirement: "Clinical source review; emphasize reconciliation and discharge verification",
    relatedTools: [],
    relatedArticles: ["/articles/why-am-i-getting-a-blood-thinner-in-the-hospital"],
    officialVerificationResources: ["https://www.jointcommission.org/en-us/knowledge-library/support-center/standards-interpretation/standards-faqs/000001214"],
    cta: "Prepare medication questions",
  },
  {
    id: "discharge_coverage_guide",
    title: "Hospital Discharge Coverage Guide",
    description: "Coordinate rehabilitation, skilled nursing, home health, equipment, oxygen, transportation, medication access, and authorization.",
    canonicalRoute: "/insurance/hospital-discharge-coverage",
    stageId: "discharge_recovery",
    pageRole: "guide",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "insurance coverage after hospital discharge",
    audience: ["patients", "caregivers", "families"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Current payer and Medicare qualification review",
    relatedTools: ["/tools/hospital-discharge-medicare-checklist"],
    relatedArticles: ["/articles/does-medicare-cover-rehab-after-hospital-stay"],
    officialVerificationResources: ["https://www.medicare.gov/coverage/skilled-nursing-facility-care"],
    cta: "Plan the discharge",
  },
  {
    id: "discharge_medicare_checklist",
    title: "Hospital Discharge Medicare Checklist",
    description: "Verify hospital status, skilled need, facility eligibility, authorization, network, patient cost, and backup plans.",
    canonicalRoute: "/tools/hospital-discharge-medicare-checklist",
    stageId: "discharge_recovery",
    pageRole: "checklist",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "Medicare checklist before hospital discharge",
    audience: ["Medicare patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Current Medicare and plan verification",
    relatedTools: ["/tools/observation-vs-inpatient-status-guide"],
    relatedArticles: ["/articles/short-term-rehab-after-hospital"],
    officialVerificationResources: ["https://www.medicare.gov/coverage/skilled-nursing-facility-care"],
    cta: "Open the checklist",
  },
  {
    id: "rehab_after_hospital_article",
    title: "Does Medicare Cover Rehab After a Hospital Stay?",
    description: "Separate clinical need from coverage requirements, including skilled care, hospital status, network, authorization, and costs.",
    canonicalRoute: "/articles/does-medicare-cover-rehab-after-hospital-stay",
    stageId: "discharge_recovery",
    pageRole: "article",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "does Medicare cover rehab after hospitalization",
    audience: ["Medicare patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Current Original Medicare and Medicare Advantage distinctions",
    relatedTools: ["/tools/hospital-discharge-medicare-checklist"],
    relatedArticles: ["/articles/does-medicare-cover-long-term-care"],
    officialVerificationResources: ["https://www.medicare.gov/coverage/skilled-nursing-facility-care"],
    cta: "Check rehab coverage questions",
  },
  {
    id: "long_term_care_article",
    title: "Does Medicare Cover Long-Term Care?",
    description: "Understand the difference between limited skilled coverage and ongoing custodial care, plus where Medicaid may matter.",
    canonicalRoute: "/articles/does-medicare-cover-long-term-care",
    stageId: "discharge_recovery",
    pageRole: "article",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "does Medicare cover long-term care",
    audience: ["patients", "caregivers", "families"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Current Medicare, Medicaid, and state-rule qualification",
    relatedTools: ["/tools/medicare-medicaid-eligibility-check"],
    relatedArticles: ["/articles/does-medicare-cover-rehab-after-hospital-stay"],
    officialVerificationResources: ["https://www.medicare.gov/coverage/long-term-care"],
    cta: "Understand the coverage gap",
  },
  {
    id: "medical_bill_toolkit",
    title: "Medical Bill Review Toolkit",
    description: "Identify the document, compare the claim story, request missing detail, check financial assistance, and track calls and deadlines.",
    canonicalRoute: "/insurance/medical-bill-review-toolkit",
    stageId: "bills_coverage",
    pageRole: "tool",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "how to review a medical bill",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "low",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Billing, collections, appeal, and financial-assistance qualification",
    relatedTools: ["/tools/medical-bill-review-flow", "/tools/eob-to-bill-match-checker"],
    relatedArticles: ["/articles/how-to-read-an-eob"],
    officialVerificationResources: ["https://www.cms.gov/medical-bill-rights"],
    cta: "Review the bill",
  },
  {
    id: "eob_bill_match",
    title: "EOB-to-Bill Match Checker",
    description: "Compare the provider balance with the final payer explanation, allowed amount, adjustments, payment, and patient responsibility.",
    canonicalRoute: "/tools/eob-to-bill-match-checker",
    stageId: "bills_coverage",
    pageRole: "tool",
    availability: "existing",
    launchStatus: "published",
    priority: 1,
    primarySearchIntent: "medical bill does not match EOB",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "low",
    insuranceLegalSensitivity: "moderate",
    reviewRequirement: "Privacy-safe constrained inputs and billing limitations",
    relatedTools: ["/insurance/medical-bill-review-toolkit"],
    relatedArticles: ["/articles/how-to-read-an-eob"],
    officialVerificationResources: ["https://www.cms.gov/medical-bill-rights"],
    cta: "Compare bill and EOB",
  },
  {
    id: "prior_authorization_next_steps",
    title: "Prior Authorization Next-Step Guide",
    description: "Organize the notice, urgency, provider action, plan questions, documents, appeal checks, and official verification source.",
    canonicalRoute: "/tools/prior-authorization-next-step-guide",
    stageId: "bills_coverage",
    pageRole: "tool",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "what to do after prior authorization delay or denial",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "moderate",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Plan-specific and state/federal appeal qualification",
    relatedTools: [],
    relatedArticles: ["/articles/prior-authorization-explained"],
    officialVerificationResources: ["https://www.healthcare.gov/appeal-insurance-company-decision/"],
    cta: "Build a next-step plan",
  },
  {
    id: "financial_assistance_article",
    title: "Check Hospital Financial Assistance Before Paying",
    description: "Find the written policy, application, covered entities, deadlines, documentation, and account-hold questions before using debt or savings.",
    canonicalRoute: "/articles/check-hospital-financial-assistance-before-paying",
    stageId: "bills_coverage",
    pageRole: "article",
    availability: "existing",
    launchStatus: "published",
    priority: 2,
    primarySearchIntent: "hospital financial assistance application",
    audience: ["patients", "caregivers"],
    clinicalSensitivity: "low",
    insuranceLegalSensitivity: "high",
    reviewRequirement: "Hospital, state, and federal policy qualification",
    relatedTools: ["/insurance/medical-bill-review-toolkit"],
    relatedArticles: ["/articles/why-one-hospital-visit-can-create-multiple-bills"],
    officialVerificationResources: ["https://www.irs.gov/charities-non-profits/financial-assistance-policies-faps"],
    cta: "Check assistance",
  },
];

export const PATIENT_GATEWAY_JOURNEYS = [
  { id: "understand_hospital_stay", title: "Understand a hospital stay", description: "Follow the hospital journey from arrival through medications, daily care, discharge, and bills.", href: HOSPITAL_GUIDE_ROUTE, cta: "Open Hospital & Patient Guide" },
  { id: "prepare_discharge", title: "Prepare for discharge or rehabilitation", description: "Coordinate destination, skilled care, equipment, home services, authorization, cost, and backup plans.", href: "/insurance/hospital-discharge-coverage", cta: "Plan the discharge" },
  { id: "review_medical_bill", title: "Review a medical bill or EOB", description: "Identify the document, compare the claim story, ask about missing detail, and track the next step.", href: "/insurance/medical-bill-review-toolkit", cta: "Review the bill" },
  { id: "respond_denied_care", title: "Respond to delayed or denied care", description: "Prepare provider, plan, documentation, urgency, and appeal questions without missing a written deadline.", href: "/tools/prior-authorization-next-step-guide", cta: "Build a next-step plan" },
  { id: "understand_medicare_medicaid", title: "Understand Medicare and Medicaid", description: "Separate the programs, screen possible pathways, and verify the current rules with official agencies.", href: "/tools/medicare-medicaid-eligibility-check", cta: "Check possible pathways" },
  { id: "check_medication_coverage", title: "Check medication coverage", description: "Review formulary, tier, pharmacy, authorization, quantity, step-therapy, and estimated-cost questions.", href: "/insurance/medication-coverage-checklist", cta: "Open the checklist" },
  { id: "plan_long_term_care", title: "Plan for long-term care", description: "Separate skilled and custodial care, Medicare limits, Medicaid pathways, family capacity, and state-specific help.", href: "/articles/does-medicare-cover-long-term-care", cta: "Start planning" },
] as const;

export const getHospitalGuideResourcesForStage = (stageId: HospitalGuideStageId) =>
  HOSPITAL_GUIDE_RESOURCES
    .filter((resource) => resource.stageId === stageId && resource.launchStatus === "published")
    .sort((left, right) => left.priority - right.priority || left.title.localeCompare(right.title));

export const getHospitalGuideResourceByArticleSlug = (slug: string) =>
  HOSPITAL_GUIDE_RESOURCES.find((resource) => resource.canonicalRoute === `/articles/${slug}`);

export const HOSPITAL_GUIDE_OFFICIAL_RESOURCES = [
  { id: "cdc_hospital_vte", title: "CDC: Hospitalization and blood-clot risk", description: "Current federal patient education on healthcare-associated venous thromboembolism and prevention.", href: "https://www.cdc.gov/blood-clots/risk-factors/ha-vte.html" },
  { id: "medlineplus_medicines", title: "MedlinePlus: Medicines", description: "National Library of Medicine drug information, precautions, and patient instructions.", href: "https://medlineplus.gov/druginformation.html" },
  { id: "medicare_coverage", title: "Medicare.gov: Coverage", description: "Official Medicare coverage pages and plan-specific verification starting points.", href: "https://www.medicare.gov/coverage" },
  { id: "cms_medical_bill_rights", title: "CMS: Medical bill rights", description: "Federal information about medical billing protections and where to ask for help.", href: "https://www.cms.gov/medical-bill-rights" },
] as const;

