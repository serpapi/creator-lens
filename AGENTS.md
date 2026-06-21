# CreatorLens Codex Guide

## Project Overview

CreatorLens is a polished DevRel demo that analyzes a YouTube creator's content strategy. The production demo must be preloaded from Neon Postgres seed data, not powered by public live SerpApi or DeepSeek calls.

Current app behavior is still mostly stateless: a user enters a creator name, the app can fetch YouTube data through SerpApi, send normalized transcript and metadata payloads to DeepSeek, and render a dashboard. The target workflow is now:

```text
Neon: create Postgres database
↓
Codex: create tables + seed demo data
↓
Codex: connect app to Neon
↓
Vercel: deploy app
↓
User opens demo with preloaded dashboard
```

Treat live external API analysis as a private local/development tool only. Public deployments should serve deterministic, seeded dashboards from Neon so API keys are never needed in the public Vercel project.

## Tech Stack

- Next.js `16.2.6` with App Router.
- React `19.2.4`.
- TypeScript with `strict` mode.
- Tailwind CSS v4 through `@tailwindcss/postcss`.
- shadcn-style UI primitives in `components/ui`.
- Base UI dependency available via `@base-ui/react`.
- Recharts for dashboard charts.
- Lucide React for icons.
- SerpApi JavaScript client for private/local YouTube data ingestion.
- DeepSeek chat completions API for private/local analysis generation.
- Neon Postgres for production demo data.
- Vercel for deployment.

Important: `CLAUDE.md` still says "Next.js 15" and "Do NOT use Database." Treat that as historical guidance. The installed dependency is Next.js 16, and this Codex guide supersedes it for the Neon-seeded public demo workflow.

## Local Development Commands

- `npm install` - install dependencies from `package-lock.json`.
- `npm run dev` - start local Next.js development server.
- `npm run build` - build the production app.
- `npm run start` - run the built production app locally.
- `npm run lint` - run ESLint.

