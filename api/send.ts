import { createHmac } from "node:crypto";
import { Resend } from "resend";

type ApiRequest = {
  method?: string;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type Estimate403b = {
  hourly?: string;
  hoursWeek?: string;
  payFrequency?: string;
  contributionPercent?: string;
  employerMatchPercent?: string;
  contributionType?: string;
  grossPerCheck?: string;
  employeePerCheck?: string;
  annualEmployee?: string;
  annualEmployer?: string;
  totalRetirement?: string;
  taxableReduction?: string;
  estimatedTaxSavings?: string;
};

type EmailType =
  | "newsletter"
  | "403b-estimate"
  | "medical-bill-sequence"
  | "medical-bill-product-interest"
  | "benefits-system-interest";

type SendBody = {
  email?: string;
  firstName?: string;
  consent?: boolean;
  website?: string;
  source?: string;
  type?: EmailType;
  estimate?: Estimate403b;
};

type ResendActionResult = {
  data?: { id?: string } | null;
  error?: unknown;
};

type NewsletterContactResult = {
  ok: boolean;
  skipped: boolean;
  duplicate: boolean;
  id?: string;
  error?: string;
};

const fallbackFromEmail = "Community Acquired Finance <onboarding@resend.dev>";
const notifyEmail = process.env.RESEND_NOTIFY_EMAIL?.trim();
const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
const siteUrl = (process.env.PUBLIC_SITE_URL?.trim() || "https://communityacquiredfinance.com").replace(/\/$/, "");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namedEmailPattern = /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/;
const looseEmailPattern = /[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+/;

function getFromEmail() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return fallbackFromEmail;
  if (emailPattern.test(configured) || namedEmailPattern.test(configured)) return configured;

  const extractedEmail = configured.match(looseEmailPattern)?.[0];
  if (extractedEmail && emailPattern.test(extractedEmail)) {
    console.warn("RESEND_FROM_EMAIL was malformed. Reformatting around extracted email address.");
    return `Community Acquired Finance <${extractedEmail}>`;
  }

  console.warn("Invalid RESEND_FROM_EMAIL. Falling back to onboarding@resend.dev.");
  return fallbackFromEmail;
}

function parseBody(body: unknown): SendBody {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as SendBody;
    } catch {
      return {};
    }
  }
  return body as SendBody;
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safe(value?: string, fallback = "Not provided") {
  return escapeHtml(value?.trim() || fallback);
}

function getResendErrorMessage(error: unknown) {
  if (!error) return "Unknown Resend error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return JSON.stringify(error);
}

function isDuplicateContactError(message: string) {
  return /already exists|duplicate|conflict/i.test(message);
}

function isDeliverySetupError(message: string) {
  return /only send testing emails|verify a domain|verified domain|onboarding@resend\.dev|domain is not verified|sender/i.test(message);
}

