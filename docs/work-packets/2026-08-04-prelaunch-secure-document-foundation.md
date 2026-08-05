# Privacy-minimized premium workspace foundation

**Date:** August 4, 2026  
**Branch:** `agent/prelaunch-secure-document-foundation`  
**Base:** `d124646514d7e108923fbe8ceb64d6a95f4d41bd`

## Assignment

Move the Healthcare Worker Benefits Decision System toward a credible paid product while avoiding real-document custody, live payment, automatic enrollment, and official eligibility or coverage determinations.

## User outcome prepared

A future entitled user can:

- sign in to an owner-scoped account workspace;
- complete a guided benefits decision;
- save and resume confirmed structured values and broad preferences;
- review general plan text locally in the browser;
- confirm bounded value candidates before saving;
- preserve assumptions and unresolved verification questions;
- print a Benefits Decision Brief and employer-portal checklist.

The product does not retain the user’s benefits file or raw source text.

## Implemented commercial-v1 scope

- public working end-to-end open-enrollment pilot;
- clearer free-versus-paid product boundary;
- proposed $29 one-time premium positioning;
- existing Supabase authentication, product, entitlement, workspace, and Stripe-event foundation;
- owner- and entitlement-protected workspace RLS;
- browser-local benefits source assistant;
- deterministic local sensitive-data detector;
- deterministic local extraction of bounded candidate values;
- user review, editing, selection, and confirmation before persistence;
- structured-value mapping into existing health-plan and retirement workspace fields;
- cadence and pay-period annualization controls;
- vesting verification-task creation;
- no raw text, filename, excerpt, or file-byte persistence;
- no deployable document-processing HTTP endpoint;
- exact Vercel Hobby deployment within the 12-function limit;
- production and preview release gates;
- unit, trust, route, bundle, browser, mobile, accessibility, and print certification.

## Paid product boundary

The always-free layer includes definitions, official links, educational guides, focused calculators, checklists, and the public benefits comparison.

The proposed $29 product charges for:

- account-based continuity;
- protected workspace persistence;
- coordinated completion of the full enrollment decision;
- saved assumptions and verification tasks;
- a retained Benefits Decision Brief;
- an employer-portal submission checklist.

Checkout and public paid access remain off during this release.

## Browser-local data flow

1. The user consults the official plan material on their own device.
2. The user pastes only relevant general text or selects a local `.txt` excerpt.
3. The browser screens the filename and source text for likely prohibited information.
4. The browser extracts only supported candidate facts.
5. The raw source text is cleared after analysis.
6. The user reviews, edits, selects, and confirms every candidate.
7. Only confirmed structured values, cadence, source category, assumptions, and verification notes enter workspace state.
8. The user verifies material values against controlling documents or the benefits administrator before submitting elections.

## Supported candidates

- employee premium;
- deductible;
- out-of-pocket maximum;
- employer HSA or HRA contribution;
- retirement match percentage;
- retirement vesting years.

The assistant does not determine eligibility, coverage, network status, formulary status, claim liability, legal plan meaning, or official election results.

## Explicit non-goals

- no server upload or real visitor document storage;
- no completed election or confirmation-page collection;
- no raw source text or excerpts in the database;
- no claims, EOBs, diagnoses, medical records, medication histories, credentials, IDs, pay statements, or financial-account data;
- no employer-portal credential collection;
- no automatic employer-portal submission;
- no official eligibility or coverage determination;
- no Stripe live-mode activation;
- no checkout activation;
- no production entitlement activation;
- no claim that a warning or attestation transfers all responsibility to the user.

## Dormant quarantine research

Earlier work created:

- `api/_lib/documentIntake.ts` internal service code;
- document intake contracts and a dormant client;
- `20260804193729_prelaunch_secure_benefit_document_quarantine.sql`;
- `20260804193854_benefit_document_quarantine_foreign_key_indexes.sql`.

The Supabase schema contains a private PDF/TXT bucket and deny-all forced-RLS metadata table. At certification it contains zero rows and zero objects.

Commercial v1 contains no deployable document-intake, extraction, finalize, list, or deletion endpoint. The customer-facing source assistant does not import or call the dormant upload client.

## Vercel cost and deployment decision

The first document design temporarily exceeded the Vercel Hobby limit with 15 serverless functions. Three unused document-processing endpoints were removed because commercial v1 does not require server uploads.

The exact protected preview then deployed successfully with 12 Node.js functions. No Vercel Pro upgrade was required to release this foundation.

## Production configuration

Production remains fail closed:

```text
VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED=false
PREMIUM_DOCUMENT_INTAKE_ENABLED=false
PREMIUM_DOCUMENT_EXTRACTION_ENABLED=false
PREMIUM_DOCUMENT_INTAKE_MODE=disabled
PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED=false
PREMIUM_CHECKOUT_ENABLED=false
PREMIUM_PRODUCTION_CHECKOUT_AUTHORIZED=false
```

## Validation plan

- API TypeScript check;
- lint;
- full unit and trust suite;
- browser-local extraction, no-retention, cadence, and mapping tests;
- premium release and schema checks;
- production build, bundle budget, and prerender;
- working public pilot on desktop and mobile;
- price-qualified no-charge commitment flow;
- protected application fail-closed behavior;
- mobile, accessibility, print, and existing-site regressions;
- exact-head protected Vercel preview with 12 functions;
- Supabase zero-row/zero-object confirmation;
- Supabase security and performance advisors;
- no unresolved review threads.

## Next controlled activation

Linear AND-118 owns the next phase:

- designated synthetic test account;
- Supabase magic-link sign-in;
- workspace create, save, resume, print, and delete;
- Stripe-hosted Checkout in test mode;
- signed webhook entitlement grant;
- duplicate-event idempotency;
- refund and revocation;
- denied access after revocation;
- deletion proof and rollback procedure.

That phase must not use live charges or real documents.

## Release disposition

This foundation may merge only after every exact-head gate passes. Merge keeps live commerce, public paid access, and real-document processing disabled.
