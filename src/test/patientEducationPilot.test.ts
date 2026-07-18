import { describe, expect, it } from "vitest";
import { buildPatientEducationPilotPlan, patientEducationPilotPlanToText } from "@/lib/patientEducationPilot";

describe("patient education pilot builder", () => {
  it("builds a critical-risk blood thinner pilot with medication-specific assets", () => {
    const input = {
      setting: "acute_inpatient",
      module: "blood_thinners",
      scale: "single_unit",
      timeline: "ninety_day_pilot",
      focus: "comprehension",
    } as const;

    const plan = buildPatientEducationPilotPlan(input);

    expect(plan.module.riskTier).toBe("Critical");
    expect(plan.packageAssets).toContain("Medication-specific insert");
    expect(plan.packageAssets).toContain("Refill and procedure-planning card");
    expect(plan.phases).toHaveLength(5);
    expect(plan.measures.join(" ")).toMatch(/emergency warning signs/i);
  });

  it("changes the package and measures for enteral feeding continuity", () => {
    const input = {
      setting: "post_acute",
      module: "enteral_feeding",
      scale: "service_line",
      timeline: "phased_launch",
      focus: "continuity",
    } as const;

    const plan = buildPatientEducationPilotPlan(input);

    expect(plan.packageAssets).toContain("Feeding and hydration tracker");
    expect(plan.packageAssets).toContain("Supply reorder plan");
    expect(plan.measures.join(" ")).toMatch(/DME, home-health, or pharmacy handoff failures/i);
    expect(plan.stakeholders.join(" ")).toMatch(/registered dietitian/i);
  });

  it("exports a non-identifying planning brief with explicit boundaries", () => {
    const input = {
      setting: "observation",
      module: "home_oxygen",
      scale: "single_facility",
      timeline: "evaluate",
      focus: "workflow",
    } as const;

    const plan = buildPatientEducationPilotPlan(input);
    const text = patientEducationPilotPlanToText(input, plan);

    expect(text).toContain("CAF PATIENT EDUCATION SYSTEMS - PILOT STARTING BRIEF");
    expect(text).toContain("PRIVACY, CLINICAL, AND CLAIMS BOUNDARIES");
    expect(text).toMatch(/do not enter names, dates of birth, medical record numbers/i);
    expect(text).toMatch(/development-stage, nonbinding starting brief/i);
    expect(text).not.toMatch(/patient name:|medical record number:|date of birth:/i);
  });
});
