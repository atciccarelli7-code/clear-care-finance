import { describe, expect, it } from "vitest";
import { TOOL_CATEGORIES, TOOL_CATEGORY_GUIDANCE, TOOLS, getToolByLegacyAnchor, getToolBySlug } from "@/data/tools";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("tool registry", () => {
  it("has unique slugs and legacy anchors", () => {
    expect(unique(TOOLS.map((tool) => tool.slug))).toBe(true);
    expect(unique(TOOLS.map((tool) => tool.legacyAnchorId))).toBe(true);
  });

  it("resolves every tool by slug and legacy anchor", () => {
    TOOLS.forEach((tool) => {
      expect(getToolBySlug(tool.slug)).toBe(tool);
      expect(getToolByLegacyAnchor(tool.legacyAnchorId)).toBe(tool);
      tool.legacyAnchorAliases?.forEach((alias) => {
        expect(getToolByLegacyAnchor(alias)).toBe(tool);
      });
    });
  });

  it("keeps source and assumption guidance available for every category", () => {
    TOOL_CATEGORIES.forEach((category) => {
      expect(TOOL_CATEGORY_GUIDANCE[category].assumptionNotes.length).toBeGreaterThan(0);
      expect(TOOL_CATEGORY_GUIDANCE[category].sourceNotes.length).toBeGreaterThan(0);
    });
  });

  it("keeps related article links internal when present", () => {
    TOOLS.forEach((tool) => {
      if (tool.relatedArticle) {
        expect(tool.relatedArticle.href.startsWith("/")).toBe(true);
      }
    });
  });
});
