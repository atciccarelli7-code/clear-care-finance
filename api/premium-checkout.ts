import { assertSameOrigin, commerceEnabled, noStore, normalizeEmail, parseBody, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { getPremiumProductContent } from "./_lib/premiumContent";
import { PREMIUM_PRODUCT_ID } from "./_lib/premiumProduct";
import { isPremiumStoreConfigured } from "./_lib/premiumStore";

function configuredCheckoutUrl() {
  const value = process.env.LEMON_SQUEEZY_HEALTHCARE_PRODUCT_URL?.trim() || "";
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !/(^|\.)lemonsqueezy\.com$/i.test(url.hostname)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "POST");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try { assertSameOrigin(req); } catch { return res.status(403).json({ error: "Request could not be verified." }); }

  const checkoutUrl = configuredCheckoutUrl();
  if (!commerceEnabled() || !isPremiumStoreConfigured() || !checkoutUrl || !process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || process.env.PREMIUM_CONTENT_READY !== "true") {
    return res.status(503).json({
      error: "Secure checkout is not active yet.",
      code: "commerce_not_ready",
    });
  }

  const product = await getPremiumProductContent();
  if (!product) {
    console.error("caf_premium_event", { event: "checkout_blocked_content_unavailable", productId: PREMIUM_PRODUCT_ID });
    return res.status(503).json({
      error: "Secure checkout is not active yet.",
      code: "premium_content_unavailable",
    });
  }

  const body = parseBody<{ email?: unknown }>(req.body);
  const email = normalizeEmail(body.email);
  const url = new URL(checkoutUrl);
  url.searchParams.set("checkout[custom][product_id]", PREMIUM_PRODUCT_ID);
  url.searchParams.set("checkout[custom][product_version]", product.version);
  url.searchParams.set("checkout[custom][access_model]", "one_time_12_month_updates");
  if (email) url.searchParams.set("checkout[email]", email);

  return res.status(200).json({ checkoutUrl: url.toString() });
}
