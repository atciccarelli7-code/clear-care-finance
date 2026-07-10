export const PRIVACY_CONSENT_KEY = "caf-privacy-consent-v1";
export const OPEN_PRIVACY_CHOICES_EVENT = "caf:open-privacy-choices";
export const PRIVACY_CONSENT_CHANGED_EVENT = "caf:privacy-consent-changed";

export type PrivacyConsentChoice = "necessary" | "analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const readPrivacyConsent = (): PrivacyConsentChoice | null => {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(PRIVACY_CONSENT_KEY);
    return value === "necessary" || value === "analytics" ? value : null;
  } catch {
    return null;
  }
};

export const applyPrivacyConsent = (choice: PrivacyConsentChoice) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, choice);
  } catch {
    // The consent signal still applies for the current page when storage is unavailable.
  }

  window.gtag?.("consent", "update", {
    analytics_storage: choice === "analytics" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  window.dispatchEvent(
    new CustomEvent<PrivacyConsentChoice>(PRIVACY_CONSENT_CHANGED_EVENT, { detail: choice }),
  );
};

export const openPrivacyChoices = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_PRIVACY_CHOICES_EVENT));
};
