import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDir = path.resolve("dist/assets");
const maxEntryBytes = 500 * 1024;
const maxChunkBytes = 600 * 1024;

const files = (await readdir(assetsDir)).filter((file) => file.endsWith(".js"));
const sizes = await Promise.all(
  files.map(async (file) => ({
    file,
    bytes: (await stat(path.join(assetsDir, file))).size,
  })),
);

sizes.sort((a, b) => b.bytes - a.bytes);

const entryChunks = sizes.filter(({ file }) => /^index-.*\.js$/.test(file));
const oversizedEntries = entryChunks.filter(({ bytes }) => bytes > maxEntryBytes);
const oversizedChunks = sizes.filter(({ bytes }) => bytes > maxChunkBytes);

const formatKiB = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;

console.log("Largest JavaScript chunks:");
for (const item of sizes.slice(0, 10)) {
  console.log(`- ${item.file}: ${formatKiB(item.bytes)}`);
}

const failures = [];
if (!entryChunks.length) failures.push("No index-*.js entry chunk was found in dist/assets.");
for (const item of oversizedEntries) {
  failures.push(`${item.file} exceeds the ${formatKiB(maxEntryBytes)} entry budget at ${formatKiB(item.bytes)}.`);
}
for (const item of oversizedChunks) {
  failures.push(`${item.file} exceeds the ${formatKiB(maxChunkBytes)} per-chunk budget at ${formatKiB(item.bytes)}.`);
}

if (failures.length) {
  console.error("\nBundle budget failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nBundle budget passed: entry <= ${formatKiB(maxEntryBytes)}, every JS chunk <= ${formatKiB(maxChunkBytes)}.`);
