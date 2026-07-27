# CAF evidence-to-activation review — July 27, 2026

## Executive verdict

Community Acquired Finance is technically healthy and materially more mature than its available operating evidence. The highest-value completed action in this review was a live Supabase RLS correction and two-user isolation certification. Production premium access and checkout remain disabled.

The next operating constraint is not route count. It is external evidence for analytics delivery, newsletter persistence/delivery, search performance, and real user demand.

## Source-of-truth snapshot

### GitHub

- Repository: `atciccarelli7-code/clear-care-finance`
- Reviewed baseline: `c1e8b442bb854eee056f48006e19d065d6639515`
- Open pull requests at review start: none
- Placeholder issue #219: closed as not planned because it had no actionable scope

### Vercel

- Team: `CAF`
- Project: `clear-care-finance`
- Production deployment reviewed: `dpl_3fDjULbSDcphFd36R5whfZtY5nfN`
- Production commit: `c1e8b442bb854eee056f48006e19d065d6639515`
- State: `READY`
- Canonical domain: `communityacquiredfinance.com`
- Grouped production runtime errors in the available seven-day review: none
- Runtime-log limitation: the Hobby plan does not retain enough history to reconstruct prior newsletter sends or API outcomes. A fresh test and provider-dashboard evidence are required.

### Supabase

- Project: `CAF Project`
- Project ref: `uzfcvtgnpkvuapgrkfcb`
- Status: `ACTIVE_HEALTHY`
- Region: `us-west-2`
- PostgreSQL: 17
- Applied migrations before this review:
  - `20260724233723 premium_system_foundation`
  - `20260724233826 premium_system_security_followup`
- Applied corrective migration during this review:
  - `20260727174018 restore_premium_admin_policy_execution`
- RLS enabled: every public application table
- Persistent rows after testing:
  - `products`: 1
  - all user, entitlement, workspace, event, module, and admin tables: 0
- Security advisors after correction: no findings

## RLS defect identified

The policies for authenticated profile, entitlement, and workspace reads call `private.is_premium_admin()`. The security follow-up migration revoked function execution and schema access from `authenticated`, so PostgreSQL raised `42501 permission denied for function is_premium_admin` before legitimate row filtering could occur.

The system remained fail-closed, but all ordinary authenticated reads that evaluated the helper were unusable.

## RLS correction

The corrective migration grants the minimum policy-evaluation privileges:

```sql
grant usage on schema private to authenticated;
grant execute on function private.is_premium_admin() to authenticated;
```

It continues to deny anonymous and public callers. The schema remains outside the exposed Data API, and the helper returns only whether the current `auth.uid()` exists in the trusted `premium_admins` table.

## Transactional two-user RLS/IDOR matrix

Two synthetic users, entitlements, workspaces, a secondary product, a test protected module, and a Stripe event were created inside one database transaction. The final transaction was rolled back, and the public row counts returned to their original empty state.

All 14 checks passed:

1. User A reads User A profile.
2. User A cannot read User B profile.
3. User A reads User A entitlement.
4. User A cannot read User B entitlement.
5. User A reads User A entitled workspace.
6. User A cannot read User B workspace.
7. User A updates User A workspace.
8. User A cannot update User B workspace.
9. User A cannot insert a workspace owned by User B.
10. User A cannot move a workspace to a product without entitlement.
11. Direct authenticated access to `products` is denied.
12. Direct authenticated access to `premium_modules` is denied.
13. Direct authenticated access to `stripe_events` is denied.
14. Direct authenticated access to `premium_admins` is denied.

The mutation-denial checks returned SQLSTATE `42501`. Cross-user reads returned zero rows. Own-record checks returned exactly one row.

## Analytics evidence

Repository measurement controls are implemented, including consent gating, URL sanitization, fixed schemas, sensitive-property rejection, journey events, tool events, result actions, and newsletter events.

External production reporting remains partially unverified because this execution environment does not have authenticated GA4 owner-dashboard access. No conversion rate is inferred from source code, HTTP success, or Vercel pageviews.

The August 4, 2026 journey review remains the correct first scheduled review. Low-volume results must be reported as counts and directional evidence.

## Newsletter evidence

The repository contains a truthful saved-versus-delivered response contract and a non-relay `/api/send` design. However, this review could not verify:

- Resend domain status;
- production audience ID;
- production sender value;
- durable capture of a consented non-owner address;
- inbox delivery;
- unsubscribe behavior;
- provider campaign metrics.

No test address was fabricated. Historical Vercel logs are unavailable under current retention. These cells remain `UNVERIFIED` in the operating dashboard until a fresh consented test and Resend dashboard inspection are performed.

## Search evidence without GSC Wizard

GSC Wizard is not part of the operating architecture. The free trial ended, and a $20 monthly subscription is not justified at the current stage.

Search analysis must use:

1. a dated manual Google Search Console export;
2. the connected Google Drive search baseline;
3. explicit snapshot dates on every conclusion.

The latest connected baseline reviewed is dated July 20, 2026. It must not be described as current after that date. No new overlapping content should be created solely because live connector access is unavailable.

## Production safety state

The following remain disabled:

- production premium authentication;
- production workspace persistence;
- production entitlement enforcement;
- production protected-content delivery;
- Stripe live mode;
- production checkout;
- active-purchase copy;
- public paid access.

## Highest-value remaining actions

1. Run a fresh consented newsletter test and record provider evidence without exposing the address.
2. Configure and validate Supabase magic-link authentication in a controlled preview/test scope.
3. Exercise workspace persistence, export/deletion, account deletion, cross-device resume, and concurrency.
4. Complete Stripe test-mode setup only after authentication and persistence evidence are stable.
5. Import a fresh manual Search Console export and complete the August 4 journey review before broad interface or content expansion.
