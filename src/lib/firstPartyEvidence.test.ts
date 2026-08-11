import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  recordInsuranceHubHandoff,
  recordInsuranceHubView,
  PRECOMMERCE_VERIFICATION_MODE_KEY,
  recordPreCommerceCommitmentStarted,
  recordPreCommerceOfferEngagement,
  recordPreCommerceOfferView,
  recordServiceNavigationOpened,
  recordServiceNavigationSelection,
} from "@/lib/firstPartyEvidence";
import { PRIVACY_CONSENT_KEY } from "@/lib/privacyConsent";

const fetchMock = vi.fn().mockResolvedValue({ ok: true });

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.history.replaceState({}, "", "/insurance");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

describe("first-party evidence client", () => {
  it("does not send without analytics consent", () => {
    expect(recordInsuranceHubView()).toBe(false);
    expect(recordInsuranceHubHandoff("plan_types")).toBe(false);
    expect(recordServiceNavigationOpened("desktop_header")).toBe(false);
    expect(recordServiceNavigationSelection("mobile_header", "all_tools")).toBe(false);
    expect(recordPreCommerceOfferView()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("deduplicates every observed pre-commerce state without sending user values", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(recordPreCommerceOfferView()).toBe(true);
    expect(recordPreCommerceOfferView()).toBe(false);
    expect(recordPreCommerceOfferEngagement()).toBe(true);
    expect(recordPreCommerceOfferEngagement()).toBe(false);
    expect(recordPreCommerceCommitmentStarted()).toBe(true);
    expect(recordPreCommerceCommitmentStarted()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const payloads = fetchMock.mock.calls.map((call) => JSON.parse(String((call[1] as RequestInit).body)));
    expect(payloads.map((payload) => payload.eventName)).toEqual([
      "precommerce_offer_viewed",
      "precommerce_offer_engaged",
      "precommerce_commitment_started",
    ]);
    expect(payloads.every((payload) => payload.surface === "benefits_decision_result")).toBe(true);
    expect(payloads.every((payload) => payload.variant === "benefits_workspace_29_v2")).toBe(true);
    expect(JSON.stringify(payloads)).not.toMatch(/email|salary|employer|medical|planName|https?:/i);
  });

  it("uses a separate fixed variant for release verification", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");
    window.sessionStorage.setItem(PRECOMMERCE_VERIFICATION_MODE_KEY, "release_verification");

    expect(recordPreCommerceOfferView()).toBe(true);
    const payload = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(payload.variant).toBe("benefits_workspace_29_v2_release_verification");
  });

  it("records one insurance view per consented browser session", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(recordInsuranceHubView()).toBe(true);
    expect(recordInsuranceHubView()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload).toMatchObject({
      eventName: "insurance_hub_viewed",
      surface: "insurance_hub",
      variant: "baseline_v1",
    });
    expect(payload.destinationId).toBeUndefined();
    expect(Object.keys(payload).sort()).toEqual([
      "eventId",
      "eventName",
      "sessionId",
      "surface",
      "variant",
    ]);
  });

  it("records only fixed insurance destination IDs and never forwards URLs or query strings", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(recordInsuranceHubHandoff("/insurance/commercial-insurance-comparison#comparison-tool"))
      .toBe(true);
    expect(recordInsuranceHubHandoff("/tools/out-of-pocket-max-estimator?amount=5000"))
      .toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(String(request.body));
    expect(payload.destinationId).toBe("commercial_comparison");
    expect(JSON.stringify(payload)).not.toContain("comparison-tool");
    expect(JSON.stringify(payload)).not.toContain("amount");
  });

  it("records one navigation-open denominator per surface and session", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(recordServiceNavigationOpened("desktop_header")).toBe(true);
    expect(recordServiceNavigationOpened("desktop_header")).toBe(false);
    expect(recordServiceNavigationOpened("mobile_header")).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const desktopPayload = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    const mobilePayload = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body));
    expect(desktopPayload).toMatchObject({
      eventName: "service_navigation_opened",
      surface: "desktop_header",
      variant: "service_navigation_v1",
    });
    expect(mobilePayload).toMatchObject({
      eventName: "service_navigation_opened",
      surface: "mobile_header",
      variant: "service_navigation_v1",
    });
    expect(desktopPayload.destinationId).toBeUndefined();
    expect(mobilePayload.destinationId).toBeUndefined();
  });

  it("records a fixed service destination ID without route or user-provided text", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(recordServiceNavigationSelection("mobile_header", "benefits_command_center")).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const payload = JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body));
    expect(payload).toMatchObject({
      eventName: "service_navigation_destination_selected",
      surface: "mobile_header",
      destinationId: "benefits_command_center",
      variant: "service_navigation_v1",
    });
    expect(Object.keys(payload).sort()).toEqual([
      "destinationId",
      "eventId",
      "eventName",
      "sessionId",
      "surface",
      "variant",
    ]);
  });
});
