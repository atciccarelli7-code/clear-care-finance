from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    file_path = Path(path)
    text = file_path.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"Expected patch target missing in {path}")
    if text.count(old) != 1:
        raise SystemExit(f"Expected one patch target in {path}, found {text.count(old)}")
    file_path.write_text(text.replace(old, new, 1), encoding="utf-8")


tool_old = '''  {
    slug: "health-insurance-visit-cost-calculator",
    legacyAnchorId: "insurance",
    title: "Health Insurance Visit Cost Calculator",
    shortTitle: "Visit Cost Calculator",
    category: "Medical bills",
    audience: "Everyone",
    description: "Estimate yearly cost across premiums, deductible, copays, coinsurance, visits, and remaining maximum room.",
    estimatedUseTime: "5–8 min",
    icon: "shield",
    componentKey: "insuranceVisitCost",
    relatedArticle: { label: "Plain-English Healthcare Finance Glossary", href: "/articles/plain-english-glossary" },
  },'''

tool_new = '''  {
    slug: "health-insurance-visit-cost-calculator",
    legacyAnchorId: "insurance",
    title: "Patient Cost Share Calculator",
    shortTitle: "Cost Share Calculator",
    category: "Medical bills",
    audience: "Everyone",
    description: "Estimate covered in-network patient responsibility using the plan's deductible, copay or coinsurance rule, allowed amount, and out-of-pocket progress.",
    estimatedUseTime: "6–10 min",
    icon: "shield",
    componentKey: "insuranceVisitCost",
    decisionProductId: "health_insurance_cost_share",
    relatedArticle: { label: "Deductible, Copay, Coinsurance, and OOP Max", href: "/articles/deductible-copay-coinsurance-out-of-pocket-max" },
  },'''

replace_once("src/data/tools.ts", tool_old, tool_new)

seo_old = '''  "/tools/out-of-pocket-max-estimator": {
    title: "Out-of-Pocket Maximum Estimator",
    description: "Estimate remaining covered in-network cost-sharing exposure using deductible, copays, coinsurance, and current out-of-pocket progress.",
    kind: "tool",
  },
  "/tools/medicare-advantage-plan-helper": {'''

seo_new = '''  "/tools/out-of-pocket-max-estimator": {
    title: "Out-of-Pocket Maximum Estimator",
    description: "Estimate remaining covered in-network cost-sharing exposure using deductible, copays, coinsurance, and current out-of-pocket progress.",
    kind: "tool",
  },
  "/tools/health-insurance-visit-cost-calculator": {
    title: "Patient Cost Share Calculator",
    description: "Estimate covered in-network patient responsibility using the plan's deductible, copay or coinsurance rule, allowed amount, and out-of-pocket progress.",
    kind: "tool",
  },
  "/tools/medicare-advantage-plan-helper": {'''

replace_once("src/lib/seoRegistry.ts", seo_old, seo_new)
