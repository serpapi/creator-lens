"use client";

import { LayoutDashboard, PlayCircle, Tag, AlignLeft, Lightbulb, BarChart2, Settings } from "lucide-react";
import { SerpApiBadge, DeepSeekBadge } from "./brand-logos";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: PlayCircle, label: "Videos" },
  { icon: Tag, label: "Themes" },
  { icon: AlignLeft, label: "Title Patterns" },
  { icon: Lightbulb, label: "Core Beliefs" },
  { icon: BarChart2, label: "Reports" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-[#E5E7EB] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-[#E5E7EB]">
        <span className="text-lg font-bold text-gray-900">
          Creator<span className="text-[#7C3AED]">Lens</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
              active
                ? "bg-[#F3E8FF] text-[#7C3AED] font-semibold"
                : "text-[#6B7280] font-normal hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-[#7C3AED]" : "text-[#9CA3AF]"}`} />
            {label}
          </button>
        ))}
      </nav>

      {/* Powered by footer */}
      <div className="px-4 py-4 border-t border-[#E5E7EB] space-y-2">
        <p className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-wider">Powered by</p>
        <div className="flex flex-col gap-2">
          <SerpApiBadge size="sm" />
          <DeepSeekBadge size="sm" />
        </div>
      </div>
    </aside>
  );
}
