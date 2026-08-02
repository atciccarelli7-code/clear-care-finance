from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    if new in text:
        return
    if text.count(old) != 1:
        raise SystemExit(f"Expected one target in {path}; found {text.count(old)}")
    file_path.write_text(text.replace(old, new, 1), encoding="utf-8")


def insert_before(path: str, marker: str, entry: str, entry_id: str) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    if entry_id in text:
        return
    if text.count(marker) != 1:
        raise SystemExit(f"Expected one marker in {path}; found {text.count(marker)}")
    file_path.write_text(
        text.replace(marker, f"\n\n{entry.strip()}\n\n{marker.lstrip()}", 1),
        encoding="utf-8",
    )


replace_once(
    "docs/ai/PROJECT_CONTEXT.md",
    "- a typed Decision Outcome contract for high-intent tools, including typed portable assumptions, first piloted on pure private student-loan payoff and refinance-quote comparison functions",
    "- a typed Decision Outcome contract for high-intent tools, including typed portable assumptions and bounded recommendation states, now applied to private student-loan payoff/refinance, 403(b) contribution and employer formulas, and patient cost sharing",
)

decision = """
### CAF-D-012 — Bounded patient cost-share Decision Outcome

- **Date:** 2026-08-01
- **Status:** EXPERIMENT
- **Decision:** Extend the typed Decision Outcome architecture to the existing patient visit-cost route, but only for explicitly selected service rules. Unknown or unsupported rules omit the patient-cost estimate, and the out-of-pocket cap is applied only when covered in-network status is confirmed.
- **Rationale:** The supplied Search Console export showed 192 combined impressions and zero clicks across the cost-sharing explainer and calculator, while the prior calculator could automatically add copay and coinsurance despite plan-specific sequencing. The stronger 403(b) opportunity had already been implemented, making this the highest-leverage unfinished exposed journey.
- **Evidence:** Founder-provided Search Console export dated 2026-08-01; current repository and PR #243 reconciliation; official HealthCare.gov definitions for deductible, copayment, coinsurance, allowed amount, and out-of-pocket maximum; CMS Summary of Benefits and Coverage guidance; PR #247 calculation, accessibility, performance, and browser evidence.
- **Consequences:** The canonical route remains stable; users must identify the service-specific rule and network/coverage status; unsupported structures fail into verification; billed charge is distinguished from allowed amount; copy and print preserve assumptions and cautions; no affiliate, account, backend, PHI, or financial telemetry is introduced.
- **Revisit trigger:** Any calculation discrepancy; user evidence that the flow is confusing; meaningful post-release search/completion data; official-source change; or source review by 2027-02-01.
- **Supersedes:** The prior reactive visit-cost arithmetic implementation on the same route. It applies CAF-D-007 and does not supersede the user-value-before-monetization principle.
"""
insert_before("docs/ai/DECISION_LEDGER.md", "\n## Updating the ledger\n", decision, "CAF-D-012")

evidence = """
### CAF-E-007 — Patient cost-sharing definitions and bounded estimate controls

- **Claim or state:** Deductibles, copayments, coinsurance, allowed amounts, and out-of-pocket limits are distinct plan terms whose service-specific sequence must be verified. The in-network out-of-pocket maximum does not establish that every premium, non-covered service, out-of-network charge, balance bill, or amount above the allowed amount is protected. A standardized Summary of Benefits and Coverage helps identify the applicable service row, while the current plan document, insurer accumulator, processed EOB, and provider bill control an individual case.
- **Domain:** Insurance/benefits, patient financial education, search performance, and repository/product evidence
- **Source:** HealthCare.gov glossary pages for deductible, copayment, coinsurance, allowed amount, cost sharing, and out-of-pocket maximum; CMS Summary of Benefits and Coverage guidance; founder-provided Search Console export dated 2026-08-01; GitHub PR #247.
- **Evidence class:** PRIMARY-SOURCE for insurance definitions; DIRECT-CURRENT for the search export and implementation evidence.
- **Verified date:** 2026-08-01
- **Coverage:** General U.S. educational health-insurance cost-sharing boundaries and the CAF route `/tools/health-insurance-visit-cost-calculator`.
- **Freshness trigger:** 2027-02-01; substantive HealthCare.gov/CMS change; any calculation discrepancy; changed route logic; or new post-release search/completion evidence.
- **Used by:** Patient Cost Share Calculator, `healthInsuranceCostShareDecisionProduct`, CAF-D-012, CAF-W-009, and PR #247.
- **Limitations:** Does not determine individual coverage, network status, medical necessity, prior authorization, claim adjudication, balance-billing rights, appeal rights, final allowed amount, or amount ultimately owed. Search impressions do not establish causality, demand size, comprehension, completion, or revenue.
- **Owner:** Content/evidence integrity, healthcare user research, privacy/legal protection, analytics, and quality/release.
"""
insert_before("docs/ai/EVIDENCE_LEDGER.md", "\n## Usage rules\n", evidence, "CAF-E-007")

