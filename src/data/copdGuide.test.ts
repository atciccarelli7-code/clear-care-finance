import { describe, expect, it } from "vitest";
import { COPD_GUIDE, COPD_GUIDE_ROUTE } from "@/data/copdGuide";
import { DIAGNOSIS_GUIDE_PILOTS } from "@/data/diagnosisGuideFramework";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";

const sourceText = COPD_GUIDE.sources.map((source) => `${source.name} ${source.pageTitle}`).join(" ");

describe("COPD, Explained product", () => {
  it("keeps the product in clinical review and out of search indexing", () => {
    expect(COPD_GUIDE.status).toBe("clinical-review");
    expect(resolveSiteSeoMeta(COPD_GUIDE_ROUTE)).toMatchObject({
      canonicalPath: COPD_GUIDE_ROUTE,
      robots: "noindex, nofollow",
      title: "COPD, Explained: Clinical-Review Preview",
    });
  });

  it("connects the registered pilot to the product route", () => {
    const pilot = DIAGNOSIS_GUIDE_PILOTS.find((item) => item.slug === "copd");
    expect(pilot).toMatchObject({ status: "clinical-review", route: COPD_GUIDE_ROUTE });
  });

  it("covers the required diagnosis education domains", () => {
    expect(COPD_GUIDE.quickExplanation.body.length).toBeGreaterThan(120);
    expect(COPD_GUIDE.patterns.length).toBeGreaterThanOrEqual(3);
    expect(COPD_GUIDE.causes.length).toBeGreaterThanOrEqual(6);
    expect(COPD_GUIDE.tests.length).toBeGreaterThanOrEqual(6);
    expect(COPD_GUIDE.tests.some((test) => test.name === "Spirometry")).toBe(true);
    expect(COPD_GUIDE.treatmentGoals.length).toBeGreaterThanOrEqual(5);
    expect(COPD_GUIDE.dailyPlan.length).toBeGreaterThanOrEqual(7);
    expect(COPD_GUIDE.questions.length).toBeGreaterThanOrEqual(10);
    expect(COPD_GUIDE.teachBack.length).toBeGreaterThanOrEqual(6);
  });

  it("requires every medication card to explain purpose, monitoring, questions, and a boundary", () => {
    expect(COPD_GUIDE.medications.length).toBeGreaterThanOrEqual(5);
    for (const medication of COPD_GUIDE.medications) {
      expect(medication.job.length).toBeGreaterThan(20);
      expect(medication.whyItMayBeUsed.length).toBeGreaterThan(20);
      expect(medication.whatTheTeamMayMonitor.length).toBeGreaterThanOrEqual(4);
      expect(medication.questionsToAsk.length).toBeGreaterThanOrEqual(4);
      expect(medication.importantBoundary.length).toBeGreaterThan(30);
    }
  });

  it("makes inhaler technique and oxygen safety explicit", () => {
    expect(COPD_GUIDE.inhalerPrinciples.length).toBeGreaterThanOrEqual(5);
    expect(COPD_GUIDE.oxygenPrinciples.length).toBeGreaterThanOrEqual(4);
    const inhalerText = COPD_GUIDE.inhalerPrinciples.join(" ").toLowerCase();
    const oxygenText = COPD_GUIDE.oxygenPrinciples.join(" ").toLowerCase();
    expect(inhalerText).toContain("not used the same way");
    expect(oxygenText).toContain("prescription");
    expect(oxygenText).toContain("smoke");
  });

  it("separates emergencies, prompt contact, and stable monitoring", () => {
    expect(COPD_GUIDE.actionPlan.map((level) => level.id)).toEqual(["emergency", "same-day", "steady"]);
    for (const level of COPD_GUIDE.actionPlan) {
      expect(level.signs.length).toBeGreaterThanOrEqual(5);
      expect(level.verification.length).toBeGreaterThan(40);
    }
  });

  it("uses current professional and federal COPD sources", () => {
    expect(sourceText).toContain("2026 GOLD Report and Pocket Guide");
    expect(sourceText).toContain("COPD Diagnosis");
    expect(sourceText).toContain("COPD Treatment");
    expect(sourceText).toContain("COPD Action Plan");
  });

  it("does not collect personal health information or provide individualized dosing", () => {
    expect(COPD_GUIDE.boundary).toContain("does not determine whether someone has COPD");
    expect(COPD_GUIDE.boundary).toContain("set oxygen flow");
    const allContent = JSON.stringify(COPD_GUIDE).toLowerCase();
    expect(allContent).not.toContain("enter your oxygen");
    expect(allContent).not.toContain("increase your dose");
    expect(allContent).not.toContain("set your oxygen to");
  });
});
