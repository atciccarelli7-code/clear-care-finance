# End-to-End Open Enrollment Pilot — Work Packet

Date: 2026-08-04  
Branch: `agent/end-to-end-open-enrollment-pilot`  
Base: `main` at `d042cae1a3ecbc67e1dc029fe9b8f2319269f60b`  
Pull request: #260  
Risk class: Moderate; consequential benefits estimates, but no payment, upload, authentication, database, or production entitlement change

## 1. Assignment charter

- **Plain-language request:** Continue building the Healthcare Worker Benefits Decision System into an end-to-end guided experience analogous in product principle to guided tax software, then prepare it for eventual revenue and demand testing.
- **Actual user outcome:** A healthcare worker can move from an enrollment trigger and scattered plan materials to a reviewable election plan, explicit verification list, payroll-planning estimate, and official submission checklist.
- **Affected audience:** Healthcare workers preparing for annual enrollment, new-hire enrollment, or a qualifying life event.
- **Business outcome:** Demonstrate the proposed $29 product value before requiring Vercel Pro, paid checkout, document infrastructure, or account-based persistence.
- **Success metrics:** Valid pilot start; step completion; final review completion; price-qualified commitment after experiencing the product; zero sensitive analytics fields; zero unsupported plan recommendations.
- **Constraints:** Official plan documents control; no uploads or sensitive identifiers; no payment activation; no employer-portal submission; free resources remain free; no imitation of another company’s branding or proprietary workflow.
- **Non-goals:** Secure document processing, account-based cloud persistence, Stripe activation, Vercel Pro conversion, official eligibility determination, legal plan interpretation, individualized insurance advice, or enrollment submission.

## 2. Current-state evidence

| Area | Direct evidence | Verified | Limitation |
|---|---|---|---|
| GitHub/main | PR #259 merged at `d042cae`; guided product doctrine and public foundation are on `main` | 2026-08-04 | Does not by itself prove user demand |
| Existing product route | `/products/healthcare-worker-benefits-decision-system` is a controlled noindex $29 demand-validation route | 2026-08-04 | Current production initially described a proposed workflow rather than providing it |
| Existing calculations | Deterministic health-plan scenarios and retirement-value functions exist and are tested | 2026-08-04 | User-entered estimates cannot establish official coverage or future claims |
| Premium infrastructure | Supabase, authentication, workspace, Stripe, and entitlement foundations exist but remain fail closed | 2026-08-04 | Not activated or certified for a paid launch |
| Demand evidence | Existing price-qualified commitment funnel remains the active demand test | 2026-08-04 | Volume is expected to be sparse; completion evidence is new |
| Production/runtime | Vercel production exists; PR preview and exact-head checks are required | 2026-08-04 | Production release not established until merge and smoke validation |

## 3. Inherited-decision challenge

| Inherited item | Current disposition | Challenge | Decision |
|---|---|---|---|
| $29 one-time validation price | Experiment | Price interest without a usable product can understate or misstate demand | Preserve price, let users experience the pilot before committing |
| Account-based paid workspace | Provisional target | Building backend persistence before proving product completion increases cost and risk | Defer cloud persistence; use browser-local state for the pilot |
| Existing two-job comparison app | Valid separate product capability | Renaming job modules would preserve hidden two-option assumptions | Build a dedicated open-enrollment contract and reuse only pure calculations |
| No private uploads before certification | Confirmed precaution | Manual entry adds friction but avoids uncontrolled document risk | Preserve; missing sources become verification tasks |
| Noindex offer route | Confirmed experiment state | Search traffic could create demand, but an unfinished commercial pilot should not compete as canonical education | Preserve noindex until product and publication strategy change explicitly |

## 4. Capability plan

| Need | System | Treatment |
|---|---|---|
| Repository and release | GitHub | Branch, PR, exact-head CI, browser certification, review, merge |
| Preview/runtime | Vercel via GitHub deployment | Preview readiness and rendered journey validation |
| Data and payments | Supabase/Stripe | Read-only context; no writes or activation in this phase |
| Project tracking | Linear and Notion | Record implementation, release state, and next gated phase |
| Product logic | Existing TypeScript calculation modules | Reuse deterministic functions behind a new domain contract |
| User state | Browser local storage | Versioned, user-controlled, resettable, no cloud transmission |
| Analytics | Existing consent-gated sanitizer | Fixed event names and fixed dimensions only; no answer values |

