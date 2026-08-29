import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  HeartPulse,
  Receipt,
  ShieldCheck,
  Stethoscope,
  Wallet,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { FOUNDER_HOSPITAL_ECONOMICS_ARTICLES } from "@/data/founderHospitalEconomicsArticles";
import { trackHomepageNavigation } from "@/lib/analytics";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

const featuredArticles = FOUNDER_HOSPITAL_ECONOMICS_ARTICLES;

const editorialDesks = [
  {
    icon: Receipt,
    title: "Healthcare costs and medical bills",
    href: "/insurance",
    description: "Charges, allowed amounts, EOBs, facility fees, financial assistance, and the prices patients actually encounter.",
  },
  {
    icon: Building2,
    title: "Hospitals, insurance, and incentives",
    href: "/topics/hospital-economics",
    description: "Margins, nonprofit status, reimbursement, staffed capacity, length of stay, patient flow, and why the system behaves the way it does.",
  },
  {
    icon: HeartPulse,
    title: "Discharge, rehab, and caregiving",
    href: "/patients-families",
    description: "Post-hospital care, coverage barriers, rehabilitation, equipment, medications, family work, and safer transitions.",
  },
  {
    icon: ShieldCheck,
    title: "Medicare and Medicaid",
    href: "/medicare-care-costs",
    description: "Coverage structure, plan rules, cost exposure, skilled versus custodial care, and official verification paths.",
  },
  {
    icon: Wallet,
    title: "Healthcare-worker money",
    href: "/healthcare-workers",
    description: "Pay, benefits, retirement plans, job offers, open enrollment, burnout, and the economics of working inside healthcare.",
  },
] as const;

const supportingUtilities = [
  {
    title: "Review a hospital bill",
    description: "Match the bill to the EOB, check the allowed amount and network processing, and organize questions before paying.",
    href: "/insurance/medical-bill-review-toolkit",
    cta: "Open bill review",
  },
  {
    title: "Plan the hospital-to-home transition",
    description: "Work through the likely care setting, coverage path, authorization, unresolved barriers, and safe backup questions.",
    href: "/insurance/hospital-discharge-coverage",
    cta: "Open navigator",
  },
  {
    title: "Find hospital financial assistance",
    description: "Open an official hospital policy, compare published thresholds, and prepare the application and verification steps.",
    href: "/medical-bills/financial-assistance",
    cta: "Find a policy",
  },
  {
    title: "Understand workplace benefits",
    description: "Connect health coverage, tax accounts, retirement, protection benefits, and paycheck tradeoffs without uploading documents.",
    href: "/products/healthcare-worker-benefits-decision-system",
    cta: "Open benefits guide",
  },
] as const;

