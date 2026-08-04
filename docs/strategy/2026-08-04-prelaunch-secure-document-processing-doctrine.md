# Prelaunch secure document-processing doctrine

**Status:** Founder-directed implementation doctrine  
**Date:** August 4, 2026  
**Product:** Healthcare Worker Benefits Decision System

## Decision

CAF may build and test a benefits-document intake and extraction capability before payments or a public paid launch. The capability must remain technically dormant in production and may process only synthetic, already-public, or deliberately redacted fixtures in a protected preview until separate privacy, security, legal, support, and release authorization is complete.

A user instruction or attestation is a prevention control. It is not a substitute for data minimization, access control, rejection, deletion, incident response, or legal review, and it does not make the user solely responsible for information accepted by a system CAF operates.

## Intended input

The future system is designed for general benefits materials that describe available choices, including:

- benefits guides and enrollment booklets;
- summaries of benefits and coverage;
- medical plan summaries;
- retirement match and vesting summaries;
- leave, disability, life, and protection-benefit summaries;
- pharmacy formularies and provider-network references;
- a spouse or household member's general employer plan summary when the user is authorized to use it.

## Prohibited input

CAF must not ask for or intentionally accept:

- completed or current benefit elections;
- enrollment confirmation pages or confirmation numbers;
- beneficiary designations;
- names, personal email addresses, phone numbers, street addresses, or dates of birth;
- Social Security numbers;
- employee, member, subscriber, policy, group, claim, EOB, or medical-record identifiers;
- diagnoses, claims, EOBs, medical records, or individualized prescription histories;
- pay statements or individualized compensation records;
- employer, insurer, or benefits-portal credentials;
- bank, routing, account, or payment-card information;
- confidential documents the user is not authorized to share.

## Trust model

The system uses layered controls rather than relying on copy alone:

1. **Restricted categories.** Only enumerated general benefits-document categories are accepted.
2. **Mandatory affirmative attestations.** Every upload requires confirmation that it is not an individualized record and contains no personal information.
3. **Browser screening.** Filenames and supported text fixtures are scanned before upload.
4. **Server authorization.** Uploads require authentication, an owned workspace, and an active or test entitlement.
5. **Private quarantine.** The storage bucket is private, has no direct user policies, and accepts only PDF/TXT files up to 10 MB.
6. **Opaque paths.** CAF does not persist the original filename.
7. **Short-lived authorization.** The server creates a one-path signed upload token rather than granting bucket access.
8. **Server verification.** File type, size, storage presence, and hash metadata are checked after upload.
9. **Sensitive-content rejection.** Supported text is scanned again on the server. A finding deletes the source and retains only finding categories.
10. **Bounded extraction.** Extraction may retain only enumerated structured benefit-fact candidates. Raw text and source excerpts are not retained.
11. **Source deletion.** Supported text fixtures are deleted immediately after scan/extraction. Other staged files expire or can be deleted.
12. **No analytics payloads.** Filenames, document facts, source text, user answers, and sensitive findings are not sent to product analytics.

## Environment modes

### Disabled

Production default. The browser does not show an operational upload interface and the server cannot issue upload tokens.

### Synthetic only

Protected preview mode. Accepts only synthetic, already-public, or deliberately redacted fixtures. This mode is for engineering and workflow certification, not visitor use.

### Redacted benefits only

A possible future production mode. It is not authorized by this doctrine alone. Activation requires separate founder approval and completion of every real-document release gate.

## Extraction boundaries

The first adapter supports deterministic extraction from plain-text fixtures for:

- employee premium;
- deductible;
- out-of-pocket maximum;
- employer HSA or HRA contribution;
- retirement match percentage;
- retirement vesting years.

The extractor returns candidates that require user confirmation. It does not establish official eligibility, coverage, network participation, formulary status, or enrollment results.

PDFs may be quarantined in synthetic preview, but PDF parsing or OCR is not authorized until an isolated provider, deletion behavior, logging boundaries, and data-processing terms are reviewed and certified.

## Cloud workspace boundary

Document metadata is bound to the authenticated user, product, and owned workspace. Direct anonymous and authenticated table grants are revoked. The service role is used only by server APIs that re-check user identity, workspace ownership, and entitlement.

## Payment and entitlement boundary

The document architecture may coexist with Stripe test-mode and test entitlements. Live payment, live entitlement activation, and real-document processing are separate release decisions. None should be inferred from technical readiness of another.

## Employer portal boundary

CAF may generate a submission checklist or simulate a portal handoff. CAF must not collect portal passwords or submit real elections without an approved delegated authorization mechanism, employer-approved integration, comprehensive partial-failure handling, and a separate legal/security review.

## Eligibility and coverage boundary

CAF may organize evidence and identify verification questions. Outputs must remain framed as document-derived candidates, likely conditions, or unresolved verification tasks. Only the employer, plan administrator, carrier, pharmacy benefit manager, provider directory, or other controlling entity can make an official determination.

## Release gates for real documents

Real visitor document processing remains prohibited until all of the following are complete:

- external privacy and legal review of CAF's role and applicable federal/state duties;
- written privacy notice, retention schedule, deletion process, and incident-response plan;
- vendor and subprocessor inventory with appropriate contractual terms;
- protected production authentication and account deletion;
- RLS, ownership, token leakage, cross-user, replay, rate-limit, and abuse testing;
- malware/file-content screening appropriate to supported formats;
- extraction provider isolation and proof that raw documents do not enter analytics, logs, email, or support systems;
- user-visible review and correction of every extracted candidate;
- automated expiry and deletion job, not merely opportunistic cleanup;
- support process for mistaken uploads and deletion requests;
- explicit founder authorization setting real-document processing to true;
- production release certification proving that no unsupported document class can be accepted.

## Success standard

Prelaunch success means the code, schema, protected route, deletion behavior, extraction contract, tests, and release gates exist and pass with synthetic fixtures while production remains unable to accept a visitor document.

It does not mean that the system is legally cleared, publicly available, or ready to process health or financial information.
