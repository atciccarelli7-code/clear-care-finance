import { describe, expect, it } from "vitest";
import {
  benefitsDecisionDocuments,
  benefitsDecisionJourneySteps,
  benefitsDecisionSituationItems,
  benefitsDecisionSystemBoundary,
} from "@/data/benefitsDecisionSystemJourney";

describe("guided Benefits Decision System journey", () => {
  it("keeps one ordered path from preparation to a decision brief", () => {
    expect(benefitsDecisionJourneySteps.map((step) => step.number)).toEqual([1, 2, 3, 4, 5]);
    expect(benefitsDecisionJourneySteps.map((step) => step.id)).toEqual([
      "prepare",
      "sources",
      "confirm",
      "situation",
      "brief",
    ]);
    expect(new Set(benefitsDecisionJourneySteps.map((step) => step.id)).size).toBe(benefitsDecisionJourneySteps.length);
    expect(benefitsDecisionJourneySteps.at(-1)?.title).toMatch(/Review the decision/i);
  });

  it("requires the core source categories needed for a consequential comparison", () => {
    const requiredIds = benefitsDecisionDocuments.filter((document) => document.required).map((document) => document.id);
    expect(requiredIds).toEqual([
      "benefits-guide",
      "medical-plan-materials",
      "retirement-materials",
    ]);
    expect(benefitsDecisionDocuments.every((document) => document.description.length >= 40)).toBe(true);
  });

  it("collects decision-changing context without requiring diagnoses or detailed medical history", () => {
    expect(benefitsDecisionSituationItems.map((item) => item.id)).toEqual([
      "coverage-household",
      "healthcare-use-pattern",
      "verification-needs",
      "budget-risk",
      "decision-priorities",
      "employment-horizon",
    ]);
    const copy = benefitsDecisionSituationItems.map((item) => `${item.title} ${item.description}`).join(" ").toLowerCase();
    expect(copy).toContain("without requiring diagnoses");
    expect(copy).toContain("without collecting their names");
  });

  it("fails closed on private document upload until the security controls are certified", () => {
    expect(benefitsDecisionSystemBoundary.uploadGate).toContain("not activated");
    expect(benefitsDecisionSystemBoundary.uploadGate).toContain("access control");
    expect(benefitsDecisionSystemBoundary.uploadGate).toContain("malware scanning");
    expect(benefitsDecisionSystemBoundary.uploadGate).toContain("retention");
    expect(benefitsDecisionSystemBoundary.uploadGate).toContain("deletion");
  });

  it("explicitly rejects sensitive identifiers and unauthorized documents", () => {
    expect(benefitsDecisionSystemBoundary.prohibitedData).toEqual(expect.arrayContaining([
      "Social Security numbers",
      "financial account or card numbers",
      "insurance member IDs",
      "account credentials",
      "claims or EOBs",
      "medical records or diagnoses",
      "documents the user is not authorized to possess",
    ]));
  });
});
