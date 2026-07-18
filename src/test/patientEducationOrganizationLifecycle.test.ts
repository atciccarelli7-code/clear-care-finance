import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationOrganizationReadiness,
  patientEducationOrganizationOffboardingSchema,
} from "@/lib/patientEducationOrganizationLifecycle";

const evaluatedAt = "2026-07-18T21:00:00.000Z";

const gateTypes = [
  "contract",
  "security_review",
  "privacy_review",
  "clinical_governance_review",
  "implementation_readiness",
  "support_readiness",
  "destination_validation",
  "data_residency",
  "incident_contacts",
  "recall_contacts",
] as const;

const profile = {
  schemaVersion: "1.0.0" as const,
  organizationKey: "DEMO-HOSPITAL",
  organizationIdentityRef: "organization://synthetic-demo-hospital",
  status: "active" as const,
  environment: "production" as const,
  dataResidencyRegions: ["US-EAST"],
  encryptionContextRef: "kms-context://synthetic-demo-hospital",
  contractRef: "contract://synthetic-demo-hospital",
  contractEffectiveAt: "2026-07-01T00:00:00.000Z",
  contractExpiresAt: "2027-07-01T00:00:00.000Z",
  supportContactRef: "contact://synthetic-support",
  incidentContactRef: "contact://synthetic-incident",
  recallContactRef: "contact://synthetic-recall",
  gates: gateTypes.map((gateType, index) => ({
    gateId: `CAF-PE-ORG-GATE-DEMO-${index + 1}`,
    gateType,
    status: "passed" as const,
    ownerRoleId: `${gateType}_owner`,
    evidenceRef: `evidence://organization-gate/${gateType}`,
    completedAt: "2026-07-10T00:00:00.000Z",
    expiresAt: "2027-07-10T00:00:00.000Z",
  })),
  destinations: [
    {
      destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
      organizationKey: "DEMO-HOSPITAL",
      environment: "production" as const,
      adapterType: "patient_portal_json" as const,
      endpointRef: "destination://synthetic-patient-portal",
      authenticationMethod: "oauth2_client_credentials" as const,
      credentialRef: "secret-manager://synthetic-patient-portal",
      status: "active" as const,
      patientBindingLocation: "organization_runtime" as const,
      cafPhiCapability: "none" as const,
      allowedLocales: ["en-US", "es-US"],
      maximumPayloadBytes: 1_000_000,
      timeoutMs: 30_000,
      retryPolicyRef: "retry-policy://portal-default",
      circuitBreakerPolicyRef: "circuit-breaker://portal-default",
      lastValidatedAt: "2026-07-15T00:00:00.000Z",
      validationExpiresAt: "2026-10-15T00:00:00.000Z",
      lastHealthStatus: "healthy" as const,
      lastHealthCheckedAt: "2026-07-18T20:55:00.000Z",
    },
  ],
  entitlements: [
    {
      entitlementId: "CAF-PE-ENTITLEMENT-DEMO-SAFETY",
      organizationKey: "DEMO-HOSPITAL",
      packageId: "CAF-PE-DEMO-SAFETY",
      minimumPackageVersion: "1.0.0",
      maximumPackageVersionExclusive: "2.0.0",
      allowedLocales: ["en-US", "es-US"],
      allowedAdapterTypes: ["patient_portal_json" as const],
      status: "active" as const,
      effectiveAt: "2026-07-01T00:00:00.000Z",
      expiresAt: "2027-07-01T00:00:00.000Z",
      contractRef: "contract://synthetic-demo-hospital",
      productScheduleRef: "product-schedule://synthetic-release",
      pilotOnly: false,
    },
  ],
  onboardingCompletedAt: "2026-07-15T00:00:00.000Z",
};

const readinessRequest = {
  schemaVersion: "1.0.0" as const,
  requestId: "CAF-PE-ORG-READINESS-DEMO",
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  packageId: "CAF-PE-DEMO-SAFETY",
  packageVersion: "1.0.0",
  locale: "en-US",
  adapterType: "patient_portal_json" as const,
  targetStatus: "released" as const,
  destinationId: "CAF-PE-DESTINATION-DEMO-PORTAL",
  evaluatedAt,
  profile,
};

