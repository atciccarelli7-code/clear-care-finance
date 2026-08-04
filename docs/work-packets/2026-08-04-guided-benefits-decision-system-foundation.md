# Guided Benefits Decision System Foundation — Work Packet

Date: 2026-08-04  
Branch: `agent/guided-benefits-decision-intake`  
Base: `main` at `c5765a71897a29686a26033850beb5fbeca2a012`  
Release posture: In progress; application implementation requires exact-head validation before merge

## 1. Assignment

Implement the founder-confirmed product principle that a paying Healthcare Worker Benefits Decision System purchaser should need to bring the current documents and know the personal situation; Community Acquired Finance should guide the purchaser through the complex decision one understandable step at a time.

## 2. Platform objective

Strengthen the first healthcare-worker flagship into a trustworthy, guided decision system that coordinates source evidence, user context, scenarios, verification, and a final decision brief without turning free education into a paywall or pretending private document infrastructure is already available.

## 3. Immediate users

- healthcare workers preparing for open enrollment;
- healthcare workers comparing job offers or employer benefit packages;
- households comparing an employee plan with spouse or partner coverage;
- healthcare workers reviewing retirement, vesting, leave, disability, life, and other workplace benefits.

## 4. Success criteria

- The paid product is explained through one clear exchange: documents plus personal situation in; guided decision brief out.
- The public flagship shows a five-stage guided journey.
- The free Benefits Command Center is clearly positioned as manual preparation rather than the complete paid experience.
- The document and personal-situation requirements are reusable typed data rather than page-only copy.
- Private upload is explicitly unavailable until its security and retention gates are certified.
- Existing public routes, free tools, employer-source governance, premium fail-closed controls, checkout controls, and database posture remain unchanged.
- Unit, governance, build, browser, accessibility, mobile, and preview gates pass on the exact branch head.

## 5. Non-goals

This slice does not:

- activate file upload, private storage, document extraction, OCR, or AI document analysis;
- copy public employer documents into CAF;
- use public employer documents for automatic benefit fact prefill;
- change Supabase schema, RLS, authentication, or workspace persistence;
- change Stripe, price, checkout, entitlements, refunds, or production commerce flags;
- collect medical information, claims, EOBs, insurance member IDs, credentials, or financial account data;
- alter canonical routes, sitemap inventory, indexability, AdSense inventory, or advertising behavior;
- imitate another company’s branding, interface, copy, or proprietary workflow.

## 6. Starting evidence

### Direct current evidence

- Latest `main`: `c5765a71897a29686a26033850beb5fbeca2a012`.
- PR #258 classifies employer-source use as link-only by default and keeps automatic fact reuse behind rights and legal review.
- PR #257 attaches verified public employer source context to the free workspace without transferring unreviewed benefit facts.
- PR #255 created the employer-aware benefits platform foundation and deliberately excluded private upload pending separate design and validation.
- The public healthcare-worker flagship describes coordinated paid value but did not yet center the user promise around documents plus personal situation.
- The free Benefits Command Center already asks users to have compensation, benefits, SBC, retirement, and leave materials nearby, but the paid/free relationship was not expressed as one coherent guided journey.
- The protected premium foundation already supports eight modules, saved workspaces, progress, verification questions, and a printable decision brief, but the workspace creation step remains generic and comparison-first.

### Founder confirmation

The founder explicitly confirmed that the paying user should bring the relevant documents and know the personal situation, while CAF guides the complex process in a TurboTax-like manner without copying TurboTax.

### Inference

The highest-value safe first slice is to establish and test the product contract across the public flagship and free preparation surface before changing private document handling, authentication, storage, or consequential recommendation logic.

## 7. Inherited-decision challenge

### Preserved

- Free core plus one paid flagship remains strategically coherent.
- The $29 one-time amount remains a validation hypothesis, not an active checkout claim.
- Public employer sources remain link-only and cannot silently prefill guidance.
- Private upload remains excluded until separately designed and certified.
- Official employer, carrier, and plan documents remain controlling.

### Challenged

The inherited public explanation described the paid system mainly as a collection of coordinated capabilities. That was technically accurate but insufficiently user-centered. It did not state the simplest purchaser contract: bring current documents, answer questions about the personal situation, and let CAF guide the work.

The correction changes the interaction model and product promise without changing the current legal, data, or commerce posture.

