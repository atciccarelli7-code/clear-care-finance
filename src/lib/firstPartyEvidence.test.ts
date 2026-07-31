import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  recordInsuranceHubHandoff,
  recordInsuranceHubView,
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
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("records one view per consented browser session", () => {
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

  it("records only fixed destination IDs and never forwards URLs or query strings", () => {
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
});
