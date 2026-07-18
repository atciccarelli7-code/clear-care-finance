import { describe, expect, it } from "vitest";
import {
  buildPatientEducationConformancePackage,
  evaluatePatientEducationConformancePackage,
} from "@/lib/patientEducationConformancePackage";

export const patientEducationAuthorityCapabilityIds = [
  "content-contract",
  "package-contract",
  "evidence-governance",
  "asset-compiler",
  "bundle-compiler",
  "distribution-compiler",
  "localization-contract",
  "institution-overlay-contract",
  "institution-overlay-compiler",
  "quality-contract",
  "quality-engine",
  "release-registry",
  "release-state-machine",
  "release-authorization",
  "integrity-manifest",
  "governance-ledger",
  "change-risk",
  "privacy-boundary",
  "governed-delivery-pipeline",
  "delivery-adapters",
  "distribution-control",
  "pilot-analytics",
  "authority-policy",
  "organization-isolation",
  "evidence-freshness",
  "exception-policy",
  "reproducibility-manifest",
  "signing-authority",
  "schema-migration",
  "dependency-graph",
  "operational-observability",
  "incident-response",
  "resilience-retention",
  "audit-export",
  "review-workflow",
  "governance-profile",
  "private-authority-decision",
  "conformance-package",
  "organization-lifecycle",
  "job-orchestration",
  "institutional-authority-decision",
] as const;

const scenarioTypeByCapability: Partial<Record<typeof patientEducationAuthorityCapabilityIds[number],
  "tamper_detection"
  | "cross_organization_block"
  | "expired_or_stale_block"
  | "separation_of_duties_block"
  | "privacy_block"
  | "incident_escalation"
  | "suspension_or_recall"
  | "restore_failure"
  | "migration_failure"
  | "policy_drift_block"
  | "bundle_withheld"
>> = {
  "integrity-manifest": "tamper_detection",
  "reproducibility-manifest": "tamper_detection",
  "signing-authority": "tamper_detection",
  "job-orchestration": "tamper_detection",
  "organization-isolation": "cross_organization_block",
  "organization-lifecycle": "expired_or_stale_block",
  "evidence-freshness": "expired_or_stale_block",
  "authority-policy": "separation_of_duties_block",
  "review-workflow": "separation_of_duties_block",
  "privacy-boundary": "privacy_block",
  "operational-observability": "privacy_block",
  "incident-response": "incident_escalation",
  "distribution-control": "suspension_or_recall",
  "resilience-retention": "restore_failure",
  "schema-migration": "migration_failure",
  "governance-profile": "policy_drift_block",
  "private-authority-decision": "bundle_withheld",
  "institutional-authority-decision": "bundle_withheld",
};

const suffix = (capabilityId: string) => capabilityId.toUpperCase();

const capabilities = patientEducationAuthorityCapabilityIds.map((capabilityId) => ({
  capabilityId,
  implementationRef: `public-safe-contract://${capabilityId}`,
  testRef: `test://patient-education/${capabilityId}`,
  sourceClassification: "public_safe_contract" as const,
  positiveScenarioIds: [`CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-SUCCESS`],
  adversarialScenarioIds: [`CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-ADVERSARIAL`],
  status: "implemented" as const,
}));

const scenarios = patientEducationAuthorityCapabilityIds.flatMap((capabilityId) => [
  {
    scenarioId: `CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-SUCCESS`,
    capabilityId,
    scenarioType: "success" as const,
    title: `${capabilityId} synthetic success path`,
    fixtureRef: `fixture://synthetic/${capabilityId}/success`,
    expectedDecision: "accepted",
    expectedFindingCodes: [],
    executionStatus: "passed" as const,
    executionEvidenceRef: `test-evidence://synthetic/${capabilityId}/success`,
    containsOnlySyntheticData: true as const,
    patientCareUseProhibited: true as const,
  },
  {
    scenarioId: `CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-ADVERSARIAL`,
    capabilityId,
    scenarioType: scenarioTypeByCapability[capabilityId] ?? "validation_failure" as const,
    title: `${capabilityId} synthetic adversarial path`,
    fixtureRef: `fixture://synthetic/${capabilityId}/adversarial`,
    expectedDecision: "blocked",
    expectedFindingCodes: [`${suffix(capabilityId)}-SYNTHETIC-BLOCK`],
    executionStatus: "passed" as const,
    executionEvidenceRef: `test-evidence://synthetic/${capabilityId}/adversarial`,
    containsOnlySyntheticData: true as const,
    patientCareUseProhibited: true as const,
  },
]);

