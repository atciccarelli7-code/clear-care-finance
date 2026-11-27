import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "hospital-bill-anatomy.spec.ts",
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  use: { baseURL: "http://127.0.0.1:4188", screenshot: "only-on-failure", trace: "retain-on-failure", serviceWorkers: "block" },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "tablet-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true } },
  ],
  webServer: { command: "npx vite preview --host 127.0.0.1 --port 4188 --strictPort", url: "http://127.0.0.1:4188", reuseExistingServer: !process.env.CI, timeout: 30000 },
});
