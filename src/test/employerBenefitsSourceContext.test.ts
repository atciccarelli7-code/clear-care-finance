import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearEmployerBenefitsSourceContext,
  EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY,
  loadEmployerBenefitsSourceContext,
  saveEmployerBenefitsSourceContext,
} from "@/lib/employerBenefitsSourceContext";

describe("employer benefits source context", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("persists a versioned public HTTPS source handoff", () => {
    saveEmployerBenefitsSourceContext({
      schemaVersion: 1,
      systemId: "HSI-TEST",
      systemName: "Example Health",
      city: "Charlotte",
      state: "NC",
      selectedSource: {
        sourceId: "source-1",
        title: "2026 Benefits Guide",
        url: "https://benefits.example.org/2026-guide.pdf",
        audience: "Benefits-eligible employees",
        planYearLabel: "2026",
        planYearStart: 2026,
        planYearEnd: 2026,
        stateRegion: "North Carolina",
        documentType: "full_guide",
      },
      savedAt: "2026-08-04T11:00:00.000Z",
    });

    expect(loadEmployerBenefitsSourceContext()).toMatchObject({
      schemaVersion: 1,
      systemId: "HSI-TEST",
      selectedSource: {
        title: "2026 Benefits Guide",
      },
    });
    expect(window.localStorage.getItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY)).toContain("Example Health");
  });

  it.each([
    "javascript:alert(1)",
    "http://benefits.example.org/guide.pdf",
    "https://localhost/guide.pdf",
    "https://employee:password@benefits.example.org/guide.pdf",
  ])("rejects unsafe stored source URL %s", (url) => {
    window.localStorage.setItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY, JSON.stringify({
      schemaVersion: 1,
      systemId: "HSI-TEST",
      systemName: "Example Health",
      selectedSource: {
        sourceId: "source-1",
        title: "Bad source",
        url,
      },
    }));

    expect(loadEmployerBenefitsSourceContext()).toBeNull();
  });

  it("clears attached source context", () => {
    window.localStorage.setItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY, "{}");
    clearEmployerBenefitsSourceContext();
    expect(window.localStorage.getItem(EMPLOYER_BENEFITS_SOURCE_CONTEXT_STORAGE_KEY)).toBeNull();
  });
});
