import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "@vercel/analytics";
import { sanitizeEventProperties, trackSiteEvent } from "@/lib/analytics";
import { PRIVACY_CONSENT_KEY } from "@/lib/privacyConsent";

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

afterEach(() => {
  window.localStorage.clear();
  delete window.gtag;
  vi.clearAllMocks();
});

describe("privacy-safe analytics", () => {
  it("removes sensitive properties and strips URL query strings", () => {
    expect(sanitizeEventProperties({
      event_category: "tools",
      tool_id: "benefits-blueprint",
      income_amount: 85000,
      disability_answer: "yes",
      link_url: "https://example.com/resource?member=123#section",
      empty: "   ",
    })).toEqual({
      event_category: "tools",
      tool_id: "benefits-blueprint",
      link_url: "https://example.com/resource",
    });
  });

  it("removes compensation, employer, commute, and schedule fields", () => {
    expect(sanitizeEventProperties({
      event_category: "tools",
      tool_id: "healthcare_worker_total_compensation",
      employer_name: "Example Hospital",
      role_name: "Clinical Specialist",
      salary: 95000,
      hourly_wage: 42,
      annual_bonus: 5000,
      retirement_benefit: 6000,
      commute_minutes: 45,
      schedule_answer: "five days",
      comparison_type: "hourly_vs_salary",
    })).toEqual({
      event_category: "tools",
      tool_id: "healthcare_worker_total_compensation",
      comparison_type: "hourly_vs_salary",
    });
  });

  it("does not emit events until analytics consent is granted", () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    expect(trackSiteEvent("tool_start", { tool_id: "example" })).toBe(false);
    expect(track).not.toHaveBeenCalled();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("emits the same sanitized event to Vercel and Google after consent", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    window.localStorage.setItem(PRIVACY_CONSENT_KEY, "analytics");

    expect(trackSiteEvent("tool_start", {
      event_category: "tools",
      tool_id: "example",
      answer_result: "private",
    })).toBe(true);

    expect(track).toHaveBeenCalledWith("tool_start", {
      event_category: "tools",
      tool_id: "example",
    });
    expect(gtag).toHaveBeenCalledWith("event", "tool_start", {
      event_category: "tools",
      tool_id: "example",
    });
  });
});
