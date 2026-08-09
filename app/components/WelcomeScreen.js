"use client";

import { useRouter } from "next/navigation";

function AthleteIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BusinessIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 21V8l8-4 8 4v13M4 21h16M9 21v-5h6v5M9 12h.01M15 12h.01M9 8h.01M15 8h.01"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ACCOUNT_TYPES = [
  {
    key: "athlete",
    title: "Athlete",
    description: "Track workouts, join challenges, and climb the leaderboard.",
    icon: <AthleteIcon />,
    href: "/signup/athlete",
  },
  {
    key: "business",
    title: "Business",
    description: "List your gym, run events, and reach competitive athletes.",
    icon: <BusinessIcon />,
    href: "/signup/business",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            RIVAL<span className="text-rival-red">.</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Train. Compete. Rival.</p>
        </div>

        <div className="mt-10 space-y-3">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Choose your account type
          </p>
          {ACCOUNT_TYPES.map((type) => (
            <button
              key={type.key}
              onClick={() => router.push(type.href)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 text-left transition hover:border-rival-red/60 hover:bg-surface-raised"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rival-red/15 text-rival-red">
                {type.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-white">{type.title}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{type.description}</span>
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-zinc-600">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} className="font-semibold text-rival-red hover:text-red-400">
            Log in
          </button>
        </p>
      </main>
    </div>
  );
}
