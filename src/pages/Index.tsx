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
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { ArticleCard } from "@/components/shared/ArticleCard";
import { FLAGSHIP_VISUAL_ARTICLES } from "@/data/flagshipVisualArticles";
import { FEATURED_PUBLISHER_ARTICLES } from "@/data/featuredPublisherArticles";
import { trackHomepageNavigation } from "@/lib/analytics";
import { trackGrowthEvent } from "@/lib/growthAnalytics";

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
    <header className="publication-intro container py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">RN-led reporting · Community Acquired Finance</p>
      <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] md:text-6xl">Understand the money and machinery behind American healthcare.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">An RN’s view of hospital bills, insurance rules, and what it takes to get care.</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
        <Link to="/articles" className="text-primary underline underline-offset-4" onClick={() => { trackGrowthEvent("home_primary_cta_clicked", { entry_surface: "home", action_id: "article_library" }); trackHomepageNavigation("hero_action", "article_library", "/articles"); }}>Read the publication</Link>
        <Link to="/tools" className="text-primary underline underline-offset-4" onClick={() => { trackGrowthEvent("home_secondary_cta_clicked", { entry_surface: "home", action_id: "supporting_tools" }); trackHomepageNavigation("hero_action", "supporting_tools", "/tools"); }}>Use a guide or tool</Link>
      </div>
    </header>
    <section className="container publication-featured pb-12" aria-labelledby="featured-stories-heading">
      <div className="mb-6 border-t-2 border-foreground pt-4"><h2 id="featured-stories-heading" className="text-xs font-bold uppercase tracking-[0.18em]">Featured reporting and explainers</h2></div>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <ArticleCard article={FLAGSHIP_VISUAL_ARTICLES[0]} featured onClick={() => trackHomepageNavigation("featured_article", FLAGSHIP_VISUAL_ARTICLES[0].slug, `/articles/${FLAGSHIP_VISUAL_ARTICLES[0].slug}`)} />
        <aside className="border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0" aria-label="Latest reporting">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">Also from CAF</h2>
          <div className="space-y-6">{FEATURED_PUBLISHER_ARTICLES.filter(a => !FLAGSHIP_VISUAL_ARTICLES.some(f => f.slug === a.slug)).map(article => <ArticleCard key={article.slug} article={article} onClick={() => trackHomepageNavigation("featured_article", article.slug, `/articles/${article.slug}`)} />)}</div>
        </aside>
      </div>
      <div className="mt-10 grid gap-x-7 gap-y-9 md:grid-cols-2 lg:grid-cols-3">{FLAGSHIP_VISUAL_ARTICLES.slice(1).map(article => <ArticleCard key={article.slug} article={article} onClick={() => trackHomepageNavigation("featured_article", article.slug, `/articles/${article.slug}`)} />)}</div>
      <div className="mt-8 flex flex-wrap gap-6 text-sm font-semibold text-primary"><Link to="/articles" className="underline underline-offset-4">Browse all articles</Link><Link to="/articles#visual-explainers" className="underline underline-offset-4">Explore the visual explainers</Link></div>
    </section>
    <section className="container mb-12" aria-labelledby="visual-discovery-heading">
      <div className="visual-discovery grid gap-6 border-y border-border py-7 md:grid-cols-[1fr_2fr]">
        <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">See how it works</p><h2 id="visual-discovery-heading" className="mt-3 font-display text-3xl">Follow the system, one step at a time.</h2></div>
        <div className="grid gap-5 sm:grid-cols-3">{[
          ["01", "The Anatomy of a Hospital Bill", "Explore an itemized bill and compare what different insurance arrangements change.", "/hospital-bill-anatomy"],
          ["02", "Medicare or Medicaid?", "See how the programs differ and where coverage can overlap.", "/articles/medicare-vs-medicaid-what-is-the-difference#visual-medicare-medicaid"],
          ["03", "The path to rehab", "Trace the coverage questions behind a post-hospital handoff.", "/articles/does-medicare-cover-rehab-after-hospital-stay#visual-medicare-snf"],
        ].map(([number, title, description, href]) => <Link key={href} to={href} className="group block border-l-2 border-primary/30 pl-4"><span className="font-display text-3xl text-primary" aria-hidden="true">{number}</span><h3 className="mt-2 font-display text-xl font-bold group-hover:underline">{title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p><span className="mt-3 inline-block text-sm font-semibold text-primary underline underline-offset-4">View explainer</span></Link>)}</div>
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