function createUnsubscribeToken(email: string) {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim() || process.env.RESEND_API_KEY?.trim();
  if (!secret) return "";
  const encoded = Buffer.from(email.toLowerCase()).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function getUnsubscribeUrl(email: string) {
  const token = createUnsubscribeToken(email);
  return token ? `${siteUrl}/api/unsubscribe?token=${encodeURIComponent(token)}` : "";
}

function emailFrame({
  preheader,
  title,
  greeting,
  body,
  ctaLabel,
  ctaHref,
  unsubscribeUrl,
}: {
  preheader: string;
  title: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  unsubscribeUrl?: string;
}) {
  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
    <div style="margin:0;padding:24px 12px;background:#f6f8f5;font-family:Arial,sans-serif;color:#183326;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden;">
        <div style="background:#004022;color:#fff;padding:28px 24px;">
          <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c8f5dd;font-weight:700;">Community Acquired Finance</p>
          <h1 style="margin:0;color:#fff;font-size:30px;line-height:1.15;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:28px 24px;font-size:16px;line-height:1.65;">
          <p style="margin:0 0 18px;">${greeting}</p>
          ${body}
          <p style="margin:26px 0;"><a href="${ctaHref}" style="display:inline-block;background:#005c38;color:#fff;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:999px;">${escapeHtml(ctaLabel)}</a></p>
          <hr style="border:0;border-top:1px solid #d8ded3;margin:26px 0;" />
          <p style="margin:0 0 10px;color:#53645a;font-size:13px;line-height:1.55;">Educational only. This email is not individualized medical, legal, tax, insurance, billing, credit, or financial advice.</p>
          ${unsubscribeUrl ? `<p style="margin:0;color:#53645a;font-size:13px;line-height:1.55;"><a href="${unsubscribeUrl}" style="color:#005c38;">Unsubscribe</a> from Community Acquired Finance educational emails.</p>` : ""}
        </div>
      </div>
    </div>
  `;
}

function greeting(firstName?: string) {
  return firstName?.trim() ? `Hi ${escapeHtml(firstName.trim())},` : "Hi,";
}

function buildHealthcareWorkerMoneyMapEmail(firstName: string | undefined, unsubscribeUrl: string) {
  return emailFrame({
    preheader: "A practical starting point for healthcare-worker money decisions.",
    title: "Your Healthcare Worker Money Map",
    greeting: greeting(firstName),
    body: `
      <p style="margin:0 0 18px;">Thanks for signing up. Community Acquired Finance organizes healthcare-worker paychecks, benefits, insurance, debt, healthcare costs, and investing without spam or generic finance noise.</p>
      <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;color:#004022;font-weight:700;">Use this first-pass order:</p>
        <ol style="margin:0;padding-left:22px;">
          <li style="margin-bottom:8px;">Protect cash flow and maintain an emergency buffer.</li>
          <li style="margin-bottom:8px;">Capture valuable employer retirement and benefit dollars.</li>
          <li style="margin-bottom:8px;">Compare insurance by total risk, not only premium.</li>
          <li>Keep investing simple enough to sustain during stressful work seasons.</li>
        </ol>
      </div>
      <p style="margin:0;">Expect low-frequency, practical explanations and tool updates.</p>`,
    ctaLabel: "Open the Healthcare Worker Hub",
    ctaHref: `${siteUrl}/healthcare-workers`,
    unsubscribeUrl,
  });
}

function buildMedicalBillStartEmail(firstName: string | undefined, unsubscribeUrl: string) {
  return emailFrame({
    preheader: "Identify the document and reduce the billing problem to one next action.",
    title: "Start with the document, not the dollar amount",
    greeting: greeting(firstName),
    body: `
      <p style="margin:0 0 18px;">This is the first medical-bill response email you requested. Do not reply with bill details, diagnoses, account numbers, claim numbers, member IDs, or other protected information.</p>
      <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 12px;color:#004022;font-weight:700;">Your first 15 minutes:</p>
        <ol style="margin:0;padding-left:22px;">
          <li style="margin-bottom:8px;">Identify whether you have an EOB, provider bill, denial, assistance form, or collection notice.</li>
          <li style="margin-bottom:8px;">Match the service date and billing entity.</li>
          <li style="margin-bottom:8px;">Check whether the payer says the claim is pending, processed, adjusted, or denied.</li>
          <li style="margin-bottom:8px;">Copy every written deadline exactly.</li>
          <li>Assign one organization and one specific next request.</li>
        </ol>
      </div>
      <p style="margin:0 0 18px;">An EOB is generally not a bill. A mismatch is a reason to reconcile the records, not proof that a charge is wrong.</p>
      <p style="margin:0;color:#53645a;font-size:14px;">The remaining three educational emails are prepared but will not be scheduled through direct transactional email until a provider-side automation is configured to honor unsubscribe changes before each send.</p>`,
    ctaLabel: "Open the Medical Bill Response System",
    ctaHref: `${siteUrl}/insurance/medical-bill-review-toolkit`,
    unsubscribeUrl,
  });
}

function buildProductInterestEmail(firstName: string | undefined, unsubscribeUrl: string) {
  return emailFrame({
    preheader: "Your interest in the Expanded Medical Bill Response Workbook was saved.",
    title: "You are on the workbook launch list",
    greeting: greeting(firstName),
    body: `
      <p style="margin:0 0 18px;">Your interest in the Expanded Medical Bill Response Workbook was saved. No payment was collected and no purchase obligation was created.</p>
      <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 10px;color:#004022;font-weight:700;">Planned product boundary</p>
        <p style="margin:0;">Essential rights, official sources, document identification, and the free response pack remain free. The $24 one-time workbook adds reusable organization, scripts, worksheets, deadlines, and caregiver coordination.</p>
      </div>
      <p style="margin:0;">You will receive a launch notice only after secure hosted checkout and delivery are authorized and verified.</p>`,
    ctaLabel: "Preview the Workbook",
    ctaHref: `${siteUrl}/products/expanded-medical-bill-response-workbook`,
    unsubscribeUrl,
  });
}

function buildBenefitsSystemInterestEmail(firstName: string | undefined, unsubscribeUrl: string) {
  return emailFrame({
    preheader: "Your Healthcare Worker Benefits Decision System early-access interest was saved.",
    title: "You are on the Benefits Decision System early-access list",
    greeting: greeting(firstName),
    body: `
      <p style="margin:0 0 18px;">Your interest in the Healthcare Worker Benefits Decision System was saved. No payment was collected and no purchase obligation was created.</p>
      <div style="background:#f6f8f5;border:1px solid #d8ded3;border-radius:18px;padding:20px;margin:24px 0;">
        <p style="margin:0 0 10px;color:#004022;font-weight:700;">What early access will test</p>
        <p style="margin:0;">Whether a secure, account-based workspace helps healthcare workers compare job offers, benefits, health-plan exposure, retirement value, schedule tradeoffs, verification questions, and a final written decision.</p>
      </div>
      <p style="margin:0;">You will receive a launch notice only after authentication, secure checkout, entitlement fulfillment, refund, privacy, and support steps are authorized and verified.</p>`,
    ctaLabel: "Review the Decision System",
    ctaHref: `${siteUrl}/products/healthcare-worker-benefits-decision-system`,
    unsubscribeUrl,
  });
}

function row(label: string, value?: string) {
  return `<tr><td style="padding:10px 12px;border-bottom:1px solid #d8ded3;color:#53645a;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #d8ded3;color:#183326;font-weight:700;text-align:right;">${safe(value)}</td></tr>`;
}

function build403bEstimateEmail(firstName: string | undefined, estimate: Estimate403b = {}) {
  return `
    <div style="font-family:Arial,sans-serif;color:#183326;line-height:1.55;max-width:680px;">
      <p>${greeting(firstName)}</p>
      <h1 style="color:#004022;font-size:28px;line-height:1.2;">Your 403(b) paycheck estimate</h1>
      <p>Use this planning snapshot, then verify actual deductions in your employer benefits or payroll portal.</p>
      <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #d8ded3;">
        ${row("Hourly wage", estimate.hourly)}
        ${row("Hours per week", estimate.hoursWeek)}
        ${row("Pay frequency", estimate.payFrequency)}
        ${row("Your contribution", estimate.contributionPercent)}
        ${row("Employer match", estimate.employerMatchPercent)}
        ${row("Contribution type", estimate.contributionType)}
        ${row("Estimated gross paycheck", estimate.grossPerCheck)}
        ${row("Employee contribution / paycheck", estimate.employeePerCheck)}
        ${row("Annual employee contribution", estimate.annualEmployee)}
        ${row("Estimated employer match / year", estimate.annualEmployer)}
        ${row("Total retirement savings / year", estimate.totalRetirement)}
        ${row("Estimated taxable income reduction", estimate.taxableReduction)}
        ${estimate.estimatedTaxSavings ? row("Estimated tax savings", estimate.estimatedTaxSavings) : ""}
      </table>
      <p style="margin-top:20px;"><a href="${siteUrl}/tools/403b-paycheck-calculator" style="color:#005c38;font-weight:700;">Reopen the 403(b) calculator</a>.</p>
      <p style="color:#53645a;font-size:13px;">Educational estimate only. Verify plan rules, limits, payroll timing, and tax treatment.</p>
    </div>`;
}

async function saveNewsletterContact(resend: InstanceType<typeof Resend>, email: string, source = "site"): Promise<NewsletterContactResult> {
  if (!audienceId) {
    console.warn("RESEND_AUDIENCE_ID not configured; skipping newsletter contact save", { source });
    return { ok: false, skipped: true, duplicate: false, error: "Audience not configured" };
  }

  const contact = (await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId,
  })) as ResendActionResult;

  if (!contact.error) {
    console.info("Newsletter contact saved", { id: contact.data?.id, source });
    return { ok: true, skipped: false, id: contact.data?.id, duplicate: false };
  }

  const message = getResendErrorMessage(contact.error);
  if (isDuplicateContactError(message)) {
    console.info("Newsletter contact already exists", { source });
    return { ok: true, skipped: false, duplicate: true };
  }

  console.warn("Newsletter contact save skipped", { message, source });
  return { ok: false, skipped: false, error: message, duplicate: false };
}

function emailPayload(type: EmailType, firstName: string | undefined, estimate: Estimate403b | undefined, unsubscribeUrl: string) {
  if (type === "403b-estimate") {
    return {
      subject: "Your 403(b) paycheck estimate",
      html: build403bEstimateEmail(firstName, estimate),
      sequenceStatus: "not_applicable" as const,
    };
  }
  if (type === "medical-bill-sequence") {
    return {
      subject: "Medical bill first step: identify the document",
      html: buildMedicalBillStartEmail(firstName, unsubscribeUrl),
      sequenceStatus: "first_email_only" as const,
    };
  }
  if (type === "medical-bill-product-interest") {
    return {
      subject: "Expanded Medical Bill Workbook launch list",
      html: buildProductInterestEmail(firstName, unsubscribeUrl),
      sequenceStatus: "provider_automation_required" as const,
    };
  }
  if (type === "benefits-system-interest") {
    return {
      subject: "Healthcare Worker Benefits Decision System early access",
      html: buildBenefitsSystemInterestEmail(firstName, unsubscribeUrl),
      sequenceStatus: "provider_automation_required" as const,
    };
  }
  return {
    subject: "Welcome — your Healthcare Worker Money Map",
    html: buildHealthcareWorkerMoneyMapEmail(firstName, unsubscribeUrl),
    sequenceStatus: "not_applicable" as const,
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "POST");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ error: "Email service is not configured yet." });

  const body = parseBody(req.body);
  const email = body.email?.trim().toLowerCase();
  const firstName = body.firstName?.trim();
  const emailType: EmailType = body.type ?? "newsletter";
  const source = body.source ?? "site";
  const activeFromEmail = getFromEmail();
  const usesFallbackSender = activeFromEmail === fallbackFromEmail;

  if (body.website?.trim()) return res.status(200).json({ ok: true, saved: false, emailDelivered: false });
  if (!email || !emailPattern.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (body.consent !== true) return res.status(400).json({ error: "Consent is required before sending email." });

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const is403bEstimate = emailType === "403b-estimate";
    const contactResult = is403bEstimate ? null : await saveNewsletterContact(resend, email, source);
    const unsubscribeUrl = is403bEstimate ? "" : getUnsubscribeUrl(email);
    const payload = emailPayload(emailType, firstName, body.estimate, unsubscribeUrl);

    if (usesFallbackSender) {
      console.warn("Resend email delivery skipped until a verified sender is configured", {
        type: emailType,
        source,
        contactSaved: contactResult?.ok ?? false,
      });

      if (!is403bEstimate) {
        return res.status(200).json({
          ok: true,
          saved: contactResult?.ok ?? false,
          emailDelivered: false,
          sequenceStatus: payload.sequenceStatus,
          warning: "Contact saved, but email delivery requires verified sender configuration.",
          contactWarning: contactResult && !contactResult.ok ? "Contact sync skipped or failed." : undefined,
        });
      }

      return res.status(503).json({ error: "Email delivery is not fully configured yet." });
    }

    const headers = unsubscribeUrl
      ? {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }
      : undefined;

    const sent = (await resend.emails.send({
      from: activeFromEmail,
      to: [email],
      subject: payload.subject,
      html: payload.html,
      headers,
    })) as ResendActionResult;

    if (sent.error) {
      const message = getResendErrorMessage(sent.error);
      if (isDeliverySetupError(message)) {
        console.warn("Resend primary send skipped until verified sender configuration is complete", {
          type: emailType,
          message,
          contactSaved: contactResult?.ok ?? false,
        });
        if (!is403bEstimate) {
          return res.status(200).json({
            ok: true,
            saved: contactResult?.ok ?? false,
            emailDelivered: false,
            sequenceStatus: payload.sequenceStatus,
            warning: "Contact saved, but email delivery requires verified sender configuration.",
          });
        }
        return res.status(503).json({ error: "Email delivery is not fully configured yet." });
      }
      console.error("Resend primary send error", { type: emailType, message, contactSaved: contactResult?.ok ?? false });
      return res.status(500).json({ error: "Email could not be sent. Try again in a minute." });
    }

    if (notifyEmail) {
      const notification = (await resend.emails.send({
        from: activeFromEmail,
        to: [notifyEmail],
        subject: `New Community Acquired Finance ${emailType} signup`,
        text: `New consented signup\nType: ${emailType}\nSource: ${source}\nContact saved: ${contactResult?.ok ?? false}`,
      })) as ResendActionResult;
      if (notification.error) {
        console.warn("Resend notification send issue", { type: emailType, message: getResendErrorMessage(notification.error) });
      }
    }

    console.info("Resend primary send accepted", {
      type: emailType,
      id: sent.data?.id,
      contactSaved: contactResult?.ok ?? false,
    });

    return res.status(200).json({
      ok: true,
      saved: is403bEstimate ? true : contactResult?.ok ?? false,
      emailDelivered: true,
      sequenceStatus: payload.sequenceStatus,
      id: sent.data?.id,
      contactWarning: contactResult && !contactResult.ok ? "Contact sync skipped or failed." : undefined,
    });
  } catch (error) {
    console.error("Resend email exception", error);
    return res.status(500).json({ error: "Email could not be sent." });
  }
}
