# Analytics Setup Notes

This branch adds site usage measurement for Community Acquired Finance.

## Measurement ID

`G-2MR6ZCDJ1W`

## Files changed

- `src/components/analytics/GaHistoryTracker.tsx`
  - Loads the measurement script once.
  - Sends a manual page-view event on initial load.
  - Tracks single-page app navigation through browser history changes.

- `src/main.tsx`
  - Renders the tracker above the main app without changing the visible UI.

## Verification after deployment

1. Open the analytics dashboard.
2. Go to Realtime.
3. Visit `https://communityacquiredfinance.com`.
4. Navigate between the homepage, `/tools`, `/articles`, and a topic page.
5. Confirm Realtime shows page views for the different routes.

## Notes

- No tag-manager package was added.
- No advertising code was added.
- Existing advertising-related code was not changed.
