import { hasBenefitsCommandCenterEntry } from "@/components/benefits/benefitsCommandCenterEntryConfig";
import { hasMedicalBillProductPathway } from "@/components/medical-bill/medicalBillProductPathwayConfig";
import { hasNavigatorContextAction } from "@/components/navigator/navigatorContextConfig";
import { getArticleCompoundingPathway, getHubCompoundingPathway } from "@/data/seoCompoundingPathways";
import { isPriorityDirectionalArticle } from "@/lib/directionalCtaRoutes";

export type RouteEndcapOwner = "medical_bill" | "seo_pathway" | "benefits_workspace" | "benefits_offer_validation" | "navigator" | "page" | "none";

const benefitsOfferValidationRoutes = new Set([
  "/tools/healthcare-worker-total-compensation-comparison",
]);

const hasSeoPathway = (pathname: string) => {
  if (pathname === "/tools") return false;
  if (pathname.startsWith("/articles/")) {
    return Boolean(getArticleCompoundingPathway(pathname.slice("/articles/".length)));
  }
  return Boolean(getHubCompoundingPathway(pathname));
};

export const getRouteEndcapOwner = (pathname: string): RouteEndcapOwner => {
  if (benefitsOfferValidationRoutes.has(pathname)) return "benefits_offer_validation";
  if (pathname.startsWith("/articles/") && isPriorityDirectionalArticle(pathname.slice("/articles/".length))) return "page";
  if (hasMedicalBillProductPathway(pathname)) return "medical_bill";
  if (hasSeoPathway(pathname)) return "seo_pathway";
  if (hasBenefitsCommandCenterEntry(pathname)) return "benefits_workspace";
  if (hasNavigatorContextAction(pathname)) return "navigator";
  return "none";
};

