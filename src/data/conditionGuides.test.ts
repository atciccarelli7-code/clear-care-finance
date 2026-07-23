import { describe, expect, it } from "vitest";
import { ADDITIONAL_DIAGNOSIS_GUIDES } from "./conditionGuideCatalog";
import { CONDITION_GUIDES } from "./conditionGuides";

const requiredActionIds = ["emergency", "same-day", "steady"];

describe("additional Diagnosis, Explained guides", () => {
  it("registers seven complete published guides", () => {
    expect(CONDITION_GUIDES).toHaveLength(7);
    expect(ADDITIONAL_DIAGNOSIS_GUIDES).toHaveLength(7);
    expect(new Set(CONDITION_GUIDES.map((guide) => guide.slug)).size).toBe(7);
    expect(CONDITION_GUIDES.every((guide) => guide.status === "published")).toBe(true);
    expect(CONDITION_GUIDES.every((guide) => !guide.reviewScope.toLowerCase().includes("review is still pending"))).toBe(true);
  });

  it("labels the kidney-failure discovery card as ESRD without changing the canonical route", () => {
    const kidneyFailure = ADDITIONAL_DIAGNOSIS_GUIDES.find((guide) => guide.slug === "kidney-failure");
    expect(kidneyFailure).toMatchObject({
      shortTitle: "ESRD, Explained",
      route: "/patients-families/diagnosis-explained/kidney-failure",
    });
  });

  it.each(CONDITION_GUIDES)("keeps $shortTitle structurally complete", (guide) => {
    expect(guide.route).toBe(`/patients-families/diagnosis-explained/${guide.slug}`);
    expect(guide.quickExplanation.body.length).toBeGreaterThan(180);
    expect(guide.quickExplanation.repeatBack.length).toBeGreaterThan(60);
    expect(guide.doesNotMean.length).toBeGreaterThanOrEqual(4);
    expect(guide.terms.length).toBeGreaterThanOrEqual(4);
    expect(guide.patterns.length).toBeGreaterThanOrEqual(3);
    expect(guide.causes.length).toBeGreaterThanOrEqual(5);
    expect(guide.tests.length).toBeGreaterThanOrEqual(5);
    expect(guide.treatmentGoals.length).toBeGreaterThanOrEqual(4);
    expect(guide.medications.length).toBeGreaterThanOrEqual(3);
    expect(guide.procedures.length).toBeGreaterThanOrEqual(3);
    expect(guide.dailyPlan.length).toBeGreaterThanOrEqual(5);
    expect(guide.actionPlan.map((level) => level.id)).toEqual(requiredActionIds);
    expect(guide.questions.length).toBeGreaterThanOrEqual(6);
    expect(guide.teachBack.length).toBeGreaterThanOrEqual(5);
    expect(guide.sources.length).toBeGreaterThanOrEqual(4);
  });

  it.each(CONDITION_GUIDES)("keeps $shortTitle medication and treatment boundaries explicit", (guide) => {
    expect(guide.boundary.toLowerCase()).toMatch(/does not|do not/);
    expect(guide.printBoundary.toLowerCase()).toMatch(/do not/);
    for (const medication of guide.medications) {
      expect(medication.importantBoundary.toLowerCase()).toMatch(/do not|not interchangeable|requires|without/);
      expect(medication.questionsToAsk.length).toBeGreaterThanOrEqual(3);
      expect(medication.whatTheTeamMayMonitor.length).toBeGreaterThanOrEqual(3);
    }
  });

  it.each(CONDITION_GUIDES)("uses HTTPS sources and distinguishes professional authority from comparators for $shortTitle", (guide) => {
    expect(guide.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
    expect(guide.benchmarkUrl).toMatch(/^https:\/\/www\.mayoclinic\.org\//);
    expect(guide.sources.some((source) => /guideline|professional|primary|regulatory/i.test(source.note ?? ""))).toBe(true);
  });

  it("does not misrepresent the KDIGO 2026 AKI draft as final", () => {
    const aki = CONDITION_GUIDES.find((guide) => guide.slug === "acute-kidney-injury");
    expect(aki?.reviewScope).toContain("public-review draft");
    expect(aki?.treatmentNote).toContain("2012 KDIGO guideline remains the current final");
    expect(aki?.boundary).toContain("how much fluid");
  });

  it("protects anticoagulant decisions in AFib and GI bleeding", () => {
    const afib = CONDITION_GUIDES.find((guide) => guide.slug === "atrial-fibrillation");
    const giBleed = CONDITION_GUIDES.find((guide) => guide.slug === "gastrointestinal-bleeding");
    expect(afib?.doesNotMean.join(" ")).toMatch(/aspirin.*substitute/i);
    expect(afib?.medications.find((med) => med.id === "anticoagulants")?.importantBoundary).toMatch(/Do not stop/i);
    expect(giBleed?.medications.find((med) => med.id === "antithrombotic-review")?.importantBoundary).toMatch(/Do not independently stop or restart/i);
  });

  it("uses the current 2025 hypertension and 2026 dyslipidemia frameworks", () => {
    const hypertension = CONDITION_GUIDES.find((guide) => guide.slug === "hypertension");
    const dyslipidemia = CONDITION_GUIDES.find((guide) => guide.slug === "dyslipidemia");
    expect(hypertension?.reviewScope).toContain("2025 AHA/ACC");
    expect(hypertension?.actionPlan[1].verification).toContain("2025 guideline");
    expect(dyslipidemia?.reviewScope).toContain("March 2026");
    expect(dyslipidemia?.treatmentNote).toContain("March 2026 AHA/ACC guideline");
    expect(dyslipidemia?.tests.some((test) => test.name === "Lipoprotein(a)")).toBe(true);
  });

  it("presents conservative management as active kidney-failure care", () => {
    const kidneyFailure = CONDITION_GUIDES.find((guide) => guide.slug === "kidney-failure");
    expect(kidneyFailure?.doesNotMean.join(" ")).toMatch(/conservative management is no care/i);
    expect(kidneyFailure?.quickExplanation.body).toMatch(/comprehensive conservative care/i);
    expect(kidneyFailure?.treatmentNote).toMatch(/four treatment choices/i);
  });
});
