import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MedicalBillWorkbookProductPage from "@/pages/MedicalBillWorkbookProductPage";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));
vi.mock("@/components/shared/NewsletterSignup", () => ({
  NewsletterSignup: ({ emailType, title }: { emailType?: string; title?: string }) => (
    <div data-testid="newsletter-signup" data-email-type={emailType}>{title}</div>
  ),
}));

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/products/expanded-medical-bill-response-workbook"]}>
      <MedicalBillWorkbookProductPage />
    </MemoryRouter>,
  );

describe("Expanded Medical Bill Response Workbook product page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "open", { configurable: true, value: vi.fn() });
    Object.defineProperty(window, "print", { configurable: true, value: vi.fn() });
  });

  it("keeps essential guidance free and exposes an honest interest-only state", () => {
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: /expanded medical bill response workbook/i })).toBeInTheDocument();
    expect(screen.getByText(/the free system stays complete/i)).toBeInTheDocument();
    expect(screen.getByText(/essential rights and official-source links/i)).toBeInTheDocument();
    expect(screen.getByText(/checkout is not active/i)).toBeInTheDocument();
    expect(screen.getByTestId("newsletter-signup")).toHaveAttribute("data-email-type", "medical-bill-product-interest");
    expect(screen.queryByText(/save thousands|guaranteed savings|limited time/i)).not.toBeInTheDocument();
  });

  it("opens the free pack and records the conversion without exposing the paid master", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /keep using the free pack/i }));

    expect(window.open).toHaveBeenCalledWith(
      "/downloads/medical-bill-response-pack.html",
      "_blank",
      "noopener,noreferrer",
    );
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "free_pack_download",
      expect.objectContaining({ source_surface: "product_page" }),
    );
    expect(screen.queryByRole("link", { name: /download the full workbook/i })).not.toBeInTheDocument();
  });

  it("keeps the browser companion local and printable", () => {
    renderPage();
    const firstStep = screen.getByLabelText(/identified the document/i);
    fireEvent.click(firstStep);
    expect(screen.getByText(/1 of 5 control points documented/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /print/i }));
    expect(window.print).toHaveBeenCalled();
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "print_or_save_action",
      expect.objectContaining({ action_type: "browser_companion_print" }),
    );
  });
});
