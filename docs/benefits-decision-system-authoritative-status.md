# Healthcare Worker Benefits Decision System — Authoritative Status

Last verified: August 6, 2026

This document is the source of truth for the public acquisition layer, working pilot, premium foundation, certification state, commerce controls, privacy boundaries, SEO state, and next growth actions. Future work must revalidate this document against current production, `main`, infrastructure, and tests before recommending changes.

## Executive verdict

The Healthcare Worker Benefits Decision System is not an unbuilt concept. CAF already has:

- a substantive public product explanation;
- a working eight-stage browser-local open-enrollment pilot;
- a browser-local source assistant for general plan excerpts that blocks sensitive-looking content, discards raw text, and saves only user-confirmed structured values;
- visible unknowns and verification tasks;
- calculations, progress, mobile navigation, and a printable Benefits Decision Brief with decision drivers, assumptions, change triggers, and a source-readiness ledger;
- a clear free-versus-paid boundary;
- a private-ready authentication, workspace, entitlement, and Stripe architecture behind disabled gates.

The product is suitable for controlled public pilot distribution after the current reconciliation PR is merged and production is verified. It is **not ready for live sales** because test-mode checkout, webhook, entitlement, refund, session, and workspace certification remain incomplete or externally unverified.

## Canonical public architecture

### Broad healthcare-worker hub

- Route: `/healthcare-workers`
- Purpose: broad audience orientation, free education, calculators, career and retirement pathways, and a concise flagship explanation.
- Indexing: indexable.
- Product handoff: links to the complete public pilot.

### Dedicated product and pilot page

- Canonical route: `/products/healthcare-worker-benefits-decision-system`
- Purpose: product-specific search, sharing, evaluation, pilot use, price-qualified interest, and future commercial conversion.
- Indexing target after merge: `index, follow, max-image-preview:large`.
- Sitemap target after merge: included by `scripts/generate-sitemap.mjs`.
- Structured data: `BreadcrumbList` and factual `WebApplication` markup for the free public pilot.
- Retired alias: `/products/healthcare-worker-benefits-decision-pack` permanently redirects to the canonical product route.

### Private application

- Routes: `/app`, `/app/benefits-decision`, workspace routes, `/account`, `/sign-in`, and `/access-processing`.
- Purpose: authenticated account, entitlement, workspace, and retained decision functionality.
- Indexing: noindex and private-cache controls remain required.
- Access: server-verified authentication and entitlement only. URL parameters, browser flags, and success pages do not grant access.

## Working public pilot

The existing pilot carries a visitor through eight coordinated stages:

1. Enrollment event and deadline
2. Household coverage and priorities
3. Document readiness and missing information
4. Medical and prescription exposure
5. HSA, HRA, FSA, and dependent-care choices
6. Dental, vision, disability, life, and supplemental benefits
7. Retirement contributions, employer value, and vesting
8. Verification list and printable election plan

### Current pilot capabilities

- one understandable stage at a time;
- required-field validation;
- explicit missing-information states;
- verification-task generation;
- transparent calculations and assumptions;
- progress visibility;
- mobile navigation;
- browser-local answers;
- printable final election plan;
- browser-local plain-text source assistance with explicit user confirmation and no automatic source-readiness inference;
- supported, provisional, and verification-required decision-trace states;
- clear statement that CAF does not submit elections.

### Pilot privacy behavior

- No account is required for the public pilot.
- No payment is collected.
- No raw benefit document is uploaded or stored.
- General plan excerpts selected or pasted into the source assistant are analyzed locally and discarded after analysis.
- Only user-confirmed structured values, source category, and fact-key provenance are retained in browser-local state.
- Source excerpts do not automatically mark a controlling source group ready; the user must assess readiness separately.
- No medical records, member IDs, credentials, claim files, or payment-card data are requested.
- Official employer, carrier, administrator, and plan documents control.

## Premium foundation

### Implemented in code or infrastructure

- Supabase magic-link authentication abstraction;
- server bearer-token validation;
- profiles, products, entitlements, workspaces, Stripe events, protected modules, and admin tables;
- RLS-enabled database architecture;
- server-side entitlement checks;
- protected workspace APIs;
- protected module-delivery foundation;
- Stripe Checkout endpoint with server-side product and price mapping;
- signed raw-body Stripe webhook and idempotency logic;
- refund and revocation transitions;
- browser-local source-assistance doctrine;
- default-off feature and authorization flags;
- privacy-conscious analytics foundations.

### Production-disabled capabilities

- public paid checkout;
- real customer charges;
- production entitlements;
- production account access;
- production workspace persistence;
- protected premium-module access;
- real benefit-document upload or server processing;
- production commerce authorization.

## Supabase certification state

Project: `CAF Project` (`uzfcvtgnpkvuapgrkfcb`)

Verified August 6, 2026:

- project status: active and healthy;
- PostgreSQL 17;
- premium, Stripe-hardening, growth-evidence, offer-validation, employer-benefits, and prelaunch document-quarantine migrations applied;
- RLS enabled on all reviewed public application tables;
- current persistent rows include one product and zero profiles, entitlements, workspaces, Stripe events, premium modules, or premium admins;
- the dormant document-quarantine table contains zero rows.
- all reviewed public tables retain RLS; the advisor reports only informational no-policy notices for intentionally service-role-only or deny-by-default tables in this scope.

The Supabase security advisor reports informational `RLS enabled, no policy` notices on deliberately service-role-only or deny-by-default tables. These notices must be evaluated against the intended access model before any policy is added. They are not authorization to expose tables publicly.

### Remaining Supabase validation

