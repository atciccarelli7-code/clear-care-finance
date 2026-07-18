# CAF Patient Education Systems — Tranche B Integrity and Privacy Reconstruction

**Branch:** `agent/caf-pe-tranche-b-integrity-privacy`  
**Base:** current `main` at reconstruction start  
**Source architecture:** draft PR #190  
**Patient-care use:** prohibited

## Purpose

This branch reconstructs only the Tranche B controls that are absent from `main`. It does not duplicate the content, package, evidence, asset-compilation, bundle-compilation, or distribution capabilities already integrated through the earlier foundation merge.

## Already integrated and preserved by exact blob SHA

- Structured content contract
- Package contract
- Evidence dossier contract
- Deterministic asset compiler
- Deterministic release-bundle compiler
- Distribution compiler
- Their six primary unit and adversarial test files

The Tranche B validator recomputes the Git blob SHA for each integrated file and fails if the branch modifies one of those controlling foundations.

## Reconstructed in this branch

### Integrity manifest

- Per-artifact SHA-256
- UTF-8 byte length
- Exact asset, document, version, target, MIME, and path metadata
- Sorted unique artifact paths
- Canonical bundle SHA-256
- Verification of content, metadata, count, path, and byte-length integrity
- Duplicate-path rejection before manifest generation

### Reproducibility manifest

- Exact source repository, commit, and branch or tag
- Clean-source-tree requirement
- Runtime and operating-system metadata
- Dependency-lock digest and package-manager version
- Compiler name, version, and code digest
- Schema versions
- Canonically sorted source-object provenance
- Ordered build commands
- Environment-variable names without inline values
- Output integrity-manifest and bundle digest binding
- Canonical manifest SHA-256 and tamper detection

### Institution overlay contract

- Exact organization, package, version, locale, effective date, and expiration scope
- Fixed non-PHI field categories
- Source ownership and per-field approval provenance
- Duplicate-field rejection
- Effective/expiration validation
- Draft, review, approved, suspended, and retired states

### Privacy boundary

- Separate CAF-source, controlled-preview, and institutional-delivery contexts
- Detection of obvious SSN, date-of-birth, medical-record, patient-name, and member/account patterns
- CAF source may define PHI-capable fields but cannot populate them
- Controlled previews cannot retain PHI-capable or unsanitized restricted content
- Institution overlay values are scanned independently
- Public organizational contact information is flagged for confirmation rather than automatically treated as patient information

## Tests

The branch adds exact-source tests for:

- deterministic artifact and bundle hashes;
- UTF-8 byte length;
- unchanged-bundle verification;
- content tampering;
- duplicate output paths;
- canonical reproducibility output;
- insertion-order independence;
- source-provenance tampering;
- duplicate source objects;
- approved non-PHI overlays;
- duplicate overlay fields;
- invalid overlay dates;
- populated PHI-capable source fields;
- patient identifiers in narrative content;
- unsanitized controlled previews;
- approved organization overlays; and
- patient identifiers inside overlay values.

## Required checks

```text
node scripts/check-patient-education-tranche-b.mjs
npx vitest run src/test/patientEducationIntegrityManifest.test.ts src/test/patientEducationReproducibilityManifest.test.ts src/test/patientEducationInstitutionOverlay.test.ts src/test/patientEducationPrivacyBoundary.test.ts
npm run build
```

## Review boundaries

Reviewers should confirm:

1. No already-integrated capability was modified.
2. Every reconstructed file remains exact to the PR #190 source blob.
3. Integrity and reproducibility hashes are canonical and deterministic.
4. Privacy scanning fails closed for obvious populated identifiers.
5. Institution overlays remain non-PHI and cannot change clinical structure.
6. Browser code does not import the Node-only reproducibility module.
7. No later release, authority, signing, delivery, or operational capability entered this branch.

## Claims boundary

This tranche adds public-safe software controls only.

The privacy scanner is defense in depth. It is not comprehensive DLP, legal advice, a HIPAA determination, or a substitute for organization security controls.

This branch contains no complete clinical guide, real evidence dossier, patient data, hospital configuration, reviewer identity, credential, private signing material, contract, customer record, or production approval.

A green Tranche B check does not establish clinical approval, accessibility conformance, hospital deployment, pilot authorization, production readiness, or patient outcomes.

## Rollback

This branch can be reverted by removing its four implementation files, four test files, manifest, validator, documentation, and workflow. Reverting it must not rewrite any release, distribution, audit, correction, suspension, or recall history because those later capabilities are outside this tranche.
