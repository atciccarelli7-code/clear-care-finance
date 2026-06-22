import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { CALCULATORS } from "@/data/calculators";
import CalculatorPage from "@/pages/CalculatorPage";
import Tools from "@/pages/Tools";

afterEach(cleanup);

describe("calculator routes", () => {
  it("lists every calculator with a dedicated route and preserves legacy anchors", () => {
    const { container } = render(<MemoryRouter><Tools /></MemoryRouter>);

    expect(screen.getAllByRole("link", { name: /open calculator/i })).toHaveLength(CALCULATORS.length);
    for (const calculator of CALCULATORS) {
      expect(container.querySelector(`[id="${calculator.legacyAnchor}"]`)).toBeInTheDocument();
    }
  });

  it.each(CALCULATORS)("renders $slug with its page title", (calculator) => {
    render(
      <MemoryRouter initialEntries={[`/tools/${calculator.slug}`]}>
        <Routes>
          <Route path="/tools/:calculatorSlug" element={<CalculatorPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { level: 1, name: calculator.title })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start over/i })).toBeInTheDocument();
  });
});