work = """
### CAF-W-009 — Patient cost-share Decision Outcome

- **Date:** 2026-08-01
- **Assignment:** Build the statistically most crucial unfinished improvement using the supplied Search Console export and current repository state.
- **Starting evidence:** The deductible/copay/coinsurance article had 117 impressions and zero clicks; the existing visit-cost calculator had 75 impressions and zero clicks; the combined cluster had 192 impressions and no clicks. PR #243 had already addressed the stronger 403(b) opportunity. The existing calculator could add copay and coinsurance together and treated the out-of-pocket maximum without an explicit covered in-network gate.
- **Decision:** Preserve the indexed route and replace the reactive arithmetic with a typed Patient Cost Share Decision Outcome supporting fixed-copay, deductible-then-coinsurance, deductible-then-copay, unknown-rule, uncertain-network, and out-of-pocket-cap states.
- **Implementation:** Added a pure cost-share domain, typed product definition, conditional two-step form, deterministic interpretation, verification checklist, official resources, copy/print/edit/restart, source freshness, intent-aligned metadata, privacy-safe analytics, and lazy loading. No account, backend, PHI, affiliate, premium, email, Stripe, or Supabase change was added.
- **Validation:** Unit tests cover supported and fail-closed states; browser tests cover keyboard focus, Axe, mobile overflow, copy, print, and lack of a commercial path; strict performance budgets remain unchanged; desktop/mobile screenshots and Letter/A4 PDFs are generated by browser certification. Exact-head CI, Vercel preview, artifacts, merge, and production smoke remain controlled by PR #247.
- **Release state:** Release candidate in PR #247. The PR and Vercel deployment are authoritative for final exact-head, merge, and production status.
- **User and business impact expected:** Users receive a bounded estimate or useful verification state rather than an overconfident total. The existing search-exposed cluster gains a complete decision journey, and the shared Decision Outcome architecture proves reusable in a patient-facing insurance domain. No immediate revenue is claimed.
- **What was learned:** A calculator can be mathematically consistent while being structurally wrong for real plan sequencing. Search prioritization must reconcile already completed work. Visual evidence must set a stable consent fixture, and feature-specific code must be lazy-loaded rather than weakening performance budgets.
- **Assumption invalidated:** A deductible, copay, and coinsurance can safely be summed by default; an out-of-pocket maximum can cap uncertain or out-of-network charges; or a passing component test proves business and user-safety correctness.
- **Reusable asset created:** Patient cost-share state model, third Decision Outcome product, clean visual/PDF certification, and fail-closed network/cap pattern.
- **Process improvement implemented:** The exact journey now has pure-domain regressions, contract enforcement, dedicated browser certification, strict route budgets, and post-consent desktop/mobile evidence capture.
- **Unresolved warning:** No direct user testing, post-release CTR lift, completion rate, satisfaction, or revenue evidence exists; complex plan designs remain outside the supported model.
- **Evidence or event that should trigger reassessment:** 28 days after production, sufficient consented completion evidence, any calculation error, official-source change, or review by 2027-02-01.
- **Links:** `docs/work-packets/2026-08-01-patient-cost-share-decision-outcome.md`; GitHub PR #247.
"""
insert_before("docs/ai/WORK_LEDGER.md", "\n## Usage rules\n", work, "CAF-W-009")
