import { createHmac } from "node:crypto";
import { entitlementKey, eventKey, noStore, normalizeEmail, safeTimingEqual, type PremiumEntitlement, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { PREMIUM_PRODUCT_ID } from "./_lib/premiumProduct";
import { getJson, isPremiumStoreConfigured, setJson } from "./_lib/premiumStore";

export const config = { api: { bodyParser: false } };

type WebhookPayload = {
  meta?: { event_name?: string; custom_data?: Record<string, unknown> };
  data?: {
    id?: string;
    type?: string;
    attributes?: {
      user_email?: string;
      identifier?: string;
      status?: string;
      created_at?: string;
      updated_at?: string;
      refunded_at?: string | null;
      test_mode?: boolean;
      product_id?: number | string;
      variant_id?: number | string;
    };
  };
};

async function readRawBody(req: PremiumRequest & AsyncIterable<Uint8Array>) {
  if (typeof req.body === "string") return req.body;
  const chunks: Buffer[] = [];
  if (req && Symbol.asyncIterator in req) {
    for await (const chunk of req) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString("utf8");
  }
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);
  return "";
}

function addTwelveMonths(isoDate: string) {
  const date = new Date(isoDate);
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString();
}

function eventIdentity(payload: WebhookPayload, eventName: string) {
  const attributes = payload.data?.attributes;
  return [payload.data?.type || "unknown", payload.data?.id || "unknown", eventName, attributes?.updated_at || attributes?.created_at || attributes?.status || "unknown"].join(":");
}

function matchesConfiguredProduct(payload: WebhookPayload) {
  const customProduct = payload.meta?.custom_data?.product_id;
  if (customProduct && customProduct !== PREMIUM_PRODUCT_ID) return false;
  const expectedVariant = process.env.LEMON_SQUEEZY_HEALTHCARE_VARIANT_ID?.trim();
  const actualVariant = String(payload.data?.attributes?.variant_id ?? "");
  return !expectedVariant || actualVariant === expectedVariant;
}

export default async function handler(req: PremiumRequest & AsyncIterable<Uint8Array>, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "POST");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isPremiumStoreConfigured()) return res.status(503).json({ error: "Entitlement store is not configured" });

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET?.trim() || "";
  const receivedSignature = String(req.headers?.["x-signature"] || req.headers?.["X-Signature"] || "");
  const rawBody = await readRawBody(req);
  if (!secret || !receivedSignature || !rawBody) return res.status(401).json({ error: "Webhook signature missing" });

  const expectedSignature = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!safeTimingEqual(expectedSignature, receivedSignature)) return res.status(401).json({ error: "Webhook signature invalid" });

  let payload: WebhookPayload;
  try { payload = JSON.parse(rawBody) as WebhookPayload; } catch { return res.status(400).json({ error: "Invalid webhook payload" }); }

  const eventName = payload.meta?.event_name || String(req.headers?.["x-event-name"] || "");
  if (!eventName || !payload.data?.id) return res.status(400).json({ error: "Incomplete webhook payload" });
  if (!matchesConfiguredProduct(payload)) return res.status(200).json({ accepted: true, ignored: "different_product" });

  const identity = eventIdentity(payload, eventName);
  if (await getJson(eventKey(identity))) return res.status(200).json({ accepted: true, duplicate: true });

  const attributes = payload.data.attributes || {};
  const email = normalizeEmail(attributes.user_email);
  if (!email) return res.status(400).json({ error: "Order email missing" });

  const isRefund = eventName === "order_refunded" || attributes.status === "refunded" || Boolean(attributes.refunded_at);
  const isPaidOrder = eventName === "order_created" && (!attributes.status || attributes.status === "paid");
  const isOrderUpdate = eventName === "order_updated";

  if (isPaidOrder || isOrderUpdate || isRefund) {
    const existing = await getJson<PremiumEntitlement>(entitlementKey(email));
    const purchasedAt = existing?.purchasedAt || attributes.created_at || new Date().toISOString();
    const entitlement: PremiumEntitlement = {
      productId: PREMIUM_PRODUCT_ID,
      email,
      status: isRefund ? "refunded" : "active",
      orderId: String(payload.data.id),
      orderIdentifier: attributes.identifier || existing?.orderIdentifier,
      purchasedAt,
      updatesUntil: existing?.updatesUntil || addTwelveMonths(purchasedAt),
      source: "lemon_squeezy",
      testMode: Boolean(attributes.test_mode),
      lastEventName: eventName,
      updatedAt: new Date().toISOString(),
    };
    await setJson(entitlementKey(email), entitlement);
  }

  await setJson(eventKey(identity), { processedAt: new Date().toISOString(), eventName }, { expiresInSeconds: 400 * 24 * 60 * 60 });
  return res.status(200).json({ accepted: true });
}
