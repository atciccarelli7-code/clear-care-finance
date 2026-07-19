import { describe, expect, it, vi } from "vitest";
import { teachBackTasks } from "@/data/bloodThinnerReadiness";
import {
  evaluateBloodThinnerReadiness,
  initialBloodThinnerReadinessState,
  parseStoredReadinessState,
  trackBloodThinnerReadinessEvent,
} from "@/lib/bloodThinnerReadiness";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

describe("Blood Thinner Discharge Readiness contract", () => {
  it("does not treat viewing or medicine selection as completion", () => {
    const state = initialBloodThinnerReadinessState();
    expect(evaluateBloodThinnerReadiness(state).status).toBe("not_started");
    state.medicationId = "apixaban";
    expect(evaluateBloodThinnerReadiness(state).status).toBe("in_progress");
  });

  it("requires the exact rivaroxaban regimen", () => {
    const state = initialBloodThinnerReadinessState();
    state.medicationId = "rivaroxaban";
    state.reconciliationConfirmed = true;
    state.localActionPlanConfirmed = true;
    for (const task of teachBackTasks) state.teachBack[task.id] = "passed";
    expect(evaluateBloodThinnerReadiness(state).blockers).toContain("Select the exact rivaroxaban regimen.");
    state.rivaroxabanRegimenId = "twice_daily_15";
    expect(evaluateBloodThinnerReadiness(state).status).toBe("demonstrated");
  });

  it("blocks on failed teach-back or an unresolved practical barrier", () => {
    const state = initialBloodThinnerReadinessState();
    state.medicationId = "warfarin";
    state.reconciliationConfirmed = true;
    state.localActionPlanConfirmed = true;
    for (const task of teachBackTasks) state.teachBack[task.id] = "passed_after_reteach";
    state.teachBack.missed_dose = "blocked";
    state.barriers.cost_coverage = "unresolved_stop";
    const evaluation = evaluateBloodThinnerReadiness(state);
    expect(evaluation.status).toBe("blocked");
    expect(evaluation.blockers).toHaveLength(2);
  });

  it("allows a safe named backup without pretending the barrier disappeared", () => {
    const state = initialBloodThinnerReadinessState();
    state.medicationId = "enoxaparin";
    state.reconciliationConfirmed = true;
    state.localActionPlanConfirmed = true;
    for (const task of teachBackTasks) state.teachBack[task.id] = "passed";
    state.barriers.transport = "open_with_safe_backup";
    expect(evaluateBloodThinnerReadiness(state).status).toBe("demonstrated");
    expect(evaluateBloodThinnerReadiness(state).barrierCount).toBe(1);
  });

  it("emits fixed workflow dimensions only", () => {
    trackBloodThinnerReadinessEvent("care_readiness_status_changed", {
      stage_id: "handoff",
      mode_id: "staff",
      status_id: "blocked",
      barrier_count: 2,
      teach_back_passed_count: 3,
    });
    expect(trackSiteEvent).toHaveBeenCalledWith("care_readiness_status_changed", {
      tool_id: "blood_thinner_discharge_readiness",
      stage_id: "handoff",
      mode_id: "staff",
      status_id: "blocked",
      barrier_count: 2,
      teach_back_passed_count: 3,
    });
    expect(JSON.stringify(vi.mocked(trackSiteEvent).mock.calls)).not.toMatch(/apixaban|rivaroxaban|warfarin|dose|patient/i);
  });

  it("rejects malformed stored progress", () => {
    expect(parseStoredReadinessState("not-json")).toBeNull();
    expect(parseStoredReadinessState(JSON.stringify({ mode: "unknown" }))).toBeNull();
  });
});
