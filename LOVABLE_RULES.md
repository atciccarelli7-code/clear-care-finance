# Community Acquired Finance — Lovable Rules

## Purpose

Community Acquired Finance is a clean, trustworthy healthcare-finance education site for healthcare workers, patients, caregivers, and families.

The goal is Robinhood-level simplicity with deeper educational credibility: simple UI, practical calculators, clear definitions, readable articles, and credible sources.

## Brand and design guardrails

- Preserve the current dark premium healthcare-finance style unless the user explicitly asks for a design change.
- Preserve the green/sage accent system, rounded cards, calm spacing, and trustworthy visual tone.
- Avoid clickbait, spammy monetization, cluttered ads, generic finance-blog styling, or overly salesy language.
- Prioritize mobile readability.
- Do not redesign pages, navigation, routes, layout systems, or reusable components unless the prompt specifically asks for that.
- If a layout/styling fix is needed to complete the user’s specific request, make the smallest necessary change and explain it briefly.

## Editing rules

- Default to surgical edits.
- Edit only the files needed for the requested task.
- Do not refactor unrelated code.
- Do not change calculators unless the prompt specifically asks.
- Do not change article rendering unless the prompt specifically asks.
- Do not change source presets unless the prompt specifically asks.
- Preserve backward-compatible exports unless the user explicitly asks to remove them.
- If there is uncertainty, choose the smallest safe change rather than a broad rewrite.

## Article rules

- Prefer the CAF fact-sheet format for factual/educational articles.
- Fact-sheet articles should be scannable, not paragraph-heavy.
- Use definitions, key points, watch-out warnings, questions to ask, common mistakes, key takeaway, and sources when relevant.
- Use short paragraphs and bullets.
- Avoid textbook tone.
- Avoid copying government-source language too closely.
- Do not invent citations, statistics, or legal/medical/insurance claims.
- Use existing source presets when available.
- Keep educational disclaimers calm and brief.

## Article structure guidance

For factual/educational articles, prefer:

1. 60-second summary
2. Fact sheet sections
3. What can cost money
4. Questions to ask
5. Common mistakes
6. Key takeaway
7. Sources

Fact-sheet sections may use:

- `title`
- `definition`
- `keyPoints`
- `watchOut`
- `example`

This is a preferred format, not a permanent restriction. If the user asks for a different article style, follow the user’s request.

## Calculator rules

- Calculators should teach the concept, not just output numbers.
- Label assumptions clearly.
- Include “How this is calculated” when math is not obvious.
- Avoid misleading labels, especially for taxes, insurance, Medicare, deductibles, coinsurance, and out-of-pocket costs.
- If a number is an estimate, label it as an estimate.
- If a default value is year-specific, mention the year and keep the value editable.
- Keep disclaimers educational, not legalistic.

## Response rules after edits

Unless the user asks for detail, reply only with:

- files changed
- what changed
- verification
- remaining issues

Do not provide long explanations after edits unless asked.

## Conflict rule

The user’s current prompt overrides this file. If the user explicitly asks for a redesign, refactor, calculator change, article model change, or broader update, follow that request. This file is a guardrail against accidental unnecessary changes, not a ban on future work.
