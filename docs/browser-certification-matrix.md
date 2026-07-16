# Flagship Browser Certification Matrix

**Suite:** `e2e/flagship-journeys.spec.ts`  
**Runtime:** Current Playwright Chromium 149 through pinned `@playwright/test` 1.61.1  
**Viewports:** 390 × 844 mobile and 1440 × 1000 desktop  
**Output:** Production build served through local Vite preview  
**Failure evidence:** Screenshot, trace, and video retained only on failure; CI artifact retention is seven days.

**Verified result:** 18 of 18 journey executions passed on the exact local release candidate: nine mobile and nine desktop.

| Journey | Required state transition | Continuity/action evidence | Accessibility and runtime gates |
|---|---|---|---|
| Homepage Decision Concierge | Fixed problem + timing → canonical recommendation | Open destination; browser back and forward | Hydration, focus, one main/H1, axe, overflow, console/page/request scan |
| Financial Navigator | Select pathway → answer fixed questions → generated plan | My Plan save, complete, and remove | Progress semantics, local continuity, axe, runtime scan |
| Benefits Change Detector | Mark a controlled change → complete sections → Receipt | Copy, print intent, reset | Result focus/live status, one main/H1, axe, runtime scan |
| Medical Bill Review Toolkit | Identify the relevant document/action | Internal guided action and official rights source | Meaningful content, history return, axe, runtime scan |
| Turning 65 | Broad fictional timing inputs → dated timeline | Copy, print intent, official-resource handoff | Result content, one main/H1, axe, runtime scan |
| Medical Appointment Cost Preparation | Keyboard-operated fixed-choice stages → Cost Preparation Plan | Copy, print, fixed My Plan action, toolkit handoff | Keyboard completion, progress, focus, no overflow, axe, runtime scan |
| Medicare Plan Verification | Resolve every critical category → explicit preparation completion | Copy, print, official resource, Turning 65 handoff | Completion focus/live region, progress semantics, axe, runtime scan |
| Medicare Cost & Care Hub | Review the source-backed cost table and coverage-gap explainer | Focus the horizontally scrollable reference table | Keyboard focus, one main/H1, axe, overflow, runtime scan |
| Organization Program Planner | Select four non-identifying program dimensions â†’ generated review brief | Print intent and program-review handoff | Result focus, fixed-choice privacy boundary, one main/H1, axe, overflow, runtime scan |

Every journey rejects real personal, medical, plan, claim, and financial information. The suite supplies only broad fictional values.

## Gate definitions

- No serious or critical automated axe violations.
- Exactly one global `main` landmark and one H1 at the certified state.
- No horizontal document overflow beyond one rounding pixel.
- No application console error, page error, framework overlay, failed first-party request, or first-party HTTP response of 400 or greater.
- Vercel Analytics and Speed Insights endpoints are fulfilled locally because Vite preview is not the Vercel runtime; application requests remain unmocked.
- A fixed necessary-only consent value prevents the privacy panel from obscuring the journey; consent behavior is tested separately by unit tests.

## Evidence note

The browser suite certifies the built application and primary interactions. It does not prove production analytics delivery, external email delivery, AdSense account state, CMP certification, or Vercel production health. Those require authenticated external evidence.
