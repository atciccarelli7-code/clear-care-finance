import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const report = readFileSync("docs/operations/precommerce-demand-report.sql", "utf8");
const operatingGuide = readFileSync("docs/strategy/2026-08-11-precommerce-demand-validation.md", "utf8");

describe("pre-commerce operating report", () => {
  it("always emits fixed observed, verification, and unknown rows with no-data language", () => {
    expect(report).toContain("'unknown_legacy'");
    expect(report).toContain("'observed'");
    expect(report).toContain("'release_verification'");
    expect(report).toContain("then 'No data'");
  });

  it("reports distinct denominators and never selects commitment email", () => {
    expect(report).toContain("count(distinct session_id)");
    expect(report).toContain("count(distinct email_hash)");
    expect(report).toContain("offer_engagements::numeric / nullif(qualified_offer_views, 0)");
    expect(report).toContain("valid_price_qualified_commitments::numeric / nullif(qualified_offer_views, 0)");
    expect(report).toContain("valid_price_qualified_commitments::numeric / nullif(commitment_starts, 0)");
    expect(report).not.toMatch(/select[\s\S]{0,120}\bemail\b/i);
  });

  it("encodes the economic trigger and poor-demand stop rule", () => {
    expect(operatingGuide).toContain("at least 25 genuine observed qualified v2 offer-view sessions");
    expect(operatingGuide).toContain("at least 3 distinct active, non-test, non-founder, non-friend/family commitments");
    expect(operatingGuide).toContain("at least 10%");
    expect(operatingGuide).toContain("At 50 qualified views with zero genuine commitments, do not turn commerce on");
  });
});
