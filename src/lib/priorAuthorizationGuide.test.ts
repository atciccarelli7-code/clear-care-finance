import { describe, expect, it } from "vitest";
import { buildPriorAuthorizationPlan, type PriorAuthorizationAnswers } from "@/lib/priorAuthorizationGuide";

const base: PriorAuthorizationAnswers = {
  coverageType: "employer-commercial",
  requestType: "procedure-surgery",
  status: "pending",
  urgency: "routine",
  writtenNotice: "no",
  denialReason: "not-stated",
  providerAction: "not-sure",
  serviceTiming: "prospective",
  pendingDuration: "three-to-seven-days",
};

describe("prior authorization guide", () => {
  it("routes an unsubmitted request to the ordering provider", () => {
    const result = buildPriorAuthorizationPlan({ ...base, status: "not-submitted" });
    expect(result.pathway).toBe("submission-not-started");
    expect(result.firstAction).toContain("ordering provider");
  });

  it("keeps a routine pending request qualified rather than declaring a violation", () => {
    const result = buildPriorAuthorizationPlan(base);
    expect(result.pathway).toBe("pending");
    expect(result.why.join(" ")).toContain("one universal deadline");
    expect(result.why.join(" ")).not.toMatch(/violat(ed|ion)/i);
  });

  it("flags a potentially late non-drug Medicaid request without making a legal conclusion", () => {
    const result = buildPriorAuthorizationPlan({
      ...base,
      coverageType: "medicaid",
      pendingDuration: "over-seven-days",
    });
    expect(result.pathway).toBe("pending-possibly-late");
    expect(result.stageTitle).toContain("potentially applicable");
    expect(result.why.join(" ")).toContain("cannot be treated as a legal violation");
  });

  it("routes missing information to a documentation gap", () => {
    const result = buildPriorAuthorizationPlan({
      ...base,
      status: "more-information",
      denialReason: "missing-documentation",
    });
    expect(result.pathway).toBe("more-information");
    expect(result.firstAction).toContain("exact item is missing");
    expect(result.providerQuestions.join(" ")).toContain("What exact record is missing");
  });

  it("does not treat a verbal statement as a formal denial", () => {
    const result = buildPriorAuthorizationPlan({ ...base, status: "verbal-only" });
    expect(result.pathway).toBe("verbal-only");
    expect(result.firstAction).toContain("written decision");
  });

  it("creates a Medicare Advantage appeal pathway from a written denial", () => {
    const result = buildPriorAuthorizationPlan({
      ...base,
      coverageType: "medicare-advantage",
      status: "written-denial",
      writtenNotice: "yes",
      denialReason: "medical-necessity",
    });
    expect(result.pathway).toBe("formal-denial");
    expect(result.urgentOrAppeal.join(" ")).toContain("65 days");
    expect(result.providerQuestions.join(" ")).toContain("coverage criteria");
  });

  it("creates an expedited-review question when delay could seriously jeopardize health", () => {
    const result = buildPriorAuthorizationPlan({
      ...base,
      coverageType: "medicare-advantage",
      urgency: "serious-jeopardy",
      status: "written-denial",
      writtenNotice: "yes",
    });
    expect(result.pathway).toBe("urgent-review");
    expect(result.firstAction).toContain("treating clinician");
    expect(result.urgentOrAppeal.join(" ")).toContain("72-hour");
  });

  it("keeps drug requests separate from CMS non-drug deadlines", () => {
    const result = buildPriorAuthorizationPlan({
      ...base,
      coverageType: "medicare-advantage",
      requestType: "medication",
      denialReason: "drug-rule",
    });
    expect(result.pathway).toBe("drug-specific");
    expect(result.why.join(" ")).toContain("exclude drug prior authorization");
    expect(result.firstAction).toContain("pharmacy benefit");
  });

  it("routes unknown coverage to insurance-card identification", () => {
    const result = buildPriorAuthorizationPlan({ ...base, coverageType: "not-sure" });
    expect(result.pathway).toBe("coverage-uncertain");
    expect(result.firstAction).toContain("insurance card");
  });

  it("recognizes care already received as a claim or retroactive pathway", () => {
    const result = buildPriorAuthorizationPlan({ ...base, serviceTiming: "already-received" });
    expect(result.why.join(" ")).toContain("retroactive authorization");
    expect(result.documents.join(" ")).toContain("EOB");
  });

  it("does not invent a result deadline when answers are incomplete", () => {
    const result = buildPriorAuthorizationPlan({});
    expect(result.pathway).toBe("coverage-uncertain");
    expect(result.why.join(" ")).not.toMatch(/must decide within (72 hours|seven calendar days)/i);
    expect(result.disclaimer).toContain("does not determine coverage");
  });
});
