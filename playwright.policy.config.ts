import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
const externalPreview = process.env.CAF_POLICY_PREVIEW_URL;

// Isolate this review from other CAF preview servers in parallel worktrees.
export default defineConfig({
  ...base,
  reporter: "list",
  testMatch: "medicare-medicaid-changes.spec.ts",
  use: { ...base.use, baseURL: externalPreview || "http://127.0.0.1:4317", video: "off" },
  webServer: externalPreview ? undefined : {
    command: "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4317 --strictPort",
    port: 4317,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
