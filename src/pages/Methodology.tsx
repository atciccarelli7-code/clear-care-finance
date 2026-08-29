import { Link } from "react-router-dom";
import { BookOpenCheck, FileSearch, RefreshCcw, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { SOURCE_PRESETS } from "@/data/sources";
import { useSeo } from "@/lib/seo";

const principles = [
  {
    icon: FileSearch,
    title: "Start with primary sources",
    body: "Government agencies, official program pages, IRS guidance, CMS, Medicare.gov, Medicaid.gov, HealthCare.gov, BLS, and plan documents get priority when a rule or definition depends on official language.",
  },
  {
    icon: BookOpenCheck,
    title: "Translate, do not exaggerate",
    body: "Articles are written to simplify terms and decisions without pretending every reader has the same employer, plan, state, income, health situation, or family needs.",
  },
  {
    icon: RefreshCcw,
    title: "Update when rules change",
    body: "Healthcare finance changes with tax years, plan years, policy updates, and employer benefit design. Pages should be corrected or updated when material information changes.",
  },
  {
    icon: ShieldAlert,
    title: "Keep advice boundaries clear",
    body: "The site provides education and decision frameworks. It does not provide individualized medical, financial, tax, legal, billing, insurance, or employment advice.",
  },
];

const Methodology = () => {
  useSeo({
    title: "Sources and Methodology",
    description: "How Community Acquired Finance chooses sources, writes articles, uses calculators, and keeps educational boundaries clear.",
    canonicalPath: "/methodology",
  });

  return (
    <>
      <PageHero
        eyebrow="Sources / Methodology"
        title="How CAF turns firsthand questions into source-backed reporting."
        description="How founder observations are preserved, tested against authoritative evidence, edited for readers, connected to practical tools, and updated when the underlying rules change."
      />

      <div className="container py-12 md:py-16 space-y-14">
        <section className="grid gap-5 md:grid-cols-2">
          {principles.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="max-w-3xl space-y-5">
          <SectionHeading eyebrow="Article method" title="The preferred article format" />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3 text-muted-foreground leading-relaxed">
            <p>CAF often begins with a question or contradiction Andrew encountered through nursing and care-transition work. The original thesis, analogy, or unusual observation is preserved when it helps; factual claims are then separated from interpretation and checked against current primary or authoritative sources.</p>
            <p>Major explainers answer the reader near the beginning, show how the issue looks from several seats in the system, add evidence and limitations, and end with practical questions or a relevant CAF utility. Other pages use a shorter guide format when that better matches the decision. Length follows usefulness, not a word-count target.</p>
            <p>The founder's rough writing remains source material rather than published evidence. CAF does not silently copy unresolved claims into an article, invent firsthand experience, or automatically publish every manuscript addition.</p>
          </div>
        </section>

        <section className="max-w-3xl space-y-5">
          <SectionHeading eyebrow="Calculator method" title="Calculator limits" />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3 text-muted-foreground leading-relaxed">
            <p>Calculators are simplified educational estimates. They do not know the reader's full plan document, employer rules, tax return, claim history, state rules, exact benefit design, or household details.</p>
            <p>Use calculator results to understand tradeoffs and ask better questions. Verify final decisions with official documents, benefits departments, insurers, billing offices, and qualified professionals where appropriate.</p>
          </div>
        </section>

        <section id="sources" className="space-y-6 scroll-mt-24">
          <SectionHeading eyebrow="Source library" title="Core source set" description="Common sources used across the site. Individual articles may include more specific references." />
          <SourceList sources={Object.values(SOURCE_PRESETS)} />
        </section>

        <DisclaimerBox />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/articles">Browse articles</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Report an issue</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Methodology;
