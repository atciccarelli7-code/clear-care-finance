import {
  organizationAudiences,
  organizationPriorities,
  organizationProfiles,
  organizationPrograms,
  organizationTimelines,
  type OrganizationAudienceId,
  type OrganizationPriorityId,
  type OrganizationProfileId,
  type OrganizationProgram,
  type OrganizationTimelineId,
} from "@/data/organizationOffering";

export type OrganizationProgramBuilderInput = {
  profile: OrganizationProfileId;
  audience: OrganizationAudienceId;
  priority: OrganizationPriorityId;
  timeline: OrganizationTimelineId;
};

export type OrganizationProgramPlan = {
  title: string;
  summary: string;
  primaryProgram: OrganizationProgram;
  supportingPrograms: OrganizationProgram[];
  launchPlan: { phase: string; action: string; evidence: string }[];
  stakeholders: string[];
  measurement: string[];
  guardrails: string[];
};

const programById = (id: OrganizationProgram["id"]) => {
  const program = organizationPrograms.find((item) => item.id === id);
  if (!program) throw new Error(`Unknown organization program: ${id}`);
  return program;
};

const primaryProgramFor = (input: OrganizationProgramBuilderInput): OrganizationProgram["id"] => {
  if (input.priority === "open_enrollment") return "benefits_readiness";
  if (input.priority === "patient_costs") return "patient_cost_preparation";
  if (input.priority === "medicare_discharge") return "medicare_discharge";
  if (input.priority === "career_retention") return "workforce_transition";
  if (input.priority === "workforce_financial") return input.audience === "patients_caregivers" ? "patient_cost_preparation" : "benefits_readiness";
  if (input.audience === "patients_caregivers") return "community_navigation";
  return "community_navigation";
};

const supportingProgramIds = (input: OrganizationProgramBuilderInput, primary: OrganizationProgram["id"]): OrganizationProgram["id"][] => {
  const ids: OrganizationProgram["id"][] = [];
  if (input.audience === "mixed" || input.priority === "broad_access") ids.push("community_navigation");
  if (["health_system", "outpatient", "post_acute", "health_plan"].includes(input.profile) && primary !== "patient_cost_preparation") ids.push("patient_cost_preparation");
  if (["health_system", "post_acute", "health_plan", "community"].includes(input.profile) && primary !== "medicare_discharge") ids.push("medicare_discharge");
  if (["education_association", "workforce"].includes(input.profile) && primary !== "workforce_transition") ids.push("workforce_transition");
  if (input.audience === "employees" && primary !== "benefits_readiness") ids.push("benefits_readiness");
  return [...new Set(ids)].filter((id) => id !== primary).slice(0, 2);
};

const optionLabel = <T extends string>(options: { id: T; label: string }[], id: T) => options.find((item) => item.id === id)?.label ?? id;

