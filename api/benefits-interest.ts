import { createHash, createHmac } from "node:crypto";
import { Resend } from "resend";
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

const PRODUCT_ID = "healthcare-worker-benefits-decision-system";
const OFFER_VERSION = "benefits_offer_29_v1";
const OFFER_PRICE_CENTS = 2900;
const OFFER_SOURCE = "total_compensation_comparison";
const COMMITMENT_VERSION = "would_consider_29_v1";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type InterestBody = {
  email?: unknown;
  emailConsent?: unknown;
  priceCommitment?: unknown;
  website?: unknown;
  sessionId?: unknown;
  offerVersion?: unknown;
  priceCents?: unknown;
  source?: unknown;
};

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

const isDuplicateContactError = (message: string) => /already exists|duplicate|conflict/i.test(message);
const isDeliverySetupError = (message: string) =>
  /only send testing emails|verify a domain|verified domain|onboarding@resend\.dev|domain is not verified|sender/i.test(message);

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const hashEmail = (email: string) => createHash("sha256").update(email).digest("hex");

const unsubscribeToken = (email: string) => {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!secret) return "";
  const encoded = Buffer.from(email).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
};

const sender = () => {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return "";
  return configured;
};

const confirmationHtml = (siteUrl: string, unsubscribeUrl: string) => `
  <div style="margin:0;padding:24px 12px;background:#f6f8f5;font-family:Arial,sans-serif;color:#183326;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden;">
      <div style="background:#004022;color:#fff;padding:28px 24px;">
        <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c8f5dd;font-weight:700;">Community Acquired Finance</p>
        <h1 style="margin:0;color:#fff;font-size:30px;line-height:1.15;">Your early-access interest is saved</h1>
      </div>
      <div style="padding:28px 24px;font-size:16px;line-height:1.65;">
        <p style="margin:0 0 18px;">You told us that you would consider paying <strong>$29 one time</strong> for the Healthcare Worker Benefits Decision System if it is released with the described Open Enrollment Workspace.</p>
        <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 10px;color:#004022;font-weight:700;">No payment was collected</p>
          <p style="margin:0;">This is a demand-validation commitment, not a purchase, reservation, account, entitlement, or promise that the product will launch.</p>
        </div>
        <p style="margin:0 0 18px;">Free articles, calculators, checklists, official-source links, and the focused workplace-benefits comparison remain free. The proposed paid value is coordinated employer-specific entry, scenario comparison, source-status tracking, saved work, and a printable Benefits Decision Brief.</p>
        <p style="margin:26px 0;"><a href="${siteUrl}/products/healthcare-worker-benefits-decision-system" style="display:inline-block;background:#005c38;color:#fff;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:999px;">Review the offer</a></p>
        <hr style="border:0;border-top:1px solid #d8ded3;margin:26px 0;" />
        <p style="margin:0 0 10px;color:#53645a;font-size:13px;line-height:1.55;">Do not reply with employer documents, plan details, medical information, member IDs, financial account information, or other sensitive information.</p>
        ${unsubscribeUrl ? `<p style="margin:0;color:#53645a;font-size:13px;line-height:1.55;"><a href="${unsubscribeUrl}" style="color:#005c38;">Unsubscribe</a> from Community Acquired Finance emails.</p>` : ""}
      </div>
    </div>
  </div>
`;

async function saveResendContact(resend: InstanceType<typeof Resend>, email: string) {
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  if (!audienceId) return { saved: false, warning: "Email audience is not configured." };

  const result = (await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId,
  })) as ResendResult;

  if (!result.error) return { saved: true };
  const message = getErrorMessage(result.error);
  if (isDuplicateContactError(message)) {
    const updated = (await resend.contacts.update({
      email,
      audienceId,
      unsubscribed: false,
    })) as ResendResult;
    if (!updated.error) return { saved: true };
    return { saved: false, warning: getErrorMessage(updated.error) };
  }
  return { saved: false, warning: message };
}

