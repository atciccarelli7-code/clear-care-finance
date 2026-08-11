# Pre-Commerce Demand Validation

## What is being tested

CAF is testing one fixed proposition after a user reaches the free Healthcare Worker Benefits Decision System result:

- **Free and staying free:** the complete eight-stage browser-local workflow, two-medical-plan comparison, visible unknowns, verification checklist, Benefits Decision Brief, printing, and official-source verification.
- **Proposed $29 one-time workspace:** account-based cross-device saving, multiple named decision workspaces, deeper two-option comparison across compensation, benefits, health plans, retirement, and schedule, a structured evidence ledger, and a consolidated advanced brief.

The paid workspace is proposed, not purchasable. The offer does not create a card entry, checkout, charge, purchase, reservation, entitlement, obligation, or promise to launch. The complete free result appears before the offer and is not diminished if the visitor ignores it.

The dormant premium application supplies a credible implementation basis for the proposed saved/multi-option job, but auth, persistence, delivery, and production access must still be certified before any real sale. No Medicare offer is active because current evidence does not justify a second proposition.

## Measurement contract

| Signal | Exact meaning | Decision use |
|---|---|---|
| `precommerce_offer_viewed` | The v2 offer rendered after the free Benefits result in an analytics-consented browser session; once per session/variant | Qualified denominator |
| `precommerce_offer_engaged` | The visitor deliberately opened the exact free-versus-$29 details; once per session/variant | Distinguishes review from passive exposure |
| `precommerce_commitment_started` | The visitor deliberately opened the explicit price-qualified form; once per session/variant | Stronger funnel intent |
| Active commitment row | The server accepted a fixed offer key, valid random session ID, normalized email, separate email consent, and the exact price-confirmation boolean | Price-qualified stated intent only |
| `release_verification` | A controlled synthetic record/event isolated by fixed variant or evidence class | Certification only; exclude and clean |
| `excluded` | An operator marked founder, friend/family, synthetic, duplicate, or other non-business evidence | Never count as valid |

Anonymous events require analytics consent. The explicit commitment is an intentional necessary transaction and can be recorded under Necessary only; therefore anonymous denominators cover consented sessions and can be smaller than all form submitters. No event or commitment accepts answers, amounts, employer, hospital, plan, medical data, URLs/query strings, payment data, uploads, device fingerprints, IP fields, or free text.

The physical table remains named `benefits_offer_commitments` for compatibility, but the API and client use the fixed reusable pre-commerce offer registry. A future product must earn an explicitly defined additive job and be added to that allowlist; arbitrary client values are rejected.

## Operating report

Run [`docs/operations/precommerce-demand-report.sql`](../operations/precommerce-demand-report.sql) with operator/service access. It always returns the fixed v1/v2 evidence buckets and prints `No data` rather than omitting zero rows. Do not expose the query or tables to the browser.

Interpret every rate as numerator / denominator:

- offer engagement = engaged sessions / qualified offer-view sessions;
- commitment start = form-start sessions / qualified offer-view sessions;
- price-qualified commitment = distinct active commitment emails / qualified offer-view sessions;
- commitment completion = distinct active commitment emails / form-start sessions;
- free product result rate = Benefits result sessions / Benefits start sessions.

`observed` means “not explicitly marked release verification.” It is not automatically organic. Review traffic source and exclude founder, friend/family, duplicate, or synthetic records before a commerce decision. The single legacy v1 view has unknown provenance and an invalid visible-offer denominator; it is historical context, not v2 evidence.

## Commerce activation rule

The founder should seriously consider paying for commercial infrastructure and running a real checkout experiment only when all conditions are true:

1. at least 25 genuine observed qualified v2 offer-view sessions occurred naturally after Benefits results;
2. at least 3 distinct active, non-test, non-founder, non-friend/family commitments exist (5 is materially stronger);
3. valid commitments / qualified views is at least 10%;
4. upstream Benefits starts and results show the offer is attached to real product use rather than direct/test navigation;
5. the promised workspace, authentication, persistence, support boundary, and fulfillment can be certified before accepting money;
6. the expected learning value from real checkout exceeds the incremental infrastructure and operating cost.

This rule is an economic trigger, not statistical proof and not automatic authorization. At 50 qualified views with zero genuine commitments, do not turn commerce on; inspect proposition comprehension, value, placement, and deliverability. With fewer than 25 qualified views, zeros are “insufficient evidence,” not rejection.

## What this cannot prove

Pre-commerce evidence cannot prove purchase conversion, revenue, retention, satisfaction, price optimality, market size, causality, representative demand, or that users will trust CAF with saved work. Email submission can be insincere; consent can suppress the denominator; friend/family and founder traffic can inflate results; a deliverable description is not a certified product. Only an authorized real-payment experiment can test actual purchase behavior.

## Leave-alone and next-trigger rule

Leave Benefits v2 unchanged long enough to accumulate interpretable evidence. Do not add Medicare, rotate prices, expand CTAs, or rebuild the premium platform merely to create volume. Start the next commercial Work cycle only when the activation threshold is reached, 50 qualified views establish a meaningful rejection pattern, engagement-to-commitment shows a clear value defect, users reveal that the proposition is misunderstood, or a security/privacy/deliverability issue requires intervention.
