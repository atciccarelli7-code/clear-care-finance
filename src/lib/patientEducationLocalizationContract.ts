import { z } from "zod";
import {
  patientEducationContentBlockSchema,
  patientEducationContentDocumentSchema,
  type PatientEducationContentBlock,
  type PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";

const localeSchema = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);
const identifierSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]*$/);

export const patientEducationTranslationStatusSchema = z.enum([
  "not_started",
  "machine_draft",
  "human_translation",
  "clinical_review",
  "community_review",
  "approved",
  "retired",
]);

export const patientEducationLocalizedBlockSchema = z.object({
  blockId: identifierSchema,
  sourceBlockHash: z.string().regex(/^[a-f0-9]{64}$/),
  translatedBlock: patientEducationContentBlockSchema,
  translatorAttestation: z.object({
    method: z.enum(["human", "machine_assisted_human", "machine_only"]),
    translatorRole: z.string().trim().min(2).max(160),
    completedAt: z.string().datetime(),
  }),
  review: z.object({
    languageAccuracy: z.enum(["pending", "approved", "changes_required"]),
    clinicalEquivalence: z.enum(["pending", "approved", "changes_required"]),
    healthLiteracy: z.enum(["pending", "approved", "changes_required"]),
    reviewedAt: z.string().datetime().optional(),
  }),
});

export const patientEducationLocalizationPackageSchema = z.object({
  schemaVersion: z.literal("1.0.0"),
  localizationId: z.string().regex(/^CAF-PE-LOC-[A-Z0-9-]+$/),
  documentId: z.string().regex(/^CAF-PE-DOC-[A-Z0-9-]+$/),
  sourceLanguage: localeSchema,
  targetLanguage: localeSchema,
  sourceAssetVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  status: patientEducationTranslationStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  plainLanguageStandard: z.string().trim().min(3).max(240),
  culturalAdaptationNotes: z.array(z.string().trim().min(2).max(1000)),
  localizedBlocks: z.array(patientEducationLocalizedBlockSchema).min(1),
  unresolvedTerms: z.array(z.object({
    term: z.string().trim().min(1).max(160),
    reason: z.string().trim().min(2).max(1000),
    ownerRole: z.string().trim().min(2).max(160),
  })),
}).superRefine((value, context) => {
  if (value.sourceLanguage === value.targetLanguage) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Source and target languages must differ." });
  }

  const blockIds = value.localizedBlocks.map((block) => block.blockId);
  if (new Set(blockIds).size !== blockIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Localized block IDs must be unique." });
  }

  if (value.status === "approved") {
    for (const block of value.localizedBlocks) {
      if (block.translatorAttestation.method === "machine_only") {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved localization cannot contain machine-only block: ${block.blockId}.` });
      }
      for (const [reviewName, decision] of Object.entries(block.review)) {
        if (reviewName !== "reviewedAt" && decision !== "approved") {
          context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved localization requires approved ${reviewName} review for block: ${block.blockId}.` });
        }
      }
      if (!block.review.reviewedAt) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Approved localization requires reviewedAt for block: ${block.blockId}.` });
      }
    }
    if (value.unresolvedTerms.length > 0) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved localization cannot retain unresolved terms." });
    }
  }
});

export type PatientEducationLocalizationPackage = z.infer<typeof patientEducationLocalizationPackageSchema>;

export const applyPatientEducationLocalization = (
  source: PatientEducationContentDocument,
  localization: PatientEducationLocalizationPackage,
): PatientEducationContentDocument => {
  patientEducationContentDocumentSchema.parse(source);
  patientEducationLocalizationPackageSchema.parse(localization);

  if (source.documentId !== localization.documentId) throw new Error("Localization documentId does not match the source document.");
  if (source.language !== localization.sourceLanguage) throw new Error("Localization sourceLanguage does not match the source document.");
  if (source.assetVersion !== localization.sourceAssetVersion) throw new Error("Localization sourceAssetVersion does not match the source document.");
  if (localization.status !== "approved") throw new Error("Only approved localization packages can be applied to delivery content.");

  const localizedById = new Map(localization.localizedBlocks.map((entry) => [entry.blockId, entry.translatedBlock]));
  const blocks = source.blocks.map((block): PatientEducationContentBlock => {
    const localized = localizedById.get(block.blockId);
    if (!localized) throw new Error(`Missing localized block: ${block.blockId}`);
    if (localized.blockId !== block.blockId || localized.sectionId !== block.sectionId || localized.type !== block.type) {
      throw new Error(`Localized block structure differs from source block: ${block.blockId}`);
    }
    return localized;
  });

  return patientEducationContentDocumentSchema.parse({
    ...source,
    language: localization.targetLanguage,
    blocks,
  });
};

export const validatePatientEducationLocalizationPackage = (value: unknown) =>
  patientEducationLocalizationPackageSchema.safeParse(value);
