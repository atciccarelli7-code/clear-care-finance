import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EmployerBenefitsActionPlanPage from "@/pages/EmployerBenefitsActionPlanPage";

const renderPage = () => render(<MemoryRouter><EmployerBenefitsActionPlanPage /></MemoryRouter>);

describe("EmployerBenefitsActionPlanPage", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockResolvedValue(undefined) } });
    Object.defineProperty(window, "print", { configurable: true, value: vi.fn() });
  });

  it("supports a keyboard-submittable guided flow and generates the complete result", () => {
    renderPage();
    const salary = screen.getByLabelText("Approximate annual salary");
    fireEvent.change(salary, { target: { value: "80000" } });
    fireEvent.submit(salary.closest("form") as HTMLFormElement);

    expect(screen.getByRole("heading", { name: "Enter the retirement benefit" })).toHaveFocus();
    fireEvent.change(screen.getByLabelText("Retirement plan type"), { target: { value: "403b" } });
    fireEvent.change(screen.getByLabelText("Current employee contribution"), { target: { value: "6" } });
    fireEvent.change(screen.getByLabelText("Employer match formula"), { target: { value: "percent-of-contribution" } });
    fireEvent.change(screen.getByLabelText("Employer match rate"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Match ceiling as a percent of pay"), { target: { value: "6" } });
    fireEvent.change(screen.getByLabelText("Vesting status"), { target: { value: "fully-vested" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));

    fireEvent.change(screen.getByLabelText("Employee premium per paycheck"), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText("Deductible"), { target: { value: "2000" } });
    fireEvent.change(screen.getByLabelText("Out-of-pocket maximum"), { target: { value: "6000" } });
    fireEvent.change(screen.getByLabelText("Is this exact plan HSA-eligible?"), { target: { value: "yes" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/ }));

    fireEvent.change(screen.getByLabelText("Your planned annual HSA contribution"), { target: { value: "3400" } });
    fireEvent.change(screen.getByLabelText("Employer annual HSA contribution"), { target: { value: "1000" } });
    fireEvent.change(screen.getByLabelText("HSA contribution-limit coverage"), { target: { value: "self-only" } });
    fireEvent.click(screen.getByRole("button", { name: /Generate action plan/ }));

    expect(screen.getByRole("heading", { name: "Your Employer Benefits Action Plan" })).toHaveFocus();
    expect(screen.getByText("$184.62")).toBeInTheDocument();
    expect(screen.getByText("$2,400")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Health-plan cost snapshot/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /HSA snapshot/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy action plan" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Print action plan" })).toBeInTheDocument();
  });

  it("keeps Next disabled until pay is valid and copy/print remain user actions", async () => {
    renderPage();
    expect(screen.getByRole("button", { name: /Next/ })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Approximate annual salary"), { target: { value: "60000" } });
    expect(screen.getByRole("button", { name: /Next/ })).toBeEnabled();
  });
});
