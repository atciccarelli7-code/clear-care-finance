import { z } from "zod";
import {
  patientEducationDeliveryEnvelopeSchema,
  patientEducationDeliveryReceiptSchema,
  type PatientEducationDeliveryEnvelope,
  type PatientEducationDeliveryReceipt,
} from "@/lib/patientEducationDeliveryAdapterContract";
import {
  patientEducationReleaseRecordSchema,
  type PatientEducationReleaseRecord,
} from "@/lib/patientEducationReleaseRegistry";

export const patientEducationDistributionRecordSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  distributionId: z.string().regex(/^CAF-PE-DIST-[A-Z0-9-]+$/),
  envelope: patientEducationDeliveryEnvelopeSchema,
  receipt: patientEducationDeliveryReceiptSchema,
  organizationKey: z.string().regex(/^[A-Z0-9-]+$/),
  recordedAt: z.string().datetime(),
  currentStatus: z.enum(["active", "rejected", "revoked", "superseded"]),
}).superRefine((value, context) => {
  if (value.envelope.envelopeId !== value.receipt.envelopeId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Distribution envelope and receipt IDs must match." });
  }
  if (value.envelope.authorizationId !== value.receipt.authorizationId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Distribution envelope and receipt authorization IDs must match." });
  }
  if (value.envelope.artifact.sha256 !== value.receipt.artifactSha256) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Distribution envelope and receipt artifact hashes must match." });
  }
  if (value.envelope.organizationKey !== value.organizationKey) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Distribution organizationKey must match its envelope." });
  }
  if (value.receipt.status === "accepted" && value.currentStatus !== "active") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Accepted delivery receipts initially require active distribution status." });
  }
  if (value.receipt.status === "rejected" && value.currentStatus !== "rejected") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Rejected delivery receipts require rejected distribution status." });
  }
});

export const patientEducationDistributionControlNoticeSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  noticeId: z.string().regex(/^CAF-PE-NOTICE-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  releaseStatus: z.enum(["suspended", "recalled", "retired"]),
  severity: z.enum(["advisory", "important", "critical"]),
  issuedAt: z.string().datetime(),
  reason: z.string().trim().min(3).max(2000),
  requiredAction: z.enum([
    "stop_new_distribution",
    "disable_existing_artifacts",
    "replace_with_approved_version",
    "confirm_removal",
    "retain_for_audit_only",
  ]),
  affectedDistributionIds: z.array(z.string().regex(/^CAF-PE-DIST-[A-Z0-9-]+$/)),
  affectedEnvelopeIds: z.array(z.string().regex(/^CAF-PE-DELIVERY-[A-Z0-9-]+$/)),
  affectedArtifactHashes: z.array(z.string().regex(/^[a-f0-9]{64}$/)),
  acknowledgmentRequired: z.boolean(),
  acknowledgmentDeadline: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (value.affectedDistributionIds.length !== value.affectedEnvelopeIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Control notice distribution and envelope counts must match." });
  }
  if (value.acknowledgmentRequired && !value.acknowledgmentDeadline) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Required acknowledgment requires an acknowledgment deadline." });
  }
  if (!value.acknowledgmentRequired && value.acknowledgmentDeadline) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Acknowledgment deadline is invalid when acknowledgment is not required." });
  }
  if (value.releaseStatus === "recalled" && value.requiredAction === "stop_new_distribution") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Recall requires action on existing artifacts, not only future distribution." });
  }
});

export const patientEducationDistributionAcknowledgmentSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  acknowledgmentId: z.string().regex(/^CAF-PE-ACK-[A-Z0-9-]+$/),
  noticeId: z.string().regex(/^CAF-PE-NOTICE-[A-Z0-9-]+$/),
  organizationKey: z.string().regex(/^[A-Z0-9-]+$/),
  acknowledgedAt: z.string().datetime(),
  acknowledgedByRole: z.string().trim().min(2).max(160),
  actionStatus: z.enum(["received", "in_progress", "completed", "unable_to_complete"]),
  completedDistributionIds: z.array(z.string().regex(/^CAF-PE-DIST-[A-Z0-9-]+$/)),
  exceptionCode: z.enum([
    "none",
    "destination_unavailable",
    "artifact_not_found",
    "local_policy_hold",
    "technical_failure",
    "other_governed_exception",
  ]),
  exceptionReference: z.string().trim().min(2).max(500).optional(),
}).superRefine((value, context) => {
  if (value.actionStatus === "completed" && value.exceptionCode !== "none") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Completed acknowledgments cannot retain an exception code." });
  }
  if (value.actionStatus === "unable_to_complete" && value.exceptionCode === "none") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Unable-to-complete acknowledgments require an exception code." });
  }
  if (value.exceptionCode !== "none" && !value.exceptionReference) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Governed exceptions require an exception reference." });
  }
});

