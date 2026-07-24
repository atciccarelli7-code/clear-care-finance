import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import HealthcareWorkerBenefitsDecisionSystemPage from "@/pages/HealthcareWorkerBenefitsDecisionSystemPage";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

describe("Healthcare Worker Benefits Decision System public page", () => {
  it("positions the product as an interactive system and states availability honestly", () => {
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionSystemPage /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1, name: "Healthcare Worker Benefits Decision System" })).toBeInTheDocument();
    expect(screen.getByText("Interactive decision system")).toBeInTheDocument();
    expect(screen.getAllByText(/checkout.*not enabled|checkout disabled/i).length).toBeGreaterThan(0);
    expect(screen.getByText("$29 one time — target only")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /buy now/i })).not.toBeInTheDocument();
  });

  it("shows all required modules, privacy limits, and an early-access action", () => {
    render(<MemoryRouter><HealthcareWorkerBenefitsDecisionSystemPage /></MemoryRouter>);
    for (const title of [
      "Define the decision",
      "Compare compensation",
      "Value workplace benefits",
      "Stress-test health-plan exposure",
      "Evaluate retirement benefits",
      "Measure schedule and career tradeoffs",
      "Build the verification list",
      "Generate the decision brief",
    ]) expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    expect(screen.getByText(/Social Security numbers/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /join the early-access list/i })).toHaveAttribute("href", "#early-access");
  });
});
