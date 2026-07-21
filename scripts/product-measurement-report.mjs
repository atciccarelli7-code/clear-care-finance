import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const JOURNEY_EVENT_NAMES = new Set([
  "journey_viewed",
  "journey_started",
  "journey_step_completed",
  "journey_back_selected",
  "journey_exited_unexpectedly",
  "journey_result_reached",
  "journey_result_copied",
  "journey_result_printed",
  "journey_resume_clicked",
  "journey_restarted",
  "journey_handoff_opened",
]);

export const JOURNEY_SURFACES = new Set([
  "home",
  "tools",
  "start_here",
  "destination",
  "hospital_guide",
  "benefits",
  "medicare",
  "medical_bill",
]);

export const JOURNEY_PHASES = new Set([
  "name_question",
  "narrow_answer",
  "build_action_plan",
  "verify_officially",
  "result",
  "handoff",
]);

const FIXED_VALUE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const SESSION_ID_PATTERN = /^[a-z0-9-]{8,64}$/;
const ALLOWED_JOURNEY_COLUMNS = new Set([
  "event_name",
  "journey_key",
  "surface",
  "phase",
  "step_index",
  "variant",
  "session_journey_id",
  "event_count",
  "date",
  "event_date",
  "event_timestamp",
]);

const FORBIDDEN_HEADER_PATTERNS = [
  /(^|_)(name|email|phone|address|zip|state|location)($|_)/,
  /(^|_)(diagnosis|symptom|condition|medication|treatment|procedure|provider|hospital)($|_)/,
  /(^|_)(policy|member|claim|case|account|tax|record|identifier|id_number)($|_)/,
  /(^|_)(employer|job_title|offer|salary|wage|overtime|schedule|plan_name|carrier|pharmacy)($|_)/,
  /(^|_)(income|balance|premium|deductible|out_of_pocket|contribution|debt|asset|exact_age)($|_)/,
  /(^|_)(answer|result_text|generated_plan|copied_text|note|comment|free_text|document)($|_)/,
  /(^|_)(query_string|fragment|url|local_storage|fingerprint)($|_)/,
];

const SEARCH_CONSOLE_REQUIRED_COLUMNS = new Set(["query", "page", "clicks", "impressions", "ctr", "position"]);
const TERMINAL_EVENT_NAMES = new Set([
  "journey_result_reached",
  "journey_result_copied",
  "journey_result_printed",
  "journey_resume_clicked",
  "journey_restarted",
  "journey_handoff_opened",
]);

