import { Link } from "react-router-dom";
import { ArrowRight, Calculator, FileSearch, GraduationCap, Landmark, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { NextStepCards } from "@/components/shared/NextStepCards";
import { useSeo } from "@/lib/seo";
import { PSLFProgressEstimator, PrivateLoanPayoffCalculator, StudentLoanPathFinder } from "@/components/calculators/StudentLoanTools";
import CalcLoanPayment from "@/components/calculators/LoanPayment";

const programs = [
  {
    icon: Landmark,
    title: "Public Service Loan Forgiveness",
    tag: "Federal loans + qualifying employer",
    text: "For borrowers with eligible Direct Loans who work full-time for a qualifying government or nonprofit employer, use a qualifying repayment plan, and reach 120 qualifying monthly payments.",
    sourceLabel: "34 CFR 685.219",
    sourceHref: "https://www.law.cornell.edu/cfr/text/34/685.219",
  },
  {
    icon: FileSearch,
    title: "Income-driven repayment",
    tag: "Federal payment strategy",
    text: "For federal borrowers who need a monthly payment based on income and family size. IDR can support PSLF planning, but it should be modeled against total time in debt.",
    sourceLabel: "34 CFR 685.209",
    sourceHref: "https://www.law.cornell.edu/cfr/text/34/685.209",
  },
  {
    icon: Stethoscope,
    title: "Nurse Corps Loan Repayment",
    tag: "Nursing-specific program",
    text: "For eligible RNs, APRNs, and nurse faculty with qualifying nursing education debt who work full-time at eligible critical shortage facilities or eligible nursing schools.",
    sourceLabel: "HRSA Nurse Corps",
    sourceHref: "https://bhw.hrsa.gov/funding/apply-loan-repayment/nurse-corps",
  },
  {
    icon: ShieldCheck,
    title: "NHSC Loan Repayment",
    tag: "Site- and discipline-specific",
    text: "For eligible clinicians at NHSC-approved shortage-area sites. This is most relevant to qualifying primary care, maternity care, dental, and behavioral health disciplines.",
    sourceLabel: "HRSA NHSC",
    sourceHref: "https://nhsc.hrsa.gov/loan-repayment/nhsc-loan-repayment-program",
  },
];

const StudentLoans = () => {
  useSeo({
    title: "Student Loan Relief and Payoff Options for Nurses",
    description:
      "A plain-English student loan section for nurses and healthcare workers comparing PSLF, income-driven repayment, Nurse Corps, NHSC, private loan payoff, and refinance planning.",
    canonicalPath: "/student-loans",
  });

  return (
    <>
      <PageHero
        eyebrow="Student loans"
        title="Student loan relief starts with one question: federal or private?"
        description="Nonprofit hospital work can matter, but only for the right loan type and the right program. Use this page to separate federal forgiveness paths from private-loan payoff decisions."
      >
        <Button asChild variant="hero" size="lg">
          <a href="#path-finder">Find the likely path <ArrowRight className="h-4 w-4" /></a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/tools#private-loan-payoff">Run payoff math</Link>
        </Button>
      </PageHero>

      <section className="container py-10 md:py-14">
        <NextStepCards
          eyebrow="Start here"
          title="Do not start with forgiveness. Start with loan type."
          description="Two nurses can work at the same nonprofit hospital and need totally different plans if one has federal Direct Loans and the other has private loans."
          cards={[
            {
              eyebrow: "Federal Direct Loans",
              title: "Check PSLF and IDR first",
              description: "Verify employer eligibility, repayment plan, and qualifying payment count before making payoff or refinance decisions.",
              href: "#pslf-progress",
              cta: "Estimate PSLF progress",
            },
            {
              eyebrow: "Private loans",
              title: "Focus on rate and payoff speed",
              description: "Private debt usually needs a refinance, extra-payment, or lump-sum plan instead of a federal forgiveness strategy.",
              href: "#private-payoff",
              cta: "Compare payoff plans",
            },
            {
              eyebrow: "Nursing programs",
              title: "Check role and work site",
              description: "Nurse Corps and NHSC are valuable but specific. Eligibility depends on license, facility, site, discipline, and open application cycles.",
              href: "#programs",
              cta: "Review programs",
            },
          ]}
        />
      </section>

      <section id="programs" className="container py-10 md:py-14">
        <SectionHeading
          eyebrow="Program map"
          title="The major student loan paths for nurses and healthcare workers"
          description="This is not a promise of relief. It is a screening map so readers know what to verify next."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {programs.map((program) => {
            const Icon = program.icon;
            return (
              <article key={program.title} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{program.tag}</div>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{program.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{program.text}</p>
                <a
                  className="mt-4 inline-flex rounded-full bg-primary-soft px-3 py-2 text-sm font-bold text-primary transition-smooth hover:bg-primary-soft/80"
                  href={program.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify source: {program.sourceLabel}
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container py-10 md:py-14 space-y-12">
        <div id="path-finder" className="scroll-mt-28">
          <CalculatorCard icon={GraduationCap} eyebrow="Student loans" title="Student Loan Path Finder" description="Identify which student-loan paths are worth researching before spending hours on the wrong program.">
            <StudentLoanPathFinder />
          </CalculatorCard>
        </div>

        <div id="private-payoff" className="scroll-mt-28">
          <CalculatorCard icon={Calculator} eyebrow="Private loans" title="Private Student Loan Payoff Calculator" description="Compare minimum payments, extra payments, lump sums, and a possible refinance APR.">
            <PrivateLoanPayoffCalculator />
          </CalculatorCard>
        </div>

        <div id="pslf-progress" className="scroll-mt-28">
          <CalculatorCard icon={Landmark} eyebrow="Federal loans" title="PSLF Progress Estimator" description="Estimate payments remaining to 120 and see what must be verified before relying on PSLF.">
            <PSLFProgressEstimator />
          </CalculatorCard>
        </div>

        <div id="standard-payment" className="scroll-mt-28">
          <CalculatorCard icon={Calculator} eyebrow="Baseline math" title="Standard Student Loan Payment Calculator" description="Estimate monthly payment, total paid, and total interest for a fixed-rate loan.">
            <CalcLoanPayment />
          </CalculatorCard>
        </div>
      </section>

      <section className="container pb-16 md:pb-20">
        <div className="rounded-3xl border border-border bg-muted/30 p-6 md:p-8">
          <SectionHeading eyebrow="Sources" title="Official places to verify details" description="Program rules and application windows change. Use this page as a starting point, then verify with official sources." />
          <div className="grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service" target="_blank" rel="noreferrer">Federal Student Aid: Public Service Loan Forgiveness</a>
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://www.law.cornell.edu/cfr/text/34/685.219" target="_blank" rel="noreferrer">Regulation: PSLF rules</a>
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://www.law.cornell.edu/cfr/text/34/685.209" target="_blank" rel="noreferrer">Regulation: IDR rules</a>
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://bhw.hrsa.gov/funding/apply-loan-repayment/nurse-corps" target="_blank" rel="noreferrer">HRSA: Nurse Corps Loan Repayment Program</a>
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://nhsc.hrsa.gov/loan-repayment/nhsc-loan-repayment-program" target="_blank" rel="noreferrer">HRSA: NHSC Loan Repayment Program</a>
            <a className="rounded-2xl border border-border bg-card p-4 font-semibold text-primary transition-smooth hover:border-primary/50" href="https://www.irs.gov/charities-non-profits/search-for-tax-exempt-organizations" target="_blank" rel="noreferrer">IRS: Tax Exempt Organization Search</a>
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentLoans;
