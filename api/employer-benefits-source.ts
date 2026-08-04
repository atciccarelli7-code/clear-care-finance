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
  coverage_status:
    | "research_pending"
    | "verified_public_pdf"
    | "verified_public_webpage"
    | "private_employee_portal"
    | "outdated_only";
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

const submissionHash = (input: {
  employerName: string;
  sourceUrl: string;
  employeePopulation: string;
  planYear: number;
}) => createHash("sha256")
  .update(JSON.stringify(input))
  .digest("hex");

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
    const searchPattern = `%${query}%`;
    const { data, error } = await admin
      .from("employer_benefits_directory")
      .select("system_id,system_name,home_city,home_state,registry_vintage,hospital_count,staffed_beds,matched_employer_slug,discovered_source_count,current_public_source_count,best_plan_year,coverage_status")
      .or(`system_name.ilike.${searchPattern},search_terms.ilike.${searchPattern}`)
      .order("current_public_source_count", { ascending: false })
      .order("hospital_count", { ascending: false, nullsFirst: false })
      .order("system_name", { ascending: true })
      .limit(25);

    if (error) throw new Error(`employer_directory_query_failed:${error.code ?? "unknown"}`);

    const entries = ((data ?? []) as DirectoryRow[]).map((row) => ({
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
    }));

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
