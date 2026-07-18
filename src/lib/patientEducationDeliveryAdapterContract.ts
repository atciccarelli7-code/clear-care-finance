import { z } from "zod";
import type { PatientEducationBundleArtifact } from "@/lib/patientEducationBundleCompiler";
import type { PatientEducationIntegrityManifest } from "@/lib/patientEducationIntegrityManifest";
import type { PatientEducationReleaseAuthorizationResult } from "@/lib/patientEducationReleaseAuthorization";

const sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);
const semverSchema = z.string().regex(/^\d+\.\d+\.\d+$/);

export const patientEducationDeliveryDestinationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("avs_text"),
    encoding: z.literal("utf-8"),
    insertionPoint: z.enum(["patient_instructions", "discharge_instructions", "education_section"]),
    maximumCharacters: z.number().int().positive().max(100000),
  }),
  z.object({
    type: z.literal("patient_portal"),
    payloadSchema: z.literal("caf.patient-education.portal.v1"),
    displayMode: z.enum(["article", "task_list", "discharge_resource"]),
  }),
  z.object({
    type: z.literal("print_service"),
    media: z.enum(["letter", "a4"]),
    duplex: z.boolean(),
    accessibleOutputRequired: z.literal(true),
  }),
  z.object({
    type: z.literal("content_management_system"),
    payloadSchema: z.literal("caf.patient-education.cms.v1"),
    publishingMode: z.enum(["staged", "approved_only"]),
  }),
  z.object({
    type: z.literal("ehr_document_reference"),
    interoperabilityProfile: z.enum(["fhir_r4_document_reference", "vendor_defined_document_reference"]),
    patientBinding: z.literal("organization_runtime_only"),
    cafReceivesPatientIdentifier: z.literal(false),
  }),
]);

export const patientEducationDeliveryEnvelopeSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  envelopeId: z.string().regex(/^CAF-PE-DELIVERY-[A-Z0-9-]+$/),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: semverSchema,
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  documentVersion: semverSchema,
  assetId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  artifact: z.object({
    path: z.string().trim().min(1),
    target: z.enum(["responsive_html", "print_html", "structured_text", "avs_text", "patient_portal_json"]),
    mimeType: z.string().trim().min(1),
    byteLength: z.number().int().nonnegative(),
    sha256: sha256Schema,
  }),
  organizationKey: z.string().regex(/^[A-Z0-9-]+$/),
  authorizationId: z.string().regex(/^CAF-PE-AUTH-[A-Z0-9-]+$/),
  integrityManifestId: z.string().regex(/^CAF-PE-INTEGRITY-[A-Z0-9-]+$/),
  overlayId: z.string().regex(/^CAF-PE-OVERLAY-[A-Z0-9-]+$/).optional(),
  localizationId: z.string().regex(/^CAF-PE-LOC-[A-Z0-9-]+$/).optional(),
  destination: patientEducationDeliveryDestinationSchema,
  privacyBoundary: z.object({
    containsPatientIdentifiers: z.literal(false),
    containsEncounterIdentifiers: z.literal(false),
    cafPersistsPatientContext: z.literal(false),
    patientBinding: z.enum(["none", "organization_runtime_only"]),
  }),
  generatedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  status: z.enum(["prepared", "revoked"]),
}).superRefine((value, context) => {
  if (value.expiresAt && value.expiresAt <= value.generatedAt) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Delivery envelope expiration must occur after generation." });
  }
  if (value.destination.type === "avs_text" && value.artifact.target !== "avs_text") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "AVS delivery requires an avs_text artifact." });
  }
  if (value.destination.type === "patient_portal" && value.artifact.target !== "patient_portal_json") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Patient portal delivery requires a patient_portal_json artifact." });
  }
  if (value.destination.type === "print_service" && value.artifact.target !== "print_html") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Print-service delivery requires a print_html artifact before accessible PDF production." });
  }
  if (value.destination.type === "ehr_document_reference" && value.privacyBoundary.patientBinding !== "organization_runtime_only") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "EHR document-reference delivery requires organization-runtime-only patient binding." });
  }
});

export const patientEducationDeliveryReceiptSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  receiptId: z.string().regex(/^CAF-PE-RECEIPT-[A-Z0-9-]+$/),
  envelopeId: z.string().regex(/^CAF-PE-DELIVERY-[A-Z0-9-]+$/),
  authorizationId: z.string().regex(/^CAF-PE-AUTH-[A-Z0-9-]+$/),
  artifactSha256: sha256Schema,
  destinationType: z.enum([
    "avs_text",
    "patient_portal",
    "print_service",
    "content_management_system",
    "ehr_document_reference",
  ]),
  status: z.enum(["accepted", "rejected", "revoked"]),
  occurredAt: z.string().datetime(),
  reasonCode: z.enum([
    "accepted",
    "authorization_invalid",
    "artifact_hash_mismatch",
    "unsupported_format",
    "destination_unavailable",
    "privacy_boundary_failed",
    "release_suspended",
    "release_recalled",
    "superseded_version",
  ]),
  destinationReceiptRef: z.string().trim().min(2).max(500).optional(),
}).superRefine((value, context) => {
  if (value.status === "accepted" && value.reasonCode !== "accepted") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Accepted delivery receipts require the accepted reason code." });
  }
  if (value.status !== "accepted" && value.reasonCode === "accepted") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Rejected or revoked receipts require a non-accepted reason code." });
  }
});

export type PatientEducationDeliveryEnvelope = z.infer<typeof patientEducationDeliveryEnvelopeSchema>;
export type PatientEducationDeliveryReceipt = z.infer<typeof patientEducationDeliveryReceiptSchema>;

export const createPatientEducationDeliveryEnvelope = ({
  envelopeId,
  artifact,
  integrityManifest,
  authorization,
  organizationKey,
  locale,
  destination,
  generatedAt,
  expiresAt,
  overlayId,
  localizationId,
}: {
  envelopeId: string;
  artifact: PatientEducationBundleArtifact;
  integrityManifest: PatientEducationIntegrityManifest;
  authorization: PatientEducationReleaseAuthorizationResult;
  organizationKey: string;
  locale: string;
  destination: z.infer<typeof patientEducationDeliveryDestinationSchema>;
  generatedAt: string;
  expiresAt?: string;
  overlayId?: string;
  localizationId?: string;
}): PatientEducationDeliveryEnvelope => {
  if (authorization.decision !== "authorized") {
    throw new Error("Delivery envelopes require an authorized release decision.");
  }
  if (authorization.packageId !== integrityManifest.packageId || authorization.packageVersion !== integrityManifest.packageVersion) {
    throw new Error("Authorization and integrity manifest package versions do not match.");
  }
  if (authorization.releaseRecordHash !== integrityManifest.canonicalBundleSha256) {
    throw new Error("Authorization is not bound to the supplied integrity manifest.");
  }
  if (integrityManifest.mode !== "institutional_delivery") {
    throw new Error("Delivery envelopes require an institutional-delivery integrity manifest.");
  }
  const integrityArtifact = integrityManifest.artifacts.find((candidate) => candidate.path === artifact.path);
  if (!integrityArtifact) throw new Error(`Artifact path is absent from the integrity manifest: ${artifact.path}.`);
  if (
    integrityArtifact.assetId !== artifact.assetId
    || integrityArtifact.documentId !== artifact.documentId
    || integrityArtifact.version !== artifact.version
    || integrityArtifact.target !== artifact.target
  ) {
    throw new Error("Artifact metadata does not match the integrity manifest.");
  }

  return patientEducationDeliveryEnvelopeSchema.parse({
    schemaVersion: "1.0.0",
    envelopeId,
    packageId: authorization.packageId,
    packageVersion: authorization.packageVersion,
    documentId: artifact.documentId,
    documentVersion: artifact.version,
    assetId: artifact.assetId,
    locale,
    artifact: {
      path: artifact.path,
      target: artifact.target,
      mimeType: artifact.mimeType,
      byteLength: integrityArtifact.byteLength,
      sha256: integrityArtifact.sha256,
    },
    organizationKey,
    authorizationId: authorization.authorizationId,
    integrityManifestId: integrityManifest.manifestId,
    ...(overlayId ? { overlayId } : {}),
    ...(localizationId ? { localizationId } : {}),
    destination,
    privacyBoundary: {
      containsPatientIdentifiers: false,
      containsEncounterIdentifiers: false,
      cafPersistsPatientContext: false,
      patientBinding: destination.type === "ehr_document_reference" ? "organization_runtime_only" : "none",
    },
    generatedAt,
    ...(expiresAt ? { expiresAt } : {}),
    status: "prepared",
  });
};
