import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const migration = readFileSync(path.join(root, "supabase/migrations/202607240001_premium_system_foundation.sql"), "utf8");
const required = [
  "create table if not exists public.profiles",
  "create table if not exists public.products",
  "create table if not exists public.entitlements",
  "create table if not exists public.workspaces",
  "create table if not exists public.stripe_events",
  "create table if not exists public.premium_modules",
  "alter table public.entitlements enable row level security",
  "alter table public.workspaces enable row level security",
  "workspaces_select_own_entitled",
  "entitlements_select_own",
  "unique (user_id, product_key)",
  "stripe_event_id text primary key",
  "revoke all on public.entitlements from anon, authenticated",
];
const failures = required.filter((token) => !migration.toLowerCase().includes(token.toLowerCase()));
if (failures.length) {
  console.error("Premium schema check failed:\n");
  failures.forEach((token) => console.error(`- Missing: ${token}`));
  process.exit(1);
}
console.log("Premium schema contract passed.");
