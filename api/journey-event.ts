import { parseJourneyEvidencePayload } from "../src/lib/journeyEventContract.js";
import {
  methodNotAllowed,
  parseJsonBody,
  safeError,
  sameOrigin,
  setPrivateHeaders,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http.js";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import {
  ConfigurationUnavailableError,
  getSupabaseAdmin,
} from "./_lib/supabase.js";

const requestOrigin = (req: ApiRequest) => {
  const raw = req.headers.origin;
  return Array.isArray(raw) ? raw[0] : raw;
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const config = getPremiumConfig();
  if (!requestOrigin(req) || !sameOrigin(req, config.siteUrl)) {
    return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  }
  if (!config.supabase.configured) {
    return safeError(res, 503, "journey_evidence_unavailable", "Journey evidence collection is not currently available.");
  }

  try {
    const payload = parseJourneyEvidencePayload(parseJsonBody<unknown>(req));
    if (!payload) {
      return safeError(res, 400, "invalid_journey_event", "The journey event is invalid.");
    }

    const admin = getSupabaseAdmin();
    const { error } = await admin.from("journey_events").insert({
      event_id: payload.eventId,
      session_journey_id: payload.sessionJourneyId,
      event_name: payload.eventName,
      journey_key: payload.journeyKey,
      surface: payload.surface,
      phase: payload.phase ?? null,
      step_index: payload.stepIndex ?? null,
      variant: payload.variant ?? null,
    });

    if (error && error.code !== "23505") throw new Error("journey_event_insert_failed");
    return res.status(202).json({ accepted: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return safeError(res, 400, "invalid_json", "The request body is invalid.");
    }
    if (error instanceof ConfigurationUnavailableError) {
      return safeError(res, 503, "journey_evidence_unavailable", "Journey evidence collection is not currently available.");
    }
    return safeError(res, 503, "journey_evidence_unavailable", "Journey evidence collection is not currently available.");
  }
}
