import { readFileSync, writeFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const write = (path, value) => writeFileSync(path, value, "utf8");

function replaceOnce(path, source, search, replacement) {
  if (source.includes(replacement)) return source;
  const count = source.split(search).length - 1;
  if (count !== 1) throw new Error(`${path}: expected one migration marker, found ${count}: ${search.slice(0, 90)}`);
  return source.replace(search, replacement);
}

function patchApp() {
  const path = "src/App.tsx";
  let source = read(path);

  source = replaceOnce(
    path,
    source,
    'const loadMedicalBillReviewToolkitPage = () => import("./pages/MedicalBillReviewToolkitPage.tsx");',
    'const loadMedicalBillReviewToolkitPage = () => import("./pages/MedicalBillReviewToolkitPage.tsx");\nconst loadMedicalBillWorkbookProductPage = () => import("./pages/MedicalBillWorkbookProductPage.tsx");',
  );
  source = replaceOnce(
    path,
    source,
    "const MedicalBillReviewToolkitPage = lazy(loadMedicalBillReviewToolkitPage);",
    "const MedicalBillReviewToolkitPage = lazy(loadMedicalBillReviewToolkitPage);\nconst MedicalBillWorkbookProductPage = lazy(loadMedicalBillWorkbookProductPage);",
  );
  source = replaceOnce(
    path,
    source,
    '  if (pathname === "/insurance/medical-bill-review-toolkit") return loadMedicalBillReviewToolkitPage;',
    '  if (pathname === "/insurance/medical-bill-review-toolkit") return loadMedicalBillReviewToolkitPage;\n  if (pathname === "/products/expanded-medical-bill-response-workbook") return loadMedicalBillWorkbookProductPage;',
  );
  source = replaceOnce(
    path,
    source,
    '            <Route path="/insurance/medical-bill-review-toolkit" element={<MedicalBillReviewToolkitPage />} />',
    '            <Route path="/insurance/medical-bill-review-toolkit" element={<MedicalBillReviewToolkitPage />} />\n            <Route path="/products/expanded-medical-bill-response-workbook" element={<MedicalBillWorkbookProductPage />} />',
  );

  write(path, source);
}

function patchResponseSystem() {
  const path = "src/pages/MedicalBillReviewToolkitPage.tsx";
  let source = read(path);

  source = replaceOnce(
    path,
    source,
    'import { SectionHeading } from "@/components/shared/SectionHeading";',
    'import { SectionHeading } from "@/components/shared/SectionHeading";\nimport { NewsletterSignup } from "@/components/shared/NewsletterSignup";\nimport { ProductOfferCard } from "@/components/products/ProductOfferCard";',
  );

  const insertion = `        <ProductOfferCard compact source="medical_bill_response_system" />

        <NewsletterSignup
          compact
          source="medical-bill-response-system"
          emailType="medical-bill-sequence"
          title="Keep the response sequence for your next billing call"
          description="Receive the first document-identification email now. Additional EOB, assistance, denial, and workbook emails will activate only after consent-aware provider automation is verified."
          buttonLabel="Start the medical-bill email path"
          successMessage="You are on the medical-bill list. Check your inbox for the first response-system email."
          limitedSuccessMessage="Your signup was saved. Email delivery is still pending external sender verification."
        />

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">`;

  source = replaceOnce(
    path,
    source,
    '        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">',
    insertion,
  );

  write(path, source);
}

function patchArticleConversions() {
  const path = "src/pages/ArticlePage.tsx";
  let source = read(path);

  const slugSet = `const medicalBillProductSlugs = new Set([
  "how-to-read-an-eob",
  "check-hospital-financial-assistance-before-paying",
  "facility-fee-vs-professional-fee",
  "prior-authorization-explained",
  "what-to-do-before-paying-a-large-medical-bill",
  "medical-bill-sent-to-collections-what-happens-next",
]);

const getArticleNextSteps = (`;
  source = replaceOnce(path, source, "const getArticleNextSteps = (", slugSet);

  const conversionBlock = `  if (medicalBillProductSlugs.has(slug)) {
    return [
      {
        eyebrow: "Start free",
        title: "Medical Bill Response System",
        description: "Identify the document, reconcile the claim story, and route the next action before paying.",
        href: "/insurance/medical-bill-review-toolkit",
        cta: "Open response system",
      },
      {
        eyebrow: "Optional workbook",
        title: "Expanded Medical Bill Response Workbook",
        description: "Keep EOBs, bills, calls, deadlines, assistance records, and written requests organized in one 32-page system.",
        href: "/products/expanded-medical-bill-response-workbook",
        cta: "Preview workbook",
      },
      {
        eyebrow: "Patient pathway",
        title: "Patients and Families",
        description: "Move into discharge, coverage, medical-bill, Medicare, and caregiver decision pathways.",
        href: "/patients-families",
        cta: "View patient pathways",
      },
    ];
  }

  if (slug === "how-to-read-an-eob") {`;
  source = replaceOnce(path, source, '  if (slug === "how-to-read-an-eob") {', conversionBlock);

  write(path, source);
}

function patchSeoRegistry() {
  const path = "src/lib/seoRegistry.ts";
  let source = read(path);
  const marker = "const staticSeoRegistry: Record<string, SeoRegistryEntry> = {";
  const productEntry = `${marker}
  "/products/expanded-medical-bill-response-workbook": {
    title: "Expanded Medical Bill Response Workbook",
    description: "Preview a 32-page RN-led system for organizing medical bills, EOBs, calls, deadlines, assistance, denials, prior authorization, and caregiver coordination.",
    kind: "page",
  },`;
  source = replaceOnce(path, source, marker, productEntry);
  write(path, source);
}

patchApp();
patchResponseSystem();
patchArticleConversions();
patchSeoRegistry();
console.log("Medical bill productization migration applied.");
