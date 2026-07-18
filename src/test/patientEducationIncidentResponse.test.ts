import { describe, expect, it } from "vitest";
import { evaluatePatientEducationIncident } from "@/lib/patientEducationIncidentResponse";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-INCIDENT-POLICY-DEMO",
  containmentTargetMinutes: {
    sev4: 1440,
    sev3: 480,
    sev2: 120,
    sev1: 30,
  },
  distributionFreezeRequiredFor: [
    "clinical_content_safety" as const,
    "evidence_retraction" as const,
    "integrity_failure" as const,
    "signing_key_compromise" as const,
    "cross_organization_exposure" as const,
    "incorrect_distribution" as const,
    "recall_execution_failure" as const,
  ],
  clinicalSafetyLeadRequiredFor: ["clinical_content_safety" as const, "evidence_retraction" as const],
  privacyLeadRequiredFor: ["unauthorized_access" as const, "cross_organization_exposure" as const],
  securityLeadRequiredFor: ["integrity_failure" as const, "signing_key_compromise" as const, "unauthorized_access" as const],
  mandatoryActionTypesByIncident: {
    signing_key_compromise: [
      "freeze_new_distribution" as const,
      "revoke_signing_key" as const,
      "preserve_evidence" as const,
      "notify_security_owner" as const,
      "reverify_integrity" as const,
    ],
    clinical_content_safety: [
      "freeze_new_distribution" as const,
      "suspend_package" as const,
      "initiate_recall_assessment" as const,
      "notify_clinical_safety_owner" as const,
    ],
  },
  closureRoleIdsBySeverity: {
    sev4: ["incident_commander"],
    sev3: ["incident_commander"],
    sev2: ["incident_commander", "accountable_owner"],
    sev1: ["incident_commander", "executive_accountable_owner"],
  },
  minimumMonitoringHoursAfterRecovery: {
    sev4: 1,
    sev3: 4,
    sev2: 24,
    sev1: 48,
  },
};

const completedAction = (
  suffix: string,
  actionType:
    | "freeze_new_distribution"
    | "revoke_signing_key"
    | "preserve_evidence"
    | "notify_security_owner"
    | "reverify_integrity",
) => ({
  actionId: `CAF-PE-INCIDENT-ACTION-${suffix}`,
  actionType,
  ownerRoleId: "security_owner",
  status: "completed" as const,
  dueAt: "2026-07-18T18:00:00.000Z",
  completedAt: "2026-07-18T17:30:00.000Z",
  evidenceRefs: [`evidence://${suffix.toLowerCase()}`],
});

const baseIncident = {
  schemaVersion: "1.0.0" as const,
  incidentId: "CAF-PE-INCIDENT-DEMO",
  incidentType: "signing_key_compromise" as const,
  severity: "sev1" as const,
  title: "Synthetic signing-key compromise",
  summary: "A synthetic signing key was marked compromised during a controlled incident exercise.",
  detectedAt: "2026-07-18T17:00:00.000Z",
  declaredAt: "2026-07-18T17:05:00.000Z",
  status: "monitoring" as const,
  environment: "production" as const,
  commanderPrincipalId: "CAF-PE-PRINCIPAL-COMMANDER",
  commanderRoleId: "incident_commander",
  securityLeadRoleId: "security_owner",
  impact: {
    packageId: "CAF-PE-DEMO-SAFETY",
    packageVersion: "1.0.0",
    organizationKeys: ["DEMO-HOSPITAL"],
    localeIds: ["en-US"],
    artifactSha256Values: ["a".repeat(64)],
    distributionIds: ["CAF-PE-DIST-DEMO"],
    signingKeyIds: ["CAF-PE-KEY-RELEASE-ONE"],
    sourceIds: [],
    claimIds: [],
    possiblePatientSafetyImpact: false,
    possiblePrivacyImpact: false,
    possibleIntegrityImpact: true,
  },
  distributionFrozenAt: "2026-07-18T17:10:00.000Z",
  containmentAt: "2026-07-18T17:20:00.000Z",
  recoveryAt: "2026-07-18T18:00:00.000Z",
  actions: [
    completedAction("FREEZE", "freeze_new_distribution"),
    completedAction("REVOKE", "revoke_signing_key"),
    completedAction("PRESERVE", "preserve_evidence"),
    completedAction("NOTIFY", "notify_security_owner"),
    completedAction("VERIFY", "reverify_integrity"),
  ],
  timelineRefs: ["timeline://incident-demo"],
  correctiveActionRefs: [],
  closureApprovals: [],
};

