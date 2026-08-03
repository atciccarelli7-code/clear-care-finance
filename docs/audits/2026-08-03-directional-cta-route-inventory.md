# Directional CTA route inventory — 2026-08-03

This inventory records all 160 canonical routes. It distinguishes implemented changes, accepted existing behavior, pages where a conversion CTA is inappropriate, and a ranked article-specific backlog. The CSV is the authoritative row-level artifact.

## Summary

| Measure | Count | Share |
|---|---:|---:|
| Canonical routes reviewed | 160 | 100% |
| Routes changed by at least one bounded CTA rule | 30 | 18.8% |
| Routes with competing global endcaps before resolver | 14 | 8.8% |
| Priority article handoffs changed | 3 of 71 | 4.2% of articles |
| Dynamic tool hero labels changed | 14 | 8.8% |
| Deferred article-specific audits | 65 | 40.6% |
| Routes where no primary conversion CTA is appropriate | 2 | 1.3% |

## Guardrails

- All 160 canonical routes, redirects, metadata, indexability, and legacy anchors remain unchanged.
- The current homepage, Start Here, Tools directory, and navigation experiment remain intact.
- Typed Decision Outcome result architecture remains intact.
- Stripe, Supabase, checkout, premium availability, advertising eligibility, and email capture are unchanged.
- CTA analytics contain fixed route/action metadata only; no inputs, results, plan data, health data, or device fingerprint fields.

The machine-readable route inventory is `docs/audits/2026-08-03-directional-cta-route-inventory.csv`.
