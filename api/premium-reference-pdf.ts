import { noStore, requireActiveEntitlement, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";

function configuredReferenceUrl() {
  const value = process.env.PREMIUM_REFERENCE_PDF_URL?.trim() || "";
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "GET");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const access = await requireActiveEntitlement(req);
  if (!access.ok) {
    const status = access.reason === "signed_out" ? 401 : access.reason === "purchase_required" ? 403 : 503;
    return res.status(status).json({ error: access.reason, protected: true });
  }

  const referenceUrl = configuredReferenceUrl();
  if (!referenceUrl) return res.status(404).json({ error: "The gated reference PDF is not configured. Use the workspace print controls to save a PDF." });

  res.status(302);
  res.setHeader("Location", referenceUrl);
  res.setHeader("Referrer-Policy", "no-referrer");
  res.end?.();
}
