# Employer Benefits Platform Foundation

Date: 2026-08-03  
Branch: `feat/employer-benefits-platform-foundation`  
Production route affected: `/tools/benefits-command-center`  
Release state: implementation and initial source extraction complete on branch; final technical and database validation pending

## Objective

Convert the Benefits Command Center from a generic manual comparison into the first usable employer-aware layer of the Healthcare Worker Benefits Decision System.

The immediate user outcome is:

> Select a healthcare employer, plan year, and employee group; see exactly which official source categories are located or missing; preserve that context; and open a local benefits workspace without treating unreviewed documents as verified plan data.

## Founder direction

The founder authorized maximum safe implementation and asked to build everything currently feasible. This authorizes implementation but does not waive privacy, evidence, security, factual-integrity, or release gates.

## Inherited-decision challenge

The inherited sequence treated the public $29 page as a demand test while the employer-specific product remained inaccessible. That sequence is no longer sufficient. The work preserves fail-closed checkout and premium access but moves the live free product toward the actual flagship interaction model.

The inherited warning that users should not enter employer or plan names was too broad for an employer-specific system. It is replaced with a narrower privacy boundary: employer and plan names may be used for source matching, while member IDs, claims, medical information, credentials, and sensitive identifiers remain prohibited.

## Scope implemented

### Product surface

- Added an employer-aware navigator directly to the existing Benefits Command Center.
- Seeded five healthcare employers: Novant Health, Atrium Health, UNC Health, ECU Health, and Northwell Health.
- Added plan-year and employee-class selection.
- Added source-completeness progress and missing-core-document reporting.
- Added seven official-source candidate links across all five pilot employers.
- Added a one-click employer-context handoff into the existing local benefits workspace.
- Preserved manual, sample, comparison, and tour modes.

### Data and provenance

- Added a typed, version-controlled employer source registry.
- Added package, source, review-state, and readiness contracts.
- Added a database migration for employer entities, plan-year packages, sources, normalized facts, and privacy-bounded source submissions.
- Added plan-year extraction migrations for Novant Health, Atrium Health, UNC Health, and ECU Health.
- Structured 46 candidate facts with source-document and page provenance, including premiums, medical-plan design, employer HSA contributions, retirement rules, leave, disability, life insurance, tuition support, enrollment deadlines, and surcharges where supported by the applicable guide.
- Left Northwell Health at source-located status because the current official PDF blocked reliable extraction; no stale 2020 information was substituted.
- Prevented candidate facts from being represented as verified prefills.

### Intake

- Added `/api/employer-benefits-source`.
- Accepts only employer name, plan year, optional employee-population label, optional public HTTPS URL, and random session ID.
- Rejects non-HTTPS links, credentials in URLs, localhost, local domains, IP-address hosts, malformed sessions, and invalid plan years.
- Stores no email, files, free-form notes, claims, medical information, member IDs, or credentials.

### Operations

- Added a deterministic registry check to build and test commands.
- Added a weekly source-health workflow.
- Added a source monitor that captures HTTP status, redirects, content type, ETag, Last-Modified, and final URL when available.
- Added unit and browser tests.
- Added employer-benefits data-governance documentation.

## Quantified impact

- Employer-aware entry points on the Benefits Command Center: `0 → 1`.
- Seeded healthcare employers: `0 → 5`.
- Registered official-domain source candidates: `0 → 7`.
- Employer packages with page-grounded candidate facts: `0 → 4`.
- Structured candidate employer-benefit facts: `0 → 46`.
- Core source categories tracked per package: `0 → 5`.
- Public sensitive-file upload paths: `0 → 0`.
- Public employer-source intake fields containing contact or health data: `0 → 0`.
- Existing canonical routes removed: `0`.
- Existing Benefits Command Center entry modes removed: `0`.
- Checkout activation: unchanged and disabled.
- Premium authentication activation: unchanged and disabled.

## Non-goals and withheld scope

- No employer package is automatically prefilled yet.
- No employer package is represented as complete or verified.
- No employee-portal credential collection.
- No private file upload.
- No medical-record, claim, member-ID, or payroll-account collection.
- No direct employer HRIS, Workday, UKG, ADP, or benefits-administrator integration.
- No enrollment write-back.
- No paid checkout activation.

These are withheld because the current evidence, source completeness, privacy model, and external authorization are insufficient.

## Executive accountability matrix

