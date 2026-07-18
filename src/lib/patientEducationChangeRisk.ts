import { z } from "zod";
import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentBlock,
  type PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";

export const patientEducationChangeRiskLevelSchema = z.enum([
  "none",
  "low",
  "medium",
  "high",
  "critical",
]);

export const patientEducationChangeRecordSchema = z.object({
  code: z.string().regex(/^CHANGE-[A-Z0-9-]+$/),
  risk: patientEducationChangeRiskLevelSchema.exclude(["none"]),
  changeType: z.enum(["added", "removed", "modified", "moved", "boundary_changed"]),
  message: z.string().trim().min(1),
  blockId: z.string().optional(),
});

export const patientEducationChangeRiskReportSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  reportId: z.string().regex(/^CAF-PE-CHANGE-[A-Z0-9-]+$/),
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  fromVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  toVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  overallRisk: patientEducationChangeRiskLevelSchema,
  changes: z.array(patientEducationChangeRecordSchema),
  requiredReviews: z.array(z.enum([
    "clinical_safety",
    "nursing_workflow",
    "pharmacy",
    "health_literacy",
    "accessibility",
    "evidence",
    "localization",
    "privacy_security",
    "institutional_implementation",
    "patient_testing",
  ])),
  requiredActions: z.array(z.enum([
    "increment_version",
    "rerun_automated_qa",
    "recompile_all_artifacts",
    "regenerate_integrity_manifest",
    "reopen_release_gates",
    "reapprove_localizations",
    "reapprove_institution_overlays",
    "consider_distribution_suspension",
    "issue_correction_or_recall_assessment",
  ])),
});

export type PatientEducationChangeRiskReport = z.infer<typeof patientEducationChangeRiskReportSchema>;

type RiskLevel = z.infer<typeof patientEducationChangeRiskLevelSchema>;
type ChangeRecord = z.infer<typeof patientEducationChangeRecordSchema>;

const riskWeight: Record<RiskLevel, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const maxRisk = (levels: RiskLevel[]): RiskLevel => levels.reduce<RiskLevel>(
  (highest, current) => riskWeight[current] > riskWeight[highest] ? current : highest,
  "none",
);

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }
  return value;
};

const equivalent = (left: unknown, right: unknown) =>
  JSON.stringify(canonicalize(left)) === JSON.stringify(canonicalize(right));

const isEmergencyBlock = (block: PatientEducationContentBlock) =>
  (block.type === "callout" && block.tone === "emergency")
  || (block.type === "action_list" && block.items.some((item) => item.urgency === "emergency"));

const hasPhiCapability = (block: PatientEducationContentBlock) =>
  block.type === "personalization" && block.fields.some((field) => field.phiCapability !== "none");

const contentChangeRisk = (previous: PatientEducationContentBlock, next: PatientEducationContentBlock): RiskLevel => {
  if (previous.type !== next.type || previous.sectionId !== next.sectionId) return "high";
  if (previous.clinicalInstruction !== next.clinicalInstruction) return "critical";
  if (!previous.publicPreviewAllowed && next.publicPreviewAllowed) return "critical";
  if (isEmergencyBlock(previous) || isEmergencyBlock(next)) return "critical";
  if (hasPhiCapability(previous) || hasPhiCapability(next)) return "critical";
  if (previous.type === "procedure" || previous.type === "troubleshooting" || previous.type === "action_list") {
    return previous.clinicalInstruction || next.clinicalInstruction ? "high" : "medium";
  }
  if (previous.type === "evidence_anchor") return "high";
  if (previous.type === "callout") return previous.clinicalInstruction || next.clinicalInstruction ? "high" : "medium";
  if (previous.type === "personalization") return "high";
  if (previous.clinicalInstruction || next.clinicalInstruction) return "high";
  return "low";
};

const addedOrRemovedRisk = (block: PatientEducationContentBlock): RiskLevel => {
  if (isEmergencyBlock(block) || hasPhiCapability(block)) return "critical";
  if (block.clinicalInstruction) return "high";
  if (["procedure", "troubleshooting", "action_list", "evidence_anchor", "personalization"].includes(block.type)) return "medium";
  return "low";
};

const change = (
  code: string,
  risk: Exclude<RiskLevel, "none">,
  changeType: ChangeRecord["changeType"],
  message: string,
  blockId?: string,
): ChangeRecord => ({ code, risk, changeType, message, ...(blockId ? { blockId } : {}) });

const reviewsForRisk = (changes: ChangeRecord[]) => {
  const reviews = new Set<PatientEducationChangeRiskReport["requiredReviews"][number]>();
  for (const item of changes) {
    reviews.add("health_literacy");
    reviews.add("accessibility");
    if (item.risk === "medium" || item.risk === "high" || item.risk === "critical") reviews.add("nursing_workflow");
    if (item.risk === "high" || item.risk === "critical") {
      reviews.add("clinical_safety");
      reviews.add("evidence");
      reviews.add("localization");
      reviews.add("institutional_implementation");
    }
    if (item.code.includes("PHI") || item.code.includes("BOUNDARY") || item.code.includes("PUBLIC")) reviews.add("privacy_security");
    if (item.risk === "critical") reviews.add("patient_testing");
  }
  return [...reviews].sort();
};

