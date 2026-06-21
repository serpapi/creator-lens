import { getJson } from "serpapi";
import { VideoData } from "./types";

function serpapi(params: Record<string, string>, apiKey: string) {
  return getJson({ ...params, api_key: apiKey });
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
  maxVideos: number,
  apiKey: string
): Promise<{ videoId: string; title: string; thumbnail: string; views: unknown; publishedDate: string; length: string }[]> {
  const collected: { videoId: string; title: string; thumbnail: string; views: unknown; publishedDate: string; length: string }[] = [];
  let nextPageToken: string | undefined;

  while (collected.length < maxVideos) {
    const params: Record<string, string> = {
      engine: "youtube",
      search_query: creatorName,
    };
    if (nextPageToken) params.next_page_token = nextPageToken;

    const data = await serpapi(params, apiKey);
    const results: Record<string, unknown>[] = (data.video_results as Record<string, unknown>[]) ?? [];

    for (const v of results) {
      if (collected.length >= maxVideos) break;
      const videoId = (v.link as string)?.split("v=")[1]?.split("&")[0] ?? "";
      if (!videoId) continue;
      collected.push({
        videoId,
        title: (v.title as string) ?? "",
        thumbnail: ((v.thumbnail as Record<string, string>)?.static) ?? "",
        views: v.views,
        publishedDate: (v.published_date as string) ?? "",
        length: (v.length as string) ?? "",
      });
    }

    nextPageToken = (data.serpapi_pagination as Record<string, string> | undefined)?.next_page_token;
    if (!nextPageToken || results.length === 0) break;
  }

  return collected;
}

async function fetchVideoDetails(
  videoId: string,
  apiKey: string
): Promise<{ description: string; views: number; likes: number }> {
  try {
    const data = await serpapi({ engine: "youtube_video", v: videoId }, apiKey);
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

async function fetchTranscript(videoId: string, apiKey: string): Promise<string> {
  try {
    const data = await serpapi({ engine: "youtube_video_transcript", v: videoId }, apiKey);
    const snippets = (data.transcript as { snippets?: { text: string }[] })?.snippets ?? [];
    return snippets.map((s) => s.text).join(" ");
  } catch {
    return "";
  }
}

async function batch<T>(items: T[], size: number, fn: (item: T) => Promise<unknown>): Promise<Awaited<ReturnType<typeof fn>>[]> {
  const results: Awaited<ReturnType<typeof fn>>[] = [];
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

export async function fetchVideosWithDetails(
  creatorName: string,
  maxVideos = 10,
  apiKey: string
): Promise<VideoData[]> {
  const searchResults = await searchYouTubeVideos(creatorName, maxVideos, apiKey);

  const videos = await batch(searchResults, 10, async (v) => {
    const [details, transcript] = await Promise.all([
      fetchVideoDetails(v.videoId, apiKey),
      fetchTranscript(v.videoId, apiKey),
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
  }) as VideoData[];

  return videos;
}
