import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ForOrganizationsPage from "@/pages/ForOrganizationsPage";

describe("ForOrganizationsPage", () => {
  it("states the institutional pause and routes visitors to active public resources", () => {
    render(<MemoryRouter><ForOrganizationsPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { level: 1, name: /Healthcare financial education without private records/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Institutional patient-education sales are paused/i })).toBeInTheDocument();
    expect(screen.getByText(/not currently offering a hospital pilot/i)).toBeInTheDocument();
    expect(screen.getByText(/No hospital, reviewer, clinician, insurer, attorney, employer, or regulator has approved/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Review public resources/i })).toHaveAttribute("href", "/start-here");
    expect(screen.getAllByRole("link", { name: /Open patient guides|Review the consumer guide library/i })[0]).toHaveAttribute("href", "/patients-families/hospital-guide");

    expect(screen.queryByRole("button", { name: /build program brief/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/request pilot|design partner|hospital licenses/i)).not.toBeInTheDocument();
  });
});