const round = (value, digits = 4) => {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const ratio = (numerator, denominator) => (denominator > 0 ? round(numerator / denominator) : null);

export const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[%()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (character === '"') {
      if (quoted && next === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (character === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += character;
  }

  if (quoted) throw new Error("CSV contains an unterminated quoted field.");
  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map(normalizeHeader);
  if (headers.some((header) => !header)) throw new Error("CSV contains an empty column header.");
  if (new Set(headers).size !== headers.length) throw new Error("CSV contains duplicate normalized column headers.");

  return rows.slice(1).map((values, rowIndex) => {
    const record = { __row: rowIndex + 2 };
    headers.forEach((header, columnIndex) => {
      record[header] = values[columnIndex] ?? "";
    });
    return record;
  });
};

const numericValue = (value, fallback = 0) => {
  const cleaned = String(value ?? "").trim().replace(/[%,$]/g, "");
  if (!cleaned) return fallback;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const eventCount = (record) => {
  const parsed = numericValue(record.event_count, 1);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : Number.NaN;
};

export const inspectJourneyHeaders = (records) => {
  if (records.length === 0) return { columns: [], forbiddenColumns: [], unknownColumns: [] };
  const columns = Object.keys(records[0]).filter((key) => key !== "__row");
  const forbiddenColumns = columns.filter((column) => FORBIDDEN_HEADER_PATTERNS.some((pattern) => pattern.test(column)));
  const unknownColumns = columns.filter((column) => !ALLOWED_JOURNEY_COLUMNS.has(column));
  return { columns, forbiddenColumns, unknownColumns };
};

export const validateJourneyRecords = (records) => {
  const headerAudit = inspectJourneyHeaders(records);
  if (headerAudit.forbiddenColumns.length > 0) {
    throw new Error(`Journey export contains prohibited columns: ${headerAudit.forbiddenColumns.join(", ")}`);
  }
  if (headerAudit.unknownColumns.length > 0) {
    throw new Error(`Journey export contains non-contract columns: ${headerAudit.unknownColumns.join(", ")}`);
  }

  const valid = [];
  const rejected = [];

  for (const record of records) {
    const errors = [];
    const name = String(record.event_name ?? "").trim();
    const journeyKey = String(record.journey_key ?? "").trim();
    const surface = String(record.surface ?? "").trim();
    const phase = String(record.phase ?? "").trim();
    const variant = String(record.variant ?? "").trim();
    const sessionId = String(record.session_journey_id ?? "").trim();
    const count = eventCount(record);
    const stepIndex = String(record.step_index ?? "").trim() === "" ? null : numericValue(record.step_index, Number.NaN);

    if (!JOURNEY_EVENT_NAMES.has(name)) errors.push("invalid event_name");
    if (!FIXED_VALUE_PATTERN.test(journeyKey)) errors.push("invalid journey_key");
    if (!JOURNEY_SURFACES.has(surface)) errors.push("invalid surface");
    if (phase && !JOURNEY_PHASES.has(phase)) errors.push("invalid phase");
    if (variant && !FIXED_VALUE_PATTERN.test(variant)) errors.push("invalid variant");
    if (sessionId && !SESSION_ID_PATTERN.test(sessionId)) errors.push("invalid session_journey_id");
    if (!Number.isFinite(count)) errors.push("invalid event_count");
    if (stepIndex !== null && (!Number.isInteger(stepIndex) || stepIndex < 0 || stepIndex > 20)) errors.push("invalid step_index");

    if (errors.length > 0) {
      rejected.push({ row: record.__row, errors });
      continue;
    }

    valid.push({
      event_name: name,
      journey_key: journeyKey,
      surface,
      phase: phase || null,
      step_index: stepIndex,
      variant: variant || null,
      session_journey_id: sessionId || null,
      event_count: count,
      date: String(record.date || record.event_date || "").trim() || null,
      event_timestamp: String(record.event_timestamp ?? "").trim() || null,
      source_row: record.__row,
    });
  }

  return { valid, rejected, headerAudit };
};

const getOrCreateMetric = (metrics, key, surface) => {
  const id = `${key}::${surface}`;
  if (!metrics.has(id)) {
    metrics.set(id, {
      journey_key: key,
      surface,
      event_occurrences: Object.fromEntries([...JOURNEY_EVENT_NAMES].map((name) => [name, 0])),
      unique_sessions: Object.fromEntries([...JOURNEY_EVENT_NAMES].map((name) => [name, new Set()])),
    });
  }
  return metrics.get(id);
};

const sessionCount = (metric, eventName) => metric.unique_sessions[eventName].size;
const occurrenceCount = (metric, eventName) => metric.event_occurrences[eventName];

const rateMode = (metric, denominatorEvent) =>
  sessionCount(metric, denominatorEvent) > 0 ? "unique_sessions" : "event_occurrences";

const measuredCount = (metric, eventName, mode) =>
  mode === "unique_sessions" ? sessionCount(metric, eventName) : occurrenceCount(metric, eventName);

export const detectDuplicateCandidates = (records) => {
  const exact = new Map();
  const terminalBySession = new Map();

  for (const record of records) {
    const exactKey = [
      record.event_timestamp ?? "",
      record.date ?? "",
      record.event_name,
      record.journey_key,
      record.surface,
      record.phase ?? "",
      record.step_index ?? "",
      record.variant ?? "",
      record.session_journey_id ?? "",
    ].join("|");
    exact.set(exactKey, (exact.get(exactKey) ?? 0) + record.event_count);

    if (record.session_journey_id && TERMINAL_EVENT_NAMES.has(record.event_name)) {
      const sessionKey = [record.session_journey_id, record.journey_key, record.event_name].join("|");
      terminalBySession.set(sessionKey, (terminalBySession.get(sessionKey) ?? 0) + record.event_count);
    }
  }

  const exactDuplicates = [...exact.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ key, count }));
  const repeatedTerminalEvents = [...terminalBySession.entries()]
    .filter(([, count]) => count > 1)
    .map(([key, count]) => ({ key, count }));

  return { exactDuplicates, repeatedTerminalEvents };
};

export const summarizeJourneyRecords = (records) => {
  const metrics = new Map();
  for (const record of records) {
    const metric = getOrCreateMetric(metrics, record.journey_key, record.surface);
    metric.event_occurrences[record.event_name] += record.event_count;
    if (record.session_journey_id) metric.unique_sessions[record.event_name].add(record.session_journey_id);
  }

  const rows = [...metrics.values()].map((metric) => {
    const entryMode = rateMode(metric, "journey_viewed");
    const completionMode = rateMode(metric, "journey_started");
    const resultActionMode = rateMode(metric, "journey_result_reached");
    const views = measuredCount(metric, "journey_viewed", entryMode);
    const starts = measuredCount(metric, "journey_started", entryMode);
    const completionStarts = measuredCount(metric, "journey_started", completionMode);
    const results = measuredCount(metric, "journey_result_reached", completionMode);
    const resultSessions = measuredCount(metric, "journey_result_reached", resultActionMode);
    const copied = measuredCount(metric, "journey_result_copied", resultActionMode);
    const printed = measuredCount(metric, "journey_result_printed", resultActionMode);
    const actionSessions = resultActionMode === "unique_sessions"
      ? new Set([
          ...metric.unique_sessions.journey_result_copied,
          ...metric.unique_sessions.journey_result_printed,
        ]).size
      : copied + printed;
    const handoffs = measuredCount(metric, "journey_handoff_opened", resultActionMode);

    return {
      journey_key: metric.journey_key,
      surface: metric.surface,
      measurement_mode: {
        entry: entryMode,
        completion: completionMode,
        result_actions: resultActionMode,
      },
      counts: Object.fromEntries(
        [...JOURNEY_EVENT_NAMES].map((name) => [name, occurrenceCount(metric, name)]),
      ),
      unique_sessions: Object.fromEntries(
        [...JOURNEY_EVENT_NAMES].map((name) => [name, sessionCount(metric, name)]),
      ),
      rates: {
        entry_rate: ratio(starts, views),
        result_completion_rate: ratio(results, completionStarts),
        action_use_rate: ratio(actionSessions, resultSessions),
        handoff_rate: ratio(handoffs, resultSessions),
        unexpected_exit_rate: ratio(
          measuredCount(metric, "journey_exited_unexpectedly", completionMode),
          completionStarts,
        ),
        restart_rate: ratio(
          measuredCount(metric, "journey_restarted", completionMode),
          completionStarts,
        ),
      },
    };
  });

  rows.sort((a, b) => b.counts.journey_viewed - a.counts.journey_viewed || a.journey_key.localeCompare(b.journey_key));
  return rows;
};

const parseCtr = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return 0;
  const parsed = numericValue(raw, Number.NaN);
  if (!Number.isFinite(parsed)) return Number.NaN;
  return raw.includes("%") ? parsed / 100 : parsed > 1 ? parsed / 100 : parsed;
};

export const validateSearchConsoleRecords = (records) => {
  if (records.length === 0) return { valid: [], rejected: [] };
  const columns = new Set(Object.keys(records[0]).filter((key) => key !== "__row"));
  const missing = [...SEARCH_CONSOLE_REQUIRED_COLUMNS].filter((column) => !columns.has(column));
  if (missing.length > 0) throw new Error(`Search Console export is missing columns: ${missing.join(", ")}`);

  const valid = [];
  const rejected = [];
  for (const record of records) {
    const clicks = numericValue(record.clicks, Number.NaN);
    const impressions = numericValue(record.impressions, Number.NaN);
    const ctr = parseCtr(record.ctr);
    const position = numericValue(record.position, Number.NaN);
    const errors = [];
    if (!Number.isFinite(clicks) || clicks < 0) errors.push("invalid clicks");
    if (!Number.isFinite(impressions) || impressions < 0) errors.push("invalid impressions");
    if (!Number.isFinite(ctr) || ctr < 0) errors.push("invalid ctr");
    if (!Number.isFinite(position) || position < 0) errors.push("invalid position");
    if (errors.length > 0) {
      rejected.push({ row: record.__row, errors });
      continue;
    }
    valid.push({
      query: String(record.query ?? "").trim(),
      page: String(record.page ?? "").trim(),
      clicks,
      impressions,
      ctr,
      position,
    });
  }
  return { valid, rejected };
};

const INTENT_PATTERNS = [
  ["medical_bill", /\b(medical bill|hospital bill|billing|eob|explanation of benefits|itemized bill|collections)\b/i],
  ["insurance_denial", /\b(prior authorization|denied|denial|appeal|appeals|coverage delay)\b/i],
  ["compensation", /\b(nurse pay|nursing pay|healthcare worker pay|salary|total compensation|job offer|shift differential)\b/i],
  ["overtime", /\b(overtime|time and a half|extra shift|take home pay|paycheck)\b/i],
  ["benefits", /\b(open enrollment|benefits|deductible|out of pocket|max out of pocket|hsa|fsa|health plan)\b/i],
  ["medicare", /\b(medicare|medigap|medicare advantage|turning 65|part a|part b|part d)\b/i],
  ["retirement", /\b(403b|403\(b\)|401a|401\(a\)|retirement|employer match|roth|traditional)\b/i],
];

export const classifyDecisionIntent = (query) => {
  for (const [intent, pattern] of INTENT_PATTERNS) if (pattern.test(query)) return intent;
  return "other";
};

export const summarizeSearchConsoleRecords = (records) => {
  const totals = records.reduce(
    (result, row) => {
      result.clicks += row.clicks;
      result.impressions += row.impressions;
      result.weightedPosition += row.position * row.impressions;
      return result;
    },
    { clicks: 0, impressions: 0, weightedPosition: 0 },
  );

  const intents = new Map();
  const pages = new Map();
  for (const row of records) {
    const intent = classifyDecisionIntent(row.query);
    const intentMetric = intents.get(intent) ?? { intent, clicks: 0, impressions: 0, weightedPosition: 0 };
    intentMetric.clicks += row.clicks;
    intentMetric.impressions += row.impressions;
    intentMetric.weightedPosition += row.position * row.impressions;
    intents.set(intent, intentMetric);

    const pageMetric = pages.get(row.page) ?? { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
    pageMetric.clicks += row.clicks;
    pageMetric.impressions += row.impressions;
    pageMetric.weightedPosition += row.position * row.impressions;
    pages.set(row.page, pageMetric);
  }

  const finalize = (metric) => ({
    ...metric,
    ctr: ratio(metric.clicks, metric.impressions),
    average_position: metric.impressions > 0 ? round(metric.weightedPosition / metric.impressions, 2) : null,
    weightedPosition: undefined,
  });

  return {
    totals: {
      clicks: totals.clicks,
      impressions: totals.impressions,
      ctr: ratio(totals.clicks, totals.impressions),
      average_position: totals.impressions > 0 ? round(totals.weightedPosition / totals.impressions, 2) : null,
    },
    decision_intents: [...intents.values()].map(finalize).sort((a, b) => b.impressions - a.impressions),
    top_pages: [...pages.values()].map(finalize).sort((a, b) => b.impressions - a.impressions).slice(0, 25),
    top_queries: [...records]
      .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
      .slice(0, 50)
      .map((row) => ({ ...row, intent: classifyDecisionIntent(row.query) })),
  };
};

const percent = (value) => (value === null ? "—" : `${round(value * 100, 1)}%`);

export const renderMarkdownReport = (report) => {
  const lines = [
    "# Community Acquired Finance Product Measurement Report",
    "",
    `Generated: ${report.generated_at}`,
    "",
    "## Data integrity",
    "",
    `- Valid journey rows: ${report.journey.valid_rows}`,
    `- Rejected journey rows: ${report.journey.rejected_rows.length}`,
    `- Exact duplicate candidates: ${report.journey.duplicate_candidates.exactDuplicates.length}`,
    `- Repeated terminal-event candidates: ${report.journey.duplicate_candidates.repeatedTerminalEvents.length}`,
    `- Journey columns: ${report.journey.header_audit.columns.join(", ") || "none"}`,
    "",
    "## Journey performance",
    "",
    "| Journey | Surface | Views | Starts | Entry | Results | Completion | Action use | Handoff | Unexpected exit |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|",
  ];

  for (const row of report.journey.metrics) {
    lines.push(
      `| ${row.journey_key} | ${row.surface} | ${row.counts.journey_viewed} | ${row.counts.journey_started} | ${percent(row.rates.entry_rate)} | ${row.counts.journey_result_reached} | ${percent(row.rates.result_completion_rate)} | ${percent(row.rates.action_use_rate)} | ${percent(row.rates.handoff_rate)} | ${percent(row.rates.unexpected_exit_rate)} |`,
    );
  }

  if (report.search_console) {
    lines.push(
      "",
      "## Search acquisition",
      "",
      `- Clicks: ${report.search_console.summary.totals.clicks}`,
      `- Impressions: ${report.search_console.summary.totals.impressions}`,
      `- CTR: ${percent(report.search_console.summary.totals.ctr)}`,
      `- Average position: ${report.search_console.summary.totals.average_position ?? "—"}`,
      "",
      "### Decision intent",
      "",
      "| Intent | Clicks | Impressions | CTR | Position |",
      "|---|---:|---:|---:|---:|",
    );
    for (const row of report.search_console.summary.decision_intents) {
      lines.push(`| ${row.intent} | ${row.clicks} | ${row.impressions} | ${percent(row.ctr)} | ${row.average_position ?? "—"} |`);
    }
  }

  lines.push(
    "",
    "## Interpretation boundary",
    "",
    "This report summarizes coarse product events and Search Console exports. It does not establish causation, statistical significance, clinical outcomes, financial outcomes, or business value. Low-volume data should be treated as directional. Confirm instrumentation integrity before making product claims.",
    "",
  );
  return lines.join("\n");
};

const parseArguments = (argv) => {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) continue;
    const key = argument.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    values[key] = value;
    index += 1;
  }
  return values;
};

