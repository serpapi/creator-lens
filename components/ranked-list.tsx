"use client";

interface RankedListProps {
  items: string[];
}

export function RankedList({ items }: RankedListProps) {
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-xs font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <span className="text-[15px] font-normal text-[#374151] leading-snug">{item}</span>
        </li>
      ))}
    </ol>
  );
}
