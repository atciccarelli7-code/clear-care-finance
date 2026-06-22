import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { CalcEmergencyFund } from "@/components/calculators/EmergencyFund";

afterEach(cleanup);

describe("calculator interactions", () => {
  it("associates labels, validates negative numbers, updates results, and resets", () => {
    const { container } = render(
      <MemoryRouter>
        <CalcEmergencyFund />
      </MemoryRouter>,
    );

    const rentInput = screen.getByLabelText("Rent or mortgage");
    expect(rentInput).toHaveValue(1400);
    expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument();

    fireEvent.change(rentInput, { target: { value: "2000" } });
    expect(screen.getByText("$3,800")).toBeInTheDocument();

    fireEvent.change(rentInput, { target: { value: "-1" } });
    expect(rentInput).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Use 0 or more.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /start over/i }));
    expect(rentInput).toHaveValue(1400);
  });
});
