# CAF Patient Education Systems — Private Authority Blueprint

## Document status

**Classification:** Public-safe architecture blueprint  
**Implementation status:** Engineering contracts exist in the public repository; the protected runtime described here does not yet exist.  
**Patient-care status:** Not approved for patient care.  
**Claims boundary:** This blueprint does not establish clinical approval, HIPAA compliance, accessibility conformance, hospital deployment, EHR integration, or patient outcomes.

The public repository demonstrates the governed object model and fail-closed decision logic. Proprietary clinical content, real evidence dossiers, reviewer identities, hospital configuration, credentials, signing keys, customer records, and any patient-specific data belong only in a separately protected private authority.

---

## 1. Purpose

The private authority is the system of record that determines whether an exact patient-education candidate may be piloted, released, delivered, corrected, suspended, or recalled.

It must answer, with immutable evidence:

1. What exact content and evidence produced this candidate?
2. Which schema, compiler, dependency lock, and source commit were used?
3. Which human reviewers approved the exact candidate hash?
4. Were required disciplines independent and properly authorized?
5. Which organization, locale, environment, and delivery channel are in scope?
6. Did privacy, quality, localization, accessibility, integrity, and release gates pass?
7. Which trusted keys signed the release?
8. Which destinations received it?
9. Can every affected distribution be suspended or recalled?
10. Can the release be reproduced and independently audited?
11. Can the authority recover within its RPO and RTO without crossing organization boundaries?

The authority must fail closed. A missing record is not an implicit approval. A stale approval is not a current approval. A repository hash is not a production signature. A successful build is not a clinical review. A syntactically valid payload is not authorized for distribution.

---

## 2. Trust boundaries

### 2.1 Public website and public repository

Permitted:

- Institutional product positioning
- Public-safe schemas
- Synthetic fixtures
- Controlled-preview examples
- Technical capability index
- Public claims boundaries
- Nonclinical conformance descriptions

Prohibited:

- Complete proprietary clinical guides
- Restricted evidence maps or licensed source text
- Reviewer names, credentials, signatures, or private identity references
- Hospital contacts, policies, formularies, destinations, or customizations
- Patient, encounter, diagnosis, medication-order, claim, or medical-record data
- Credentials, tokens, secrets, private signing keys, or production endpoints
- Customer contracts, pricing, procurement responses, or protected support records

### 2.2 Private global authority

Stores and governs:

- Canonical package and document source
- Claim-level evidence dossiers
- Structured review workflows
- Qualified reviewer identity references
- Global policy profiles
- Compiler and schema versions
- Release records and integrity manifests
- Signing metadata and verification evidence
- Global incident, resilience, and audit records

It must not inherit access to organization-confidential records merely because an identity is globally privileged. Global and organization scopes remain separate.

### 2.3 Organization authority partition

Stores and governs:

- Approved organization overlay fields
- Delivery destinations
- Organization-specific localization decisions
- Distribution and acknowledgment records
- Aggregate pilot analytics
- Organization-specific incidents and support evidence

The organization partition must be isolated by identity, storage key, encryption context, audit scope, and runtime authorization.

### 2.4 Healthcare organization runtime

The healthcare organization remains responsible for:

- Patient assignment
- Patient-specific orders and values
- Patient and encounter identity
- EHR or patient-portal authorization
- Local emergency pathways
- Local policy and workflow execution
- Clinical use decisions

CAF-side delivery envelopes contain no patient or encounter identifier. Future EHR patient binding occurs only inside the organization’s approved runtime.

---

## 3. Logical architecture

### 3.1 Control plane

The control plane contains:

- Identity and role authority
- Organization isolation policy enforcement
- Governance profile registry
- Review workflow service
- Evidence freshness monitor
- Exception service
- Release state machine
- Composite private-authority decision service
- Signing verification service
- Incident command service
- Retention and legal-hold service
- Audit export service

### 3.2 Content plane

The content plane contains:

- Canonical structured content
- Evidence claims and source metadata
- Localization packages
- Institution overlays
- Compiled channel artifacts
- Reproducibility manifests
- Integrity manifests
- Synthetic conformance fixtures

### 3.3 Delivery plane

The delivery plane contains:

