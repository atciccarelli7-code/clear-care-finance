# Premium system setup and activation

Last updated: July 24, 2026

This runbook describes the future external setup for the Healthcare Worker Benefits Decision System. It does not authorize commerce. Never paste secrets into source code, GitHub issues, Notion, Linear, screenshots, logs, or customer support messages.

## Stage 0: keep the deployed foundation closed

Use these safe defaults in Vercel Production and Preview:

```text
PREMIUM_AUTH_ENABLED=false
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=false
PREMIUM_ENTITLEMENTS_ENABLED=false
PREMIUM_CHECKOUT_ENABLED=false
PREMIUM_TEST_ADMIN_ENABLED=false
PREMIUM_PREVIEW_ACCESS_ENABLED=false
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false
STRIPE_ENVIRONMENT=disabled
VITE_PREMIUM_AUTH_ENABLED=false
VITE_PREMIUM_DEV_MOCK_AUTH=false
```

Run:

```bash
npm run premium:readiness
npm run premium:release-check
```

The report must show no unsafe violations. Public routes work; private routes fail closed.

## 1. Create the Supabase project

1. Sign in to the owner-controlled Supabase organization.
2. Create a project in the region appropriate for the expected customer base and legal/privacy review.
3. Use a strong generated database password and store it in the approved password manager.
4. Do not place the database password in the frontend or a `VITE_` variable.
5. Record the project URL and public anonymous key.
6. Retrieve the service-role key only for server-side Vercel configuration.
7. Confirm the project is not using example or shared credentials.

Required Vercel values:

```text
VITE_PUBLIC_SUPABASE_URL=<project URL>
VITE_PUBLIC_SUPABASE_ANON_KEY=<public anonymous key>
SUPABASE_URL=<project URL>
SUPABASE_ANON_KEY=<public anonymous key>
SUPABASE_SERVICE_ROLE_KEY=<server-only service-role key>
```

The service-role key must never use a `VITE_` prefix.

## 2. Apply the version-controlled database migration

Migration source:

```text
supabase/migrations/202607240001_premium_system_foundation.sql
```

Preferred CLI path:

1. Install or run the official Supabase CLI in an owner-controlled environment.
2. Authenticate with the correct Supabase organization.
3. Link the repository to the intended project:

   ```bash
   supabase link --project-ref <project-ref>
   ```

4. Review the SQL diff.
5. Apply the migration:

   ```bash
   supabase db push
   ```

6. Confirm the command completed without skipped statements.

If the SQL editor is used instead, paste only the exact version-controlled migration, run it once in the correct project, and record the migration version externally. Do not edit the production schema manually without also updating the repository migration.

Validate:

- all seven tables exist;
- RLS and forced RLS are enabled;
- user policies exist only for own profile, own entitlement read, and own entitled workspaces;
- ordinary authenticated users have no write grant on entitlements;
- ordinary users have no access policy for Stripe events or premium modules;
- product key seed is present with `private_build` status;
- unique constraints and indexes exist.

Run locally:

```bash
npm run premium:schema-check
```

The readiness command intentionally reports migration status as `unknown`; application environment variables cannot prove that SQL was applied.

## 3. Configure Supabase email magic-link authentication

1. In Supabase Authentication, enable email OTP/magic-link sign-in.
2. Decide whether unconfirmed email sign-in is permitted; use Supabase&apos;s recommended secure email confirmation settings.
3. Set the production Site URL:

   ```text
   https://communityacquiredfinance.com
   ```

4. Add production redirect URLs:

   ```text
   https://communityacquiredfinance.com/app/benefits-decision
   https://communityacquiredfinance.com/sign-in
   ```

5. Add exact Vercel preview redirect patterns only if preview authentication is explicitly approved. Do not use a broad wildcard that permits an attacker-controlled domain.
6. Configure a branded authentication email with honest sign-in language and no payment claim.
7. Review email deliverability and rate limits.
8. Create two non-production test users.
9. Verify sign-in, token refresh, expiry, sign-out, and replay behavior.
10. Verify a signed-in user with no entitlement still cannot load module content or a workspace.

Enable only authentication first:

```text
VITE_PREMIUM_AUTH_ENABLED=true
PREMIUM_AUTH_ENABLED=true
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=false
PREMIUM_ENTITLEMENTS_ENABLED=false
PREMIUM_CHECKOUT_ENABLED=false
```

Deploy a preview and confirm the private routes still fail closed because entitlement enforcement is intentionally off.

## 4. Provision explicit test administration

