"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLE_CREATORS = ["Dan Koe", "Ali Abdaal", "MrBeast"];
const VIDEO_COUNT_OPTIONS = [10, 25, 50, 100];

export function AnalyzeForm() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [maxVideos, setMaxVideos] = useState(10);

  function navigate(name: string) {
    if (!name.trim()) return;
    router.push(`/dashboard/${encodeURIComponent(name.trim())}?maxVideos=${maxVideos}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate(input)}
          placeholder="Enter a YouTube creator name..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-[15px] font-normal outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#F3E8FF] transition"
        />
        <button
          onClick={() => navigate(input)}
          disabled={!input.trim()}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white text-[15px] font-semibold px-5 py-3 rounded-xl transition"
        >
          Analyze Creator
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-gray-500 font-medium">Videos to analyze:</span>
        <div className="flex gap-1.5">
          {VIDEO_COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              onClick={() => setMaxVideos(count)}
              className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg border transition ${
                maxVideos === count
                  ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                  : "text-[#7C3AED] bg-[#F3E8FF] border-[#DDD6FE] hover:bg-[#EDE9FE]"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {EXAMPLE_CREATORS.map((name) => (
          <button
            key={name}
            onClick={() => navigate(name)}
            className="text-[13px] font-medium text-[#7C3AED] bg-[#F3E8FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] rounded-full px-3.5 py-1.5 transition"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
