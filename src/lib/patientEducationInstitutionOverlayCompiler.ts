import {
  patientEducationContentDocumentSchema,
  type PatientEducationContentDocument,
} from "@/lib/patientEducationContentContract";
import {
  patientEducationInstitutionOverlaySchema,
  type PatientEducationInstitutionOverlay,
} from "@/lib/patientEducationInstitutionOverlay";

export type AppliedPatientEducationInstitutionOverlay = {
  document: PatientEducationContentDocument;
  overlayId: string;
  organizationKey: string;
  appliedFieldIds: string[];
  unusedFieldIds: string[];
  provenance: Array<{
    fieldId: string;
    sourceOwner: string;
    approvedByRole: string;
    approvedAt: string;
  }>;
};

export type ApplyPatientEducationInstitutionOverlayOptions = {
  evaluatedAt?: string;
  requiredFieldIds?: string[];
  allowUnusedFields?: boolean;
};

const isOverlayActive = (
  overlay: PatientEducationInstitutionOverlay,
  evaluatedAt: string,
) => {
  const evaluationTime = new Date(evaluatedAt);
  if (new Date(overlay.effectiveAt) > evaluationTime) return false;
  if (overlay.expiresAt && new Date(overlay.expiresAt) <= evaluationTime) return false;
  return true;
};

export const applyPatientEducationInstitutionOverlay = (
  documentInput: unknown,
  overlayInput: unknown,
  options: ApplyPatientEducationInstitutionOverlayOptions = {},
): AppliedPatientEducationInstitutionOverlay => {
  const document = patientEducationContentDocumentSchema.parse(documentInput);
  const overlay = patientEducationInstitutionOverlaySchema.parse(overlayInput);
  const evaluatedAt = options.evaluatedAt ?? new Date().toISOString();

  if (overlay.status !== "approved") {
    throw new Error(`Only approved institution overlays can be applied. Received: ${overlay.status}.`);
  }
  if (!isOverlayActive(overlay, evaluatedAt)) {
    throw new Error(`Institution overlay ${overlay.overlayId} is not active at ${evaluatedAt}.`);
  }
  if (overlay.packageId !== document.packageId) {
    throw new Error("Institution overlay packageId does not match the content document.");
  }
  if (overlay.packageVersion !== document.assetVersion) {
    throw new Error("Institution overlay packageVersion does not match the document assetVersion.");
  }
  if (overlay.locale !== document.language) {
    throw new Error("Institution overlay locale does not match the content document language.");
  }
  if (document.distributionBoundary !== "institutional") {
    throw new Error("Institution overlays may be applied only to institutional-boundary documents.");
  }

  const availableFields = new Map<string, { category: string; phiCapability: string }>();
  for (const block of document.blocks) {
    if (block.type !== "personalization") continue;
    for (const field of block.fields) {
      availableFields.set(field.fieldId, {
        category: field.category,
        phiCapability: field.phiCapability,
      });
    }
  }

  const overlayFields = new Map(overlay.fields.map((field) => [field.fieldId, field]));
  const requiredFieldIds = options.requiredFieldIds ?? [];
  for (const fieldId of requiredFieldIds) {
    if (!overlayFields.has(fieldId)) {
      throw new Error(`Required institution overlay field is missing: ${fieldId}.`);
    }
  }

  for (const field of overlay.fields) {
    const target = availableFields.get(field.fieldId);
    if (!target) {
      if (!options.allowUnusedFields) {
        throw new Error(`Institution overlay field is not declared by the document: ${field.fieldId}.`);
      }
      continue;
    }
    if (target.phiCapability !== "none") {
      throw new Error(`Institution overlay cannot populate PHI-capable field: ${field.fieldId}.`);
    }
    if (target.category !== field.category) {
      throw new Error(`Institution overlay category mismatch for field ${field.fieldId}: expected ${target.category}, received ${field.category}.`);
    }
  }

  const appliedFieldIds: string[] = [];
  const blocks = document.blocks.map((block) => {
    if (block.type !== "personalization") return block;
    const fields = block.fields.map((field) => {
      const overlayField = overlayFields.get(field.fieldId);
      if (!overlayField) return field;
      appliedFieldIds.push(field.fieldId);
      return {
        ...field,
        placeholder: overlayField.value,
      };
    });
    return { ...block, fields };
  });

  const appliedSet = new Set(appliedFieldIds);
  const unusedFieldIds = overlay.fields
    .map((field) => field.fieldId)
    .filter((fieldId) => !appliedSet.has(fieldId));

  const compiledDocument = patientEducationContentDocumentSchema.parse({
    ...document,
    blocks,
  });

  return {
    document: compiledDocument,
    overlayId: overlay.overlayId,
    organizationKey: overlay.organizationKey,
    appliedFieldIds,
    unusedFieldIds,
    provenance: overlay.fields
      .filter((field) => appliedSet.has(field.fieldId))
      .map((field) => ({
        fieldId: field.fieldId,
        sourceOwner: field.sourceOwner,
        approvedByRole: field.approvedByRole,
        approvedAt: field.approvedAt,
      })),
  };
};