export const buildOrganizationProgramPlan = (input: OrganizationProgramBuilderInput): OrganizationProgramPlan => {
  const primaryId = primaryProgramFor(input);
  const primaryProgram = programById(primaryId);
  const profileLabel = optionLabel(organizationProfiles, input.profile);
  const audienceLabel = optionLabel(organizationAudiences, input.audience);
  const priorityLabel = optionLabel(organizationPriorities, input.priority);
  const timelineLabel = optionLabel(organizationTimelines, input.timeline);
  const supportingPrograms = supportingProgramIds(input, primaryId).map(programById);

  const launchPlan = input.timeline === "evaluate_now"
    ? [
        { phase: "1. Product review", action: "Complete the live participant modules with sample, non-identifying information.", evidence: "Fit, content, accessibility, and scope questions." },
        { phase: "2. Due diligence", action: "Review data flow, professional boundaries, official sources, support, and procurement questions.", evidence: "A written go, revise, or stop decision." },
        { phase: "3. Program definition", action: "Name one audience, decision moment, owner, launch channel, and learning question.", evidence: "A bounded evaluation brief without participant records." },
      ]
    : [
        { phase: "1. Define", action: "Confirm audience, decision moment, internal owners, approved modules, and success questions.", evidence: "Signed-off program brief and risk register." },
        { phase: "2. Review", action: "Complete legal, privacy, security, accessibility, clinical, benefits, and communications review as applicable.", evidence: "Documented approvals, exceptions, and escalation owners." },
        { phase: "3. Prepare", action: "Finalize launch copy, facilitator orientation, participant notice, support route, and baseline.", evidence: "Launch-ready materials and measurement sheet." },
        { phase: "4. Launch", action: "Release to the defined audience through approved channels without sending participant identities to CAF.", evidence: "Delivery record and privacy-safe engagement checks." },
        { phase: "5. Learn", action: "Review aggregate engagement, usefulness feedback, support questions, and corrections.", evidence: "Findings, limitations, and an expand, revise, or stop decision." },
      ];

  return {
    title: `${primaryProgram.title} for ${profileLabel}`,
    summary: `${timelineLabel}: a ${priorityLabel.toLowerCase()} path for ${audienceLabel.toLowerCase()}, beginning with ${primaryProgram.modules[0].title}.`,
    primaryProgram,
    supportingPrograms,
    launchPlan,
    stakeholders: [
      "Executive sponsor and accountable program owner",
      "Audience owner: HR, patient access, care management, member experience, education, or workforce lead",
      "Privacy, security, legal/compliance, accessibility, and communications reviewers as applicable",
      "Measurement owner who can distinguish observed evidence from assumptions",
      "CAF product/content contact and correction owner",
    ],
    measurement: [
      "Record audience reach through the organization's own launch channel.",
      "Use only consented, aggregate, fixed-ID product engagement when available.",
      "Ask whether the experience was clear, useful, and produced a next step; do not request sensitive details.",
      "Track support questions, accessibility issues, corrections, and unresolved needs.",
      "Do not infer savings, ROI, enrollment quality, retention, coverage, or health outcomes from product engagement.",
    ],
    guardrails: [
      "Do not send names, emails, employee or member IDs, diagnoses, medications, plan details, claim details, account numbers, documents, or free-text case notes.",
      "The organization remains responsible for its plan, policy, clinical, legal, and participant communications.",
      "Official plan documents, providers, insurers, agencies, and signed agreements control over educational content.",
      "Any custom data handling, claims, integrations, service levels, or business-associate role requires separate written review before work begins.",
    ],
  };
};

export const organizationProgramPlanToText = (input: OrganizationProgramBuilderInput, plan: OrganizationProgramPlan) => [
  "COMMUNITY ACQUIRED FINANCE - ORGANIZATION PROGRAM BRIEF",
  "",
  `Organization type: ${optionLabel(organizationProfiles, input.profile)}`,
  `Audience: ${optionLabel(organizationAudiences, input.audience)}`,
  `Priority: ${optionLabel(organizationPriorities, input.priority)}`,
  `Timing: ${optionLabel(organizationTimelines, input.timeline)}`,
  "",
  plan.title,
  plan.summary,
  "",
  "PARTICIPANT MODULES",
  ...plan.primaryProgram.modules.map((module) => `- ${module.title}: ${module.description}`),
  "",
  "ORGANIZATION DELIVERABLES",
  ...plan.primaryProgram.organizationDeliverables.map((item) => `- ${item}`),
  "",
  "IMPLEMENTATION",
  ...plan.launchPlan.map((item) => `${item.phase}: ${item.action} Evidence: ${item.evidence}`),
  "",
  "MEASUREMENT BOUNDARY",
  ...plan.measurement.map((item) => `- ${item}`),
  "",
  "PRIVACY AND SCOPE GUARDRAILS",
  ...plan.guardrails.map((item) => `- ${item}`),
  "",
  "Planning note: This brief is educational and exploratory. Final scope, responsibilities, service levels, legal terms, pricing, and data handling require written agreement.",
].join("\n");
