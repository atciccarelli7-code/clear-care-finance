import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync(
  "supabase/migrations/202608120001_hospital_to_home_journey_evidence.sql",
  "utf8",
);

describe("hospital-to-home journey evidence migration contract", () => {
  it("extends only the bounded journey and lifecycle allowlists", () => {
    expect(migration).toContain("'hospital_to_home'");
    expect(migration).toContain("'journey_result_saved'");
    expect(migration).toContain("drop constraint if exists journey_events_event_name_check");
    expect(migration).toContain("drop constraint if exists journey_events_journey_key_check");
    expect(migration).not.toMatch(/create\s+table|create\s+policy|grant\s+|alter\s+table[^;]+(enable|disable)\s+row\s+level\s+security/i);
  });

  it("does not add answer, identity, or healthcare fields", () => {
    expect(migration).not.toMatch(/add\s+column/i);
    expect(migration).not.toMatch(/\b(email|name|diagnosis|medication|member_id|claim|answer|brief|result_text)\b\s+(text|json|jsonb|uuid)/i);
  });
});
