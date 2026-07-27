# Premium system implementation status

Last updated: July 27, 2026

## Current verdict

**Hardened premium and Stripe foundation under external test validation**

Paid access is not active. Checkout is disabled. No real customer purchase pathway is authorized. Production authentication, workspace persistence, protected-content delivery, entitlement enforcement, and public premium access remain fail-closed.

Detailed Stripe evidence and the founder activation sequence are recorded in [`stripe-prelaunch-certification.md`](./stripe-prelaunch-certification.md).

## Current platform evidence

### GitHub

- Canonical repository: `atciccarelli7-code/clear-care-finance`
- Canonical production branch: `main`
- Current production commit: `4e12e5024cd02bc123b17be87d047aff253a9657`
- Stripe hardening review: PR #224, branch `agent/stripe-prelaunch-certification`
- Version-controlled premium migrations:
  - `202607240001_premium_system_foundation.sql`
  - `202607240002_premium_system_security_followup.sql`
  - `202607270001_restore_premium_admin_policy_execution.sql`
  - `202607270002_stripe_prelaunch_hardening.sql`

PR #224 remains a draft until repository checks, external Stripe/Vercel configuration, and end-to-end test evidence satisfy the release gates.

### Vercel

- Team: `CAF`
- Project: `clear-care-finance`
- Canonical production domain: `communityacquiredfinance.com`
- Current production deployment: `dpl_2z8gs1TW4ixtqeRb6boNhgLMeaBR`
- Production deployment state: `READY`
- PR #224 preview deployment for head `8b30b56e1a46330018fde9b3082922f35f22683f`: `dpl_FZ2FSGmSz52aqxcVuTUkVAGaQbEk`
- Preview deployment state: `READY`
- Preview product page returned HTTP 200 and continued to state that checkout and account creation are unavailable.

The connected Vercel actions used in this pass can inspect projects, deployments, builds, and runtime logs, but do not expose the project environment-variable read/write operations needed to install Stripe and Supabase secrets. Secret configuration therefore remains externally unverified.

### Supabase

- Organization: `Community Acquired Finance`
- Project: `CAF Project`
- Project ref: `uzfcvtgnpkvuapgrkfcb`
- Region: `us-west-2`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: 17
- Applied migrations:
  - `20260724233723 premium_system_foundation`
  - `20260724233826 premium_system_security_followup`
  - `20260727174018 restore_premium_admin_policy_execution`
  - `20260727185507 stripe_prelaunch_hardening`
- Current persistent public rows before external payment testing:
  - `products`: 1
  - `profiles`: 0
  - `entitlements`: 0
  - `workspaces`: 0
  - `stripe_events`: 0
  - `premium_modules`: 0
  - `premium_admins`: 0
- RLS is enabled on every public premium table.
- Security advisors are clear.
- Performance advisors report informational unused-index notices only; new indexes should not be removed before representative workload exists.

### Stripe

- Connected account: Community Acquired Finance
- Canonical live Product: `prod_Uxp2XvStVfkORZ`
- Canonical live Price: `price_1TxtO1JzRBBRg03YhueOeMsz`
- Product and Price: active
- Price type: one-time
- Amount: $29.00 USD
- Product and Price metadata: canonical product key confirmed
- Connected-account active Product inventory: one matching active Product; no conflicting duplicate found
- Hosted webhook endpoints: none found
- Automatic tax: not enabled by this work
- Tax registrations: not confirmed

The live Product and Price are verified but remain prelaunch objects. Their existence does not authorize checkout.

## Security findings corrected

### Authenticated RLS helper execution

The policies for authenticated profile, entitlement, and workspace reads call `private.is_premium_admin()`. The earlier security follow-up migration removed the privileges authenticated users needed to evaluate that helper. The corrective migration grants only:

- `USAGE` on the non-exposed `private` schema to `authenticated`;
- `EXECUTE` on `private.is_premium_admin()` to `authenticated`.

Anonymous and public execution remain denied.

### Test checkout prematurely granted access

The initial entitlement transition treated `mark_processing` with a test-mode marker as `test`, which would have granted access immediately when a test Checkout Session was created. PR #224 changes initiation to `processing`. A `test` entitlement now requires either:

- a signed, fully validated successful Stripe test payment event; or
- a trusted administrative test grant.

A Checkout success URL remains non-authoritative.

### Stripe object and relationship validation

PR #224 adds server-side validation for:

- Stripe test/live mode;
- exact Product and Price IDs;
- active Product and Price state;
- one-time price type;
- USD currency and 2,900-cent amount;
- canonical product metadata and name;
- authenticated application user and Stripe Customer relationship;
- Checkout Session, PaymentIntent, Customer, Product, Price, amount, currency, and metadata consistency;
- full versus partial refund semantics.

### Webhook ordering and concurrency

