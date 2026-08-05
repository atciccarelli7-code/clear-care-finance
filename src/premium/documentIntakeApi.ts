import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  BENEFIT_DOCUMENT_BUCKET,
  benefitDocumentRecordSchema,
  documentExtractionResponseSchema,
  documentIntakeListResponseSchema,
  documentUploadAuthorizationSchema,
  type BenefitDocumentKind,
  type BenefitDocumentRecord,
  type DocumentIntakeMode,
  type DocumentUploadRequest,
} from "./documentIntakeContracts.js";
import { PremiumApiError } from "./apiClient.js";

const jsonHeaders = { "Content-Type": "application/json" };

let storageClient: SupabaseClient | null = null;

const getStorageClient = () => {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) throw new PremiumApiError("Document storage is not configured.", 503, "configuration_unavailable");
  if (!storageClient) {
    storageClient = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return storageClient;
};

const readJson = async (response: Response) => {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new PremiumApiError(
      typeof payload.message === "string" ? payload.message : "The document request could not be completed.",
      response.status,
      typeof payload.code === "string" ? payload.code : undefined,
    );
  }
  return payload;
};

const bytesToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

export const sha256File = async (file: File) => {
  if (!globalThis.crypto?.subtle) throw new PremiumApiError("This browser cannot securely verify the document.", 400, "hash_unavailable");
  const hash = await globalThis.crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return bytesToHex(hash);
};

const confirmedAttestations: DocumentUploadRequest["attestations"] = {
  noPersonalInformation: true,
  notElectionOrIndividualRecord: true,
  authorizedToUse: true,
  syntheticPublicOrRedacted: true,
};

export const listBenefitDocuments = async (
  token: string,
  workspaceId: string,
): Promise<{ enabled: boolean; mode: DocumentIntakeMode; documents: BenefitDocumentRecord[] }> => {
  const response = await fetch(`/api/document-intake?workspaceId=${encodeURIComponent(workspaceId)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return documentIntakeListResponseSchema.parse(await readJson(response));
};

export const uploadBenefitDocument = async ({
  token,
  workspaceId,
  documentKind,
  file,
  attestations = confirmedAttestations,
}: {
  token: string;
  workspaceId: string;
  documentKind: BenefitDocumentKind;
  file: File;
  attestations?: DocumentUploadRequest["attestations"];
}): Promise<BenefitDocumentRecord> => {
  const authorizationResponse = await fetch("/api/document-intake", {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      workspaceId,
      documentKind,
      clientFileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      attestations,
    }),
  });
  const authorizationPayload = await readJson(authorizationResponse);
  const authorization = documentUploadAuthorizationSchema.parse(authorizationPayload.authorization);
  const hash = await sha256File(file);

  const client = getStorageClient();
  const { error: uploadError } = await client.storage
    .from(BENEFIT_DOCUMENT_BUCKET)
    .uploadToSignedUrl(authorization.storagePath, authorization.signedToken, file, {
      contentType: file.type,
      upsert: false,
      cacheControl: "0",
    });
  if (uploadError) throw new PremiumApiError("The encrypted document upload did not complete.", 503, "upload_failed");

  const finalizeResponse = await fetch(`/api/document-intake/${encodeURIComponent(authorization.uploadId)}`, {
    method: "PUT",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      uploadId: authorization.uploadId,
      sha256: hash,
      byteLength: file.size,
    }),
  });
  const finalizePayload = await readJson(finalizeResponse);
  return benefitDocumentRecordSchema.parse(finalizePayload.document);
};

export const extractBenefitDocument = async (token: string, uploadId: string) => {
  const response = await fetch("/api/document-intake/extract", {
    method: "POST",
    headers: { ...jsonHeaders, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ uploadId }),
  });
  return documentExtractionResponseSchema.parse(await readJson(response));
};

export const deleteBenefitDocument = async (token: string, uploadId: string) => {
  const response = await fetch(`/api/document-intake/${encodeURIComponent(uploadId)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const payload = await readJson(response);
  return payload.deleted === true;
};
