import { trackSiteEvent } from "@/lib/analytics";

export const GROWTH_EVENT_NAMES = [
  "concierge_viewed",
  "concierge_started",
  "concierge_completed",
  "concierge_destination_opened",
  "acquisition_tool_cta_selected",
  "article_to_tool_clicked",
  "article_to_related_article_clicked",
  "hub_to_tool_clicked",
  "hub_to_resource_clicked",
  "benefits_review_started",
  "benefits_review_completed",
  "benefits_receipt_viewed",
  "benefits_receipt_copied",
  "benefits_receipt_printed",
  "benefits_calendar_created",
  "benefits_canonical_link_shared",
  "benefits_review_resumed",
  "benefits_review_reset",
  "benefits_local_review_deleted",
  "benefits_related_journey_opened",
  "flagship_tool_started",
  "flagship_tool_step_completed",
  "flagship_tool_completed",
  "flagship_tool_result_action",
  "flagship_tool_handoff_opened",
  "organization_page_viewed",
  "organization_pilot_details_viewed",
  "organization_demo_opened",
  "organization_contact_selected",
  "organization_program_builder_started",
  "organization_program_plan_created",
  "organization_program_plan_action",
  "organization_resource_opened",
  "organization_launch_asset_action",
  "organization_buyer_faq_opened",
] as const;

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number];
export type GrowthEntrySurface = "home" | "start_here" | "tools" | "acquisition_article" | "article" | "hub" | "detector" | "receipt" | "organization";
export type GrowthCompletionBand = "started" | "partial" | "complete";
export type GrowthReceiptAction = "view" | "copy" | "print" | "calendar" | "share" | "reset" | "delete";
export type GrowthCtaType = "pilot_inquiry" | "pilot_scope" | "program_review" | "procurement_inquiry";
export type GrowthToolId = "benefits_blueprint" | "medicare_medicaid_eligibility";
export type GrowthResultAction = "copy" | "print" | "review" | "restart";

export type GrowthEventProperties = {
  entry_surface?: GrowthEntrySurface;
  problem_category?: string;
  destination_id?: string;
  completion_band?: GrowthCompletionBand;
  receipt_action?: GrowthReceiptAction;
  handoff_id?: string;
  cta_type?: GrowthCtaType;
  tool_id?: GrowthToolId;
  step_id?: string;
  action_id?: string;
  result_action?: GrowthResultAction;
};
const ALLOWED_PROPERTY_KEYS = new Set<keyof GrowthEventProperties>([
  "entry_surface",
  "problem_category",
  "destination_id",
  "completion_band",
  "receipt_action",
  "handoff_id",
  "cta_type",
  "tool_id",
  "step_id",
  "action_id",
  "result_action",
]);

const FIXED_VALUE_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;

export const sanitizeGrowthEvent = (name: string, properties: Record<string, unknown> = {}) => {
  if (!GROWTH_EVENT_NAMES.includes(name as GrowthEventName)) return null;
  const cleaned = Object.fromEntries(
    Object.entries(properties).flatMap(([key, value]) => {
      if (!ALLOWED_PROPERTY_KEYS.has(key as keyof GrowthEventProperties)) return [];
      if (typeof value !== "string" || !FIXED_VALUE_PATTERN.test(value)) return [];
      return [[key, value]];
    }),
  ) as GrowthEventProperties;
  return { name: name as GrowthEventName, properties: cleaned };
};

export const trackGrowthEvent = (name: GrowthEventName, properties: GrowthEventProperties = {}) => {
  const event = sanitizeGrowthEvent(name, properties);
  if (!event) return false;
  return trackSiteEvent(event.name, event.properties);
};
