import { describe, expect, it } from "vitest";
import {
  createPatientEducationDeliveryEnvelope,
  patientEducationDeliveryEnvelopeSchema,
  patientEducationDeliveryReceiptSchema,
} from "@/lib/patientEducationDeliveryAdapterContract";

const sha = "a".repeat(64);
const bundleSha = "b".repeat(64);

const artifact = {
  documentId: "CAF-PE-DOC-DEMO-AVS",
  assetId: "CAF-PE-DEMO-AVS",
  version: "1.0.0",
  target: "avs_text" as const,
  mimeType: "text/plain; charset=utf-8",
  fileExtension: "avs.txt",
  content: "Synthetic AVS content",
  checksum: "fnv1a-12345678",
  includedBlockIds: ["avs-heading"],
  withheldBlockIds: [],
  warnings: [],
  path: "transition-safety-demo/caf-pe-demo-avs/v1.0.0/demonstration-avs-summary.avs.txt",
};

const integrityManifest = {
  schemaVersion: "1.0.0" as const,
  manifestId: "CAF-PE-INTEGRITY-DEMO-DELIVERY",
  bundleId: "CAF-PE-DEMO-SAFETY-v1.0.0-institutional_delivery",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  mode: "institutional_delivery" as const,
  generatedAt: "2026-07-18T16:00:00.000Z",
  artifactCount: 1,
  artifacts: [
    {
      path: artifact.path,
      assetId: artifact.assetId,
      documentId: artifact.documentId,
      version: artifact.version,
      target: artifact.target,
      mimeType: artifact.mimeType,
      byteLength: 21,
      sha256: sha,
    },
  ],
  canonicalBundleSha256: bundleSha,
};

const authorization = {
  schemaVersion: "1.0.0" as const,
  authorizationId: "CAF-PE-AUTH-DEMO-DELIVERY",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  requestedStatus: "pilot_ready" as const,
  evaluatedAt: "2026-07-18T16:01:00.000Z",
  decision: "authorized" as const,
  findings: [],
  verifiedDocumentKeys: ["CAF-PE-DOC-DEMO-AVS:1.0.0:en-US"],
  verifiedLocalizationIds: [],
  releaseRecordHash: bundleSha,
};

