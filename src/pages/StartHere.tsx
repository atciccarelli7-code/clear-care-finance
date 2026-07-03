import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

const cards = [
  {
    eyebrow: "Healthcare workers",
    title: "Paycheck and benefits",
    description: "Start with the healthcare-worker hub, then use the 403(b), student loan, and benefit tools.",
    href: "/healthcare-workers",
    cta: "Open path",
  },
  {
    eyebrow: "Medical bills",
    title: "Bill or EOB review",
    description: "Match the bill to the insurance explanation before deciding what to question or pay.",
    href: "/tools#eob-bill-match",
    cta: "Check bill",
  },
  {
    eyebrow: "Benefits",
    title: "Open enrollment",
    description: "Compare plan cost, paycheck impact, tax accounts, prescriptions, and bad-year exposure.",
    href: "/open-enrollment",
    cta: "Open guide",
  },
  {
    eyebrow: "Caregivers",
    title: "Medicare and coverage",
    description: "Use Medicare explainers and plan tools before comparing plan marketing.",
    href: "/topics/medicare-medicaid",
    cta: "Open topic",
  },
  {
    eyebrow: "Student loans",
    title: "Loan path finder",
    description: "Separate federal program research from private-loan payoff and refinance math.",
    href: "/student-loans",
    cta: "Open loans",
  },
  {
    eyebrow: "Build wealth",
    title: "Stabilize and grow",
    description: "Use the staged wealth hub for cash flow, work benefits, investing, and long-term flexibility.",
    href: "/build-wealth",
    cta: "Open hub",
  },
];

const StartHere = () => {
  useSeo({
    title: "Start Here",
    description: "A simple starting point for Community Acquired Finance paths and tools.",
    canonicalPath: "/start-here",
  });

  return (
    <>
      <PageHero eyebrow="Start here" title="Choose the clearest first step." description="Pick the closest path. Each one starts with a useful guide, calculator, or checklist.">
        <Button asChild variant="hero" size="lg">
          <Link to="/tools">Open tools <ArrowRight className="h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/articles">Browse articles</Link>
        </Button>
      </PageHero>

      <main className="container py-12 md:py-16">
        <NextStepCards eyebrow="Choose a path" title="What are you trying to figure out?" description="Start with the path that matches the decision in front of you." cards={cards} columns="three" />
      </main>
    </>
  );
};

export default StartHere;
