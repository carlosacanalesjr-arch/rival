"use client";

import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import { leaderboard } from "@/app/lib/mockData";

// Same row markup as the home feed's Leaderboard widget, just full-page instead of a
// 5-row preview card. Backed by the same mock leaderboard array, so it's currently the
// same 5 entries — there's no larger dataset behind it yet, this just gives the widget's
// "Full board" link and the bottom-nav "Board" tab somewhere real to go.
const trendIcon = {
  up: <span className="text-emerald-400">▲</span>,
  down: <span className="text-rival-red">▼</span>,
  same: <span className="text-zinc-600">–</span>,
};

export default function BoardScreen() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-6">
        <div className="px-4 pt-5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Leaderboard</h1>
            <span className="flex items-center gap-1 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
              <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-rival-red" />
              LIVE
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">See where you stand against everyone on Kairos.</p>
        </div>

        <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-border-subtle bg-surface">
          <ul className="divide-y divide-border-subtle">
            {leaderboard.map((entry) => (
              <li
                key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 ${entry.isSelf ? "bg-rival-red/5" : ""}`}
              >
                <span
                  className={`w-6 shrink-0 text-sm font-extrabold ${
                    entry.rank === 1
                      ? "text-yellow-400"
                      : entry.rank === 2
                      ? "text-zinc-300"
                      : entry.rank === 3
                      ? "text-orange-400"
                      : "text-zinc-500"
                  }`}
                >
                  {entry.rank}
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-bold text-white">
                  {entry.initials}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                  {entry.name}
                  {entry.isSelf && (
                    <span className="ml-1.5 text-[10px] font-bold text-rival-red">YOU</span>
                  )}
                </span>
                <span className="text-xs">{trendIcon[entry.trend]}</span>
                <span className="w-16 shrink-0 text-right text-sm font-bold text-white">
                  {entry.score.toLocaleString()}
                  <span className="ml-1 text-[10px] font-normal text-zinc-500">{entry.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <div className="mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </div>
  );
}
