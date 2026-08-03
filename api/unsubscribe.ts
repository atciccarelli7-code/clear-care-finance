import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import { getSupabaseAdmin } from "./_lib/supabase.js";

type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

const getSecret = () =>
  process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() ||
  process.env.RESEND_API_KEY?.trim() ||
  "";

const base64UrlDecode = (value: string) => {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return "";
  }
};

const sign = (encodedEmail: string, secret: string) =>
  createHmac("sha256", secret).update(encodedEmail).digest("base64url");

const readToken = (req: ApiRequest) => {
  const queryToken = req.query?.token;
  if (typeof queryToken === "string") return queryToken;

  if (typeof req.body === "string") {
    try {
      const parsed = JSON.parse(req.body) as { token?: unknown };
      return typeof parsed.token === "string" ? parsed.token : "";
    } catch {
      const params = new URLSearchParams(req.body);
      return params.get("token") ?? "";
    }
  }

  if (req.body && typeof req.body === "object" && "token" in req.body) {
    const token = (req.body as { token?: unknown }).token;
    return typeof token === "string" ? token : "";
  }

  return "";
};

const verifyToken = (token: string) => {
  const [encodedEmail, providedSignature] = token.split(".");
  const secret = getSecret();
  if (!encodedEmail || !providedSignature || !secret) return "";

  const expectedSignature = sign(encodedEmail, secret);
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return "";

  const email = base64UrlDecode(encodedEmail).trim().toLowerCase();
  return emailPattern.test(email) ? email : "";
};

const htmlPage = (token: string, state: "confirm" | "success" | "error", message?: string) => {
  const title = state === "success" ? "You are unsubscribed" : state === "error" ? "Unsubscribe could not be completed" : "Unsubscribe from Community Acquired Finance";
  const detail =
    message ??
    (state === "success"
      ? "This address has been marked unsubscribed from Community Acquired Finance email updates and active early-access records."
      : state === "error"
        ? "The unsubscribe link is invalid or expired. Contact Community Acquired Finance for help."
        : "Confirm that you no longer want educational or product early-access emails from Community Acquired Finance.");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${title}</title>
  <style>
    body{margin:0;background:#f6f8f5;color:#173b2e;font-family:Arial,sans-serif;line-height:1.55}
    main{max-width:680px;margin:8vh auto;padding:24px}
    section{background:#fff;border:1px solid #d8ded3;border-radius:24px;padding:32px;box-shadow:0 12px 34px rgba(23,59,46,.08)}
    h1{font-size:30px;line-height:1.15;margin:0 0 16px}p{margin:0 0 18px;color:#53645a}
    button,a{display:inline-block;border:0;border-radius:999px;padding:13px 18px;font-weight:700;text-decoration:none;cursor:pointer}
    button{background:#0b5b42;color:#fff}a{color:#0b5b42;border:1px solid #c8d2cc}
    .small{font-size:13px;margin-top:24px}
  </style>
</head>
<body>
  <main>
    <section>
      <div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0b5b42;margin-bottom:10px">Community Acquired Finance</div>
      <h1>${title}</h1>
      <p>${detail}</p>
      ${state === "confirm" ? `<form method="post" action="/api/unsubscribe"><input type="hidden" name="token" value="${token.replace(/"/g, "&quot;")}" /><button type="submit">Confirm unsubscribe</button></form>` : `<a href="/">Return to the website</a>`}
      <p class="small">This page does not collect medical, billing, insurance, benefit-plan, or payment information.</p>
    </section>
  </main>
</body>
</html>`;
};

const markBenefitsInterestUnsubscribed = async (email: string) => {
  const config = getPremiumConfig();
  if (!config.supabase.configured) return { attempted: false, updated: false };

  const timestamp = new Date().toISOString();
  const { error } = await getSupabaseAdmin()
    .from("benefits_offer_commitments")
    .update({
      status: "unsubscribed",
      unsubscribed_at: timestamp,
      updated_at: timestamp,
    })
    .eq("email_hash", createHash("sha256").update(email).digest("hex"));

  if (error) {
    console.error("Benefits early-access unsubscribe update failed", { code: error.code ?? "unknown" });
    return { attempted: true, updated: false };
  }
  return { attempted: true, updated: true };
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Allow", "GET, POST");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).send(htmlPage("", "error", "This endpoint accepts only unsubscribe confirmation requests."));
  }

  const token = readToken(req);
  const email = verifyToken(token);
  if (!email) return res.status(400).send(htmlPage("", "error"));

  if (req.method === "GET") return res.status(200).send(htmlPage(token, "confirm"));

  const benefitsUpdate = await markBenefitsInterestUnsubscribed(email);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY && audienceId);
  if (!resendConfigured) {
    if (benefitsUpdate.updated) {
      console.info("Benefits early-access contact unsubscribed", { databaseUpdated: true, resendUpdated: false });
      return res.status(200).send(htmlPage("", "success", "This address has been removed from the Benefits Decision System early-access list. Contact Community Acquired Finance if you joined another email list."));
    }
    return res.status(503).send(htmlPage("", "error", "The unsubscribe service is not fully configured. Contact Community Acquired Finance for help."));
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.contacts.update({
      email,
      audienceId,
      unsubscribed: true,
    });

    if (result.error) {
      console.error("Resend unsubscribe update failed", {
        message: typeof result.error === "object" && result.error && "message" in result.error ? String(result.error.message) : "unknown",
        benefitsRecordUpdated: benefitsUpdate.updated,
      });
      return res.status(500).send(htmlPage("", "error", "The unsubscribe request could not be completed across all email records. Try again later or contact Community Acquired Finance."));
    }

    console.info("Community Acquired Finance contact unsubscribed", {
      resendUpdated: true,
      benefitsRecordUpdated: benefitsUpdate.updated,
      benefitsRecordAttempted: benefitsUpdate.attempted,
    });
    return res.status(200).send(htmlPage("", "success"));
  } catch (error) {
    console.error("Resend unsubscribe exception", {
      benefitsRecordUpdated: benefitsUpdate.updated,
      message: error instanceof Error ? error.message : "unknown",
    });
    return res.status(500).send(htmlPage("", "error", "The unsubscribe request could not be completed across all email records. Try again later or contact Community Acquired Finance."));
  }
}
