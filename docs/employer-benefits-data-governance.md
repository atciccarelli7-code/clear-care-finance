# Employer Benefits Data Governance

Last reviewed: 2026-08-03

## Purpose

Community Acquired Finance is building an employer-specific benefits decision system for healthcare workers. The system must distinguish a located document from an extracted fact, a reviewed fact from a verified fact, and a verified fact from an individualized recommendation.

Employer packets are inputs for an individual employer-specific decision experience. They are not a default employer-versus-employer comparison product.

## Source hierarchy

Use sources in this order:

1. Official employer benefits guides, rate sheets, annual change notices, and plan summaries.
2. Official insurer, pharmacy-benefit, retirement-administrator, and provider-network materials linked to the employer package.
3. Required plan documents such as Summary of Benefits and Coverage documents and retirement-plan summaries.
4. Government records used for entity resolution, plan identification, or general rules.
5. Employee-submitted public links, retained only as review leads until independently checked.

Search results, generated summaries, third-party articles, and employee recollection may identify a lead but may not establish an employer-specific fact.

## Core source package

A plan-year and employee-population package is not complete until the following source categories are located or explicitly documented as unavailable:

- annual benefits guide;
- each applicable medical-plan SBC;
- employee premium or payroll-deduction rate sheet;
- retirement-plan match, contribution, eligibility, and vesting summary;
- annual enrollment change notice and deadline information.

Useful secondary sources include formularies, provider-network references, disability and life summaries, leave policies, HSA/HRA/FSA rules, tuition or loan assistance, and voluntary benefits.

## Package identity

Every package must preserve:

- employer entity;
- plan year;
- employee population or class;
- region, union status, or employing entity when relevant;
- effective dates;
- source completeness;
- review status;
- superseded package relationship when applicable.

A guide that applies to one employee group must not silently populate another group.

## Review states

### Source states

- `official_source_located`: URL and official domain are identified; no facts are approved.
- `metadata_reviewed`: employer, plan year, employee population, and document type are checked.
- `facts_extracted`: candidate structured facts are tied to the source and page.
- `verified_for_guidance`: a human reviewer has checked the relevant facts and the package is eligible to prefill a guided workflow.
- `rejected`: the source is unrelated, unsafe, unofficial, or otherwise unusable.
- `superseded`: a newer authoritative source replaces it.

### Fact states

- `candidate`: machine- or human-extracted but not reviewed.
- `reviewed`: checked for transcription and source alignment.
- `verified`: approved for the identified employer, plan year, and employee population.
- `rejected`: unsupported or contradictory.
- `superseded`: replaced by a later fact or package.

Candidate and reviewed facts must not drive a recommendation that appears verified.

## Provenance requirements

Every consequential employer-specific fact must retain:

- source document ID;
- page number when applicable;
- original unit and value;
- category and stable fact key;
- confidence;
- review status;
- reviewer note when interpretation was required;
- created and updated timestamps.

Calculated values must separately identify the source facts and user assumptions used.

## Privacy boundary

The public source-intake form accepts only:

- employer name;
- plan year;
- employee-population label;
- optional public HTTPS employer or insurer URL;
- random browser-session identifier for duplicate handling.

It does not accept files, email addresses, credentials, member IDs, claims, medical information, financial-account information, account numbers, or free-form notes.

CAF must not ask users to provide employee-portal credentials. Private document upload remains disabled until authentication, storage retention, file scanning, deletion, incident response, and user-consent controls are separately designed and validated.

## Storage and access

Employer catalog, source, fact, and submission tables use forced row-level security with no direct `anon` or `authenticated` access. Server-side service-role code is the only current data path. Public product code uses a version-controlled reviewed registry until a separately reviewed catalog API is activated.

No source or fact becomes public merely because it exists in the database.

## Refresh and monitoring

The version-controlled registry is validated during every build. A scheduled GitHub Actions workflow checks registered official URLs weekly and produces an artifact containing HTTP status, final URL, redirect state, content type, ETag, and Last-Modified metadata when available.

A successful URL check proves only that the registered source remains reachable. It does not prove the content is current, unchanged, applicable, or fully extracted.

Re-review is required when:

- a new plan year begins;
- a source URL redirects or fails;
- content metadata indicates a possible update;
- the employer publishes an annual change notice;
- an employee reports a discrepancy;
- a recommendation depends on a fact whose applicability is uncertain.

## Guided-product rules

The employer selector may preserve employer context and open a manual workspace while source review is incomplete. It must show source completeness and missing categories.

Automatic prefill is allowed only when the package is `ready_for_guided_entry` and the relevant source facts are `verified`.

The decision system must continue to show:

- user-entered assumptions;
- employer-source facts;
- unresolved verification questions;
- plan-year and employee-population scope;
- limits of the calculation;
- the official enrollment portal as the final election authority.

## Initial pilot

The initial registry contains five healthcare employers:

- Novant Health;
- Atrium Health;
- UNC Health;
- ECU Health;
- Northwell Health.

UNC Health, ECU Health, and Northwell Health have one official-domain benefits-guide candidate registered for 2026. No package is currently classified as ready for automatic prefill.
