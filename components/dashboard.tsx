"use client";

import { CreatorAnalysis } from "@/lib/types";
import { Sidebar } from "./sidebar";
import { StatsCard } from "./stats-card";
import { VideoTable } from "./video-table";
import { StrategyReport } from "./strategy-report";
import { ThemesDonutChart } from "./themes-donut-chart";
import { PatternsChart } from "./patterns-chart";
import { CadenceChart } from "./cadence-chart";
import { RankedList } from "./ranked-list";
import { Download, ExternalLink } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-5 ${className}`}>
      <h3 className="text-[15px] font-semibold text-[#111827] mb-4">{title}</h3>
      {children}
    </div>
  );
}

interface DashboardProps {
  data: CreatorAnalysis;
}

export function Dashboard({ data }: DashboardProps) {
  const youtubeSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.creatorName)}`;

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-6">

          {/* Step badge */}
          <div>
            <span className="text-[13px] font-medium bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] px-3 py-1 rounded-full">
              Creator Dashboard
            </span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[28px] font-bold text-[#111827] leading-tight">{data.creatorName}</h1>
                <a href={youtubeSearch} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 text-[#9CA3AF] hover:text-[#7C3AED] transition-colors" />
                </a>
              </div>
              <p className="text-[15px] font-normal text-[#6B7280] mt-1">
                Niche: <span className="text-[#7C3AED] font-medium">{data.mainNiche}</span>
                <span className="mx-2 text-[#D1D5DB]">·</span>
                {data.publishingCadence}
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[14px] font-medium px-4 py-2.5 rounded-lg transition-colors flex-shrink-0">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard label="Videos Analyzed" value={data.videosAnalyzed} helper="from YouTube search" />
            <StatsCard label="Total Views" value={fmt(data.totalViews)} helper="across all videos" />
            <StatsCard label="Average Views" value={fmt(data.averageViews)} helper="per video" />
            <StatsCard label="Peak Views" value={fmt(Number(data.engagementRate) || 0)} helper="single video best" />
          </div>

          {/* Analysis grid — row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card title="Top Content Themes">
              {data.topContentThemes.length > 0 ? (
                <ThemesDonutChart themes={data.topContentThemes} />
              ) : (
                <p className="text-[15px] text-[#9CA3AF]">No data</p>
              )}
            </Card>
            <Card title="Title Patterns">
              {data.titlePatterns.length > 0 ? (
                <PatternsChart patterns={data.titlePatterns} />
              ) : (
                <p className="text-[15px] text-[#9CA3AF]">No data</p>
              )}
            </Card>
            <Card title="Publishing Cadence">
              {data.videoAnalysis.length > 0 ? (
                <CadenceChart videos={data.videoAnalysis} />
              ) : (
                <p className="text-[15px] text-[#9CA3AF]">No data</p>
              )}
            </Card>
          </div>

          {/* Analysis grid — row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card title="Core Beliefs">
              <RankedList items={data.coreBeliefs} />
            </Card>
            <Card title="Audience Pain Points">
              <RankedList items={data.audiencePainPoints} />
            </Card>
            <Card title="Quick Insights">
              <RankedList
                items={[
                  `Top niche: ${data.mainNiche}`,
                  `Posting: ${data.publishingCadence}`,
                  `Top theme: ${data.topContentThemes[0] ?? "—"}`,
                  `Best pattern: ${data.titlePatterns[0] ?? "—"}`,
                  `${data.videosAnalyzed} videos · ${fmt(data.averageViews)} avg views`,
                ]}
              />
            </Card>
          </div>

          {/* Video table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F3F4F6]">
              <h3 className="text-[15px] font-semibold text-[#111827]">Video Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <VideoTable videos={data.videoAnalysis} />
            </div>
          </div>

          {/* Strategy report */}
          <Card title="Strategy Report">
            <StrategyReport report={data.strategyReport} />
          </Card>

        </div>
      </div>
    </div>
  );
}
