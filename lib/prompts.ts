import { VideoData, VideoSummary } from "./types";

// ── Step 1: per-video summarization ───────────────────────────────────────

export function buildVideoSummaryPrompt(video: VideoData): string {
  // Use JSON.stringify for the context block so titles/descriptions with
  // quotes, backslashes or newlines are safely escaped.
  const context = JSON.stringify({
    videoId: video.videoId,
    title: video.title,
    views: video.views,
    publishedDate: video.publishedDate,
    description: video.description,
    transcript: video.transcript,
  });

  return `You are a content analyst. Analyze the YouTube video below and return a compact JSON summary.

Video data:
${context}

Return ONLY a valid JSON object with exactly these fields:
{
  "videoId": "<copy videoId from above>",
  "title": "<copy title from above>",
  "views": <copy views number from above>,
  "publishedDate": "<copy publishedDate from above>",
  "mainTopic": "<primary topic of this video in a few words>",
  "keyPoints": ["<key point 1>", "<key point 2>", "<key point 3>"],
  "titlePattern": "<pattern used, e.g. How-to, Listicle, Contrarian take, Personal story, Number list>",
  "hook": "<the emotional or curiosity hook used in this video>",
  "whyItWorks": "<one sentence explaining why this video performs well>",
  "audienceProblems": ["<problem this video solves 1>", "<problem 2>"],
  "beliefs": ["<worldview or belief the creator pushes 1>", "<belief 2>"]
}`;
}

// ── Step 2: cross-video strategy analysis ─────────────────────────────────

export function buildAnalysisPrompt(summaries: VideoSummary[]): string {
  return `You are a content strategy analyst. Based on the per-video summaries below, identify the creator's overall content strategy.

Video summaries:
${JSON.stringify(summaries, null, 2)}

Return ONLY a valid JSON object with exactly these fields:
{
  "mainNiche": "<creator's primary content niche in a few words>",
  "topContentThemes": ["<theme 1>", "<theme 2>", "<theme 3>", "<theme 4>", "<theme 5>"],
  "titlePatterns": ["<pattern 1>", "<pattern 2>", "<pattern 3>", "<pattern 4>"],
  "coreBeliefs": ["<belief 1>", "<belief 2>", "<belief 3>", "<belief 4>"],
  "audiencePainPoints": ["<pain point 1>", "<pain point 2>", "<pain point 3>", "<pain point 4>"],
  "publishingCadence": "<description of how frequently and consistently they post>",
  "videoAnalysis": [
    {
      "videoId": "<must match exactly from summaries>",
      "title": "<video title>",
      "views": <view count as number>,
      "publishedDate": "<published date string>",
      "mainTopic": "<primary topic>",
      "titlePattern": "<title pattern used>",
      "whyItWorks": "<one sentence on why this video performs well>"
    }
  ],
  "strategyReport": "<3-4 paragraph summary of the creator's repeatable content strategy framework>"
}`;
}
