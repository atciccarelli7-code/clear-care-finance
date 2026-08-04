# Guided Benefits Decision System Product Doctrine

Date: 2026-08-04  
Status: Founder-confirmed product direction  
Product: Healthcare Worker Benefits Decision System

## Core promise

A purchaser should arrive with the same practical preparation expected by other successful guided financial software:

1. Bring the current documents that apply to the decision.
2. Know the basic facts of the personal situation.
3. Follow one understandable question at a time.
4. Confirm consequential facts before they affect a recommendation.
5. Leave with a reviewable, source-backed decision record.

Community Acquired Finance carries the complexity. The user should not need to understand benefits terminology, identify every relevant formula, build a spreadsheet, or know which plan provisions interact before beginning.

The product promise is:

> Bring the documents. Know your situation. CAF guides the rest.

This is an interaction and service principle. It does not authorize imitation of another company’s branding, copy, layout, animations, proprietary workflow, or trade dress.

## What the purchaser brings

### Current controlling materials

- the benefits guide or employee benefits summary for the correct plan year and employee population;
- medical-plan payroll rates and each relevant Summary of Benefits and Coverage;
- HSA or HRA employer-funding and surcharge information;
- retirement match, non-elective contribution, eligibility, waiting-period, and vesting materials;
- leave, disability, life, tuition, loan-repayment, and other consequential benefit summaries;
- formulary and provider-directory resources when prescriptions or network access must be verified;
- a second offer or spouse/partner plan when the decision requires a comparison.

### Personal situation

- who needs coverage and whether another employer plan is available;
- a general low-, expected-, or higher-use healthcare pattern;
- whether specific prescriptions, clinicians, facilities, or services require verification;
- cash-flow and risk tolerance;
- the priorities that matter most;
- the expected employment horizon;
- the decision deadline.

The public preparation experience must not collect diagnoses, detailed medical history, claims, EOBs, insurance member IDs, account credentials, Social Security numbers, financial account numbers, or other unnecessary identifiers.

## What CAF provides

### Guided interview

The system asks plain-language questions and progressively reveals only the branches that can change the decision. A user reviewing one employer should not be forced through job-offer comparison questions. A user without dependents should not be forced through family-only branches.

### Source control

Every consequential fact should retain:

- source title;
- plan year;
- applicable employee population;
- page or section;
- original language;
- extraction or entry method;
- confidence;
- confirmation status;
- last-reviewed date.

Public employer materials are references only under the current source-governance policy. They may not silently prefill paid guidance unless source-use rights, applicability, extraction, and fact-level review have passed the required gates.

### Confirmation before calculation

Premiums, deductibles, out-of-pocket limits, account contributions, retirement formulas, vesting, eligibility, surcharges, and deadlines must not influence a recommendation while their applicability is unresolved.

The system should distinguish:

- confirmed facts;
- user-entered facts;
- estimates;
- missing information;
- conflicting language;
- unsupported assumptions.

### Relevant scenarios

The system should calculate and explain only scenarios supported by the available facts, including as applicable:

- low, expected, and high healthcare use;
- payroll premium plus cost-sharing exposure;
- employer HSA or HRA funding;
- employee-only versus family coverage;
- one employer plan versus another household plan;
- employer retirement value and forfeiture risk;
- compensation and schedule tradeoffs;
- short versus longer employment horizons.

Unknown or unsupported plan structures fail into verification rather than false precision.

### Review and decision brief

The purchaser leaves with a printable and saved Benefits Decision Brief containing:

1. the decision being considered;
2. the option that appears strongest under the confirmed assumptions, when the evidence supports that conclusion;
3. the reasons and tradeoffs;
4. scenario results;
5. confirmed facts and source references;
6. estimates and assumptions;
7. unresolved questions and who should answer them;
8. enrollment actions and deadlines;
9. the user-selected final decision;
10. controlling-document and educational-scope language.

The system must not reduce the decision to a hidden score or imply that one option is universally best.

