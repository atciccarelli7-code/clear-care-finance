# CAF Patient Education Systems — Branch Reconstruction and Merge Plan

**Status:** Architecture and delivery control document  
**Applies to:** Draft PR #190 and successors  
**Patient-care use:** Prohibited  
**Production promotion:** Prohibited until every tranche-specific gate and final integrated gate passes

## 1. Purpose

PR #190 is the accumulated architecture source for CAF Patient Education Systems. It is not an acceptable final merge unit because it contains more than one hundred changed files, overlaps with foundation work already merged through a separate lineage, and cannot be automatically reconciled with current `main`.

The platform must be reconstructed from current `main` as a sequence of bounded, dependency-ordered pull requests. Each pull request must be independently understandable, testable, reversible, and reviewable. The process must preserve the behavior proven in PR #190 without copying its branch ancestry or treating that draft as production-ready.

## 2. Non-negotiable rules

1. Every reconstruction branch starts from the then-current `main`.
2. No force merge, force push, or wholesale tree replacement is permitted.
3. No real patient information, hospital configuration, reviewer identity, credential, signing secret, contract, or proprietary clinical guide may enter the public repository.
4. Public fixtures remain synthetic, nonclinical, and prohibited from patient-care use.
5. A tranche may depend only on previously merged tranches.
6. Each tranche must include its own tests, documentation, claims boundary, and rollback path.
7. A green Vercel preview is not a substitute for unit, authority, type, privacy-boundary, and conformance validation.
8. Automated analysis cannot create clinical, accessibility, health-literacy, pharmacy, privacy, security, or release approval.
9. The canonical capability registry must reconcile every `patientEducation*.ts` module as authoritative or explicitly non-authority.
10. PR #190 remains draft and unmerged until reconstruction is complete and its residual diff is empty or intentionally closed as superseded.

## 3. Reconstruction sequence

### Tranche A — Public institutional product surface

**Scope**

- Public Patient Education Systems page
- Organization-page entry point
- Fixed-choice Pilot Builder
- Routing, SEO, structured data, sitemap, search, and prerender support
- Public capability descriptor and controlled-preview schemas
- Browser, mobile, clipboard, print-intent, URL, request-failure, console, and axe tests
- Institutional IP boundary scanner

**Exclusions**

- Clinical guide content
- Private authority logic
- Hospital configuration
- Release approvals

**Acceptance**

- Public site builds and prerenders
- No free-text or patient identifier collection
- Public proof files contain no restricted material
- Browser and accessibility journeys pass
- Existing public site behavior is unchanged outside the bounded routes

### Tranche B — Structured content and deterministic compilation core

**Scope**

- Content and package contracts
- Evidence dossier contract
- Asset and bundle compilers
- Distribution compiler
- Integrity and reproducibility manifests
- Synthetic engine fixtures

**Dependencies**

- Tranche A public schemas where required

**Acceptance**

- Deterministic outputs for identical inputs
- Exact document, asset, package, locale, target, MIME, byte-length, and SHA-256 binding
- Duplicate output paths rejected
- Tampering detected
- No release authorization or distribution claimed

### Tranche C — Quality, localization, organization overlay, and review workflow

**Scope**

- Quality contract and executable QA engine
- Localization package and structural parity
- Institution overlay contract and compiler
- Review workflow and reopen behavior
- Evidence freshness
- Change-risk classification
- Exception policy

**Dependencies**

- Tranche B canonical content and integrity objects

**Acceptance**

- Automated QA remains advisory where human judgment is required
- Machine-only localization cannot be approved
- Exact source-block hashes and version binding enforced
- Institution fields cannot change clinical structure or accept PHI-capable values
- Reopened content invalidates affected approvals
- Retracted or stale controlling evidence blocks release progression

### Tranche D — Release, authority, signing, and tenant isolation

**Scope**

- Release registry and state machine
- Release authorization
- Authority roles, principals, approvals, and separation of duties
- Authenticated actor/session contract
- Signing authority and key-use contract
- Organization isolation and resource-level tenant guard
- Governance profile
- Private and institutional authority decisions

**Dependencies**

- Tranches B and C

**Acceptance**

