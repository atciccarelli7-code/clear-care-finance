import {
  methodNotAllowed,
  safeError,
  setPrivateHeaders,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http.js";
import { getPremiumConfig } from "./_lib/premiumConfig.js";
import {
  ConfigurationUnavailableError,
  getSupabaseAdmin,
} from "./_lib/supabase.js";

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

const normalizeQuery = (value: unknown) =>
  typeof value === "string"
    ? value.trim().replace(/[^a-zA-Z0-9 .&'()-]/g, "").replace(/\s+/g, " ").slice(0, 80)
    : "";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateHeaders(res);
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  const config = getPremiumConfig();
  if (!config.supabase.configured) {
    return safeError(res, 503, "directory_unavailable", "The employer directory is not currently available.");
  }

  const queryValue = Array.isArray(req.query?.q) ? req.query?.q[0] : req.query?.q;
  const query = normalizeQuery(queryValue);
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
}
