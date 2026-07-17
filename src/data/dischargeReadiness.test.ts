import { describe, expect, it } from "vitest";
import {
  CARE_TEAM_RESPONSIBILITY_MAP,
  DISCHARGE_BARRIER_CATEGORIES,
  DISCHARGE_READINESS_BARRIERS,
  FAMILY_HOSPITAL_QUESTION_GROUPS,
  getDischargeBarriersForCategory,
} from "@/data/dischargeReadiness";

describe("discharge readiness system", () => {
  it("organizes the initial ten RN-identified barriers across six operating categories", () => {
    expect(DISCHARGE_READINESS_BARRIERS).toHaveLength(10);
    expect(DISCHARGE_BARRIER_CATEGORIES).toHaveLength(6);
    expect(new Set(DISCHARGE_READINESS_BARRIERS.map((barrier) => barrier.id)).size).toBe(10);

    for (const category of DISCHARGE_BARRIER_CATEGORIES) {
      expect(getDischargeBarriersForCategory(category.id).length).toBeGreaterThan(0);
    }
  });

  it("turns every barrier into a specific question and identifies the involved teams", () => {
    for (const barrier of DISCHARGE_READINESS_BARRIERS) {
      expect(barrier.question.length).toBeGreaterThan(40);
      expect(barrier.question.endsWith("?")).toBe(true);
      expect(barrier.teams.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("preserves the twelve family questions without collecting patient information", () => {
    const questions = FAMILY_HOSPITAL_QUESTION_GROUPS.flatMap((group) => group.questions);

    expect(FAMILY_HOSPITAL_QUESTION_GROUPS).toHaveLength(5);
    expect(questions).toHaveLength(12);
    expect(new Set(questions).size).toBe(12);

    const combined = questions.join(" ").toLowerCase();
    expect(combined).not.toContain("policy number");
    expect(combined).not.toContain("medical record number");
    expect(combined).not.toContain("date of birth");
  });

  it("makes distributed responsibilities and limits explicit", () => {
    expect(CARE_TEAM_RESPONSIBILITY_MAP).toHaveLength(8);
    expect(CARE_TEAM_RESPONSIBILITY_MAP.map((item) => item.role)).toContain("Bedside nurse");
    expect(CARE_TEAM_RESPONSIBILITY_MAP.map((item) => item.role)).toContain("Patient, family, and caregiver");

    for (const item of CARE_TEAM_RESPONSIBILITY_MAP) {
      expect(item.usuallyHandles.length).toBeGreaterThan(60);
      expect(item.importantLimit.length).toBeGreaterThan(60);
    }
  });
});
