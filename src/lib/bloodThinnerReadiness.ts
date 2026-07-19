import type { BarrierId, BloodThinnerMedicationId, RivaroxabanRegimenId, TeachBackTaskId } from "@/data/bloodThinnerReadiness";
import { teachBackTasks } from "@/data/bloodThinnerReadiness";
import { trackSiteEvent } from "@/lib/analytics";

export type WorkflowMode = "staff" | "patient_caregiver";
export type TeachBackResult = "unassessed" | "passed" | "passed_after_reteach" | "blocked";
export type BarrierStatus = "identified" | "resolved" | "open_with_safe_backup" | "unresolved_stop";

export type BloodThinnerReadinessState = {
  mode: WorkflowMode;
  stage: "medicine" | "learn" | "teach_back" | "barriers" | "handoff";
  medicationId: BloodThinnerMedicationId | null;
  rivaroxabanRegimenId: RivaroxabanRegimenId | null;
  reconciliationConfirmed: boolean;
  localActionPlanConfirmed: boolean;
  teachBack: Record<TeachBackTaskId, TeachBackResult>;
  barriers: Partial<Record<BarrierId, BarrierStatus>>;
};

export const BLOOD_THINNER_STORAGE_KEY = "caf-blood-thinner-readiness-review-v1";

export const initialBloodThinnerReadinessState = (): BloodThinnerReadinessState => ({
  mode: "staff",
  stage: "medicine",
  medicationId: null,
  rivaroxabanRegimenId: null,
  reconciliationConfirmed: false,
  localActionPlanConfirmed: false,
  teachBack: Object.fromEntries(teachBackTasks.map(({ id }) => [id, "unassessed"])) as Record<TeachBackTaskId, TeachBackResult>,
  barriers: {},
});

export type ReadinessEvaluation = {
  status: "not_started" | "in_progress" | "blocked" | "demonstrated";
  label: string;
  blockers: string[];
  passedTeachBack: number;
  barrierCount: number;
};

export const evaluateBloodThinnerReadiness = (state: BloodThinnerReadinessState): ReadinessEvaluation => {
  const blockers: string[] = [];
  if (!state.medicationId) blockers.push("Select the exact medicine branch.");
  if (state.medicationId === "rivaroxaban" && !state.rivaroxabanRegimenId) blockers.push("Select the exact rivaroxaban regimen.");
  if (!state.reconciliationConfirmed) blockers.push("Staff must confirm reconciliation against the final medication list.");
  if (!state.localActionPlanConfirmed) blockers.push("Staff must confirm the organization-approved bleeding, injury, procedure, and contact plan is available.");

  const teachBackValues = Object.values(state.teachBack);
  const passedTeachBack = teachBackValues.filter((value) => value === "passed" || value === "passed_after_reteach").length;
  if (teachBackValues.some((value) => value === "unassessed")) blockers.push("Complete every teach-back task.");
  if (teachBackValues.some((value) => value === "blocked")) blockers.push("Re-teach and escalate each teach-back task that did not pass.");

  const barrierValues = Object.values(state.barriers);
  if (barrierValues.some((value) => value === "identified" || value === "unresolved_stop")) blockers.push("Resolve each barrier or document a safe named backup.");

  const hasActivity = Boolean(state.medicationId) || state.reconciliationConfirmed || state.localActionPlanConfirmed || teachBackValues.some((value) => value !== "unassessed") || barrierValues.length > 0;
  const status = !hasActivity ? "not_started" : blockers.length ? (barrierValues.includes("unresolved_stop") || teachBackValues.includes("blocked") ? "blocked" : "in_progress") : "demonstrated";

  return {
    status,
    label: status === "demonstrated" ? "Readiness demonstrated in this review workflow" : status === "blocked" ? "Discharge handoff blocked" : status === "in_progress" ? "Readiness checks in progress" : "Readiness checks not started",
    blockers,
    passedTeachBack,
    barrierCount: barrierValues.length,
  };
};

type ReadinessEventName = "care_readiness_started" | "care_readiness_stage_viewed" | "care_readiness_status_changed" | "care_readiness_printed" | "care_readiness_reset";

export const trackBloodThinnerReadinessEvent = (
  name: ReadinessEventName,
  properties: { stage_id?: BloodThinnerReadinessState["stage"]; mode_id?: WorkflowMode; status_id?: ReadinessEvaluation["status"]; barrier_count?: number; teach_back_passed_count?: number } = {},
) => trackSiteEvent(name, { tool_id: "blood_thinner_discharge_readiness", ...properties });

export const parseStoredReadinessState = (value: string | null): BloodThinnerReadinessState | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<BloodThinnerReadinessState>;
    if (parsed.mode !== "staff" && parsed.mode !== "patient_caregiver") return null;
    return { ...initialBloodThinnerReadinessState(), ...parsed, teachBack: { ...initialBloodThinnerReadinessState().teachBack, ...parsed.teachBack }, barriers: parsed.barriers ?? {} };
  } catch {
    return null;
  }
};
