import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Sparkles, Users, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";
import { isArticleDraft } from "@/lib/article-status";

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="space-y-2.5 md:space-y-3">
    <div className="flex items-center gap-2.5 md:gap-3">
      <div className="inline-flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-lg bg-primary-soft text-primary shrink-0">
        <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </div>
      <h2 className="font-display text-lg md:text-2xl font-bold">{title}</h2>
    </div>
    <div className="text-[0.95rem] md:text-base text-muted-foreground leading-[1.65] md:leading-relaxed space-y-3 md:space-y-4 pl-0 md:pl-12">{children}</div>
  </div>
);

const ArticlePage = () => {
  const { slug = "" } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return <Navigate to="/articles" replace />;

  if (isArticleDraft(article)) {
    return (
      <>
        <PageHero
          eyebrow={`${article.category} · Coming soon`}
          title={article.title}
          description="This guide is still being reviewed and completed. It is not being presented as finished educational content yet."
        />
        <section className="container max-w-3xl py-12 md:py-16">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card md:p-10">
            <h2 className="font-display text-2xl font-bold">This article is still in progress.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              We would rather publish a complete, source-backed guide than fill the page with unfinished copy.
              Published articles and calculators remain available while this one is completed.
            </p>
            <Button asChild variant="soft" className="mt-6">
              <Link to="/articles"><ArrowLeft className="h-4 w-4" /> Browse published articles</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title} description={article.promise}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
        </div>
      </PageHero>

      <article className="container max-w-3xl py-8 md:py-16 space-y-8 md:space-y-12">
        <Section icon={Users} title="Who this is for">
          <p>{article.audience}</p>
        </Section>

        <Section icon={Sparkles} title="60-second summary">
          <p className="text-foreground/90">{article.summary}</p>
        </Section>

        {article.sections && article.sections.length > 0 ? (
          <Section icon={BookOpen} title="Fact sheet">
            <div className="grid gap-4 md:gap-5">
              {article.sections.map((s, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-3">
                  <h3 className="font-display text-base md:text-lg font-bold text-foreground">{s.title}</h3>
                  {s.definition && (
                    <p className="text-[0.95rem] md:text-base text-muted-foreground leading-[1.65]">{s.definition}</p>
                  )}
                  {s.keyPoints && s.keyPoints.length > 0 && (
                    <ul className="space-y-2">
                      {s.keyPoints.map((p, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[0.95rem] md:text-base text-muted-foreground leading-[1.6]">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.watchOut && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 md:p-4 flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm md:text-[0.95rem] text-foreground/90 leading-[1.6]">
                        <span className="font-semibold text-destructive">Watch out: </span>{s.watchOut}
                      </div>
                    </div>
                  )}
                  {s.example && (
                    <div className="rounded-xl border border-border bg-muted/30 p-3 md:p-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-1">Example</div>
                      <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-[1.6]">{s.example}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        ) : (
          <Section icon={Clock} title="Plain-English explanation">
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Section>
        )}

        {article.example && (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">Healthcare-specific example</div>
            <h3 className="font-display text-lg font-bold mb-2">{article.example.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{article.example.body}</p>
          </div>
        )}

        {article.relatedCalculator && (
          <div className="rounded-2xl border border-primary/30 bg-primary-soft/40 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Related tool</div>
              <h3 className="font-display text-lg font-bold">{article.relatedCalculator.label}</h3>
            </div>
            <Button asChild variant="hero">
              <Link to={article.relatedCalculator.href}>Open calculator <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        )}

        {article.commonMistakes && article.commonMistakes.length > 0 && (
          <Section icon={AlertTriangle} title="Common mistakes">
            <ul className="space-y-2">
              {article.commonMistakes.map((m) => (
                <li key={m} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section icon={CheckCircle2} title="Key takeaway">
          <p className="text-foreground font-medium">{article.takeaway}</p>
        </Section>

        {article.sources.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl md:text-2xl font-bold">Sources</h2>
            <SourceList sources={article.sources} />
          </div>
        )}

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/articles"><ArrowLeft className="h-4 w-4" /> All articles</Link>
          </Button>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
