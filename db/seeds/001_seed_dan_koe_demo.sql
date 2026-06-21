CREATE TEMP TABLE _dan_koe_clusters (
  idx integer PRIMARY KEY,
  cluster_id text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  topic text NOT NULL,
  pillar text NOT NULL,
  title_pattern text NOT NULL,
  why_it_works text NOT NULL,
  themes jsonb NOT NULL
) ON COMMIT DROP;

INSERT INTO _dan_koe_clusters VALUES
  (0, 'cluster_one_person_business', 'One-Person Business', 'How to package knowledge, build leverage, and replace traditional employment with a lean creator business.', 'One-Person Business', 'Business Models', 'Contrarian promise + simple business model', 'It connects a strong career desire with a simple solo-business path, making the viewer feel that independence is practical rather than vague.', '["solo business","digital leverage","offers","creator monetization"]'::jsonb),
  (1, 'cluster_writing_distribution', 'Writing and Distribution', 'Writing as the operating system for audience growth, product thinking, and opportunity creation.', 'Writing Systems', 'Content Systems', 'Skill stack + repeatable writing system', 'It reframes writing as leverage, not journaling, which makes the topic useful for both creators and professionals.', '["writing","audience growth","content systems","distribution"]'::jsonb),
  (2, 'cluster_focus_deep_work', 'Focus and Deep Work', 'Attention, solitude, and daily focus blocks as the foundation of creative output.', 'Focus and Deep Work', 'Self-Mastery', 'Painful diagnosis + disciplined solution', 'It names the viewer''s scattered attention problem and offers structure without sounding overly tactical.', '["focus","attention","deep work","discipline"]'::jsonb),
  (3, 'cluster_self_education', 'Self-Education', 'Designing a personal curriculum, learning valuable skills, and escaping passive consumption.', 'Self-Education', 'Learning', 'Beginner roadmap + personal curriculum', 'It gives self-directed learners permission to build their own curriculum while promising a clear order of operations.', '["self-education","skill acquisition","mental models","learning"]'::jsonb),
  (4, 'cluster_mindset_identity', 'Mindset and Identity', 'Identity change, agency, and internal standards for long-term creative independence.', 'Mindset and Identity', 'Identity', 'Identity shift + future-self framing', 'It uses identity-level stakes, which makes the topic feel bigger than a productivity tip.', '["identity","agency","beliefs","standards"]'::jsonb),
  (5, 'cluster_offer_products', 'Offers and Digital Products', 'Turning audience problems into simple offers, product ladders, and scalable digital products.', 'Digital Products', 'Monetization', 'Specific outcome + productized path', 'It links audience pain to monetization, helping creators see products as problem-solving rather than selling.', '["offers","digital products","positioning","value"]'::jsonb),
  (6, 'cluster_creator_economy', 'Creator Economy Strategy', 'How creators build trust, publish consistently, and use platforms without becoming dependent on them.', 'Creator Economy', 'Creator Strategy', 'Market observation + creator strategy', 'It explains a broad market shift while giving the viewer a personal strategy for adapting.', '["creator economy","trust","platforms","strategy"]'::jsonb),
  (7, 'cluster_systems_lifestyle', 'Systems and Lifestyle Design', 'Daily systems, routines, and lifestyle design for sustaining independent creative work.', 'Lifestyle Systems', 'Operating System', 'Routine breakdown + lifestyle promise', 'It turns abstract lifestyle design into routines, systems, and constraints the audience can copy.', '["systems","routines","lifestyle design","energy"]'::jsonb);

CREATE TEMP TABLE _dan_koe_templates (
  idx integer PRIMARY KEY,
  template text NOT NULL
) ON COMMIT DROP;

INSERT INTO _dan_koe_templates VALUES
  (0, 'The {topic} Blueprint That Changed How I Work'),
  (1, 'How To Build {topic} Without Burning Out'),
  (2, 'I Studied {topic} For 1,000 Hours - Here Is The System'),
  (3, 'The Simple {topic} Habit Most Creators Ignore'),
  (4, 'If I Started From Zero, I Would Learn {topic} First'),
  (5, 'The Unfair Advantage Of {topic} In The New Economy'),
  (6, 'Stop Chasing Motivation. Build This {topic} System Instead'),
  (7, 'The {topic} Framework For Escaping A Normal Career'),
  (8, 'How I Would Teach A Beginner {topic} In 30 Days'),
  (9, 'The Hidden Pattern Behind Profitable {topic}'),
  (10, 'Why Your {topic} Is Not Working Yet'),
  (11, 'Build A Calm Life Around {topic}'),
  (12, 'The 3 Levers That Make {topic} Compound'),
  (13, 'This Is Why Smart People Struggle With {topic}'),
  (14, 'A Practical Guide To {topic} For Solo Creators'),
  (15, 'The Future Belongs To People Who Understand {topic}'),
  (16, 'How To Turn {topic} Into A Daily Operating System'),
  (17, 'The Anti-Busy Person''s Guide To {topic}'),
  (18, 'I Rebuilt My Week Around {topic}'),
  (19, 'The Most Valuable Skill Inside {topic}');

