# Launch verification

## Implemented in Phase 4
- Floating AI guide entry at bottom-left, above the mobile bottom navigation. The guide still accurately indicates that AI answers are coming soon.
- Password recovery request and reset pages, linked from login. Recovery requests avoid revealing whether an account exists.
- Mobile menu exposes all existing pages. Desktop navigation scrolls within its available space.
- Restored translated network-error keys in account forms.

## Backend checks still required
- Add the deployed /reset-password address and local development equivalent to Supabase Auth redirect URLs.
- Verify a real recovery email arrives, a valid link establishes the session, the new password works, and expired links show a retry path.
- Verify account confirmation, profile updates, sign out, and row-level access policies with separate test accounts.
- Provision and verify account-sync tables before claiming cross-device planning or bookmark sync.

## Release checks still required
- Review English and Kannada copy with a native Kannada speaker.
- Verify the floating entry, menu, keyboard focus and comparison table in desktop and mobile browsers.
- Remaining repository-wide lint issues predate this phase and still need cleanup.

Automated checks cover recovery request success/failure, planning storage, career filtering/comparison, content links and routing. A successful build does not verify email delivery or live database permissions.
