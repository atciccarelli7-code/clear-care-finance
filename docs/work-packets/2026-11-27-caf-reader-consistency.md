# Reader consistency across existing entry points

The founder asked CAF to close the gap between original, actionable healthcare-finance coverage and generic utility pages. The reader should be able to identify the question the page answers, check the relevant assumptions or exceptions, and take a useful next step.

## Evidence and scope

- The [November 26 remediation](2026-11-26-adsense-editorial-remediation.md) already covers the sitemap, article review and thin editorial routes. This follow-up uses that inventory and inspects the current tools directory, shared calculator template, glossary, and the existing bill, coverage and assistance destinations. A page count cannot establish editorial quality.
- Five of 193 canonical pages change. Six existing destinations gain context in the tools directory. Three calculators gain hypothetical examples and links. Five insurance glossary entries gain a corrected definition or a new entry, a practical check, and primary-source attribution. No canonical pages are added or removed. The 35 article advertising candidates stay under the existing publisher review process.
- Verify insurance explanations using HealthCare.gov definitions and the CMS guide to reading an EOB. Verify fixed-rate amortization separately from federal repayment and forgiveness eligibility, with Federal Student Aid as the next stop. The cafe example uses explicit fictional spending and schedule assumptions.

## Decision and review

| Review lens | Finding |
| --- | --- |
| Strategy, product, healthcare user and editorial | Lead with the decision someone faces. Put bill verification, coverage, care and assistance in context before the directory asks readers to search. Put a worked example where a reader needs to interpret a result. |
| Discovery and conversion | Reuse canonical destinations so a single tool or guide answers each question. Treat the earlier editorial crawl as inventory evidence. Reader behavior and AdSense outcomes need separate validation. |
| Operations, finance, revenue and privacy | The task does not justify ad inventory or consent changes. Examples contain fictional numbers and accept no new reader data. Current performance and monetization impact remain unmeasured. |
| Technology, accessibility, reliability and QA | Keep the existing calculators and legacy directory bookmarks. Verify mobile and desktop routes, accessible glossary interactions, a no-result recovery path, calculator examples, and existing journeys before release. |
| Red team and process improvement | A polished directory cannot cure an unhelpful destination. Confirm each of the new paths goes directly to a page that can support the named step. For future utility updates, require an answer, the case where it changes, and a specific next action. |

## Release and follow-up

Run the full build and the existing publisher browser certification, with regressions for the paths touched here. Use the normal pull-request checks and preview. Revert the focused PR as one unit if needed. Review existing aggregate navigation and search evidence once sufficient visits accumulate. This work does not establish Google approval or a measured change in reader outcomes.
