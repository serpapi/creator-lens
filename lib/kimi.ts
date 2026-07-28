import { CreatorAnalysis, VideoData } from "./types";
import { runAnalysisPipeline } from "./analyze-pipeline";

const KIMI_API_URL = "https://api.moonshot.ai/v1/chat/completions";

const SYSTEM_MESSAGE =
  "You are a JSON-only assistant. Always respond with valid JSON only. No markdown, no code fences, no explanation.";

// Strip ```json ... ``` or ``` ... ``` wrappers Kimi sometimes adds
function stripMarkdown(content: string): string {
  const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : content.trim();
}

async function callKimi<T>(label: string, prompt: string, apiKey: string): Promise<Partial<T>> {
  const res = await fetch(KIMI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "kimi-k3",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kimi error [${label}]: ${res.status} ${err}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content ?? "";

  console.log(`[Kimi ${label}] raw response (first 300 chars):`, raw.slice(0, 300));

  if (!raw) {
    console.error(`[Kimi ${label}] empty response`);
    return {};
  }

  const cleaned = stripMarkdown(raw);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`[Kimi ${label}] JSON parse failed:`, err);
    console.error(`[Kimi ${label}] raw content that failed:`, cleaned.slice(0, 500));
    return {};
  }
}

export async function analyzeCreatorWithKimi(
  creatorName: string,
  videos: VideoData[],
  apiKey: string
): Promise<CreatorAnalysis> {
  const result = await runAnalysisPipeline(creatorName, videos, (label, prompt) =>
    callKimi(label, prompt, apiKey)
  );
  return { ...result, model: "kimi-k3" };
}
