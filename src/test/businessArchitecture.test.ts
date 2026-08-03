import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("CAF free-core and paid-flagship business architecture", () => {
  it("classifies every canonical and supplemental route asset without enabling commerce", () => {
    expect(() => {
      execFileSync(process.execPath, ["scripts/generate-business-role-inventory.mjs"], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: "pipe",
      });
    }).not.toThrow();
  });
});