- Authorized delivery envelopes
- Destination registry
- AVS adapter
- Patient-portal adapter
- Accessible print adapter
- Content-management adapter
- Future EHR DocumentReference adapter
- Fixed-code delivery receipts
- Distribution registry
- Suspension and recall propagation

### 3.4 Observability plane

The observability plane contains only fixed-code, aggregate, non-patient telemetry:

- Compilation outcomes
- Integrity verification outcomes
- Authorization outcomes
- Delivery acceptance and rejection counts
- Evidence-monitor timeliness
- Access-control decisions
- Recall acknowledgment timeliness
- Backup and restore verification
- Migration outcomes

It prohibits patient-level dimensions, free-text case narratives, identifiers, diagnoses, medications, exact patient timestamps, and unbounded error messages.

---

## 4. Identity and authority model

### 4.1 Principals

Supported principal types:

- Authenticated human reviewer
- Workload-identity-bound service account

Every principal has:

- Stable internal principal ID
- Protected external identity reference
- Organization scope
- Role assignments
- Status
- Authentication time
- Credential expiration
- MFA state for humans
- Workload identity reference for services

### 4.2 Authority roles

Roles grant narrowly defined scopes such as:

- Evidence review
- Clinical review
- Pharmacy review
- Health-literacy review
- Accessibility review
- Privacy review
- Localization review
- Institution-overlay approval
- Release authorization
- Distribution authorization
- Correction authorization
- Recall authorization
- Exception approval
- Audit export

### 4.3 Separation of duties

The policy engine must support:

- Author cannot approve own work where prohibited
- Clinical reviewer cannot be final release authority for the same candidate where independence is required
- Exception requester cannot provide all exception approvals
- Incident commander cannot provide every high-severity closure approval
- One signing key cannot satisfy a multi-key quorum twice
- Service accounts cannot provide human judgment approvals

### 4.4 Exact binding

Approvals bind to:

- Package ID
- Package version
- Candidate SHA-256
- Organization
- Scope
- Role
- Principal
- Decision
- Rationale
- Approval and expiration time
- Evidence references

Any content-hash change invalidates the approval.

---

## 5. Organization isolation

Organization isolation must be enforced in multiple layers:

1. Identity organization claim
2. Authorization policy
3. Resource organization key
4. Encryption context
5. Storage partition
6. Queue or topic partition
7. Audit partition
8. Delivery destination ownership
9. Backup and restore verification

A CAF-global identity does not automatically receive organization-confidential access. Cross-organization support access, if ever allowed, requires a separate break-glass policy, explicit organization scope, strong authentication, time limitation, reason, recording, and post-access review.

Production resources cannot be accessed from test or preview runtimes. Production credentials cannot be shared with nonproduction environments.

Governance history cannot be deleted. Corrections append new records and preserve original history.

---

## 6. Governance profile

Every private-authority decision references one signed governance profile.

The profile binds:

- Environment
- Package risk tier
- Organization
- Optional exact package version
- Effective and expiration time
- Authority policy
- Organization-isolation policy
- Evidence-freshness policy
- Quality thresholds
- Exception policy
- Signing policy
- Schema-migration policy
- Operational SLO policy
- Incident-response policy
- Resilience and retention policy
- Audit-export policy
- Localization policy
- Release-state policy
- Distribution-control policy

Each policy reference includes its own ID, semantic version, SHA-256, source reference, status, applicability, effective period, and signature references.

The profile is canonicalized, hashed, and signed. Policy drift, missing policies, inactive policies, scope mismatch, expired policies, or missing production signatures block authority.

---

## 7. Evidence monitoring

The evidence monitor evaluates governance snapshots even after a source becomes invalid. This is intentionally separate from release-valid dossier parsing.

It detects:

- Overdue dossier review
- Upcoming review deadlines
- Stale source verification
- Retracted source
- Unavailable controlling source
- Expired claim approval
- Upcoming claim expiration
- Open update triggers
- Missed response windows

Actions include:

- Verify source
- Reopen review
- Replace source
- Suspend package
- Initiate recall assessment
- Document a reviewed no-change decision

A retracted controlling source supporting a critical claim must not merely display a warning. It must create a recall-assessment requirement.

---

## 8. Review operations

