import { Mail } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

const Contact = () => (
  <>
    <PageHero
      eyebrow="Contact"
      title="Questions, corrections, or source suggestions?"
      description="Community Acquired Finance is built to be useful, accurate, and practical. Send corrections, source ideas, or collaboration notes here."
    />
    <section className="container max-w-3xl py-12 md:py-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Email</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              For now, contact is handled by email while the site stays lightweight and simple.
            </p>
            <Button asChild variant="hero" className="mt-5">
              <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Contact;
