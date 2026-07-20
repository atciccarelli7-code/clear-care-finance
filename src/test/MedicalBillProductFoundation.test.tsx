import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MedicalBillProductFoundation } from "@/components/medical-bill/MedicalBillProductFoundation";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

describe("Medical Bill Product Foundation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("keeps checkout disabled and routes users to free resources and sample pages", () => {
    render(
      <MemoryRouter>
        <MedicalBillProductFoundation />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /expanded medical bill response workbook/i })).toBeInTheDocument();
    expect(screen.getByText(/checkout is intentionally disabled/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /buy|purchase|checkout|pay/i })).not.toBeInTheDocument();

    expect(screen.getByRole("link", { name: /preview sample pages/i })).toHaveAttribute(
      "href",
      "/downloads/expanded-medical-bill-response-workbook-preview.html",
    );
    expect(screen.getByRole("link", { name: /use the free response system/i })).toHaveAttribute(
      "href",
      "/insurance/medical-bill-review-toolkit",
    );
    expect(screen.getByRole("link", { name: /open the free pack/i })).toHaveAttribute(
      "href",
      "/downloads/medical-bill-response-pack.html",
    );
    expect(screen.getByText(/do not send bills, account numbers, diagnoses, member IDs, claim numbers/i)).toBeInTheDocument();
  });

  it("requires consent and submits only email-list fields", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, saved: true, emailDelivered: false, sequenceScheduled: false }),
    } as Response);

    render(
      <MemoryRouter>
        <MedicalBillProductFoundation />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /join early access/i }));
    expect(await screen.findByText(/check the consent box/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /join early access/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(String((request as RequestInit).body));
    expect(payload).toEqual(
      expect.objectContaining({
        email: "reader@example.com",
        consent: true,
        source: "newsletter-medical-bill-workbook",
      }),
    );
    expect(payload).not.toHaveProperty("claim");
    expect(payload).not.toHaveProperty("amount");
    expect(payload).not.toHaveProperty("diagnosis");
    expect(await screen.findByText(/you’re on the early-access list/i)).toBeInTheDocument();
    expect(trackSiteEvent).toHaveBeenCalledWith(
      "medical_bill_email_sequence_start",
      expect.objectContaining({ sequence_id: "medical_bill_foundation_v1" }),
    );
  });
});
