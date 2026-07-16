# Route-Group Performance Governance

**Baseline date:** July 16, 2026  
**Suite:** `e2e/route-performance.spec.ts`  
**Budgets:** `e2e/route-performance-budgets.ts`  
**Controlling viewport:** 390 × 844 mobile Chromium  
**Runtime:** Clean production build served locally; service workers blocked; Vercel runtime scripts fulfilled locally.

These numbers are synthetic regression baselines, not production Core Web Vitals claims. Budgets are route-specific and include variance headroom over the observed clean baseline.

| Route group | Representative route | Observed LCP | CLS | Long-task proxy | JS bytes | Total bytes | Requests | Budget summary |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Entry hub | `/` | 540 ms | 0 | 211 ms | 346,595 | 364,101 | 47 | 900 ms LCP; 390 KB JS; 410 KB total; 52 requests |
| Flagship journey | `/tools/medical-appointment-cost-preparation` | 260 ms | 0 | 123 ms | 235,596 | 253,102 | 40 | 650 ms LCP; 270 KB JS; 290 KB total; 45 requests |
| Calculator/workspace | `/start-here` | 560 ms | 0 | 246 ms | 214,114 | 231,620 | 34 | 900 ms LCP; 250 KB JS; 270 KB total; 40 requests |
| Article/topic | `/articles/deductible-copay-coinsurance-out-of-pocket-max` | 540 ms | 0 | 491 ms | 524,186 | 560,588 | 35 | 900 ms LCP; 590 KB JS; 630 KB total; 40 requests |
| Medicare/cost hub | `/medicare-care-costs` | 592 ms | 0 | 283 ms | 176,989 | 194,495 | 22 | 950 ms LCP; 210 KB JS; 230 KB total; 28 requests |
| Trust/legal | `/disclosures` | 192 ms | 0 | 81 ms | 161,794 | 179,300 | 12 | 500 ms LCP; 190 KB JS; 210 KB total; 18 requests |

All groups use a CLS budget of 0.05. Long-task budgets are 400, 300, 450, 750, 500, and 250 ms respectively.

The final budget-verification rerun passed all six groups. Observed LCP ranged from 248–560 ms, CLS remained 0, and every byte, request, long-task, console, page-error, and application-request gate stayed within its calibrated limit.

## What the test enforces

- mobile LCP and CLS from buffered PerformanceObserver entries;
- aggregate long-task duration as a blocking/interaction-risk proxy;
- transferred or encoded JavaScript bytes;
- total transferred or encoded resource bytes;
- request count;
- one meaningful H1;
- no console errors, page errors, failed application requests, or first-party HTTP errors.

## Change control

1. Measure a clean production-style baseline before changing a budget.
2. Explain why a route's content or dependency profile changed.
3. Do not raise a budget solely to make a pull request pass.
4. Do not remove source notes, safety warnings, accessible names, or educational context to improve a score.
5. Keep specialized visual systems lazy with their owning route.
6. Recalibrate after a material framework/runtime change and preserve the prior observation in pull-request evidence.
7. Use production Vercel Speed Insights or field data separately when enough traffic exists; do not label this local suite as field performance.
