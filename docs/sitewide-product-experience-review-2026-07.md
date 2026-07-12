# Sitewide Product Experience Review — July 2026

## Purpose

This review treats Community Acquired Finance as a connected decision platform rather than a collection of pages. The standard is simple: a visitor should understand where to start, use the correct tool, recover from mistakes, preserve progress privately, and know what to do next.

The review is based on the July 2026 production architecture plus the open Benefits Command Center activation release. Search Console performance data was not available through the connected development tools, so no ranking, click, impression, or cannibalization claims are made here.

## Product inventory

### Entry and routing layers

- `/` — broad-audience homepage and problem-based starting paths
- `/start-here` — Financial Navigator, My Plan, and Financial Foundation Checkup
- `/tools` — interactive tool directory
- subject hubs — money and retirement, benefits and insurance, Medicare and Medicaid, healthcare workers, patients and caregivers
- article and topic pages — search-facing educational entry points

### Persistent local products

- My Plan — fixed action IDs, completion status, browser-local persistence
- Financial Foundation Checkup — up to eight browser-local snapshots
- Benefits Command Center — up to three browser-local benefits packages

### Deep decision products

- Benefits Command Center
- Healthcare Worker Total Compensation Comparison
- Medical Bill Review Toolkit and Call/Deadline Tracker
- EOB-to-Bill Match Checker
- Prior Authorization Next-Step Guide
- Benefits Blueprint
- Employer Benefits Action Plan
- Medicare and Medicaid Eligibility Check
- 403(b), health-plan, retirement, emergency-fund, savings, loan, and hospital-cost tools

## Route-purpose model

The public route architecture should continue to follow these roles:

- **Homepage:** orient a visitor who does not know where to begin.
- **Start Here:** diagnose the decision and preserve next actions.
- **Tools:** help a visitor locate a specific interactive calculation or workflow.
- **Topic hub:** organize one subject area without duplicating every article.
- **Article:** answer one search question and route to one logical next action.
- **Calculator:** calculate one defined result with visible assumptions.
- **Decision workflow:** identify the situation and route to the correct action.
- **Command Center:** combine multiple related calculations and verification steps into a reusable workspace.

## Required journey review

### General financial direction

Homepage → Start Here → Financial Navigator → My Plan → recommended tool.

Primary risk found: returning visitors had no immediate sitewide indication that local work already existed. The user had to remember which product stored the work.

Implemented resolution: a browser-local “Continue where you left off” summary now appears only when valid saved progress exists on the homepage, Start Here, or Tools. It exposes counts and completion summaries only; it never displays entered balances, compensation, medical information, or package labels.

### Financial baseline

Start Here → Financial Foundation Checkup → My Plan → repeat later.

Existing strengths:

- transparent five-domain scoring;
- local history;
- explicit methodology;
- direct conversion of gaps into My Plan.

Continuity improvement: saved history is now surfaced through the safe return summary without showing score, cash runway, savings, or expense values outside the Checkup.

### Workplace benefits

Homepage or Healthcare Workers → Benefits Command Center → Benefits Receipt → comparison → My Plan.

Existing strengths:

- local package storage;
- scenario-based healthcare costs;
- retirement matching and vesting;
- hidden benefits;
- no universal winner.

Activation dependency: PR #141 adds fictional sample packages, a sample comparison, and an accessible tour. This refinement branch begins from that PR head so it does not duplicate or conflict with the activation architecture.

### Medical bill

Search or patient hub → Medical Bill Review Toolkit → specialized tool → tracker → next step.

Existing strengths:

- document- and problem-based pathways;
- local tracker;
- financial-assistance and official-source guidance;
- no uploaded medical documents.

No route restructuring was justified in this pass.

## User-use-case matrix findings

### First-time visitors

- The homepage and subject navigation provide distinct starting paths.
- Product pages need meaningful first-view explanations and specific CTAs; recent flagship releases already provide these.
- The saved-progress summary remains absent when no valid local product state exists, preventing first-time clutter.

### Users with incomplete information

- Existing flagship products generally permit broad estimates and identify verification questions.
- Future tool-level reviews should continue replacing hard blocks with qualified incomplete results when safe.

### Returning visitors

Prior gap:

- My Plan, Checkup history, and benefits packages existed independently, but no safe cross-product return surface connected them.

Implemented:

- one local continuity reader;
- one shared return component;
- no new dashboard route;
- no new storage schema;
- no cloud or account implication;
- session-only dismissal;
- event-driven refresh when any participating local product changes.

