const SERPAPI_LOGO = "/serpapi-logo.png";
const DEEPSEEK_LOGO = "/deepseek-logo.png";

// ── Inline badges ──────────────────────────────────────────────────────────

export function SerpApiBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-4" : "h-5";
  const pad = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  return (
    <span className={`inline-flex items-center bg-white border border-[#DDD6FE] rounded-lg ${pad}`}>
      <img src={SERPAPI_LOGO} alt="SerpApi" className={`${h} w-auto`} />
    </span>
  );
}

export function DeepSeekBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-4" : "h-5";
  const pad = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  return (
    <span className={`inline-flex items-center bg-white border border-[#BFDBFE] rounded-lg ${pad}`}>
      <img src={DEEPSEEK_LOGO} alt="DeepSeek" className={`${h} w-auto`} />
    </span>
  );
}

// ── Standalone logo images (for feature cards, etc.) ───────────────────────

export function SerpApiLogoImg({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <img src={SERPAPI_LOGO} alt="SerpApi" className={className} />
  );
}

export function DeepSeekLogoImg({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <img src={DEEPSEEK_LOGO} alt="DeepSeek" className={className} />
  );
}
