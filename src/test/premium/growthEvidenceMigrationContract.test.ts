import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "supabase/migrations/202607310001_growth_evidence_events.sql";

describe("growth evidence migration contract", () => {
  it("keeps the evidence table private and service-only", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("alter table public.growth_events enable row level security");
    expect(migration).toContain("alter table public.growth_events force row level security");
    expect(migration).toContain("revoke all on table public.growth_events from public, anon, authenticated");
    expect(migration).toContain("grant select, insert, delete on table public.growth_events to service_role");
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+\s+to\s+(anon|authenticated)/i);
    expect(migration).not.toMatch(/create\s+policy/i);
  });

  it("stores only fixed anonymous event dimensions", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("event_id uuid primary key");
    expect(migration).toContain("session_id uuid not null");
    expect(migration).toContain("event_name text not null");
    expect(migration).toContain("destination_id text");
    expect(migration).not.toMatch(/\b(email|ip_address|user_agent|referrer|query_string|amount|answer|diagnosis|medication)\b\s+(text|json|jsonb|numeric|inet)/i);
  });
});
