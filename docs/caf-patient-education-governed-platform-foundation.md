# CAF Patient Education Systems: Governed Platform Foundation

## Status

This document describes the engineering foundation for **CAF Patient Education Systems**. It is a public-safe architecture document. It does not contain a complete patient guide, claim-level evidence dossier, reviewer identity, hospital policy, hospital customization, patient information, contract, price, or client deliverable.

The current system is an engineering foundation and controlled product demonstration. It must not be represented as clinically approved, hospital deployed, production integrated, or proven to improve patient outcomes until the applicable private review, security, contracting, implementation, and evaluation work is complete.

## Product objective

CAF Patient Education Systems is intended to support a governed hospital-to-home patient education workflow. The platform separates clinical source content, evidence, review, localization, institution configuration, channel rendering, release authorization, delivery, correction, recall, and measurement into explicit controlled stages.

The platform is designed around several principles:

1. A patient guide is a versioned software object, not an isolated document.
2. The same approved source should produce consistent channel-specific outputs.
3. Automated checks support but never replace clinical, accessibility, health-literacy, privacy, or institutional review.
4. Every distributed artifact must be traceable to an exact package version, source version, review state, release authorization, and cryptographic fingerprint.
5. CAF-managed systems should not receive or persist patient identifiers merely to deliver general education content.
6. Institution-specific contact routes and policies must not alter the controlling clinical source without governed review.
7. Suspended, recalled, superseded, and retired versions must remain visible to governance systems and unavailable for ordinary distribution.
8. Pilot measurement must use privacy-minimized aggregate data and must not imply causation without an appropriate study design.

## Public and private boundary

### Public repository may contain

- Product positioning and implementation-stage disclosures
- Typed schemas and validation logic
- Synthetic, nonclinical fixtures
- Public-safe capability manifests
- Controlled-preview package descriptors
- Distribution-boundary enforcement
- Automated tests using invented organizations and content
- Architecture and governance documentation
- Nonclinical demonstrations of compilation, hashing, authorization, and recall behavior

### Private systems must contain

- Complete proprietary patient education guides
- Claim-level evidence maps and restricted source material
- Clinical reviewer identities, credentials, signatures, and approval records
- Hospital policies, formularies, contacts, escalation paths, and implementation decisions
- Translation vendor identities and protected review records
- Patient-testing records that could identify participants
- Client contracts, pricing, procurement material, security questionnaires, and implementation deliverables
- Patient, encounter, claim, medication-order, diagnosis, or medical-record information
- Production secrets, integration credentials, signing keys, and organization-specific access controls

The public repository demonstrates engineering discipline. It is not the authoritative clinical-content repository.

## Trust boundaries

### Boundary 1: CAF public product surface

The website explains the product and may provide fixed-choice pilot planning. It does not collect free-text clinical narratives, patient identifiers, or hospital-specific protected information. Public technical proofs contain synthetic metadata and no actionable patient care instructions.

### Boundary 2: CAF private content authority

The private source system should store the authoritative structured documents, evidence dossiers, controlled terminology, review records, localization records, correction records, and release history. Access should be least-privilege, logged, and separated from the public application repository.

### Boundary 3: Healthcare organization configuration

A healthcare organization may provide approved non-PHI configuration such as public contact routes, follow-up scheduling instructions, pharmacy or supplier routes, home-health contact information, local policy labels, formulary notes, branding, and language preferences.

Patient-specific values remain in the organization's approved clinical environment. CAF source content may define a patient-specific field but must not populate or store that value.

### Boundary 4: Organization runtime patient binding

Future EHR or portal adapters may bind a general education artifact to a patient or encounter only inside the healthcare organization's runtime. A delivery envelope explicitly states that CAF receives no patient identifier and persists no patient context.

### Boundary 5: Aggregate pilot analytics

Pilot analytics are limited to predefined aggregate metrics. The model forbids patient identifiers, encounter identifiers, free text, and exact patient timestamps. Small cells are suppressed. Outcome observations carry an explicit noncausal interpretation boundary.

## Canonical object model

### Package

