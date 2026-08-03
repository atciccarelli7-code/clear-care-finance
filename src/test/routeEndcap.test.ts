import { describe, expect, it } from "vitest";
import { getRouteEndcapOwner } from "@/components/layout/routeEndcap";

describe("route endcap ownership", () => {
  it.each([
    ["/healthcare-workers", "seo_pathway"],
    ["/patients-families", "medical_bill"],
    ["/insurance", "seo_pathway"],
    ["/open-enrollment", "seo_pathway"],
    ["/insurance/medical-bill-review-toolkit", "medical_bill"],
    ["/tools/403b-paycheck-calculator", "benefits_workspace"],
  ])("assigns exactly one global owner to %s", (path, owner) => {
    expect(getRouteEndcapOwner(path)).toBe(owner);
  });

  it.each([
    "/tools/healthcare-worker-total-compensation-comparison",
    "/articles/how-to-read-an-eob",
    "/articles/how-hospital-403b-matching-works",
  ])("lets the directional page own %s", (path) => {
    expect(getRouteEndcapOwner(path)).toBe("page");
  });
});

