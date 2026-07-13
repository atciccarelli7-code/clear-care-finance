# CAF Commercial Readiness Foundation

**Effective date:** July 13, 2026  
**Status:** Infrastructure only; no revenue placement is configured or active.

## Purpose

Prepare Community Acquired Finance for future display advertising, sponsorship, or affiliate revenue without allowing commercial incentives to alter educational logic, official-source selection, user answers, tool results, privacy boundaries, or sensitive healthcare and financial workflows.

The controlling principle is:

> Revenue may use approved publisher-content surfaces after trust and demand exist. Revenue may not enter decision logic, personalized tools, Receipts, My Plan, contact flows, or sensitive healthcare workflows.

## Reusable execution prompt

Use the following prompt for future compounding-foundation work:

> Inspect the current Community Acquired Finance production deployment, GitHub repository, open issues, analytics architecture, content registries, source governance, privacy controls, ad protections, email capture, and organization pathway. Identify the highest-leverage work that improves retention, measurement, distribution, reliability, or future commercial readiness without adding speculative product surface, collecting sensitive information, weakening trust, duplicating an authoritative system, or activating monetization prematurely. Reuse existing registries and shared components. Implement only bounded, reversible changes on a dedicated branch; add automated tests and documentation; verify GitHub CI and a Vercel preview; distinguish implemented, tested, deployed, observed, and commercially validated; create or update focused issues for work blocked by credentials, external reporting, domain ownership, or real-user evidence. Never fabricate traffic, revenue, customers, rankings, analytics, or partner demand.

## Architecture

The commercial placement registry lives at:

- `src/lib/commercialPlacements.ts`

It supports three future placement types:

- `display_ad`
- `sponsor`
- `affiliate`

Every placement has a fixed status:

- `disabled`: configuration may exist but cannot render;
- `testing`: structurally complete for controlled preview testing but cannot render through the production resolver;
- `active`: may render only when all validation, route, and schedule requirements pass;
- `expired`: cannot render.

The registry intentionally starts empty.

## Route protection

Commercial placement eligibility reuses the existing route-aware AdSense allowlist. This creates one conservative publisher-content boundary rather than a second competing route policy.

Eligible route groups are limited to:

- individual articles already approved for advertising;
- individual topic pages already approved for advertising;
- specifically reviewed guide and hub routes already approved for advertising.

The following remain commercially ineligible by construction:

- every `/tools` route, including future tools;
- `/start-here` and local planning workspaces;
- newsletter and contact flows;
- the organization inquiry page;
- privacy, disclosure, and policy pages;
- printable or result-oriented workflows;
- any route not already reviewed through the existing advertising allowlist.

## Activation requirements

A placement in `testing` or `active` status must have:

- a fixed lowercase placement ID;
- a fixed lowercase partner ID;
- a fixed lowercase campaign ID;
- at least one approved route group;
- an HTTPS destination;
- an adjacent disclosure label;
- valid optional start and end dates, with start earlier than end.

Production resolution additionally requires:

- status exactly equal to `active`;
- current time within the configured campaign window;
- the current path to map to an approved publisher-content route group.

Commercial outbound links must use:

`rel="sponsored nofollow noopener"`

## Required review before the first placement

Before adding the first non-empty registry entry:

1. Document the partner and reader value proposition.
2. Confirm the destination is reputable and appropriate for the page audience.
3. Confirm compensation terms do not depend on sensitive user answers or plan selection.
4. Confirm no ranking, calculator result, recommendation, source, or editorial conclusion changes.
5. Add a visible adjacent disclosure.
6. Add fixed privacy-safe analytics IDs; do not transmit partner names, user answers, amounts, diagnoses, eligibility states, employers, plans, or free text.
7. Add route-specific rendered tests for disclosure, link attributes, and absence from protected routes.
8. Verify the exact-head Vercel preview.
9. Obtain explicit approval before changing a placement from `testing` to `active`.
10. Record campaign start, end, removal owner, and post-campaign review.

## Measurement boundary

Future commercial analytics may use fixed categorical values such as:

- `placement_id`
- `campaign_id`
- `commercial_type`
- `route_group`
- `entry_surface`

They must not include:

- calculator inputs or outputs;
- Medicare, Medicaid, insurance, disability, or medical answers;
- income, salary, debt, balances, premiums, deductibles, contributions, or tax values;
- employer, provider, plan, carrier, medication, diagnosis, or procedure identity;
- email addresses, contact text, query strings, URL fragments, local-storage contents, or Receipt contents.

## Current state

- No commercial placement is configured.
- No UI component consumes the registry.
- No partner destination exists.
- No affiliate link exists.
- No sponsorship is implied.
- Existing route-aware AdSense behavior is unchanged.

This foundation is intentionally dormant until traffic, reader value, and an aligned opportunity justify activation.
