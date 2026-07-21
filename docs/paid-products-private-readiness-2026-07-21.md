# CAF Paid Products — Private Readiness Record

**Date:** July 21, 2026  
**Status:** Private build ready; commerce disabled  
**Products:** Healthcare Worker Career & Benefits Decision System; Medical Bill Response & Resolution System; combined Healthcare Money Decision Library bundle

## Decision

Community Acquired Finance will prepare two substantial one-time-purchase products without enabling public sales. The complete product masters remain in the private Notion workspace. The public repository contains only product metadata, a feature-gated internal review page, launch controls, and safeguards that prevent accidental checkout activation.

## Product portfolio

| Product | Planned standard price | Planned launch-validation price | Current status |
|---|---:|---:|---|
| Healthcare Worker Career & Benefits Decision System | $39 | $29 | `private_ready` |
| Medical Bill Response & Resolution System | $29 | $19 | `private_ready` |
| Healthcare Money Decision Library bundle | $59 | $39 | `private_ready` |

## Why the products are large enough for the price

### Healthcare Worker Career & Benefits Decision System

The system extends the existing total-compensation and offer-verification tools into a complete career decision workflow. It includes:

- document collection and decision setup;
- total-compensation comparison;
- low-, expected-, and high-use health-plan scenarios;
- retirement match, eligibility, and vesting review;
- schedule, commute, call, travel, and unpaid-time audit;
- PTO, leave, disability, and insurance protection review;
- sign-on, tuition, relocation, and repayment-risk control;
- career trajectory and role-risk review;
- HR verification tracker and scripts;
- negotiation preparation;
- final decision memo;
- resignation and transition checklist;
- 30/60/90-day reality check;
- reusable annual benefits review.

### Medical Bill Response & Resolution System

The system packages the existing 32-page Expanded Medical Bill Response Workbook and free 10-page Response Pack with a deeper case-control layer. It includes:

- case command dashboard;
- complete document inventory;
- one-visit billing-entity map;
- EOB-to-bill comparison worksheets;
- provider and insurer preparation sheets;
- written-request template library;
- financial-assistance tracker;
- denial and appeal control packet;
- collections-response organizer;
- payment-plan comparison;
- caregiver handoff packet;
- deadline and escalation calendar;
- case-closure checklist.

## Free-versus-paid boundary

Essential education, official-source links, basic rights, document identification, safest first actions, existing public calculators, and the free Medical Bill Response Pack remain available without payment.

The paid layer adds organization, integrated workflows, printable records, reusable scripts, multi-scenario worksheets, handoff controls, and repeat-use systems. It does not sell access to basic rights or urgent guidance.

## Private implementation

### Feature gate

The internal route `/tools/private-paid-product-lab` is registered only when:

```text
VITE_ENABLE_PRIVATE_PRODUCT_LAB=true
```

Without that flag, the slug is absent from the tool registry and the generic tool route redirects to the public tools directory.

### Search boundary

When the private route is enabled for a preview deployment, it receives `noindex, nofollow` metadata.

### Checkout boundary

The product catalog and `/api/product-config` use a default-deny state:

- portfolio status: `private_ready`;
- commerce enabled: `false`;
- product checkout enabled: `false`;
- checkout URLs: empty;
- delivery mode: private master not hosted.

The repository contains no active payment link and no unrestricted paid-product download.

### Environment contract

```text
VITE_ENABLE_PRIVATE_PRODUCT_LAB=false
VITE_ENABLE_PAID_PRODUCTS=false
VITE_LEMON_SQUEEZY_HEALTHCARE_PRODUCT_URL=
VITE_LEMON_SQUEEZY_MEDICAL_BILL_PRODUCT_URL=
VITE_LEMON_SQUEEZY_PRODUCT_BUNDLE_URL=
```

The commerce master switch alone cannot activate sales while catalog status remains `private_ready` and checkout fields remain disabled.

## Full product-master location

The complete source masters are maintained in the private Notion page **CAF Paid Products — Private Launch Hub**, with child masters for each individual product. Full paid content should not be committed to the public GitHub repository.

At launch, final versioned PDF and companion files will be exported from the private source, certified, and uploaded to Lemon Squeezy hosted delivery.

## Launch sequence

1. Confirm traffic and qualified-interest thresholds.
2. Activate Vercel Pro and set conservative spend controls.
3. Complete Lemon Squeezy merchant, bank, tax, and payout verification.
4. Export final versioned product files from the private master.
5. Validate US Letter and A4 print output, accessibility, links, limitations, and official-source boundaries.
6. Upload files to Lemon Squeezy and configure receipts, support, refunds, and download limits.
7. Set checkout URL environment variables in preview only.
8. Change product catalog status from `private_ready` to `launch_ready` through a reviewed pull request.
9. Run a real test purchase, download, refund, support, and analytics flow.
10. Enable the public product route and commerce flag only after founder approval.

## Launch gates

Every gate must pass:

- consistent non-founder traffic and repeated free-tool usage;
- qualified early-access demand;
- Vercel Pro active;
- Lemon Squeezy merchant and payout verification;
- final hosted files ready;
- terms, disclosures, refund, privacy, and support reviewed;
- successful end-to-end purchase and refund test;
- privacy-safe analytics verified;
- explicit founder approval.

## Validation contract

Automated tests must fail if:

- a product or bundle is no longer `private_ready` without an intentional code change;
- any checkout field is enabled or populated in the current branch;
- the private route appears without the preview flag;
- a purchase control appears on the internal product-lab page;
- the public API reports commerce enabled.

## Remaining work before launch

- Convert the Notion masters into polished versioned PDFs and companion files.
- Complete source review and update dates.
- Add product-specific refund and support copy.
- Create Lemon Squeezy products and hosted checkout links.
- Add public sales pages only after the traffic gate passes.
- Complete final browser, print, accessibility, and end-to-end payment certification.
