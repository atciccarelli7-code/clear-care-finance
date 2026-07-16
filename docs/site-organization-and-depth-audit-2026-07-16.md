# Community Acquired Finance Site Organization and Depth Audit

**Audit date:** July 16, 2026
**Production baseline:** `cba14be208b8fabfafc6e59a9afe797ab1c756ba`
**Implementation branch:** `agent/site-organization-and-depth`

## Executive finding

The site already has strong decision centers for tools, workplace benefits, health insurance, Medicare and Medicaid, medical bills, retirement, and healthcare-worker money decisions. The homepage also gives a new visitor multiple clear starting points. The weakest public surfaces were not the core tools; they were the organizational pages around them.

The largest gaps were:

1. `/topics` described an internal content template instead of helping a visitor choose a subject or next action. It had one page heading, eight undifferentiated cards, and no visible grouping or decision route.
2. `/guides` mixed one live guide with public roadmap cards labeled “Manuscript in build” and “Planned.” Those cards had no useful next action and made the library feel unfinished.
3. `/start-here` placed the Decision Concierge before the Financial Navigator hero, creating two competing intake experiences and an H2 before the page H1.
4. Medicare and Medicaid entry links did not consistently lead to the complete `/medicare-care-costs` hub.
5. Topic Guides were reachable from the homepage but absent from the header’s expanded navigation and the footer’s main exploration group.
6. The 404 page provided only a route back home, forcing visitors with old links to restart instead of recovering into the nearest useful destination.

## Implemented improvements

### Topic organization

- Reframed `/topics` around visitor questions rather than the site’s internal page format.
- Added three direct routes: choose a starting point, open a tool, or browse subject guides.
- Grouped topic guides into Money and work, Coverage and care costs, and How healthcare works.
- Routed the Medicare and Medicaid topic card to the complete Medicare, Medicaid, and long-term-care hub while preserving the legacy topic URL.
- Added route-specific SEO metadata and explicit section labels.

### Guide-library depth

- Removed unfinished manuscript and planned-guide cards from the public library.
- Kept unreleased guide work private without publishing new PDF or download paths.
- Added six live alternatives for turning 65, Medicare/Medicaid screening, medical bills, prior authorization, SBC review, and Medicare coverage comparison.
- Explained when to use a printable guide, guided tool, or complete decision pathway.
- Preserved the source, editorial, print, and non-commercial quality standards.

### New-visitor clarity and navigation

- Removed the redundant Start Here concierge so the Financial Navigator H1 and primary workflow lead the page.
- Added Topic Guides to expanded header navigation and the footer.
- Consolidated homepage Medicare links on the complete Medicare and Medicaid hub.
- Rebuilt the 404 page with safe recovery routes to Start Here, tools, topic guides, articles, and the Medicare/Medicaid hub.
- Removed routine 404 console-error noise.

## Protected work and boundaries

- PR #180 remains the owner of the Hospital & Patient Guide and new clinical articles.
- PR #174 remains the owner of the expanded healthcare-worker discounts and perks hub.
- PR #175 remains the owner of the documentation-only growth and revenue operating system review.
- No canonical slug, redirect, sitemap-generation rule, robots directive, AdSense eligibility rule, clinical claim, calculator math, production setting, or environment variable was changed.

## Release standard

Before merge, verify TypeScript, lint, the full test suite, production build and route gates, exact-head Vercel preview, desktop and phone navigation, real state-changing interactions, 404 recovery, internal link destinations, horizontal overflow, and application console errors.
