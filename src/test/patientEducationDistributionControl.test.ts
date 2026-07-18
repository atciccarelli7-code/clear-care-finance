import { describe, expect, it } from "vitest";
import {
  buildPatientEducationDistributionControlNotice,
  patientEducationDistributionAcknowledgmentSchema,
  patientEducationDistributionRecordSchema,
  revokePatientEducationDistributions,
} from "@/lib/patientEducationDistributionControl";

const artifactSha = "a".repeat(64);

const envelope = {
  schemaVersion: "1.0.0" as const,
  envelopeId: "CAF-PE-DELIVERY-DIST-DEMO",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  documentId: "CAF-PE-DOC-DEMO-AVS",
  documentVersion: "1.0.0",
  assetId: "CAF-PE-DEMO-AVS",
  locale: "en-US",
  artifact: {
    path: "demo/avs/v1.0.0/guide.avs.txt",
    target: "avs_text" as const,
    mimeType: "text/plain; charset=utf-8",
    byteLength: 100,
    sha256: artifactSha,
  },
  organizationKey: "DEMO-HOSPITAL",
  authorizationId: "CAF-PE-AUTH-DIST-DEMO",
  integrityManifestId: "CAF-PE-INTEGRITY-DIST-DEMO",
  destination: {
    type: "avs_text" as const,
    encoding: "utf-8" as const,
    insertionPoint: "patient_instructions" as const,
    maximumCharacters: 20000,
  },
  privacyBoundary: {
    containsPatientIdentifiers: false as const,
    containsEncounterIdentifiers: false as const,
    cafPersistsPatientContext: false as const,
    patientBinding: "none" as const,
  },
  generatedAt: "2026-07-18T16:00:00.000Z",
  status: "prepared" as const,
};

const receipt = {
  schemaVersion: "1.0.0" as const,
  receiptId: "CAF-PE-RECEIPT-DIST-DEMO",
  envelopeId: envelope.envelopeId,
  authorizationId: envelope.authorizationId,
  artifactSha256: artifactSha,
  destinationType: "avs_text" as const,
  status: "accepted" as const,
  occurredAt: "2026-07-18T16:01:00.000Z",
  reasonCode: "accepted" as const,
  destinationReceiptRef: "destination://aggregate-receipt-001",
};

const activeDistribution = patientEducationDistributionRecordSchema.parse({
  schemaVersion: "1.0.0",
  distributionId: "CAF-PE-DIST-DEMO-001",
  envelope,
  receipt,
  organizationKey: "DEMO-HOSPITAL",
  recordedAt: "2026-07-18T16:01:00.000Z",
  currentStatus: "active",
});

const recalledRelease = {
  schemaVersion: "1.0.0" as const,
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  status: "recalled" as const,
  contentHash: "b".repeat(64),
  createdAt: "2026-07-18T15:00:00.000Z",
  updatedAt: "2026-07-18T17:00:00.000Z",
  effectiveAt: "2026-07-18T15:30:00.000Z",
  recall: {
    severity: "critical" as const,
    initiatedAt: "2026-07-18T17:00:00.000Z",
    reason: "A synthetic critical safety defect affects the released artifact.",
    affectedAssets: ["CAF-PE-DEMO-AVS"],
    requiredAction: "Disable existing artifacts and confirm removal.",
  },
  events: [
    {
      eventId: "CAF-PE-EVENT-DIST-CREATED",
      eventType: "created" as const,
      occurredAt: "2026-07-18T15:00:00.000Z",
      actorRole: "Product owner",
      reason: "Create the release record.",
      evidenceRefs: [],
    },
    {
      eventId: "CAF-PE-EVENT-DIST-RELEASED",
      eventType: "released" as const,
      occurredAt: "2026-07-18T15:30:00.000Z",
      actorRole: "Release authority",
      reason: "Release the synthetic artifact.",
      evidenceRefs: [],
    },
    {
      eventId: "CAF-PE-EVENT-DIST-RECALLED",
      eventType: "recalled" as const,
      occurredAt: "2026-07-18T17:00:00.000Z",
      actorRole: "Safety authority",
      reason: "Recall the synthetic artifact.",
      evidenceRefs: ["SAFETY-CASE-DEMO"],
    },
  ],
};

