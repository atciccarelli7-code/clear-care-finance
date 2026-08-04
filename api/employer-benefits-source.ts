import { createHash } from "node:crypto";
import {
  methodNotAllowed,
  parseJsonBody,
  safeError,
  sameOrigin,
  setPrivateHeaders,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http.js";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import {
  ConfigurationUnavailableError,
  getSupabaseAdmin,
} from "./_lib/supabase.js";

type EmployerBenefitsSourceBody = {
  employerName?: unknown;
  sourceUrl?: unknown;
  employeePopulation?: unknown;
  planYear?: unknown;
  sessionId?: unknown;
  website?: unknown;
};

type CoverageStatus =
  | "research_pending"
  | "verified_public_pdf"
  | "verified_public_webpage"
  | "private_employee_portal"
  | "outdated_only";

type DirectoryRow = {
  system_id: string;
  system_name: string;
  home_city: string | null;
  home_state: string | null;
  registry_vintage: number;
  hospital_count: number | null;
  staffed_beds: number | null;
  matched_employer_slug: string | null;
  discovered_source_count: number;
  current_public_source_count: number;
  best_plan_year: number | null;
  coverage_status: CoverageStatus;
};

type DirectorySourceRow = {
  id: string;
  ahrq_system_id: string | null;
  guide_title: string;
  audience: string | null;
  plan_year_label: string | null;
  plan_year_start: number | null;
  plan_year_end: number | null;
  state_region: string | null;
  source_url: string;
  document_type: string;
  source_status: "verified_public_pdf" | "verified_public_webpage";
  verification_status: "source_verified" | "extracted" | "reviewed" | "product_ready";
  updated_at: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ipv4Pattern = /^\d{1,3}(?:\.\d{1,3}){3}$/;

const normalizeText = (value: unknown, maxLength: number) =>
  typeof value === "string"
    ? value.trim().replace(/[<>]/g, "").replace(/\s+/g, " ").slice(0, maxLength)
    : "";

const normalizeDirectoryQuery = (value: unknown) =>
  typeof value === "string"
    ? value.trim().replace(/[^a-zA-Z0-9 .&'()-]/g, "").replace(/\s+/g, " ").slice(0, 80)
    : "";

const normalizePlanYear = (value: unknown) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 2024 && parsed <= 2035 ? parsed : 0;
};

const normalizePublicSourceUrl = (value: unknown) => {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return { url: "", host: "" };
  if (raw.length > 2048) throw new Error("invalid_source_url");

  const parsed = new URL(raw);
  const host = parsed.hostname.toLowerCase();
  if (
    parsed.protocol !== "https:"
    || parsed.username
    || parsed.password
    || host === "localhost"
    || host.endsWith(".local")
    || ipv4Pattern.test(host)
  ) {
    throw new Error("invalid_source_url");
  }

  parsed.hash = "";
  return { url: parsed.toString(), host };
};

const safeVerifiedSourceUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    const host = parsed.hostname.toLowerCase();
    if (
      !["https:", "http:"].includes(parsed.protocol)
      || parsed.username
      || parsed.password
      || host === "localhost"
      || host.endsWith(".local")
      || ipv4Pattern.test(host)
    ) return "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return "";
  }
};

const submissionHash = (input: {
  employerName: string;
  sourceUrl: string;
  employeePopulation: string;
  planYear: number;
}) => createHash("sha256")
  .update(JSON.stringify(input))
  .digest("hex");

const sourceYear = (source: DirectorySourceRow) =>
  source.plan_year_end ?? source.plan_year_start ?? 0;

