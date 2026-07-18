import { describe, expect, it } from "vitest";
import { evaluatePatientEducationEvidenceFreshness } from "@/lib/patientEducationEvidenceFreshnessEngine";

const evaluatedAt = "2026-07-18T16:00:00.000Z";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-EVIDENCE-POLICY-DEMO",
  maximumVerificationAgeDays: {
    controlling: 365,
    authoritative: 730,
    supporting: 730,
    contextual: 1095,
  },
  reviewWarningWindowDays: 30,
  claimExpirationWarningDays: 30,
  highRiskExpiredClaimAction: "suspend" as const,
  controllingSourceUnavailableAction: "suspend" as const,
};

const dossier = {
  schemaVersion: "1.0.0" as const,
  dossierId: "DOSSIER-DEMO-FRESHNESS-1",
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  title: "Synthetic evidence freshness dossier",
  status: "complete" as const,
  sources: [
    {
      sourceId: "SRC-DEMO-CONTROLLING",
      sourceType: "government_guidance" as const,
      title: "Synthetic controlling source",
      publisher: "Synthetic authority",
      jurisdiction: "United States",
      publicationDate: "2026-01-01",
      lastVerifiedAt: "2026-07-01T00:00:00.000Z",
      status: "active" as const,
      authorityTier: "controlling" as const,
      locatorRef: "private-source://demo-controlling",
      licenseBoundary: "Internal synthetic fixture only.",
    },
  ],
  claims: [
    {
      claimId: "CLAIM-DEMO-FRESHNESS",
      packageId: "CAF-PE-DEMO-SAFETY",
      claimType: "warning" as const,
      riskTier: "critical" as const,
      internalClaim: "Synthetic safety claim.",
      approvedPatientLanguage: "Use the organization-approved safety action.",
      prohibitedOrMisleadingLanguage: [],
      rationale: "Synthetic validation only.",
      applicability: {
        populations: ["Synthetic adults"],
        exclusions: [],
        careSettings: ["Synthetic care setting"],
        medicationOrDeviceScope: [],
        jurisdictions: ["United States"],
      },
      evidenceLinks: [
        {
          sourceId: "SRC-DEMO-CONTROLLING",
          relationship: "controlling" as const,
          locator: "Synthetic section",
          interpretation: "Controls the synthetic safety claim.",
        },
      ],
      requiredReviewRoleIds: ["clinical_reviewer"],
      reviewStatus: "approved" as const,
      approvedVersion: "1.0.0",
      reviewedAt: "2026-07-01T00:00:00.000Z",
      expiresAt: "2027-07-01T00:00:00.000Z",
      unresolvedQuestions: [],
      updateTriggerIds: ["TRIGGER-DEMO-SAFETY"],
    },
  ],
  updateTriggers: [
    {
      triggerId: "TRIGGER-DEMO-SAFETY",
      triggerType: "safety_signal" as const,
      description: "Synthetic safety signal requiring recall assessment.",
      ownerRoleId: "clinical_safety_owner",
      responseWindowHours: 4,
      affectedClaimIds: ["CLAIM-DEMO-FRESHNESS"],
      action: "recall" as const,
    },
  ],
  lastReviewedAt: "2026-07-01T00:00:00.000Z",
  nextReviewAt: "2027-07-01T00:00:00.000Z",
};

describe("patientEducationEvidenceFreshnessEngine", () => {
  it("marks a current synthetic dossier as current", () => {
    const result = evaluatePatientEducationEvidenceFreshness({ dossier, policy, evaluatedAt });
    expect(result.state).toBe("current");
    expect(result.findings).toEqual([]);
  });

  it("requires recall assessment when a controlling source for a critical claim is retracted", () => {
    const result = evaluatePatientEducationEvidenceFreshness({
      dossier: {
        ...dossier,
        sources: dossier.sources.map((source) => ({ ...source, status: "retracted" as const })),
      },
      policy,
      evaluatedAt,
    });
    expect(result.state).toBe("recall_assessment_required");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: "EVIDENCE-SOURCE-RETRACTED",
        requiredAction: "recall_assessment",
      }),
    ]));
    expect(result.affectedClaimIds).toContain("CLAIM-DEMO-FRESHNESS");
  });

  it("requires suspension when a critical claim approval expires", () => {
    const result = evaluatePatientEducationEvidenceFreshness({
      dossier: {
        ...dossier,
        claims: dossier.claims.map((claim) => ({ ...claim, expiresAt: "2026-07-18T15:00:00.000Z" })),
      },
      policy,
      evaluatedAt,
    });
    expect(result.state).toBe("suspend_required");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "EVIDENCE-CLAIM-APPROVAL-EXPIRED" }),
    ]));
  });

  it("escalates an overdue recall trigger", () => {
    const result = evaluatePatientEducationEvidenceFreshness({
      dossier,
      policy,
      evaluatedAt,
      observedTriggers: [
        {
          observationId: "CAF-PE-TRIGGER-OBS-DEMO",
          triggerId: "TRIGGER-DEMO-SAFETY",
          observedAt: "2026-07-18T10:00:00.000Z",
          status: "open",
        },
      ],
    });
    expect(result.state).toBe("recall_assessment_required");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({
        code: "EVIDENCE-TRIGGER-RESPONSE-OVERDUE",
        triggerId: "TRIGGER-DEMO-SAFETY",
      }),
    ]));
  });
});
