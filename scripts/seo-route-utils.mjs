import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const normalizeRoute = (value) => {
  if (!value || value === "/") return "/";
  const clean = value.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};

const isLiteralRoute = (source) =>
  typeof source === "string" &&
  source.startsWith("/") &&
  !source.includes(":") &&
  !source.includes("*") &&
  !source.includes("(");

// Product routes can be staged here while retaining one release-time route source for sitemap,
// prerender, redirect reconciliation, and search-readiness validation.
export const ADDITIONAL_INDEXABLE_ROUTES = [
  "/tools/benefits-command-center",
  "/for-organizations/patient-education-systems",
];

// Controlled product reviews need route-matched HTML to avoid hydration errors, but must not
// enter the sitemap or search index before their release gates are complete.
export const ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES = [
  "/for-organizations/patient-education-systems/blood-thinner-readiness",
];

export const loadPermanentRedirects = async () => {
  const configPath = path.join(repositoryRoot, "vercel.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const redirects = new Map();

  for (const entry of config.redirects ?? []) {
    if (!entry?.permanent || !isLiteralRoute(entry.source) || typeof entry.destination !== "string") continue;
    redirects.set(normalizeRoute(entry.source), normalizeRoute(entry.destination));
  }

  return redirects;
};

export const getCanonicalRoutes = async (getIndexableRoutes) => {
  const permanentRedirects = await loadPermanentRedirects();
  const registryRoutes = Array.from(
    new Set([...getIndexableRoutes(), ...ADDITIONAL_INDEXABLE_ROUTES].map(normalizeRoute)),
  );
  const canonicalRoutes = registryRoutes.filter((route) => !permanentRedirects.has(route));

  return {
    permanentRedirects,
    registryRoutes,
    canonicalRoutes: Array.from(new Set(canonicalRoutes)),
  };
};
