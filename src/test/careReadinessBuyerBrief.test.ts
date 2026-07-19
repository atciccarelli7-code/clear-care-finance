import { describe, expect, it } from "vitest";
import { buildCareReadinessBuyerBrief, careReadinessBuyerBriefToText, type CareReadinessBuyerBriefInput } from "@/lib/careReadinessBuyerBrief";

const baseInput: CareReadinessBuyerBriefInput = {
  organizationType: "hospital_health_system",
  role: "nursing_operations",
  pilotSetting: "acute_inpatient_unit",
  priority: "workflow_consistency",
  reviewStage: "workflow_review",
  ownerCoverage: "no_owner",
  privacyBoundary: "confirmed",
};

describe("care readiness buyer brief", () => {
  it("keeps an organization without owners in discovery", () => {
    const plan = buildCareReadinessBuyerBrief(baseInput);
    expect(plan.status).toBe("discovery_only");
    expect(plan.nextStep).toMatch(/accountable sponsor/i);
    expect(plan.stopConditions).toContain("No accountable clinical or operational owner");
  });

  it("allows evaluation of a design-partner path only with a cross-functional team", () => {
    const input: CareReadinessBuyerBriefInput = {
      ...baseInput,
      reviewStage: "design_partner",
      ownerCoverage: "cross_functional",
    };
    const plan = buildCareReadinessBuyerBrief(input);
    expect(plan.status).toBe("design_partner_path");
    expect(plan.requiredAttendees).toContain("Legal, privacy, security, or procurement representative");
  });

  it("exports a fixed-choice brief with explicit patient-use and privacy boundaries", () => {
    const input: CareReadinessBuyerBriefInput = { ...baseInput, ownerCoverage: "nursing_pharmacy" };
    const text = careReadinessBuyerBriefToText(input, buildCareReadinessBuyerBrief(input));
    expect(text).toMatch(/no PHI/i);
    expect(text).toMatch(/not approved for patient use/i);
    expect(text).toMatch(/does not authorize a pilot/i);
  });
});
