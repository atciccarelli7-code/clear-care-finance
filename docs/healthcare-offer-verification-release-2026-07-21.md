# Healthcare Offer Verification Plan — Release Record

Date: 2026-07-21  
Linear: AND-83  
Canonical route: `/tools/healthcare-worker-total-compensation-comparison`

## Current-state decision

The strategic research ranked the Medical Bill Response System first and the healthcare-worker total-compensation comparator second. The current production audit found that the medical-bill vertical slice, printable pack, workbook laboratory, patient gateway, privacy boundaries, analytics, and release certification were already complete. The compensation comparator was also substantially built: it already compared cash pay, overtime, differentials, benefits, selected costs, effective hourly value, break-even pay, and quality-of-life factors.

The highest-value non-duplicative gap was therefore not another calculator or route. It was the action layer after the comparison: a fixed, privacy-safe verification plan that helps a healthcare worker confirm the written offer before resigning.

## Product change

The canonical total-compensation route now adds a local-only Healthcare Offer Verification Plan with 12 fixed checks covering:

- written base pay and pay frequency;
- overtime classification and calculation;
- differentials, call, holiday, and bonus rules;
- sign-on and repayment terms;
- retirement contribution and vesting;
- insurance premiums for the correct coverage tier;
- deductible, out-of-pocket, network, prescription, and HSA/HRA details;
- PTO, holidays, and leave rules;
- schedule, weekends, call, floating, and travel;
- start-date contingencies and credentialing;
- commute, parking, reimbursement, and required expenses;
- final written-offer and resignation timing.

The plan includes accessible progress, resume-on-device state, copy, text download, print/PDF, restart, a benefits-workflow handoff, and an explicit “do not resign until the final written offer is verified” boundary.

## Privacy and analytics

Only fixed checklist completion IDs are stored in local storage. Employer names, compensation figures, health-plan selections, and notes are not stored by the checklist.

The implementation uses the existing shared journey analytics contract rather than creating a competing event taxonomy. Events are consent-gated and limited to fixed journey key, surface, phase, step index, variant, and session-scoped journey ID. The text-download event uses a fixed tool and artifact identifier. No entered compensation or employer data is transmitted.

## Architecture

- New component: `src/components/calculators/HealthcareOfferDecisionChecklist.tsx`
- Updated page: `src/pages/HealthcareWorkerTotalCompensationPage.tsx`
- New test: `src/test/HealthcareOfferDecisionChecklist.test.tsx`
- Existing calculation engine and canonical route remain unchanged.
- Both calculator and checklist are lazy-loaded through the existing Vite/React route.

## Release gates

Required before merge:

- lint;
- unit/trust test suite;
- production build and publication checks;
- browser journey/accessibility certification where applicable;
- Vercel preview READY;
- manual route inspection on desktop and mobile evidence;
- production deployment READY;
- no new runtime error cluster;
- Linear and Notion release records updated with exact commit and deployment identifiers.

## Measurement

Monitor for 14 and 28 days:

- comparator completion;
- verification-plan starts;
- checklist step completion;
- saved-plan resume behavior;
- all-items-complete rate;
- copy, download, and print use;
- benefits-workflow handoff;
- unexpected exits;
- any duplicate terminal analytics between the comparator and shared journey layer.

The next product decision should use observed completion and return behavior, not pageview volume alone.
