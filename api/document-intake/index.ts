import { ZodError } from "zod";
import {
  createDocumentUploadAuthorization,
  DocumentAccessDeniedError,
  DocumentIntakeUnavailableError,
  DocumentNotFoundError,
  DocumentValidationError,
  listOwnedDocuments,
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
  if (error instanceof DocumentNotFoundError) return safeError(res, 404, "document_not_found", "The requested workspace or document was not found.");
  if (error instanceof DocumentValidationError) return safeError(res, 400, error.code, error.message);
  if (error instanceof ZodError) return safeError(res, 400, "invalid_document_request", "Review the document type, size, and required confirmations.");
  if (error instanceof DocumentIntakeUnavailableError || error instanceof ConfigurationUnavailableError) {
    return safeError(res, 503, "document_intake_unavailable", "Secure document intake is not available.");
  }
  return safeError(res, 503, "document_intake_unavailable", "The document request could not be completed.");
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (!["GET", "POST"].includes(req.method || "")) return methodNotAllowed(res, ["GET", "POST"]);
  const config = getPremiumConfig();
  if (req.method === "POST" && !sameOrigin(req, config.siteUrl)) {
    return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  }

  try {
    const context = await requireDocumentIntakeContext(req);
    if (req.method === "GET") {
      const workspaceId = firstQueryValue(req.query?.workspaceId)?.trim() || "";
      if (!workspaceId) return safeError(res, 400, "workspace_required", "Select a workspace first.");
      const documents = await listOwnedDocuments(context, workspaceId);
      return res.status(200).json({ enabled: true, mode: context.config.documents.mode, documents });
    }
    const authorization = await createDocumentUploadAuthorization(context, parseJsonBody(req));
    return res.status(201).json({ authorization });
  } catch (error) {
    return handleError(error, res);
  }
}
