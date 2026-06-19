import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { SourceList } from "@/components/shared/SourceList";
import { SOURCE_PRESETS } from "@/data/sources";

const ContentPage = ({ eyebrow, title, description, children }: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <>
    <PageHero eyebrow={eyebrow} title={title} description={description} />
    <section className="container max-w-3xl py-12 md:py-16">
      <div className="space-y-8 text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:md:text-2xl [&_h2]:mb-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </section>
  </>
);

export const Privacy = () => (
  <ContentPage eyebrow="Privacy" title="A simple privacy approach." description="We collect as little information as practical and do not sell personal information.">
    <div><h2>Information you provide</h2><p>Calculators run in your browser. Do not enter account numbers, Social Security numbers, medical records, or other sensitive information. If you contact us through a third-party service, that service's privacy terms also apply.</p></div>
    <div><h2>Basic site data</h2><p>Hosting and security providers may process routine technical data such as IP address, browser type, device type, requested pages, and timestamps to deliver and protect the site. We do not use this site to build personal financial or medical profiles.</p></div>
    <div><h2>External links</h2><p>Links to government agencies, research organizations, and other websites are provided for reference. Their privacy practices are outside our control.</p></div>
    <div><h2>Changes</h2><p>This notice may change as the site adds features. Material changes will be reflected on this page.</p></div>
  </ContentPage>
);

export const Terms = () => (
  <ContentPage eyebrow="Terms" title="Terms of use." description="Use the site as an educational starting point, then verify decisions with the people and documents that govern your situation.">
    <div><h2>Educational use</h2><p>Community Acquired Finance provides general educational information. It is not personal financial, tax, legal, insurance, medical, or investment advice and does not create a professional-client relationship.</p></div>
    <div><h2>Your responsibility</h2><p>Rules, costs, limits, plan terms, and public policies can change. Verify important details with official sources, your employer, insurer, plan documents, Medicare or Medicaid resources, and qualified professionals.</p></div>
    <div><h2>Calculators and availability</h2><p>Calculator results are estimates based on the values and assumptions entered. We do not guarantee accuracy, completeness, uninterrupted access, or suitability for a particular decision.</p></div>
    <div><h2>Acceptable use</h2><p>Do not misuse the site, interfere with its operation, or present its educational content as individualized professional advice.</p></div>
  </ContentPage>
);

export const Disclaimer = () => (
  <ContentPage eyebrow="Disclaimer" title="Education, not individualized advice." description="The site explains systems and tradeoffs. It does not decide what is right for one person.">
    <div><h2>Not professional advice</h2><p>Nothing here is personal financial, tax, legal, insurance, medical, or investment advice. The site does not diagnose, prescribe, recommend a product, predict markets, or replace a licensed professional.</p></div>
    <div><h2>Verify before acting</h2><p>Confirm details with official government sources, employers, insurers, plan documents, Medicare and Medicaid resources, tax professionals, financial advisors, attorneys, or healthcare professionals when relevant.</p></div>
    <div><h2>Estimates and changing rules</h2><p>Calculators are educational estimates only. Coverage rules, contribution limits, interest rates, costs, benefits, eligibility, and policies can change. Actual results may differ.</p></div>
    <div><h2>Emergencies</h2><p>This site should never delay emergency medical care. Call emergency services or seek appropriate care when symptoms may be urgent.</p></div>
  </ContentPage>
);

export const EditorialPolicy = () => (
  <ContentPage eyebrow="Editorial policy" title="How we keep the work useful and trustworthy." description="Plain language, visible sources, careful limits, and no product pushing.">
    <div><h2>Who we write for</h2><p>Healthcare workers, patients, families, and caregivers who need a clearer view of pay, benefits, retirement accounts, insurance, Medicare, Medicaid, hospital bills, and healthcare financial systems.</p></div>
    <div><h2>How sources are selected</h2><p>Official government sources come first. Reputable nonprofit and research organizations may add useful context. Articles distinguish general education from plan-specific rules and link readers to sources that can be checked directly.</p></div>
    <div><h2>How content is written</h2><ul><li>Use plain English and short, scannable sections.</li><li>Explain uncertainty and meaningful exceptions.</li><li>Avoid scare tactics, political rants, clickbait, and false precision.</li><li>Correct material errors when identified.</li></ul></div>
    <div><h2>What we do not do</h2><p>We do not provide individualized advice, sell recommendations, rank products for commissions, disguise ads as education, or use fear to drive decisions.</p></div>
  </ContentPage>
);

export const Contact = () => (
  <ContentPage eyebrow="Contact" title="Questions, corrections, and source suggestions." description="The most useful messages point to a specific page, claim, or broken link.">
    <div><h2>Get in touch</h2><p>Use the public GitHub repository to report a correction, suggest an official source, or flag a technical problem. Do not include private financial, employment, insurance, or medical information.</p></div>
    <Button asChild variant="hero"><a href="https://github.com/atciccarelli7-code/clear-care-finance/issues" target="_blank" rel="noopener noreferrer"><Mail className="h-4 w-4" /> Open a GitHub issue <ArrowUpRight className="h-4 w-4" /></a></Button>
    <div><h2>Before sending</h2><p>For personal coverage, benefits, billing, tax, or legal questions, contact the relevant employer, insurer, provider billing office, government program, or qualified professional. This site cannot review an individual case.</p></div>
  </ContentPage>
);

export const Sources = () => (
  <ContentPage eyebrow="Sources" title="Where our information comes from." description="Official sources first, with reputable nonprofit and research context when it helps readers understand the system.">
    <div><h2>Selection standard</h2><p>We prioritize federal and state program pages, regulators, and official statistical agencies. KFF and similar nonpartisan research organizations may be used for context or synthesis. Each article lists the sources most relevant to its claims.</p></div>
    <SourceList sources={Object.values(SOURCE_PRESETS)} />
    <p>Need the broader site mission and limits? <Link className="font-semibold text-primary hover:underline" to="/about">Read About Community Acquired Finance.</Link></p>
  </ContentPage>
);
