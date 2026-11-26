import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { FLAGSHIP_VISUAL_ARTICLES } from "./flagshipVisualArticles";
import { EDITORIAL_COVERS, coverPath, socialCover } from "./editorialCovers";

describe("editorial artwork delivery", () => {
  it("ships complete responsive sets and social artwork for all flagships and illustrated stories", () => {
    expect(Object.keys(EDITORIAL_COVERS)).toEqual(expect.arrayContaining(FLAGSHIP_VISUAL_ARTICLES.map(article => article.slug)));
    for (const [slug, cover] of Object.entries(EDITORIAL_COVERS)) {
      for (const width of [480, 960, 1440]) {
        const path = `public${coverPath(cover.file, width)}`;
        expect(existsSync(path)).toBe(true);
        expect(readFileSync(path).length).toBeLessThan(160_000);
      }
      const social = socialCover(`/articles/${slug}`)!;
      expect(existsSync(`public${social.path}`)).toBe(true);
    }
  });
  it("resets unrelated routes to the established site preview", () => {
    expect(socialCover("/tools")).toBeNull();
    expect(socialCover("/")?.path).toContain("shock-absorber-og.jpg");
  });
});
