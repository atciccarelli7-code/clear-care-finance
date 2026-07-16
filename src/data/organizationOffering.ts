export type OrganizationProfileId =
  | "health_system"
  | "health_plan"
  | "outpatient"
  | "post_acute"
  | "education_association"
  | "workforce"
  | "community";

export type OrganizationAudienceId = "employees" | "patients_caregivers" | "members_students" | "mixed";
export type OrganizationPriorityId =
  | "open_enrollment"
  | "workforce_financial"
  | "patient_costs"
  | "medicare_discharge"
  | "career_retention"
  | "broad_access";
export type OrganizationTimelineId = "evaluate_now" | "thirty_days" | "sixty_to_ninety_days";

export type OrganizationOption<T extends string> = {
  id: T;
  label: string;
  description: string;
};

export type OrganizationModule = {
  title: string;
  description: string;
  href: string;
};

export type OrganizationProgram = {
  id: "benefits_readiness" | "patient_cost_preparation" | "medicare_discharge" | "workforce_transition" | "community_navigation";
  eyebrow: string;
  title: string;
  summary: string;
  bestFor: string;
  participantOutcome: string;
  modules: OrganizationModule[];
  organizationDeliverables: string[];
};

export const organizationProfiles: OrganizationOption<OrganizationProfileId>[] = [
  { id: "health_system", label: "Hospital or health system", description: "Benefits, workforce, patient-access, discharge, or financial-counseling leaders." },
  { id: "health_plan", label: "Health plan or payer", description: "Member education, navigation, Medicare, Medicaid, or employer-group teams." },
  { id: "outpatient", label: "Clinic or medical group", description: "Ambulatory, specialty, community health, dental, or physician organizations." },
  { id: "post_acute", label: "Post-acute or home-based care", description: "Home health, hospice, rehabilitation, skilled nursing, or long-term-care organizations." },
  { id: "education_association", label: "School or association", description: "Nursing programs, professional associations, unions, trusts, or member groups." },
  { id: "workforce", label: "Staffing or workforce organization", description: "Recruiting, staffing, career-transition, retention, or workforce-development teams." },
  { id: "community", label: "Community or public-health organization", description: "Nonprofits, libraries, public agencies, coalitions, or caregiver-support organizations." },
];

export const organizationAudiences: OrganizationOption<OrganizationAudienceId>[] = [
  { id: "employees", label: "Employees", description: "Healthcare workers, new hires, benefit-eligible staff, or people changing roles." },
  { id: "patients_caregivers", label: "Patients and caregivers", description: "People preparing for care, bills, discharge, Medicare, or Medicaid questions." },
  { id: "members_students", label: "Members or students", description: "Association members, trainees, students, or program participants." },
  { id: "mixed", label: "More than one audience", description: "A phased workforce and patient, member, or community education program." },
];

export const organizationPriorities: OrganizationOption<OrganizationPriorityId>[] = [
  { id: "open_enrollment", label: "Benefits and open enrollment", description: "Help people notice changes, compare costs, and prepare questions before electing." },
  { id: "workforce_financial", label: "Workforce financial confidence", description: "Connect pay, retirement, insurance, emergency reserves, and next actions." },
  { id: "patient_costs", label: "Patient cost preparation", description: "Prepare for appointments, authorizations, EOBs, medical bills, and assistance questions." },
  { id: "medicare_discharge", label: "Medicare and discharge", description: "Support coverage verification, discharge planning, and Medicare or Medicaid starting points." },
  { id: "career_retention", label: "Career and total compensation", description: "Compare healthcare roles and make benefit-aware transition decisions." },
  { id: "broad_access", label: "Broad education access", description: "Offer a curated, self-service healthcare finance learning path across several needs." },
];

export const organizationTimelines: OrganizationOption<OrganizationTimelineId>[] = [
  { id: "evaluate_now", label: "Evaluate now", description: "Review the live public product and complete due diligence before defining a launch." },
  { id: "thirty_days", label: "Target 30 days", description: "Use an existing module with a defined audience, owner, launch channel, and feedback plan." },
  { id: "sixty_to_ninety_days", label: "Target 60-90 days", description: "Plan a phased program, stakeholder review, launch campaign, and measurement baseline." },
];