async function sendConfirmation(resend: InstanceType<typeof Resend>, email: string, siteUrl: string) {
  const from = sender();
  if (!from) return { delivered: false, warning: "Verified sender is not configured." };

  const token = unsubscribeToken(email);
  const unsubscribeUrl = token ? `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(token)}` : "";
  const headers = unsubscribeUrl
    ? {
        "List-Unsubscribe": `<${unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      }
    : undefined;

  const sent = (await resend.emails.send({
    from,
    to: [email],
    subject: "Benefits Decision System early-access interest saved",
    html: confirmationHtml(siteUrl, unsubscribeUrl),
    headers,
  })) as ResendResult;

  if (!sent.error) return { delivered: true };
  const message = getErrorMessage(sent.error);
  if (isDeliverySetupError(message)) return { delivered: false, warning: "Verified sender is not configured." };
  return { delivered: false, warning: "Confirmation email could not be delivered." };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const config = getPremiumConfig();
  if (!sameOrigin(req, config.siteUrl)) {
    return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  }
  if (!config.supabase.configured) {
    return safeError(res, 503, "interest_unavailable", "Early-access signup is not currently available.");
  }

  try {
    const body = parseJsonBody<InterestBody>(req);
    if (typeof body.website === "string" && body.website.trim()) {
      return res.status(202).json({ ok: true, saved: false, emailDelivered: false });
    }

    const email = normalizeEmail(body.email);
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    if (!emailPattern.test(email) || email.length > 320) {
      return safeError(res, 400, "invalid_email", "Enter a valid email address.");
    }
    if (!uuidPattern.test(sessionId)) {
      return safeError(res, 400, "invalid_session", "Refresh the page and try again.");
    }
    if (body.emailConsent !== true || body.priceCommitment !== true) {
      return safeError(res, 400, "consent_required", "Both confirmation boxes are required.");
    }
    if (
      body.offerVersion !== OFFER_VERSION
      || body.priceCents !== OFFER_PRICE_CENTS
      || body.source !== OFFER_SOURCE
    ) {
      return safeError(res, 400, "offer_mismatch", "The early-access offer could not be verified.");
    }

    const admin = getSupabaseAdmin();
    const now = new Date().toISOString();
    const { error } = await admin.from("benefits_offer_commitments").upsert({
      session_id: sessionId,
      product_id: PRODUCT_ID,
      offer_version: OFFER_VERSION,
      price_cents: OFFER_PRICE_CENTS,
      currency: "usd",
      source: OFFER_SOURCE,
      email,
      email_hash: hashEmail(email),
      email_consent: true,
      price_commitment: true,
      commitment_statement_version: COMMITMENT_VERSION,
      status: "active",
      updated_at: now,
      unsubscribed_at: null,
    }, { onConflict: "product_id,email_hash" });

    if (error) throw new Error(`benefits_commitment_insert_failed:${error.code ?? "unknown"}`);

    let contactSaved = false;
    let emailDelivered = false;
    const warnings: string[] = [];
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (resendKey) {
      const resend = new Resend(resendKey);
      const contact = await saveResendContact(resend, email);
      contactSaved = contact.saved;
      if (contact.warning) warnings.push(contact.warning);
      const confirmation = await sendConfirmation(resend, email, config.siteUrl.replace(/\/$/, ""));
      emailDelivered = confirmation.delivered;
      if (confirmation.warning) warnings.push(confirmation.warning);
    } else {
      warnings.push("Email delivery is not configured.");
    }

    console.info("Benefits offer commitment saved", {
      productId: PRODUCT_ID,
      offerVersion: OFFER_VERSION,
      source: OFFER_SOURCE,
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
    if (error instanceof SyntaxError) {
      return safeError(res, 400, "invalid_json", "The request body is invalid.");
    }
    if (error instanceof ConfigurationUnavailableError) {
      return safeError(res, 503, "interest_unavailable", "Early-access signup is not currently available.");
    }
    console.error("Benefits offer commitment failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return safeError(res, 503, "interest_unavailable", "Early-access signup is not currently available.");
  }
}
