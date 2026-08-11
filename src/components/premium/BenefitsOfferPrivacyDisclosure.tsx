import { Link } from "react-router-dom";

export const BenefitsOfferPrivacyDisclosure = () => (
  <section className="container max-w-3xl pb-12 md:pb-16" aria-labelledby="benefits-offer-privacy-addendum">
    <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary-soft/20 p-6 shadow-card">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Updated August 11, 2026</div>
      <h2 id="benefits-offer-privacy-addendum" className="font-display text-xl font-bold text-foreground">
        Benefits Decision Workspace price-qualified research
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          After a visitor reaches a result in the free Healthcare Worker Benefits Decision System, CAF may show a bounded proposal for a separate $29 one-time Benefits Decision Workspace. The free workflow, comparison, verification checklist, Decision Brief, printing, and official-source use remain free. The proposed paid value is cross-device saved work, multiple decision workspaces, deeper multi-option comparison, a structured evidence ledger, and a consolidated advanced brief.
        </p>
        <p>
          If a visitor intentionally records price-qualified stated intent, the form asks only for an email address, a separate confirmation that the visitor would seriously consider paying $29 one time for the described workspace if it launches, and consent to receive product-specific confirmation and follow-up. The service stores the normalized email, a one-way email hash used to prevent duplicate counting, a random browser-session identifier, fixed offer metadata, evidence classification, consent and commitment status, and timestamps in a service-role-only Supabase table. The record is not a purchase, reservation, account, entitlement, obligation, payment authorization, or confirmed willingness to pay.
        </p>
        <p>
          This stated-intent record is not designed to receive or store employer names, plan documents, plan elections, salary or benefit values, medical information, diagnoses, member IDs, claim information, financial-account information, payment-card information, free-text notes, or uploaded files. Visitors should not submit those details through the form, email, or the Contact page.
        </p>
        <p>
          After a visitor chooses Allow analytics, the site may separately store fixed anonymous events when the qualified post-result offer is viewed, its details are opened, and the commitment form is started. These events use a random browser-session identifier and fixed offer, surface, and experiment values; they do not include the email, form contents, answers, amounts, employer, plan, medical information, or URLs. Choosing Necessary only prevents those optional anonymous events. A visitor who intentionally submits the form still creates the minimal contact and stated-intent record required to fulfill that request.
        </p>
        <p>
          Release-verification records are explicitly separated from observed evidence and do not trigger follow-up email. Founder, friend/family, duplicate, or synthetic records can be excluded from business evidence. Unsubscribing through the confirmation email marks the commitment inactive and also updates the connected email audience when available. A visitor may use the <Link to="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">Contact page</Link> to request correction or deletion, subject to identity verification and any legally required retention.
        </p>
      </div>
    </div>
  </section>
);
