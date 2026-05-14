"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  helper?: string;
}

export function StatsCard({ label, value, helper }: StatsCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
      <p className="text-[13px] font-medium text-[#6B7280] uppercase tracking-wider mb-2">{label}</p>
      <p className="text-[32px] font-bold text-[#111827] leading-none">{value}</p>
      {helper && <p className="text-[13px] text-[#9CA3AF] mt-2 font-normal">{helper}</p>}
    </div>
  );
}
