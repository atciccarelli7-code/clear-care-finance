import { useState } from "react";
import { Link } from "react-router-dom";
import { trackHospitalBillEvent } from "@/lib/hospitalBillAnalytics";

const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
const reading = [
  ["The $20 Tylenol Isn’t Really About the Tylenol", "20-dollar-tylenol-hospital-prices"],
  ["Why Hospitals Care So Much About Length of Stay", "why-hospitals-care-about-length-of-stay"],
  ["What a Nonprofit Hospital Actually Is (and Isn’t)", "what-nonprofit-hospital-actually-means"],
  ["Why the Hospital Becomes the System’s Shock Absorber", "why-hospitals-become-the-systems-shock-absorber"],
  ["Why “Just Send Them to Rehab” Is Not That Simple", "why-just-send-them-to-rehab-is-not-simple"],
  ["“Home With Family” Is Not a Free Care Plan", "home-with-family-is-not-a-free-care-plan"],
];

export function HospitalEconomics({ reimbursementCents }: { reimbursementCents?: number }) {
  const [extraDays, setExtraDays] = useState(0);
  const [dailyCost, setDailyCost] = useState(600);
  const [baseCost, setBaseCost] = useState(7000);
  const [paymentType, setPaymentType] = useState("case");
  const incrementalCost = extraDays * dailyCost * 100;
  // Deliberately a classroom sensitivity analysis; never a hospital cost estimate.
  const modeledPayment = reimbursementCents === undefined ? undefined : reimbursementCents + (paymentType === "per-diem" ? extraDays * 90000 : 0);
  return <section id="economics" className="bill-section">
    <div className="bill-kicker">05 / Behind the bill</div>
    <h2>A longer stay adds work. It may not add payment.</h2>
    <p>For most acute inpatient hospital services, Original Medicare pays through a diagnosis-related group (MS-DRG): a payment for the discharge, rather than the sum of the hospital’s individual charges. Geography, teaching status, severity, outliers, transfers, and other adjustments can change that payment. Commercial and Medicaid contracts may work differently.</p>
    <p>A charge is a price on the hospital’s billing schedule. A contractual adjustment removes an amount the hospital cannot collect under that agreement. It is neither a cash expense nor proof of a loss. A financial-assistance adjustment has a different purpose: reducing an eligible patient’s obligation.</p>
    <div className="bill-grid">
      <div>
        <h3>Length-of-stay laboratory</h3>
        <p className="bill-small">Classroom assumptions only. These cost inputs and the $900 per-diem increment are invented for teaching, with no hospital-specific cost or profit claim. This experiment does not change the patient bill above.</p>
        <div className="bill-controls">
          <label>Extra hospital days<select value={extraDays} onChange={e => setExtraDays(Number(e.target.value))}>{[0,1,2,3,4,5,7,10].map(v => <option key={v} value={v}>{v}</option>)}</select></label>
          <label>Extra resource cost per day<select value={dailyCost} onChange={e => setDailyCost(Number(e.target.value))}>{[300,600,1000,1500].map(v => <option key={v} value={v}>${v}</option>)}</select></label>
          <label>Assumed base stay cost<select value={baseCost} onChange={e => setBaseCost(Number(e.target.value))}>{[5000,7000,10000,15000].map(v => <option key={v} value={v}>${v.toLocaleString()}</option>)}</select></label>
          <label>Payment mechanism<select value={paymentType} onChange={e => setPaymentType(e.target.value)}><option value="case">Case payment held constant</option><option value="per-diem">Illustrative $900 extra per day</option></select></label>
        </div>
      </div>
      <div>
        <dl className="bill-ledger" aria-live="polite">
          <div><dt>Modeled facility payment*</dt><dd>{modeledPayment === undefined ? "Unavailable" : money(modeledPayment)}</dd></div>
          <div><dt>Assumed base resources</dt><dd>{money(baseCost * 100)}</dd></div>
          <div><dt>Added resource consumption</dt><dd>{money(incrementalCost)}</dd></div>
          <div className="bill-total"><dt>Illustrative contribution*</dt><dd>{modeledPayment === undefined ? "Unavailable" : money(modeledPayment - baseCost * 100 - incrementalCost)}</dd></div>
        </dl>
        <p className="bill-small">*Assumes the modeled collectible reimbursement is received. Contribution here means modeled payments minus assumed resources. It excludes any unmodeled overhead, financing, subsidies, and other revenue; it is not a measured admission profit or hospital operating margin.</p>
      </div>
    </div>
    <details><summary>Why the real economics are more complicated</summary>
      <p>An additional day still requires staffed space, monitoring, meals, medicines, and coordination. The marginal cost of that day is not the average cost of a whole day across the hospital. Staffing and building costs can also be fixed in the short run. A discharge delay can occupy scarce capacity even when a payer adds no payment.</p>
      <p>Some unusually costly cases qualify for outlier payment; some transfers are paid under special rules. A complication can change classification only when documentation and coding rules support it. A new diagnosis does not automatically create a higher payment. Discharge safety and coverage obligations still matter.</p>
      <p>Positive operating margins can support equipment, reserves, and services at nonprofit hospitals. Tax status alone tells you neither whether a particular stay was profitable nor whether a patient qualifies for free care. Hospital-wide cost reports and audited statements answer different questions from this fictional bill.</p>
    </details>
    <p className="bill-small">Mechanism: <a href="https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps" onClick={() => trackHospitalBillEvent("source_clicked")}>CMS acute inpatient payment system</a>. Cost and payment increments in this laboratory are assumptions, not extracted from that source.</p>
    <div className="bill-link-list">{reading.map(([title, slug]) => <Link key={slug} to={`/articles/${slug}`} onClick={() => trackHospitalBillEvent("related_article_clicked")}>{title} →</Link>)}</div>
  </section>;
}

