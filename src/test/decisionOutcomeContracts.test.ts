import { describe, expect, it } from "vitest";
import { sanitizeEventProperties } from "@/lib/analytics";
import {
  DECISION_OUTCOME_EVENT_NAMES,
  sanitizeDecisionOutcomeEvent,
} from "@/lib/decisionOutcomeAnalytics";
import {
  defineDecisionProduct,
  validateDecisionProductDefinition,
} from "@/lib/decisionOutcome";
import { privateStudentLoanDecisionProduct } from "@/data/privateStudentLoanDecisionProduct";

describe("decision product contract", () => {
  it("validates the complete private student-loan declaration", () => {
    expect(validateDecisionProductDefinition(privateStudentLoanDecisionProduct)).toEqual([]);
    expect(privateStudentLoanDecisionProduct.analyticsEvents).toEqual(DECISION_OUTCOME_EVENT_NAMES);
  });

  it("can describe a future tool without calculator-specific JSX", () => {
    const future = defineDecisionProduct<"review" | "act">({
      decisionIdentifier: "future_tool_fixture",
      decisionBeingCompleted: "Choose a next verification action.",
      eligibleAudience: ["Test audience"],
      resultType: "action-plan",
      recommendationStates: [{ id: "review", label: "Review" }, { id: "act", label: "Act" }],
      verificationRequirements: [{ id: "document", label: "Review the source document." }],
      requiredCautions: [{ id: "limit", label: "This is educational." }],
      officialResources: [{ id: "official", label: "Official resource", url: "https://example.gov/resource", publisher: "Example agency", purpose: "Verify the controlling record." }],
      portableOutputCapabilities: { copy: true, print: true, localSave: false, restart: true },
      myPlanSupport: { enabled: false },
      analyticsEvents: ["decision_valid_result_reached"],
      monetizationEligibility: { allowed: false, requiresVerifiedConfiguration: true, eligibleStateIds: [] },
      disclosureRequirements: [],
      noncommercialAlternatives: [{ id: "neutral", label: "Neutral resource", url: "https://example.gov/neutral", publisher: "Example agency", purpose: "Continue independently." }],
      sourceFreshnessRequirements: [{ sourceId: "fixture", reviewedOn: "2026-07-31", reviewBy: "2027-01-31" }],
      releaseConstraints: ["Fail closed."],
    });
    expect(validateDecisionProductDefinition(future)).toEqual([]);
  });

  it("rejects missing neutral, freshness, and verified-config controls", () => {
    const invalid = {
      ...privateStudentLoanDecisionProduct,
      noncommercialAlternatives: [],
      sourceFreshnessRequirements: [],
      monetizationEligibility: {
        ...privateStudentLoanDecisionProduct.monetizationEligibility,
        requiresVerifiedConfiguration: false,
      },
    };
    expect(validateDecisionProductDefinition(invalid)).toEqual(expect.arrayContaining([
      "a noncommercial alternative is required",
      "source freshness requirements are required",
      "monetization must require verified configuration",
    ]));
  });
});

describe("decision outcome analytics", () => {
  it("accepts only a known event with exact categorical properties", () => {
    expect(sanitizeDecisionOutcomeEvent("decision_portable_output_used", {
      decision_id: "private_student_loan_payoff",
      action_id: "copy",
    })).toEqual({
      name: "decision_portable_output_used",
      properties: { decision_id: "private_student_loan_payoff", action_id: "copy" },
    });
  });

  it.each([
    ["unknown_event", { decision_id: "private_student_loan_payoff" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", principal: 45_000 }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", apr: 6.5 }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", payment: 500 }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", fee: 500 }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", loan_type: "private" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", recommendation_state: "accelerate" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", lender_name: "Example" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", quote_id: "123" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", account_id: "123" }],
    ["decision_valid_result_reached", { decision_id: "private_student_loan_payoff", free_text: "hello" }],
    ["decision_neutral_resource_opened", { decision_id: "private_student_loan_payoff", resource_id: "https://example.gov/path?balance=1" }],
  ])("rejects unknown or prohibited event data %#", (name, properties) => {
    expect(sanitizeDecisionOutcomeEvent(name as string, properties as Record<string, unknown>)).toBeNull();
  });

  it("hardens the general sanitizer against financial and lender keys", () => {
    const sanitized = sanitizeEventProperties({
      safe_id: "fixed_category",
      principal: 45_000,
      apr: 6.5,
      monthly_payment: 500,
      lender_name: "User lender",
      quote_id: "quote-1",
      account_id: "acct-1",
      destination_url: "https://example.com/path?balance=45000#quote",
    });
    expect(sanitized).toEqual({ safe_id: "fixed_category", destination_url: "https://example.com/path" });
  });
});
