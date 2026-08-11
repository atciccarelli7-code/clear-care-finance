import { createHash, createHmac } from "node:crypto";
import { Resend } from "resend";
import {
  parsePreCommerceCommitmentPayload,
  resolvePreCommerceOffer,
} from "../src/lib/preCommerceOfferContract.js";
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
import { ConfigurationUnavailableError, getSupabaseAdmin } from "./_lib/supabase.js";

type ResendResult = {
  data?: { id?: string } | null;
  error?: unknown;
};

const getErrorMessage = (error: unknown) => {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return "Unknown error";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isDuplicateContactError = (message: string) => /already exists|duplicate|conflict/i.test(message);
const isDeliverySetupError = (message: string) =>
  /only send testing emails|verify a domain|verified domain|onboarding@resend\.dev|domain is not verified|sender/i.test(message);
const hashEmail = (email: string) => createHash("sha256").update(email).digest("hex");

const unsubscribeToken = (email: string) => {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!secret) return "";
  const encoded = Buffer.from(email).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const confirmationHtml = (siteUrl: string, unsubscribeUrl: string) => `
  <div style="margin:0;padding:24px 12px;background:#f6f8f5;font-family:Arial,sans-serif;color:#183326;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden;">
      <div style="background:#004022;color:#fff;padding:28px 24px;">
        <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c8f5dd;font-weight:700;">Community Acquired Finance</p>
        <h1 style="margin:0;color:#fff;font-size:30px;line-height:1.15;">Your price-qualified interest is recorded</h1>
      </div>
      <div style="padding:28px 24px;font-size:16px;line-height:1.65;">
        <p style="margin:0 0 18px;">You told CAF that, based on the description you reviewed, you would seriously consider paying <strong>$29 one time</strong> for the proposed Benefits Decision Workspace if it launches.</p>
        <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 10px;color:#004022;font-weight:700;">No payment was collected</p>
          <p style="margin:0;">This is price-qualified stated intent, not a purchase, reservation, account, entitlement, obligation, or promise that the workspace will launch.</p>
        </div>
        <p style="margin:0 0 18px;">The complete browser-local workflow, two-medical-plan comparison, verification checklist, Decision Brief, printing, and official-source verification remain free. The proposed paid value is cross-device saved work, multiple decision workspaces, deeper multi-option comparison, a structured evidence ledger, and a consolidated advanced brief.</p>
        <p style="margin:26px 0;"><a href="${siteUrl}/products/healthcare-worker-benefits-decision-system" style="display:inline-block;background:#005c38;color:#fff;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:999px;">Return to the free system</a></p>
        <hr style="border:0;border-top:1px solid #d8ded3;margin:26px 0;" />
        <p style="margin:0 0 10px;color:#53645a;font-size:13px;line-height:1.55;">Do not reply with employer documents, plan details, medical information, member IDs, financial account information, or payment information.</p>
        ${unsubscribeUrl ? `<p style="margin:0;color:#53645a;font-size:13px;line-height:1.55;"><a href="${unsubscribeUrl}" style="color:#005c38;">Unsubscribe</a> from product-specific emails.</p>` : ""}
      </div>
    </div>
  </div>
`;

async function saveResendContact(resend: InstanceType<typeof Resend>, email: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) return { saved: false, warning: "Email audience is not configured." };
  const result = (await resend.contacts.create({ email, unsubscribed: false, audienceId })) as ResendResult;
  if (!result.error) return { saved: true };
  const message = getErrorMessage(result.error);
  if (!isDuplicateContactError(message)) return { saved: false, warning: message };
  const updated = (await resend.contacts.update({ email, audienceId, unsubscribed: false })) as ResendResult;
  return updated.error
    ? { saved: false, warning: getErrorMessage(updated.error) }
    : { saved: true };
}