1. Identify the owner&apos;s Supabase user UUID.
2. Insert that UUID into `public.premium_admins` using the Supabase SQL editor or another trusted service-role administrative process.
3. Record who approved and created the entry.
4. Do not expose an admin provisioning endpoint.
5. Keep `PREMIUM_TEST_ADMIN_ENABLED=false` unless a reviewed administrative feature explicitly requires it.
6. Use test entitlements, not a browser bypass.

To create a test entitlement, use trusted SQL or an internal owner-only script with:

- exact test user UUID;
- exact product key;
- status `test`;
- access type `administrative_test`;
- no fabricated Stripe identifiers.

Set `products.status='test'` before protected test modules are used.

## 5. Prepare and seed protected module definitions

1. Create an untracked file under:

   ```text
   private-premium-content/healthcare-worker-benefits-decision-system.json
   ```

2. Use this top-level contract:

   ```json
   {
     "productKey": "healthcare-worker-benefits-decision-system",
     "modules": []
   }
   ```

3. Populate all eight validated module definitions outside the public repository.
4. Confirm the file contains no secrets and no real customer data.
5. Keep:

   ```text
   PREMIUM_CONTENT_SEED_STATUS=test
   PREMIUM_CONTENT_SEED_PRODUCTION_AUTHORIZED=false
   ```

6. Seed test rows:

   ```bash
   npm run premium:seed-modules -- private-premium-content/healthcare-worker-benefits-decision-system.json
   ```

7. Verify an entitled test user can request only authorized modules.
8. Verify a different user, missing entitlement, invalid module, and invalid product all fail.
9. Run a production build and boundary check:

   ```bash
   npm run build
   npm run premium:boundary-check
   ```

10. Inspect production assets for both sentinel strings and distinctive protected copy.

Active module seeding is prohibited until production authorization:

```text
PREMIUM_CONTENT_SEED_STATUS=active
PREMIUM_CONTENT_SEED_PRODUCTION_AUTHORIZED=true
```

Both values must be temporary, owner-controlled release inputs. Return authorization to `false` after the seed.

## 6. Enable private authenticated workspace testing

After authentication, migrations, RLS, protected test modules, and test entitlements are verified:

```text
VITE_PREMIUM_AUTH_ENABLED=true
PREMIUM_AUTH_ENABLED=true
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=true
PREMIUM_ENTITLEMENTS_ENABLED=true
PREMIUM_CHECKOUT_ENABLED=false
STRIPE_ENVIRONMENT=disabled
```

Validate with two test users:

1. User A can see only User A workspaces.
2. User B cannot retrieve, update, or delete User A workspace by UUID.
3. A missing entitlement cannot load workspaces or content.
4. Revoking the test entitlement blocks the next access check.
5. Invalid JSON state returns a controlled error.
6. Progress saves and resumes in another browser/device after signing in.
7. Account and application routes remain noindex.
8. Analytics contain only allowed fixed event properties.
9. Deleting a workspace removes only that user-owned workspace.

At this point the verdict may become **Ready for private authenticated testing**, not paid or checkout ready.

## 7. Create and configure the Stripe test account

1. Complete the owner&apos;s Stripe account onboarding and security setup.
2. Enable multi-factor authentication.
3. Keep the dashboard in test mode.
4. Create one test product named:

   ```text
   Healthcare Worker Benefits Decision System
   ```

5. Create one one-time test price using the approved test amount. The current planning target is USD 29, but owner approval must precede configuration.
6. Do not create a subscription price.
7. Copy the resulting test `price_...` identifier to the password manager or directly to Vercel.
8. Retrieve the test secret key beginning with `sk_test_`.
9. Never expose the secret key through a `VITE_` variable.

Vercel test values:

```text
STRIPE_ENVIRONMENT=test
STRIPE_SECRET_KEY=<sk_test_...>
STRIPE_PRICE_HEALTHCARE_WORKER_BENEFITS_DECISION_SYSTEM=<price_...>
```

## 8. Register the Stripe test webhook

1. In Stripe test mode, create a webhook endpoint:

   ```text
   https://communityacquiredfinance.com/api/stripe/webhook
   ```

2. Select at minimum:

   ```text
   checkout.session.completed
   checkout.session.async_payment_succeeded
   checkout.session.async_payment_failed
   payment_intent.payment_failed
   charge.refunded
   ```

3. Copy the test endpoint signing secret beginning with `whsec_`.
4. Set:

   ```text
   STRIPE_WEBHOOK_SECRET=<whsec_...>
   ```

5. Do not reuse a CLI webhook secret for the production-hosted endpoint.
6. Confirm the function receives the raw body and rejects unsigned test requests.

