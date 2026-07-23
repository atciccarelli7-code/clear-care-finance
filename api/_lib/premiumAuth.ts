import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { Resend } from "resend";
import { PREMIUM_PRODUCT_ID } from "./premiumProduct";
import { deleteKey, getAndDeleteJson, getJson, incrementWithWindow, isPremiumStoreConfigured, setJson } from "./premiumStore";

export type PremiumRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

export type PremiumResponse = {
  status: (code: number) => PremiumResponse;
  json: (body: unknown) => void;
  send?: (body: unknown) => void;
  redirect?: (code: number, url: string) => void;
  setHeader: (name: string, value: string | string[]) => void;
  end?: () => void;
};

export type PremiumEntitlement = {
  productId: string;
  email: string;
  status: "active" | "refunded" | "revoked";
  orderId: string;
  orderIdentifier?: string;
  purchasedAt: string;
  updatesUntil: string;
  source: "lemon_squeezy" | "manual_test";
  testMode: boolean;
  lastEventName: string;
  updatedAt: string;
};

export type PremiumSession = {
  email: string;
  createdAt: string;
  expiresAt: string;
};

const SESSION_COOKIE = "caf_premium_session";
const MAGIC_LINK_TTL_SECONDS = 15 * 60;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const siteUrl = () => (process.env.PUBLIC_SITE_URL?.trim() || "https://communityacquiredfinance.com").replace(/\/$/, "");
export const commerceEnabled = () => process.env.ENABLE_PREMIUM_COMMERCE === "true";

export function parseBody<T extends Record<string, unknown>>(body: unknown): T {
  if (!body) return {} as T;
  if (typeof body === "string") {
    try { return JSON.parse(body) as T; } catch { return {} as T; }
  }
  return body as T;
}

export function normalizeEmail(value: unknown) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return emailPattern.test(email) && email.length <= 254 ? email : "";
}

export function stableHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

const magicKey = (token: string) => `caf:premium:magic:${stableHash(token)}`;
const sessionKey = (token: string) => `caf:premium:session:${stableHash(token)}`;
export const entitlementKey = (email: string, productId = PREMIUM_PRODUCT_ID) => `caf:premium:entitlement:${productId}:${stableHash(normalizeEmail(email))}`;
export const progressKey = (email: string, productId = PREMIUM_PRODUCT_ID) => `caf:premium:progress:${productId}:${stableHash(normalizeEmail(email))}`;
export const eventKey = (eventId: string) => `caf:premium:webhook:${stableHash(eventId)}`;

function header(req: PremiumRequest, name: string) {
  const value = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function cookies(req: PremiumRequest) {
  return header(req, "cookie").split(";").reduce<Record<string, string>>((result, item) => {
    const index = item.indexOf("=");
    if (index < 0) return result;
    const key = item.slice(0, index).trim();
    const value = item.slice(index + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
    return result;
  }, {});
}

export function getClientIp(req: PremiumRequest) {
  return header(req, "x-forwarded-for").split(",")[0].trim() || header(req, "x-real-ip") || "unknown";
}

export function assertSameOrigin(req: PremiumRequest) {
  const origin = header(req, "origin");
  if (!origin) return;
  const allowed = new URL(siteUrl()).origin;
  if (origin !== allowed && !origin.endsWith(".vercel.app")) throw new Error("Invalid request origin.");
}

export function noStore(res: PremiumResponse) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Vary", "Cookie");
}

export function setSessionCookie(res: PremiumResponse, token: string) {
  const secure = siteUrl().startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
}

export function clearSessionCookie(res: PremiumResponse) {
  const secure = siteUrl().startsWith("https://") ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

export async function createMagicLink(email: string) {
  const token = randomBytes(32).toString("base64url");
  await setJson(magicKey(token), { email, createdAt: new Date().toISOString() }, { expiresInSeconds: MAGIC_LINK_TTL_SECONDS });
  return `${siteUrl()}/api/premium-magic-link?token=${encodeURIComponent(token)}`;
}

export async function consumeMagicLink(token: string) {
  if (!token || token.length > 256) return null;
  return getAndDeleteJson<{ email: string; createdAt: string }>(magicKey(token));
}

export async function createSession(email: string) {
  const token = randomBytes(32).toString("base64url");
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_SECONDS * 1000);
  const session: PremiumSession = { email, createdAt: createdAt.toISOString(), expiresAt: expiresAt.toISOString() };
  await setJson(sessionKey(token), session, { expiresInSeconds: SESSION_TTL_SECONDS });
  return { token, session };
}

export async function getSession(req: PremiumRequest) {
  const token = cookies(req)[SESSION_COOKIE] || "";
  if (!token) return null;
  const session = await getJson<PremiumSession>(sessionKey(token));
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (token) await deleteKey(sessionKey(token)).catch(() => undefined);
    return null;
  }
  return { token, session };
}

export async function destroySession(req: PremiumRequest) {
  const token = cookies(req)[SESSION_COOKIE] || "";
  if (token) await deleteKey(sessionKey(token)).catch(() => undefined);
}

export async function getEntitlement(email: string) {
  if (!normalizeEmail(email)) return null;
  return getJson<PremiumEntitlement>(entitlementKey(email));
}

export async function requireActiveEntitlement(req: PremiumRequest) {
  if (!isPremiumStoreConfigured()) return { ok: false as const, reason: "not_configured" as const };
  const current = await getSession(req);
  if (!current) return { ok: false as const, reason: "signed_out" as const };
  const entitlement = await getEntitlement(current.session.email);
  if (!entitlement || entitlement.status !== "active") return { ok: false as const, reason: "purchase_required" as const, session: current.session };
  return { ok: true as const, session: current.session, entitlement };
}

export async function rateLimitAccessRequest(req: PremiumRequest, email: string) {
  const ipCount = await incrementWithWindow(`caf:premium:rate:ip:${stableHash(getClientIp(req))}`, 10 * 60);
  const emailCount = await incrementWithWindow(`caf:premium:rate:email:${stableHash(email)}`, 10 * 60);
  return ipCount <= 12 && emailCount <= 4;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

export async function sendPremiumAccessEmail(email: string, accessUrl: string) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("Email delivery is not configured.");
  const from = process.env.RESEND_FROM_EMAIL?.trim() || "Community Acquired Finance <onboarding@resend.dev>";
  const resend = new Resend(apiKey);
  const safeUrl = escapeHtml(accessUrl);
  const result = await resend.emails.send({
    from,
    to: email,
    subject: "Your secure CAF workspace access link",
    html: `<div style="margin:0;padding:24px 12px;background:#f4f6f2;font-family:Arial,sans-serif;color:#183326"><div style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #d8ded3;border-radius:22px;overflow:hidden"><div style="background:#003b2a;color:#fff;padding:28px 24px"><p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#c8f5dd;font-weight:700">Community Acquired Finance</p><h1 style="margin:0;font-size:28px;line-height:1.2">Open your secure decision workspace</h1></div><div style="padding:28px 24px;font-size:16px;line-height:1.65"><p>This link signs you in to the Healthcare Compensation & Benefits Decision Workspace. It expires in 15 minutes and can be used once.</p><p style="margin:26px 0"><a href="${safeUrl}" style="display:inline-block;background:#005c38;color:#fff;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:999px">Open my workspace</a></p><p style="color:#53645a;font-size:13px">CAF will never ask you to email Social Security numbers, account IDs, medical records, banking credentials, or employer documents. If you did not request this link, ignore this message.</p></div></div></div>`,
  });
  if (result.error) throw new Error(result.error.message || "Access email could not be sent.");
}

export function safeTimingEqual(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
