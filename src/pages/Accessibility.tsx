import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";
import { Button } from "@/components/ui/button";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-card">
    <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
  </section>
);

const Accessibility = () => {
  return (
    <>
      <PageHero
        eyebrow="Accessibility"
        title="Accessibility Statement"
        description="Our commitment to making healthcare money education easier to read, navigate, and use."
      />

      <main className="container max-w-3xl py-12 md:py-16 space-y-6">
        <p className="text-sm text-muted-foreground">Effective date: June 19, 2026</p>

        <Section title="Commitment">
          <p>
            Community Acquired Finance is intended to help people understand stressful healthcare money topics. The site should be readable, navigable, and usable across devices, screen sizes, and assistive technologies whenever reasonably possible.
          </p>
        </Section>

        <Section title="Design goals">
          <p>The site aims to support accessibility by using:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Plain-English content and short sections.</li>
            <li>Readable contrast and scalable text.</li>
            <li>Keyboard-accessible navigation and links.</li>
            <li>Responsive layouts for phone, tablet, and desktop screens.</li>
            <li>Descriptive page headings and consistent navigation.</li>
            <li>Source links and disclaimers near educational content.</li>
          </ul>
        </Section>

        <Section title="Known limitations">
          <p>
            The site is still under active development. Some calculators, charts, embedded content, third-party links, or future ad placements may require additional accessibility review before production launch.
          </p>
          <p>
            Any new advertising, embeds, or interactive features should be tested to make sure they do not create keyboard traps, unreadable contrast, layout overflow, confusing focus order, or deceptive navigation.
          </p>
        </Section>

        <Section title="Feedback">
          <p>
            Users can report accessibility barriers, broken links, unreadable text, keyboard issues, or confusing page behavior through the Contact page.
          </p>
          <p>
            Please do not send sensitive personal, medical, financial, insurance, employment, account, or login details when reporting a site issue.
          </p>
        </Section>

        <Section title="Ongoing review">
          <p>
            Accessibility should be reviewed whenever new calculators, policy pages, article templates, navigation patterns, ads, or embedded third-party tools are added.
          </p>
        </Section>

        <DisclaimerBox />

        <div className="pt-4">
          <Button asChild variant="soft">
            <Link to="/about">Back to About / Sources</Link>
          </Button>
        </div>
      </main>
    </>
  );
};

export default Accessibility;
