import { clearSessionCookie, destroySession, getEntitlement, getSession, noStore, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { isPremiumStoreConfigured } from "./_lib/premiumStore";

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "GET, DELETE");

  if (req.method === "DELETE") {
    await destroySession(req);
    clearSessionCookie(res);
    return res.status(200).json({ signedIn: false });
  }

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!isPremiumStoreConfigured()) return res.status(503).json({ signedIn: false, commerceReady: false, reason: "not_configured" });

  const current = await getSession(req);
  if (!current) return res.status(200).json({ signedIn: false, commerceReady: true });

  const entitlement = await getEntitlement(current.session.email);
  return res.status(200).json({
    signedIn: true,
    emailMasked: current.session.email.replace(/^(.{1,2}).*(@.*)$/, "$1••••$2"),
    hasAccess: entitlement?.status === "active",
    accessStatus: entitlement?.status || "none",
    purchasedAt: entitlement?.purchasedAt || null,
    updatesUntil: entitlement?.updatesUntil || null,
    testMode: entitlement?.testMode || false,
  });
}
