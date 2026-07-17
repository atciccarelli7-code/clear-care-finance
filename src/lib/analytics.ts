import { track } from "@vercel/analytics";
import { readPrivacyConsent } from "@/lib/privacyConsent";

type EventValue = string | number | boolean | null | undefined;
export type EventProperties = Record<string, EventValue>;

export type HomepageNavigationType =
  | "hero_action"
  | "starting_path"
  | "featured_topic"
  | "featured_article"
  | "specialty_hub"
  | "section_browse"
  | "closing_cta";

const SENSITIVE_KEY_PATTERN = /(^|_)(email|first_name|last_name|full_name|phone|ssn|income|salary|wage|age|state|zip|zipcode|household|disability|diagnosis|condition|medication|drug|symptom|provider|hospital|patient|member|claim|date|answer|answers|result|results|amount|balance|deductible|premium|oop|hsa|contribution|employer|role|job_title|offer_name|commute|schedule|overtime|bonus|benefit|free_text|note|notes|comment|comments)($|_)/i;
const EVENT_NAME_PATTERN = /^[a-z][a-z0-9_]{1,63}$/;
const MAX_STRING_LENGTH = 160;

const cleanUrl = (value: string) => {
  try {
    const base = typeof window === "undefined" ? "https://communityacquiredfinance.com" : window.location.origin;
    const parsed = new URL(value, base);
    const sameOrigin = parsed.origin === base;
    return sameOrigin ? parsed.pathname : `${parsed.origin}${parsed.pathname}`;
  } catch {
    return value.split(/[?#]/, 1)[0].slice(0, MAX_STRING_LENGTH);
  }
};

const cleanValue = (key: string, value: Exclude<EventValue, null | undefined>) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const normalized = key.endsWith("_url") || key.endsWith("_path") ? cleanUrl(trimmed) : trimmed;
  return normalized.slice(0, MAX_STRING_LENGTH);
};

export const sanitizeEventProperties = (properties: EventProperties = {}) =>
  Object.fromEntries(
    Object.entries(properties).flatMap(([key, value]) => {
      if (value === undefined || value === null || SENSITIVE_KEY_PATTERN.test(key)) return [];
      const cleaned = cleanValue(key, value);
      return cleaned === undefined ? [] : [[key, cleaned]];
    }),
  ) as Record<string, string | number | boolean>;

export const trackSiteEvent = (name: string, properties: EventProperties = {}) => {
  if (typeof window === "undefined" || readPrivacyConsent() !== "analytics" || !EVENT_NAME_PATTERN.test(name)) {
    return false;
  }

  const cleaned = sanitizeEventProperties(properties);

  try {
    track(name, cleaned);
  } catch {
    // Analytics must never interrupt the reader's workflow.
  }

  try {
    window.gtag?.("event", name, cleaned);
  } catch {
    // Google Analytics is optional and consent-gated.
  }

  return true;
};

export const trackToolEvent = (name: string, toolId: string, toolLabel?: string) =>
  trackSiteEvent(name, {
    event_category: "tools",
    tool_id: toolId,
    tool_label: toolLabel,
  });

export const trackHomepageNavigation = (
  navigationType: HomepageNavigationType,
  itemId: string,
  destinationPath?: string,
) =>
  trackSiteEvent("homepage_navigation", {
    event_category: "homepage",
    navigation_type: navigationType,
    item_id: itemId,
    destination_path: destinationPath,
  });
