import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  HeartPulse,
  Shield,
  Users,
  Building2,
  Pill,
  Stethoscope,
  Wallet,
  Accessibility,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Home,
  Bandage,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MedicareMedicaidGuide = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero">
        <div className="container py-16 md:py-24 text-center max-w-3xl mx-auto space-y-5 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-card">
            Medicare & Medicaid
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Medicare vs Medicaid: What They Cover, Who Qualifies, and Why It Matters
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Medicare and Medicaid sound similar, but they solve different problems. Medicare is mostly age or disability-based insurance. Medicaid is income/resource-based assistance that can help with costs Medicare may not fully cover.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="#compare">Compare Medicare vs Medicaid <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#sources">View sources</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Medicare vs Medicaid comparison cards */}
      <section id="compare" className="container py-20 scroll-mt-20">
        <SectionHeading
          centered
          eyebrow="Comparison"
          title="Medicare vs Medicaid"
          description="Two programs. One letter apart. Very different jobs."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Medicare card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Medicare</h3>
                <p className="text-sm text-muted-foreground">Age or disability-based insurance</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Most people qualify at age 65",
                "Also covers certain younger people with disabilities",
                "Enrollment is not based on income",
                "Has monthly premiums for most parts",
                "Federal program with consistent rules nationwide",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Medicaid card */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-card transition-smooth hover:shadow-hover">
            <div className="flex items-center gap-3 mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Medicaid</h3>
                <p className="text-sm text-muted-foreground">Income/resource-based assistance</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Based on income, family size, and resources",
                "Also covers certain groups like pregnant women and children",
                "Rules and benefits vary by state",
                "Usually has little or no monthly premium",
                "State and federal partnership program",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="container pb-20">
        <SectionHeading
          centered
          eyebrow="At a glance"
          title="How Medicare and Medicaid compare"
        />
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 font-semibold text-foreground">Topic</th>
                <th className="text-left px-6 py-4 font-semibold text-primary">Medicare</th>
                <th className="text-left px-6 py-4 font-semibold text-secondary">Medicaid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  topic: "Who qualifies",
                  medicare: "Most people age 65+ and some younger people with disabilities or specific conditions",
                  medicaid: "People with limited income and resources; also pregnant women, children, and some seniors",
                },
                {
                  topic: "Who runs it",
                  medicare: "Federal government",
                  medicaid: "Your state, with federal funding and guidelines",
                },
                {
                  topic: "What it helps pay for",
                  medicare: "Hospital care, doctor visits, preventive care, and prescription drugs (with add-on plans)",
                  medicaid: "Doctor visits, hospital care, prescriptions, and often services Medicare does not cover",
                },
                {
                  topic: "Rules vary by state",
                  medicare: "No — rules are consistent nationwide",
                  medicaid: "Yes — eligibility and benefits differ by state",
                },
                {
                  topic: "Long-term care coverage",
                  medicare: "Very limited — short-term skilled nursing after a hospital stay only",
                  medicaid: "Yes — often covers nursing home care and many home-based services for those who qualify",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-smooth">
                  <td className="px-6 py-4 font-medium text-foreground">{row.topic}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.medicare}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.medicaid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What Medicare usually covers */}
      <section className="container pb-20">
        <SectionHeading
          centered
          eyebrow="Medicare coverage"
          title="What Medicare usually covers"
          description="Original Medicare includes Part A and Part B. Most people also add prescription coverage."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Part A",
              subtitle: "Hospital care",
              items: ["Inpatient hospital stays", "Skilled nursing facility care (under limited rules)", "Hospice care", "Some home health services"],
            },
            {
              icon: Stethoscope,
              title: "Part B",
              subtitle: "Doctor & outpatient care",
              items: ["Doctor visits", "Outpatient care", "Preventive services", "Durable medical equipment"],
            },
            {
              icon: Pill,
              title: "Part D",
              subtitle: "Prescription drugs",
              items: ["Prescription medications", "Vaccines", "Some recommended shots", "Private plan options"],
            },
            {
              icon: Shield,
              title: "Medicare Advantage",
              subtitle: "Part C bundled plans",
              items: ["Combines Part A and Part B", "Often includes prescription drugs", "May add dental, vision, and hearing", "Run by private insurers"],
            },
            {
              icon: Users,
              title: "Skilled nursing facility",
              subtitle: "Limited coverage",
              items: ["Short-term skilled nursing after a qualifying hospital stay", "Rehabilitation services", "Not long-term custodial care", "Time and condition limits apply"],
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-hover"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary mb-4">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold">{card.title}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">{card.subtitle}</p>
              <ul className="space-y-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* What Medicaid may help with */}
      <section className="container pb-20">
        <SectionHeading
          centered
          eyebrow="Medicaid coverage"
          title="What Medicaid may help with"
          description="Medicaid can fill gaps Medicare leaves open — especially for people with limited income and resources."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: DollarSign,
              title: "Premiums",
              desc: "Medicaid may pay Medicare premiums, deductibles, and coinsurance for people who qualify.",
            },
            {
              icon: Wallet,
              title: "Out-of-pocket costs",
              desc: "Copays, deductibles, and other cost-sharing can be reduced or eliminated for eligible enrollees.",
            },
            {
              icon: Accessibility,
              title: "Long-term care",
              desc: "Medicaid is the primary public program covering long-term nursing home care and many home-based services.",
            },
            {
              icon: Home,
              title: "Nursing home care",
              desc: "For those who qualify, Medicaid can cover room, board, and care in a skilled nursing or intermediate facility.",
            },
            {
              icon: Bandage,
              title: "Services Medicare may not fully cover",
              desc: "Dental, vision, hearing, transportation, and personal care services are often covered by Medicaid but not Original Medicare.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-hover"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-soft text-secondary mb-4">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual eligible */}
      <section className="container pb-20">
        <div className="rounded-3xl bg-gradient-accent p-8 md:p-12 text-secondary-foreground shadow-hover">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Dual eligible</h2>
            <p className="opacity-90 leading-relaxed">
              Some people qualify for both Medicare and Medicaid at the same time. These individuals are called dual eligible.
            </p>
            <p className="opacity-90 leading-relaxed">
              Medicare usually pays first for covered services. Medicaid may then help with remaining costs like premiums, deductibles, copays, and services that Medicare does not cover — including long-term care. If you think you or a family member might qualify, contact your state's Medicaid office or a local State Health Insurance Assistance Program (SHIP) counselor.
            </p>
          </div>
        </div>
      </section>

      {/* Long-term care warning */}
      <section className="container pb-20">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Important: Medicare does not pay for most long-term custodial care.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Help with bathing, dressing, toileting, meals, supervision, and daily living is usually considered custodial care and is generally not covered by Medicare.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Medicare covers short-term skilled nursing after a qualifying hospital stay, but it does not cover ongoing assistance with everyday activities. Medicaid is the primary public program that covers long-term nursing home care and many home-based services for people who qualify. Planning ahead — or understanding your options early — can help avoid surprises later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sources */}
      <section id="sources" className="container pb-24 scroll-mt-20">
        <SectionHeading
          centered
          eyebrow="Sources"
          title="Where this information comes from"
          description="We built this guide from credible, publicly available sources so you can verify and explore further."
        />
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            {
              label: "Medicare.gov",
              url: "https://www.medicare.gov",
            },
            {
              label: "Medicaid.gov",
              url: "https://www.medicaid.gov",
            },
            {
              label: "KFF",
              url: "https://www.kff.org",
            },
            {
              label: "CMS",
              url: "https://www.cms.gov",
            },
          ].map((source) => (
            <a
              key={source.label}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-smooth hover:shadow-hover hover:border-primary/30 group"
            >
              <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-smooth shrink-0" />
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                {source.label}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary ml-auto shrink-0 transition-smooth" />
            </a>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">
          This page provides educational content only. It is not individualized financial, medical, tax, insurance, or legal advice. Always verify current benefits and eligibility with official sources.
        </p>
      </section>
    </>
  );
};

export default MedicareMedicaidGuide;