Migration `stripe_prelaunch_hardening` adds the most recent authoritative Stripe event timestamp and ID to each entitlement. The service uses those fields with optimistic concurrency so stale or concurrent events cannot silently overwrite a newer entitlement state.

## Database isolation evidence

A transactionally isolated two-user RLS/IDOR matrix passed all 14 checks:

- own profile, entitlement, and entitled workspace visible;
- cross-user profile, entitlement, and workspace hidden;
- own workspace update allowed;
- cross-user update affects zero rows;
- workspace insert for another user denied;
- product-key mutation without entitlement denied;
- direct authenticated access to products, premium modules, Stripe events, and premium admins denied.

Synthetic users and rows were rolled back.

## What is implemented

- Canonical public product route and permanent legacy redirect.
- Noindex account, access, and application routes.
- Eight-module application shell and printable decision brief.
- Supabase browser authentication abstraction and server bearer-token validation.
- RLS-protected database schema for profiles, products, entitlements, workspaces, Stripe events, protected modules, and explicit administrators.
- Server-side entitlement service and protected-content endpoint.
- User-scoped workspace APIs.
- Stripe-hosted Checkout endpoint with strict request allowlisting and server-only Product/Price mapping.
- Signed raw-body Stripe webhook with idempotency, retry claiming, object validation, event ordering, and bounded failure codes.
- Full-refund access removal and clean later-repurchase path.
- Default-off release flags, release checks, schema checks, boundary checks, unit tests, browser tests, and smoke tooling.
- Privacy-conscious analytics taxonomy and protected-content bundle boundaries.

## Visitor state

A visitor can:

- read the public product page;
- review the intended workflow and representative interface;
- see the exact early-access and $29 planning-target status;
- join the early-access list, subject to separate Resend validation;
- use the public CAF site.

A visitor cannot:

- create a production premium account;
- enter the protected application;
- create or retrieve a production workspace;
- retrieve protected premium content;
- start Checkout;
- pay;
- receive a production entitlement.

## Activation state

| Capability | Code / infrastructure status | Activation state |
|---|---|---|
| Owner-controlled Supabase project | Active and healthy | Complete |
| Foundation, security, RLS correction, and Stripe-order migrations | Applied and version-controlled | Complete |
| Two-user RLS/IDOR matrix | 14/14 checks passed transactionally | Complete for database-policy scope |
| Supabase magic-link authentication | Implemented | Production disabled; external flow unverified |
| Server token validation | Implemented | Production disabled |
| PostgreSQL workspace persistence | Implemented | Production disabled; end-to-end persistence unverified |
| Entitlement enforcement | Implemented and hardened | Production disabled |
| Protected module delivery | Implemented | No protected module rows; production disabled |
| Live Stripe Product and Price | Verified | Prelaunch only |
| Stripe Checkout | Hardened in PR #224 | Disabled |
| Stripe webhook code | Hardened in PR #224 | No hosted endpoint/signing secret configured |
| Refund/revocation/repurchase transitions | Unit-level implementation | External Stripe test validation pending |
| Stripe Tax | Not enabled | Registration decision pending |
| Public purchase copy and control | Early-access only | Disabled |

## Required external validation

### Supabase and account workflow

- configure exact production and approved preview magic-link redirects;
- validate sign-in, expiration, restoration, sign-out, revocation, and account deletion;
- seed governed test protected modules from the ignored private source path;
- validate workspace create, save, reload, archive, delete, export, cross-device resume, stale-write handling, and concurrency;
- verify protected access is lost after refund or revocation.

### Stripe and Vercel

- create or verify isolated Stripe test-mode Product and Price objects;
- create a restricted test key with the minimum required permissions;
- create the hosted test webhook and immediately install its signing secret in the correct Vercel preview scope;
- install the test Product and Price mappings in the same scope;
- run immediate success, declined, authentication-required, asynchronous success/failure, cancellation, browser-close, duplicate, failed-retry, full-refund, revocation, and repurchase tests;
- inspect Stripe, Vercel, and Supabase logs;
- keep all production checkout flags disabled.

## Release controls

Safe defaults remain:

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

Readiness and safety commands:

```bash
npm run premium:readiness
npm run premium:readiness -- --json
npm run premium:release-check
npm run premium:schema-check
npm run premium:api-check
npm run premium:test
npm run build
npm run premium:boundary-check
npm run test:browser:premium
npm run smoke:deployed
```

## Manual approval before payment

The founder must explicitly approve:

1. final protected product content;
2. final price;
3. customer terms;
4. refund and partial-refund policy;
5. privacy and retention;
6. support process;
7. accessibility evidence;
8. Stripe test evidence;
9. tax registration and collection decision;
10. production authorization flag;
11. checkout feature flag;
12. controlled production transaction;
13. active-purchase public copy.

Until those gates are satisfied, the correct verdict remains **Hardened premium and Stripe foundation under external test validation**.
