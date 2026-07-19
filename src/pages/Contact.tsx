import { Link } from "react-router-dom";
import { Building2, CheckCircle2, Mail, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { useSeo } from "@/lib/seo";

const Contact = () => {
  useSeo({
    title: "Contact",
    description: "Contact Community Acquired Finance about corrections, source questions, website issues, educational healthcare finance topics, or a scoped organization program review.",
    canonicalPath: "/contact",
  });

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Questions, corrections, and source notes."
        description="Use this page for site feedback, correction requests, source questions, practical topic ideas, and scoped organization program reviews. Do not send private medical, financial, tax, legal, insurance, employer-plan, employee, member, student, or patient details."
      />

      <div className="container max-w-3xl py-12 md:py-16 space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold">Email</h2>
              <p className="text-muted-foreground leading-relaxed">
                For corrections, source suggestions, website issues, privacy requests, educational topic ideas, or an organization program review, email the official Community Acquired Finance inbox:
              </p>
              <p className="text-primary font-semibold">communityacquiredfinance [at] gmail [dot] com</p>
            </div>
          </div>
        </section>

        <section id="organization-review" className="scroll-mt-28 rounded-2xl border border-primary/20 bg-primary-soft/25 p-6 shadow-card">
          <div className="flex items-start gap-4">
            <Building2 className="mt-1 h-7 w-7 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-xl font-bold">For an organization program review</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Build a fixed-choice brief first. If you reached this page from a controlled CAF review experience, copy that brief before opening the inquiry. In your email, include only the non-sensitive planning context needed to route the conversation:</p>
              <ul className="mt-4 grid gap-2 text-sm leading-relaxed sm:grid-cols-2">
                {["Organization name and public website", "Your role and accountable program owner", "Broad audience: employees, patients/caregivers, members/students, or mixed", "First decision priority and planning horizon", "Expected internal reviewers and procurement requirements", "The specific question you need the program review to resolve"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{item}</li>)}
              </ul>
              <p className="mt-4 text-sm font-semibold">Do not attach participant lists, plan files, claims, screenshots, medical records, account records, case notes, medication orders, or confidential contracts.</p>
              <Button asChild variant="outline" className="mt-5"><Link to="/for-organizations#program-builder">Build the general organization brief</Link></Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-bold">Do not send sensitive details</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please do not send highly sensitive personal, medical, insurance, employment, tax, financial, account, or login details through email.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-bold">What contact is for</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Corrections, broken links, unclear language, source suggestions, privacy requests, topic requests, and general feedback about making the site more useful.
            </p>
          </div>
        </section>

        <DisclaimerBox />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="hero">
            <Link to="/about">Read about the site</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/editorial-policy">Editorial policy</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/for-organizations">Organization programs</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Contact;
