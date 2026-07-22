import { describe, expect, it } from "vitest";
import { DIAGNOSIS_GUIDE_PILOTS } from "@/data/diagnosisGuideFramework";
import { HEART_FAILURE_GUIDE, HEART_FAILURE_GUIDE_ROUTE } from "@/data/heartFailureGuide";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";

const sourceText = HEART_FAILURE_GUIDE.sources.map((source) => `${source.name} ${source.pageTitle}`).join(" ");

describe("Heart Failure, Explained product", () => {
  it("keeps the product in clinical review and out of search indexing", () => {
    expect(HEART_FAILURE_GUIDE.status).toBe("clinical-review");
    expect(resolveSiteSeoMeta(HEART_FAILURE_GUIDE_ROUTE)).toMatchObject({
      canonicalPath: HEART_FAILURE_GUIDE_ROUTE,
      robots: "noindex, nofollow",
      title: "Heart Failure, Explained: Clinical-Review Preview",
    });
  });

  it("connects the registered pilot to the product route", () => {
    const pilot = DIAGNOSIS_GUIDE_PILOTS.find((item) => item.slug === "heart-failure");
    expect(pilot).toMatchObject({ status: "clinical-review", route: HEART_FAILURE_GUIDE_ROUTE });
  });

  it("covers the required diagnosis education domains", () => {
    expect(HEART_FAILURE_GUIDE.quickExplanation.body.length).toBeGreaterThan(120);
    expect(HEART_FAILURE_GUIDE.types.map((item) => item.abbreviation)).toEqual(
      expect.arrayContaining(["HFrEF", "HFpEF", "HFimpEF"]),
    );
    expect(HEART_FAILURE_GUIDE.classificationSystems.map((item) => item.name)).toEqual([
      "Type or phenotype",
      "Stage",
      "Functional class",
    ]);
    expect(HEART_FAILURE_GUIDE.causes.length).toBeGreaterThanOrEqual(6);
    expect(HEART_FAILURE_GUIDE.tests.length).toBeGreaterThanOrEqual(6);
    expect(HEART_FAILURE_GUIDE.treatmentGoals.length).toBeGreaterThanOrEqual(5);
    expect(HEART_FAILURE_GUIDE.dailyPlan.length).toBeGreaterThanOrEqual(7);
    expect(HEART_FAILURE_GUIDE.questions.length).toBeGreaterThanOrEqual(11);
    expect(HEART_FAILURE_GUIDE.teachBack.length).toBeGreaterThanOrEqual(7);
  });

  it("requires every medication card to explain purpose, monitoring, questions, and a boundary", () => {
    expect(HEART_FAILURE_GUIDE.medications.length).toBeGreaterThanOrEqual(6);
    for (const medication of HEART_FAILURE_GUIDE.medications) {
      expect(medication.job.length).toBeGreaterThan(20);
      expect(medication.whyItMayBeUsed.length).toBeGreaterThan(20);
      expect(medication.whatTheTeamMayMonitor.length).toBeGreaterThanOrEqual(3);
      expect(medication.questionsToAsk.length).toBeGreaterThanOrEqual(4);
      expect(medication.importantBoundary.length).toBeGreaterThan(30);
    }
  });

  it("separates emergencies, prompt contact, and stable monitoring", () => {
    expect(HEART_FAILURE_GUIDE.actionPlan.map((level) => level.id)).toEqual(["emergency", "same-day", "steady"]);
    for (const level of HEART_FAILURE_GUIDE.actionPlan) {
      expect(level.signs.length).toBeGreaterThanOrEqual(4);
      expect(level.verification.length).toBeGreaterThan(40);
    }
    expect(HEART_FAILURE_GUIDE.actionPlan[0].verification).toContain("American Heart Association");
  });

  it("uses current professional guidance and treats institutional pages as secondary support", () => {
    expect(sourceText).toContain("Second Universal Definition of Heart Failure");
    expect(sourceText).toContain("2022 Guideline for the Management of Heart Failure");
    expect(sourceText).toContain("2024 Expert Consensus Decision Pathway for Treatment of HFrEF");
    expect(sourceText).toContain("2023 Expert Consensus Decision Pathway on Management of HFpEF");
    expect(sourceText).toContain("Classes and Stages of Heart Failure");
    expect(sourceText).toContain("Mayo Clinic");
    const nhlbiSource = HEART_FAILURE_GUIDE.sources.find((source) => source.name === "National Heart, Lung, and Blood Institute");
    expect(nhlbiSource?.note).toContain("not used as the authority");
  });

  it("does not collect personal health information or provide dosing instructions", () => {
    expect(HEART_FAILURE_GUIDE.boundary).toContain("does not determine whether someone has heart failure");
    expect(HEART_FAILURE_GUIDE.boundary).toContain("medication doses");
    const allMedicationText = JSON.stringify(HEART_FAILURE_GUIDE.medications).toLowerCase();
    expect(allMedicationText).not.toContain("enter your");
    expect(allMedicationText).not.toContain("increase your dose");
  });
});
