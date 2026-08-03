import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath = "supabase/migrations/202608030001_benefits_offer_validation.sql";

describe("benefits offer validation migration contract", () => {
  it("keeps anonymous offer evidence fixed and consent-gated", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("'benefits_offer_viewed'");
    expect(migration).toContain("'benefits_offer_cta_opened'");
    expect(migration).toContain("'benefits_decision_offer'");
    expect(migration).toContain("'benefits_offer_29_v1'");
    expect(migration).toContain("'early_access_commitment_form'");
    expect(migration).not.toMatch(/growth_events[\s\S]*\b(email|employer|plan_name|salary|medical|payment)\b\s+(text|json|jsonb|numeric)/i);
  });

  it("creates a service-role-only commitment table with exact offer controls", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("create table if not exists public.benefits_offer_commitments");
    expect(migration).toContain("price_cents integer not null default 2900");
    expect(migration).toContain("source = 'total_compensation_comparison'");
    expect(migration).toContain("email_consent is true and price_commitment is true");
    expect(migration).toContain("commitment_statement_version = 'would_consider_29_v1'");
    expect(migration).toContain("alter table public.benefits_offer_commitments enable row level security");
    expect(migration).toContain("alter table public.benefits_offer_commitments force row level security");
    expect(migration).toContain(
      "revoke all on table public.benefits_offer_commitments from public, anon, authenticated, service_role",
    );
    expect(migration).toContain(
      "grant select, insert, update, delete on table public.benefits_offer_commitments to service_role",
    );
    expect(migration).not.toMatch(/grant\s+(select|insert|update|delete)[^;]+\s+to\s+(anon|authenticated)/i);
    expect(migration).not.toMatch(/create\s+policy/i);
  });

  it("deduplicates commitments by normalized email while preserving session measurement", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toMatch(/unique index[^;]+\(product_id, email_hash\)/s);
    expect(migration).toMatch(/index[^;]+\(product_id, session_id, created_at desc\)/s);
    expect(migration).not.toMatch(/unique index[^;]+\(product_id, session_id\)/s);
  });

  it("does not create columns for employer, plan, medical, payment, or free-text detail", () => {
    const migration = readFileSync(migrationPath, "utf8");
    const tableDefinition = migration.match(/create table if not exists public\.benefits_offer_commitments \(([\s\S]*?)\n\);/)?.[1] ?? "";

    expect(tableDefinition).not.toMatch(/\b(employer|plan|salary|wage|benefit_amount|medical|diagnosis|member_id|claim|payment|card|notes|free_text)\b/i);
  });
});
