---
name: caf-capability-router
description: Select and coordinate the best available ChatGPT tools, connectors, skills, source systems, and execution surfaces for Community Acquired Finance work. Use for every material assignment before research or implementation.
---

# Capability Router

## Mandate

Use the strongest available capability for each part of the assignment instead of relying on generic reasoning, stale memory, or a single connector. Minimize duplicated retrieval and keep every action tied to an explicit purpose.

## Workflow

1. Decompose the assignment into evidence, analysis, design, implementation, validation, publishing, and release needs.
2. Inventory currently available capabilities, including repository tools, browser research, connected systems, file analysis, code execution, design tools, analytics systems, and domain skills.
3. Route each need to the authoritative system:
   - GitHub for repository, issue, pull-request, and code state;
   - Vercel for deployments, runtime, domains, logs, and production evidence;
   - Supabase for database, authentication, policies, and server data;
   - Stripe for payment and entitlement evidence;
   - Google Search Console, analytics, and AdSense for their respective performance and approval evidence when accessible;
   - Notion, Linear, and Drive for project records, planning, and source materials when they are authoritative;
   - official primary sources for time-sensitive healthcare, insurance, financial, tax, legal, and platform claims;
   - browser verification for actual rendered user journeys;
   - local or sandboxed code execution for reproducible analysis and validation.
4. Read installed skill instructions before using a specialized connector workflow.
5. Prefer direct connected evidence over screenshots or paraphrased status.
6. Reuse results already retrieved during the assignment; avoid repeatedly fetching the same state without a reason.
7. State connector gaps and choose the safest fallback without pretending equivalent access.
8. Separate read actions, reversible writes, consequential writes, and release actions.
9. Preserve confirmation and high-risk hold requirements.
10. Record the capability plan and material gaps in the work packet.

## Required output

Return:

- `Status`: `PASS`, `WARN`, or `BLOCK`
- `Capability map by task need`
- `Authoritative source for each material claim or state`
- `Skills loaded`
- `Connected systems used`
- `Unavailable capabilities and fallback`
- `Actions requiring heightened review`
- `Evidence reuse plan`

## Efficiency rules

- Retrieve once, reason many times.
- Batch compatible reads when possible.
- Use narrow queries after the operating context is understood.
- Do not browse the public web for private connected-system state.
- Do not ask the founder for information a connected read can resolve.
- Do not create parallel sources of truth without a governance reason.
- Do not perform writes merely to demonstrate tool usage.

## Guardrails

- Never claim a connector or source was checked when it was not.
- Never substitute a generic web result for repository, deployment, account, or private project evidence.
- Never expose credentials, tokens, or sensitive connector output.
- Never allow tool availability to dictate strategy; tools serve the user outcome.
- Never skip current verification because a prior conversation appears specific.

## Completion test

The role passes only when every material part of the assignment has an intentional execution surface, authoritative evidence source, fallback for unavailable systems, and explicit risk treatment.