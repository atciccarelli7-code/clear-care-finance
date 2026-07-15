import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";
import { getCanonicalRoutes, repositoryRoot } from "./seo-route-utils.mjs";

const SITE_URL = "https://communityacquiredfinance.com";
const WRITE_AUDIT = process.argv.includes("--write-audit");
const failures = [];
const warnings = [];

const read = (relativePath) => readFile(path.join(repositoryRoot, relativePath), "utf8");
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const warn = (condition, message) => {
  if (!condition) warnings.push(message);
};
const normalizeRoute = (value) => {
  if (!value || value === "/") return "/";
  const clean = value.split("?")[0].split("#")[0].replace(/\/+$/, "");
  return clean || "/";
};
const escapeCell = (value) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
const titleFromRoute = (route) =>
  route === "/"
    ? "Home"
    : route
        .split("/")
        .filter(Boolean)
        .at(-1)
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") ?? route;

const [adsTxt, sitemapXml, routeAwareSource, auditSnapshot] = await Promise.all([
  read("public/ads.txt"),
  read("public/sitemap.xml"),
  read("src/lib/routeAwareAdSense.ts"),
  read("docs/adsense-readiness-audit.md").catch(() => ""),
]);

const vite = await createServer({
  root: repositoryRoot,
  mode: "production",
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true },
});

