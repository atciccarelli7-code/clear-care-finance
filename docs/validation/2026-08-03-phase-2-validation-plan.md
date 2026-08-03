# Phase 2 Validation Plan

## Automated gates

- Unit and integration tests
- Type checking and lint
- Production build and prerender
- Route, metadata, sitemap, and publication checks
- Public-product architecture regression suite
- Premium fail-closed checks
- Accessibility and mobile browser certification

## Preview checks

- Homepage clearly distinguishes free preparation and paid completion.
- Primary navigation shows Start Here, Free Tools, Healthcare Workers, Patients & Caregivers, and Decision System.
- Decision System leads to the healthcare-worker flagship preview.
- Tools states that listed public tools are free.
- Start Here retains one guided router and adds only a subordinate product handoff.
- Free workplace-benefits comparison remains usable and clearly subordinate to the complete system.
- No purchase button, checkout form, payment request, or active premium claim appears.
- Privacy, source, disclosure, and official-verification links remain available.

## Production checks after merge

- Main deployment is READY.
- Homepage, Start Here, Tools, Healthcare Workers, Benefits comparison, and product redirect return successfully.
- Checkout flags and public purchase state remain disabled.
- No new runtime errors appear on affected routes.