const handleDirectoryLookup = async (req: ApiRequest, res: ApiResponse) => {
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  const config = getPremiumConfig();
  if (!config.supabase.configured) {
    return safeError(res, 503, "directory_unavailable", "The employer directory is not currently available.");
  }

  const queryValue = Array.isArray(req.query?.q) ? req.query?.q[0] : req.query?.q;
  const query = normalizeDirectoryQuery(queryValue);
  if (query.length < 2) {
    return res.status(200).json({
      ok: true,
      query,
      registryVintage: 2023,
      entries: [],
    });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin.rpc("search_employer_benefits_directory", {
      search_query: query,
      result_limit: 25,
    });

    if (error) throw new Error(`employer_directory_query_failed:${error.code ?? "unknown"}`);

    const directoryRows = (data ?? []) as DirectoryRow[];
    const systemIds = directoryRows.map((row) => row.system_id);
    let sourceRows: DirectorySourceRow[] = [];

    if (systemIds.length) {
      const sourceResult = await admin
        .from("employer_benefits_discovered_sources")
        .select("id,ahrq_system_id,guide_title,audience,plan_year_label,plan_year_start,plan_year_end,state_region,source_url,document_type,source_status,verification_status,updated_at")
        .in("ahrq_system_id", systemIds)
        .in("source_status", ["verified_public_pdf", "verified_public_webpage"])
        .in("verification_status", ["source_verified", "extracted", "reviewed", "product_ready"]);

      if (sourceResult.error) {
        console.error("Employer benefit source detail lookup failed", {
          code: sourceResult.error.code ?? "unknown",
        });
      } else {
        sourceRows = (sourceResult.data ?? []) as DirectorySourceRow[];
      }
    }

    const sourceRowsBySystem = new Map<string, DirectorySourceRow[]>();
    sourceRows.forEach((source) => {
      if (!source.ahrq_system_id || !safeVerifiedSourceUrl(source.source_url)) return;
      const existing = sourceRowsBySystem.get(source.ahrq_system_id) ?? [];
      existing.push(source);
      sourceRowsBySystem.set(source.ahrq_system_id, existing);
    });

    const entries = directoryRows.map((row) => {
      const sources = (sourceRowsBySystem.get(row.system_id) ?? [])
        .sort((left, right) => sourceYear(right) - sourceYear(left) || right.updated_at.localeCompare(left.updated_at))
        .slice(0, 4)
        .map((source) => ({
          sourceId: source.id,
          title: source.guide_title,
          url: safeVerifiedSourceUrl(source.source_url),
          audience: source.audience,
          planYearLabel: source.plan_year_label,
          planYearStart: source.plan_year_start,
          planYearEnd: source.plan_year_end,
          stateRegion: source.state_region,
          documentType: source.document_type,
          sourceStatus: source.source_status,
          verificationStatus: source.verification_status,
        }));

      return {
        systemId: row.system_id,
        name: row.system_name,
        city: row.home_city,
        state: row.home_state,
        registryVintage: row.registry_vintage,
        hospitalCount: row.hospital_count,
        staffedBeds: row.staffed_beds === null ? null : Number(row.staffed_beds),
        matchedEmployerSlug: row.matched_employer_slug,
        discoveredSourceCount: row.discovered_source_count,
        currentPublicSourceCount: row.current_public_source_count,
        bestPlanYear: row.best_plan_year,
        coverageStatus: row.coverage_status,
        sources,
      };
    });

    return res.status(200).json({
      ok: true,
      query,
      registryVintage: 2023,
      entries,
    });
  } catch (error) {
    if (error instanceof ConfigurationUnavailableError) {
      return safeError(res, 503, "directory_unavailable", "The employer directory is not currently available.");
    }
    console.error("Employer benefits directory lookup failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return safeError(res, 503, "directory_unavailable", "The employer directory is not currently available.");
  }
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  if (req.method === "GET") return handleDirectoryLookup(req, res);
  if (req.method !== "POST") return methodNotAllowed(res, ["GET", "POST"]);

  const config = getPremiumConfig();
  if (!sameOrigin(req, config.siteUrl)) {
    return safeError(res, 403, "origin_rejected", "The request origin was rejected.");
  }
  if (!config.supabase.configured) {
    return safeError(res, 503, "source_intake_unavailable", "Employer source intake is not currently available.");
  }

  try {
    const body = parseJsonBody<EmployerBenefitsSourceBody>(req);
    if (typeof body.website === "string" && body.website.trim()) {
      return res.status(202).json({ ok: true, saved: false });
    }

    const employerName = normalizeText(body.employerName, 160);
    const employeePopulation = normalizeText(body.employeePopulation, 160);
    const planYear = normalizePlanYear(body.planYear);
    const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";

    if (employerName.length < 2) {
      return safeError(res, 400, "invalid_employer", "Enter an employer name.");
    }
    if (!planYear) {
      return safeError(res, 400, "invalid_plan_year", "Enter a valid plan year.");
    }
    if (!uuidPattern.test(sessionId)) {
      return safeError(res, 400, "invalid_session", "Refresh the page and try again.");
    }

    let source: { url: string; host: string };
    try {
      source = normalizePublicSourceUrl(body.sourceUrl);
    } catch {
      return safeError(res, 400, "invalid_source_url", "Use a public HTTPS employer or insurer URL. Do not submit an employee-portal link.");
    }

    const hash = submissionHash({
      employerName: employerName.toLowerCase(),
      sourceUrl: source.url,
      employeePopulation: employeePopulation.toLowerCase(),
      planYear,
    });
    const now = new Date().toISOString();
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("employer_benefits_source_submissions").upsert({
      session_id: sessionId,
      submission_hash: hash,
      employer_name: employerName,
      plan_year: planYear,
      employee_population: employeePopulation || null,
      source_url: source.url || null,
      source_host: source.host || null,
      status: "pending",
      updated_at: now,
    }, { onConflict: "session_id,submission_hash" });

    if (error) throw new Error(`employer_source_insert_failed:${error.code ?? "unknown"}`);

    console.info("Employer benefits source submission saved", {
      planYear,
      sourceProvided: Boolean(source.url),
      sourceHost: source.host || undefined,
    });

    return res.status(200).json({ ok: true, saved: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return safeError(res, 400, "invalid_json", "The request body is invalid.");
    }
    if (error instanceof ConfigurationUnavailableError) {
      return safeError(res, 503, "source_intake_unavailable", "Employer source intake is not currently available.");
    }
    console.error("Employer benefits source submission failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return safeError(res, 503, "source_intake_unavailable", "Employer source intake is not currently available.");
  }
}
