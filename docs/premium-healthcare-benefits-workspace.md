# Healthcare Compensation & Benefits Decision Workspace

**Product ID:** `healthcare_compensation_benefits_decision_book`  
**Web product version:** `3.0-web.1`  
**Canonical source edition:** `CAF_Healthcare_Compensation_Benefits_Decision_Book_v3.0`  
**Canonical source review date:** 2026-07-23  
**Commercial model:** one-time purchase; no automatic renewal; twelve months of substantive updates  
**Launch state:** implementation-ready, commerce default-deny

## Product decision

The former **Healthcare Worker Benefits Decision Pack v1.0** and its $29 paid-pilot page are superseded by the July 23, 2026 **Healthcare Compensation & Benefits Decision Book v3.0** source system and the web-native **Healthcare Compensation & Benefits Decision Workspace**.

The workspace is not a generic membership portal, online course, or PDF viewer. It is a secure decision-support product for healthcare professionals evaluating:

- employment pay structure;
- total compensation;
- medical, dental, and vision insurance;
- HSA, FSA, and HRA elections;
- retirement-plan identification and contribution elections;
- PTO, leave, disability, life, and protection benefits;
- schedule and controlled-time burden;
- repayment obligations;
- career fit and employment risk; and
- one integrated election record.

The v3.0 PDF and workbook remain authoritative for substantive content. The website changes delivery, navigation, state, access, source treatment, and outputs without replacing the source logic.

## Canonical source inventory

| Asset | Role | Status |
|---|---|---|
| `CAF_Healthcare_Compensation_Benefits_Decision_Book_v3.0.pdf` | Canonical designed reference edition | Authoritative |
| `CAF_Healthcare_Compensation_Benefits_Decision_Book_v3.0.docx` | Editable source text | Authoritative companion |
| `CAF_Healthcare_Benefits_Decision_Workbook_v3.0.xlsx` | Formula and worksheet companion | Authoritative companion |
| `Healthcare_Worker_Benefits_Decision_Pack_v1.0.pdf` | Prior paid-pilot package | Superseded; historical only |
| Existing repository paid-product config | Prior default-deny commerce governance | Preserved and extended |
| Existing Benefits Command Center | Free local-only foundation | Remains public and free |

### Resolved source contradictions

- **Name:** v1.0 “Benefits Decision Pack” is replaced for commercial positioning by “Healthcare Compensation & Benefits Decision Workspace,” while the v3.0 source edition remains “Decision Book.”
- **Delivery:** v1.0 described PDF and spreadsheet delivery with no account. v3.0 is delivered primarily through an authenticated workspace with browser print/PDF outputs and an optional gated reference PDF.
- **Scope:** v1.0’s lean two-offer pack is superseded by v3.0’s fourteen modular decisions and integrated election board.
- **Commercial terms:** the documented $39 standard / $29 launch pricing remains the current planned pricing. The live checkout price controls when commerce is enabled.
- **Updates:** the product includes twelve months of substantive updates, not indefinite lifetime updates.

### Unresolved source and operating issues

- Final refund eligibility, window, exclusions, and procedure require founder and merchant approval.
- The designed v3.0 PDF requires persistent private storage before the gated reference-PDF endpoint can be enabled.
- Final independent legal, tax, employment-benefits, insurance, and accessibility review is not documented.
- Time-sensitive figures must be rechecked before each substantive edition.

## Public and private routes

| Route | Boundary | Purpose |
|---|---|---|
| `/products/healthcare-worker-benefits-decision-pack` | Public/indexable | Product explanation, preview, source credibility, free/paid boundary, terms, and secure-access entry |
| `/premium/access` | Private/noindex/no-store | Passwordless access recovery, checkout entry, active-access state, and customer data reset |
| `/premium/healthcare-compensation-benefits` | Private/noindex/no-store | Authenticated premium dashboard and modules |
| `/api/premium-checkout` | Private server endpoint | Default-deny checkout URL creation |
| `/api/premium-webhook` | Private server endpoint | Signed Lemon Squeezy event processing and entitlement mutation |
| `/api/premium-magic-link` | Private server endpoint | Access-link issuance and activation |
| `/api/premium-session` | Private server endpoint | Session status and sign-out |
| `/api/premium-workspace` | Private server endpoint | Protected product content and minimal progress state |
| `/api/premium-reference-pdf` | Private server endpoint | Optional entitlement-gated redirect to a private signed PDF URL |
| `/api/product-config` | Public safe status | Non-secret readiness and product-state report |

