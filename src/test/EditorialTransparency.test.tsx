import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { EditorialTransparency } from "@/components/shared/EditorialTransparency";

describe("EditorialTransparency", () => {
  it("shows the author credential boundary and never implies independent review by default", () => {
    render(<MemoryRouter><EditorialTransparency /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /Andrew Ciccarelli/i })).toHaveAttribute("href", "/about");
    expect(screen.getByText(/not financial-planner, attorney, tax-preparer/i)).toBeInTheDocument();
    expect(screen.getByText(/no separate credentialed professional reviewer is claimed/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /How sources and corrections work/i })).toHaveAttribute("href", "/methodology");
  });
});
