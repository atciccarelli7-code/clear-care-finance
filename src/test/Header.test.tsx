import { fireEvent, render, screen, within } from "@testing-library/react";
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
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(within(mobileNav).getByRole("link", { name: "Start Here" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("contains keyboard focus inside the opened mobile menu", () => {
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    const firstLink = within(mobileNav).getByRole("link", { name: "Start Here" });
    const lastLink = within(mobileNav).getByRole("link", { name: "Monthly email" });

    lastLink.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(firstLink).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastLink).toHaveFocus();
  });

  it("exposes the active state for secondary mobile destinations", () => {
    renderHeader("/glossary");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });

    expect(within(mobileNav).getByRole("link", { name: "Glossary" })).toHaveAttribute("aria-current", "page");
  });

  it("includes Topic Guides as an active secondary destination", () => {
    renderHeader("/topics");
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    const topicLink = within(mobileNav).getByRole("link", { name: "Topic Guides" });

    expect(topicLink).toHaveAttribute("href", "/topics");
    expect(topicLink).toHaveAttribute("aria-current", "page");

    fireEvent.click(topicLink);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });
});
