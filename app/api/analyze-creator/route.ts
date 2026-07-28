import { NextRequest, NextResponse } from "next/server";
import { fetchVideosWithDetails } from "@/lib/serpapi";
import { analyzeCreatorWithDeepSeek } from "@/lib/deepseek";
import { analyzeCreatorWithKimi } from "@/lib/kimi";
import { getDanKoeDemoAnalysis, isDanKoeDemoCreator } from "@/lib/demo-data";
import { AiModel } from "@/lib/types";

export const maxDuration = 300;

function getModel(body: Record<string, unknown>): AiModel {
  return body.model === "kimi-k3" ? "kimi-k3" : "deepseek";
}

function getUserApiKeys(body: Record<string, unknown>) {
  const apiKeys = (body.apiKeys ?? {}) as Record<string, unknown>;
  const serpapiApiKey = body.SERPAPI_API_KEY ?? body.serpapiApiKey ?? apiKeys.SERPAPI_API_KEY ?? apiKeys.serpapiApiKey;
  const deepseekApiKey = body.DEEPSEEK_API_KEY ?? body.deepseekApiKey ?? apiKeys.DEEPSEEK_API_KEY ?? apiKeys.deepseekApiKey;
  const kimiApiKey = body.KIMI_API_KEY ?? body.kimiApiKey ?? apiKeys.KIMI_API_KEY ?? apiKeys.kimiApiKey;

  return {
    serpapiApiKey: typeof serpapiApiKey === "string" ? serpapiApiKey.trim() : "",
    deepseekApiKey: typeof deepseekApiKey === "string" ? deepseekApiKey.trim() : "",
    kimiApiKey: typeof kimiApiKey === "string" ? kimiApiKey.trim() : "",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorName, maxVideos = 10 } = body;

    if (!creatorName?.trim()) {
      return NextResponse.json(
        { error: "creatorName is required" },
        { status: 400 }
      );
    }

    const trimmedCreatorName = creatorName.trim();

    if (isDanKoeDemoCreator(trimmedCreatorName)) {
      const analysis = await getDanKoeDemoAnalysis();
      if (!analysis) {
        return NextResponse.json(
          { error: "Dan Koe demo data is unavailable." },
          { status: 404 }
        );
      }

      console.log("[analyze-creator] source=neon-seed creator=dan-koe");
      return NextResponse.json({ ...analysis, source: "neon-seed" });
    }

    const model = getModel(body);
    const { serpapiApiKey, deepseekApiKey, kimiApiKey } = getUserApiKeys(body);
    const modelApiKey = model === "kimi-k3" ? kimiApiKey : deepseekApiKey;

    if (!serpapiApiKey || !modelApiKey) {
      console.log("[analyze-creator] source=keys-required");
      return NextResponse.json(
        {
          error: "API keys are required for live analysis.",
          code: "api_keys_required",
          requiredKeys: ["SERPAPI_API_KEY", model === "kimi-k3" ? "KIMI_API_KEY" : "DEEPSEEK_API_KEY"],
        },
        { status: 401 }
      );
    }

    const videos = await fetchVideosWithDetails(trimmedCreatorName, maxVideos, serpapiApiKey);

    if (!videos.length) {
      return NextResponse.json(
        { error: "No videos found for this creator" },
        { status: 404 }
      );
    }

    const analysis = model === "kimi-k3"
      ? await analyzeCreatorWithKimi(trimmedCreatorName, videos, modelApiKey)
      : await analyzeCreatorWithDeepSeek(trimmedCreatorName, videos, modelApiKey);

    // YouTube hides public like counts — use peak views instead
    const peakViews = videos.reduce((max, v) => Math.max(max, v.views), 0);
    analysis.engagementRate = peakViews > 0 ? String(peakViews) : "—";

    // Merge thumbnails into videoAnalysis items
    const thumbnailMap = new Map(videos.map((v) => [v.videoId, v.thumbnail]));
    analysis.videoAnalysis = analysis.videoAnalysis.map((v) => ({
      ...v,
      thumbnail: thumbnailMap.get(v.videoId) ?? "",
    }));

    console.log("[analyze-creator] source=user-live");
    return NextResponse.json({ ...analysis, source: "user-live" });
  } catch (err) {
    console.error("[analyze-creator]", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
