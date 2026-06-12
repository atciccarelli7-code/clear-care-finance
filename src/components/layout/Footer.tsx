import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-24">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
              <Stethoscope className="h-5 w-5" />
            </span>
            Community Acquired Finance
          </Link>
          <p className="text-sm text-muted-foreground max-w-md">
            Plain-English financial education for healthcare workers and the patients they care for —
            calculators, guides, and visual explanations.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/healthcare-workers" className="hover:text-primary transition-smooth">Healthcare Workers</Link></li>
            <li><Link to="/patients-families" className="hover:text-primary transition-smooth">Patients & Families</Link></li>
            <li><Link to="/tools" className="hover:text-primary transition-smooth">Tools & Calculators</Link></li>
            <li><Link to="/articles" className="hover:text-primary transition-smooth">Articles</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-smooth">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Mission</h4>
          <p className="text-sm text-muted-foreground">
            Help people understand the money side of healthcare — before it becomes a crisis.
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 text-xs text-muted-foreground space-y-2">
          <p>
            <strong className="text-foreground">Disclaimer:</strong> Community Acquired Finance provides
            educational content only. Nothing on this site is individualized financial, medical, tax,
            insurance, or legal advice. Always consult a qualified professional for your situation.
          </p>
          <p>© {new Date().getFullYear()} Community Acquired Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
