import { getJson } from "serpapi";
import { VideoData } from "./types";

const API_KEY = process.env.SERPAPI_API_KEY!;

function serpapi(params: Record<string, string>) {
  return getJson({ ...params, api_key: API_KEY });
}

function parseViews(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const n = parseFloat(raw.replace(/[^0-9.]/g, ""));
    if (isNaN(n)) return 0;
    if (/k/i.test(raw)) return Math.round(n * 1_000);
    if (/m/i.test(raw)) return Math.round(n * 1_000_000);
    if (/b/i.test(raw)) return Math.round(n * 1_000_000_000);
    return Math.round(n);
  }
  return 0;
}

async function searchYouTubeVideos(
  creatorName: string,
  maxVideos: number
): Promise<{ videoId: string; title: string; thumbnail: string; views: unknown; publishedDate: string; length: string }[]> {
  const data = await serpapi({ engine: "youtube", search_query: creatorName });
  const results: Record<string, unknown>[] = (data.video_results as Record<string, unknown>[]) ?? [];

  return results
    .slice(0, maxVideos)
    .map((v) => ({
      videoId: (v.link as string)?.split("v=")[1]?.split("&")[0] ?? "",
      title: (v.title as string) ?? "",
      thumbnail: ((v.thumbnail as Record<string, string>)?.static) ?? "",
      views: v.views,
      publishedDate: (v.published_date as string) ?? "",
      length: (v.length as string) ?? "",
    }))
    .filter((v) => v.videoId);
}

async function fetchVideoDetails(
  videoId: string
): Promise<{ description: string; views: number; likes: number }> {
  try {
    const data = await serpapi({ engine: "youtube_video", v: videoId });
    const vr = (data.video_results as Record<string, unknown>) ?? {};
    return {
      description: (vr.description as string) ?? "",
      views: parseViews(vr.views),
      likes: parseViews(vr.likes),
    };
  } catch {
    return { description: "", views: 0, likes: 0 };
  }
}

async function fetchTranscript(videoId: string): Promise<string> {
  try {
    const data = await serpapi({ engine: "youtube_video_transcript", v: videoId });
    const snippets = (data.transcript as { snippets?: { text: string }[] })?.snippets ?? [];
    return snippets.map((s) => s.text).join(" ");
  } catch {
    return "";
  }
}

export async function fetchVideosWithDetails(
  creatorName: string,
  maxVideos = 10
): Promise<VideoData[]> {
  const searchResults = await searchYouTubeVideos(creatorName, maxVideos);

  const videos = await Promise.all(
    searchResults.map(async (v) => {
      const [details, transcript] = await Promise.all([
        fetchVideoDetails(v.videoId),
        fetchTranscript(v.videoId),
      ]);
      return {
        videoId: v.videoId,
        title: v.title,
        thumbnail: v.thumbnail,
        views: parseViews(v.views) || details.views,
        publishedDate: v.publishedDate,
        length: v.length,
        description: details.description,
        likes: details.likes,
        transcript,
      } satisfies VideoData;
    })
  );
  return videos;
}