describe("patientEducationDeliveryAdapterContract", () => {
  it("creates a no-PHI AVS delivery envelope bound to authorization and SHA-256", () => {
    const envelope = createPatientEducationDeliveryEnvelope({
      envelopeId: "CAF-PE-DELIVERY-DEMO-AVS",
      artifact,
      integrityManifest,
      authorization,
      organizationKey: "DEMO-HOSPITAL",
      locale: "en-US",
      generatedAt: "2026-07-18T16:02:00.000Z",
      destination: {
        type: "avs_text",
        encoding: "utf-8",
        insertionPoint: "patient_instructions",
        maximumCharacters: 20000,
      },
    });

    expect(envelope.artifact.sha256).toBe(sha);
    expect(envelope.authorizationId).toBe(authorization.authorizationId);
    expect(envelope.privacyBoundary).toEqual({
      containsPatientIdentifiers: false,
      containsEncounterIdentifiers: false,
      cafPersistsPatientContext: false,
      patientBinding: "none",
    });
  });

  it("rejects delivery when the authorization is blocked", () => {
    expect(() => createPatientEducationDeliveryEnvelope({
      envelopeId: "CAF-PE-DELIVERY-DEMO-BLOCKED",
      artifact,
      integrityManifest,
      authorization: { ...authorization, decision: "blocked", findings: [{
        code: "AUTH-QUALITY-NOT-PASSED",
        severity: "blocking",
        message: "Quality review is incomplete.",
        remediation: "Complete review.",
      }] },
      organizationKey: "DEMO-HOSPITAL",
      locale: "en-US",
      generatedAt: "2026-07-18T16:02:00.000Z",
      destination: {
        type: "avs_text",
        encoding: "utf-8",
        insertionPoint: "patient_instructions",
        maximumCharacters: 20000,
      },
    })).toThrow("authorized release decision");
  });

  it("rejects an authorization bound to another bundle hash", () => {
    expect(() => createPatientEducationDeliveryEnvelope({
      envelopeId: "CAF-PE-DELIVERY-DEMO-HASH-MISMATCH",
      artifact,
      integrityManifest,
      authorization: { ...authorization, releaseRecordHash: "c".repeat(64) },
      organizationKey: "DEMO-HOSPITAL",
      locale: "en-US",
      generatedAt: "2026-07-18T16:02:00.000Z",
      destination: {
        type: "avs_text",
        encoding: "utf-8",
        insertionPoint: "patient_instructions",
        maximumCharacters: 20000,
      },
    })).toThrow("not bound to the supplied integrity manifest");
  });

  it("rejects a destination and artifact target mismatch", () => {
    const unsafe = {
      schemaVersion: "1.0.0",
      envelopeId: "CAF-PE-DELIVERY-DEMO-WRONG-TARGET",
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      documentId: artifact.documentId,
      documentVersion: artifact.version,
      assetId: artifact.assetId,
      locale: "en-US",
      artifact: {
        path: artifact.path,
        target: "avs_text",
        mimeType: artifact.mimeType,
        byteLength: 21,
        sha256: sha,
      },
      organizationKey: "DEMO-HOSPITAL",
      authorizationId: authorization.authorizationId,
      integrityManifestId: integrityManifest.manifestId,
      destination: {
        type: "patient_portal",
        payloadSchema: "caf.patient-education.portal.v1",
        displayMode: "article",
      },
      privacyBoundary: {
        containsPatientIdentifiers: false,
        containsEncounterIdentifiers: false,
        cafPersistsPatientContext: false,
        patientBinding: "none",
      },
      generatedAt: "2026-07-18T16:02:00.000Z",
      status: "prepared",
    };
    const result = patientEducationDeliveryEnvelopeSchema.safeParse(unsafe);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toContain("patient_portal_json");
  });

  it("requires organization-runtime-only binding for an EHR document reference", () => {
    const unsafe = {
      schemaVersion: "1.0.0",
      envelopeId: "CAF-PE-DELIVERY-DEMO-EHR",
      packageId: "CAF-PE-DEMO-SAFETY",
      packageVersion: "1.0.0",
      documentId: artifact.documentId,
      documentVersion: artifact.version,
      assetId: artifact.assetId,
      locale: "en-US",
      artifact: {
        path: artifact.path,
        target: "avs_text",
        mimeType: artifact.mimeType,
        byteLength: 21,
        sha256: sha,
      },
      organizationKey: "DEMO-HOSPITAL",
      authorizationId: authorization.authorizationId,
      integrityManifestId: integrityManifest.manifestId,
      destination: {
        type: "ehr_document_reference",
        interoperabilityProfile: "fhir_r4_document_reference",
        patientBinding: "organization_runtime_only",
        cafReceivesPatientIdentifier: false,
      },
      privacyBoundary: {
        containsPatientIdentifiers: false,
        containsEncounterIdentifiers: false,
        cafPersistsPatientContext: false,
        patientBinding: "none",
      },
      generatedAt: "2026-07-18T16:02:00.000Z",
      status: "prepared",
    };
    expect(patientEducationDeliveryEnvelopeSchema.safeParse(unsafe).success).toBe(false);
  });

  it("validates fixed-code receipts without free-text patient context", () => {
    const accepted = patientEducationDeliveryReceiptSchema.parse({
      schemaVersion: "1.0.0",
      receiptId: "CAF-PE-RECEIPT-DEMO-AVS",
      envelopeId: "CAF-PE-DELIVERY-DEMO-AVS",
      authorizationId: authorization.authorizationId,
      artifactSha256: sha,
      destinationType: "avs_text",
      status: "accepted",
      occurredAt: "2026-07-18T16:03:00.000Z",
      reasonCode: "accepted",
      destinationReceiptRef: "destination://aggregate-receipt-001",
    });
    expect(accepted.status).toBe("accepted");

    expect(patientEducationDeliveryReceiptSchema.safeParse({
      ...accepted,
      status: "rejected",
      reasonCode: "accepted",
    }).success).toBe(false);
  });
});
