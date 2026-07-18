import { z } from "zod";

export const patientEducationAssetTypeSchema = z.enum([
  "full_guide",
  "quick_start",
  "avs_summary",
  "personalized_plan",
  "daily_tracker",
  "troubleshooting",
  "red_flags",
  "caregiver_guide",
  "teach_back",
  "show_me",
  "clinician_reference",
  "evidence_dossier",
  "version_record",
  "implementation_workflow",
  "feedback_tool",
  "video",
  "audio",
  "wallet_card",
]);

export const patientEducationAssetFormatSchema = z.enum([
  "responsive_html",
  "print_html",
  "print_pdf",
  "accessible_pdf",
  "structured_text",
  "avs_text",
  "patient_portal_json",
  "json",
  "csv",
  "video",
  "audio",
  "image",
]);

export const patientEducationReleaseGateSchema = z.enum([
  "evidence",
  "clinical_review",
  "health_literacy",
  "accessibility",
  "patient_testing",
  "institutional_localization",
]);

export const patientEducationStatusSchema = z.enum([
  "proposed",
  "researching",
  "drafting",
  "internal_review",
  "external_review",
  "patient_testing",
  "pilot_ready",
  "released",
  "suspended",
  "retired",
]);

export const patientEducationDataClassificationSchema = z.enum([
  "public_product_architecture",
  "caf_confidential",
  "client_confidential",
  "restricted_clinical_source",
  "phi_prohibited",
]);

export const patientEducationReviewRoleSchema = z.object({
  roleId: z.string().regex(/^[a-z0-9_]+$/),
  roleLabel: z.string().min(2),
  discipline: z.string().min(2),
  required: z.boolean(),
  approvalScope: z.string().min(10),
  status: z.enum(["not_assigned", "assigned", "in_review", "approved", "revision_requested", "expired"]),
  reviewerIdentityRef: z.string().optional(),
  approvedVersion: z.string().optional(),
  reviewedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
}).superRefine((value, context) => {
  if (value.status === "approved" && (!value.reviewerIdentityRef || !value.approvedVersion || !value.reviewedAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved reviews require reviewer identity, approved version, and review date." });
  }
});

export const patientEducationAssetSchema = z.object({
  assetId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  type: patientEducationAssetTypeSchema,
  title: z.string().min(3),
  audience: z.array(z.enum(["patient", "caregiver", "nurse", "clinician", "reviewer", "instructor", "administrator"])).min(1),
  formats: z.array(patientEducationAssetFormatSchema).min(1),
  status: patientEducationStatusSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  sourceDossierId: z.string().min(3),
  derivedFromAssetIds: z.array(z.string()).default([]),
  localizationRequired: z.boolean(),
  patientSpecificFieldsAllowed: z.boolean(),
  containsClinicalInstructions: z.boolean(),
  publicDistributionAllowed: z.boolean(),
});

export const patientEducationLocalizationFieldSchema = z.object({
  fieldId: z.string().regex(/^[a-z0-9_]+$/),
  label: z.string().min(2),
  category: z.enum(["clinical_order", "contact", "follow_up", "pharmacy", "supplier", "home_health", "policy", "formulary", "branding", "language"]),
  requiredForRelease: z.boolean(),
  populatedBy: z.enum(["healthcare_organization", "caf", "joint_review"]),
  allowsPhi: z.boolean(),
  storageBoundary: z.string().min(10),
});

export const patientEducationPackageSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  title: z.string().min(5),
  shortTitle: z.string().min(2),
  description: z.string().min(20),
  clinicalDomains: z.array(z.string().min(2)).min(1),
  intendedAudiences: z.array(z.string().min(2)).min(1),
  careSettings: z.array(z.string().min(2)).min(1),
  ageGroup: z.enum(["adult", "pediatric", "all_ages"]),
  language: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  riskTier: z.enum(["low", "moderate", "high", "critical"]),
  status: patientEducationStatusSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  publicStatus: z.enum(["private", "controlled_preview", "public"]),
  dataClassification: patientEducationDataClassificationSchema,
  productOwnerRole: z.string().min(3),
  sourceDossierId: z.string().min(3),
  sourceDossierStatus: z.enum(["not_started", "in_progress", "complete", "needs_update"]),
  lastClinicalReviewAt: z.string().datetime().optional(),
  nextClinicalReviewAt: z.string().datetime().optional(),
  assets: z.array(patientEducationAssetSchema).min(1),
  requiredReviewRoles: z.array(patientEducationReviewRoleSchema).min(1),
  releaseGates: z.record(patientEducationReleaseGateSchema, z.enum(["not_started", "in_progress", "passed", "failed", "expired"])),
  localizationFields: z.array(patientEducationLocalizationFieldSchema),
  prohibitedData: z.array(z.string().min(2)).min(1),
  claimsBoundary: z.array(z.string().min(10)).min(1),
  correctionRoute: z.object({
    ownerRole: z.string().min(3),
    severityModel: z.array(z.enum(["critical", "major", "minor"])).min(3),
    recallCapable: z.boolean(),
    customerNotificationRequiredFor: z.array(z.enum(["critical", "major", "minor"])).min(1),
  }),
}).superRefine((value, context) => {
  const allGatesPassed = Object.values(value.releaseGates).every((status) => status === "passed");
  const requiredReviewsApproved = value.requiredReviewRoles.filter((role) => role.required).every((role) => role.status === "approved");

  if (["pilot_ready", "released"].includes(value.status) && !allGatesPassed) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Pilot-ready and released packages require every release gate to pass." });
  }
  if (["pilot_ready", "released"].includes(value.status) && !requiredReviewsApproved) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Pilot-ready and released packages require every mandatory review role to approve the version." });
  }
  if (value.publicStatus === "public" && value.assets.some((asset) => asset.containsClinicalInstructions && !asset.publicDistributionAllowed)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A public package cannot expose restricted clinical-instruction assets." });
  }
  if (value.dataClassification === "public_product_architecture" && value.localizationFields.some((field) => field.allowsPhi)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Public product architecture cannot include localization fields that allow PHI." });
  }
  if (value.correctionRoute.severityModel.length !== 3) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Correction severity model must include critical, major, and minor." });
  }
});

export type PatientEducationPackage = z.infer<typeof patientEducationPackageSchema>;

export const validatePatientEducationPackage = (value: unknown) => patientEducationPackageSchema.safeParse(value);
