# Medical Bill Product Foundation + Audience Validation — Implementation Record

Date: 2026-07-20  
Status: Feature branch implementation awaiting pull-request certification  
Product: Expanded Medical Bill Response Workbook v1.0  
Commercial status: Built, not for sale

## Strategic decision

Community Acquired Finance will not activate payment collection for the Expanded Medical Bill Response Workbook during this release.

The immediate objective is to build a durable product, email, analytics, trust, and distribution backbone while the site develops consistent non-founder traffic and repeat readership. The free Medical Bill Response System and free Medical Bill Response Pack remain fully available.

The workbook foundation adds organization and reusable execution support:

- Document, visit, claim, and bill mapping
- EOB-to-bill comparison worksheets
- Provider and insurer call preparation and logs
- Written-request and itemized-bill templates
- Denial, prior-authorization, assistance, and collections organizers
- Deadline and caregiver coordination
- Bounded scenario pathways

The product does not determine what a person owes, review coding, negotiate a bill, provide representation, or guarantee savings or outcomes.

## Product asset

The private master contains 32 pages and exists as:

- Printer-ready PDF
- Editable DOCX
- Versioned Markdown source
- Six-page public sample PDF
- Public browser sample

The full master is intentionally absent from the public repository. The website contains representative previews only.

## Production architecture

### Product-laboratory route

`/products/expanded-medical-bill-response-workbook`

The route is a first-party static HTML page with:

- Independent canonical URL and metadata
- Accessible mobile layout
- Representative previews
- A local browser companion
- An early-access interest form
- Free-system and free-pack routing
- Explicit no-payment status
- Clear privacy and scope limitations

### Payment boundary

`api/product-config.ts` hard-disables commerce and returns:

- `productStatus: audience_validation`
- `checkoutEnabled: false`
- Empty checkout URL
- `deliveryMode: interest_only`
- Payment decision deferred until traffic and operational gates are met

No payment SDK is installed. CAF does not collect card information. No environment variable can silently activate checkout in this release.

### Conversion and distribution layer

The productization scripts add restrained product-laboratory pathways to:

- Medical Bill Response System
- Patients and Families gateway
- EOB explainer
- Hospital financial-assistance explainer
- Facility versus professional fee explainer
- Prior-authorization explainer
- Large-medical-bill checklist
- Medical-bill collections explainer

The hub also receives a consented medical-bill email entry point. These interfaces do not request bill amounts, diagnoses, claim details, provider names, insurer names, account numbers, document uploads, or other protected information.

### Email lifecycle

`api/send.ts` supports:

- Generic newsletter
- 403(b) estimate
- Medical-bill sequence entry
- Medical-bill workbook interest

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
- `supporting_page_to_product`
- `premium_product_preview`
- `premium_interest_submit`
- `medical_bill_email_sequence_start`
- `official_source_click`
- `print_or_save_action`

Some event names retain the word `premium` for historical continuity, but no purchase or checkout is active. Event properties do not contain email addresses, bill amounts, provider names, insurer names, claim data, diagnoses, or document contents.

Purchase, cancellation, refund, revenue, and paid-delivery events are intentionally absent because no commercial transaction exists.

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

These figures are baselines, not evidence of product performance or willingness to pay.

## Thirty-day validation checkpoint

Review after 30 full days of stable production exposure:

- Medical-bill search impressions and non-branded clicks
- Product-laboratory page sessions
- Public-sample engagement
- Medical Bill Response System use
- Router starts and completions
- Free-pack opens
- Early-access contact saves
- Email delivery and unsubscribe status
- Supporting-page-to-system and supporting-page-to-product clicks
- Returning users
- Qualitative feedback that contains no protected information
- Mobile and accessibility defects

Decision rules:

- Continue free audience development when the system receives useful traffic but limited early-access interest.
- Revise product language or structure when product views occur without sample engagement.
- Refine the workbook from repeated user questions and observed workflow usage.
- Do not infer willingness to pay from traffic or isolated signups.
- Do not enable payment at the 30-day checkpoint.

## Sixty-day decision checkpoint

Payment may be considered only when all of the following are true:

1. Resend sender verification, audience persistence, delivery, and unsubscribe are verified in production.
2. The medical-bill cluster receives consistent non-founder traffic across multiple weeks.
3. Public-sample and early-access engagement are repeatable rather than isolated.
4. The site has documented digital-product support, refund, tax, privacy, licensing, and delivery processes.
5. A secure hosted payment provider can be used without CAF collecting card information.
6. The full workbook has completed final accessibility, source, and editorial review.
7. Founder approval is recorded before any purchase control is introduced.

Meeting these conditions permits a separate commerce implementation review; it does not require monetization. The workbook may remain a free authority and audience-growth asset if that produces greater strategic value.

## Deferred operational layer

- Payment processor
- Checkout page and purchase button
- Webhooks
- Paid delivery authorization
- Refund processing
- Sales-tax configuration
- Purchase receipts
- Customer-support workflow
- Paid-product terms activation
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
- Automated Emails 2–4 without consent-aware provider automation
- Public hosting of the complete master workbook

## Recommended growth work after release

1. Refresh the strongest medical-bill supporting pages using Search Console evidence.
2. Build repeatable distribution around EOB, facility-fee, financial-assistance, and prior-authorization workflows.
3. Verify Resend sender, audience, delivery, and unsubscribe behavior.
4. Review the audience-validation funnel at 30 and 60 days.
5. Use actual traffic and workflow evidence to decide whether the next major system should be the Discharge and Post-Acute Care Planner or another higher-demand pathway.
