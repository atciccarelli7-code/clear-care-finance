import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { articles, categories } from "@/data/articles";
import { cn } from "@/lib/utils";

const Articles = () => {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCat = cat === "All" || a.category === cat;
      const matchesQ = !q || (a.title + a.description).toLowerCase().includes(q.toLowerCase());
      return matchesCat && matchesQ;
    });
  }, [q, cat]);

  return (
    <>
      <section className="bg-gradient-hero">
        <div className="container py-16 md:py-20 text-center max-w-3xl mx-auto space-y-4 animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full bg-card border border-border text-xs font-semibold text-primary shadow-card">
            Articles
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">
            Short, honest reads.
          </h1>
          <p className="text-lg text-muted-foreground">
            No scare tactics, no sales funnel — just plain-English explanations of healthcare money topics.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="max-w-xl mx-auto relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles..."
            className="pl-11 h-12 rounded-full"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold transition-smooth border",
                cat === c
                  ? "bg-primary text-primary-foreground border-primary shadow-card"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <article
              key={a.slug}
              className="group rounded-2xl border border-border bg-card p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover hover:border-primary/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-secondary-soft text-secondary text-xs font-semibold">{a.category}</span>
                <span className="text-xs text-muted-foreground">{a.readTime}</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-smooth">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.description}</p>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No articles match that search yet.</div>
        )}
      </section>
    </>
  );
};

export default Articles;