A package identifies the clinical domain, intended audience, care settings, risk tier, release status, version, source dossier, assets, review roles, release gates, localization fields, prohibited data, claims boundary, and correction route.

The package is the controlling release unit. A document or artifact cannot claim a release state independently from its package.

### Asset

An asset represents a logical deliverable such as a full guide, quick start, after-visit summary, caregiver guide, teach-back tool, clinician reference, implementation workflow, or feedback tool. Each asset declares its approved formats, version, source dossier, derivation relationships, localization requirements, patient-specific-field allowance, clinical-instruction classification, and public-distribution eligibility.

### Structured content document

A content document binds a versioned asset to structured blocks. Supported blocks include:

- Headings
- Paragraphs
- Information, warning, emergency, financial, routine, and caregiver callouts
- Action lists with urgency and routing
- Procedures with ordered steps and verification
- Personalization fields with explicit PHI capability and storage boundary
- Teach-back prompts and completion evidence
- Troubleshooting scenarios
- Evidence anchors

A full guide requires core sections including the most important message, current actions, help escalation, personal plan, procedure guidance, and plan-failure guidance.

### Evidence dossier

The evidence contract models source authority, jurisdiction, status, licensing, supersession, claim applicability, exclusions, controlling and supporting relationships, contradictions, decision records, unresolved questions, review schedules, and update triggers.

High-risk claims require controlling evidence. Contradictory evidence requires a documented decision. Retracted, unknown, unresolved, or expired evidence prevents release readiness.

### Localization package

A localization package binds every translated block to the exact source block and source asset version. It stores a source-block SHA-256, translator method, translator role, completion date, language-accuracy review, clinical-equivalence review, health-literacy review, cultural adaptation notes, and unresolved terminology.

Machine-only translation cannot become approved. Approved localizations require all block reviews and no unresolved terms. Localization cannot change block type, block ID, or section structure.

### Institution overlay

An institution overlay binds approved local values to an exact package version and locale. Overlay fields are non-PHI and retain source ownership, approval role, and approval date.

The overlay compiler applies only fields already declared by the document, requires category equivalence, rejects PHI-capable targets, preserves block structure, and records applied-field provenance.

### Quality report

A quality report is bound to the exact package, document, version, and locale. It contains automated metrics, configured thresholds, structured findings, human review status, and release decision.

Automated metrics currently support deterministic approximations for:

- Reading grade
- Reading ease
- Average sentence length
- Passive voice
- Actionability
- Numeracy context
- Structural accessibility

Automated findings include unresolved placeholders, excessively long sentences, missing emergency actions, vague actions, missing actionable content, missing teach-back, unsupported acronyms, excessive reading level, inadequate reading ease, inadequate numeracy, and structural accessibility failures.

The engine never generates human approval. A report may pass only when all thresholds pass, no blocking finding remains, and health-literacy, accessibility, and clinical-safety reviews are approved.

## Governed lifecycle

### 1. Author

A content author creates or revises a structured source document in the private authority. Source content defines patient-facing meaning, clinical classification, preview eligibility, personalization capability, evidence anchors, and supported outputs.

### 2. Validate structure

The document schema rejects invalid IDs, duplicate block IDs, missing required sections, emergency actions without explicit instructions, invalid emergency routing, and PHI-capable fields outside the institutional boundary.

### 3. Link evidence

Patient-facing claims are linked to the controlling private evidence dossier. Evidence readiness is evaluated for authority, current status, applicability, contradictions, unresolved questions, expiration, and scheduled review.

### 4. Analyze quality

The QA engine extracts plain language from the structured blocks and produces a reproducible report. The automated report is version-bound and cannot be copied to another document version or locale.

### 5. Complete human reviews

Required roles review clinical safety, nursing workflow, health literacy, accessibility, pharmacy content when applicable, evidence, localization, privacy and security, patient testing, and institutional implementation.

Human review records remain private. The public repository models roles and decisions but contains no real reviewer identity.

### 6. Localize

Approved source blocks may be localized. Every translated block retains source linkage, structural parity, translator attestation, and separate review decisions.

Any source change invalidates or reopens the affected localization according to the semantic change-risk report.

