# Resend Email Setup

This project is a Vite/React app deployed on Vercel, not a Next.js App Router app. Email sending uses a top-level Vercel serverless function in `api/send.ts`.

## What this setup adds

- `resend` dependency for sending emails and saving newsletter contacts.
- `api/send.ts` as a POST-only Vercel function for newsletter signups and 403(b) estimate emails.
- `src/components/shared/NewsletterSignup.tsx` as the site-native newsletter signup component.
- Durable newsletter contact capture through `resend.contacts.create()` before the welcome email is attempted.

## Required Vercel environment variables

Add these in Vercel before treating newsletter signup as production-ready:

```txt
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
RESEND_FROM_EMAIL=Community Acquired Finance <hello@communityacquiredfinance.com>
RESEND_NOTIFY_EMAIL=optional_admin_notification_email
```

`RESEND_AUDIENCE_ID` is required for durable newsletter capture. Without it, the endpoint cannot confirm that a reader was added to the mailing audience.

`RESEND_FROM_EMAIL` must use a verified Resend sending domain before production use. `onboarding@resend.dev` is only acceptable for early testing and may only send to the account owner's email address.

## Production Resend checklist

1. Add `communityacquiredfinance.com` or a sending subdomain such as `updates.communityacquiredfinance.com` in Resend.
2. Add the required Resend DNS records at the DNS host.
3. Wait for the domain status to show verified in Resend.
4. Create or select the production newsletter audience and copy its audience ID.
5. Set `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, and `RESEND_FROM_EMAIL` in Vercel Production environment variables.
6. Set `RESEND_NOTIFY_EMAIL` only when that recipient is valid and wanted.
7. Redeploy production after changing Vercel environment variables.
8. Test the newsletter with an email address that is not the Resend account owner.
9. Confirm the contact appears in the expected Resend audience.
10. Confirm the welcome email arrives or the UI displays the truthful saved-but-delivery-pending message.
11. Check Vercel runtime logs for `/api/send` warnings or errors.

## API request shape

POST `/api/send`

```json
{
  "email": "reader@example.com",
  "firstName": "Andrew",
  "consent": true,
  "website": "",
  "source": "homepage",
  "type": "newsletter"
}
```

Notes:

- `email` is required.
- `consent: true` is required.
- `website` is a honeypot field and should stay empty.
- `type: newsletter` saves a Resend contact before attempting the welcome email.
- The signup UI treats `saved: true` as the controlling success condition. It does not tell a reader they joined the list when contact persistence failed.
- If the contact is saved but welcome-email delivery is still unavailable, the endpoint may return `emailDelivered: false` and the UI displays a limited success message.
- The endpoint does not allow arbitrary subject/body input, which keeps it from becoming a generic open email relay.

## Production verification record

Record the date, test address type, response fields, audience confirmation, email-delivery result, and Vercel log result after every material Resend configuration change. Do not include the test email address in GitHub issues or logs.

## Signup CTA placement

The CTA should stay non-intrusive. Current recommended placements:

- Homepage
- Healthcare Workers page
- Student Loans page
- Tools page
- Bottom of article pages

No popups until there is enough traffic data to justify testing them.
