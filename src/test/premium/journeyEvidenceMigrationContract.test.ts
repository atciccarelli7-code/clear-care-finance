import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath = "supabase/migrations/202608100001_journey_evidence_events.sql";

describe("journey evidence migration contract", () => {
  it("keeps the table private and service-role least-privileged", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("alter table public.journey_events enable row level security");
    expect(migration).toContain("alter table public.journey_events force row level security");
    expect(migration).toContain(
      "revoke all on table public.journey_events from public, anon, authenticated, service_role",
    );
    expect(migration).toContain("grant select, insert, delete on table public.journey_events to service_role");
    expect(migration).toContain("'hospital_financial_assistance'");
    expect(migration).toContain("'medicare_coverage_decision'");
    expect(migration).toContain("variant is null or variant = 'flagship_funnel_v1'");
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+\s+to\s+(anon|authenticated)/i);
    expect(migration).not.toMatch(/grant\s+[^;]*(update|truncate|trigger|references)[^;]*\s+to\s+service_role/i);
    expect(migration).not.toMatch(/create\s+policy/i);
  });

  it("stores only bounded anonymous lifecycle dimensions", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("event_id uuid primary key");
    expect(migration).toContain("session_journey_id text not null");
    expect(migration).toContain("step_index smallint");
    expect(migration).not.toMatch(/\b(email|ip_address|user_agent|referrer|query_string|url|amount|answer|diagnosis|medication|employer|plan_name)\b\s+(text|json|jsonb|numeric|inet)/i);
  });
});
