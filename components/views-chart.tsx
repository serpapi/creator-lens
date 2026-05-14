"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { VideoAnalysis } from "@/lib/types";

function formatK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

interface ViewsChartProps {
  videos: VideoAnalysis[];
}

export function ViewsChart({ videos }: ViewsChartProps) {
  const data = videos
    .slice()
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)
    .map((v) => ({
      name: v.title.length > 22 ? v.title.slice(0, 22) + "…" : v.title,
      views: v.views,
    }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={48}
        />
        <YAxis
          tickFormatter={formatK}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(v) => [formatK(Number(v)), "Views"]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
          cursor={{ fill: "#f5f3ff" }}
        />
        <Bar dataKey="views" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#7c3aed" : "#ddd6fe"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
