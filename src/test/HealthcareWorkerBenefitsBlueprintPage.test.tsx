import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import HealthcareWorkerBenefitsBlueprintPage from "@/pages/HealthcareWorkerBenefitsBlueprintPage";

const clickNext = () => fireEvent.click(screen.getByRole("button", { name: /^next$/i }));

describe("HealthcareWorkerBenefitsBlueprintPage", () => {
  it("uses semantic controls and generates a result after all 12 questions", () => {
    render(
      <MemoryRouter>
        <HealthcareWorkerBenefitsBlueprintPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: /current age/i }), { target: { value: "30" } });
    clickNext();
    fireEvent.change(screen.getByRole("spinbutton", { name: /target retirement age/i }), { target: { value: "65" } });
    clickNext();

    const choices = [
      /\$75,000-\$99,999 Roughly/i,
      /balance today and retirement/i,
      /Moderate Some market swings/i,
      /a balance of both/i,
      /Moderate Several visits/i,
      /Yes This should be verified/i,
      /helpful, but negotiable/i,
      /Maybe I want to see/i,
      /employee only/i,
      /Yes The blueprint will prioritize/i,
    ];

    choices.forEach((choice, index) => {
      const button = screen.getByRole("button", { name: choice });
      expect(button).toHaveAttribute("type", "button");
      fireEvent.click(button);
      if (index < choices.length - 1) clickNext();
    });

    fireEvent.click(screen.getByRole("button", { name: /create my blueprint/i }));

    expect(screen.getByRole("heading", { name: /your benefits blueprint/i })).toBeInTheDocument();
    expect(screen.getByText("6%-10%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy blueprint/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /print blueprint/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /review answers/i })).toBeInTheDocument();
  });

  it("keeps next disabled until the current question is answered", () => {
    render(
      <MemoryRouter>
        <HealthcareWorkerBenefitsBlueprintPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /^next$/i })).toBeDisabled();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow");
  });
});
