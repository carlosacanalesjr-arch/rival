"use client";

import { useState } from "react";
import ReportModal from "@/app/components/explore/ReportModal";

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KebabIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

// Full-width version, same fields the request asked for: name, type badge, date, location,
// host, thumbnail, plus the report kebab menu every UGC card needs (Apple guideline 1.2).
export default function EventCard({ event, onOpen, onReport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(event.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(event.id);
        }
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface"
    >
      <div className="flex gap-3 p-3 pr-11">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-surface-raised text-zinc-600">
          {event.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- runtime data URLs, not static assets
            <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
          ) : (
            <ImagePlaceholderIcon />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-white">{event.title}</p>
            <span className="shrink-0 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
              {event.type}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-400">
            <CalendarIcon /> {event.date}
          </p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
            <PinIcon /> {event.location}
          </p>
          <p className="mt-1 truncate text-[11px] text-zinc-500">Hosted by {event.hostName}</p>
        </div>
      </div>

      <div
        className="absolute right-1 top-1"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center text-zinc-500 hover:text-zinc-300"
        >
          <KebabIcon />
        </button>
        {menuOpen && (
          <div role="menu" className="absolute right-1 top-11 z-10 w-36 overflow-hidden rounded-xl border border-border-subtle bg-surface-raised shadow-lg">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                setShowReport(true);
              }}
              className="flex min-h-11 w-full items-center px-3 text-left text-sm font-semibold text-zinc-200 hover:bg-black/40"
            >
              Report
            </button>
          </div>
        )}
      </div>

      {showReport && (
        <ReportModal
          targetLabel={event.title}
          onClose={() => setShowReport(false)}
          onSubmit={(reason, note) => {
            onReport(event.id, reason, note);
            setShowReport(false);
          }}
        />
      )}
    </div>
  );
}