### 7. Apply institution overlay

An approved active overlay may populate only declared non-PHI organization fields. Patient-specific values are not inserted by the CAF overlay compiler.

The overlay is version-bound. A source version change requires compatibility review or a new overlay approval.

### 8. Scan privacy boundary

CAF source content is scanned for obvious patient identifiers and populated PHI-capable values. Institution overlays are scanned independently. Controlled previews require sanitization that removes restricted clinical blocks, evidence anchors, and PHI-capable fields.

The scanner is a defensive control, not a legal determination or comprehensive data-loss-prevention system.

### 9. Prepare release candidate

The governed delivery pipeline prepares an immutable candidate:

1. Parse package and source documents.
2. Validate source privacy boundary.
3. Apply exact approved localization when required.
4. Apply exact approved institution overlay when applicable.
5. Generate a version-bound QA report.
6. Compile supported artifacts.
7. Build a SHA-256 integrity manifest.

Candidate preparation does not authorize distribution.

### 10. Authorize release

Release authorization separately reconciles:

- Exact package and version
- Exact candidate content hash
- Exact required document versions and locales
- Passed QA reports
- Approved localizations
- Approved active institution overlay
- Required overlay fields
- Evidence gate
- Clinical review gate
- Health-literacy gate
- Accessibility gate
- Patient-testing gate
- Institutional-localization gate
- Privacy and security gate
- Output-integrity gate
- Effective, unexpired release ledger state

A blocked authorization result does not return a distributable bundle.

### 11. Create delivery envelope

An authorized artifact may be wrapped in a channel-specific delivery envelope for:

- After-visit summary text
- Patient portal JSON
- Print-service input
- Content-management-system publishing
- Future EHR document reference

The envelope binds the artifact path, target, MIME type, byte length, SHA-256, authorization ID, integrity-manifest ID, organization key, locale, overlay ID, localization ID, generation date, expiration, and privacy boundary.

EHR patient binding is restricted to the organization's runtime. The envelope contains no patient or encounter identifier.

### 12. Record delivery receipt

Delivery adapters return fixed-code receipts. Receipts record acceptance, rejection, or revocation without free-text patient context. An accepted receipt must reference the exact authorization and artifact SHA-256.

### 13. Measure aggregate pilot activity

A pilot analytics batch may report predefined aggregate counts and rates. Small cells are suppressed. Metrics tied to a time window must declare that window. Numerators cannot exceed denominators. Causal claims are structurally prohibited.

### 14. Correct, suspend, recall, or retire

The release state machine enforces legal transitions. Draft content cannot jump directly to production. Recalled versions cannot return to ordinary circulation.

A semantic change-risk report determines whether a change requires routine QA, reopened review gates, localization reapproval, overlay reapproval, distribution suspension, or correction/recall assessment.

Suspended, recalled, or retired release records generate distribution-control notices scoped to the exact package version and active distributions. Recall notices identify affected distribution IDs, envelope IDs, and artifact hashes. Organizations acknowledge completion or file a governed exception.

Original accepted-delivery receipts are preserved. A separate revocation receipt records the later control action.

## Cryptographic and audit controls

### Artifact integrity manifest

The release bundle integrity manifest contains:

- Sorted unique artifact paths
- Package and version
- Compilation mode
- Asset and document IDs
- Document version
- Target and MIME type
- UTF-8 byte length
- Per-artifact SHA-256
- Canonical bundle SHA-256

Any content, path, byte-length, target, or version change invalidates verification.

### Governance event chain

Governance events are canonicalized and hash chained. Each event stores:

- Sequence
- Event type
- Time
- Package and version
- Optional document ID
- Actor role and protected actor reference
- Reason
- Evidence references
- Payload hash
- Previous-event hash
- Event hash

Retrospective event edits are detectable. This is a tamper-evidence mechanism, not a substitute for protected storage, access control, signed identities, or an external immutable audit service.

## Release state machine

The intended state progression is:

```text
draft
  -> in_review
      -> pilot_ready
          -> released
              -> suspended
                  -> in_review | recalled | retired
              -> recalled
                  -> retired
              -> retired
```

