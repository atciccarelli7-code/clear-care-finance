import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_ARTICLES } from "@/data/consumerPatientGuideArticles";
import { ALL_ARTICLES } from "@/data/allArticles";
import { resolveContentGovernance } from "@/lib/contentGovernance";

const articleText = (article: (typeof CONSUMER_PATIENT_GUIDE_ARTICLES)[number]) =>
  JSON.stringify(article).toLowerCase();

describe("consumer Hospital & Patient Guide conversion", () => {
  it("publishes five unique source-backed RN-authored consumer guides", () => {
    expect(CONSUMER_PATIENT_GUIDE_ARTICLES).toHaveLength(5);
    expect(new Set(CONSUMER_PATIENT_GUIDE_ARTICLES.map((article) => article.slug)).size).toBe(5);

    for (const article of CONSUMER_PATIENT_GUIDE_ARTICLES) {
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.reviewer).toBeUndefined();
      expect(article.sources.length).toBeGreaterThanOrEqual(2);
      expect(article.lastReviewedAt).toBe("2026-07-19");
      expect(ALL_ARTICLES.some((candidate) => candidate.slug === article.slug)).toBe(true);
    }
  });

  it("keeps high-risk instructions and approval claims out of the public guide data", () => {
    const combined = CONSUMER_PATIENT_GUIDE_ARTICLES.map(articleText).join(" ");
    const prohibitedClaims = [
      "hospital approved",
      "clinically validated",
      "medically reviewed by",
      "pilot ready",
      "guarantees fewer readmissions",
    ];

    for (const claim of prohibitedClaims) expect(combined).not.toContain(claim);
    expect(combined).toContain("does not provide");
    expect(combined).toContain("do not change oxygen flow");
    expect(combined).toContain("does not supply dosing");
  });

  it("keeps the guide hub and all five articles ad-free", () => {
    expect(resolveContentGovernance("/patients-families/hospital-guide").adEligible).toBe(false);
    for (const article of CONSUMER_PATIENT_GUIDE_ARTICLES) {
      expect(resolveContentGovernance(`/articles/${article.slug}`, { knownRoute: true })).toMatchObject({
        publicAvailable: true,
        indexable: true,
        adEligible: false,
        pageType: "article",
      });
    }
  });
});
