"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { CreatorAnalysis } from "@/lib/types";
import { LoadingScreen } from "@/components/loading-screen";
import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  const { creatorName } = useParams<{ creatorName: string }>();
  const searchParams = useSearchParams();
  const decoded = decodeURIComponent(creatorName);
  const maxVideos = Number(searchParams.get("maxVideos") ?? "10");

  const [data, setData] = useState<CreatorAnalysis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analyze-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorName: decoded, maxVideos }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Network error. Please try again."));
  }, [decoded, maxVideos]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <Link href="/" className="text-sm text-violet-600 underline">← Go back</Link>
      </div>
    );
  }

  if (!data) return <LoadingScreen creatorName={decoded} />;

  return <Dashboard data={data} />;
}
