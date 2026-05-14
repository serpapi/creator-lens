"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreatorAnalysis } from "@/lib/types";
import { LoadingScreen } from "@/components/loading-screen";
import { Dashboard } from "@/components/dashboard";

export default function DashboardPage() {
  const { creatorName } = useParams<{ creatorName: string }>();
  const decoded = decodeURIComponent(creatorName);

  const [data, setData] = useState<CreatorAnalysis | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analyze-creator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creatorName: decoded, maxVideos: 10 }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Network error. Please try again."));
  }, [decoded]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-sm">{error}</p>
        <a href="/" className="text-sm text-violet-600 underline">← Go back</a>
      </div>
    );
  }

  if (!data) return <LoadingScreen creatorName={decoded} />;

  return <Dashboard data={data} />;
}
