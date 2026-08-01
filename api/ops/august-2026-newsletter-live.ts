import { createHash, timingSafeEqual } from "node:crypto";
import previewHandler from "./august-2026-newsletter";

type ApiRequest = {
  method?: string;
  url?: string;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const authorizedTokenHash = "3e7f794f736c34561d40351a82b9469a28847057defddfadbb7309cd8003c888";
const expiresAt = Date.parse("2026-08-03T00:00:00Z");

function isAuthorized(token: string | null) {
  if (!token) return false;
  const actual = Buffer.from(createHash("sha256").update(token).digest("hex"));
  const expected = Buffer.from(authorizedTokenHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader("Allow", "GET");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (process.env.VERCEL_ENV !== "production") return res.status(404).json({ error: "Not found" });
  if (Date.now() >= expiresAt) return res.status(410).json({ error: "This one-time operation has expired." });

  const url = new URL(req.url || "/", "https://communityacquiredfinance.com");
  if (!isAuthorized(url.searchParams.get("token"))) {
    return res.status(404).json({ error: "Not found" });
  }

  const originalEnvironment = process.env.VERCEL_ENV;
  const originalBranch = process.env.VERCEL_GIT_COMMIT_REF;

  process.env.VERCEL_ENV = "preview";
  process.env.VERCEL_GIT_COMMIT_REF = "ops/august-2026-newsletter";

  try {
    return await previewHandler(req, res);
  } finally {
    process.env.VERCEL_ENV = originalEnvironment;
    process.env.VERCEL_GIT_COMMIT_REF = originalBranch;
  }
}
