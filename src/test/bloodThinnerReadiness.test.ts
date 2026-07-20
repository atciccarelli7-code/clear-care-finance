import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_ARTICLES } from "@/data/consumerPatientGuideArticles";

describe("blood thinner consumer checklist boundary", () => {
  it("routes decisions back to the responsible care team", () => {
    const guide = CONSUMER_PATIENT_GUIDE_ARTICLES.find((article) => article.slug === "blood-thinner-safety-before-going-home");
    const text = JSON.stringify(guide);
    expect(text).toContain("responsible treating team");
    expect(text).toContain("missed-dose");
    expect(text).toContain("does not provide product-specific doses");
  });
});
