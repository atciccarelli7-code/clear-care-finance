import { describe, expect, it } from "vitest";
import { ALL_ARTICLES } from "./allArticles";
import { DE_EMPHASIZED_ARTICLE_SLUGS, EDITORIAL_AREAS, getEditorialAreaId } from "./editorialLibrary";
import { EDITORIAL_LIBRARY_CLASSIFICATIONS } from "./editorialLibraryAudit";

describe("editorial library governance", () => {
  it("classifies every public article exactly once", () => {
    const classified = Object.values(EDITORIAL_LIBRARY_CLASSIFICATIONS).flat();
    const publicSlugs = ALL_ARTICLES.map((article) => article.slug);

    expect(classified).toHaveLength(77);
    expect(new Set(classified).size).toBe(classified.length);
    expect([...classified].sort()).toEqual([...publicSlugs].sort());
  });

  it("maps every article to one of five reader-facing editorial areas", () => {
    const areaIds = new Set(EDITORIAL_AREAS.map((area) => area.id));
    expect(EDITORIAL_AREAS).toHaveLength(5);
    expect(ALL_ARTICLES.every((article) => areaIds.has(getEditorialAreaId(article)))).toBe(true);
  });

  it("keeps the runtime de-emphasis list aligned with the audit", () => {
    expect([...DE_EMPHASIZED_ARTICLE_SLUGS].sort()).toEqual(
      [...EDITORIAL_LIBRARY_CLASSIFICATIONS["DE-EMPHASIZE"]].sort(),
    );
  });
});
