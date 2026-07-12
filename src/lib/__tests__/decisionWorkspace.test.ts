import { describe, expect, it } from "vitest";
import { MAX_DECISION_RECORDS, parseDecisionWorkspace } from "../decisionWorkspace";

describe("decision workspace parser", () => {
  it("returns an empty workspace for malformed JSON", () => {
    expect(parseDecisionWorkspace("not-json").records).toEqual([]);
  });

  it("removes invalid routes and strips unsafe characters", () => {
    const parsed = parseDecisionWorkspace(JSON.stringify({ records: [{ id: "one", journeyId: "medical-bills", fixedCategory: "<b>Bill</b>", destinationRoute: "/insurance/medical-bill-review-toolkit", completedSteps: [], outstandingActions: [{ id: "a", category: "call", label: "<script>Call plan</script>", status: "open" }], verificationStatus: "in_progress" }] }));
    expect(parsed.records).toHaveLength(1);
    expect(parsed.records[0].fixedCategory).not.toContain("<");
    expect(parsed.records[0].outstandingActions[0].label).not.toContain("<");
  });

  it("caps stored records", () => {
    const records = Array.from({ length: MAX_DECISION_RECORDS + 10 }, (_, index) => ({ id: `r-${index}`, journeyId: "student-loans", fixedCategory: "Loans", destinationRoute: "/student-loans", completedSteps: [], outstandingActions: [], verificationStatus: "not_started" }));
    expect(parseDecisionWorkspace(JSON.stringify({ records })).records).toHaveLength(MAX_DECISION_RECORDS);
  });
});
