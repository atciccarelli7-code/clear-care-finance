# Resend Email Setup

This project is a Vite/React app deployed on Vercel, not a Next.js App Router app. Email sending uses a top-level Vercel serverless function in `api/send.ts`.

## What this setup adds

- `resend` dependency for sending emails and saving newsletter contacts.
- `api/send.ts` as a POST-only Vercel function for newsletter signups and 403(b) estimate emails.
- `src/components/shared/NewsletterSignup.tsx` as the site-native newsletter signup component.
- Durable newsletter contact capture through `resend.contacts.create()` before the welcome email is attempted.

## Required Vercel environment variables

Add these in Vercel before using the endpoint in production:

```txt
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Community Acquired Finance <hello@communityacquiredfinance.com>
RESEND_NOTIFY_EMAIL=optional_admin_notification_email
```

`RESEND_FROM_EMAIL` must use a verified Resend sending domain before production use. `onboarding@resend.dev` is only acceptable for early testing and may only send to the account owner's email address.

## Production Resend checklist

1. Add `communityacquiredfinance.com` or a sending subdomain such as `updates.communityacquiredfinance.com` in Resend.
2. Add the required Resend DNS records at the DNS host.
3. Wait for the domain status to show verified in Resend.
4. Set `RESEND_FROM_EMAIL` in Vercel to a sender on that verified domain.
5. Redeploy production after changing Vercel environment variables.
6. Test the newsletter with an email address that is not the account owner.

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
- If the contact is saved but Resend is still in testing mode, the endpoint returns success with `emailDelivered: false` so the UI can show that the reader is on the list even though the welcome email is not deliverable yet.
- The endpoint does not allow arbitrary subject/body input, which keeps it from becoming a generic open email relay.

## Signup CTA placement

The CTA should stay non-intrusive. Current recommended placements:

- Homepage
- Healthcare Workers page
- Student Loans page
- Tools page
- Bottom of article pages

No popups until there is enough traffic data to justify testing them.
