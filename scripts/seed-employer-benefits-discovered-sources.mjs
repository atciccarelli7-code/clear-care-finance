import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { createClient } from "@supabase/supabase-js";

const dataPath = resolve("data/employer-benefits/source-registry/healthcare-employer-benefits-guides.json.gz");
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");

const parsePlanYears = (label) => {
  const shortRange = label.match(/(20\d{2})-(\d{2})/);
  if (shortRange) { const start = Number(shortRange[1]); return [start, Math.floor(start / 100) * 100 + Number(shortRange[2])]; }
  const years = label.match(/(?:19|20)\d{2}/g)?.map(Number) ?? [];
  return years.length ? [years[0], years.at(-1)] : [null, null];
};

const classify = (row, start, end) => {
  const title = row.guide_title.toLowerCase();
  const url = row.url.toLowerCase();
  const notes = row.notes.toLowerCase();
  const privatePortal = url.includes("sharepoint.com") || notes.includes("login-protected");
  const pdf = url.includes(".pdf");
  const current = (end ?? start ?? 0) >= 2026 || row.plan_year.toLowerCase() === "current";
  const access_type = privatePortal ? "private_portal" : pdf ? "public_pdf" : "public_webpage";
  const source_status = privatePortal ? "private_employee_portal" : current ? (pdf ? "verified_public_pdf" : "verified_public_webpage") : "outdated_only";
  const document_type = title.includes("summary plan description") || /\bspd\b/.test(title)
    ? "spd"
    : title.includes("action items") || title.includes("newsletter")
      ? "supplemental"
      : title.includes("summary") || title.includes("highlights") || title.includes("overview guide")
        ? "enrollment_summary"
        : access_type === "public_webpage" || title.includes("catalog") || notes.includes("flipbook")
          ? "interactive"
          : "full_guide";
  return { access_type, source_status, document_type };
};

const rows = JSON.parse(gunzipSync(await readFile(dataPath)).toString("utf8"));
const records = rows.map((row) => {
  const [plan_year_start, plan_year_end] = parsePlanYears(row.plan_year);
  const classification = classify(row, plan_year_start, plan_year_end);
  return {
    source_key: createHash("sha256").update(row.url).digest("hex"),
    system_name: row.health_system,
    parent_organization: row.parent_organization || null,
    guide_title: row.guide_title,
    audience: row.audience,
    plan_year_label: row.plan_year,
    plan_year_start,
    plan_year_end,
    state_region: row.state_region || null,
    source_url: row.url,
    notes: row.notes || null,
    ...classification,
    verification_status: ["UNC Health", "ECU Health"].includes(row.health_system) ? "source_verified" : "unverified",
    updated_at: new Date().toISOString(),
  };
});

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const { error } = await supabase.from("employer_benefits_discovered_sources").upsert(records, { onConflict: "source_url" });
if (error) throw error;
const { error: reconcileError } = await supabase.rpc("reconcile_employer_benefits_discovered_sources");
if (reconcileError) throw reconcileError;
console.log(`Seeded ${records.length} employer-benefits discovery sources.`);
