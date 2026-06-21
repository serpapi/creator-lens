import { NextRequest, NextResponse } from "next/server";
import { fetchVideosWithDetails } from "@/lib/serpapi";
import { analyzeCreator } from "@/lib/deepseek";
import { getDanKoeDemoAnalysis, isDanKoeDemoCreator } from "@/lib/demo-data";

export const maxDuration = 300;

function getUserApiKeys(body: Record<string, unknown>) {
  const apiKeys = (body.apiKeys ?? {}) as Record<string, unknown>;
  const serpapiApiKey = body.SERPAPI_API_KEY ?? body.serpapiApiKey ?? apiKeys.SERPAPI_API_KEY ?? apiKeys.serpapiApiKey;
  const deepseekApiKey = body.DEEPSEEK_API_KEY ?? body.deepseekApiKey ?? apiKeys.DEEPSEEK_API_KEY ?? apiKeys.deepseekApiKey;

  return {
    serpapiApiKey: typeof serpapiApiKey === "string" ? serpapiApiKey.trim() : "",
    deepseekApiKey: typeof deepseekApiKey === "string" ? deepseekApiKey.trim() : "",
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

    const { serpapiApiKey, deepseekApiKey } = getUserApiKeys(body);
    if (!serpapiApiKey || !deepseekApiKey) {
      console.log("[analyze-creator] source=keys-required");
      return NextResponse.json(
        {
          error: "API keys are required for live analysis.",
          code: "api_keys_required",
          requiredKeys: ["SERPAPI_API_KEY", "DEEPSEEK_API_KEY"],
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

    const analysis = await analyzeCreator(trimmedCreatorName, videos, deepseekApiKey);

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
