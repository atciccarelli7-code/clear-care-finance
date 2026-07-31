import { describe, expect, it } from "vitest";
import { resolveStudentLoanCommercialHandoff, type StudentLoanCommercialPartnerConfig } from "@/lib/studentLoanCommercialHandoff";

const validConfig: StudentLoanCommercialPartnerConfig = {
  enabled: true,
  partnerId: "verified_partner",
  partnerName: "Verified Partner",
  url: "https://partner.example.com/compare",
  compensationDisclosure: "CAF may receive compensation if you use this partner link.",
  relationshipVerified: true,
  globalDisclosureConfirmed: true,
  reviewedOn: "2026-07-01",
  expiresOn: "2026-12-31",
};

const context = {
  loanType: "private" as const,
  recommendationState: "seek_compare_refinance_quotes" as const,
  now: new Date("2026-07-31T12:00:00Z"),
};

describe("student-loan commercial handoff", () => {
  it("activates only a complete, current, verified configuration", () => {
    expect(resolveStudentLoanCommercialHandoff(validConfig, context)).toMatchObject({ active: true, partnerId: "verified_partner" });
  });

  it.each([
    null,
    { ...validConfig, enabled: false },
    { ...validConfig, relationshipVerified: false },
    { ...validConfig, globalDisclosureConfirmed: false },
    { ...validConfig, partnerName: "" },
    { ...validConfig, compensationDisclosure: "short" },
    { ...validConfig, url: "http://partner.example.com/compare" },
    { ...validConfig, url: "https://partner.example.com/compare?balance=45000" },
    { ...validConfig, expiresOn: "2026-07-01" },
  ])("fails closed for absent or incomplete configuration %#", (config) => {
    expect(resolveStudentLoanCommercialHandoff(config, context)).toBeNull();
  });

  it.each(["federal", "mixed", "uncertain"] as const)("blocks %s loans", (loanType) => {
    expect(resolveStudentLoanCommercialHandoff(validConfig, { ...context, loanType })).toBeNull();
  });

  it.each([
    "continue_current_plan",
    "accelerate_repayment",
    "lower_payment_higher_total_cost",
    "do_not_refinance_based_on_quote",
    "verify_loan_type_first",
    "insufficient_information",
  ] as const)("blocks recommendation state %s", (recommendationState) => {
    expect(resolveStudentLoanCommercialHandoff(validConfig, { ...context, recommendationState })).toBeNull();
  });
});
