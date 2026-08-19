"use client";

import { useRouter } from "next/navigation";
import { useChallenges } from "@/app/lib/ChallengesContext";

export default function ChallengeCards() {
  const router = useRouter();
  const { challenges, toggleJoin } = useChallenges();

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-base font-bold text-white">Active Challenges</h2>
        <button onClick={() => router.push("/challenges")} className="text-xs font-semibold text-rival-red">
          See all
        </button>
      </div>
      <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
        {challenges.map((c) => (
          <div
            key={c.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/challenges/${c.id}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                router.push(`/challenges/${c.id}`);
              }
            }}
            className="relative w-52 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-surface p-4"
          >
            <div
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500"
              aria-hidden
            />
            <p className="text-sm font-bold text-white">{c.title}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{c.sub}</p>

            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">
                {c.progress}% complete
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                {c.participants.toLocaleString()} joined
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleJoin(c.id);
                }}
                className={`flex min-h-11 items-center rounded-full px-4 text-xs font-bold transition ${
                  c.joined
                    ? "border border-rival-red text-rival-red hover:bg-rival-red/10"
                    : "bg-rival-red text-white hover:bg-red-600"
                }`}
              >
                {c.joined ? "Joined" : "Join"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
