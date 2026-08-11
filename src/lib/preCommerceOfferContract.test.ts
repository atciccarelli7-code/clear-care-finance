import { describe, expect, it } from "vitest";
import { BENEFITS_WORKSPACE_OFFER, parsePreCommerceCommitmentPayload } from "@/lib/preCommerceOfferContract";

const valid = {
  offerKey: BENEFITS_WORKSPACE_OFFER.offerKey,
  email: " Qualified@Example.com ",
  emailConsent: true,
  priceCommitment: true,
  sessionId: "956397df-65eb-43b4-9ef6-4aa42f83236c",
  evidenceClass: "observed",
  website: "",
};

describe("pre-commerce commitment contract", () => {
  it("normalizes the minimum exact payload", () => {
    expect(parsePreCommerceCommitmentPayload(valid)).toEqual({ ...valid, email: "qualified@example.com" });
  });

  it.each([
    [{ ...valid, offerKey: "arbitrary_offer" }],
    [{ ...valid, priceCommitment: false }],
    [{ ...valid, emailConsent: false }],
    [{ ...valid, evidenceClass: "organic" }],
    [{ ...valid, salary: 90000 }],
    [{ ...valid, sessionId: "not-a-uuid" }],
  ])("rejects mismatched, weak, or expanded payloads", (payload) => {
    expect(parsePreCommerceCommitmentPayload(payload)).toBeNull();
  });
});
