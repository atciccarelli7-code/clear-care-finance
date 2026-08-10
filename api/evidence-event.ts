import {
  parseEvidenceEventPayload,
} from "../src/lib/evidenceEventContract.js";
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
    return safeError(res, 503, "evidence_unavailable", "Evidence collection is not currently available.");
  }

  try {
    const body = parseJsonBody<unknown>(req);
    const evidencePayload = parseEvidenceEventPayload(body);
    const journeyPayload = evidencePayload ? null : parseJourneyEvidencePayload(body);
    if (!evidencePayload && !journeyPayload) {
      return safeError(res, 400, "invalid_evidence_event", "The evidence event is invalid.");
    }

    const admin = getSupabaseAdmin();
    const { error } = evidencePayload
      ? await admin.from("growth_events").insert({
          event_id: evidencePayload.eventId,
          session_id: evidencePayload.sessionId,
          event_name: evidencePayload.eventName,
          surface: evidencePayload.surface,
          destination_id: evidencePayload.destinationId ?? null,
          variant: evidencePayload.variant,
        })
      : await admin.from("journey_events").insert({
          event_id: journeyPayload.eventId,
          session_journey_id: journeyPayload.sessionJourneyId,
          event_name: journeyPayload.eventName,
          journey_key: journeyPayload.journeyKey,
          surface: journeyPayload.surface,
          phase: journeyPayload.phase ?? null,
          step_index: journeyPayload.stepIndex ?? null,
          variant: journeyPayload.variant ?? null,
        });

    if (error && error.code !== "23505") throw new Error("evidence_event_insert_failed");
    return res.status(202).json({ accepted: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return safeError(res, 400, "invalid_json", "The request body is invalid.");
    }
    if (error instanceof ConfigurationUnavailableError) {
      return safeError(res, 503, "evidence_unavailable", "Evidence collection is not currently available.");
    }
    return safeError(res, 503, "evidence_unavailable", "Evidence collection is not currently available.");
  }
}
