import { describe, expect, it } from "vitest";
import { FOUNDER_CARE_TRANSITIONS_ARTICLES } from "@/data/founderCareTransitionsArticles";
import { ALL_ARTICLES } from "@/data/allArticles";

const expectedSlugs = [
  "patient-in-the-bed-and-patient-in-the-chart",
  "what-happens-while-hospital-is-waiting-on-insurance",
  "medically-ready-is-not-the-same-as-ready-for-home",
];

const citationNumbers = (text: string) =>
  Array.from(text.matchAll(/\[(\d+)\]/g), (match) => Number(match[1]));

describe("founder care-transition article batch", () => {
  it("publishes the three Astra-reviewed founder articles", () => {
    expect(FOUNDER_CARE_TRANSITIONS_ARTICLES).toHaveLength(3);
    expect(FOUNDER_CARE_TRANSITIONS_ARTICLES.map((article) => article.slug)).toEqual(expectedSlugs);

    expectedSlugs.forEach((slug) => {
      expect(ALL_ARTICLES.some((article) => article.slug === slug)).toBe(true);
    });
  });

  it("preserves publication metadata, source depth, and founder-led structure", () => {
    FOUNDER_CARE_TRANSITIONS_ARTICLES.forEach((article) => {
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.publishedAt).toBe("2026-09-08");
      expect(article.lastReviewedAt).toBe("2026-09-08");
      expect(article.editorialSections?.length ?? 0).toBeGreaterThanOrEqual(10);
      expect(article.sources.length).toBeGreaterThanOrEqual(8);
      expect(article.systemMap?.steps.length ?? 0).toBeGreaterThanOrEqual(4);
      expect(article.systemLens?.items.length ?? 0).toBeGreaterThanOrEqual(5);
    });
  });

  it("keeps every inline source marker inside the article source list", () => {
    FOUNDER_CARE_TRANSITIONS_ARTICLES.forEach((article) => {
      const text = article.editorialSections
        ?.flatMap((section) => section.paragraphs)
        .join("\n") ?? "";

      const markers = citationNumbers(text);
      expect(markers.length).toBeGreaterThan(0);
      markers.forEach((number) => {
        expect(number).toBeGreaterThanOrEqual(1);
        expect(number).toBeLessThanOrEqual(article.sources.length);
      });
    });
  });

  it("protects signature founder-language from generic rewrites", () => {
    const bySlug = new Map(FOUNDER_CARE_TRANSITIONS_ARTICLES.map((article) => [article.slug, article]));
    const textFor = (slug: string) =>
      bySlug.get(slug)?.editorialSections?.flatMap((section) => section.paragraphs).join("\n") ?? "";

    expect(textFor(expectedSlugs[0])).toContain("The patient in the chart keeps traveling.");
    expect(textFor(expectedSlugs[1])).toContain("The phrase “waiting on insurance” compresses all of that into four words.");
    expect(textFor(expectedSlugs[2])).toContain("ready for everything waiting at home.");
  });
});
