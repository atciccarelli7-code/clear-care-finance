import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const { resolveSeoMeta } = await server.ssrLoadModule("/src/lib/seoRegistry.ts");
  const { ALL_ARTICLES } = await server.ssrLoadModule("/src/data/allArticles.ts");
  const { tools, getToolHref } = await server.ssrLoadModule("/src/data/tools.ts");
  const { getRouteEndcapOwner } = await server.ssrLoadModule("/src/components/layout/routeEndcap.ts");
  const { hasMedicalBillProductPathway } = await server.ssrLoadModule("/src/components/medical-bill/medicalBillProductPathwayConfig.ts");
  const { hasBenefitsCommandCenterEntry } = await server.ssrLoadModule("/src/components/benefits/benefitsCommandCenterEntryConfig.ts");
  const { hasNavigatorContextAction } = await server.ssrLoadModule("/src/components/navigator/navigatorContextConfig.ts");
  const { getArticleCompoundingPathway, getHubCompoundingPathway } = await server.ssrLoadModule("/src/data/seoCompoundingPathways.ts");
  const {
    PRIORITY_DIRECTIONAL_ARTICLE_SLUGS,
    audienceForArticleCategory,
    audienceForTool,
    getToolStartLabel,
  } = await server.ssrLoadModule("/src/lib/directionalCtaRoutes.ts");

  const articleByPath = new Map(ALL_ARTICLES.map((article) => [`/articles/${article.slug}`, article]));
  const toolByPath = new Map(tools.map((tool) => [getToolHref(tool), tool]));
  const trustRoutes = new Set(["/about", "/contact", "/sources", "/editorial-standards", "/privacy", "/terms", "/disclaimers", "/corrections"]);
  const articleActions = {
    "/articles/how-to-read-an-eob": ["Match EOB and bill", "/tools/eob-to-bill-match-checker"],
    "/articles/deductible-copay-coinsurance-out-of-pocket-max": ["Estimate visit cost", "/tools/health-insurance-visit-cost-calculator"],
    "/articles/how-hospital-403b-matching-works": ["Calculate each paycheck", "/tools/403b-paycheck-calculator"],
    "/articles/facility-fee-vs-professional-fee": ["Review the bill", "/insurance/medical-bill-review-toolkit"],
    "/articles/prescription-coverage-open-enrollment-checklist": ["Next article", "/articles/network-checklist-open-enrollment"],
    "/articles/cash-vs-investing-when-you-feel-behind": ["Read the map", "/articles/healthcare-worker-money-map"],
    "/articles/what-employer-benefit-changes-should-i-compare": ["Open Command Center", "/tools/benefits-command-center"],
    "/articles/prior-authorization-explained": ["Build my next steps", "/tools/prior-authorization-next-step-guide"],
  };

  const hasSeoPathway = (route) => route.startsWith("/articles/")
    ? Boolean(getArticleCompoundingPathway(route.slice("/articles/".length)))
    : Boolean(getHubCompoundingPathway(route));
  const baselineEndcapCount = (route) => [
    hasMedicalBillProductPathway(route),
    hasSeoPathway(route),
    hasBenefitsCommandCenterEntry(route),
    hasNavigatorContextAction(route),
  ].filter(Boolean).length;

  const audience = (route) => {
    const article = articleByPath.get(route);
    if (article) return audienceForArticleCategory(article.category);
    const tool = toolByPath.get(route);
    if (tool) return audienceForTool(tool.audience);
    if (/patients|insurance|medicare|medicaid|diagnosis|hospital|medical-bill/.test(route)) return "patients_caregivers";
    if (/healthcare-workers|build-wealth|career|403b/.test(route)) return "healthcare_workers";
    return "everyone";
  };
  const routeClass = (route) => route === "/" ? "homepage"
    : route.startsWith("/articles/") ? "article"
      : route.startsWith("/tools/") ? "tool"
        : route.startsWith("/topics/") ? "topic"
          : route.includes("diagnosis") ? "diagnosis_guide"
            : trustRoutes.has(route) ? "trust_reference"
              : "hub_or_guide";

  const sitemapRoutes = [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>https:\/\/communityacquiredfinance\.com([^<]*)<\/loc>/g)]
    .map((match) => match[1] || "/");
  const rows = sitemapRoutes.sort().map((route) => {
    const article = articleByPath.get(route);
    const tool = toolByPath.get(route);
    const dynamicTool = Boolean(tool?.componentKey && getToolHref(tool) === route);
    const priorityArticle = Boolean(article && PRIORITY_DIRECTIONAL_ARTICLE_SLUGS.has(article.slug));
    const compensationPage = route === "/tools/healthcare-worker-total-compensation-comparison";
    const stackedEndcaps = baselineEndcapCount(route) > 1;
    const changeReasons = [
      dynamicTool ? "outcome_specific_tool_primary" : null,
      priorityArticle ? "directional_article_handoff" : null,
      compensationPage ? "compensation_primary_and_handoff" : null,
      stackedEndcaps ? "single_global_endcap_owner" : null,
    ].filter(Boolean);
    const changed = changeReasons.length > 0;

    let baselineCta = "Route-specific page action";
    let baselineDestination = "Route-specific destination";
    let implementedCta = baselineCta;
    let implementedDestination = baselineDestination;
    let disposition = "already_compliant";
    let recommendation = "Retain and regression-test the existing outcome language.";

    if (dynamicTool) {
      baselineCta = "Open the tool";
      baselineDestination = "Same-page #tool anchor";
      implementedCta = getToolStartLabel(tool.componentKey, tool.shortTitle);
      implementedDestination = "Same-page #tool anchor";
      disposition = "changed";
      recommendation = "Measure meaningful tool continuation and completion, not click volume alone.";
    }
    if (priorityArticle) {
      baselineCta = "Two or three equal-weight next-step cards";
      baselineDestination = "Multiple competing destinations";
      [implementedCta, implementedDestination] = articleActions[route];
      disposition = "changed";
      recommendation = "Reassess after 28 days or adequate consented journey evidence.";
    }
    if (compensationPage) {
      baselineCta = "Read the comparison guide";
      baselineDestination = "/articles/how-healthcare-workers-should-compare-job-offers";
      implementedCta = "Compare the two offers";
      implementedDestination = "Same-page #comparison anchor";
      disposition = "changed";
      recommendation = "Verify calculator entry, completion, and benefits-workspace continuation.";
    }
    if (stackedEndcaps) {
      baselineCta = `${baselineEndcapCount(route)} independently rendered global endcaps`;
      baselineDestination = "Multiple competing destinations";
      if (!priorityArticle && !compensationPage) {
        implementedCta = `One governed ${getRouteEndcapOwner(route)} endcap`;
        implementedDestination = "Owner-specific destination";
      }
      disposition = "changed";
      recommendation = "Keep a single route owner; re-add an endcap only with an explicit precedence decision.";
    }
    if (!changed && trustRoutes.has(route)) {
      baselineCta = "Reference navigation only";
      baselineDestination = "Related trust or site navigation";
      implementedCta = "No primary conversion CTA appropriate";
      implementedDestination = "None";
      disposition = "no_primary_cta_appropriate";
      recommendation = "Keep trust and legal pages free of conversion pressure.";
    } else if (!changed && article) {
      baselineCta = "Equal-weight article next-step cards";
      baselineDestination = "Article/category-dependent";
      implementedCta = baselineCta;
      implementedDestination = baselineDestination;
      disposition = "deferred_rank_1";
      recommendation = "Audit article-specific intent and replace broad fallbacks only with evidence-backed direct handoffs.";
    } else if (!changed && tool) {
      disposition = "already_compliant_decision_tool";
      recommendation = "Preserve typed result architecture; do not replace it with a generic CTA panel.";
    }

    const meta = resolveSeoMeta(route);
    return {
      route,
      route_class: routeClass(route),
      audience: audience(route),
      primary_intent: meta.title,
      page_promise: meta.description,
      baseline_cta: baselineCta,
      baseline_destination: baselineDestination,
      baseline_global_endcaps: baselineEndcapCount(route),
      implemented_cta: implementedCta,
      implemented_destination: implementedDestination,
      action_owner: getRouteEndcapOwner(route),
      disposition,
      analytics: changed ? "directional_cta_clicked or retained journey-specific event" : "existing contract retained",
      change_reason: changeReasons.join("+") || "none",
      recommendation,
    };
  });

  const columns = Object.keys(rows[0]);
  const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
  const changedCount = rows.filter((row) => row.disposition === "changed").length;
  const stackedCount = rows.filter((row) => row.baseline_global_endcaps > 1).length;
  const deferredCount = rows.filter((row) => row.disposition === "deferred_rank_1").length;
  const noPrimaryCount = rows.filter((row) => row.disposition === "no_primary_cta_appropriate").length;
  const summary = `# Directional CTA route inventory — 2026-08-03\n\nThis inventory records all ${rows.length} canonical routes. It distinguishes implemented changes, accepted existing behavior, pages where a conversion CTA is inappropriate, and a ranked article-specific backlog. The CSV is the authoritative row-level artifact.\n\n## Summary\n\n| Measure | Count | Share |\n|---|---:|---:|\n| Canonical routes reviewed | ${rows.length} | 100% |\n| Routes changed by at least one bounded CTA rule | ${changedCount} | ${(changedCount / rows.length * 100).toFixed(1)}% |\n| Routes with competing global endcaps before resolver | ${stackedCount} | ${(stackedCount / rows.length * 100).toFixed(1)}% |\n| Priority article handoffs changed | ${PRIORITY_DIRECTIONAL_ARTICLE_SLUGS.size} of ${ALL_ARTICLES.length} | ${(PRIORITY_DIRECTIONAL_ARTICLE_SLUGS.size / ALL_ARTICLES.length * 100).toFixed(1)}% of articles |\n| Dynamic tool hero labels changed | ${rows.filter((row) => row.change_reason.includes("outcome_specific_tool_primary")).length} | ${(rows.filter((row) => row.change_reason.includes("outcome_specific_tool_primary")).length / rows.length * 100).toFixed(1)}% |\n| Deferred article-specific audits | ${deferredCount} | ${(deferredCount / rows.length * 100).toFixed(1)}% |\n| Routes where no primary conversion CTA is appropriate | ${noPrimaryCount} | ${(noPrimaryCount / rows.length * 100).toFixed(1)}% |\n\n## Guardrails\n\n- All 160 canonical routes, redirects, metadata, indexability, and legacy anchors remain unchanged.\n- The current homepage, Start Here, Tools directory, and navigation experiment remain intact.\n- Typed Decision Outcome result architecture remains intact.\n- Stripe, Supabase, checkout, premium availability, advertising eligibility, and email capture are unchanged.\n- CTA analytics contain fixed route/action metadata only; no inputs, results, plan data, health data, or device fingerprint fields.\n\nThe machine-readable route inventory is \`docs/audits/2026-08-03-directional-cta-route-inventory.csv\`.\n`;

  mkdirSync("docs/audits", { recursive: true });
  writeFileSync("docs/audits/2026-08-03-directional-cta-route-inventory.csv", csv);
  writeFileSync("docs/audits/2026-08-03-directional-cta-route-inventory.md", summary);
  console.log(`Wrote ${rows.length} route rows; ${changedCount} changed, ${stackedCount} previously stacked, ${deferredCount} deferred.`);
} finally {
  await server.close();
}
