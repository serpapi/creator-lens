"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CreatorAnalysis } from "@/lib/types";
import { LoadingScreen } from "@/components/loading-screen";
import { Dashboard } from "@/components/dashboard";

function normalizeCreator(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function DashboardPage() {
  const { creatorName } = useParams<{ creatorName: string }>();
  const searchParams = useSearchParams();
  const decoded = decodeURIComponent(creatorName);
  const maxVideos = Number(searchParams.get("maxVideos") ?? "10");

  const [data, setData] = useState<CreatorAnalysis | null>(null);
  const [error, setError] = useState("");
  const [needsKeys, setNeedsKeys] = useState(false);
  const [serpapiApiKey, setSerpapiApiKey] = useState("");
  const [deepseekApiKey, setDeepseekApiKey] = useState("");
  const [isSubmittingKeys, setIsSubmittingKeys] = useState(false);

  const requestAnalysis = useCallback(async (apiKeys?: { serpapiApiKey: string; deepseekApiKey: string }) => {
    const res = await fetch("/api/analyze-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorName: decoded, maxVideos, apiKeys }),
    });

    return {
      ok: res.ok,
      status: res.status,
      json: await res.json(),
    };
  }, [decoded, maxVideos]);

  const analyze = useCallback((apiKeys?: { serpapiApiKey: string; deepseekApiKey: string }) => {
    setError("");
    setNeedsKeys(false);
    setIsSubmittingKeys(!!apiKeys);

    requestAnalysis(apiKeys)
      .then(({ ok, status, json }) => {
        if (status === 401 && json.code === "api_keys_required") {
          setNeedsKeys(true);
          return;
        }

        if (!ok || json.error) setError(json.error ?? "Analysis failed. Please try again.");
        else setData(json);
      })
      .catch(() => setError("Network error. Please try again."))
      .finally(() => setIsSubmittingKeys(false));
  }, [requestAnalysis]);

  useEffect(() => {
    let cancelled = false;

    requestAnalysis()
      .then(({ ok, status, json }) => {
        if (cancelled) return;

        if (status === 401 && json.code === "api_keys_required") {
          setNeedsKeys(true);
          return;
        }

        if (!ok || json.error) setError(json.error ?? "Analysis failed. Please try again.");
        else {
          setNeedsKeys(false);
          setError("");
          setData(json);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Network error. Please try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [requestAnalysis]);

  function submitKeys(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!serpapiApiKey.trim() || !deepseekApiKey.trim()) return;
    analyze({
      serpapiApiKey: serpapiApiKey.trim(),
      deepseekApiKey: deepseekApiKey.trim(),
    });
  }

  if (needsKeys) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <span className="text-[13px] font-medium bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] px-3 py-1 rounded-full">
              Bring your own API key
            </span>
            <h1 className="mt-4 text-[24px] font-bold text-[#111827]">Live analysis for {decoded}</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">
              Dan Koe uses the preloaded Neon demo. Other creators require your own SerpApi and DeepSeek keys for this request.
            </p>
          </div>

          <form onSubmit={submitKeys} className="space-y-3">
            <label className="block">
              <span className="block text-[13px] font-medium text-[#374151] mb-1">SERPAPI_API_KEY</span>
              <input
                type="password"
                value={serpapiApiKey}
                onChange={(e) => setSerpapiApiKey(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#F3E8FF]"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="block text-[13px] font-medium text-[#374151] mb-1">DEEPSEEK_API_KEY</span>
              <input
                type="password"
                value={deepseekApiKey}
                onChange={(e) => setDeepseekApiKey(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[14px] outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#F3E8FF]"
                autoComplete="off"
              />
            </label>

            <button
              type="submit"
              disabled={!serpapiApiKey.trim() || !deepseekApiKey.trim() || isSubmittingKeys}
              className="w-full rounded-lg bg-[#7C3AED] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#6D28D9] disabled:opacity-40"
            >
              {isSubmittingKeys ? "Running analysis..." : "Run live analysis"}
            </button>
          </form>

          <Link href="/" className="block text-center text-sm text-violet-600 underline">← Go back</Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <Link href="/" className="text-sm text-violet-600 underline">← Go back</Link>
      </div>
    );
  }

  const isCurrentData = data ? normalizeCreator(data.creatorName) === normalizeCreator(decoded) : false;

  if (!data || !isCurrentData) return <LoadingScreen creatorName={decoded} />;

  return <Dashboard data={data} />;
}
