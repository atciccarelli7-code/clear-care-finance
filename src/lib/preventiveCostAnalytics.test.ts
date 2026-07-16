import { describe, expect, it } from "vitest";
import {
  PREVENTIVE_COST_TOOL_ID,
  sanitizePreventiveCostEvent,
} from "@/lib/preventiveCostAnalytics";

describe("preventive cost analytics", () => {
  it("retains only fixed operational identifiers", () => {
    expect(sanitizePreventiveCostEvent("preventive_cost_plan_action", {
      tool_id: PREVENTIVE_COST_TOOL_ID,
      action_id: "copy",
      care_setting: "hospital-outpatient",
      coverage: "private",
      plan_name: "Example PPO",
      member_id: "ABC123",
      estimate: 4500,
      result_text: "generated plan",
      url: "/tools/example?claim=123",
    })).toEqual({
      name: "preventive_cost_plan_action",
      properties: {
        tool_id: PREVENTIVE_COST_TOOL_ID,
        action_id: "copy",
      },
    });
  });

  it("rejects unknown events, tools, stages, actions, and handoffs", () => {
    expect(sanitizePreventiveCostEvent("answer_saved", { tool_id: PREVENTIVE_COST_TOOL_ID })).toBeNull();
    expect(sanitizePreventiveCostEvent("preventive_cost_tool_viewed", { tool_id: "free_text" })).toBeNull();
    expect(sanitizePreventiveCostEvent("preventive_cost_tool_started", { tool_id: PREVENTIVE_COST_TOOL_ID, stage_id: "coverage-private" })).toBeNull();
    expect(sanitizePreventiveCostEvent("preventive_cost_plan_action", { tool_id: PREVENTIVE_COST_TOOL_ID, action_id: "email" })).toBeNull();
    expect(sanitizePreventiveCostEvent("preventive_cost_handoff_opened", { tool_id: PREVENTIVE_COST_TOOL_ID, handoff_id: "https://example.com?member=1" })).toBeNull();
  });

  it("allows the fixed completion and handoff contract", () => {
    expect(sanitizePreventiveCostEvent("preventive_cost_tool_completed", {
      tool_id: PREVENTIVE_COST_TOOL_ID,
      stage_id: "plan",
    })).toEqual({
      name: "preventive_cost_tool_completed",
      properties: { tool_id: PREVENTIVE_COST_TOOL_ID, stage_id: "plan" },
    });
    expect(sanitizePreventiveCostEvent("preventive_cost_handoff_opened", {
      tool_id: PREVENTIVE_COST_TOOL_ID,
      handoff_id: "medical_bill_toolkit",
    })?.properties).toEqual({
      tool_id: PREVENTIVE_COST_TOOL_ID,
      handoff_id: "medical_bill_toolkit",
    });
  });
});
