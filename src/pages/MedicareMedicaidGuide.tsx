import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/shared/SectionHeading";
import {
  HeartPulse,
  Shield,
  Users,
  Building2,
  Pill,
  Eye,
  Ear,
  Stethoscope,
  Wallet,
  Baby,
  Accessibility,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ArrowRight,
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
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Medicare & Medicaid Guide
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Two programs. One letter apart. Very different jobs. Here is a calm, plain-English guide to what each one covers, who qualifies, and how they sometimes work together.
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

      {/* Medicare vs Medicaid comparison */}
      <section id="compare" className="container py-20 scroll-mt-20">
        <SectionHeading
          centered
          eyebrow="Comparison"
          title="Medicare vs Medicaid: the simple difference"
          description="Medicare is mainly based on age and disability. Medicaid is mainly based on income and need. Here is what that means in practice."
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
                <p className="text-sm text-muted-foreground">Federal health insurance</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Usually starts at age 65",
                "Also covers younger people with certain disabilities",
                "Enrollment is not based on income",
                "Has monthly premiums for most parts",
                "Hospital care, doctor visits, prescriptions, and preventive care",
                "Administered by the federal government",
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
                <p className="text-sm text-muted-foreground">State and federal health coverage</p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                "Based on income and family size",
                "Also covers certain groups like pregnant women and children",
                "Rules vary by state",
                "Usually has little or no monthly premium",
                "Doctor visits, hospital care, prescriptions, and long-term care",
                "Administered by your state, with federal funding",
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

      {/* What Medicare usually covers */}
      <section className="container pb-20">
        <SectionHeading
          centered
          eyebrow="Medicare coverage"
          title="What Medicare usually covers"
          description="Original Medicare has two main parts. Most people also add a prescription plan. Here is the big picture."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Building2,
              title: "Part A",
              subtitle: "Hospital insurance",
              items: ["Inpatient hospital stays", "Skilled nursing facility care", "Hospice care", "Some home health"],
              accent: "blue" as const,
            },
            {
              icon: Stethoscope,
              title: "Part B",
              subtitle: "Medical insurance",
              items: ["Doctor visits", "Outpatient care", "Preventive services", "Medical supplies"],
              accent: "blue" as const,
            },
            {
              icon: Pill,
              title: "Part D",
              subtitle: "Prescriptions",
              items: ["Prescription medications", "Vaccines", "Some recommended shots", "Private plan options"],
              accent: "blue" as const,
            },
            {
              icon: Eye,
              title: "Extras",
              subtitle: "Add-on options",
              items: ["Dental, vision, hearing (often limited)", "Fitness benefits", "Medicare Advantage bundles"],
              accent: "blue" as const,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card transition-smooth hover:shadow-hover"
            >
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg mb-4 ${
                  card.accent === "blue" ? "bg-primary-soft text-primary" : "bg-secondary-soft text-secondary"
                }`}
              >
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
          description="Because states run Medicaid, exact benefits differ. But most programs cover the basics and some services Medicare does not."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Stethoscope,
              title: "Doctor and hospital visits",
              desc: "Primary care, specialist visits, emergency care, and hospital stays with little or no copay.",
            },
            {
              icon: Pill,
              title: "Prescriptions",
              desc: "Most states cover prescription drugs. Some have small copays, but costs are usually far lower than private plans.",
            },
            {
              icon: Baby,
              title: "Pregnancy and newborn care",
              desc: "Prenatal visits, delivery, and postpartum care are covered in every state for qualifying mothers.",
            },
            {
              icon: Accessibility,
              title: "Long-term care",
              desc: "Nursing home care and home-based services are often covered — a major difference from standard Medicare.",
            },
            {
              icon: Ear,
              title: "Dental, vision, and hearing",
              desc: "Many states cover cleanings, eye exams, glasses, and hearing aids. These are often excluded from Original Medicare.",
            },
            {
              icon: Wallet,
              title: "Transportation and other supports",
              desc: "Some states offer rides to appointments, personal care at home, and caregiver respite support.",
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
            <h2 className="font-display text-2xl md:text-3xl font-bold">What does "dual eligible" mean?</h2>
            <p className="opacity-90 leading-relaxed">
              Some people qualify for both Medicare and Medicaid at the same time. Medicare usually pays first. Medicaid may cover remaining costs like premiums, deductibles, copays, and services Medicare does not cover — including long-term care.
            </p>
            <p className="opacity-90 leading-relaxed">
              If you think you or a family member might qualify, contact your state's Medicaid office or a local State Health Insurance Assistance Program (SHIP) counselor.
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
              <h3 className="font-display text-xl font-bold text-foreground mb-2">A note about long-term care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Original Medicare does <strong className="text-foreground">not</strong> cover most long-term nursing home stays or extended in-home caregiving. It covers short-term skilled nursing after a hospital stay, but ongoing custodial care is generally not included.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Medicaid is the primary public program that covers long-term nursing home care and many home-based services for people who qualify. Planning ahead — or understanding your options early — can help avoid surprises later.
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
              label: "Medicare.gov — What Medicare Covers",
              url: "https://www.medicare.gov/what-medicare-covers",
            },
            {
              label: "Medicaid.gov — Medicaid Benefits",
              url: "https://www.medicaid.gov/medicaid/benefits/index.html",
            },
            {
              label: "CMS.gov — Medicare & Medicaid Basics",
              url: "https://www.cms.gov/medicare-medicaid-basics",
            },
            {
              label: "USA.gov — Medicare vs Medicaid",
              url: "https://www.usa.gov/medicare-medicaid",
            },
            {
              label: "SHIP — State Health Insurance Assistance Programs",
              url: "https://www.shiptacenter.org",
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