| Perspective | Status | Finding |
|---|---|---|
| Strategy | PASS | Directly advances the confirmed healthcare-worker flagship rather than adding another content page. |
| Operations | WARN | Source extraction is now repeatable, but the human verification queue still needs an explicit operating owner and cadence. |
| Finance | PASS | Uses existing infrastructure; no new paid vendor or recurring service is introduced. |
| Revenue | WARN | Improves flagship value but does not activate payment or establish willingness to pay for the working experience. |
| Product | PASS | Converts employer identification into an actual product action and preserves manual fallback. |
| Technology | WARN | Full CI, preview, and live migration validation remain pending. |
| Data and analytics | PASS | Employer entities, package scope, sources, candidate facts, review status, and provenance are structurally separated. |
| Discovery | PASS | Preserves the canonical route and existing search surface. |
| Editorial integrity | PASS | Official sources and candidate facts are labeled as unverified; blocked Northwell extraction was not replaced with stale content. |
| Healthcare-user context | PASS | Uses employer, plan year, employee class, salary band, work status, and source uncertainty that healthcare workers actually face. |
| Privacy and legal | PASS | Intake is metadata-only and explicitly excludes credentials, health information, claims, member IDs, and files. |
| Accessibility and reliability | WARN | Semantic controls and live regions are implemented; browser certification remains pending. |
| Quality and release | BLOCK | Do not merge until CI, browser, preview, migration, and production-boundary checks pass. |
| Red team | WARN | Principal risks are stale plan-year data, wrong employee-population matching, and users mistaking candidate facts for verified guidance. UI, schema, and governance explicitly address these risks. |
| Process improvement | PASS | Repeated manual PDF discovery is converted into a versioned registry, extraction schema, validation command, and weekly monitor. |

## Registered role quorum

| Role | Status | Disposition |
|---|---|---|
| Orchestrator | PASS | Scope follows the flagship objective with fail-closed release controls. |
| Context steward | PASS | Work packet and durable governance artifact added. |
| Capability router | PASS | GitHub, Supabase, Vercel CI, and official-source workflows are assigned to their strongest surfaces. |
| Executive strategy | PASS | Sequencing corrected toward the actual product. |
| Product management | PASS | Employer selection, fallback, and source readiness form a coherent first release slice. |
| Healthcare user research | PASS | Employee class and plan-year applicability are first-class. |
| Information architecture | PASS | Existing canonical route is strengthened instead of adding a duplicate route. |
| UX and design system | WARN | Responsive and semantic implementation is present; preview review pending. |
| Content and evidence integrity | PASS | Source and fact review states are explicit, with 46 page-grounded candidate facts. |
| Frontend engineering | WARN | Compilation and browser CI pending. |
| Systems architecture | PASS | Static reviewed registry, private database, source monitor, and future verified-fact API responsibilities are separated. |
| Backend, data, and security | WARN | Migrations and API are least-privilege by design; live migration validation pending. |
| Platform and DevOps | WARN | Scheduled source monitor added; workflow execution pending. |
| SEO and discovery | PASS | Canonical route preserved; no new thin employer landing pages. |
| Monetization and conversion | WARN | Product utility improved; payment remains correctly disabled. |
| Analytics and experimentation | WARN | No additional sensitive telemetry; completion measurement should be added only after bounded contract review. |
| Accessibility, performance, reliability | WARN | Automated browser and performance checks pending. |
| Privacy, legal, user protection | PASS | Metadata-only intake and no private uploads. |
| Publishing and governance | PASS | Source states and review gates documented. |
| Quality and release | BLOCK | Pending CI, preview, database advisors, and end-to-end verification. |
| Adversarial red team | WARN | Wrong-population, stale-year, and false-verification risks remain primary. |
| Process improvement | PASS | Manual collection converted into reusable operating infrastructure. |

## Acceptance criteria

- Registry contract check passes.
- TypeScript API check passes.
- Unit tests pass.
- Browser certification verifies employer selection, local context, source visibility, and bounded submission payload.
- Vercel preview is `READY`.
- Supabase migrations apply in order without error.
- Database security advisors show no new unresolved findings.
- Direct `anon` and `authenticated` table access remains unavailable.
- Submission API can insert through server-side service-role access.
- The page never states that a package is verified when only a source URL or candidate fact is present.
- Existing Benefits Command Center modes and saved-work behavior remain functional.

## Rollback

- Revert the pull request to remove the employer navigator, endpoint, registry, scripts, tests, and migration files.
- If the database migrations have already been applied, disable the intake endpoint and retain the new private tables until a separately reviewed cleanup migration is approved. The tables are additive and contain no required production dependencies.

## Highest-value next action after release

Perform a second-person human verification pass on the Novant Health package because it has both a benefits guide and a separate premium sheet, then publish only the verified facts required for a controlled Novant employee guided-entry pilot. The first pilot must preserve every assumption and unresolved verification question and must not submit enrollment elections.
