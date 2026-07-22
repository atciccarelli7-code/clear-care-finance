export type MedicalBillProductPathwayVariant = "hub" | "supporting";

export type MedicalBillProductPathwayConfig = {
  source: string;
  variant: MedicalBillProductPathwayVariant;
};

const pathwayRoutes = new Map<string, MedicalBillProductPathwayConfig>([
  [
    "/insurance/medical-bill-review-toolkit",
    { source: "medical-bill-response-system", variant: "hub" },
  ],
  ["/patients-families", { source: "patients-families", variant: "supporting" }],
  ["/articles/how-to-read-an-eob", { source: "article-how-to-read-an-eob", variant: "supporting" }],
  [
    "/articles/check-hospital-financial-assistance-before-paying",
    { source: "article-hospital-financial-assistance", variant: "supporting" },
  ],
  [
    "/articles/facility-fee-vs-professional-fee",
    { source: "article-facility-professional-fees", variant: "supporting" },
  ],
  [
    "/articles/prior-authorization-explained",
    { source: "article-prior-authorization", variant: "supporting" },
  ],
  [
    "/articles/why-one-hospital-visit-can-create-multiple-bills",
    { source: "article-multiple-medical-bills", variant: "supporting" },
  ],
]);

export const getMedicalBillProductPathway = (pathname: string) => pathwayRoutes.get(pathname) ?? null;

export const hasMedicalBillProductPathway = (pathname: string) => pathwayRoutes.has(pathname);
