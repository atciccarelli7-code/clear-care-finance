import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const sentinels = [
  "CAF_PREMIUM_PROTECTED_SENTINEL_7b2c91e4",
  "CAF_PREMIUM_DEVELOPMENT_CONTENT_SENTINEL_84f6c1d9",
];
const failures = [];

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });

if (!statSync(dist, { throwIfNoEntry: false })?.isDirectory()) {
  console.error("Premium boundary check requires a production build in dist.");
  process.exit(1);
}

for (const file of walk(dist)) {
  if (!/\.(?:js|css|html|json|xml|map)$/i.test(file)) continue;
  const content = readFileSync(file, "utf8");
  for (const sentinel of sentinels) {
    if (content.includes(sentinel)) failures.push(`${path.relative(root, file)} contains protected sentinel ${sentinel}.`);
  }
  if (/SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET/.test(content)) {
    failures.push(`${path.relative(root, file)} contains a server-only environment-variable name.`);
  }
}

if (failures.length) {
  console.error("Premium content boundary check failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Premium content boundary passed across ${walk(dist).length} production files.`);