- controlled magic-link request and redirect testing;
- session restoration, expiration, sign-out, and revocation;
- workspace create, save, reload, export, archive, delete, stale-write, and concurrency tests;
- cross-device resume;
- current two-user RLS and IDOR revalidation;
- account deletion and revoked-user cleanup;
- protected-module seed and retrieval in test scope.

## Stripe certification state

Connected Stripe account: Community Acquired Finance.

Verified August 5, 2026:

- a correctly named Healthcare Worker Benefits Decision System product exists;
- its default one-time price is $29 USD;
- the discovered product and price are live-mode objects;
- product metadata identifies the correct CAF application and product key;
- no live write, charge, refund, entitlement, or checkout action was performed during this review.

The existing live-mode catalog object is **not test-mode certification evidence**. The release remains blocked until the exact test-mode product and price are verified and the protected test workflow passes.

### Remaining Stripe validation

- exact test-mode product and one-time $29 price;
- protected test Checkout session creation;
- safe success and cancel URLs;
- signed webhook verification;
- immediate and asynchronous success and failure;
- duplicate, replayed, retried, and out-of-order events;
- refund, revocation, and restoration;
- confirmation that client parameters and success URLs cannot grant access;
- controlled end-to-end test purchase with evidence.

## Commerce state

- Standard price in registry: $39.
- Planned launch or validation price: $29 one time.
- Public checkout: disabled.
- Product registry state: `private_ready`.
- Stripe environment allowed for current certification work: test only.
- Production commerce authorization: not granted.
- Founder approval required before any live activation.

## Public messaging contract

All surfaces must state accurately:

- free CAF education and public tools remain free;
- the public pilot is working and free to try;
- the planned paid value is account-based continuity, source status, saved progress, coordinated decisions, verification work, and a retained Benefits Decision Brief;
- checkout and paid access remain off during certification;
- CAF does not submit elections or determine official eligibility or coverage;
- the user must verify and submit final elections through the employer or benefits administrator.

## SEO state

- Dedicated canonical product route retained.
- Product route returns indexable HTML and no production `X-Robots-Tag: noindex` header.
- Conflicting product-route `X-Robots-Tag: noindex` removed.
- Product route included in generated sitemap.
- Factual `WebApplication` and breadcrumb structured data added.
- Private application and account routes remain noindex.
- Healthcare-worker hub remains the broad topical hub and links to the complete pilot.

Do not add paywall markup to personalized application routes. Do not publish a commercial `Offer` claiming availability until checkout is genuinely active.

## Measurement funnel

Use stable, consent-respecting events without benefit values or personal data:

1. healthcare-worker hub view
2. product-section view
3. product-page view
4. pilot CTA click
5. pilot start
6. stage progression
7. meaningful pilot completion
8. decision-brief print or generation
9. price-qualified interest form view
10. interest form start
11. interest submission
12. sign-in start and completion when enabled
13. checkout start and completion in protected test or later production scope
14. entitlement activation
15. first workspace creation
16. retained decision-brief completion

Never send employer names, plan names, premiums, deductibles, prescriptions, document text, medical information, names, emails, member IDs, account IDs, tokens, or workspace content to analytics.

## Thirty-day controlled validation plan

### Week 1 — Release reconciliation

- Merge only after checks pass.
- Verify canonical route, metadata, headers, sitemap, structured data, pilot, and private-route protection on production.
- Request Search Console indexing for the dedicated public product route.

### Week 2 — Founder and close-network testing

- Run the full pilot with synthetic or deliberately non-sensitive scenarios.
- Recruit a small number of healthcare workers preparing for enrollment or comparing benefits.
- Record confusion points, abandonment stages, missing decisions, and whether the printable output is useful.

### Week 3 — Targeted distribution

Share the free pilot with a small, high-fit group of:

- nursing career communities;
- nursing-school career or financial-wellness offices;
- healthcare career coaches;
- benefits educators;
- nurse-focused newsletters or podcasts;
- local professional nursing groups.

Lead with usefulness and feedback. Do not ask for confidential documents by email and do not conduct backlink spam.

### Week 4 — Evidence review

Separate three decisions:

- SEO: is the indexed route earning impressions, links, and relevant entry traffic?
- Product: do real users start, progress, finish, and value the decision brief?
- Revenue readiness: are test checkout, entitlement, refund, support, and policy gates certified?

Do not enable paid acquisition or live checkout merely because the product page is indexable.

## Work intentionally not repeated

This reconciliation did not rebuild:

- the eight-stage pilot;
- the guided forms and calculations;
- the printable election plan;
- the free benefits tools;
- the public product explanation;
- the early-access form;
- the authentication abstraction;
- the database foundation;
- the entitlement service;
- the workspace APIs;
- the Stripe Checkout and webhook architecture;
- the privacy-minimized browser-local source doctrine;
- the broader website or navigation.

## Ranked next actions

1. **Engineering/release:** complete exact-head preview checks and verify the source assistant, Benefits Decision Brief, indexable route, and private-route boundaries on production.
2. **Engineering/security:** finish controlled Supabase authentication, workspace, RLS, and entitlement certification.
3. **Engineering/operations:** create or verify the exact Stripe test-mode product and price and complete the webhook/refund matrix without live charges.
4. **Founder/product:** distribute the free pilot to a small group of healthcare workers and collect structured workflow feedback.
5. **SEO/growth:** monitor the dedicated product route and connected benefits pages for impressions, pilot starts, completions, and qualified interest.

## Release gate

The product may move from controlled pilot to live sales only after:

- all required automated checks pass;
- preview and production route behavior is verified;
- authentication and workspace tests pass;
- Stripe test-mode purchase, webhook, refund, and revocation tests pass;
- terms, privacy, refund, and support expectations match implementation;
- explicit founder authorization is recorded;
- production checkout and authorization flags are intentionally enabled in a separate release.
