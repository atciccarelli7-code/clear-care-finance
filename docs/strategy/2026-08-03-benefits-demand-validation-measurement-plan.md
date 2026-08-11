# CAF Phase 3 — Benefits Decision System Demand-Validation Plan (superseded)

> Superseded on 2026-08-11 by [`2026-08-11-precommerce-demand-validation.md`](./2026-08-11-precommerce-demand-validation.md). The v1 Total Compensation placement and canonical-route offer-view denominator described below were retired because the destination had become a complete free workflow and no longer displayed the priced proposition. Keep this file only as historical experiment context; do not use its v1 events for the v2 commerce decision.

**Date:** August 3, 2026  
**Product:** Healthcare Worker Benefits Decision System  
**First workflow:** Open Enrollment Workspace  
**Offer:** $29 one time  
**Experiment status:** Bounded demand test; no checkout, charge, reservation, account, entitlement, or product access

## Decision being tested

The experiment tests one question:

> After reviewing the proposed scope, limitations, free-versus-paid boundary, privacy posture, and $29 one-time price, will qualified healthcare workers explicitly say they would seriously consider paying for the system if it launches?

It does not test payment completion, customer satisfaction, retention, renewal, product effectiveness, or support burden.

## Funnel definition

1. A visitor reaches the Healthcare Worker Total Compensation Comparison, the single high-intent source route for the initial experiment.
2. The visitor deliberately opens the controlled offer page.
3. The offer page explains the $29 price, proposed outcome, workflow, limitations, free alternatives, privacy boundary, and unavailable-checkout status.
4. The visitor may open the early-access form.
5. A commitment counts only after the visitor supplies a valid email address and confirms both:
   - serious consideration of a $29 one-time purchase if the described product launches;
   - consent to receive product-specific confirmation and launch updates.

A generic page view, navigation click, CTA open, newsletter subscription, social-media reaction, or unpriced interest response is not a price-qualified commitment.

## Primary measures

### Qualified offer views

Count distinct random browser-session identifiers with a consented `benefits_offer_viewed` event for offer version `benefits_offer_29_v1`.

Limitations:

- Only visitors who choose analytics consent enter this denominator.
- A browser-session identifier is not a verified unique person.
- Consent and low traffic may make the sample unrepresentative.
- Offer views do not establish comprehension.

### Active price-qualified commitments

Count distinct active product commitments deduplicated by a one-way normalized-email hash for:

- product `healthcare-worker-benefits-decision-system`;
- offer version `benefits_offer_29_v1`;
- price 2,900 cents USD;
- source `total_compensation_comparison`;
- commitment statement `would_consider_29_v1`.

Unsubscribed commitments are inactive and excluded from the active-commitment numerator.

### View-to-commitment rate

`active price-qualified commitments / distinct consented qualified offer views`

This rate must always be reported with both numerator and denominator. It must not be described as a purchase conversion rate.

## Decision thresholds

### Continue to Phase 4 product completion

After at least 25 distinct consented qualified offer views within 28 days:

- at least 3 active price-qualified commitments; and
- at least 10% view-to-commitment.

Passing this threshold supports continued product completion. It does not authorize checkout or prove product-market fit.

### Stop or materially rework

After 50 distinct consented qualified offer views:

- zero active price-qualified commitments.

This result requires a material change to offer, audience, scope, positioning, price, or product selection before additional buildout.

### Inconclusive

Fewer than 25 distinct consented qualified offer views after the initial 28-day window is inconclusive. The founder may extend the window or conduct bounded direct outreach, but must not report acceptance or rejection as established.

## Secondary diagnostic measures

Use only to diagnose friction, not to replace the primary commitment outcome:

- distinct offer CTA opens;
- offer-view to CTA-open rate;
- commitment form errors;
- successful confirmation-email delivery rate;
- unsubscribe count;
- direct qualitative feedback collected outside the form.

No employer, plan, salary, medical, benefit, account, or payment detail may be added to analytics to improve diagnostic precision.

## Privacy and data boundary

The commitment table stores only:

- random session ID;
- fixed product, offer, price, currency, source, and commitment-version fields;
- normalized email and one-way email hash;
- explicit consent and price-confirmation booleans;
- active/unsubscribed status and timestamps.

The experiment does not request or store employer names, plan documents, plan elections, salary, benefit values, diagnoses, medical records, member IDs, claims, financial accounts, payment cards, uploads, or free-text notes.

Anonymous offer evidence is stored separately from the contact record and only after analytics consent. The anonymous evidence payload cannot contain the email address or form contents.

## Commerce boundary

Throughout Phase 3:

- `PREMIUM_CHECKOUT_ENABLED` remains false;
- `PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED` remains false;
- `/api/checkout` must fail closed;
- no Stripe Checkout Session may be created for a visitor;
- no payment method may be requested;
- no entitlement may be created from the offer page or commitment record;
- no account is required or created.

## Reporting schedule

- **Initial baseline:** immediately after production release and cleanup of release-test records.
- **Weekly operational check:** verify route health, API errors, email delivery, unsubscribe behavior, and that checkout remains disabled. Do not make a demand judgment from an undersized sample.
- **Primary decision review:** 28 days after production release or immediately after 50 qualified views, whichever creates a decision threshold first.
- **Early safety review:** immediately after any privacy, consent, storage, delivery, accessibility, route, or runtime defect.

## Reassessment triggers

Reopen the experiment design before the scheduled review if:

- the offer is shown from additional source routes;
- price or product scope changes;
- analytics consent logic changes;
- commitments cannot be reconciled with offer views;
- form spam or duplicate behavior becomes material;
- confirmation or unsubscribe behavior fails;
- a user reasonably interprets the commitment as a purchase or reservation;
- checkout, account, or entitlement state changes;
- direct research shows material misunderstanding of the offer.

## Controlling records

- Linear AND-102
- GitHub PR #253
- Supabase migration `benefits_offer_validation`
- Phase 1 free-core/single-flagship founder decision
- Phase 2 public-site architecture release