## 5. Independent role matrix

| Role | Status | Material finding and required disposition |
|---|---|---|
| Orchestrator | PASS | A bounded product-completion pilot is the maximum safe scope before commerce activation. |
| Context steward | PASS | Founder direction and PR #259 doctrine are durable; current implementation must be recorded separately from future upload and paid-launch intent. |
| Capability router | PASS | GitHub, Vercel preview, existing calculations, Linear, and Notion are authoritative; no new vendor is required. |
| Executive strategy | PASS | One exceptional healthcare-worker flagship strengthens the platform thesis and creates a reusable decision-system pattern. |
| Product management | PASS | Minimum complete journey is event → household → documents → medical → accounts → protection → retirement → election plan. |
| Healthcare user research | PASS | The workflow supports fatigued mobile users, accepts unknowns, and avoids requiring benefits expertise before beginning. |
| Information architecture | PASS | Use the existing canonical product-validation route; do not create another hub or competing route. |
| UX and design system | PASS | One stage at a time, visible progress, plain-language labels, local saving, and review-first completion. |
| Content and evidence integrity | WARN | Estimates remain user-supplied planning inputs; every consequential interpretation must retain official-verification language. Mitigated in UI and contract. |
| Frontend engineering | PASS | Dedicated typed domain contract avoids corrupting the separate job-comparison workflow; no dependency added. |
| Systems architecture | PASS | Pilot logic is reusable by the eventual authenticated workspace; public education remains independent of premium infrastructure. |
| Backend, data, and security | PASS | No server persistence or schema change; local storage is justified for reversible validation and excludes required sensitive fields. |
| Platform and DevOps | PASS | No Vercel Pro or environment dependency is needed; standard preview, CI, and rollback remain sufficient. |
| SEO and discovery | PASS | Existing noindex experiment state is preserved; no route, canonical, sitemap, or search-inventory change. |
| Monetization and conversion | PASS | Product value is demonstrated before the price-qualified commitment request; payment remains off. |
| Analytics and experimentation | WARN | Completion events are useful but low volume and consent gating limit inference. Use fixed events; do not claim validated demand prematurely. |
| Accessibility, performance, reliability | WARN | Long forms and print output require mobile, keyboard, zoom, overflow, and browser validation before release. |
| Privacy, legal, user protection | WARN | Benefits guidance is consequential. Preserve official-document control, no eligibility determination, no plan submission, and no sensitive data collection. |
| Publishing and governance | PASS | The route remains noindex, nocharge, and explicitly a pilot; public availability does not imply paid launch approval. |
| Quality and release | BLOCK until validation | Exact-head tests, browser certification, Vercel preview, diff review, and production smoke are mandatory. |
| Adversarial red team | WARN | A polished pilot could be mistaken for launch readiness. Product completion and commerce certification must remain separate gates. |
| Process improvement | PASS | The new open-enrollment contract and tests become reusable primitives for future account-based and document-assisted versions. |

## 6. Executive accountability

| Perspective | Status | Finding |
|---|---|---|
| Strategy | PASS | Product completion before infrastructure spending is the correct sequence. |
| Operations | PASS | Browser-local pilot creates no new support or data-deletion operation. |
| Finance | PASS | No Vercel Pro, payment fee, database, or new-vendor cost is introduced. |
| Revenue | PASS | Users can experience value before the existing $29 commitment step. |
| Product | PASS | The journey now produces a complete election plan rather than a collection of calculators. |
| Technology | PASS | Dedicated typed contract and pure calculations preserve architectural separation. |
| Data and analytics | WARN | Early evidence is directional; completion and commitment require adequate denominators. |
| Discovery | PASS | Noindex and route stability avoid premature search or cannibalization effects. |
| Editorial integrity | PASS | Official sources control; unknowns remain unresolved rather than silently estimated. |
| Healthcare user context | PASS | Mobile, fatigue, variable household coverage, prescriptions, networks, and payroll impact are represented. |
| Privacy/legal | WARN | Product cannot be marketed as official enrollment, legal interpretation, or guaranteed recommendation. |
| Accessibility/reliability | BLOCK until validation | Exact rendered mobile, keyboard, print, and accessibility evidence required. |
| Quality/release | BLOCK until validation | Latest-head CI and preview required. |
| Red team | WARN | Do not activate payment merely because the pilot passes technically. |
| Process improvement | PASS | Reusable contract, component, and tests reduce future migration cost. |

