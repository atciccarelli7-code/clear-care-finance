import { z } from "zod";

const identifier = z.string().regex(/^[A-Z0-9-]+$/);

export const patientEducationInstitutionOverlaySchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  overlayId: z.string().regex(/^CAF-PE-OVERLAY-[A-Z0-9-]+$/),
  organizationKey: identifier,
  packageId: z.string().regex(/^CAF-PE-[A-Z0-9-]+$/),
  packageVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  locale: z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/),
  effectiveAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  fields: z.array(z.object({
    fieldId: z.string().regex(/^[a-z0-9][a-z0-9_-]*$/),
    category: z.enum(["contact", "follow_up", "pharmacy", "supplier", "home_health", "policy", "formulary", "branding", "language"]),
    value: z.string().trim().min(1).max(1000),
    sourceOwner: z.string().trim().min(1),
    phiCapability: z.literal("none"),
    approvedByRole: z.string().trim().min(1),
    approvedAt: z.string().datetime(),
  })).min(1),
  status: z.enum(["draft", "in_review", "approved", "suspended", "retired"]),
  changeReason: z.string().trim().min(1),
}).superRefine((value, context) => {
  if (value.expiresAt && new Date(value.expiresAt) <= new Date(value.effectiveAt)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Overlay expiration must occur after its effective date." });
  }
  const duplicate = value.fields.find((field, index) => value.fields.findIndex((candidate) => candidate.fieldId === field.fieldId) !== index);
  if (duplicate) context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate overlay field: ${duplicate.fieldId}.` });
  if (value.status === "approved" && value.fields.some((field) => !field.approvedAt || !field.approvedByRole)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved overlays require approval provenance for every field." });
  }
});

export type PatientEducationInstitutionOverlay = z.infer<typeof patientEducationInstitutionOverlaySchema>;
export const validatePatientEducationInstitutionOverlay = (value: unknown) => patientEducationInstitutionOverlaySchema.safeParse(value);
