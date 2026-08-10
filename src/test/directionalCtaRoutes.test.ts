import { describe, expect, it } from "vitest";
import { getArticleHeroAction, isPriorityDirectionalArticle } from "@/lib/directionalCtaRoutes";

describe("article search-to-decision routes", () => {
  it("promotes both evidence-backed 403(b) search entries into the calculator", () => {
    const slugs = [
      "how-hospital-403b-matching-works",
      "how-much-should-a-nurse-put-in-403b-per-paycheck",
    ];

    for (const slug of slugs) {
      expect(isPriorityDirectionalArticle(slug)).toBe(true);
      expect(getArticleHeroAction(slug)).toEqual(expect.objectContaining({
        href: "/tools/403b-paycheck-calculator",
        availabilityStatus: "available",
      }));
    }
  });

  it("does not add a hero conversion action to unrelated articles", () => {
    expect(getArticleHeroAction("how-to-read-an-eob")).toBeNull();
  });
});
