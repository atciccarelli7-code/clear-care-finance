import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "./allArticles";
import {
  DIAGNOSIS_EXPLAINED_ROUTE,
  DIAGNOSIS_GUIDE_EDITORIAL_GATES,
  DIAGNOSIS_GUIDE_PILOTS,
  DIAGNOSIS_GUIDE_SECTIONS,
} from "./diagnosisGuideFramework";

describe("Diagnosis, Explained framework", () => {
  it("keeps a complete, uniquely keyed guide structure", () => {
    const ids = DIAGNOSIS_GUIDE_SECTIONS.map((section) => section.id);

    expect(DIAGNOSIS_GUIDE_SECTIONS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining([
      "plain-english-meaning",
      "possible-causes",
      "treatment-goals",
      "medication-purpose",
      "warning-signs",
      "questions-to-ask",
      "sources-and-review",
    ]));
  });

  it("makes the diagnosis and medication safety boundaries explicit", () => {
    expect(DIAGNOSIS_GUIDE_EDITORIAL_GATES.join(" ")).toContain("does not diagnose");
    expect(DIAGNOSIS_GUIDE_EDITORIAL_GATES.join(" ")).toContain("Medication content");
    expect(DIAGNOSIS_GUIDE_EDITORIAL_GATES.join(" ")).toContain("personal health information");

    const medicationSection = DIAGNOSIS_GUIDE_SECTIONS.find((section) => section.id === "medication-purpose");
    expect(medicationSection && "safetyBoundary" in medicationSection ? medicationSection.safetyBoundary : "").toContain("Never tell readers");
  });

  it("keeps the heart-failure pilot out of published status until review is complete", () => {
    const heartFailure = DIAGNOSIS_GUIDE_PILOTS.find((pilot) => pilot.slug === "heart-failure");
    expect(heartFailure).toBeDefined();
    expect(heartFailure?.status).not.toBe("published");
  });

  it("registers the public framework article at the expected route", () => {
    expect(DIAGNOSIS_EXPLAINED_ROUTE).toBe("/articles/diagnosis-explained");
    expect(ALL_ARTICLES.some((article) => article.slug === "diagnosis-explained")).toBe(true);
  });
});
