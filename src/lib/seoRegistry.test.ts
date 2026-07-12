import { describe, expect, it } from "vitest";
import { RUNTIME_ARTICLE_SEO_META, RUNTIME_TOPIC_SEO_META } from "@/data/runtimeSeoManifest";
import { getIndexableRoutes, resolveSeoMeta } from "@/lib/seoRegistry";
import { resolveSiteSeoMeta } from "@/lib/siteSeoMeta";

describe("runtime SEO registry", () => {
  it("keeps every lightweight article and topic route indexable without duplicates", () => {
    const routes = getIndexableRoutes();

    expect(new Set(routes).size).toBe(routes.length);
    expect(routes).toEqual(expect.arrayContaining(RUNTIME_ARTICLE_SEO_META.map(({ slug }) => `/articles/${slug}`)));
    expect(routes).toEqual(expect.arrayContaining(RUNTIME_TOPIC_SEO_META.map(({ slug }) => `/topics/${slug}`)));
  });

  it("resolves article metadata and available publication dates from the lightweight manifest", () => {
    const article = RUNTIME_ARTICLE_SEO_META.find(({ publishedAt }) => publishedAt) ?? RUNTIME_ARTICLE_SEO_META[0];
    const meta = resolveSeoMeta(`/articles/${article.slug}`);
    const articleSchema = meta.jsonLd?.find((item) => item["@type"] === "Article");

    expect(meta).toMatchObject({ title: article.title, description: article.description, type: "article" });
    if (article.publishedAt) expect(articleSchema).toMatchObject({ datePublished: article.publishedAt });
    if (article.lastReviewedAt) expect(articleSchema).toMatchObject({ dateModified: article.lastReviewedAt });
  });

  it("preserves site overrides and noindexes unknown routes", () => {
    expect(resolveSiteSeoMeta("/tools").title).toBe("Financial Calculators and Decision Tools");
    expect(resolveSeoMeta("/definitely-not-a-route").robots).toBe("noindex, nofollow");
  });
});
