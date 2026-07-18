# CAF Patient Education Systems — Institutional Operations Completion

## Status and claims boundary

This document defines the public-safe structural contract for organization onboarding, entitlements, destination validation, reliable job execution, and final institutional dispatch authority.

It does **not** establish:

- A live hospital customer
- A signed production contract
- A validated EHR or patient-portal connection
- Clinical approval
- HIPAA compliance
- Accessibility conformance
- Production availability
- Improved patient outcomes

All examples and conformance fixtures are synthetic and prohibited from patient-care use.

---

## 1. Why content authority is not enough

A clinically governed and cryptographically valid package still cannot be delivered unless the receiving organization is authorized, active, entitled, technically ready, and reachable through a validated destination.

The institution-facing platform therefore has three separate decisions:

1. **Private content authority** — Is the exact candidate governed, reviewed, reproducible, signed, safe to distribute, and operationally healthy?
2. **Organization readiness** — Is the exact organization active, contracted, reviewed, entitled, and technically ready for the exact package, locale, adapter, and destination?
3. **Institutional dispatch authority** — May one exact idempotent delivery command execute against that destination during a short authorization window?

No earlier decision substitutes for a later one.

---

## 2. Organization lifecycle

### 2.1 States

```text
onboarding
  → active
      → suspended
      → offboarding
          → terminated
```

- **Onboarding:** No institutional delivery.
- **Active:** Delivery may proceed only if every exact-scope readiness check passes.
- **Suspended:** New distribution stops. Existing affected artifacts are assessed through distribution control.
- **Offboarding:** Distribution freezes, destinations are disabled, entitlements terminate, access is removed, and audit evidence is preserved.
- **Terminated:** No delivery or operational access. Non-destructible governance history remains retained.

### 2.2 Mandatory onboarding gates

The organization profile requires evidence-backed gates for:

- Contract
- Security review
- Privacy review
- Clinical-governance review
- Implementation readiness
- Support readiness
- Destination validation
- Data residency
- Incident contacts
- Recall contacts

A missing, failed, in-review, or expired required gate blocks delivery.

A gate marked not applicable requires explicit rationale. “Not applicable” cannot be an empty default.

### 2.3 Organization configuration

The organization profile binds:

- Stable organization key
- Protected identity reference
- Environment
- Data-residency regions
- Encryption context
- Contract reference and effective period
- Support, incident, and recall contacts
- Destinations
- Package entitlements
- Onboarding completion
- Suspension reason where applicable

All destinations and entitlements must match the organization profile scope.

---

## 3. Destination registry

Each destination has:

- Stable destination ID
- Organization and environment
- Adapter type
- Protected endpoint reference
- Authentication method
- External credential reference
- Status
- Allowed locales
- Payload-size limit
- Timeout
- Retry policy
- Circuit-breaker policy
- Validation time and expiration
- Last health status and check time

### 3.1 Prohibited destination behavior

- Production destination without authentication
- Inline credential material
- CAF-side patient or encounter binding
- CAF PHI capability
- Unbounded payload size
- Delivery to an unvalidated, degraded, unavailable, suspended, or retired destination
- Delivery after validation expiration
- Delivery in an unsupported locale or adapter type

Patient binding remains inside the healthcare organization runtime.

---

## 4. Package entitlement

An entitlement binds:

- Organization
- Package
- Minimum package version
- Optional maximum exclusive version
- Allowed locales
- Allowed adapter types
- Effective and expiration time
- Contract reference
- Product schedule
- Pilot-only or production scope

The evaluator requires an exact active entitlement at delivery time.

A pilot-only entitlement cannot authorize production delivery. A contract alone is not a package entitlement. An entitlement does not override content authority, destination readiness, or control notices.

---

## 5. Organization readiness decision

The readiness decision evaluates the exact:

- Organization
- Environment
- Package and version
- Locale
- Adapter
- Target status
- Destination
- Evaluation time

It returns **ready** only when:

1. Organization profile matches the request.
2. Organization is active.
3. Contract is effective.
4. Every mandatory gate is passed or legitimately not applicable.
5. Destination exists and matches organization/environment.
6. Destination is active and healthy.
7. Destination validation is current.
8. Locale and adapter are permitted.
9. Exact active entitlement exists.
10. Production request does not depend on a pilot-only entitlement.

A blocked readiness decision contains findings but no implied destination permission.

---

## 6. Idempotent job orchestration

Institutional delivery and governance operations run on at-least-once queues. The logical operation must nevertheless commit at most one result.

### 6.1 Job types

- Compile
- Quality analysis
- Evidence check
- Sign
- Authorize
- Deliver
- Process receipt
- Suspend distribution
- Recall distribution
- Notify organization
- Audit export
- Backup
- Restore test

### 6.2 Canonical command

A job command binds:

- Job and operation ID
- Job type
- Idempotency key
- Organization and environment
- Package/version and candidate hash where applicable
- Destination where applicable
- Ordering key
- Payload reference and SHA-256
- Creation, not-before, and expiration time
- Priority
- Maximum attempts
- Requesting principal
- Explicit absence of patient-level data and case narratives

The command receives a canonical SHA-256. Mutation after creation invalidates it.

### 6.3 Idempotency

The idempotency key derives from the logical operation scope:

