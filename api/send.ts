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

type SendBody = {
  email?: string;
  firstName?: string;
  consent?: boolean;
  website?: string;
  source?: string;
  type?: "newsletter" | "403b-estimate";
  estimate?: Estimate403b;
};

type ResendActionResult = {
  data?: { id?: string } | null;
  error?: unknown;
};

const fallbackFromEmail = "Community Acquired Finance <onboarding@resend.dev>";
const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;

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

function buildHealthcareWorkerMoneyMapEmail(firstName?: string) {
  const greeting = firstName?.trim() ? `Hi ${escapeHtml(firstName.trim())},` : "Hi,";

  return `
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent;">
      A practical starting point for healthcare-worker money decisions.
    </div>
    <div style="margin: 0; padding: 24px 12px; background: #f6f8f5; font-family: Arial, sans-serif; color: #183326;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #d8ded3; border-radius: 22px; overflow: hidden;">
        <div style="background: #004022; color: #ffffff; padding: 28px 24px;">
          <p style="margin: 0 0 10px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #c8f5dd; font-weight: 700;">Community Acquired Finance</p>
          <h1 style="margin: 0; color: #ffffff; font-size: 30px; line-height: 1.15;">Your Healthcare Worker Money Map</h1>
          <p style="margin: 16px 0 0; color: #e5f3ec; font-size: 16px; line-height: 1.55;">A plain-English starting point for paychecks, benefits, insurance, debt, cash flow, and investing.</p>
        </div>
        <div style="padding: 28px 24px; font-size: 16px; line-height: 1.65;">
          <p style="margin: 0 0 18px;">${greeting}</p>
          <p style="margin: 0 0 18px;">Thanks for signing up. This site is built for healthcare workers and patients who want clear financial explanations without spam, popups, or generic finance noise.</p>
          <div style="background: #f6f8f5; border: 1px solid #d8ded3; border-radius: 18px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 12px; color: #004022; font-weight: 700;">Use this as your first pass:</p>
            <ol style="margin: 0; padding-left: 22px;">
              <li style="margin: 0 0 10px;">Build a cash buffer before over-optimizing.</li>
              <li style="margin: 0 0 10px;">Get the employer retirement match when available.</li>
              <li style="margin: 0 0 10px;">Compare Roth vs. Traditional contributions before assuming one is best.</li>
              <li style="margin: 0 0 10px;">Understand HSA and FSA tradeoffs during open enrollment.</li>
              <li style="margin: 0 0 10px;">Separate federal student loan strategies from private loan payoff decisions.</li>
              <li style="margin: 0 0 10px;">Compare health insurance by total risk, not only premium.</li>
              <li style="margin: 0 0 10px;">Keep investing simple enough to sustain during stressful work seasons.</li>
              <li style="margin: 0;">Protect yourself from burnout-driven financial decisions.</li>
            </ol>
          </div>
          <p style="margin: 0 0 22px;">Start with the healthcare-worker hub. It groups the highest-impact topics first instead of making you search through scattered articles.</p>
          <p style="margin: 0 0 26px;"><a href="https://communityacquiredfinance.com/healthcare-workers" style="display: inline-block; background: #005c38; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 18px; border-radius: 999px;">Open the Healthcare Worker Money Hub</a></p>
          <p style="margin: 0 0 22px;">When you want numbers instead of theory, use the <a href="https://communityacquiredfinance.com/tools" style="color: #005c38; font-weight: 700;">Community Acquired Finance calculators</a>.</p>
          <div style="border-left: 4px solid #7ccca2; padding-left: 14px; margin: 24px 0; color: #314439;">
            <p style="margin: 0;">What you will get: practical explainers, calculator updates, and healthcare-specific money notes. No individualized advice.</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #d8ded3; margin: 26px 0;" />
          <p style="margin: 0 0 10px; color: #53645a; font-size: 13px; line-height: 1.55;">Educational only. This email is not individualized financial, legal, tax, insurance, investment, or medical advice.</p>
          <p style="margin: 0; color: #53645a; font-size: 13px; line-height: 1.55;">You can unsubscribe anytime by replying with “unsubscribe.”</p>
        </div>
      </div>
    </div>
  `;
}

function row(label: string, value?: string) {
  return `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #d8ded3; color: #53645a;">${escapeHtml(label)}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #d8ded3; color: #183326; font-weight: 700; text-align: right;">${safe(value)}</td>
    </tr>
  `;
}