Protected routes are omitted from the public sitemap. Vercel response headers apply `private, no-store` and `noindex, nofollow, noarchive` to `/premium/*` and `/api/premium-*`.

## Customer journey

1. Visitor reads the public product page.
2. Visitor enters the optional checkout email and requests secure one-time checkout.
3. The server returns no checkout URL unless every launch dependency is valid and `ENABLE_PREMIUM_COMMERCE=true`.
4. Lemon Squeezy hosts payment. CAF does not grant access from a browser success URL.
5. Lemon Squeezy sends a signed webhook.
6. CAF verifies the raw-body HMAC signature, expected variant, custom product ID, and paid order status.
7. An idempotent entitlement record is created or updated.
8. The customer requests a one-time access link using the exact purchase email.
9. Resend delivers a 15-minute, one-use activation link.
10. CAF creates a 30-day HTTP-only, SameSite=Lax session.
11. The protected workspace API verifies the session and active entitlement before returning substantive module content.
12. On later visits, the customer can recover access by email and continue minimal synchronized progress.
13. A qualifying refund changes the entitlement to `refunded` and blocks protected content.

## Payment architecture

**Provider:** Lemon Squeezy hosted one-time checkout.

### Required controls

- Checkout URL exists only in a server environment variable.
- Checkout endpoint validates HTTPS and a `lemonsqueezy.com` hostname.
- Custom checkout data includes CAF product ID and access model.
- Webhook verification uses HMAC SHA-256 against the unparsed request body.
- Expected Lemon Squeezy variant ID is mandatory for entitlement changes.
- Only `order_created` or `order_updated` events with `status=paid` grant access.
- Pending, failed, abandoned, mismatched, unsigned, or malformed events do not grant access.
- `order_refunded`, `status=refunded`, or a refund timestamp changes access to refunded.
- Event identity is persisted for 400 days to make repeated deliveries idempotent.
- No card data or secret is exposed to the client bundle.

### Refund behavior

The code supports refund-driven entitlement revocation. Production commerce must remain disabled until a complete refund policy is approved, published on the checkout surface, connected to a support path, and tested through a real test-mode purchase and refund.

## Authentication and authorization

**Authentication:** passwordless email access using Resend.  
**Authorization:** server-side entitlement record keyed to normalized purchase email and product ID.

### Session controls

- random 256-bit access and session tokens;
- hashed token identifiers in Redis;
- one-time magic-link consumption with `GETDEL`;
- 15-minute magic-link expiration;
- 30-day session expiration;
- HTTP-only cookie;
- `SameSite=Lax`;
- `Secure` on HTTPS;
- explicit sign-out;
- same-origin checks for mutations;
- IP and email rate limiting for access-link requests;
- enumeration-safe recovery response.

### Authorization controls

- protected product content lives in `api/_lib/premiumProduct.ts`, not a public static asset;
- `/api/premium-workspace` verifies both session and active entitlement before serializing the product;
- unauthorized API responses contain an error state, not hidden product content;
- account progress is scoped to the normalized authenticated email and product ID;
- the client cannot select another customer record;
- refund or revocation blocks future content responses;
- public route metadata and static sitemap omit premium routes.

## Data model

### Entitlement

```ts
{
  productId,
  email,
  status: "active" | "refunded" | "revoked",
  orderId,
  orderIdentifier,
  purchasedAt,
  updatesUntil,
  source: "lemon_squeezy" | "manual_test",
  testMode,
  lastEventName,
  updatedAt
}
```

### Session

```ts
{
  email,
  createdAt,
  expiresAt
}
```

The cookie contains only the random session token. Redis stores the session under a hash of that token.

### Progress

```ts
{
  completedModuleIds,
  activeModuleId,
  completedTaskIds,
  updatedAt
}
```

Progress input is allowlisted to known module IDs and generic task IDs. Free-text notes, employer names, pay values, benefit values, health details, and calculator inputs are not accepted by the progress API.

### Local-only state

- module free-text notes;
- draft comparison values;
- calculator inputs;
- personalized print content before printing or saving;
- browser visit marker for privacy-safe return-visit measurement.

## Customer privacy controls

- The access page can delete synchronized progress.
- The same control deletes CAF premium note keys in the current browser.
- Purchase and entitlement records remain because they are necessary to honor access, process refunds, maintain accounting records, and prevent fraud.
- The site does not request uploads of offers, paystubs, plan documents, medical records, claim documents, insurance credentials, or account statements.
- The workspace does not claim HIPAA compliance.
- Analytics event properties exclude email, amounts, employer names, free text, notes, medical details, and calculator inputs.

## Product information architecture

