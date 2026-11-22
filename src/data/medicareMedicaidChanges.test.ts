import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { POLICY_CHANGES, CHANGES_LAST_VERIFIED, CHANGES_PATH, filterPolicyChanges } from "./medicareMedicaidChanges";
import { resolveContentGovernance } from "@/lib/contentGovernance";
import { getIndexableRoutes } from "@/lib/seoRegistry";

describe("policy changes publication safeguards", () => {
  it("keeps stable anchors, complete records and primary-source citations", () => {
    expect(new Set(POLICY_CHANGES.map((entry) => entry.id)).size).toBe(POLICY_CHANGES.length);
    for (const entry of POLICY_CHANGES) {
      for (const value of [entry.title, entry.who, entry.changed, entry.action, entry.effectiveDate, entry.implication]) expect(value.trim().length).toBeGreaterThan(10);
      expect(entry.verifiedAt).toBe(CHANGES_LAST_VERIFIED);
      expect(entry.sources.length).toBeGreaterThan(0);
      for (const source of entry.sources) expect(new URL(source.url).hostname).toMatch(/(^|\.)(cms\.gov|medicare\.gov|medicaid\.gov|ncdhhs\.gov|federalregister\.gov|govinfo\.gov)$/);
      if (entry.supersededBy) expect(POLICY_CHANGES.some((target) => target.id === entry.supersededBy && !target.archived)).toBe(true);
    }
  });
  it("does not mistake a proposal or state-dependent rollout for an effective universal rule", () => {
    expect(POLICY_CHANGES.find((entry) => entry.id === "2028-ma-proposal")?.status).toBe("Proposed");
    expect(POLICY_CHANGES.find((entry) => entry.id === "2027-nc-work")?.status).toBe("Scheduled — state decision pending");
    expect(POLICY_CHANGES.find((entry) => entry.id === "2026-part-d-archive")?.status).toBe("Effective");
  });
  it("finds care questions with combined filters, case-insensitive words and archive results", () => {
    expect(filterPolicyChanges(POLICY_CHANGES, "  ReHaB transfer  ", "Medicare provider payments").map((entry) => entry.id)).toContain("fy2027-snf");
    expect(filterPolicyChanges(POLICY_CHANGES, "", "North Carolina Medicaid", "Effective").map((entry) => entry.id)).toEqual(["noncitizen-nc"]);
    expect(filterPolicyChanges(POLICY_CHANGES, "$615").some((entry) => entry.archived)).toBe(true);
    expect(filterPolicyChanges(POLICY_CHANGES, "no-such-topic")).toEqual([]);
  });
  it("registers exactly one evergreen indexable route and keeps it ad-free", () => {
    expect(getIndexableRoutes().filter((route) => route === CHANGES_PATH)).toHaveLength(1);
    expect(resolveContentGovernance(CHANGES_PATH)).toMatchObject({ indexable: true, adEligible: false, sensitiveContext: true });
  });
  it("keeps the hub’s internal reading links on real indexable routes", () => {
    const page = readFileSync("src/pages/MedicareMedicaidChangesPage.tsx", "utf8");
    const routes = getIndexableRoutes();
    for (const match of page.matchAll(/to="([^"]+)"/g)) expect(routes, match[1]).toContain(match[1]);
  });
});
