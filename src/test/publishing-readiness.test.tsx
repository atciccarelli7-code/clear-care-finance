import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CalculatorByKey } from "@/components/calculators/CalculatorByKey";
import { ARTICLES } from "@/data/articles";
import { TOPICS, type CalculatorKey } from "@/data/topics";
import { isArticleDraft } from "@/lib/article-status";

afterEach(cleanup);

describe("publishing readiness", () => {
  it("publishes unique article slugs and resolves every topic article", () => {
    const slugs = ARTICLES.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(ARTICLES.some(isArticleDraft)).toBe(false);

    for (const topic of TOPICS) {
      for (const slug of topic.relatedArticleSlugs) {
        expect(slugs, `${topic.slug} links to missing article ${slug}`).toContain(slug);
      }
    }
  });

  it.each<[CalculatorKey, RegExp]>([
    ["calc403b", /Estimated gross paycheck/i],
    ["calcInsurance", /Estimated total annual cost/i],
    ["calcMedicare", /Estimated yearly Medicare cost/i],
    ["calcCafe", /Weekly spend at work/i],
    ["calcLoan", /Monthly payment/i],
  ])("renders the %s calculator", (key, resultLabel) => {
    render(<CalculatorByKey k={key} />);
    expect(screen.getByText(resultLabel)).toBeInTheDocument();
  });
});
