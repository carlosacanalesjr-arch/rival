"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/app/components/TopBar";
import BottomNav from "@/app/components/BottomNav";
import { useChallenges } from "@/app/lib/ChallengesContext";

// Full-width version of the card ChallengeCards.js shows in a horizontal scroller on the
// home feed — same fields, same Join toggle, just laid out for a vertical list here.
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
          <p className="mt-0.5 text-xs text-zinc-400">{challenge.sub}</p>
        </div>
        <span className="shrink-0 rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
          {challenge.sport}
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

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-black">
      <TopBar />

      <main className="mx-auto w-full max-w-md flex-1 pb-6">
        <div className="px-4 pt-5">
          <h1 className="text-xl font-extrabold text-white">Challenges</h1>
          <p className="mt-1 text-sm text-zinc-400">Join a challenge and climb the leaderboard.</p>
        </div>

        <div className="mt-4 space-y-3 p-4">
          {challenges.map((challenge) => (
            <ChallengeRow
              key={challenge.id}
              challenge={challenge}
              onOpen={(id) => router.push(`/challenges/${id}`)}
              onToggleJoin={toggleJoin}
            />
          ))}
        </div>
      </main>

      <div className="mx-auto w-full max-w-md">
        <BottomNav />
      </div>
    </div>
  );
}