## 9. Enable Stripe test-mode validation

Only after the private authenticated workflow passes:

```text
PREMIUM_AUTH_ENABLED=true
PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=true
PREMIUM_ENTITLEMENTS_ENABLED=true
PREMIUM_CHECKOUT_ENABLED=true
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false
STRIPE_ENVIRONMENT=test
```

Run:

```bash
npm run premium:readiness
npm run premium:release-check
```

The readiness output must say test key, webhook secret, and price mapping are configured and must show no violation.

Complete the test matrix:

1. unauthenticated checkout request;
2. unsupported product;
3. browser-supplied price ID;
4. missing or invalid signature;
5. successful immediate payment;
6. delayed/async success;
7. async failure;
8. payment failure;
9. duplicate delivery of each relevant event;
10. refund;
11. access revocation after refund;
12. restored access through a trusted correction;
13. different-account access denial;
14. cross-device workspace access after fulfillment;
15. cancellation;
16. support handling and customer-facing errors;
17. confirmation that public analytics contain no Stripe IDs.

At this point the verdict may become **Ready for Stripe test-mode validation** only after the tests actually pass.

## 10. Configure Vercel environments safely

In the Vercel project settings:

1. Add public variables only where needed.
2. Add service-role and Stripe secrets only as encrypted server variables.
3. Scope test credentials to Preview first.
4. Keep Production checkout disabled.
5. Trigger a new preview deployment after environment changes; existing deployments do not receive new values retroactively.
6. Run preview browser and API validation.
7. Add approved production non-commerce Supabase variables.
8. Redeploy and validate production authentication before adding any Stripe live values.
9. Never change the Vercel billing plan as part of this setup.

The foundation uses ordinary short-lived functions and does not require Vercel Pro.

## 11. Move from Stripe test mode to live mode

This is a separate owner-authorized release, not a key swap performed during routine setup.

Prerequisites:

- final customer terms;
- privacy review;
- approved refund policy;
- support owner and response process;
- accessibility validation;
- production module review;
- account deletion procedure;
- successful Stripe test matrix;
- successful webhook fulfillment and refund/revocation;
- explicit written owner authorization.

Then:

1. Switch Stripe Dashboard to live mode.
2. Create a separate live product and one-time live price.
3. Create a separate live webhook endpoint for the same production URL.
4. Select the required live events.
5. Store the new live `sk_live_...`, `price_...`, and live `whsec_...` in Vercel Production.
6. Set:

   ```text
   STRIPE_ENVIRONMENT=live
   PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=true
   ```

7. Keep `PREMIUM_CHECKOUT_ENABLED=false`.
8. Deploy and run readiness checks.
9. Perform a controlled production validation plan approved by the owner.
10. Only after the final gate, set:

    ```text
    PREMIUM_CHECKOUT_ENABLED=true
    ```

11. Redeploy.
12. Perform the explicitly authorized production purchase, signed webhook fulfillment, access, refund, and revocation test.
13. Disable checkout immediately if any authority, fulfillment, or support check fails.
14. Only after validation update public copy from early access to active purchasing.

## 12. Rotate or revoke secrets

For Supabase service-role rotation:

1. disable workspace, entitlement, and checkout flags;
2. rotate the key in Supabase;
3. update Vercel Preview and test;
4. update Vercel Production;
5. redeploy;
6. verify old key rejection;
7. re-enable only the previously approved flags.

For Stripe secret-key or webhook-secret rotation:

1. set `PREMIUM_CHECKOUT_ENABLED=false`;
2. create the replacement secret;
3. update the correct Vercel scope;
4. redeploy;
5. send a signed test event;
6. verify the old secret is no longer accepted when safe;
7. re-enable only after validation.

Never log, screenshot, or paste the secret values into project-management tools.

## 13. Final production validation

Run:

```bash
npm ci
npm test
npm run build
npm run test:browser:premium
npm run premium:readiness
PREMIUM_SMOKE_URL=https://communityacquiredfinance.com npm run premium:smoke
```

Then validate:

- canonical public page and permanent redirect;
- sitemap includes only the canonical public product route;
- private routes and APIs return noindex/no-store;
- missing or expired sessions fail closed;
- two-user IDOR tests;
- protected definitions absent from public assets;
- mobile forms and navigation;
- keyboard-only completion;
- axe coverage;
- browser print;
- checkout state matches authorization;
- signed webhook, duplicate, failure, refund, and revocation behavior;
- no secret or sensitive analytics leakage;
- existing flagship site journeys.

Record the exact commit, deployment, environment, Stripe mode, test evidence, and owner approval in the release checklist.
