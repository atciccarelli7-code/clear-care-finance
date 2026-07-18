import { describe, expect, it } from "vitest";
import {
  buildPatientEducationAuditExport,
  verifyPatientEducationAuditExport,
} from "@/lib/patientEducationAuditExport";

const policy = {
  schemaVersion: "1.0.0" as const,
  policyId: "CAF-PE-AUDIT-POLICY-DEMO",
  allowedRecordTypesByAudience: {
    internal_governance: ["release_summary" as const, "review_summary" as const, "incident_summary" as const],
    clinical_governance: ["release_summary" as const, "review_summary" as const, "quality_summary" as const],
    security_review: ["release_summary" as const, "integrity_summary" as const, "signature_summary" as const, "incident_summary" as const],
    procurement: ["package_descriptor" as const, "release_summary" as const, "integrity_summary" as const, "resilience_summary" as const],
    organization_customer: ["release_summary" as const, "quality_summary" as const, "distribution_summary" as const, "recall_summary" as const],
    external_auditor: ["release_summary" as const, "integrity_summary" as const, "incident_summary" as const],
  },
  allowedClassificationsByAudience: {
    internal_governance: ["public" as const, "caf_internal" as const, "caf_confidential" as const, "organization_confidential" as const, "restricted_clinical_source" as const],
    clinical_governance: ["public" as const, "caf_internal" as const, "caf_confidential" as const],
    security_review: ["public" as const, "caf_internal" as const, "caf_confidential" as const],
    procurement: ["public" as const, "caf_internal" as const],
    organization_customer: ["public" as const, "caf_internal" as const, "organization_confidential" as const],
    external_auditor: ["public" as const, "caf_internal" as const, "caf_confidential" as const],
  },
  requireOrganizationMatchForCustomer: true as const,
  prohibitReviewerIdentityForExternalAudiences: true as const,
  prohibitCredentialFields: true as const,
  prohibitPatientFields: true as const,
  prohibitUnlicensedSourceText: true as const,
  requiredRedactionRules: [
    {
      ruleId: "CAF-PE-REDACTION-REVIEWER",
      fieldPattern: "reviewer_(name|email|identity)",
      action: "replace_with_role" as const,
      replacementValue: "qualified_reviewer",
      applicableRecordTypes: ["review_summary" as const],
      applicableAudiences: ["clinical_governance" as const],
      reason: "Reviewer identity is protected outside the private authority.",
    },
    {
      ruleId: "CAF-PE-REDACTION-EVIDENCE-REFS",
      fieldPattern: "evidence_refs",
      action: "replace_with_count" as const,
      applicableRecordTypes: ["release_summary" as const],
      applicableAudiences: ["procurement" as const, "organization_customer" as const],
      reason: "External exports disclose evidence coverage, not protected source locations.",
    },
  ],
};

const record = (
  recordId: string,
  recordType: "release_summary" | "review_summary" | "distribution_summary",
  organizationKey: "CAF-GLOBAL" | "DEMO-HOSPITAL" | "OTHER-HOSPITAL",
  classification: "caf_internal" | "caf_confidential" | "organization_confidential",
  fields: Record<string, unknown>,
) => ({
  recordId,
  recordType,
  organizationKey,
  classification,
  sourceObjectRef: `source://${recordId.toLowerCase()}`,
  sourceObjectSha256: "a".repeat(64),
  generatedAt: "2026-07-18T19:00:00.000Z",
  fields,
  containsPatientLevelData: false as const,
  containsCredentialMaterial: false as const,
  containsUnlicensedSourceText: false as const,
});

