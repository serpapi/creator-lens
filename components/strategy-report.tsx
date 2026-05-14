"use client";

interface StrategyReportProps {
  report: string;
}

export function StrategyReport({ report }: StrategyReportProps) {
  const paragraphs = report.split(/\n+/).filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-[15px] font-normal text-[#4B5563] leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
}