## 8. Quantified impact

| Measure | Before | After this slice | Impact |
|---|---:|---:|---:|
| Canonical routes | 160 | 160 | 0 |
| Public routes with material copy/layout changes | 0 | 2 | 2/160 (1.25%) |
| New reusable guided-journey contracts | 0 | 1 | +1 |
| Explicit guided stages | implicit | 5 | +5 named stages |
| Explicit document categories | scattered copy | 6 typed categories | consolidated |
| Explicit personal-situation categories | scattered copy | 6 typed categories | consolidated |
| Private upload capability | 0 | 0 | unchanged, fail-closed |
| Database migrations | 0 | 0 | unchanged |
| Payment or entitlement changes | 0 | 0 | unchanged |
| New sensitive telemetry fields | 0 | 0 | unchanged |
| New unit contract suites | 0 | 1 | +1 |

## 9. Implementation

### Reusable product contract

Added `src/data/benefitsDecisionSystemJourney.ts` with:

- five ordered journey stages;
- six document categories;
- six personal-situation categories;
- current-release, upload-gate, controlling-document, and prohibited-data boundaries.

### Public flagship

Added `src/components/benefits/BenefitsDecisionSystemJourney.tsx` and integrated it into `/healthcare-workers#benefits-decision-system`.

The flagship now states:

> Bring the documents. Know your situation. CAF guides the rest.

It shows what the purchaser brings, what CAF provides, what the purchaser leaves with, the five-stage journey, preparation checklists, and the secure-upload gate.

### Free preparation surface

Updated `/tools/benefits-command-center` to distinguish:

- free manual preparation and comparison;
- paid guided completion;
- document readiness;
- personal-situation readiness;
- current private-upload boundary.

### Tests

Added `src/test/benefitsDecisionSystemJourney.test.ts` to enforce:

- exact ordered journey stages;
- required source categories;
- bounded personal-context categories;
- fail-closed upload language and required security controls;
- prohibited sensitive identifiers and unauthorized documents.

### Durable product record

Added `docs/strategy/2026-08-04-guided-benefits-decision-system-product-doctrine.md`.

## 10. Privacy, legal, and source boundary

This release does not establish a legal right to copy, store, train on, republish, or automatically reuse public or user-provided employer documents.

The public experience may describe future analysis of documents the purchaser is authorized to possess, but actual upload remains blocked until separate certification covers:

- authentication and entitlement;
- encryption;
- private object storage;
- malware scanning;
- authorization attestation;
- extraction isolation;
- page-level source citations;
- retention and deletion;
- subprocessors and vendor review;
- incident response;
- policy and terms updates;
- qualified legal/privacy review.

The current user-facing preparation flow rejects Social Security numbers, account/card numbers, member IDs, credentials, claims/EOBs, medical records/diagnoses, full pay statements, and unauthorized documents.

## 11. Role-status matrix

| Role | Status | Finding / action |
|---|---|---|
| Orchestrator | PASS | Scope is bounded to a meaningful product-foundation slice with explicit release gates. |
| Context steward | PASS | Current repository context, decisions, source governance, and recent employer work were reconciled. |
| Capability router | PASS | GitHub is the controlling implementation surface; no unnecessary database or payment connector changes are introduced. |
| Executive strategy | PASS | Strengthens the single paid flagship and makes the value proposition easier to understand. |
| Product management | PASS | Establishes a clear input-process-output contract and phased implementation path. |
| Healthcare user research | PASS | Reflects real worker constraints: limited benefits expertise, decision fatigue, plan variation, and the need for written verification. |
| Information architecture | PASS | Preserves route architecture and clarifies free preparation versus paid completion. |
| UX and design system | PASS | Uses progressive disclosure, checklists, explicit stages, and the current visual system. |
| Content and evidence integrity | PASS | Keeps documents controlling, separates public references from verified facts, and avoids unsupported claims. |
| Frontend engineering | WARN | Implementation is complete but exact-head type, lint, build, and browser validation remain required. |
| Systems architecture | PASS | Reusable typed journey contract avoids page-only duplication and creates a stable Phase B handoff. |
| Backend, data, and security | WARN | No backend change is made; actual upload remains blocked pending a separately certified private-document architecture. |
| Platform and DevOps | WARN | No infrastructure change; CI and Vercel preview remain pending. |
| SEO and discovery | PASS | No route, canonical, sitemap, or indexability change; copy better matches the flagship’s actual purpose. |
| Monetization and conversion | PASS | Clarifies why a coordinated system is paid while preserving useful free resources and inactive checkout. |
| Analytics and experimentation | WARN | No new event contract is introduced; future product funnel measurement remains necessary before paid launch. |
| Accessibility, performance, and reliability | WARN | Semantic structure is present; real-browser Axe, mobile overflow, and bundle validation remain required. |
| Privacy, legal, and user protection | WARN | Boundaries are materially improved, but secure upload and document-use rights remain separate legal/security gates. |
| Publishing and governance | PASS | Durable doctrine and work packet are included; ledger closeout remains part of completion. |
| Quality and release | WARN | Merge is blocked until exact-head CI, preview, diff review, and browser certification pass. |
| Adversarial red team | WARN | Primary risks are users mistaking preparation for active upload, assuming public sources apply to their employee group, or providing prohibited information; copy and tests mitigate but do not eliminate these risks. |
| Process improvement | PASS | Converts a founder concept into a reusable typed contract, test suite, strategy doctrine, and phased release gate. |

