import { getJson } from "./premiumStore";
import {
  isValidPremiumProductContent,
  PREMIUM_CONTENT_STORE_KEY,
  type PremiumProductContent,
} from "./premiumProduct";

let cachedContent: PremiumProductContent | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60_000;

export async function getPremiumProductContent(): Promise<PremiumProductContent | null> {
  if (cachedContent && Date.now() - cachedAt < CACHE_TTL_MS) return cachedContent;

  const content = await getJson<unknown>(PREMIUM_CONTENT_STORE_KEY);
  if (!isValidPremiumProductContent(content)) return null;

  cachedContent = content;
  cachedAt = Date.now();
  return content;
}

export function clearPremiumProductContentCache() {
  cachedContent = null;
  cachedAt = 0;
}
