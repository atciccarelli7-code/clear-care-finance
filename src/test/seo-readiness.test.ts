import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("SEO readiness files", () => {
  it("keeps robots.txt crawlable and pointed at the canonical sitemap", () => {
    const robots = readProjectFile("public/robots.txt");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Sitemap: https://communityacquiredfinance.com/sitemap.xml");
  });

  it("keeps the AdSense publisher declaration intact", () => {
    const ads = readProjectFile("public/ads.txt").trim();

    expect(ads).toBe("google.com, pub-3330626498830044, DIRECT, f08c47fec0942fa0");
  });

  it("lists canonical public routes without fragment URLs", () => {
    const sitemap = readProjectFile("public/sitemap.xml");

    expect(sitemap).toContain("<loc>https://communityacquiredfinance.com/tools</loc>");
    expect(sitemap).toContain("<loc>https://communityacquiredfinance.com/articles</loc>");
    expect(sitemap).toContain("<loc>https://communityacquiredfinance.com/topics/medicare-medicaid</loc>");
    expect(sitemap).not.toMatch(/<loc>[^<]*#/);
  });
});

describe("calculator hash navigation", () => {
  it("keeps legacy calculator anchors present on the tools page", () => {
    const toolsPage = readProjectFile("src/pages/Tools.tsx");
    const anchorIds = [
      "open-enrollment-checklist",
      "hospital-bill-checklist",
      "eob-bill-match",
      "financial-assistance-checklist",
      "403b",
      "overtime",
      "insurance",
      "open-enrollment",
      "paycheck-impact",
      "supplemental-benefits",
      "hsa-fsa",
      "medicare",
      "cafe",
      "loan",
    ];

    anchorIds.forEach((id) => {
      expect(toolsPage).toContain(`id="${id}"`);
    });
  });
});
