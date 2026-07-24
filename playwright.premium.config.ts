import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "premium-demo-workflow.spec.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  outputDir: "test-results/premium",
  use: {
    baseURL: "http://127.0.0.1:4174",
    ...devices["Desktop Chrome"],
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    serviceWorkers: "block",
  },
  webServer: {
    command: "VITE_PREMIUM_DEV_MOCK_AUTH=true npm run dev -- --host 127.0.0.1 --port 4174",
    port: 4174,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
