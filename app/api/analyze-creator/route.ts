import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 120;

import { fetchVideosWithDetails } from "@/lib/serpapi";
import { analyzeCreator } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
  try {
    const { creatorName, maxVideos = 10 } = await req.json();

    if (!creatorName?.trim()) {
      return NextResponse.json(
        { error: "creatorName is required" },
        { status: 400 }
      );
    }

    const videos = await fetchVideosWithDetails(creatorName.trim(), maxVideos);

    if (!videos.length) {
      return NextResponse.json(
        { error: "No videos found for this creator" },
        { status: 404 }
      );
    }

    const analysis = await analyzeCreator(creatorName.trim(), videos);

    // YouTube hides public like counts — use peak views instead
    const peakViews = videos.reduce((max, v) => Math.max(max, v.views), 0);
    analysis.engagementRate = peakViews > 0 ? String(peakViews) : "—";

    // Merge thumbnails into videoAnalysis items
    const thumbnailMap = new Map(videos.map((v) => [v.videoId, v.thumbnail]));
    analysis.videoAnalysis = analysis.videoAnalysis.map((v) => ({
      ...v,
      thumbnail: thumbnailMap.get(v.videoId) ?? "",
    }));

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[analyze-creator]", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
