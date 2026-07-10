import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MedicareMedicaidEligibilityCheckPage, { buildEligibilitySteps } from "@/pages/MedicareMedicaidEligibilityCheckPage";
import { EMPTY_ELIGIBILITY_ANSWERS } from "@/lib/medicareMedicaidEligibility";

const renderPage = () => render(
  <MemoryRouter>
    <MedicareMedicaidEligibilityCheckPage />
  </MemoryRouter>,
);

describe("MedicareMedicaidEligibilityCheckPage accessibility", () => {
  it("exposes progress and moves focus to each question heading", () => {
    renderPage();

    const progress = screen.getByRole("progressbar", { name: /eligibility check progress/i });
    expect(progress).toHaveAttribute("aria-valuemin", "0");
    expect(progress).toHaveAttribute("aria-valuemax", "100");

    const stateHeading = screen.getByRole("heading", { name: /what state does the person live in/i });
    expect(stateHeading).toHaveFocus();

    const continueButton = screen.getByRole("button", { name: /continue/i });
    expect(continueButton).toBeDisabled();

    fireEvent.change(screen.getByRole("combobox", { name: /state of residence/i }), { target: { value: "NC" } });
    expect(continueButton).toBeEnabled();
    fireEvent.click(continueButton);

    expect(screen.getByRole("heading", { name: /how old is the person/i })).toHaveFocus();
  });

  it("uses native labeled controls and supports Back and Start Over", () => {
    renderPage();

    fireEvent.change(screen.getByRole("combobox", { name: /state of residence/i }), { target: { value: "NC" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    const ageInput = screen.getByLabelText(/age in years/i);
    ageInput.focus();
    fireEvent.change(ageInput, { target: { value: "65" } });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    const medicareHeading = screen.getByRole("heading", { name: /already enrolled in medicare/i });
    expect(medicareHeading).toHaveFocus();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Yes" })).toHaveAccessibleName("Yes");

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByRole("heading", { name: /how old is the person/i })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(screen.getByRole("heading", { name: /what state does the person live in/i })).toHaveFocus();
    expect(screen.getByRole("combobox", { name: /state of residence/i })).toHaveValue("");
  });

  it("adds conditional SSDI, pregnancy, and MSP questions only when relevant", () => {
    const base = { ...EMPTY_ELIGIBILITY_ANSWERS, age: 70, ssdi: "no" as const, dualHelp: "no" as const };
    expect(buildEligibilitySteps(base)).not.toContain("ssdi-months");
    expect(buildEligibilitySteps(base)).not.toContain("pregnancy");
    expect(buildEligibilitySteps(base)).not.toContain("msp-unit");

    const conditional = {
      ...base,
      age: 40,
      ssdi: "yes" as const,
      dualHelp: "yes" as const,
      alreadyMedicare: "yes" as const,
    };
    expect(buildEligibilitySteps(conditional)).toContain("ssdi-months");
    expect(buildEligibilitySteps(conditional)).toContain("pregnancy");
    expect(buildEligibilitySteps(conditional)).toContain("msp-unit");
  });
});
