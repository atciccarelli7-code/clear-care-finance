import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MedicalBillProductFoundation } from "@/components/medical-bill/MedicalBillProductFoundation";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

describe("Medical Bill Product Foundation", () => {
  const openMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("open", openMock);
  });

  it("presents complete free resources without public development or checkout language", () => {
    render(
      <MemoryRouter>
        <MedicalBillProductFoundation />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /organize a confusing medical bill before you pay or escalate it/i })).toBeInTheDocument();
    expect(screen.getByText(/no account or document upload required/i)).toBeInTheDocument();
    expect(screen.queryByText(/early access|checkout|audience validation|private build|in development/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /buy|purchase|checkout|pay/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^\$24$/)).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: /use the response system/i })).toHaveAttribute(
      "href",
      "/insurance/medical-bill-review-toolkit",
    );

    fireEvent.click(screen.getByRole("button", { name: /open the printable response pack/i }));
    expect(openMock).toHaveBeenCalledWith(
      "/downloads/medical-bill-response-pack",
      "_blank",
      "noopener,noreferrer",
    );
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "free_pack_download",
      expect.objectContaining({ asset_id: "medical_bill_response_pack" }),
    );
    expect(screen.getByText(/do not send bills, account numbers, diagnoses, member IDs, claim numbers/i)).toBeInTheDocument();
  });

  it("requires consent and submits privacy-minimized educational signup fields", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, saved: true, emailDelivered: false }),
    } as Response);

    render(
      <MemoryRouter>
        <MedicalBillProductFoundation />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /get medical-bill updates/i }));
    expect(await screen.findByText(/check the consent box/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /get medical-bill updates/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/send");
    const payload = JSON.parse(String((request as RequestInit).body));
    expect(payload).toEqual(
      expect.objectContaining({
        email: "reader@example.com",
        consent: true,
        source: "newsletter-medical-bill-resources",
        type: "medical-bill-product-interest",
      }),
    );
    expect(payload).not.toHaveProperty("claim");
    expect(payload).not.toHaveProperty("amount");
    expect(payload).not.toHaveProperty("diagnosis");
    expect(await screen.findByText(/your signup was saved/i)).toBeInTheDocument();
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "premium_interest_submit",
      expect.objectContaining({ offer_id: "expanded_medical_bill_response_workbook" }),
    );
  });
});
