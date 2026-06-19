import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

type InfoSection = {
  title: string;
  body: ReactNode;
};

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: InfoSection[];
};

export const InfoPage = ({ eyebrow, title, description, sections }: InfoPageProps) => (
  <>
    <PageHero eyebrow={eyebrow} title={title} description={description} />
    <section className="container max-w-3xl py-12 md:py-16 space-y-6">
      {sections.map((section) => (
        <article key={section.title} className="rounded-3xl border border-border bg-card p-6 shadow-card md:p-8">
          <h2 className="font-display text-xl font-bold md:text-2xl">{section.title}</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {section.body}
          </div>
        </article>
      ))}
    </section>
  </>
);
