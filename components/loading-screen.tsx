"use client";

import { useEffect, useState } from "react";
import { SerpApiBadge, DeepSeekBadge } from "./brand-logos";

const STEPS = [
  { label: "Searching YouTube videos",  Badge: SerpApiBadge },
  { label: "Fetching video details",     Badge: SerpApiBadge },
  { label: "Fetching transcripts",       Badge: SerpApiBadge },
  { label: "Generating AI analysis",     Badge: DeepSeekBadge },
];

const STEP_DELAYS = [0, 3000, 7000, 12000];

interface LoadingScreenProps {
  creatorName: string;
}

export function LoadingScreen({ creatorName }: LoadingScreenProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = STEP_DELAYS.slice(1).map((delay, i) =>
      setTimeout(() => setActiveStep(i + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <SerpApiBadge size="sm" />
            <span className="text-[12px] text-gray-300 font-medium">×</span>
            <DeepSeekBadge size="sm" />
          </div>
          <h2 className="text-[26px] font-bold text-gray-900">
            Analyzing {creatorName}...
          </h2>
          <p className="text-[15px] font-normal text-gray-400">This may take up to 30 seconds</p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map(({ label, Badge }, i) => {
            const done = i < activeStep;
            const active = i === activeStep;

            return (
              <div key={label} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                    {done ? (
                      <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : active ? (
                      <div className="w-6 h-6 rounded-full border-2 border-[#7C3AED] border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                    )}
                  </div>
                  <span className={`text-[15px] truncate ${done ? "text-gray-400 line-through font-normal" : active ? "text-gray-900 font-semibold" : "text-gray-400 font-normal"}`}>
                    {label}
                  </span>
                </div>
                <div className={`flex-shrink-0 transition-opacity ${active || done ? "opacity-100" : "opacity-30"}`}>
                  <Badge size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
