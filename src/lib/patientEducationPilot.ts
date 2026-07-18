import {
  patientEducationFocuses,
  patientEducationModules,
  patientEducationScales,
  patientEducationSettings,
  patientEducationTimelines,
  type PatientEducationFocusId,
  type PatientEducationModuleId,
  type PatientEducationScaleId,
  type PatientEducationSettingId,
  type PatientEducationTimelineId,
} from "@/data/patientEducationOffering";

export type PatientEducationPilotInput = {
  setting: PatientEducationSettingId;
  module: PatientEducationModuleId;
  scale: PatientEducationScaleId;
  timeline: PatientEducationTimelineId;
  focus: PatientEducationFocusId;
};

export type PatientEducationPilotPlan = {
  title: string;
  summary: string;
  module: (typeof patientEducationModules)[number];
  packageAssets: string[];
  stakeholders: string[];
  phases: { phase: string; action: string; evidence: string }[];
  measures: string[];
  prerequisites: string[];
  boundaries: string[];
};

const optionLabel = <T extends string>(options: { id: T; label: string }[], id: T) =>
  options.find((option) => option.id === id)?.label ?? id;

const moduleById = (id: PatientEducationModuleId) => {
  const module = patientEducationModules.find((item) => item.id === id);
  if (!module) throw new Error(`Unknown patient education module: ${id}`);
  return module;
};

const packageAssetsFor = (moduleId: PatientEducationModuleId) => {
  const shared = [
    "Full patient guide",
    "Quick-start and red-flag sheet",
    "AVS-compatible summary",
    "Patient-specific plan",
    "Teach-back checklist",
    "Clinician implementation sheet",
    "Evidence and version dossier",
    "Patient and staff feedback tools",
  ];

  if (moduleId === "copd_recovery") return [...shared, "Inhaler and spacer show-me card", "Nebulizer and supply continuity plan", "Pulmonary recovery action zones"];
  if (moduleId === "heart_failure") return [...shared, "Daily weight and symptom tracker", "Individualized action-zone sheet", "Medication and laboratory follow-up card"];
  if (moduleId === "blood_thinners") return [...shared, "Medication-specific insert", "Refill and procedure-planning card", "Medication wallet card"];
  if (moduleId === "home_oxygen") return [...shared, "Equipment and supplier card", "Fire-safety checklist", "Travel and backup plan"];
  return [...shared, "First-night, 24-hour, and 72-hour checklist", "Caregiver handoff", "Pending-result and follow-up register"];
};

const phasesFor = (timeline: PatientEducationTimelineId) => {
  if (timeline === "evaluate") {
    return [
      { phase: "1. Controlled product review", action: "Review sample architecture, governance, release gates, workflow assumptions, and claims boundaries without launching to patients.", evidence: "A documented fit, revise, or stop decision." },
      { phase: "2. Workflow discovery", action: "Map the current discharge-education source, owners, retrieval process, localization needs, and failure points.", evidence: "A current-state workflow and gap register." },
      { phase: "3. Pilot decision", action: "Define one bounded population, accountable sponsor, required reviewers, implementation owner, and evaluation question.", evidence: "A review-ready pilot charter." },
    ];
  }

  return [
    { phase: "1. Baseline", action: "Document current materials, retrieval time, education steps, staff confidence, patient questions, and continuity failures.", evidence: "A baseline measure set and workflow map." },
    { phase: "2. Localize and approve", action: "Complete clinical, pharmacy, legal, privacy, accessibility, language, informatics, and communications review as applicable.", evidence: "Approved content, contacts, exceptions, and escalation ownership." },
    { phase: "3. Prepare", action: "Configure print and digital delivery, train the participating team, test teach-back documentation, and confirm issue reporting.", evidence: "Pilot-ready workflow and training completion." },
    { phase: "4. Launch", action: "Deliver the guide to the defined cohort and monitor adoption, unresolved questions, accessibility, corrections, and incidents.", evidence: "Distribution and operational evidence without sending patient identity to CAF." },
    { phase: "5. Learn", action: "Review comprehension, workflow, continuity, usefulness, safety signals, limitations, and whether expansion is justified.", evidence: "An expand, revise, repeat, or stop recommendation." },
  ];
};

