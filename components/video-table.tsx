"use client";

import Image from "next/image";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { VideoAnalysis } from "@/lib/types";

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

const COLUMNS: { label: string; width: string }[] = [
  { label: "Thumbnail",     width: "w-[100px] min-w-[100px]" },
  { label: "Title",         width: "w-[320px] min-w-[320px]" },
  { label: "Published",     width: "w-[140px] min-w-[140px]" },
  { label: "Views",         width: "w-[120px] min-w-[120px]" },
  { label: "Theme",         width: "w-[240px] min-w-[240px]" },
  { label: "Title Pattern", width: "w-[320px] min-w-[320px]" },
  { label: "Why It Works",  width: "w-[400px] min-w-[400px]" },
];

interface VideoTableProps {
  videos: VideoAnalysis[];
}

export function VideoTable({ videos }: VideoTableProps) {
  return (
    <div
      className="w-full overflow-x-auto"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#DDD6FE #F9FAFB",
      }}
    >
      <Table className="min-w-[1640px] border-collapse">
        <TableHeader>
          <TableRow className="border-b border-[#F3F4F6]">
            {COLUMNS.map(({ label, width }) => (
              <TableHead
                key={label}
                className={`${width} px-4 py-3 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F9FAFB] whitespace-nowrap`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {videos.map((v) => (
            <TableRow
              key={v.videoId}
              className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] align-middle"
            >
              {/* Thumbnail */}
              <TableCell className="px-4 py-3">
                {v.thumbnail ? (
                  <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={v.thumbnail} alt={v.title} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-16 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
                )}
              </TableCell>

              {/* Title */}
              <TableCell className="px-4 py-3">
                <span className="block text-[14px] font-semibold text-[#111827] leading-snug line-clamp-2">
                  {v.title}
                </span>
              </TableCell>

              {/* Published */}
              <TableCell className="px-4 py-3 whitespace-nowrap text-[13px] font-normal text-[#6B7280]">
                {v.publishedDate}
              </TableCell>

              {/* Views */}
              <TableCell className="px-4 py-3 whitespace-nowrap text-[14px] font-semibold text-[#111827]">
                {fmt(v.views)}
              </TableCell>

              {/* Theme */}
              <TableCell className="px-4 py-3">
                <span className="inline-block max-w-full text-[12px] font-medium bg-[#F3E8FF] text-[#7C3AED] border border-[#DDD6FE] rounded-full px-2.5 py-0.5 truncate">
                  {v.mainTopic}
                </span>
              </TableCell>

              {/* Title Pattern */}
              <TableCell className="px-4 py-3">
                <span className="block text-[13px] font-normal text-[#4B5563] whitespace-normal break-words leading-relaxed">
                  {v.titlePattern}
                </span>
              </TableCell>

              {/* Why It Works */}
              <TableCell className="px-4 py-3">
                <span className="block text-[13px] font-normal text-[#6B7280] whitespace-normal break-words leading-relaxed">
                  {v.whyItWorks}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
