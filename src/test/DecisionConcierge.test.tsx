import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { DecisionConcierge } from "@/components/growth/DecisionConcierge";

vi.mock("@/lib/growthAnalytics", () => ({ trackGrowthEvent: vi.fn(() => false) }));

describe("DecisionConcierge", () => {
  it("uses only fixed-choice buttons and moves focus to the result", () => {
    render(<MemoryRouter><DecisionConcierge entrySurface="home" /></MemoryRouter>);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Work, pay, or benefits/i }));
    const choice = screen.getByRole("button", { name: "Understand open-enrollment changes" });
    choice.focus();
    fireEvent.keyDown(choice, { key: "Enter" });
    fireEvent.click(choice);
    expect(screen.getByRole("button", { name: "I need to act today" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "I need to act today" }));
    const heading = screen.getByRole("heading", { name: "Benefits Change Detector" });
    expect(heading).toHaveFocus();
    expect(screen.getByRole("link", { name: /Open this journey/ })).toHaveAttribute("href", "/tools/benefits-change-detector");
  });
});
