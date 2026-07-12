import { describe, expect, it } from "vitest";
import { buildTurning65Plan, getInitialEnrollmentWindow, type Turning65Answers } from "../turning65Medicare";

const base: Turning65Answers = {
  birthMonth: 7,
  birthYear: 1961,
  alreadyEnrolled: "no",
  coverageSource: "unknown",
  activeEmployment: "unknown",
  employerSize: "unknown",
  employmentEndingSoon: "unknown",
  hsaContributing: "no",
  spouseCoverageConcern: "no",
  drugCoverage: "creditable",
  preference: "undecided",
  limitedIncomeHelp: "no",
  stateCode: "NC",
};

describe("turning 65 Medicare pathway", () => {
  it("builds the seven-month initial enrollment window", () => {
    expect(getInitialEnrollmentWindow(7, 1961)).toEqual({ eligibilityMonth: "2026-07", starts: "2026-04", ends: "2026-10", label: "April 2026 through October 2026" });
  });

  it("flags small-employer coordination risk", () => {
    const result = buildTurning65Plan({ ...base, coverageSource: "active-employer", activeEmployment: "yes", employerSize: "under-20" });
    expect(result.headline).toContain("Medicare to pay first");
    expect(result.warnings.join(" ")).toContain("fewer than 20");
  });

  it("flags HSA timing and unknown drug coverage", () => {
    const result = buildTurning65Plan({ ...base, hsaContributing: "yes", drugCoverage: "unknown" });
    expect(result.warnings.join(" ")).toContain("six months");
    expect(result.warnings.join(" ")).toContain("63 days");
  });
});
