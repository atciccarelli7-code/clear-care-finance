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
const percentage = (numerator, denominator) =>
  denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : "0.0%";

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
  const publisherReviewModule = await vite.ssrLoadModule("/src/data/publisherArticleReviews.ts");
  const voiceNoteModule = await vite.ssrLoadModule("/src/data/articleVoiceNotes.ts");

  const { permanentRedirects, canonicalRoutes } = await getCanonicalRoutes(
    seoRegistry.getIndexableRoutes,
  );
  const canonicalSet = new Set(canonicalRoutes);
  const explicitAdRoutes = governanceModule.getExplicitAdEligibleRoutes().map(normalizeRoute);
  const explicitAdSet = new Set(explicitAdRoutes);
  const articleByPath = new Map(
    articleModule.ALL_ARTICLES.map((article) => [`/articles/${article.slug}`, article]),
  );
  const reviewByPath = new Map(
    publisherReviewModule.PUBLISHER_ARTICLE_REVIEWS.map((review) => [review.route, review]),
  );

  const sitemapRoutes = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => {
    const url = new URL(match[1]);
    return normalizeRoute(url.pathname);
  });
  const sitemapSet = new Set(sitemapRoutes);

  assert(canonicalRoutes.length === canonicalSet.size, "Canonical route registry contains duplicate entries.");
  assert(sitemapRoutes.length === sitemapSet.size, "Sitemap contains duplicate canonical URLs.");
  assert(explicitAdRoutes.length === explicitAdSet.size, "Publisher-content review ledger contains duplicate ad-eligible routes.");
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

  assert(
    reviewByPath.size === articleByPath.size,
    `Every published article must have one publisher-content disposition; found ${reviewByPath.size} reviews for ${articleByPath.size} articles.`,
  );
  assert(
    publisherReviewModule.PUBLISHER_ARTICLE_REVIEWS.length === reviewByPath.size,
    "Publisher-content review ledger contains duplicate article routes.",
  );

  for (const [route] of articleByPath) {
    assert(reviewByPath.has(route), `${route} is published but missing from the publisher-content review ledger.`);
  }
  for (const [route] of reviewByPath) {
    assert(articleByPath.has(route), `${route} is reviewed but missing from ALL_ARTICLES.`);
    assert(canonicalSet.has(route), `${route} is reviewed but missing from the canonical registry.`);
  }

  assert(explicitAdRoutes.length === 39, `Expected 39 reconciled ad-eligible articles; found ${explicitAdRoutes.length}.`);
  assert(articleByPath.size === 71, `Expected 71 published article reviews; found ${articleByPath.size}.`);

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
      assert(!policy.sensitiveContext, `${route} is a sensitive context and cannot be ad-eligible.`);
      assert(policy.reviewStatus === "reviewed", `${route} must have reviewed status before ad eligibility.`);
    }
  }

  for (const route of explicitAdRoutes) {
    assert(canonicalSet.has(route), `Ad-eligible route ${route} is missing from the canonical registry.`);
    const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
    assert(policy.pageType === "article", `Ad eligibility is limited to reviewed articles; found ${route}.`);
    const review = reviewByPath.get(route);
    assert(review?.disposition === "ad-eligible", `${route} is eligible in governance but not in the publisher review ledger.`);
    const article = articleByPath.get(route);
    assert(Boolean(article), `Ad-eligible article ${route} is missing from ALL_ARTICLES.`);
    if (article) {
      const issues = publicationQuality.getAdEligibleArticleIssues(article, seoRegistry.AUTHOR_NAME);
      for (const issue of issues) {
        failures.push(`${route}: ${issue.message}`);
      }
      warn(
        Boolean(voiceNoteModule.ARTICLE_VOICE_NOTES[article.slug]),
        `${route}: no article-specific RN voice note is recorded; the publisher review relies on the article's original explanation and practical decision support rather than invented first-person claims.`,
      );
    }
    if (!WRITE_AUDIT) {
      assert(
        auditSnapshot.includes(route),
        `Audit snapshot must list the exact ad-eligible route ${route}.`,
      );
    }
  }

  const sensitiveArticleExamples = [
    "/articles/what-does-medicare-not-cover",
    "/articles/why-am-i-getting-a-blood-thinner-in-the-hospital",
    "/articles/safe-hospital-discharge-first-72-hours",
    "/articles/prior-authorization-explained",
    "/articles/check-hospital-financial-assistance-before-paying",
  ];
  for (const route of sensitiveArticleExamples) {
    const policy = governanceModule.resolveContentGovernance(route, { knownRoute: true });
    assert(policy.reviewStatus === "reviewed", `${route} must retain its completed publisher review.`);
    assert(!policy.adEligible, `${route} must remain ad-free.`);
    assert(policy.sensitiveContext, `${route} must remain classified as sensitive context.`);
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
      if (policy.pageType === "article" && policy.reviewStatus === "reviewed" && !policy.adEligible) {
        result.reviewedAdFreeArticles += 1;
      }
      return result;
    },
    { total: 0, adEligible: 0, adFree: 0, needsReview: 0, reviewedAdFreeArticles: 0 },
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
        : policy.pageType === "article" && policy.reviewStatus === "reviewed"
          ? "Reviewed; intentionally ad-free"
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
          : policy.pageType === "article" && policy.reviewStatus === "reviewed"
            ? "Keep indexable; reviewed and intentionally ad-free"
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

    const previousEligible = 5;
    const previousIndexableShare = percentage(previousEligible, canonicalRoutes.length);
    const currentIndexableShare = percentage(counts.adEligible, canonicalRoutes.length);
    const currentArticleShare = percentage(counts.adEligible, articleByPath.size);

    const audit = `# AdSense Readiness Audit\n\nGenerated from the canonical SEO registry, the complete publisher-article review ledger, and centralized content governance. The depth labels below are internal editorial heuristics, not Google word-count requirements.\n\n## Snapshot\n\n- Generated: ${new Date().toISOString().slice(0, 10)}\n- Public canonical routes: ${counts.total}\n- Indexable routes: ${canonicalRoutes.length}\n- Published articles with recorded publisher disposition: ${articleByPath.size}\n- Explicitly ad-eligible articles: ${counts.adEligible}\n- Reviewed articles intentionally kept ad-free: ${counts.reviewedAdFreeArticles}\n- Ad-free canonical routes: ${counts.adFree}\n- Routes requiring manual editorial review: ${counts.needsReview}\n- Ad-eligible share of indexable routes: ${currentIndexableShare}\n- Ad-eligible share of published articles: ${currentArticleShare}\n\n## Inherited-decision correction\n\nThe July 29 remediation treated five hard-coded article routes as the complete reviewed inventory. This review reconciles all ${articleByPath.size} published articles and separates completed publisher review from ad eligibility. Eligibility increases from ${previousEligible} of ${canonicalRoutes.length} indexable routes (${previousIndexableShare}) to ${counts.adEligible} of ${canonicalRoutes.length} (${currentIndexableShare}), while ${counts.reviewedAdFreeArticles} reviewed articles remain intentionally ad-free for sensitivity, reference-led intent, freshness burden, duplication, or commercial-presentation risk. This change does not resubmit AdSense, alter ads.txt, expand the sitemap, enable ads on tools or workflows, or modify account-level Auto ads settings.\n\n## Exact ad-eligible routes\n\n${explicitAdRoutes.map((route) => `- \`${route}\``).join("\n")}\n\n## Indexability decision\n\nPublic availability, indexability, publisher review, and ad eligibility are separate decisions. Useful tools and sensitive articles remain indexable while staying ad-free. No route is noindexed solely because it is interactive, low traffic, or not ad-eligible. Unknown and future routes remain fail-closed until individually classified.\n\n## Overlap review\n\n| Cluster | Decision | Rationale |\n|---|---|---|\n| Medicare and long-term care | Keep separate and ad-free | The pages address coverage exclusions, skilled-versus-custodial care, and Medicaid/LTSS. They remain sensitive healthcare decision content rather than display-ad inventory. |\n| Rehab and discharge | Keep separate and ad-free | Coverage eligibility, discharge process, observation status, and post-acute care are materially different but consequential patient decisions. |\n| Medicare comparisons | Keep separate and ad-free | The pages serve overview, Original-versus-Advantage, Medigap, plan-comparison, and marketing-risk intents. Do not create additional keyword variants. |\n| Health-insurance cost terminology | Keep the general explainer and open-enrollment application ad-eligible; keep the calculator ad-free | The articles provide publisher content, while the calculator performs an interactive user action. |\n\n## Route-by-route audit\n\n| Route | Page title | Page type | Indexable? | Ad-eligible? | Content tier | Primary user intent | Approx. original explanatory depth | RN insight present? | Sources present? | Author/reviewer/freshness present? | Interactive or sensitive context? | Possible overlap cluster | Recommended action | Reason |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`).join("\n")}\n\n## Policy interpretation\n\nGoogle reviews the entire connected site for policy and content quality, while its product supports page and section exclusions from Auto ads. Google also recommends placing ad code on the pages where ads should appear. Community Acquired Finance therefore uses affirmative route-level eligibility rather than broad article prefixes: publisher articles must pass publication-quality checks, while tools, workflows, forms, saved results, trust/legal pages, directories, sensitive articles, and unknown routes remain ad-free.\n`;

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