- Job type
- Operation ID
- Organization
- Package/version
- Candidate SHA-256
- Destination
- Payload SHA-256

Duplicate commands with the same idempotency key and identical logical fingerprint collapse to one canonical job.

The same idempotency key with a different candidate, tenant, destination, or payload is a replay conflict and must not execute.

### 6.4 Leases and fencing

Workers receive:

- Lease ID
- Workload identity reference
- Acquisition time
- Heartbeat
- Expiration
- Monotonic fencing token

A stale worker cannot commit after a newer fencing token has been issued. Heartbeats outside the lease interval are invalid.

### 6.5 Attempts and results

Each attempt records:

- Attempt number
- Lease and fencing token
- Start and completion
- Fixed outcome
- Fixed error code
- Protected error-detail reference
- Result reference and SHA-256 on success
- Side-effect receipt reference where applicable
- Explicit absence of patient-level data

A logical job may contain only one successful attempt and one committed logical result.

### 6.6 Retry policy

The job policy defines:

- Retryable error codes
- Nonretryable error codes
- Exponential backoff
- Maximum backoff
- Deterministic jitter
- Lease duration
- Heartbeat interval
- Clock-skew allowance
- Replayable job types

Authorization, integrity, privacy, organization-scope, recalled-package, and revoked-signing-key failures are nonretryable.

### 6.7 Dead letter

A job enters dead letter when:

- Command integrity fails
- Failure is nonretryable
- Error code is not permitted for retry
- Maximum attempts are exhausted
- Configuration or schema is unsupported

Dead-letter records contain no patient data and require governed replay permissions. Replay creates a new job and never rewrites the original record.

---

## 7. Final institutional authority

The final institutional authority combines:

- Authorized private content authority
- Ready organization and exact entitlement
- Conformant compiler/authority baseline
- Valid canonical delivery job command
- No active suspension, recall, or retirement notice
- Active organization state
- Accepted claims boundary

### 7.1 Exact binding

All components must match:

- Package ID
- Package version
- Candidate SHA-256
- Organization
- Environment
- Target status
- Destination

A mismatch blocks dispatch.

### 7.2 Freshness

Maximum ages:

- Private authority: 60 minutes
- Organization readiness: 15 minutes
- Authority conformance: 24 hours
- Dispatch command verification: 15 minutes

Future-dated evidence also blocks.

### 7.3 Dispatch window

- Production dispatch window maximum: 15 minutes
- Preview pilot window maximum: 60 minutes
- Window starts at or after authority evaluation
- Window cannot outlive private authority

After expiration, a fresh institutional-authority decision is required.

### 7.4 Fail-closed output

Authorized output contains:

- Exact entitlement ID
- Job ID
- Command SHA-256
- Idempotency key
- Payload SHA-256
- Not-before and expiration

Blocked output contains no dispatch authorization and no entitlement assertion.

---

## 8. Control notices

An active control notice matching the exact package/version/organization blocks dispatch for:

- Suspended version
- Recalled version
- Retired version

Delivery workers must check institutional authority immediately before side effects. A previously issued dispatch authorization cannot defeat a newer control notice; the worker must use current control-plane state and fencing.

---

## 9. Offboarding

Offboarding actions include:

1. Freeze distribution.
2. Disable destinations.
3. Terminate entitlements.
4. Export permitted audit evidence.
5. Preserve governance history.
6. Remove organization access.
7. Destroy only configuration permitted by retention and legal-hold policy.
8. Confirm completion.

Completed offboarding requires every action to have:

- Completed status
- Completion time
- Evidence reference

Clinical governance history, release history, signatures, distributions, recalls, acknowledgments, incidents, legal holds, and destruction receipts remain governed by retention policy and cannot be silently deleted.

---

## 10. Authority-complete conformance

The authority-complete conformance baseline contains:

- 41 governed capabilities
- 41 synthetic success paths
- 41 synthetic adversarial paths
- 82 required passing scenarios

The added institutional scenarios verify:

- Inactive and unentitled organizations are blocked.
- Pilot-only entitlement cannot authorize production.
- Unhealthy or expired destination is blocked.
- Completed offboarding cannot omit an action or evidence.
- Duplicate queue delivery commits one logical result.
- Conflicting replay is detected.
- Tampered command is dead-lettered.
- Nonretryable authorization failure is not retried.
- Active recall notice blocks dispatch.
- Stale readiness and expired authority block dispatch.
- Nonconformant compiler baseline blocks dispatch.
- Blocked authority withholds dispatch authorization.

The public conformance index contains capability names and claims boundaries only. Executed fixtures and protected operational evidence belong in the private authority.

---

## 11. Production implementation requirements

The public contracts are not a running service. Production implementation still requires:

- Private repository
- Identity provider and workload identity
- Organization-scoped storage and encryption
- Managed secret store
- Managed signing/KMS
- Transactional workflow database
- Durable queue system
- Idempotency store
- Lease/fencing implementation
- Dead-letter queue and console
- Destination adapters
- Destination health monitoring
- Customer onboarding and offboarding console
- Contract and entitlement registry
- Incident and recall notification transport
- Immutable audit and backup storage
- Security review and penetration testing
- Clinical-governance staffing
- Support and operational runbooks

No live deployment claim is permitted until those services and controls have been implemented, tested, contracted, and operated successfully.
