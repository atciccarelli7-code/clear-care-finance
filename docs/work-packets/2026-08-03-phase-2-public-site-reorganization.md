# CAF Phase 2 — Public Site Reorganization

## 1. Assignment charter

Reorganize the public site around the founder-approved model: substantial free education and tools plus one visible paid flagship. The Healthcare Worker Benefits Decision System is the flagship; Open Enrollment Workspace is the first workflow. Checkout remains off.

## 2. Current-state evidence

- Phase 1 founder decision and route-role inventory are merged in PR #251.
- Homepage, Start Here, Tools, Healthcare Workers, the benefits comparison, header, footer, metadata, and product registry were reviewed on current main.
- Employer guides establish that benefit decisions involve eligibility, plan costs, networks, prescriptions, accounts, retirement, protection benefits, deadlines, and source authority.
- Existing demand evidence does not establish willingness to pay.

## 3. Evidence classification

- **Verified:** CAF has a large free public library and no active checkout.
- **Founder decision:** Free preparation plus one paid completion system.
- **Supported inference:** The healthcare-worker hub is the safest Phase 2 preview surface.
- **Hypothesis:** Clearer framing will improve qualified product comprehension.
- **Unknown:** Price acceptance, conversion, and manual-entry tolerance.

## 4. Context and decision memory

This work preserves CAF-D-001, CAF-D-002, CAF-D-003, CAF-D-013, CAF-D-014, and the Phase 1 free-core/single-flagship decision.

## 5. Inherited-decision challenge gate

- Preserve the current product-route redirect during Phase 2; Phase 3 may replace it with the bounded offer page.
- Reposition the Benefits Command Center as a free focused comparison rather than a parallel product identity.
- Keep five primary navigation items but change their business meaning.
- Do not delete broad content inventory without route-level evidence.
- Treat $29 as a validation hypothesis only.

## 6. Capability plan

- GitHub: implementation, tests, PR, and release evidence.
- Linear: AND-111 scope and closeout.
- Notion and Drive: durable architecture and release records.
- Vercel: preview and production verification.
- Supabase and Stripe: non-change confirmation only.

## 7. Independent role matrix

| Role | Status | Finding |
|---|---|---|
| Strategy | PASS | One flagship concentrates attention and preserves the mission. |
| Product | PASS | Paid value is coordination, saved work, source control, and a final brief. |
| Healthcare user context | WARN | Problem complexity is supported; demand remains unproven. |
| Information architecture | PASS | Decisions, free resources, flagship, and trust become distinguishable. |
| UX/design | PASS | Existing components and design language are reused. |
| Editorial/evidence | PASS | Basic and safety-critical information remains public. |
| Frontend | PASS | Scope is limited to public hierarchy, copy, metadata, and tests. |
| Backend/security | NOT IMPLICATED | No API, auth, entitlement, or data change. |
| SEO | PASS | Routes and sitemap are preserved. |
| Monetization | WARN | Offer comprehension improves, but conversion is not validated. |
| Analytics | PASS | Existing fixed event identifiers are preserved. |
| Accessibility/reliability | WARN | Exact-head automated and browser validation is required. |
| Privacy/user protection | PASS | No new sensitive-input or payment collection. |
| Quality/release | WARN | Merge is blocked until all checks pass. |
| Red team | PASS | Multiple-product dilution and premature commerce are blocked. |

## 8. Executive accountability matrix

| Perspective | Status | Consequence |
|---|---|---|
| CEO | PASS | CAF presents as a product company, not only a publisher. |
| COO | PASS | Self-serve scope limits support burden. |
| CFO | WARN | No revenue forecast is justified. |
| CRO | WARN | Phase 3 must measure price-qualified commitment. |
| CPO | PASS | Open Enrollment Workspace remains the only paid wedge. |
| CTO | PASS | Existing architecture is reused. |
| Marketing | PASS | Decision language replaces category-first positioning. |
| Editorial | PASS | Free public value is protected. |
| Privacy/legal | PASS | Official sources remain controlling. |
| Quality | WARN | Exact-head and production checks remain mandatory. |

## 9. Anti-blindness findings

The main counterargument is that a product-led reorganization could make patient and caregiver audiences feel secondary. They remain explicit primary-navigation destinations and their resources are unchanged. The weakest assumption is that users will understand the free comparison versus paid complete system; both surfaces now state that boundary directly.

## 10. Quantified impact

| Measure | Before | After |
|---|---:|---:|
| Clearly named paid flagships in public IA | 0 | 1 |
| Primary navigation items | 5 | 5 |
| Core surfaces explaining free versus paid | 0 consistently | 5 |
| Purchasable products | 0 | 0 |
| Public tools paywalled | 0 | 0 |
| Routes removed | 0 | 0 |
| Sitemap changes | 0 | 0 |
| New sensitive fields | 0 | 0 |
| Architecture regression suites | 0 | 1 |

## 11. Anomaly gate

The change affects several prominent surfaces but does not reduce indexability, remove functionality, activate payments, or change data systems. Product-page clicks must not be interpreted as demand validation.

## 12. Candidate ranking

1. Reframe current core surfaces and preserve routes — selected.
2. Launch a paid offer and waitlist simultaneously — deferred to Phase 3.
3. Display several paid products — rejected.
4. Bulk-delete content — rejected without evidence.
5. Activate accounts or checkout — rejected as premature.

## 13. Integrated decision

Reframe the homepage, Start Here, Tools, healthcare-worker hub, free workplace-benefits comparison, navigation, footer, metadata, and flagship definition. Keep all public tools free and keep commerce disabled.

## 14. Validation dispositions

- **Technical:** Pending exact-head CI, build, browser, accessibility, mobile, route, and Vercel checks.
- **Business architecture:** PASS.
- **Demand and price:** WARN; unresolved until AND-102 reaches its thresholds.

## 15. Implementation slices

- Homepage: `src/pages/Index.tsx`
- Start Here: `src/pages/StartHere.tsx`
- Tools: `src/pages/Tools.tsx`
- Worker hub: `src/pages/HealthcareWorkers.tsx`
- Free comparison: `src/pages/BenefitsCommandCenterPage.tsx`
- Navigation/footer: `src/data/serviceNavigation.ts`, `src/components/layout/Footer.tsx`
- Metadata/product: `src/lib/siteSeoMeta.ts`, `src/data/paidProducts.ts`
- Tests: `src/data/serviceNavigation.test.ts`, `src/test/publicProductArchitecture.test.ts`

## 16. Release gates

- [x] One visible flagship only.
- [x] Public tools remain free.
- [x] Checkout and paid access remain disabled.
- [x] Routes and sitemap remain unchanged.
- [x] No new sensitive analytics.
- [ ] Exact-head CI and browser certification pass.
- [ ] Vercel preview is READY.
- [ ] No unresolved review thread.
- [ ] Production smoke test passes after merge.

## 17. Executive closeout

Public positioning and hierarchy change; calculator logic, articles, routes, Supabase, authentication, entitlements, Stripe, and checkout do not. Rollback is a normal commit revert with no customer or payment migration.

## 18. Compounding closeout

After validation, update the decision, evidence, and work ledgers; link GitHub, Vercel, Notion, Drive, and AND-111; and use this release as the Phase 3 demand-validation baseline.