Additional governed paths allow a package in review to return to draft, a pilot-ready package to return to review, and a released package to reopen review. Gate-approval and correction events may preserve the current state. Event type and target state must agree.

## Semantic change risk

Changes are classified by meaning rather than file size.

### Low risk

Examples:

- Nonclinical plain-language clarification
- Minor label improvement that does not change action or boundary

Minimum response:

- Increment version
- Rerun automated QA
- Recompile artifacts
- Regenerate integrity manifest
- Repeat applicable health-literacy and accessibility review

### Medium risk

Examples:

- Nonclinical action-list or procedure-structure change
- Delivery-target change
- Addition or removal of a structured operational block

Additional response may include nursing-workflow and institutional implementation review.

### High risk

Examples:

- Clinical procedure or troubleshooting change
- Evidence-anchor change
- Localization-relevant clinical wording change
- Institution personalization structure change

Response includes reopened clinical and evidence review, localization reapproval, overlay compatibility review, and release-gate reassessment.

### Critical risk

Examples:

- Emergency action change
- PHI-capable field change
- Clinical-instruction classification change
- Distribution-boundary change
- Expanded public-preview eligibility
- Controlling source-dossier change

Response includes all high-risk actions plus patient testing, privacy/security review, distribution-suspension consideration, and correction or recall assessment.

## Failure behavior

The platform is intended to fail closed.

- Invalid source document: no compilation
- Missing localization: no translated delivery
- Unapproved localization: no translated delivery
- Inactive or mismatched overlay: no institution-specific delivery
- PHI-capable overlay target: no overlay application
- Blocking QA finding: no release authorization
- Incomplete human review: conditional or blocked, never passed
- Failed release gate: no authorization
- Candidate integrity mismatch: authorization throws and returns no bundle
- Release-record hash mismatch: blocked authorization
- Unsupported delivery target: no delivery envelope
- Recalled package: existing distributions receive control notices and revocation receipts
- Missing recall acknowledgment deadline: no recall notice issuance
- Small analytics cell: suppression required

## Threat model

### Accidental public disclosure

Mitigations:

- Public/private path separation
- IP boundary scanner
- Controlled-preview sanitizer
- Public-contract validator
- Privacy scanner
- Public-safe synthetic fixtures
- Build-time foundation inventory

Residual risk:

- A developer could commit sensitive prose using an unrecognized filename or pattern. Private repository controls, code review, secret scanning, DLP, and human review remain required.

### Stale clinical content

Mitigations:

- Versioned source dossier
- Scheduled review and expiration
- Update triggers
- Release effective and expiration dates
- Semantic change-risk classification
- Suspension and recall states

Residual risk:

- External evidence may change before a scheduled review. Active surveillance and accountable clinical ownership remain required.

### Unsafe translation

Mitigations:

- Exact source linkage
- Source-block hash
- Structural parity
- Machine-only approval prohibition
- Language, clinical-equivalence, and health-literacy review
- Unresolved-term blocking

Residual risk:

- Linguistic and cultural appropriateness cannot be fully automated. Qualified human review and patient/community testing remain required.

### Unauthorized institution customization

Mitigations:

- Predeclared fields
- Category matching
- Non-PHI overlay restriction
- Version and locale binding
- Approval provenance
- Effective and expiration dates
- Exact release authorization

Residual risk:

- An institution could modify an exported artifact outside the governed system. Integrity verification, destination controls, contracts, and operational audits are required.

### Artifact tampering

Mitigations:

- Per-artifact SHA-256
- Canonical bundle SHA-256
- Authorization hash binding
- Delivery-envelope hash binding
- Verification before authorization and delivery

Residual risk:

- Hashes do not prove signer identity. Production should add protected signing keys, key rotation, signature verification, and trusted timestamping.

### Incomplete recall execution

Mitigations:

- Version-scoped distribution registry
- Control notices
- Envelope and artifact-hash targeting
- Revocation receipts
- Required acknowledgment and deadline
- Governed exception codes

Residual risk:

