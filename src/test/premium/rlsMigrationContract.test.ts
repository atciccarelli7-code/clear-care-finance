import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migrationPath =
  "supabase/migrations/202607270001_restore_premium_admin_policy_execution.sql";

describe("premium RLS migration contract", () => {
  it("allows authenticated policy evaluation without exposing the helper to anonymous callers", () => {
    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toContain("grant usage on schema private to authenticated");
    expect(migration).toContain(
      "grant execute on function private.is_premium_admin() to authenticated",
    );
    expect(migration).toContain(
      "revoke execute on function private.is_premium_admin() from public, anon, authenticated",
    );
    expect(migration).not.toMatch(/grant\s+execute[^;]+\s+to\s+anon/i);
    expect(migration).not.toMatch(/grant\s+usage[^;]+\s+to\s+anon/i);
  });
});