describe("patientEducationIncidentResponse", () => {
  it("accepts a contained incident with every mandatory action completed", () => {
    const result = evaluatePatientEducationIncident({
      incident: baseIncident,
      policy,
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    });
    expect(result.state).toBe("compliant");
    expect(result.findings).toEqual([]);
  });

  it("requires distribution freeze and all mandatory actions", () => {
    const result = evaluatePatientEducationIncident({
      incident: {
        ...baseIncident,
        status: "investigating" as const,
        distributionFrozenAt: undefined,
        containmentAt: undefined,
        recoveryAt: undefined,
        actions: [completedAction("PRESERVE", "preserve_evidence")],
      },
      policy,
      evaluatedAt: "2026-07-18T17:20:00.000Z",
    });
    expect(result.state).toBe("attention_required");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INCIDENT-DISTRIBUTION-FREEZE-MISSING" }),
      expect.objectContaining({ code: "INCIDENT-MANDATORY-ACTIONS-MISSING" }),
    ]));
  });

  it("escalates overdue containment and overdue actions", () => {
    const result = evaluatePatientEducationIncident({
      incident: {
        ...baseIncident,
        status: "investigating" as const,
        containmentAt: undefined,
        recoveryAt: undefined,
        actions: baseIncident.actions.map((action, index) => index === 0
          ? {
            ...action,
            status: "in_progress" as const,
            completedAt: undefined,
            evidenceRefs: [],
            dueAt: "2026-07-18T17:15:00.000Z",
          }
          : action),
      },
      policy,
      evaluatedAt: "2026-07-18T18:00:00.000Z",
    });
    expect(result.state).toBe("containment_overdue");
    expect(result.incidentEscalationRequired).toBe(true);
    expect(result.overdueActionIds).toContain("CAF-PE-INCIDENT-ACTION-FREEZE");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INCIDENT-CONTAINMENT-OVERDUE" }),
      expect.objectContaining({ code: "INCIDENT-ACTION-OVERDUE" }),
    ]));
  });

  it("blocks closure before monitoring and independent approvals are complete", () => {
    const result = evaluatePatientEducationIncident({
      incident: {
        ...baseIncident,
        status: "closed" as const,
        rootCauseCategory: "cryptographic_control" as const,
        rootCauseSummary: "Synthetic signing key was deliberately revoked during the conformance exercise.",
        correctiveActionRefs: ["corrective-action://rotate-synthetic-keys"],
        closedAt: "2026-07-18T20:00:00.000Z",
        closureApprovals: [
          {
            approvalId: "CAF-PE-INCIDENT-CLOSURE-COMMANDER",
            principalId: "CAF-PE-PRINCIPAL-COMMANDER",
            roleId: "incident_commander",
            approvedAt: "2026-07-18T20:00:00.000Z",
            rationale: "Synthetic exercise actions are complete.",
          },
        ],
      },
      policy,
      evaluatedAt: "2026-07-18T20:00:00.000Z",
    });
    expect(result.state).toBe("closure_blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "INCIDENT-CLOSURE-APPROVALS-MISSING" }),
      expect.objectContaining({ code: "INCIDENT-MONITORING-PERIOD-INCOMPLETE" }),
    ]));
  });
});
