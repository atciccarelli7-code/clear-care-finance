import { trackSiteEvent } from "@/lib/analytics";

export const BENEFITS_PACK_EVENT_NAMES = [
  "benefits_pack_page_viewed",
  "benefits_pack_preview_opened",
  "benefits_pack_paid_pilot_cta_clicked",
  "benefits_pack_interest_submit",
] as const;

export type BenefitsPackEventName = (typeof BENEFITS_PACK_EVENT_NAMES)[number];
export type BenefitsPackSurface = "product_page" | "healthcare_worker_hub" | "preview";

const FIXED_VALUE_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;

export const sanitizeBenefitsPackEvent = (
  name: string,
  properties: Record<string, unknown> = {},
) => {
  if (!BENEFITS_PACK_EVENT_NAMES.includes(name as BenefitsPackEventName)) return null;
  const surface = properties.surface;
  const previewId = properties.preview_id;
  return {
    name: name as BenefitsPackEventName,
    properties: {
      event_category: "benefits_pack_validation",
      product_id: "healthcare_worker_benefits_decision_pack",
      ...(typeof surface === "string" && FIXED_VALUE_PATTERN.test(surface) ? { surface } : {}),
      ...(typeof previewId === "string" && FIXED_VALUE_PATTERN.test(previewId) ? { preview_id: previewId } : {}),
    },
  };
};

export const trackBenefitsPackEvent = (
  name: BenefitsPackEventName,
  properties: { surface?: BenefitsPackSurface; preview_id?: string } = {},
) => {
  const event = sanitizeBenefitsPackEvent(name, properties);
  return event ? trackSiteEvent(event.name, event.properties) : false;
};
