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

  it("allows only categorical organization intent without buyer or employer details", () => {
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

  it("measures the organization planner and resources without accepting selections or buyer context", () => {
    expect(sanitizeGrowthEvent("organization_program_plan_created", {
      entry_surface: "organization",
      action_id: "program_brief",
      organization_type: "health system",
      audience_answer: "patients and caregivers",
      buyer_email: "buyer@example.com",
      plan_name: "Example PPO",
    })).toEqual({
      name: "organization_program_plan_created",
      properties: { entry_surface: "organization", action_id: "program_brief" },
    });

    expect(sanitizeGrowthEvent("organization_resource_opened", {
      entry_surface: "organization",
      destination_id: "medicare_discharge",
      action_id: "module_1",
      participant_id: "123456",
      diagnosis: "stroke",
    })).toEqual({
      name: "organization_resource_opened",
      properties: { entry_surface: "organization", destination_id: "medicare_discharge", action_id: "module_1" },
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

  it("measures consolidation journeys while stripping values, answers, and identities", () => {
    expect(sanitizeGrowthEvent("bcc_receipt_generated", {
      entry_surface: "command_center",
      action_id: "receipt",
      annual_pay: "92000",
      package_label: "My hospital offer",
      plan_name: "Example PPO",
    })).toEqual({
      name: "bcc_receipt_generated",
      properties: { entry_surface: "command_center", action_id: "receipt" },
    });

    expect(sanitizeGrowthEvent("coverage_check_completed", {
      entry_surface: "medicare",
      action_id: "starting_point",
      income: "1450",
      household_size: "2",
      diagnosis: "esrd",
    })).toEqual({
      name: "coverage_check_completed",
      properties: { entry_surface: "medicare", action_id: "starting_point" },
    });

    expect(sanitizeGrowthEvent("organization_brief_completed", {
      entry_surface: "organization",
      action_id: "program_brief",
      organization_name: "Example Health System",
      buyer_email: "buyer@example.com",
      planning_answer: "launch in thirty days",
    })).toEqual({
      name: "organization_brief_completed",
      properties: { entry_surface: "organization", action_id: "program_brief" },
    });
  });
});
