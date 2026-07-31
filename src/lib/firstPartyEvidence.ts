import {
  EVIDENCE_SURFACE,
  type EvidenceEventName,
  type EvidenceEventPayload,
  type EvidenceVariant,
  resolveInsuranceDestinationId,
} from "@/lib/evidenceEventContract";
import {
  PRIVACY_CONSENT_CHANGED_EVENT,
  readPrivacyConsent,
} from "@/lib/privacyConsent";

const SESSION_KEY = "caf-evidence-session-v1";
const VIEWED_KEY = "caf-evidence-viewed:insurance_hub:baseline_v1";
const INSTALL_KEY = "__cafEvidenceObserverInstalled";
const DEFAULT_VARIANT: EvidenceVariant = "baseline_v1";

declare global {
  interface Window {
    __cafEvidenceObserverInstalled?: boolean;
  }
}

const newUuid = () => {
  try {
    return window.crypto.randomUUID();
  } catch {
    return null;
  }
};

const getSessionId = () => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const created = newUuid();
    if (!created) return null;
    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    return null;
  }
};

const postEvidenceEvent = (
  eventName: EvidenceEventName,
  destinationId?: EvidenceEventPayload["destinationId"],
  variant: EvidenceVariant = DEFAULT_VARIANT,
) => {
  if (typeof window === "undefined" || readPrivacyConsent() !== "analytics") return false;
  const eventId = newUuid();
  const sessionId = getSessionId();
  if (!eventId || !sessionId) return false;

  const payload: EvidenceEventPayload = {
    eventId,
    sessionId,
    eventName,
    surface: EVIDENCE_SURFACE,
    ...(destinationId ? { destinationId } : {}),
    variant,
  };

  try {
    void fetch("/api/evidence-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "same-origin",
      keepalive: true,
    }).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
};

export const recordInsuranceHubView = (variant: EvidenceVariant = DEFAULT_VARIANT) => {
  if (typeof window === "undefined" || window.location.pathname !== "/insurance") return false;
  if (readPrivacyConsent() !== "analytics") return false;

  try {
    if (variant === DEFAULT_VARIANT && window.sessionStorage.getItem(VIEWED_KEY) === "true") return false;
    const accepted = postEvidenceEvent("insurance_hub_viewed", undefined, variant);
    if (accepted && variant === DEFAULT_VARIANT) window.sessionStorage.setItem(VIEWED_KEY, "true");
    return accepted;
  } catch {
    return false;
  }
};

export const recordInsuranceHubHandoff = (
  destination: unknown,
  variant: EvidenceVariant = DEFAULT_VARIANT,
) => {
  const destinationId = resolveInsuranceDestinationId(destination);
  if (!destinationId) return false;
  return postEvidenceEvent("insurance_hub_handoff_opened", destinationId, variant);
};

export const installFirstPartyEvidenceObserver = () => {
  if (typeof window === "undefined" || window[INSTALL_KEY]) return;
  window[INSTALL_KEY] = true;

  const observeRoute = () => {
    if (window.location.pathname === "/insurance") recordInsuranceHubView();
  };

  const wrapHistoryMethod = (method: "pushState" | "replaceState") => {
    const original = window.history[method].bind(window.history);
    window.history[method] = ((...args: Parameters<History[typeof method]>) => {
      const result = original(...args);
      queueMicrotask(observeRoute);
      return result;
    }) as History[typeof method];
  };

  wrapHistoryMethod("pushState");
  wrapHistoryMethod("replaceState");
  window.addEventListener("popstate", observeRoute);
  window.addEventListener(PRIVACY_CONSENT_CHANGED_EVENT, observeRoute);
  queueMicrotask(observeRoute);
};
