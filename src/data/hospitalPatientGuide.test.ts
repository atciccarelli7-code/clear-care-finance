import { describe, expect, it } from "vitest";
import { HOSPITAL_PATIENT_ARTICLES } from "@/data/hospitalPatientArticles";
import {
  HOSPITAL_GUIDE_RESOURCES,
  HOSPITAL_GUIDE_ROUTE,
  HOSPITAL_GUIDE_STAGES,
  PATIENT_GATEWAY_JOURNEYS,
  getHospitalGuideResourcesForStage,
} from "@/data/hospitalPatientGuide";
import { resolveContentGovernance } from "@/lib/contentGovernance";

describe("Hospital & Patient Guide configuration", () => {
  it("defines five unique ordered stages and all seven patient gateway journeys", () => {
    expect(HOSPITAL_GUIDE_STAGES.map((stage) => stage.number)).toEqual([1, 2, 3, 4, 5]);
    expect(new Set(HOSPITAL_GUIDE_STAGES.map((stage) => stage.id)).size).toBe(5);
    expect(PATIENT_GATEWAY_JOURNEYS).toHaveLength(7);
    expect(PATIENT_GATEWAY_JOURNEYS[0].href).toBe(HOSPITAL_GUIDE_ROUTE);
  });

  it("keeps resource IDs and canonical routes unique and assigns every published resource to a stage", () => {
    expect(new Set(HOSPITAL_GUIDE_RESOURCES.map((resource) => resource.id)).size).toBe(HOSPITAL_GUIDE_RESOURCES.length);
    expect(new Set(HOSPITAL_GUIDE_RESOURCES.map((resource) => resource.canonicalRoute)).size).toBe(HOSPITAL_GUIDE_RESOURCES.length);

    for (const stage of HOSPITAL_GUIDE_STAGES) {
      expect(getHospitalGuideResourcesForStage(stage.id).length).toBeGreaterThan(0);
    }
  });

  it("registers exactly two new source-backed launch articles in the guide", () => {
    const launched = HOSPITAL_GUIDE_RESOURCES.filter((resource) => resource.availability === "new" && resource.launchStatus === "published");
    const articleRoutes = HOSPITAL_PATIENT_ARTICLES.map((article) => `/articles/${article.slug}`);

    expect(launched).toHaveLength(2);
    expect(launched.map((resource) => resource.canonicalRoute).sort()).toEqual(articleRoutes.sort());
    for (const article of HOSPITAL_PATIENT_ARTICLES) {
      expect(article.sources.length).toBeGreaterThanOrEqual(3);
      expect(article.author).toBe("Andrew Ciccarelli, BSN, RN");
      expect(article.reviewer).toBeUndefined();
      expect(article.lastReviewedAt).toBe("2026-07-16");
    }
  });

  it("keeps the hub and clinical launch articles ad-free", () => {
    expect(resolveContentGovernance(HOSPITAL_GUIDE_ROUTE)).toMatchObject({ adEligible: false, pageType: "hub" });
    for (const article of HOSPITAL_PATIENT_ARTICLES) {
      expect(resolveContentGovernance(`/articles/${article.slug}`, { knownRoute: true })).toMatchObject({
        adEligible: false,
        pageType: "article",
        reviewStatus: "needs-review",
      });
    }
  });
});

