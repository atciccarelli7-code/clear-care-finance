import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  MOBILE_GROUP_ITEMS,
  MOBILE_PRIORITY_ITEMS,
  PRIMARY_NAVIGATION_ITEMS,
  SERVICE_NAVIGATION_GROUPS,
} from "@/data/serviceNavigation";
import { NAVIGATION_DESTINATION_IDS } from "@/lib/evidenceEventContract";

const canonicalPath = (route: string) => route.split("#")[0] || "/";

const sitemapRoutes = () => {
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  return Array.from(sitemap.matchAll(/<loc>https:\/\/communityacquiredfinance\.com([^<]*)<\/loc>/g))
    .map((match) => match[1] || "/");
};

describe("service navigation registry", () => {
  it("keeps five primary destinations and limits service navigation to four groups", () => {
    expect(PRIMARY_NAVIGATION_ITEMS).toHaveLength(5);
    expect(SERVICE_NAVIGATION_GROUPS).toHaveLength(4);
    expect(SERVICE_NAVIGATION_GROUPS.every((group) => group.items.length >= 2 && group.items.length <= 5)).toBe(true);
  });

  it("uses unique allowlisted destination IDs and internal routes", () => {
    const items = SERVICE_NAVIGATION_GROUPS.flatMap((group) => group.items);
    const ids = items.map((item) => item.id);
    const routes = items.map((item) => item.to);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
    expect(items.every((item) => NAVIGATION_DESTINATION_IDS.includes(item.id))).toBe(true);
    expect(items.every((item) => item.to.startsWith("/") && !item.to.includes("?"))).toBe(true);
    expect(items.every((item) => item.description.length >= 30 && item.description.length <= 140)).toBe(true);
  });

  it("links every primary and featured service to a route in the generated sitemap", () => {
    const indexableRoutes = sitemapRoutes();
    const routes = [
      ...PRIMARY_NAVIGATION_ITEMS.map((item) => item.to),
      ...SERVICE_NAVIGATION_GROUPS.flatMap((group) => group.items.map((item) => item.to)),
      ...MOBILE_PRIORITY_ITEMS.map((item) => item.to),
    ].map(canonicalPath);
    const missingRoutes = Array.from(new Set(routes.filter((route) => !indexableRoutes.includes(route))));

    expect(missingRoutes).toEqual([]);
  });

  it("surfaces at least eight concrete decision services globally", () => {
    const concreteServiceIds = new Set([
      "benefits_command_center",
      "benefits_change_detector",
      "total_compensation",
      "paycheck_403b",
      "career_decision_center",
      "hospital_patient_guide",
      "medical_bill_review",
      "eob_bill_match",
      "prior_authorization",
    ]);
    const surfaced = SERVICE_NAVIGATION_GROUPS
      .flatMap((group) => group.items)
      .filter((item) => concreteServiceIds.has(item.id));

    expect(surfaced.length).toBeGreaterThanOrEqual(8);
  });

  it("uses three priority mobile actions and omits the emptied duplicate-start group", () => {
    expect(MOBILE_PRIORITY_ITEMS).toHaveLength(3);
    expect(MOBILE_GROUP_ITEMS).toHaveLength(3);
    expect(MOBILE_GROUP_ITEMS.map((group) => group.id)).toEqual(
      SERVICE_NAVIGATION_GROUPS.filter((group) => group.id !== "start").map((group) => group.id),
    );
  });
});
