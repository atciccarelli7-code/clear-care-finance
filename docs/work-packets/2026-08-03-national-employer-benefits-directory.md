# National Employer Benefits Directory

## Objective

Convert the employer-benefits pilot from a five-employer static selector into a national healthcare-system discovery surface without weakening evidence controls.

## Product contract

- Every health system in the fixed 2023 AHRQ Compendium can be found and can start a manual Benefits Receipt.
- Directory presence is not proof that CAF has a current benefits guide.
- A discovered guide is not a verified benefit fact.
- Employer-specific prefills remain limited to reviewed packages, employee populations, plan years, sources, and facts.
- Private portal URLs and unreviewed source details are not exposed through the public directory API.

## Data layers

1. `employer_benefits_system_universe`
   - 639 AHRQ health systems.
   - Stores system identity, location, baseline size fields, registry vintage, and optional mapping to a reviewed CAF employer.
2. `employer_benefits_discovered_sources`
   - Research ledger for public PDFs, public webpages, private portals, and older sources.
   - Stores plan-year and audience context plus access, document, source, and verification status.
3. Existing package pipeline
   - `employer_benefits_employers`
   - `employer_benefits_packages`
   - `employer_benefits_sources`
   - `employer_benefits_facts`
   - Remains the only layer allowed to drive reviewed employer-specific guidance.

## Live ingestion completed

- AHRQ systems imported: 639
- Discovered source records imported from the research spreadsheet: 67
- Sources matched automatically to AHRQ systems: 39
- Remaining records are retained for alias, subsidiary, facility, and merger reconciliation.

## Application behavior

- `GET /api/employer-benefits-directory?q=<name>` performs a bounded server-side lookup.
- The endpoint returns only public-safe directory metadata and coverage status.
- The Benefits Command Center renders national search before the reviewed five-employer pilot.
- Unsupported systems create a locally saved manual workspace labeled with the selected employer.
- Supported systems link to the reviewed employer pilot.

## Verification gates

Coverage statuses:

- `verified_public_pdf`
- `verified_public_webpage`
- `private_employee_portal`
- `outdated_only`
- `research_pending`

Fact-verification statuses remain separate:

- `unverified`
- `source_verified`
- `extracted`
- `reviewed`
- `product_ready`

## Known limitations

- AHRQ 2023 is an authoritative baseline, not a complete 2026 merger and naming map.
- A health system may contain multiple employee populations, facilities, unions, regions, and plan packages.
- Current public documents are not available for many systems.
- Directory search initially matches canonical system names; alias and facility search requires continued reconciliation.

## Rollback

- Remove `NationalEmployerDirectory` from `BenefitsCommandCenterPage` to revert the UI.
- Remove or disable `/api/employer-benefits-directory` to stop public lookup.
- The new Supabase tables are additive and service-role-only; leaving them in place does not alter the reviewed package calculation pipeline.
