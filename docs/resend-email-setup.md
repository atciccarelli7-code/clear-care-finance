# Resend Email Setup

This project is a Vite/React app deployed on Vercel, not a Next.js App Router app. For email sending, use a top-level Vercel serverless function in `api/send.ts` instead of `app/api/send/route.ts`.

## What this starter adds

- `resend` dependency for sending emails.
- `@react-email/render` dependency so Resend can render React email templates.
- `src/components/email/HealthcareWorkerMoneyMapEmail.tsx` as the first welcome email template.
- `api/send.ts` as a POST-only Vercel function for sending the Healthcare Worker Money Map email.

## Required Vercel environment variables

Add these in Vercel before using the endpoint:

```txt
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=Community Acquired Finance <hello@communityacquiredfinance.com>
RESEND_NOTIFY_EMAIL=optional_admin_notification_email
```

`RESEND_FROM_EMAIL` should use a verified Resend domain before production use. `onboarding@resend.dev` is only acceptable for early testing.

## API request shape

POST `/api/send`

```json
{
  "email": "reader@example.com",
  "firstName": "Andrew",
  "consent": true,
  "website": ""
}
```

Notes:

- `email` is required.
- `consent: true` is required.
- `website` is a honeypot field and should stay empty.
- The endpoint does not allow arbitrary subject/body input, which keeps it from becoming a generic open email relay.

## Suggested next build step

After Resend domain verification is complete, add a site-native signup component that posts to `/api/send` and places the CTA on:

- Homepage
- Healthcare Workers page
- Student Loans page
- Tools page
- Bottom of article pages

Keep the CTA non-intrusive. No popups until there is enough traffic data to justify testing them.
