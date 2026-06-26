# Next Calculator Batch Draft Notes

Status: draft-only post-AdSense staging work.

Branch: `draft-next-calculator-batch`

Intended PR base: `codex-site-quality-pass`

## Guardrails

- Do not merge to `main` during AdSense review.
- Do not promote any Vercel deployment.
- Do not modify AdSense files, analytics setup, Vercel settings, or production deployment configuration.
- Treat this as stacked work on top of the existing tool-directory architecture. If PR #19 or PR #21 changes before merge, compare the tool registry and route files before integrating this batch.

## Calculators Added

1. `Backup Care Cost Planner`
   - Route: `/tools/backup-care-cost-planner`
   - Related article: `/articles/backup-care-plans-for-busy-healthcare-workers`
   - Purpose: estimate backup-care events, monthly cushion needs, emergency-rate exposure, and pickup-shift value after hidden costs.

2. `Healthcare Worker Discount Value Checker`
   - Route: `/tools/healthcare-worker-discount-value`
   - Related article: `/articles/healthcare-worker-discounts`
   - Purpose: compare a healthcare-worker discount against fees, verification time, budget, and an alternative price.

3. `Post-Shift Recovery Budget Calculator`
   - Route: `/tools/post-shift-recovery-budget`
   - Related article: `/articles/burnout-overspending-overeating`
   - Purpose: compare tired post-shift impulse spending with a planned recovery default.

## Integration Notes

- The calculators are intentionally built without current-law thresholds or external data defaults.
- Each calculator uses editable assumptions and an in-component formula block.
- Registry metadata lives in `src/data/tools.ts`; rendering is wired through `src/components/calculators/ToolRenderer.tsx`.
- Article cards were added only to the directly related articles.
- If this branch is retargeted to `main`, first verify that the base already contains the `/tools/:toolSlug` routing, `ToolRenderer`, and registry architecture from the tool-directory PR.
