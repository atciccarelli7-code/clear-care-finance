import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationEvidenceReadiness,
  validatePatientEducationEvidenceDossier,
} from "@/lib/patientEducationEvidenceContract";

const completeDossier = {
  schemaVersion: "1.0.0",
  dossierId: "DOSSIER-DEMO-EVIDENCE-1",
  packageId: "CAF-PE-DEMO-EVIDENCE",
  packageVersion: "1.0.0",
  title: "Demonstration Evidence Dossier",
  status: "complete",
  dataClassification: "caf_confidential",
  scopeStatement: "A nonclinical fixture that validates claim-level evidence governance and release readiness.",
  sources: [
    {
      sourceId: "SRC-CONTROLLING-1",
      sourceType: "government_guidance",
      title: "Demonstration controlling source",
      publisher: "Demonstration authority",
      jurisdiction: "United States",
      publicationDate: "2026-01-01",
      lastVerifiedAt: "2026-07-18T12:00:00.000Z",
      status: "active",
      authorityTier: "controlling",
      locatorRef: "private-source://controlling-1",
      licenseBoundary: "Internal evidence mapping only; do not republish source content.",
    },
    {
      sourceId: "SRC-SUPPORTING-1",
      sourceType: "professional_guideline",
      title: "Demonstration supporting source",
      publisher: "Demonstration professional body",
      jurisdiction: "United States",
      publicationDate: "2026-02-01",
      lastVerifiedAt: "2026-07-18T12:00:00.000Z",
      status: "active",
      authorityTier: "authoritative",
      locatorRef: "private-source://supporting-1",
      licenseBoundary: "Citation and internal interpretation only.",
    },
  ],
  claims: [
    {
      claimId: "CLAIM-DEMO-SAFETY-1",
      packageId: "CAF-PE-DEMO-EVIDENCE",
      claimType: "warning",
      riskTier: "critical",
      internalClaim: "The approved institutional instruction must contain an explicit action when an emergency condition is described.",
      approvedPatientLanguage: "Follow the emergency action listed by your care team.",
      prohibitedOrMisleadingLanguage: ["A vague warning without an action"],
      rationale: "Safety-critical warnings must be actionable and locally approved.",
      applicability: {
        populations: ["Adults receiving the approved institutional guide"],
        exclusions: [],
        careSettings: ["Acute care"],
        medicationOrDeviceScope: [],
        jurisdictions: ["United States"],
      },
      evidenceLinks: [
        {
          sourceId: "SRC-CONTROLLING-1",
          relationship: "controlling",
          locator: "Demonstration section 1",
          interpretation: "Controls the safety-action requirement for this fixture.",
        },
        {
          sourceId: "SRC-SUPPORTING-1",
          relationship: "supports",
          locator: "Demonstration section 2",
          interpretation: "Supports explicit action-oriented patient communication.",
        },
      ],
      requiredReviewRoleIds: ["rn_clinical_editor", "specialty_reviewer"],
      reviewStatus: "approved",
      approvedVersion: "1.0.0",
      reviewedAt: "2026-07-18T12:00:00.000Z",
      expiresAt: "2099-07-18T12:00:00.000Z",
      unresolvedQuestions: [],
      updateTriggerIds: ["TRIGGER-SCHEDULED-1"],
    },
  ],
  decisions: [],
  updateTriggers: [
    {
      triggerId: "TRIGGER-SCHEDULED-1",
      triggerType: "scheduled_review",
      description: "Reassess the source set and approved patient language at the scheduled review date.",
      ownerRoleId: "evidence_owner",
      responseWindowHours: 720,
      affectedClaimIds: ["CLAIM-DEMO-SAFETY-1"],
      action: "review",
    },
  ],
  requiredReviewRoleIds: ["rn_clinical_editor", "specialty_reviewer", "evidence_owner"],
  lastReviewedAt: "2026-07-18T12:00:00.000Z",
  nextReviewAt: "2099-07-18T12:00:00.000Z",
  prohibitedPublicDistribution: true,
} as const;