export const organizationPrograms: OrganizationProgram[] = [
  {
    id: "benefits_readiness",
    eyebrow: "Workforce program",
    title: "Benefits Decision Readiness",
    summary: "A plain-English path for healthcare workers to prepare before open enrollment, new-hire elections, or a major benefits change.",
    bestFor: "HR, total rewards, employee experience, nursing leadership, benefits consultants, schools, and associations.",
    participantOutcome: "A prioritized action plan, comparison questions, and a printable benefits receipt built without connecting an HR portal.",
    modules: [
      { title: "Healthcare Worker Benefits Blueprint", description: "Build a goal-first benefits action order.", href: "/tools/healthcare-worker-benefits-blueprint" },
      { title: "Benefits Change Detector", description: "Identify changes that deserve verification.", href: "/tools/benefits-change-detector" },
      { title: "Open Enrollment True Cost", description: "Compare premium and care-cost exposure.", href: "/tools/open-enrollment-true-cost-calculator" },
      { title: "Benefits Command Center", description: "Create a private annual review and receipt.", href: "/tools/benefits-command-center" },
    ],
    organizationDeliverables: ["Audience-specific launch sequence", "Facilitator orientation", "Participant privacy notice", "Aggregate engagement framework", "End-of-program findings review"],
  },
  {
    id: "patient_cost_preparation",
    eyebrow: "Patient and caregiver program",
    title: "Healthcare Cost Preparation",
    summary: "A before-and-after-care pathway that helps people organize cost, coverage, authorization, bill, and financial-assistance questions.",
    bestFor: "Patient access, financial counseling, revenue cycle education, care management, ambulatory operations, plans, and community partners.",
    participantOutcome: "A private preparation plan or review checklist for the next provider, insurer, billing, or assistance conversation.",
    modules: [
      { title: "Medical Appointment Cost Preparation", description: "Prepare cost and coverage questions before care.", href: "/tools/medical-appointment-cost-preparation" },
      { title: "Prior Authorization Next Steps", description: "Organize a delayed, pending, or denied authorization.", href: "/tools/prior-authorization-next-step-guide" },
      { title: "Medical Bill Review Flow", description: "Work through an EOB and bill before paying.", href: "/tools/medical-bill-review-flow" },
      { title: "Medical Bill Review Toolkit", description: "Use the complete source-backed review pathway.", href: "/insurance/medical-bill-review-toolkit" },
    ],
    organizationDeliverables: ["Pre-care and post-care pathways", "Staff handoff language", "Printable participant checklists", "Escalation and official-source links", "Feedback and correction route"],
  },
  {
    id: "medicare_discharge",
    eyebrow: "Coverage-transition program",
    title: "Medicare, Medicaid, and Discharge Readiness",
    summary: "A caregiver-friendly sequence for coverage starting points, hospital status, post-acute questions, networks, authorization, and next-step verification.",
    bestFor: "Hospitals, plans, case management, social work, post-acute providers, caregiver programs, and aging-services organizations.",
    participantOutcome: "A clear list of official resources, documents to gather, and questions to ask before the next coverage or discharge decision.",
    modules: [
      { title: "Medicare and Medicaid Starting-Point Check", description: "Identify possible pathways and official agencies.", href: "/tools/medicare-medicaid-eligibility-check" },
      { title: "Hospital Discharge Medicare Checklist", description: "Verify status, authorization, networks, and follow-up care.", href: "/tools/hospital-discharge-medicare-checklist" },
      { title: "Medicare and Medicaid Guide", description: "Use the complete coverage education hub.", href: "/topics/medicare-medicaid" },
      { title: "Hospital Discharge Coverage Guide", description: "Review post-hospital coverage questions.", href: "/insurance/hospital-discharge-coverage" },
    ],
    organizationDeliverables: ["Caregiver-first launch path", "Plain-language coverage boundaries", "Official agency handoffs", "Printable discharge preparation", "Stakeholder review of escalation language"],
  },
  {
    id: "workforce_transition",
    eyebrow: "Workforce program",
    title: "Healthcare Career and Compensation Decisions",
    summary: "A structured way to compare roles, total compensation, benefits, transition risks, and questions before accepting or leaving a position.",
    bestFor: "Talent, retention, workforce development, staffing, schools, associations, unions, and career-transition programs.",
    participantOutcome: "A transparent job comparison and transition checklist that keeps assumptions separate from verified offer details.",
    modules: [
      { title: "Total Compensation Comparison", description: "Compare pay, benefits, time, and work costs.", href: "/tools/healthcare-worker-total-compensation-comparison" },
      { title: "Healthcare Career Decision Center", description: "Separate assumptions, preferences, and transition risks.", href: "/healthcare-workers/career-decisions" },
      { title: "Employer Benefits Action Plan", description: "Prioritize benefits after reviewing an offer.", href: "/tools/employer-benefits-action-plan" },
      { title: "403(b) Paycheck Calculator", description: "Translate a contribution rate into paycheck and annual amounts.", href: "/tools/403b-paycheck-calculator" },
    ],
    organizationDeliverables: ["Role-change decision pathway", "Offer-verification checklist", "Facilitator discussion guide", "Participant comparison template", "Program feedback review"],
  },
  {
    id: "community_navigation",
    eyebrow: "Multi-topic program",
    title: "Healthcare Finance Navigation Library",
    summary: "A curated entry point for organizations whose audience needs several healthcare money pathways rather than one campaign.",
    bestFor: "Plans, associations, workforce programs, libraries, public-health teams, coalitions, and broad employee-resource programs.",
    participantOutcome: "A decision-first starting point that routes people to the relevant public tool, source-backed guide, and next action.",
    modules: [
      { title: "Start Here", description: "Use one guided intake to choose the next path.", href: "/start-here" },
      { title: "Healthcare Finance Tools", description: "Browse released calculators, checklists, and planners.", href: "/tools" },
      { title: "Topic Guides", description: "Explore organized benefits, insurance, Medicare, billing, and career subjects.", href: "/topics" },
      { title: "Patients and Caregivers", description: "Enter the patient-cost and coverage pathway.", href: "/patients-families" },
    ],
    organizationDeliverables: ["Curated audience landing sequence", "Topic-based launch copy", "Privacy-safe usage framework", "Quarterly content review option", "Correction and update channel"],
  },
];

