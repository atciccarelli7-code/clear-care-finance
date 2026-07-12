import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("production bundle configuration", () => {
  it("lets Rollup preserve a safe module graph instead of recreating the React vendor-cycle hydration failure", () => {
    const config = readFileSync(path.join(process.cwd(), "vite.config.ts"), "utf8");

    expect(config).not.toContain("manualChunks");
    expect(config).not.toMatch(/return\s+["']vendor["']/);
  });
});
