# CreatorLens

**A preloaded AI dashboard for analyzing YouTube creator strategy.**

CreatorLens is a lightweight DevRel demo that shows how a polished creator analytics dashboard can be powered by AI-generated insights, seeded into Neon Postgres, and deployed on Vercel.

The public demo should not call SerpApi or DeepSeek directly. Instead, it should load precomputed dashboard data from Neon so API keys are never needed in the public deployment.

---

## Recommended Workflow

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

---

## Demo Design

The production demo is designed to be deterministic and safe:

- Public users open a preloaded dashboard.
- Demo data is stored in Neon Postgres.
- SerpApi and DeepSeek keys stay local/private.
- The public Vercel app should not expose an unauthenticated endpoint that spends API credits.
- Live analysis can remain a local-only workflow for generating or refreshing seed data.

---

## What CreatorLens Shows

For a seeded creator profile, the dashboard can show:

- Creator stats: videos analyzed, total views, average views
- Content themes
- Title patterns
- Audience pain points
- Core beliefs
- Publishing cadence
- Video-level analysis
- Strategy report

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 | React framework and App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Charts |
| Neon Postgres | Seeded production demo data |
| Vercel | Deployment |
| SerpApi | Private/local YouTube data ingestion |
| DeepSeek | Private/local analysis generation |

---

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Check the app:

```bash
npm run lint
npm run build
```

---

## Environment Variables

### Production Vercel

Production should use Neon and demo-mode variables only:

```txt
DATABASE_URL=your_neon_pooled_connection_string
DIRECT_DATABASE_URL=your_neon_direct_connection_string
CREATORLENS_DEMO_MODE=true
CREATORLENS_SEED_PROFILE=dan-koe
```

Do not add these to public Vercel production:

```txt
SERPAPI_API_KEY
DEEPSEEK_API_KEY
```

Those keys are for private local ingestion/generation only.

### Private Local Use

If you need to generate or refresh seed data locally, create `.env.local`:

```txt
SERPAPI_API_KEY=your_serpapi_key
DEEPSEEK_API_KEY=your_deepseek_key
DATABASE_URL=your_neon_pooled_connection_string
DIRECT_DATABASE_URL=your_neon_direct_connection_string
CREATORLENS_DEMO_MODE=true
```

Keep `.env.local` private and uncommitted.

---

## Neon Seed Data Plan

The first Neon schema should stay small:

- `creators`: creator slug, display name, optional YouTube URL/handle
- `videos`: metadata, thumbnails, views, published date, length, source video ID
- `transcripts`: optional transcript excerpts and fetch status
- `analysis_runs`: creator, model/provider metadata, status, timestamps, seed profile
- `analysis_results`: dashboard-ready JSON matching the app's `CreatorAnalysis` type
- `seed_profiles`: named demo bundles such as `dan-koe`, `ali-abdaal`, `mrbeast`

Seed scripts should be idempotent and upsert by stable slugs and video IDs.

---

## Target User Flow

1. User opens the Vercel demo.
2. App loads a seeded creator profile from Neon.
3. Dashboard renders immediately from stored analysis JSON.
4. If a creator is not seeded, the app shows a safe unavailable state.
5. The public app does not call SerpApi or DeepSeek.

---

## Project Structure

```text
app/
  page.tsx                    # Home page
  api/analyze-creator/        # API endpoint
  dashboard/[creatorName]/    # Results page

components/
  analyze-form.tsx            # Search form
  dashboard.tsx               # Results view
  brand-logos.tsx             # Logos

lib/
  serpapi.ts                  # Private/local SerpApi integration
  deepseek.ts                 # Private/local AI analysis
  types.ts                    # TypeScript dashboard contract
```

---

## Deployment

Deploy to Vercel only after the app reads seeded demo data from Neon:

1. Create a Neon Postgres database.
2. Create tables.
3. Seed demo data.
4. Connect the app to Neon.
5. Configure Vercel with Neon env vars only.
6. Confirm `SERPAPI_API_KEY` and `DEEPSEEK_API_KEY` are absent from Vercel production.
7. Run `npm run lint` and `npm run build`.
8. Deploy to Vercel.
9. Smoke test the preloaded dashboard.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Seeded creator does not load | Check `DATABASE_URL`, seed data, and creator slug |
| Public demo tries live analysis | Check `CREATORLENS_DEMO_MODE=true` and route guards |
| Vercel has SerpApi/DeepSeek keys | Remove them and redeploy |
| Build fails on fonts | Re-run build with network access so Next can fetch Google Fonts |
| Unseeded creator requested | Return a safe unavailable state instead of calling paid APIs |

---

## Design Philosophy

CreatorLens is:

- **Demo-safe** - public users see preloaded data
- **Key-safe** - paid API keys stay private/local
- **Lightweight** - small schema, small seed set, focused dashboard
- **Reasoning-focused** - AI analysis is generated ahead of time and replayed reliably

---

## License

MIT
