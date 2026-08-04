# Stripe prelaunch certification

Last updated: July 27, 2026

## Purpose

This document is the payment-readiness source of truth for the **Healthcare Worker Benefits Decision System**. It records the implemented authority boundaries, provider evidence, remaining external gates, rollback procedure, and founder-controlled activation path.

This document does not authorize commerce. Checkout and production authorization remain disabled until a separate founder launch decision.

## Certified product mapping

| Field | Certified value |
|---|---|
| Product name | Healthcare Worker Benefits Decision System |
| Canonical product key | `healthcare-worker-benefits-decision-system` |
| Public route | `/products/healthcare-worker-benefits-decision-system` |
| Application route | `/app/benefits-decision` |
| Access model | One-time purchase |
| Currency | USD |
| Amount | $29.00 |
| Stripe Product | `prod_Uxp2XvStVfkORZ` |
| Stripe Price | `price_1TxtO1JzRBBRg03YhueOeMsz` |
| Stripe object mode | Live |
| Product release metadata | `prelaunch` |

Provider inspection on July 27, 2026 confirmed that the Product and Price are active, the Price is one-time, the amount is 2,900 cents USD, the Product and Price share the canonical product-key metadata, and no second active Stripe Product exists in the connected account.

The existence of live objects does not authorize their use. Live Checkout requires complete external validation and both founder-controlled server flags.

## Checkout authority boundary

`POST /api/checkout`:

1. accepts only `POST`;
2. applies private, no-store, noindex headers;
3. enforces the configured browser origin;
4. fails closed unless authentication, entitlement enforcement, Supabase, Stripe, and checkout controls are safe;
5. requires a verified Supabase user;
6. accepts an object containing exactly one field: the canonical `productKey`;
7. rejects client-supplied prices, amounts, currencies, return URLs, customer IDs, entitlement states, and all additional fields;
8. retrieves the configured Stripe Price server-side and expands its Product;
9. verifies exact mode, Product ID, Price ID, active state, one-time type, currency, amount, name, and metadata;
10. validates or creates the Stripe Customer associated with the authenticated application user;
11. blocks duplicate purchases for active access and recent duplicate processing attempts;
12. creates a Stripe-hosted Checkout Session with dynamic payment methods;
13. includes a random-suffixed Stripe `integration_identifier`;
14. places only the application user ID, canonical product key, and environment in Stripe metadata;
15. uses server-controlled success and cancellation URLs;
16. records only a non-authoritative `processing` entitlement before payment confirmation;
17. returns only the hosted Checkout URL or a bounded customer-safe error.

A test-mode Checkout initiation no longer produces a `test` entitlement. Test access requires a verified successful Stripe test payment event or an explicit trusted administrative test grant.

## Webhook authority boundary

`POST /api/stripe/webhook`:

- receives the raw request body;
- verifies the `Stripe-Signature` before processing authority-bearing data;
- validates Stripe mode before an entitlement transition;
- claims each Stripe event ID under a unique database key;
- acknowledges already processed or concurrently claimed duplicates without repeating fulfillment;
- allows a failed event to be retried by only one worker;
- retrieves Checkout Sessions and necessary linked objects from Stripe rather than trusting the webhook copy;
- validates the Session, Customer, line item, Product, Price, amount, currency, PaymentIntent, metadata, and environment relationships;
- validates refund Charge and PaymentIntent relationships;
- prevents an older failure from revoking a newer Checkout attempt;
- records only stable bounded failure codes rather than full provider payloads;
- applies ordered entitlement transitions so stale events cannot overwrite newer authoritative state.

### Event contract

| Stripe event | Required behavior |
|---|---|
| `checkout.session.completed` | Grant only when `payment_status=paid`; otherwise remain processing |
| `checkout.session.async_payment_succeeded` | Grant after full object validation |
| `checkout.session.async_payment_failed` | Revoke only the matching non-valid processing attempt |
| `payment_intent.payment_failed` | Revoke only the matching non-valid processing attempt |
| `charge.refunded` | Remove access only for a verified full refund |
| Any other event | Record as ignored; do not change access |

