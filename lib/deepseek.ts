import { CreatorAnalysis, VideoData, VideoSummary } from "./types";
import { buildVideoSummaryPrompt, buildAnalysisPrompt } from "./prompts";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const API_KEY = process.env.DEEPSEEK_API_KEY!;

const SYSTEM_MESSAGE =
  "You are a JSON-only assistant. Always respond with valid JSON only. No markdown, no code fences, no explanation.";

// Strip ```json ... ``` or ``` ... ``` wrappers DeepSeek sometimes adds
function stripMarkdown(content: string): string {
  const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : content.trim();
}

async function callDeepSeek<T>(label: string, prompt: string): Promise<Partial<T>> {
  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek error [${label}]: ${res.status} ${err}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";

  console.log(`[DeepSeek ${label}] raw response (first 300 chars):`, raw.slice(0, 300));

  if (!raw) {
    console.error(`[DeepSeek ${label}] empty response`);
    return {};
  }

  const cleaned = stripMarkdown(raw);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`[DeepSeek ${label}] JSON parse failed:`, err);
    console.error(`[DeepSeek ${label}] raw content that failed:`, cleaned.slice(0, 500));
    return {};
  }
}

// ── Step 1: summarize a single video using its full transcript ─────────────

async function summarizeVideo(video: VideoData): Promise<VideoSummary> {
  const prompt = buildVideoSummaryPrompt(video);
  const raw = await callDeepSeek<VideoSummary>(`summarize:${video.videoId}`, prompt);

  const summary: VideoSummary = {
    videoId: video.videoId,
    title: video.title,
    views: video.views,
    publishedDate: video.publishedDate,
    mainTopic: (raw.mainTopic as string) ?? "",
    keyPoints: (raw.keyPoints as string[]) ?? [],
    titlePattern: (raw.titlePattern as string) ?? "",
    hook: (raw.hook as string) ?? "",
    whyItWorks: (raw.whyItWorks as string) ?? "",
    audienceProblems: (raw.audienceProblems as string[]) ?? [],
    beliefs: (raw.beliefs as string[]) ?? [],
  };

  console.log(`[summarizeVideo] ${video.videoId} →`, {
    mainTopic: summary.mainTopic,
    titlePattern: summary.titlePattern,
    keyPointsCount: summary.keyPoints.length,
  });

  return summary;
}

// ── Step 2: cross-video strategy analysis from summaries ──────────────────

async function analyzeFromSummaries(
  creatorName: string,
  summaries: VideoSummary[],
  totalViews: number,
  averageViews: number
): Promise<CreatorAnalysis> {
  console.log(`[analyzeFromSummaries] running with ${summaries.length} summaries`);

  const prompt = buildAnalysisPrompt(summaries);
  const parsed = await callDeepSeek<CreatorAnalysis>("analysis", prompt);

  console.log("[analyzeFromSummaries] parsed fields:", {
    mainNiche: parsed.mainNiche,
    topContentThemesCount: (parsed.topContentThemes as string[] | undefined)?.length,
    titlePatternsCount: (parsed.titlePatterns as string[] | undefined)?.length,
    videoAnalysisCount: (parsed.videoAnalysis as unknown[] | undefined)?.length,
    hasStrategyReport: !!(parsed.strategyReport),
  });

  const analysis: CreatorAnalysis = {
    creatorName,
    videosAnalyzed: summaries.length,
    totalViews,
    averageViews,
    engagementRate: "—",
    mainNiche: (parsed.mainNiche as string) ?? "Unknown",
    topContentThemes: (parsed.topContentThemes as string[]) ?? [],
    titlePatterns: (parsed.titlePatterns as string[]) ?? [],
    coreBeliefs: (parsed.coreBeliefs as string[]) ?? [],
    audiencePainPoints: (parsed.audiencePainPoints as string[]) ?? [],
    publishingCadence: (parsed.publishingCadence as string) ?? "Unknown",
    videoAnalysis: ((parsed.videoAnalysis as unknown as Record<string, unknown>[]) ?? []).map((v) => ({
      videoId: (v.videoId as string) ?? "",
      title: (v.title as string) ?? "",
      views: (v.views as number) ?? 0,
      publishedDate: (v.publishedDate as string) ?? "",
      mainTopic: (v.mainTopic as string) ?? "",
      titlePattern: (v.titlePattern as string) ?? "",
      whyItWorks: (v.whyItWorks as string) ?? "",
    })),
    strategyReport: (parsed.strategyReport as string) ?? "Analysis unavailable.",
  };

  return analysis;
}

// ── Public entry point ────────────────────────────────────────────────────

export async function analyzeCreator(
  creatorName: string,
  videos: VideoData[]
): Promise<CreatorAnalysis> {
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const averageViews = videos.length ? Math.round(totalViews / videos.length) : 0;

  console.log(`[analyzeCreator] starting for "${creatorName}" with ${videos.length} videos`);

  // Step 1: summarize all videos in parallel (each gets its full transcript)
  const summaries = await Promise.all(videos.map((v) => summarizeVideo(v)));
  console.log(`[analyzeCreator] step 1 complete — ${summaries.length} summaries ready`);

  // Step 2: single cross-video analysis using the summaries
  const result = await analyzeFromSummaries(creatorName, summaries, totalViews, averageViews);
  console.log(`[analyzeCreator] step 2 complete — mainNiche: ${result.mainNiche}, themes: ${result.topContentThemes.length}`);

  return result;
}
