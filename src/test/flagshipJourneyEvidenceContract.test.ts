import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");

const flagships = [
  ["src/components/calculators/Calc403bEmailEstimate.tsx", "paycheck_403b"],
  ["src/components/calculators/TotalCompensationComparison.tsx", "total_compensation_comparison"],
  ["src/components/premium/OpenEnrollmentPilot.tsx", "benefits_decision_system"],
  ["src/components/calculators/FinancialAssistanceScreeningTool.tsx", "hospital_financial_assistance"],
  ["src/pages/MedicareCoverageDecisionPage.tsx", "medicare_coverage_decision"],
  ["src/components/patients/HospitalToHomeNavigator.tsx", "hospital_to_home"],
] as const;

describe("flagship first-party journey evidence", () => {
  it.each(flagships)("keeps view, start, and result coverage in %s", (path, journeyKey) => {
    const component = source(path);
    expect(component).toContain(`journey_key: "${journeyKey}"`);
    expect(component).toContain('trackJourneyEvent("journey_viewed"');
    expect(component).toContain('trackJourneyEvent("journey_started"');
    expect(component).toContain('trackJourneyEvent("journey_result_reached"');
  });

  it("keeps the evidence write behind the strict same-origin server boundary", () => {
    const endpoint = source("api/evidence-event.ts");
    expect(endpoint).toContain("sameOrigin(req, config.siteUrl)");
    expect(endpoint).toContain("parseJourneyEvidencePayload");
    expect(endpoint).toContain('.from("journey_events").insert');
    expect(endpoint).not.toMatch(/console\.(log|error|warn)/);
  });

  it("discloses anonymous product-use signals before consent", () => {
    const choices = source("src/components/shared/PrivacyChoices.tsx");
    const policy = source("src/pages/PrivacyPolicy.tsx");
    expect(choices).toContain("anonymous product-use signals");
    expect(policy).toContain("allowlisted lifecycle event");
    expect(policy).toContain("bounded step number");
  });
});
