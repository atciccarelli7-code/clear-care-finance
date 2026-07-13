import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ForOrganizationsPage from "@/pages/ForOrganizationsPage";

describe("ForOrganizationsPage", () => {
  it("offers only a bounded educational pilot with real product demos and the approved contact path", () => {
    render(<MemoryRouter><ForOrganizationsPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: /small educational pilot/i })).toBeInTheDocument();
    expect(screen.getByText(/not a benefits-administration platform/i)).toBeInTheDocument();
    expect(screen.getByText(/No employee accounts, eligibility determinations/i)).toBeInTheDocument();
    expect(screen.getByText(/No promised savings, participation rate, ROI/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Discuss a pilot|Contact CAF/i })[0]).toHaveAttribute("href", "/contact");
    expect(screen.getAllByRole("link", { name: /Benefits Change Detector|employee experience/i })[0]).toHaveAttribute("href", "/tools/benefits-change-detector");

    fireEvent.click(screen.getByText(/What must be proven before CAF charges/i));
    expect(screen.getByText(/legal, privacy, security, accessibility/i)).toBeInTheDocument();
    expect(screen.queryByText(/HIPAA compliant|guaranteed savings|proven ROI/i)).not.toBeInTheDocument();
  });
});
