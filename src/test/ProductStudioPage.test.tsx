import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ProductStudioPage from "@/pages/ProductStudioPage";

describe("Product Studio", () => {
  it("separates the paid-pilot offer from the free live system", () => {
    render(<MemoryRouter><ProductStudioPage /></MemoryRouter>);

    expect(screen.getByRole("heading", { level: 1, name: /practical systems for healthcare money decisions/i })).toBeInTheDocument();
    expect(screen.getByText("Paid-pilot interest")).toBeInTheDocument();
    expect(screen.getByText("Free system live")).toBeInTheDocument();
    expect(screen.getByText(/joining records consented interest only/i)).toBeInTheDocument();
    expect(screen.getByText(/expanded commercial workbook remains private/i)).toBeInTheDocument();
  });

  it("links to the real product, free foundation, and organization offering", () => {
    render(<MemoryRouter><ProductStudioPage /></MemoryRouter>);

    expect(screen.getByRole("link", { name: /see the scope and representative previews/i })).toHaveAttribute(
      "href",
      "/products/healthcare-worker-benefits-decision-pack",
    );
    expect(screen.getByRole("link", { name: /open the free system/i })).toHaveAttribute(
      "href",
      "/insurance/medical-bill-review-toolkit",
    );
    expect(screen.getByRole("link", { name: /use the guided review flow/i })).toHaveAttribute(
      "href",
      "/tools/medical-bill-review-flow",
    );
    expect(screen.getByRole("link", { name: /review organization offerings/i })).toHaveAttribute(
      "href",
      "/for-organizations",
    );
  });

  it("does not render payment or checkout controls", () => {
    render(<MemoryRouter><ProductStudioPage /></MemoryRouter>);

    expect(screen.queryByRole("button", { name: /buy|purchase|checkout|pay now/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /buy|purchase|checkout|pay now/i })).not.toBeInTheDocument();
  });
});
