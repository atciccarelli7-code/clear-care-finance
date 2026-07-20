import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DecisionConcierge } from "@/components/growth/DecisionConcierge";
import { loadJourneyContext } from "@/lib/journeyContext";

vi.mock("@/lib/growthAnalytics", () => ({ trackGrowthEvent: vi.fn(() => false) }));

describe("DecisionConcierge", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("uses fixed choices, keeps the original goal visible, and creates one destination handoff", () => {
    render(<MemoryRouter><DecisionConcierge entrySurface="home" /></MemoryRouter>);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /work, pay, or benefits decision/i }));
    fireEvent.click(screen.getByRole("button", { name: "Understand open-enrollment changes" }));

    expect(screen.getByText(/You started with: “Understand open-enrollment changes”/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "I need to act today" }));

    const heading = screen.getByRole("heading", { name: "Benefits Change Detector" });
    expect(heading).toHaveFocus();
    expect(screen.getByText(/What you will receive before leaving this experience/i)).toBeInTheDocument();

    const destination = screen.getByRole("link", { name: /Start and finish this experience/ });
    expect(destination).toHaveAttribute("href", "/tools/benefits-change-detector");
    fireEvent.click(destination);

    expect(loadJourneyContext()).toMatchObject({
      goalId: "open_enrollment_changes",
      destinationPath: "/tools/benefits-change-detector",
      source: "home",
    });
  });

  it("routes patient and caregiver help directly into the canonical hospital guide", () => {
    render(<MemoryRouter><DecisionConcierge entrySurface="home" /></MemoryRouter>);
    fireEvent.click(screen.getByRole("button", { name: /healthcare-cost, medical-bill, or discharge question/i }));
    fireEvent.click(screen.getByRole("button", { name: "Help a patient or family member" }));
    fireEvent.click(screen.getByRole("button", { name: "I am planning ahead" }));

    expect(screen.getByRole("heading", { name: "Hospital & Patient Guide" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Start and finish this experience/ })).toHaveAttribute(
      "href",
      "/patients-families/hospital-guide",
    );
    expect(screen.queryByRole("link", { name: /Patient and Caregiver Decision Hub/ })).not.toBeInTheDocument();
  });
});
