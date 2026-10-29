# Final setup and live verification

## Groq AI
The assistant is implemented with authenticated server calls. It keeps the provider key on the server, limits message length/history, uses the existing career content, and handles network/provider failures. Conversations are not persisted.

Add GROQ_API_KEY to the local .env file and the production host's secret settings. Never use a VITE_ prefix for this key. Optionally set GROQ_MODEL; the default is llama-3.3-70b-versatile. Restart the development server after setting a key. Groq account quotas and available models depend on the provider account.

## Account plans
The student_plans table is provisioned in the connected database, with row-level security restricted to each user's own row. Profile has explicit save and restore controls for bookmarks, roadmap progress and assessment history. Save replaces the cloud backup; restore replaces local planning data. The schema migration is saved in supabase/migrations/20261029_student_plans.sql.

## Still requires live access
- Real Groq response after the key is configured.
- Two-account save/restore and permission checks.
- Recovery email delivery, expired links and login with a changed password.
- Supabase Auth redirect URLs for the final production hostname.
- Native Kannada copy review and full mobile/browser visual review.

## Publication
This folder is a source export without Git history. It has not been pushed back to Lovable or published by this work. Deploying the old Lovable project would not publish these local edits. Import/sync this complete source into the chosen hosting workflow first, then configure server secrets and build it. Keep the existing Lovable project's published history intact.
