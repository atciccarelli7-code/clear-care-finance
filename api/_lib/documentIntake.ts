import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  BENEFIT_DOCUMENT_BUCKET,
  documentFinalizeRequestSchema,
  documentUploadRequestSchema,
  type BenefitDocumentRecord,
  type DocumentFinalizeRequest,
  type DocumentUploadRequest,
} from "../../src/premium/documentIntakeContracts.js";
import { extractSyntheticBenefitsFacts } from "../../src/premium/documentExtraction.js";
import { safeStorageExtension, scanSensitiveData } from "../../src/premium/sensitiveDataDetector.js";
import { checkEntitlement } from "./entitlements.js";
import type { ApiRequest } from "./http.js";
import { getPremiumConfig } from "./premiumConfig.js";
import { PREMIUM_PRODUCT_KEY } from "./productRegistry.js";
import { getSupabaseAdmin, requireAuthenticatedUser } from "./supabase.js";

export class DocumentIntakeUnavailableError extends Error {}
export class DocumentAccessDeniedError extends Error {}
export class DocumentNotFoundError extends Error {}
export class DocumentValidationError extends Error {
  constructor(message: string, public code = "document_rejected") {
    super(message);
  }
}

export type DocumentIntakeContext = {
  user: User;
  admin: SupabaseClient;
  config: ReturnType<typeof getPremiumConfig>;
};

const asStringArray = (value: unknown) => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === "string")
  : [];
const asFactArray = (value: unknown) => Array.isArray(value) ? value : [];

export const mapBenefitDocumentRecord = (row: Record<string, unknown>): BenefitDocumentRecord => ({
  id: String(row.id),
  workspaceId: String(row.workspace_id),
  documentKind: row.document_kind as BenefitDocumentRecord["documentKind"],
  status: row.status as BenefitDocumentRecord["status"],
  scanStatus: row.scan_status as BenefitDocumentRecord["scanStatus"],
  extractionStatus: row.extraction_status as BenefitDocumentRecord["extractionStatus"],
  mimeType: row.mime_type as BenefitDocumentRecord["mimeType"],
  sizeBytes: Number(row.size_bytes || 0),
  findingCodes: asStringArray(row.finding_codes) as BenefitDocumentRecord["findingCodes"],
  extractedFacts: asFactArray(row.extracted_facts) as BenefitDocumentRecord["extractedFacts"],
  createdAt: String(row.created_at),
  updatedAt: String(row.updated_at),
  expiresAt: String(row.expires_at),
});

export const requireDocumentIntakeContext = async (req: ApiRequest): Promise<DocumentIntakeContext> => {
  const config = getPremiumConfig();
  if (
    !config.safe ||
    !config.flags.documentIntake ||
    config.documents.mode === "disabled" ||
    config.documents.mode === "invalid" ||
    !config.documents.dependenciesReady
  ) {
    throw new DocumentIntakeUnavailableError("Document intake unavailable");
  }

  const user = await requireAuthenticatedUser(req);
  const admin = getSupabaseAdmin();
  const access = await checkEntitlement(user.id, PREMIUM_PRODUCT_KEY, admin);
  if (access.accessStatus !== "active") {
    throw new DocumentAccessDeniedError("Active product access is required");
  }
  return { user, admin, config };
};

export const requireOwnedWorkspace = async (
  admin: SupabaseClient,
  userId: string,
  workspaceId: string,
) => {
  const { data, error } = await admin
    .from("workspaces")
    .select("id")
    .eq("id", workspaceId)
    .eq("user_id", userId)
    .eq("product_key", PREMIUM_PRODUCT_KEY)
    .maybeSingle();
  if (error) throw new Error("Workspace lookup failed");
  if (!data) throw new DocumentNotFoundError("Workspace not found");
};

const storageObjectForPath = async (admin: SupabaseClient, path: string) => {
  const segments = path.split("/");
  const fileName = segments.pop() || "";
  const folder = segments.join("/");
  const { data, error } = await admin.storage.from(BENEFIT_DOCUMENT_BUCKET).list(folder, {
    limit: 20,
    search: fileName,
  });
  if (error) throw new Error("Storage object lookup failed");
  return (data || []).find((item) => item.name === fileName) || null;
};