Events from the wrong Stripe mode are acknowledged as ignored and cannot mutate entitlements.

## Entitlement transition matrix

| Current state | Trigger | Result |
|---|---|---|
| none | Checkout initiated | `processing` |
| processing | Verified live payment success | `active` |
| processing | Verified test payment success | `test` |
| processing | Matching payment failure | `revoked` |
| active/test | Later unrelated payment failure | Preserve valid access |
| active/test | Verified full refund | `refunded` |
| active/test | Administrative revocation | `revoked` |
| refunded/revoked | Verified legitimate repurchase | `active` or `test` according to mode |
| any | Duplicate Stripe event ID | No second transition |
| any | Stale or mismatched event | Ignore transition |
| any | Invalid signature, object, amount, currency, mode, metadata, or relationship | No access change |

A partial refund does not change access in the first release. Any future partial-refund access rule requires an approved policy and implementation change.

## Database hardening

The version-controlled migration exactly matches the version recorded by Supabase:

```text
supabase/migrations/20260727185507_stripe_prelaunch_hardening.sql
```

Applied migration:

```text
20260727185507 stripe_prelaunch_hardening
```

It adds:

- `entitlements.last_stripe_event_created_at`;
- `entitlements.last_stripe_event_id`;
- a constraint requiring the event-order fields to be present or absent together;
- a partial index supporting event-order reconciliation.

Existing unique protections remain for:

- `(user_id, product_key)`;
- Stripe Checkout Session ID when present;
- Stripe PaymentIntent ID when present;
- Stripe event ID.

RLS remains enabled on every public premium table. Ordinary authenticated users cannot write entitlements or directly access Stripe events, products, protected modules, or premium administrators.

## Environment-variable contract

### Public browser variables

```text
VITE_PUBLIC_SUPABASE_URL
VITE_PUBLIC_SUPABASE_ANON_KEY
VITE_PREMIUM_AUTH_ENABLED
```

No secret may use a `VITE_` prefix.

### Server-only Supabase variables

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Server-only Stripe variables

```text
STRIPE_ENVIRONMENT
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRODUCT_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM
STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM
```

Prefer a restricted Stripe key when its permissions support Product read, Price read, Customer read/write, Checkout Session read/write, and PaymentIntent read. A standard secret key remains supported when a restricted key cannot satisfy the required operations.

### Founder-controlled release flags

```text
PREMIUM_AUTH_ENABLED
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED
PREMIUM_ENTITLEMENTS_ENABLED
PREMIUM_CHECKOUT_ENABLED
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED
VITE_PREMIUM_AUTH_ENABLED
```

Safe production defaults:

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

## External configuration status

| Item | Status on July 27, 2026 |
|---|---|
| Stripe account and business onboarding | Founder reports complete |
| Live Product and Price | Verified |
| Duplicate active Stripe Products | None found |
| Hosted Stripe webhook endpoints | None present |
| Hosted webhook signing secret in Vercel | Not configured through available tooling |
| Vercel Stripe environment variables | Values not readable or writable through the connected actions used in this pass |
| Stripe test Product and Price | Unverified |
| Stripe test end-to-end transaction matrix | Not completed |
| Stripe Tax registrations | None present in the connected account |
| Automatic tax | Disabled |
| Public checkout | Disabled |
| Production authorization | Disabled |

Do not create a hosted webhook endpoint until its returned signing secret can be installed immediately in the correct Vercel environment. An endpoint without durable secret configuration is incomplete.

## Test evidence

### Completed

