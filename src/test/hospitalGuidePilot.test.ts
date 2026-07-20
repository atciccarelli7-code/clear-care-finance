import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_ARTICLES } from "@/data/consumerPatientGuideArticles";

describe("consumer guide conversion", () => {
  it("covers the five preserved topic families", () => {
    const slugs = CONSUMER_PATIENT_GUIDE_ARTICLES.map((article) => article.slug);
    expect(slugs).toEqual(expect.arrayContaining([
      "safe-hospital-discharge-first-72-hours",
      "blood-thinner-safety-before-going-home",
      "copd-recovery-after-hospital",
      "heart-failure-plan-after-discharge",
      "new-home-oxygen-nebulizer-guide",
    ]));
  });
});