const terms = [
  ["Gross charge", "The hospital’s billed amount before insurance rules, discounts, or assistance. A charge is not its measured cost or collected revenue."],
  ["Allowed amount", "The amount recognized for a covered service under the applicable payment arrangement. This model uses an explicitly hypothetical amount; Medicare’s payment methods are more complex than a commercial negotiated rate."],
  ["Contractual adjustment", "The difference removed under the payment arrangement. It is not an insurer cash payment or automatically a hospital loss."],
  ["Deductible", "The covered amount assigned to the patient before certain plan payments begin. Original Medicare Part A uses benefit periods, not an annual hospital deductible."],
  ["Copayment", "A fixed amount, such as a stated payment per inpatient day or admission. The illustrative Medicare Advantage preset uses a daily copayment."],
  ["Coinsurance", "A percentage of the recognized covered amount assigned to the patient, often after a deductible."],
  ["Out-of-pocket maximum", "A plan’s limit on qualifying cost sharing. Premiums, noncovered care, and some out-of-network costs may not count. Original Medicare alone has no annual limit."],
  ["Insurance paid", "A payer’s modeled payment in this example. The real payment must be confirmed against the processed claim. It differs from the amount initially charged."],
  ["Patient responsibility", "The portion assigned to the patient under the modeled coverage rules, before or after assistance as labeled. Prior patient payments reduce the account balance, not the original coverage responsibility."],
  ["Amount not covered", "A service or portion the plan does not cover. It is different from a contractual adjustment and does not by itself prove that the patient may legally be billed."],
  ["Claim denial", "A payer decision not to pay as submitted. The reason, provider agreement, notices, and appeal rights determine next steps; a denial does not automatically make all charges collectible from the patient."],
  ["Claim adjustment / reprocessing", "A later correction to how a claim was handled. An updated EOB or Medicare Summary Notice may replace the earlier calculation."],
  ["EOB / Medicare Summary Notice", "A payer explanation of processed claims. An EOB is not the hospital’s payment request. Original Medicare generally sends a Medicare Summary Notice rather than a commercial EOB."],
  ["Financial assistance", "A reduction under a hospital policy based on its eligibility rules. It is distinct from negotiated adjustments, payment plans, and insurance payments."],
  ["MS-DRG", "A Medicare Severity Diagnosis Related Group used in acute inpatient prospective payment. A diagnosis alone does not determine the final group: procedures, severity, and discharge details matter."],
  ["Uncompensated care and margin", "Uncompensated care involves care for which payment is not received under defined accounting measures. Operating margin compares operating income with operating revenue; subtracting the bill’s adjustment from charges does not calculate it."],
];

