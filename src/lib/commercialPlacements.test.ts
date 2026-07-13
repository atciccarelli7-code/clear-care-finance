import { describe, expect, it } from "vitest";
import {
  COMMERCIAL_LINK_REL,
  COMMERCIAL_PLACEMENTS,
  type CommercialPlacement,
  getCommercialPlacementsForPath,
  getCommercialRouteGroup,
  isCommercialPlacementLive,
  isCommerciallyEligiblePath,
  validateCommercialPlacementRegistry,
} from "@/lib/commercialPlacements";

const activePlacement: CommercialPlacement = {
  id: "benefits_resource_slot",
  kind: "affiliate",
  status: "active",
  routeGroups: ["articles", "reviewed_guides"],
  partnerId: "example_partner",
  campaignId: "benefits_education_2026",
  destinationUrl: "https://example.com/resource",
  disclosureLabel: "Sponsored educational resource",
  startsAt: "2026-01-01T00:00:00Z",
  endsAt: "2026-12-31T23:59:59Z",
};

describe("commercial placement foundation", () => {
  it("starts with no configured revenue surfaces", () => {
    expect(COMMERCIAL_PLACEMENTS).toEqual([]);
    expect(validateCommercialPlacementRegistry()).toEqual([]);
  });

  it("uses the required commercial link relationship", () => {
    expect(COMMERCIAL_LINK_REL.split(" ")).toEqual(
      expect.arrayContaining(["sponsored", "nofollow", "noopener"]),
    );
  });

  it.each([
    ["article", "/articles/how-to-read-an-eob", "articles"],
    ["topic", "/topics/retirement-accounts", "topics"],
    ["reviewed guide", "/insurance/health-insurance-plan-types", "reviewed_guides"],
  ])("recognizes reviewed publisher content: %s", (_label, path, group) => {
    expect(isCommerciallyEligiblePath(path)).toBe(true);
    expect(getCommercialRouteGroup(path)).toBe(group);
  });

  it.each([
    ["tool", "/tools/roth-vs-traditional-decision-helper"],
    ["tool directory", "/tools"],
    ["personal plan", "/start-here"],
    ["newsletter", "/newsletter"],
    ["contact", "/contact"],
    ["organization page", "/for-organizations"],
    ["privacy policy", "/privacy-policy"],
    ["printable", "/insurance/hospital-discharge-coverage/printable"],
  ])("keeps the %s route commercially ineligible", (_label, path) => {
    expect(isCommerciallyEligiblePath(path)).toBe(false);
    expect(getCommercialPlacementsForPath(path, new Date("2026-06-01T00:00:00Z"), [activePlacement])).toEqual([]);
  });

  it("returns only active, in-window placements for a matching reviewed route", () => {
    expect(isCommercialPlacementLive(activePlacement, new Date("2026-06-01T00:00:00Z"))).toBe(true);
    expect(
      getCommercialPlacementsForPath(
        "/articles/how-to-read-an-eob?source=test#section",
        new Date("2026-06-01T00:00:00Z"),
        [activePlacement],
      ),
    ).toEqual([activePlacement]);

    expect(
      getCommercialPlacementsForPath(
        "/topics/retirement-accounts",
        new Date("2026-06-01T00:00:00Z"),
        [activePlacement],
      ),
    ).toEqual([]);
  });

  it.each([
    ["disabled", { ...activePlacement, status: "disabled" as const }, "2026-06-01T00:00:00Z"],
    ["testing", { ...activePlacement, status: "testing" as const }, "2026-06-01T00:00:00Z"],
    ["future", activePlacement, "2025-06-01T00:00:00Z"],
    ["expired", activePlacement, "2027-06-01T00:00:00Z"],
  ])("does not render a %s placement", (_label, placement, now) => {
    expect(isCommercialPlacementLive(placement, new Date(now))).toBe(false);
  });

  it("rejects incomplete active placements and invalid schedules", () => {
    const invalid: CommercialPlacement[] = [
      {
        id: "Bad ID",
        kind: "sponsor",
        status: "active",
        routeGroups: [],
        startsAt: "2026-12-31T00:00:00Z",
        endsAt: "2026-01-01T00:00:00Z",
      },
    ];

    const errors = validateCommercialPlacementRegistry(invalid);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining("placement id"),
        expect.stringContaining("route group"),
        expect.stringContaining("partnerId"),
        expect.stringContaining("campaignId"),
        expect.stringContaining("destinationUrl"),
        expect.stringContaining("disclosure label"),
        expect.stringContaining("startsAt must be earlier"),
      ]),
    );
  });
});
