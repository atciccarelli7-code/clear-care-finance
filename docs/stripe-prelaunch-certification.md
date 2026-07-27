# Stripe prelaunch certification

Last updated: July 27, 2026

## Purpose

This document is the source of truth for payment readiness of the **Healthcare Worker Benefits Decision System**. It records what is implemented, what was verified externally, what remains unverified, and the exact founder-controlled activation path.

This document does not authorize commerce. The public site must continue to state that checkout is disabled until the founder completes the separate launch decision.

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

Provider inspection on July 27, 2026 confirmed that the product and price are active, the price is one-time, the amount is 2,900 cents USD, the product and price share the canonical product-key metadata, and no second active Stripe product exists in the connected account.

The existence of live objects is not authorization to use them. Live Checkout requires both founder-controlled server flags and complete external validation.

## Implemented payment boundary

`POST /api/checkout` now:

1. accepts only `POST`;
2. applies private, no-store, noindex headers;
3. checks the browser origin;
4. fails closed unless authentication, entitlement enforcement, Supabase, Stripe, and checkout flags are configured safely;
5. requires a verified Supabase user;
6. accepts an object containing exactly one field: the canonical `productKey`;
7. rejects client-supplied prices, amounts, currencies, return URLs, customer IDs, entitlement states, and all additional fields;
8. retrieves the configured Stripe Price server-side and expands its Product;
9. verifies exact mode, Product ID, Price ID, active state, one-time type, currency, amount, name, and metadata;
10. validates or creates the Stripe Customer associated with the authenticated application user;
11. blocks duplicate purchases for an already active entitlement and recent duplicate processing attempts;
12. creates a Stripe-hosted Checkout Session with dynamic payment methods;
13. includes a random-suffixed Stripe `integration_identifier`;
14. places only the application user ID, canonical product key, and environment in Stripe metadata;
15. uses server-controlled success and cancellation URLs;
16. records only a non-authoritative `processing` entitlement before payment confirmation;
17. returns only the hosted Checkout URL or a bounded customer-safe error.

A test-mode checkout initiation no longer produces a `test` entitlement. Test access is granted only after a verified successful test payment event or an explicit trusted administrative test grant.

## Webhook boundary

`POST /api/stripe/webhook`:

- receives the raw request body;
- verifies the `Stripe-Signature` before parsing authority-bearing data;
- validates Stripe mode before any entitlement transition;
- claims each Stripe event ID under a unique database key;
- acknowledges already processed or concurrently claimed duplicates without repeating fulfillment;
- allows a failed event to be retried by only one worker;
- retrieves Checkout Sessions from Stripe rather than trusting the webhook copy;
- validates the exact session, line item, Product, Price, amount, currency, PaymentIntent, Customer, metadata, and environment relationships;
- records only stable bounded failure codes rather than full provider payloads;
- applies ordered entitlement transitions so stale webhook events cannot overwrite a newer authoritative state.

### Subscribed event contract

| Stripe event | Required behavior |
|---|---|
| `checkout.session.completed` | Grant only when `payment_status=paid`; otherwise remain processing |
| `checkout.session.async_payment_succeeded` | Grant after complete object validation |
| `checkout.session.async_payment_failed` | Revoke only non-valid processing access |
| `payment_intent.payment_failed` | Revoke only non-valid processing access after metadata and amount validation |
| `charge.refunded` | Remove access only for a verified full refund |
| Any other event | Record as ignored; do not change access |

Events from the wrong Stripe mode are acknowledged as ignored and cannot mutate entitlements.

## Entitlement transition matrix

| Current state | Trigger | Result |
|---|---|---|
| none | Checkout initiated | `processing` |
| processing | Verified live payment success | `active` |
| processing | Verified test payment success | `test` |
| processing | Payment failure | `revoked` |
| active/test | Later unrelated payment failure | Preserve valid access |
| active/test | Verified full refund | `refunded` |
| active/test | Administrative revocation | `revoked` |
| refunded/revoked | Verified legitimate repurchase | `active` or `test` according to Stripe mode |
| any | Duplicate Stripe event ID | No second transition |
| any | Stale Stripe event | Ignore transition |
| any | Invalid signature, product, price, amount, currency, mode, metadata, or relationship | No access change |

A partial refund does not change entitlement status in the first release. It is recorded as an ignored access event. Any future partial-refund policy requires a separate approved business rule and implementation change.

## Database hardening

Migration:

```text
supabase/migrations/202607270002_stripe_prelaunch_hardening.sql
```

Applied to the owner-controlled Supabase project as:

```text
20260727185507 stripe_prelaunch_hardening
```

It adds:

- `entitlements.last_stripe_event_created_at`;
- `entitlements.last_stripe_event_id`;
- a constraint requiring the event-order fields to be present or absent together;
- a partial index supporting event-order reconciliation.

Existing unique protections remain in place for:

- `(user_id, product_key)`;
- Stripe Checkout Session ID when present;
- Stripe PaymentIntent ID when present;
- Stripe event ID.

RLS remains enabled on every public premium table. Ordinary authenticated users cannot write entitlements or access Stripe events, products, protected modules, or premium administrators directly.

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

Prefer a restricted Stripe key when its permissions support the required Product, Price, Customer, and Checkout Session operations. Standard Stripe secret keys remain supported when a restricted key cannot satisfy the integration.

