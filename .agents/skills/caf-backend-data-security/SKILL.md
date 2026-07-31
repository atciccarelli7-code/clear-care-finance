---
name: caf-backend-data-security
description: Design and review Community Acquired Finance APIs, Supabase schemas, authentication, authorization, persistence, payments, webhooks, server validation, and security boundaries. Use whenever server code, accounts, saved data, entitlements, or sensitive flows are implicated.
---

# Backend, Data, and Security

## Mandate

Build default-deny server systems that collect the minimum necessary data, enforce authorization independently of the client, preserve auditability, and fail safely when configuration is incomplete.

## Workflow

1. Identify data entities, actors, trust boundaries, and privileged operations.
2. Classify data by sensitivity, persistence need, retention, and user expectation.
3. Minimize collection; prefer local or ephemeral computation when persistence creates no clear user value.
4. Define schemas, invariants, ownership, indexes, migration behavior, and deletion requirements.
5. Enforce authentication and authorization on the server and in database policies.
6. Validate all inputs and outputs at trust boundaries with shared schemas where practical.
7. Design idempotency, replay protection, signature validation, and event reconciliation for webhooks and payments.
8. Keep secrets server-side and document required environment configuration without exposing values.
9. Handle partial configuration, stale sessions, retries, concurrency, and external-service failures.
10. Add tests for unauthorized access, cross-user access, malformed input, duplicate events, and failure states.
11. Define observability that excludes sensitive payloads.
12. Document rollback, migration recovery, and incident implications.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Actors and trust boundaries`
- `Data inventory and sensitivity`
- `Schema and invariants`
- `Authentication and authorization design`
- `Validation and failure behavior`
- `Security abuse cases`
- `Tests and evidence`
- `Migration and rollback plan`

## Security rules

- Client state is never proof of entitlement or ownership.
- Database Row Level Security must enforce user boundaries where Supabase data is exposed.
- Payment success must be established through verified server events, not redirect parameters.
- Premium and account features must fail closed when environment configuration is incomplete.
- Logs must not contain credentials, full health details, financial account data, or unnecessary personal information.
- Destructive operations require explicit ownership checks and safe failure behavior.

## Guardrails

- Do not add accounts merely to increase engagement.
- Do not persist calculator inputs unless saved work creates clear user value and consent is apparent.
- Do not place service-role credentials in the browser.
- Do not bypass RLS for convenience without a documented server-only boundary.
- Do not assume an external service retry is harmless.
- Do not deploy migrations without a rollback or recovery plan.

## Completion test

The role passes only when data collection is justified and minimized, server and database authorization are explicit, failure and abuse cases are tested, secrets remain protected, and consequential changes have a reversible migration and incident path.
