import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FileQuestion,
  FileText,
  Landmark,
  Mail,
  PhoneCall,
  Printer,
  Receipt,
  Scale,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { MedicalBillCaseDashboard } from "@/components/medical-bill-case-dashboard";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { trackSiteEvent } from "@/lib/analytics";
import { useSeo } from "@/lib/seo";

type RouteId =
  | "eob"
  | "hospital"
  | "professional"
  | "denial"
  | "assistance"
  | "collections"
  | "mismatch"
  | "none";

type DocumentRoute = {
  id: RouteId;
  title: string;
  short: string;
  icon: typeof FileText;
  classification: string;
  not: string;
  checks: string[];
  mistakes: string[];
  questions: string[];
  next: string;
  href: string;
  cta: string;
  official: string;
  officialLabel: string;
};

const documentRoutes: DocumentRoute[] = [
  {
    id: "eob",
    title: "Explanation of Benefits",
    short: "Usually an insurer explanation, not a request for payment.",
    icon: FileCheck2,
    classification:
      "A payer document showing claim status, allowed amount, plan payment, and possible patient responsibility.",
    not: "It is generally not the provider's bill, even when it lists a patient-responsibility amount.",
    checks: [
      "Match the service date and provider.",
      "Find claim status, allowed amount, plan payment, and patient responsibility.",
      "Locate the matching provider bill before paying from the EOB alone.",
    ],
    mistakes: [
      "Paying from the EOB instead of the provider bill.",
      "Treating a pending or denied claim as the final outcome.",
    ],
    questions: [
      "Has the provider sent a matching bill?",
      "Does the provider balance equal the EOB patient responsibility?",
    ],
    next: "Match the EOB and provider bill line by line.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Compare the EOB and bill",
    official:
      "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
    officialLabel: "CMS EOB guide",
  },
  {
    id: "hospital",
    title: "Hospital or facility bill",
    short: "A payment request from the hospital or facility organization.",
    icon: Receipt,
    classification:
      "A facility bill that may include room, supplies, equipment, and institutional services.",
    not: "It may not include physician, anesthesia, laboratory, imaging, pathology, or ambulance charges.",
    checks: [
      "Confirm the payer processed the related claim.",
      "Compare the balance with the EOB or Medicare Summary Notice.",
      "Request an itemized bill and written financial-assistance policy when needed.",
    ],
    mistakes: [
      "Assuming one hospital visit creates only one bill.",
      "Starting a long payment plan before checking financial assistance.",
    ],
    questions: [
      "Which services and clinicians are included in this bill?",
      "Can the account be held while a review is pending?",
    ],
    next: "Use the guided review before treating the first balance as final.",
    href: "/tools/medical-bill-review-flow",
    cta: "Start the bill review",
    official:
      "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS hospital requirements",
  },
  {
    id: "professional",
    title: "Physician or professional bill",
    short: "A separate bill from a clinician or professional group.",
    icon: Stethoscope,
    classification:
      "A professional-services bill that can arrive separately from the hospital or facility bill.",
    not: "A separate bill is not automatically a duplicate; identify the billing entity and service first.",
    checks: [
      "Identify the billing group and service date.",
      "Find the matching claim on the payer explanation.",
      "Check network processing and patient responsibility.",
    ],
    mistakes: [
      "Calling the facility about a bill owned by an independent group.",
      "Assuming an unfamiliar group name proves the charge is fraudulent.",
    ],
    questions: [
      "What service does the group say it provided?",
      "Which payer claim matches this bill?",
    ],
    next: "Identify the bill owner, then compare it with the payer explanation.",
    href: "/articles/why-one-hospital-visit-can-create-multiple-bills",
    cta: "Understand multiple bills",
    official: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "denial",
    title: "Denial or authorization notice",
    short: "A written decision with a reason, instructions, and often a deadline.",
    icon: AlertTriangle,
    classification:
      "A notice explaining why a claim, service, medication, or authorization was not approved as submitted.",
    not: "It is not always the last available decision, but review rights depend on the plan and written notice.",
    checks: [
      "Read the exact reason and policy language cited.",
      "Locate the appeal, reconsideration, or review deadline.",
      "Identify missing documentation and who must submit it.",
    ],
    mistakes: [
      "Calling before reading the written reason.",
      "Using a generic appeal without following the notice's process.",
    ],
    questions: [
      "What exact evidence or administrative step is missing?",
      "What submission method and deadline apply?",
    ],
    next: "Organize the notice, deadline, and provider-plan questions before responding.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Build the next-step plan",
    official: "https://www.healthcare.gov/appeal-insurance-company-decision/",
    officialLabel: "HealthCare.gov appeals",
  },
  {
    id: "assistance",
    title: "Financial-assistance paperwork",
    short: "A hospital-specific application or policy for eligible charges.",
    icon: FileText,
    classification:
      "A process that may consider household, income, insurance status, services, and hospital policy rules.",
    not: "It is not universal and may not cover every professional group from the same visit.",
    checks: [
      "Request the written policy and plain-language summary.",
      "Confirm which entities and services the policy covers.",
      "List required documents, submission steps, and review timing.",
    ],
    mistakes: [
      "Assuming insurance makes you ineligible without reading the policy.",
      "Submitting documents without keeping a dated copy.",
    ],
    questions: [
      "Will collection activity pause during review?",
      "Can assistance apply to recently paid or collection accounts?",
    ],
    next: "Gather the policy, application, document list, and account-hold instructions.",
    href: "/articles/check-hospital-financial-assistance-before-paying",
    cta: "Open the assistance guide",
    official:
      "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
    officialLabel: "IRS Section 501(r)",
  },
  {
    id: "collections",
    title: "Collections letter or warning",
    short: "A time-sensitive notice about an unpaid balance.",
    icon: PhoneCall,
    classification:
      "A notice that a provider or collection company says a balance remains unpaid.",
    not: "It does not remove the need to verify the original bill, claim processing, disputes, and assistance status.",
    checks: [
      "Identify the original creditor and balance.",
      "Gather prior bills, payer notices, disputes, and assistance records.",
      "Read every deadline and verify current consumer-rights information.",
    ],
    mistakes: [
      "Ignoring a legitimate written deadline.",
      "Sharing unnecessary medical details when account verification is enough.",
    ],
    questions: [
      "What original creditor and balance are identified?",
      "Is another review, appeal, or assistance request unresolved?",
    ],
    next: "Verify the account and preserve written records before choosing a response.",
    href: "/tools/medical-bill-review-flow",
    cta: "Organize the review",
    official: "https://www.consumerfinance.gov/consumer-tools/medical-debt/",
    officialLabel: "CFPB medical-debt resources",
  },
  {
    id: "mismatch",
    title: "Documents do not match",
    short: "The EOB, bill, or portal shows inconsistent numbers or statuses.",
    icon: Scale,
    classification:
      "A reconciliation problem involving timing, different billing entities, claim status, adjustments, network status, or authorization.",
    not: "A mismatch alone does not prove an error or determine what is owed.",
    checks: [
      "Match service dates and billing entities.",
      "Confirm whether each claim is pending, processed, adjusted, or denied.",
      "Ask the owner of the inconsistent number for a written explanation.",
    ],
    mistakes: [
      "Comparing unrelated claim lines.",
      "Calling several organizations without assigning the next action.",
    ],
    questions: [
      "Which exact line or amount conflicts?",
      "Is the mismatch temporary or final?",
    ],
    next: "Use the comparison checker and save a structured case summary.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Compare the documents",
    official: "https://www.cms.gov/medical-bill-rights",
    officialLabel: "CMS medical-bill rights",
  },
  {
    id: "none",
    title: "No document yet",
    short: "Prepare before a bill or EOB arrives.",
    icon: FileQuestion,
    classification:
      "A preparation stage for saving estimates, authorizations, expected billing groups, and contact information.",
    not: "A verbal quote or estimate is not always the final processed patient responsibility.",
    checks: [
      "Save written estimates and authorization details.",
      "Ask which organizations may bill separately.",
      "Know where payer explanations and provider bills will appear.",
    ],
    mistakes: [
      "Relying only on a verbal estimate.",
      "Assuming every clinician shares the facility's network status.",
    ],
    questions: [
      "Which organizations may send separate claims or bills?",
      "What written cost or coverage information is available now?",
    ],
    next: "Prepare a document folder and review the first payer explanation before paying.",
    href: "/articles/questions-to-ask-before-a-medical-appointment-cost",
    cta: "Prepare for medical costs",
    official:
      "https://www.cms.gov/medical-bill-rights/help/guides/good-faith-estimate",
    officialLabel: "CMS estimate guide",
  },
];