Before changing any Next.js app, route handler, caching, Server Component, Client Component, metadata, image, or deployment behavior, read the relevant docs under `node_modules/next/dist/docs/`. Useful starting points for this app:

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`

## Environment Variables

Production Vercel should contain Neon connection variables only:

- `DATABASE_URL` - pooled Neon Postgres connection string for app reads in Vercel.
- `DIRECT_DATABASE_URL` - direct Neon Postgres connection string for migrations and seed scripts, if those scripts run from trusted environments.
- `CREATORLENS_DEMO_MODE=true` - production should serve seeded demo dashboards.
- `CREATORLENS_SEED_PROFILE` - optional default profile, for example `dan-koe`.

Private local-only variables:

- `SERPAPI_API_KEY` - local/private ingestion only. Do not add this to public Vercel production.
- `DEEPSEEK_API_KEY` - local/private analysis generation only. Do not add this to public Vercel production.

Rules:

- Never expose secrets to Client Components or `NEXT_PUBLIC_*` variables unless the value is intentionally public.
- Keep `.env.local` local-only and out of commits.
- Do not put SerpApi or DeepSeek keys in a public demo deployment.
- Public deployments must not provide an unauthenticated endpoint that spends API credits.
- If live analysis is ever needed in production, put it behind authentication, rate limits, and explicit owner-only controls.

## Database Plan With Neon Postgres

Neon Postgres is the production source for preloaded dashboards. The app should read demo dashboard data from Neon instead of calling SerpApi or DeepSeek at request time.

Recommended schema:

1. `creators`: normalized creator identity, slug, display name, optional YouTube URL/handle.
2. `videos`: video metadata, thumbnails, views, published date, length, source video ID.
3. `transcripts`: optional transcript excerpts and fetch status by video.
4. `analysis_runs`: creator, max video count, model/provider metadata, status, timestamps, seed profile.
5. `analysis_results`: dashboard-ready JSON matching `CreatorAnalysis`, schema version, run ID.
6. `seed_profiles`: named fixture bundles such as `dan-koe`, `ali-abdaal`, and `mrbeast`.

Implementation rules:

- Use a pooled Neon connection string for normal Vercel serverless reads.
- Use a direct connection string for migrations and seed scripts.
- Keep writes in server-only modules or trusted scripts.
- Do not query Neon directly from Client Components.
- Create a Neon development branch for schema work before applying migrations to production.
- Prefer additive, zero-downtime migrations.
- Make seed scripts idempotent with stable creator slugs and video IDs.

Neon docs source of truth:

- https://neon.com/docs/connect/choose-connection.md
- https://neon.com/docs/guides/nextjs.md
- https://neon.com/docs/guides/vercel-overview.md
- https://neon.com/docs/introduction/branching.md

## Demo Mode Design

Demo mode is the public production design, not a fallback afterthought.

Design goals:

- Public demo opens quickly to a preloaded dashboard.
- Public demo does not require SerpApi or DeepSeek keys.
- Public users cannot spend API credits.
- Seeded dashboards use the same `CreatorAnalysis` shape as live/local analysis.
- Live analysis remains available only in trusted local development.

Suggested behavior:

1. `/` can show example creators or link directly to a seeded default dashboard.
2. `/dashboard/[creatorName]` first resolves a creator slug against Neon seed data.
3. `POST /api/analyze-creator` should return seeded Neon data in demo mode.
4. If a creator is not seeded, return a helpful "demo profile unavailable" response rather than calling paid APIs.
5. Keep live SerpApi/DeepSeek calls behind an explicit local-only guard such as `CREATORLENS_ENABLE_LIVE_ANALYSIS=true`.
6. Log whether a response came from `neon-seed`, `local-live`, or `unavailable`, but do not expose secrets.

## Seed Data Strategy

Seed data should support the public demo, Vercel previews, and local development.

Recommended seed profiles:

- `dan-koe` - primary polished demo profile.
- `ali-abdaal` - productivity/education contrast profile.
- `mrbeast` - high-volume entertainment contrast profile.

Seed contents:

- Creator identity and display metadata.
- 10 representative videos per profile.
- View counts, publish dates, thumbnails, title patterns, main topics, and why-it-works copy.
- Aggregated dashboard fields from `CreatorAnalysis`.
- At least one transcript fetch failure case to verify graceful handling.

Implementation path:

1. Generate or curate fixture JSON locally.
2. Create Neon tables.
3. Insert fixture JSON into Neon with idempotent seed scripts.
4. Connect the app to Neon read paths.
5. Remove SerpApi and DeepSeek keys from public Vercel production.
6. Deploy to Vercel and verify that the dashboard loads from seeded data.

## Deployment Target: Vercel

Vercel is the intended production host.

Deployment notes:

- Production Vercel should use Neon env vars and demo-mode flags only.
- Do not configure `SERPAPI_API_KEY` or `DEEPSEEK_API_KEY` in public production.
- Test `npm run lint` and `npm run build` before deploying.
- Ensure `next.config.ts` continues to allow YouTube thumbnail hosts used by seeded data.
- Use Vercel preview deployments with Neon development/preview branches when schema changes are involved.
- Keep production demo behavior deterministic; external API outages should not break the showcase path.

## Coding Conventions

- Use TypeScript interfaces from `lib/types.ts` as the dashboard contract.
- Keep server-only API keys inside trusted local modules/scripts only.
- Keep Client Components explicit with `"use client"` only when hooks, browser APIs, or client navigation are required.
- Prefer small, readable modules over framework-heavy abstractions.
- Match existing import style with `@/*` aliases.
- Use async/await and graceful fallbacks for external failures.
- Preserve the two-step DeepSeek analysis pattern for local/private generation.
- Reuse existing UI primitives and dashboard components before adding new component systems.
- Use Recharts for chart visualizations.
- Use Lucide icons for common interface icons.
- Keep the dashboard compact and SaaS-like: sidebar, metric cards, chart cards, table, purple accent, white cards, subtle borders.
- Avoid adding auth, payments, Redis, background jobs, or Docker unless the product direction changes explicitly.
- Do not perform broad refactors while adding isolated features.

## Files That Should Not Be Modified

Do not modify these unless the user explicitly asks or the task truly requires it:

- `.env.local` and any file containing secrets.
- `node_modules/`
- `.next/`
- `next-env.d.ts`
- `tsconfig.tsbuildinfo`
- `package-lock.json`, except when dependencies intentionally change.
- `public/*logo*.png` and `design/*logo*.png`, unless replacing brand assets is the task.
- `design/dan-koe-design.png`, which is a visual reference.
- `doc/creator-lens-demo.mov`, which is a demo artifact.
- `.git/`

Be careful with these files:

- `CLAUDE.md` - historical guidance for another agent; update only when asked.
- `UI-requirements.md` - design requirements/reference; update only when asked.
- `lib/types.ts` - changing this affects the API route and dashboard contract.
- `app/api/analyze-creator/route.ts` - external API cost and timeout behavior live here.

## Step-by-Step Implementation Plan

Use this order for the new public-demo workflow:

1. Read the relevant Next.js docs in `node_modules/next/dist/docs/`.
2. Create a Neon Postgres database.
3. Choose a small schema for creators, videos, transcripts, analysis runs, analysis results, and seed profiles.
4. Generate or curate demo fixture data locally using private API keys only.
5. Create tables in a Neon development branch.
6. Seed demo data into Neon with idempotent scripts.
7. Connect the app to Neon with server-only database helpers.
8. Update dashboard routes and API routes to read seeded data in demo mode.
9. Ensure missing/unseeded creators do not trigger paid API calls in public production.
10. Configure Vercel with Neon env vars and `CREATORLENS_DEMO_MODE=true`.
11. Confirm SerpApi and DeepSeek keys are absent from Vercel production.
12. Run `npm run lint` and `npm run build`.
13. Deploy to Vercel.
14. Smoke test: home page, seeded dashboard, unseeded creator response, mobile layout.
15. Only after the seeded public demo works, consider an authenticated owner-only live ingestion path.