const measuresFor = (focus: PatientEducationFocusId) => {
  const common = [
    "Eligible-patient guide distribution rate",
    "Teach-back or show-me completion rate",
    "Reported content defects, accessibility issues, and safety concerns",
    "Staff adoption and repeat use",
  ];

  if (focus === "comprehension") return [...common, "Correct identification of the primary action", "Correct identification of emergency warning signs", "Correct identification of the managing clinician, refill source, and follow-up plan"];
  if (focus === "workflow") return [...common, "Time to locate and personalize the guide", "Nurse-reported teaching consistency", "Unresolved questions at discharge", "Perceived documentation burden"];
  if (focus === "continuity") return [...common, "Refill or supply confusion", "DME, home-health, or pharmacy handoff failures", "Post-discharge clarification calls", "Missed or delayed follow-up"];
  return [...common, "Patient-reported clarity and confidence", "Caregiver preparedness", "Usefulness of the schedule and troubleshooting sections", "Preference compared with the current material"];
};

export const buildPatientEducationPilotPlan = (input: PatientEducationPilotInput): PatientEducationPilotPlan => {
  const module = moduleById(input.module);
  const setting = optionLabel(patientEducationSettings, input.setting);
  const scale = optionLabel(patientEducationScales, input.scale);
  const timeline = optionLabel(patientEducationTimelines, input.timeline);
  const focus = optionLabel(patientEducationFocuses, input.focus);

  return {
    title: `${module.title}: ${scale} starting brief`,
    summary: `${timeline} for a ${setting.toLowerCase()} with ${focus.toLowerCase()} as the primary learning question. The guide remains development-stage until all documented release gates and local approvals are complete.`,
    module,
    packageAssets: packageAssetsFor(input.module),
    stakeholders: [
      "Executive or service-line sponsor",
      "Accountable nursing or clinical operations owner",
      ...module.requiredReviewers,
      "Clinical informatics or EHR education owner",
      "Patient experience or quality-improvement partner",
      "Measurement owner who can separate observed evidence from assumptions",
      "CAF product, content, and correction owner",
    ],
    phases: phasesFor(input.timeline),
    measures: measuresFor(input.focus),
    prerequisites: [
      "A written scope naming the population, setting, participating teams, workflow, and stop conditions",
      "Hospital ownership of all patient-specific orders, local clinical language, contacts, and escalation instructions",
      "A documented decision on whether any proposed data flow creates a business-associate or other privacy obligation",
      "A no-PHI pilot design unless a separately approved secure architecture and agreement are completed",
      "Qualified human review of every safety-critical statement",
      "Patient or caregiver testing before live institutional use",
    ],
    boundaries: [
      "The generated brief contains fixed choices only and is not saved, transmitted, or placed in the URL.",
      "Do not enter names, dates of birth, medical record numbers, diagnoses, medications, orders, case narratives, or other patient details into CAF public tools or contact forms.",
      "The organization controls patient assignment, personalization, documentation, local approval, and clinical response.",
      "Engagement or satisfaction data alone cannot establish reductions in readmissions, adverse events, costs, calls, or other outcomes.",
    ],
  };
};

export const patientEducationPilotPlanToText = (input: PatientEducationPilotInput, plan: PatientEducationPilotPlan) => [
  "CAF HOSPITAL & PATIENT GUIDE - PILOT STARTING BRIEF",
  "",
  `Care setting: ${optionLabel(patientEducationSettings, input.setting)}`,
  `First module: ${plan.module.title}`,
  `Pilot scale: ${optionLabel(patientEducationScales, input.scale)}`,
  `Planning horizon: ${optionLabel(patientEducationTimelines, input.timeline)}`,
  `Primary evaluation focus: ${optionLabel(patientEducationFocuses, input.focus)}`,
  "",
  plan.title,
  plan.summary,
  "",
  "PACKAGE ASSETS",
  ...plan.packageAssets.map((item) => `- ${item}`),
  "",
  "IMPLEMENTATION PHASES",
  ...plan.phases.map((item) => `${item.phase}: ${item.action} Evidence: ${item.evidence}`),
  "",
  "PILOT MEASURES",
  ...plan.measures.map((item) => `- ${item}`),
  "",
  "REQUIRED TEAM",
  ...plan.stakeholders.map((item) => `- ${item}`),
  "",
  "PREREQUISITES",
  ...plan.prerequisites.map((item) => `- ${item}`),
  "",
  "PRIVACY, CLINICAL, AND CLAIMS BOUNDARIES",
  ...plan.boundaries.map((item) => `- ${item}`),
  "",
  "Planning note: This is a development-stage, nonbinding starting brief. Final content, workflow, pricing, responsibilities, service levels, legal terms, clinical approvals, and data handling require written agreement.",
].join("\n");