const actionsForRisk = (overallRisk: RiskLevel, changes: ChangeRecord[]) => {
  if (overallRisk === "none") return [];
  const actions = new Set<PatientEducationChangeRiskReport["requiredActions"][number]>([
    "increment_version",
    "rerun_automated_qa",
    "recompile_all_artifacts",
    "regenerate_integrity_manifest",
  ]);
  if (riskWeight[overallRisk] >= riskWeight.high) {
    actions.add("reopen_release_gates");
    actions.add("reapprove_localizations");
    actions.add("reapprove_institution_overlays");
  }
  if (overallRisk === "critical") {
    actions.add("consider_distribution_suspension");
    actions.add("issue_correction_or_recall_assessment");
  }
  if (changes.some((item) => item.code.includes("SOURCE-DOSSIER"))) actions.add("reopen_release_gates");
  return [...actions].sort();
};

export const classifyPatientEducationChangeRisk = (
  previousInput: unknown,
  nextInput: unknown,
): PatientEducationChangeRiskReport => {
  const previous = patientEducationContentDocumentSchema.parse(previousInput);
  const next = patientEducationContentDocumentSchema.parse(nextInput);

  if (previous.documentId !== next.documentId) throw new Error("Change-risk comparison requires the same documentId.");
  if (previous.packageId !== next.packageId) throw new Error("Change-risk comparison requires the same packageId.");
  if (previous.assetId !== next.assetId) throw new Error("Change-risk comparison requires the same assetId.");

  const changes: ChangeRecord[] = [];

  if (previous.distributionBoundary !== next.distributionBoundary) {
    changes.push(change(
      "CHANGE-DISTRIBUTION-BOUNDARY",
      "critical",
      "boundary_changed",
      `Distribution boundary changed from ${previous.distributionBoundary} to ${next.distributionBoundary}.`,
    ));
  }
  if (previous.sourceDossierId !== next.sourceDossierId) {
    changes.push(change(
      "CHANGE-SOURCE-DOSSIER",
      "critical",
      "boundary_changed",
      "The controlling source dossier reference changed.",
    ));
  }
  if (previous.language !== next.language) {
    changes.push(change(
      "CHANGE-DOCUMENT-LANGUAGE",
      "high",
      "boundary_changed",
      `Document language changed from ${previous.language} to ${next.language}.`,
    ));
  }
  if (!equivalent(previous.supportedTargets, next.supportedTargets)) {
    changes.push(change(
      "CHANGE-DELIVERY-TARGETS",
      "medium",
      "boundary_changed",
      "Supported delivery targets changed.",
    ));
  }

  const previousById = new Map(previous.blocks.map((block) => [block.blockId, block]));
  const nextById = new Map(next.blocks.map((block) => [block.blockId, block]));

  for (const block of previous.blocks) {
    const current = nextById.get(block.blockId);
    if (!current) {
      changes.push(change(
        "CHANGE-BLOCK-REMOVED",
        addedOrRemovedRisk(block) as Exclude<RiskLevel, "none">,
        "removed",
        `Block ${block.blockId} was removed.`,
        block.blockId,
      ));
      continue;
    }
    if (equivalent(block, current)) continue;
    if (block.sectionId !== current.sectionId) {
      changes.push(change(
        "CHANGE-BLOCK-MOVED",
        "high",
        "moved",
        `Block ${block.blockId} moved from ${block.sectionId} to ${current.sectionId}.`,
        block.blockId,
      ));
    }
    if (!block.publicPreviewAllowed && current.publicPreviewAllowed) {
      changes.push(change(
        "CHANGE-PUBLIC-EXPOSURE-EXPANDED",
        "critical",
        "boundary_changed",
        `Block ${block.blockId} became eligible for public preview.`,
        block.blockId,
      ));
    }
    if (block.clinicalInstruction !== current.clinicalInstruction) {
      changes.push(change(
        "CHANGE-CLINICAL-CLASSIFICATION",
        "critical",
        "boundary_changed",
        `Block ${block.blockId} changed clinical-instruction classification.`,
        block.blockId,
      ));
    }
    if ((hasPhiCapability(block) || hasPhiCapability(current)) && !equivalent(block, current)) {
      changes.push(change(
        "CHANGE-PHI-CAPABLE-FIELD",
        "critical",
        "modified",
        `PHI-capable personalization changed in block ${block.blockId}.`,
        block.blockId,
      ));
    }
    changes.push(change(
      "CHANGE-BLOCK-CONTENT",
      contentChangeRisk(block, current) as Exclude<RiskLevel, "none">,
      "modified",
      `Block ${block.blockId} content changed.`,
      block.blockId,
    ));
  }

  for (const block of next.blocks) {
    if (previousById.has(block.blockId)) continue;
    changes.push(change(
      "CHANGE-BLOCK-ADDED",
      addedOrRemovedRisk(block) as Exclude<RiskLevel, "none">,
      "added",
      `Block ${block.blockId} was added.`,
      block.blockId,
    ));
  }

  const deduplicated = changes.filter((item, index) => changes.findIndex((candidate) =>
    candidate.code === item.code
    && candidate.blockId === item.blockId
    && candidate.changeType === item.changeType,
  ) === index);
  const overallRisk = maxRisk(deduplicated.map((item) => item.risk));
  const reportKey = `${previous.documentId}-${previous.assetVersion}-TO-${next.assetVersion}`
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-");

  return patientEducationChangeRiskReportSchema.parse({
    schemaVersion: "1.0.0",
    reportId: `CAF-PE-CHANGE-${reportKey}`,
    documentId: previous.documentId,
    fromVersion: previous.assetVersion,
    toVersion: next.assetVersion,
    overallRisk,
    changes: deduplicated,
    requiredReviews: reviewsForRisk(deduplicated),
    requiredActions: actionsForRisk(overallRisk, deduplicated),
  });
};
