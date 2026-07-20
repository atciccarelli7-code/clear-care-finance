# Medical Bill Response Pack Email Sequence

Status: Email 1 is implemented through `api/send.ts`. Emails 2–4 are approved copy but must be activated through Resend Automations/Broadcasts or another provider-side lifecycle system that checks current unsubscribe status before each send.

Do not schedule Emails 2–4 as independent transactional sends from Vercel. A previously scheduled transactional email may not reliably reflect a later unsubscribe change. Provider-side audience automation is the production gate.

## Shared standards

- Audience: patients, caregivers, spouses, and adult children organizing a medical-bill response.
- Do not request replies containing diagnoses, bill images, claim numbers, account numbers, member IDs, provider names, dollar amounts, or other protected or identifying information.
- Every message must include the signed `/api/unsubscribe` link and `List-Unsubscribe` headers.
- Essential guidance and official sources remain free.
- No guaranteed savings, negotiation claims, legal conclusions, or artificial urgency.

## Email 1 — Identify the document

**Timing:** Immediate after explicit consent  
**Subject:** Medical bill first step: identify the document  
**Preheader:** Reduce the billing problem to one document, one deadline, one owner, and one next action.

Start with the document, not the dollar amount.

Your first 15 minutes:

1. Identify whether you have an EOB, provider bill, denial, financial-assistance form, or collection notice.
2. Match the service date and billing entity.
3. Check whether the payer says the claim is pending, processed, adjusted, or denied.
4. Copy every written deadline exactly.
5. Assign one organization and one specific next request.

An EOB is generally not a bill. A mismatch is a reason to reconcile the records, not proof that a charge is wrong.

**Primary CTA:** Open the Medical Bill Response System  
`https://communityacquiredfinance.com/insurance/medical-bill-review-toolkit`

## Email 2 — Compare the EOB and bill

**Suggested timing:** 2 days after Email 1, only while subscribed  
**Subject:** Compare the same date, provider, and billing entity  
**Preheader:** Avoid comparing documents that describe different claims or separate billing groups.

Before comparing totals, confirm that the documents refer to the same:

- Patient-responsibility period
- Service date
- Facility or professional billing entity
- Payer claim
- Claim-processing status

Then compare:

- Billed charge
- Allowed amount
- Plan payment
- Adjustments
- EOB patient responsibility
- Provider balance

A provider balance can temporarily differ from an EOB because of timing, separate claims, adjustments, or unresolved processing. Ask each organization to explain its own number in writing.

**Primary CTA:** Use the EOB-to-Bill Match Checker  
`https://communityacquiredfinance.com/tools/eob-to-bill-match-checker`

## Email 3 — Organize assistance, denials, and records

**Suggested timing:** 3 days after Email 2, only while subscribed  
**Subject:** Put the deadline and document owner in one place  
**Preheader:** Financial assistance, denials, and prior authorization each require a different record set.

Use the written notice as the controlling document.

For a denial or authorization problem, record:

- Exact reason
- Policy or code cited
- Submission instructions
- Deadline
- Person or organization responsible for the next document
- Confirmation number

For hospital financial assistance, obtain:

- The written policy
- Plain-language summary
- Application deadline
- Entities covered by the policy
- Required documents
- Whether the account is held during review

Keep a dated call log and save every portal message, form, letter, and delivery confirmation.

**Primary CTA:** Open the relevant guided workflow  
`https://communityacquiredfinance.com/patients-families`

## Email 4 — Optional expanded workbook

**Suggested timing:** 4 days after Email 3, only while subscribed  
**Subject:** An optional way to organize the full medical-bill process  
**Preheader:** The free system explains the next step. The expanded workbook helps document it.

The free Medical Bill Response System, official-source links, and ten-page Response Pack remain available without purchase.

The optional Expanded Medical Bill Response Workbook adds:

- 32 pages of reusable worksheets
- Visit, claim, and bill mapping
- Provider and insurer call preparation
- Itemized-bill and written-request templates
- Denial, prior-authorization, financial-assistance, and collections organizers
- Caregiver coordination and deadline control
- Scenario pathways for common billing problems

Planned price: $24 one time. No subscription. No guaranteed savings. No personalized bill review.

**Primary CTA:** Preview the workbook  
`https://communityacquiredfinance.com/products/expanded-medical-bill-response-workbook`

## Activation checklist

- [ ] Resend sending domain verified
- [ ] Production audience ID confirmed
- [ ] `/api/unsubscribe` tested with a consented address
- [ ] Provider-side automation checks current audience status before every message
- [ ] Email 2–4 links and copy reviewed in provider preview
- [ ] Non-owner inbox delivery verified
- [ ] Unsubscribe suppresses future sequence messages
- [ ] No email address, bill data, or PHI appears in analytics