### Mobile and keyboard users

Prior mobile-menu gaps:

- opening the menu did not move focus into it;
- Escape did not close and restore focus;
- the background page could continue scrolling;
- secondary destinations lacked visible active-state styling;
- the menu button and logo lacked complete focus-ring treatment.

Implemented:

- focus moves to the first navigation link;
- Escape closes the menu and returns focus to the trigger;
- body scrolling is locked only while the menu is open;
- focus and overflow state are restored during cleanup;
- active styling now applies to secondary routes;
- safe-area padding is included;
- focus-visible rings are consistent.

## Privacy contract

The continuity layer may expose only:

- product name;
- number of saved actions, checkups, or packages;
- action completion count;
- last-updated date;
- fixed destination route.

It must never expose:

- account balances;
- savings or expense values;
- foundation score or runway;
- employer or package label;
- compensation;
- premium or deductible;
- medical-bill data;
- user-entered free text;
- complete action contents in analytics.

Analytics remain consent-gated and categorical. New events answer only whether a visitor saw, dismissed, or used the saved-progress return surface.

## Accessibility and interaction safeguards added

- returning-user summary has a labelled section and explicit dismiss control;
- all resume destinations have descriptive link purpose;
- icons are decorative to assistive technology;
- mobile menu Escape and focus behavior are deterministic;
- active secondary navigation uses `aria-current` through `NavLink`;
- local-state parsing reuses existing validated loaders;
- malformed storage produces no broken return prompt.

## Performance architecture

The return component is lazy-loaded only on `/`, `/start-here`, and `/tools`.

This prevents the Benefits Command Center and Navigator rule libraries from being pulled into unrelated routes through the shared layout entry. The component is rendered only when a selected route is active and valid local state exists.

## Implemented files

- `src/lib/productContinuity.ts`
- `src/components/shared/ContinueWhereYouLeftOff.tsx`
- `src/components/layout/Layout.tsx`
- `src/components/layout/Header.tsx`
- `src/test/productContinuity.test.ts`
- `src/test/ContinueWhereYouLeftOff.test.tsx`
- `src/test/Header.test.tsx`

## Durable regression coverage

The tests enforce:

- no summary for first-time visitors;
- safe resume links for saved local work;
- no compensation, package label, cash, expense, or savings values in summaries;
- malformed local state is ignored;
- dismissal does not delete saved work;
- mobile-menu focus enters correctly;
- Escape closes the menu and restores focus;
- background scroll state is restored;
- secondary mobile navigation exposes the active route.

## Deferred findings

These require separate evidence or a focused product release:

1. **Tool-by-tool input audit.** The site has many calculators; field-level copy and validation should be changed only after testing the actual workflow and existing methodology.
2. **Automated graphical browser matrix.** Required when the browser automation environment is available. CI and component semantics do not replace a visual 320px-to-desktop pass.
3. **Cross-device continuity.** Deliberately deferred because it would require accounts, synchronization, and a new privacy model.
4. **Document uploads and extraction.** Deliberately excluded from the Benefits Command Center until a separate security architecture exists.
5. **Search performance conclusions.** Require actual Search Console query and page data.
6. **Navigation reorganization.** No evidence currently justifies another global navigation redesign.

## Measurement recommendations

Review after a stable observation period:

- saved-progress summary view rate;
- resume click rate by product ID;
- session dismissal rate;
- downstream completion after resuming;
- mobile-menu open and route-selection behavior using existing safe navigation events;
- whether resumed users complete more My Plan actions or repeat a Checkup.

Do not infer product value from pageviews alone. The key outcome is whether users return to unfinished work and complete a real decision.

## Current product state

Community Acquired Finance now has:

- search-facing education;
- specialized calculators;
- connected decision workflows;
- a deterministic Financial Navigator;
- a shared local My Plan;
- repeatable local financial checkups;
- a deep workplace-benefits workspace;
- medical-bill decision support;
- safe returning-user continuity.

The architecture is increasingly platform-like without requiring accounts, bank connections, medical uploads, or invasive analytics.

## Recommended next compounding step

After PR #141 and this refinement receive exact-head previews and production verification, conduct one evidence-based tool-completion review using real consented funnel events and direct manual testing. Select the single workflow with the largest verified abandonment or misunderstanding point and improve that workflow only.

Do not begin another full-site redesign before those signals exist.
