import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");
const failures = [];

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const [indexHtml, robotsTxt, adsTxt, vercelJsonRaw, seoRegistry, privacyPolicy] = await Promise.all([
  read("index.html"),
  read("public/robots.txt"),
  read("public/ads.txt"),
  read("vercel.json"),
  read("src/lib/seoRegistry.ts"),
  read("src/pages/PrivacyPolicy.tsx"),
]);

let vercelConfig;
try {
  vercelConfig = JSON.parse(vercelJsonRaw);
} catch (error) {
  failures.push(`vercel.json is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
}

assert(
  !/<script[^>]+src=["']https:\/\/www\.googletagmanager\.com\/gtag\/js/i.test(indexHtml),
  "Google Analytics must not be downloaded by a static script tag before consent.",
);
assert(
  indexHtml.includes("window.__cafLoadGoogleAnalytics"),
  "index.html must expose the consent-gated Google Analytics loader.",
);
assert(
  !indexHtml.includes('"@type": "Organization"'),
  "Static Organization schema must stay out of index.html so prerendered routes do not duplicate it.",
);
assert(
  robotsTxt.includes("Sitemap: https://communityacquiredfinance.com/sitemap.xml"),
  "robots.txt must reference the canonical production sitemap.",
);
assert(
  /^google\.com,\s*pub-\d+,\s*DIRECT,\s*f08c47fec0942fa0\s*$/m.test(adsTxt),
  "ads.txt must contain a valid direct Google publisher declaration.",
);

const requiredSecurityHeaders = new Map([
  ["X-Content-Type-Options", "nosniff"],
  ["X-Frame-Options", "DENY"],
  ["Referrer-Policy", "strict-origin-when-cross-origin"],
  ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()"],
]);

const configuredHeaders = new Map(
  (vercelConfig?.headers ?? [])
    .flatMap((rule) => rule.headers ?? [])
    .map((header) => [header.key, header.value]),
);

for (const [key, expectedValue] of requiredSecurityHeaders) {
  assert(
    configuredHeaders.get(key) === expectedValue,
    `vercel.json must set ${key} to ${expectedValue}.`,
  );
}

const requiredTrustRoutes = [
  "/about",
  "/contact",
  "/methodology",
  "/privacy-policy",
  "/terms-of-use",
  "/editorial-policy",
  "/disclosures",
  "/accessibility",
];

for (const route of requiredTrustRoutes) {
  assert(
    seoRegistry.includes(`"${route}"`),
    `SEO registry must keep the trust route ${route} indexable and discoverable.`,
  );
}

assert(
  privacyPolicy.includes("Google Analytics code is loaded only after a visitor chooses Allow analytics"),
  "Privacy Policy must accurately describe consent-gated Google Analytics loading.",
);

if (failures.length > 0) {
  console.error("Publication readiness checks failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Publication readiness checks passed.");
