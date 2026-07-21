import assert from "node:assert/strict";
import {
  buildProductMeasurementReport,
  classifyDecisionIntent,
  parseCsv,
  validateJourneyRecords,
} from "./product-measurement-report.mjs";

const journeyCsv = `event_name,journey_key,surface,phase,step_index,variant,session_journey_id,event_count,date,event_timestamp
journey_viewed,decision_concierge,home,name_question,0,,caf-session-001,1,2026-07-21,2026-07-21T12:00:00Z
journey_started,decision_concierge,home,narrow_answer,1,medical_bill,caf-session-001,1,2026-07-21,2026-07-21T12:00:10Z
journey_result_reached,decision_concierge,home,result,3,medical_bill,caf-session-001,1,2026-07-21,2026-07-21T12:00:30Z
journey_result_copied,decision_concierge,home,result,3,medical_bill,caf-session-001,1,2026-07-21,2026-07-21T12:00:40Z
journey_handoff_opened,decision_concierge,home,handoff,4,medical_bill,caf-session-001,1,2026-07-21,2026-07-21T12:00:50Z
journey_viewed,decision_concierge,home,name_question,0,,caf-session-002,1,2026-07-21,2026-07-21T13:00:00Z
journey_started,decision_concierge,home,narrow_answer,1,benefits,caf-session-002,1,2026-07-21,2026-07-21T13:00:10Z
journey_exited_unexpectedly,decision_concierge,home,narrow_answer,1,benefits,caf-session-002,1,2026-07-21,2026-07-21T13:00:20Z`;

const searchCsv = `Query,Page,Clicks,Impressions,CTR,Position
medical bill help,https://communityacquiredfinance.com/insurance/medical-bill-review-toolkit,3,100,3%,8.2
nurse total compensation,https://communityacquiredfinance.com/tools/healthcare-worker-total-compensation-comparison,2,50,4%,6.4
turning 65 medicare,https://communityacquiredfinance.com/medicare-care-costs/turning-65,1,25,4%,9.1`;

const report = buildProductMeasurementReport({ journeyCsvText: journeyCsv, searchConsoleCsvText: searchCsv });
assert.equal(report.schema_version, "caf-product-measurement-v1");
assert.equal(report.journey.valid_rows, 8);
assert.equal(report.journey.rejected_rows.length, 0);
assert.equal(report.journey.metrics.length, 1);
assert.equal(report.journey.metrics[0].rates.entry_rate, 1);
assert.equal(report.journey.metrics[0].rates.result_completion_rate, 0.5);
assert.equal(report.journey.metrics[0].rates.action_use_rate, 1);
assert.equal(report.journey.metrics[0].rates.handoff_rate, 1);
assert.equal(report.journey.metrics[0].rates.unexpected_exit_rate, 0.5);
assert.equal(report.search_console.summary.totals.clicks, 6);
assert.equal(report.search_console.summary.totals.impressions, 175);
assert.equal(report.search_console.summary.decision_intents.length, 3);
assert.equal(classifyDecisionIntent("nurse shift differential calculator"), "compensation");
assert.equal(classifyDecisionIntent("prior authorization appeal"), "insurance_denial");

const quoted = parseCsv('event_name,journey_key,surface\n"journey_viewed","decision_concierge","home"');
assert.equal(quoted[0].journey_key, "decision_concierge");

const malformed = validateJourneyRecords(parseCsv(`event_name,journey_key,surface,event_count
journey_started,contains free text,home,1
journey_started,decision_concierge,unknown,1
journey_started,decision_concierge,home,zero`));
assert.equal(malformed.valid.length, 0);
assert.equal(malformed.rejected.length, 3);

assert.throws(
  () => validateJourneyRecords(parseCsv(`event_name,journey_key,surface,salary
journey_started,decision_concierge,home,90000`)),
  /prohibited columns: salary/,
);

assert.throws(
  () => validateJourneyRecords(parseCsv(`event_name,journey_key,surface,custom_dimension
journey_started,decision_concierge,home,example`)),
  /non-contract columns: custom_dimension/,
);

console.log("Product measurement report contract passed.");
