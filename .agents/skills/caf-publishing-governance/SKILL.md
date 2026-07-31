---
name: caf-publishing-governance
description: Govern Community Acquired Finance editorial production, review status, source metadata, content lifecycle, route publication, updates, corrections, disclosures, and documentation. Use for every new or changed public resource and major product release.
---

# Publishing and Governance

## Mandate

Turn work into a maintainable public asset with explicit ownership, review status, source provenance, update expectations, and correction pathways. Publication is a governed state, not the absence of a draft flag.

## Workflow

1. Identify every public and internal artifact affected: route, article, tool, dataset, printable, email, product page, app module, documentation, or generated manifest.
2. Confirm the canonical source of truth and responsible owner for each artifact.
3. Verify status fields, author or reviewer attribution, source metadata, publication date, last-reviewed date, and next-review trigger.
4. Ensure draft, preview, noindex, indexable, ad-eligible, monetized, premium, and retired states are distinct and correctly represented.
5. Review titles, descriptions, labels, disclosures, citations, related links, and correction contact information.
6. Check that generated registries, sitemaps, manifests, structured data, and route inventories reflect the intended state.
7. Define freshness rules for time-sensitive claims and automatic or manual checks.
8. Document editorial, calculation, design, engineering, legal, and monetization approvals required for the asset type.
9. Establish correction, update, deprecation, redirect, and archival procedures.
10. Update decision records and operational documentation so future agents understand why the asset exists and how it should evolve.
11. Verify production publication directly after release.

## Required output

Return:

- `Status`: `PASS`, `WARN`, `BLOCK`, or `NOT IMPLICATED`
- `Artifact inventory`
- `Canonical source and owner`
- `Publication states`
- `Required review metadata`
- `Freshness and update plan`
- `Disclosure and correction requirements`
- `Generated registry implications`
- `Deprecation or rollback plan`
- `Documentation updated`

## Governance rules

- Public availability, indexability, ad eligibility, monetization, and editorial approval are separate decisions.
- A route cannot claim review or freshness that has not occurred.
- Time-sensitive content requires an explicit applicable period and review trigger.
- Material corrections should be traceable.
- Retired routes require a purposeful redirect, archival, or removal decision.
- Documentation must describe actual current behavior, not intended future state.

## Guardrails

- Do not publish merely to remove a placeholder or increase page count.
- Do not leave duplicate public and downloadable versions without a canonical plan.
- Do not use a recent build date as proof that underlying content is current.
- Do not make monetized content ad-eligible or affiliate-enabled without the required editorial and disclosure review.
- Do not delete historical decision context that future maintainers need.
- Do not report production publication until the live route is directly verified.

## Completion test

The role passes only when every affected artifact has a correct state, owner, source of truth, review metadata, freshness plan, correction pathway, and documented lifecycle—and production accurately reflects those decisions.
