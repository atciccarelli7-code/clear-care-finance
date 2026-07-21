import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  path.resolve(process.cwd(), "src/components/navigator/FinancialNavigator.tsx"),
  "utf8",
);

describe("Financial Navigator public language", () => {
  it("uses human labels for plan rules and device-only saved progress", () => {
    expect(source).toContain("Consistent plan rules");
    expect(source).toContain("Saved on this device");
    expect(source).toContain("Every recommendation follows a reviewable rule instead of a hidden or improvised answer.");
    expect(source).not.toContain("Deterministic recommendations");
    expect(source).not.toContain(">Local workspace</span>");
    expect(source).not.toContain("opaque generated advice");
  });
});
