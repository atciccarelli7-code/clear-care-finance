import { describe, expect, it } from "vitest";
import { STATE_MEDICAID_LINKS } from "@/data/medicareMedicaidEligibilityData";
import {
  EMPTY_ELIGIBILITY_ANSWERS,
  evaluateMedicareMedicaidEligibility,
  flattenScreeningResultText,
  screenMedicareSavingsProgramIncome,
  type EligibilityAnswers,
} from "@/lib/medicareMedicaidEligibility";

const answers = (overrides: Partial<EligibilityAnswers> = {}): EligibilityAnswers => ({
  ...EMPTY_ELIGIBILITY_ANSWERS,
  state: "NC",
  age: 40,
  alreadyMedicare: "no",
  ssdi: "no",
  condition: "neither",
  householdSize: 1,
  income: 24000,
  incomePeriod: "annual",
  pregnancy: "no",
  childrenInHousehold: "no",
  disability: "no",
  longTermCare: "no",
  dualHelp: "no",
  ...overrides,
});

const ids = (cards: { id: string }[]) => cards.map((card) => card.id);

describe("Medicare and Medicaid eligibility decision table", () => {
  it("routes the age-based Medicare boundary at 65 without treating 64 as age-eligible", () => {
    expect(ids(evaluateMedicareMedicaidEligibility(answers({ age: 64 })).medicare)).not.toContain("medicare-age");
    expect(ids(evaluateMedicareMedicaidEligibility(answers({ age: 65 })).medicare)).toContain("medicare-age");
  });

  it("routes the SSDI Medicare boundary at 24 entitlement months", () => {
    const month23 = evaluateMedicareMedicaidEligibility(answers({ age: 45, ssdi: "yes", ssdiMonths: 23 }));
    const month24 = evaluateMedicareMedicaidEligibility(answers({ age: 45, ssdi: "yes", ssdiMonths: 24 }));

    expect(ids(month23.medicare)).toContain("medicare-disability-timing");
    expect(ids(month23.medicare)).not.toContain("medicare-disability");
    expect(ids(month24.medicare)).toContain("medicare-disability");
  });

  it("identifies the ALS Medicare pathway without requiring a 24-month wait", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ age: 42, condition: "als", ssdi: "yes", ssdiMonths: 0 }));
    expect(ids(result.medicare)).toContain("medicare-als");
  });

  it("identifies the ESRD Medicare pathway", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ age: 34, condition: "esrd" }));
    expect(ids(result.medicare)).toContain("medicare-esrd");
  });

  it("identifies a possible adult Medicaid pathway without declaring eligibility", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ age: 30, income: 1800, incomePeriod: "monthly" }));
    expect(ids(result.medicaid)).toContain("medicaid-adult");
    expect(flattenScreeningResultText(result).toLowerCase()).not.toContain("definitely eligible");
  });

  it("identifies pregnancy and child-related paths", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ pregnancy: "yes", childrenInHousehold: "yes", householdSize: 3 }));
    expect(ids(result.medicaid)).toContain("medicaid-family");
  });

  it("identifies a disability-related Medicaid path", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ disability: "yes" }));
    expect(ids(result.medicaid)).toContain("medicaid-disability");
  });

  it("keeps long-term-care Medicaid separate", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({ age: 78, alreadyMedicare: "yes", longTermCare: "yes" }));
    const card = result.medicaid.find((item) => item.id === "medicaid-long-term-care");
    expect(card).toBeDefined();
    expect(card?.emphasis).toBe("long-term-care");
    expect(card?.verify.join(" ").toLowerCase()).toContain("long-term services");
  });

  it("identifies a possible dual-eligibility or Medicare Savings Program path", () => {
    const result = evaluateMedicareMedicaidEligibility(answers({
      age: 70,
      alreadyMedicare: "yes",
      income: 1350,
      incomePeriod: "monthly",
      dualHelp: "yes",
      mspApplicationUnit: "individual",
    }));
    expect(ids(result.dual)).toContain("dual-msp-federal-screen");
  });

  it("handles incomplete and not-sure answers with qualified routing", () => {
    const result = evaluateMedicareMedicaidEligibility({
      ...EMPTY_ELIGIBILITY_ANSWERS,
      state: "NC",
      ageNotSure: true,
      alreadyMedicare: "not-sure",
      ssdi: "not-sure",
      condition: "not-sure",
      householdSizeNotSure: true,
      incomeNotSure: true,
      pregnancy: "not-sure",
      childrenInHousehold: "not-sure",
      disability: "not-sure",
      longTermCare: "not-sure",
      dualHelp: "not-sure",
      mspApplicationUnit: "not-sure",
    });
    expect(ids(result.medicare)).toContain("medicare-uncertain");
    expect(result.medicaid.length).toBeGreaterThan(0);
    expect(result.whatCouldChange.length).toBeGreaterThan(0);
  });

  it("uses inclusive 2026 MSP boundary values", () => {
    expect(screenMedicareSavingsProgramIncome(1350, "individual").tier).toBe("qmb");
    expect(screenMedicareSavingsProgramIncome(1351, "individual").tier).toBe("slmb");
    expect(screenMedicareSavingsProgramIncome(1616, "individual").tier).toBe("slmb");
    expect(screenMedicareSavingsProgramIncome(1617, "individual").tier).toBe("qi");
    expect(screenMedicareSavingsProgramIncome(1816, "individual").tier).toBe("qi");
    expect(screenMedicareSavingsProgramIncome(1817, "individual").tier).toBe("above-federal-screen");
    expect(screenMedicareSavingsProgramIncome(1824, "married-couple").tier).toBe("qmb");
    expect(screenMedicareSavingsProgramIncome(2455, "married-couple").tier).toBe("qi");
  });

  it("never promises eligibility or states an absolute denial", () => {
    const scenarios = [
      answers(),
      answers({ age: 65 }),
      answers({ age: 45, ssdi: "yes", ssdiMonths: 24 }),
      answers({ condition: "als" }),
      answers({ condition: "esrd" }),
      answers({ pregnancy: "yes", childrenInHousehold: "yes" }),
      answers({ disability: "yes", longTermCare: "yes" }),
      answers({ age: 72, alreadyMedicare: "yes", dualHelp: "yes", mspApplicationUnit: "individual", income: 1200, incomePeriod: "monthly" }),
    ];

    for (const scenario of scenarios) {
      const text = flattenScreeningResultText(evaluateMedicareMedicaidEligibility(scenario)).toLowerCase();
      expect(text).not.toContain("you are definitely eligible");
      expect(text).not.toContain("you do not qualify");
      expect(text).not.toContain("guaranteed approval");
    }
  });

  it("resolves an official state link for all 50 states and DC", () => {
    expect(STATE_MEDICAID_LINKS).toHaveLength(51);
    expect(new Set(STATE_MEDICAID_LINKS.map((state) => state.code)).size).toBe(51);
    for (const state of STATE_MEDICAID_LINKS) {
      expect(state.officialUrl).toMatch(/^https:\/\//);
      expect(state.agencyName.length).toBeGreaterThan(3);
      expect(state.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
