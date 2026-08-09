import { sponsoredAd } from "@/app/lib/mockData";

export default function SponsoredBanner() {
  return (
    <section className="mx-4 mt-4 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Sponsored
        </span>
        <button aria-label="Dismiss ad" className="text-muted hover:text-zinc-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rival-red to-rival-red-dim text-sm font-extrabold text-white">
          {sponsoredAd.badge}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {sponsoredAd.brand}
          </p>
          <p className="truncate text-xs text-zinc-400">{sponsoredAd.tagline}</p>
        </div>
        <button className="shrink-0 rounded-full bg-rival-red px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600">
          {sponsoredAd.cta}
        </button>
      </div>
    </section>
  );
}
