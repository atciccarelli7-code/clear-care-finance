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

const EditorialPolicy = () => (
  <>
    <PageHero eyebrow="Editorial standards" title="Editorial Policy" description="How CAF approaches sources, clinical risk, author and reviewer claims, corrections, privacy, advertising, and educational boundaries." />

    <div className="container max-w-3xl space-y-6 py-12 md:py-16">
      <p className="text-sm text-muted-foreground">Effective date: July 19, 2026</p>

      <Section title="Purpose and audience">
        <p>CAF explains financial and practical decisions surrounding healthcare, employment, insurance, hospitalization, benefits, and recovery in plain English. The audience is the general public, with specialized clarity from an RN perspective.</p>
        <p>Content should assume the reader is capable but may be busy, stressed, ill, caregiving, or unfamiliar with healthcare and financial terminology.</p>
      </Section>

      <Section title="Source standard">
        <p>CAF prefers controlling and primary sources: federal and state agencies, official program and plan documents, drug labeling, National Library of Medicine resources, recognized clinical guidelines, and original research when a claim requires it.</p>
        <p>Secondary sources may add context but should not replace the controlling source for a time-sensitive, clinical, coverage, legal, or financial claim.</p>
        <p>Founder nursing experience informs practical framing, common failure points, and questions to ask. It is not the sole evidence for clinical facts.</p>
      </Section>

      <Section title="Clinical content risk tiers">
        <p><strong>Tier 1 — General education:</strong> hospital roles, communication, organization, and question preparation. Requires source and editorial review.</p>
        <p><strong>Tier 2 — Coverage and workflow:</strong> observation status, rehabilitation, home health, bills, and prior authorization. Requires current official sources and explicit plan, state, facility, and date qualifications.</p>
        <p><strong>Tier 3 — Clinical safety education:</strong> blood thinners, COPD, heart failure, oxygen, and medication changes. Requires conservative wording, authoritative medical sources, visible review status, no personalized recommendation, and ad-free safety sections.</p>
        <p><strong>Tier 4 — Withheld individualized instruction:</strong> exact dosing, missed-dose rules, treatment changes, oxygen settings, procedure hold timing, universal emergency thresholds, and personalized symptom decisions. These are not published without appropriate qualified review and explicit future authorization.</p>
      </Section>

      <Section title="Author and reviewer claims">
        <p>Andrew Ciccarelli may be identified accurately as Andrew Ciccarelli, BSN, RN. RN authorship does not imply physician, pharmacist, specialist, hospital, or independent clinical review.</p>
        <p>CAF claims independent review only when a qualified reviewer assessed the exact version and the record is documented. Drafts, referrals, outreach, discussions, automated tests, and source checks do not constitute medical review or approval.</p>
      </Section>

      <Section title="Health and medication boundaries">
        <p>Health content should help readers understand concepts, prepare questions, organize written information, and identify the responsible care-team contact. It should not diagnose, prescribe, determine urgency, or tell a reader to start, stop, skip, double, restart, substitute, split, mix, or independently change treatment.</p>
        <p>Medication pages must not create a universal dose, missed-dose rule, procedure plan, bleeding threshold, or restart instruction. Oxygen and device pages must not create a universal setting or equipment instruction that overrides the prescription and manufacturer guidance.</p>
      </Section>

      <Section title="Page-level trust requirements">
        <p>Health-related guides should display the author, accurate credentials, publication date, reviewed or updated date, review scope, review status, authoritative sources, educational boundary, related resources, and a correction route.</p>
        <p>Pages should distinguish what is generally true, what varies, what must be verified, and which controlling person or document decides the actual result.</p>
      </Section>

      <Section title="Privacy and analytics">
        <p>Consumer guide tools should use fixed choices instead of free-text health collection whenever possible. They should not request patient records, identifying health information, medication lists, doses, symptom narratives, hospital names tied to care, provider names, member IDs, claim numbers, or uploaded discharge documents.</p>
        <p>Analytics should be consent-gated and limited to sanitized fixed identifiers such as page, guide, action, and destination IDs. Health answer values must not be sent to advertising or analytics systems.</p>
      </Section>

      <Section title="Advertising and monetization">
        <p>Trust and usefulness come before advertising volume. Ads must be clearly labeled and separate from navigation, editorial recommendations, official sources, safety warnings, medication content, checklists, and corrections.</p>
        <p>Blood-thinner, oxygen, emergency, high-risk device, and interactive patient-guide surfaces are ad-free by default. Advertisers, affiliates, and sponsors cannot control clinical, insurance, financial, or editorial conclusions.</p>
      </Section>

      <Section title="Corrections, suspension, and updates">
        <p>Material errors should be corrected promptly and significant changes should be documented when useful. A page should be suspended when a safety-critical claim, source, or boundary cannot be verified.</p>
        <p>Time-sensitive pages should have a review cadence appropriate to their risk. Dates must not be updated solely to appear fresh.</p>
      </Section>

      <Section title="AI-assisted workflow">
        <p>AI may assist drafting, research organization, coding, testing, formatting, and editing. Human judgment remains responsible for source quality, safety boundaries, credentials, practical usefulness, and final publication decisions.</p>
        <p>AI must not invent citations, experience, credentials, reviewer findings, approvals, patient stories, outcomes, or certainty.</p>
      </Section>

      <Section title="Independence">
        <p>CAF is independent educational content. It is not an official hospital, employer, insurer, Medicare, Medicaid, regulator, brokerage, bank, insurance agency, law firm, or government service. No endorsement is implied unless clearly documented.</p>
      </Section>

      <DisclaimerBox />
      <div className="pt-4"><Button asChild variant="soft"><Link to="/disclosures">Review Disclosures &amp; Disclaimers</Link></Button></div>
    </div>
  </>
);

export default EditorialPolicy;
