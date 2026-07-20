import { describe, expect, it } from "vitest";
import { CONSUMER_PATIENT_GUIDE_ARTICLES } from "@/data/consumerPatientGuideArticles";

describe("consumer blood thinner safety guide", () => {
  it("withholds dosing and product-specific missed-dose instructions", () => {
    const guide = CONSUMER_PATIENT_GUIDE_ARTICLES.find((article) => article.slug === "blood-thinner-safety-before-going-home");
    const text = JSON.stringify(guide).toLowerCase();

    expect(guide).toBeDefined();
    expect(text).toContain("does not supply dosing");
    expect(text).toContain("does not provide product-specific doses");
    expect(text).toContain("do not stop, restart, double");
    expect(text).not.toContain("hospital approved");
    expect(text).not.toContain("medically reviewed by");
  });
});
