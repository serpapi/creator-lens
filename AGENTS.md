# CreatorLens Codex Guide

## Project Overview

CreatorLens is a polished DevRel demo that analyzes a YouTube creator's content strategy. The current app is intentionally lightweight: a user enters a creator name, the app fetches YouTube search/video/transcript data through SerpApi, sends normalized transcript and metadata payloads to DeepSeek, then renders a dashboard with themes, title patterns, beliefs, audience pain points, cadence, video-level analysis, and a strategy report.

This is a showcase/demo app, not a full SaaS product. Keep product decisions optimized for clarity, reliability during demos, and readable implementation.

Current primary flow:

1. `/` renders the CreatorLens search experience.
2. `components/analyze-form.tsx` navigates to `/dashboard/[creatorName]?maxVideos=N`.
3. `app/dashboard/[creatorName]/page.tsx` calls `POST /api/analyze-creator`.
4. `app/api/analyze-creator/route.ts` fetches videos through `lib/serpapi.ts`.
5. `lib/deepseek.ts` runs the two-step DeepSeek analysis pipeline.
6. `components/dashboard.tsx` and chart/table components render the result.

## Tech Stack

- Next.js `16.2.6` with App Router.
- React `19.2.4`.
- TypeScript with `strict` mode.
- Tailwind CSS v4 through `@tailwindcss/postcss`.
- shadcn-style UI primitives in `components/ui`.
- Base UI dependency available via `@base-ui/react`.
- Recharts for dashboard charts.
- Lucide React for icons.
- SerpApi JavaScript client for YouTube data.
- DeepSeek chat completions API for analysis.
- Planned persistence layer: Neon Postgres.
- Deployment target: Vercel.

Important: `CLAUDE.md` still says "Next.js 15" and "Do NOT use Database." Treat that as historical project intent. The installed dependency is Next.js 16, and this Codex plan explicitly adds a future Neon Postgres path while preserving the lightweight demo spirit.

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

Current required variables:

- `SERPAPI_API_KEY` - server-only key for SerpApi YouTube engines.
- `DEEPSEEK_API_KEY` - server-only key for DeepSeek chat completions.

Planned Neon variables:

- `DATABASE_URL` - pooled Neon Postgres connection string for application queries in serverless/Vercel environments.
- `DIRECT_DATABASE_URL` - direct Neon Postgres connection string for migrations and administrative scripts.
- `CREATORLENS_DEMO_MODE` - optional feature flag; use `true` to prefer seed/demo data over live paid APIs.
- `CREATORLENS_SEED_PROFILE` - optional seed profile name, for example `default`, `dan-koe`, or `vercel-demo`.

Rules:

- Never expose secrets to Client Components or `NEXT_PUBLIC_*` variables unless the value is intentionally public.
- Keep `.env.local` local-only and out of commits.
- Mirror production values in Vercel Project Settings, not in source files.

## Database Plan With Neon Postgres

The app does not currently use a database. Add Neon Postgres only when implementing persistence, demo reliability, cached analysis, or shareable saved dashboards.

Recommended approach:

1. Use Neon Postgres as the canonical store for creators, analyzed videos, transcripts, analysis runs, and seed/demo records.
2. Use a pooled Neon connection string for normal Vercel serverless reads/writes.
3. Use a direct connection string only for schema migrations and one-off maintenance tasks.
4. Keep writes in route handlers or server-only modules; do not query Neon directly from Client Components.
5. Create a development branch in Neon for schema changes before applying migrations to the production branch.
6. Prefer additive, zero-downtime migrations: add nullable columns first, backfill separately, then add constraints after validation.
7. Keep the first schema small:
   - `creators`: normalized creator identity, display name, optional YouTube URL/handle.
   - `videos`: SerpApi video metadata, thumbnails, views, published date, length.
   - `transcripts`: transcript text and fetch status by video.
   - `analysis_runs`: creator, max video count, model/provider metadata, status, timestamps.
   - `analysis_results`: dashboard-ready JSON plus schema version.
   - `seed_profiles`: named fixture bundles for demo mode.
8. Store AI results as structured JSON for fast dashboard replay, but keep enough normalized metadata for filtering, tables, and future comparisons.
9. Add indexes around common lookups: creator slug/name, analysis run status, latest run per creator, video ID, and seed profile.
10. Document every migration and seed script in the same PR that introduces it.

