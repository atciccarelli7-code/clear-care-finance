import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";
import { CORE_ARTICLES } from "@/data/coreArticles";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "@/data/founderHospitalEconomicsArticles";
import { PUBLISHER_ARTICLE_REVIEWS } from "@/data/publisherArticleReviews";
import { resolveContentGovernance } from "@/lib/contentGovernance";

const expectedSlugs = [
  "20-dollar-tylenol-hospital-prices",
  "what-nonprofit-hospital-actually-means",
  "why-hospitals-care-about-length-of-stay",
  "why-just-send-them-to-rehab-is-not-simple",
] as const;

const authoritativeHosts = new Set([
  "ahrq.gov",
  "cms.gov",
  "irs.gov",
  "medicare.gov",
  "medpac.gov",
  "oig.hhs.gov",
  "rand.org",
  "www.ahrq.gov",
  "www.cms.gov",
  "www.irs.gov",
  "www.medicare.gov",
  "www.medpac.gov",
  "www.rand.org",
]);

describe("founder hospital-economics publication package", () => {
  it("publishes four unique, substantial, RN-authored articles", () => {
    expect(FOUNDER_HOSPITAL_ECONOMICS_ARTICLES.map((article) => article.slug)).toEqual(expectedSlugs);
    expect(new Set(FOUNDER_HOSPITAL_ECONOMICS_ARTICLES.map((article) => article.slug)).size).toBe(4);

    for (const article of FOUNDER_HOSPITAL_ECONOMICS_ARTICLES) {
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.publishedAt).toBe("2026-08-29");
      expect(article.lastReviewedAt).toBe("2026-08-29");
      expect(article.editorialSections?.length).toBeGreaterThanOrEqual(5);
      expect(article.systemMap?.steps).toHaveLength(4);
      expect(article.systemLens?.items).toHaveLength(5);
      expect(article.sources.length).toBeGreaterThanOrEqual(4);
      expect(ALL_ARTICLES.some((candidate) => candidate.slug === article.slug)).toBe(true);
      expect(CORE_ARTICLES.some((candidate) => candidate.slug === article.slug)).toBe(false);
    }
  });

  it("uses authoritative sources and valid source URLs", () => {
    for (const article of FOUNDER_HOSPITAL_ECONOMICS_ARTICLES) {
      for (const source of article.sources) {
        const sourceUrl = new URL(source.url);
        expect(sourceUrl.protocol).toBe("https:");
        expect(authoritativeHosts.has(sourceUrl.hostname)).toBe(true);
        expect(source.note?.length ?? 0).toBeGreaterThan(40);
      }
    }
  });

  it("records a complete publisher disposition and keeps discharge decisions ad-free", () => {
    const reviews = PUBLISHER_ARTICLE_REVIEWS.filter((review) => expectedSlugs.includes(review.slug as (typeof expectedSlugs)[number]));
    expect(reviews).toHaveLength(4);

    expect(resolveContentGovernance("/articles/20-dollar-tylenol-hospital-prices", { knownRoute: true }).adEligible).toBe(true);
    expect(resolveContentGovernance("/articles/what-nonprofit-hospital-actually-means", { knownRoute: true }).adEligible).toBe(true);
    expect(resolveContentGovernance("/articles/why-hospitals-care-about-length-of-stay", { knownRoute: true }).adEligible).toBe(false);
    expect(resolveContentGovernance("/articles/why-just-send-them-to-rehab-is-not-simple", { knownRoute: true }).adEligible).toBe(false);
  });

  it("does not publish identifiable patient anecdotes or universal payment claims", () => {
    const text = JSON.stringify(FOUNDER_HOSPITAL_ECONOMICS_ARTICLES).toLowerCase();
    expect(text).not.toContain("room number");
    expect(text).not.toContain("every hospital is paid");
    expect(text).toContain("does not mean 95 percent of all rehab denials everywhere are wrong");
    expect(text).toContain("a recommendation is important evidence—not a reservation");
    expect(text).toContain("a shorter stay is not automatically better");
  });
});