INSERT INTO public.seed_profiles (id, label, description, is_default, updated_at)
VALUES ('dan-koe-demo', 'Dan Koe Demo', 'Preloaded CreatorLens dashboard for Dan Koe.', true, now())
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  is_default = EXCLUDED.is_default,
  updated_at = now();

INSERT INTO public.creators (
  id, slug, display_name, handle, youtube_url, bio, main_niche,
  target_audience, writing_style, metadata, updated_at
)
VALUES (
  'creator_dan_koe',
  'dan-koe',
  'Dan Koe',
  '@DanKoeTalks',
  'https://www.youtube.com/results?search_query=Dan+Koe',
  'Writer and creator focused on the one-person business, self-education, digital leverage, and high-agency creative work.',
  'One-person business, creator education, and modern self-mastery',
  'Solo creators, knowledge workers, designers, writers, consultants, and ambitious professionals who want to turn ideas into leverage without building a traditional company.',
  'Direct, philosophical, systems-oriented, and motivational. The copy uses clear contrasts, memorable frameworks, and a calm but urgent tone.',
  '{"seeded":true,"seedProfile":"dan-koe-demo"}'::jsonb,
  now()
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  display_name = EXCLUDED.display_name,
  handle = EXCLUDED.handle,
  youtube_url = EXCLUDED.youtube_url,
  bio = EXCLUDED.bio,
  main_niche = EXCLUDED.main_niche,
  target_audience = EXCLUDED.target_audience,
  writing_style = EXCLUDED.writing_style,
  metadata = EXCLUDED.metadata,
  updated_at = now();

WITH video_seed AS (
  SELECT
    gs AS sort_order,
    'video_dan_koe_' || lpad(gs::text, 3, '0') AS id,
    'dan-koe-demo-' || lpad(gs::text, 3, '0') AS source_video_id,
    replace(t.template, '{topic}', c.topic) AS title,
    '/serpapi-square-logo.png' AS thumbnail_url,
    (175000 + c.idx * 38000 + ((gs - 1) * 7919 % 620000) + CASE WHEN (gs - 1) % 17 = 0 THEN 520000 ELSE 0 END)::bigint AS views,
    (DATE '2026-06-18' - ((gs - 1) * 7) * INTERVAL '1 day')::date AS published_date,
    CASE
      WHEN gs = 1 THEN '3 days ago'
      WHEN gs = 2 THEN '1 week ago'
      WHEN gs < 6 THEN (gs + 1)::text || ' weeks ago'
      ELSE LEAST(24, ((gs - 1) / 4)::int + 1)::text || ' months ago'
    END AS relative_published_date,
    (12 + ((gs - 1) % 18))::text || ':' || lpad((10 + (((gs - 1) * 7) % 49))::text, 2, '0') AS length,
    c.topic,
    c.pillar AS content_pillar,
    c.title_pattern,
    c.why_it_works,
    '{"seeded":true}'::jsonb AS metadata
  FROM generate_series(1, 100) AS gs
  JOIN _dan_koe_clusters c ON c.idx = ((gs - 1) % 8)
  JOIN _dan_koe_templates t ON t.idx = ((gs - 1) % 20)
)
INSERT INTO public.videos (
  id, creator_id, source_video_id, title, thumbnail_url, views,
  published_date, relative_published_date, length, topic,
  content_pillar, title_pattern, why_it_works, sort_order, metadata, updated_at
)
SELECT
  id,
  'creator_dan_koe',
  source_video_id,
  title,
  thumbnail_url,
  views,
  published_date,
  relative_published_date,
  length,
  topic,
  content_pillar,
  title_pattern,
  why_it_works,
  sort_order,
  metadata,
  now()
FROM video_seed
ON CONFLICT (id) DO UPDATE SET
  source_video_id = EXCLUDED.source_video_id,
  title = EXCLUDED.title,
  thumbnail_url = EXCLUDED.thumbnail_url,
  views = EXCLUDED.views,
  published_date = EXCLUDED.published_date,
  relative_published_date = EXCLUDED.relative_published_date,
  length = EXCLUDED.length,
  topic = EXCLUDED.topic,
  content_pillar = EXCLUDED.content_pillar,
  title_pattern = EXCLUDED.title_pattern,
  why_it_works = EXCLUDED.why_it_works,
  sort_order = EXCLUDED.sort_order,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO public.transcripts (id, video_id, status, excerpt, updated_at)
SELECT
  'transcript_' || id,
  id,
  CASE WHEN sort_order % 23 = 1 THEN 'unavailable' ELSE 'seeded_excerpt' END,
  CASE
    WHEN sort_order % 23 = 1 THEN NULL
    ELSE 'Seeded transcript excerpt for ' || title || '. Dan explains ' || lower(topic) || ' through a practical framework, then connects it to agency, leverage, and repeatable creative systems.'
  END,
  now()
FROM public.videos
WHERE creator_id = 'creator_dan_koe'
ON CONFLICT (video_id) DO UPDATE SET
  status = EXCLUDED.status,
  excerpt = EXCLUDED.excerpt,
  updated_at = now();

WITH stats AS (
  SELECT
    count(*)::int AS videos_analyzed,
    sum(views)::bigint AS total_views,
    round(avg(views))::bigint AS average_views,
    max(views)::bigint AS peak_views
  FROM public.videos
  WHERE creator_id = 'creator_dan_koe'
)
INSERT INTO public.analysis_runs (
  id, creator_id, seed_profile_id, provider, model, status,
  videos_analyzed, total_views, average_views, peak_views, generated_at, updated_at
)
SELECT
  'analysis_run_dan_koe_seed_v1',
  'creator_dan_koe',
  'dan-koe-demo',
  'seeded-demo',
  'curated-demo-v1',
  'complete',
  videos_analyzed,
  total_views,
  average_views,
  peak_views,
  '2026-06-21T00:00:00.000Z'::timestamptz,
  now()
FROM stats
ON CONFLICT (id) DO UPDATE SET
  videos_analyzed = EXCLUDED.videos_analyzed,
  total_views = EXCLUDED.total_views,
  average_views = EXCLUDED.average_views,
  peak_views = EXCLUDED.peak_views,
  status = EXCLUDED.status,
  updated_at = now();

WITH stats AS (
  SELECT
    count(*)::int AS videos_analyzed,
    sum(views)::bigint AS total_views,
    round(avg(views))::bigint AS average_views,
    max(views)::bigint AS peak_views
  FROM public.videos
  WHERE creator_id = 'creator_dan_koe'
),
video_json AS (
  SELECT jsonb_agg(
    jsonb_build_object(
      'videoId', source_video_id,
      'title', title,
      'views', views,
      'publishedDate', relative_published_date,
      'mainTopic', topic,
      'titlePattern', title_pattern,
      'whyItWorks', why_it_works,
      'thumbnail', thumbnail_url
    )
    ORDER BY sort_order
  ) AS items
  FROM public.videos
  WHERE creator_id = 'creator_dan_koe'
)
INSERT INTO public.analysis_results (
  id, analysis_run_id, creator_id, schema_version, dashboard_json,
  main_themes, target_audience, writing_style, content_pillars,
  recurring_ideas, updated_at
)
SELECT
  'analysis_result_dan_koe_seed_v1',
  'analysis_run_dan_koe_seed_v1',
  'creator_dan_koe',
  1,
  jsonb_build_object(
    'creatorName', 'Dan Koe',
    'videosAnalyzed', stats.videos_analyzed,
    'totalViews', stats.total_views,
    'averageViews', stats.average_views,
    'engagementRate', stats.peak_views::text,
    'mainNiche', 'One-person business, creator education, and modern self-mastery',
    'topContentThemes', '["One-person business","Writing as leverage","Focus and deep work","Self-education","Digital products","Creator economy"]'::jsonb,
    'titlePatterns', '["Contrarian promise + simple framework","Beginner roadmap from zero","Painful diagnosis + disciplined solution","Future-self identity shift","Specific outcome + repeatable system","Market shift + personal strategy"]'::jsonb,
    'coreBeliefs', '["A creator can build leverage without a traditional company.","Writing is the foundation of clear thinking, distribution, and product creation.","Attention is the scarce resource behind meaningful work.","Self-education beats passive credential chasing for independent creators.","Simple systems compound when repeated in public.","The best products come from solving problems you understand deeply."]'::jsonb,
    'audiencePainPoints', '["Feeling trapped in a conventional career path.","Having ideas but no clear system for publishing them.","Consuming too much information without building valuable skills.","Wanting independence but not knowing what to sell.","Struggling to focus long enough to create meaningful work.","Building content without a clear niche or business model."]'::jsonb,
    'publishingCadence', 'Weekly long-form essays and videos, clustered around recurring strategic themes.',
    'videoAnalysis', video_json.items,
    'strategyReport', 'Dan Koe''s content strategy is built around a clear promise: use writing, self-education, and digital leverage to build a calm one-person business. The content repeatedly moves from an identity-level problem to a practical system, which gives the audience both motivation and next steps. His strongest clusters combine career dissatisfaction, creator monetization, focus, and personal operating systems. For a new visitor, the dashboard should communicate that the channel is not simply about productivity; it is about designing a modern independent life with writing as the central skill.'
  ),
  '["One-person business","Writing as leverage","Focus and deep work","Self-education","Digital products","Creator economy"]'::jsonb,
  'Solo creators, knowledge workers, designers, writers, consultants, and ambitious professionals who want to turn ideas into leverage without building a traditional company.',
  'Direct, philosophical, systems-oriented, and motivational. The copy uses clear contrasts, memorable frameworks, and a calm but urgent tone.',
  '["One-person business","Writing and audience growth","Focus and self-mastery","Self-education and skill stacking","Digital products and offers","Lifestyle systems"]'::jsonb,
  '["Write to clarify thinking and attract aligned opportunities.","Build a one-person business before building a large team.","Use constraints, routines, and focus blocks to protect attention.","Package skills into outcomes, not generic services.","Treat content as a public learning loop.","Design a life around energy and agency instead of status.","Develop rare skill stacks through self-education.","Solve your own problem, then teach the path to others."]'::jsonb,
  now()
FROM stats, video_json
ON CONFLICT (id) DO UPDATE SET
  dashboard_json = EXCLUDED.dashboard_json,
  main_themes = EXCLUDED.main_themes,
  target_audience = EXCLUDED.target_audience,
  writing_style = EXCLUDED.writing_style,
  content_pillars = EXCLUDED.content_pillars,
  recurring_ideas = EXCLUDED.recurring_ideas,
  updated_at = now();

WITH cluster_counts AS (
  SELECT
    c.cluster_id,
    c.name,
    c.description,
    c.themes,
    c.idx,
    count(v.*)::int AS video_count,
    round(avg(v.views))::bigint AS average_views,
    jsonb_agg(v.id ORDER BY v.sort_order) AS all_video_ids
  FROM _dan_koe_clusters c
  JOIN public.videos v ON v.content_pillar = c.pillar
  WHERE v.creator_id = 'creator_dan_koe'
  GROUP BY c.cluster_id, c.name, c.description, c.themes, c.idx
)
INSERT INTO public.content_clusters (
  id, creator_id, seed_profile_id, name, description, themes,
  video_count, average_views, representative_video_ids, sort_order, updated_at
)
SELECT
  cluster_id,
  'creator_dan_koe',
  'dan-koe-demo',
  name,
  description,
  themes,
  video_count,
  average_views,
  (SELECT jsonb_agg(value) FROM jsonb_array_elements(all_video_ids) WITH ORDINALITY AS ids(value, ord) WHERE ord <= 4),
  idx + 1,
  now()
FROM cluster_counts
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  themes = EXCLUDED.themes,
  video_count = EXCLUDED.video_count,
  average_views = EXCLUDED.average_views,
  representative_video_ids = EXCLUDED.representative_video_ids,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

INSERT INTO public.creator_insights (
  id, creator_id, seed_profile_id, insight_type, title, body, sort_order, updated_at
)
VALUES
  ('insight_target_audience', 'creator_dan_koe', 'dan-koe-demo', 'target_audience', 'Target audience', 'Solo creators, knowledge workers, designers, writers, consultants, and ambitious professionals who want to turn ideas into leverage without building a traditional company.', 1, now()),
  ('insight_writing_style', 'creator_dan_koe', 'dan-koe-demo', 'writing_style', 'Writing style', 'Direct, philosophical, systems-oriented, and motivational. The copy uses clear contrasts, memorable frameworks, and a calm but urgent tone.', 2, now()),
  ('insight_content_pillars', 'creator_dan_koe', 'dan-koe-demo', 'content_pillars', 'Content pillars', 'One-person business; Writing and audience growth; Focus and self-mastery; Self-education and skill stacking; Digital products and offers; Lifestyle systems.', 3, now()),
  ('insight_recurring_ideas', 'creator_dan_koe', 'dan-koe-demo', 'recurring_ideas', 'Recurring ideas', 'Write to clarify thinking; build a one-person business before building a large team; protect attention with routines; package skills into outcomes; treat content as a public learning loop.', 4, now()),
  ('insight_demo_goal', 'creator_dan_koe', 'dan-koe-demo', 'demo_goal', 'First visitor experience', 'The seeded profile should make the dashboard feel complete immediately: metrics, charts, clusters, video rows, and a strategic narrative are all available without live API calls.', 5, now())
ON CONFLICT (id) DO UPDATE SET
  insight_type = EXCLUDED.insight_type,
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
