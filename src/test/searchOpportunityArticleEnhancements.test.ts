import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";

const getArticle = (slug: string) => {
  const article = ALL_ARTICLES.find((item) => item.slug === slug);
  expect(article, `Expected published article: ${slug}`).toBeDefined();
  return article!;
};

describe("Search Console opportunity article enhancements", () => {
  it("strengthens the cash versus investing search intent", () => {
    const article = getArticle("cash-vs-investing-when-you-feel-behind");

    expect(article.title).toBe("Should You Keep Cash or Invest It? A Practical Decision Framework");
    expect(article.sections?.[0]?.title).toBe("The direct answer");
    expect(article.comparisonTable?.rows).toHaveLength(4);
    expect(article.lastReviewedAt).toBe("2026-07-15");
  });

  it("turns hospital cafeteria spending into a concrete annual-cost answer", () => {
    const article = getArticle("hospital-cafe-habit");

    expect(article.title).toContain("Cost Per Year");
    expect(article.summary).toContain("average spending per shift");
    expect(article.numberedSteps).toHaveLength(6);
    expect(article.questionsToAsk).toHaveLength(6);
  });

  it("connects long-term-care intent to the eligibility pathway", () => {
    const article = getArticle("long-term-care-and-custodial-care");

    expect(article.title).toContain("Skilled Care vs. Custodial Care");
    expect(article.timeSensitive).toBe(true);
    expect(article.relatedCalculator?.href).toBe("/tools/medicare-medicaid-eligibility-check");
  });

  it("refreshes the 2026 Medicare comparison without changing its canonical slug", () => {
    const article = getArticle("medicare-advantage-vs-original-medicare-2026");

    expect(article.slug).toBe("medicare-advantage-vs-original-medicare-2026");
    expect(article.title).toBe("Medicare Advantage vs. Original Medicare in 2026: Key Tradeoffs");
    expect(article.relatedCalculator?.href).toBe("/tools/medicare-advantage-plan-helper");
    expect(article.nextReviewAt).toBe("2026-10-15");
  });
});