const beforePaySteps = [
  "Identify the document before acting on it.",
  "Match the date, provider, and service.",
  "Confirm the payer processed the claim.",
  "Compare the billed charge, allowed amount, adjustments, plan payment, and patient responsibility.",
  "Separate facility and professional bills.",
  "Request an itemized bill when the balance is unclear or unexpected.",
  "Check network processing and current surprise-billing protections when relevant.",
  "Check hospital financial assistance before a long payment plan or high-interest debt.",
  "Organize denial reasons, instructions, and deadlines exactly as written.",
  "Record every call, promise, document, and follow-up date.",
];

const officialSources = [
  ["CMS Medical Bill Rights", "https://www.cms.gov/medical-bill-rights"],
  [
    "CMS Explanation of Benefits",
    "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
  ],
  [
    "HealthCare.gov Appeals",
    "https://www.healthcare.gov/appeal-insurance-company-decision/",
  ],
  [
    "IRS Hospital Requirements",
    "https://www.irs.gov/charities-non-profits/requirements-for-501c3-hospitals-under-the-affordable-care-act-section-501r",
  ],
  [
    "CFPB Medical Debt",
    "https://www.consumerfinance.gov/consumer-tools/medical-debt/",
  ],
  [
    "Medicare Appeals",
    "https://www.medicare.gov/claims-appeals/how-do-i-file-an-appeal",
  ],
] as const;

