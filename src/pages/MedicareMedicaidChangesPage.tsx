import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { CHANGES_LAST_VERIFIED, CHANGES_NEXT_REVIEW, CHANGES_PATH, POLICY_CHANGES, CHANGE_SCOPES, CHANGE_STATUSES, filterPolicyChanges, type PolicyChange } from "@/data/medicareMedicaidChanges";
import { useSeo } from "@/lib/seo";

const fieldClass = "min-h-12 w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const displayDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

function ChangeEntry({ entry }: { entry: PolicyChange }) {
  return <article id={entry.id} className="min-w-0 scroll-mt-28 rounded-2xl border border-border bg-card p-5 sm:p-7">
    <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
      <span className="rounded-full bg-muted px-3 py-1">{entry.scope}</span>
      <span className="rounded-full border border-primary/40 px-3 py-1">{entry.status}</span>
    </div>
    <h3 className="font-display text-xl font-bold leading-snug sm:text-2xl"><a href={`#${entry.id}`} className="hover:underline">{entry.title}</a></h3>
    <dl className="mt-5 space-y-4 text-sm leading-relaxed sm:text-base">
      {[["Effective date", entry.effectiveDate], ["What changed", entry.changed], ["Who is affected", entry.who], ["Why it matters for care", entry.implication], ["What to do", entry.action]].map(([label, value]) => <div key={label}><dt className="font-semibold text-foreground">{label}</dt><dd className="mt-1 text-muted-foreground">{value}</dd></div>)}
      <div><dt className="font-semibold">Official sources</dt><dd><ul className="mt-2 space-y-2">{entry.sources.map((source) => <li key={source.url}><a href={source.url} className="break-words text-primary underline underline-offset-4">{source.label}</a></li>)}</ul></dd></div>
    </dl>
    <p className="mt-5 text-xs text-muted-foreground">Last verified: <time dateTime={entry.verifiedAt}>{displayDate(entry.verifiedAt)}</time> · <a href={`#${entry.id}`} className="underline">Link to this entry</a></p>
    {entry.supersededBy && <p className="mt-3 text-sm"><a className="text-primary underline" href={`${CHANGES_PATH}#${entry.supersededBy}`}>See the next benefit year’s entry</a></p>}
  </article>;
}