- exact live Stripe Product and Price inspection;
- no duplicate active Product inspection;
- confirmation that the connected account has no Tax registrations;
- checkout request allowlist tests;
- exact Product, Price, Customer, Session, PaymentIntent, Charge, amount, currency, mode, and metadata validation tests;
- regression test proving test Checkout initiation does not grant access;
- immediate, pending, failed, refund, ignored, duplicate, retry, stale-attempt, and relationship transition tests;
- partial-versus-full refund tests;
- private-route and client-bundle boundary checks;
- Supabase migration application, history alignment, constraint verification, and clear security advisors;
- existing two-user RLS/IDOR matrix: 14 of 14 checks passed;
- CI, production build, unit, premium browser/mobile/print/accessibility, and decision-journey workflows on the PR branch;
- Vercel preview deployment reached `READY`;
- preview public product page continued to state that checkout is disabled;
- no grouped production runtime errors for the payment/access routes in the available seven-day window.

### Required before payment-ready certification

- configure an isolated Stripe test Product, Price, restricted key, and hosted test webhook;
- install test values in the correct Vercel preview scope;
- enable authentication, persistence, entitlements, and checkout only in the controlled test scope;
- run immediate success, authentication-required, declined, asynchronous success/failure, cancellation, browser-close, duplicate, failed-retry, refund, revocation, and repurchase tests;
- verify workspace and protected-content access before and after each transition;
- inspect Stripe, Vercel, and Supabase logs;
- remove synthetic test users and records or preserve only approved fixtures;
- return all production flags to disabled values.

## Tax gate

Stripe returned no active, scheduled, or expired Tax registrations for the connected account. Automatic tax therefore remains disabled. Before tax calculation or collection is enabled, the founder must obtain qualified guidance, complete any required registration, select the correct product tax treatment, and configure Stripe Tax consistently.

## Rollback procedure

If the hardening release causes an unexpected defect:

1. confirm `PREMIUM_CHECKOUT_ENABLED=false` and `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false`;
2. roll Vercel production back to the prior known-good deployment;
3. do not remove the nullable Stripe event-order columns during an incident;
4. inspect Vercel function logs and `stripe_events` statuses;
5. leave failed events available for controlled retry after repair;
6. use a new versioned migration for any database correction;
7. verify public routes and private fail-closed behavior before ending containment.

## Founder activation runbook

Activation is a separate controlled release.

### 1. Technical readiness

- all repository checks pass;
- test-mode purchase and refund matrix passes;
- protected content is governed and seeded;
- authentication, account deletion, persistence, cross-device resume, and revocation are externally validated;
- live webhook endpoint is configured and signature verification is proven;
- production secrets exist only in encrypted server scopes.

### 2. Policy approval

The founder approves final price, terms, refund and partial-refund policy, privacy and retention, support process, product content, and accessibility evidence.

### 3. Tax decision

Determine registration and collection obligations with qualified guidance. Enable Stripe Tax only after applicable registrations and product treatment are configured.

### 4. Public-copy release

Change early-access copy to an active offer only after all other gates pass. Display price, terms, refund policy, privacy, support, and the exact customer deliverable.

### 5. Configure live infrastructure while checkout remains off

- set `STRIPE_ENVIRONMENT=live`;
- install the approved restricted or secret live key;
- install the live webhook signing secret;
- map the certified live Product and Price IDs;
- set `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=true`;
- keep `PREMIUM_CHECKOUT_ENABLED=false`;
- deploy and run readiness, release, schema, API, build, boundary, browser, and smoke checks.

### 6. Controlled first transaction

After written founder authorization, set `PREMIUM_CHECKOUT_ENABLED=true` for the controlled release. Complete one approved transaction and verify payment, signed webhook delivery, one entitlement only, protected access, receipt/support details, refund/revocation, and clean logs.

### 7. Monitor and roll back

Monitor the first transactions closely. If any fulfillment, duplicate, refund, privacy, or support defect appears, turn checkout off immediately. Disabling checkout prevents new sessions while preserving webhook processing for already-created payments.

## Current verdict

**Hardened Stripe prelaunch backend under external test validation.**

The code and live database are strengthened, and the canonical live Stripe Product and Price are verified. The system is not certified as fully payment-ready because hosted webhook configuration, Vercel secret configuration, and the full Stripe test-mode transaction matrix remain unverified. Public checkout and real customer charging remain disabled.
