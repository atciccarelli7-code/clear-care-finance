export type PatientEducationModuleId =
  | "copd_recovery"
  | "heart_failure"
  | "blood_thinners"
  | "home_oxygen"
  | "first_72_hours";

export type PatientEducationSettingId =
  | "acute_inpatient"
  | "observation"
  | "emergency"
  | "perioperative"
  | "post_acute";

export type PatientEducationScaleId = "single_unit" | "service_line" | "single_facility";
export type PatientEducationTimelineId = "evaluate" | "ninety_day_pilot" | "phased_launch";
export type PatientEducationFocusId = "comprehension" | "workflow" | "continuity" | "patient_experience";

export type PatientEducationOption<T extends string> = {
  id: T;
  label: string;
  description: string;
};

export type PatientEducationModule = {
  id: PatientEducationModuleId;
  title: string;
  shortTitle: string;
  clinicalDomains: string[];
  purpose: string;
  proves: string[];
  requiredReviewers: string[];
  riskTier: "High" | "Critical";
  status: "Evidence development" | "Clinical review candidate" | "Planned";
};

export const patientEducationSettings: PatientEducationOption<PatientEducationSettingId>[] = [
  { id: "acute_inpatient", label: "Acute-care inpatient unit", description: "A medical, telemetry, progressive-care, specialty, or general inpatient setting." },
  { id: "observation", label: "Observation unit", description: "Short-stay patients who need a fast, dependable transition plan." },
  { id: "emergency", label: "Emergency department", description: "High-throughput discharge education with limited teaching time." },
  { id: "perioperative", label: "Perioperative or procedural service", description: "Pre-op, PACU, surgery, interventional, or procedural discharge." },
  { id: "post_acute", label: "Post-acute or home-based care", description: "Rehabilitation, home health, skilled nursing, or transitional care." },
];

export const patientEducationScales: PatientEducationOption<PatientEducationScaleId>[] = [
  { id: "single_unit", label: "Single unit", description: "One accountable nursing team and one bounded workflow." },
  { id: "service_line", label: "Service line", description: "A coordinated pathway across related units or care settings." },
  { id: "single_facility", label: "Single facility", description: "A controlled hospital-level pilot with centralized governance." },
];

export const patientEducationTimelines: PatientEducationOption<PatientEducationTimelineId>[] = [
  { id: "evaluate", label: "Evaluate the product", description: "Review the controlled preview, governance, workflow, and pilot requirements." },
  { id: "ninety_day_pilot", label: "Plan a 90-day pilot", description: "Define a baseline, launch cohort, workflow, measures, and stop conditions." },
  { id: "phased_launch", label: "Plan a phased launch", description: "Start with one module and expand only after the first phase produces usable evidence." },
];

export const patientEducationFocuses: PatientEducationOption<PatientEducationFocusId>[] = [
  { id: "comprehension", label: "Patient comprehension", description: "Teach-back, warning-sign recognition, schedule understanding, and follow-up knowledge." },
  { id: "workflow", label: "Nursing workflow", description: "Retrieval time, personalization burden, teaching consistency, and unresolved questions." },
  { id: "continuity", label: "Hospital-to-home continuity", description: "Refills, supplies, DME, follow-up, weekend plans, and escalation pathways." },
  { id: "patient_experience", label: "Patient and caregiver experience", description: "Clarity, confidence, usefulness, caregiver preparedness, and preference." },
];

