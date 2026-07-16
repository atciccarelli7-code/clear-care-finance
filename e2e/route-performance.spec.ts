import { expect, test } from "@playwright/test";
import { ROUTE_PERFORMANCE_BUDGETS } from "./route-performance-budgets";

declare global {
  interface Window {
    __cafPerformance?: { lcpMs: number; cls: number; longTaskMs: number };
  }
}

test.describe("mobile-controlling route-group performance governance", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/_vercel/**", async (route) => {
      const isScript = new URL(route.request().url()).pathname.endsWith(".js");
      await route.fulfill(isScript ? { status: 200, contentType: "application/javascript", body: "" } : { status: 204, body: "" });
    });
    await page.addInitScript(() => {
      localStorage.setItem("caf-privacy-consent-v1", "necessary");
      window.__cafPerformance = { lcpMs: 0, cls: 0, longTaskMs: 0 };
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const latest = entries.at(-1);
          if (latest && window.__cafPerformance) window.__cafPerformance.lcpMs = Math.round(latest.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as PerformanceEntry & { value?: number; hadRecentInput?: boolean };
            if (!layoutShift.hadRecentInput && window.__cafPerformance) window.__cafPerformance.cls += layoutShift.value ?? 0;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (window.__cafPerformance) window.__cafPerformance.longTaskMs += entry.duration;
        }).observe({ type: "longtask", buffered: true });
      } catch {
        // Unsupported performance-entry types remain zero and are documented in the baseline output.
      }
    });
  });

  for (const budget of ROUTE_PERFORMANCE_BUDGETS) {
    test(`${budget.group}: ${budget.path}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];
      const failedApplicationRequests: string[] = [];
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("requestfailed", (request) => {
        const url = new URL(request.url());
        if (url.origin === "http://127.0.0.1:4173" && !request.failure()?.errorText.includes("ERR_ABORTED")) failedApplicationRequests.push(url.pathname);
      });
      page.on("response", (response) => {
        const url = new URL(response.url());
        if (url.origin === "http://127.0.0.1:4173" && response.status() >= 400) failedApplicationRequests.push(`${response.status()} ${url.pathname}`);
      });

      await page.goto(budget.path, { waitUntil: "networkidle" });
      await page.waitForTimeout(750);
      await expect(page.locator("h1")).toHaveCount(1);

      const metrics = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
        const bytesFor = (entry: PerformanceResourceTiming) => entry.transferSize || entry.encodedBodySize;
        return {
          lcpMs: window.__cafPerformance?.lcpMs ?? 0,
          cls: Number((window.__cafPerformance?.cls ?? 0).toFixed(4)),
          longTaskMs: Math.round(window.__cafPerformance?.longTaskMs ?? 0),
          javascriptBytes: resources.filter((entry) => new URL(entry.name).pathname.endsWith(".js")).reduce((sum, entry) => sum + bytesFor(entry), 0),
          totalBytes: resources.reduce((sum, entry) => sum + bytesFor(entry), 0),
          requestCount: resources.length + 1,
        };
      });

      console.log(`PERF_BASELINE ${JSON.stringify({ group: budget.group, path: budget.path, ...metrics })}`);
      expect(metrics.lcpMs).toBeGreaterThan(0);
      expect(metrics.lcpMs).toBeLessThanOrEqual(budget.lcpMs);
      expect(metrics.cls).toBeLessThanOrEqual(budget.cls);
      expect(metrics.longTaskMs).toBeLessThanOrEqual(budget.longTaskMs);
      expect(metrics.javascriptBytes).toBeLessThanOrEqual(budget.javascriptBytes);
      expect(metrics.totalBytes).toBeLessThanOrEqual(budget.totalBytes);
      expect(metrics.requestCount).toBeLessThanOrEqual(budget.requestCount);
      expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
      expect(pageErrors, pageErrors.join("\n")).toEqual([]);
      expect(failedApplicationRequests, failedApplicationRequests.join("\n")).toEqual([]);
    });
  }
});