### Dashboard

- product title and edition;
- verified access status;
- purchase and update dates;
- overall progress;
- continue-where-you-left-off;
- recommended next module;
- controlling-document checklist;
- print/PDF and local text outputs;
- source library;
- update history;
- ad-free and privacy boundaries.

### Module contract

Each module contains:

- purpose;
- orientation;
- three framing questions;
- comparison record fields;
- practical actions;
- copy-ready professional questions;
- private local note;
- completion criteria;
- nearby official sources;
- related-module links;
- explicit completion state.

### Outputs

- print current module;
- print or save a dated full decision summary as PDF;
- local text summary backup;
- optional gated full reference-guide PDF when private storage is configured;
- copy-ready question lists.

The browser print path is the primary personalized PDF mechanism because it keeps private notes and values on the customer device.

## Environment variables

All payment, email, storage, and entitlement values are server-only. Do not use `VITE_` prefixes for active secrets or checkout URLs.

```dotenv
PUBLIC_SITE_URL=https://communityacquiredfinance.com
ENABLE_PREMIUM_COMMERCE=false

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
# or legacy Vercel KV aliases
KV_REST_API_URL=
KV_REST_API_TOKEN=

LEMON_SQUEEZY_HEALTHCARE_PRODUCT_URL=
LEMON_SQUEEZY_HEALTHCARE_VARIANT_ID=
LEMON_SQUEEZY_WEBHOOK_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=Community Acquired Finance <access@communityacquiredfinance.com>

PREMIUM_REFERENCE_PDF_URL=
```

`ENABLE_PREMIUM_COMMERCE=true` is insufficient by itself. Product configuration reports commerce active only when Redis, Lemon Squeezy, Resend, and site URL requirements also pass.

## Vercel and provider setup

1. Upgrade the CAF Vercel project to the approved production plan.
2. Install Upstash Redis through the Vercel Marketplace or create an equivalent compatible store.
3. Confirm production environment variables are injected only into server functions.
4. Verify the CAF Resend sending domain and the access sender address.
5. Create a one-time Lemon Squeezy product/variant with no subscription or renewal.
6. Set the Lemon checkout return destination to the CAF access page with a non-authoritative purchased state.
7. Configure the webhook URL: `/api/premium-webhook`.
8. Subscribe at minimum to order-created, order-updated, and order-refunded events.
9. Set the expected variant ID and webhook secret.
10. Publish approved refund, support, license, privacy, and purchase terms in the checkout flow.
11. Keep `ENABLE_PREMIUM_COMMERCE=false` through all setup and preview validation.
12. Run a test-mode purchase, duplicate-webhook replay, failed or pending payment check, account activation, access recovery, and refund.
13. Inspect Redis records, Vercel logs, email delivery, protected network responses, and browser storage.
14. Turn the flag on only after founder approval and all release gates pass.

## Local development and testing