A review workflow is a directed acyclic graph of version-bound tasks.

Each task defines:

- Discipline
- Permitted roles
- Approval quorum
- Distinct-principal requirement
- Dependencies
- Due date
- Source-object references
- Evidence references
- Structured findings
- Approval records

Typical order:

1. Evidence review
2. Nursing and clinical-specialty review
3. Pharmacy review where applicable
4. Health-literacy review
5. Accessibility review
6. Privacy and security review
7. Localization language and clinical-equivalence review
8. Institution implementation review
9. Patient testing
10. Release-authority review

A task cannot begin or complete before required dependencies. Approved tasks cannot retain unresolved blocking findings. Rejections and change requests remain immutable; remediation requires a new approval record.

Content, evidence, localization, overlay, QA, incident, approval-expiration, or policy changes create reopen events. Reopened tasks clear prior approvals for the affected candidate.

---

## 9. Exception policy

Exceptions are not a hidden bypass.

An exception must be:

- Bound to exact package, version, candidate hash, organization, control, and target status
- Time limited
- Risk assessed
- Supported by compensating controls
- Independently approved by authenticated humans
- Expired automatically
- Revocable
- Visible in audit history

Non-waivable controls include at minimum:

- Clinical-safety review
- Human localization review
- Privacy boundary
- Organization isolation
- Output integrity
- Candidate hash binding
- Recall execution

Production release cannot depend on an exception. Critical-risk exceptions are prohibited.

---

## 10. Reproducibility and software supply chain

Every candidate has a reproducibility manifest containing:

- Private source repository reference
- Exact commit SHA
- Branch or release tag
- Clean-source-tree requirement
- Runtime and operating system
- Lockfile path and SHA-256
- Package manager and version
- Compiler name, semantic version, and code SHA-256
- Schema versions
- Canonical source-object hashes and classifications
- Ordered build commands
- Environment-variable names only
- Explicit prohibition of inline secrets
- Output integrity-manifest ID
- Output bundle SHA-256

The same canonical inputs must produce the same manifest digest. Source-object order, schema-map insertion order, or environment-variable insertion order cannot change the digest.

A candidate built from an uncommitted or dirty source tree cannot receive private authority.

---

## 11. Signing authority

Production signatures are detached and produced outside application memory by a managed key authority.

Key metadata includes:

- Key ID
- Algorithm
- Public-key reference
- Organization scope
- Environment
- Permitted signature scopes
- Status
- Validity period
- Rotation successor
- Revocation reason

Private keys are never serialized into authority records.

Signature envelopes bind:

- Payload SHA-256
- Signature scope
- Organization
- Environment
- Signer principal and role
- Signing time
- Detached signature
- Trusted timestamp
- Certificate-chain references
- External cryptographic-verification status

Production policy may require multiple distinct trusted keys. A revoked, expired, wrong-organization, wrong-environment, wrong-scope, unverified, future-dated, or untimestamped production signature blocks release.

---

## 12. Composite private authority

The final authority decision requires all of the following for the exact candidate:

- Active signed governance profile
- Current evidence
- Approved review workflow
- Authenticated human authority with quorum and separation of duties
- Allowed organization-isolation decision
- Authorized release gates
- Valid reproducibility manifest from a clean source tree
- Trusted release-bundle signatures
- Passed institutional-delivery privacy boundary
- Healthy resilience state
- Healthy production operational state
- No relevant active incident
- No production exception dependency
- Accepted claims boundary

The decision is time limited. Release authorization and adjacent runtime checks must be recent. If blocked, the response excludes the distributable candidate hash, principal evidence, and signing evidence from the distributable surface.

---

## 13. Dependency and blast-radius graph

The private authority maintains a directed acyclic dependency graph linking:

- Source → claim
- Claim → content block
- Block → document
- Document → asset
- Asset → package
- Document → localization
- Document → institution overlay
- Document → quality report
- Document → compiled artifact
- Artifact → integrity manifest
- Integrity manifest → release record
- Release record → authorization
- Authorization → delivery envelope
- Delivery envelope → distribution record

Any change is traversed downstream to identify:

