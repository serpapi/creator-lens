import { CreatorAnalysis, VideoData, VideoSummary } from "./types";
import { buildVideoSummaryPrompt, buildAnalysisPrompt } from "./prompts";

// A provider-specific call that sends `prompt` to an LLM and returns parsed JSON.
export type ModelCaller = <T>(label: string, prompt: string) => Promise<Partial<T>>;

// ── Step 1: summarize a single video using its full transcript ─────────────

async function summarizeVideo(video: VideoData, callModel: ModelCaller): Promise<VideoSummary> {
  const prompt = buildVideoSummaryPrompt(video);
  const raw = await callModel<VideoSummary>(`summarize:${video.videoId}`, prompt);

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
  averageViews: number,
  callModel: ModelCaller
): Promise<CreatorAnalysis> {
  console.log(`[analyzeFromSummaries] running with ${summaries.length} summaries`);

  const prompt = buildAnalysisPrompt(summaries);
  const parsed = await callModel<CreatorAnalysis>("analysis", prompt);

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

export async function runAnalysisPipeline(
  creatorName: string,
  videos: VideoData[],
  callModel: ModelCaller
): Promise<CreatorAnalysis> {
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const averageViews = videos.length ? Math.round(totalViews / videos.length) : 0;

  console.log(`[runAnalysisPipeline] starting for "${creatorName}" with ${videos.length} videos`);

  // Step 1: summarize videos in batches of 10 (each gets its full transcript)
  const summaries: VideoSummary[] = [];
  for (let i = 0; i < videos.length; i += 10) {
    const chunk = videos.slice(i, i + 10);
    const chunkSummaries = await Promise.all(chunk.map((v) => summarizeVideo(v, callModel)));
    summaries.push(...chunkSummaries);
  }
  console.log(`[runAnalysisPipeline] step 1 complete — ${summaries.length} summaries ready`);

  // Step 2: single cross-video analysis using the summaries
  const result = await analyzeFromSummaries(creatorName, summaries, totalViews, averageViews, callModel);
  console.log(`[runAnalysisPipeline] step 2 complete — mainNiche: ${result.mainNiche}, themes: ${result.topContentThemes.length}`);

  return result;
}
