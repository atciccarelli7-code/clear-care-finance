import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BenefitsLearningPath } from "@/components/shared/BenefitsLearningPath";

describe("BenefitsLearningPath", () => {
  it("connects the benefits hub to the flagship tool, plan math, and protection resources", () => {
    render(
      <MemoryRouter>
        <BenefitsLearningPath />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /move through benefits in decision order/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /benefits blueprint/i })).toHaveAttribute("href", "/tools/healthcare-worker-benefits-blueprint");
    expect(screen.getByRole("link", { name: /true cost calculator/i })).toHaveAttribute("href", "/tools/open-enrollment-true-cost-calculator");
    expect(screen.getByRole("link", { name: /disability insurance guide/i })).toHaveAttribute("href", "/articles/disability-insurance-healthcare-workers-open-enrollment");
    expect(screen.getByRole("link", { name: /beneficiary checklist/i })).toHaveAttribute("href", "/articles/beneficiaries-open-enrollment-checklist");
  });
});
