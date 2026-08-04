# Prelaunch secure document foundation

**Date:** August 4, 2026  
**Branch:** `agent/prelaunch-secure-document-foundation`  
**Base:** `d124646514d7e108923fbe8ceb64d6a95f4d41bd`

## Assignment

Build the maximum safe technical foundation for future benefits-document assistance without activating real visitor uploads, production document extraction, payment, official enrollment submission, or individualized eligibility determinations.

## User outcome being prepared

A future authenticated user can select a general benefits-document category, confirm that the file is synthetic/public/redacted and contains no personal information, stage it through a private quarantine service, receive bounded extracted benefit-fact candidates, verify those candidates, and delete the source.

## Implemented scope

- document intake, record, status, attestation, finding, and extraction schemas;
- deterministic sensitive-data detector;
- deterministic synthetic-text extraction adapter;
- authenticated and entitlement-scoped upload authorization API;
- short-lived one-file signed upload tokens;
- private Supabase quarantine bucket with MIME and size restrictions;
- workspace/user/product-bound metadata table;
- finalization, list, extract, reject, expiry, and delete server operations;
- protected staging page inside the `/app` namespace;
- client SHA-256 verification and signed upload flow;
- explicit disabled/synthetic/redacted environment modes;
- production and preview release gates;
- schema, trust, route, and behavior tests;
- durable product doctrine.

## Explicit non-goals

- no public upload CTA;
- no production document processing;
- no original filename persistence;
- no raw extracted text persistence;
- no PDF parsing or OCR provider;
- no real user or visitor fixture;
- no medical records, claims, EOBs, diagnoses, official elections, confirmation pages, pay statements, credentials, IDs, or financial-account data;
- no automatic employer-portal submission;
- no official eligibility or coverage determination;
- no Stripe live-mode activation;
- no checkout activation;
- no production entitlement activation;
- no claim that user attestation transfers all responsibility to the user.

## Data-flow contract

1. Client validates type, size, filename, and required confirmations.
2. Supported text fixtures receive a browser-side sensitive-data scan.
3. Server authenticates the user and checks active/test entitlement and workspace ownership.
4. Server creates an opaque path and metadata record without storing the original filename.
5. Server returns a short-lived, one-path signed upload token.
6. Client uploads directly to the private bucket and computes SHA-256 locally.
7. Server verifies expected size, MIME type, object presence, and state.
8. Text extraction downloads the source server-side, scans it again, retains only bounded structured candidates, and deletes the source.
9. A sensitive finding deletes the source and retains only finding categories.
10. PDFs remain quarantined or extraction-unavailable until a separately approved provider exists.
11. Delete removes both source and metadata. Expired sources are cleaned up when the authenticated document service runs.

## Database changes

- `20260804193729_prelaunch_secure_benefit_document_quarantine.sql`
- `20260804193854_benefit_document_quarantine_foreign_key_indexes.sql`

The applied schema contains:

- private bucket `benefits-document-staging`;
- maximum file size 10 MB;
- allowed MIME types `application/pdf` and `text/plain`;
- table `public.benefit_document_uploads`;
- forced RLS;
- no direct policies;
- no anon/authenticated grants;
- owner-bound composite workspace foreign key;
- supporting expiration, status, product, and workspace indexes.

## Release configuration

Production defaults:

```text
VITE_PREMIUM_DOCUMENT_INTAKE_ENABLED=false
PREMIUM_DOCUMENT_INTAKE_ENABLED=false
PREMIUM_DOCUMENT_EXTRACTION_ENABLED=false
PREMIUM_DOCUMENT_INTAKE_MODE=disabled
PREMIUM_REAL_DOCUMENT_PROCESSING_AUTHORIZED=false
```

A protected synthetic preview must also have configured authentication, workspace persistence, entitlement enforcement, Supabase server credentials, an authenticated test user, and a test entitlement.

## Validation plan

- API TypeScript check;
- lint;
- unit and trust tests;
- premium release safety check;
- premium schema check;
- production build and prerender;
- protected-route browser denial with flags off;
- protected synthetic preview with test user and test entitlement before any fixture upload;
- filename, text identifier, official-election, pay-statement, credential, and card-number rejection;
- upload size/MIME mismatch rejection;
- cross-user workspace and document denial;
- delete and expiry behavior;
- no source text or original filename in database, logs, analytics, or API responses;
- exact-head Vercel preview;
- Supabase security and performance advisors;
- no unresolved review threads.

## Release disposition

The code and schema may merge while all production document flags remain disabled. Merging does not authorize a protected synthetic preview, real documents, payments, or public release.

A later activation task must explicitly identify the environment, test account, test entitlement, fixture set, protection status, retention/deletion verification, and rollback procedure.
