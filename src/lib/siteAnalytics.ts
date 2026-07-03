type EventParams = Record<string, string | number | boolean | undefined>;

const cleanParams = (params: EventParams) => {
  const cleaned: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) cleaned[key] = value;
  });
  return cleaned;
};

export const trackSiteEvent = (name: string, params: EventParams = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, cleanParams(params));
};

export const trackToolEvent = (name: string, toolId: string, toolLabel?: string) => {
  trackSiteEvent(name, {
    event_category: "tools",
    tool_id: toolId,
    tool_label: toolLabel,
  });
};
