import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import commitmentHandler from "../../../api/precommerce-commitment";

const maybeSingle = vi.fn();
const upsert = vi.fn();
const query = {
  select: vi.fn(() => query),
  eq: vi.fn(() => query),
  maybeSingle,
  upsert,
};
const from = vi.fn(() => query);

vi.mock("../../../api/_lib/supabase", () => ({
  ConfigurationUnavailableError: class ConfigurationUnavailableError extends Error {},
  getSupabaseAdmin: () => ({ from }),
}));

const original = { ...process.env };
const response = () => {
  const capture: { status?: number; body?: unknown; headers: Record<string, string> } = { headers: {} };
  const res = {
    status(code: number) { capture.status = code; return res; },
    json(body: unknown) { capture.body = body; },
    setHeader(name: string, value: string) { capture.headers[name] = value; },
  };
  return { res, capture };
};

const validBody = {
  offerKey: "benefits_decision_workspace_29_v2",
  email: "qualified@example.com",
  emailConsent: true,
  priceCommitment: true,
  sessionId: "956397df-65eb-43b4-9ef6-4aa42f83236c",
  evidenceClass: "release_verification",
  website: "",
};

beforeEach(() => {
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_ANON_KEY = "anon";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service";
  process.env.PUBLIC_APP_URL = "https://communityacquiredfinance.com";
  delete process.env.RESEND_API_KEY;
  maybeSingle.mockResolvedValue({ data: null, error: null });
  upsert.mockResolvedValue({ error: null });
  from.mockClear();
  upsert.mockClear();
});

afterEach(() => {
  process.env = { ...original };
  vi.clearAllMocks();
});

describe("pre-commerce commitment API", () => {
  it("rejects foreign origins and weak or expanded commitment payloads", async () => {
    const missing = response();
    await commitmentHandler({ method: "POST", headers: {}, body: validBody }, missing.res);
    expect(missing.capture.status).toBe(403);

    const foreign = response();
    await commitmentHandler({ method: "POST", headers: { origin: "https://attacker.example" }, body: validBody }, foreign.res);
    expect(foreign.capture.status).toBe(403);

    const weak = response();
    await commitmentHandler({ method: "POST", headers: { origin: "https://communityacquiredfinance.com" }, body: { ...validBody, priceCommitment: false } }, weak.res);
    expect(weak.capture.status).toBe(400);
    expect(weak.capture.body).toMatchObject({ code: "invalid_commitment" });
    expect(upsert).not.toHaveBeenCalled();
  });

  it("accepts a fixed release-verification commitment without triggering email", async () => {
    const { res, capture } = response();
    await commitmentHandler({ method: "POST", headers: { origin: "https://communityacquiredfinance.com" }, body: validBody }, res);

    expect(capture.status).toBe(200);
    expect(capture.body).toMatchObject({ ok: true, saved: true, emailDelivered: false, contactSaved: false });
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      product_id: "healthcare-worker-benefits-decision-system",
      offer_version: "benefits_workspace_29_v2",
      price_cents: 2900,
      currency: "usd",
      source: "benefits_decision_result",
      evidence_class: "release_verification",
      status: "active",
      email_consent: true,
      price_commitment: true,
    }), { onConflict: "product_id,email_hash" });
  });

  it("does not let a release test overwrite an existing observed or excluded classification", async () => {
    maybeSingle.mockResolvedValue({ data: { evidence_class: "observed", status: "excluded" }, error: null });
    const { res, capture } = response();
    await commitmentHandler({ method: "POST", headers: { origin: "https://communityacquiredfinance.com" }, body: validBody }, res);

    expect(capture.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({ evidence_class: "observed", status: "excluded" }), expect.anything());
  });

  it("silently accepts the honeypot without a database write", async () => {
    const { res, capture } = response();
    await commitmentHandler({ method: "POST", headers: { origin: "https://communityacquiredfinance.com" }, body: { website: "bot.example" } }, res);
    expect(capture.status).toBe(202);
    expect(capture.body).toMatchObject({ ok: true, saved: false });
    expect(upsert).not.toHaveBeenCalled();
  });
});
