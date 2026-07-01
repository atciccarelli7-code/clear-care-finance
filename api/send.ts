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

type SendBody = {
  email?: string;
  firstName?: string;
  consent?: boolean;
  website?: string;
};

const fromEmail = process.env.RESEND_FROM_EMAIL ?? "Community Acquired Finance <onboarding@resend.dev>";
const notifyEmail = process.env.RESEND_NOTIFY_EMAIL;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // Honeypot field for simple bot filtering. Real users should never fill this.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (body.consent !== true) {
    return res.status(400).json({ error: "Consent is required before sending email." });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const welcome = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Your Healthcare Worker Money Map",
      html: buildHealthcareWorkerMoneyMapEmail(firstName),
    });

    if (notifyEmail) {
      await resend.emails.send({
        from: fromEmail,
        to: [notifyEmail],
        subject: "New Community Acquired Finance email signup",
        text: `New signup: ${email}`,
      });
    }

    return res.status(200).json({ ok: true, id: welcome.data?.id });
  } catch (error) {
    console.error("Resend email error", error);
    return res.status(500).json({ error: "Email could not be sent." });
  }
}
