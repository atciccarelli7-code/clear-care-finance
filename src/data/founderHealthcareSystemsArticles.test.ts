import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";
import { FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES } from "@/data/founderHealthcareSystemsArticles";
import { FEATURED_PUBLISHER_ARTICLES } from "@/data/featuredPublisherArticles";
import { HEALTHCARE_CONFUSION_ARTICLES } from "@/data/healthcareConfusionArticles";
import { PUBLISHER_ARTICLE_REVIEWS } from "@/data/publisherArticleReviewLedger";
import { resolveContentGovernance } from "@/lib/contentGovernance";

const newSlugs = [
  "why-hospitals-become-the-systems-shock-absorber",
  "home-with-family-is-not-a-free-care-plan",
] as const;

const authoritativeHosts = new Set([
  "www.ahrq.gov",
  "www.bls.gov",
  "www.cms.gov",
  "www.dol.gov",
  "www.ecfr.gov",
  "www.medicaid.gov",
  "www.medicare.gov",
  "www.medpac.gov",
  "acl.gov",
]);

describe("founder healthcare-systems publication package", () => {
  it("publishes two distinct, complete, RN-authored articles", () => {
    expect(FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES.map((article) => article.slug)).toEqual(newSlugs);
    expect(new Set(FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES.map((article) => article.slug)).size).toBe(2);

    for (const article of FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES) {
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.publishedAt).toBe("2026-08-30");
      expect(article.lastReviewedAt).toBe("2026-08-30");
      expect(article.editorialSections?.length).toBeGreaterThanOrEqual(7);
      expect(article.systemMap?.steps).toHaveLength(4);
      expect(article.systemLens?.items).toHaveLength(5);
      expect(article.questionsToAsk?.length).toBeGreaterThanOrEqual(6);
      expect(article.sources.length).toBeGreaterThanOrEqual(5);
      expect(ALL_ARTICLES.some((candidate) => candidate.slug === article.slug)).toBe(true);
    }
  });

  it("keeps compact homepage cards in sync without loading full article bodies into the entry bundle", () => {
    expect(FEATURED_PUBLISHER_ARTICLES).toHaveLength(6);

    for (const card of FEATURED_PUBLISHER_ARTICLES) {
      const article = ALL_ARTICLES.find((candidate) => candidate.slug === card.slug);
      expect(article).toBeDefined();
      expect(card).toEqual({
        slug: article?.slug,
        title: article?.title,
        category: article?.category,
        readTime: article?.readTime,
        promise: article?.promise,
      });
    }
  });

  it("uses authoritative sources with claim-specific notes", () => {
    for (const article of FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES) {
      for (const source of article.sources) {
        const sourceUrl = new URL(source.url);
        expect(sourceUrl.protocol).toBe("https:");
        expect(authoritativeHosts.has(sourceUrl.hostname)).toBe(true);
        expect(source.note?.length ?? 0).toBeGreaterThan(60);
      }
    }
  });

  it("gives every article an affirmative publisher disposition and protects caregiving", () => {
    const reviews = PUBLISHER_ARTICLE_REVIEWS.filter((review) => newSlugs.includes(review.slug as (typeof newSlugs)[number]));
    expect(reviews).toHaveLength(2);

    expect(resolveContentGovernance("/articles/why-hospitals-become-the-systems-shock-absorber", { knownRoute: true }).adEligible).toBe(true);
    expect(resolveContentGovernance("/articles/home-with-family-is-not-a-free-care-plan", { knownRoute: true }).adEligible).toBe(false);
  });

  it("keeps founder interpretation bounded and avoids invented patient stories", () => {
    const text = JSON.stringify(FOUNDER_HEALTHCARE_SYSTEMS_ARTICLES).toLowerCase();
    expect(text).toContain("sometimes the hospital owns the bottleneck");
    expect(text).toContain("does not measure every kind of family caregiving");
    expect(text).toContain("home is not a second-rate destination");
    expect(text).toContain("not as proof that every crowded emergency department was caused");
    expect(text).not.toContain("room number");
  });

  it("substantively upgrades the existing observation canonical without a duplicate", () => {
    const observationArticles = ALL_ARTICLES.filter((article) => article.slug === "observation-vs-inpatient-status");
    const sourceArticle = HEALTHCARE_CONFUSION_ARTICLES.find((article) => article.slug === "observation-vs-inpatient-status");

    expect(observationArticles).toHaveLength(1);
    expect(sourceArticle?.lastReviewedAt).toBe("2026-08-30");
    expect(sourceArticle?.timeSensitive).toBe(true);
    expect(sourceArticle?.editorialSections?.length).toBeGreaterThanOrEqual(8);
    expect(sourceArticle?.systemMap?.steps).toHaveLength(4);
    expect(sourceArticle?.systemLens?.items).toHaveLength(5);
    expect(sourceArticle?.sources.length).toBeGreaterThanOrEqual(5);
    expect(JSON.stringify(sourceArticle)).toContain("Medicare Advantage plans may also waive");
    expect(JSON.stringify(sourceArticle)).toContain("The MOON is an explanation, not a universal appeal ticket");
    expect(resolveContentGovernance("/articles/observation-vs-inpatient-status", { knownRoute: true }).adEligible).toBe(false);
  });
});
