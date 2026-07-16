# Preventive Healthcare Cost Preparation System

**Architecture date:** July 16, 2026  
**Baseline commit:** `cea82eaba6f5ed30bc1aa89711d353989a08006f`  
**Implementation branch:** `agent/preventive-healthcare-cost-system`  
**Release posture:** Draft review and exact-head preview only. No merge and no production deployment.

## Executive outcome

The system adds one canonical pre-care action layer at `/tools/medical-appointment-cost-preparation`. It helps a patient or caregiver prepare provider and health-plan questions before planned care, then hands the person into the existing Medical Bill Review Toolkit after an EOB, Medicare notice, Medicaid notice, or bill arrives. It does not estimate a personalized price, determine coverage, rank plans, or collect medical or financial identifiers.

The same sprint also replaces misleading unlike-unit Medicare bars with reusable source-backed explainers, gives the Medicare Plan Verification Checklist a defensible completion state, and adds bounded browser and route-performance governance.

## Product architecture

1. A homepage Concierge or contextual pathway opens the canonical tool.
2. Three fixed-choice stages collect only broad preparation categories in React component state.
3. A deterministic rules module builds a Cost Preparation Plan in the browser.
4. The result organizes questions, fixed call scripts, documents, payment/assistance questions, post-EOB checks, and safety limits.
5. Copy and print are user-initiated. My Plan may save only `cost_prepare_care`, an existing-registry-style fixed action.
6. Internal and official handoffs use fixed IDs. No answers or generated text cross into another route or analytics event.

No account, database, file upload, OCR, unrestricted note, public result URL, or server-side plan storage was added.

## Question taxonomy

| Stage | Fixed categories | Why it is needed | Explicitly excluded |
|---|---|---|---|
| Care situation | Timing, setting, broad coverage category | Selects relevant safety, facility-fee, network, and program questions | Diagnosis, procedure, clinician, facility, insurer, plan, date, ZIP, identifier |
| Preparation | Network, authorization/referral, written estimate, facility fee, separate bills | Identifies unresolved pre-service verification work | Price, member ID, authorization number, code, medication, free text |
| Next call | Provider/facility, health plan, both, not sure | Orders the first fixed script without claiming who is legally responsible | Contact name, phone, claim/account number, call notes |

“Needs verification,” “confirmed,” and “not applicable” are preparation states only. They are not transmitted to analytics or saved in My Plan.

## Output taxonomy

Every Cost Preparation Plan contains:

- questions for the provider or facility;
- questions for the insurer or health plan;
- possible separate bills to verify;
- documents and confirmation details to retain;
- estimate, deposit, payment-plan, discount, and financial-assistance questions;
- checks after an EOB or bill arrives;
- fixed provider, plan, self-pay, and billing-office call scripts;
- urgent-care, estimate, network, authorization, separate-bill, and educational-use limits.

Conditional content is restricted to the fixed answer taxonomy. No model-generated text or individualized conclusion is used.

## Privacy threat model

| Threat | Control |
|---|---|
| Sensitive details placed in a form | No text areas or free-text fields; prominent prohibited-data instruction |
| Answers exposed in a URL or metadata | No query-string, hash, share-link, or result-metadata serialization |
| Answers persisted beyond the tab | Tool answers and result stay in component memory; reset returns to defaults |
| Sensitive analytics payload | `preventiveCostAnalytics.ts` accepts only enumerated tool, stage, action, and handoff IDs; rejection tests include plan, provider, member, value, URL, and result fields |
| Sensitive My Plan record | Only fixed action `cost_prepare_care` can be added; answer and result objects are never stored |
| Sensitive browser evidence | Certification uses broad fictional selections only; failure artifacts contain no real identity, health, plan, or financial information |
| Unsafe care delay | Urgent/emergency warning remains visible before the workflow and is repeated in an urgent result |

Prohibited data includes names, diagnoses, medications, procedures, provider/facility/insurer/plan names, member IDs, claim numbers, account numbers, medical-record numbers, dates of birth, addresses, exact dates, dollar amounts, unrestricted notes, and uploaded documents.

## Visual Explainer standard

Reusable primitives live in `src/components/visual-explainers/HealthcareVisualExplainers.tsx` and content/data in `src/data/medicareVisualExplainers.ts`.

