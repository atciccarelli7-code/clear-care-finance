import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve(process.cwd(), "src/data/employer-benefits-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const shouldWrite = process.argv.includes("--write");
const sources = registry.employers.flatMap((employer) =>
  employer.packages.flatMap((benefitsPackage) =>
    benefitsPackage.sources.map((source) => ({
      employer: employer.name,
      employerSlug: employer.slug,
      planYear: benefitsPackage.planYear,
      packageId: benefitsPackage.id,
      ...source,
    })),
  ),
);

const checkSource = async (source) => {
  const startedAt = Date.now();
  let response;
  let method = "HEAD";
  try {
    response = await fetch(source.url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "Community-Acquired-Finance-Source-Monitor/1.0" },
    });
    if (response.status === 405 || response.status === 403) {
      method = "GET";
      response = await fetch(source.url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
        headers: {
          "User-Agent": "Community-Acquired-Finance-Source-Monitor/1.0",
          Range: "bytes=0-1023",
        },
      });
    }
  } catch (error) {
    return {
      ...source,
      checkedAt: new Date().toISOString(),
      ok: false,
      method,
      status: 0,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "unknown_error",
    };
  }

  const contentType = response.headers.get("content-type") || "";
  const finalUrl = response.url || source.url;
  const expectsPdf = new URL(source.url).pathname.toLowerCase().endsWith(".pdf");
  const contentTypeWarning = expectsPdf && contentType && !contentType.toLowerCase().includes("pdf");

  return {
    ...source,
    checkedAt: new Date().toISOString(),
    ok: response.ok && !contentTypeWarning,
    method,
    status: response.status,
    finalUrl,
    redirected: finalUrl !== source.url,
    contentType,
    contentLength: response.headers.get("content-length"),
    etag: response.headers.get("etag"),
    lastModified: response.headers.get("last-modified"),
    durationMs: Date.now() - startedAt,
    warning: contentTypeWarning ? "Expected a PDF content type." : undefined,
  };
};

const results = [];
for (const source of sources) {
  results.push(await checkSource(source));
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  registryReviewedAt: registry.lastReviewedAt,
  sourceCount: results.length,
  healthyCount: results.filter((result) => result.ok).length,
  unhealthyCount: results.filter((result) => !result.ok).length,
  results,
};

console.log(JSON.stringify(report, null, 2));

if (shouldWrite) {
  const outputDir = path.resolve(process.cwd(), "artifacts");
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "employer-benefits-source-health.json"), JSON.stringify(report, null, 2));
  const lines = [
    "# Employer Benefits Source Health",
    "",
    `Generated: ${report.generatedAt}`,
    `Healthy: ${report.healthyCount}/${report.sourceCount}`,
    "",
    "| Employer | Plan year | Source | Status | Content type | Final URL |",
    "|---|---:|---|---:|---|---|",
    ...results.map((result) => `| ${result.employer} | ${result.planYear} | ${result.title.replaceAll("|", "\\|")} | ${result.status || "error"} | ${(result.contentType || result.error || "unknown").replaceAll("|", "\\|")} | ${result.finalUrl || result.url} |`),
    "",
  ];
  fs.writeFileSync(path.join(outputDir, "employer-benefits-source-health.md"), lines.join("\n"));
}

if (report.unhealthyCount > 0) process.exit(1);
