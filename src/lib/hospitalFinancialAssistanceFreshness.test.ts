import { afterEach, describe, expect, it, vi } from "vitest";
import { hospitalPolicyBySlug } from "@/data/hospitalFinancialAssistancePolicies";
import { isHospitalPolicyStale } from "@/lib/hospitalFinancialAssistance";

const atrium = hospitalPolicyBySlug.get("atrium-health")!;

afterEach(() => {
  vi.useRealTimers();
});

describe("hospital financial-assistance policy freshness", () => {
  it("uses the current runtime date when no review date is supplied", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2027-09-01T00:00:00Z"));

    expect(isHospitalPolicyStale(atrium)).toBe(true);
  });
});