async function sendConfirmation(resend: InstanceType<typeof Resend>, email: string, siteUrl: string) {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!from) return { delivered: false, warning: "Verified sender is not configured." };
  const token = unsubscribeToken(email);
  const unsubscribeUrl = token ? `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(token)}` : "";
  const headers = unsubscribeUrl
    ? { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" }
    : undefined;
  const sent = (await resend.emails.send({
    from,
    to: [email],
    subject: "Benefits Decision Workspace interest recorded",
    html: confirmationHtml(siteUrl, unsubscribeUrl),
    headers,
  })) as ResendResult;
  if (!sent.error) return { delivered: true };
  return {
    delivered: false,
    warning: isDeliverySetupError(getErrorMessage(sent.error))
      ? "Verified sender is not configured."
      : "Confirmation email could not be delivered.",
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const config = getPremiumConfig();
  const origin = Array.isArray(req.headers.origin) ? req.headers.origin[0] : req.headers.origin;
  if (!origin || !sameOrigin(req, config.siteUrl)) return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  if (!config.supabase.configured) return safeError(res, 503, "commitment_unavailable", "Price-qualified interest cannot be recorded right now.");

  try {
    const rawBody = parseJsonBody<unknown>(req);
    if (isRecord(rawBody) && typeof rawBody.website === "string" && rawBody.website.trim()) {
      return res.status(202).json({ ok: true, saved: false, emailDelivered: false });
    }
    const body = parsePreCommerceCommitmentPayload(rawBody);
    if (!body) return safeError(res, 400, "invalid_commitment", "Review the offer and complete both confirmation boxes.");
    const offer = resolvePreCommerceOffer(body.offerKey);
    if (!offer) return safeError(res, 400, "offer_mismatch", "The proposed offer could not be verified.");

    const admin = getSupabaseAdmin();
    const emailHash = hashEmail(body.email);
    const { data: existing, error: existingError } = await admin
      .from("benefits_offer_commitments")
      .select("evidence_class,status")
      .eq("product_id", offer.productId)
      .eq("email_hash", emailHash)
      .maybeSingle();
    if (existingError) throw new Error(`precommerce_commitment_read_failed:${existingError.code ?? "unknown"}`);

    const evidenceClass = existing?.evidence_class === "observed" ? "observed" : body.evidenceClass;
    const status = existing?.status === "excluded" ? "excluded" : "active";
    const now = new Date().toISOString();
    const { error } = await admin.from("benefits_offer_commitments").upsert({
      session_id: body.sessionId,
      product_id: offer.productId,
      offer_version: offer.offerVersion,
      price_cents: offer.priceCents,
      currency: offer.currency,
      source: offer.source,
      email: body.email,
      email_hash: emailHash,
      email_consent: true,
      price_commitment: true,
      commitment_statement_version: offer.statementVersion,
      evidence_class: evidenceClass,
      status,
      updated_at: now,
      unsubscribed_at: null,
    }, { onConflict: "product_id,email_hash" });
    if (error) throw new Error(`precommerce_commitment_insert_failed:${error.code ?? "unknown"}`);

    let contactSaved = false;
    let emailDelivered = false;
    const warnings: string[] = [];
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (evidenceClass === "release_verification") {
      warnings.push("Release-verification records do not trigger email delivery.");
    } else if (resendKey) {
      const resend = new Resend(resendKey);
      const contact = await saveResendContact(resend, body.email);
      contactSaved = contact.saved;
      if (contact.warning) warnings.push(contact.warning);
      const confirmation = await sendConfirmation(resend, body.email, config.siteUrl.replace(/\/$/, ""));
      emailDelivered = confirmation.delivered;
      if (confirmation.warning) warnings.push(confirmation.warning);
    } else {
      warnings.push("Email delivery is not configured.");
    }

    console.info("Pre-commerce commitment saved", {
      offerKey: offer.offerKey,
      offerVersion: offer.offerVersion,
      evidenceClass,
      contactSaved,
      emailDelivered,
    });
    return res.status(200).json({
      ok: true,
      saved: true,
      emailDelivered,
      contactSaved,
      warning: warnings.length ? warnings.join(" ") : undefined,
    });
  } catch (error) {
    if (error instanceof SyntaxError) return safeError(res, 400, "invalid_json", "The request body is invalid.");
    if (error instanceof ConfigurationUnavailableError) return safeError(res, 503, "commitment_unavailable", "Price-qualified interest cannot be recorded right now.");
    console.error("Pre-commerce commitment failed", { message: error instanceof Error ? error.message : "unknown" });
    return safeError(res, 503, "commitment_unavailable", "Price-qualified interest cannot be recorded right now.");
  }
}
