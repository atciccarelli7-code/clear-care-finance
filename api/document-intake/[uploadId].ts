import { ZodError } from "zod";
import {
  deleteDocument,
  DocumentAccessDeniedError,
  DocumentIntakeUnavailableError,
  DocumentNotFoundError,
  DocumentValidationError,
  finalizeDocumentUpload,
  requireDocumentIntakeContext,
} from "../_lib/documentIntake.js";
import {
  methodNotAllowed,
  parseJsonBody,
  safeError,
  sameOrigin,
  setPrivateHeaders,
  type ApiRequest,
  type ApiResponse,
} from "../_lib/http.js";
import { getPremiumConfig } from "../_lib/premiumConfig.js";
import { ConfigurationUnavailableError, UnauthorizedError } from "../_lib/supabase.js";

const firstQueryValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

const handleError = (error: unknown, res: ApiResponse) => {
  if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
  if (error instanceof DocumentAccessDeniedError) return safeError(res, 403, "entitlement_required", "Active product access is required.");
  if (error instanceof DocumentNotFoundError) return safeError(res, 404, "document_not_found", "The requested document was not found.");
  if (error instanceof DocumentValidationError) return safeError(res, 400, error.code, error.message);
  if (error instanceof ZodError) return safeError(res, 400, "invalid_document_request", "The document request was invalid.");
  if (error instanceof DocumentIntakeUnavailableError || error instanceof ConfigurationUnavailableError) {
    return safeError(res, 503, "document_intake_unavailable", "Secure document intake is not available.");
  }
  return safeError(res, 503, "document_intake_unavailable", "The document request could not be completed.");
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (!["PUT", "DELETE"].includes(req.method || "")) return methodNotAllowed(res, ["PUT", "DELETE"]);
  const config = getPremiumConfig();
  if (!sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");

  try {
    const context = await requireDocumentIntakeContext(req);
    const uploadId = firstQueryValue(req.query?.uploadId)?.trim() || "";
    if (!uploadId) return safeError(res, 400, "upload_id_required", "Select a document first.");

    if (req.method === "DELETE") {
      await deleteDocument(context, uploadId);
      return res.status(200).json({ deleted: true });
    }

    const body = parseJsonBody<Record<string, unknown>>(req);
    if (typeof body.uploadId === "string" && body.uploadId !== uploadId) {
      return safeError(res, 400, "upload_id_mismatch", "The document identifier did not match the request path.");
    }
    const document = await finalizeDocumentUpload(context, { ...body, uploadId });
    return res.status(200).json({ document });
  } catch (error) {
    return handleError(error, res);
  }
}