describe("patient education evidence dossier contract", () => {
  it("accepts a complete claim-level evidence dossier and marks it ready", () => {
    const validation = validatePatientEducationEvidenceDossier(completeDossier);
    expect(validation.success).toBe(true);
    const readiness = evaluatePatientEducationEvidenceReadiness(completeDossier);
    expect(readiness.ready).toBe(true);
    expect(readiness.blockingReasons).toEqual([]);
  });

  it("rejects a critical claim without controlling evidence", () => {
    const value = {
      ...completeDossier,
      claims: completeDossier.claims.map((claim) => ({
        ...claim,
        evidenceLinks: claim.evidenceLinks.map((link) => ({ ...link, relationship: "supports" as const })),
      })),
    };
    const result = validatePatientEducationEvidenceDossier(value);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/requires a controlling evidence link/i);
  });

  it("rejects unknown and retracted source dependencies", () => {
    const unknownSource = {
      ...completeDossier,
      claims: completeDossier.claims.map((claim) => ({
        ...claim,
        evidenceLinks: [{ ...claim.evidenceLinks[0], sourceId: "SRC-MISSING-1" }],
      })),
    };
    const unknownResult = validatePatientEducationEvidenceDossier(unknownSource);
    expect(unknownResult.success).toBe(false);
    if (!unknownResult.success) expect(unknownResult.error.issues.map((issue) => issue.message).join(" ")).toMatch(/unknown source/i);

    const retracted = {
      ...completeDossier,
      sources: completeDossier.sources.map((source) => (
        source.sourceId === "SRC-CONTROLLING-1" ? { ...source, status: "retracted" as const } : source
      )),
    };
    const retractedResult = validatePatientEducationEvidenceDossier(retracted);
    expect(retractedResult.success).toBe(false);
    if (!retractedResult.success) expect(retractedResult.error.issues.map((issue) => issue.message).join(" ")).toMatch(/retracted source/i);
  });

  it("requires an approved decision when evidence contradicts a claim", () => {
    const contradicted = {
      ...completeDossier,
      claims: completeDossier.claims.map((claim) => ({
        ...claim,
        evidenceLinks: [
          ...claim.evidenceLinks,
          {
            sourceId: "SRC-SUPPORTING-1",
            relationship: "contradicts" as const,
            locator: "Demonstration conflicting section",
            interpretation: "Creates a conflict that requires a documented decision.",
          },
        ],
      })),
    };
    const blocked = validatePatientEducationEvidenceDossier(contradicted);
    expect(blocked.success).toBe(false);
    if (!blocked.success) expect(blocked.error.issues.map((issue) => issue.message).join(" ")).toMatch(/requires an approved evidence decision/i);

    const resolved = {
      ...contradicted,
      decisions: [
        {
          decisionId: "DECISION-DEMO-CONFLICT-1",
          claimIds: ["CLAIM-DEMO-SAFETY-1"],
          question: "How should the conflicting evidence be represented?",
          optionsConsidered: ["Block the claim", "Narrow the applicability and approve bounded language"],
          decision: "Narrow the applicability and retain the approved bounded language.",
          rationale: "The controlling source governs the defined population while the contradictory source applies outside the stated scope.",
          decisionStatus: "approved" as const,
          approvedByRoleIds: ["evidence_owner", "specialty_reviewer"],
          decidedAt: "2026-07-18T12:00:00.000Z",
        },
      ],
    };
    expect(validatePatientEducationEvidenceDossier(resolved).success).toBe(true);
  });

  it("blocks complete status when a claim is not approved or remains unresolved", () => {
    const unapproved = {
      ...completeDossier,
      claims: completeDossier.claims.map((claim) => ({
        ...claim,
        reviewStatus: "in_review" as const,
        approvedPatientLanguage: undefined,
        approvedVersion: undefined,
        reviewedAt: undefined,
      })),
    };
    const result = validatePatientEducationEvidenceDossier(unapproved);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.message).join(" ")).toMatch(/every claim to be approved/i);

    const unresolved = {
      ...completeDossier,
      claims: completeDossier.claims.map((claim) => ({ ...claim, unresolvedQuestions: ["A material question remains open."] })),
    };
    const unresolvedResult = validatePatientEducationEvidenceDossier(unresolved);
    expect(unresolvedResult.success).toBe(false);
    if (!unresolvedResult.success) expect(unresolvedResult.error.issues.map((issue) => issue.message).join(" ")).toMatch(/cannot retain unresolved questions/i);
  });

  it("marks valid but overdue evidence as not release-ready", () => {
    const overdue = {
      ...completeDossier,
      nextReviewAt: "2026-01-01T00:00:00.000Z",
      claims: completeDossier.claims.map((claim) => ({ ...claim, expiresAt: "2026-01-01T00:00:00.000Z" })),
    };
    expect(validatePatientEducationEvidenceDossier(overdue).success).toBe(true);
    const readiness = evaluatePatientEducationEvidenceReadiness(overdue);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockingReasons.join(" ")).toMatch(/approval is expired/i);
    expect(readiness.blockingReasons.join(" ")).toMatch(/review is overdue/i);
  });
});
