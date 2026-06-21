CREATE TABLE IF NOT EXISTS public.seed_profiles (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.creators (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  display_name text NOT NULL,
  handle text,
  youtube_url text,
  bio text,
  main_niche text NOT NULL,
  target_audience text NOT NULL,
  writing_style text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.videos (
  id text PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  source_video_id text NOT NULL UNIQUE,
  title text NOT NULL,
  thumbnail_url text NOT NULL,
  views bigint NOT NULL DEFAULT 0,
  published_date date NOT NULL,
  relative_published_date text NOT NULL,
  length text NOT NULL,
  topic text NOT NULL,
  content_pillar text NOT NULL,
  title_pattern text NOT NULL,
  why_it_works text NOT NULL,
  sort_order integer NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transcripts (
  id text PRIMARY KEY,
  video_id text NOT NULL UNIQUE REFERENCES public.videos(id) ON DELETE CASCADE,
  status text NOT NULL,
  excerpt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analysis_runs (
  id text PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  seed_profile_id text NOT NULL REFERENCES public.seed_profiles(id) ON DELETE RESTRICT,
  provider text NOT NULL,
  model text NOT NULL,
  status text NOT NULL,
  videos_analyzed integer NOT NULL,
  total_views bigint NOT NULL,
  average_views bigint NOT NULL,
  peak_views bigint NOT NULL,
  generated_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.analysis_results (
  id text PRIMARY KEY,
  analysis_run_id text NOT NULL UNIQUE REFERENCES public.analysis_runs(id) ON DELETE CASCADE,
  creator_id text NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  schema_version integer NOT NULL,
  dashboard_json jsonb NOT NULL,
  main_themes jsonb NOT NULL,
  target_audience text NOT NULL,
  writing_style text NOT NULL,
  content_pillars jsonb NOT NULL,
  recurring_ideas jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_clusters (
  id text PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  seed_profile_id text NOT NULL REFERENCES public.seed_profiles(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text NOT NULL,
  themes jsonb NOT NULL,
  video_count integer NOT NULL,
  average_views bigint NOT NULL,
  representative_video_ids jsonb NOT NULL,
  sort_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.creator_insights (
  id text PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  seed_profile_id text NOT NULL REFERENCES public.seed_profiles(id) ON DELETE RESTRICT,
  insight_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  sort_order integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS creators_slug_idx ON public.creators (slug);
CREATE INDEX IF NOT EXISTS videos_creator_sort_idx ON public.videos (creator_id, sort_order);
CREATE INDEX IF NOT EXISTS videos_creator_published_idx ON public.videos (creator_id, published_date DESC);
CREATE INDEX IF NOT EXISTS videos_topic_idx ON public.videos (topic);
CREATE INDEX IF NOT EXISTS analysis_runs_creator_generated_idx ON public.analysis_runs (creator_id, generated_at DESC);
CREATE INDEX IF NOT EXISTS content_clusters_creator_sort_idx ON public.content_clusters (creator_id, sort_order);
CREATE INDEX IF NOT EXISTS creator_insights_creator_sort_idx ON public.creator_insights (creator_id, sort_order);
