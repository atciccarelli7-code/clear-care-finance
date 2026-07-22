import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MedicalBillProductPathway } from "@/components/medical-bill/MedicalBillProductPathway";
import { hasMedicalBillProductPathway } from "@/components/medical-bill/medicalBillProductPathwayConfig";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

describe("MedicalBillProductPathway", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("only claims routes with a direct medical-bill relationship", () => {
    expect(hasMedicalBillProductPathway("/insurance/medical-bill-review-toolkit")).toBe(true);
    expect(hasMedicalBillProductPathway("/articles/how-to-read-an-eob")).toBe(true);
    expect(hasMedicalBillProductPathway("/articles/why-one-hospital-visit-can-create-multiple-bills")).toBe(true);
    expect(hasMedicalBillProductPathway("/articles/how-hospital-403b-matching-works")).toBe(false);
    expect(hasMedicalBillProductPathway("/")).toBe(false);
  });

  it("renders a crawlable supporting handoff without a duplicate email form", () => {
    render(
      <MemoryRouter>
        <MedicalBillProductPathway pathname="/articles/how-to-read-an-eob" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /turn this explanation into a working medical-bill file/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /preview sample pages/i })).toHaveAttribute(
      "href",
      "/downloads/expanded-medical-bill-response-workbook-preview.html",
    );
    expect(screen.getByRole("link", { name: /use the free response system/i })).toHaveAttribute(
      "href",
      "/insurance/medical-bill-review-toolkit",
    );
    expect(screen.queryByRole("textbox", { name: /email/i })).not.toBeInTheDocument();
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "medical_bill_product_pathway_view",
      expect.objectContaining({ source: "article-how-to-read-an-eob", pathway_variant: "supporting" }),
    );
  });

  it("preserves the consent-gated response sequence on the flagship hub", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, saved: true, emailDelivered: true, sequenceStatus: "first_email_only" }),
    } as Response);

    render(
      <MemoryRouter>
        <MedicalBillProductPathway pathname="/insurance/medical-bill-review-toolkit" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /keep the next medical-bill call organized/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /start the medical-bill email path/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String((request as RequestInit).body));
    expect(payload).toEqual(
      expect.objectContaining({
        email: "reader@example.com",
        consent: true,
        source: "medical-bill-response-system",
        type: "medical-bill-sequence",
      }),
    );
    expect(payload).not.toHaveProperty("claimNumber");
    expect(payload).not.toHaveProperty("diagnosis");
    expect(await screen.findByText(/check your inbox for the first response email/i)).toBeInTheDocument();
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "medical_bill_email_sequence_start",
      expect.objectContaining({ sequence_status: "first_email_only" }),
    );
  });
});
