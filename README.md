# CareerCompass India

Career guidance for students after Class 10 and Class 12.

## Project guide
Read [CareerGuide: end-to-end workflow](docs/careerguide.pdf) for a plain-language illustrated explanation of the app, backend, AI, voice, planning and verification status.

## Features
- 19 careers with search, category/stage filters, saving and comparison of 2-3 careers.
- Eight-question interest assessment and recent result history.
- Searchable milestone roadmaps, local progress and 19 illustrated PDF downloads.
- 21 exam records and official learning resources.
- Supabase email/password accounts, confirmation, recovery and profile editing.
- Explicit account backup/restore for bookmarks, progress and history.
- Authenticated Groq career chat, microphone transcription and browser read-aloud.

## Run locally
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in your own Supabase public configuration and private Groq key.
3. Run `npm run dev -- --host 127.0.0.1 --port 5174`.

Use `GROQ_MODEL=openai/gpt-oss-120b` for the tested 120B model. The `GROQ_API_KEY` must remain server-side and must never have a `VITE_` prefix.

## Verify
- `npm test`
- `npx tsc --noEmit`
- `npm run build`

The latest local run passed all 22 tests, TypeScript and the production build. Repository-wide lint still has known typing/style warnings and errors; no clean lint result is claimed.

## Backend
Supabase Auth handles accounts and sessions. `profiles` stores profile information. The `student_plans` table and owner-only row-level security policy are defined in `supabase/migrations/20261029_student_plans.sql`; that migration was applied to the connected project during development.

Groq chat uses server functions and authenticated sessions. Voice uses `whisper-large-v3-turbo` independently of the chat model. Chat cannot create custom PDF attachments; users download the existing roadmap files.

## PDF generation
Install Python packages `reportlab` and `pypdfium2`. Run `python scripts/generate_roadmaps.py` to refresh the roadmap files. `python scripts/create_careerguide.py` regenerates the project guide from the included screenshots.

## Remaining release checks
See [FINAL-SETUP.md](FINAL-SETUP.md) and [LAUNCH-CHECKS.md](LAUNCH-CHECKS.md). Live recovery lifecycle, two-account backup isolation, native Kannada review and full device/browser testing still need verification. This repository update is not proof of a successful public deployment. Set hosting secrets and Supabase redirect URLs for the production hostname before release.

## Lovable history
Preserve published history. Use normal new commits; do not force-push or rewrite existing commits on the connected branch.
