import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/202608110001_precommerce_demand_validation_v2.sql", "utf8");

describe("pre-commerce demand migration contract", () => {
  it("adds only the three fixed v2 anonymous decision states and test isolation", () => {
    expect(migration).toContain("'precommerce_offer_viewed'");
    expect(migration).toContain("'precommerce_offer_engaged'");
    expect(migration).toContain("'precommerce_commitment_started'");
    expect(migration).toContain("'benefits_decision_result'");
    expect(migration).toContain("'benefits_workspace_29_v2'");
    expect(migration).toContain("'benefits_workspace_29_v2_release_verification'");
    expect(migration).toContain("destination_id = 'offer_details'");
    expect(migration).toContain("destination_id = 'commitment_form'");
  });

  it("keeps the commitment store service-only with forced RLS", () => {
    expect(migration).toContain("alter table public.benefits_offer_commitments enable row level security");
    expect(migration).toContain("alter table public.benefits_offer_commitments force row level security");
    expect(migration).toContain("revoke all on table public.benefits_offer_commitments from public, anon, authenticated, service_role");
    expect(migration).toContain("grant select, insert, update, delete on table public.benefits_offer_commitments to service_role");
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+\s+to\s+(anon|authenticated)/i);
    expect(migration).not.toMatch(/create\s+policy/i);
  });

  it("fixes price, proposition source, statement, evidence class, and exclusions", () => {
    expect(migration).toContain("offer_version = 'benefits_workspace_29_v2' and source = 'benefits_decision_result'");
    expect(migration).toContain("commitment_statement_version = 'would_consider_benefits_workspace_29_v2'");
    expect(migration).toContain("evidence_class in ('observed', 'release_verification')");
    expect(migration).toContain("status in ('active', 'unsubscribed', 'excluded')");
    expect(migration).toContain("'founder', 'friend_family', 'synthetic', 'duplicate', 'other'");
  });

  it("does not add answer, employer, plan, health, payment, URL, or free-text fields", () => {
    const addedColumns = migration.match(/add column if not exists [^;]+;/s)?.[0] ?? "";
    expect(addedColumns).toContain("evidence_class");
    expect(addedColumns).toContain("exclusion_reason");
    expect(addedColumns).not.toMatch(/salary|wage|benefit_amount|medical|diagnosis|member_id|claim|payment|card|url|notes|free_text/i);
  });
});
