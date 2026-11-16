import { render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "@/data/allArticles";
import { EDITORIAL_SERIES, getEditorialSeries } from "@/data/editorialSeries";
import { EDITORIAL_LIBRARY_CLASSIFICATIONS } from "@/data/editorialLibraryAudit";
import { ArticlePageView } from "@/pages/ArticlePage";
import Newsletter from "@/pages/Newsletter";

afterEach(cleanup);

describe("founder reader journeys", () => {
  it("covers the flagship cohort exactly once with real titles and no self links", () => {
    const entries = EDITORIAL_SERIES.flatMap((series) => [...series.articles]);
    expect(entries.map((entry) => entry.slug).sort()).toEqual([...EDITORIAL_LIBRARY_CLASSIFICATIONS.FLAGSHIP].sort());
    for (const entry of entries) {
      expect(ALL_ARTICLES.find((article) => article.slug === entry.slug)?.title).toBe(entry.title);
      expect(getEditorialSeries(entry.slug)?.next.slug).not.toBe(entry.slug);
    }
    expect(getEditorialSeries("how-to-read-an-eob")).toBeUndefined();
  });

  it.each(EDITORIAL_LIBRARY_CLASSIFICATIONS.FLAGSHIP)("provides a next founder article and one attributed signup on %s", (slug) => {
    const article = ALL_ARTICLES.find((candidate) => candidate.slug === slug)!;
    render(<MemoryRouter><ArticlePageView article={article} articleCatalog={ALL_ARTICLES} /></MemoryRouter>);
    const series = getEditorialSeries(slug)!;
    const module = screen.getByRole("heading", { name: series.title }).closest("section")!;
    expect(within(module).getAllByRole("link")[0]).toHaveAttribute("href", `/articles/${series.next.slug}`);
    const signup = screen.getByRole("region", { name: "Keep following the money behind healthcare" });
    expect(signup).toHaveAttribute("aria-labelledby", `newsletter-signup-article-${slug}`);
    expect(within(signup).getByRole("checkbox")).not.toBeChecked();
    expect(screen.getAllByLabelText("Email")).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `https://communityacquiredfinance.com/articles/${slug}`);
  });

  it("keeps newsletter focused on one publication signup and four real examples", () => {
    render(<MemoryRouter><Newsletter /></MemoryRouter>);
    expect(screen.getAllByLabelText("Email")).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Meet the author" })).toHaveAttribute("href", "/about");
    const examples = document.querySelector("#example-articles")!;
    expect(within(examples as HTMLElement).getAllByRole("link")).toHaveLength(4);
    expect(document.querySelector("#medical-bill-resources")).toBeNull();
    expect(screen.queryByText(/early.access|paid product|workbook/i)).not.toBeInTheDocument();
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toContain("Andrew Ciccarelli");
  });
});
