import { beforeEach, describe, expect, it } from "vitest";
import {
  BENEFITS_CHANGE_CANONICAL_PATH,
  BENEFITS_REVIEW_STORAGE_KEY,
  BENEFIT_TAXONOMY,
  buildBenefitsChangeReceipt,
  createBenefitsReceiptText,
  createBenefitsReview,
  createBenefitsReviewCalendar,
  deleteBenefitsReview,
  getBenefitPriority,
  loadBenefitsReview,
  parseBenefitsReview,
  saveBenefitsReview,
} from "@/lib/benefitsChangeDetector";

const byId = (id: string) => {
  const item = BENEFIT_TAXONOMY.find((benefit) => benefit.id === id);
  if (!item) throw new Error(`Missing benefit ${id}`);
  return item;
};

describe("Benefits Change Detector", () => {
  beforeEach(() => window.localStorage.clear());

  it("prioritizes high-impact cost, removed benefit, employer contribution, and retirement match changes", () => {
    expect(getBenefitPriority(byId("deductible"), "increased")).toBe("review_first");
    expect(getBenefitPriority(byId("life_insurance"), "removed")).toBe("review_first");
    expect(getBenefitPriority(byId("hsa_hra_contribution"), "decreased")).toBe("review_first");
    expect(getBenefitPriority(byId("employer_match"), "decreased")).toBe("review_first");
  });

  it("keeps network and formulary uncertainty qualified and incomplete areas visible", () => {
    expect(getBenefitPriority(byId("network"), "not_sure")).toBe("verify_before_enrolling");
    expect(getBenefitPriority(byId("formulary"), "changed_unclear")).toBe("verify_before_enrolling");
    expect(getBenefitPriority(byId("pto"), "not_reviewed")).toBe("still_incomplete");
  });

  it("generates a qualified Receipt with fixed questions, documents, and no universal recommendation", () => {
    const review = { ...createBenefitsReview(2027), selections: { deductible: "increased", employer_match: "decreased", network: "not_sure", pto: "not_reviewed" } as const };
    const receipt = buildBenefitsChangeReceipt(review, "2026-07-12");
    const text = createBenefitsReceiptText(receipt);
    expect(receipt.priorities.review_first.map((item) => item.id)).toEqual(["deductible", "employer_match"]);
    expect(receipt.unresolvedQuestions).toContain(byId("network").question);
    expect(receipt.incompleteAreas).toContain("PTO");
    expect(text).toContain("Employer documents");
    expect(text).not.toMatch(/you (must|should) elect|best plan|plan winner/i);
  });

  it("bounds and defensively parses local storage, resumes valid state, and deletes permanently", () => {
    expect(parseBenefitsReview("not json")).toBeNull();
    expect(parseBenefitsReview(JSON.stringify({ version: 99, reviewYear: 2027 }))).toBeNull();
    const saved = saveBenefitsReview({ ...createBenefitsReview(2027), selections: { deductible: "increased", unknown: "removed" } as never });
    expect(loadBenefitsReview()?.selections).toEqual({ deductible: "increased" });
    expect(JSON.parse(window.localStorage.getItem(BENEFITS_REVIEW_STORAGE_KEY) ?? "{}").selections).toEqual(saved.selections);
    deleteBenefitsReview();
    expect(window.localStorage.getItem(BENEFITS_REVIEW_STORAGE_KEY)).toBeNull();
  });

  it("creates a deterministic local calendar file with only the canonical public route", () => {
    const calendar = createBenefitsReviewCalendar("2027-10-15");
    expect(calendar).toContain("DTSTART;VALUE=DATE:20271015");
    expect(calendar).toContain("DTEND;VALUE=DATE:20271016");
    expect(calendar).toContain(`https://communityacquiredfinance.com${BENEFITS_CHANGE_CANONICAL_PATH}`);
    expect(calendar).not.toContain("?date=");
    expect(calendar).not.toContain("deductible");
  });
});
