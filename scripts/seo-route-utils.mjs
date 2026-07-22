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

// New consumer guide articles are registered through the article runtime manifest.
// Preserve the existing Benefits Command Center release exception.
// Paused institutional patient-education routes are redirects and never enter the sitemap.
export const ADDITIONAL_INDEXABLE_ROUTES = ["/tools/benefits-command-center"];
export const ADDITIONAL_NON_INDEXED_PRERENDER_ROUTES = [
  "/patients-families/diagnosis-explained/heart-failure",
  "/patients-families/diagnosis-explained/copd",
  "/patients-families/diagnosis-explained/acute-kidney-injury",
  "/patients-families/diagnosis-explained/atrial-fibrillation",
  "/patients-families/diagnosis-explained/gastrointestinal-bleeding",
  "/patients-families/diagnosis-explained/bowel-obstruction",
  "/patients-families/diagnosis-explained/hypertension",
  "/patients-families/diagnosis-explained/dyslipidemia",
  "/patients-families/diagnosis-explained/kidney-failure",
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
  const registryRoutes = Array.from(new Set([...getIndexableRoutes(), ...ADDITIONAL_INDEXABLE_ROUTES].map(normalizeRoute)));
  const canonicalRoutes = registryRoutes.filter((route) => !permanentRedirects.has(route));
  return { permanentRedirects, registryRoutes, canonicalRoutes: Array.from(new Set(canonicalRoutes)) };
};
