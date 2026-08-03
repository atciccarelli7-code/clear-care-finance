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
  it("keeps five primary destinations and expresses the approved public architecture", () => {
    expect(PRIMARY_NAVIGATION_ITEMS).toEqual([
      { to: "/start-here", label: "Start Here" },
      { to: "/tools", label: "Free Tools" },
      { to: "/healthcare-workers", label: "Healthcare Workers" },
      { to: "/patients-families", label: "Patients & Caregivers" },
      { to: "/methodology", label: "Trust & Methods" },
    ]);
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
    expect(items.every((item) => item.description.length >= 30 && item.description.length <= 160)).toBe(true);
  });

  it("links every primary and featured service to an indexable canonical route", () => {
    const indexableRoutes = sitemapRoutes();
    const routes = [
      ...PRIMARY_NAVIGATION_ITEMS.map((item) => item.to),
      ...SERVICE_NAVIGATION_GROUPS.flatMap((group) => group.items.map((item) => item.to)),
      ...MOBILE_PRIORITY_ITEMS.map((item) => item.to),
    ].map(canonicalPath);
    const missingRoutes = Array.from(new Set(routes.filter((route) => !indexableRoutes.includes(route))));

    expect(missingRoutes).toEqual([]);
  });

  it("surfaces one flagship preview and at least seven concrete free decision services globally", () => {
    const items = SERVICE_NAVIGATION_GROUPS.flatMap((group) => group.items);
    const flagship = items.filter((item) => item.id === "benefits_command_center");
    expect(flagship).toHaveLength(1);
    expect(flagship[0]).toMatchObject({
      label: "Benefits Decision System",
      to: "/healthcare-workers#benefits-decision-system",
      audience: "Flagship preview",
    });

    const concreteFreeServiceIds = new Set([
      "benefits_change_detector",
      "total_compensation",
      "paycheck_403b",
      "career_decision_center",
      "hospital_patient_guide",
      "medical_bill_review",
      "eob_bill_match",
      "prior_authorization",
    ]);
    const surfaced = items.filter((item) => concreteFreeServiceIds.has(item.id));
    expect(surfaced.length).toBeGreaterThanOrEqual(7);
  });

  it("uses three priority mobile actions and omits the emptied duplicate-start group", () => {
    expect(MOBILE_PRIORITY_ITEMS).toEqual([
      { id: "start_here", to: "/start-here", label: "Start Here", description: "Find the right next step." },
      { id: "all_tools", to: "/tools", label: "Free tools", description: "Open every calculator and guide." },
      { id: "articles", to: "/articles", label: "Free education", description: "Browse source-backed explanations." },
    ]);
    expect(MOBILE_GROUP_ITEMS).toHaveLength(3);
    expect(MOBILE_GROUP_ITEMS.map((group) => group.id)).toEqual(
      SERVICE_NAVIGATION_GROUPS.filter((group) => group.id !== "start").map((group) => group.id),
    );
  });
});
