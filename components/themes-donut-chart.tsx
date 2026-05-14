"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"];

interface ThemesDonutChartProps {
  themes: string[];
}

export function ThemesDonutChart({ themes }: ThemesDonutChartProps) {
  const data = themes.map((name, i) => ({ name, value: themes.length - i }));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Chart — own container, nothing else competes for height */}
      <div className="w-full" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={82}
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(_, name) => [name, ""]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend — 2-column grid, no Recharts involvement */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span
              className="text-[12px] text-[#6B7280] truncate"
              title={item.name}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
