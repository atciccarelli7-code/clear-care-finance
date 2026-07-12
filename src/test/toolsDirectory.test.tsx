import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Tools from "@/pages/Tools";
import { roadmapTools } from "@/data/roadmapTools";
import { getToolByLegacyAnchor, getToolBySlug, getToolHref, tools } from "@/data/tools";

const completeTools = [...tools, ...roadmapTools];

describe("tools directory", () => {
  afterEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("keeps slugs and legacy anchors unique and every core tool reachable", () => {
    expect(new Set(completeTools.map((tool) => tool.slug)).size).toBe(completeTools.length);

    const legacyAnchors = tools.flatMap((tool) => (tool.legacyAnchorId ? [tool.legacyAnchorId] : []));
    expect(new Set(legacyAnchors).size).toBe(legacyAnchors.length);

    for (const tool of tools) {
      expect(getToolBySlug(tool.slug)).toBe(tool);
      expect(getToolHref(tool)).toMatch(/^\/tools\//);
      if (tool.legacyAnchorId) expect(getToolByLegacyAnchor(tool.legacyAnchorId)).toBe(tool);
    }
    for (const tool of roadmapTools) {
      expect(getToolHref(tool)).toBe(`/tools/${tool.slug}`);
    }
  });

  it("filters the compact directory without rendering every calculator", () => {
    render(
      <MemoryRouter>
        <Tools />
      </MemoryRouter>,
    );

    expect(screen.getByText(`Showing ${completeTools.length} of ${completeTools.length} tools`)).toBeInTheDocument();
    expect(screen.queryByLabelText(/hourly pay/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: /search tools/i }), { target: { value: "PSLF" } });
    expect(screen.getByRole("heading", { name: "PSLF Progress Estimator" })).toBeInTheDocument();
    expect(screen.getByText(`Showing 1 of ${completeTools.length} tools`)).toBeInTheDocument();
  });

  it("preserves a legacy hash by highlighting its directory card", () => {
    window.history.replaceState(null, "", "/tools#403b");
    render(
      <MemoryRouter>
        <Tools />
      </MemoryRouter>,
    );

    expect(document.getElementById("tool-403b-paycheck-calculator")).toHaveClass("ring-2");
  });
});
