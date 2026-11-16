# Editorial reading and navigation refinement — September 25, 2026

## Assignment and decision

Founder requested a rendered desktop/mobile review followed by materially justified UI fixes. Publication-first strategy governs this work. No redesign, new content, calculator, dependency, URL, SEO infrastructure, analytics, monetization, or backend changes. This follows the bounded reader-growth work in PR286; that PR remains unpublished.

Production was visually inspected before editing. The existing restrained palette, founder-led homepage, editorial desks, source lists and supporting utility pages are coherent. Retain them. Correct the reading preamble and navigation friction instead.

## Direct visual evidence and priorities

Browser review at 1440x1000 and 390x844 covered homepage, article archive/search, Tylenol, length of stay, nonprofit hospital, a 403(b) reference article, Medicare/care-cost hub, healthcare-worker hub, tools, About, Newsletter, header/footer, related reads, and mobile menu. Post-change browser review revisited shared article presentation, mobile navigation, search, sources and next-read cards. Automated screenshots compare production with the built candidate; local artifacts are under `artifacts/visual-review`.

| Priority | Observed issue | Kept implementation and reason |
|---|---|---|
| P1 | Sticky header computed background was transparent; scrolling text showed through | Use existing opaque background token, remove menu fade-through; labels remain legible |
| P1 | Article hero plus two large review cards delayed opening content; author buried after dates | Article-only compact hero; visible author/date lines and keyboard-operable review disclosures; preserve source/credential wording |
| P2 | Narrative text was small relative to reading width | 17px mobile / 18px desktop, 1.75 line height and stronger text contrast, existing width retained |
| P2 | Search below featured stories and five desks required excessive scrolling | One visible archive jump link to existing search/filter area; no archive reordering |
| P2 | Mobile menu target 36px and bottom bar lacked a direct article path | 44px toggle; Articles replaces Start; Costs correctly labels the existing insurance destination |

No P0 discovered. P3 alternatives (new fonts, imagery, color system, homepage/card redesign, rebuilt information architecture) rejected as preference rather than demonstrated need. Medicare time-sensitive notices and reference-article utility actions retained.

## Scope, inherited decisions and executive review

The navigation change is global (192/192 candidate canonical routes), with no route inventory reduction. Shared article presentation is reused, and all ten flagship articles are covered by existing browser certification plus a reference-article visual check; 81 registered articles remain. Default freshness cards outside articles are unchanged. Existing public schemas/canonicals/sitemap behavior and consent tracking are unchanged. Maintenance adds one article-specific freshness presentation and browser regressions; no package additions.

Challenge: retaining large review cards merely because they existed was not justified. Hiding review evidence entirely would also be wrong. Author, published/reviewed/effective dates, time-sensitive flag and update notes remain visible; scope and credentials are expandable and fully printed. Separate article freshness code avoids loading article-only UI into the shared entry bundle. The 500 KiB entry limit remains unchanged.

Expected business effect is easier reading and discovery, an inference rather than a measured growth claim. No revenue experiment, commercial expansion or new data collection. Existing engagement and signup events remain the measurement source. Rollback: revert this visual commit, preserving the preceding reader-growth implementation.

## Independent challenge and accountable findings

A separate release reviewer found that collapsed disclosures disappeared in print. Added narrowly scoped print rules and browser print-visibility assertions; these pass on desktop and mobile Chromium. No navigation regression found. Remaining role assessments below are the primary agent's explicit domain review, not claims of separate human signoff.

| Role | Executive accountability | Status / finding |
|---|---|---|
| Orchestrator | Operations | PASS — bounded visual scope, stop after validation |
| Context steward | Operations | PASS — current production and newer PR commit reconciled |
| Capability router | Technology | PASS — rendered browser review, repository/CI evidence |
| Executive strategy | Strategy | PASS — reading is primary; working visual identity preserved |
| Product management | Product | PASS — less preamble, direct search/article access |
| Healthcare user research | User context | PASS — utility actions and time-sensitive notices retained |
| Information architecture | Discovery | PASS — existing desks, routes and search preserved |
| UX/design system | Product | PASS — existing tokens, shared components, no redesign |
| Content/evidence integrity | Editorial | PASS — no substantive claims or author experience invented |
| Frontend engineering | Technology | WARN — changes tested; existing app type errors unchanged |
| Systems architecture | Technology | PASS — no dependencies, backend or route architecture changes |
| Backend/data/security | Protection | NOT IMPLICATED — no implementation changes |
| Platform/DevOps | Reliability | BLOCK — protected preview still lacks automation credential |
| SEO/discovery | Discovery | PASS — build certifies unchanged canonical inventory and metadata contracts |
| Monetization/conversion | Finance/revenue | PASS — publication navigation, no monetization expansion |
| Analytics/experimentation | Data | WARN — behavior improvement inferred, existing measurements retained |
| Accessibility/performance | Reliability | PASS — keyboard/axe/overflow/print checks; unchanged bundle limit |
| Privacy/legal/user protection | Protection | PASS — consent and disclosures retained |
| Publishing/governance | Editorial/operations | WARN — no merge or production claim while gate blocked |
| Quality/release | Release | BLOCK — local checks pass with baseline type caveat; hosted preview unresolved |
| Adversarial red team | Red team | PASS — print regression discovered and fixed; no evidence hidden permanently |
| Process improvement | Process | PASS — regressions added to hosted browser workflow |

## Validation

- Full build PASS: 192 canonical routes, 192 sitemap URLs, 39 redirects, zero search warnings. Entry 499.83 KiB / 500 limit; largest JS chunk 550.49 KiB / 600 limit.
- Lint: zero errors, 15 existing warnings.
- Full suite: 802/802 PASS across 142 files. Known Windows CRLF-only SQL fixture temporarily normalized to original Git LF for the run, then restored byte-for-byte; no SQL change committed.
- Browser: 69 PASS, one intentional desktop skip for mobile-only navigation. Includes all ten founder articles, reader-to-second-article-to-consented-signup, metadata/canonicals, legacy utilities, axe accessibility, horizontal overflow, keyboard review disclosures and print visibility. No runtime errors in tested journeys. Newsletter transport mocked; no real subscriber created or email-delivery claim.
- App type check: 37 existing diagnostics; exact baseline comparison recorded separately. API TypeScript passes as part of build. No claim that the whole app typecheck is clean.
- Independent production baseline captures: 2 PASS (desktop/mobile). Representative before/after images saved locally.
- Newer remote commit `9d326a4` already fixes the older next-read test label; preserved by fast-forward before adding this change.

## Release and stopping rule

Update PR286 with the validated visual changes; do not merge while protected-preview certification fails. No production changes or post-merge success claimed. The remaining external action is securely configuring the authorized Vercel automation credential, then re-running exact-head release checks. Reassess only for a real regression or reader evidence; no speculative redesign backlog.
