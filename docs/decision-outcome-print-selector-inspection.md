# Decision outcome print selector inspection

## Legacy selector matches
```text
./.github/workflows/inspect-decision-outcome-print-selectors.yml:28:            grep -RIn --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist "private-loan-decision-outcome" . || true
./e2e/print-pdf-certification.spec.ts:104:    "#private-loan-decision-outcome",
./e2e/print-pdf-certification.spec.ts:128:    "#private-loan-decision-outcome",
./scripts/check-decision-outcome-contracts.mjs:104:if (outcomePanel.includes('id="private-loan-decision-outcome"')) failures.push("Shared outcome renderer must not retain a private-loan-only DOM identifier.");
./src/print.css:86:  body:has(#private-loan-decision-outcome) main * {
./src/print.css:90:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome,
./src/print.css:91:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome * {
./src/print.css:95:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome {
./src/print.css:103:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome > article {
./src/print.css:110:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome > article > header {
./src/print.css:114:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome > article::before {
./src/print.css:127:  body:has(#private-loan-decision-outcome) #private-loan-decision-outcome a[href^="http"]::after {
```

## Generic decision outcome matches
```text
src/components/shared/DecisionOutcomePanel.tsx:77:    <div className="space-y-5" id={`decision-outcome-${definition.decisionIdentifier}`}>
src/components/shared/DecisionOutcomePanel.tsx:82:      <article className="overflow-hidden rounded-3xl border border-trust/25 bg-card shadow-card" aria-labelledby="decision-outcome-heading">
src/components/shared/DecisionOutcomePanel.tsx:85:          <h2 id="decision-outcome-heading" ref={headingRef} tabIndex={-1} className="mt-2 font-display text-2xl font-bold leading-tight text-foreground outline-none md:text-3xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
e2e/private-student-loan-decision-outcome.spec.ts:88:  await expect(page.locator("#decision-outcome-private_student_loan_payoff")).toBeVisible();
e2e/private-student-loan-decision-outcome.spec.ts:89:  await expect(page.locator("#decision-outcome-private_student_loan_payoff")).toContainText("Educational estimate only");
e2e/retirement-403b-decision-outcome.spec.ts:69:  await expect(page.locator("#decision-outcome-retirement_403b_contribution")).toBeVisible();
e2e/retirement-403b-decision-outcome.spec.ts:70:  await expect(page.locator("#decision-outcome-retirement_403b_contribution")).toContainText("The plan document and payroll records control");
```

## Print media sources
```text
src/print.css
src/print-pagination.css
public/downloads/medical-bill-response-pack.html
```
