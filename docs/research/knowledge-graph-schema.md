# CAF Knowledge Graph Schema

## Core entities

- `Topic`
- `GlossaryTerm`
- `Program`
- `Regulation`
- `AnnualThreshold`
- `Occupation`
- `Workflow`
- `WorkflowStep`
- `Calculator`
- `DecisionRule`
- `Article`
- `SourceDocument`
- `Citation`
- `Audience`
- `UserDecision`

## Minimum shared fields

Every factual or logic-bearing entity should support:

- Stable ID
- Display name
- Plain-language summary
- Audience
- Jurisdiction
- Effective date
- Expiration or superseded date
- Last reviewed date
- Review cadence
- Confidence classification
- Source references
- Related entities
- Affected CAF assets

## Confidence classifications

- `verified_primary`
- `verified_secondary`
- `frontline_evidence`
- `inference`
- `hypothesis`
- `superseded`

## Core relationships

- A regulation defines or constrains programs, terms, thresholds, and decision rules.
- A source document supports citations and factual claims.
- A calculator uses decision rules and annual thresholds.
- An article explains topics, terms, programs, workflows, occupations, and calculators.
- A workflow contains workflow steps performed by occupations.
- A user decision connects audiences to relevant programs, calculators, articles, and workflows.
- Any source or annual value change should identify all affected public assets.

## Initial implementation recommendation

Begin with version-controlled JSON or TypeScript registries in the existing repository. Do not introduce a graph database until the relationship volume, query requirements, and maintenance burden justify it.

Suggested future directories:

```text
src/data/research/
  sources/
  annual-values/
  glossary/
  programs/
  occupations/
  workflows/
  decision-rules/
  relationships/
```

## Publication gate

No research record should power a public fact, calculator, or personalized recommendation until it includes authoritative support, effective dates, assumptions, exceptions, and a maintenance owner or cadence.