describe("patientEducationOrganizationLifecycle", () => {
  it("marks an active, entitled, validated organization as ready", () => {
    const result = evaluatePatientEducationOrganizationReadiness(readinessRequest);
    expect(result.decision).toBe("ready");
    expect(result.entitlementId).toBe("CAF-PE-ENTITLEMENT-DEMO-SAFETY");
    expect(result.findings).toEqual([]);
  });

  it("blocks incomplete or expired onboarding gates and inactive contracts", () => {
    const result = evaluatePatientEducationOrganizationReadiness({
      ...readinessRequest,
      profile: {
        ...profile,
        contractExpiresAt: "2026-07-18T20:59:59.000Z",
        gates: profile.gates.map((gate, index) => index === 0
          ? { ...gate, status: "in_review" as const, evidenceRef: undefined, completedAt: undefined }
          : index === 1
            ? { ...gate, expiresAt: "2026-07-18T20:59:59.000Z" }
            : gate),
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ORGANIZATION-CONTRACT-INACTIVE" }),
      expect.objectContaining({ code: "ORGANIZATION-GATE-NOT-PASSED" }),
      expect.objectContaining({ code: "ORGANIZATION-GATE-EXPIRED" }),
    ]));
  });

  it("blocks unhealthy, suspended, or validation-expired destinations", () => {
    const result = evaluatePatientEducationOrganizationReadiness({
      ...readinessRequest,
      profile: {
        ...profile,
        destinations: profile.destinations.map((destination) => ({
          ...destination,
          status: "suspended" as const,
          lastHealthStatus: "unavailable" as const,
          validationExpiresAt: "2026-07-18T20:59:59.000Z",
        })),
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ORGANIZATION-DESTINATION-NOT-HEALTHY" }),
      expect.objectContaining({ code: "ORGANIZATION-DESTINATION-VALIDATION-EXPIRED" }),
    ]));
  });

  it("blocks delivery without an exact active entitlement", () => {
    const result = evaluatePatientEducationOrganizationReadiness({
      ...readinessRequest,
      packageVersion: "2.0.0",
      locale: "fr-US",
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ORGANIZATION-DESTINATION-APPLICABILITY-MISMATCH" }),
      expect.objectContaining({ code: "ORGANIZATION-ENTITLEMENT-MISSING" }),
    ]));
  });

  it("blocks production delivery under a pilot-only entitlement", () => {
    const result = evaluatePatientEducationOrganizationReadiness({
      ...readinessRequest,
      profile: {
        ...profile,
        entitlements: profile.entitlements.map((entitlement) => ({ ...entitlement, pilotOnly: true })),
      },
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ORGANIZATION-ENTITLEMENT-PILOT-ONLY" }),
    ]));
  });

  it("requires every offboarding action and evidence before completion", () => {
    const baseAction = (
      suffix: string,
      actionType:
        | "freeze_distribution"
        | "disable_destinations"
        | "terminate_entitlements"
        | "export_audit"
        | "preserve_governance_history"
        | "remove_access"
        | "destroy_permitted_configuration"
        | "confirm_completion",
    ) => ({
      actionId: `CAF-PE-OFFBOARDING-ACTION-${suffix}`,
      actionType,
      ownerRoleId: "organization_operations_owner",
      status: "completed" as const,
      dueAt: "2026-08-01T00:00:00.000Z",
      completedAt: "2026-07-31T00:00:00.000Z",
      evidenceRef: `evidence://offboarding/${suffix.toLowerCase()}`,
    });
    const actions = [
      baseAction("FREEZE", "freeze_distribution"),
      baseAction("DESTINATIONS", "disable_destinations"),
      baseAction("ENTITLEMENTS", "terminate_entitlements"),
      baseAction("AUDIT", "export_audit"),
      baseAction("HISTORY", "preserve_governance_history"),
      baseAction("ACCESS", "remove_access"),
      baseAction("CONFIG", "destroy_permitted_configuration"),
      baseAction("CONFIRM", "confirm_completion"),
    ];
    expect(patientEducationOrganizationOffboardingSchema.parse({
      schemaVersion: "1.0.0",
      offboardingId: "CAF-PE-OFFBOARDING-DEMO",
      organizationKey: "DEMO-HOSPITAL",
      initiatedAt: "2026-07-20T00:00:00.000Z",
      effectiveAt: "2026-08-01T00:00:00.000Z",
      reason: "Synthetic organization lifecycle conformance exercise.",
      ownerPrincipalId: "CAF-PE-PRINCIPAL-ORG-OPERATIONS",
      status: "completed",
      actions,
    }).status).toBe("completed");

    const invalid = patientEducationOrganizationOffboardingSchema.safeParse({
      schemaVersion: "1.0.0",
      offboardingId: "CAF-PE-OFFBOARDING-INCOMPLETE",
      organizationKey: "DEMO-HOSPITAL",
      initiatedAt: "2026-07-20T00:00:00.000Z",
      effectiveAt: "2026-08-01T00:00:00.000Z",
      reason: "Synthetic incomplete offboarding exercise.",
      ownerPrincipalId: "CAF-PE-PRINCIPAL-ORG-OPERATIONS",
      status: "completed",
      actions: actions.map((action, index) => index === 0
        ? { ...action, status: "in_progress", completedAt: undefined, evidenceRef: undefined }
        : action),
    });
    expect(invalid.success).toBe(false);
  });
});
