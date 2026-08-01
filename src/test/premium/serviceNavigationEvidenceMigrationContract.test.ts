import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "supabase/migrations/202607310002_service_navigation_evidence.sql";

describe("service navigation evidence migration contract", () => {
  it("extends the private evidence table without granting public access", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("alter table public.growth_events enable row level security");
    expect(migration).toContain("alter table public.growth_events force row level security");
    expect(migration).toContain(
      "revoke all on table public.growth_events from public, anon, authenticated, service_role",
    );
    expect(migration).toContain("grant select, insert, delete on table public.growth_events to service_role");
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+\s+to\s+(anon|authenticated)/i);
    expect(migration).not.toMatch(/grant\s+[^;]*(update|truncate|trigger|references)[^;]*\s+to\s+service_role/i);
    expect(migration).not.toMatch(/create\s+policy/i);
  });

  it("allowlists only fixed navigation events, surfaces, variants, and destination IDs", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("'service_navigation_opened'");
    expect(migration).toContain("'service_navigation_destination_selected'");
    expect(migration).toContain("'desktop_header'");
    expect(migration).toContain("'mobile_header'");
    expect(migration).toContain("'service_navigation_v1'");
    expect(migration).toContain("'benefits_command_center'");
    expect(migration).toContain("'medical_bill_review'");
    expect(migration).not.toMatch(/\b(email|ip_address|user_agent|referrer|query_string|amount|answer|diagnosis|medication)\b\s+(text|json|jsonb|numeric|inet)/i);
  });

  it("keeps desktop and mobile session signals independently deduplicated", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("drop index if exists public.growth_events_session_signal_unique");
    expect(migration).toMatch(/session_id,\s*event_name,\s*surface,\s*coalesce\(destination_id, ''\),\s*variant/s);
  });
});