describe("patientEducationDistributionControl", () => {
  it("builds a critical recall notice for active matching distributions", () => {
    const notice = buildPatientEducationDistributionControlNotice({
      noticeId: "CAF-PE-NOTICE-DEMO-RECALL",
      releaseRecord: recalledRelease,
      distributions: [activeDistribution],
      issuedAt: "2026-07-18T17:01:00.000Z",
      acknowledgmentDeadline: "2026-07-18T19:00:00.000Z",
    });

    expect(notice.releaseStatus).toBe("recalled");
    expect(notice.severity).toBe("critical");
    expect(notice.requiredAction).toBe("disable_existing_artifacts");
    expect(notice.affectedDistributionIds).toEqual([activeDistribution.distributionId]);
    expect(notice.affectedArtifactHashes).toEqual([artifactSha]);
    expect(notice.acknowledgmentRequired).toBe(true);
  });

  it("requires an acknowledgment deadline for a recall", () => {
    expect(() => buildPatientEducationDistributionControlNotice({
      noticeId: "CAF-PE-NOTICE-DEMO-NO-DEADLINE",
      releaseRecord: recalledRelease,
      distributions: [activeDistribution],
      issuedAt: "2026-07-18T17:01:00.000Z",
    })).toThrow("requires an acknowledgment deadline");
  });

  it("revokes affected distributions while preserving the original accepted receipt", () => {
    const notice = buildPatientEducationDistributionControlNotice({
      noticeId: "CAF-PE-NOTICE-DEMO-REVOKE",
      releaseRecord: recalledRelease,
      distributions: [activeDistribution],
      issuedAt: "2026-07-18T17:01:00.000Z",
      acknowledgmentDeadline: "2026-07-18T19:00:00.000Z",
    });
    const [result] = revokePatientEducationDistributions({
      distributions: [activeDistribution],
      notice,
      occurredAt: "2026-07-18T17:02:00.000Z",
    });

    expect(result.distribution.currentStatus).toBe("revoked");
    expect(result.distribution.receipt.status).toBe("accepted");
    expect(result.revocationReceipt).toEqual(expect.objectContaining({
      status: "revoked",
      reasonCode: "release_recalled",
      artifactSha256: artifactSha,
    }));
    expect(patientEducationDistributionRecordSchema.safeParse(result.distribution).success).toBe(true);
  });

  it("does not affect unrelated package versions or already inactive records", () => {
    const unrelated = patientEducationDistributionRecordSchema.parse({
      ...activeDistribution,
      distributionId: "CAF-PE-DIST-DEMO-002",
      envelope: {
        ...activeDistribution.envelope,
        envelopeId: "CAF-PE-DELIVERY-DIST-DEMO-002",
        packageVersion: "2.0.0",
      },
      receipt: {
        ...activeDistribution.receipt,
        receiptId: "CAF-PE-RECEIPT-DIST-DEMO-002",
        envelopeId: "CAF-PE-DELIVERY-DIST-DEMO-002",
      },
    });
    const notice = buildPatientEducationDistributionControlNotice({
      noticeId: "CAF-PE-NOTICE-DEMO-SCOPED",
      releaseRecord: recalledRelease,
      distributions: [activeDistribution, unrelated],
      issuedAt: "2026-07-18T17:01:00.000Z",
      acknowledgmentDeadline: "2026-07-18T19:00:00.000Z",
    });

    expect(notice.affectedDistributionIds).toEqual([activeDistribution.distributionId]);
    const results = revokePatientEducationDistributions({
      distributions: [activeDistribution, unrelated],
      notice,
      occurredAt: "2026-07-18T17:02:00.000Z",
    });
    expect(results[1].distribution.currentStatus).toBe("active");
    expect(results[1].revocationReceipt).toBeUndefined();
  });

  it("requires governed exception details when an organization cannot complete recall action", () => {
    const unable = patientEducationDistributionAcknowledgmentSchema.safeParse({
      schemaVersion: "1.0.0",
      acknowledgmentId: "CAF-PE-ACK-DEMO-UNABLE",
      noticeId: "CAF-PE-NOTICE-DEMO-RECALL",
      organizationKey: "DEMO-HOSPITAL",
      acknowledgedAt: "2026-07-18T17:10:00.000Z",
      acknowledgedByRole: "Patient education administrator",
      actionStatus: "unable_to_complete",
      completedDistributionIds: [],
      exceptionCode: "technical_failure",
    });
    expect(unable.success).toBe(false);

    const governed = patientEducationDistributionAcknowledgmentSchema.parse({
      schemaVersion: "1.0.0",
      acknowledgmentId: "CAF-PE-ACK-DEMO-GOVERNED",
      noticeId: "CAF-PE-NOTICE-DEMO-RECALL",
      organizationKey: "DEMO-HOSPITAL",
      acknowledgedAt: "2026-07-18T17:10:00.000Z",
      acknowledgedByRole: "Patient education administrator",
      actionStatus: "unable_to_complete",
      completedDistributionIds: [],
      exceptionCode: "technical_failure",
      exceptionReference: "incident://hospital-ticket-123",
    });
    expect(governed.exceptionCode).toBe("technical_failure");
  });
});
