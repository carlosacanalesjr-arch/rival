"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";
import { useDeals } from "@/app/lib/DealsContext";
import { submitReport } from "@/app/lib/ReportsContext";
import ReportModal from "@/app/components/explore/ReportModal";

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-surface p-3">
      <p className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

export default function DealDetailScreen({ id }) {
  const router = useRouter();
  const { user } = useAuth();
  const { getDeal, reportDeal, hideDeal } = useDeals();
  const deal = getDeal(id);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!deal) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Deal not found</p>
        <button
          onClick={() => router.push("/explore")}
          className="min-h-11 rounded-full bg-rival-red px-5 text-sm font-bold text-white"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const handleNotInterested = () => {
    hideDeal(deal.id, user?.email);
    router.push("/explore");
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(deal.promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable — the code is still visible on-screen to copy manually.
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button onClick={() => router.back()} aria-label="Back" className="flex h-11 w-11 items-center justify-center text-zinc-300 hover:text-white">
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{deal.title}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-28">
        <div className="relative h-44 w-full overflow-hidden bg-surface-raised">
          {deal.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- runtime data URLs, not static assets
            <img src={deal.imageUrl} alt={deal.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="relative border-b border-border-subtle bg-surface px-4 pb-5 pt-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300" aria-hidden />
          <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
            {deal.discount}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">{deal.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{deal.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label="Category" value={deal.category} />
            <InfoTile label="Expires" value={deal.expiry} />
          </div>

          {deal.promoCode && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wide text-zinc-500">Promo Code</p>
              <div className="mt-1.5 flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex min-h-11 flex-1 items-center justify-between rounded-xl border border-dashed border-emerald-500/50 bg-emerald-500/10 px-3 text-sm font-bold text-emerald-400"
                >
                  <span className="tracking-wider">{deal.promoCode}</span>
                  <span className="text-xs font-semibold">{copied ? "Copied!" : "Tap to copy"}</span>
                </button>
                {deal.redeemUrl && (
                  <a
                    href={deal.redeemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 shrink-0 items-center rounded-xl bg-rival-red px-4 text-sm font-extrabold text-white hover:bg-red-600"
                  >
                    Redeem
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <section className="mt-6 px-4">
          <h3 className="text-base font-bold text-white">Business</h3>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-sm font-extrabold text-white">
              {deal.businessName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{deal.businessName}</p>
              <p className="truncate text-xs text-zinc-500">{deal.location}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setShowReport(true)}
              className="min-h-11 flex-1 rounded-full border border-border-subtle bg-black text-xs font-bold text-zinc-300 transition hover:bg-surface-raised"
            >
              Report deal
            </button>
            <button
              onClick={handleNotInterested}
              className="min-h-11 flex-1 rounded-full border border-border-subtle bg-black text-xs font-bold text-zinc-300 transition hover:bg-surface-raised"
            >
              Not interested
            </button>
          </div>

          {reported && <p className="mt-2 text-center text-xs font-semibold text-emerald-400">Report submitted — thanks.</p>}
        </section>
      </main>

      {showReport && (
        <ReportModal
          targetLabel={deal.title}
          onClose={() => setShowReport(false)}
          onSubmit={(reason, note) => {
            reportDeal(deal.id, reason, note);
            submitReport({
              kind: "deal",
              itemId: deal.id,
              itemLabel: deal.title,
              reason,
              details: note || null,
              reporterEmail: user?.email || null,
            });
            setShowReport(false);
            setReported(true);
          }}
        />
      )}
    </div>
  );
}
