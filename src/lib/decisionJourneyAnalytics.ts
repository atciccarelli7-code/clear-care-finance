import { trackSiteEvent } from "@/lib/analytics";

export const READINESS_JOURNEY_IDS = [
  "roth_traditional",
  "debt_retirement",
  "observation_status",
] as const;

export type ReadinessJourneyId = (typeof READINESS_JOURNEY_IDS)[number];

export const READINESS_JOURNEY_EVENT_NAMES = [
  "decision_journey_started",
  "decision_journey_completed",
  "decision_journey_result_action",
  "decision_journey_handoff_opened",
] as const;

export type ReadinessJourneyEventName = (typeof READINESS_JOURNEY_EVENT_NAMES)[number];
export type ReadinessJourneyResultAction = "copy" | "print" | "reset";
export type ReadinessJourneyHandoffId =
  | "roth_403b_calculator"
  | "roth_benefits_command_center"
  | "debt_financial_foundation"
  | "debt_student_loans"
  | "observation_discharge_center"
  | "observation_medical_bill_toolkit";

export type ReadinessJourneyEventProperties = {
  journey_id?: ReadinessJourneyId;
  result_action?: ReadinessJourneyResultAction;
  handoff_id?: ReadinessJourneyHandoffId;
};

const RESULT_ACTIONS = new Set<ReadinessJourneyResultAction>(["copy", "print", "reset"]);
const HANDOFF_IDS = new Set<ReadinessJourneyHandoffId>([
  "roth_403b_calculator",
  "roth_benefits_command_center",
  "debt_financial_foundation",
  "debt_student_loans",
  "observation_discharge_center",
  "observation_medical_bill_toolkit",
]);

export const getReadinessJourneyId = (pathname: string): ReadinessJourneyId | null => {
  switch (pathname) {
    case "/tools/roth-vs-traditional-decision-helper":
      return "roth_traditional";
    case "/tools/debt-vs-retirement-router":
      return "debt_retirement";
    case "/tools/observation-vs-inpatient-status-guide":
      return "observation_status";
    default:
      return null;
  }
};

export const sanitizeReadinessJourneyEvent = (
  name: string,
  properties: Record<string, unknown> = {},
) => {
  if (!READINESS_JOURNEY_EVENT_NAMES.includes(name as ReadinessJourneyEventName)) return null;

  const cleaned: ReadinessJourneyEventProperties = {};
  if (
    typeof properties.journey_id === "string"
    && READINESS_JOURNEY_IDS.includes(properties.journey_id as ReadinessJourneyId)
  ) {
    cleaned.journey_id = properties.journey_id as ReadinessJourneyId;
  }
  if (typeof properties.result_action === "string" && RESULT_ACTIONS.has(properties.result_action as ReadinessJourneyResultAction)) {
    cleaned.result_action = properties.result_action as ReadinessJourneyResultAction;
  }
  if (typeof properties.handoff_id === "string" && HANDOFF_IDS.has(properties.handoff_id as ReadinessJourneyHandoffId)) {
    cleaned.handoff_id = properties.handoff_id as ReadinessJourneyHandoffId;
  }

  if (!cleaned.journey_id) return null;

  if (name === "decision_journey_result_action" && !cleaned.result_action) return null;
  if (name === "decision_journey_handoff_opened" && !cleaned.handoff_id) return null;

  return {
    name: name as ReadinessJourneyEventName,
    properties: cleaned,
  };
};

export const trackReadinessJourneyEvent = (
  name: ReadinessJourneyEventName,
  properties: ReadinessJourneyEventProperties,
) => {
  const event = sanitizeReadinessJourneyEvent(name, properties);
  if (!event) return false;
  return trackSiteEvent(event.name, event.properties);
};