export const patientEducationModules: PatientEducationModule[] = [
  {
    id: "copd_recovery",
    title: "COPD Exacerbation and Recovery at Home",
    shortTitle: "COPD recovery",
    clinicalDomains: ["Pulmonary", "Medication and device safety", "Care transitions"],
    purpose: "Coordinate rescue and maintenance inhalers, nebulizer continuity, short-course medicines, oxygen or positive-airway-pressure context, recovery activity, warning levels, and access barriers.",
    proves: ["Respiratory device education", "Medication and equipment continuity", "Pulmonary recovery support", "Caregiver escalation planning"],
    requiredReviewers: ["RN clinical editor", "Pulmonology clinician", "Respiratory therapist", "Clinical pharmacist", "Health-literacy reviewer", "Accessibility reviewer", "Patient and caregiver reviewers"],
    riskTier: "Critical",
    status: "Evidence development",
  },
  {
    id: "heart_failure",
    title: "Heart Failure Discharge and Daily Management",
    shortTitle: "Heart failure",
    clinicalDomains: ["Cardiac", "Medication safety", "Daily monitoring"],
    purpose: "Connect daily weights and symptoms, medication categories, individualized sodium and fluid instructions, follow-up ownership, action zones, and access continuity without inventing thresholds.",
    proves: ["Individualized action-zone architecture", "Medication and laboratory continuity", "Daily self-management support", "Caregiver monitoring"],
    requiredReviewers: ["RN clinical editor", "Heart-failure clinician", "Clinical pharmacist", "Dietitian", "Health-literacy reviewer", "Accessibility reviewer", "Patient and caregiver reviewers"],
    riskTier: "Critical",
    status: "Evidence development",
  },
  {
    id: "blood_thinners",
    title: "Blood Thinner Safety",
    shortTitle: "Blood thinners",
    clinicalDomains: ["Medication safety", "Care transitions"],
    purpose: "Build a general anticoagulant guide plus medication-specific inserts, a personal plan, refill continuity, procedure planning, and emergency escalation.",
    proves: ["High-risk medication education", "Medication-specific architecture", "Refill and interruption planning", "Caregiver teach-back"],
    requiredReviewers: ["RN clinical editor", "Clinical pharmacist", "Anticoagulation physician or APP", "Health-literacy reviewer", "Accessibility reviewer", "Patient and caregiver reviewers"],
    riskTier: "Critical",
    status: "Clinical review candidate",
  },
  {
    id: "home_oxygen",
    title: "New to Home Oxygen",
    shortTitle: "Home oxygen",
    clinicalDomains: ["Respiratory", "DME", "Home safety"],
    purpose: "Clarify prescribed settings, equipment, portability, fire safety, supplier support, troubleshooting, and emergency planning.",
    proves: ["DME education", "Safety-critical instruction", "Supplier continuity", "Travel and backup planning"],
    requiredReviewers: ["RN clinical editor", "Respiratory therapist", "Pulmonology clinician", "Home oxygen supplier representative", "Fire-safety reviewer", "Patient and caregiver reviewers"],
    riskTier: "Critical",
    status: "Evidence development",
  },
  {
    id: "first_72_hours",
    title: "Safe Hospital Discharge and the First 72 Hours at Home",
    shortTitle: "First 72 hours",
    clinicalDomains: ["Universal discharge", "Medication reconciliation", "Home readiness"],
    purpose: "Make the first night, first 24 hours, and first 72 hours workable across medicines, appointments, pending tests, mobility, equipment, home services, caregivers, insurance, and warning signs.",
    proves: ["Universal discharge readiness", "Medication reconciliation", "Home and caregiver handoff", "Follow-up and pending-result ownership"],
    requiredReviewers: ["RN clinical editor", "Transitions-of-care clinician", "Clinical pharmacist", "Case management or social work", "Therapy representative", "Health-literacy reviewer", "Accessibility reviewer", "Patient and caregiver reviewers"],
    riskTier: "High",
    status: "Evidence development",
  },
];

export const patientEducationPackageAssets = [
  "Full patient guide",
  "One-page quick-start sheet",
  "AVS-compatible summary",
  "Patient-specific plan",
  "Daily schedule or tracker",
  "Troubleshooting decision guide",
  "Red-flag escalation sheet",
  "Caregiver edition",
  "Teach-back checklist",
  "Show-me competency checklist",
  "Clinician reference sheet",
  "Evidence dossier",
  "Version and approval record",
  "Implementation workflow",
  "Patient and staff feedback tools",
] as const;

export const patientEducationContinuityLayers = [
  { title: "Clinical action", description: "What the patient must do, how to do it, and which instructions are individualized." },
  { title: "Operational continuity", description: "Who owns follow-up, refills, supplies, DME, home health, weekends, and failed handoffs." },
  { title: "Verified understanding", description: "Teach-back and show-me workflows that test the explanation instead of asking only whether the patient understands." },
  { title: "Governed content", description: "Named reviewers, evidence records, versioning, update triggers, correction routes, and recall capability." },
  { title: "Measurable implementation", description: "Adoption, comprehension, workflow, continuity, usefulness, and safety signals with explicit claims boundaries." },
] as const;

export const patientEducationReleaseGates = [
  { gate: "Evidence", requirement: "A claim-level source map and unresolved-decision log are complete." },
  { gate: "Clinical review", requirement: "Each reviewer approves only the content within their professional competence." },
  { gate: "Health literacy", requirement: "Main action, wording, structure, numeracy, and actionability pass internal thresholds." },
  { gate: "Accessibility", requirement: "Web, print, PDF, visual, keyboard, contrast, and non-color-dependent communication are reviewed." },
  { gate: "Patient testing", requirement: "Representative patients or caregivers can locate, explain, and use the critical information." },
  { gate: "Institutional localization", requirement: "The hospital approves local contacts, policy language, workflow, formulary, and escalation routes." },
] as const;

export const patientEducationClaimsBoundary = [
  "Development-stage product: no guide is represented as hospital-approved, clinically validated, or pilot-ready until its documented release gates are complete.",
  "CAF does not diagnose, prescribe, determine coverage, replace discharge orders, or provide emergency or individual clinical support.",
  "The initial product is designed not to receive PHI. Patient-specific personalization should occur inside the healthcare organization's approved environment.",
  "Pilot engagement does not prove fewer readmissions, adverse events, calls, costs, or other clinical outcomes without an agreed evaluation method and adequate evidence.",
] as const;
