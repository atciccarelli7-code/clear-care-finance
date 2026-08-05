# Commercial-v1 benefits source and data-minimization doctrine

**Status:** Founder-directed product doctrine  
**Date:** August 4, 2026  
**Product:** Healthcare Worker Benefits Decision System

## Decision

The first commercial release of the Healthcare Worker Benefits Decision System will not accept, upload, or retain user benefits documents.

CAF may help a user review general benefits language inside the browser, but the source must remain on the user’s device. CAF may save only user-confirmed structured values, broad preferences, assumptions, and verification tasks required to complete the benefits decision.

The product’s paid value is coordination, continuity, protected workspace persistence, and completion—not document custody or official plan interpretation.

A warning or attestation is a prevention control. It does not transfer all privacy, security, or legal responsibility to the user and is not a substitute for data minimization.

## Commercial-v1 source workflow

The protected source assistant may:

1. accept text pasted from a general benefits guide or a local plain-text excerpt;
2. read a selected `.txt` source only within the browser;
3. screen the filename and text locally for likely personal, medical, election, credential, or financial information;
4. extract a bounded list of potential plan values locally;
5. clear the raw text after analysis;
6. require the user to inspect, edit, select, and confirm every value;
7. save only the confirmed structured values and source category to the authenticated workspace;
8. convert uncertainty into a verification task rather than an invented answer.

The source assistant must not transmit or retain:

- document bytes;
- filenames;
- raw source text;
- page images;
- source excerpts;
- unconfirmed extracted values;
- sensitive finding contents.

## Intended source material

Users may consult general documents that describe benefit choices, including:

- benefits guides and enrollment booklets;
- summaries of benefits and coverage;
- medical plan summaries;
- retirement match and vesting summaries;
- leave, disability, life, and protection-benefit summaries;
- pharmacy and provider-network reference materials;
- a spouse or household member’s general plan summary when authorized.

The documents remain outside CAF. The user supplies only the relevant general language or confirmed values.

## Prohibited information

CAF must not ask for or intentionally retain:

- completed or current benefit elections;
- enrollment confirmations or confirmation numbers;
- beneficiary designations;
- names, personal email addresses, phone numbers, street addresses, or dates of birth;
- Social Security numbers;
- employee, member, subscriber, policy, group, claim, EOB, or medical-record identifiers;
- diagnoses, claims, EOBs, medical records, medication histories, or individualized clinical information;
- pay statements or individualized compensation records;
- employer, insurer, or benefits-portal credentials;
- bank, routing, account, or payment-card information;
- confidential documents the user is not authorized to use.

A user confirmation cannot override these boundaries.

## Saved workspace contract

The authenticated workspace may retain only information necessary to organize the decision, such as:

- enrollment event and deadline;
- household coverage tier;
- broad expected-use and risk preferences;
- user-confirmed premiums, deductibles, out-of-pocket limits, employer account funding, retirement match, and vesting facts;
- cadence and pay-period count needed to annualize confirmed amounts;
- selected benefit elections expressed as planning choices;
- assumptions;
- unresolved verification questions;
- completion state and printable decision brief.

Raw source material must never enter workspace state, analytics, URLs, logs, email, support tools, or the printed decision brief.

## Supported browser-local extraction

The first deterministic adapter may propose candidates for:

- employee premium;
- deductible;
- out-of-pocket maximum;
- employer HSA or HRA contribution;
- retirement match percentage;
- retirement vesting years.

Every candidate requires user confirmation. A per-pay-period premium requires a confirmed pay-period count before annualization. Vesting duration remains a source fact and creates a verification task when the calculation requires a currently vested percentage.

The assistant does not establish official eligibility, coverage, network participation, formulary status, claim liability, plan interpretation, or enrollment results.

## Payment and account boundary

The commercial architecture may include:

- Supabase authentication;
- owner-scoped cloud workspaces;
- active or test product entitlements;
- Stripe-hosted Checkout;
- webhook-driven entitlement grant and revocation;
- a one-time $29 price.

Live payment and public paid access are separate release decisions. Until separately authorized, checkout must remain disabled and the public page may collect only a no-charge, price-qualified early-access commitment.

CAF stores Stripe references required for entitlement processing, not payment-card data.

## Employer portal boundary

CAF may generate a submission checklist and guide the user through a manual handoff. CAF must not collect portal passwords or submit real elections without an approved delegated authorization mechanism, employer-approved integration, comprehensive partial-failure handling, and separate legal and security review.

Official enrollment occurs in the employer or plan-administrator portal. The user must review the official confirmation and retain proof.

## Eligibility and coverage boundary

CAF may organize source-derived facts and identify verification questions. Outputs must remain framed as planning calculations, user-confirmed source facts, likely conditions, or unresolved tasks.

Only the employer, plan administrator, carrier, pharmacy benefit manager, provider directory, or other controlling entity can make an official determination.

## Dormant quarantine research

The repository and Supabase project contain locked-down quarantine research created before the commercial-v1 decision:

- internal server service code with hash, MIME/signature, sensitive-data, and deletion controls;
- a private PDF/TXT bucket limited to 10 MB;
- a forced-RLS metadata table with no anonymous or authenticated policies;
- zero document rows and zero stored objects at certification.

Commercial v1 exposes no document-intake, extraction, finalize, list, or deletion HTTP endpoint. The browser-local product must not import or call the dormant upload client. The dormant schema and service code do not authorize a future upload feature.

Future server document processing would require a new product decision, a separate implementation branch, external privacy and legal review, security assessment, incident-response and deletion operations, vendor review, support procedures, appropriate insurance, and explicit founder authorization.

## Release gates

Commercial v1 may merge only when:

- production document-processing and checkout flags remain false;
- no deployable document-processing endpoint exists;
- the browser-local source assistant scans before extracting;
- raw text is cleared and excluded from persisted state;
- every saved candidate is user-confirmed;
- owner-scoped workspace and entitlement RLS remain enforced;
- the offer clearly distinguishes free education from the proposed paid workspace;
- no purchase button, card collection, or live Checkout appears during demand validation;
- unit, trust, bundle, prerender, mobile, accessibility, print, and browser journeys pass;
- an exact protected Vercel preview is Ready within the current plan limits;
- Supabase contains zero quarantine rows and objects;
- there are no unresolved review threads.

## Success standard

Prelaunch success means CAF presents a credible paid product with a complete guided workflow and a real premium technical foundation while minimizing data collection and keeping live commerce disabled.

It does not mean the product is legally cleared for server document processing, institutional data exchange, automatic enrollment, or official eligibility determinations.
