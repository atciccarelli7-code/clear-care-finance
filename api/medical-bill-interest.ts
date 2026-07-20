import { createHmac } from "node:crypto";
import { Resend } from "resend";

type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type InterestBody = {
  email?: string;
  firstName?: string;
  consent?: boolean;
  website?: string;
  source?: string;
};

type ResendResult = { data?: { id?: string } | null; error?: unknown };

type SequenceMessage = {
  subject: string;
  html: string;
  scheduledAt?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fallbackFromEmail = "Community Acquired Finance <onboarding@resend.dev>";
const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();

const parseBody = (body: unknown): InterestBody => {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as InterestBody;
    } catch {
      return {};
    }
  }
  return body as InterestBody;
};

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const errorMessage = (error: unknown) => {
  if (!error) return "Unknown Resend error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return JSON.stringify(error);
};

const isDuplicate = (message: string) => /already exists|duplicate|conflict/i.test(message);
const isDeliverySetupError = (message: string) =>
  /only send testing emails|verify a domain|verified domain|onboarding@resend\.dev|domain is not verified|sender/i.test(message);

const getFromEmail = () => process.env.RESEND_FROM_EMAIL?.trim() || fallbackFromEmail;
const getUnsubscribeSecret = () =>
  process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || process.env.RESEND_API_KEY?.trim() || "";

