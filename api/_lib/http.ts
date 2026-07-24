import { timingSafeEqual } from "node:crypto";

export type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  url?: string;
  query?: Record<string, string | string[] | undefined>;
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>;
};

export type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
  send?: (body: string) => void;
  end?: (body?: string) => void;
  setHeader: (name: string, value: string) => void;
};

export const setPrivateHeaders = (res: ApiResponse) => {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
};

export const methodNotAllowed = (res: ApiResponse, methods: string[]) => {
  res.setHeader("Allow", methods.join(", "));
  return res.status(405).json({ code: "method_not_allowed", message: "Method not allowed." });
};

export const safeError = (res: ApiResponse, status: number, code: string, message: string) =>
  res.status(status).json({ code, message });

export const parseJsonBody = <T = Record<string, unknown>>(req: ApiRequest): T => {
  if (typeof req.body === "string") return JSON.parse(req.body) as T;
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString("utf8")) as T;
  return (req.body || {}) as T;
};

export const bearerToken = (req: ApiRequest) => {
  const value = req.headers.authorization;
  const header = Array.isArray(value) ? value[0] : value;
  if (!header?.startsWith("Bearer ")) return "";
  return header.slice(7).trim();
};

export const readRawBody = async (req: ApiRequest) => {
  if (Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return Buffer.from(req.body);
  const chunks: Buffer[] = [];
  if (req[Symbol.asyncIterator]) {
    for await (const chunk of req as unknown as AsyncIterable<Buffer | string>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  }
  return Buffer.concat(chunks);
};

export const sameOrigin = (req: ApiRequest, expectedOrigin: string) => {
  const raw = req.headers.origin;
  const origin = Array.isArray(raw) ? raw[0] : raw;
  if (!origin) return true;
  try {
    const allowed = new Set([new URL(expectedOrigin).origin]);
    if (process.env.VERCEL_ENV === "preview") {
      [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
        .filter(Boolean)
        .forEach((host) => allowed.add(new URL(`https://${host}`).origin));
    }
    return allowed.has(new URL(origin).origin);
  } catch {
    return false;
  }
};

export const constantTimeEqual = (left: string, right: string) => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};
