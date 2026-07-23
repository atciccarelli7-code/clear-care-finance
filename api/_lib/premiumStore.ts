type RedisEnvelope<T> = { result?: T; error?: string };

const redisUrl = () => (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "").replace(/\/$/, "");
const redisToken = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";

export const isPremiumStoreConfigured = () => Boolean(redisUrl() && redisToken());

export async function redisCommand<T = unknown>(...command: Array<string | number>) {
  if (!isPremiumStoreConfigured()) throw new Error("Premium store is not configured.");

  const response = await fetch(redisUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken()}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(command),
  });

  const payload = (await response.json()) as RedisEnvelope<T>;
  if (!response.ok || payload.error) throw new Error(payload.error || `Premium store request failed (${response.status}).`);
  return payload.result as T;
}

export async function getJson<T>(key: string): Promise<T | null> {
  const value = await redisCommand<string | null>("GET", key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown, options?: { expiresInSeconds?: number; onlyIfMissing?: boolean }) {
  const args: Array<string | number> = ["SET", key, JSON.stringify(value)];
  if (options?.onlyIfMissing) args.push("NX");
  if (options?.expiresInSeconds) args.push("EX", Math.max(1, Math.floor(options.expiresInSeconds)));
  return redisCommand<string | null>(...args);
}

export async function deleteKey(key: string) {
  return redisCommand<number>("DEL", key);
}

export async function getAndDeleteJson<T>(key: string): Promise<T | null> {
  const value = await redisCommand<string | null>("GETDEL", key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function incrementWithWindow(key: string, windowSeconds: number) {
  const count = await redisCommand<number>("INCR", key);
  if (count === 1) await redisCommand<number>("EXPIRE", key, Math.max(1, Math.floor(windowSeconds)));
  return count;
}