- Affected artifacts
- Affected organizations
- Affected locales
- Highest risk tier
- Reviews to reopen
- QA to rerun
- Localizations and overlays to reapprove
- Artifacts and integrity manifests to regenerate
- Authorizations to revoke
- Distributions requiring suspension or recall assessment
- Organizations requiring notification

---

## 14. Schema migration

Stored governance records cannot be migrated informally.

A migration plan includes:

- Object type and ID
- Organization scope
- Input schema and SHA-256
- Target schema
- Ordered migration steps
- Step implementation references and code hashes
- Approval provenance
- Test fixtures
- Backup reference
- Dry-run requirement
- Rollback-test reference

High-risk governance records require reversible migrations. Migrations preserve:

- Stable identifiers
- Organization scope
- Data classification
- Audit history

Known data loss blocks execution unless a separate, independently approved archival strategy exists. Execution produces an exact migration receipt with input and output hashes, step sequence, executor, backup, dry-run evidence, and verification result.

---

## 15. Operational observability

Only fixed-code events and aggregate counts are permitted.

Prohibited telemetry includes:

- Patient name
- MRN
- DOB
- Encounter ID
- Member or claim number
- Diagnosis
- Medication or prescription
- Address, phone, or email
- Case narrative
- Free-text notes or error messages

SLOs cover:

- Compile success
- Integrity verification
- Authorization
- Delivery acceptance
- Evidence-monitor timeliness
- Recall acknowledgment
- Restore testing

A critical SLO breach opens an incident. Low sample size produces “insufficient data,” not a fabricated pass or failure.

---

## 16. Incident response

Incident types include:

- Clinical-content safety
- Evidence retraction
- Integrity failure
- Signing-key compromise
- Unauthorized access
- Cross-organization exposure
- Incorrect distribution
- Localization defect
- Accessibility defect
- Delivery failure
- Recall-execution failure
- Backup or restore failure
- Availability failure

Incident records include:

- Detection and declaration time
- Severity
- Commander
- Clinical, privacy, and security leads where required
- Affected package, organization, locale, artifact, distribution, key, source, and claim references
- Distribution-freeze time
- Containment and recovery time
- Mandatory actions with owners and deadlines
- Timeline and evidence references
- Root cause
- Corrective actions
- Independent closure approvals
- Monitoring period

High-risk incidents require immediate distribution freeze. Closure is blocked until actions, monitoring, root cause, corrective actions, and required independent approvals are complete.

---

## 17. Resilience, retention, and legal hold

### 17.1 Backup requirements

- Multiple encrypted copies
- Multiple geographic regions
- At least one immutable copy
- Manifest integrity verification
- Defined maximum backup age
- RPO and RTO targets
- Isolated restore tests
- Application and organization-isolation verification

### 17.2 Retention

Every record class has:

- Minimum retention
- Optional maximum retention
- Immutability requirement
- Legal-hold eligibility
- Destruction permission
- Required destruction approvers

Release records, review approvals, signature envelopes, distribution records, control notices, acknowledgments, incidents, and destruction receipts are non-destructible governance history.

### 17.3 Destruction

Permitted destruction requires:

- Retention satisfied
- No active legal hold
- Exact object inventory hash
- Distinct required approvals
- Controlled destruction method
- Executor identity
- Verification evidence
- Immutable destruction receipt

---

## 18. Audit export

Audit exports are audience specific:

- Internal governance
- Clinical governance
- Security review
- Procurement
- Organization customer
- External auditor

Policies govern allowed record types, classifications, organization scope, and redaction.

External exports exclude:

- Patient data
- Credentials and secrets
- Private keys
- Personal reviewer identity
- Unlicensed source text
- Cross-organization records
- Protected source locations where disclosure is not authorized

Exports retain source object references and SHA-256 evidence where permitted, apply deterministic redaction, and receive an export digest. The export states its claims boundary explicitly.

---

## 19. Synthetic conformance

The conformance package covers every governed capability with:

- At least one passed success scenario
- At least one passed adversarial scenario
- Synthetic fixtures only
- Expected decision
- Expected finding codes
- Execution evidence
- Patient-care prohibition

Critical scenario classes include:

- Tamper detection
- Cross-organization block
- Expired or stale authority block
- Separation-of-duties block
- Privacy block
- Incident escalation
- Suspension and recall
- Restore failure
- Migration failure
- Policy drift
- Composite bundle withholding

