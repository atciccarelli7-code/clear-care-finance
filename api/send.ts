import * as React from "react";
import { Resend } from "resend";
import { HealthcareWorkerMoneyMapEmail } from "../src/components/email/HealthcareWorkerMoneyMapEmail";

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

const resend = new Resend(process.env.RESEND_API_KEY);
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
    const welcome = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "Your Healthcare Worker Money Map",
      react: React.createElement(HealthcareWorkerMoneyMapEmail, { firstName }),
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
