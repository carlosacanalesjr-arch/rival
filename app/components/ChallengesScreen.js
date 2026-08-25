"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import { useChallenges } from "@/app/lib/ChallengesContext";
import { CHALLENGE_CATEGORIES } from "@/app/lib/mockData";
import { formatCompactDistance } from "@/app/lib/formatDistance";

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Full-width version of the card ChallengeCards.js shows in a horizontal scroller on the
// home feed — same fields, same Join toggle, just laid out for a vertical list here, now
// nested inside a category's expanded accordion panel instead of one long flat list.
function ChallengeRow({ challenge, onOpen, onToggleJoin }) {
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onOpen(challenge.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(challenge.id);
        }
      }}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface p-4"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{challenge.title}</p>
          <p className="mt-0.5 text-xs text-zinc-400">{challenge.goal}</p>
        </div>
        <span className="shrink-0 rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
          {challenge.duration}
        </span>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
            style={{ width: `${challenge.progress}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">{challenge.progress}% complete</p>
        {challenge.components && (
          <p className="mt-1 truncate text-[11px] text-zinc-500">
            {challenge.components
              .map((c) =>
                c.goal != null
                  ? `${c.label} ${formatCompactDistance(c.current)}/${formatCompactDistance(c.goal)}`
                  : `${c.label} ${formatCompactDistance(c.current)}`
              )
              .join(" · ")}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-zinc-500">{challenge.participants.toLocaleString()} joined</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleJoin(challenge.id);
          }}
          className={`flex min-h-11 items-center rounded-full px-4 text-xs font-bold transition ${
            challenge.joined
              ? "border border-rival-red text-rival-red hover:bg-rival-red/10"
              : "bg-rival-red text-white hover:bg-red-600"
          }`}
        >
          {challenge.joined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
}

export default function ChallengesScreen() {
  const router = useRouter();
  const { challenges, toggleJoin } = useChallenges();
  const [expanded, setExpanded] = useState(() => new Set());

  const toggleCategory = (category) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const groups = CHALLENGE_CATEGORIES.map((category) => ({
    category,
    items: challenges.filter((c) => c.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-24">
        <div className="px-4 pt-5">
          <h1 className="text-xl font-extrabold text-white">Challenges</h1>
          <p className="mt-1 text-sm text-zinc-400">Join a challenge and climb the leaderboard.</p>
        </div>

        <div className="mt-4 space-y-3 p-4">
          {groups.map(({ category, items }) => {
            const isOpen = expanded.has(category);
            return (
              <div key={category} className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
                <button
                  onClick={() => toggleCategory(category)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-bold text-white">{category}</span>
                  <span className="flex items-center gap-2 text-zinc-400">
                    <span className="text-xs text-zinc-500">{items.length}</span>
                    <ChevronIcon open={isOpen} />
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-border-subtle p-3">
                    {items.map((challenge) => (
                      <ChallengeRow
                        key={challenge.id}
                        challenge={challenge}
                        onOpen={(id) => router.push(`/challenges/${id}`)}
                        onToggleJoin={toggleJoin}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
