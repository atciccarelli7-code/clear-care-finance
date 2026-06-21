import { Link } from "react-router-dom";
import { Mail, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { useSeo } from "@/lib/seo";

const Contact = () => {
  useSeo({
    title: "Contact",
    description: "Contact Community Acquired Finance about corrections, source questions, website issues, and educational healthcare finance topics.",
    canonicalPath: "/contact",
  });

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Questions, corrections, and source notes."
        description="Use this page for site feedback, correction requests, source questions, and practical topic ideas. Do not send private medical, financial, tax, legal, or insurance details."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold">Email</h2>
              <p className="text-muted-foreground leading-relaxed">
                For corrections, source suggestions, website issues, or general educational topic ideas, email:
              </p>
              <a className="text-primary font-semibold hover:underline" href="mailto:atciccarelli7@gmail.com">
                atciccarelli7@gmail.com
              </a>
              <p className="text-xs text-muted-foreground">
                A domain-based inbox can replace this before heavier public promotion.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <MessageSquareWarning className="h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-bold">Do not send sensitive details</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Please do not send Social Security numbers, medical record numbers, claim numbers, account numbers, private diagnoses, employer login details, or full financial documents.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-bold">What contact is for</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Corrections, broken links, unclear language, source suggestions, topic requests, and general feedback about making the site more useful.
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
        </div>
      </main>
    </>
  );
};

export default Contact;
