import { beforeEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";
import { HOSPITAL_BILL_ACTIONS, trackHospitalBillEvent, type HospitalBillAction } from "./hospitalBillAnalytics";
import { PRIVACY_CONSENT_KEY } from "./privacyConsent";
import { getIndexableRoutes, resolveSeoMeta } from "./seoRegistry";
import { resolveContentGovernance } from "./contentGovernance";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("hospital bill integration boundaries", () => {
  beforeEach(() => { window.localStorage.clear(); vi.clearAllMocks(); });

  it("keeps the flagship and methodology indexable, canonical and ad-free", () => {
    for (const route of ["/hospital-bill-anatomy", "/hospital-bill-anatomy/methodology"]) {
      expect(getIndexableRoutes()).toContain(route);
      expect(resolveSeoMeta(route).canonicalPath).toBe(route);
      expect(resolveContentGovernance(route, { knownRoute: true })).toMatchObject({ indexable: true, adEligible: false });
    }
    expect(resolveContentGovernance("/hospital-bill-anatomy")).toMatchObject({ sensitiveContext: true, interactiveContext: true });
  });

  it("does not transmit interactions before consent", () => {
    expect(trackHospitalBillEvent("opened")).toBe(false);
    expect(track).not.toHaveBeenCalled();
  });

  it("transmits only allowlisted actions without user inputs or clinical selections", () => {
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");
    for (const action of HOSPITAL_BILL_ACTIONS) trackHospitalBillEvent(action);
    expect(track).toHaveBeenCalledTimes(HOSPITAL_BILL_ACTIONS.length);
    for (const [event, props] of vi.mocked(track).mock.calls) {
      expect(event).toBe("bill_anatomy_interaction");
      expect(Object.keys(props ?? {}).sort()).toEqual(["action_id", "product_id"]);
      expect(props?.product_id).toBe("bill_anatomy");
    }
    expect(trackHospitalBillEvent("pneumonia_amount_12345" as HospitalBillAction)).toBe(false);
    expect(track).toHaveBeenCalledTimes(HOSPITAL_BILL_ACTIONS.length);
  });
});
