# CAF Article Transfer Template

## Default instruction for future prompts

Follow LOVABLE_RULES.md.
Update only `src/data/articles.ts` unless the prompt specifically asks for rendering or component changes.
Surgical edit only.
Do not touch layout, routes, navigation, calculators, styling, source presets, or unrelated articles.

## Target article

Target slug:
`[PASTE_SLUG_HERE]`

## Preserve unless explicitly replaced

- `slug`
- `title`
- `category`
- `readTime`
- `relatedCalculator`
- `sources`
- Existing backward-compatible exports

## Replace only the fields supplied in the prompt

Possible fields:

- `promise`
- `audience`
- `summary`
- `body`
- `sections`
- `example`
- `commonMistakes`
- `takeaway`
- `description`

## Preferred factual/educational article format

Use `sections` when the article is factual or educational.

```ts
sections: [
  {
    title: "",
    definition: "",
    keyPoints: ["", "", ""],
    watchOut: "",
    example: ""
  }
]
```

Use `body` only for paragraph-style articles or fallback articles.

## CAF fact-sheet flow

For factual articles, prefer:

1. 60-second summary
2. Fact sheet sections
3. What can cost money
4. Questions to ask
5. Common mistakes
6. Key takeaway
7. Sources

## Source rules

- Do not invent new citations.
- Use existing `SOURCE_PRESETS` when possible.
- If a claim is not supported by available sources, make the wording more general.
- Do not add raw source URLs unless the article system already supports them.

## Verification checklist

After updating:

- [ ] The target article renders.
- [ ] No placeholder text remains in that article.
- [ ] Other articles still render.
- [ ] No duplicate imports, exports, or article objects were introduced.
- [ ] TypeScript/build has no errors.

## Required response format

Reply only with:

- files changed
- article updated
- fields changed
- verification
- remaining issues