## 7. Anti-blindness findings

- **Prompt emphasis:** Build toward an end-to-end paid offering and eventual revenue.
- **Omitted dependency:** A checkout is not useful until the user can complete the underlying decision.
- **Strongest counterargument:** Manual entry may be too burdensome to support a $29 purchase without secure document extraction.
- **Weakest assumption:** Users will complete eight stages before an employer deadline.
- **Largest opportunity:** Use pilot completion evidence to define exactly which fields secure document extraction should prefill later.
- **Metric that could improve while the product worsens:** Commitment clicks could rise through stronger sales copy while useful completion falls.
- **Evidence that would change the decision:** High start abandonment, low review completion, repeated confusion, or users indicating that document import is a prerequisite.

## 8. Quantified impact

| Measure | Before | After | Change |
|---|---:|---:|---:|
| Canonical public routes | 160 | 160 | 0 |
| Materially changed routes | 0/160 | 1/160 | 0.625% |
| Working end-to-end open-enrollment pilots | 0 | 1 | +1 |
| Guided stages on the pilot | 0 | 8 | +8 |
| New dependencies | 0 | 0 | 0 |
| Database migrations | 0 | 0 | 0 |
| Payment activation | 0 | 0 | 0 |
| Upload capability | 0 | 0 | 0 |
| Fixed pilot analytics events | 0 | 3 | +3 |

- **User impact:** The visitor can now finish a bounded open-enrollment planning workflow and print the result.
- **Monetization impact:** Price qualification follows experienced value; no revenue can be collected yet.
- **Maintenance impact:** One domain contract, one UI component, and one test suite; no external service ownership added.
- **Rollback:** Revert PR #260; existing early-access offer and free tools remain intact.

## 9. Integrated decision

Build the working pilot on the existing noindex product route using versioned browser-local state and existing pure calculation functions. Keep payment, account persistence, private uploads, and employer-plan extraction off. Measure consented pilot start, stage completion, final completion, and existing price-qualified commitment. Treat technical release and business validation as separate decisions.

## 10. Implementation slices

| Slice | Files | Acceptance criteria |
|---|---|---|
| Domain contract | `src/premium/openEnrollmentPilot.ts` | Typed state, branching, progress, bounded recommendation, verification list, election-plan output |
| Guided UI | `src/components/premium/OpenEnrollmentPilot.tsx` | Eight stages, local save/reset, mobile controls, print, no sensitive collection |
| Offer integration | `src/pages/premium/BenefitsDecisionOfferPage.tsx` | Working pilot before commitment; $29 and free/paid boundaries preserved |
| Regression coverage | `src/test/openEnrollmentPilot.test.ts` | Incomplete state, missing sources, verification-first logic, payroll estimate, completion gate |
| Governance | This work packet, project records, Linear, Notion | Current implementation and future launch gates remain distinct |

## 11. Release gates

- [ ] Type, lint, unit, trust, publication, premium, and governance checks pass.
- [ ] Production build, bundle budget, prerender, and route checks pass.
- [ ] Browser journey passes on desktop and narrow mobile.
- [ ] Keyboard, focus, zoom, overflow, and print behavior pass.
- [ ] Local save, reload, reset, unknown, and verification states pass.
- [ ] Consent-gated events contain no answers or sensitive values.
- [ ] Vercel preview is ready on the exact PR head.
- [ ] Diff confirms no route, sitemap, AdSense, upload, payment, auth, or database expansion.
- [ ] No unresolved review threads.
- [ ] Production smoke passes after merge.

## 12. Separate validation disposition

### Technical

Status: **BLOCK pending exact-head validation**. The architecture is intentionally low-risk, but benefits calculations, mobile interaction, print output, and static product contracts require direct evidence.

### Business

Status: **WARN / experiment**. The pilot is strategically and economically coherent, but demand is not validated until adequate users start, complete, and make price-qualified commitments. Passing CI is not proof that the product is worth $29.

## 13. Compounding closeout target

- Reusable open-enrollment decision contract created.
- Missing-information handling formalized as a first-class product primitive.
- Future secure document extraction can target the exact high-friction fields demonstrated by pilot use.
- Future paid workspace can persist the same versioned state rather than inventing a second model.
- Reassessment trigger: adequate pilot denominator, major usability defect, benefits-rule defect, privacy issue, or secure-upload architecture approval.
