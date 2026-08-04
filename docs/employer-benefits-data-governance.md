# Employer Benefits Data Governance

Last reviewed: 2026-08-04

## Purpose

Community Acquired Finance is building an employer-specific benefits decision system for healthcare workers. The system must distinguish a located document from an extracted fact, a reviewed fact from a verified fact, and a verified fact from an individualized recommendation.

Employer packets are inputs for an individual employer-specific decision experience. They are not a default employer-versus-employer comparison product.

CAF is independent from the employers, health systems, insurers, administrators, and government agencies named in the product. Organization names are used only to identify the employer or source a user is trying to understand. CAF does not use hospital logos or present listed organizations as partners, sponsors, clients, or endorsers without a separate written agreement and disclosure review.

## Source hierarchy

Use sources in this order:

1. Official employer benefits guides, rate sheets, annual change notices, and plan summaries.
2. Official insurer, pharmacy-benefit, retirement-administrator, and provider-network materials linked to the employer package.
3. Required plan documents such as Summary of Benefits and Coverage documents and retirement-plan summaries.
4. Government records used for entity resolution, plan identification, or general rules.
5. Employee-submitted public links, retained only as review leads until independently checked.

Search results, generated summaries, third-party articles, and employee recollection may identify a lead but may not establish an employer-specific fact.

## Source ownership and permitted-use boundary

Public availability establishes that a user can reach a source. It does not establish that CAF may reproduce, host, distribute, adapt, scrape at scale, or automatically reuse the source contents.

Every source therefore has a separate `use_scope` and `rights_review_status` in addition to source and fact verification.

### Use scopes

- `link_only`: CAF may display bounded source metadata and an outbound link to the source-owner page. CAF may not host or reproduce the document or automatically prefill facts from it.
- `metadata_and_facts`: CAF may retain and use reviewed factual propositions with page-level provenance, but may not reproduce protected expression or the document itself.
- `permissioned_copy`: CAF has documented permission or another reviewed basis for the specifically approved reproduction or distribution.
- `blocked`: CAF must not expose or use the source.

### Rights-review states

- `not_reviewed`: no source-specific terms, copyright, trademark, or permitted-use review has been completed. Link-only reference may remain available when the source is public and no block is known.
- `linking_reviewed`: the destination, source ownership, and applicable linking terms have been reviewed for continued link-only reference.
- `fact_use_reviewed`: the permitted use of non-copyrightable facts and the source-specific extraction method has been reviewed.
- `permission_confirmed`: written permission or a documented license covers the approved use.
- `blocked`: terms, ownership, access controls, source reliability, or another legal or safety concern prevents use.

Source verification alone never upgrades a source beyond `link_only`. Automatic employer-specific facts require both the normal package/fact gates and a `use_scope` of `metadata_and_facts` or `permissioned_copy` with the corresponding rights review.

CAF must not:

- bypass login, paywall, CAPTCHA, robots, or other technical access controls;
- request or store employee-portal credentials;
- copy hospital logos or use them as navigation or product branding without permission;
- mirror or redistribute full employer PDFs merely because they are publicly reachable;
- imply affiliation, sponsorship, endorsement, legal review by the source owner, or AHRQ/HHS endorsement;
- remove copyright, trademark, or attribution notices;
- treat a source owner&apos;s lack of response as permission.

A correction, source-owner objection, or takedown request must be reviewed promptly. The safest reversible action is to mark the source `blocked` while the issue is investigated.

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
- use scope and rights-review status;
- superseded package relationship when applicable.

A guide that applies to one employee group must not silently populate another group.

## Review states

### Source states

- `official_source_located`: URL and official domain are identified; no facts are approved.
- `metadata_reviewed`: employer, plan year, employee population, and document type are checked.
- `facts_extracted`: candidate structured facts are tied to the source and page.
- `verified_for_guidance`: a human reviewer has checked the relevant facts and the package is eligible to prefill a guided workflow, subject to the separate rights-use gate.
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
- use scope and rights-review status;
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

The directory search sends the typed organization name in a same-origin POST body. It must not intentionally place the search term in the page URL, analytics events, page titles, or saved employer-source context until the user deliberately starts a local workspace.

The feature does not accept files, email addresses, credentials, member IDs, claims, medical information, financial-account information, account numbers, or free-form notes.

CAF must not ask users to provide employee-portal credentials. Private document upload remains disabled until authentication, storage retention, file scanning, deletion, incident response, and user-consent controls are separately designed and validated.

## Storage and access

Employer catalog, source, fact, and submission tables use forced row-level security with no direct `anon` or `authenticated` access. Server-side service-role code is the only current data path. The directory search RPC is executable only by the server role.

No source or fact becomes public merely because it exists in the database. The public API returns only allowlisted metadata for public HTTPS links that are source-verified and are not marked `blocked` by either use scope or rights review.

## AHRQ baseline attribution

The national system universe is based on the AHRQ Compendium of U.S. Health Systems, 2023. CAF&apos;s alias reconciliation, employer matching, public-source research, product design, and conclusions are CAF&apos;s work. AHRQ and HHS do not endorse CAF, the directory, listed employers, or CAF&apos;s interpretation of the data.

## Refresh and monitoring

The version-controlled registry is validated during every build. A scheduled GitHub Actions workflow checks registered official URLs weekly and produces an artifact containing HTTP status, final URL, redirect state, content type, ETag, and Last-Modified metadata when available.

A successful URL check proves only that the registered source remains reachable. It does not prove the content is current, unchanged, applicable, permitted for reuse, or fully extracted.

Re-review is required when:

- a new plan year begins;
- a source URL redirects or fails;
- content metadata indicates a possible update;
- the source owner changes its terms, linking policy, or access controls;
- the employer publishes an annual change notice;
- an employee or source owner reports a discrepancy;
- a recommendation depends on a fact whose applicability or permitted use is uncertain.

## Guided-product rules

The employer selector may preserve employer context and open a manual workspace while source review is incomplete. It must show source completeness, missing categories, independent status, and the external-link boundary.

Automatic prefill is allowed only when:

- the package is `ready_for_guided_entry`;
- the relevant facts are `verified`;
- the source `use_scope` is `metadata_and_facts` or `permissioned_copy`;
- the rights review is `fact_use_reviewed` or `permission_confirmed`;
- the source remains current for the identified employee population.

The decision system must continue to show:

- user-entered assumptions;
- employer-source facts;
- unresolved verification questions;
- plan-year and employee-population scope;
- limits of the calculation;
- the controlling plan documents and written plan-administrator answers as the final authority.

## Current release boundary

The national directory exposes link-only source metadata and manual-workspace handoff. It does not host employer documents, copy protected document text into the public product, or automatically prefill employer-specific values.

The reviewed pilot registry remains separate. No employer package is currently classified as ready for automatic prefill under both the evidence and rights-use gates.
