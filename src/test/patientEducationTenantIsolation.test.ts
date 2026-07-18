import { describe, expect, it } from "vitest";
import {
  evaluatePatientEducationTenantAccess,
  patientEducationTenantResourceSchema,
} from "@/lib/patientEducationTenantIsolation";

const resource = {
  schemaVersion: "1.0.0" as const,
  resourceId: "CAF-PE-RESOURCE-OVERLAY-001",
  resourceType: "institution_overlay" as const,
  organizationKey: "SYNTHETIC-HOSPITAL-A",
  packageId: "CAF-PE-DEMO-SAFETY",
  environment: "pilot" as const,
  dataClassification: "organization_confidential" as const,
  permittedOrganizationKeys: ["SYNTHETIC-HOSPITAL-A"],
  crossOrganizationSharing: "prohibited" as const,
  createdAt: "2026-07-18T12:00:00.000Z",
};

const request = {
  schemaVersion: "1.0.0" as const,
  requestId: "CAF-PE-ACCESS-001",
  actorId: "CAF-PE-ACTOR-IMPLEMENTATION-001",
  actorOrganizationKey: "SYNTHETIC-HOSPITAL-A",
  resourceId: resource.resourceId,
  requestedOperation: "write" as const,
  environment: "pilot" as const,
  requestedAt: "2026-07-18T13:00:00.000Z",
};

describe("patient education tenant isolation", () => {
  it("allows exact tenant, environment, and operation access", () => {
    const result = evaluatePatientEducationTenantAccess({
      resourceInput: resource,
      requestInput: request,
      actorAuthorizedOperations: ["read", "write"],
      actorAuthorizedEnvironments: ["pilot"],
    });
    expect(result.authorized).toBe(true);
  });

  it("blocks cross-organization reads even when the actor otherwise has read permission", () => {
    const result = evaluatePatientEducationTenantAccess({
      resourceInput: resource,
      requestInput: { ...request, actorOrganizationKey: "SYNTHETIC-HOSPITAL-B", requestedOperation: "read" },
      actorAuthorizedOperations: ["read"],
      actorAuthorizedEnvironments: ["pilot"],
    });
    expect(result.authorized).toBe(false);
    expect(result.findings).toEqual(expect.arrayContaining([
      "TENANT-ORGANIZATION-NOT-PERMITTED",
      "TENANT-CROSS-ORGANIZATION-SHARING-PROHIBITED",
    ]));
  });

  it("requires a contractual reference for explicitly shared resources", () => {
    const shared = {
      ...resource,
      permittedOrganizationKeys: ["SYNTHETIC-HOSPITAL-A", "SYNTHETIC-HOSPITAL-B"],
      crossOrganizationSharing: "explicit_contract_only" as const,
    };
    const result = evaluatePatientEducationTenantAccess({
      resourceInput: shared,
      requestInput: { ...request, actorOrganizationKey: "SYNTHETIC-HOSPITAL-B", requestedOperation: "read" },
      actorAuthorizedOperations: ["read"],
      actorAuthorizedEnvironments: ["pilot"],
    });
    expect(result.findings).toContain("TENANT-CONTRACTUAL-SHARE-REFERENCE-MISSING");
  });

  it("rejects invalid multi-tenant declarations when sharing is prohibited", () => {
    expect(patientEducationTenantResourceSchema.safeParse({
      ...resource,
      permittedOrganizationKeys: ["SYNTHETIC-HOSPITAL-A", "SYNTHETIC-HOSPITAL-B"],
    }).success).toBe(false);
  });

  it("blocks retired resources", () => {
    const result = evaluatePatientEducationTenantAccess({
      resourceInput: { ...resource, retiredAt: "2026-07-18T12:30:00.000Z" },
      requestInput: request,
      actorAuthorizedOperations: ["write"],
      actorAuthorizedEnvironments: ["pilot"],
    });
    expect(result.findings).toContain("TENANT-RESOURCE-RETIRED");
  });
});
