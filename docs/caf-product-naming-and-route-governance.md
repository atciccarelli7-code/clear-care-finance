# CAF Product Naming and Route Governance

**Owner:** Community Acquired Finance product system  
**Effective:** July 20, 2026  
**Review cadence:** Quarterly and before any new flagship launch

## Public product hierarchy

### Platform

- **Community Acquired Finance (CAF)** — the overall educational platform.

### Approved flagship products

A flagship name is reserved for a durable, multi-step experience with a distinct result, repeat-use value, and clear canonical ownership.

| Public name | Job owned | Canonical route | Naming status |
|---|---|---|---|
| **Decision Concierge** | Route one fixed question to the single CAF experience responsible for the result | Homepage and Tools embedded entry | Approved; router only, never described as the final answer |
| **Financial Navigator** | Build and save a prioritized general financial action plan | `/start-here` | Approved |
| **Benefits Command Center** | Review, compare, and save a complete workplace-benefits package | `/tools/benefits-command-center` | Approved |
| **Hospital & Patient Guide** | Organize hospital-to-home, caregiver, medication/equipment, discharge-barrier, and coverage questions | `/patients-families/hospital-guide` | Approved |
| **Medical Bill Response System** | Identify the document, explain the review path, and produce the next actions | `/insurance/medical-bill-review-toolkit` | Approved public name; existing route retained |

## Product-family labels

These are descriptive families, not additional branded products:

- **Financial planning tools** — calculators, comparisons, checklists, and assessments.
- **Workplace benefits tools** — job, pay, plan, and benefit decision support.
- **Healthcare decision guides** — hospital, medical-bill, Medicare, Medicaid, discharge, patient, and caregiver support.
- **Education library** — articles, topic guides, quick guides, and glossary.

## Standard labels for focused experiences

Use the narrowest accurate noun:

- **Calculator** — computes an estimate from user-entered numbers.
- **Checklist** — helps verify a finite set of items.
- **Comparison** — places fixed dimensions side by side.
- **Guide** — explains a question and directs the next action.
- **Worksheet** — produces a structured set of user-controlled notes or choices.
- **Assessment** — evaluates fixed-choice conditions and returns an educational result.

## Deprecated public naming patterns

Existing URLs may retain legacy slugs for search continuity, but new visible labels should not introduce or amplify the following unless the experience qualifies as a flagship:

- System
- Flow
- Toolkit
- Blueprint
- Pathfinder
- Router
- Helper
- Center
- Command Center
- Navigator

### Consolidation decisions

| Legacy or competing label | Public treatment |
|---|---|
| Medical Bill Review Toolkit | Present as **Medical Bill Response System**; retain `/insurance/medical-bill-review-toolkit` |
| Medical Bill Review Flow | Present as **Medical Bill Review Guide** or a step inside the Medical Bill Response System; retain route |
| Healthcare Worker Benefits Blueprint | Present as **Healthcare Worker Benefits Guide**; retain route |
| Debt vs Retirement Router | Present as **Debt vs Retirement Guide** in navigation and supporting copy; route may remain |
| Roth vs Traditional Decision Helper | Present as **Roth vs Traditional Assessment**; route may remain |
| Medicare Advantage Plan Helper | Present as **Medicare Advantage Plan Guide**; route may remain |

A legacy label may remain in historical documentation, analytics migration notes, or code identifiers when changing it would create unnecessary migration risk. Public copy should use the approved label.

## Canonical ownership rules

1. Every major decision has one canonical destination.
2. Routers identify the destination; they do not claim to deliver the destination’s result.
3. Hubs orient and browse; they do not duplicate a flagship workflow.
4. Articles explain; they do not become alternate versions of a calculator, checklist, or guided result.
5. A focused tool may hand off to one next canonical action after its result, with other resources clearly optional.
6. A route may serve only one public product name at a time.
7. A new branded name requires all of the following:
   - durable multi-step behavior;
   - a distinct answer or saved artifact;
   - repeat-use or major strategic value;
   - a named canonical route owner;
   - analytics and acceptance criteria;
   - governance documentation;
   - evidence that a descriptive label would be insufficient.

## Route and redirect rules

- Preserve indexed and high-value URLs whenever practical.
- Prefer changing visible labels and metadata over destructive path changes.
- A renamed path requires a permanent redirect, canonical update, sitemap update, internal-link update, structured-data update, and regression test.
- Query parameters may select a safe display mode but may not carry sensitive answers or become canonical URLs.
- Hash anchors must remain stable when used by saved progress, direct links, or browser tests.
- Organization-facing development routes must state their current release boundary and must not compete with consumer navigation.

## Navigation rules

- Primary navigation uses audience-neutral jobs and established product destinations.
- The homepage exposes one dominant guided start and one quiet browse alternative.
- Tools exposes two explicit modes: **Help me choose** and **Browse all tools**.
- Footer labels may be descriptive, but must not introduce new product names.
- Mobile navigation prioritizes the most common start, tool, benefits, and Medicare paths without implying those are the only CAF audiences.

## Naming acceptance checklist

Before release, verify:

- the same public name appears in page title, heading, breadcrumb, internal links, metadata, and structured data;
- the route has one canonical owner;
- no old label remains on a competing entry point;
- the name does not overstate authority, personalization, or outcome certainty;
- the label remains understandable to a stressed user without knowledge of CAF architecture;
- the experience is described by the result it provides, not by internal implementation language.
