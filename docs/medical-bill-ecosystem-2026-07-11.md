# Medical-Bill Search and Decision-Support Ecosystem — July 11, 2026

## Executive assessment

The medical-bill cluster already contained useful articles and two strong interactive assets, but the canonical toolkit page was too small to function as a search hub or decision-support entry point. The strongest compounding move was not another broad SEO audit or a batch of new articles. It was to make one canonical hub organize the existing explanations, tools, official sources, financial-assistance pathway, and follow-up workflow.

This release keeps `/insurance/medical-bill-review-toolkit` as the primary cluster hub, preserves the established medical-bill routes, and adds one local-only operational tool: the Medical Bill Call and Deadline Tracker.

Google Search Console performance and Page Indexing data were not available through the connected tools during this implementation. No impressions, clicks, ranking, indexing, or cannibalization claims are made without that evidence.

## Starting inventory and page roles

| Route | Role | Distinct intent |
|---|---|---|
| `/insurance/medical-bill-review-toolkit` | Primary cluster hub | Organize the complete review journey before treating the first balance as final. |
| `/tools/medical-bill-review-flow` | Guided decision tool | Identify the document, sender, match status, affordability concern, payment pressure, and first questions to ask. |
| `/tools/eob-to-bill-match-checker` | Document-comparison checklist | Compare a provider bill with an EOB or payer explanation. |
| `/tools/out-of-pocket-max-estimator` | Plan-year cost tool | Estimate remaining covered, in-network cost-sharing exposure. |
| `/tools/prior-authorization-next-step-guide` | Authorization decision tool | Organize next steps for a delayed, pending, or denied prior authorization. |
| `/articles/how-to-read-an-eob` | Foundational explainer | Explain the sections and amounts on an EOB. |
| `/articles/allowed-amount-medical-bills` | Specific term explainer | Explain allowed amount, negotiated rate, plan payment, and patient responsibility. |
| `/articles/why-one-hospital-visit-can-create-multiple-bills` | Specific problem explainer | Explain separate facility, physician, laboratory, imaging, anesthesia, pathology, and ambulance bills. |
| `/articles/facility-fee-vs-professional-fee` | Comparison explainer | Separate institutional and professional billing. |
| `/articles/observation-vs-inpatient-status` | Status and cost explainer | Explain why hospital status can affect coverage and cost, especially under Medicare. |
| `/articles/in-network-hospital-out-of-network-bills` | Network problem explainer | Explain out-of-network involvement at an in-network facility and point to current official protections. |
| `/articles/prior-authorization-explained` | Foundational explainer | Explain prior authorization and route live cases to the next-step guide. |
| `/articles/check-hospital-financial-assistance-before-paying` | Assistance explainer | Explain why and how to review a hospital's written financial-assistance policy before a long payment arrangement. |
| `/articles/deductible-copay-coinsurance-out-of-pocket-max` | Cost-sharing explainer | Define the plan terms that appear on claims, EOBs, and bills. |
| `/topics/patient-medical-costs` | Secondary topic hub | Provide broad terminology and related educational content. |
| `/patients-families` | Audience hub | Route patients and caregivers into medical-bill, Medicare, Medicaid, and insurance pathways. |
| `/insurance` | Subject hub | Connect medical bills with insurance processing, plan structure, authorizations, and cost exposure. |

## Final architecture

```text
Homepage medical-bill path
    ↓
Medical Bill Review Toolkit (primary hub)
    ├── What document did you receive?
    │   ├── Medical bill → Medical Bill Review Flow
    │   ├── EOB/MSN → EOB-to-Bill Match Checker
    │   ├── Denial → Prior Authorization Next-Step Guide
    │   ├── Collection notice → Call and Deadline Tracker
    │   └── Estimate → CMS medical-bill-rights information
    ├── Problem paths
    │   ├── Bill/EOB mismatch
    │   ├── Insurance not processed
    │   ├── Multiple bills
    │   ├── Facility fee
    │   ├── Network issue
    │   ├── Observation vs inpatient
    │   ├── Prior authorization
    │   └── Financial hardship
    ├── Tool paths
    │   ├── Medical Bill Review Flow
    │   ├── EOB-to-Bill Match Checker
    │   ├── Out-of-Pocket Max Estimator
    │   └── Prior Authorization Next-Step Guide
    ├── Hospital financial-assistance pathway
    ├── Medical Bill Call and Deadline Tracker
    └── Official verification resources
```

