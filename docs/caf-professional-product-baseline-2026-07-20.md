# Community Acquired Finance Professional Product Baseline — July 20, 2026

## Executive diagnosis

Community Acquired Finance already has substantial, source-backed education, mature calculators, a production Journey Integrity layer, privacy-minimized analytics, strong publication checks, and a credible RN-led Hospital & Patient Guide. The principal remaining weakness is not missing capability. It is **excessive simultaneous exposure of capability**.

The production site asks a first-time visitor to use a guided router, then repeats similar decisions through flagship cards, trust cards, directories, and additional browse actions. Several mature destination tools use different result visual hierarchies and legacy analytics names. The Hospital & Patient Guide contains useful depth, but too much of that depth is visible at once for a stressed patient or caregiver.

This sprint therefore treats CAF as one connected decision-support product. It consolidates entry points, preserves canonical destinations, formalizes semantic UI behavior, standardizes answer-first results, and moves optional depth behind explicit user choice.

## Current architecture

### Platform

- Vite, React, TypeScript, React Router, Tailwind, Radix/shadcn components.
- Vercel production deployment with canonical domain `communityacquiredfinance.com`.
- Consent-gated Google Analytics and Vercel Analytics/Speed Insights.
- Static prerendering, canonical metadata, JSON-LD, sitemap and robots generation.
- Publication, source freshness, institutional-boundary, AdSense, bundle-budget, browser, performance, and accessibility checks.

### Public product layers

1. **Community Acquired Finance** — overall educational platform.
2. **Decision Concierge** — fixed-choice site-wide router.
3. **Financial Navigator** — broad prioritized action-plan builder at `/start-here`.
4. **Benefits Command Center** — durable multi-step workplace-benefits workspace.
5. **Hospital & Patient Guide** — RN-led hospital-to-home and caregiver decision support.
6. **Medical Bill Response System** — canonical medical-bill document and action router.
7. Focused calculators, checklists, comparisons, guides, and educational libraries.

### Existing journey integrity

The July 20 Journey Integrity release already establishes one fixed goal, one canonical destination, one expected outcome, privacy-safe session context, and a continuity banner. This sprint extends that system. It does not create a competing router or persistence layer.

## Main coherence problems

### Entry-point duplication

- Homepage Concierge is followed by three flagship cards that repeat similar choices.
- Homepage global trust bar is followed by another four-card trust explanation.
- Tools page presents the Concierge, six curated tool cards, and then the complete directory.
- Multiple secondary browse actions receive nearly the same visual weight.

### Product naming drift

- Durable products and small utilities both use labels such as System, Flow, Toolkit, Blueprint, Router, Helper, Center, and Navigator.
- Some canonical products have multiple public names across pages, links, analytics, and documentation.
- Route names remain valuable for SEO and compatibility, but visible labels need a controlled vocabulary.

### Result-state inconsistency

- Existing result systems are generally useful but vary in order, density, color meaning, and action placement.
- Some result pages present four equally weighted cards rather than one direct answer followed by prioritized actions.
- Legacy analytics event names do not map cleanly to a shared cross-product journey funnel.

### Stress-surface density

- The Hospital & Patient Guide begins with specific clinical-topic choices rather than the user’s immediate operational problem.
- Full guide libraries, readiness systems, cost/coverage resources, trust markers, and disclaimers remain visible together.
- The clinically appropriate boundary statement is prominent, but it competes with the first practical action.

### Visual-semantic inconsistency

- Brand colors are established, but there is no formal token contract for primary action, trust, success, caution, danger, optional content, or disabled states.
- Amber and red are used locally rather than through reusable semantic primitives.
- Filled cards remain the default structure even when open layout, lists, or progressive disclosure would communicate hierarchy better.

## Implementation sequence

1. Consolidate public naming and canonical product ownership without destructive URL changes.
2. Add semantic design tokens and reusable semantic surface classes.
3. Normalize shared journey events and answer-first result hierarchy.
4. Simplify homepage and Tools into one dominant guided entry plus quiet browse access.
5. Reframe Hospital & Patient Guide around five immediate user modes and progressively disclose unrelated depth.
6. Refine founder/trust language and place limitations at the moment of relevance.
7. Add governance, acceptance tests, measurement records, and release certification.

## Critical invariants

The following must not break:

- The Decision Concierge remains the single site-wide guided router.
- `/start-here` remains owned by the Financial Navigator; the Foundation Checkup stays optional and deep-linkable.
- Existing high-value public URLs remain stable unless a permanent redirect is explicitly added and tested.
- The Hospital & Patient Guide remains educational and cannot provide individualized medical instructions.
- No names, diagnoses, policy numbers, claims, free text, document contents, medication details, or answer values enter analytics.
- Journey context stays fixed-choice and session-scoped.
- Explicitly saved non-sensitive action IDs may remain browser-local with visible clear controls.
- Sensitive guided workflows remain ad-free.
- General-public financial usefulness remains broad; healthcare-worker identity is a differentiator, not an exclusion boundary.
- Andrew Ciccarelli’s RN, BSN credentials and verified bedside, charge, and admissions-discharge-transfer experience must not be overstated.
- Canonicals, sitemap entries, structured data, metadata, redirects, and prerendered routes must remain aligned.
- Keyboard focus, reduced-motion behavior, responsive layout, and minimum practical touch targets must remain intact.
- A successful build is necessary but not sufficient; preview and production must be manually reviewed as connected human experiences.
