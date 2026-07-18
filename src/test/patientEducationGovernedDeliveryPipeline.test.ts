import { describe, expect, it } from "vitest";
import {
  authorizePreparedPatientEducationCandidate,
  preparePatientEducationReleaseCandidate,
} from "@/lib/patientEducationGovernedDeliveryPipeline";
import {
  patientEducationEngineDocumentsFixture,
  patientEducationEnginePackageFixture,
} from "@/test/fixtures/patientEducationEngineFixture";

const generatedAt = "2026-07-18T15:00:00.000Z";
const approvedReviews = {
  healthLiteracy: "approved" as const,
  accessibility: "approved" as const,
  clinicalSafety: "approved" as const,
};
const permissiveThresholds = {
  maximumReadingGrade: 20,
  minimumReadingEase: 0,
  minimumActionabilityScore: 0,
  minimumNumeracyScore: 0,
  minimumAccessibilityScore: 0,
};

const overlay = {
  schemaVersion: "1.0.0" as const,
  overlayId: "CAF-PE-OVERLAY-PIPELINE-DEMO",
  organizationKey: "DEMO-HOSPITAL",
  packageId: patientEducationEnginePackageFixture.packageId,
  packageVersion: patientEducationEnginePackageFixture.version,
  locale: "en-US",
  effectiveAt: "2026-07-18T14:00:00.000Z",
  expiresAt: "2027-07-18T14:00:00.000Z",
  fields: [
    {
      fieldId: "care_team_contact",
      category: "contact" as const,
      value: "Use the approved hospital transition support route.",
      sourceOwner: "Patient education operations",
      phiCapability: "none" as const,
      approvedByRole: "Institutional patient education owner",
      approvedAt: "2026-07-18T14:00:00.000Z",
    },
  ],
  status: "approved" as const,
  changeReason: "Synthetic governed pipeline fixture.",
};

const allQualityOptions = Object.fromEntries(patientEducationEngineDocumentsFixture.map((document) => [
  document.documentId,
  {
    humanReviews: approvedReviews,
    thresholds: permissiveThresholds,
  },
]));

const passedGates = {
  evidence: "passed" as const,
  clinicalReview: "passed" as const,
  healthLiteracy: "passed" as const,
  accessibility: "passed" as const,
  patientTesting: "passed" as const,
  institutionalLocalization: "passed" as const,
  privacySecurity: "passed" as const,
  outputIntegrity: "passed" as const,
};

const prepare = (qualityOptionsByDocumentId = allQualityOptions) => preparePatientEducationReleaseCandidate({
  candidateId: "CAF-PE-CANDIDATE-PIPELINE-DEMO",
  packageValue: patientEducationEnginePackageFixture,
  documents: patientEducationEngineDocumentsFixture,
  mode: "institutional_delivery",
  generatedAt,
  institutionOverlay: overlay,
  qualityOptionsByDocumentId,
});

