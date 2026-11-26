import base from "./playwright.config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  ...base,
  testMatch: "editorial-visuals.spec.ts",
  use: { ...base.use, baseURL: "http://127.0.0.1:4187" },
  webServer: undefined,
});
