import { trackSiteEvent } from "@/lib/analytics";

export const PREVENTIVE_COST_TOOL_ID = "medical_appointment_cost_preparation" as const;

export const PREVENTIVE_COST_EVENT_NAMES = [
  "preventive_cost_tool_viewed",
  "preventive_cost_tool_started",
  "preventive_cost_tool_completed",
  "preventive_cost_plan_action",
  "preventive_cost_handoff_opened",
] as const;

export type PreventiveCostEventName = (typeof PREVENTIVE_COST_EVENT_NAMES)[number];
export type PreventiveCostStageId = "situation" | "preparation" | "next_call" | "plan";
export type PreventiveCostActionId = "copy" | "print" | "reset" | "my_plan";
export type PreventiveCostHandoffId =
  | "medical_bill_toolkit"
  | "consumer_rights"
  | "good_faith_estimate"
  | "hospital_price_transparency";

export type PreventiveCostEventProperties = {
  tool_id?: typeof PREVENTIVE_COST_TOOL_ID;
  stage_id?: PreventiveCostStageId;
  action_id?: PreventiveCostActionId;
  handoff_id?: PreventiveCostHandoffId;
};

const STAGE_IDS = new Set<PreventiveCostStageId>(["situation", "preparation", "next_call", "plan"]);
const ACTION_IDS = new Set<PreventiveCostActionId>(["copy", "print", "reset", "my_plan"]);
const HANDOFF_IDS = new Set<PreventiveCostHandoffId>([
  "medical_bill_toolkit",
  "consumer_rights",
  "good_faith_estimate",
  "hospital_price_transparency",
]);

export const sanitizePreventiveCostEvent = (
  name: string,
  properties: Record<string, unknown> = {},
) => {
  if (!PREVENTIVE_COST_EVENT_NAMES.includes(name as PreventiveCostEventName)) return null;
  if (properties.tool_id !== PREVENTIVE_COST_TOOL_ID) return null;

  const cleaned: PreventiveCostEventProperties = { tool_id: PREVENTIVE_COST_TOOL_ID };

  if (typeof properties.stage_id === "string" && STAGE_IDS.has(properties.stage_id as PreventiveCostStageId)) {
    cleaned.stage_id = properties.stage_id as PreventiveCostStageId;
  }
  if (typeof properties.action_id === "string" && ACTION_IDS.has(properties.action_id as PreventiveCostActionId)) {
    cleaned.action_id = properties.action_id as PreventiveCostActionId;
  }
  if (typeof properties.handoff_id === "string" && HANDOFF_IDS.has(properties.handoff_id as PreventiveCostHandoffId)) {
    cleaned.handoff_id = properties.handoff_id as PreventiveCostHandoffId;
  }

  if (name === "preventive_cost_tool_started" && !cleaned.stage_id) return null;
  if (name === "preventive_cost_plan_action" && !cleaned.action_id) return null;
  if (name === "preventive_cost_handoff_opened" && !cleaned.handoff_id) return null;

  return { name: name as PreventiveCostEventName, properties: cleaned };
};

export const trackPreventiveCostEvent = (
  name: PreventiveCostEventName,
  properties: PreventiveCostEventProperties,
) => {
  const event = sanitizePreventiveCostEvent(name, properties);
  if (!event) return false;
  return trackSiteEvent(event.name, event.properties);
};
