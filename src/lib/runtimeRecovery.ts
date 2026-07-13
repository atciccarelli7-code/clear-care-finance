export type RuntimeFailureType = "chunk_load" | "render";

export type RuntimeRecoveryStorage = Pick<Storage, "getItem" | "setItem">;

const CHUNK_FAILURE_PATTERNS = [
  /chunkloaderror/i,
  /loading chunk [\w-]+ failed/i,
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /failed to load module script/i,
];

const errorText = (error: unknown) => {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return String(error ?? "");
};

export const classifyRuntimeFailure = (error: unknown): RuntimeFailureType => {
  const text = errorText(error);
  return CHUNK_FAILURE_PATTERNS.some((pattern) => pattern.test(text)) ? "chunk_load" : "render";
};

const normalizePathname = (pathname: string) => {
  const withoutQuery = pathname.split(/[?#]/, 1)[0] || "/";
  const normalized = withoutQuery.replace(/\/+$/, "");
  return normalized || "/";
};

const stableHash = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
};

export const getRuntimeBuildId = (documentObject: Document = document) => {
  const entryScript = documentObject.querySelector<HTMLScriptElement>('script[type="module"][src]');
  if (!entryScript?.src) return "unknown-build";

  try {
    return new URL(entryScript.src, documentObject.baseURI).pathname;
  } catch {
    return entryScript.src.split(/[?#]/, 1)[0].slice(-160) || "unknown-build";
  }
};

export const runtimeRecoveryKey = (pathname: string, buildId: string) =>
  `caf-runtime-recovery-v1:${stableHash(normalizePathname(pathname))}:${stableHash(buildId || "unknown-build")}`;

export const prepareAutomaticRuntimeRecovery = ({
  error,
  pathname,
  buildId,
  storage,
}: {
  error: unknown;
  pathname: string;
  buildId: string;
  storage: RuntimeRecoveryStorage;
}) => {
  if (classifyRuntimeFailure(error) !== "chunk_load") return false;

  const key = runtimeRecoveryKey(pathname, buildId);
  try {
    if (storage.getItem(key) === "attempted") return false;
    storage.setItem(key, "attempted");
    return true;
  } catch {
    return false;
  }
};