## New-resource decision

### Candidate scoring

| Candidate | Utility | Privacy risk | Legal/policy maintenance | Existing overlap | Decision |
|---|---:|---:|---:|---:|---|
| Medical Bill Call and Deadline Tracker | High | Low when locally stored and structured | Low | Low | **Selected** |
| Dispute and inquiry letter builder | High | Moderate | Moderate-to-high because wording can look like legal advice | Moderate | Deferred |
| Hospital financial-assistance screener | High | Moderate | High because hospital and state policies vary | Moderate | Deferred |
| Medical-bill document checklist | Medium | Low | Low | High; existing flow and checklists already cover it | Deferred |

The tracker was selected because it closes the final operational gap: users can already understand and evaluate a bill, but they lacked a private way to document contacts, requested documents, promised actions, written deadlines, and follow-up dates. It adds repeat utility without creating a new canonical route or transmitting medical information.

## Tracker privacy architecture

The tracker:

- stores entries only in browser local storage;
- does not require an account or database;
- does not upload bills, EOBs, denial notices, or collection letters;
- does not ask for patient names, dates of birth, diagnoses, procedures, provider names, insurer names, medical-record numbers, claim numbers, member IDs, account numbers, addresses, phone numbers, or email addresses;
- uses fixed categories for contact type, outcome, documents requested, promised action, and status;
- limits optional text to department/role, representative initials or ID, and a call reference;
- explicitly warns users not to enter claim, member, medical-record, or account numbers;
- offers copy, print/save, edit, delete, and clear-local-data controls;
- sends no typed values to analytics.

## Analytics taxonomy

Only consent-gated fixed identifiers are sent.

- `medical_bill_path_selected`
  - `item_id`
  - sanitized `destination_path`
- `medical_bill_tracker_created`
- `medical_bill_tracker_updated`
- `medical_bill_tracker_deleted`
- `medical_bill_tracker_exported`
  - fixed `export_type` of `copy` or `print`
- `medical_bill_tracker_cleared`
- `medical_bill_official_resource_clicked`
  - fixed resource ID
  - sanitized destination URL

No dollar amounts, dates, user-entered text, claim status detail, insurance type, medical information, provider name, hospital name, income, household size, or personal identifier is included.

## Current-source safeguards

- The No Surprises Act does not protect every unexpected bill. The hub points users to current CMS resources rather than making a universal legal conclusion.
- Tax-exempt hospital financial-assistance discussion is qualified to hospitals subject to Internal Revenue Code section 501(r); users are instructed to request the exact written policy and provider list.
- Appeal instructions are tied to written notices and current official sources.
- The CFPB's January 2025 medical-debt credit-reporting rule was vacated in July 2025. This release does not tell users that a blanket federal medical-debt reporting ban is currently in effect.
- State medical-debt, collection, insurance, and financial-assistance rules vary.

## Search-intent separation

The release preserves distinct roles:

- hubs organize;
- articles explain one problem;
- the review flow triages a situation;
- the EOB checker compares documents;
- the out-of-pocket estimator models plan-year exposure;
- the authorization tool handles authorization process questions;
- the tracker operationalizes follow-up;
- official sources verify current rules.

No route was renamed or removed. No new article was added because the evidence supported connecting and operationalizing the existing cluster before adding another search page.

## Remaining evidence gap

The next evidence-based optimization step is to join Google Search Console page/query data to the route inventory after enough post-release data exists. Priority should go to existing medical-bill pages ranking between positions 8 and 30 or receiving impressions without clicks. Do not consolidate pages or create additional articles solely from semantic similarity.