const unsignedAuthorityPackage = {
  schemaVersion: "1.0.0" as const,
  conformancePackageId: "CAF-PE-CONFORMANCE-PACKAGE-AUTHORITY-COMPLETE",
  conformanceVersion: "2.0.0",
  syntheticPackageId: "CAF-PE-SYNTHETIC-AUTHORITY-COMPLETE",
  syntheticOrganizationKey: "SYNTHETIC-HOSPITAL" as const,
  generatedAt: "2026-07-18T22:00:00.000Z",
  sourceCommitSha: "a".repeat(40),
  capabilities,
  scenarios,
  artifacts: [
    {
      artifactId: "CAF-PE-CONFORMANCE-ARTIFACT-AUTHORITY-MANIFEST",
      path: "public/patient-education/demo/synthetic-authority-conformance-manifest.json",
      mimeType: "application/json",
      sha256: "b".repeat(64),
      byteLength: 8192,
      classification: "public_safe" as const,
      containsOnlySyntheticData: true as const,
      patientCareUseProhibited: true as const,
    },
    {
      artifactId: "CAF-PE-CONFORMANCE-ARTIFACT-AUTHORITY-PRIVATE",
      path: "private/synthetic/authority/conformance-bundle.json",
      mimeType: "application/json",
      sha256: "c".repeat(64),
      byteLength: 32768,
      classification: "private_synthetic" as const,
      containsOnlySyntheticData: true as const,
      patientCareUseProhibited: true as const,
    },
  ],
  requiredCriticalScenarioTypes: [
    "tamper_detection" as const,
    "cross_organization_block" as const,
    "expired_or_stale_block" as const,
    "separation_of_duties_block" as const,
    "privacy_block" as const,
    "incident_escalation" as const,
    "suspension_or_recall" as const,
    "restore_failure" as const,
    "migration_failure" as const,
    "policy_drift_block" as const,
    "bundle_withheld" as const,
  ],
  publicClaimsBoundary: [
    "This authority conformance package contains synthetic, nonclinical data only and is prohibited from patient-care use.",
    "Conformance demonstrates tested software behavior and does not establish clinical approval, compliance certification, deployment, or patient outcomes.",
  ],
  containsClinicalPatientInstructions: false as const,
  containsRealOrganizationData: false as const,
  containsPatientData: false as const,
  containsReviewerIdentity: false as const,
  suitableForPatientCare: false as const,
};

describe("patientEducationAuthorityConformance", () => {
  it("requires all 41 governed capabilities and two passed synthetic paths per capability", () => {
    const conformancePackage = buildPatientEducationConformancePackage(unsignedAuthorityPackage);
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage,
      requiredCapabilityIds: [...patientEducationAuthorityCapabilityIds],
      evaluatedAt: "2026-07-18T23:00:00.000Z",
    });
    expect(result.decision).toBe("conformant");
    expect(result.capabilityCount).toBe(41);
    expect(result.scenarioCount).toBe(82);
    expect(result.passedScenarioCount).toBe(82);
    expect(result.findings).toEqual([]);
  });

  it("blocks loss of organization lifecycle, job orchestration, or final dispatch authority", () => {
    for (const criticalCapability of ["organization-lifecycle", "job-orchestration", "institutional-authority-decision"] as const) {
      const conformancePackage = buildPatientEducationConformancePackage({
        ...unsignedAuthorityPackage,
        capabilities: unsignedAuthorityPackage.capabilities.filter((capability) => capability.capabilityId !== criticalCapability),
        scenarios: unsignedAuthorityPackage.scenarios.filter((scenario) => scenario.capabilityId !== criticalCapability),
      });
      const result = evaluatePatientEducationConformancePackage({
        conformancePackage,
        requiredCapabilityIds: [...patientEducationAuthorityCapabilityIds],
      });
      expect(result.decision).toBe("blocked");
      expect(result.missingCapabilityIds).toContain(criticalCapability);
    }
  });

  it("blocks a failed final bundle-withholding scenario", () => {
    const scenarioId = "CAF-PE-CONFORMANCE-SCENARIO-INSTITUTIONAL-AUTHORITY-DECISION-ADVERSARIAL";
    const conformancePackage = buildPatientEducationConformancePackage({
      ...unsignedAuthorityPackage,
      scenarios: unsignedAuthorityPackage.scenarios.map((scenario) => scenario.scenarioId === scenarioId
        ? { ...scenario, executionStatus: "failed" as const, executionEvidenceRef: undefined }
        : scenario),
    });
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage,
      requiredCapabilityIds: [...patientEducationAuthorityCapabilityIds],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CONFORMANCE-ADVERSARIAL-SCENARIO-NOT-PASSED" }),
      expect.objectContaining({ code: "CONFORMANCE-SCENARIO-NOT-PASSED" }),
    ]));
  });
});