export default function MedicareMedicaidChangesPage() {
  useSeo({ title: "Medicare & Medicaid Changes", description: "Verified Medicare and Medicaid changes: October provider payments, January beneficiary costs, federal and North Carolina Medicaid rules, and proposals. Official sources and practical next steps.", canonicalPath: CHANGES_PATH });
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("All");
  const [status, setStatus] = useState("All");
  const filtered = filterPolicyChanges(POLICY_CHANGES, query, scope, status);
  const active = filtered.filter((entry) => !entry.archived);
  const archive = filtered.filter((entry) => entry.archived);
  const groups = [
    { title: "October 2026 and the lead-up to January", test: (entry: PolicyChange) => entry.date < "2027-01-01" },
    { title: "January 1, 2027 — finalized changes and rollout questions", test: (entry: PolicyChange) => entry.date === "2027-01-01" },
    { title: "Later dates and proposals", test: (entry: PolicyChange) => entry.date > "2027-01-01" },
  ];
  const reset = () => { setQuery(""); setScope("All"); setStatus("All"); };
  return <>
    <PageHero eyebrow="Policy, coverage & care transitions" title="Medicare & Medicaid Changes" description="What changed, who it reaches, and what to check before it becomes a bill, a missed renewal or a delayed discharge.">
      <p className="text-sm font-semibold">Last verified: <time dateTime={CHANGES_LAST_VERIFIED}>{displayDate(CHANGES_LAST_VERIFIED)}</time></p>
      <p className="mx-auto max-w-2xl text-sm text-muted-foreground">A selective, source-checked reference from CAF, an RN-led publication. Updated after editorial review; this is not a live policy feed or an individual eligibility determination.</p>
    </PageHero>
    <div className="container mx-auto max-w-4xl space-y-10 py-10 sm:py-14">
      <nav aria-label="Changes timeline sections" onClick={reset} className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-primary underline underline-offset-4">
        <a href="#october-2026">October 2026</a><a href="#january-2027">January 2027</a><a href="#later-changes">Later and proposed</a><a href="#archive">Archive</a><a href="#find-change">Search</a>
      </nav>
      <section aria-labelledby="read-first" className="space-y-4">
        <h2 id="read-first" className="font-display text-2xl font-bold">Three clocks, different consequences</h2>
        <p className="leading-relaxed text-muted-foreground">A hospital payment update, a new Medicare deductible and a Medicaid renewal rule can all be called a “Medicare/Medicaid change.” They answer different questions. Start with the program, the person affected and the date attached to that specific provision.</p>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
          <li><strong className="text-foreground">Fiscal year:</strong> October hospital and skilled nursing payment rules concern what Medicare pays providers. They do not reset every patient’s benefits.</li>
          <li><strong className="text-foreground">Calendar and contract year:</strong> January brings beneficiary costs, plan-year coverage and some provider payment rules. National rules and an individual plan’s benefits are separate.</li>
          <li><strong className="text-foreground">Medicaid:</strong> federal requirements interact with state eligibility and implementation. North Carolina entries are labeled; they are not instructions for every state.</li>
        </ul>
        <p className="text-sm text-muted-foreground">The entries below supply the official sources for these distinctions. “Effective” means in force within the stated scope; “Final — upcoming” means adopted but not yet applicable as dated here. “Proposed” means not adopted. A scheduled rollout can still have a state decision pending.</p>
      </section>
      <aside className="rounded-2xl border border-primary/30 bg-muted/40 p-5 sm:p-6" aria-labelledby="rollout-warning">
        <h2 id="rollout-warning" className="font-display text-xl font-bold">The Medicaid deadline needs an extra check</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">January implementation remains in federal guidance. CMS now offers an optional, approved enforcement transition through June 30, 2027. We have not verified that NC elected it. Keep responding to notices; do not assume either automatic January termination or a nationwide July delay.</p>
        <a href="#2027-community-engagement" onClick={reset} className="mt-3 inline-block text-primary underline underline-offset-4">Read the federal guidance and NC verification gap</a>
      </aside>
      <section aria-labelledby="find-change">
        <h2 id="find-change" className="font-display text-2xl font-bold">Find a change</h2>
        <p className="mt-2 text-sm text-muted-foreground">Search a subject such as rehab, prescriptions or renewal. Filters include the archive. Search stays on this page and is not saved.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2"><span className="block text-sm font-semibold">Search changes</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={fieldClass} placeholder="Search topics, people or dates" /></label>
          <label className="space-y-2"><span className="block text-sm font-semibold">Program and scope</span><select value={scope} onChange={(event) => setScope(event.target.value)} className={fieldClass}><option value="All">All programs and scopes</option>{CHANGE_SCOPES.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="space-y-2"><span className="block text-sm font-semibold">Policy status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className={fieldClass}><option value="All">All statuses</option>{CHANGE_STATUSES.map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4"><p role="status" className="text-sm text-muted-foreground">{active.length} current timeline {active.length === 1 ? "entry" : "entries"}; {archive.length} archived {archive.length === 1 ? "entry" : "entries"}.</p><button type="button" onClick={reset} className="min-h-11 rounded-lg px-3 text-sm font-semibold text-primary underline focus-visible:outline focus-visible:outline-2">Clear filters</button></div>
        {!filtered.length && <p className="mt-4 rounded-xl border border-border p-5">No changes match. Try fewer words or clear the filters.</p>}
      </section>
      {groups.map((group) => {
        const entries = active.filter(group.test);
        return entries.length ? <section key={group.title} id={group.title.startsWith("October") ? "october-2026" : group.title.startsWith("January") ? "january-2027" : "later-changes"} aria-label={group.title} className="scroll-mt-28 space-y-5"><h2 className="font-display text-2xl font-bold">{group.title}</h2>{entries.map((entry) => <ChangeEntry key={entry.id} entry={entry} />)}</section> : null;
      })}
      <section id="archive" aria-labelledby="archive-heading" className="scroll-mt-28 space-y-5">
        <h2 id="archive-heading" className="font-display text-2xl font-bold">Archive and earlier baselines</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">Older benefit-year records stay here with their original scope and dates. Archived does not mean repealed. The archive begins with the 2026 baseline; it is not a complete policy history.</p>
        {archive.map((entry) => <ChangeEntry key={entry.id} entry={entry} />)}
        {!archive.length && <p className="text-sm text-muted-foreground">No archive entries match these filters.</p>}
      </section>
      <section aria-labelledby="care-lens" className="space-y-4 rounded-2xl bg-muted/30 p-5 sm:p-7">
        <h2 id="care-lens" className="font-display text-2xl font-bold">What this means around a hospital discharge</h2>
        <p className="leading-relaxed text-muted-foreground">CAF’s editorial interpretation: the useful question is whether the next part of the care plan will actually work. A finalized payment rate does not confirm a rehab bed. A drug spending cap does not confirm an affordable first fill. A renewal requirement creates a task: someone must receive the notice, understand it and respond.</p>
        <p className="leading-relaxed text-muted-foreground">For a patient or caregiver, separate coverage from practical capacity: who will provide care, when will it start, and who will handle the paperwork? For a case manager, identify the rule that controls the next step and verify it with the plan, agency or facility. These are planning implications, not predictions that a rule will cause a particular discharge delay.</p>
        <ul className="space-y-3 text-primary underline underline-offset-4">
          <li><Link to="/articles/medicare-vs-medicaid-what-is-the-difference">Medicare vs. Medicaid: which program does what?</Link></li>
          <li><Link to="/articles/does-medicare-cover-rehab-after-hospital-stay">Does Medicare cover rehab after a hospital stay?</Link></li>
          <li><Link to="/articles/home-health-after-discharge">Home health after discharge: plan for the time between visits</Link></li>
          <li><Link to="/articles/home-with-family-is-not-a-free-care-plan">“Home With Family” Is Not a Free Care Plan</Link></li>
          <li><Link to="/articles/medicare-medicaid-changes-january-2027">Background: why January policy changes matter for care transitions</Link></li>
          <li><Link to="/medicare-care-costs">Medicare choices, cost exposure and long-term care guides</Link></li>
        </ul>
      </section>
      <section aria-labelledby="verification" className="space-y-4 text-sm leading-relaxed">
        <h2 id="verification" className="font-display text-2xl font-bold">How this page is maintained</h2>
        <p className="text-muted-foreground">CAF checks original agency guidance and final-rule text, separates national policy from state implementation, and dates each substantive review. We keep consequential changes with a practical reader action, rather than reproducing every payment table or announcement. No automated feed publishes entries or changes a status when a date passes.</p>
        <p className="text-muted-foreground">Next editorial checkpoint: <time dateTime={CHANGES_NEXT_REVIEW}>{displayDate(CHANGES_NEXT_REVIEW)}</time>, particularly the state transition decisions; recheck again before January 1. This is a review target, not a promise of real-time updates. Check the linked agency guidance and your written notice when acting.</p>
        <p className="text-muted-foreground">Open verification issue: NC’s election and approval of the November federal transition option remain unconfirmed. This page does not decide individual immigration eligibility, medical-frailty exclusions, claims or appeals. Ask the responsible agency for those determinations.</p>
        <p><Link to="/editorial-policy" className="text-primary underline">Editorial standards</Link> · <Link to="/contact" className="text-primary underline">Report a correction</Link></p>
      </section>
    </div>
  </>;
}
