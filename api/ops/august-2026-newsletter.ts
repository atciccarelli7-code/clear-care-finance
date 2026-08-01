import { Resend } from "resend";

type ApiRequest = {
  method?: string;
  url?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type ResendResult = {
  data?: { id?: string } | null;
  error?: unknown;
};

const expectedBranch = "ops/august-2026-newsletter";
const siteUrl = (process.env.PUBLIC_SITE_URL?.trim() || "https://communityacquiredfinance.com").replace(/\/$/, "");
const fallbackFromEmail = "Community Acquired Finance <onboarding@resend.dev>";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namedEmailPattern = /^[^<>]+<[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+>$/;
const looseEmailPattern = /[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+/;

function getFromEmail() {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) return fallbackFromEmail;
  if (emailPattern.test(configured) || namedEmailPattern.test(configured)) return configured;

  const extractedEmail = configured.match(looseEmailPattern)?.[0];
  if (extractedEmail && emailPattern.test(extractedEmail)) {
    return `Community Acquired Finance <${extractedEmail}>`;
  }

  return fallbackFromEmail;
}

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown Resend error";
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error && typeof (error as { message?: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return JSON.stringify(error);
}

const subject = "August update: smarter tools for healthcare money decisions";
const preheader = "See the rebuilt 403(b) and student-loan calculators, Explore CAF navigation, and practical healthcare decision tools.";

const html = `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
  <div style="margin:0;padding:24px 12px;background:#f6f8f5;font-family:Arial,sans-serif;color:#183326;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden;">
      <div style="background:#004022;color:#ffffff;padding:30px 26px;">
        <p style="margin:0 0 10px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#c8f5dd;font-weight:700;">Community Acquired Finance · August 2026</p>
        <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.15;">A better way to make healthcare-money decisions</h1>
      </div>

      <div style="padding:30px 26px;font-size:16px;line-height:1.65;">
        <p style="margin:0 0 18px;">Hi,</p>
        <p style="margin:0 0 18px;">July was our biggest product-building month yet. Community Acquired Finance now does more than explain a topic or return a number—it helps you understand the result, verify the assumptions, and identify the next practical action.</p>

        <div style="background:#eef8f1;border:1px solid #c9e5d1;border-radius:18px;padding:20px;margin:24px 0;">
          <p style="margin:0 0 8px;color:#004022;font-weight:700;">Start here this month</p>
          <p style="margin:0;">Check how your employer actually calculates its retirement contribution. “50% of the first 6%” is not the same as a 6% employer match, and the difference can be thousands of dollars over time.</p>
        </div>

        <h2 style="margin:30px 0 10px;color:#004022;font-size:22px;line-height:1.25;">The rebuilt 403(b) Paycheck Calculator</h2>
        <p style="margin:0 0 12px;">The calculator now supports dollar-for-dollar matches, partial matches, non-elective employer contributions, and unknown or tiered formulas. When a formula cannot be modeled responsibly, it shows <strong>Not estimated</strong> instead of inventing a number.</p>
        <p style="margin:0 0 18px;"><a href="${siteUrl}/tools/403b-paycheck-calculator" style="color:#005c38;font-weight:700;">Try the 403(b) Paycheck Calculator →</a></p>

        <h2 style="margin:30px 0 10px;color:#004022;font-size:22px;line-height:1.25;">A real decision result for private student loans</h2>
        <p style="margin:0 0 12px;">The Private Student Loan Payoff Calculator now compares your current plan, extra payments, and refinance quotes using total cost, payoff time, fees, and break-even—not APR alone. Federal or uncertain debt is stopped before any refinance recommendation.</p>
        <p style="margin:0 0 18px;"><a href="${siteUrl}/tools/private-student-loan-payoff-calculator" style="color:#005c38;font-weight:700;">Compare a private-loan payoff plan →</a></p>

        <h2 style="margin:30px 0 10px;color:#004022;font-size:22px;line-height:1.25;">Explore CAF: the useful tools are easier to find</h2>
        <p style="margin:0 0 12px;">The new Explore CAF navigation organizes the site around the decisions people are trying to make. It highlights resources such as the Benefits Command Center, Benefits Change Detector, Total Compensation Comparison, Career Decision Center, Medical Bill Review Toolkit, EOB-to-Bill Match, and Prior Authorization Next Step.</p>
        <p style="margin:0 0 18px;"><a href="${siteUrl}/tools" style="color:#005c38;font-weight:700;">Browse all calculators and decision tools →</a></p>

        <h2 style="margin:30px 0 10px;color:#004022;font-size:22px;line-height:1.25;">Built for healthcare workers, patients, and caregivers</h2>
        <p style="margin:0 0 18px;">The platform is becoming a healthcare financial decision-support system: workplace pay and benefits on one side, and insurance, medical bills, discharge, caregiving, Medicare, and Medicaid decisions on the other. The goal is simple—make the next step clearer without turning every difficult decision into a sales funnel.</p>

        <p style="margin:28px 0;"><a href="${siteUrl}/tools" style="display:inline-block;background:#005c38;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 20px;border-radius:999px;">Explore the new tools</a></p>

        <hr style="border:0;border-top:1px solid #d8ded3;margin:28px 0;" />
        <p style="margin:0 0 10px;color:#53645a;font-size:13px;line-height:1.55;">Community Acquired Finance provides general education—not individualized medical, legal, tax, insurance, billing, credit, or financial advice. Verify consequential decisions with the controlling plan documents, account records, insurer, employer, lender, or qualified professional.</p>
        <p style="margin:0;color:#53645a;font-size:13px;line-height:1.55;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#005c38;">Unsubscribe</a> from monthly Community Acquired Finance updates.</p>
      </div>
    </div>
  </div>
`;

const text = `
Community Acquired Finance — August 2026

A better way to make healthcare-money decisions

July was our biggest product-building month yet. Community Acquired Finance now does more than explain a topic or return a number—it helps you understand the result, verify the assumptions, and identify the next practical action.

START HERE THIS MONTH
Check how your employer actually calculates its retirement contribution. “50% of the first 6%” is not the same as a 6% employer match, and the difference can be thousands of dollars over time.

THE REBUILT 403(B) PAYCHECK CALCULATOR
The calculator now supports dollar-for-dollar matches, partial matches, non-elective employer contributions, and unknown or tiered formulas. When a formula cannot be modeled responsibly, it shows Not estimated instead of inventing a number.
${siteUrl}/tools/403b-paycheck-calculator

A REAL DECISION RESULT FOR PRIVATE STUDENT LOANS
The Private Student Loan Payoff Calculator now compares your current plan, extra payments, and refinance quotes using total cost, payoff time, fees, and break-even—not APR alone. Federal or uncertain debt is stopped before any refinance recommendation.
${siteUrl}/tools/private-student-loan-payoff-calculator

EXPLORE CAF
The new navigation highlights the Benefits Command Center, Benefits Change Detector, Total Compensation Comparison, Career Decision Center, Medical Bill Review Toolkit, EOB-to-Bill Match, Prior Authorization Next Step, and more.
${siteUrl}/tools

BUILT FOR HEALTHCARE WORKERS, PATIENTS, AND CAREGIVERS
The platform is becoming a healthcare financial decision-support system spanning workplace pay and benefits, insurance, medical bills, discharge, caregiving, Medicare, and Medicaid decisions.

Educational only—not individualized medical, legal, tax, insurance, billing, credit, or financial advice.

Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}
`.trim();

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const vercelEnvironment = process.env.VERCEL_ENV;
  const gitBranch = process.env.VERCEL_GIT_COMMIT_REF;
  if (vercelEnvironment !== "preview" || gitBranch !== expectedBranch) {
    return res.status(404).json({ error: "Not found" });
  }

  const url = new URL(req.url || "/", "https://preview.local");
  const action = url.searchParams.get("action") || "status";
  const confirmation = url.searchParams.get("confirm");
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const segmentId = process.env.RESEND_AUDIENCE_ID?.trim();
  const from = getFromEmail();

  if (action === "status") {
    return res.status(200).json({
      ok: true,
      previewOnly: true,
      branch: gitBranch,
      resendApiKeyConfigured: Boolean(apiKey),
      newsletterSegmentConfigured: Boolean(segmentId),
      verifiedSenderConfigured: from !== fallbackFromEmail,
      subject,
    });
  }

  if (confirmation !== "send-august-2026") {
    return res.status(400).json({ error: "Confirmation value is required." });
  }

  if (!apiKey || !segmentId || from === fallbackFromEmail) {
    return res.status(503).json({
      error: "Newsletter delivery is not fully configured.",
      resendApiKeyConfigured: Boolean(apiKey),
      newsletterSegmentConfigured: Boolean(segmentId),
      verifiedSenderConfigured: from !== fallbackFromEmail,
    });
  }

  try {
    const resend = new Resend(apiKey);

    if (action === "create") {
      const created = (await resend.broadcasts.create({
        segmentId,
        from,
        subject,
        name: "CAF Monthly — August 2026 — Product Update",
        html,
        text,
      })) as ResendResult;

      if (created.error || !created.data?.id) {
        return res.status(502).json({ error: getErrorMessage(created.error) });
      }

      return res.status(200).json({
        ok: true,
        status: "draft_created",
        broadcastId: created.data.id,
        subject,
      });
    }

    if (action === "send") {
      const broadcastId = url.searchParams.get("broadcastId")?.trim();
      if (!broadcastId || !/^[0-9a-f-]{36}$/i.test(broadcastId)) {
        return res.status(400).json({ error: "A valid broadcastId is required." });
      }

      const sent = (await resend.broadcasts.send(broadcastId)) as ResendResult;
      if (sent.error) {
        return res.status(502).json({ error: getErrorMessage(sent.error), broadcastId });
      }

      return res.status(200).json({
        ok: true,
        status: "send_requested",
        broadcastId,
        sendId: sent.data?.id,
      });
    }

    return res.status(400).json({ error: "Unsupported action" });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}
