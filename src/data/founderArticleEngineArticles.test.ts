import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "./allArticles";
import { FOUNDER_ARTICLE_ENGINE_ARTICLES } from "./founderArticleEngineArticles";

describe("founder article engine release", () => {
  it("publishes the selected portfolio once at its intended canonicals", () => {
    expect(FOUNDER_ARTICLE_ENGINE_ARTICLES.map((article) => article.slug)).toEqual([
      "hospitals-are-businesses-and-public-utilities",
      "prior-authorization-explained",
      "hospital-profitable-unprofitable-service",
    ]);

    for (const article of FOUNDER_ARTICLE_ENGINE_ARTICLES) {
      expect(ALL_ARTICLES.filter(({ slug }) => slug === article.slug)).toHaveLength(1);
    }
  });

  it("meets the founder-led article evidence and transparency contract", () => {
    for (const article of FOUNDER_ARTICLE_ENGINE_ARTICLES) {
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.description.length).toBeGreaterThan(100);
      expect(article.summary?.length).toBeGreaterThan(300);
      expect(article.editorialSections?.length).toBeGreaterThanOrEqual(6);
      expect(article.systemMap?.steps).toHaveLength(4);
      expect(article.systemLens?.items).toHaveLength(5);
      expect(article.reviewScope?.length).toBeGreaterThan(80);
      expect(article.lastReviewedAt).toBe("2026-09-03");
      expect(article.nextReviewAt).toMatch(/^202(6|7)-/);
      expect(article.sources.length).toBeGreaterThanOrEqual(5);
      expect(article.sources.every(({ url }) => url.startsWith("https://"))).toBe(true);
    }
  });

  it("retains the adversarial qualifications that keep the theses honest", () => {
    const fullText = FOUNDER_ARTICLE_ENGINE_ARTICLES
      .map((article) => JSON.stringify(article))
      .join(" ");

    expect(fullText).toContain("not a universal federal promise");
    expect(fullText).toContain("Financial possibility is not proof of community benefit");
    expect(fullText).toContain("not a current all-market denial rate");
    expect(fullText).toContain("do not apply to drug requests");
  });
});