## 12. Executive accountability matrix

| Perspective | Disposition | Finding |
|---|---|---|
| Strategy | PASS | The flagship’s value proposition becomes a coherent guided service rather than a capability list. |
| Operations | PASS | A fixed document and situation checklist creates a repeatable support and future intake model. |
| Finance | PASS | No cost or revenue lift is claimed; the $29 amount remains a validation hypothesis. |
| Revenue | PASS | Paid value is clearer without a surprise paywall or monetization before utility. |
| Product | PASS | Input, guided process, verification, and output are now explicit. |
| Technology | WARN | Phase A is implemented; protected preflight and private-document infrastructure remain future phases. |
| Data and analytics | WARN | No sensitive data collection expands; completion evidence still requires a future bounded contract. |
| Discovery | PASS | Existing routes remain stable and clearer product language improves information scent. |
| Editorial integrity | PASS | Official documents remain controlling; no benefit fact or legal conclusion is added. |
| Healthcare-user context | PASS | Workflow is designed for exhausted nonexpert workers making consequential enrollment or career decisions. |
| Privacy/legal protection | WARN | Actual upload, retention, deletion, and source-use rights remain unapproved and unavailable. |
| Accessibility/reliability | WARN | Exact browser evidence is pending. |
| Quality/release | WARN | CI, preview, and exact-head review are pending. |
| Red team | WARN | Confusion between future and active capabilities is the main residual risk. |
| Process improvement | PASS | Product doctrine is now versioned, typed, testable, and reusable. |

## 13. Validation plan

Before merge:

1. run `npm test`;
2. run TypeScript and lint;
3. run `npm run build`, including AI governance, employer-benefits, premium, publication, AdSense, bundle, prerender, and search checks;
4. inspect the exact diff for accidental route, payment, data, or source-governance changes;
5. run browser certification on desktop and 320px mobile;
6. run Axe and horizontal-overflow checks;
7. verify the healthcare-worker flagship and Benefits Command Center in the Vercel preview;
8. confirm no private-upload control, file input, endpoint, storage bucket, migration, or new telemetry is present;
9. inspect CI and Vercel comments/review threads;
10. update decision and work ledgers with final validation and release state.

## 14. Technical validation disposition

Current: **WARN — implementation complete; exact-head automated and browser validation pending.**

## 15. Business validation disposition

Current: **PASS for product-direction coherence; WARN for unproven demand, completion, support burden, and willingness to pay.**

The change improves the paid product explanation but does not prove that users will buy, complete, understand, or recommend the product.

## 16. Rollback

Revert the branch commits. No database, storage, authentication, payment, entitlement, analytics, environment, route, redirect, or data cleanup is required.

## 17. Highest-value next implementation

After this release passes, replace the protected premium workspace’s generic creation screen with a bounded guided preflight that records:

- decision type;
- document readiness categories;
- personal-situation categories;
- decision deadline;
- privacy and authorization acknowledgments.

Do not activate document upload in that slice. Persist categorical readiness only, then branch the existing eight-module workflow accordingly.

## 18. Completion evidence

Pending:

- pull request;
- exact-head commit;
- CI runs;
- Vercel preview;
- browser artifacts;
- final role dispositions;
- merge and production state.
