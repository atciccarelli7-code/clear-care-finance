import { Link } from "react-router-dom";
import { DISCLAIMER_TEXT } from "@/components/shared/DisclaimerBox";
import { openPrivacyChoices } from "@/lib/privacyConsent";

const LogoMark = () => (
  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/30 bg-primary text-[0.62rem] font-extrabold tracking-tight text-primary-foreground">
    CAF
    <span aria-hidden="true" className="absolute right-1 top-1 h-2.5 w-2.5 rounded-sm bg-primary-foreground/12">
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-primary-foreground/80" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-primary-foreground/80" />
    </span>
  </span>
);

const linkGroups = [
  {
    title: "Explore",
    links: [
      { to: "/start-here", label: "Start Here" },
      { to: "/products", label: "Products" },
      { to: "/tools", label: "Financial Tools" },
      { to: "/build-wealth", label: "Money & Retirement" },
      { to: "/insurance", label: "Benefits & Insurance" },
      { to: "/medicare-care-costs", label: "Medicare & Medicaid" },
      { to: "/topics", label: "Topic Guides" },
      { to: "/articles", label: "Articles" },
    ],
  },
  {
    title: "Specialized guides",
    links: [
      { to: "/healthcare-workers", label: "Healthcare Workers" },
      { to: "/patients-families", label: "Patients & Caregivers" },
      { to: "/guides", label: "Quick Guides" },
      { to: "/open-enrollment", label: "Open Enrollment" },
      { to: "/student-loans", label: "Student Loans" },
      { to: "/glossary", label: "Glossary" },
    ],
  },
  {
    title: "Trust",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/for-organizations", label: "For Organizations" },
      { to: "/methodology", label: "Sources & Methodology" },
      { to: "/editorial-policy", label: "Editorial Policy" },
      { to: "/disclosures", label: "Disclosures" },
      { to: "/privacy-policy", label: "Privacy Policy" },
      { to: "/terms-of-use", label: "Terms of Use" },
      { to: "/accessibility", label: "Accessibility" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="container grid gap-10 py-14 md:grid-cols-12">
        <div className="space-y-3 md:col-span-5">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 font-display text-lg font-semibold text-foreground">
            <LogoMark />
            <span className="min-w-0 break-words">Community Acquired Finance</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Plain-English financial education for everyone, with specialized clarity around healthcare costs, insurance, Medicare, and Medicaid.
          </p>
          <p className="text-xs text-muted-foreground">Written by Andrew Ciccarelli, RN, BSN.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3 md:col-span-7">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{group.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="transition-smooth hover:text-primary">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container space-y-3 py-6 text-xs text-muted-foreground">
          <p>
            <strong className="text-foreground">Disclaimer:</strong> {DISCLAIMER_TEXT}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Community Acquired Finance. All rights reserved.</p>
            <button
              type="button"
              onClick={openPrivacyChoices}
              className="w-fit font-semibold text-primary underline-offset-4 hover:underline"
            >
              Privacy choices
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
