import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyPrivacyConsent,
  OPEN_PRIVACY_CHOICES_EVENT,
  openPrivacyChoices,
  PRIVACY_CONSENT_CHANGED_EVENT,
  PRIVACY_CONSENT_KEY,
  readPrivacyConsent,
} from "@/lib/privacyConsent";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
  delete window.gtag;
  delete window.__cafAnalyticsAllowed;
  delete window.__cafLoadGoogleAnalytics;
});

describe("privacy consent", () => {
  it("returns null until a valid choice is stored", () => {
    expect(readPrivacyConsent()).toBeNull();
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "unexpected");
    expect(readPrivacyConsent()).toBeNull();
  });

  it.each([
    ["necessary", "denied", false],
    ["analytics", "granted", true],
  ] as const)("persists %s and updates Google consent mode", (choice, analyticsStorage, analyticsAllowed) => {
    const gtag = vi.fn();
    const loadGoogleAnalytics = vi.fn();
    const changed = vi.fn();
    window.gtag = gtag;
    window.__cafLoadGoogleAnalytics = loadGoogleAnalytics;
    window.addEventListener(PRIVACY_CONSENT_CHANGED_EVENT, changed);

    applyPrivacyConsent(choice);

    expect(readPrivacyConsent()).toBe(choice);
    expect(window.__cafAnalyticsAllowed).toBe(analyticsAllowed);
    expect(gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: analyticsStorage,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(loadGoogleAnalytics).toHaveBeenCalledTimes(analyticsAllowed ? 1 : 0);
    expect(changed).toHaveBeenCalledOnce();

    window.removeEventListener(PRIVACY_CONSENT_CHANGED_EVENT, changed);
  });

  it("emits a request to reopen privacy choices", () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_PRIVACY_CHOICES_EVENT, listener);

    openPrivacyChoices();

    expect(listener).toHaveBeenCalledOnce();
    window.removeEventListener(OPEN_PRIVACY_CHOICES_EVENT, listener);
  });
});