Neon docs source of truth:

- https://neon.com/docs/connect/choose-connection.md
- https://neon.com/docs/guides/nextjs.md
- https://neon.com/docs/guides/vercel-overview.md
- https://neon.com/docs/introduction/branching.md

## Demo Mode Design

Demo mode should make the app reliable on stage, in blog posts, and in preview deployments without requiring live SerpApi and DeepSeek calls every time.

Design goals:

- Preserve the same dashboard UI and data contract used by live analysis.
- Make demo responses fast and deterministic.
- Avoid spending API credits during repeated demos.
- Allow a visible fallback when external APIs fail.

Suggested behavior:

1. Add a server-only demo data resolver that returns a `CreatorAnalysis` object matching `lib/types.ts`.
2. Gate demo mode with `CREATORLENS_DEMO_MODE=true` and optional request-level selection through known example creators.
3. Prefer seeded database records once Neon is added; before Neon, use checked-in fixture JSON under a dedicated fixtures directory.
4. In demo mode, do not call SerpApi or DeepSeek unless explicitly requested by a development-only override.
5. If live analysis fails and a matching seed exists, return the seed with a non-sensitive `source: "demo-fallback"` marker in server logs or metadata.
6. Keep fixture content realistic and aligned with the UI reference, including charts, table rows, and strategy report text.

## Seed Data Strategy

Seed data should support three needs: local development, Vercel preview demos, and production fallback demos.

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

1. Start with fixture JSON matching `CreatorAnalysis`.
2. Add a seed script after Neon is introduced.
3. Make seeds idempotent by upserting on stable slugs and video IDs.
4. Version seed payloads so old dashboard JSON can be migrated or regenerated.
5. Keep seed data small enough for quick local setup.

## Deployment Target: Vercel

Vercel is the intended production host.

Deployment notes:

- Use Vercel environment variables for `SERPAPI_API_KEY`, `DEEPSEEK_API_KEY`, and future Neon connection strings.
- Preserve the API route timeout needs. `app/api/analyze-creator/route.ts` currently exports `maxDuration = 300`.
- Test `npm run build` before deploying.
- Ensure `next.config.ts` continues to allow YouTube thumbnail hosts used by SerpApi results.
- When Neon is added, use Vercel preview deployments with Neon development/preview branches where practical.
- Keep production demo behavior deterministic; external API outages should not break the showcase path.

## Coding Conventions

- Use TypeScript interfaces from `lib/types.ts` as the dashboard contract.
- Keep server-only API keys inside route handlers or `lib/*` server modules.
- Keep Client Components explicit with `"use client"` only when hooks, browser APIs, or client navigation are required.
- Prefer small, readable modules over framework-heavy abstractions.
- Match existing import style with `@/*` aliases.
- Use async/await and graceful fallbacks for external API failures.
- Keep the two-step DeepSeek analysis pattern unless there is a clear reason to change it.
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

Use this order for future implementation work. Do not skip verification steps.

1. Read the relevant Next.js docs in `node_modules/next/dist/docs/` for the feature area being changed.
2. Run `npm run lint` and, if relevant, `npm run build` to establish a baseline.
3. Confirm the current dashboard contract in `lib/types.ts`.
4. Add demo fixture JSON that satisfies `CreatorAnalysis`.
5. Add a server-only demo data resolver and wire it behind `CREATORLENS_DEMO_MODE`.
6. Update `POST /api/analyze-creator` to choose demo data before live SerpApi/DeepSeek calls when demo mode is enabled.
7. Verify local demo mode with `npm run dev` and example creators.
8. Add Neon dependencies and a small database access layer only after demo fixtures are stable.
9. Create the initial Neon schema for creators, videos, transcripts, analysis runs, analysis results, and seed profiles.
10. Add idempotent seed scripts for the three recommended seed profiles.
11. Add route-handler logic to read cached/seeded analysis results from Neon before running live analysis.
12. Add write-through persistence for successful live analysis runs.
13. Test migrations against a Neon development branch before applying to production.
14. Configure Vercel environment variables for live mode and demo mode.
15. Run `npm run lint` and `npm run build`.
16. Smoke test these paths: home page, live analysis with 10 videos, demo-mode profile, API failure fallback, dashboard table and charts, mobile layout.
17. Document any new commands, environment variables, and deployment steps in `README.md` or this file as appropriate.