export const buildProductMeasurementReport = ({ journeyCsvText, searchConsoleCsvText = null }) => {
  const journeyParsed = parseCsv(journeyCsvText);
  const journeyValidation = validateJourneyRecords(journeyParsed);
  const duplicateCandidates = detectDuplicateCandidates(journeyValidation.valid);
  const report = {
    schema_version: "caf-product-measurement-v1",
    generated_at: new Date().toISOString(),
    journey: {
      valid_rows: journeyValidation.valid.length,
      rejected_rows: journeyValidation.rejected,
      header_audit: journeyValidation.headerAudit,
      duplicate_candidates: duplicateCandidates,
      metrics: summarizeJourneyRecords(journeyValidation.valid),
    },
    search_console: null,
  };

  if (searchConsoleCsvText) {
    const searchParsed = parseCsv(searchConsoleCsvText);
    const searchValidation = validateSearchConsoleRecords(searchParsed);
    report.search_console = {
      valid_rows: searchValidation.valid.length,
      rejected_rows: searchValidation.rejected,
      summary: summarizeSearchConsoleRecords(searchValidation.valid),
    };
  }

  return report;
};

export const runProductMeasurementReport = async ({ journeyCsv, searchConsoleCsv, outputDirectory }) => {
  const journeyCsvText = await readFile(journeyCsv, "utf8");
  const searchConsoleCsvText = searchConsoleCsv ? await readFile(searchConsoleCsv, "utf8") : null;
  const report = buildProductMeasurementReport({ journeyCsvText, searchConsoleCsvText });
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, "caf-product-measurement-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(path.join(outputDirectory, "caf-product-measurement-report.md"), renderMarkdownReport(report));
  return report;
};

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isDirectRun) {
  const args = parseArguments(process.argv.slice(2));
  if (!args["journey-csv"]) {
    console.error("Usage: node scripts/product-measurement-report.mjs --journey-csv <path> [--search-console-csv <path>] [--out-dir <path>]");
    process.exit(1);
  }
  const report = await runProductMeasurementReport({
    journeyCsv: args["journey-csv"],
    searchConsoleCsv: args["search-console-csv"],
    outputDirectory: args["out-dir"] ?? "artifacts/product-measurement",
  });
  console.log(`Product measurement report generated for ${report.journey.valid_rows} valid journey rows.`);
}
