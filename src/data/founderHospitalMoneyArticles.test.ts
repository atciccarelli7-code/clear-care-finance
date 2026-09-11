import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";
import { FOUNDER_HOSPITAL_MONEY_ARTICLES } from "@/data/founderHospitalMoneyArticles";
import { PUBLISHER_ARTICLE_REVIEWS } from "@/data/publisherArticleReviewLedger";
import { resolveContentGovernance } from "@/lib/contentGovernance";

const slug = "how-a-hospital-actually-makes-money";

const authoritativeHosts = new Set([
  "cms.gov",
  "www.cms.gov",
  "macpac.gov",
  "www.macpac.gov",
]);

describe("founder hospital-money article", () => {
  it("publishes one substantial RN-authored article", () => {
    expect(FOUNDER_HOSPITAL_MONEY_ARTICLES).toHaveLength(1);
    const article = FOUNDER_HOSPITAL_MONEY_ARTICLES[0];

    expect(article.slug).toBe(slug);
    expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
    expect(article.publishedAt).toBe("2026-09-10");
    expect(article.lastReviewedAt).toBe("2026-09-10");
    expect(article.editorialSections?.length).toBeGreaterThanOrEqual(10);
    expect(article.systemMap?.steps).toHaveLength(4);
    expect(article.systemLens?.items).toHaveLength(5);
    expect(article.sources.length).toBeGreaterThanOrEqual(8);
    expect(ALL_ARTICLES.some((candidate) => candidate.slug === slug)).toBe(true);
  });

  it("uses current authoritative source hosts", () => {
    for (const source of FOUNDER_HOSPITAL_MONEY_ARTICLES[0].sources) {
      const url = new URL(source.url);
      expect(url.protocol).toBe("https:");
      expect(authoritativeHosts.has(url.hostname)).toBe(true);
      expect(source.note?.length ?? 0).toBeGreaterThan(40);
    }
  });

  it("has an explicit publisher review while monetization remains deferred", () => {
    const review = PUBLISHER_ARTICLE_REVIEWS.find((candidate) => candidate.slug === slug);
    const governance = resolveContentGovernance(`/articles/${slug}`, { knownRoute: true });

    expect(review).toBeDefined();
    expect(review?.disposition).toBe("ad-free-editorial");
    expect(review?.reviewedAt).toBe("2026-09-10");
    expect(governance.reviewStatus).toBe("reviewed");
    expect(governance.adEligible).toBe(false);
  });

  it("preserves the payment and discharge guardrails", () => {
    const text = JSON.stringify(FOUNDER_HOSPITAL_MONEY_ARTICLES).toLowerCase();

    expect(text).not.toContain("every hospital is paid");
    expect(text).not.toContain("day five is where profitability ends");
    expect(text).toContain("a premature discharge can be bad care and bad economics");
    expect(text).toContain("there is not one answer");
    expect(text).toContain("purely as an illustration");
  });
});
