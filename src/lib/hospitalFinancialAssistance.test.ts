import { describe, expect, it } from "vitest";
import { hospitalFinancialAssistancePolicies, hospitalPolicyBySlug, type HospitalFinancialAssistancePolicy } from "@/data/hospitalFinancialAssistancePolicies";
import { hospitalFinancialAssistanceSeoSlugs } from "@/data/hospitalFinancialAssistanceSeo";
import {
  buildHospitalAssistanceResult,
  DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS,
  incomeBandDollarRange,
  povertyGuidelineForHousehold,
  type HospitalAssistanceAnswers,
} from "@/lib/hospitalFinancialAssistance";

const atrium = hospitalPolicyBySlug.get("atrium-health")!;
const cleveland = hospitalPolicyBySlug.get("cleveland-clinic-ohio")!;

const answers = (overrides: Partial<HospitalAssistanceAnswers> = {}): HospitalAssistanceAnswers => ({
  ...DEFAULT_HOSPITAL_ASSISTANCE_ANSWERS,
  stateCode: "NC",
  policySlug: "atrium-health",
  householdSize: 4,
  incomeBand: "200_250",
  insuranceStatus: "insured",
  billStage: "received",
  serviceMonth: "2026-05",
  ...overrides,
});

describe("2026 HHS poverty guideline calculations", () => {
  it("uses the official contiguous-state, Alaska, and Hawaii schedules", () => {
    expect(povertyGuidelineForHousehold(1, "NC")).toBe(15_960);
    expect(povertyGuidelineForHousehold(4, "NC")).toBe(33_000);
    expect(povertyGuidelineForHousehold(4, "AK")).toBe(41_250);
    expect(povertyGuidelineForHousehold(4, "HI")).toBe(37_950);
  });

  it("supports household sizes above eight with the official increment", () => {
    expect(povertyGuidelineForHousehold(9, "NC")).toBe(61_400);
    expect(incomeBandDollarRange("200_250", 9, "NC")).toEqual({ lower: 122_800, upper: 153_500 });
  });
});

describe("hospital policy screening", () => {
  it("keeps the lightweight SEO route index aligned with the full policy dataset", () => {
    expect(hospitalFinancialAssistanceSeoSlugs).toEqual(
      hospitalFinancialAssistancePolicies.map(({ slug }) => slug),
    );
  });

  it("keeps every published policy record source-backed and maintenance-ready", () => {
    expect(hospitalFinancialAssistancePolicies).toHaveLength(18);
    expect(new Set(hospitalFinancialAssistancePolicies.map(({ slug }) => slug)).size).toBe(18);

    for (const policy of hospitalFinancialAssistancePolicies) {
      expect(policy.name).toBeTruthy();
      expect(policy.stateCode).toMatch(/^[A-Z]{2}$/);
      expect(policy.facilitiesCovered.length).toBeGreaterThan(0);
      expect(policy.policyUrl).toMatch(/^https:\/\//);
      expect(policy.applicationUrl).toMatch(/^https:\/\//);
      expect(policy.sourceRetrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(new Date(`${policy.sourceRetrievedAt}T00:00:00Z`).getTime())).toBe(false);
      expect(policy.requiredDocumentation.length).toBeGreaterThan(0);
      expect(policy.limitations.length).toBeGreaterThan(0);
      expect(policy.sources.length).toBeGreaterThan(0);

      for (const source of policy.sources) {
        expect(source.publisher).toBeTruthy();
        expect(source.url).toMatch(/^https:\/\//);
        expect(source.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(source.supports).toBeTruthy();
      }
    }
  });

  it("identifies a fully bounded published free-care range", () => {
    const result = buildHospitalAssistanceResult(answers(), atrium);
    expect(result.status).toBe("free_range");
    expect(result.heading).toMatch(/appears to fall within/i);
    expect(result.summary).toMatch(/hospital must confirm/i);
  });

  it("identifies a discounted-care range without promising an award", () => {
    const result = buildHospitalAssistanceResult(answers({ incomeBand: "300_400" }), atrium);
    expect(result.status).toBe("discounted_range");
    expect([result.heading, result.summary, result.policyFinding].join(" ")).not.toMatch(/you qualify|you are eligible|approved/i);
  });

  it("routes an above-range entry to a published hardship review", () => {
    const result = buildHospitalAssistanceResult(answers({ incomeBand: "400_600" }), atrium);
    expect(result.status).toBe("hardship_review");
    expect(result.policyFinding).toMatch(/10% of total household income/i);
  });

  it("withholds a range result when a controlling input is missing", () => {
    const result = buildHospitalAssistanceResult(answers({ householdSize: null }), atrium);
    expect(result.status).toBe("insufficient_information");
    expect(result.missingInformation).toContain("Household size");
  });

  it("requires direct verification for ambiguous insured eligibility", () => {
    const result = buildHospitalAssistanceResult(answers({ stateCode: "OH", policySlug: cleveland.slug, incomeBand: "250_300" }), cleveland);
    expect(result.status).toBe("verify_policy");
    expect(result.heading).toMatch(/insured-patient eligibility/i);
  });

  it("withholds a numerical result for a stale source", () => {
    const stale = { ...atrium, sourceRetrievedAt: "2024-01-01" } satisfies HospitalFinancialAssistancePolicy;
    const result = buildHospitalAssistanceResult(answers(), stale, new Date("2026-08-06T00:00:00Z"));
    expect(result.status).toBe("verify_policy");
    expect(result.policyStale).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/source may be stale/i);
  });

  it("treats a malformed retrieval date as stale and preserves provider warnings", () => {
    const invalid = { ...atrium, sourceRetrievedAt: "not-a-date" } satisfies HospitalFinancialAssistancePolicy;
    const result = buildHospitalAssistanceResult(answers(), invalid);
    expect(result.policyStale).toBe(true);
    expect(result.warnings.join(" ")).toMatch(/provider may bill separately/i);
  });

  it("returns a no-inference plan for an unsupported hospital", () => {
    const result = buildHospitalAssistanceResult(answers({ policySlug: "not-listed" }), null);
    expect(result.status).toBe("insufficient_information");
    expect(result.policyFinding).toMatch(/insufficient published information/i);
    expect(result.warnings).toContain("The hospital must make the final eligibility determination.");
  });
});
