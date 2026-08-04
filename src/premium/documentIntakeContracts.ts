import { z } from "zod";

export const MAX_BENEFIT_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const BENEFIT_DOCUMENT_BUCKET = "benefits-document-staging";

export const documentIntakeModeSchema = z.enum([
  "disabled",
  "synthetic_only",
  "redacted_benefits_only",
]);
export type DocumentIntakeMode = z.infer<typeof documentIntakeModeSchema>;

export const benefitDocumentKindSchema = z.enum([
  "benefits_guide",
  "medical_plan_summary",
  "retirement_summary",
  "leave_and_protection_summary",
  "pharmacy_or_network_reference",
  "alternate_household_plan",
]);
export type BenefitDocumentKind = z.infer<typeof benefitDocumentKindSchema>;

export const benefitDocumentKindLabels: Record<BenefitDocumentKind, string> = {
  benefits_guide: "Benefits guide or enrollment booklet",
  medical_plan_summary: "Medical plan summary or SBC",
  retirement_summary: "Retirement contribution, match, or vesting summary",
  leave_and_protection_summary: "Leave, disability, life, or protection-benefit summary",
  pharmacy_or_network_reference: "Pharmacy formulary or provider-network reference",
  alternate_household_plan: "Alternate household employer plan summary",
};

export const documentMimeTypeSchema = z.enum(["application/pdf", "text/plain"]);
export type DocumentMimeType = z.infer<typeof documentMimeTypeSchema>;

export const sensitiveFindingCodeSchema = z.enum([
  "social_security_number",
  "date_of_birth",
  "email_address",
  "phone_number",
  "street_address",
  "employee_identifier",
  "member_or_policy_identifier",
  "claim_or_eob_identifier",
  "financial_account_identifier",
  "payment_card_identifier",
  "credential_or_password",
  "medical_record_or_diagnosis",
  "official_election_or_confirmation",
  "individualized_pay_statement",
  "sensitive_filename",
]);
export type SensitiveFindingCode = z.infer<typeof sensitiveFindingCodeSchema>;

export const documentStatusSchema = z.enum([
  "authorized",
  "uploaded",
  "quarantined",
  "ready_for_extraction",
  "extracted",
  "rejected_sensitive_data",
  "extraction_unavailable",
  "deleted",
  "expired",
]);
export type DocumentStatus = z.infer<typeof documentStatusSchema>;

export const documentScanStatusSchema = z.enum([
  "not_started",
  "filename_passed",
  "content_passed",
  "blocked",
  "manual_review_required",
]);
export type DocumentScanStatus = z.infer<typeof documentScanStatusSchema>;

export const documentExtractionStatusSchema = z.enum([
  "not_requested",
  "queued",
  "completed",
  "provider_unavailable",
  "blocked",
]);
export type DocumentExtractionStatus = z.infer<typeof documentExtractionStatusSchema>;

export const extractedBenefitFactKeySchema = z.enum([
  "employee_premium",
  "deductible",
  "out_of_pocket_maximum",
  "employer_hsa_or_hra_contribution",
  "retirement_match_percent",
  "retirement_vesting_years",
]);
export type ExtractedBenefitFactKey = z.infer<typeof extractedBenefitFactKeySchema>;

export const extractedBenefitFactSchema = z.object({
  key: extractedBenefitFactKeySchema,
  label: z.string().min(1).max(120),
  value: z.number().finite().nonnegative(),
  unit: z.enum(["usd", "percent", "years"]),
  cadence: z.enum(["annual", "monthly", "per_pay_period", "not_applicable"]).optional(),
  lineNumber: z.number().int().positive().optional(),
  confidence: z.enum(["low", "medium", "high"]),
});
export type ExtractedBenefitFact = z.infer<typeof extractedBenefitFactSchema>;

export const documentAttestationsSchema = z.object({
  noPersonalInformation: z.literal(true),
  notElectionOrIndividualRecord: z.literal(true),
  authorizedToUse: z.literal(true),
  syntheticPublicOrRedacted: z.literal(true),
});

export const documentUploadRequestSchema = z.object({
  workspaceId: z.string().uuid(),
  documentKind: benefitDocumentKindSchema,
  clientFileName: z.string().trim().min(1).max(160),
  mimeType: documentMimeTypeSchema,
  fileSize: z.number().int().positive().max(MAX_BENEFIT_DOCUMENT_BYTES),
  attestations: documentAttestationsSchema,
});
export type DocumentUploadRequest = z.infer<typeof documentUploadRequestSchema>;

export const documentUploadAuthorizationSchema = z.object({
  uploadId: z.string().uuid(),
  workspaceId: z.string().uuid(),
  documentKind: benefitDocumentKindSchema,
  storagePath: z.string().min(1).max(500),
  signedToken: z.string().min(1),
  mode: documentIntakeModeSchema,
  expiresAt: z.string().datetime(),
});
export type DocumentUploadAuthorization = z.infer<typeof documentUploadAuthorizationSchema>;

export const documentFinalizeRequestSchema = z.object({
  uploadId: z.string().uuid(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i),
  byteLength: z.number().int().positive().max(MAX_BENEFIT_DOCUMENT_BYTES),
});
export type DocumentFinalizeRequest = z.infer<typeof documentFinalizeRequestSchema>;

export const documentExtractRequestSchema = z.object({
  uploadId: z.string().uuid(),
});
export type DocumentExtractRequest = z.infer<typeof documentExtractRequestSchema>;

export const benefitDocumentRecordSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  documentKind: benefitDocumentKindSchema,
  status: documentStatusSchema,
  scanStatus: documentScanStatusSchema,
  extractionStatus: documentExtractionStatusSchema,
  mimeType: documentMimeTypeSchema,
  sizeBytes: z.number().int().nonnegative(),
  findingCodes: sensitiveFindingCodeSchema.array(),
  extractedFacts: extractedBenefitFactSchema.array(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});
export type BenefitDocumentRecord = z.infer<typeof benefitDocumentRecordSchema>;

export const documentIntakeListResponseSchema = z.object({
  enabled: z.boolean(),
  mode: documentIntakeModeSchema,
  documents: benefitDocumentRecordSchema.array(),
});

export const documentExtractionResponseSchema = z.object({
  document: benefitDocumentRecordSchema,
  facts: extractedBenefitFactSchema.array(),
});