### Founder-controlled release flags

```text
PREMIUM_AUTH_ENABLED
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED
PREMIUM_ENTITLEMENTS_ENABLED
PREMIUM_CHECKOUT_ENABLED
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED
VITE_PREMIUM_AUTH_ENABLED
```

Safe production defaults remain:

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
| Duplicate active Stripe products | None found |
| Hosted Stripe webhook endpoint | Not present |
| Hosted webhook signing secret in Vercel | Unverified / not configured through available tooling |
| Vercel Stripe environment variables | Values not readable or writable through the connected Vercel tools used in this pass |
| Stripe test Product and Price | Unverified |
| Stripe test end-to-end transaction matrix | Not completed |
| Stripe Tax registration | Not confirmed |
| Automatic tax | Not enabled |
| Public checkout | Disabled |
| Production authorization | Disabled |

Do not create a hosted webhook endpoint until its returned signing secret can be installed immediately in the correct Vercel environment. An endpoint without durable secret configuration is not a completed integration.

## Test evidence

### Completed automated and provider-backed evidence

- exact live Stripe Product and Price inspection;
- no duplicate active Product inspection;
- checkout request allowlist tests;
- exact Product/Price validation tests;
- test-checkout-does-not-grant-access regression test;
- immediate, pending, failed, refund, ignored, duplicate, and retry transition unit tests;
- partial-versus-full refund tests;
- private-route and client-bundle boundary checks;
- Supabase migration application and constraint verification;
- existing two-user RLS/IDOR matrix: 14 of 14 checks passed;
- Vercel preview build on PR #224 reached `READY`;
- preview public product page returned HTTP 200 and continued to state that checkout is disabled.

### Required before certification as payment-ready

- configure an isolated Stripe test Product, Price, restricted key, and hosted test webhook;
- install test values in the correct Vercel preview scope;
- enable authentication, persistence, entitlements, and checkout only in the controlled test scope;
- run immediate success, authentication-required, declined, asynchronous success, asynchronous failure, cancellation, browser-close, duplicate, failed-retry, refund, revocation, and repurchase tests;
- verify workspace and protected-content access before and after each entitlement transition;
- inspect Vercel, Stripe, and Supabase logs;
- remove all synthetic test users and records or preserve only approved test fixtures;
- return all production flags to disabled values.

## Tax decision

Stripe automatic tax remains disabled. Before tax calculation or collection is enabled, the founder must confirm the applicable registration and product tax treatment with qualified guidance and then configure Stripe Tax consistently. Account verification alone is not evidence of a tax registration.

## Rollback procedure

If the hardening release causes an unexpected application defect:

1. immediately confirm `PREMIUM_CHECKOUT_ENABLED=false` and `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false`;
2. roll Vercel production back to the prior known-good deployment;
3. do not remove the Stripe event-order columns during an incident; they are nullable and backward compatible;
4. inspect Vercel function logs and `stripe_events` status rows;
5. leave failed events available for controlled retry after the code defect is repaired;
6. add a versioned follow-up migration for any database correction rather than editing an applied migration;
7. verify public routes and private fail-closed behavior before ending containment.

## Founder activation runbook

Activation is a separate controlled release.

### 1. Technical readiness

- all repository checks pass;
- test-mode purchase and refund matrix passes;
- protected content is governed and seeded;
- authentication, account deletion, persistence, cross-device resume, and revocation are externally validated;
- live webhook endpoint is configured and signature verification is proven;
- all production secrets are present only in encrypted server scopes.

### 2. Policy approval

The founder approves final:

- price;
- customer terms;
- refund policy, including any partial-refund rule;
- privacy and retention policy;
- support owner and response process;
- product content and accessibility evidence.

### 3. Tax decision

Confirm whether registration and collection are required. Enable Stripe Tax only after applicable registration is active and product tax treatment is configured.

### 4. Public-copy release

Change the product page from early-access/prelaunch language to an active offer only after all other gates pass. Display price, terms, refund policy, privacy, support, and what the customer receives.

### 5. Configure live payment infrastructure while checkout remains off

- set `STRIPE_ENVIRONMENT=live`;
- install the approved restricted or secret live key;
- install the live webhook signing secret;
- map the certified live Product and Price IDs;
- set `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=true`;
- keep `PREMIUM_CHECKOUT_ENABLED=false`;
- deploy and run readiness, release, schema, API, build, boundary, browser, and smoke checks.

### 6. Controlled first transaction

After written founder approval, set `PREMIUM_CHECKOUT_ENABLED=true` for the controlled release. Complete one founder-approved transaction and verify:

- Stripe payment success;
- signed webhook delivery;
- one entitlement only;
- protected application access;
- receipt and support details;
- refund and revocation behavior;
- clean provider and runtime logs.

### 7. Monitor and roll back

Monitor the first transactions closely. If any fulfillment, duplicate, refund, privacy, or support defect appears, turn checkout off immediately. Disabling checkout prevents new sessions while preserving webhook processing for already-created payments.

## Current verdict

**Hardened Stripe prelaunch backend under external test validation.**

The code and live database have been strengthened, and the canonical live Stripe Product and Price are verified. The system is not yet certified as fully payment-ready because hosted webhook configuration, Vercel secret configuration, and the full Stripe test-mode transaction matrix remain unverified. Public checkout and real customer charging remain disabled.
