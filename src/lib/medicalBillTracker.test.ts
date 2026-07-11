import { describe, expect, it } from "vitest";
import {
  createMedicalBillTrackerEntry,
  exportMedicalBillTrackerText,
  normalizeMedicalBillTrackerEntries,
  parseMedicalBillTrackerEntries,
  sortMedicalBillTrackerEntries,
  type MedicalBillTrackerDraft,
} from "@/lib/medicalBillTracker";

const draft = (overrides: Partial<MedicalBillTrackerDraft> = {}): MedicalBillTrackerDraft => ({
  contactDate: "2026-07-11",
  contactType: "provider_billing",
  departmentRole: "Billing office",
  representativeId: "AB",
  callReference: "CALL-42",
  outcome: "documents_requested",
  documentsRequested: ["itemized_bill", "eob_or_msn"],
  promisedAction: "Send the itemized bill through the portal",
  expectedResponseDate: "2026-07-15",
  appealDeadline: "",
  followUpDate: "2026-07-16",
  status: "waiting_for_documents",
  ...overrides,
});

describe("medical bill tracker", () => {
  it("creates a structured entry and trims free-text fields", () => {
    const entry = createMedicalBillTrackerEntry(
      draft({ departmentRole: "  Billing    office  ", representativeId: "  AB  " }),
      new Date("2026-07-11T12:00:00.000Z"),
    );

    expect(entry.departmentRole).toBe("Billing office");
    expect(entry.representativeId).toBe("AB");
    expect(entry.createdAt).toBe("2026-07-11T12:00:00.000Z");
    expect(entry.documentsRequested).toEqual(["itemized_bill", "eob_or_msn"]);
  });

  it("rejects malformed stored records and unsupported enum values", () => {
    const normalized = normalizeMedicalBillTrackerEntries([
      { ...draft(), id: "good", createdAt: "2026-07-11T12:00:00.000Z", updatedAt: "2026-07-11T12:00:00.000Z" },
      { ...draft(), id: "bad", contactType: "hospital_name" },
      null,
    ]);

    expect(normalized).toHaveLength(1);
    expect(normalized[0].id).toBe("good");
  });

  it("returns an empty list for invalid local storage JSON", () => {
    expect(parseMedicalBillTrackerEntries("not-json")).toEqual([]);
    expect(parseMedicalBillTrackerEntries(null)).toEqual([]);
  });

  it("sorts by the next actionable date", () => {
    const later = createMedicalBillTrackerEntry(draft({ followUpDate: "2026-07-20" }));
    const sooner = createMedicalBillTrackerEntry(draft({ followUpDate: "2026-07-13" }));

    expect(sortMedicalBillTrackerEntries([later, sooner]).map((entry) => entry.followUpDate)).toEqual([
      "2026-07-13",
      "2026-07-20",
    ]);
  });

  it("exports only the structured tracker fields", () => {
    const entry = createMedicalBillTrackerEntry(draft());
    const text = exportMedicalBillTrackerText([entry]);

    expect(text).toContain("Medical Bill Call and Deadline Tracker");
    expect(text).toContain("Contact type: Provider Billing");
    expect(text).toContain("Documents requested: Itemized Bill, Eob Or Msn");
    expect(text).not.toContain("diagnosis");
    expect(text).not.toContain("member ID");
  });
});
