"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface PatternsChartProps {
  patterns: string[];
}

export function PatternsChart({ patterns }: PatternsChartProps) {
  const data = patterns.map((name, i) => ({
    name: name.length > 24 ? name.slice(0, 24) + "…" : name,
    value: patterns.length - i,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart layout="vertical" data={data} margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={130}
          tick={{ fontSize: 11, fill: "#6B7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#F3E8FF" }}
          formatter={(v) => [v, "Frequency"]}
          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#7C3AED" : i === 1 ? "#8B5CF6" : "#C4B5FD"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
