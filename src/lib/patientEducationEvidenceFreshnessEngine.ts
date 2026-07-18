import { z } from "zod";
import {
  patientEducationEvidenceClaimSchema,
  patientEducationEvidenceSourceSchema,
  patientEducationUpdateTriggerSchema,
} from "@/lib/patientEducationEvidenceContract";

export const patientEducationEvidenceFreshnessSnapshotSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  dossierId: z.string().regex(/^DOSSIER-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  title: z.string().trim().min(1).max(500),
  status: z.enum(["not_started", "researching", "internal_review", "external_review", "complete", "needs_update", "suspended", "retired"]),
  sources: z.array(patientEducationEvidenceSourceSchema).min(1),
  claims: z.array(patientEducationEvidenceClaimSchema).min(1),
  updateTriggers: z.array(patientEducationUpdateTriggerSchema).min(1),
  lastReviewedAt: z.string().datetime().optional(),
  nextReviewAt: z.string().datetime().optional(),
});

export const patientEducationEvidenceFreshnessPolicySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  policyId: z.string().regex(/^CAF-PE-EVIDENCE-POLICY-[A-Z0-9-]+$/),
  maximumVerificationAgeDays: z.object({
    controlling: z.number().int().positive().max(3650),
    authoritative: z.number().int().positive().max(3650),
    supporting: z.number().int().positive().max(3650),
    contextual: z.number().int().positive().max(3650),
  }),
  reviewWarningWindowDays: z.number().int().nonnegative().max(365),
  claimExpirationWarningDays: z.number().int().nonnegative().max(365),
  highRiskExpiredClaimAction: z.enum(["suspend", "recall_assessment"]),
  controllingSourceUnavailableAction: z.enum(["suspend", "recall_assessment"]),
});

export const patientEducationObservedEvidenceTriggerSchema = z.object({
  observationId: z.string().regex(/^CAF-PE-TRIGGER-OBS-[A-Z0-9-]+$/),
  triggerId: z.string().regex(/^TRIGGER-[A-Z0-9-]+$/),
  observedAt: z.string().datetime(),
  status: z.enum(["open", "resolved", "dismissed"]),
  resolutionAt: z.string().datetime().optional(),
  resolutionRationale: z.string().trim().min(3).max(3000).optional(),
}).superRefine((value, context) => {
  if (value.status === "resolved" && (!value.resolutionAt || !value.resolutionRationale)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Resolved evidence triggers require a resolution time and rationale." });
  }
  if (value.status !== "resolved" && (value.resolutionAt || value.resolutionRationale)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Only resolved evidence triggers may include resolution metadata." });
  }
});

export const patientEducationEvidenceFreshnessFindingSchema = z.object({
  code: z.string().regex(/^EVIDENCE-[A-Z0-9-]+$/),
  severity: z.enum(["warning", "blocking", "critical"]),
  message: z.string().trim().min(1),
  requiredAction: z.enum(["verify", "review", "replace", "suspend", "recall_assessment", "document_no_change"]),
  sourceId: z.string().optional(),
  claimId: z.string().optional(),
  triggerId: z.string().optional(),
  dueAt: z.string().datetime().optional(),
});

export const patientEducationEvidenceFreshnessResultSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  dossierId: z.string(),
  packageId: z.string(),
  packageVersion: z.string(),
  evaluatedAt: z.string().datetime(),
  state: z.enum(["current", "review_required", "suspend_required", "recall_assessment_required"]),
  findings: z.array(patientEducationEvidenceFreshnessFindingSchema),
  affectedSourceIds: z.array(z.string()),
  affectedClaimIds: z.array(z.string()),
  openTriggerIds: z.array(z.string()),
});

export type PatientEducationEvidenceFreshnessSnapshot = z.infer<typeof patientEducationEvidenceFreshnessSnapshotSchema>;
export type PatientEducationEvidenceFreshnessPolicy = z.infer<typeof patientEducationEvidenceFreshnessPolicySchema>;
export type PatientEducationObservedEvidenceTrigger = z.infer<typeof patientEducationObservedEvidenceTriggerSchema>;
export type PatientEducationEvidenceFreshnessResult = z.infer<typeof patientEducationEvidenceFreshnessResultSchema>;

const dayMs = 86_400_000;
const addHours = (value: string, hours: number) => new Date(new Date(value).getTime() + hours * 3_600_000).toISOString();
const daysBetween = (earlier: string, later: string) => (new Date(later).getTime() - new Date(earlier).getTime()) / dayMs;

