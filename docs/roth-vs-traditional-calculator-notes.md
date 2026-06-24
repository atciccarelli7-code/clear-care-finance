# Roth vs. Traditional Decision Tool Notes

## Status

- Post-AdSense staging branch work
- Do not merge while Google AdSense review is pending
- Do not deploy production from this branch
- Suggested tools anchor: `/tools#roth-traditional`
- Related existing tool: `/tools#403b`

## Purpose

Help healthcare workers compare Roth and Traditional retirement contributions as an educational tax-rate tradeoff, using current marginal tax-rate assumptions, expected retirement tax-rate assumptions, contribution amount, time horizon, growth assumptions, account type, and employer-match treatment.

## Required outputs covered

- Estimated current tax savings from Traditional
- Estimated after-tax cost of Roth today
- Estimated future account value before retirement taxes
- Estimated Traditional after-tax retirement value
- Estimated Roth retirement value under qualified-withdrawal assumption
- Roth minus after-tax Traditional estimate
- Plain-English interpretation of current-vs-future tax-rate assumptions
- Employer-match note explaining that employer contributions are often treated as pre-tax/traditional

## Guardrails

- Educational only; not tax, legal, investment, or individualized financial advice
- Does not claim Roth is always better
- Does not claim Traditional is always better
- Does not model every lifetime tax variable or plan-specific rule
- Users should verify IRS contribution limits, plan rules, state taxes, withdrawal rules, and qualified-withdrawal requirements

## Release checklist

- [ ] Keep PR as draft and marked `Post-AdSense / Do Not Deploy Yet`
- [ ] Confirm AdSense approval before merge
- [ ] Test `/tools#roth-traditional`
- [ ] Confirm mobile layout around 390px width
- [ ] Run `npm run lint`
- [ ] Run `npm test`
- [ ] Run `npm run build`
- [ ] Confirm no AdSense/ad configuration changes are included
- [ ] Merge/deploy only through the approved production flow after review is complete
