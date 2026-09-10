import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { trackSiteEvent } from "@/lib/analytics";

vi.mock("@/lib/analytics", () => ({ trackSiteEvent: vi.fn() }));

describe("article newsletter capture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("requires consent, preserves article attribution, and distinguishes saved contact from email delivery", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ ok: true, saved: true, emailDelivered: false }) } as Response);
    render(<NewsletterSignup compact source="article-20-dollar-tylenol-hospital-prices" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Join the monthly list" }));
    expect(await screen.findByText(/Check the consent box/)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Join the monthly list" }));
    expect(await screen.findByText(/Welcome email delivery is still being finalized/)).toBeInTheDocument();
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string)).toMatchObject({ consent: true, source: "article-20-dollar-tylenol-hospital-prices", type: "newsletter" });
    expect(trackSiteEvent).toHaveBeenCalledWith("newsletter_signup_success", { event_category: "newsletter", source: "article-20-dollar-tylenol-hospital-prices", email_type: "newsletter" });
  });

  it("does not claim a signup when the provider did not save the contact", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ ok: true, saved: false, emailDelivered: false }) } as Response);
    render(<NewsletterSignup source="article-test" />);
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "reader@example.com" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Join the monthly list" }));
    expect(await screen.findByText(/Signup could not be completed/)).toBeInTheDocument();
    expect(vi.mocked(trackSiteEvent).mock.calls.some(([event]) => event === "newsletter_signup_success")).toBe(false);
  });
});
