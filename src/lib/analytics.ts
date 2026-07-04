import { track } from "@vercel/analytics";

type EventProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const cleanProperties = (properties: EventProperties = {}) =>
  Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined && value !== null));

export const trackSiteEvent = (name: string, properties: EventProperties = {}) => {
  const cleaned = cleanProperties(properties);

  track(name, cleaned);

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, cleaned);
  }
};
