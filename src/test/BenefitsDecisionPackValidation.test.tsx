import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HealthcareWorkerBenefitsDecisionPackPage from "@/pages/HealthcareWorkerBenefitsDecisionPackPage";
import { sanitizeBenefitsPackEvent } from "@/lib/benefitsPackAnalytics";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("Healthcare Worker Benefits Decision Pack validation", () => {
  it("renders a truthful $29 interest offer without purchase controls", () => {
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionPackPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: /healthcare worker benefits decision pack/i })).toBeInTheDocument();
    expect(screen.getAllByText(/no payment (is )?collected/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /join the \$29 paid-pilot list/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /buy|purchase|checkout|pay now/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /buy|purchase|checkout|pay now/i })).not.toBeInTheDocument();
  });

  it("covers the requested decision scope and representative previews", () => {
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionPackPage /></MemoryRouter>);
    expect(screen.getByText(/employer retirement contribution, match, eligibility, and vesting/i)).toBeInTheDocument();
    expect(screen.getByText(/student-loan and employer educational-assistance/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /compare the whole offer/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /stress-test health-plan costs/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /finish with a written decision/i })).toBeInTheDocument();
  });

  it("allowlists fixed privacy-safe funnel properties", () => {
    expect(sanitizeBenefitsPackEvent("benefits_pack_preview_opened", {
      surface: "preview",
      preview_id: "offer_compare",
      salary: "120000",
      employer_name: "Example Hospital",
      free_text: "sensitive",
    })).toEqual({
      name: "benefits_pack_preview_opened",
      properties: {
        event_category: "benefits_pack_validation",
        product_id: "healthcare_worker_benefits_decision_pack",
        surface: "preview",
        preview_id: "offer_compare",
      },
    });
    expect(sanitizeBenefitsPackEvent("purchase_confirmed", {})).toBeNull();
  });
});
