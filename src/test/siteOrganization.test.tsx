import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NotFound from "@/pages/NotFound";
import QuickGuidesLibraryPage from "@/pages/QuickGuidesLibraryPage";
import StartHere from "@/pages/StartHere";
import Topics from "@/pages/Topics";

const renderPage = (page: React.ReactNode, path = "/") => render(
  <MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>,
);

describe("site organization and recovery", () => {
  it("makes the topic directory decision-first and routes Medicare to the complete hub", () => {
    renderPage(<Topics />, "/topics");

    expect(screen.getByRole("heading", { level: 1, name: /choose the financial or healthcare question/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /I need help choosing where to begin/i })).toHaveAttribute("href", "/start-here");
    expect(screen.getByRole("link", { name: /I need a calculator or checklist/i })).toHaveAttribute("href", "/tools");
    expect(screen.getByRole("heading", { name: /Build financial flexibility around the job/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Medicare & Medicaid/i })).toHaveAttribute("href", "/medicare-care-costs");
  });

  it("shows only live guide paths instead of publishing an unfinished build queue", () => {
    renderPage(<QuickGuidesLibraryPage />, "/guides");

    expect(screen.queryByText(/manuscript in build|next build queue|planned/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Build a Medicare enrollment timeline/i })).toHaveAttribute("href", "/medicare-care-costs/turning-65");
    expect(screen.getByRole("link", { name: /Review a confusing bill before paying/i })).toHaveAttribute("href", "/insurance/medical-bill-review-toolkit");
    expect(screen.getByRole("link", { name: /Build a prior-authorization next-step plan/i })).toHaveAttribute("href", "/tools/prior-authorization-next-step-guide");
  });

  it("starts the Start Here page with its primary Navigator heading instead of a competing intake", () => {
    renderPage(<StartHere />, "/start-here");

    expect(screen.getByRole("heading", { level: 1, name: /build a practical plan/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /what are you trying to figure out/i })).not.toBeInTheDocument();
  });

  it("offers useful recovery routes from an outdated link", () => {
    renderPage(<NotFound />, "/missing-page");
    const recovery = screen.getByRole("navigation", { name: "Page recovery options" });

    expect(within(recovery).getByRole("link", { name: /Start with the decision/i })).toHaveAttribute("href", "/start-here");
    expect(within(recovery).getByRole("link", { name: /Find a tool/i })).toHaveAttribute("href", "/tools");
    expect(within(recovery).getByRole("link", { name: /Browse topic guides/i })).toHaveAttribute("href", "/topics");
  });
});
