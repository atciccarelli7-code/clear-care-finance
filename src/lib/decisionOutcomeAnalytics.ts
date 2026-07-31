import { trackSiteEvent } from "@/lib/analytics";

export const DECISION_OUTCOME_EVENT_NAMES = [
  "decision_calculator_started",
  "decision_valid_result_reached",
  "decision_loan_type_selected",
  "decision_recommendation_reached",
  "decision_quote_comparison_started",
  "decision_quote_comparison_completed",
  "decision_portable_output_used",
  "decision_my_plan_action_saved",
  "decision_neutral_resource_opened",
  "decision_commercial_handoff_shown",
  "decision_commercial_handoff_used",
  "decision_assumptions_edited",
  "decision_journey_restarted",
  "decision_validation_blocked",
] as const;

export type DecisionOutcomeEventName = (typeof DECISION_OUTCOME_EVENT_NAMES)[number];

type DecisionOutcomeProperties = {
  decision_id: string;
  action_id?: "copy" | "print" | "edit" | "restart" | "save" | "open" | "shown" | "used";
  resource_id?: string;
  block_id?: string;
};

const EVENT_SET = new Set<string>(DECISION_OUTCOME_EVENT_NAMES);
const ALLOWED_KEYS = new Set<keyof DecisionOutcomeProperties>(["decision_id", "action_id", "resource_id", "block_id"]);
const SAFE_ID_PATTERN = /^[a-z][a-z0-9_]{1,63}$/;
const SAFE_ACTIONS = new Set(["copy", "print", "edit", "restart", "save", "open", "shown", "used"]);

export const sanitizeDecisionOutcomeEvent = (
  name: string,
  properties: Record<string, unknown>,
): { name: DecisionOutcomeEventName; properties: DecisionOutcomeProperties } | null => {
  if (!EVENT_SET.has(name)) return null;
  if (Object.keys(properties).some((key) => !ALLOWED_KEYS.has(key as keyof DecisionOutcomeProperties))) return null;
  if (typeof properties.decision_id !== "string" || !SAFE_ID_PATTERN.test(properties.decision_id)) return null;
  if (properties.action_id !== undefined && (typeof properties.action_id !== "string" || !SAFE_ACTIONS.has(properties.action_id))) return null;
  for (const key of ["resource_id", "block_id"] as const) {
    const value = properties[key];
    if (value !== undefined && (typeof value !== "string" || !SAFE_ID_PATTERN.test(value))) return null;
  }
  return { name: name as DecisionOutcomeEventName, properties: properties as DecisionOutcomeProperties };
};

export const createDecisionOutcomeAnalytics = (decisionId: string) => {
  const sentTransitions = new Set<string>();

  return {
    track(name: DecisionOutcomeEventName, properties: Omit<DecisionOutcomeProperties, "decision_id"> = {}, options?: { dedupe?: boolean }) {
      const sanitized = sanitizeDecisionOutcomeEvent(name, { decision_id: decisionId, ...properties });
      if (!sanitized) return false;
      const dedupeKey = `${name}:${properties.action_id ?? ""}:${properties.resource_id ?? ""}:${properties.block_id ?? ""}`;
      if (options?.dedupe && sentTransitions.has(dedupeKey)) return false;
      if (options?.dedupe) sentTransitions.add(dedupeKey);
      return trackSiteEvent(sanitized.name, sanitized.properties);
    },
    resetTransitions() {
      sentTransitions.clear();
    },
  };
};
