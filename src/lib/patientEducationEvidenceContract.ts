import { z } from "zod";

const identifierSchema = z.string().regex(/^[A-Z0-9-]+$/);
const textSchema = z.string().trim().min(1).max(10000);

export const patientEducationEvidenceSourceSchema = z.object({
  sourceId: z.string().regex(/^SRC-[A-Z0-9-]+$/),
  sourceType: z.enum([
    "regulatory_label",
    "government_guidance",
    "professional_guideline",
    "systematic_review",
    "randomized_trial",
    "observational_study",
    "consensus_statement",
    "manufacturer_instructions",
    "institutional_policy",
    "patient_safety_standard",
    "health_literacy_standard",
    "accessibility_standard",
    "other",
  ]),
  title: textSchema.max(500),
  publisher: textSchema.max(300),
  jurisdiction: z.string().min(2).max(120),
  publicationDate: z.string().date().optional(),
  lastVerifiedAt: z.string().datetime(),
  status: z.enum(["active", "superseded", "retracted", "unavailable", "needs_verification"]),
  authorityTier: z.enum(["controlling", "authoritative", "supporting", "contextual"]),
  locatorRef: z.string().min(3),
  licenseBoundary: textSchema.max(1000),
  supersededBySourceId: z.string().regex(/^SRC-[A-Z0-9-]+$/).optional(),
}).superRefine((value, context) => {
  if (value.status === "superseded" && !value.supersededBySourceId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Superseded source ${value.sourceId} requires supersededBySourceId.` });
  }
});

const evidenceLinkSchema = z.object({
  sourceId: z.string().regex(/^SRC-[A-Z0-9-]+$/),
  relationship: z.enum(["controlling", "supports", "context", "limits", "contradicts"]),
  locator: textSchema.max(500),
  interpretation: textSchema.max(2000),
});

const applicabilitySchema = z.object({
  populations: z.array(textSchema.max(300)).min(1),
  exclusions: z.array(textSchema.max(300)).default([]),
  careSettings: z.array(textSchema.max(200)).min(1),
  medicationOrDeviceScope: z.array(textSchema.max(200)).default([]),
  jurisdictions: z.array(textSchema.max(120)).min(1),
});

export const patientEducationEvidenceClaimSchema = z.object({
  claimId: z.string().regex(/^CLAIM-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  claimType: z.enum([
    "definition",
    "benefit",
    "risk",
    "warning",
    "emergency_action",
    "routine_action",
    "procedure",
    "monitoring",
    "missed_dose",
    "interruption",
    "interaction",
    "storage",
    "disposal",
    "follow_up",
    "coverage_or_cost",
    "workflow",
    "other",
  ]),
  riskTier: z.enum(["low", "moderate", "high", "critical"]),
  internalClaim: textSchema,
  approvedPatientLanguage: textSchema.optional(),
  prohibitedOrMisleadingLanguage: z.array(textSchema.max(1000)).default([]),
  rationale: textSchema,
  applicability: applicabilitySchema,
  evidenceLinks: z.array(evidenceLinkSchema).min(1),
  requiredReviewRoleIds: z.array(z.string().regex(/^[a-z0-9_]+$/)).min(1),
  reviewStatus: z.enum(["not_started", "in_review", "approved", "revision_requested", "blocked", "expired"]),
  approvedVersion: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  reviewedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  unresolvedQuestions: z.array(textSchema.max(1000)).default([]),
  updateTriggerIds: z.array(z.string().regex(/^TRIGGER-[A-Z0-9-]+$/)).default([]),
}).superRefine((value, context) => {
  if (value.reviewStatus === "approved" && (!value.approvedPatientLanguage || !value.approvedVersion || !value.reviewedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved claim ${value.claimId} requires patient language, approved version, and review date.` });
  }
  if (["high", "critical"].includes(value.riskTier) && !value.evidenceLinks.some((link) => link.relationship === "controlling")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `High-risk claim ${value.claimId} requires a controlling evidence link.` });
  }
  if (value.reviewStatus === "approved" && value.unresolvedQuestions.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved claim ${value.claimId} cannot retain unresolved questions.` });
  }
});

export const patientEducationUpdateTriggerSchema = z.object({
  triggerId: z.string().regex(/^TRIGGER-[A-Z0-9-]+$/),
  triggerType: z.enum([
    "source_revision",
    "source_retraction",
    "regulatory_change",
    "guideline_change",
    "safety_signal",
    "institutional_policy_change",
    "formulary_change",
    "device_instruction_change",
    "patient_testing_failure",
    "accessibility_defect",
    "content_correction",
    "scheduled_review",
  ]),
  description: textSchema.max(1000),
  ownerRoleId: z.string().regex(/^[a-z0-9_]+$/),
  responseWindowHours: z.number().int().positive().max(8760),
  affectedClaimIds: z.array(z.string().regex(/^CLAIM-[A-Z0-9-]+$/)).min(1),
  action: z.enum(["review", "suspend", "recall", "replace", "document_no_change"]),
});

export const patientEducationEvidenceDecisionSchema = z.object({
  decisionId: z.string().regex(/^DECISION-[A-Z0-9-]+$/),
  claimIds: z.array(z.string().regex(/^CLAIM-[A-Z0-9-]+$/)).min(1),
  question: textSchema.max(1500),
  optionsConsidered: z.array(textSchema.max(1500)).min(2),
  decision: textSchema.max(2000),
  rationale: textSchema.max(4000),
  decisionStatus: z.enum(["proposed", "approved", "superseded"]),
  approvedByRoleIds: z.array(z.string().regex(/^[a-z0-9_]+$/)).default([]),
  decidedAt: z.string().datetime().optional(),
  supersededByDecisionId: z.string().regex(/^DECISION-[A-Z0-9-]+$/).optional(),
}).superRefine((value, context) => {
  if (value.decisionStatus === "approved" && (!value.decidedAt || value.approvedByRoleIds.length === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved decision ${value.decisionId} requires a decision date and approving roles.` });
  }
  if (value.decisionStatus === "superseded" && !value.supersededByDecisionId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: `Superseded decision ${value.decisionId} requires a replacement decision reference.` });
  }
});

export const patientEducationEvidenceDossierSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  dossierId: z.string().regex(/^DOSSIER-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  title: textSchema.max(500),
  status: z.enum(["not_started", "researching", "internal_review", "external_review", "complete", "needs_update", "suspended", "retired"]),
  dataClassification: z.enum(["caf_confidential", "client_confidential", "restricted_clinical_source"]),
  scopeStatement: textSchema.max(3000),
  sources: z.array(patientEducationEvidenceSourceSchema).min(1),
  claims: z.array(patientEducationEvidenceClaimSchema).min(1),
  decisions: z.array(patientEducationEvidenceDecisionSchema).default([]),
  updateTriggers: z.array(patientEducationUpdateTriggerSchema).min(1),
  requiredReviewRoleIds: z.array(z.string().regex(/^[a-z0-9_]+$/)).min(1),
  lastReviewedAt: z.string().datetime().optional(),
  nextReviewAt: z.string().datetime().optional(),
  prohibitedPublicDistribution: z.literal(true),
}).superRefine((value, context) => {
  const unique = (values: string[]) => new Set(values).size === values.length;
  const sourceIds = value.sources.map((source) => source.sourceId);
  const claimIds = value.claims.map((claim) => claim.claimId);
  const decisionIds = value.decisions.map((decision) => decision.decisionId);
  const triggerIds = value.updateTriggers.map((trigger) => trigger.triggerId);

  if (!unique(sourceIds)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Evidence source IDs must be unique." });
  if (!unique(claimIds)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Evidence claim IDs must be unique." });
  if (!unique(decisionIds)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Evidence decision IDs must be unique." });
  if (!unique(triggerIds)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Evidence update trigger IDs must be unique." });

  const sourceIdSet = new Set(sourceIds);
  const claimIdSet = new Set(claimIds);
  const triggerIdSet = new Set(triggerIds);
  const activeDecisionClaimIds = new Set(value.decisions.filter((decision) => decision.decisionStatus === "approved").flatMap((decision) => decision.claimIds));

  for (const claim of value.claims) {
    if (claim.packageId !== value.packageId) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Claim ${claim.claimId} belongs to a different package.` });
    }
    for (const link of claim.evidenceLinks) {
      if (!sourceIdSet.has(link.sourceId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Claim ${claim.claimId} references unknown source ${link.sourceId}.` });
      }
      const source = value.sources.find((candidate) => candidate.sourceId === link.sourceId);
      if (source?.status === "retracted") {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Claim ${claim.claimId} relies on retracted source ${link.sourceId}.` });
      }
    }
    for (const triggerId of claim.updateTriggerIds) {
      if (!triggerIdSet.has(triggerId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Claim ${claim.claimId} references unknown update trigger ${triggerId}.` });
      }
    }
    const hasContradiction = claim.evidenceLinks.some((link) => link.relationship === "contradicts");
    if (hasContradiction && !activeDecisionClaimIds.has(claim.claimId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: `Contradicted claim ${claim.claimId} requires an approved evidence decision.` });
    }
  }

  for (const decision of value.decisions) {
    for (const claimId of decision.claimIds) {
      if (!claimIdSet.has(claimId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Decision ${decision.decisionId} references unknown claim ${claimId}.` });
      }
    }
  }

  for (const trigger of value.updateTriggers) {
    for (const claimId of trigger.affectedClaimIds) {
      if (!claimIdSet.has(claimId)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Update trigger ${trigger.triggerId} references unknown claim ${claimId}.` });
      }
    }
  }

  if (value.status === "complete") {
    if (value.claims.some((claim) => claim.reviewStatus !== "approved")) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Complete evidence dossiers require every claim to be approved." });
    }
    if (!value.lastReviewedAt || !value.nextReviewAt) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Complete evidence dossiers require last and next review dates." });
    }
    if (value.sources.some((source) => ["retracted", "unavailable", "needs_verification"].includes(source.status))) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Complete evidence dossiers cannot rely on retracted, unavailable, or unverified sources." });
    }
  }
});

