import { assertSameOrigin, consumeMagicLink, createMagicLink, createSession, getEntitlement, noStore, normalizeEmail, parseBody, rateLimitAccessRequest, sendPremiumAccessEmail, setSessionCookie, siteUrl, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { isPremiumStoreConfigured } from "./_lib/premiumStore";

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "GET, POST");

  if (req.method === "GET") {
    const requestUrl = new URL((req as PremiumRequest & { url?: string }).url || "/api/premium-magic-link", siteUrl());
    const token = requestUrl.searchParams.get("token") || "";
    if (!isPremiumStoreConfigured()) return res.redirect?.(302, "/premium/access?state=unavailable");

    const record = await consumeMagicLink(token);
    if (!record?.email) return res.redirect?.(302, "/premium/access?state=expired");
    const session = await createSession(record.email);
    setSessionCookie(res, session.token);
    const entitlement = await getEntitlement(record.email);
    return res.redirect?.(302, entitlement?.status === "active" ? "/premium/healthcare-compensation-benefits" : "/premium/access?state=purchase-required");
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isPremiumStoreConfigured()) return res.status(503).json({ error: "Secure access is not configured yet." });

  try { assertSameOrigin(req); } catch { return res.status(403).json({ error: "Request could not be verified." }); }

  const body = parseBody<{ email?: unknown }>(req.body);
  const email = normalizeEmail(body.email);
  if (!email) return res.status(400).json({ error: "Enter a valid email address." });

  const allowed = await rateLimitAccessRequest(req, email);
  if (!allowed) return res.status(429).json({ error: "Too many access attempts. Try again later." });

  const entitlement = await getEntitlement(email);
  if (entitlement?.status === "active") {
    const accessUrl = await createMagicLink(email);
    await sendPremiumAccessEmail(email, accessUrl);
  }

  return res.status(202).json({
    accepted: true,
    message: "If that email has active access, a secure sign-in link has been sent.",
  });
}