const removeStoragePath = async (admin: SupabaseClient, path: string) => {
  const { error } = await admin.storage.from(BENEFIT_DOCUMENT_BUCKET).remove([path]);
  if (error && !/not found/i.test(error.message || "")) {
    throw new Error("Document deletion failed");
  }
};

const downloadStorageBytes = async (admin: SupabaseClient, path: string) => {
  const { data: blob, error } = await admin.storage.from(BENEFIT_DOCUMENT_BUCKET).download(path);
  if (error || !blob) {
    throw new DocumentValidationError(
      "The uploaded object could not be downloaded for verification.",
      "upload_unverifiable",
    );
  }
  return Buffer.from(await blob.arrayBuffer());
};

const deleteAuthorizationAndObject = async (
  context: DocumentIntakeContext,
  uploadId: string,
  path: string,
) => {
  await removeStoragePath(context.admin, path);
  await context.admin
    .from("benefit_document_uploads")
    .delete()
    .eq("id", uploadId)
    .eq("user_id", context.user.id)
    .eq("product_key", PREMIUM_PRODUCT_KEY);
};

const hasExpectedSignature = (bytes: Buffer, mimeType: string) => {
  if (mimeType === "application/pdf") {
    return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (mimeType === "text/plain") {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

const hashesMatch = (bytes: Buffer, suppliedHex: string) => {
  const calculated = createHash("sha256").update(bytes).digest();
  const supplied = Buffer.from(suppliedHex, "hex");
  return supplied.length === calculated.length && timingSafeEqual(calculated, supplied);
};

export const getOwnedDocument = async (context: DocumentIntakeContext, uploadId: string) => {
  const { data, error } = await context.admin
    .from("benefit_document_uploads")
    .select("*")
    .eq("id", uploadId)
    .eq("user_id", context.user.id)
    .eq("product_key", PREMIUM_PRODUCT_KEY)
    .maybeSingle();
  if (error) throw new Error("Document lookup failed");
  if (!data) throw new DocumentNotFoundError("Document not found");
  return data as Record<string, unknown>;
};

export const cleanupExpiredDocuments = async (context: DocumentIntakeContext) => {
  const now = new Date().toISOString();
  const { data, error } = await context.admin
    .from("benefit_document_uploads")
    .select("id,storage_path")
    .eq("user_id", context.user.id)
    .eq("product_key", PREMIUM_PRODUCT_KEY)
    .is("deleted_at", null)
    .lt("expires_at", now)
    .limit(20);
  if (error) throw new Error("Expired document lookup failed");

  for (const row of data || []) {
    await removeStoragePath(context.admin, String(row.storage_path));
    await context.admin
      .from("benefit_document_uploads")
      .update({ status: "expired", deleted_at: now, updated_at: now })
      .eq("id", row.id)
      .eq("user_id", context.user.id);
  }
};

export const listOwnedDocuments = async (
  context: DocumentIntakeContext,
  workspaceId: string,
) => {
  await requireOwnedWorkspace(context.admin, context.user.id, workspaceId);
  await cleanupExpiredDocuments(context);
  const { data, error } = await context.admin
    .from("benefit_document_uploads")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", context.user.id)
    .eq("product_key", PREMIUM_PRODUCT_KEY)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error("Document list failed");
  return (data || []).map((row) => mapBenefitDocumentRecord(row as Record<string, unknown>));
};

export const createDocumentUploadAuthorization = async (
  context: DocumentIntakeContext,
  raw: unknown,
) => {
  const input: DocumentUploadRequest = documentUploadRequestSchema.parse(raw);
  await requireOwnedWorkspace(context.admin, context.user.id, input.workspaceId);

  const filenameScan = scanSensitiveData({ fileName: input.clientFileName });
  if (filenameScan.blocked) {
    throw new DocumentValidationError(
      "Rename or replace the file. The filename suggests an individualized or sensitive record.",
      "sensitive_filename",
    );
  }
  if (context.config.documents.mode === "synthetic_only" && !input.attestations.syntheticPublicOrRedacted) {
    throw new DocumentValidationError(
      "Only synthetic, public, or deliberately redacted fixtures are accepted in this environment.",
    );
  }

  const uploadId = randomUUID();
  const extension = safeStorageExtension(input.mimeType);
  const storagePath = `${context.user.id}/${input.workspaceId}/${uploadId}/benefits-document.${extension}`;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();
  const { error: insertError } = await context.admin.from("benefit_document_uploads").insert({
    id: uploadId,
    user_id: context.user.id,
    workspace_id: input.workspaceId,
    product_key: PREMIUM_PRODUCT_KEY,
    document_kind: input.documentKind,
    status: "authorized",
    intake_mode: context.config.documents.mode,
    storage_bucket: BENEFIT_DOCUMENT_BUCKET,
    storage_path: storagePath,
    mime_type: input.mimeType,
    size_bytes: input.fileSize,
    scan_status: "filename_passed",
    extraction_status: "not_requested",
    finding_codes: [],
    extracted_facts: [],
    attested_no_personal_information: input.attestations.noPersonalInformation,
    attested_not_election_record: input.attestations.notElectionOrIndividualRecord,
    attested_authorized_to_use: input.attestations.authorizedToUse,
    attested_synthetic_public_or_redacted: input.attestations.syntheticPublicOrRedacted,
    expires_at: expiresAt,
    created_at: now,
    updated_at: now,
  });
  if (insertError) throw new Error("Document authorization failed");

  const { data, error } = await context.admin.storage
    .from(BENEFIT_DOCUMENT_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: false });
  const signedToken = data?.token;
  if (error || !signedToken) {
    await context.admin
      .from("benefit_document_uploads")
      .delete()
      .eq("id", uploadId)
      .eq("user_id", context.user.id);
    throw new Error("Signed upload authorization failed");
  }

  return {
    uploadId,
    workspaceId: input.workspaceId,
    documentKind: input.documentKind,
    storagePath,
    signedToken,
    mode: context.config.documents.mode,
    expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  };
};

export const finalizeDocumentUpload = async (
  context: DocumentIntakeContext,
  raw: unknown,
) => {
  const input: DocumentFinalizeRequest = documentFinalizeRequestSchema.parse(raw);
  const row = await getOwnedDocument(context, input.uploadId);
  if (row.status !== "authorized") {
    throw new DocumentValidationError(
      "This upload authorization is no longer active.",
      "invalid_document_state",
    );
  }

  const storagePath = String(row.storage_path);
  if (Number(row.size_bytes) !== input.byteLength) {
    await deleteAuthorizationAndObject(context, input.uploadId, storagePath);
    throw new DocumentValidationError(
      "The uploaded file size did not match the authorized file.",
      "upload_size_mismatch",
    );
  }

  const object = await storageObjectForPath(context.admin, storagePath);
  if (!object) {
    throw new DocumentValidationError(
      "The uploaded object could not be verified.",
      "upload_missing",
    );
  }

  const metadata = (object.metadata || {}) as Record<string, unknown>;
  const metadataSize = Number(metadata.size || 0);
  const metadataMime = String(metadata.mimetype || metadata.contentType || row.mime_type || "");
  const bytes = await downloadStorageBytes(context.admin, storagePath);
  const expectedMime = String(row.mime_type);
  const metadataMatches = metadataSize === input.byteLength && metadataMime === expectedMime;
  const bytesMatch = bytes.byteLength === input.byteLength;
  const signatureMatches = hasExpectedSignature(bytes, expectedMime);
  const hashMatches = hashesMatch(bytes, input.sha256);

  if (!metadataMatches || !bytesMatch || !signatureMatches || !hashMatches) {
    await deleteAuthorizationAndObject(context, input.uploadId, storagePath);
    throw new DocumentValidationError(
      "The uploaded object failed server-side type, size, signature, or integrity verification.",
      "upload_integrity_mismatch",
    );
  }

  const now = new Date().toISOString();
  const nextStatus = row.mime_type === "text/plain" ? "ready_for_extraction" : "quarantined";
  const { data, error } = await context.admin
    .from("benefit_document_uploads")
    .update({
      status: nextStatus,
      sha256: input.sha256.toLowerCase(),
      updated_at: now,
    })
    .eq("id", input.uploadId)
    .eq("user_id", context.user.id)
    .select("*")
    .single();
  if (error || !data) throw new Error("Document finalization failed");
  return mapBenefitDocumentRecord(data as Record<string, unknown>);
};

export const extractDocument = async (
  context: DocumentIntakeContext,
  uploadId: string,
) => {
  if (!context.config.flags.documentExtraction) {
    throw new DocumentIntakeUnavailableError("Document extraction unavailable");
  }
  const row = await getOwnedDocument(context, uploadId);
  if (!["ready_for_extraction", "quarantined", "extraction_unavailable"].includes(String(row.status))) {
    throw new DocumentValidationError(
      "The document is not ready for extraction.",
      "invalid_document_state",
    );
  }

  if (row.mime_type !== "text/plain") {
    const { data, error } = await context.admin
      .from("benefit_document_uploads")
      .update({
        status: "extraction_unavailable",
        scan_status: "manual_review_required",
        extraction_status: "provider_unavailable",
        updated_at: new Date().toISOString(),
      })
      .eq("id", uploadId)
      .eq("user_id", context.user.id)
      .select("*")
      .single();
    if (error || !data) throw new Error("Document extraction state update failed");
    return {
      document: mapBenefitDocumentRecord(data as Record<string, unknown>),
      facts: [],
    };
  }

  const bytes = await downloadStorageBytes(context.admin, String(row.storage_path));
  if (bytes.byteLength !== Number(row.size_bytes)) {
    throw new DocumentValidationError(
      "The stored document size changed unexpectedly.",
      "stored_size_mismatch",
    );
  }
  if (!hashesMatch(bytes, String(row.sha256 || ""))) {
    await deleteAuthorizationAndObject(context, uploadId, String(row.storage_path));
    throw new DocumentValidationError(
      "The stored document failed integrity verification.",
      "stored_integrity_mismatch",
    );
  }

  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const result = extractSyntheticBenefitsFacts(text);
  const now = new Date().toISOString();
  await removeStoragePath(context.admin, String(row.storage_path));

  if (result.blocked) {
    const { data, error } = await context.admin
      .from("benefit_document_uploads")
      .update({
        status: "rejected_sensitive_data",
        scan_status: "blocked",
        extraction_status: "blocked",
        finding_codes: result.findingCodes,
        extracted_facts: [],
        deleted_at: now,
        updated_at: now,
      })
      .eq("id", uploadId)
      .eq("user_id", context.user.id)
      .select("*")
      .single();
    if (error || !data) throw new Error("Sensitive document rejection failed");
    return {
      document: mapBenefitDocumentRecord(data as Record<string, unknown>),
      facts: [],
    };
  }

  const { data, error } = await context.admin
    .from("benefit_document_uploads")
    .update({
      status: "extracted",
      scan_status: "content_passed",
      extraction_status: "completed",
      finding_codes: [],
      extracted_facts: result.facts,
      deleted_at: now,
      updated_at: now,
    })
    .eq("id", uploadId)
    .eq("user_id", context.user.id)
    .select("*")
    .single();
  if (error || !data) throw new Error("Document extraction failed");
  return {
    document: mapBenefitDocumentRecord(data as Record<string, unknown>),
    facts: result.facts,
  };
};

export const deleteDocument = async (
  context: DocumentIntakeContext,
  uploadId: string,
) => {
  const row = await getOwnedDocument(context, uploadId);
  if (!row.deleted_at) {
    await removeStoragePath(context.admin, String(row.storage_path));
  }
  const { error } = await context.admin
    .from("benefit_document_uploads")
    .delete()
    .eq("id", uploadId)
    .eq("user_id", context.user.id)
    .eq("product_key", PREMIUM_PRODUCT_KEY);
  if (error) throw new Error("Document metadata deletion failed");
};
