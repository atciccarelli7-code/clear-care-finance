import { describe, expect, it } from "vitest";
import manifest from "../../public/patient-education/capability-manifest.json";

describe("paused institutional patient education boundary", () => {
  it("records no active buyer intake, sales, or patient use", () => {
    expect(manifest.status).toBe("paused_future_option");
    expect(manifest.institutionalAsset.activeSales).toBe(false);
    expect(manifest.institutionalAsset.activeBuyerIntake).toBe(false);
    expect(manifest.institutionalAsset.patientUseApproved).toBe(false);
    expect(manifest.institutionalAsset.pilotReady).toBe(false);
  });
});
