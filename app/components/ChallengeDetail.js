"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useChallenges } from "@/app/lib/ChallengesContext";

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

function SubmitResultModal({ challenge, onClose, onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (Number.isNaN(num)) return;
    onSubmit(num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl border border-border-subtle bg-surface p-5 sm:rounded-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Submit Result</h3>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">{challenge.title}</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="text-xs font-medium text-zinc-400" htmlFor="result-value">
            Your result ({challenge.unit})
          </label>
          <input
            id="result-value"
            autoFocus
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`e.g. 12.4`}
            className="mt-1.5 w-full rounded-xl border border-border-subtle bg-black px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-rival-red focus:outline-none"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="mt-4 w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white disabled:opacity-40"
          >
            SUBMIT
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ChallengeDetail({ id }) {
  const router = useRouter();
  const { challenges, toggleJoin, submitResult } = useChallenges();
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const challenge = challenges.find((c) => c.id === id);

  if (!challenge) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-black px-6 text-center">
        <p className="text-lg font-bold text-white">Challenge not found</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-full bg-rival-red px-5 py-2.5 text-sm font-bold text-white"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleSubmitResult = (value) => {
    submitResult(challenge.id, value);
    setShowModal(false);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border-subtle bg-black/90 px-4 py-3 backdrop-blur">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="text-zinc-300 hover:text-white"
        >
          <BackIcon />
        </button>
        <h1 className="truncate text-base font-bold text-white">{challenge.title}</h1>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 pb-28">
        <div className="relative overflow-hidden border-b border-border-subtle bg-surface px-4 pb-5 pt-5">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rival-red to-orange-500" aria-hidden />
          <span className="inline-block rounded-full bg-rival-red/15 px-2.5 py-1 text-[11px] font-bold text-rival-red">
            {challenge.sport}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-white">{challenge.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{challenge.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoTile label="Start Date" value={challenge.startDate} />
            <InfoTile label="End Date" value={challenge.endDate} />
            <InfoTile label="Prize" value={challenge.prize} />
            <InfoTile label="Participants" value={challenge.participants.toLocaleString()} />
          </div>

          {challenge.joined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Your progress</span>
                <span className="font-semibold text-white">{challenge.progress}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rival-red to-orange-500"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <section className="mt-5">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Leaderboard</h3>
              <span className="flex items-center gap-1 rounded-full bg-rival-red/15 px-2 py-0.5 text-[10px] font-bold text-rival-red">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-rival-red" />
                LIVE
              </span>
            </div>
          </div>

          <ul className="mx-4 mt-3 divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border-subtle bg-surface">
            {challenge.leaderboard.map((entry) => (
              <li
                key={entry.id}
                className={`flex items-center gap-3 px-4 py-3 ${entry.isSelf ? "bg-rival-red/5" : ""}`}
              >
                <span
                  className={`w-5 shrink-0 text-sm font-extrabold ${
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
                <span className="shrink-0 text-right text-sm font-bold text-white">
                  {entry.score.toLocaleString()}
                  <span className="ml-1 text-[10px] font-normal text-zinc-500">{challenge.unit}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {confirmed && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-rival-red px-4 py-2 text-xs font-bold text-white shadow-lg">
          Result submitted ✓
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md border-t border-border-subtle bg-black/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        {challenge.joined ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-rival-red px-3 py-3 text-xs font-bold text-rival-red">
              ✓ Joined
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
            >
              SUBMIT RESULT
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleJoin(challenge.id)}
            className="w-full rounded-full bg-rival-red py-3 text-sm font-extrabold tracking-wide text-white hover:bg-red-600"
          >
            JOIN CHALLENGE
          </button>
        )}
      </div>

      {showModal && (
        <SubmitResultModal
          challenge={challenge}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitResult}
        />
      )}
    </div>
  );
}