## Paid versus free boundary

Free CAF resources remain useful on their own:

- definitions and education;
- public source links;
- single-purpose calculators;
- open-enrollment preparation;
- the manual Benefits Command Center;
- bounded checklists and action plans.

The paid value is not access to basic information. The paid value is coordinated completion:

- one guided workflow;
- source organization and status;
- saved progress;
- context-aware branching;
- scenario coordination;
- verification workflow;
- deadline and election review;
- final source-backed decision brief.

## Secure-upload release gate

The product doctrine assumes a future secure document workflow, but this decision does not activate file upload, storage, or extraction.

Private document handling requires a separately certified architecture covering at minimum:

- authentication and entitlement enforcement;
- encryption in transit and at rest;
- private object-storage access controls;
- strict file type and size limits;
- malware and content scanning;
- document ownership and authorization attestation;
- minimal metadata collection;
- extraction isolation;
- page-level source citations;
- retention period and automatic deletion;
- user-initiated deletion;
- logs that exclude document content and sensitive values;
- incident response and breach procedures;
- vendor and subprocessors review;
- privacy-policy and terms updates;
- qualified legal/privacy review;
- destructive rollback and recovery testing.

Until those controls pass, the public product must state that private upload remains unavailable. Manual entry and external official-source links remain the safe fallback.

## Interaction principles

- One primary question or decision per screen.
- Explain why a consequential question matters at the moment it is asked.
- Import or extract before asking the user to retype, once secure import is available.
- Require confirmation of material extracted facts.
- Preserve visible progress and a clear remaining-work list.
- Let users mark information unknown without blocking useful progress.
- Convert unknowns into professional verification questions.
- Keep calculations transparent and reproducible.
- Never use affiliate economics to rank a plan or recommendation.
- Never introduce a surprise payment or upgrade wall after substantial work.
- Keep official documents controlling and make correction paths obvious.

## Phased implementation

### Phase A — Product doctrine and public orientation

- establish the reusable guided-journey contract;
- align the healthcare-worker flagship and free Benefits Command Center;
- publish the document checklist, personal-situation checklist, five-stage journey, and security boundary;
- add contract tests.

### Phase B — Paid preflight and workspace orchestration

- replace the generic workspace-creation screen with decision type, document readiness, personal situation, and deadline intake;
- persist only bounded categorical readiness data before document upload exists;
- branch the eight-module workflow based on the selected decision;
- preserve progress, verification, and brief generation.

### Phase C — Secure private document pipeline

- implement and certify private upload, scanning, storage, extraction, source citation, retention, and deletion;
- keep all extracted facts unconfirmed until reviewed by the user;
- test incorrect employee population, stale plan year, conflicting documents, and incomplete extraction.

### Phase D — Paid launch certification

- complete authentication, entitlement, Stripe test-mode, refund/revocation, support, privacy, accessibility, mobile, performance, source-integrity, and end-to-end purchase-to-brief validation;
- keep production checkout disabled until every launch gate passes.

## Success measures

The product should be evaluated on useful completion rather than superficial engagement:

- purchaser reaches a completed decision brief;
- material facts are confirmed or visibly unresolved;
- unsupported recommendations remain zero;
- users can identify why the result changed;
- users can identify the controlling source for consequential facts;
- users can resume, correct, print, and delete their work;
- privacy and source-boundary defects remain zero;
- refunds, abandonment, support burden, and user-reported confusion are measured after launch.

## Revisit triggers

Reassess this doctrine if:

- user research shows the document-first model creates avoidable barriers;
- purchasers cannot distinguish preparation from secure upload;
- the workflow becomes longer without improving decision confidence or completion;
- source confirmation materially increases abandonment without preventing errors;
- a privacy, legal, calculation, or source-applicability defect is discovered;
- pricing or demand evidence shows the paid boundary is not understood;
- the architecture cannot support other CAF decision systems without product-specific duplication.