export type PatientEducationDistributionRecord = z.infer<typeof patientEducationDistributionRecordSchema>;
export type PatientEducationDistributionControlNotice = z.infer<typeof patientEducationDistributionControlNoticeSchema>;
export type PatientEducationDistributionAcknowledgment = z.infer<typeof patientEducationDistributionAcknowledgmentSchema>;

const releaseSeverity = (record: PatientEducationReleaseRecord) => {
  if (record.status === "recalled") return record.recall?.severity ?? "critical";
  if (record.status === "suspended") return "important" as const;
  return "advisory" as const;
};

const defaultAction = (record: PatientEducationReleaseRecord): PatientEducationDistributionControlNotice["requiredAction"] => {
  if (record.status === "recalled") return "disable_existing_artifacts";
  if (record.status === "suspended") return "stop_new_distribution";
  return "retain_for_audit_only";
};

export const buildPatientEducationDistributionControlNotice = ({
  noticeId,
  releaseRecord: releaseRecordInput,
  distributions: distributionInputs,
  issuedAt,
  requiredAction,
  acknowledgmentDeadline,
}: {
  noticeId: string;
  releaseRecord: unknown;
  distributions: unknown[];
  issuedAt: string;
  requiredAction?: PatientEducationDistributionControlNotice["requiredAction"];
  acknowledgmentDeadline?: string;
}): PatientEducationDistributionControlNotice => {
  const releaseRecord = patientEducationReleaseRecordSchema.parse(releaseRecordInput);
  const distributions = distributionInputs.map((distribution) => patientEducationDistributionRecordSchema.parse(distribution));

  if (!["suspended", "recalled", "retired"].includes(releaseRecord.status)) {
    throw new Error(`Distribution control notice requires suspended, recalled, or retired release status. Received: ${releaseRecord.status}.`);
  }

  const affected = distributions.filter((distribution) =>
    distribution.envelope.packageId === releaseRecord.packageId
    && distribution.envelope.packageVersion === releaseRecord.packageVersion
    && distribution.currentStatus === "active",
  );
  const action = requiredAction ?? defaultAction(releaseRecord);
  const acknowledgmentRequired = releaseRecord.status === "recalled"
    || action === "disable_existing_artifacts"
    || action === "replace_with_approved_version"
    || action === "confirm_removal";

  return patientEducationDistributionControlNoticeSchema.parse({
    schemaVersion: "1.0.0",
    noticeId,
    packageId: releaseRecord.packageId,
    packageVersion: releaseRecord.packageVersion,
    releaseStatus: releaseRecord.status,
    severity: releaseSeverity(releaseRecord),
    issuedAt,
    reason: releaseRecord.status === "recalled"
      ? releaseRecord.recall?.reason ?? "The released package version was recalled."
      : `The package version entered ${releaseRecord.status} status.`,
    requiredAction: action,
    affectedDistributionIds: affected.map((distribution) => distribution.distributionId),
    affectedEnvelopeIds: affected.map((distribution) => distribution.envelope.envelopeId),
    affectedArtifactHashes: [...new Set(affected.map((distribution) => distribution.envelope.artifact.sha256))],
    acknowledgmentRequired,
    ...(acknowledgmentRequired ? { acknowledgmentDeadline } : {}),
  });
};

export const revokePatientEducationDistributions = ({
  distributions: distributionInputs,
  notice: noticeInput,
  occurredAt,
}: {
  distributions: unknown[];
  notice: unknown;
  occurredAt: string;
}): Array<{
  distribution: PatientEducationDistributionRecord;
  revocationReceipt?: PatientEducationDeliveryReceipt;
}> => {
  const notice = patientEducationDistributionControlNoticeSchema.parse(noticeInput);
  const affectedIds = new Set(notice.affectedDistributionIds);

  return distributionInputs.map((distributionInput) => {
    const distribution = patientEducationDistributionRecordSchema.parse(distributionInput);
    if (!affectedIds.has(distribution.distributionId)) return { distribution };

    const reasonCode = notice.releaseStatus === "recalled"
      ? "release_recalled" as const
      : notice.releaseStatus === "suspended"
        ? "release_suspended" as const
        : "superseded_version" as const;
    const revocationReceipt = patientEducationDeliveryReceiptSchema.parse({
      schemaVersion: "1.0.0",
      receiptId: `CAF-PE-RECEIPT-${distribution.distributionId.replace(/^CAF-PE-DIST-/, "")}-REVOCATION`,
      envelopeId: distribution.envelope.envelopeId,
      authorizationId: distribution.envelope.authorizationId,
      artifactSha256: distribution.envelope.artifact.sha256,
      destinationType: distribution.envelope.destination.type,
      status: "revoked",
      occurredAt,
      reasonCode,
      destinationReceiptRef: `control-notice://${notice.noticeId}`,
    });

    return {
      distribution: {
        ...distribution,
        currentStatus: notice.releaseStatus === "retired" ? "superseded" as const : "revoked" as const,
      },
      revocationReceipt,
    };
  });
};