const packPath = "/downloads/medical-bill-response-pack.html";

const MedicalBillReviewToolkitPage = () => {
  const [selectedId, setSelectedId] = useState<RouteId | null>(null);
  const selectedRoute = documentRoutes.find((route) => route.id === selectedId);

  useSeo({
    title: "Medical Bill Response System",
    description:
      "Identify an EOB, medical bill, denial, assistance form, or collection notice and follow a private RN-led review sequence before paying.",
    canonicalPath: "/insurance/medical-bill-review-toolkit",
  });

  useEffect(() => {
    trackSiteEvent("medical_bill_hub_view", {
      event_category: "medical_bill",
      entry_surface: "response_system",
    });
  }, []);

  const chooseRoute = (id: RouteId) => {
    setSelectedId(id);
    trackSiteEvent("document_router_start", {
      event_category: "medical_bill",
      route_type: id,
    });
    trackSiteEvent("document_router_result_type", {
      event_category: "medical_bill",
      route_type: id,
    });
    trackSiteEvent("document_router_complete", {
      event_category: "medical_bill",
      route_type: id,
    });
    trackSiteEvent("tool_completion", {
      event_category: "medical_bill",
      tool_id: "document_router",
    });
    requestAnimationFrame(() =>
      document
        .getElementById("document-result")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const openPack = () => {
    trackSiteEvent("response_pack_download", {
      event_category: "medical_bill",
      asset_id: "medical_bill_response_pack",
    });
    window.open(packPath, "_blank", "noopener,noreferrer");
  };

  const printResult = () => {
    trackSiteEvent("print_or_save_action", {
      event_category: "medical_bill",
      action_type: "page_print",
    });
    window.print();
  };

  return (
    <>
      <PageHero
        eyebrow="RN-led healthcare money navigation"
        title="Medical Bill Response System"
        description="Identify the document, check the claim story, organize the next call, and verify the correct official source before treating a balance as final."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#document-router">
            Identify my document <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={openPack}>
          <Download className="h-4 w-4" /> Open response pack
        </Button>
      </PageHero>

      <div className="container space-y-16 py-12 md:space-y-20 md:py-16">
        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/30 p-6 shadow-card">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">
            Start with the document, not the dollar amount.
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            An EOB is generally not a bill. Do not ignore a legitimate
            deadline, but do not assume every first balance is final. Identify
            the document, confirm processing, and keep a dated record.
          </p>
          <div className="mt-5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Privacy:</strong> Do not enter
            names, diagnoses, member IDs, claim numbers, account numbers, or
            other protected information. This system does not decide coverage,
            coding, liability, collectibility, appeal success, or what you owe.
          </div>
        </section>

        <section id="document-router" className="scroll-mt-24">
          <SectionHeading
            centered
            eyebrow="Step 1"
            title="What document are you holding?"
            description="Choose the closest match for the first checks, common mistakes, questions, and safest next action."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documentRoutes.map((route) => {
              const Icon = route.icon;
              const active = selectedId === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseRoute(route.id)}
                  className={`min-h-40 rounded-3xl border p-5 text-left shadow-card transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    active
                      ? "border-primary bg-primary-soft/40"
                      : "border-border bg-card hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover"
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-bold">
                    {route.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {route.short}
                  </p>
                </button>
              );
            })}
          </div>

          {selectedRoute && (
            <article
              id="document-result"
              aria-live="polite"
              className="mt-8 scroll-mt-24 rounded-[2rem] border border-primary/25 bg-card p-6 shadow-hover md:p-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                    Document classification
                  </div>
                  <h2 className="mt-2 font-display text-3xl font-bold">
                    {selectedRoute.title}
                  </h2>
                  <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">
                      What it generally is:
                    </strong>{" "}
                    {selectedRoute.classification}
                  </p>
                  <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">What it is not:</strong>{" "}
                    {selectedRoute.not}
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={printResult}>
                  <Printer className="h-4 w-4" /> Print or save result
                </Button>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-border p-5">
                  <h3 className="font-display text-xl font-bold">
                    First three checks
                  </h3>
                  <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedRoute.checks.map((item, index) => (
                      <li key={item} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <h3 className="font-display text-xl font-bold">
                    Common mistakes
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedRoute.mistakes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl border border-border p-5">
                  <h3 className="font-display text-xl font-bold">
                    Questions to ask
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {selectedRoute.questions.map((item) => (
                      <li key={item} className="flex gap-2">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-primary-soft/40 p-5">
                <div className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Safest next action
                </div>
                <p className="mt-2 font-semibold">{selectedRoute.next}</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button asChild variant="hero">
                    <Link to={selectedRoute.href}>
                      {selectedRoute.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href={selectedRoute.official}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() =>
                        trackSiteEvent("official_source_click", {
                          event_category: "medical_bill",
                          resource_id: selectedRoute.id,
                        })
                      }
                    >
                      {selectedRoute.officialLabel}{" "}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-3xl font-bold">Before you pay</h2>
            <ol className="mt-5 space-y-3 text-sm leading-relaxed text-muted-foreground">
              {beforePaySteps.map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[2rem] border border-border bg-muted/25 p-6">
            <h2 className="font-display text-3xl font-bold">
              Common billing patterns
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">
                  One visit, several bills:
                </strong>{" "}
                Facility, physician, laboratory, imaging, anesthesia,
                pathology, and ambulance organizations may bill separately.
              </p>
              <p>
                <strong className="text-foreground">EOB versus bill:</strong>{" "}
                The payer explains claim processing; the provider requests
                payment.
              </p>
              <p>
                <strong className="text-foreground">
                  Billed versus allowed:
                </strong>{" "}
                The provider submits the billed charge; the plan recognizes an
                allowed amount under its rules.
              </p>
              <p>
                <strong className="text-foreground">
                  Pending, denied, adjusted:
                </strong>{" "}
                Pending is not final, a denial needs its written reason, and
                adjustments may change the balance.
              </p>
            </div>
          </div>
        </section>

        <MedicalBillCaseDashboard />

        <section className="rounded-[2rem] border border-primary/20 bg-primary-soft/25 p-6 shadow-card md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <Download className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold">
                Medical Bill Response Pack
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Printable first-15-minute checklist, EOB-to-bill worksheet,
                call log, itemized-bill request script, assistance checklist,
                denial organizer, deadline tracker, and questions-before-paying
                sheet. Free, advertisement-free, and browser print/save-as-PDF
                ready.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button type="button" variant="hero" onClick={openPack}>
                <Download className="h-4 w-4" /> Open printable pack
              </Button>
              <Button asChild variant="outline">
                <Link
                  to="/newsletter"
                  onClick={() => {
                    trackSiteEvent("medical_bill_email_signup", {
                      event_category: "medical_bill",
                      entry_surface: "response_system",
                    });
                    trackSiteEvent("premium_pack_interest", {
                      event_category: "medical_bill",
                      offer_id: "response_pack_updates",
                    });
                  }}
                >
                  <Mail className="h-4 w-4" /> Get toolkit updates
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-card">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-display text-2xl font-bold">
              RN perspective
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Clinical care, discharge planning, insurance processing, and
              billing often move through different teams on different
              timelines. Identify each document, determine who owns the next
              action, and keep a dated record until the written claim and
              account status align.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Andrew Ciccarelli, BSN, RN contributes bedside and
              discharge-process perspective. Official sources control factual
              billing and coverage guidance.
            </p>
          </div>
          <div>
            <SectionHeading
              eyebrow="Official verification"
              title="Use the written notice and controlling source"
              description="A general guide cannot replace plan documents, hospital policies, state rules, or an official determination."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {officialSources.map(([title, href]) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackSiteEvent("official_source_click", {
                      event_category: "medical_bill",
                      resource_id: title,
                    })
                  }
                  className="rounded-2xl border border-border bg-card p-4 font-semibold shadow-card transition-smooth hover:border-primary/30"
                >
                  <Landmark className="mb-2 h-5 w-5 text-primary" />
                  {title} <ExternalLink className="ml-1 inline h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground shadow-card">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <strong className="text-foreground">Author and review</strong>
              <p className="mt-2">
                Andrew Ciccarelli, BSN, RN. Published July 2026. Source-reviewed
                July 20, 2026 against linked CMS, HealthCare.gov, IRS, Medicare,
                and CFPB materials.
              </p>
            </div>
            <div>
              <strong className="text-foreground">
                Review scope and limits
              </strong>
              <p className="mt-2">
                Reviewed for patient-education clarity and consistency with
                official guidance. Not state-specific legal review. Does not
                decide coverage, coding, medical necessity, liability,
                collectibility, appeal success, or what is owed.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-5 text-xs">
            <Link className="font-semibold text-primary" to="/methodology">
              Sources and methodology
            </Link>
            <Link className="font-semibold text-primary" to="/editorial-policy">
              Editorial policy
            </Link>
            <Link className="font-semibold text-primary" to="/disclosures">
              Disclosures
            </Link>
            <Link className="font-semibold text-primary" to="/contact">
              Corrections and contact
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default MedicalBillReviewToolkitPage;