Public proof contains only the capability index and claims boundary. The executed fixture bundle belongs in the private authority.

---

## 20. Recommended production deployment topology

### 20.1 Accounts and environments

Use independent cloud accounts or equivalent hard boundaries for:

- Development
- Test
- Preview
- Production
- Security logging and immutable audit
- Backup and recovery

### 20.2 Services

Minimum protected services:

1. Identity provider and role service
2. Policy and governance-profile registry
3. Private source repository
4. Object and version store
5. Review workflow service
6. Evidence-monitor worker
7. Compiler worker pool
8. Integrity and reproducibility service
9. Managed signing/KMS integration
10. Release-authority service
11. Organization destination registry
12. Delivery worker pool
13. Distribution and recall service
14. Aggregate observability pipeline
15. Incident and support service
16. Backup, legal hold, and audit-export service

### 20.3 Queue design

Use separate queues or topics for:

- Compilation
- QA
- Evidence refresh
- Signing
- Delivery by organization
- Receipt processing
- Suspension and recall
- Notifications
- Audit export

Messages contain stable object references and hashes, not patient data.

### 20.4 Storage

Use stores optimized for:

- Immutable object versions
- Transactional workflow state
- Append-only audit events
- Artifact object storage
- Organization-scoped configuration
- Aggregate telemetry
- Legal hold

Encryption keys and access policies must reflect organization and environment boundaries.

---

## 21. Production exit criteria

No live hospital pilot until all of the following are complete:

### Security and identity

- Private repository established
- Strong authentication and MFA
- Workload identity
- Least-privilege RBAC
- Organization isolation tested
- Secret management
- Managed signing keys
- Key rotation and revocation drill
- Vulnerability and dependency scanning
- Security incident runbook

### Clinical governance

- Qualified reviewer roster
- Protected credential verification
- Review role matrix
- Evidence policy calibrated
- Quality thresholds calibrated
- Clinical safety incident process
- Correction and recall drill
- Real module approved through every required discipline

### Accessibility and language

- Human accessibility review
- Assistive-technology validation
- Accessible PDF validation
- Qualified translation workflow
- Independent clinical-equivalence review
- Localized usability review

### Reliability

- SLOs defined
- Production monitoring
- RPO/RTO accepted
- Multiple encrypted backups
- Isolated restore test passed
- Disaster-recovery exercise passed
- Destination retry and dead-letter behavior tested

### Legal and customer operations

- Contracts and data responsibilities defined
- Privacy and security review complete
- Support model defined
- Incident notification obligations defined
- Retention and legal-hold policy approved
- Organization onboarding and offboarding tested
- Audit export reviewed

### Integration

- Real target system identified
- Authentication and conformance tested
- Payload and length constraints validated
- Patient binding remains organization-side
- Rollback and disable controls tested
- Monitoring and support ownership accepted

### Evidence and evaluation

- Pilot protocol defined
- Aggregate metrics defined
- Minimum cell sizes enforced
- No causal claims without adequate study design
- Correction process for pilot data defined

Until these exit criteria are satisfied, the product may be described only as a governed engineering foundation and controlled synthetic demonstration.

---

## 22. Non-negotiable invariants

1. Public repository contains no proprietary clinical corpus.
2. CAF-side runtime receives no patient identifiers in the initial architecture.
3. Automated systems do not create human clinical approval.
4. Every approval binds to the exact content hash.
5. Cross-organization access is denied by default.
6. Production release cannot depend on an exception.
7. Clinical safety, privacy, organization isolation, integrity, and recall execution are non-waivable.
8. Repository hashes do not substitute for managed production signatures.
9. Blocked authority does not return a distributable candidate.
10. Governance history is appended, not rewritten or deleted.
11. Source retraction and safety triggers create operational action.
12. Recall must propagate to every affected distribution record.
13. Patient-level telemetry and free-text case narratives are prohibited.
14. Backups are not trusted until restore and organization isolation are verified.
15. Synthetic conformance artifacts are prohibited from patient-care use.
16. No public statement may imply clinical approval, hospital deployment, compliance certification, or improved outcomes without independent evidence.
