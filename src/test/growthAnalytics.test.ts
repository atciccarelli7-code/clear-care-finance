import { describe, expect, it } from "vitest";
import { sanitizeGrowthEvent } from "@/lib/growthAnalytics";

describe("privacy-safe growth analytics", () => {
  it("allows only fixed event names and categorical properties", () => {
    expect(sanitizeGrowthEvent("benefits_review_completed", {
      entry_surface: "detector",
      completion_band: "complete",
      employer_name: "Hospital Name",
      answers: "premium increased",
      reminder_date: "2027-10-01",
      query_string: "?state=removed",
    })).toEqual({ name: "benefits_review_completed", properties: { entry_surface: "detector", completion_band: "complete" } });
  });

  it("accepts categorical article and hub pathway events without URLs or user answers", () => {
    expect(sanitizeGrowthEvent("article_to_tool_clicked", {
      entry_surface: "article",
      problem_category: "cost_sharing_to_bill_review",
      destination_id: "eob_bill_match",
      handoff_id: "tool",
      source_url: "/articles/how-to-read-an-eob",
      medication: "insulin",
      claim_amount: "4500",
    })).toEqual({
      name: "article_to_tool_clicked",
      properties: {
        entry_surface: "article",
        problem_category: "cost_sharing_to_bill_review",
        destination_id: "eob_bill_match",
        handoff_id: "tool",
      },
    });

    expect(sanitizeGrowthEvent("hub_to_resource_clicked", {
      entry_surface: "hub",
      problem_category: "healthcare_worker_start",
      destination_id: "healthcare_money_map",
      handoff_id: "article",
    })).toEqual({
      name: "hub_to_resource_clicked",
      properties: {
        entry_surface: "hub",
        problem_category: "healthcare_worker_start",
        destination_id: "healthcare_money_map",
        handoff_id: "article",
      },
    });
  });

  it("rejects unknown events, arbitrary strings, dates, URLs, and answer-like values", () => {
    expect(sanitizeGrowthEvent("benefit_answer_saved", { entry_surface: "detector" })).toBeNull();
    expect(sanitizeGrowthEvent("benefits_review_started", {
      problem_category: "premium increased",
      destination_id: "/tools/benefits-change-detector?date=2027-01-01",
      handoff_id: "employer: hospital",
    })).toEqual({ name: "benefits_review_started", properties: {} });
  });

  it("allows only categorical organization-pilot intent without buyer or employer details", () => {
    expect(sanitizeGrowthEvent("organization_contact_selected", {
      entry_surface: "organization",
      cta_type: "pilot_inquiry",
      employer_name: "Example Health System",
      email: "buyer@example.com",
      notes: "Call next week",
    })).toEqual({
      name: "organization_contact_selected",
      properties: { entry_surface: "organization", cta_type: "pilot_inquiry" },
    });
  });

  it("supports flagship-tool funnels without accepting benefit, income, or health answers", () => {
    expect(sanitizeGrowthEvent("flagship_tool_step_completed", {
      tool_id: "benefits_blueprint",
      step_id: "emergency_fund",
      action_id: "financial_foundation",
      result_action: "copy",
      income: "87500",
      emergency_fund_answer: "under one month",
      disability_status: "yes",
      state: "NC",
    })).toEqual({
      name: "flagship_tool_step_completed",
      properties: {
        tool_id: "benefits_blueprint",
        step_id: "emergency_fund",
        action_id: "financial_foundation",
        result_action: "copy",
      },
    });

    expect(sanitizeGrowthEvent("flagship_tool_completed", {
      tool_id: "medicare_medicaid_eligibility",
      step_id: "results",
      household_size: "2",
      exact_income: "1350",
      condition: "esrd",
    })).toEqual({
      name: "flagship_tool_completed",
      properties: { tool_id: "medicare_medicaid_eligibility", step_id: "results" },
    });
  });
});