try {
  const seoRegistry = await vite.ssrLoadModule("/src/lib/seoRegistry.ts");
  const governanceModule = await vite.ssrLoadModule("/src/lib/contentGovernance.ts");
  const publicationQuality = await vite.ssrLoadModule("/src/lib/publicationQuality.ts");
  const articleModule = await vite.ssrLoadModule("/src/data/allArticles.ts");
  const voiceNoteModule = await vite.ssrLoadModule("/src/data/articleVoiceNotes.ts");

  const { permanentRedirects, registryRoutes, canonicalRoutes } = await getCanonicalRoutes(
    seoRegistry.getIndexableRoutes,
  );
  const canonicalSet = new Set(canonicalRoutes);
  const explicitAdRoutes = governanceModule.getExplicitAdEligibleRoutes().map(normalizeRoute);
  const articleByPath = new Map(
    articleModule.ALL_ARTICLES.map((article) => [`/articles/${article.slug}`, article]),
  );

  const sitemapRoutes = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => {
    const url = new URL(match[1]);
    return normalizeRoute(url.pathname);
  });
  const sitemapSet = new Set(sitemapRoutes);

  assert(canonicalRoutes.length === canonicalSet.size, "Canonical route registry contains duplicate entries.");
  assert(sitemapRoutes.length === sitemapSet.size, "Sitemap contains duplicate canonical URLs.");
  assert(
    canonicalRoutes.length === sitemapRoutes.length && canonicalRoutes.every((route) => sitemapSet.has(route)),
    "SEO registry and sitemap must contain the same canonical routes.",
  );

  for (const redirectSource of permanentRedirects.keys()) {
    assert(!sitemapSet.has(redirectSource), `Redirect source ${redirectSource} must not appear in the sitemap.`);
  }

  assert(
    /^google\.com,\s*pub-3330626498830044,\s*DIRECT,\s*f08c47fec0942fa0\s*$/m.test(adsTxt),
    "ads.txt must contain the valid Google direct publisher declaration.",
  );
  assert(
    routeAwareSource.includes('from "@/lib/contentGovernance"'),
    "Route-aware AdSense must resolve eligibility through centralized content governance.",
  );
  assert(
    !routeAwareSource.includes("AD_ELIGIBLE_PATH_PREFIXES") &&
      !routeAwareSource.includes('["/articles/", "/topics/"]'),
    "Broad /articles/ or /topics/ advertising prefixes must not be reintroduced.",
  );
  assert(
    governanceModule.resolveContentGovernance("/not-a-real-route").adEligible === false,
    "Unknown routes must default to ad-free.",
  );

  const forbiddenAdTypes = new Set([
    "topic-guide",
    "hub",
    "directory",
    "calculator",
    "guided-workflow",
    "result-or-saved-work",
    "printable",
    "form",
    "trust",
    "legal",
    "organization",
  ]);

  for (const route of canonicalRoutes) {
    const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
    assert(policy.publicAvailable, `${route} is canonical but not marked publicly available in content governance.`);
    assert(policy.indexable, `${route} is canonical but content governance marks it noindex.`);
    if (policy.adEligible) {
      assert(!forbiddenAdTypes.has(policy.pageType), `${route} has forbidden ad-eligible page type ${policy.pageType}.`);
      assert(!policy.interactiveContext, `${route} is interactive and cannot be ad-eligible.`);
      assert(!policy.sensitiveContext, `${route} is a sensitive workflow and cannot be ad-eligible.`);
      assert(policy.reviewStatus === "reviewed", `${route} must have reviewed status before ad eligibility.`);
    }
  }

  for (const route of explicitAdRoutes) {
    assert(canonicalSet.has(route), `Ad-eligible route ${route} is missing from the canonical registry.`);
    const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
    assert(policy.pageType === "article", `Initial ad eligibility is limited to reviewed articles; found ${route}.`);
    const article = articleByPath.get(route);
    assert(Boolean(article), `Ad-eligible article ${route} is missing from ALL_ARTICLES.`);
    if (article) {
      const issues = publicationQuality.getAdEligibleArticleIssues(article, seoRegistry.AUTHOR_NAME);
      for (const issue of issues) {
        failures.push(`${route}: ${issue.message}`);
      }
      warn(
        Boolean(voiceNoteModule.ARTICLE_VOICE_NOTES[article.slug]),
        `${route}: no article-specific RN voice note is recorded; manual review should confirm sufficient original perspective without inventing first-person claims.`,
      );
    }
    assert(
      auditSnapshot.includes(route),
      `Audit snapshot must list the exact ad-eligible route ${route}.`,
    );
  }

  const sensitiveWorkflowExamples = [
    "/tools/medicare-medicaid-eligibility-check",
    "/tools/prior-authorization-next-step-guide",
    "/tools/medical-bill-review-flow",
    "/insurance/medical-bill-review-toolkit",
    "/tools/state-medicaid-long-term-care-router",
  ];
  for (const route of sensitiveWorkflowExamples) {
    const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
    assert(!policy.adEligible, `${route} must remain ad-free.`);
    assert(policy.interactiveContext, `${route} must remain classified as interactive context.`);
  }

  const overlapClusters = [
    {
      name: "Medicare and long-term care",
      routes: [
        "/articles/does-medicare-cover-long-term-care",
        "/articles/what-does-medicare-not-cover",
        "/articles/long-term-care-and-custodial-care",
        "/articles/medicaid-dual-eligibility-ltss",
      ],
    },
    {
      name: "Rehab and discharge",
      routes: [
        "/articles/does-medicare-cover-rehab-after-hospital-stay",
        "/articles/short-term-rehab-after-hospital",
        "/articles/discharge-coverage-guide",
        "/articles/observation-vs-inpatient-status",
      ],
    },
    {
      name: "Medicare comparisons",
      routes: [
        "/articles/medicare-options-explained",
        "/articles/medicare-advantage-vs-original-medicare-2026",
        "/insurance/medicare-advantage-vs-medigap",
        "/insurance/medicare-advantage",
        "/insurance/what-medicare-advantage-marketing-may-not-emphasize",
      ],
    },
    {
      name: "Health-insurance cost terminology",
      routes: [
        "/articles/deductible-copay-coinsurance-out-of-pocket-max",
        "/articles/premium-deductible-out-of-pocket-open-enrollment",
        "/tools/out-of-pocket-max-estimator",
      ],
    },
  ];

  for (const cluster of overlapClusters) {
    const missing = cluster.routes.filter((route) => !canonicalSet.has(route));
    warn(missing.length === 0, `${cluster.name}: expected routes missing from the current canonical registry: ${missing.join(", ")}.`);
  }

  const counts = canonicalRoutes.reduce(
    (result, route) => {
      const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
      result.total += 1;
      result.adEligible += Number(policy.adEligible);
      result.adFree += Number(!policy.adEligible);
      result[policy.pageType] = (result[policy.pageType] ?? 0) + 1;
      if (policy.reviewStatus === "needs-review") result.needsReview += 1;
      return result;
    },
    { total: 0, adEligible: 0, adFree: 0, needsReview: 0 },
  );

  if (WRITE_AUDIT) {
    const clusterByRoute = new Map();
    for (const cluster of overlapClusters) {
      for (const route of cluster.routes) clusterByRoute.set(route, cluster.name);
    }

    const rows = canonicalRoutes.map((route) => {
      const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
      const meta = seoRegistry.resolveSeoMeta(route);
      const article = articleByPath.get(route);
      const slug = route.startsWith("/articles/") ? route.slice("/articles/".length) : "";
      const rnInsight = slug && voiceNoteModule.ARTICLE_VOICE_NOTES[slug] ? "Yes" : policy.pageType === "article" ? "Not recorded" : "N/A";
      const sources = article ? (article.sources.length > 0 ? "Yes" : "No") : ["trust", "legal", "form", "organization"].includes(policy.pageType) ? "N/A" : "Manual review";
      const authorFreshness = article
        ? article.lastReviewedAt || article.publishedAt
          ? "Yes"
          : "Partial"
        : ["article", "long-form-guide", "topic-guide"].includes(policy.pageType)
          ? "Manual review"
          : "N/A";
      const depth = policy.adEligible
        ? "Substantial; affirmatively reviewed"
        : policy.pageType === "article"
          ? "Standard; editorial review pending"
          : ["calculator", "guided-workflow", "result-or-saved-work"].includes(policy.pageType)
            ? "Interactive utility"
            : ["hub", "directory", "topic-guide"].includes(policy.pageType)
              ? "Navigation or overview led"
              : ["trust", "legal"].includes(policy.pageType)
                ? "Trust/compliance content"
                : "Manual review";
      const action = policy.adEligible
        ? "Keep indexable; eligible only under conservative placement rules"
        : ["calculator", "guided-workflow", "result-or-saved-work"].includes(policy.pageType)
          ? "Keep indexable where useful; permanently ad-free"
          : policy.reviewStatus === "needs-review"
            ? "Keep indexable; ad-free pending individual editorial review"
            : "Keep indexable and ad-free";

      return [
        route,
        meta.title === "Page Not Found" ? titleFromRoute(route) : meta.title,
        policy.pageType,
        policy.indexable ? "Yes" : "No",
        policy.adEligible ? "Yes" : "No",
        policy.contentTier,
        meta.description,
        depth,
        rnInsight,
        sources,
        authorFreshness,
        policy.interactiveContext || policy.sensitiveContext ? "Yes" : "No",
        clusterByRoute.get(route) ?? "None identified",
        action,
        policy.reason,
      ];
    });

    const audit = `# AdSense Readiness Audit\n\nGenerated from the canonical SEO registry and centralized content-governance policy. The depth labels below are internal editorial heuristics, not Google word-count requirements.\n\n## Snapshot\n\n- Generated: ${new Date().toISOString().slice(0, 10)}\n- Public canonical routes: ${counts.total}\n- Indexable routes: ${canonicalRoutes.length}\n- Explicitly ad-eligible routes: ${counts.adEligible}\n- Ad-free routes: ${counts.adFree}\n- Routes requiring manual editorial review: ${counts.needsReview}\n- Noindex changes in this remediation: 0\n- Redirect or canonical consolidations in this remediation: 0\n\n## Exact ad-eligible routes\n\n${explicitAdRoutes.map((route) => `- \`${route}\``).join("\n")}\n\n## Indexability decision\n\nThis remediation deliberately preserves the existing canonical search footprint. Public availability, indexability, and ad eligibility are now separate decisions. Tools and workflows can remain useful search destinations while staying permanently ad-free. No route was noindexed solely because it is interactive, new, low traffic, or not ad-eligible.\n\n## Overlap review\n\n| Cluster | Decision | Rationale |\n|---|---|---|\n| Medicare and long-term care | Keep separate for now; strengthen differentiated intent and internal pathways | The pages address coverage exclusions, skilled-versus-custodial care, and Medicaid/LTSS rather than one identical question. Reassess after more Search Console evidence. |\n| Rehab and discharge | Keep separate for now | Coverage eligibility, discharge process, observation status, and post-acute care are materially different user decisions. |\n| Medicare comparisons | Keep separate, all ad-free except the broad Medicare options explainer | The pages serve overview, Original-versus-Advantage, Medigap, plan-comparison, and marketing-risk intents. Do not create additional keyword variants. |\n| Health-insurance cost terminology | Keep the general explainer, open-enrollment application, and calculator as a connected journey | The article explains terms, the open-enrollment page applies them to plan choice, and the calculator performs a user action. |\n\n## Route-by-route audit\n\n| Route | Page title | Page type | Indexable? | Ad-eligible? | Content tier | Primary user intent | Approx. original explanatory depth | RN insight present? | Sources present? | Author/reviewer/freshness present? | Interactive or sensitive context? | Possible overlap cluster | Recommended action | Reason |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`).join("\n")}\n\n## Policy interpretation\n\nGoogle Publisher Policies prohibit ads on screens without publisher content, with low-value content, or used mainly for navigation or behavioral purposes. They also prohibit ad placement that interferes with navigation or actions and restrict personalized advertising based on health or negative financial information. This audit therefore treats tools, workflows, forms, saved results, trust/legal pages, directories, and unreviewed content as ad-free by default.\n`;

    await writeFile(path.join(repositoryRoot, "docs", "adsense-readiness-audit.md"), audit, "utf8");
    console.log(`Wrote docs/adsense-readiness-audit.md with ${rows.length} canonical route rows.`);
  }

  if (warnings.length > 0) {
    console.warn("AdSense readiness warnings:\n");
    warnings.forEach((message) => console.warn(`- ${message}`));
  }

  if (failures.length > 0) {
    console.error("AdSense readiness checks failed:\n");
    failures.forEach((message) => console.error(`- ${message}`));
    process.exitCode = 1;
  } else {
    console.log(
      `AdSense readiness passed: ${canonicalRoutes.length} canonical routes, ${explicitAdRoutes.length} explicitly ad-eligible, ${canonicalRoutes.length - explicitAdRoutes.length} ad-free.`,
    );
  }
} finally {
  await vite.close();
}
