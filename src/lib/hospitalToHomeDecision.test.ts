import { describe, expect, it } from "vitest";
import { buildHospitalToHomeBrief, hospitalToHomeBriefText, type HospitalToHomeAnswers } from "@/lib/hospitalToHomeDecision";

const complete = (patch: Partial<HospitalToHomeAnswers> = {}): HospitalToHomeAnswers => ({
  helperRole: "caregiver",
  timing: "today",
  coverage: "original-medicare",
  destination: "snf",
  hospitalStatus: "observation",
  services: ["rehab", "dme"],
  authorization: "pending",
  acceptance: "not-confirmed",
  notice: "moon-or-status-change",
  concern: "unexpected-cost",
  ...patch,
});

describe("hospital-to-home decision brief", () => {
  it("sequences a Medicare observation, SNF, authorization, acceptance, and equipment path", () => {
    const brief = buildHospitalToHomeBrief(complete());
    const ids = brief.tasks.map((item) => item.id);

    expect(brief.summary).toContain("Original Medicare");
    expect(brief.risks.map((item) => item.id)).toEqual(expect.arrayContaining(["hospital-status", "authorization-open", "acceptance"]));
    expect(ids).toEqual(expect.arrayContaining(["today-huddle", "confirm-status", "authorization-followup", "acceptance-check", "rehab-verification", "equipment", "cost-estimate"]));
    expect(brief.tasks[0].priority).toBe("before-discharge");
    expect(brief.tasks.every((item) => item.owner.length > 0)).toBe(true);
  });

  it("creates a written-denial and medication path without claiming coverage", () => {
    const brief = buildHospitalToHomeBrief(complete({
      coverage: "commercial",
      destination: "home",
      hospitalStatus: "not-applicable",
      services: ["medications"],
      authorization: "denied",
      acceptance: "partial",
      notice: "written-denial",
      concern: "appeal",
    }));

    expect(brief.risks.map((item) => item.id)).toContain("denial");
    expect(brief.tasks.map((item) => item.id)).toEqual(expect.arrayContaining(["denial-response", "medications"]));
    expect(hospitalToHomeBriefText(brief)).not.toMatch(/approved|guaranteed|eligible/i);
  });

  it("keeps uncertainty explicit for unknown coverage and destination", () => {
    const brief = buildHospitalToHomeBrief(complete({
      coverage: "unknown",
      destination: "unknown",
      hospitalStatus: "not-applicable",
      services: [],
      authorization: "unknown",
      acceptance: "not-confirmed",
      notice: "unknown",
      concern: "coverage-delay",
    }));

    expect(brief.risks.map((item) => item.id)).toEqual(expect.arrayContaining(["coverage-unknown", "destination-unknown"]));
    expect(brief.unresolvedItems.join(" ")).toMatch(/plan|setting/i);
    expect(brief.tasks.every((item) => ["CAF interpretation", "Needs verification"].includes(item.evidenceType))).toBe(true);
  });
});