export function HospitalBillGlossary() {
  return <section id="terms" className="bill-section"><div className="bill-kicker">07 / Read the documents</div><h2>The words that change the numbers</h2><div className="bill-glossary">{terms.map(([term, definition]) => <details key={term}><summary>{term}</summary><p>{definition}</p></details>)}</div></section>;
}

export function HospitalBillNextSteps() {
  const [checked, setChecked] = useState<number[]>([]);
  const questions = [
    ["Match the documents", "Confirm patient, service dates, billing entity, and encounter. Ask: “Can you send an itemized statement and tell me which claim this bill matches?”"],
    ["Check processing before interpreting the balance", "Ask the insurer: “Is this claim final, pending, denied, or being reprocessed? What reason code and appeal deadline apply?” Ask billing whether it can pause collection while the issue is reviewed; do not assume a pause is automatic."],
    ["Reconcile the responsibility", "Compare the latest EOB or Medicare Summary Notice with the provider bill, then subtract prior payments. Ask about any unexplained difference, duplicate-looking service, or unfamiliar billing entity. A repeated description alone does not establish an error."],
    ["Check help before financing", "Ask: “Please send your financial-assistance policy, application, plain-language summary, and list of covered providers. Can insured patients apply?” Eligibility varies; a payment plan is not the same as assistance."],
    ["Get the answer in writing", "Record the representative’s name, date, reference number, requested correction, and response deadline. If assistance is unavailable, ask about an interest-free plan, its terms, and whether other bills are excluded."],
  ];
  const toggle = (index: number) => {
    const next = checked.includes(index) ? checked.filter(v => v !== index) : [...checked, index];
    setChecked(next);
    if (next.length === questions.length) trackHospitalBillEvent("module_completed");
  };
  return <section id="next-steps" className="bill-section"><div className="bill-kicker">08 / Your next move</div><h2>A confusing bill deserves a specific question.</h2>
    <p>Use this checklist privately in your browser. No document upload or account is needed, and these checks are not saved when you leave. Contact the insurer for coverage and claim decisions; contact the billing organization for its statement, corrections, discounts, and assistance.</p>
    {questions.map(([title, text], index) => <label className="bill-check" key={title}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggle(index)} /><span><strong>{title}.</strong> {text}</span></label>)}
    <div className="bill-note"><strong>Surprise bills have specific protections.</strong><p>For many people with employer or individual insurance, federal law limits out-of-network charges for emergency services, certain care at in-network facilities, and air ambulance services. It does not cover every out-of-network visit; ground ambulance services generally fall outside federal protections. Medicare and Medicaid have their own rules. Do not assume the difference between a charge and payment is collectible balance billing.</p><a href="https://www.cms.gov/medical-bill-rights/know-your-rights/using-insurance" onClick={() => trackHospitalBillEvent("source_clicked")}>Check CMS protections and complaint help →</a></div>
    <p>Tax-exempt hospitals subject to section 501(r) must maintain written financial-assistance policies. That does not make every service or separately billing clinician free. Review the policy’s eligibility and provider list. For planned uninsured or self-pay care, ask about a good-faith estimate and applicable dispute rights.</p>
    <div className="bill-link-list">
      <Link to="/tools/eob-to-bill-match-checker">Match your EOB and bill →</Link><Link to="/medical-bills/financial-assistance">Find hospital financial assistance →</Link>
      <Link to="/insurance/medical-bill-review-toolkit">Use CAF’s bill-response guide →</Link><Link to="/insurance/hospital-discharge-coverage">Plan the next care setting →</Link>
    </div>
    <p className="bill-small">Sources and scope: <Link to="/hospital-bill-anatomy/methodology">CMS patient rights, IRS financial-assistance requirements, and this model’s methodology</Link>.</p>
  </section>;
}
