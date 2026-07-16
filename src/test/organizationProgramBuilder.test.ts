import { describe, expect, it } from "vitest";
import { buildOrganizationProgramPlan, organizationProgramPlanToText } from "@/lib/organizationProgramBuilder";

describe("organization program builder", () => {
  it("routes a health-system discharge priority to the released Medicare and discharge program", () => {
    const input = { profile: "health_system", audience: "patients_caregivers", priority: "medicare_discharge", timeline: "thirty_days" } as const;
    const plan = buildOrganizationProgramPlan(input);

    expect(plan.primaryProgram.id).toBe("medicare_discharge");
    expect(plan.primaryProgram.modules.map((module) => module.href)).toContain("/tools/hospital-discharge-medicare-checklist");
    expect(plan.launchPlan).toHaveLength(5);
    expect(plan.measurement.join(" ")).toMatch(/do not infer savings/i);
  });

  it("routes a workforce career priority to total-compensation tools and a bounded second phase", () => {
    const input = { profile: "workforce", audience: "members_students", priority: "career_retention", timeline: "sixty_to_ninety_days" } as const;
    const plan = buildOrganizationProgramPlan(input);

    expect(plan.primaryProgram.id).toBe("workforce_transition");
    expect(plan.primaryProgram.modules[0].href).toBe("/tools/healthcare-worker-total-compensation-comparison");
    expect(plan.supportingPrograms.map((program) => program.id)).not.toContain("workforce_transition");
  });

  it("exports an implementation-ready brief without requesting participant data", () => {
    const input = { profile: "health_plan", audience: "mixed", priority: "broad_access", timeline: "evaluate_now" } as const;
    const plan = buildOrganizationProgramPlan(input);
    const text = organizationProgramPlanToText(input, plan);

    expect(text).toContain("COMMUNITY ACQUIRED FINANCE - ORGANIZATION PROGRAM BRIEF");
    expect(text).toContain("PRIVACY AND SCOPE GUARDRAILS");
    expect(text).toContain("Final scope, responsibilities, service levels, legal terms, pricing, and data handling require written agreement");
    expect(text).not.toMatch(/enter (your )?(name|email|diagnosis|member id)/i);
  });
});
