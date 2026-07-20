# Medical Bill Productization + Revenue Validation — Implementation Record

Date: 2026-07-20  
Status: Feature branch implementation awaiting pull-request certification  
Product: Expanded Medical Bill Response Workbook v1.0  
Price test: $24 one time

## Strategic decision

Community Acquired Finance will test direct consumer revenue through an optional execution workbook attached to the free Medical Bill Response System. Essential rights, official-source routing, document identification, and the free Medical Bill Response Pack remain available without purchase.

The paid value is organization and reusable execution support:

- Document, visit, claim, and bill mapping
- EOB-to-bill comparison worksheets
- Provider and insurer call preparation and logs
- Written-request and itemized-bill templates
- Denial, prior-authorization, assistance, and collections organizers
- Deadline and caregiver coordination
- Bounded scenario pathways

The product does not determine what a person owes, review coding, negotiate a bill, provide representation, or guarantee savings or outcomes.

## Product asset

The private master contains 32 pages and was created in:

- Printer-ready PDF
- Editable DOCX
- Versioned Markdown source
- Six-page public sample PDF

The full master is intentionally absent from the public repository. The production page contains representative browser previews only.

## Production architecture

### Product route

`/products/expanded-medical-bill-response-workbook`

The route is a first-party static HTML page in `public/products`. It has an independent canonical URL, metadata, accessible mobile layout, representative previews, a local browser companion, an interest form, source links, and a clear free-versus-paid boundary.

### Checkout gate

`api/product-config.ts` exposes only:

- Product ID
- Price
- Whether checkout is enabled
- A validated HTTPS hosted-checkout URL
- Delivery mode

Checkout is disabled unless the server environment contains:

`MEDICAL_BILL_WORKBOOK_CHECKOUT_URL=https://...`

No payment SDK is installed. CAF does not collect card information. A hosted provider must own payment, receipt, secure delivery, refund processing, and purchase-completion records.

### Conversion layer

`public/medical-bill-productization.js` is loaded from the application shell and product page. It adds restrained product pathways to:

- Medical Bill Response System
- Patients and Families gateway
- EOB explainer
- Hospital financial-assistance explainer
- Facility versus professional fee explainer
- Prior-authorization explainer
- Large-medical-bill checklist
- Medical-bill collections explainer

The hub also receives a consented medical-bill email entry point. The layer does not request names beyond optional first name, bill amounts, diagnoses, claim details, provider names, insurer names, account numbers, or other PHI.

### Email lifecycle

`api/send.ts` supports:

- Generic newsletter
- 403(b) estimate
- Medical-bill sequence entry
- Medical-bill product interest

The API creates signed unsubscribe URLs and sends `List-Unsubscribe` headers. `api/unsubscribe.ts` verifies the token and updates the Resend audience contact to `unsubscribed: true`.

Only Email 1 of the medical-bill sequence is sent transactionally. Emails 2–4 are approved in `docs/email-sequences/medical-bill-free-pack-sequence.md` but must be activated through provider-side audience automation that checks current unsubscribe status before each send.

Required email configuration:

- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- Verified `RESEND_FROM_EMAIL`
- `PUBLIC_SITE_URL=https://communityacquiredfinance.com`
- Optional dedicated `EMAIL_UNSUBSCRIBE_SECRET`

## Analytics events

The privacy-safe funnel emits fixed events only:

- `medical_bill_product_view`
- `free_pack_download`
- `free_pack_email_signup`
- `free_to_premium_click`
- `premium_product_preview`
- `premium_checkout_start`
- `premium_interest_submit`
- `medical_bill_email_sequence_start`
- `official_source_click`
- `print_or_save_action`

Purchase completion, cancellation, refunds, revenue, and product delivery events cannot be truthfully implemented until a hosted payment and delivery provider is authorized.

## Pre-launch baseline

Latest settled 28-day / available 90-day Search Console baseline at implementation:

- 8 clicks
- 871 impressions
- 0.918% CTR
- 54.88 average position

Relevant early page signals:

- Hospital financial assistance: 10 impressions, average position 4.8
- Facility versus professional fee: 26 impressions, average position 18
- EOB explainer: 52 impressions, average position 73.13
- Prior authorization: 9 impressions, average position 22.78
- Patients and Families: 1 click, 20 impressions, average position 21.05

Analytics snapshot available in the monetization tracker:

- 181 visitors
- 459 pageviews
- 2.54 views per visitor

These are baselines, not evidence of product performance.

## External operational gates

### Gate 1 — Hosted payment and delivery

The founder must authorize one secure hosted provider and configure:

- $24 one-time product
- Receipt and tax behavior
- Secure customer delivery
- Refund policy
- Duplicate-purchase handling
- Checkout success and cancellation destinations
- Production checkout URL in Vercel

Until then, the live site displays an honest interest-only state.

### Gate 2 — Resend sender verification

The production sending domain and sender must be verified. The existing API can save consented contacts even when sender verification prevents delivery, and the UI states that limitation accurately.

### Gate 3 — Provider-side lifecycle automation

Emails 2–4 must be configured in Resend Automations/Broadcasts or an equivalent consent-aware provider workflow. They must not be scheduled as independent Vercel transactional sends.

## Thirty-day validation checkpoint

Review after 30 full days of stable production exposure:

- Product-page sessions
- Unique product-preview engagement
- Free-to-product click rate
- Launch-list signups
- Medical-bill email signups
- Email 1 delivery and unsubscribe rate
- Supporting-page-to-hub and supporting-page-to-product clicks
- Free pack downloads
- Qualitative feedback
- Mobile and accessibility issues

Decision rule:

- Continue toward checkout authorization if the product receives repeated qualified interest from more than one acquisition source and the free system continues to be used.
- Revise the offer or product language if product views occur without preview engagement or interest signups.
- Do not infer willingness to pay from traffic alone.

## Sixty-day decision checkpoint

After checkout is authorized and 60 days of measurable exposure are available, review:

- Checkout starts
- Completed purchases
- Gross revenue
- Refunds
- Download success
- Free-to-paid conversion
- Email-assisted conversion
- Source-page conversion
- Support burden
- Product corrections
- Customer feedback on actual use

Decision rule:

- Scale only if purchases come from non-founder users, delivery works reliably, refunds and support remain manageable, and the free product retains trust and usage.
- Improve the Medical Bill cluster before building another paid product if search and free-pack demand grow but purchase evidence remains weak.
- Select the next paid product only from observed demand. The provisional candidates are the Discharge and Post-Acute Care Planner and Healthcare Worker Benefits Review Workbook, but neither is approved by this implementation.

## Deferred by design

- Subscriptions
- User accounts
- Bill uploads or OCR
- Personalized bill review
- Negotiation services
- Affiliate offers
- Lead generation
- Advertisements
- State-by-state page expansion
- Hospital B2B procurement
- Automated emails 2–4 without consent-aware provider automation
- Public hosting of the premium master file
