# CreatorLens
CreatorLens is a lightweight AI dashboard that analyzes a YouTube creator’s content strategy using SerpApi and DeepSeek.
The goal is to build a polished DevRel demo and blog showcase, not a full SaaS product.
---
# Tech Stack
Use:
- Next.js 15
- TypeScript
- Tailwind CSS
- App Router
- Next.js API routes
- shadcn/ui
- Recharts
- SerpApi
- DeepSeek API
Deploy on Vercel.
Do NOT use:
- Database
- Supabase
- Authentication
- Redis
- Background jobs
- Docker
- Payment system
Keep the implementation lightweight and readable.
---
# Main Flow
```txt id="5hrtrg"
User Input
↓
SerpApi YouTube Search API
↓
SerpApi YouTube Video API
↓
SerpApi YouTube Transcript API
↓
DeepSeek Analysis
↓
Dashboard UI

⸻

Pages

Home Page

Route:

/

Include:

* App name: CreatorLens
* Tagline
* Search input
* Analyze button
* Example creator chips:
    * Dan Koe
    * Ali Abdaal
    * MrBeast

Submit to:

POST /api/analyze-creator

⸻

Dashboard

Display:

* Creator name
* Videos analyzed
* Total views
* Average views
* Main niche

Sections:

* Top content themes
* Title patterns
* Core beliefs
* Audience pain points
* Publishing cadence
* Video analysis table
* Strategy report

Style:

* modern SaaS dashboard
* white background
* rounded cards
* soft shadows
* green accent
* responsive layout

⸻

API Route

Create:

POST /api/analyze-creator

Request body:

{
  "creatorName": "Dan Koe",
  "maxVideos": 10
}

Flow:

1. Search YouTube videos
2. Fetch video details
3. Fetch transcripts
4. Normalize data
5. Send compact payload to DeepSeek
6. Return dashboard-ready JSON

No database.

Stateless only.

⸻

SerpApi

Environment variable:

SERPAPI_API_KEY

Endpoint:

https://serpapi.com/search.json

YouTube Search API

engine=youtube
search_query=<creator name>

Extract:

* video_id
* title
* thumbnail
* views
* published_date
* length

Limit to 10 videos.

⸻

YouTube Video API

engine=youtube_video
v=<video_id>

Extract:

* description
* views
* likes

⸻

YouTube Transcript API

engine=youtube_video_transcript
v=<video_id>

Join transcript snippets into text.

Use only first 3000-5000 characters.

If transcript fails, continue gracefully.

⸻

DeepSeek

Environment variable:

DEEPSEEK_API_KEY

Endpoint:

https://api.deepseek.com/chat/completions

Model:

deepseek-chat

Analyze:

* creator summary
* content themes
* title patterns
* audience pain points
* core beliefs
* publishing cadence
* repeatable strategy framework
* video-level analysis

Return valid JSON only.

If parsing fails, return safe fallback text.

⸻

Suggested Structure

app/
  page.tsx
  api/
    analyze-creator/
      route.ts
components/
  dashboard.tsx
  analyze-form.tsx
  stats-card.tsx
  video-table.tsx
  strategy-report.tsx
lib/
  serpapi.ts
  deepseek.ts
  prompts.ts
  types.ts

⸻

Engineering Notes

Use:

* async/await
* Promise.all
* reusable components
* strong TypeScript types

Prioritize:

* clean architecture
* readable code
* polished UI
* smooth demo experience

Avoid over-engineering.