export const organizationMeasurementFramework = [
  { stage: "Reach", measures: "Eligible audience and launch-channel delivery", owner: "Organization", boundary: "CAF does not need employee or patient identity." },
  { stage: "Engagement", measures: "Consented page views, starts, completions, and fixed-ID handoffs", owner: "CAF, when available", boundary: "No answer values, names, free text, plan details, or clinical details." },
  { stage: "Usefulness", measures: "Optional aggregate pulse: clear, useful, and next step understood", owner: "Jointly designed", boundary: "No diagnosis, benefits election, claim, or individual financial outcome." },
  { stage: "Operations", measures: "Launch timing, support questions, corrections, accessibility issues, and incidents", owner: "Joint", boundary: "A written escalation and response process is agreed before launch." },
  { stage: "Outcomes", measures: "Any enrollment, retention, claims, debt, or ROI analysis", owner: "Organization or independent evaluator", boundary: "Not claimed by CAF without an agreed method, lawful data access, and real evidence." },
];

export const organizationProcurementRows = [
  { area: "Product access", current: "Public responsive web experience; no participant account required.", review: "Dedicated campaign path, custom branding, or organization-specific materials.", notOffered: "Eligibility files, HRIS/payroll connections, EHR access, or claims ingestion." },
  { area: "Data handling", current: "Fixed-choice answers stay in the browser tab; consent-gated analytics use fixed identifiers.", review: "A written data-flow review for any requested customization or measurement change.", notOffered: "PHI, member IDs, employee files, plan documents, diagnoses, unrestricted notes, or uploaded records." },
  { area: "Professional scope", current: "General financial and healthcare-cost education, preparation, and official-source handoffs.", review: "Organization-specific legal, compliance, clinical, benefits, and communications approval.", notOffered: "Medical, legal, tax, investment, fiduciary, brokerage, coverage, enrollment, or eligibility decisions." },
  { area: "Security and privacy", current: "Data-minimized public product, documented privacy terms, correction channel, and bounded analytics.", review: "Security questionnaire, incident contacts, retention terms, subprocessors, and business-associate analysis.", notOffered: "A HIPAA, SOC 2, HITRUST, or other certification claim unless independently completed and documented." },
  { area: "Accessibility and content", current: "Keyboard, mobile, automated accessibility, source, freshness, and route checks are part of release gates.", review: "Organization accessibility criteria, VPAT request, translation, reading-level, and participant testing needs.", notOffered: "A blanket conformance guarantee for every assistive technology, language, or future page." },
  { area: "Support and service", current: "Public correction and contact channels; scoped launch orientation and findings review.", review: "Named owners, service hours, response targets, escalation path, and change-control terms.", notOffered: "24/7 clinical concierge, benefits administration, case management, or emergency support." },
];