const buildUnsubscribeUrl = (email: string) => {
  const secret = getUnsubscribeSecret();
  if (!secret) return "https://communityacquiredfinance.com/contact";
  const encodedEmail = Buffer.from(email, "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encodedEmail).digest("base64url");
  return `https://communityacquiredfinance.com/api/unsubscribe?token=${encodedEmail}.${signature}`;
};

const emailShell = (
  title: string,
  intro: string,
  body: string,
  ctaLabel: string,
  ctaHref: string,
  unsubscribeUrl: string,
  firstName?: string,
) => {
  const greeting = firstName?.trim() ? `Hi ${escapeHtml(firstName.trim())},` : "Hi,";
  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(intro)}</div>
    <div style="margin:0;padding:24px 12px;background:#f6f8f5;font-family:Arial,sans-serif;color:#183326;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden;">
        <div style="background:#004022;color:#ffffff;padding:28px 24px;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c8f5dd;font-weight:700;">Community Acquired Finance</p>
          <h1 style="margin:0;color:#ffffff;font-size:29px;line-height:1.15;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:28px 24px;font-size:16px;line-height:1.65;">
          <p style="margin:0 0 18px;">${greeting}</p>
          <p style="margin:0 0 20px;">${escapeHtml(intro)}</p>
          ${body}
          <p style="margin:26px 0;"><a href="${ctaHref}" style="display:inline-block;background:#005c38;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:999px;">${escapeHtml(ctaLabel)}</a></p>
          <div style="border-left:4px solid #7ccca2;padding-left:14px;margin:24px 0;color:#314439;">
            <p style="margin:0;">Do not email bills, account numbers, member IDs, claim numbers, diagnoses, or other protected information.</p>
          </div>
          <hr style="border:0;border-top:1px solid #d8ded3;margin:26px 0;" />
          <p style="margin:0 0 8px;color:#53645a;font-size:13px;line-height:1.55;">Educational only. This email is not individualized medical, legal, insurance, coding, billing, tax, or financial advice.</p>
          <p style="margin:0;color:#53645a;font-size:13px;line-height:1.55;"><a href="${unsubscribeUrl}" style="color:#005c38;">Unsubscribe here</a>.</p>
        </div>
      </div>
    </div>
  `;
};

const sequence = (email: string, firstName?: string): SequenceMessage[] => {
  const unsubscribeUrl = buildUnsubscribeUrl(email);
  return [
    {
      subject: "Start with the medical-bill document, not the balance",
      html: emailShell(
        "Identify the document first",
        "Before making a payment or beginning a long call, identify whether you have an EOB, provider bill, denial notice, assistance form, or collection notice.",
        `<ol style="padding-left:22px;margin:0;"><li style="margin-bottom:10px;">Match the service date and billing entity.</li><li style="margin-bottom:10px;">Check whether the payer says the claim is pending, processed, adjusted, or denied.</li><li>Write down the next deadline and the organization that owns the next action.</li></ol>`,
        "Open the Medical Bill Response System",
        "https://communityacquiredfinance.com/insurance/medical-bill-review-toolkit",
        unsubscribeUrl,
        firstName,
      ),
    },
    {
      subject: "How to compare an EOB with a provider bill",
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      html: emailShell(
        "Compare only matching claim lines",
        "An EOB is generally not a bill. Compare documents only when the service date and billing entity refer to the same claim.",
        `<ul style="padding-left:22px;margin:0;"><li style="margin-bottom:10px;">Find billed charge, allowed amount, plan payment, and patient responsibility.</li><li style="margin-bottom:10px;">Confirm the provider balance matches the payer explanation.</li><li>A mismatch needs an explanation; it does not automatically prove an error.</li></ul>`,
        "Use the EOB-to-Bill Match Checker",
        "https://communityacquiredfinance.com/tools/eob-to-bill-match-checker",
        unsubscribeUrl,
        firstName,
      ),
    },
    {
      subject: "Organize calls, assistance, denials, and deadlines",
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      html: emailShell(
        "Create one record of the process",
        "The value of organization is not proving that a bill is wrong. It is preventing lost deadlines, repeated calls, and conflicting promises.",
        `<ul style="padding-left:22px;margin:0;"><li style="margin-bottom:10px;">Record the representative, reference number, request, and follow-up date.</li><li style="margin-bottom:10px;">Request written policies and explanations when available.</li><li>Check hospital financial assistance before accepting a long payment plan.</li></ul>`,
        "Open the free Response Pack",
        "https://communityacquiredfinance.com/downloads/medical-bill-response-pack.html",
        unsubscribeUrl,
        firstName,
      ),
    },
    {
      subject: "Preview the expanded medical-bill organization workbook",
      scheduledAt: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
      html: emailShell(
        "A deeper organization system is being tested",
        "Community Acquired Finance has built a 32-page workbook foundation for document inventories, EOB comparisons, call logs, assistance, denials, collections, deadlines, and caregiver coordination. Checkout is not active while usefulness and audience demand are validated.",
        `<p style="margin:0;">The free guidance remains free. The expanded workbook is being evaluated as a future one-time organizational product, not a bill-negotiation or advice service.</p>`,
        "Preview sample workbook pages",
        "https://communityacquiredfinance.com/downloads/expanded-medical-bill-response-workbook-preview.html",
        unsubscribeUrl,
        firstName,
      ),
    },
  ];
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "POST");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "Email service is not configured yet." });

  const body = parseBody(req.body);
  const email = body.email?.trim().toLowerCase();
  const firstName = body.firstName?.trim();
  const source = body.source?.trim() || "medical-bill-product";

  if (body.website?.trim()) return res.status(200).json({ ok: true, saved: false, emailDelivered: false });
  if (!email || !emailPattern.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (body.consent !== true) return res.status(400).json({ error: "Consent is required before joining the list." });
  if (!audienceId) return res.status(503).json({ error: "The email audience is not configured yet." });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const contact = (await resend.contacts.create({
      email,
      firstName: firstName || undefined,
      unsubscribed: false,
      audienceId,
    })) as ResendResult;

    if (contact.error && !isDuplicate(errorMessage(contact.error))) {
      console.warn("Medical bill contact save failed", { source, reason: errorMessage(contact.error) });
      return res.status(500).json({ error: "Signup could not be saved. Try again in a minute." });
    }

    const from = getFromEmail();
    if (from === fallbackFromEmail) {
      return res.status(200).json({
        ok: true,
        saved: true,
        emailDelivered: false,
        sequenceScheduled: false,
        warning: "Interest saved; verified sender configuration is still required for delivery.",
      });
    }

    const unsubscribeUrl = buildUnsubscribeUrl(email);
    const messages = sequence(email, firstName);
    const results: ResendResult[] = [];
    for (const message of messages) {
      const payload = {
        from,
        to: [email],
        subject: message.subject,
        html: message.html,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        ...(message.scheduledAt ? { scheduledAt: message.scheduledAt } : {}),
      };
      results.push((await resend.emails.send(payload)) as ResendResult);
    }

    const failures = results.filter((result) => result.error);
    if (failures.length) {
      const message = errorMessage(failures[0].error);
      if (isDeliverySetupError(message)) {
        return res.status(200).json({
          ok: true,
          saved: true,
          emailDelivered: false,
          sequenceScheduled: false,
          warning: "Interest saved; verified sender configuration is still required for delivery.",
        });
      }
      console.error("Medical bill sequence scheduling failed", { source, failedCount: failures.length });
      return res.status(200).json({
        ok: true,
        saved: true,
        emailDelivered: results[0]?.error ? false : true,
        sequenceScheduled: false,
        warning: "Interest saved, but the full email sequence could not be scheduled.",
      });
    }

    console.info("Medical bill sequence accepted", { source, messageCount: results.length });
    return res.status(200).json({ ok: true, saved: true, emailDelivered: true, sequenceScheduled: true });
  } catch (error) {
    console.error("Medical bill interest exception", { source, reason: errorMessage(error) });
    return res.status(500).json({ error: "Signup could not be completed." });
  }
}
