import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/data/glossary";
import { GlossaryTerm } from "@/components/shared/GlossaryTerm";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { cn } from "@/lib/utils";
import { absoluteUrl, SITE_NAME, SITE_URL, useJsonLd, useSeo } from "@/lib/seo";

const Glossary = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof GLOSSARY_CATEGORIES)[number]>("All");

  useSeo({
    title: "Healthcare Finance Glossary",
    description:
      "Plain-English definitions for healthcare finance terms used in benefits paperwork, hospital bills, Medicare letters, insurance plans, and paycheck decisions.",
    canonicalPath: "/glossary",
  });

  useJsonLd("glossary-page", {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Healthcare Finance Glossary",
    url: absoluteUrl("/glossary"),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    hasDefinedTerm: GLOSSARY.map((entry) => ({
      "@type": "DefinedTerm",
      name: entry.term,
      description: entry.definition,
      inDefinedTermSet: absoluteUrl("/glossary"),
    })),
  });

  const filtered = useMemo(
    () =>
      GLOSSARY.filter(
        (e) =>
          (cat === "All" || e.category === cat) &&
          (!q || (e.term + " " + e.definition).toLowerCase().includes(q.toLowerCase())),
      ).sort((a, b) => a.term.localeCompare(b.term)),
    [q, cat],
  );

  return (
    <>
      <PageHero
        eyebrow="Glossary"
        title="Healthcare finance terms, defined like a human."
        description="Quick definitions for the words that show up on benefits paperwork, hospital bills, and Medicare letters."
      />
      <section className="container py-12">
        <div className="max-w-xl mx-auto relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms..."
            className="pl-11 h-12 rounded-full"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {GLOSSARY_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-smooth border",
                cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {filtered.map((e) => (
            <GlossaryTerm key={e.term} entry={e} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No terms match that search.</div>
        )}

        <div className="max-w-3xl mx-auto mt-16">
          <DisclaimerBox />
        </div>
      </section>
    </>
  );
};

export default Glossary;