export type PatientEducationEvidenceDossier = z.infer<typeof patientEducationEvidenceDossierSchema>;

export type PatientEducationEvidenceReadiness = {
  ready: boolean;
  blockingReasons: string[];
  warningReasons: string[];
};

export const evaluatePatientEducationEvidenceReadiness = (value: unknown): PatientEducationEvidenceReadiness => {
  const parsed = patientEducationEvidenceDossierSchema.safeParse(value);
  if (!parsed.success) {
    return {
      ready: false,
      blockingReasons: parsed.error.issues.map((issue) => issue.message),
      warningReasons: [],
    };
  }

  const dossier = parsed.data;
  const blockingReasons: string[] = [];
  const warningReasons: string[] = [];
  if (dossier.status !== "complete") blockingReasons.push(`Dossier status is ${dossier.status}, not complete.`);
  for (const claim of dossier.claims) {
    if (claim.reviewStatus !== "approved") blockingReasons.push(`Claim ${claim.claimId} is ${claim.reviewStatus}.`);
    if (claim.expiresAt && new Date(claim.expiresAt).getTime() <= Date.now()) blockingReasons.push(`Claim ${claim.claimId} approval is expired.`);
    if (claim.evidenceLinks.some((link) => link.relationship === "context") && !claim.evidenceLinks.some((link) => ["controlling", "supports"].includes(link.relationship))) {
      warningReasons.push(`Claim ${claim.claimId} has contextual evidence without a supporting relationship.`);
    }
  }
  if (dossier.nextReviewAt && new Date(dossier.nextReviewAt).getTime() <= Date.now()) blockingReasons.push("Evidence dossier review is overdue.");

  return { ready: blockingReasons.length === 0, blockingReasons, warningReasons };
};

export const validatePatientEducationEvidenceDossier = (value: unknown) => patientEducationEvidenceDossierSchema.safeParse(value);
