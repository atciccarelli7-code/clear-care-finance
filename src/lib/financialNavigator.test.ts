import { beforeEach, describe, expect, it } from "vitest";
import {
  NAVIGATOR_STORAGE_KEY,
  addNavigatorAction,
  clearNavigatorPlan,
  createNavigatorPlanSummary,
  generateNavigatorPlan,
  loadStoredNavigatorPlan,
  saveNavigatorPlan,
  setNavigatorActionCompleted,
} from "@/lib/financialNavigator";

beforeEach(() => {
  window.localStorage.clear();
});

const ids = (pathway: Parameters<typeof generateNavigatorPlan>[0], answers: Record<string, string>) =>
  generateNavigatorPlan(pathway, answers).recommendations.map((recommendation) => recommendation.id);

describe("CAF Financial Navigator rule engine", () => {
  it("prioritizes stability, high-interest debt, and employer match for a wealth foundation plan", () => {
    const planIds = ids("wealth", {
      wealth_goal: "unsure",
      emergency_position: "under_one",
      debt_type: "high_interest",
      retirement_access: "403b",
      match_status: "below",
      urgency: "month",
    });

    expect(planIds.slice(0, 3)).toEqual([
      "wealth_starter_reserve",
      "wealth_capture_match",
      "wealth_high_interest_debt",
    ]);
    expect(planIds).toContain("wealth_403b");
    expect(planIds).toContain("wealth_cash_flow");
  });

  it("builds a retirement optimization path for a funded 403(b) user", () => {
    const planIds = ids("wealth", {
      wealth_goal: "retirement",
      emergency_position: "three_to_six",
      debt_type: "none",
      retirement_access: "403b",
      match_status: "full",
      urgency: "planning",
    });

    expect(planIds).toContain("wealth_403b");
    expect(planIds).toContain("wealth_investing_foundations");
    expect(planIds).toContain("wealth_fi");
    expect(planIds).not.toContain("wealth_high_interest_debt");
  });

  it("connects open enrollment to the deadline, SBC, cost comparison, and benefits tools", () => {
    const planIds = ids("workplace_benefits", {
      benefits_decision: "health_plan",
      benefits_timing: "annual",
      health_usage: "dependents",
      plan_preference: "predictable",
      benefits_retirement_status: "below_match",
      urgency: "week",
    });

    expect(planIds.slice(0, 3)).toEqual(["benefits_deadline", "benefits_sbc", "benefits_match"]);
    expect(planIds).toContain("benefits_health_cost");
    expect(planIds).toContain("benefits_blueprint");
  });

  it("builds a medical-bill plan when a bill arrives without a payer explanation", () => {
    const planIds = ids("healthcare_costs", {
      cost_document: "bill",
      cost_issue: "no_processing",
      cost_payer: "employer_plan",
      cost_support: "first_call",
      urgency: "week",
    });

    expect(planIds.slice(0, 2)).toEqual(["cost_confirm_processing", "cost_deadline"]);
    expect(planIds).toContain("cost_toolkit");
  });

  it("elevates prior authorization and deadline tracking when care is delayed", () => {
    const planIds = ids("healthcare_costs", {
      cost_document: "prior_auth",
      cost_issue: "prior_auth",
      cost_payer: "employer_plan",
      cost_support: "official",
      urgency: "delayed_care",
    });

    expect(planIds[0]).toBe("cost_prior_auth");
    expect(planIds).toContain("cost_deadline");
    expect(planIds).toContain("cost_toolkit");
  });

  it("connects a bedside transition to total compensation, quality of life, and trajectory", () => {
    const planIds = ids("healthcare_career", {
      career_decision: "leave_bedside",
      current_role: "bedside_rn",
      career_priority: "burnout",
      compensation_structure: "mixed",
      tradeoff_tolerance: "quality_of_life",
      urgency: "month",
    });

    expect(planIds).toContain("career_total_comp");
    expect(planIds).toContain("career_tradeoffs");
    expect(planIds).toContain("career_transition_hub");
    expect(planIds).toContain("career_trajectory");
  });

  it("caps recommendation groups so the result remains usable", () => {
    const plan = generateNavigatorPlan("healthcare_costs", {
      cost_document: "collection",
      cost_issue: "unaffordable",
      cost_payer: "medicare",
      cost_support: "assistance",
      urgency: "collection",
    });

    expect(plan.recommendations.filter((item) => item.priority === "do_now").length).toBeLessThanOrEqual(3);
    expect(plan.recommendations.filter((item) => item.priority === "do_next").length).toBeLessThanOrEqual(4);
    expect(plan.recommendations.filter((item) => item.priority === "learn_later").length).toBeLessThanOrEqual(5);
  });
});

describe("My Plan local persistence", () => {
  it("saves a generated plan without storing the intake answers", () => {
    const generated = generateNavigatorPlan("wealth", {
      wealth_goal: "emergency",
      emergency_position: "none",
      debt_type: "none",
      retirement_access: "none",
      match_status: "no_match",
      urgency: "planning",
    });

    saveNavigatorPlan(generated);
    const raw = window.localStorage.getItem(NAVIGATOR_STORAGE_KEY) ?? "";
    expect(raw).toContain("wealth_starter_reserve");
    expect(raw).not.toContain("emergency_position");
    expect(loadStoredNavigatorPlan()?.schemaVersion).toBe(1);
  });

  it("prevents duplicate contextual actions", () => {
    expect(addNavigatorAction("benefits_blueprint").added).toBe(true);
    expect(addNavigatorAction("benefits_blueprint").added).toBe(false);
    expect(loadStoredNavigatorPlan()?.actionIds).toEqual(["benefits_blueprint"]);
  });

  it("marks an action complete and includes it in the export summary", () => {
    addNavigatorAction("career_total_comp");
    setNavigatorActionCompleted("career_total_comp", true);
    const plan = loadStoredNavigatorPlan();
    expect(plan?.completedActionIds).toEqual(["career_total_comp"]);
    expect(plan && createNavigatorPlanSummary(plan)).toContain("[x] Compare total compensation—not only base pay");
  });

  it("rejects malformed or unknown stored actions safely", () => {
    window.localStorage.setItem(NAVIGATOR_STORAGE_KEY, JSON.stringify({
      schemaVersion: 1,
      pathway: "wealth",
      objectiveLabel: "Test",
      actionIds: ["unknown_action"],
      completedActionIds: ["unknown_action"],
      savedAt: new Date().toISOString(),
    }));
    expect(loadStoredNavigatorPlan()).toBeNull();
  });

  it("clears all local plan data", () => {
    addNavigatorAction("cost_toolkit");
    clearNavigatorPlan();
    expect(window.localStorage.getItem(NAVIGATOR_STORAGE_KEY)).toBeNull();
    expect(loadStoredNavigatorPlan()).toBeNull();
  });
});
