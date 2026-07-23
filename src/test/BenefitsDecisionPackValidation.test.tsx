import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import HealthcareWorkerBenefitsDecisionPackPage from "@/pages/HealthcareWorkerBenefitsDecisionPackPage";
import { sanitizeBenefitsPackEvent } from "@/lib/benefitsPackAnalytics";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Healthcare Compensation & Benefits Decision Workspace sales page", () => {
  it("renders the complete product positioning while commerce remains default-deny", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ commerceEnabled: false, products: [] }) }));
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionPackPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: /healthcare compensation & benefits decision workspace/i })).toBeInTheDocument();
    expect(screen.getByText(/commerce default-deny/i)).toBeInTheDocument();
    expect(screen.getByText(/checkout remains closed until merchant approval/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /review secure access/i })).toHaveAttribute("href", "/premium/access");
  });

  it("explains the web-native utility, purchase model, and fourteen-module scope", () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: async () => ({ commerceEnabled: false, products: [] }) }));
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionPackPage /></MemoryRouter>);
    expect(screen.getByText(/secure customer account/i)).toBeInTheDocument();
    expect(screen.getAllByText(/no automatic renewal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/twelve months of (product )?updates/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/medical insurance/i)).toBeInTheDocument();
    expect(screen.getByText(/retirement contribution election/i)).toBeInTheDocument();
    expect(screen.getByText(/career fit & employment risk/i)).toBeInTheDocument();
    expect(screen.getByText(/integrated decision board/i)).toBeInTheDocument();
  });

  it("preserves the existing privacy-safe validation event allowlist", () => {
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
