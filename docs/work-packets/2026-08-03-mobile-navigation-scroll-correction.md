# Community Acquired Finance — Mobile Navigation Scroll Correction

## Assignment

- **Founder report:** The mobile dropdown menu does not scroll properly.
- **User outcome:** A mobile visitor can expand every Explore CAF group, vertically scroll the menu, and reach the final destination without the page or fixed bottom navigation trapping the gesture.
- **Scope:** Global mobile header navigation only.
- **Non-goals:** Navigation hierarchy changes, route changes, content changes, analytics changes, SEO changes, checkout, authentication, or database work.
- **Risk:** Low code risk; high usability relevance because the header is global.

## Direct current evidence

- Production and `main` use `Header.tsx` with the mobile panel rendered in normal header flow, a `100vh` maximum height, body-only scroll locking, and no mobile overscroll/touch-scroll containment.
- The existing browser suite verifies grouping and navigation at 320 × 760 and 390 × 844, but does not verify a short mobile viewport, actual internal scroll movement, the last menu action, or touch/overscroll CSS.
- The prior desktop correction in AND-100 explicitly preserved mobile behavior, so it does not establish mobile reliability.

## Inherited-decision challenge

The grouped Explore CAF architecture remains useful and is not reopened. The defect is implementation-specific: the menu must own a stable viewport-height scroll region. Passing ordinary-height mobile tests did not prove short-height or expanded-disclosure reachability.

## Implementation

1. Anchor the open mobile panel directly below the 4rem sticky header using an absolute viewport-height shell based on `100dvh`.
2. Make the navigation element the sole full-height vertical scroll owner.
3. Add vertical touch panning, contained overscroll, and iOS momentum scrolling.
4. Lock both the root and body while the menu is open, restoring each prior value on close.
5. Add bottom padding so the fixed mobile navigation cannot cover the final menu action.
6. Add a 320 × 568 Playwright regression that opens all groups, proves internal overflow, scrolls to Monthly email, and navigates successfully.

## Quantified impact

| Measure | Before | After |
|---|---:|---:|
| Public routes changed | 0 | 0 |
| Navigation destinations changed | 0 | 0 |
| Mobile short-height scroll regressions | 0 | 1 |
| Scroll-lock roots covered | 1 | 2 |
| Explicit mobile touch/overscroll controls | 0 | 3 |
| Production component files changed | 0 | 1 |

## Role and executive review

| Perspective | Status | Finding |
|---|---|---|
| Strategy / Product | PASS | Repair a global task blocker without expanding scope. |
| Healthcare user context | PASS | Mobile use is common during work and time-constrained decisions; complete reachability is functional. |
| Information architecture | PASS | Grouping and labels remain unchanged. |
| UX / Frontend | PASS | One viewport-owned scroll surface replaces nested document-flow dependence. |
| Accessibility / Reliability | PASS pending CI | Focus trap and Escape return remain; short-height reachability gains an exact regression. |
| Performance | PASS pending build | CSS/state-only change; no dependency or route bundle added. |
| Privacy / Analytics | PASS | Event contract and collected dimensions unchanged. |
| SEO / Editorial / Monetization | NOT IMPLICATED | No public claims, URLs, indexability, ads, or commerce change. |
| Quality / Red team | PASS pending CI | Test opens the maximum-content state and requires actual positive scrollTop before navigation. |
| Process improvement | PASS | Mobile release matrix now includes a short-height expanded-menu case. |

## Release gates

- Unit tests, lint, build, governance, and complete CI pass.
- Mobile browser certification passes at 320 × 568, 320 × 760, and 390 × 844 coverage.
- Preview deployment is READY.
- No unresolved review thread.
- Production deployment is READY and the live menu route returns successfully.
- No runtime error appears after release.

## Rollback

Revert the correction pull request. No data, route, environment, or migration rollback is required.
