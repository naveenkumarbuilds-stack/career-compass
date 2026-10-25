# CareerCompass — Phase 1

A free bilingual foundation for Indian students after Class 10 and Class 12 (PUC), across CBSE, ICSE and State boards.

## Open locally

Use Node.js 24 and npm. From this folder:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5174
```

Open http://127.0.0.1:5174. The saved local copy contains an ignored `.env.local` with the existing project's public Supabase configuration. Dependencies are not included in Git; install them using `npm ci` before starting this copy.

For another machine, copy `.env.example` to `.env.local` and set:
- `VITE_SUPABASE_URL`: Supabase public project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: publishable key (or legacy anon key). Never use a service-role key, secret key, database password, or AI key in VITE variables.

## Scope implemented

- React, TypeScript, Tailwind; existing TanStack Start routing preserved.
- Central brand tokens in `src/styles.css`; change colours there.
- English and Kannada dictionaries in `src/i18n/en.ts` and `kn.ts`; Kannada displays a native-speaker-review notice.
- Home with exact requested English headline, two stage cards, eight category placeholders, how-it-works explanation and signup CTA.
- Signup, login and protected Profile. Profile edits only name, language and stage, displays read-only email, and supports logout.
- Signup has only name, email, password, language, stage and conditional guardian-permission acknowledgement, plus a short privacy explanation.
- Desktop navigation and mobile bottom navigation.
- Explore, Exams and AI Guide are Coming soon pages. No career records, exam records, notes, AI calls, sharing, PDFs or later-phase features.
- Translated validation, notifications, metadata, 404/error screens; guest language persistence and profile language persistence.
- Loading/network-error handling, safe local return paths after login, minimal profile updates, focus styles and reduced motion.

## Existing backend — verified 25 October 2026

Lovable project: 04228765-4ef4-4539-8902-a3f5bf7b6743.

The existing Lovable Cloud database is Supabase-backed and enabled. Public auth settings returned HTTP 200: email sign-in enabled; signups enabled; email auto-confirm false (confirmation required).

The existing migration `drizzle/migrations/0000_migration.sql` is already applied. Do not recreate the database or run it on an unrelated project. The recovered copy is retained for review and for setting up a new, empty Supabase project if you explicitly choose to migrate later.

Live read-only inspection confirmed:
- `profiles` is the only public table, with row-level security enabled.
- SELECT uses `auth.uid() = id`.
- INSERT uses WITH CHECK `auth.uid() = id`.
- UPDATE uses both USING and WITH CHECK `auth.uid() = id`.
- Anonymous users have no profile grants.
- Authenticated UPDATE grants cover only `full_name`, `preferred_language` and `stage`.
- No admin flag, roles column, admin UI or public profile access.

Profiles reference `auth.users`, with cascade deletion. Signup trigger validates/defaults metadata and creates the row even when email confirmation is required. Passwords go to Supabase Auth only; session tokens are persisted by the auth client, not passwords.

## Exactly what the owner must confirm

1. Keep the existing Lovable Cloud/Supabase backend; no separate project is required for this local copy.
2. In the backend authentication URL configuration, add `http://127.0.0.1:5174/login` to allowed redirects for local testing. Keep the existing Lovable preview redirect. When deploying later, add that site's exact `/login` callback and set Site URL to its final origin. Local preview and deployed sites must use the same origin that is allowlisted.
3. Keep Email/Password enabled, signup enabled and email confirmation enabled.
4. Confirm confirmation email delivery using an email account you control. Use a configured sender/SMTP for public launch if required by the backend's email service. No SMTP password belongs in browser code.
5. Run one real signup → email confirmation → login → profile edit → refresh → logout. Then use a second controlled student account to confirm the first profile cannot be read or edited. No real accounts were created during this work.
6. Have a native Kannada speaker review the marked translation file.
7. For future admin access use a separate roles table with RLS and no student write access; no admin setup is needed in Phase 1.

## Validation

```sh
npx tsc --noEmit
npm test
npm run build
```

28 tests cover minimal signup metadata, signup confirmation UI, rejected network requests, editable profile fields, logout failure handling, form validation, local redirect safety, translated auth errors, translation completeness/placeholders and basic routing. Auth UI tests use mocked Supabase responses and are not a substitute for the real email/session test above.

Browser checks: English/Kannada home, persisted guest language, translated signup validation, profile guest redirect, Coming soon routes, mobile navigation and mobile-width overflow. Desktop and 375px mobile layouts were inspected.

## Delivery boundaries

This is the completed local working copy. The original Lovable editor is not automatically updated by these local changes. The source is backed up at https://github.com/naveenkumarbuilds-stack/career-compass. Existing repository history was preserved. The website has not been deployed, and this repository is not automatically connected to the original Lovable editor. Avoid force pushes or rewriting published history.