const Index = () => (
  <>
    <PageHero
      eyebrow="RN-led reporting on healthcare money and systems"
      title="Understand the money and machinery behind American healthcare."
      description="Community Acquired Finance explains hospital prices, insurance rules, payment incentives, discharge barriers, and healthcare-worker finances from inside the system—then connects the explanation to practical, source-backed tools."
    >
      <Button asChild variant="hero" size="lg">
        <Link
          to="/articles"
          onClick={() => {
            trackGrowthEvent("home_primary_cta_clicked", { entry_surface: "home", action_id: "article_library" });
            trackHomepageNavigation("hero_action", "article_library", "/articles");
          }}
        >
          Read the publication <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link
          to="/tools"
          onClick={() => {
            trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "supporting_tools" });
            trackHomepageNavigation("hero_action", "supporting_tools", "/tools");
          }}
        >
          Use a guide or tool
        </Link>
      </Button>
    </PageHero>

    <section className="container min-w-0 py-14 md:py-20">
      <SectionHeading
        eyebrow="Featured reporting and explainers"
        title="Healthcare makes more sense when you can see who pays—and who absorbs the work."
        description="These articles begin with firsthand RN observations, then test the argument against current government rules, payment evidence, and the parts of the system patients rarely see."
      />
      <div className="mt-9 grid gap-5 md:grid-cols-2">
        {featuredArticles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            onClick={() => trackHomepageNavigation("featured_article", article.slug, `/articles/${article.slug}`)}
          />
        ))}
      </div>
      <div className="mt-7">
        <Button asChild variant="soft">
          <Link to="/articles">Browse all articles <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>

    <section className="border-y border-border bg-card/30 py-14 md:py-20">
      <div className="container min-w-0">
        <SectionHeading
          centered
          eyebrow="Explore by subject"
          title="Start with the part of healthcare you are trying to understand."
          description="CAF follows the money and the operational handoffs across patients, families, clinicians, hospitals, insurers, employers, and public programs."
        />
        <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {editorialDesks.map(({ icon: Icon, title, href, description }) => (
            <Link
              key={href}
              to={href}
              onClick={() => trackHomepageNavigation("editorial_desk", title, href)}
              className="group rounded-2xl border border-border bg-background p-5 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-hover md:p-6"
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-bold md:text-xl">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Explore this subject <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="container max-w-6xl min-w-0 py-14 md:py-20" aria-labelledby="system-lens-heading">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">A recurring CAF lens</div>
          <h2 id="system-lens-heading" className="mt-3 font-display text-3xl font-bold tracking-tight">The same event looks different from every seat.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            CAF is not trying to excuse the system or reduce it to villains. The useful work is showing where the incentives collide—and what that collision means for the person receiving care.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/about">Why Andrew built CAF <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {[
            ["What the patient sees", "A room, a clinician, a discharge conversation, and later a bill whose numbers may not resemble the care."],
            ["What the hospital sees", "Clinical risk, staffed capacity, labor, supplies, payment rules, quality measures, and the next patient waiting."],
            ["What the payer sees", "Benefits, contracts, networks, medical-necessity criteria, claims, authorization, and financial risk."],
            ["What the care team sees", "The work that must happen safely—even when the price, coverage decision, or next available service sits elsewhere."],
          ].map(([term, description]) => (
            <div key={term} className="rounded-2xl border border-border bg-card p-5">
              <dt className="font-display text-base font-bold text-foreground">{term}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    <section className="border-y border-border bg-background/55 py-14 md:py-20">
      <div className="container max-w-6xl min-w-0">
        <SectionHeading
          centered
          eyebrow="Guides and tools"
          title="When the explanation needs a next step."
          description="CAF's calculators, checklists, and guided workflows remain free supporting utilities. Use them after you understand which document, rule, number, or organization controls the decision."
        />
        <div className="mt-9 grid gap-4 md:grid-cols-2">
          {supportingUtilities.map((utility) => (
            <article key={utility.href} className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
              <Wrench className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-bold">{utility.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{utility.description}</p>
              <Link
                to={utility.href}
                onClick={() => trackHomepageNavigation("supporting_utility", utility.title, utility.href)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary underline-offset-4 hover:underline"
              >
                {utility.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-7 text-center">
          <Button asChild variant="soft">
            <Link to="/tools">Browse every free tool <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>

    <section className="container max-w-5xl py-12" aria-labelledby="human-trust-heading">
      <div className="rounded-3xl border border-primary/15 bg-primary-soft/20 p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-3xl items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="human-trust-heading" className="font-display text-xl font-bold">Written from nursing and care-transition experience. Checked against controlling sources.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Andrew Ciccarelli, RN, BSN created CAF after seeing patients, families, and healthcare workers expected to make financial and care-transition decisions without a usable explanation. Founder observations shape the questions; CMS, Medicare.gov, IRS, HHS, public filings, and current research shape the factual answer.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4 text-sm font-semibold">
            <Link to="/about" className="text-primary underline-offset-4 hover:underline">About Andrew</Link>
            <Link to="/methodology" className="text-primary underline-offset-4 hover:underline">Methodology</Link>
            <Link to="/editorial-policy" className="text-primary underline-offset-4 hover:underline">Editorial policy</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="container min-w-0 py-14 md:py-20">
      <NewsletterSignup
        source="home"
        title="Get one useful healthcare-finance explanation each month"
        description="New reporting, updated guides, and practical tools about hospital money, insurance rules, patient costs, Medicare, Medicaid, and healthcare-worker finances. Low frequency; no manufactured urgency."
        buttonLabel="Join the monthly list"
      />
    </section>
  </>
);

export default Index;
