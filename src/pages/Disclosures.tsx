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

const Disclosures = () => (
  <>
    <PageHero eyebrow="Disclosures" title="Disclosures & Disclaimers" description="Clear boundaries around healthcare education, guided tools, official decisions, sources, advertising, review status, and professional advice." />

    <div className="container max-w-3xl space-y-6 py-12 md:py-16">
      <p className="text-sm text-muted-foreground">Effective date: July 19, 2026</p>

      <Section title="Educational information only">
        <p>Community Acquired Finance provides general education. The site is not financial, investment, tax, legal, insurance, medical, billing, employment, or benefits advice.</p>
        <p>Articles and tools explain terms, documents, tradeoffs, possible pathways, information to verify, and questions to ask. They are not individualized instructions for a specific person.</p>
      </Section>

      <Section title="Healthcare and medication boundary">
        <p>CAF does not diagnose, prescribe, treat, triage, manage care, or replace a clinician, pharmacist, hospital, discharge instruction, prescription label, equipment order, or emergency service.</p>
        <p>Readers should not start, stop, skip, double, restart, substitute, split, mix, or otherwise change a medicine based on this site. Product-specific doses, missed-dose rules, procedure hold or restart times, oxygen settings, and individualized warning thresholds must come from the responsible treating team and controlling instructions.</p>
        <p>If you believe there may be an emergency, contact emergency services. The site cannot determine whether a specific symptom is urgent.</p>
      </Section>

      <Section title="Clinical review status">
        <p>Author credentials and review status are stated as accurately as possible. “Written by an RN” is not the same as independent medical review.</p>
        <p>CAF does not use “medically reviewed,” “pharmacist reviewed,” “hospital approved,” “clinically validated,” or similar language unless a qualified reviewer examined the exact published version and that review is documented.</p>
        <p>The current consumer Hospital &amp; Patient Guides are source-backed and RN-authored. No independent physician or pharmacist review is claimed unless a page expressly documents it.</p>
      </Section>

      <Section title="No official eligibility, coverage, or authorization decision">
        <p>Tools do not enroll anyone, approve benefits, authorize care, adjudicate a claim, establish medical necessity, determine tax treatment, or make an official Medicare, Medicaid, insurer, employer, retirement-plan, HSA, billing, or government decision.</p>
        <p>Official agencies, insurers, employers, plan administrators, healthcare providers, contracts, statutes, regulations, written notices, and current plan documents control the actual result.</p>
      </Section>

      <Section title="Privacy and health information">
        <p>The public patient-guide area is designed not to request names, birth dates, diagnoses, symptom narratives, medication lists, dose information, hospital or clinician names tied to individual care, medical-record numbers, claim numbers, insurance member IDs, or uploaded discharge records.</p>
        <p>Fixed-choice guide selections are educational navigation, not a medical assessment. CAF analytics should use only sanitized page, guide, action, and destination identifiers after the required consent state.</p>
      </Section>

      <Section title="Calculator and guided-tool limitations">
        <p>Tools are simplified educational estimates and may use assumptions, rounded numbers, incomplete inputs, broad categories, or general rules. Actual costs, taxes, benefits, premiums, coverage, claim responsibility, authorization, and eligibility can differ materially.</p>
        <p>A result labeled possible, estimated, or worth verifying is not a guarantee. Verify important decisions with current official sources and controlling documents.</p>
      </Section>

      <Section title="Advertising, affiliates, and sponsorships">
        <p>The site may display clearly labeled advertising on appropriate pages. Ads must remain visually separate from editorial content, navigation, tools, official resources, emergency language, medication safety sections, preparation checklists, source notes, and corrections.</p>
        <p>High-risk medication, oxygen, emergency, and interactive patient-guide surfaces are ad-free by default. CAF should not pass medication, symptom, condition, or guide-answer data to advertising systems.</p>
        <p>The site does not currently use affiliate links or sponsored recommendations. Any future material relationship must be disclosed near the relevant content. Compensation must not control conclusions, source selection, calculator logic, rankings, or safety warnings.</p>
      </Section>

      <Section title="Independence and no endorsement">
        <p>Mentioning an employer, insurer, hospital, agency, product, vendor, or service is for education or source reference and is not an endorsement unless explicitly stated.</p>
        <p>CAF is independent and is not an official Medicare, Medicaid, CMS, IRS, hospital, insurer, employer, bank, brokerage, law firm, insurance agency, or government website. No employer, hospital, clinician, reviewer, insurer, regulator, or professional endorsement is implied.</p>
      </Section>

      <Section title="AI-assisted work">
        <p>AI tools may assist with drafting, editing, coding, formatting, testing, and research organization. AI assistance does not replace human review for source quality, accuracy, clarity, privacy, legal and safety boundaries, and usefulness.</p>
        <p>AI must not fabricate experience, sources, credentials, reviews, approvals, outcomes, or certainty.</p>
      </Section>

      <Section title="Accuracy, corrections, and updates">
        <p>Healthcare, insurance, benefit, tax, and government-program rules change. Publication and review dates show when a page was checked; they do not guarantee that every linked source or plan rule remains unchanged.</p>
        <p>Material errors should be corrected promptly. A page may be suspended when a safety-critical claim cannot be verified. Dates should not be changed merely to create the appearance of freshness.</p>
        <p>Readers may use the contact page to report a possible error, accessibility issue, or broken source.</p>
      </Section>

      <DisclaimerBox />
      <div className="pt-4"><Button asChild variant="soft"><Link to="/editorial-policy">Review the Editorial Policy</Link></Button></div>
    </div>
  </>
);

export default Disclosures;