const finding = (
  code: string,
  severity: "warning" | "blocking" | "critical",
  message: string,
  requiredAction: z.infer<typeof patientEducationEvidenceFreshnessFindingSchema>["requiredAction"],
  refs: Partial<Pick<z.infer<typeof patientEducationEvidenceFreshnessFindingSchema>, "sourceId" | "claimId" | "triggerId" | "dueAt">> = {},
) => ({ code, severity, message, requiredAction, ...refs });

const actionSeverity = (action: string): "warning" | "blocking" | "critical" => {
  if (action === "recall" || action === "recall_assessment") return "critical";
  if (action === "suspend" || action === "replace") return "blocking";
  return "warning";
};

const actionForTrigger = (action: PatientEducationEvidenceFreshnessSnapshot["updateTriggers"][number]["action"]) => {
  if (action === "recall") return "recall_assessment" as const;
  return action;
};

export const evaluatePatientEducationEvidenceFreshness = ({
  dossier: rawDossier,
  policy: rawPolicy,
  observedTriggers: rawObservedTriggers = [],
  evaluatedAt = new Date().toISOString(),
}: {
  dossier: unknown;
  policy: unknown;
  observedTriggers?: unknown[];
  evaluatedAt?: string;
}): PatientEducationEvidenceFreshnessResult => {
  const dossier = patientEducationEvidenceFreshnessSnapshotSchema.parse(rawDossier);
  const policy = patientEducationEvidenceFreshnessPolicySchema.parse(rawPolicy);
  const observedTriggers = rawObservedTriggers.map((trigger) => patientEducationObservedEvidenceTriggerSchema.parse(trigger));
  const findings: z.infer<typeof patientEducationEvidenceFreshnessFindingSchema>[] = [];
  const affectedSourceIds = new Set<string>();
  const affectedClaimIds = new Set<string>();
  const openTriggerIds = new Set<string>();

  if (["suspended", "needs_update"].includes(dossier.status)) {
    findings.push(finding(
      "EVIDENCE-DOSSIER-NOT-CURRENT",
      "blocking",
      `Evidence dossier ${dossier.dossierId} is ${dossier.status}.`,
      "suspend",
    ));
  }

  if (dossier.nextReviewAt) {
    const daysUntilReview = daysBetween(evaluatedAt, dossier.nextReviewAt);
    if (daysUntilReview < 0) {
      findings.push(finding(
        "EVIDENCE-DOSSIER-REVIEW-OVERDUE",
        "blocking",
        `Evidence dossier review was due ${dossier.nextReviewAt}.`,
        "review",
        { dueAt: dossier.nextReviewAt },
      ));
    } else if (daysUntilReview <= policy.reviewWarningWindowDays) {
      findings.push(finding(
        "EVIDENCE-DOSSIER-REVIEW-DUE-SOON",
        "warning",
        `Evidence dossier review is due within ${policy.reviewWarningWindowDays} days.`,
        "review",
        { dueAt: dossier.nextReviewAt },
      ));
    }
  }

  for (const source of dossier.sources) {
    const maxAge = policy.maximumVerificationAgeDays[source.authorityTier];
    if (daysBetween(source.lastVerifiedAt, evaluatedAt) > maxAge) {
      findings.push(finding(
        "EVIDENCE-SOURCE-VERIFICATION-STALE",
        source.authorityTier === "controlling" ? "blocking" : "warning",
        `Source ${source.sourceId} exceeds the ${maxAge}-day verification window.`,
        source.authorityTier === "controlling" ? "review" : "verify",
        { sourceId: source.sourceId },
      ));
      affectedSourceIds.add(source.sourceId);
    }

    const affectedClaims = dossier.claims.filter((claim) => claim.evidenceLinks.some((link) => link.sourceId === source.sourceId));
    const controlsHighRiskClaim = affectedClaims.some((claim) =>
      ["high", "critical"].includes(claim.riskTier)
      && claim.evidenceLinks.some((link) => link.sourceId === source.sourceId && link.relationship === "controlling"),
    );

    if (source.status === "retracted") {
      findings.push(finding(
        "EVIDENCE-SOURCE-RETRACTED",
        controlsHighRiskClaim ? "critical" : "blocking",
        `Source ${source.sourceId} is retracted.`,
        controlsHighRiskClaim ? "recall_assessment" : "suspend",
        { sourceId: source.sourceId },
      ));
      affectedSourceIds.add(source.sourceId);
      affectedClaims.forEach((claim) => affectedClaimIds.add(claim.claimId));
    }

    if (["unavailable", "needs_verification"].includes(source.status) && source.authorityTier === "controlling") {
      const action = policy.controllingSourceUnavailableAction;
      findings.push(finding(
        "EVIDENCE-CONTROLLING-SOURCE-UNAVAILABLE",
        action === "recall_assessment" ? "critical" : "blocking",
        `Controlling source ${source.sourceId} is ${source.status}.`,
        action,
        { sourceId: source.sourceId },
      ));
      affectedSourceIds.add(source.sourceId);
      affectedClaims.forEach((claim) => affectedClaimIds.add(claim.claimId));
    }
  }

  for (const claim of dossier.claims) {
    if (claim.expiresAt) {
      const daysUntilExpiration = daysBetween(evaluatedAt, claim.expiresAt);
      if (daysUntilExpiration < 0) {
        const highRisk = ["high", "critical"].includes(claim.riskTier);
        const action = highRisk ? policy.highRiskExpiredClaimAction : "review";
        findings.push(finding(
          "EVIDENCE-CLAIM-APPROVAL-EXPIRED",
          highRisk ? (action === "recall_assessment" ? "critical" : "blocking") : "warning",
          `Claim ${claim.claimId} approval expired ${claim.expiresAt}.`,
          action,
          { claimId: claim.claimId, dueAt: claim.expiresAt },
        ));
        affectedClaimIds.add(claim.claimId);
      } else if (daysUntilExpiration <= policy.claimExpirationWarningDays) {
        findings.push(finding(
          "EVIDENCE-CLAIM-EXPIRING-SOON",
          "warning",
          `Claim ${claim.claimId} approval expires within ${policy.claimExpirationWarningDays} days.`,
          "review",
          { claimId: claim.claimId, dueAt: claim.expiresAt },
        ));
        affectedClaimIds.add(claim.claimId);
      }
    }
  }

  const triggerDefinitions = new Map(dossier.updateTriggers.map((trigger) => [trigger.triggerId, trigger]));
  for (const observation of observedTriggers) {
    const trigger = triggerDefinitions.get(observation.triggerId);
    if (!trigger) {
      findings.push(finding(
        "EVIDENCE-UNKNOWN-TRIGGER-OBSERVATION",
        "blocking",
        `Observed trigger ${observation.triggerId} is not defined by the dossier.`,
        "review",
        { triggerId: observation.triggerId },
      ));
      continue;
    }
    if (observation.status !== "open") continue;
    openTriggerIds.add(trigger.triggerId);
    trigger.affectedClaimIds.forEach((claimId) => affectedClaimIds.add(claimId));
    const dueAt = addHours(observation.observedAt, trigger.responseWindowHours);
    const overdue = new Date(evaluatedAt).getTime() > new Date(dueAt).getTime();
    const requiredAction = actionForTrigger(trigger.action);
    findings.push(finding(
      overdue ? "EVIDENCE-TRIGGER-RESPONSE-OVERDUE" : "EVIDENCE-TRIGGER-OPEN",
      overdue ? actionSeverity(requiredAction) : "warning",
      `Trigger ${trigger.triggerId} is open${overdue ? " beyond its response window" : ""}.`,
      requiredAction,
      { triggerId: trigger.triggerId, dueAt },
    ));
  }

  const requiredActions = new Set(findings.map((item) => item.requiredAction));
  const state = requiredActions.has("recall_assessment")
    ? "recall_assessment_required"
    : requiredActions.has("suspend") || requiredActions.has("replace")
      ? "suspend_required"
      : findings.length > 0
        ? "review_required"
        : "current";

  return patientEducationEvidenceFreshnessResultSchema.parse({
    schemaVersion: "1.0.0",
    dossierId: dossier.dossierId,
    packageId: dossier.packageId,
    packageVersion: dossier.packageVersion,
    evaluatedAt,
    state,
    findings,
    affectedSourceIds: [...affectedSourceIds].sort(),
    affectedClaimIds: [...affectedClaimIds].sort(),
    openTriggerIds: [...openTriggerIds].sort(),
  });
};

export const assertPatientEducationEvidenceCurrent = (input: Parameters<typeof evaluatePatientEducationEvidenceFreshness>[0]) => {
  const result = evaluatePatientEducationEvidenceFreshness(input);
  if (result.state !== "current") {
    throw new Error(`Patient education evidence is not current: ${result.findings.map((item) => item.code).join(", ")}`);
  }
  return result;
};
