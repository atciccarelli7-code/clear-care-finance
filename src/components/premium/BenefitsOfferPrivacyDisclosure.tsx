import { Link } from "react-router-dom";

export const BenefitsOfferPrivacyDisclosure = () => (
  <section className="container max-w-3xl pb-12 md:pb-16" aria-labelledby="benefits-offer-privacy-addendum">
    <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary-soft/20 p-6 shadow-card">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Effective August 3, 2026</div>
      <h2 id="benefits-offer-privacy-addendum" className="font-display text-xl font-bold text-foreground">
        Benefits Decision System early-access validation
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <p>
          The bounded Healthcare Worker Benefits Decision System offer asks only for an email address, confirmation that the visitor would seriously consider a $29 one-time purchase if the described product launches, and consent to receive product-specific confirmation and launch updates.
        </p>
        <p>
          The service stores the normalized email address, a one-way email hash used to prevent duplicate commitments, a random browser-session identifier, fixed product and offer identifiers, the fixed $29 price, the fixed source surface, consent status, commitment status, and timestamps in a service-role-only Supabase table. The commitment is not a purchase, reservation, account, entitlement, or payment authorization.
        </p>
        <p>
          This early-access record is not designed to receive or store employer names, plan documents, plan elections, salary or benefit values, medical information, diagnoses, member IDs, claim information, financial-account information, payment-card information, free-text notes, or uploaded files. Visitors should not submit those details through the form, email, or the Contact page.
        </p>
        <p>
          After a visitor chooses Allow analytics, the site may separately store fixed anonymous offer-view and offer-CTA events using a random browser-session identifier. These evidence events do not include the email address or form contents. Choosing Necessary only prevents those optional evidence events, but a visitor who intentionally submits the early-access form still creates the contact and commitment record required to fulfill that request.
        </p>
        <p>
          Unsubscribing through the confirmation email marks the Benefits Decision System commitment inactive and also updates the connected email audience when available. A visitor may also use the <Link to="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">Contact page</Link> to request correction or deletion, subject to identity verification and any legally required retention.
        </p>
      </div>
    </div>
  </section>
);
