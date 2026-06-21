import { neon } from "@neondatabase/serverless";
import { CreatorAnalysis } from "./types";

const DAN_KOE_SLUGS = new Set(["dan koe", "dan-koe", "dankoe", "@dankoetalks"]);

export function isDanKoeDemoCreator(value: string) {
  const normalized = value.trim().toLowerCase();
  return DAN_KOE_SLUGS.has(normalized);
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required for the Dan Koe demo.");
  }
  return url;
}

function assertCreatorAnalysis(value: unknown): CreatorAnalysis {
  if (!value || typeof value !== "object") {
    throw new Error("Seeded dashboard data is unavailable.");
  }

  const data = value as Partial<CreatorAnalysis>;
  if (
    typeof data.creatorName !== "string" ||
    typeof data.videosAnalyzed !== "number" ||
    !Array.isArray(data.videoAnalysis)
  ) {
    throw new Error("Seeded dashboard data is incomplete.");
  }

  return data as CreatorAnalysis;
}

export async function getDanKoeDemoAnalysis(): Promise<CreatorAnalysis | null> {
  const sql = neon(getDatabaseUrl());

  const rows = await sql`
    WITH seeded_result AS (
      SELECT ar.dashboard_json
      FROM public.analysis_results ar
      JOIN public.creators c ON c.id = ar.creator_id
      WHERE c.slug = 'dan-koe'
      ORDER BY ar.updated_at DESC
      LIMIT 1
    ),
    required_reads AS (
      SELECT
        (SELECT count(*) FROM public.videos v JOIN public.creators c ON c.id = v.creator_id WHERE c.slug = 'dan-koe') AS video_count,
        (SELECT count(*) FROM public.transcripts t JOIN public.videos v ON v.id = t.video_id JOIN public.creators c ON c.id = v.creator_id WHERE c.slug = 'dan-koe') AS transcript_count,
        (SELECT count(*) FROM public.content_clusters cc JOIN public.creators c ON c.id = cc.creator_id WHERE c.slug = 'dan-koe') AS cluster_count,
        (SELECT count(*) FROM public.creator_insights ci JOIN public.creators c ON c.id = ci.creator_id WHERE c.slug = 'dan-koe') AS insight_count
    )
    SELECT seeded_result.dashboard_json
    FROM seeded_result, required_reads
    WHERE required_reads.video_count > 0
      AND required_reads.transcript_count > 0
      AND required_reads.cluster_count > 0
      AND required_reads.insight_count > 0
  `;

  if (!rows[0]?.dashboard_json) return null;
  return assertCreatorAnalysis(rows[0].dashboard_json);
}
