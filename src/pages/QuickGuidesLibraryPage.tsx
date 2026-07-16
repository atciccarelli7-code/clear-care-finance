import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  ClipboardCheck,
  FileCheck2,
  FileText,
  HeartHandshake,
  Receipt,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/lib/seo";

const liveGuides = [
  {
    title: "The Hospital Discharge & Medicare Quick Guide",
    status: "Available now",
    description:
      "A printable first-stop guide for discharge, observation status, rehab, home health, equipment, long-term care, Medicaid questions, Medicare Advantage plan decisions, and confusing medical bills.",
    href: "/guides/hospital-discharge-medicare",
    cta: "Open guide",
  },
] as const;

type LivePath = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const livePaths: LivePath[] = [
  {
    icon: CalendarClock,
    eyebrow: "Turning 65",
    title: "Build a Medicare enrollment timeline",
    description: "Organize work coverage, employer size, HSA timing, drug coverage, spouse coverage, and official enrollment steps.",
    href: "/medicare-care-costs/turning-65",
    cta: "Build the timeline",
  },
  {
    icon: Scale,
    eyebrow: "Medicare or Medicaid",
    title: "Check which official pathway may fit",
    description: "Use broad, private screening questions and leave with the agencies and programs that can make the real determination.",
    href: "/tools/medicare-medicaid-eligibility-check",
    cta: "Check possible pathways",
  },
  {
    icon: Receipt,
    eyebrow: "Medical bill",
    title: "Review a confusing bill before paying",
    description: "Identify the document, compare it with the EOB, check assistance and appeal options, and track the next call.",
    href: "/insurance/medical-bill-review-toolkit",
    cta: "Open bill review center",
  },
  {
    icon: FileCheck2,
    eyebrow: "Delayed or denied care",
    title: "Build a prior-authorization next-step plan",
    description: "Organize the notice, urgency, provider action, plan questions, documents, deadlines, and official verification.",
    href: "/tools/prior-authorization-next-step-guide",
    cta: "Build the next step",
  },
  {
    icon: ClipboardCheck,
    eyebrow: "Insurance paperwork",
    title: "Learn how to read an SBC",
    description: "Find the deductible, network, prescriptions, cost-sharing, exclusions, and examples that control a plan comparison.",
    href: "/insurance/how-to-read-an-sbc",
    cta: "Read the SBC guide",
  },
  {
    icon: ShieldCheck,
    eyebrow: "Medicare choices",
    title: "Compare coverage structures carefully",
    description: "Compare Original Medicare, Medicare Advantage, Medigap, provider access, prescriptions, authorization, and bad-year risk.",
    href: "/insurance/medicare-advantage",
    cta: "Compare the structures",
  },
];

const standards = [
  "One direct answer before details.",
  "No plan recommendations, affiliate language, rankings, or lead forms.",
  "Official-source notes on every guide page.",
  "Evergreen wording unless current-year numbers are freshly verified.",
  "Desktop, phone, and black-and-white print review before a PDF is published.",
] as const;

const formats = [
  {
    title: "Printable quick guide",
    description: "Use when you need a short document for a discharge meeting, family conversation, or phone call.",
    href: "/guides/hospital-discharge-medicare",
    cta: "Open the live guide",
  },
  {
    title: "Guided tool or checklist",
    description: "Use when broad answers or plan numbers need to be organized into a result, receipt, or next-action list.",
    href: "/tools",
    cta: "Browse guided tools",
  },
  {
    title: "Complete decision pathway",
    description: "Use when the problem spans explanations, tools, documents, deadlines, and official verification.",
    href: "/start-here",
    cta: "Choose a pathway",
  },
] as const;

const QuickGuidesLibraryPage = () => {
  useSeo({
    title: "Quick Guides for Medicare, Medicaid, Discharge, and Medical Bills",
    description:
      "Use live printable guides, checklists, and decision pathways for Medicare, Medicaid, hospital discharge, insurance paperwork, prior authorization, and confusing medical bills.",
    canonicalPath: "/guides",
  });

  return (
    <div>
      <PageHero
        eyebrow="Printable guides and practical checklists"
        title="Use the format that fits the healthcare question in front of you"
        description="Open a printable guide when you need a short reference. Use a guided tool or decision pathway when the answer depends on documents, timing, coverage, or several next steps."
      >
        <Button asChild size="lg">
          <Link to="/guides/hospital-discharge-medicare">
            Open the live quick guide <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/start-here">Help me choose</Link>
        </Button>
      </PageHero>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-labelledby="live-guides-title">
        <SectionHeading
          id="live-guides-title"
          eyebrow="Printable and available now"
          title="Live quick guides"
          description="Only publicly available guides appear here. Work still in editorial or source review stays off the public shelf."
          centered
        />
        <div className="mx-auto max-w-3xl">
          {liveGuides.map((guide) => (
            <Card key={guide.title} className="rounded-3xl border-border/80 bg-card shadow-card">
              <CardHeader>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{guide.status}</p>
                <CardTitle className="font-display text-2xl leading-tight">{guide.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{guide.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to={guide.href}>{guide.cta} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-12 md:py-16" aria-labelledby="live-paths-title">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading
            id="live-paths-title"
            eyebrow="Useful now"
            title="Need help with a different question?"
            description="These live resources are not all printable PDFs. They are the stronger choice when the answer needs an interactive check, a longer decision path, or several official verification steps."
            centered
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {livePaths.map(({ icon: Icon, eyebrow, title, description, href, cta }) => (
              <Link key={href} to={href} className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-smooth hover:-translate-y-1 hover:border-primary/35 hover:shadow-hover">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
                <h3 className="mt-2 font-display text-xl font-bold leading-tight">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16" aria-labelledby="guide-quality-title">
        <Card className="rounded-3xl border-border/80 bg-card shadow-card">
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle id="guide-quality-title" className="font-display text-2xl">Quick guide quality standard</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              A public guide should feel simple enough for a stressed family member and careful enough for a healthcare worker to respect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
              {standards.map((item) => (
                <div key={item} className="rounded-2xl border border-border bg-background/70 p-4 text-sm font-semibold leading-relaxed text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/30 py-12 md:py-16" aria-labelledby="guide-formats-title">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
              <HeartHandshake className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">How the library works</p>
              <h2 id="guide-formats-title" className="mt-2 font-display text-3xl font-bold tracking-tight">Choose the right level of support</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {formats.map((format) => (
              <Link key={format.title} to={format.href} className="group rounded-3xl border border-border bg-card p-6 shadow-card transition-smooth hover:border-primary/35 hover:shadow-hover">
                <h3 className="font-display text-xl font-bold">{format.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{format.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {format.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickGuidesLibraryPage;
