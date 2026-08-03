import {
  BENEFITS_OFFER_SURFACE,
  BENEFITS_OFFER_VARIANT,
  EVIDENCE_SURFACE,
  SERVICE_NAVIGATION_VARIANT,
  type EvidenceDestinationId,
  type EvidenceEventName,
  type EvidenceEventPayload,
  type EvidenceSurface,
  type EvidenceVariant,
  type NavigationDestinationId,
  type NavigationSurface,
  resolveInsuranceDestinationId,
} from "@/lib/evidenceEventContract";
import {
  PRIVACY_CONSENT_CHANGED_EVENT,
  readPrivacyConsent,
} from "@/lib/privacyConsent";

const SESSION_KEY = "caf-evidence-session-v1";
const INSURANCE_VIEWED_KEY = "caf-evidence-viewed:insurance_hub:baseline_v1";
const BENEFITS_OFFER_VIEWED_KEY = `caf-evidence-viewed:${BENEFITS_OFFER_SURFACE}:${BENEFITS_OFFER_VARIANT}`;
const INSTALL_KEY = "__cafEvidenceObserverInstalled";
const DEFAULT_VARIANT: EvidenceVariant = "baseline_v1";
const BENEFITS_OFFER_PATH = "/products/healthcare-worker-benefits-decision-system";

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

export const getEvidenceSessionId = () => {
  if (typeof window === "undefined") return null;
  return getSessionId();
};

type EvidenceEventInput = {
  eventName: EvidenceEventName;
  surface: EvidenceSurface;
  destinationId?: EvidenceDestinationId;
  variant: EvidenceVariant;
};

const postEvidenceEvent = ({
  eventName,
  surface,
  destinationId,
  variant,
}: EvidenceEventInput) => {
  if (typeof window === "undefined" || readPrivacyConsent() !== "analytics") return false;
  const eventId = newUuid();
  const sessionId = getSessionId();
  if (!eventId || !sessionId) return false;

  const payload: EvidenceEventPayload = {
    eventId,
    sessionId,
    eventName,
    surface,
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
    if (variant === DEFAULT_VARIANT && window.sessionStorage.getItem(INSURANCE_VIEWED_KEY) === "true") return false;
    const accepted = postEvidenceEvent({
      eventName: "insurance_hub_viewed",
      surface: EVIDENCE_SURFACE,
      variant,
    });
    if (accepted && variant === DEFAULT_VARIANT) window.sessionStorage.setItem(INSURANCE_VIEWED_KEY, "true");
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
  return postEvidenceEvent({
    eventName: "insurance_hub_handoff_opened",
    surface: EVIDENCE_SURFACE,
    destinationId,
    variant,
  });
};

export const recordBenefitsOfferView = () => {
  if (typeof window === "undefined" || window.location.pathname !== BENEFITS_OFFER_PATH) return false;
  if (readPrivacyConsent() !== "analytics") return false;

  try {
    if (window.sessionStorage.getItem(BENEFITS_OFFER_VIEWED_KEY) === "true") return false;
    const accepted = postEvidenceEvent({
      eventName: "benefits_offer_viewed",
      surface: BENEFITS_OFFER_SURFACE,
      variant: BENEFITS_OFFER_VARIANT,
    });
    if (accepted) window.sessionStorage.setItem(BENEFITS_OFFER_VIEWED_KEY, "true");
    return accepted;
  } catch {
    return false;
  }
};

export const recordBenefitsOfferCta = () => postEvidenceEvent({
  eventName: "benefits_offer_cta_opened",
  surface: BENEFITS_OFFER_SURFACE,
  destinationId: "early_access_commitment_form",
  variant: BENEFITS_OFFER_VARIANT,
});

const navigationOpenedKey = (surface: NavigationSurface) =>
  `caf-evidence-viewed:${surface}:${SERVICE_NAVIGATION_VARIANT}`;

export const recordServiceNavigationOpened = (surface: NavigationSurface) => {
  if (typeof window === "undefined" || readPrivacyConsent() !== "analytics") return false;

  try {
    const key = navigationOpenedKey(surface);
    if (window.sessionStorage.getItem(key) === "true") return false;
    const accepted = postEvidenceEvent({
      eventName: "service_navigation_opened",
      surface,
      variant: SERVICE_NAVIGATION_VARIANT,
    });
    if (accepted) window.sessionStorage.setItem(key, "true");
    return accepted;
  } catch {
    return false;
  }
};

export const recordServiceNavigationSelection = (
  surface: NavigationSurface,
  destinationId: NavigationDestinationId,
) => postEvidenceEvent({
  eventName: "service_navigation_destination_selected",
  surface,
  destinationId,
  variant: SERVICE_NAVIGATION_VARIANT,
});

export const installFirstPartyEvidenceObserver = () => {
  if (typeof window === "undefined" || window[INSTALL_KEY]) return;
  window[INSTALL_KEY] = true;

  const observeRoute = () => {
    if (window.location.pathname === "/insurance") recordInsuranceHubView();
    if (window.location.pathname === BENEFITS_OFFER_PATH) recordBenefitsOfferView();
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
