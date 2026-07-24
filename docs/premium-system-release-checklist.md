# Premium system release checklist

Last updated: July 24, 2026

This checklist is a set of hard gates. An unchecked payment, entitlement, privacy, legal, or support gate means checkout stays disabled.

## Release identity

- [ ] Release commit recorded
- [ ] Preview deployment recorded
- [ ] Production deployment recorded
- [ ] Supabase project and environment recorded without secrets
- [ ] Stripe mode recorded as disabled, test, or live
- [ ] Product key is exactly `healthcare-worker-benefits-decision-system`
- [ ] Owner approval record linked

## Product readiness

- [ ] Product is consistently named Healthcare Worker Benefits Decision System
- [ ] Public copy does not present a PDF, workbook, packet, download, or static course as the product
- [ ] Public page explains audience, workflow, modules, outputs, privacy, limitations, availability, and expected-price status
- [ ] Public CTA matches current availability
- [ ] No active purchase claim appears while checkout is disabled
- [ ] All eight modules are reviewed
- [ ] Calculations show assumptions and warnings
- [ ] Subjective ratings show their formula and do not imply objective precision
- [ ] Unknowns produce useful verification questions
- [ ] Decision brief includes user choice, date, assumptions, findings, unknowns, and limitations
- [ ] Browser print layout is reviewed

## Authentication and account

- [ ] Supabase project is configured
- [ ] Version-controlled migration is applied
- [ ] Email magic-link authentication is configured
- [ ] Production Site URL and exact redirect URLs are verified
- [ ] Sign-in, refresh, expiry, and sign-out are tested
- [ ] Missing authentication configuration fails closed
- [ ] Signed-out users cannot access `/app`
- [ ] Signed-in users without entitlement cannot access product content
- [ ] Mock authentication is off in production
- [ ] Entitlement bypass is off everywhere
- [ ] Account deletion process is documented, staffed, and tested

## Database and workspace persistence

- [ ] RLS is enabled and forced on premium tables
- [ ] User A cannot read, write, or delete User B workspace
- [ ] Users can select only their own profile
- [ ] Users can select only their own entitlement
- [ ] Users cannot grant or modify entitlements
- [ ] Ordinary users cannot access Stripe events or premium module rows
- [ ] Administrative access is explicit in `premium_admins`
- [ ] Workspace JSON validation rejects invalid or oversized data
- [ ] Workspace save, failure, retry, deletion, and not-found states are tested
- [ ] Cross-device persistence is verified
- [ ] No production browser-local fallback activates after a backend failure

## Premium content boundary

- [ ] Protected content is stored only in protected database rows or server-only storage
- [ ] No substantive module definition is committed under `public`
- [ ] No public JSON manifest contains premium questions
- [ ] Public prerender output contains no premium question library
- [ ] Vite production chunks contain neither protected sentinel
- [ ] Distinctive protected copy has been manually searched in `dist`
- [ ] `/api/premium/content` checks authentication
- [ ] `/api/premium/content` checks entitlement
- [ ] `/api/premium/content` checks product status
- [ ] `/api/premium/content` checks module authorization
- [ ] Protected API responses use no-store

## Stripe test completion

- [ ] Stripe test account is configured
- [ ] Exact one-time test product exists
- [ ] Exact one-time test price is server mapped
- [ ] No client price ID is accepted
- [ ] Test webhook endpoint is registered
- [ ] Hosted webhook secret is configured
- [ ] Raw body signature verification passes
- [ ] Invalid and unsigned events are rejected
- [ ] Successful immediate payment grants access
- [ ] Async successful payment grants access
- [ ] Async failure does not grant access
- [ ] Payment failure does not grant access
- [ ] Duplicate events do not duplicate grants
- [ ] Success URL alone does not grant access
- [ ] Cancellation does not grant access
- [ ] Test customer is tied to authenticated user
- [ ] Checkout metadata contains exact user and product keys

## Entitlement verification

- [ ] Active status grants access
- [ ] Processing status does not grant access
- [ ] Refunded status denies access
- [ ] Revoked status denies access
- [ ] Expired status denies access
- [ ] Test status is visibly distinguished in administrative records
- [ ] Duplicate grants are prevented
- [ ] Trusted restore flow is tested
- [ ] Access endpoint never trusts browser entitlement state
- [ ] Access-processing page polls server state and does not assume payment

## Refund policy and handling

- [ ] Final refund policy is approved
- [ ] Refund window and exclusions are stated before checkout
- [ ] Support procedure is published
- [ ] Test refund event marks entitlement refunded
- [ ] Refunded user loses product access
- [ ] Workspace retention or deletion after refund is defined
- [ ] Partial refund behavior is defined or prohibited
- [ ] Chargeback handling is defined
- [ ] Manual correction authority is restricted and audited

## Legal terms and privacy review

