import { z } from "zod";

const contentTextSchema = z.string().trim().min(1).max(5000);
const identifierSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]*$/);

export const patientEducationSectionIdSchema = z.enum([
  "most_important",
  "today",
  "get_help",
  "personal_plan",
  "how_to",
  "plan_breaks",
  "background",
  "supplies",
  "daily_routine",
  "expected_findings",
  "refills",
  "diet_activity",
  "follow_up",
  "teach_back",
  "questions",
  "sources_version",
]);

export const patientEducationContentTargetSchema = z.enum([
  "responsive_html",
  "print_html",
  "structured_text",
  "avs_text",
  "patient_portal_json",
]);

export const patientEducationAudienceSchema = z.enum([
  "patient",
  "caregiver",
  "nurse",
  "clinician",
  "reviewer",
  "instructor",
  "administrator",
]);

const blockBaseSchema = z.object({
  blockId: identifierSchema,
  sectionId: patientEducationSectionIdSchema,
  clinicalInstruction: z.boolean(),
  publicPreviewAllowed: z.boolean(),
});

const headingBlockSchema = blockBaseSchema.extend({
  type: z.literal("heading"),
  level: z.enum(["2", "3"]),
  text: contentTextSchema,
});

const paragraphBlockSchema = blockBaseSchema.extend({
  type: z.literal("paragraph"),
  text: contentTextSchema,
});

const calloutBlockSchema = blockBaseSchema.extend({
  type: z.literal("callout"),
  tone: z.enum(["information", "routine", "warning", "emergency", "financial", "caregiver"]),
  iconLabel: contentTextSchema.max(80),
  title: contentTextSchema.max(180),
  body: contentTextSchema,
  action: contentTextSchema.optional(),
});

const actionItemSchema = z.object({
  itemId: identifierSchema,
  label: contentTextSchema.max(240),
  detail: contentTextSchema.optional(),
  urgency: z.enum(["routine", "call_today", "emergency"]),
  route: z.enum(["self_action", "care_team", "organization_defined", "emergency_services"]),
  action: contentTextSchema,
}).superRefine((value, context) => {
  if (value.urgency === "emergency" && value.route !== "emergency_services") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Emergency action items must route to emergency services." });
  }
});

const actionListBlockSchema = blockBaseSchema.extend({
  type: z.literal("action_list"),
  title: contentTextSchema.max(180),
  items: z.array(actionItemSchema).min(1),
  teachBackPrompt: contentTextSchema.optional(),
});

const procedureStepSchema = z.object({
  stepId: identifierSchema,
  title: contentTextSchema.max(180),
  instruction: contentTextSchema,
  verification: contentTextSchema.optional(),
});

const procedureBlockSchema = blockBaseSchema.extend({
  type: z.literal("procedure"),
  title: contentTextSchema.max(180),
  steps: z.array(procedureStepSchema).min(1),
  showMeRequired: z.boolean(),
});

const personalizationFieldSchema = z.object({
  fieldId: identifierSchema,
  label: contentTextSchema.max(180),
  category: z.enum(["clinical_order", "contact", "follow_up", "pharmacy", "supplier", "home_health", "policy", "formulary", "branding", "language"]),
  valueSource: z.enum(["healthcare_organization", "patient_or_caregiver", "caf", "joint_review"]),
  required: z.boolean(),
  phiCapability: z.enum(["none", "possible", "expected"]),
  placeholder: contentTextSchema.max(240).optional(),
});

const personalizationBlockSchema = blockBaseSchema.extend({
  type: z.literal("personalization"),
  title: contentTextSchema.max(180),
  storageBoundary: contentTextSchema,
  fields: z.array(personalizationFieldSchema).min(1),
});

const teachBackBlockSchema = blockBaseSchema.extend({
  type: z.literal("teach_back"),
  title: contentTextSchema.max(180),
  prompts: z.array(contentTextSchema.max(500)).min(1),
  completionEvidence: contentTextSchema,
});

const troubleshootingScenarioSchema = z.object({
  scenarioId: identifierSchema,
  trigger: contentTextSchema.max(300),
  action: contentTextSchema,
  escalation: contentTextSchema.optional(),
});

const troubleshootingBlockSchema = blockBaseSchema.extend({
  type: z.literal("troubleshooting"),
  title: contentTextSchema.max(180),
  scenarios: z.array(troubleshootingScenarioSchema).min(1),
});

const evidenceAnchorBlockSchema = blockBaseSchema.extend({
  type: z.literal("evidence_anchor"),
  claimIds: z.array(z.string().regex(/^CLAIM-[A-Z0-9-]+$/)).min(1),
  reviewerNote: contentTextSchema.optional(),
});

export const patientEducationContentBlockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  calloutBlockSchema,
  actionListBlockSchema,
  procedureBlockSchema,
  personalizationBlockSchema,
  teachBackBlockSchema,
  troubleshootingBlockSchema,
  evidenceAnchorBlockSchema,
]);

const fullGuideRequiredSections = [
  "most_important",
  "today",
  "get_help",
  "personal_plan",
  "how_to",
  "plan_breaks",
] as const;

export const patientEducationContentDocumentSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  assetId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  assetVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  documentKind: z.enum(["full_guide", "quick_start", "avs_summary", "caregiver_guide", "teach_back", "clinician_reference", "implementation_workflow", "feedback_tool"]),
  title: contentTextSchema.max(240),
  language: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  audiences: z.array(patientEducationAudienceSchema).min(1),
  distributionBoundary: z.enum(["controlled_preview", "institutional", "internal_governance"]),
  sourceDossierId: z.string().min(3),
  supportedTargets: z.array(patientEducationContentTargetSchema).min(1),
  blocks: z.array(patientEducationContentBlockSchema).min(1),
}).superRefine((value, context) => {
  const blockIds = value.blocks.map((block) => block.blockId);
  if (new Set(blockIds).size !== blockIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Content block IDs must be unique within a document." });
  }

  if (value.documentKind === "full_guide") {
    const sectionIds = new Set(value.blocks.map((block) => block.sectionId));
    for (const requiredSection of fullGuideRequiredSections) {
      if (!sectionIds.has(requiredSection)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Full guides require section: ${requiredSection}.` });
      }
    }
  }

  if (value.distributionBoundary === "controlled_preview") {
    const restrictedBlock = value.blocks.find((block) => block.clinicalInstruction || !block.publicPreviewAllowed);
    if (restrictedBlock) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Controlled previews cannot contain restricted block: ${restrictedBlock.blockId}.` });
    }
  }

  for (const block of value.blocks) {
    if (block.type === "callout" && block.tone === "emergency" && !block.action) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Emergency callout ${block.blockId} requires an explicit action.` });
    }
    if (block.type === "personalization") {
      const phiField = block.fields.find((field) => field.phiCapability !== "none");
      if (phiField && value.distributionBoundary !== "institutional") {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `PHI-capable field ${phiField.fieldId} requires an institutional distribution boundary.` });
      }
    }
  }
});

export type PatientEducationContentBlock = z.infer<typeof patientEducationContentBlockSchema>;
export type PatientEducationContentDocument = z.infer<typeof patientEducationContentDocumentSchema>;
export type PatientEducationContentTarget = z.infer<typeof patientEducationContentTargetSchema>;

export const validatePatientEducationContentDocument = (value: unknown) => patientEducationContentDocumentSchema.safeParse(value);
