---
name: caf-information-architecture
description: Design and review Community Acquired Finance navigation, route structure, taxonomy, internal pathways, terminology, and content relationships. Use for site reviews, new products, new content, route changes, and journey redesigns.
---

# Information Architecture

## Mandate

Make the platform understandable as a system. Ensure users can identify where they are, choose the right audience or decision path, move between explanation and action, and avoid duplicated or contradictory destinations.

## Workflow

1. Inventory affected routes, hubs, tools, articles, products, printables, and application surfaces.
2. Identify the primary organizing principle for each area: audience, trigger event, decision, task, or topic.
3. Detect mixed taxonomies, duplicate intent, orphan routes, overloaded hubs, and labels that require insider knowledge.
4. Map entry points from search, navigation, direct links, email, and referrals.
5. Build the intended journey from orientation to explanation, calculation, decision, action, and follow-up.
6. Distinguish canonical content from supporting, printable, application, and campaign variants.
7. Define route ownership, naming, breadcrumb, metadata, and redirect requirements.
8. Inspect internal links for relevance, hierarchy, and premature exits to external sites.
9. Verify that healthcare workers, patients, and caregivers each feel intentionally represented without duplicating the entire platform.
10. Test proposed architecture against future product expansion, saved workspaces, premium systems, and institutional delivery.
11. Identify content or route consolidation opportunities before adding new inventory.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Affected inventory`
- `Primary organizing model`
- `User entry points`
- `Canonical journey`
- `Duplication, orphaning, and terminology findings`
- `Proposed route and navigation changes`
- `Redirect or canonical requirements`
- `Internal-link requirements`
- `Future extensibility concerns`

## Architecture rules

- Organize around user decisions and healthcare events where possible, not internal departments.
- Keep public education, interactive decision systems, account surfaces, and institutional products distinct but connected.
- Use one canonical destination for one dominant intent.
- Preserve stable URLs unless a clear consolidation and redirect plan creates greater value.
- Printables and campaign variants should not compete with canonical pages.
- Navigation labels must make sense without prior knowledge of the brand.
- Every high-intent page must offer a coherent next step inside the platform before an external handoff.

## Guardrails

- Do not create a new hub to solve a labeling problem.
- Do not duplicate pages solely to address different audience wording.
- Do not restructure broad routes without reviewing search, analytics, redirects, and downstream links.
- Do not let product terminology drift between marketing, application, documentation, and analytics.
- Do not hide unfinished or strategically important areas behind vague navigation.

## Completion test

The role passes only when each affected asset has a clear place, purpose, owner, canonical relationship, entry path, and next step—and when the change reduces rather than increases cognitive and maintenance complexity.