- External destinations may be offline or incapable of remote revocation. Contracts and implementation plans must define manual removal and escalation.

### Outcome overclaiming

Mitigations:

- Fixed aggregate metrics
- Privacy attestation
- Small-cell suppression
- Observation-window requirements
- Noncausal interpretation boundary
- Public claims boundary

Residual risk:

- Stakeholders may still overinterpret observational change. Evaluation design and communications require statistical and clinical governance.

## Validation strategy

The foundation uses multiple validation layers:

1. Zod schema validation
2. Deterministic unit tests
3. Adversarial failure tests
4. IP boundary scanning
5. Public-contract validation
6. Capability-manifest validation
7. Foundation inventory validation
8. Production build validation
9. Browser journey validation
10. Accessibility testing with axe
11. Vercel preview deployment
12. GitHub Actions certification

The foundation inventory gate verifies that every required engine capability has an implementation file, expected export marker, and adversarial test. It also verifies public-safe proof artifacts and selected safety-scenario markers.

## Required production controls not yet satisfied by this repository

The current foundation does not by itself satisfy hospital production requirements. Before production deployment, the product requires at minimum:

- Private authoritative source repository
- Role-based access control
- Strong authentication and organization isolation
- Protected reviewer identities and electronic approval records
- Secure signing keys and digital artifact signatures
- Audit-log retention and export
- Backup, disaster recovery, and restoration testing
- Security risk assessment
- Dependency and container scanning
- Vulnerability management and incident response
- Vendor and subcontractor inventory
- Data-flow diagrams and data classification
- Contractual privacy and security terms
- Accessibility conformance testing by qualified reviewers
- Clinical governance charter
- Named accountable clinical owners
- Translation vendor qualification
- Patient/community testing protocol
- Formal change-control procedure
- Production correction and recall procedure
- Destination-specific integration validation
- EHR vendor and FHIR conformance testing where applicable
- Business continuity and customer notification process
- Legal review of claims, licensing, and institutional responsibilities
- Pilot protocol and evaluation plan

## Near-term engineering roadmap

### Private authority migration

Move authoritative contracts and real clinical source content into a private repository. Keep only public-safe interfaces, synthetic fixtures, and product demonstrations in the public repository.

### Accessible document production

Implement a governed print-to-PDF service with tagged-output preparation, reading order, heading structure, link semantics, language metadata, table headers, color-independent communication, page-break control, PDF/UA evaluation, and human accessibility review.

### Review operations console

Build a private review interface showing exact diffs, evidence anchors, QA findings, localization status, institution compatibility, release gates, and authorization state. Reviewer identity and approval evidence must remain protected.

### Correction and recall operations

Connect distribution control notices to customer contact records, delivery destinations, acknowledgments, exception management, escalation deadlines, and immutable audit export.

### Integration adapters

Implement destination-specific adapters behind the channel-neutral envelope contract. Start with static AVS text, portal JSON, and print delivery. Treat EHR integration as a separate security and interoperability workstream.

### Synthetic reference package

Maintain a complete nonclinical synthetic package that exercises every lifecycle stage. Use it for CI, demonstrations, security testing, and procurement discussions without exposing proprietary clinical content.

### First private clinical module

Build the Blood Thinners module in the private authority only after evidence governance, clinical review roles, authoring conventions, correction ownership, and release policy are operational.

## Non-negotiable claims boundary

Until supported by an appropriate implementation and evaluation:

- Do not claim reduced readmissions.
- Do not claim fewer emergency visits.
- Do not claim improved adherence.
- Do not claim improved safety.
- Do not claim EHR integration is live.
- Do not claim HIPAA compliance solely because the current public workflow avoids PHI.
- Do not claim clinical approval based on automated checks.
- Do not claim accessibility conformance based only on automated testing.
- Do not claim a pilot is hospital deployed without an executed agreement and actual implementation.

The defensible current claim is narrower: CAF has built a governed engineering foundation that demonstrates how structured patient education can be versioned, reviewed, localized, compiled, cryptographically fingerprinted, authorized, distributed without CAF-side patient identifiers, measured in aggregate, corrected, suspended, and recalled.