- Draft cannot jump directly to release
- Recalled versions cannot re-enter circulation
- Exact content hash, package, version, locale, organization, environment, role, permission, session, key purpose, and signature scope enforced
- Cross-organization access fails closed
- Human approval quorum and separation of duties enforced
- Blocked authorization withholds the distributable candidate

### Tranche E — Delivery, operations, continuity, and recall

**Scope**

- Governed two-phase delivery pipeline
- Channel-neutral adapter envelopes and receipts
- Distribution registry and control notices
- Suspension, recall, revocation, acknowledgment, and exception handling
- Job orchestration and idempotency
- Operational observability
- Incident response
- Resilience, retention, backup, recovery, and destruction
- Audit export and redaction
- Organization onboarding, entitlement, suspension, and offboarding lifecycle

**Dependencies**

- Tranche D authority decision

**Acceptance**

- No adapter receives a candidate without exact authorization
- Patient and encounter binding remains inside the healthcare organization runtime
- Original delivery history is preserved through later revocation
- Duplicate commands produce one logical result; conflicting replay is blocked
- Patient-level telemetry is prohibited from CAF aggregate observability
- Incident severity can freeze distribution
- Backup and recovery failures freeze release
- Audit exports are organization-scoped and appropriately redacted

### Tranche F — Canonical registry, conformance, and certification

**Scope**

- Canonical 44-capability authority registry
- Explicit non-authority module registry
- 88-path synthetic authority conformance package
- Foundation, authority, registry, public-contract, manifest, and boundary validators
- Dedicated TypeScript authority configuration
- GitHub Actions authority and type-certification workflows
- Certification metadata and source digests

**Dependencies**

- Tranches A through E

**Acceptance**

- Every `src/lib/patientEducation*.ts` module is authoritative or explicitly excluded
- Every authoritative capability has an implementation, required exports, primary adversarial test, and conformance paths
- Authority manifest, executable conformance test, and registry counts match
- All 44 positive and 44 adversarial paths pass
- Exact-head typecheck, full unit suite, production build, browser suite, privacy boundary, and authority gates pass
- Certification artifact identifies the exact commit and SHA-256 digests of controlling registry files

## 4. Final integrated certification

After Tranche F merges, create a final integration branch from current `main` and run:

```text
npm ci
npm run patient-education:verify
npx vitest run src/test/patientEducation*.test.ts --reporter=verbose
npm run build
npm run test:browser
```

Required additional evidence:

- GitHub Actions authority certification succeeds on the exact integration commit
- Type certification succeeds on the exact integration commit
- Vercel preview succeeds or a documented equivalent build environment produces the same output
- No unresolved review threads
- No unregistered patient-education modules
- No restricted content in public paths
- No production secrets or organization records
- PR #190 is compared against integrated `main`; every intentional capability is accounted for

## 5. Rollback model

Each tranche must be independently revertible. A rollback may remove the tranche and any later dependent tranches, but it must not rewrite release, distribution, correction, suspension, recall, audit, or certification history.

Where a merged tranche introduces an unsafe behavior:

1. Freeze dependent release work.
2. Classify the change risk.
3. Identify dependency blast radius.
4. Revert the affected tranche or issue a corrective tranche.
5. Re-run all downstream gates.
6. Record the incident and corrective evidence.

## 6. Private operational boundary

Successful public reconstruction establishes an engineering foundation only. The following remain private-runtime requirements:

- Authenticated identity provider and role administration
- Organization-isolated persistent storage
- Managed key service and signing operations
- Immutable audit retention
- Backup storage and restoration operations
- Notification and escalation transport
- Protected reviewer console
- Client destination registry
- Security monitoring and incident operations
- Contractual, privacy, clinical, accessibility, and implementation governance

No hospital pilot or production delivery is authorized merely because the public reconstruction passes.

## 7. Completion definition

Structural reconstruction is complete only when:

- Tranches A through F are merged in order from current `main`;
- final integrated certification passes on one exact commit;
- PR #190 has no unaccounted intentional changes and is closed as superseded, not merged;
- the private operational backlog is explicitly separated from the public engineering foundation; and
- all claims remain within the documented development-stage boundary.
