import { Link } from "react-router-dom";
import { CalendarCheck, ClipboardCheck, Shield, WalletCards } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { Button } from "@/components/ui/button";
import { ALL_ARTICLES } from "@/data/allArticles";
import { useSeo } from "@/lib/seo";

const articleSlugs = [
  "open-enrollment-mistakes-healthcare-workers",
  "premium-deductible-out-of-pocket-open-enrollment",
  "prescription-coverage-open-enrollment-checklist",
  "network-checklist-open-enrollment",
  "spouse-family-health-insurance-open-enrollment",
  "hsa-vs-fsa-healthcare-workers",
  "health-fsa-vs-dependent-care-fsa",
  "disability-insurance-healthcare-workers-open-enrollment",
  "employer-life-insurance-open-enrollment",
  "accident-critical-illness-hospital-indemnity-open-enrollment",
  "dental-vision-insurance-open-enrollment",
  "open-enrollment-paycheck-impact",
  "beneficiaries-open-enrollment-checklist",
];

const checklist = [
  "Compare total yearly premium, not just the per-paycheck deduction.",
  "Compare expected-year cost and worst-case out-of-pocket exposure.",
  "Check every recurring medication by dose, tier, pharmacy, and prior authorization rule.",
  "Verify primary care, specialists, hospitals, labs, imaging, urgent care, mental health, and pharmacies.",
  "Compare spouse surcharge rules and both employers' family premiums.",
  "Decide whether HSA, FSA, HRA, or dependent care FSA choices fit predictable expenses.",
  "Review short-term and long-term disability coverage before assuming PTO is enough.",
  "Review life insurance amount, guaranteed issue, portability, and beneficiaries.",
  "Add the annual cost of accident, critical illness, and hospital indemnity policies before buying.",
  "Run the paycheck impact before submitting benefits.",
  "Save confirmation screenshots and update beneficiaries.",
];

const OpenEnrollmentGuide = () => {
  useSeo({
    title: "Open Enrollment Guide for Healthcare Workers",
    description: "A step-by-step open enrollment guide for healthcare workers comparing premiums, deductibles, prescriptions, networks, HSAs, FSAs, disability, life insurance, and paycheck impact.",
    canonicalPath: "/open-enrollment",
  });

  const articles = articleSlugs
    .map((slug) => ALL_ARTICLES.find((article) => article.slug === slug))
    .filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow="Open Enrollment"
        title="Open Enrollment Guide for Healthcare Workers"
        description="A practical sequence for comparing health plans, tax accounts, family coverage, disability insurance, supplemental benefits, and paycheck impact before you submit benefits."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/tools#open-enrollment">Compare two health plans</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools/out-of-pocket-max-estimator">Estimate OOP max</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#final-checklist">Final checklist</a>
        </Button>
      </PageHero>

      <main className="container py-12 md:py-16 space-y-16">
        <section className="grid gap-5 md:grid-cols-3">
          {[
            { icon: Shield, title: "Health plan risk", body: "Compare premiums, deductibles, networks, prescriptions, and out-of-pocket exposure." },
            { icon: WalletCards, title: "Paycheck impact", body: "Stack every benefit choice before the first paycheck of the plan year surprises you." },
            { icon: CalendarCheck, title: "One-year decision", body: "Open enrollment choices often lock in until the next plan year unless a qualifying life event applies." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-bold">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <section>
          <SectionHeading
            eyebrow="Step-by-step guide"
            title="Read these in order"
            description="This path turns the open enrollment article library into a practical decision sequence."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => article && <ArticleCard key={article.slug} article={article} />)}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-primary-soft/30 p-6 md:p-8 shadow-card">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Main tools</div>
              <h2 className="font-display text-2xl font-bold mt-2">Compare total cost and bad-year exposure</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
                Use the true-cost calculator to compare plans, then use the out-of-pocket max estimator when you need to understand how close expected care may bring you to the plan cap.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/tools#open-enrollment">Open true-cost calculator</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/tools/out-of-pocket-max-estimator">Open OOP max estimator</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="final-checklist" className="scroll-mt-24">
          <SectionHeading eyebrow="Printable checklist" title="Before you submit benefits" description="Use this as the final pass before finishing your benefits choices. Print from your browser if you want a paper copy." />
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="space-y-3">
              {checklist.map((item, index) => (
                <label key={item} className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/40 p-3 text-sm text-muted-foreground">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border-border" />
                  <span><strong className="text-foreground">{index + 1}.</strong> {item}</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="soft" onClick={() => window.print()}>
                <ClipboardCheck className="h-4 w-4" /> Print checklist
              </Button>
              <Button asChild variant="outline">
                <Link to="/tools#paycheck-impact">Run paycheck impact</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default OpenEnrollmentGuide;
