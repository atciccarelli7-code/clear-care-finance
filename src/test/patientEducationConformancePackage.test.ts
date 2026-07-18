import { describe, expect, it } from "vitest";
import {
  buildPatientEducationConformancePackage,
  evaluatePatientEducationConformancePackage,
} from "@/lib/patientEducationConformancePackage";

export const governedPatientEducationCapabilityIds = [
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
] as const;

const scenarioTypeByCapability: Partial<Record<typeof governedPatientEducationCapabilityIds[number],
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
  "organization-isolation": "cross_organization_block",
  "evidence-freshness": "expired_or_stale_block",
  "authority-policy": "separation_of_duties_block",
  "privacy-boundary": "privacy_block",
  "incident-response": "incident_escalation",
  "distribution-control": "suspension_or_recall",
  "resilience-retention": "restore_failure",
  "schema-migration": "migration_failure",
  "governance-profile": "policy_drift_block",
  "private-authority-decision": "bundle_withheld",
};

const suffix = (capabilityId: string) => capabilityId.toUpperCase();

const capabilities = governedPatientEducationCapabilityIds.map((capabilityId) => ({
  capabilityId,
  implementationRef: `src/lib/patientEducation${suffix(capabilityId).replaceAll("-", "")}.ts`,
  testRef: `src/test/${capabilityId}.test.ts`,
  sourceClassification: "public_safe_contract" as const,
  positiveScenarioIds: [`CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-SUCCESS`],
  adversarialScenarioIds: [`CAF-PE-CONFORMANCE-SCENARIO-${suffix(capabilityId)}-ADVERSARIAL`],
  status: "implemented" as const,
}));

const scenarios = governedPatientEducationCapabilityIds.flatMap((capabilityId) => {
  const capabilitySuffix = suffix(capabilityId);
  return [
    {
      scenarioId: `CAF-PE-CONFORMANCE-SCENARIO-${capabilitySuffix}-SUCCESS`,
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
      scenarioId: `CAF-PE-CONFORMANCE-SCENARIO-${capabilitySuffix}-ADVERSARIAL`,
      capabilityId,
      scenarioType: scenarioTypeByCapability[capabilityId] ?? "validation_failure" as const,
      title: `${capabilityId} synthetic adversarial path`,
      fixtureRef: `fixture://synthetic/${capabilityId}/adversarial`,
      expectedDecision: "blocked",
      expectedFindingCodes: [`${capabilitySuffix}-SYNTHETIC-BLOCK`],
      executionStatus: "passed" as const,
      executionEvidenceRef: `test-evidence://synthetic/${capabilityId}/adversarial`,
      containsOnlySyntheticData: true as const,
      patientCareUseProhibited: true as const,
    },
  ];
});

const unsignedPackage = {
  schemaVersion: "1.0.0" as const,
  conformancePackageId: "CAF-PE-CONFORMANCE-PACKAGE-FOUNDATION",
  conformanceVersion: "1.0.0",
  syntheticPackageId: "CAF-PE-SYNTHETIC-FOUNDATION",
  syntheticOrganizationKey: "SYNTHETIC-HOSPITAL" as const,
  generatedAt: "2026-07-18T20:00:00.000Z",
  sourceCommitSha: "a".repeat(40),
  capabilities,
  scenarios,
  artifacts: [
    {
      artifactId: "CAF-PE-CONFORMANCE-ARTIFACT-PUBLIC-MANIFEST",
      path: "public/patient-education/demo/synthetic-governed-conformance-manifest.json",
      mimeType: "application/json",
      sha256: "b".repeat(64),
      byteLength: 4096,
      classification: "public_safe" as const,
      containsOnlySyntheticData: true as const,
      patientCareUseProhibited: true as const,
    },
    {
      artifactId: "CAF-PE-CONFORMANCE-ARTIFACT-PRIVATE-BUNDLE",
      path: "private/synthetic/conformance/foundation-bundle.json",
      mimeType: "application/json",
      sha256: "c".repeat(64),
      byteLength: 16384,
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
    "This conformance package uses only synthetic, nonclinical data and is prohibited from patient-care use.",
    "Passing conformance proves expected software behavior for the tested contracts; it does not establish clinical approval, legal compliance, accessibility conformance, hospital deployment, or patient outcomes.",
  ],
  containsClinicalPatientInstructions: false as const,
  containsRealOrganizationData: false as const,
  containsPatientData: false as const,
  containsReviewerIdentity: false as const,
  suitableForPatientCare: false as const,
};

describe("patientEducationConformancePackage", () => {
  it("requires every governed capability to pass success and adversarial scenarios", () => {
    const conformancePackage = buildPatientEducationConformancePackage(unsignedPackage);
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage,
      requiredCapabilityIds: [...governedPatientEducationCapabilityIds],
      evaluatedAt: "2026-07-18T21:00:00.000Z",
    });
    expect(result.decision).toBe("conformant");
    expect(result.capabilityCount).toBe(governedPatientEducationCapabilityIds.length);
    expect(result.passedScenarioCount).toBe(scenarios.length);
    expect(result.findings).toEqual([]);
  });

  it("blocks a package missing a required capability", () => {
    const conformancePackage = buildPatientEducationConformancePackage({
      ...unsignedPackage,
      capabilities: unsignedPackage.capabilities.slice(1),
      scenarios: unsignedPackage.scenarios.filter((scenario) => scenario.capabilityId !== governedPatientEducationCapabilityIds[0]),
    });
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage,
      requiredCapabilityIds: [...governedPatientEducationCapabilityIds],
    });
    expect(result.decision).toBe("blocked");
    expect(result.missingCapabilityIds).toContain(governedPatientEducationCapabilityIds[0]);
  });

  it("blocks any capability whose adversarial scenario has not passed", () => {
    const failedScenarioId = unsignedPackage.capabilities[0].adversarialScenarioIds[0];
    const conformancePackage = buildPatientEducationConformancePackage({
      ...unsignedPackage,
      scenarios: unsignedPackage.scenarios.map((scenario) => scenario.scenarioId === failedScenarioId
        ? { ...scenario, executionStatus: "failed" as const, executionEvidenceRef: undefined }
        : scenario),
    });
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage,
      requiredCapabilityIds: [...governedPatientEducationCapabilityIds],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CONFORMANCE-ADVERSARIAL-SCENARIO-NOT-PASSED" }),
      expect.objectContaining({ code: "CONFORMANCE-SCENARIO-NOT-PASSED" }),
    ]));
  });

  it("detects conformance package tampering", () => {
    const conformancePackage = buildPatientEducationConformancePackage(unsignedPackage);
    const result = evaluatePatientEducationConformancePackage({
      conformancePackage: {
        ...conformancePackage,
        conformanceVersion: "1.0.1",
      },
      requiredCapabilityIds: [...governedPatientEducationCapabilityIds],
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "CONFORMANCE-PACKAGE-HASH-MISMATCH" }),
    ]));
  });
});