- [ ] Terms name the interactive system correctly
- [ ] Privacy Policy describes Supabase, Stripe, Resend, Vercel, workspace data, and current activation state
- [ ] Educational limitation is visible
- [ ] Health-plan limitation is visible
- [ ] Compensation estimates are described as estimates
- [ ] No professional relationship is implied
- [ ] Data retention is documented
- [ ] Account deletion is documented
- [ ] State/international privacy applicability is reviewed
- [ ] No unsupported HIPAA or security claim appears
- [ ] Owner or qualified reviewer explicitly approves launch terms

## Data minimization and analytics

- [ ] First release has no document uploads
- [ ] Free-text fields display privacy reminders
- [ ] Prohibited-data list is visible
- [ ] Analytics consent behavior is preserved
- [ ] Event taxonomy matches architecture documentation
- [ ] Events contain no compensation or benefit values
- [ ] Events contain no health or medical information
- [ ] Events contain no notes or free text
- [ ] Events contain no emails, names, employers, or roles
- [ ] Events contain no Stripe IDs
- [ ] Server logs contain no workspace answer values

## Accessibility

- [ ] Semantic heading order reviewed
- [ ] Every input has an accessible label
- [ ] Required and validation states are announced
- [ ] Keyboard-only workflow completed
- [ ] Visible focus is present
- [ ] Mobile touch targets are adequate
- [ ] Progress is announced and not color-only
- [ ] Calculation tables have headers
- [ ] Reduced-motion behavior reviewed
- [ ] Decision brief print accessibility reviewed
- [ ] Automated axe checks have no serious or critical violations

## SEO and privacy indexing

- [ ] Canonical public product page is indexable
- [ ] Old product route returns permanent redirect
- [ ] Internal links use canonical route
- [ ] Sitemap contains canonical public route
- [ ] Sitemap excludes retired route
- [ ] Sitemap excludes `/app`, `/account`, `/sign-in`, and `/access-processing`
- [ ] Private routes return `X-Robots-Tag`
- [ ] Private routes have noindex meta
- [ ] Private workspaces are absent from public structured data
- [ ] No user data appears in title, canonical, Open Graph, JSON-LD, or URL

## Security review

- [ ] No real secrets are committed
- [ ] No service-role key uses `VITE_`
- [ ] No Stripe secret uses `VITE_`
- [ ] No arbitrary price ID is accepted
- [ ] No client-controlled entitlement exists
- [ ] No insecure direct object reference found
- [ ] RLS policies are reviewed
- [ ] Service-role queries explicitly include user ownership
- [ ] Stripe signatures are verified
- [ ] Webhook idempotency is tested
- [ ] Success and cancellation URLs are fixed server-side
- [ ] No open redirect exists
- [ ] No debug or development bypass is active
- [ ] Private responses use no-store
- [ ] Security headers are present
- [ ] Production source maps do not expose server implementation
- [ ] Logs and customer errors contain no secrets or internals

## Vercel and operational readiness

- [ ] No Vercel Pro dependency was introduced
- [ ] No paid cron, firewall, observability, or deployment-protection dependency was introduced
- [ ] Functions are short-lived and stateless
- [ ] Preview environment variables are scoped correctly
- [ ] Production environment variables are scoped correctly
- [ ] Secret-rotation procedure is tested
- [ ] Support owner and response expectations are published
- [ ] Monitoring and rollback path are documented
- [ ] Checkout can be disabled with one server flag and redeploy

## Automated quality gates

- [ ] `npm ci`
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run premium:test`
- [ ] `npm run premium:schema-check`
- [ ] `npm run premium:release-check`
- [ ] `npm run build`
- [ ] `npm run premium:boundary-check`
- [ ] `npm run test:browser:premium`
- [ ] Existing flagship browser journeys
- [ ] Mobile browser journey
- [ ] Print journey
- [ ] Preview smoke tests
- [ ] Production smoke tests

## Production authorization

- [ ] All preceding gates are complete
- [ ] Stripe test purchase, fulfillment, access, refund, and revocation evidence is attached
- [ ] Legal and privacy approvals are attached
- [ ] Support process is active
- [ ] Owner explicitly authorizes live keys
- [ ] Owner explicitly authorizes `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=true`
- [ ] Owner explicitly authorizes `PREMIUM_CHECKOUT_ENABLED=true`
- [ ] Controlled production transaction plan is approved
- [ ] Production purchase succeeds
- [ ] Signed live webhook grants entitlement
- [ ] Protected access works
- [ ] Live refund revokes access
- [ ] Public copy is changed to active purchase language only after all validation

## Verdict

Choose exactly one:

- [ ] Foundation only
- [ ] Ready for private authenticated testing
- [ ] Ready for Stripe test-mode validation
- [ ] Ready for explicit production checkout authorization
- [ ] Live paid product

The final option is prohibited unless a complete real purchase, signed webhook fulfillment, entitlement grant, protected access, refund, and revocation flow has been validated.
