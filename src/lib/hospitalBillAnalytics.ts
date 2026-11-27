import { trackSiteEvent } from "@/lib/analytics";

export const HOSPITAL_BILL_ACTIONS = [
  "opened", "scenario_selected", "coverage_changed", "bill_item_opened",
  "comparison_viewed", "module_completed", "related_article_clicked", "source_clicked", "newsletter_clicked",
] as const;

export type HospitalBillAction = (typeof HOSPITAL_BILL_ACTIONS)[number];

/** Fixed actions only: never accept scenario names, financial inputs, diagnoses or claim details. */
export const trackHospitalBillEvent = (action: HospitalBillAction) => {
  if (!HOSPITAL_BILL_ACTIONS.includes(action)) return false;
  return trackSiteEvent("bill_anatomy_interaction", { product_id: "bill_anatomy", action_id: action });
};