- `ComparisonPanel` compares programs using the same semantic fields.
- `CostReferenceTable` keeps monthly, annual, benefit-period, daily, and threshold figures in their correct units.
- `CoverageGapGrid` distinguishes absent, separate, and generally-not-covered coverage.
- `WarningCallout` gives high-risk distinctions clear prominence.
- `VisualSourceNote` requires source scope and review date next to the explainer.
- `VisualStat` is available for a single value with context; it must not imply comparison through arbitrary bar length.

Visuals must remain text-equivalent, responsive, keyboard-neutral, source-visible, and lazy with the owning route. They must not rank carriers, make plan recommendations, or compress unlike units into a decorative scale.

## Medicare Plan Verification completion definition

The status model is:

- `not_started`: no item is confirmed or deliberately not applicable;
- `in_progress`: at least one item is resolved but a critical group remains unresolved;
- `completed`: every critical group is deliberately resolved as confirmed or not applicable.

Critical groups are provider access; prescriptions and pharmacy; plan rules; cost exposure and maximum-out-of-pocket structure; annual changes; and enrollment timing. Travel, Medigap, supplemental benefits, and independent counseling remain valuable optional checks.

Completion means the preparation artifact is ready for a comparison or enrollment conversation. It does not mean a plan is recommended, suitable, approved, or guaranteed to cover a service.

## Search and internal-pathway decisions

- The new tool is registered in the existing roadmap tool directory and runtime SEO manifest.
- Sitemap and canonical generation use the existing authoritative registries; the build increased the sitemap from 143 to 144 canonical URLs.
- The Medical Bills category receives the new tool without replacing one of the six existing high-level tool cards.
- Contextual entry points were added through the shared compounding-pathway registry for Patients & Families, the Medical Bill Review Toolkit, Prior Authorization, facility-fee content, and multiple-bill content.
- The existing Decision Concierge mapping for “before medical care” now resolves to the canonical tool.
- No broad article sprint, duplicate content framework, keyword page, or Search Console claim was added. The supplied search baseline remains low-sample and externally unrefreshed because no authenticated Search Console connector was available.

## Route, advertising, and bundle impact

| Surface | Impact |
|---|---|
| Route | New canonical route `/tools/medical-appointment-cost-preparation` through the existing tool router |
| Sitemap | One new canonical URL; 144 total in the verified build |
| Canonical/metadata | Generated through the existing roadmap-tool and runtime SEO systems |
| Advertising | Tool remains ad-free under existing conservative content governance; no AdSense eligibility was expanded |
| Global bundle | Medicare visual modules remain route-lazy; the new tool is a lazy route chunk |
| Existing URLs | No canonical slug, redirect, or legacy tool URL was removed |

## Protected scopes left untouched

The implementation did not absorb the Hospital & Patient Guide content/data owned by PR #180, the discount hub owned by PR #174, or the growth/revenue operating-system document owned by PR #175. Shared pathway and governance registries were used where a connection was required.

Two generated discovery files, `public/sitemap.xml` and `src/data/runtimeSeoManifest.ts`, necessarily overlap PR #180 because both branches add canonical routes. This branch did not copy or edit PR #180 content. When either branch rebases after the other, resolve the generated-file overlap by rerunning `npm run seo:generate` from the combined registries; do not choose one branch's generated output and discard the other route set.

## External and professional-review status

The following remain `UNVERIFIED` and must not be represented as live success:

- Resend sending-domain verification, production audience persistence, non-owner delivery, and unsubscribe operations;
- GA4 receipt/report visibility for the new fixed events;
- exact AdSense account/approval state;
- Google-certified CMP coverage before personalized advertising in the EEA, United Kingdom, or Switzerland;
- production runtime behavior, because this branch is preview-only;
- legal review of state-specific surprise-billing, estimate, financial-assistance, and dispute wording;
- clinical review of any future care-triage content beyond the current “do not delay urgent care” boundary.

Owner actions are recorded in `docs/resend-email-setup.md`, `docs/caf-analytics-event-dictionary.md`, and the draft pull request. No external provider, advertising, affiliate, sponsor, authentication, or lead-generation system was activated in this sprint.
