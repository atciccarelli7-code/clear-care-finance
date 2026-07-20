export const JOURNEY_CONTEXT_STORAGE_KEY = "caf-active-journey-v1";

export type JourneyEntrySurface = "home" | "start_here" | "tools";

export type JourneyContext = {
  journeyId: string;
  source: JourneyEntrySurface;
  goalId: string;
  goalLabel: string;
  destinationPath: string;
  expectedOutcome: string;
};

const FIXED_ID_PATTERN = /^[a-z][a-z0-9_]{0,63}$/;
const SAFE_PATH_PATTERN = /^\/[a-z0-9\-/]*$/;
const SAFE_TEXT_PATTERN = /^[^<>\r\n]{1,180}$/;

export const isValidJourneyContext = (value: unknown): value is JourneyContext => {
  if (!value || typeof value !== "object") return false;
  const context = value as Partial<JourneyContext>;
  return (
    typeof context.journeyId === "string" &&
    FIXED_ID_PATTERN.test(context.journeyId) &&
    (context.source === "home" || context.source === "start_here" || context.source === "tools") &&
    typeof context.goalId === "string" &&
    FIXED_ID_PATTERN.test(context.goalId) &&
    typeof context.goalLabel === "string" &&
    SAFE_TEXT_PATTERN.test(context.goalLabel) &&
    typeof context.destinationPath === "string" &&
    SAFE_PATH_PATTERN.test(context.destinationPath) &&
    typeof context.expectedOutcome === "string" &&
    SAFE_TEXT_PATTERN.test(context.expectedOutcome)
  );
};

export const saveJourneyContext = (context: JourneyContext) => {
  if (!isValidJourneyContext(context) || typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(JOURNEY_CONTEXT_STORAGE_KEY, JSON.stringify(context));
    return true;
  } catch {
    return false;
  }
};

export const loadJourneyContext = (): JourneyContext | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(JOURNEY_CONTEXT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidJourneyContext(parsed)) {
      window.sessionStorage.removeItem(JOURNEY_CONTEXT_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearJourneyContext = () => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(JOURNEY_CONTEXT_STORAGE_KEY);
  } catch {
    // Storage is an enhancement. The guided destination remains usable without it.
  }
};
