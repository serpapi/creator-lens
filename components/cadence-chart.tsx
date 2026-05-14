"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { VideoAnalysis } from "@/lib/types";

function bucketDate(dateStr: string): string {
  const s = dateStr.toLowerCase();
  if (/day/.test(s)) return "This week";
  if (/week/.test(s)) return "This month";
  const m = s.match(/(\d+)\s*month/);
  if (m) {
    const n = parseInt(m[1]);
    if (n <= 3) return "1–3 mo";
    if (n <= 6) return "3–6 mo";
    return "6–12 mo";
  }
  if (/year/.test(s)) return "1+ year";
  return "Older";
}

const ORDER = ["This week", "This month", "1–3 mo", "3–6 mo", "6–12 mo", "1+ year", "Older"];

interface CadenceChartProps {
  videos: VideoAnalysis[];
}

export function CadenceChart({ videos }: CadenceChartProps) {
  const counts: Record<string, number> = {};
  for (const v of videos) {
    const bucket = bucketDate(v.publishedDate);
    counts[bucket] = (counts[bucket] ?? 0) + 1;
  }

  const data = ORDER.filter((b) => counts[b]).map((b) => ({ name: b, count: counts[b] }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "#F3E8FF" }}
          formatter={(v) => [v, "Videos"]}
          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#7C3AED" : "#C4B5FD"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
