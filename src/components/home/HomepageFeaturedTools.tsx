import { Calculator, HeartPulse, Receipt, Shield } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { TopicCard } from "@/components/shared/TopicCard";

const featuredTools = [
  {
    icon: Shield,
    title: "Compare health plan true cost",
    description: "Compare premiums, expected costs, employer HSA/HRA money, and bad-year exposure.",
    href: "/tools/open-enrollment-true-cost-calculator",
    cta: "Compare plans",
    accent: "blue" as const,
  },
  {
    icon: Receipt,
    title: "Match an EOB to a bill",
    description: "Check whether the provider bill lines up with the insurer explanation.",
    href: "/tools/eob-to-bill-match-checker",
    cta: "Check bill",
    accent: "green" as const,
  },
  {
    icon: Calculator,
    title: "Estimate out-of-pocket max exposure",
    description: "Estimate how close covered in-network care could bring someone to the yearly cap.",
    href: "/tools/out-of-pocket-max-estimator",
    cta: "Estimate exposure",
    accent: "blue" as const,
  },
  {
    icon: HeartPulse,
    title: "Estimate Medicare cost exposure",
    description: "Rough out premiums, deductibles, prescriptions, and coinsurance before comparing options.",
    href: "/tools#medicare",
    cta: "Estimate Medicare",
    accent: "green" as const,
  },
];

export const HomepageFeaturedTools = () => (
  <section className="container min-w-0 py-12 md:py-16">
    <SectionHeading
      centered
      eyebrow="Most useful tools"
      title="Start with a calculator or checklist"
      description="High-intent tools for comparing benefits, reviewing bills, and understanding real cost exposure."
    />
    <div className="mx-auto grid max-w-6xl min-w-0 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {featuredTools.map(({ icon, title, description, href, cta, accent }) => (
        <TopicCard
          key={title}
          icon={icon}
          title={title}
          description={description}
          href={href}
          cta={cta}
          accent={accent}
        />
      ))}
    </div>
  </section>
);

export default HomepageFeaturedTools;
