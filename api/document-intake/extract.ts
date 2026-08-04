import { ZodError } from "zod";
import { documentExtractRequestSchema } from "../../src/premium/documentIntakeContracts.js";
import {
  DocumentAccessDeniedError,
  DocumentIntakeUnavailableError,
  DocumentNotFoundError,
  DocumentValidationError,
  extractDocument,
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

const handleError = (error: unknown, res: ApiResponse) => {
  if (error instanceof UnauthorizedError) return safeError(res, 401, "authentication_required", "Sign in to continue.");
  if (error instanceof DocumentAccessDeniedError) return safeError(res, 403, "entitlement_required", "Active product access is required.");
  if (error instanceof DocumentNotFoundError) return safeError(res, 404, "document_not_found", "The requested document was not found.");
  if (error instanceof DocumentValidationError) return safeError(res, 400, error.code, error.message);
  if (error instanceof ZodError) return safeError(res, 400, "invalid_document_request", "The extraction request was invalid.");
  if (error instanceof DocumentIntakeUnavailableError || error instanceof ConfigurationUnavailableError) {
    return safeError(res, 503, "document_extraction_unavailable", "Document extraction is not available.");
  }
  return safeError(res, 503, "document_extraction_unavailable", "The extraction request could not be completed.");
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  const config = getPremiumConfig();
  if (!sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");

  try {
    const context = await requireDocumentIntakeContext(req);
    const { uploadId } = documentExtractRequestSchema.parse(parseJsonBody(req));
    const result = await extractDocument(context, uploadId);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(error, res);
  }
}
