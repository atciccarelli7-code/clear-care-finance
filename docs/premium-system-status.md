# Premium system implementation status

Last updated: July 24, 2026

## Current verdict

**Foundation only**

Paid access is not active. Checkout is disabled. No live payment capability is authorized.

## What is implemented

- Canonical public product page:
  - `/products/healthcare-worker-benefits-decision-system`
- Permanent redirect:
  - `/products/healthcare-worker-benefits-decision-pack`
- Noindex account and access routes:
  - `/sign-in`
  - `/account`
  - `/access-processing`
- Noindex application routes:
  - `/app`
  - `/app/benefits-decision`
  - `/app/benefits-decision/new`
  - `/app/benefits-decision/:workspaceId`
- Generic application shell with:
  - workspace dashboard;
  - eight-module navigation;
  - progress;
  - accessible structured forms;
  - validation;
  - transparent calculations;
  - unknown-item verification questions;
  - unsaved-change warning;
  - save and network failure states;
  - mobile navigation;
  - browser-print decision brief.
- Supabase browser authentication abstraction.
- Supabase bearer-token validation for functions.
- Database migration for profiles, products, entitlements, workspaces, Stripe events, protected modules, and explicit admins.
- RLS and grants that deny entitlement and protected-content mutation to ordinary users.
- Server-side entitlement service and transitions.
- Protected module-content endpoint.
- User-scoped workspace APIs.
- Stripe Checkout endpoint with server-only price mapping.
- Signed raw-body Stripe webhook with event idempotency.
- Default-off release flags and configuration validation.
- Human and JSON readiness report.
- Schema, release, and production-bundle boundary checks.
- Premium unit and browser test suites.
- Privacy-conscious analytics taxonomy.
- Updated Privacy Policy, Terms, product hub, internal links, SEO registry, sitemap generation, and redirect controls.

## What is available to a visitor now

On the deployed safe foundation, a visitor can:

- read the public interactive-system product page;
- review the intended workflow and representative interface;
- see the exact early-access status;
- see that the expected $29 price is not an active offer;
- join the early-access email list;
- use the rest of the existing public Community Acquired Finance site.

A visitor cannot:

- create a real account;
- enter the protected application;
- create a production workspace;
- retrieve premium module content;
- start checkout;
- pay;
- receive an entitlement.

Private routes show controlled unavailable or signed-out states and do not expose premium content.

## Coded but disabled

| Capability | Code status | Activation state |
|---|---|---|
| Supabase magic-link authentication | Implemented | Disabled |
| Server token validation | Implemented | Disabled by missing external configuration |
| PostgreSQL workspace persistence | Implemented | Disabled |
| RLS | Migration implemented | Not applied to a live project from this repository |
| Entitlement enforcement | Implemented | Disabled |
| Protected module delivery | Implemented | No production module rows |
| Stripe test Checkout | Implemented | Disabled; no keys or price |
| Stripe webhook | Implemented | Disabled; no signing secret |
| Refund/revocation transitions | Implemented | Not externally tested |
| Account-based cross-device resume | Implemented | Not externally tested |
| Development demo | Implemented | Local Vite development only; excluded from production |

## Requires Supabase configuration

- create the owner-controlled Supabase project;
- apply the version-controlled migration;
- configure email magic-link authentication;
- configure exact production and approved preview redirect URLs;
- place public and server keys in correct Vercel scopes;
- explicitly provision test administration;
- create test entitlements through trusted logic;
- seed protected test module rows;
- run two-user RLS and IDOR tests;
- validate cross-device persistence;
- finalize and test account deletion.

## Requires Stripe configuration

- complete Stripe account setup;
- use test mode;
- create the exact one-time test product;
- create the approved one-time test price;
- configure test secret key;
- register the signed webhook endpoint;
- configure hosted endpoint signing secret;
- run immediate, async, failure, duplicate, refund, and revocation tests;
- approve refund and support policies.

Live Stripe keys, product, price, webhook, and checkout activation require a separate explicit owner authorization after all test gates.

## Requires Vercel configuration

- add Supabase public values;
- add server-only Supabase values;
- add server feature flags;
- add Stripe test values only after private authentication testing;
- keep checkout off in Production;
- redeploy after every environment change;
- run preview and production smoke tests;
- document secret rotation and rollback evidence.

No Vercel Pro feature is required.

## Remains unbuilt or unapproved

- owner-controlled external Supabase project;
- applied live migration confirmation;
- production protected module dataset;
- production authentication validation;
- owner-approved customer terms and refund policy;
- staffed support process;
- production account deletion workflow;
- Stripe test product/price and test keys;
- signed hosted webhook;
- complete Stripe test matrix;
- complete live purchase/refund/revocation validation;
- explicit checkout authorization;
- active-purchase public copy.

## Release controls

Safe defaults:

```text
PREMIUM_AUTH_ENABLED=false
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=false
PREMIUM_ENTITLEMENTS_ENABLED=false
PREMIUM_CHECKOUT_ENABLED=false
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false
STRIPE_ENVIRONMENT=disabled
VITE_PREMIUM_AUTH_ENABLED=false
VITE_PREMIUM_DEV_MOCK_AUTH=false
```

Readiness:

```bash
npm run premium:readiness
npm run premium:readiness -- --json
```

Safety and quality:

```bash
npm run premium:release-check
npm run premium:schema-check
npm run premium:test
npm run build
npm run premium:boundary-check
npm run test:browser:premium
```

## Manual approval before payment

The owner must explicitly approve:

1. final product content;
2. final price;
3. customer terms;
4. refund policy;
5. privacy and retention;
6. support process;
7. accessibility evidence;
8. Stripe test evidence;
9. production authorization flag;
10. checkout feature flag;
11. controlled production transaction;
12. active-purchase public copy.

Until then, the correct verdict is **Foundation only**.
