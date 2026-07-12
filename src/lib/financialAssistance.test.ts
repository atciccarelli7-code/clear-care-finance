import { describe, expect, it } from "vitest";
import {
  buildFinancialAssistanceScreening,
  DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS,
  type FinancialAssistanceAnswers,
} from "@/lib/financialAssistance";

const build = (overrides: Partial<FinancialAssistanceAnswers> = {}) =>
  buildFinancialAssistanceScreening({ ...DEFAULT_FINANCIAL_ASSISTANCE_ANSWERS, ...overrides });

describe("financial-assistance screening", () => {
  it("identifies a strong reason to apply without claiming eligibility", () => {
    const result = build({
      billSource: "hospital",
      insuranceStatus: "processed",
      affordability: "unaffordable",
      collectionStatus: "current",
      nonprofitStatus: "yes",
      policyStatus: "not_found",
      applicationStatus: "not_requested",
    });

    expect(result.level).toBe("strong_reason");
    expect(result.heading).toMatch(/strong reason/i);
    expect(result.doNow).toContain("Request the written financial-assistance policy, plain-language summary, application, and covered-provider list before paying in full.");
    expect(result.summary).not.toMatch(/eligible|approved|qualif(?:y|ies)/i);
  });

  it("escalates collection activity into immediate verification steps", () => {
    const result = build({
      billSource: "hospital",
      collectionStatus: "collections",
      affordability: "difficult",
    });

    expect(result.level).toBe("strong_reason");
    expect(result.doNow.join(" ")).toMatch(/collection activity during review/i);
    expect(result.cautions.join(" ")).toMatch(/do not ignore/i);
  });

  it("separates an outside clinician bill from the hospital policy", () => {
    const result = build({
      billSource: "outside_clinician",
      insuranceStatus: "pending",
      affordability: "manageable",
      collectionStatus: "current",
      nonprofitStatus: "no",
      policyStatus: "found",
      applicationStatus: "not_sure",
    });

    expect(result.level).toBe("verify_first");
    expect(result.cautions.join(" ")).toMatch(/separately billing clinician may not be covered/i);
    expect(result.doNow.join(" ")).toMatch(/claim was submitted and fully processed/i);
  });

  it("raises retroactive review questions for a recently paid bill", () => {
    const result = build({
      billSource: "hospital",
      insuranceStatus: "processed",
      affordability: "difficult",
      collectionStatus: "paid",
      policyStatus: "not_sure",
      applicationStatus: "not_requested",
    });

    expect(result.level).toBe("possible_reason");
    expect(result.verify.join(" ")).toMatch(/retroactive review/i);
  });

  it("keeps uncertainty explicit when every controlling fact is unknown", () => {
    const result = build();

    expect(result.level).toBe("verify_first");
    expect(result.heading).toMatch(/verify the bill source and insurance status/i);
    expect(result.reasons).toEqual([
      "Several controlling details are still unknown, so the safest first step is document verification.",
    ]);
  });

  it("never presents the result as an official determination", () => {
    const result = build({
      billSource: "hospital",
      insuranceStatus: "uninsured",
      affordability: "unaffordable",
      collectionStatus: "collections",
      nonprofitStatus: "yes",
      policyStatus: "not_found",
      applicationStatus: "not_requested",
    });

    const allText = [
      result.heading,
      result.summary,
      ...result.reasons,
      ...result.doNow,
      ...result.verify,
      ...result.documents,
      ...result.cautions,
    ].join(" ");

    expect(allText).not.toMatch(/you are eligible|you qualify|you are approved|guaranteed/i);
    expect(allText).toMatch(/does not determine eligibility/i);
  });
});
