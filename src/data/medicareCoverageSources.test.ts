import { describe, expect, it } from "vitest";
import { MEDICARE_COVERAGE_SOURCE_REGISTRY, getStaleMedicareSources } from "./medicareCoverageSources";

describe("Medicare source registry", () => {
  it("uses authoritative HTTPS sources with explicit review metadata", () => {
    expect(MEDICARE_COVERAGE_SOURCE_REGISTRY.length).toBeGreaterThanOrEqual(10);
    for (const source of MEDICARE_COVERAGE_SOURCE_REGISTRY) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.nextReview).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(source.nextReview).getTime()).toBeGreaterThan(new Date(source.lastVerified).getTime());
      expect(["Centers for Medicare & Medicaid Services", "Centers for Medicare & Medicaid Services / Office of the Federal Register", "Social Security Administration", "State Health Insurance Assistance Program Technical Assistance Center"]).toContain(source.agency);
    }
  });

  it("exposes expired review horizons instead of silently treating them as current", () => {
    expect(getStaleMedicareSources(new Date("2026-08-09T12:00:00Z"))).toEqual([]);
    expect(getStaleMedicareSources(new Date("2027-03-01T00:00:00Z"))).toHaveLength(MEDICARE_COVERAGE_SOURCE_REGISTRY.length);
  });
});
