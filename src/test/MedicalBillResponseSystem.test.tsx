import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MedicalBillReviewToolkitPage from "@/pages/MedicalBillReviewToolkitPage";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

const renderPage = () => render(
  <MemoryRouter initialEntries={["/insurance/medical-bill-review-toolkit"]}>
    <MedicalBillReviewToolkitPage />
  </MemoryRouter>,
);

describe("Medical Bill Response System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: (callback: FrameRequestCallback) => { callback(0); return 0; },
    });
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("routes an EOB to a plain-English result without collecting document contents", () => {
    renderPage();

    expect(screen.getByRole("heading", { level: 1, name: /medical bill response system/i })).toBeInTheDocument();
    expect(screen.getByText(/do not enter names, diagnoses, member IDs, claim numbers, account numbers/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /explanation of benefits/i }));

    expect(screen.getByText("Document classification")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /explanation of benefits/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /first three checks/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /compare the EOB and bill/i })).toHaveAttribute("href", "/tools/eob-to-bill-match-checker");
    expect(screen.getByRole("link", { name: /CMS EOB guide/i })).toHaveAttribute("href", "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits");

    expect(trackSiteEvent).toHaveBeenCalledWith("document_router_complete", expect.objectContaining({ route_type: "eob" }));
  });

  it("publishes a real printable response pack and the required measurement events", () => {
    renderPage();

    const packLinks = screen.getAllByRole("link", { name: /response pack|printable pack/i });
    expect(packLinks.length).toBeGreaterThan(0);
    packLinks.forEach((link) => expect(link).toHaveAttribute("href", "/downloads/medical-bill-response-pack.html"));

    fireEvent.click(packLinks[0]);
    expect(trackSiteEvent).toHaveBeenCalledWith("response_pack_download", expect.objectContaining({ asset_id: "medical_bill_response_pack" }));
  });
});
