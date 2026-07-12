import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";

const renderHeader = (path = "/") => render(
  <MemoryRouter initialEntries={[path]}>
    <Header />
  </MemoryRouter>,
);

describe("Header mobile navigation", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("moves focus into the opened menu and restores it after Escape", () => {
    renderHeader();
    const menuButton = screen.getByRole("button", { name: "Open menu" });

    fireEvent.click(menuButton);

    expect(screen.getByRole("link", { name: "Start Here" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("exposes the active state for secondary mobile destinations", () => {
    renderHeader("/glossary");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Glossary" })).toHaveAttribute("aria-current", "page");
  });
});
