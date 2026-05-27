import { AnalyzeForm } from "@/components/analyze-form";
import { SerpApiBadge, DeepSeekBadge } from "@/components/brand-logos";

const FEATURES = [
  {
    logo: "/serpapi-square-logo.png",
    alt: "SerpApi",
    title: "YouTube Data via SerpApi",
    desc: "Search videos, pull metadata, fetch transcripts — all through SerpApi's YouTube APIs.",
  },
  {
    logo: "/serpapi-square-logo.png",
    alt: "SerpApi",
    title: "Video Details via SerpApi",
    desc: "Retrieve per-video descriptions, view counts, and full transcript text at scale.",
  },
  {
    logo: "/deepseek-square-logo.png",
    alt: "DeepSeek",
    title: "Strategy Analysis via DeepSeek",
    desc: "DeepSeek AI extracts content themes, title patterns, beliefs, and a full strategy report.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">
          Creator<span className="text-[#7C3AED]">Lens</span>
        </span>
        <div className="hidden sm:flex items-center gap-2">
          <SerpApiBadge size="sm" />
          <span className="text-[12px] text-gray-300 font-medium">×</span>
          <DeepSeekBadge size="sm" />
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10 space-y-5 max-w-2xl">
          {/* Brand row */}
          <div className="flex items-center justify-center gap-3">
            <SerpApiBadge />
            <span className="text-[13px] text-gray-300 font-medium">×</span>
            <DeepSeekBadge />
          </div>

          <h1 className="text-[42px] font-bold text-gray-900 leading-tight tracking-tight">
            Analyze any YouTube creator&apos;s<br />content strategy
          </h1>
          <p className="text-[17px] font-normal text-gray-500 leading-relaxed">
            SerpApi fetches the videos. DeepSeek reads the patterns.<br />
            You get a full strategy breakdown in seconds.
          </p>
        </div>

        <AnalyzeForm />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full px-4">
          {FEATURES.map(({ logo, alt, title, desc }) => (
            <div key={title} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 space-y-3">
              <img src={logo} alt={alt} className="w-10 h-10 rounded-xl object-cover" />
              <p className="text-[15px] font-semibold text-gray-900">{title}</p>
              <p className="text-[14px] font-normal text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
