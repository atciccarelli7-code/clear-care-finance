import { describe, expect, it } from "vitest";
import {
  classifyRuntimeFailure,
  prepareAutomaticRuntimeRecovery,
  runtimeRecoveryKey,
  type RuntimeRecoveryStorage,
} from "@/lib/runtimeRecovery";

const createMemoryStorage = (): RuntimeRecoveryStorage => {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

describe("runtime recovery", () => {
  it("recognizes common stale chunk and dynamic-import failures", () => {
    expect(classifyRuntimeFailure(new Error("ChunkLoadError: Loading chunk 42 failed"))).toBe("chunk_load");
    expect(classifyRuntimeFailure(new Error("Failed to fetch dynamically imported module: /assets/ToolPage.js"))).toBe("chunk_load");
    expect(classifyRuntimeFailure("Importing a module script failed")).toBe("chunk_load");
    expect(classifyRuntimeFailure(new Error("Unexpected render failure"))).toBe("render");
  });

  it("allows only one automatic reload for the same route and build", () => {
    const storage = createMemoryStorage();
    const input = {
      error: new Error("Failed to fetch dynamically imported module"),
      pathname: "/tools/benefits-change-detector?ignored=true",
      buildId: "/assets/index-build-a.js",
      storage,
    };

    expect(prepareAutomaticRuntimeRecovery(input)).toBe(true);
    expect(prepareAutomaticRuntimeRecovery(input)).toBe(false);
  });

  it("treats a new deployed entry asset as a separate bounded recovery opportunity", () => {
    const storage = createMemoryStorage();
    const error = new Error("Loading chunk decision-tools failed");

    expect(prepareAutomaticRuntimeRecovery({
      error,
      pathname: "/start-here",
      buildId: "/assets/index-build-a.js",
      storage,
    })).toBe(true);

    expect(prepareAutomaticRuntimeRecovery({
      error,
      pathname: "/start-here",
      buildId: "/assets/index-build-b.js",
      storage,
    })).toBe(true);
  });

  it("never auto-reloads an ordinary render failure", () => {
    const storage = createMemoryStorage();
    expect(prepareAutomaticRuntimeRecovery({
      error: new Error("A component threw while rendering"),
      pathname: "/start-here",
      buildId: "/assets/index-build-a.js",
      storage,
    })).toBe(false);
  });

  it("creates stable keys without retaining route or asset text", () => {
    const key = runtimeRecoveryKey("/tools/private-example?secret=1", "/assets/index-sensitive-name.js");
    expect(key).toMatch(/^caf-runtime-recovery-v1:[a-z0-9]+:[a-z0-9]+$/);
    expect(key).not.toContain("private-example");
    expect(key).not.toContain("sensitive-name");
    expect(key).not.toContain("secret");
  });
});
