# Premium account and Stripe test-mode certification

**Status:** Prelaunch certification runbook  
**Date:** August 5, 2026  
**Product:** Healthcare Worker Benefits Decision System  
**Price hypothesis:** $29 one time  
**Tracking:** Linear AND-118

## Objective

Prove that an authenticated test customer can move through Stripe-hosted Checkout, receive a webhook-confirmed `test` entitlement, create and resume an owner-scoped workspace, use the browser-local source assistant, print a Benefits Decision Brief, and lose access after refund or revocation.

This certification must not create a live charge, production entitlement, real customer account, or real-document workflow.

## Non-negotiable boundaries

- Use Stripe test mode only.
- Use a designated synthetic test email controlled by the founder.
- Use synthetic plan facts only.
- Do not upload or retain documents.
- Do not enter claims, diagnoses, medication histories, member IDs, credentials, pay statements, completed elections, or financial-account information.
- Do not expose Supabase service-role, Stripe secret, or webhook secrets through `VITE_` variables.
- Do not enable `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED`.
- Do not modify production environment variables during preview certification.
- Do not merge or promote while any test entitlement, workspace, Stripe customer, or event is unexplained.

## Environment matrix

| Variable | Protected test preview | Production during certification |
|---|---:|---:|
| `VITE_PREMIUM_AUTH_ENABLED` | `true` | `false` |
| `VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED` | `true` | `false` |
| `VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED` | `false` | `false` |
| `PREMIUM_AUTH_ENABLED` | `true` | `false` |
| `PREMIUM_WORKSPACE_PERSISTENCE_ENABLED` | `true` | `false` |
| `PREMIUM_ENTITLEMENTS_ENABLED` | `true` | `false` |
| `PREMIUM_CHECKOUT_ENABLED` | `true` | `false` |
| `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED` | `false` | `false` |
| `STRIPE_ENVIRONMENT` | `test` | `disabled` |
| `PREMIUM_DOCUMENT_INTAKE_ENABLED` | `false` | `false` |
| `PREMIUM_DOCUMENT_EXTRACTION_ENABLED` | `false` | `false` |
| `PREMIUM_DOCUMENT_INTAKE_MODE` | `disabled` | `disabled` |
| `PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED` | `false` | `false` |

The preview additionally requires the public Supabase URL and anon key for the browser, plus server-only Supabase URL, anon key, service-role key, Stripe test secret key, Stripe test webhook secret, and the server-controlled $29 test price ID.

## Preflight

1. Confirm the branch head and exact protected Vercel preview.
2. Confirm Vercel reports no more than 12 Node.js functions on Hobby.
3. Confirm the preview is protected by Vercel Authentication or equivalent deployment protection.
4. Confirm the product page, `/sign-in`, `/access-processing`, `/account`, and `/app/*` return `noindex` and `private, no-store` headers.
5. Confirm the Stripe account is operating in test mode.
6. Confirm the server price resolves to the intended one-time $29 test price.
7. Confirm the webhook destination is the exact protected preview API endpoint used for certification.
8. Confirm Supabase Auth allows only approved CAF redirect URLs used by the preview.
9. Confirm `auth.users`, `profiles`, `entitlements`, `workspaces`, and relevant test Stripe-event rows are understood before the run.
10. Capture baseline row counts and identifiers without copying secrets into the work packet.

## Designated test identity

Record:

- synthetic test email;
- Supabase user UUID after magic-link creation;
- preview hostname;
- Stripe test customer ID after Checkout creation;
- Checkout Session ID;
- PaymentIntent ID;
- webhook event IDs;
- entitlement row ID;
- workspace row ID.

Never use a random third-party email or a real customer identity.

## Test 1 — fixed internal sign-in return

1. Open the protected product preview.
2. Confirm the test panel says `Test mode only · No real charge · No production access`.
3. Select **Sign in for test Checkout**.
4. Confirm the browser opens `/sign-in` without a caller-supplied redirect URL.
5. Request the magic link using the designated synthetic email.
6. Inspect the Supabase request and confirm the only email redirect is the fixed internal `/app/benefits-decision` route on the same protected preview origin.
7. Open the link and confirm the user lands in the protected workspace.
8. Return manually to the protected product preview and confirm the authenticated test panel now offers Stripe test Checkout.
9. Confirm the UI and API expose no arbitrary external or protocol-relative return-path input.

Evidence:

- screenshot of the sign-in panel;
- approved Supabase redirect configuration;
- resulting authenticated workspace route;
- authenticated product-preview panel after manual return;
- no redirect target in query parameters or user-submitted request data.

## Test 2 — Stripe-hosted Checkout

1. Select **Open Stripe test Checkout — $29**.
2. Confirm the browser is redirected to `https://checkout.stripe.com/...`.
3. Confirm the displayed product and amount are correct.
4. Confirm promotion codes are unavailable.
5. Complete the test purchase using an official Stripe test payment method.
6. Do not use a real payment card.
7. Confirm return to `/access-processing`.

