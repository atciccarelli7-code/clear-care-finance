import { assertSameOrigin, consumeMagicLink, createMagicLink, createSession, getEntitlement, noStore, normalizeEmail, parseBody, rateLimitAccessRequest, sendPremiumAccessEmail, setSessionCookie, siteUrl, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { isPremiumStoreConfigured } from "./_lib/premiumStore";

function redirect(res: PremiumResponse, destination: string) {
  res.status(302);
  res.setHeader("Location", destination);
  res.end?.();
}

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "GET, POST");

  if (req.method === "GET") {
    const requestUrl = new URL(req.url || "/api/premium-magic-link", siteUrl());
    const token = requestUrl.searchParams.get("token") || "";
    if (!isPremiumStoreConfigured()) return redirect(res, "/premium/access?state=unavailable");

    const record = await consumeMagicLink(token);
    if (!record?.email) return redirect(res, "/premium/access?state=expired");
    const session = await createSession(record.email);
    setSessionCookie(res, session.token);
    const entitlement = await getEntitlement(record.email);
    console.info("caf_premium_event", { event: "account_activated", productId: entitlement?.productId || "none", hasAccess: entitlement?.status === "active" });
    return redirect(res, entitlement?.status === "active" ? "/premium/healthcare-compensation-benefits?activated=1" : "/premium/access?state=purchase-required");
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
    try {
      const accessUrl = await createMagicLink(email);
      await sendPremiumAccessEmail(email, accessUrl);
    } catch (error) {
      console.error("caf_premium_event", { event: "access_email_failed", productId: entitlement.productId, errorType: error instanceof Error ? error.name : "unknown" });
    }
  }

  return res.status(202).json({
    accepted: true,
    message: "If that email has active access, a secure sign-in link has been sent.",
  });
}
