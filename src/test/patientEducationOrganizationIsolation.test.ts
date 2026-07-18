import { describe, expect, it } from "vitest";
import { evaluatePatientEducationOrganizationAccess } from "@/lib/patientEducationOrganizationIsolation";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-ISOLATION-POLICY-DEMO",
  globalReadRoleIds: ["global_reader"],
  globalWriteRoleIds: ["global_author"],
  restrictedClinicalSourceRoleIds: ["restricted_source_reviewer"],
  auditExportRoleIds: ["audit_exporter"],
  immutableMutationRoleIds: ["revocation_authority"],
  prohibitProductionAccessFromNonProduction: true as const,
  prohibitCrossOrganizationAccess: true as const,
};

const organizationResource = {
  schemaVersion: "1.0.0" as const,
  resourceId: "CAF-PE-RESOURCE-DEMO-OVERLAY",
  resourceType: "institution_overlay" as const,
  organizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  dataClassification: "organization_confidential" as const,
  immutable: false,
};

const organizationContext = {
  schemaVersion: "1.0.0" as const,
  requestId: "CAF-PE-ACCESS-DEMO",
  principalId: "CAF-PE-PRINCIPAL-DEMO-HOSPITAL",
  principalOrganizationKey: "DEMO-HOSPITAL",
  environment: "production" as const,
  roleIds: ["organization_editor"],
  action: "read" as const,
  purpose: "review" as const,
  requestedAt: "2026-07-18T16:00:00.000Z",
};

describe("patientEducationOrganizationIsolation", () => {
  it("allows an exact organization and environment match", () => {
    const result = evaluatePatientEducationOrganizationAccess({
      resource: organizationResource,
      context: organizationContext,
      policy,
    });
    expect(result.decision).toBe("allowed");
    expect(result.findings).toEqual([]);
  });

  it("blocks cross-organization access even from a CAF-global identity", () => {
    const result = evaluatePatientEducationOrganizationAccess({
      resource: organizationResource,
      context: {
        ...organizationContext,
        principalId: "CAF-PE-PRINCIPAL-GLOBAL",
        principalOrganizationKey: "CAF-GLOBAL",
        roleIds: ["global_reader"],
      },
      policy,
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ISOLATION-CROSS-ORGANIZATION-ACCESS" }),
    ]));
  });

  it("blocks preview runtimes from production resources", () => {
    const result = evaluatePatientEducationOrganizationAccess({
      resource: organizationResource,
      context: { ...organizationContext, environment: "preview" },
      policy,
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ISOLATION-ENVIRONMENT-MISMATCH" }),
      expect.objectContaining({ code: "ISOLATION-PRODUCTION-CROSSING" }),
    ]));
  });

  it("requires explicit global authority for global resources", () => {
    const result = evaluatePatientEducationOrganizationAccess({
      resource: {
        ...organizationResource,
        resourceId: "CAF-PE-RESOURCE-GLOBAL-PACKAGE",
        resourceType: "global_package",
        organizationKey: "CAF-GLOBAL",
        dataClassification: "caf_confidential",
      },
      context: {
        ...organizationContext,
        principalOrganizationKey: "CAF-GLOBAL",
        roleIds: ["organization_editor"],
      },
      policy,
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ISOLATION-GLOBAL-AUTHORITY-REQUIRED" }),
    ]));
  });

  it("prohibits deletion of governance history", () => {
    const result = evaluatePatientEducationOrganizationAccess({
      resource: {
        ...organizationResource,
        resourceId: "CAF-PE-RESOURCE-DISTRIBUTION-ONE",
        resourceType: "distribution_record",
        immutable: true,
      },
      context: {
        ...organizationContext,
        action: "delete",
        roleIds: ["revocation_authority"],
      },
      policy,
    });
    expect(result.decision).toBe("blocked");
    expect(result.findings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "ISOLATION-GOVERNANCE-DELETION-PROHIBITED" }),
    ]));
  });
});
