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

type ResendClient = InstanceType<typeof Resend>;

const fallbackFromEmail = "Community Acquired Finance <onboarding@resend.dev>";
const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namedEmailPattern = /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/;

function getFromEmail() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return fallbackFromEmail;
  if (emailPattern.test(configured) || namedEmailPattern.test(configured)) return configured;
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

function escapeHtml(value: string) {
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

function isResendTestingModeError(message: string) {
  return /only send testing emails|verify a domain|verified domain|onboarding@resend\.dev/i.test(message);
}

function buildHealthcareWorkerMoneyMapEmail(firstName?: string) {
  const greeting = firstName?.trim() ? `Hi ${escapeHtml(firstName.trim())},` : "Hi,";

  return `
    <div style="font-family: Arial, sans-serif; color: #183326; line-height: 1.55; max-width: 640px;">
      <p>${greeting}</p>
      <h1 style="color: #004022; font-size: 28px; line-height: 1.2;">Your Healthcare Worker Money Map</h1>
      <p>
        Thanks for signing up for Community Acquired Finance. This is a plain-English starting point for organizing the
        money decisions that show up around healthcare work: paychecks, benefits, insurance, debt, cash flow, and investing.
      </p>
      <ol>
        <li>Build a cash buffer before over-optimizing.</li>
        <li>Get the employer retirement match when available.</li>
        <li>Compare Roth vs Traditional contributions before assuming one is best.</li>
        <li>Understand HSA and FSA tradeoffs during open enrollment.</li>
        <li>Separate federal student loan strategies from private loan payoff decisions.</li>
        <li>Compare health insurance by total risk, not only premium.</li>
        <li>Keep investing simple enough to sustain during stressful work seasons.</li>
        <li>Protect yourself from burnout-driven financial decisions.</li>
      </ol>
      <p>
        Start here: <a href="https://communityacquiredfinance.com/healthcare-workers" style="color: #005c38; font-weight: 700;">Healthcare Worker Money Hub</a>
      </p>
      <p>
        Useful tools: <a href="https://communityacquiredfinance.com/tools" style="color: #005c38; font-weight: 700;">Community Acquired Finance calculators</a>
      </p>
      <hr style="border: 0; border-top: 1px solid #d8ded3; margin: 24px 0;" />
      <p style="color: #53645a; font-size: 13px;">
        Educational only. This email is not individualized financial, legal, tax, insurance, investment, or medical advice.
      </p>
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

      <h2 style="color: #004022; font-size: 20px; margin-top: 24px;">Inputs</h2>
      <table style="width: 100%; border-collapse: collapse; background: #f6f8f5; border: 1px solid #d8ded3; border-radius: 12px; overflow: hidden;">
        ${row("Hourly wage", estimate.hourly)}
        ${row("Hours per week", estimate.hoursWeek)}
        ${row("Pay frequency", estimate.payFrequency)}
        ${row("Your contribution", estimate.contributionPercent)}
        ${row("Employer match", estimate.employerMatchPercent)}
        ${row("Contribution type", estimate.contributionType)}
      </table>

      <h2 style="color: #004022; font-size: 20px; margin-top: 24px;">Estimate</h2>
      <table style="width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid #d8ded3; border-radius: 12px; overflow: hidden;">
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
        Actual paycheck impact depends on payroll timing, overtime, differentials, taxes, plan rules, vesting, contribution limits, and other deductions.
      </p>
    </div>
  `;
}

async function saveNewsletterContact(resend: ResendClient, body: SendBody, email: string, firstName?: string) {
  const contact = (await resend.contacts.create({
    email,
    firstName: firstName || undefined,
    unsubscribed: false,
    properties: {
      source: body.source ?? "site",
      signup_type: body.type ?? "newsletter",
      consent: "true",
      consented_at: new Date().toISOString(),
    },
  })) as ResendActionResult;

  if (!contact.error) {
    console.info("Newsletter contact saved", { id: contact.data?.id, source: body.source ?? "site" });
    return { ok: true, id: contact.data?.id, duplicate: false };
  }

  const message = getResendErrorMessage(contact.error);
  if (isDuplicateContactError(message)) {
    console.info("Newsletter contact already exists", { source: body.source ?? "site" });
    return { ok: true, duplicate: true };
  }

  console.error("Newsletter contact save error", { message, source: body.source ?? "site" });
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
    const contactResult = isNewsletterSignup ? await saveNewsletterContact(resend, body, email, firstName) : null;

    if (isNewsletterSignup && contactResult && !contactResult.ok) {
      return res.status(500).json({ error: "Newsletter signup could not be saved. Try again in a minute." });
    }

    const sent = await resend.emails.send({
      from: activeFromEmail,
      to: [email],
      subject: is403bEstimate ? "Your 403(b) paycheck estimate" : "Your Healthcare Worker Money Map",
      html: is403bEstimate ? build403bEstimateEmail(firstName, body.estimate) : buildHealthcareWorkerMoneyMapEmail(firstName),
    });

    if (sent.error) {
      const message = getResendErrorMessage(sent.error);
      console.error("Resend primary send error", { type: emailType, message });

      if (isNewsletterSignup && contactResult?.ok && isResendTestingModeError(message)) {
        return res.status(200).json({
          ok: true,
          saved: true,
          emailDelivered: false,
          warning: "Subscribed, but welcome email delivery requires Resend domain verification.",
        });
      }

      return res.status(500).json({ error: message });
    }

    if (notifyEmail) {
      const notification = await resend.emails.send({
        from: activeFromEmail,
        to: [notifyEmail],
        subject: is403bEstimate ? "New 403(b) estimate email signup" : "New Community Acquired Finance newsletter signup",
        text: `New signup: ${email}\nType: ${emailType}\nSource: ${body.source ?? "unknown"}\nContact saved: ${contactResult?.ok ?? false}`,
      });

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
