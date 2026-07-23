import { assertSameOrigin, noStore, parseBody, progressKey, requireActiveEntitlement, type PremiumRequest, type PremiumResponse } from "./_lib/premiumAuth";
import { premiumProduct } from "./_lib/premiumProduct";
import { deleteKey, getJson, setJson } from "./_lib/premiumStore";

type PremiumProgress = {
  completedModuleIds: string[];
  activeModuleId: string;
  completedTaskIds: string[];
  updatedAt: string;
};

const moduleIds = new Set(premiumProduct.modules.map((module) => module.id));
const permittedTaskPattern = /^(module|document|decision|review|export):[a-z0-9-]{1,64}$/;

export function sanitizeProgress(input: Partial<PremiumProgress>): PremiumProgress {
  const completedModuleIds = Array.isArray(input.completedModuleIds)
    ? [...new Set(input.completedModuleIds.filter((value): value is string => typeof value === "string" && moduleIds.has(value)))].slice(0, premiumProduct.modules.length)
    : [];
  const activeModuleId = typeof input.activeModuleId === "string" && moduleIds.has(input.activeModuleId)
    ? input.activeModuleId
    : completedModuleIds.length < premiumProduct.modules.length
      ? premiumProduct.modules.find((module) => !completedModuleIds.includes(module.id))?.id || premiumProduct.modules[0].id
      : premiumProduct.modules[premiumProduct.modules.length - 1].id;
  const completedTaskIds = Array.isArray(input.completedTaskIds)
    ? [...new Set(input.completedTaskIds.filter((value): value is string => typeof value === "string" && permittedTaskPattern.test(value)))].slice(0, 100)
    : [];
  return { completedModuleIds, activeModuleId, completedTaskIds, updatedAt: new Date().toISOString() };
}

export default async function handler(req: PremiumRequest, res: PremiumResponse) {
  noStore(res);
  res.setHeader("Allow", "GET, PATCH, DELETE");
  if (req.method !== "GET" && req.method !== "PATCH" && req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const access = await requireActiveEntitlement(req);
  if (!access.ok) {
    const status = access.reason === "signed_out" ? 401 : access.reason === "purchase_required" ? 403 : 503;
    return res.status(status).json({ error: access.reason, protected: true });
  }

  const key = progressKey(access.session.email);
  if (req.method === "PATCH" || req.method === "DELETE") {
    try { assertSameOrigin(req); } catch { return res.status(403).json({ error: "Request could not be verified." }); }
  }

  if (req.method === "DELETE") {
    await deleteKey(key);
    const progress = sanitizeProgress({});
    console.info("caf_premium_event", { event: "progress_deleted", productId: premiumProduct.id });
    return res.status(200).json({ progress, deleted: true });
  }

  if (req.method === "PATCH") {
    const body = parseBody<Partial<PremiumProgress>>(req.body);
    const progress = sanitizeProgress(body);
    await setJson(key, progress);
    return res.status(200).json({ progress });
  }

  const stored = await getJson<PremiumProgress>(key);
  const progress = sanitizeProgress(stored || {});
  return res.status(200).json({
    product: premiumProduct,
    progress,
    access: {
      purchasedAt: access.entitlement.purchasedAt,
      updatesUntil: access.entitlement.updatesUntil,
      accessStatus: access.entitlement.status,
      testMode: access.entitlement.testMode,
    },
  });
}
