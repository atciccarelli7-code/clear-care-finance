import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import TotalCompensationComparison from "@/components/calculators/TotalCompensationComparison";

describe("total-compensation hydration", () => {
  it("keeps the prerendered result independent of the server clock and timezone", () => {
    const html = renderToString(<TotalCompensationComparison />);

    expect(html).toContain("Generated<!-- -->. Re-run the comparison after changing inputs.");
    expect(html).not.toContain(new Date().toLocaleDateString());
  });
});
