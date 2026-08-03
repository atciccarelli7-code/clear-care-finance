# Phase 3 — Benefits Decision System Demand Validation

**Release status:** Pending exact-head validation and production deployment  
**Date:** August 3, 2026  
**Related issue:** AND-102  
**Related pull request:** #253

## Summary

This release introduces a bounded, no-charge demand-validation funnel for the Healthcare Worker Benefits Decision System at a proposed $29 one-time price.

It does not enable checkout, collect payment information, create accounts or entitlements, reserve a product, or deliver paid access.

## Visitor experience

A visitor using the Healthcare Worker Total Compensation Comparison may see one optional handoff asking whether a complete Open Enrollment Workspace could be worth $29.

The controlled offer page explains:

- what remains free;
- what the proposed paid system would add;
- the eight-step workflow;
- the intended user and use cases;
- material limitations;
- the $29 one-time hypothesis;
- the no-card, no-checkout, no-charge status;
- the privacy and data-minimization boundary;
- free alternatives.

The early-access form requires a valid email address and two separate confirmations: serious consideration of the $29 price and consent to product-specific email updates.

## Data and privacy

The product commitment record is stored in a forced-RLS, service-role-only Supabase table. It contains only fixed offer metadata, normalized email, one-way email hash, random session identifier, consent and commitment status, and timestamps.

The release does not request or store employer names, benefit-plan details, salary or benefit values, medical information, member IDs, claims, financial-account information, payment-card information, uploads, or free-text notes.

Anonymous offer views and CTA opens are stored only after analytics consent and cannot contain the email address or form contents.

## Search and advertising

- The offer page is prerendered for reliability.
- It is `noindex, nofollow, noarchive`.
- It is excluded from the public sitemap.
- It is not an AdSense-eligible route.
- The retired Decision Pack URL continues to resolve to the current offer.

## Commerce state

Unchanged:

- checkout disabled;
- production checkout authorization disabled;
- no payment method requested;
- no Stripe Checkout Session created for visitors;
- no entitlement created from a commitment;
- private application access remains fail closed.

## Measurement

The experiment is governed by the repository measurement plan and Linear AND-102.

- Minimum decision sample: 25 distinct consented qualified offer views within 28 days.
- Continue threshold: at least 3 active commitments and at least 10% view-to-commitment.
- Stop or materially rework: 50 qualified views with zero commitments.
- Below the minimum sample: inconclusive.

The result is a demand signal, not purchase conversion, product-market fit, revenue, retention, or customer-success evidence.

## Validation evidence

Before merge and production release, the exact PR head must pass:

- governance and trust checks;
- full unit and integration suite;
- migration contracts;
- production build and bundle budget;
- prerender and search-readiness checks;
- browser, mobile, and accessibility certification;
- form payload and no-charge boundary checks;
- premium fail-closed and checkout-disabled checks;
- Vercel preview review;
- Supabase RLS, grant, constraint, index, and rollback-safe insert verification;
- unresolved-review-thread check.

## Rollback

Rollback removes the offer handoff and page, disables the commitment endpoint, and re-parks the product route while preserving existing free resources. The Supabase table may remain sealed and empty or be removed through a reviewed migration. Existing checkout and entitlement systems remain disabled throughout.
