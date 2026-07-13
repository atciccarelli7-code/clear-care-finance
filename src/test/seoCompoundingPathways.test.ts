import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";
import {
  getArticleCompoundingPathway,
  getHubCompoundingPathway,
  getHubCompoundingPaths,
  getVisibleCompoundingCards,
} from "@/data/seoCompoundingPathways";

const expectedHubPaths = [
  "/healthcare-workers",
  "/build-wealth",
  "/insurance",
  "/open-enrollment",
  "/patients-families",
  "/medicare-care-costs",
  "/articles",
  "/tools",
];

const upgradedArticleSlugs = [
  "how-hospital-403b-matching-works",
  "facility-fee-vs-professional-fee",
  "backup-care-plans-for-busy-healthcare-workers",
  "prescription-coverage-open-enrollment-checklist",
  "prior-authorization-explained",
  "spouse-family-health-insurance-open-enrollment",
  "accident-critical-illness-hospital-indemnity-open-enrollment",
  "deductible-copay-coinsurance-out-of-pocket-max",
  "how-to-read-an-eob",
];

describe("SEO compounding pathways", () => {
  it("configures one focused pathway for every priority hub", () => {
    expect(getHubCompoundingPaths().sort()).toEqual(expectedHubPaths.sort());

    for (const path of expectedHubPaths) {
      const pathway = getHubCompoundingPathway(path);
      expect(pathway).not.toBeNull();
      expect(pathway?.cards.length).toBeGreaterThanOrEqual(4);
      expect(pathway?.cards.every((card) => card.href.startsWith("/"))).toBe(true);
      expect(new Set(pathway?.cards.map((card) => card.href)).size).toBe(pathway?.cards.length);
    }
  });

  it("removes self-links, duplicate destinations, and excessive cards", () => {
    const pathway = getArticleCompoundingPathway("how-to-read-an-eob");
    expect(pathway).not.toBeNull();

    const visible = getVisibleCompoundingCards(pathway!, "/articles/how-to-read-an-eob", 4);
    expect(visible).toHaveLength(4);
    expect(visible.some((card) => card.href === "/articles/how-to-read-an-eob")).toBe(false);
    expect(new Set(visible.map((card) => card.href)).size).toBe(visible.length);
  });

  it("connects the demonstrated Search Console topic clusters", () => {
    expect(getArticleCompoundingPathway("deductible-copay-coinsurance-out-of-pocket-max")?.id).toBe("cost_sharing_to_bill_review");
    expect(getArticleCompoundingPathway("facility-fee-vs-professional-fee")?.id).toBe("hospital_bill_review");
    expect(getArticleCompoundingPathway("how-hospital-403b-matching-works")?.id).toBe("healthcare_retirement_sequence");
    expect(getArticleCompoundingPathway("spouse-family-health-insurance-open-enrollment")?.id).toBe("household_open_enrollment");
  });

  it("keeps upgraded article URLs stable and avoids duplicate direct-answer sections", () => {
    for (const slug of upgradedArticleSlugs) {
      const article = ALL_ARTICLES.find((candidate) => candidate.slug === slug);
      expect(article, slug).toBeDefined();
      expect(article?.slug).toBe(slug);

      const directAnswerCount = (article?.sections ?? []).filter(
        (section) => section.title.trim().toLowerCase() === "the direct answer",
      ).length;
      expect(directAnswerCount, slug).toBeLessThanOrEqual(1);
    }
  });
});