describe("patientEducationGovernedDeliveryPipeline", () => {
  it("prepares, fingerprints, and authorizes an exact institutional candidate", async () => {
    const candidate = await prepare();
    expect(candidate.bundle.artifacts.length).toBeGreaterThan(0);
    expect(candidate.integrityManifest.canonicalBundleSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(candidate.preparedDocuments.every((prepared) => prepared.qualityReport.releaseDecision === "passed")).toBe(true);
    expect(candidate.preparedDocuments.find((prepared) => prepared.document.assetId === "CAF-PE-DEMO-QUICK-START")?.overlayId)
      .toBe(overlay.overlayId);

    const delivery = await authorizePreparedPatientEducationCandidate({
      candidate,
      authorizationId: "CAF-PE-AUTH-PIPELINE-DEMO",
      requestedStatus: "pilot_ready",
      evaluatedAt: "2026-07-18T15:05:00.000Z",
      requiredOverlayFieldIds: ["care_team_contact"],
      gates: passedGates,
      releaseRecord: {
        schemaVersion: "1.0.0",
        packageId: candidate.packageValue.packageId,
        packageVersion: candidate.packageValue.version,
        status: "pilot_ready",
        contentHash: candidate.integrityManifest.canonicalBundleSha256,
        createdAt: "2026-07-18T14:30:00.000Z",
        updatedAt: "2026-07-18T15:01:00.000Z",
        effectiveAt: "2026-07-18T15:01:00.000Z",
        expiresAt: "2027-07-18T15:01:00.000Z",
        events: [
          {
            eventId: "CAF-PE-EVENT-PIPELINE-CREATED",
            eventType: "created",
            occurredAt: "2026-07-18T14:30:00.000Z",
            actorRole: "Product owner",
            reason: "Create the pipeline release record.",
            evidenceRefs: [],
          },
          {
            eventId: "CAF-PE-EVENT-PIPELINE-PILOT",
            eventType: "pilot_authorized",
            occurredAt: "2026-07-18T15:01:00.000Z",
            actorRole: "Release authority",
            reason: "Authorize the synthetic pilot candidate.",
            evidenceRefs: [candidate.integrityManifest.manifestId],
          },
        ],
      },
    });

    expect(delivery.decision).toBe("authorized");
    if (delivery.decision !== "authorized") throw new Error("Expected authorized delivery.");
    expect(delivery.bundle.bundleId).toBe(candidate.bundle.bundleId);
    expect(delivery.authorization.releaseRecordHash).toBe(candidate.integrityManifest.canonicalBundleSha256);
  });

  it("returns no distributable bundle when a human quality review is incomplete", async () => {
    const qualityOptions = {
      ...allQualityOptions,
      "CAF-PE-DOC-DEMO-AVS": {
        thresholds: permissiveThresholds,
      },
    };
    const candidate = await prepare(qualityOptions);
    const delivery = await authorizePreparedPatientEducationCandidate({
      candidate,
      authorizationId: "CAF-PE-AUTH-PIPELINE-BLOCKED",
      requestedStatus: "pilot_ready",
      evaluatedAt: "2026-07-18T15:05:00.000Z",
      requiredOverlayFieldIds: ["care_team_contact"],
      gates: passedGates,
      releaseRecord: {
        schemaVersion: "1.0.0",
        packageId: candidate.packageValue.packageId,
        packageVersion: candidate.packageValue.version,
        status: "pilot_ready",
        contentHash: candidate.integrityManifest.canonicalBundleSha256,
        createdAt: "2026-07-18T14:30:00.000Z",
        updatedAt: "2026-07-18T15:01:00.000Z",
        effectiveAt: "2026-07-18T15:01:00.000Z",
        events: [
          {
            eventId: "CAF-PE-EVENT-BLOCKED-CREATED",
            eventType: "created",
            occurredAt: "2026-07-18T14:30:00.000Z",
            actorRole: "Product owner",
            reason: "Create a blocked fixture record.",
            evidenceRefs: [],
          },
          {
            eventId: "CAF-PE-EVENT-BLOCKED-PILOT",
            eventType: "pilot_authorized",
            occurredAt: "2026-07-18T15:01:00.000Z",
            actorRole: "Release authority",
            reason: "Synthetic ledger state used to verify downstream quality blocking.",
            evidenceRefs: [],
          },
        ],
      },
    });

    expect(delivery.decision).toBe("blocked");
    expect("bundle" in delivery).toBe(false);
    expect(delivery.authorization.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-QUALITY-NOT-PASSED", documentId: "CAF-PE-DOC-DEMO-AVS" }),
    ]));
  });

  it("fails closed when a prepared artifact is modified after fingerprinting", async () => {
    const candidate = await prepare();
    const tampered = {
      ...candidate,
      bundle: {
        ...candidate.bundle,
        artifacts: candidate.bundle.artifacts.map((artifact, index) => index === 0
          ? { ...artifact, content: `${artifact.content}\nTampered after signing` }
          : artifact),
      },
    };

    await expect(authorizePreparedPatientEducationCandidate({
      candidate: tampered,
      authorizationId: "CAF-PE-AUTH-PIPELINE-TAMPERED",
      requestedStatus: "pilot_ready",
      evaluatedAt: "2026-07-18T15:05:00.000Z",
      gates: passedGates,
      releaseRecord: {
        schemaVersion: "1.0.0",
        packageId: candidate.packageValue.packageId,
        packageVersion: candidate.packageValue.version,
        status: "pilot_ready",
        contentHash: candidate.integrityManifest.canonicalBundleSha256,
        createdAt: "2026-07-18T14:30:00.000Z",
        updatedAt: "2026-07-18T15:01:00.000Z",
        effectiveAt: "2026-07-18T15:01:00.000Z",
        events: [
          {
            eventId: "CAF-PE-EVENT-TAMPER-CREATED",
            eventType: "created",
            occurredAt: "2026-07-18T14:30:00.000Z",
            actorRole: "Product owner",
            reason: "Create tamper test record.",
            evidenceRefs: [],
          },
          {
            eventId: "CAF-PE-EVENT-TAMPER-PILOT",
            eventType: "pilot_authorized",
            occurredAt: "2026-07-18T15:01:00.000Z",
            actorRole: "Release authority",
            reason: "Create tamper test authorization event.",
            evidenceRefs: [],
          },
        ],
      },
    })).rejects.toThrow("candidate integrity verification failed");
  });

  it("blocks when the release record was signed for a different candidate hash", async () => {
    const candidate = await prepare();
    const delivery = await authorizePreparedPatientEducationCandidate({
      candidate,
      authorizationId: "CAF-PE-AUTH-PIPELINE-HASH-MISMATCH",
      requestedStatus: "pilot_ready",
      evaluatedAt: "2026-07-18T15:05:00.000Z",
      gates: passedGates,
      releaseRecord: {
        schemaVersion: "1.0.0",
        packageId: candidate.packageValue.packageId,
        packageVersion: candidate.packageValue.version,
        status: "pilot_ready",
        contentHash: "b".repeat(64),
        createdAt: "2026-07-18T14:30:00.000Z",
        updatedAt: "2026-07-18T15:01:00.000Z",
        effectiveAt: "2026-07-18T15:01:00.000Z",
        events: [
          {
            eventId: "CAF-PE-EVENT-HASH-CREATED",
            eventType: "created",
            occurredAt: "2026-07-18T14:30:00.000Z",
            actorRole: "Product owner",
            reason: "Create mismatch test record.",
            evidenceRefs: [],
          },
          {
            eventId: "CAF-PE-EVENT-HASH-PILOT",
            eventType: "pilot_authorized",
            occurredAt: "2026-07-18T15:01:00.000Z",
            actorRole: "Release authority",
            reason: "Create mismatch test authorization event.",
            evidenceRefs: [],
          },
        ],
      },
    });

    expect(delivery.decision).toBe("blocked");
    expect(delivery.authorization.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-CONTENT-HASH-MISMATCH" }),
    ]));
  });
});
