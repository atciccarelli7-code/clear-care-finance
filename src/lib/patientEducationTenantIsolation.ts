import { z } from "zod";

const organizationKeySchema = z.string().regex(/^[A-Z0-9-]+$/);
const packageIdSchema = z.string().regex(/^CAF-PE-[A-Z0-9-]+$/);

export const patientEducationTenantResourceSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  resourceId: z.string().regex(/^CAF-PE-RESOURCE-[A-Z0-9-]+$/),
  resourceType: z.enum([
    "package",
    "review_workflow",
    "institution_overlay",
    "release_record",
    "delivery_destination",
    "distribution_record",
    "pilot_analytics",
    "audit_export",
  ]),
  organizationKey: organizationKeySchema,
  packageId: packageIdSchema.optional(),
  environment: z.enum(["development", "test", "pilot", "production"]),
  dataClassification: z.enum(["public", "caf_confidential", "organization_confidential", "restricted"]),
  permittedOrganizationKeys: z.array(organizationKeySchema),
  crossOrganizationSharing: z.enum(["prohibited", "explicit_contract_only"]),
  createdAt: z.string().datetime(),
  retiredAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (!value.permittedOrganizationKeys.includes(value.organizationKey)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Tenant resource owner must be included in permittedOrganizationKeys." });
  }
  if (value.crossOrganizationSharing === "prohibited" && value.permittedOrganizationKeys.length !== 1) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Resources with prohibited cross-organization sharing may have only one permitted organization." });
  }
  if (value.retiredAt && new Date(value.retiredAt) <= new Date(value.createdAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Resource retirement must occur after creation." });
  }
});

export const patientEducationTenantAccessRequestSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  requestId: z.string().regex(/^CAF-PE-ACCESS-[A-Z0-9-]+$/),
  actorId: z.string().regex(/^CAF-PE-ACTOR-[A-Z0-9-]+$/),
  actorOrganizationKey: organizationKeySchema,
  resourceId: z.string().regex(/^CAF-PE-RESOURCE-[A-Z0-9-]+$/),
  requestedOperation: z.enum(["read", "write", "review", "authorize", "deliver", "revoke", "export"]),
  environment: z.enum(["development", "test", "pilot", "production"]),
  requestedAt: z.string().datetime(),
  contractualShareRef: z.string().trim().min(3).max(500).optional(),
});

export type PatientEducationTenantResource = z.infer<typeof patientEducationTenantResourceSchema>;
export type PatientEducationTenantAccessRequest = z.infer<typeof patientEducationTenantAccessRequestSchema>;

export const evaluatePatientEducationTenantAccess = ({
  resourceInput,
  requestInput,
  actorAuthorizedOperations,
  actorAuthorizedEnvironments,
}: {
  resourceInput: unknown;
  requestInput: unknown;
  actorAuthorizedOperations: PatientEducationTenantAccessRequest["requestedOperation"][];
  actorAuthorizedEnvironments: PatientEducationTenantAccessRequest["environment"][];
}) => {
  const resource = patientEducationTenantResourceSchema.parse(resourceInput);
  const request = patientEducationTenantAccessRequestSchema.parse(requestInput);
  const findings: string[] = [];
  if (request.resourceId !== resource.resourceId) findings.push("TENANT-RESOURCE-ID-MISMATCH");
  if (request.environment !== resource.environment) findings.push("TENANT-ENVIRONMENT-MISMATCH");
  if (!actorAuthorizedOperations.includes(request.requestedOperation)) findings.push("TENANT-OPERATION-NOT-AUTHORIZED");
  if (!actorAuthorizedEnvironments.includes(request.environment)) findings.push("TENANT-ENVIRONMENT-NOT-AUTHORIZED");
  if (!resource.permittedOrganizationKeys.includes(request.actorOrganizationKey)) findings.push("TENANT-ORGANIZATION-NOT-PERMITTED");
  const crossOrganization = request.actorOrganizationKey !== resource.organizationKey;
  if (crossOrganization && resource.crossOrganizationSharing === "prohibited") findings.push("TENANT-CROSS-ORGANIZATION-SHARING-PROHIBITED");
  if (crossOrganization && resource.crossOrganizationSharing === "explicit_contract_only" && !request.contractualShareRef) findings.push("TENANT-CONTRACTUAL-SHARE-REFERENCE-MISSING");
  if (resource.retiredAt && new Date(request.requestedAt) >= new Date(resource.retiredAt)) findings.push("TENANT-RESOURCE-RETIRED");
  return { authorized: findings.length === 0, resource, request, findings };
};

export const assertPatientEducationTenantIsolation = (result: ReturnType<typeof evaluatePatientEducationTenantAccess>) => {
  if (!result.authorized) throw new Error(`Patient education tenant isolation failed: ${result.findings.join(", ")}`);
  return result;
};
