import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackSiteEvent } from "@/lib/analytics";
import { trackDirectionalCta, type DirectionalCtaAction } from "@/lib/directionalCta";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn(() => true) }));

const action: DirectionalCtaAction = {
  id: "article_eob_match_bill",
  title: "Match the EOB and provider bill",
  label: "Match EOB and bill",
  href: "/tools/eob-to-bill-match-checker?ignored=true",
  availabilityStatus: "available",
};

const context = {
  audienceSegment: "patients_caregivers",
  decisionCategory: "medical_bills",
  placementId: "article_next_action",
  originPath: "/articles/how-to-read-an-eob",
} as const;

describe("directional CTA analytics contract", () => {
  beforeEach(() => vi.clearAllMocks());

  it("emits one fixed, privacy-safe event with no CTA copy or user values", () => {
    expect(trackDirectionalCta(action, "primary", context)).toBe(true);
    expect(trackSiteEvent).toHaveBeenCalledTimes(1);
    expect(trackSiteEvent).toHaveBeenCalledWith("directional_cta_clicked", {
      event_category: "directional_navigation",
      cta_id: "article_eob_match_bill",
      origin_path: "/articles/how-to-read-an-eob",
      destination_path: "/tools/eob-to-bill-match-checker",
      audience_segment: "patients_caregivers",
      action_tier: "primary",
      decision_category: "medical_bills",
      placement_id: "article_next_action",
    });
    expect(vi.mocked(trackSiteEvent).mock.calls[0]?.[1]).not.toHaveProperty("label");
  });

  it("rejects malformed IDs, unavailable offers, and non-allowlisted destinations", () => {
    expect(trackDirectionalCta({ ...action, id: "Article CTA!" }, "primary", context)).toBe(false);
    expect(trackDirectionalCta({ ...action, availabilityStatus: "planned" } as unknown as DirectionalCtaAction, "primary", context)).toBe(false);
    expect(trackDirectionalCta({ ...action, href: "javascript:alert(1)" }, "primary", context)).toBe(false);
    expect(trackSiteEvent).not.toHaveBeenCalled();
  });
});

