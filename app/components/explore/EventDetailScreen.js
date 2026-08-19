"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEvents } from "@/app/lib/EventsContext";
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

export default function EventDetailScreen({ id }) {
  const router = useRouter();
  const { getEvent, reportEvent, blockHost } = useEvents();
  const event = getEvent(id);
  const [showReport, setShowReport] = useState(false);
  const [reported, setReported] = useState(false);

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Event not found</p>
        <button
          onClick={() => router.push("/explore")}
          className="min-h-11 rounded-full bg-rival-red px-5 text-sm font-bold text-white"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const handleBlock = () => {
    if (!window.confirm(`Block ${event.hostName}? You won't see their events in Explore anymore.`)) return;
    blockHost(event.hostEmail);
    router.push("/explore");
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button onClick={() => router.back()} aria-label="Back" className="flex h-11 w-11 items-center justify-center text-zinc-300 hover:text-white">
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{event.title}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-28">
        <div className="relative h-44 w-full overflow-hidden bg-surface-raised">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- runtime data URLs, not static assets
            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
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
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />
          <span className="inline-block rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
            {event.type}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">{event.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{event.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label="Date" value={event.date} />
            <InfoTile label="Location" value={event.location} />
          </div>
        </div>

        <section className="mt-6 px-4">
          <h3 className="text-base font-bold text-white">Host</h3>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rival-red to-rival-red-dim text-sm font-extrabold text-white">
              {event.hostName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white">{event.hostName}</p>
              <p className="truncate text-xs text-zinc-500">{event.hostEmail}</p>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setShowReport(true)}
              className="min-h-11 flex-1 rounded-full border border-border-subtle bg-black text-xs font-bold text-zinc-300 transition hover:bg-surface-raised"
            >
              Report event
            </button>
            <button
              onClick={handleBlock}
              className="min-h-11 flex-1 rounded-full border border-border-subtle bg-black text-xs font-bold text-zinc-300 transition hover:bg-surface-raised"
            >
              Block this host
            </button>
          </div>

          {reported && <p className="mt-2 text-center text-xs font-semibold text-emerald-400">Report submitted — thanks.</p>}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border-subtle bg-black/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-rival-red text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
        >
          REGISTER
        </a>
      </div>

      {showReport && (
        <ReportModal
          targetLabel={event.title}
          onClose={() => setShowReport(false)}
          onSubmit={(reason, note) => {
            reportEvent(event.id, reason, note);
            setShowReport(false);
            setReported(true);
          }}
        />
      )}
    </div>
  );
}
