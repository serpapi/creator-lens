# CreatorLens

**Analyze any YouTube creator’s content strategy with AI.**

CreatorLens is a lightweight dashboard that uses AI to reverse-engineer a creator’s content strategy—discovering themes, audience pain points, title patterns, and more.

---

## 🎬 Demo

https://github.com/user-attachments/assets/dd8aae6f-a20d-4394-8779-8992fad5f94c

---

## ✨ What You Get

- 🔍 **Search videos** from any YouTube creator  
- 📖 **Extract transcripts** and metadata  
- 🤖 **AI analysis** finds patterns across all videos  
- 📊 **Interactive dashboard** with insights and stats  
- ⚙️ **Flexible scope** — analyze 10, 25, 50, or 100 videos  

---

## 🎯 What CreatorLens Analyzes

For any creator, it discovers:

- **Content themes** — What topics do they cover?
- **Title patterns** — What makes their titles work?
- **Audience pain points** — What problems do they solve?
- **Core beliefs** — What do they believe in?
- **Publishing cadence** — When and how often do they publish?
- **Strategy insights** — What’s the bigger pattern?

---

## 🚀 Quick Start

### 1. Get API Keys

**SerpApi** (YouTube data):
- Visit [serpapi.com](https://serpapi.com)
- Sign up and get your API key

**DeepSeek** (AI analysis):
- Visit [platform.deepseek.com](https://platform.deepseek.com)
- Sign up and get your API key

### 2. Clone & Install

```bash
git clone <repo-url>
cd creator-lens
npm install
```

### 3. Add API Keys

Create `.env.local`:

```
SERPAPI_API_KEY=your_serpapi_key
DEEPSEEK_API_KEY=your_deepseek_key
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

1. **Enter a creator name** (e.g., "Dan Koe", "Ali Abdaal")
2. **Choose how many videos** to analyze
3. **Click Analyze**
4. **Wait 2–3 minutes** for results
5. **View the dashboard**

---

## 🏗️ How It Works

```
YouTube Videos
    ↓
SerpApi (search videos, get metadata, fetch transcripts)
    ↓
Normalize & compress data
    ↓
DeepSeek Step 1: Analyze each video individually
    ↓
DeepSeek Step 2: Find cross-video patterns
    ↓
Dashboard (display insights)
```

**Two-step AI analysis:**
- **Step 1** — Compress each video into a structured summary
- **Step 2** — Analyze all summaries together to find patterns

This keeps the AI reasoning sharp and the prompts clean.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Recharts | Charts |
| SerpApi | YouTube data |
| DeepSeek | AI analysis |

---

## 📊 What the Dashboard Shows

- **Creator stats** — Videos analyzed, total views, average views
- **Content themes** — Main topics
- **Title patterns** — Common words and structures
- **Audience insights** — Pain points and beliefs
- **Upload frequency** — Publishing patterns
- **Video table** — Details for each video

---

## 🌐 Deploy

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Then set environment variables in the Vercel dashboard.

---

## 📁 Project Structure

```
app/
  page.tsx                    # Home page
  api/analyze-creator/        # API endpoint
  dashboard/[creatorName]/    # Results page

components/
  analyze-form.tsx            # Search form
  dashboard.tsx               # Results view
  brand-logos.tsx             # Logos

lib/
  serpapi.ts                  # SerpApi integration
  deepseek.ts                 # AI analysis
  types.ts                    # TypeScript types
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "401 error" | Check API keys in `.env.local` |
| "Timeout" | Try analyzing fewer videos (start with 10) |
| "No transcripts" | Some videos have transcripts disabled. The app continues anyway. |
| "Rate limit" | Wait a moment and try again |

---


## 💡 Design Philosophy

CreatorLens is:

- **Stateless** — No database, no auth, no background jobs
- **Lightweight** — Fresh analysis on every request
- **Reasoning-focused** — Uses structured AI contracts

Every request: fetches YouTube data → analyzes transcripts → returns insights

---

## License

MIT