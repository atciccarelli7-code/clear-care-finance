import { Link } from "react-router-dom";
import { TOPICS } from "@/data/topics";
import { DISCLAIMER_TEXT } from "@/components/shared/DisclaimerBox";

const LogoMark = () => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/25 bg-gradient-primary text-[0.62rem] font-extrabold tracking-tight text-primary-foreground shadow-card">
    CAF
    <span aria-hidden="true" className="absolute right-1 top-1 h-2.5 w-2.5 rounded-sm bg-primary-foreground/15">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary-foreground/85" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary-foreground/85" />
    </span>
  </span>
);

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/55 mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4 space-y-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 font-display font-bold text-lg text-foreground">
            <LogoMark />
            <span className="min-w-0 break-words">Community Acquired Finance</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Plain-English financial education for healthcare workers and the patients they care for —
            calculators, guides, glossary, and source-backed explanations.
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Audiences</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/healthcare-workers" className="hover:text-primary transition-smooth">Healthcare Worker Money</Link></li>
            <li><Link to="/patients-families" className="hover:text-primary transition-smooth">Patient & Caregiver Money</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-smooth">About / Sources</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Learn</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/tools" className="hover:text-primary transition-smooth">Calculators</Link></li>
            <li><Link to="/articles" className="hover:text-primary transition-smooth">Articles</Link></li>
            <li><Link to="/glossary" className="hover:text-primary transition-smooth">Glossary</Link></li>
            <li><Link to="/topics" className="hover:text-primary transition-smooth">All topics</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Topics</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {TOPICS.slice(0, 5).map((t) => (
              <li key={t.slug}>
                <Link to={`/topics/${t.slug}`} className="hover:text-primary transition-smooth">{t.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Policies</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary transition-smooth">Terms of Use</Link></li>
            <li><Link to="/editorial-policy" className="hover:text-primary transition-smooth">Editorial Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 text-xs text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">Disclaimer:</strong> {DISCLAIMER_TEXT}
          </p>
          <p>© {new Date().getFullYear()} Community Acquired Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