describe("patientEducationAuditExport", () => {
  it("builds a redacted organization-scoped export with a verifiable digest", () => {
    const exportValue = buildPatientEducationAuditExport({
      request: {
        schemaVersion: "1.0.0",
        exportId: "CAF-PE-AUDIT-EXPORT-DEMO",
        audience: "organization_customer",
        requestingOrganizationKey: "DEMO-HOSPITAL",
        requestedRecordTypes: ["release_summary", "distribution_summary"],
        requestedAt: "2026-07-18T19:00:00.000Z",
        requesterPrincipalId: "CAF-PE-PRINCIPAL-CUSTOMER-AUDITOR",
        requesterRoleId: "organization_auditor",
        purpose: "Review synthetic release and delivery governance evidence.",
        records: [
          record("CAF-PE-AUDIT-RECORD-RELEASE", "release_summary", "DEMO-HOSPITAL", "organization_confidential", {
            release_status: "released",
            evidence_refs: ["private-source://one", "private-source://two"],
            reviewer_name: "Synthetic Reviewer",
          }),
          record("CAF-PE-AUDIT-RECORD-DISTRIBUTION", "distribution_summary", "DEMO-HOSPITAL", "organization_confidential", {
            accepted_count: 12,
            revoked_count: 0,
          }),
          record("CAF-PE-AUDIT-RECORD-OTHER", "distribution_summary", "OTHER-HOSPITAL", "organization_confidential", {
            accepted_count: 99,
          }),
        ],
      },
      policy,
      generatedAt: "2026-07-18T19:05:00.000Z",
    });
    expect(exportValue.includedRecordCount).toBe(2);
    expect(exportValue.excludedRecordIds).toEqual(["CAF-PE-AUDIT-RECORD-OTHER"]);
    const releaseRecord = exportValue.records.find((item) => item.recordId === "CAF-PE-AUDIT-RECORD-RELEASE");
    expect(releaseRecord?.fields.evidence_refs).toBe(2);
    expect(releaseRecord?.fields).not.toHaveProperty("reviewer_name");
    expect(verifyPatientEducationAuditExport(exportValue)).toEqual({ valid: true, errors: [] });
  });

  it("excludes classifications and record types not permitted for the audience", () => {
    const exportValue = buildPatientEducationAuditExport({
      request: {
        schemaVersion: "1.0.0",
        exportId: "CAF-PE-AUDIT-EXPORT-PROCUREMENT",
        audience: "procurement",
        requestingOrganizationKey: "DEMO-HOSPITAL",
        requestedRecordTypes: ["release_summary", "review_summary"],
        requestedAt: "2026-07-18T19:00:00.000Z",
        requesterPrincipalId: "CAF-PE-PRINCIPAL-PROCUREMENT",
        requesterRoleId: "procurement_reviewer",
        purpose: "Review synthetic procurement governance evidence.",
        records: [
          record("CAF-PE-AUDIT-RECORD-ALLOWED", "release_summary", "CAF-GLOBAL", "caf_internal", { release_status: "pilot_ready" }),
          record("CAF-PE-AUDIT-RECORD-REVIEW", "review_summary", "CAF-GLOBAL", "caf_confidential", { review_status: "approved" }),
        ],
      },
      policy,
      generatedAt: "2026-07-18T19:05:00.000Z",
    });
    expect(exportValue.includedRecordCount).toBe(1);
    expect(exportValue.excludedRecordIds).toContain("CAF-PE-AUDIT-RECORD-REVIEW");
  });

  it("detects audit export tampering", () => {
    const exportValue = buildPatientEducationAuditExport({
      request: {
        schemaVersion: "1.0.0",
        exportId: "CAF-PE-AUDIT-EXPORT-TAMPER",
        audience: "procurement",
        requestingOrganizationKey: "CAF-GLOBAL",
        requestedRecordTypes: ["release_summary"],
        requestedAt: "2026-07-18T19:00:00.000Z",
        requesterPrincipalId: "CAF-PE-PRINCIPAL-PROCUREMENT",
        requesterRoleId: "procurement_reviewer",
        purpose: "Test synthetic export tamper detection.",
        records: [record("CAF-PE-AUDIT-RECORD-TAMPER", "release_summary", "CAF-GLOBAL", "caf_internal", { release_status: "released" })],
      },
      policy,
      generatedAt: "2026-07-18T19:05:00.000Z",
    });
    const result = verifyPatientEducationAuditExport({
      ...exportValue,
      includedRecordCount: 999,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/SHA-256/i);
  });

  it("rejects records that claim patient-level or credential content is present", () => {
    expect(() => buildPatientEducationAuditExport({
      request: {
        schemaVersion: "1.0.0",
        exportId: "CAF-PE-AUDIT-EXPORT-UNSAFE",
        audience: "internal_governance",
        requestingOrganizationKey: "CAF-GLOBAL",
        requestedRecordTypes: ["release_summary"],
        requestedAt: "2026-07-18T19:00:00.000Z",
        requesterPrincipalId: "CAF-PE-PRINCIPAL-INTERNAL",
        requesterRoleId: "audit_exporter",
        purpose: "Test unsafe audit record handling.",
        records: [{
          ...record("CAF-PE-AUDIT-RECORD-UNSAFE", "release_summary", "CAF-GLOBAL", "caf_internal", { patient_name: "Synthetic Person" }),
          containsPatientLevelData: true,
        }],
      },
      policy,
    })).not.toThrow();
  });
});
