import { describe, expect, it } from "vitest";
import {
  buildChildcareResult,
  buildDebtRetirementResult,
  buildMedicaidRoutingResult,
  buildObservationResult,
  buildRothTraditionalResult,
  DEFAULT_CHILDCARE_ANSWERS,
  DEFAULT_DEBT_RETIREMENT_ANSWERS,
  DEFAULT_MEDICAID_ROUTING_ANSWERS,
  DEFAULT_OBSERVATION_ANSWERS,
  DEFAULT_ROTH_TRADITIONAL_ANSWERS,
} from "@/lib/roadmapDecisionTools";

describe("roadmap decision tools", () => {
  it("routes Medicaid to the selected official state without an eligibility claim", () => {
    const result = buildMedicaidRoutingResult({
      ...DEFAULT_MEDICAID_ROUTING_ANSWERS,
      state: "NC",
      need: "home-community",
      longTermNeed: "yes",
      settingPreference: "home",
    });

    expect(result.stateName).toBe("North Carolina");
    expect(result.officialUrl).toMatch(/^https:\/\//);
    expect(result.direction).toMatch(/NC Medicaid/i);
    expect([result.summary, ...result.cautions].join(" ")).toMatch(/does not determine|must apply/i);
    expect(JSON.stringify(result)).not.toMatch(/you qualify|you are eligible|approved/i);
  });

  it("keeps an unknown state as a verification problem", () => {
    const result = buildMedicaidRoutingResult(DEFAULT_MEDICAID_ROUTING_ANSWERS);
    expect(result.direction).toMatch(/choose/i);
    expect(result.officialUrl).toBeUndefined();
  });

  it("supports a cautious childcare election without calculating a tax return", () => {
    const result = buildChildcareResult({
      ...DEFAULT_CHILDCARE_ANSWERS,
      filingStatus: "married-separate",
      workStatus: "one-not-working",
      employerFsa: "yes",
      predictableExpenses: "no",
      expenseBand: "over-7500",
      midyearChangeLikely: "yes",
    });

    expect(result.direction).toMatch(/conservative|verify/i);
    expect(result.summary).toContain("$7,500");
    expect(result.summary).toContain("$3,750");
    expect(JSON.stringify(result)).not.toMatch(/exact tax savings|you are eligible|guaranteed/i);
  });

  it("returns a split Roth/traditional direction when assumptions are uncertain", () => {
    const result = buildRothTraditionalResult(DEFAULT_ROTH_TRADITIONAL_ANSWERS);
    expect(result.direction).toMatch(/split/i);
    expect(result.summary).toMatch(/separate decisions/i);
  });

  it("allows Roth factors to appear stronger without declaring a universal winner", () => {
    const result = buildRothTraditionalResult({
      ...DEFAULT_ROTH_TRADITIONAL_ANSWERS,
      currentRate: "low",
      futureRate: "higher",
      yearsToRetirement: "over-25",
      cashFlow: "comfortable",
      pension: "yes",
      currentMix: "mostly-pretax",
      confidence: "high",
    });

    expect(result.direction).toBe("Roth factors currently appear stronger");
    expect(JSON.stringify(result)).not.toMatch(/best|always|guaranteed/i);
  });

  it("prioritizes an active observation-status deadline", () => {
    const result = buildObservationResult({
      ...DEFAULT_OBSERVATION_ANSWERS,
      coverage: "original-medicare",
      reportedStatus: "observation",
      writtenNotice: "not-received",
      dischargeSoon: "yes",
      skilledFacility: "yes",
      activeDeadline: "yes",
    });

    expect(result.direction).toMatch(/immediately/i);
    expect(result.doNow.join(" ")).toMatch(/MOON|deadline|skilled/i);
    expect(result.summary).toMatch(/cannot determine/i);
  });

  it("preserves federal student-loan protections in debt sequencing", () => {
    const result = buildDebtRetirementResult({
      ...DEFAULT_DEBT_RETIREMENT_ANSWERS,
      match: "full",
      emergency: "one-three",
      debt: "federal-student",
      pslf: "yes",
      cashFlow: "stable",
    });

    expect(result.direction).toMatch(/federal loan strategy/i);
    expect(result.cautions.join(" ")).toMatch(/Do not refinance federal student loans/i);
  });
});
