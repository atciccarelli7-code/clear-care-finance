// Compatibility layer for older imports. New code should import from `@/lib/analytics`.
export { sanitizeEventProperties, trackSiteEvent, trackToolEvent } from "@/lib/analytics";
export type { EventProperties } from "@/lib/analytics";
