# CAF Compounding Growth Scorecard

Effective date: 2026-07-12
Product scope: One-Minute Decision Concierge, Benefits Change Detector, Benefits Change Receipt, and the employer-benefit-change acquisition page.

This scorecard defines how Community Acquired Finance can measure the complete journey without inventing a baseline or transmitting benefit answers, dates, amounts, employer information, plan information, Receipt contents, query strings, or local-storage contents.

## Measurement status

| Metric | Definition | Current status | Source required | Target | Actual |
| --- | --- | --- | --- | --- | --- |
| Organic impressions | Search-result impressions for the acquisition page and connected canonical journeys | Requires external data | Google Search Console | Set after a 28-day baseline | Not yet measured |
| Organic clicks | Search clicks to the acquisition page and connected journeys | Requires external data | Google Search Console | Set after a 28-day baseline | Not yet measured |
| Indexed acquisition pages | Count of intended acquisition pages indexed under their canonical URLs | Currently inspectable; ongoing confirmation requires Search Console | Sitemap, rendered canonical checks, Search Console | 1 focused page for v1 | Build-time route evidence only |
| Acquisition-page-to-tool click rate | Acquisition-page Detector CTA selections divided by acquisition-page views | Currently measurable after deployment and consent | `acquisition_tool_cta_selected`, page views | Set after a 28-day baseline | Not yet measured |
| Concierge start rate | Concierge starts divided by Concierge views | Currently measurable after deployment and consent | `concierge_viewed`, `concierge_started` | Set after a 28-day baseline | Not yet measured |
| Concierge completion rate | Concierge completions divided by Concierge starts | Currently measurable after deployment and consent | `concierge_completed`, `concierge_started` | Set after a 28-day baseline | Not yet measured |
| Tool completion rate | Completed benefits reviews divided by started benefits reviews | Currently measurable after deployment and consent | `benefits_review_started`, `benefits_review_completed` | Set after a 28-day baseline | Not yet measured |
| Receipt action rate | Receipts with at least one copy, print, calendar, or share action divided by Receipt views | Currently measurable after deployment and consent | Receipt action events, `benefits_receipt_viewed` | Set after a 28-day baseline | Not yet measured |
| Related-journey click rate | Fixed related-journey openings divided by Receipt views | Currently measurable after deployment and consent | `benefits_related_journey_opened`, `benefits_receipt_viewed` | Set after a 28-day baseline | Not yet measured |
| Safe My Plan save rate | Existing fixed My Plan action saves originating from the Detector divided by completed reviews | Currently measurable through the existing My Plan event after deployment and consent | `tool_plan_action_added`, `benefits_review_completed` | Set after a 28-day baseline | Not yet measured |
| Returning-user rate | Broad local-review resumes divided by unique consenting visitors with a started review | Partially measurable; browser-local continuity and consent/device limits apply | `benefits_review_resumed`, `benefits_review_started` | Set after a 28-day baseline | Not yet measured |
| Article pageviews | Views of the employer-benefit-change acquisition page | Currently measurable after deployment and consent | Analytics page views | Set after a 28-day baseline | Not yet measured |
| Article page RPM | Article revenue divided by article pageviews, multiplied by 1,000 | Requires monetization data | AdSense plus Analytics reconciliation | Set only after stable monetization data exists | Not yet available |
| Revenue by channel | Revenue attributed to organic search, direct, referral, and other approved channel groups | Requires external reporting and attribution rules | AdSense and Analytics | Future target after a reliable baseline | Not yet available |
| AI referral sessions | Sessions arriving from recognized AI-assistant referrers | Requires Analytics reporting and a maintained referral classification | Analytics | Set after classification is validated | Not yet measured |
| AI citation visibility | Presence of the acquisition page or CAF passages in answer-engine citations for a controlled query set | Requires future monitoring infrastructure or a documented manual sample | Future citation-monitoring process | Define after a reproducible method exists | Not currently measurable |

## Privacy-safe funnel

The v1 funnel uses fixed event names and fixed categorical properties only:

1. `concierge_viewed`
2. `concierge_started`
3. `concierge_completed`
4. `concierge_destination_opened`
5. `acquisition_tool_cta_selected`
6. `benefits_review_started`
7. `benefits_review_completed`
8. `benefits_receipt_viewed`
9. Receipt actions: copied, printed, calendar created, canonical link shared
10. `benefits_related_journey_opened`
11. Continuity actions: resumed, reset, local review deleted

Allowed properties are limited to fixed entry surface, broad problem category, canonical destination ID, completion band, fixed Receipt action, and fixed handoff ID. The implementation allowlist rejects arbitrary values and unknown property names before the existing consent-gated analytics layer is called.

## Review cadence

- Weekly after launch: confirm event delivery, zero sensitive properties, route health, and gross funnel counts.
- Monthly: calculate rates only when the denominator is large enough to avoid reacting to individual sessions.
- Quarterly: reconcile Search Console, Analytics, and monetization data; document any definition change before comparing periods.
- Annually: review event names, allowlists, source freshness, acquisition-page intent, and whether the Detector still routes into canonical CAF journeys.

## Interpretation boundaries

- A target is not an actual. No current performance baseline is claimed in this document.
- Consent-gated analytics undercount visitors who decline analytics; this is an expected privacy choice, not a tracking defect.
- Browser-local continuity cannot identify the same person across browsers or devices and should not be presented as account-level retention.
- Revenue reporting should not influence Detector prioritization, Receipt content, source selection, or tool handoffs.
