# Community Acquired Finance — Phase 2 Public Site Architecture

**Date:** August 3, 2026  
**Status:** Implementation candidate pending exact-head validation  
**Founder architecture:** Free decision preparation plus one paid decision-completion system  
**Commerce:** Disabled

## Public promise

Community Acquired Finance provides useful healthcare financial education, calculators, checklists, and guided tools without requiring payment. The first paid flagship is the Healthcare Worker Benefits Decision System, beginning with an Open Enrollment Workspace.

## What remains free

- Plain-English education and glossary content
- Official verification links and controlling-source reminders
- Enrollment, billing, coverage, and safety deadlines
- Public calculators, comparisons, checklists, and guided tools
- Patient, caregiver, Medicare, Medicaid, discharge, and medical-bill resources
- The existing workplace-benefits comparison workspace

## What the paid system adds

- Employer- and employee-specific structured entry
- Coordination across medical, prescriptions, HSA/HRA/FSA, retirement, disability, life, supplemental benefits, dependents, beneficiaries, and paycheck effects
- Scenario comparison and source-status controls
- Saved progress after later technical validation
- A verification list and printable Benefits Decision Brief

## Public information architecture

1. Start Here
2. Free Tools
3. Healthcare Workers
4. Patients & Caregivers
5. Decision System

The Explore layer continues to expose concrete free services, broader education hubs, and one flagship preview.

## Phase boundary

This release explains the product model and reorganizes the public experience. It does not collect a price-qualified commitment, enable checkout, grant paid access, change authentication, or modify the database. Those activities belong to later phases and remain governed by AND-102 and the premium launch gates.

## Routes and search

No canonical public route or sitemap entry is removed or added. The product preview route continues to redirect to the healthcare-worker hub during Phase 2. The free workplace-benefits comparison retains its current URL and indexability while its public name is clarified.

## Implementation surfaces

- Homepage
- Start Here
- Tools
- Healthcare Workers
- Free workplace-benefits comparison
- Header navigation data
- Footer
- Public SEO metadata
- Flagship product registry
- Architecture regression tests

## Release controls

- One visible paid flagship
- No multiple-product public catalog
- Checkout disabled
- No payment information collection
- No new sensitive analytics
- No route deletion
- No public-tool paywall
- Exact-head CI, browser, preview, and production validation required
