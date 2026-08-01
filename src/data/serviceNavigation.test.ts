import { describe, expect, it } from "vitest";
import {
  MOBILE_GROUP_ITEMS,
  MOBILE_PRIORITY_ITEMS,
  PRIMARY_NAVIGATION_ITEMS,
  SERVICE_NAVIGATION_GROUPS,
} from "@/data/serviceNavigation";
import { NAVIGATION_DESTINATION_IDS } from "@/lib/evidenceEventContract";

describe("service navigation registry", () => {
  it("preserves six primary destinations and limits service navigation to four groups", () => {
    expect(PRIMARY_NAVIGATION_ITEMS).toHaveLength(6);
    expect(SERVICE_NAVIGATION_GROUPS).toHaveLength(4);
    expect(SERVICE_NAVIGATION_GROUPS.every((group) => group.items.length >= 3 && group.items.length <= 5)).toBe(true);
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

  it("uses three priority mobile actions and the same four-group hierarchy", () => {
    expect(MOBILE_PRIORITY_ITEMS).toHaveLength(3);
    expect(MOBILE_GROUP_ITEMS).toHaveLength(4);
    expect(MOBILE_GROUP_ITEMS.map((group) => group.id)).toEqual(
      SERVICE_NAVIGATION_GROUPS.map((group) => group.id),
    );
  });
});
