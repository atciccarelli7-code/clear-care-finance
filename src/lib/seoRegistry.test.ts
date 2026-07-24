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

  it("publishes the compounding-growth article and detector with canonical structured data", () => {
    const articlePath = "/articles/what-employer-benefit-changes-should-i-compare";
    const detectorPath = "/tools/benefits-change-detector";
    const articleMeta = resolveSeoMeta(articlePath);
    const detectorMeta = resolveSeoMeta(detectorPath);

    expect(getIndexableRoutes()).toEqual(expect.arrayContaining([articlePath, detectorPath]));
    expect(articleMeta.canonicalPath).toBe(articlePath);
    expect(articleMeta.jsonLd?.map((item) => item["@type"])).toEqual(
      expect.arrayContaining(["Article", "BreadcrumbList"]),
    );
    expect(detectorMeta.canonicalPath).toBe(detectorPath);
    expect(detectorMeta.jsonLd?.map((item) => item["@type"])).toEqual(
      expect.arrayContaining(["WebApplication", "BreadcrumbList"]),
    );
  });

  it("publishes the hospital guide and launch articles with canonical structured data", () => {
    const hubPath = "/patients-families/hospital-guide";
    const articlePaths = [
      "/articles/why-am-i-getting-a-blood-thinner-in-the-hospital",
      "/articles/why-did-the-hospital-stop-or-change-my-home-medications",
    ];

    expect(getIndexableRoutes()).toEqual(expect.arrayContaining([hubPath, ...articlePaths]));
    expect(resolveSeoMeta(hubPath)).toMatchObject({
      canonicalPath: hubPath,
      robots: "index, follow, max-image-preview:large",
    });
    expect(resolveSeoMeta(hubPath).jsonLd?.map((item) => item["@type"])).toEqual(
      expect.arrayContaining(["CollectionPage", "BreadcrumbList"]),
    );

    for (const articlePath of articlePaths) {
      expect(resolveSeoMeta(articlePath).jsonLd?.map((item) => item["@type"])).toEqual(
        expect.arrayContaining(["Article", "BreadcrumbList"]),
      );
    }
  });

  it("publishes honest application structured data for the benefits decision system", () => {
    const path = "/products/healthcare-worker-benefits-decision-system";
    const meta = resolveSiteSeoMeta(path);
    const serialized = JSON.stringify(meta.jsonLd);

    expect(getIndexableRoutes()).toContain(path);
    expect(meta).toMatchObject({
      canonicalPath: path,
      robots: "index, follow, max-image-preview:large",
    });
    expect(meta.jsonLd?.map((item) => item["@type"])).toEqual(
      expect.arrayContaining(["WebApplication", "BreadcrumbList"]),
    );
    expect(serialized).not.toContain('"offers"');
    expect(serialized).not.toContain('"review"');
    expect(serialized).not.toContain('"aggregateRating"');
  });

  it("preserves site overrides and noindexes unknown routes", () => {
    expect(resolveSiteSeoMeta("/tools").title).toBe("Financial Calculators, Checklists, and Decision Tools");
    expect(resolveSeoMeta("/for-organizations")).toMatchObject({
      canonicalPath: "/for-organizations",
      robots: "index, follow, max-image-preview:large",
    });
    expect(resolveSeoMeta("/definitely-not-a-route").robots).toBe("noindex, nofollow");
  });
});