### Standard checks

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
```

Use the repository&apos;s Playwright and deployed-site scripts for responsive and production-path checks.

### Critical test cases

#### Payment and entitlement

- paid order creates one active entitlement;
- pending or failed order creates no entitlement;
- mismatched variant creates no entitlement;
- invalid webhook signature creates no entitlement;
- duplicate webhook is accepted without duplicate access;
- delayed paid webhook creates access;
- refund changes status to refunded;
- success URL without webhook grants no access.

#### Authentication and authorization

- valid customer receives one-use access link;
- unknown email receives the same public recovery response;
- expired or reused link fails;
- signed-out customer receives 401 and no product data;
- signed-in customer without active entitlement receives 403 and no product data;
- one account cannot select another account&apos;s progress;
- cross-origin mutation request is rejected;
- logout destroys the server session and cookie.

#### Product experience

- dashboard and all fourteen modules render;
- progress saves and restores;
- invalid module/task identifiers are discarded;
- customer can delete synchronized progress;
- local notes are not included in API payloads or analytics;
- copy-ready questions work;
- current-module and summary print layouts work;
- mobile navigation, tables, focus, keyboard controls, empty states, and errors work.

#### Public regression and SEO

- public sales page remains indexable and useful without purchase;
- protected routes are not in the sitemap;
- premium pages and APIs return noindex/no-store headers;
- public free tools remain available;
- public calculators, analytics consent, and AdSense exclusions remain operational;
- no premium source content appears in unauthenticated API responses.

## Analytics taxonomy

No event may include email, name, employer, role, free text, notes, salary, pay, premiums, deductibles, balances, contribution values, health data, medical details, or other personalized inputs.

| Event | Definition |
|---|---|
| `premium_product_page_viewed` | Public product page loaded |
| `premium_primary_cta_clicked` | Public product CTA selected |
| `premium_checkout_initiated` | Server returned a valid hosted checkout URL |
| `purchase_completed` | Server processed a signed paid webhook; logged server-side without PII |
| `premium_access_page_viewed` | Secure access page loaded |
| `premium_access_recovery_attempted` | Recovery form submitted, regardless of account existence |
| `account_activated` | One-use access link consumed; logged server-side without email |
| `premium_dashboard_viewed` | Authorized dashboard loaded |
| `premium_module_started` | Customer opened a module |
| `premium_module_completed` | Customer marked a module complete |
| `premium_module_reopened` | Customer reopened a completed module |
| `premium_question_list_generated` | Copy-ready questions copied |
| `premium_pdf_generated` | Browser print/PDF action started |
| `premium_summary_exported` | Local text summary downloaded |
| `premium_return_visit` | Known browser revisited the workspace |
| `premium_progress_deleted` | Customer used the deletion control |
| `purchase_refunded` | Server processed a qualifying refund; logged without PII |
| `access_email_failed` | Server could not send a recovery email; logged without email |
| `payment_event_ignored` | Signed event did not qualify for entitlement mutation |

### Funnel

1. product page viewed;
2. checkout initiated;
3. purchase completed;
4. account activated;
5. dashboard viewed;
6. first module started;
7. first module completed;
8. first useful output generated;
9. return visit within the selected reporting window.

## Content governance and versioning

### Owners

- **Product owner:** Andrew Ciccarelli, RN, BSN
- **Content owner:** CAF founder/editor until a named reviewer is assigned
- **Technical owner:** CAF repository maintainers
- **Payment operations owner:** CAF founder until delegated
- **Refund/support owner:** must be explicitly assigned before launch

### Review cadence

- annual full source and figure review;
- plan-year and tax-limit review before each year-specific update;
- immediate review after a material federal rule, source, product, or employer-benefit change;
- quarterly link and access-flow check;
- monthly payment/refund/support log review while commerce is active;
- accessibility and responsive review after material UI changes.

### Time-sensitive content

Centralize year-specific limits, dates, and current figures instead of repeating them across components. A substantive content update must change the product version or source review date and add an update-history entry. Cosmetic changes should not be described as a new substantive edition.

### Customer notification criteria

Notify customers with active included-update periods when a change materially affects:

- a calculation method;
- an eligibility or contribution framework;
- a time-sensitive figure used by the product;
- a material source correction;
- a security or access issue;
- a decision-output interpretation; or
- a previously unsupported or misleading claim.

Do not send an update notice for minor copy, spacing, color, or performance changes unless customer action is required.

### Deprecation

- retain a dated update-history entry;
- stop selling a deprecated edition;
- preserve access to the purchased edition when feasible;
- clearly label superseded content and direct customers to current official sources;
- do not silently overwrite a customer&apos;s saved decision record;
- document any required migration or export path.

## Release gates

Commerce must remain disabled until all are true:

- founder explicitly approves launch;
- Vercel production plan is approved;
- Redis is connected and production-scoped;
- Resend access email is verified;
- Lemon Squeezy merchant and exact one-time variant are verified;
- webhook signature, paid, duplicate, delayed, failed, and refund paths pass;
- checkout displays approved access, update, refund, support, privacy, and license terms;
- test purchase and refund complete without a real charge;
- protected-content network and bundle inspection passes;
- mobile, tablet, desktop, keyboard, print, and error-state reviews pass;
- production logs show no unexpected errors;
- final legal/content/accessibility review status is documented;
- Linear launch blockers are closed with evidence.

## Known limitations at implementation handoff

- Production infrastructure credentials and merchant approval are not configured by repository code.
- The final refund window and support SLA are not approved.
- A gated designed v3.0 reference PDF requires persistent private storage and a signed URL.
- Personalized browser print/PDF works, but automated server-generated PDFs are intentionally not implemented because they would add sensitive-data handling and rendering infrastructure.
- The workspace uses passwordless email rather than a full profile/password system to minimize friction and stored data.
- The current Redis REST implementation is intentionally small; higher transaction volume may justify atomic Lua or transaction wrappers and more detailed audit retention.
- External professional review remains a launch dependency rather than an implied claim.

## Operational principle

The product should remain useful even when the customer does not complete every module. It should preserve uncertainty rather than manufacture confidence, keep employer documents controlling, separate dollars from time and qualitative fit, and produce a dated decision record that can be reviewed without reopening every source document.