Evidence:

- Checkout Session ID;
- test PaymentIntent ID;
- test customer ID;
- amount, currency, product, and livemode=false;
- screenshot excluding personal or payment fields.

## Test 3 — webhook and idempotent entitlement

1. Confirm the signed webhook event is received.
2. Confirm the event is claimed once in `stripe_events`.
3. Confirm a completed test Checkout maps to a `test` entitlement.
4. Re-deliver the same event.
5. Confirm duplicate processing does not grant a second entitlement or duplicate fulfillment.
6. Confirm the access endpoint changes from `processing` to `active` for the authenticated test account.
7. Confirm another user UUID cannot read or use the entitlement.

Evidence:

- webhook event ID and type;
- processing status;
- one entitlement row only;
- duplicate-event outcome;
- access endpoint response for owner and non-owner contexts.

## Test 4 — workspace lifecycle

1. Open the system after entitlement activation.
2. Create a workspace with a generic title that contains no employer or person name.
3. Enter synthetic benefit values and broad preferences.
4. Save progress.
5. Sign out and sign in again.
6. Confirm the workspace resumes with the same structured values.
7. Confirm no source text, filename, document bytes, source excerpt, member ID, medical information, credential, or payment data appears in workspace state.
8. Confirm a different authenticated user cannot select, update, or delete the workspace.
9. Generate and inspect the printable Benefits Decision Brief.

Evidence:

- workspace ID;
- owner UUID;
- redacted structured-state snapshot;
- RLS denial for a non-owner;
- print screenshot or PDF using synthetic values.

## Test 5 — browser-local source assistant

1. Open the source assistant from the entitled workspace.
2. Paste a synthetic plan excerpt with supported values.
3. Confirm candidate values appear.
4. Confirm the raw text field clears after analysis.
5. Edit and confirm selected candidates.
6. Save the values.
7. Confirm only structured values, cadence, source category, assumptions, and verification notes were persisted.
8. Repeat with a prohibited synthetic identifier and confirm the text is blocked locally and nothing is saved.

Evidence:

- before/after browser screenshots using synthetic text;
- workspace-state diff;
- zero rows and objects in the dormant document quarantine;
- absence of source text in analytics and server logs.

## Test 6 — refund and revocation

1. Refund the Stripe test charge or deliver the supported test refund event.
2. Confirm the entitlement transitions to `refunded` or `revoked` according to the verified event.
3. Confirm `/api/access/healthcare-worker-benefits-decision-system` denies application access.
4. Confirm protected module and workspace endpoints deny further use.
5. Confirm the account can still reach documented support, export, or deletion pathways as designed.
6. Re-deliver the refund event and confirm idempotency.

Evidence:

- refund event ID;
- entitlement state before and after;
- denied access response;
- duplicate refund-event outcome.

## Test 7 — deletion and cleanup

1. Delete the synthetic workspace through the approved application or administrative cleanup path.
2. Delete or revoke the test entitlement.
3. Remove the synthetic profile and auth user only after all evidence is captured.
4. Confirm no unexplained test workspaces, entitlements, profiles, Stripe events, or document rows remain.
5. Confirm the dormant quarantine bucket still contains zero objects.
6. Leave Stripe test records intact only when needed for the audit trail; label them clearly as test data.

Evidence:

- before/after row counts;
- deletion timestamps;
- zero quarantine rows and objects;
- cleanup owner and date.

## Rollback

At any failure:

1. Set `VITE_PREMIUM_TEST_CHECKOUT_DISPLAY_ENABLED=false`.
2. Set `PREMIUM_CHECKOUT_ENABLED=false`.
3. Set `PREMIUM_AUTH_ENABLED=false` if the auth boundary is implicated.
4. Set `PREMIUM_WORKSPACE_PERSISTENCE_ENABLED=false` and `PREMIUM_ENTITLEMENTS_ENABLED=false` if data authority is implicated.
5. Keep `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false`.
6. Redeploy the protected preview only.
7. Revoke the test entitlement.
8. Delete synthetic workspaces.
9. Rotate any exposed test secret immediately.
10. Document the failure, scope, containment, and retest requirement.

Production must remain unchanged throughout preview rollback.

## Certification decision

The test-mode purchase path is certifiable only when:

- every test above passes;
- no real charge or live Stripe object was created;
- no production environment changed;
- no real document or sensitive information was processed;
- workspace and entitlement RLS are proven;
- duplicate webhook delivery is idempotent;
- refund or revocation removes access;
- deletion and cleanup are proven;
- CI, browser certification, and the exact protected preview are green;
- the founder explicitly authorizes the next release phase.

Passing this runbook authorizes neither public paid access nor live Checkout. Those require a separate production-readiness decision.