function build403bEstimateEmail(firstName: string | undefined, estimate: Estimate403b = {}) {
  const greeting = firstName?.trim() ? `Hi ${escapeHtml(firstName.trim())},` : "Hi,";

  return `
    <div style="font-family: Arial, sans-serif; color: #183326; line-height: 1.55; max-width: 680px;">
      <p>${greeting}</p>
      <h1 style="color: #004022; font-size: 28px; line-height: 1.2;">Your 403(b) paycheck estimate</h1>
      <p>
        Here is the estimate you requested from the Community Acquired Finance 403(b) Paycheck Contribution Calculator.
        Use it as a planning snapshot, then verify your actual deductions in your employer benefits or payroll portal.
      </p>
      <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #d8ded3; border-radius: 12px; overflow: hidden;">
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
      <p style="margin-top: 20px;">
        Next step: <a href="https://communityacquiredfinance.com/tools#403b" style="color: #005c38; font-weight: 700;">reopen the 403(b) calculator</a>
        or use the <a href="https://communityacquiredfinance.com/healthcare-workers" style="color: #005c38; font-weight: 700;">Healthcare Worker Money Hub</a>.
      </p>
      <hr style="border: 0; border-top: 1px solid #d8ded3; margin: 24px 0;" />
      <p style="color: #53645a; font-size: 13px;">
        Educational only. This estimate is not individualized financial, legal, tax, insurance, investment, or medical advice.
      </p>
    </div>
  `;
}

async function saveNewsletterContact(resend: InstanceType<typeof Resend>, email: string, firstName?: string, source = "site") {
  const contact = (await resend.contacts.create({
    email,
    firstName: firstName || undefined,
    unsubscribed: false,
  })) as ResendActionResult;

  if (!contact.error) {
    console.info("Newsletter contact saved", { id: contact.data?.id, source });
    return { ok: true, id: contact.data?.id, duplicate: false };
  }

  const message = getResendErrorMessage(contact.error);
  if (isDuplicateContactError(message)) {
    console.info("Newsletter contact already exists", { source });
    return { ok: true, duplicate: true };
  }

  console.error("Newsletter contact save error", { message, source });
  return { ok: false, error: message, duplicate: false };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "POST");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: "Email service is not configured yet." });
  }

  const body = parseBody(req.body);
  const email = body.email?.trim().toLowerCase();
  const firstName = body.firstName?.trim();
  const emailType = body.type ?? "newsletter";
  const source = body.source ?? "site";
  const activeFromEmail = getFromEmail();

  if (body.website?.trim()) {
    return res.status(200).json({ ok: true, saved: false, emailDelivered: false });
  }

  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (body.consent !== true) {
    return res.status(400).json({ error: "Consent is required before sending email." });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const is403bEstimate = emailType === "403b-estimate";
    const isNewsletterSignup = emailType === "newsletter";
    const contactResult = isNewsletterSignup ? await saveNewsletterContact(resend, email, firstName, source) : null;

    if (isNewsletterSignup && contactResult && !contactResult.ok) {
      return res.status(500).json({ error: "Newsletter signup could not be saved. Try again in a minute." });
    }

    const sent = (await resend.emails.send({
      from: activeFromEmail,
      to: [email],
      subject: is403bEstimate ? "Your 403(b) paycheck estimate" : "Welcome — your Healthcare Worker Money Map",
      html: is403bEstimate ? build403bEstimateEmail(firstName, body.estimate) : buildHealthcareWorkerMoneyMapEmail(firstName),
    })) as ResendActionResult;

    if (sent.error) {
      const message = getResendErrorMessage(sent.error);
      console.error("Resend primary send error", { type: emailType, message });

      if (isNewsletterSignup && contactResult?.ok && isDeliverySetupError(message)) {
        return res.status(200).json({
          ok: true,
          saved: true,
          emailDelivered: false,
          warning: "Subscribed, but welcome email delivery requires verified sender configuration.",
        });
      }

      return res.status(500).json({ error: message });
    }

    if (notifyEmail) {
      const notification = (await resend.emails.send({
        from: activeFromEmail,
        to: [notifyEmail],
        subject: is403bEstimate ? "New 403(b) estimate email signup" : "New Community Acquired Finance newsletter signup",
        text: `New signup: ${email}\nType: ${emailType}\nSource: ${source}\nContact saved: ${contactResult?.ok ?? false}`,
      })) as ResendActionResult;

      if (notification.error) {
        console.error("Resend notification send error", {
          type: emailType,
          message: getResendErrorMessage(notification.error),
        });
      }
    }

    console.info("Resend primary send accepted", { type: emailType, id: sent.data?.id, contactSaved: contactResult?.ok ?? false });
    return res.status(200).json({ ok: true, saved: contactResult?.ok ?? false, emailDelivered: true, id: sent.data?.id });
  } catch (error) {
    console.error("Resend email exception", error);
    return res.status(500).json({ error: "Email could not be sent." });
  }
}
