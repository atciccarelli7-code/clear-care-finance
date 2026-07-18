import { describe, expect, it } from "vitest";
import { analyzePatientEducationQuality } from "@/lib/patientEducationQualityEngine";
import {
  authorizePatientEducationRelease,
  type PatientEducationReleaseAuthorizationRequest,
} from "@/lib/patientEducationReleaseAuthorization";
import { patientEducationQuickStartDocumentFixture } from "@/test/fixtures/patientEducationEngineFixture";

const evaluatedAt = "2026-07-18T14:00:00.000Z";
const contentHash = "a".repeat(64);

const qualityReport = analyzePatientEducationQuality(patientEducationQuickStartDocumentFixture, {
  generatedAt: evaluatedAt,
  humanReviews: {
    healthLiteracy: "approved",
    accessibility: "approved",
    clinicalSafety: "approved",
  },
  thresholds: {
    maximumReadingGrade: 20,
    minimumReadingEase: 0,
    minimumActionabilityScore: 0,
    minimumNumeracyScore: 0,
    minimumAccessibilityScore: 0,
  },
});

const approvedOverlay = {
  schemaVersion: "1.0.0" as const,
  overlayId: "CAF-PE-OVERLAY-DEMO-HOSPITAL",
  organizationKey: "DEMO-HOSPITAL",
  packageId: patientEducationQuickStartDocumentFixture.packageId,
  packageVersion: patientEducationQuickStartDocumentFixture.assetVersion,
  locale: "en-US",
  effectiveAt: "2026-07-18T13:00:00.000Z",
  expiresAt: "2027-07-18T13:00:00.000Z",
  fields: [
    {
      fieldId: "care_team_contact",
      category: "contact" as const,
      value: "Use the approved hospital contact pathway.",
      sourceOwner: "Patient education operations",
      phiCapability: "none" as const,
      approvedByRole: "Institutional patient education owner",
      approvedAt: "2026-07-18T13:00:00.000Z",
    },
  ],
  status: "approved" as const,
  changeReason: "Initial synthetic overlay for release authorization testing.",
};

const baseRequest: PatientEducationReleaseAuthorizationRequest = {
  schemaVersion: "1.0.0",
  authorizationId: "CAF-PE-AUTH-DEMO-PILOT",
  packageId: patientEducationQuickStartDocumentFixture.packageId,
  packageVersion: patientEducationQuickStartDocumentFixture.assetVersion,
  requestedStatus: "pilot_ready",
  contentHash,
  evaluatedAt,
  documents: [
    {
      documentId: patientEducationQuickStartDocumentFixture.documentId,
      documentVersion: patientEducationQuickStartDocumentFixture.assetVersion,
      sourceLanguage: "en-US",
      deliveryLanguage: "en-US",
      required: true,
    },
  ],
  requiredOverlayFieldIds: ["care_team_contact"],
  gates: {
    evidence: "passed",
    clinicalReview: "passed",
    healthLiteracy: "passed",
    accessibility: "passed",
    patientTesting: "passed",
    institutionalLocalization: "passed",
    privacySecurity: "passed",
    outputIntegrity: "passed",
  },
  qualityReports: [qualityReport],
  localizationPackages: [],
  institutionOverlay: approvedOverlay,
  releaseRecord: {
    schemaVersion: "1.0.0",
    packageId: patientEducationQuickStartDocumentFixture.packageId,
    packageVersion: patientEducationQuickStartDocumentFixture.assetVersion,
    status: "pilot_ready",
    contentHash,
    createdAt: "2026-07-18T12:00:00.000Z",
    updatedAt: "2026-07-18T13:30:00.000Z",
    effectiveAt: "2026-07-18T13:30:00.000Z",
    expiresAt: "2027-07-18T13:30:00.000Z",
    events: [
      {
        eventId: "CAF-PE-EVENT-DEMO-CREATED",
        eventType: "created",
        occurredAt: "2026-07-18T12:00:00.000Z",
        actorRole: "Product owner",
        reason: "Create the synthetic release record.",
        evidenceRefs: [],
      },
      {
        eventId: "CAF-PE-EVENT-DEMO-PILOT",
        eventType: "pilot_authorized",
        occurredAt: "2026-07-18T13:30:00.000Z",
        actorRole: "Release authority",
        reason: "Authorize a synthetic pilot fixture.",
        evidenceRefs: [qualityReport.reportId],
      },
    ],
  },
};

describe("patientEducationReleaseAuthorization", () => {
  it("authorizes an exact, fully passed pilot package", () => {
    const result = authorizePatientEducationRelease(baseRequest);
    expect(result.decision).toBe("authorized");
    expect(result.findings).toEqual([]);
    expect(result.verifiedDocumentKeys).toEqual([
      `${patientEducationQuickStartDocumentFixture.documentId}:1.0.0:en-US`,
    ]);
    expect(result.verifiedOverlayId).toBe(approvedOverlay.overlayId);
  });

  it("blocks a release when a required quality report is absent", () => {
    const result = authorizePatientEducationRelease({ ...baseRequest, qualityReports: [] });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-QUALITY-REPORT-MISSING" }),
    ]));
  });

  it("blocks version-bound authorization when the content hash changes", () => {
    const result = authorizePatientEducationRelease({ ...baseRequest, contentHash: "b".repeat(64) });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-CONTENT-HASH-MISMATCH" }),
    ]));
  });

  it("blocks any mandatory gate that remains pending", () => {
    const result = authorizePatientEducationRelease({
      ...baseRequest,
      gates: { ...baseRequest.gates, patientTesting: "pending" },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-GATE-PATIENT-TESTING-PENDING" }),
    ]));
  });

  it("blocks an expired institution overlay", () => {
    const result = authorizePatientEducationRelease({
      ...baseRequest,
      institutionOverlay: {
        ...approvedOverlay,
        expiresAt: "2026-07-18T13:59:00.000Z",
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-INSTITUTION-OVERLAY-INACTIVE" }),
    ]));
  });

  it("blocks a translated delivery when its exact approved localization is missing", () => {
    const result = authorizePatientEducationRelease({
      ...baseRequest,
      documents: [
        {
          ...baseRequest.documents[0],
          deliveryLanguage: "es-US",
        },
      ],
      qualityReports: [
        {
          ...qualityReport,
          reportId: "CAF-PE-QA-DEMO-SPANISH",
          locale: "es-US",
        },
      ],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "AUTH-LOCALIZATION-MISSING" }),
    ]));
  });

  it("blocks when a required institution field is absent", () => {
    const result = authorizePatientEducationRelease({
      ...baseRequest,
      requiredOverlayFieldIds: ["care_team_contact", "follow_up_route"],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: "AUTH-INSTITUTION-OVERLAY-FIELDS-MISSING",
        message: expect.stringContaining("follow_up_route"),
      }),
    ]));
  });
});
