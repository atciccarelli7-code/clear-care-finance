# CAF Growth & Revenue Operating System v1

**Effective:** July 13, 2026  
**Owner:** Andrew Ciccarelli, RN, BSN  
**Status:** Operational foundation. This document activates no ads, affiliates, sponsors, leads, or partner placements.

## Purpose

Operate Community Acquired Finance as an evidence-driven publishing, product, retention, and revenue system. Reuse the existing analytics, newsletter, route, AdSense, commercial-registry, CI, search-readiness, and deployed-site safeguards. Do not create parallel systems.

## Living artifacts

- Growth dashboard: https://docs.google.com/spreadsheets/d/1RhuPUq2Jl7SRvtz23LqNligx43XH_ZM2iszdl6xD88s
- Partnership and revenue standard: https://docs.google.com/document/d/1LO9uylzIpCJTv1kuUFQyxl3uyA2tya9MiXgJd3bUtFA

The dashboard contains the Executive Scorecard, Weekly Funnel, Search Baseline, Newsletter, Partnership Pipeline, Ad Readiness, Experiment Log, and Data Dictionary. Blank cells mean **unverified**, not zero.

## Weekly review order

1. **Reliability:** GitHub checks, Vercel state, deployed-site smoke tests, runtime errors, routes, canonicals, sitemap, and security headers.
2. **Acquisition:** organic clicks, brand versus non-brand demand, positions 8–30, referrals, and indexation.
3. **Activation:** Concierge use, article-to-tool opens, tool starts, completions, and approved result actions.
4. **Retention:** confirmed newsletter subscriptions, delivery, bounces, unsubscribes, returning users, and resumed local work.
5. **Partnerships:** buyer role, problem, objection, interest, next step, owner, date, and scope.

A critical reliability, privacy, or measurement failure blocks growth and monetization work.

## Evidence rules

- Record only observed values with a system of record or evidence link.
- Event implementation is not proof of production delivery or adoption.
- Improve pages already earning impressions before building overlapping content.
- Keep emails and entered tool values outside analytics.
- Do not treat route count, documentation volume, prerender success, or build success as user adoption.

## Decision gates

### Advertising scale

Do not optimize ad density until CAF records at least **25,000 monthly ad-eligible content pageviews for three consecutive months** and can test placements without materially reducing performance, readability, completion, accessibility, or trust. This is an internal CAF gate, not a Google requirement.

### Organization infrastructure

Do not build organization accounts, dashboards, integrations, document ingestion, administration, or employer-specific logic before:

- 10 qualified discovery conversations;
- 3 serious pilot evaluations;
- 1 written pilot commitment.

Afterward, build only the minimum required for the accepted pilot.

### Personalized ads

Do not enable personalized ads for EEA, UK, or Swiss visitors until a Google-certified consent management platform and required controls are configured and verified.

### First commercial placement

A paid placement requires:

- partner due diligence;
- fixed partner and campaign IDs;
- an approved route group and exact placement;
- HTTPS destination;
- adjacent plain-English disclosure;
- `rel="sponsored nofollow noopener"` for commercial links;
- aggregate measurement and guardrails;
- dates, owner, review date, and termination triggers;
- CI, preview, route-protection, mobile/desktop, runtime, and deployed-site validation;
- owner approval and required professional review.

## Route policy

Potentially eligible after individual review:

- substantial educational articles;
- selected general topic guides;
- selected non-sensitive resource directories.

Always ad-free and placement-free:

- all `/tools` routes;
- inputs, results, Receipts, My Plan, and saved-work surfaces;
- `/start-here`;
- newsletter and contact flows;
- legal, trust, privacy, methodology, disclosure, and accessibility pages;
- `/for-organizations` and pilot demonstrations;
- printable workflows;
- any route outside the approved publisher-content allowlist.

## Initial ad specification

- No above-the-fold display ad.
- No sticky mobile ad.
- No ad beside navigation, buttons, forms, calculators, checklists, or result actions.
- At most one placement after a meaningful opening section and one near the end of a long article.
- No deceptive alignment, accidental-click design, or material layout shift.
- Evaluate revenue together with performance, engagement, completion, and trust.

## Discounts hub release rule

PR #174 is currently a non-affiliate, non-sponsored acquisition asset. Before release it must:

- inherit the current `main` design system;
- retain direct official links and explicit non-affiliate language;
- store only bounded offer IDs locally;
- keep calculator inputs out of analytics;
- use fixed reviewed event values;
- display eligibility, verification, exclusions, and checkout cautions;
- avoid commercial pay-to-rank logic;
- remain useful if all future paid relationships are removed;
- pass complete CI, search, preview, mobile, accessibility, performance, route, and runtime validation.

Any future paid listing requires a separate commercial-registry record and disclosure review. It must not be added silently to directory data.

## Next-build rule

Prioritize in this order:

1. critical defects;
2. failed measurement or privacy boundaries;
3. indexing and discoverability;
4. conversion friction;
5. retention weakness;
6. buyer validation;
7. only then, a new product workflow.

A future feature should materially improve at least two of acquisition, activation, retention, and revenue—or solve a critical trust, compliance, accessibility, or reliability problem.

## Authenticated evidence still required

These items cannot be marked complete without owner-dashboard access:

- GA4 production event delivery and payload inspection;
- Search Console exports and indexing actions;
- newsletter delivery and unsubscribe evidence;
- AdSense approval and exact `ads.txt` seller line;
- certified CMP configuration.

Until verified, corresponding dashboard cells remain **UNVERIFIED**.

## Controlling repository references

- `docs/commercial-readiness-foundation.md`
- `docs/caf-analytics-event-dictionary.md`
- `docs/caf-survival-and-revenue-gates.md`
- `docs/caf-product-readiness-standard.md`
- `docs/privacy-safe-measurement-plan.md`
- issues #152, #124, #38, and #13

Any PR changing ads, affiliates, sponsorships, consent, commercial disclosures, paid placement, partner data, or protected-route behavior must identify the controlling gate, explain route and privacy impact, document the registry change, remain draft through complete review, and receive an exact-head preview. A passing build alone is never sufficient approval.