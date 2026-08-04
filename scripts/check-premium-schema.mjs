import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const migration = read("supabase/migrations/202607240001_premium_system_foundation.sql");
const documentMigration = read("supabase/migrations/20260804193729_prelaunch_secure_benefit_document_quarantine.sql");
const documentIndexMigration = read("supabase/migrations/20260804193854_benefit_document_quarantine_foreign_key_indexes.sql");
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
const failures = required
  .filter((token) => !migration.toLowerCase().includes(token.toLowerCase()))
  .map((token) => `Foundation missing: ${token}`);

const documentRequired = [
  "insert into storage.buckets",
  "'benefits-document-staging'",
  "public,",
  "10485760",
  "array['application/pdf', 'text/plain']",
  "create table if not exists public.benefit_document_uploads",
  "foreign key (workspace_id, user_id, product_key)",
  "attested_no_personal_information boolean not null check (attested_no_personal_information)",
  "attested_not_election_record boolean not null check (attested_not_election_record)",
  "jsonb_typeof(extracted_facts) = 'array'",
  "alter table public.benefit_document_uploads force row level security",
  "revoke all on public.benefit_document_uploads from public, anon, authenticated",
  "original client filenames must never be persisted",
  "never raw source text or excerpts",
];
for (const token of documentRequired) {
  if (!documentMigration.toLowerCase().includes(token.toLowerCase())) failures.push(`Document quarantine missing: ${token}`);
}
if (/create\s+policy/i.test(documentMigration)) failures.push("The document quarantine migration must not create direct table or storage policies.");
if (/grant\s+(?:select|insert|update|delete|all).*benefit_document_uploads/i.test(documentMigration)) failures.push("The document quarantine migration must not grant direct document-table access.");
if (!documentIndexMigration.includes("benefit_document_uploads_product_key_idx")) failures.push("Document product foreign-key index is missing.");
if (!documentIndexMigration.includes("benefit_document_uploads_workspace_owner_idx")) failures.push("Document workspace-owner foreign-key index is missing.");

if (failures.length) {
  console.error("Premium schema check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("Premium schema contract passed.");
